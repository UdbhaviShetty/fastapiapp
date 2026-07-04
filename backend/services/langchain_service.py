import os

from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnableWithMessageHistory
from langchain_community.chat_message_histories import ChatMessageHistory

load_dotenv()

API_KEY = os.getenv("GROQ_API_KEY")

LLAMA_MODEL = "llama-3.3-70b-versatile"

llm = ChatGroq(
    model=LLAMA_MODEL,
    groq_api_key=API_KEY
)


prompt_with_memory = ChatPromptTemplate.from_messages([
    (
        "system",
        """
        You are TalentSpark AI Assistant.

        Your role is to help users with:
        - job search
        - career guidance
        - skill improvement
        - interview preparation
        - resume guidance
        - company information

        Give clear, simple and helpful answers.
        """
    ),
    ("placeholder", "{chat_history}"),
    ("human", "{user_query}")
])


chain_with_memory = prompt_with_memory | llm


store = {}


def get_history(session_id: str):
    if session_id not in store:
        store[session_id] = ChatMessageHistory()

    return store[session_id]


chat_chain = RunnableWithMessageHistory(
    runnable=chain_with_memory,
    get_session_history=get_history,
    input_messages_key="user_query",
    history_messages_key="chat_history"
)


def get_ai_response(user_query: str, session_id: str):
    response = chat_chain.invoke(
        {
            "user_query": user_query
        },
        config={
            "configurable": {
                "session_id": session_id
            }
        }
    )

    return response.content