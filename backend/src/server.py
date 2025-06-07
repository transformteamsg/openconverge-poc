import string
from typing import Optional
import uuid

import chainlit as cl
import chainlit.secret

from chainlit.auth import authenticate_user
from chainlit.context import init_http_context
from chainlit.logger import logger
from chainlit.server import app
from fastapi.middleware.cors import CORSMiddleware
from fastapi.routing import APIRoute
import httpx
from langchain.memory import ConversationBufferWindowMemory
from langchain_core.runnables import RunnableConfig
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain.chains import create_citation_fuzzy_match_chain
from langchain_postgres import PGVector

from agent import create_agent
from database import Database
from settings import settings
from api import router


# Middleware to handle CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

FILE_DELIMITER = "/"
SUPPORTED_CONTENT_TYPES = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",  # DOCX
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",  # XLSX
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",  # PPTX
    "text/plain",
]

database = Database()

# We have to do this because of special characters in the OAuth /authorize step trips up AWS Cognito. So we are monkey-patching out this character.
# FIXME: Remove this monkeypatch once chainlit fixes it
chainlit.secret.chars = string.ascii_letters + string.digits


async def create_conversation() -> dict:
    """
    Creates a new conversation and returns the result.
    """
    url = f"{settings.converge_api_url}conversations"
    data = {
        "email": cl.user_session.get("user").identifier,
    }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=data)
            response.raise_for_status()
            return response.json()
    except httpx.HTTPStatusError as e:
        raise Exception(f"Failed to create conversation: {e.response.text}")
    except httpx.RequestError as e:
        raise Exception(f"An error occurred while requesting {e.request.url!r}.")


@cl.on_chat_start
async def on_chat_start() -> None:
    """
    Handles the chat start event and initializes conversation or memory.
    """
    if settings.converge_api_enabled:
        try:
            result = await create_conversation()
            logger.info("Conversation created: %s", result)
            cl.user_session.set("conversation_id", result["id"])
        except Exception as e:
            logger.error(f"Error creating conversation: {e}")
    else:
        initialize_memory_and_agent()


def initialize_memory_and_agent() -> None:
    """
    Initializes memory and agent for the chat session.
    """
    memory = ConversationBufferWindowMemory(
        memory_key="chat_history",
        input_key="input",
        output_key="output",
        return_messages=True,
        k=settings.num_of_messages_in_memory,
    )

    vector_store = PGVector(
        connection=database.engine,
        embeddings=OpenAIEmbeddings(),
        collection_name=cl.user_session.get("user").identifier,
    )

    retriever = vector_store.as_retriever(search_kwargs={"k": 5})
    cl.user_session.set("retriever", retriever)

    agent = create_agent(
        llm_name=settings.openai_chat_model,
        retriever=retriever,
        memory=memory,
    )

    cl.user_session.set("agent", agent)
    logger.info("Chat has started!")


async def extract_context(question: str) -> str:
    """
    Extracts context from the retriever based on the question provided.
    """
    retriever = cl.user_session.get("retriever")
    search_results = await retriever.aget_relevant_documents(question)

    context = "\n\n".join(
        f"{result.page_content}\n(Source: {result.metadata.get('name', 'unknown')})"
        for result in search_results
    )

    return context


