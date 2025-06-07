import os
import tempfile
from typing import Annotated, Union
import uuid

import chainlit as cl
import requests

from fastapi import APIRouter, HTTPException, UploadFile, status, Depends
from chainlit.auth import authenticate_user
from chainlit.context import init_http_context
from chainlit.server import app
from chainlit.logger import logger
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import (
    AzureAIDocumentIntelligenceLoader,
    TextLoader,
)
from langchain_openai import OpenAIEmbeddings
from langchain_postgres import PGVector

from database import Database
from settings import settings

MAX_FILE_SIZE = 30 * 1024 * 1024  # 30MB in bytes
FILE_DELIMITER = "/"
SUPPORTED_CONTENT_TYPES = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",  # DOCX
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",  # XLSX
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",  # PPTX
    "text/plain",
]

database = Database()
router = APIRouter()
SOURCE = "Converge"


@router.get("/api/files")
async def files(
    current_user: Annotated[Union[cl.User], Depends(authenticate_user)],
):
    try:
        init_http_context(user=current_user)

        files = await database.fetch_files(current_user.identifier)
        files_list = [
            {
                "id": file.id,
                "name": file.name,
                "size": file.size,
                "created_at": file.created_at,
                "updated_at": file.updated_at,
                "source": file.source,
            }
            for file in files
        ]

        return files_list

    except Exception as e:
        logger.error(f"Error fetching files: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.post("/api/files", status_code=status.HTTP_201_CREATED)
async def upload(
    current_user: Annotated[Union[cl.User], Depends(authenticate_user)],
    file: UploadFile,
):
    if file.size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413, detail="Payload too large. File size exceeds 30MB limit."
        )

    if file.content_type not in SUPPORTED_CONTENT_TYPES:
        raise HTTPException(status_code=422, detail="Unsupported file type.")

    logger.info(f"Uploaded file: {file}")
    init_http_context(user=current_user)
    user_identifier = current_user.identifier

    try:
        with tempfile.TemporaryDirectory() as temp_dir:
            file_path = os.path.join(temp_dir, file.filename)

            with open(file_path, "wb") as buffer:
                content = await file.read()
                buffer.write(content)

            existing_file = await database.fetch_file_by_name_and_type(
                user_identifier=user_identifier,
                file_name=file.filename,
                mime_type=file.content_type,
                source=SOURCE,
            )

            await handle_file_upload(existing_file, user_identifier, file, file_path)

    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=422, detail="Unable to upload file.")


async def handle_file_upload(existing_file, user_identifier, file, file_path):
    # Scan for virus
    if settings.clam_av_scan:
        response = requests.post(
            settings.clam_av_scan_url, files=[("FILES", open(file_path, "rb"))]
        )
        if response.status_code != 200:
            raise HTTPException(
                status_code=422, detail="Unable to scan file for virus."
            )
        response_json = response.json()
        if response_json["success"]:
            for data in response_json["data"]["result"]:
                if data["is_infected"]:
                    raise HTTPException(status_code=422, detail="File is infected.")

    # Upload to S3 - no use case for now
    # s3 = boto3.client("s3")
    # s3.upload_fileobj(
    #     open(file_path, "rb"),
    #     settings.s3_uploads_bucket,
    #     user_identifier + FILE_DELIMITER + file.filename,
    # )

    # Load documents
    if file.content_type == "text/plain":
        loader = TextLoader(file_path=file_path)
    else:
        loader = AzureAIDocumentIntelligenceLoader(
            file_path=file_path,
            api_key=settings.azure_doc_api_key.get_secret_value(),
            api_endpoint=settings.azure_doc_api_endpoint.unicode_string(),
            api_model=settings.azure_doc_api_model,
            api_version=settings.azure_doc_api_version,
        )

    documents = loader.load_and_split(
        RecursiveCharacterTextSplitter(chunk_size=4000, chunk_overlap=400)
    )

    metadatas = [{"name": file.filename} for _ in documents]
    texts = [doc.page_content for doc in documents]

    pgvector = PGVector(
        connection=database.engine,
        embeddings=OpenAIEmbeddings(),
        collection_name=user_identifier,
    )

    embeddings = pgvector.embedding_function.embed_documents(texts)

    if not embeddings:
        raise ValueError("No embeddings generated")

    await database.save_file_with_embeddings(
        user_identifier=user_identifier,
        name=file.filename,
        size=file.size,
        mime_type=file.content_type,
        source=SOURCE,
        embeddings=embeddings,
        text="\n".join(texts),
    )

    if existing_file is None and not settings.converge_api_enabled:
        embedding_uuids = await pgvector.aadd_texts(texts, metadatas)
        if embedding_uuids is None:
            raise HTTPException(status_code=422, detail="No embedding created.")


@router.delete("/api/files/{file_id}", status_code=status.HTTP_200_OK)
async def delete_file(
    file_id: uuid.UUID,
    current_user: Annotated[Union[cl.User], Depends(authenticate_user)],
):
    init_http_context(user=current_user)
    user_identifier = current_user.identifier

    success = await database.delete_file(user_identifier, file_id)
    if not success:
        raise HTTPException(
            status_code=404,
            detail="File not found",
        )
