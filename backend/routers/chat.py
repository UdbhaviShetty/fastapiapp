from fastapi import APIRouter, HTTPException

from schemas.chat import ChatRequest, ChatResponse

try:
    from services.langchain_service import get_ai_response
    _chat_import_error = None
except ImportError as error:
    get_ai_response = None
    _chat_import_error = error


router = APIRouter(
    prefix="/chat",
    tags=["chat"]
)


@router.post("/", response_model=ChatResponse)
def chat(request: ChatRequest):
    if get_ai_response is None:
        raise HTTPException(
            status_code=503,
            detail=f"Chat service unavailable: {_chat_import_error}"
        )

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
