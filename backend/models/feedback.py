from pydantic import BaseModel
from typing import Literal

class FeedbackRequest(BaseModel):
    answer_id: str
    feedback_type: Literal['up', 'down']

class FeedbackResponse(BaseModel):
    success: bool
    message: str
    updated_counts: dict[str, int]