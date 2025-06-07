import asyncio
from datetime import datetime, timezone
from typing import List, Optional
import uuid
from uuid_extensions import uuid7
from sqlalchemy.sql import func

import chainlit.data as cl_data

from langchain_postgres.vectorstores import Base
from sqlalchemy import (
    BigInteger,
    DateTime,
    String,
    Text,
    Boolean,
    UUID,
    JSON,
    ForeignKey,
    ARRAY,
    Integer,
    and_,
    select,
    FLOAT,
    delete,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship, validates

from chainlit.data.sql_alchemy import SQLAlchemyDataLayer

from settings import settings

import logging

logger = logging.getLogger(__name__)

SOURCE = "Converge"


# Our application does not need this but Chainlit needs it, so this is to satisfy Chainlit
class OldUser(Base):
    __tablename__ = "users"

    id: Mapped[UUID] = mapped_column(UUID, primary_key=True)
    identifier: Mapped[str] = mapped_column(Text, unique=True)
    cmetadata: Mapped[JSON] = mapped_column(
        "metadata", JSON
    )  # metadata is a reserved key word in SQLAlchemy Declarative API, alias naming is required
    createdAt: Mapped[Optional[str]] = mapped_column(Text)

    def __repr__(self) -> str:
        return (
            f"User("
            f"id={self.id!r}, "
            f"identifier={self.identifier!r}, "
            f"metadata={self.cmetadata!r}, "
            f"createdAt={self.createdAt!r})"
        )


class NewUser(Base):
    __tablename__ = "new_users"

    id: Mapped[UUID] = mapped_column(UUID, primary_key=True)
    email: Mapped[str] = mapped_column(Text, unique=True)
    created_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    file_new_user = relationship("FileNewUser", back_populates="new_user")

    @validates("email")
    def validate_email(self, key, value):
        """Ensure email is always stored in lowercase."""
        return value.lower() if value else value

    def __repr__(self) -> str:
        return (
            f"NewUser("
            f"id={self.id!r}, "
            f"email={self.email!r}, "
            f"createdAt={self.created_at!r}, "
            f"updatedAt={self.updated_at!r})"
        )


# Chainlit manage this model
class Thread(Base):
    __tablename__ = "threads"

    id: Mapped[UUID] = mapped_column(UUID, primary_key=True)
    name: Mapped[Optional[str]] = mapped_column(Text)
    userId: Mapped[Optional[UUID]] = mapped_column(ForeignKey("new_users.id"))
    userIdentifier: Mapped[Optional[str]] = mapped_column(Text)
    tags: Mapped[Optional[List[str]]] = mapped_column(ARRAY(Text))
    cmetadata: Mapped[JSON] = mapped_column(
        "metadata", JSON
    )  # metadata is a reserved key word in SQLAlchemy Declarative API, alias naming is required
    createdAt: Mapped[Optional[str]] = mapped_column(Text)

    def __repr__(self) -> str:
        return (
            f"Thread("
            f"id={self.id!r}, "
            f"name={self.name!r}, "
            f"userId={self.userId!r}, "
            f"userIdentifier={self.userIdentifier!r}, "
            f"tags={self.tags!r}, "
            f"metadata={self.cmetadata!r}, "
            f"createdAt={self.createdAt!r})"
        )


# Chainlit manage this model
class Step(Base):
    __tablename__ = "steps"

    id: Mapped[UUID] = mapped_column(UUID, primary_key=True)
    name: Mapped[str] = mapped_column(Text)
    type: Mapped[str] = mapped_column(Text)
    threadId: Mapped[UUID] = mapped_column(UUID)
    parentId: Mapped[Optional[UUID]] = mapped_column(UUID)
    disableFeedback: Mapped[bool] = mapped_column(Boolean)
    streaming: Mapped[bool] = mapped_column(Boolean)
    waitForAnswer: Mapped[Optional[bool]] = mapped_column(Boolean)
    isError: Mapped[Optional[bool]] = mapped_column(Boolean)
    cmetadata: Mapped[JSON] = mapped_column(
        "metadata", JSON
    )  # metadata is a reserved key word in SQLAlchemy Declarative API, alias naming is required
    tags: Mapped[Optional[List[str]]] = mapped_column(ARRAY(Text))
    input: Mapped[Optional[str]] = mapped_column(Text)
    output: Mapped[Optional[str]] = mapped_column(Text)
    createdAt: Mapped[Optional[str]] = mapped_column(Text)
    start: Mapped[Optional[str]] = mapped_column(Text)
    end: Mapped[Optional[str]] = mapped_column(Text)
    generation: Mapped[Optional[JSON]] = mapped_column(JSON)
    showInput: Mapped[Optional[str]] = mapped_column(Text)
    language: Mapped[Optional[str]] = mapped_column(Text)
    indent: Mapped[Optional[int]] = mapped_column(Integer)

    def __repr__(self) -> str:
        return (
            f"Step("
            f"id={self.id!r}, "
            f"name={self.name!r}, "
            f"type={self.type!r}, "
            f"threadId={self.threadId!r})"
            f"parentId={self.parentId!r})"
            f"disableFeedback={self.disableFeedback!r})"
            f"waitForAnswer={self.waitForAnswer!r})"
            f"isError={self.isError!r})"
            f"metadata={self.cmetadata!r})"
            f"tags={self.tags!r})"
            f"input={self.input!r})"
            f"output={self.output!r})"
            f"createdAt={self.createdAt!r})"
            f"start={self.start!r})"
            f"end={self.end!r})"
            f"generation={self.generation!r})"
            f"showInput={self.showInput!r})"
            f"language={self.language!r})"
            f"indent={self.indent!r})"
        )


# Chainlit manage this model
class Element(Base):
    __tablename__ = "elements"

    id: Mapped[UUID] = mapped_column(UUID, primary_key=True)
    threadId: Mapped[Optional[UUID]] = mapped_column(UUID)
    type: Mapped[Optional[str]] = mapped_column(Text)
    url: Mapped[Optional[str]] = mapped_column(Text)
    chainlitKey: Mapped[Optional[List[str]]] = mapped_column(Text)
    name: Mapped[str] = mapped_column(Text)
    display: Mapped[Optional[str]] = mapped_column(Text)
    objectKey: Mapped[Optional[str]] = mapped_column(Text)
    size: Mapped[Optional[str]] = mapped_column(Text)
    page: Mapped[Optional[str]] = mapped_column(Integer)
    language: Mapped[Optional[str]] = mapped_column(Text)
    forId: Mapped[Optional[str]] = mapped_column(UUID)
    mime: Mapped[Optional[str]] = mapped_column(Text)

    def __repr__(self) -> str:
        return (
            f"Element("
            f"id={self.id!r}, "
            f"threadId={self.threadId!r}, "
            f"type={self.type!r}, "
            f"url={self.url!r}, "
            f"chainlitKey={self.chainlitKey!r}, "
            f"name={self.name!r}, "
            f"display={self.display!r})"
            f"objectKey={self.objectKey!r})"
            f"size={self.size!r})"
            f"page={self.page!r})"
            f"language={self.language!r})"
            f"forId={self.forId!r})"
            f"mine={self.mine!r})"
        )


class File(Base):
    __tablename__ = "files"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid7()
    )
    name: Mapped[str] = mapped_column(Text)
    size: Mapped[Optional[BigInteger]] = mapped_column(BigInteger)
    mime_type: Mapped[Optional[str]] = mapped_column(Text, nullable=False)
    source: Mapped[str] = mapped_column(String(255))
    created_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    file_new_user = relationship("FileNewUser", back_populates="file")
    embeddings = relationship("Embeddings", back_populates="file")

    def __repr__(self) -> str:
        return (
            f"File("
            f"id={self.id!r}, "
            f"name={self.name!r}, "
            f"size={self.size!r}, "
            f"mimeType={self.mime_type!r}, "
            f"source={self.source!r}, "
            f"createdAt={self.created_at!r}, "
            f"updatedAt={self.updated_at!r})"
        )


