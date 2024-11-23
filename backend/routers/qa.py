from fastapi import APIRouter, HTTPException, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from database import get_database
from services.qa_service import QAService
from models.qa import QuestionRequest, QAResponse

router = APIRouter()
qa_service = QAService()

@router.post("/query", response_model=QAResponse)
async def query_documents(
    request: QuestionRequest,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    try:
        response = await qa_service.get_answer(
            request.prompt,
            request.document_ids,
            db
        )
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))