async def run_with_custom_prompt(question: str) -> str:
    """
    Runs the provided question with a custom prompt and returns the result.
    """
    context = await extract_context(question)

    # Initialize the LLM and citation chain
    llm = ChatOpenAI(temperature=0, model=settings.openai_chat_model)
    chain = create_citation_fuzzy_match_chain(llm)

    # Run the chain with the input
    result = chain.run(question=question, context=context)

    custom_result = (f"""{result}
You are a productivity assistant with two capabilities:

Capability 1) Searching documents/files and answering questions.
- You can respond with answers only when a relevant question is asked,
and only when you have access to the specific documents or files.
- If the question is not relevant, or you do not have such access,
you must not tell users the given format, you must not provide any answers,
and you must only respond with your capabilities.
- Else, make sure to be accurate and not too concise,
use prose and bullets where appropriate,
and format your response in the order of 3 sections with bold headers:
1) Fact(s)
2) Chunk(s) used to answer the question (include the page/section/FAQ headers if any)
3) Source(s) - for this section, make sure to cite the file name

Capability 2) Referencing speech writing guidelines to write speeches.
- You must reference relevant speech writing documents/files.
- Format your response in the order of 3 sections with bold headers:
1) Speech - for this section, make sure to group similar points into paragraphs, and keep each paragraph as a numbered point
2) Chunk(s) used to write the speech (include the page/section/FAQ headers if any)
3) Source(s) - for this section, make sure to cite the file name

You are to only use one capability at any one time.
You are allowed to respond to follow up questions.

{context}""")

    return custom_result


async def create_message(conversation_id: str, content: str) -> str:
    """
    Creates a message in the conversation and returns the message content.
    """
    url = f"{settings.converge_api_url}messages"
    data = {
        "conversationId": conversation_id,
        "content": content,
    }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=data, timeout=120.0)
            response.raise_for_status()
            result = response.json()
            logger.info("Message created: %s", result)
            return result["message"]
    except httpx.HTTPStatusError as e:
        raise Exception(f"Failed to create message: {e.response.text}")
    except httpx.RequestError as e:
        raise Exception(f"An error occurred while requesting {e.request.url!r}.")


@cl.on_message
async def main(message: cl.Message) -> None:
    """
    Handles incoming messages and processes them according to the chat settings.
    """
    if settings.converge_api_enabled:
        await handle_converge_message(message)
    else:
        await handle_standard_message(message)

    logger.info("Response sent to user!")


async def handle_converge_message(message: cl.Message) -> None:
    """
    Handles messages when the converge API is enabled.
    """
    try:
        result = await create_message(cl.user_session.get("conversation_id"), message.content)
        await cl.Message(content=result).send()
    except Exception as e:
        logger.error(f"Error creating message: {e}")
        await cl.Message(content="There was an issue sending/answering your query, please try again.").send()


async def handle_standard_message(message: cl.Message) -> None:
    """
    Handles messages when the standard chat flow is in use.
    """
    cb = cl.AsyncLangchainCallbackHandler(
        stream_final_answer=True, force_stream_final_answer=True
    )
    agent = cl.user_session.get("agent")
    agent_config = RunnableConfig(callbacks=[cb])

    result = await run_with_custom_prompt(message.content)

    # Ensure result is a string
    if not isinstance(result, str):
        result = str(result)

    # Send the result back to the user
    await agent.ainvoke(
        input={"input": result},
        config=agent_config,
    )


def create_user(user_email: str) -> dict:
    """
    Creates a user with the provided email and returns the result.
    """
    url = f"{settings.converge_api_url}users"
    data = {
        "email": user_email,
    }

    try:
        with httpx.Client() as client:
            response = client.post(url, json=data)
            response.raise_for_status()
            return response.json()
    except httpx.HTTPStatusError as e:
        raise Exception(f"Failed to create user: {e.response.text}")
    except httpx.RequestError as e:
        raise Exception(f"An error occurred while requesting {e.request.url!r}.")


@cl.oauth_callback
def oauth_callback(
    provider_id: str,
    token: str,
    raw_user_data: dict[str, str],
    default_user: cl.User,
) -> Optional[cl.User]:
    """
    Handles the OAuth callback and creates a user if needed.
    """
    if settings.converge_api_enabled:
        try:
            result = create_user(raw_user_data["email"])
            logger.info("User created: %s", result)
        except Exception as e:
            # TODO: To handle more specific API response from Converge API. Temporary changed to logger.info instead of error to avoid confusion.
            logger.info(f"User exists: {e}")

    return default_user