class FileNewUser(Base):
    __tablename__ = "files_new_users"

    new_user_id: Mapped[UUID] = mapped_column(
        ForeignKey("new_users.id"), primary_key=True
    )
    file_id: Mapped[BigInteger] = mapped_column(
        ForeignKey("files.id"), primary_key=True
    )
    created_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    new_user = relationship("NewUser", back_populates="file_new_user")
    file = relationship("File", back_populates="file_new_user")

    def __repr__(self) -> str:
        return (
            f"FileNewUser("
            f"newUserId={self.new_user_id!r}, "
            f"fileId={self.file_id!r}, "
            f"createdAt={self.created_at!r}, "
            f"updatedAt={self.updated_at!r})"
        )


class Embeddings(Base):
    __tablename__ = "embeddings"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid7()
    )
    file_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("files.id"))
    embedding: Mapped[List[float]] = mapped_column(ARRAY(FLOAT))
    text: Mapped[str] = mapped_column(Text)
    created_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    file = relationship("File", back_populates="embeddings")

    def __repr__(self) -> str:
        return (
            f"Embeddings("
            f"id={self.id!r}, "
            f"fileId={self.file_id!r}, "
            f"embedding={self.embedding!r}, "
            f"text={self.text!r}, "
            f"createdAt={self.created_at!r}, "
            f"updatedAt={self.updated_at!r})"
        )


