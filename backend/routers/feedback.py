from fastapi import APIRouter, HTTPException, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from database import get_database
from models.feedback import FeedbackRequest, FeedbackResponse
from services.feedback_service import FeedbackService

router = APIRouter()
feedback_service = FeedbackService()

@router.post("", response_model=FeedbackResponse)
async def submit_feedback(
    request: FeedbackRequest,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    try:
        response = await feedback_service.store_feedback(
            request.answer_id,
            request.feedback_type,
            db
        )
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))