from fastapi import APIRouter, HTTPException

from schemas.chat import ChatRequest, ChatResponse
from services.langchain_services import get_ai_response


router = APIRouter(
    prefix="/chat",
    tags=["chat"]
)


@router.post("/", response_model=ChatResponse)
def chat(request: ChatRequest):
    try:
        ai_response = get_ai_response(
            user_query=request.message,
            session_id=request.session_id
        )

        return ChatResponse(
            response=ai_response
        )

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error)
        )