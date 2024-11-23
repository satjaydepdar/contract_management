from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId

class FeedbackService:
    async def store_feedback(
        self,
        answer_id: str,
        feedback_type: str,
        db: AsyncIOMotorDatabase
    ):
        # Update vote counts
        update_field = "upvotes" if feedback_type == "up" else "downvotes"
        result = await db.answers.find_one_and_update(
            {"_id": answer_id},
            {"$inc": {update_field: 1}},
            return_document=True
        )

        if not result:
            raise ValueError("Answer not found")

        return {
            "success": True,
            "message": "Feedback recorded successfully",
            "updated_counts": {
                "upvotes": result["upvotes"],
                "downvotes": result["downvotes"]
            }
        }