class Database:
    def __init__(self):
        cl_data._data_layer = SQLAlchemyDataLayer(
            conninfo=settings.pg_db_connection_string.get_secret_value(),
        )
        self.engine = cl_data._data_layer.engine
        self._async_session = cl_data._data_layer.async_session

        self.__post_init__()

    def __post_init__(self):
        asyncio.run(self.create_tables_if_not_exists())

    async def create_tables_if_not_exists(self):
        async with self.engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

    async def fetch_files(self, user_identifier: str) -> List[File]:
        async with self._async_session() as session:
            statement = (
                select(File)
                .join(FileNewUser, FileNewUser.file_id == File.id)
                .join(NewUser, FileNewUser.new_user_id == NewUser.id)
                .where(NewUser.email == user_identifier.lower())
            )
            result = await session.execute(statement)
            files = result.scalars().all()

        return files

    async def fetch_file_by_name_and_type(
        self, user_identifier: str, file_name: str, mime_type: str, source: str
    ) -> Optional[File]:

        async with self._async_session() as session:
            statement = (
                select(File)
                .join(FileNewUser, FileNewUser.file_id == File.id)
                .join(NewUser, FileNewUser.new_user_id == NewUser.id)
                .where(
                    NewUser.email == user_identifier.lower(),
                    File.name == file_name,
                    File.mime_type == mime_type,
                    File.source == source,
                )
            )
            result = await session.execute(statement)
            return result.scalars().first()

    async def save_file_with_embeddings(
        self,
        user_identifier: str,
        name: str,
        size: int,
        mime_type: str,
        source: str,
        embeddings: List[List[float]],
        text: str,
    ) -> Optional[File]:
        async with self._async_session() as session:
            async with session.begin():
                # Check if the file already exists
                existing_file = await self.fetch_file_by_name_and_type(
                    user_identifier=user_identifier,
                    file_name=name,
                    mime_type=mime_type,
                    source=source,
                )

                if existing_file:
                    existing_file.size = size
                    existing_file.updated_at = func.now()
                    session.add(existing_file)

                    await self._update_embeddings(
                        session, existing_file.id, embeddings, text
                    )
                    return existing_file

                # If the file does not exist, create a new one
                file_result = await self._create_file(
                    session=session,
                    user_identifier=user_identifier,
                    name=name,
                    size=size,
                    mime_type=mime_type,
                    source=source,
                )

                if file_result is None:
                    return None

                success = await self._create_embeddings(
                    session=session,
                    file_id=file_result.id,
                    embeddings=embeddings,
                    text=text,
                )

                if not success:
                    return None

                return file_result

    async def _create_file(
        self,
        session,
        name: str,
        size: int,
        mime_type: str,
        source: str,
        user_identifier: str,
    ) -> Optional[File]:
        # Query to get the user ID
        result = await session.execute(
            select(NewUser.id).where(NewUser.email == user_identifier.lower())
        )
        user_id = result.scalar()

        if user_id is None:
            return None

        file_id = uuid7()
        file = File(
            id=file_id,
            name=name,
            size=size,
            mime_type=mime_type,
            source=source,
        )

        file_new_user = FileNewUser(
            new_user_id=user_id,
            file_id=file_id,
        )
        session.add(file)
        session.add(file_new_user)

        return file

    async def _create_embeddings(
        self,
        session,
        file_id: uuid.UUID,
        embeddings: List[List[float]],
        text: str,
    ):
        session.add_all(
            [
                Embeddings(
                    id=uuid7(),
                    file_id=file_id,
                    embedding=embedding,
                    text=text,
                )
                for embedding in embeddings
            ]
        )

        return True

    async def _update_embeddings(
        self,
        session,
        file_id: uuid.UUID,
        embeddings: List[List[float]],
        text: str,
    ):
        await session.execute(delete(Embeddings).where(Embeddings.file_id == file_id))

        session.add_all(
            [
                Embeddings(
                    id=uuid7(),
                    file_id=file_id,
                    embedding=embedding,
                    text=text,
                )
                for embedding in embeddings
            ]
        )

        return True

    async def delete_file(self, user_identifier: str, file_id: uuid.UUID) -> bool:
        async with self._async_session() as session:
            delete_association = (
                delete(FileNewUser)
                .where(FileNewUser.file_id == file_id)
                .where(
                    FileNewUser.new_user_id
                    == select(NewUser.id)
                    .where(NewUser.email == user_identifier.lower())
                    .scalar_subquery()
                )
            )
            result = await session.execute(delete_association)

            if result.rowcount == 0:
                return False

            delete_file = delete(File).where(File.id == file_id)
            await session.execute(delete_file)

            await session.commit()
            return True
