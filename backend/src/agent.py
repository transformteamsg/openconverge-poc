from langchain.agents import AgentExecutor, create_openai_tools_agent
from langchain.memory.chat_memory import BaseChatMemory
from langchain_core.prompts import (
    ChatPromptTemplate,
    SystemMessagePromptTemplate,
    MessagesPlaceholder,
    HumanMessagePromptTemplate,
)
from langchain_core.retrievers import BaseRetriever
from langchain_core.tools import create_retriever_tool
from langchain_openai import ChatOpenAI


def create_agent(
    memory: BaseChatMemory, retriever: BaseRetriever, llm_name: str
) -> AgentExecutor:
    retriever_tool = create_retriever_tool(
        retriever=retriever,
        name="pgvector_retriever",
        description="Search and return relevant information about the given retriever",
    )

    prompt = ChatPromptTemplate.from_messages(
        messages=[
            SystemMessagePromptTemplate.from_template("You are a helpful assistant."),
            MessagesPlaceholder(optional=True, variable_name="chat_history"),
            MessagesPlaceholder(optional=False, variable_name="agent_scratchpad"),
            HumanMessagePromptTemplate.from_template(
                "Provide an answer related to the given documents only for this question: {input}."
            ),
        ]
    )

    agent = create_openai_tools_agent(
        llm=ChatOpenAI(model_name=llm_name, temperature=0, streaming=True),
        tools=[retriever_tool],
        prompt=prompt,
    )

    return AgentExecutor(
        agent=agent,
        tools=[retriever_tool],
        verbose=True,
        handle_parsing_errors=True,
        return_intermediate_steps=True,
        memory=memory,
    )
