from pydantic import BaseModel
from typing import List

class QuestionRequest(BaseModel):
    prompt: str
    document_ids: List[str]

class QAResponse(BaseModel):
    id: str
    answer: str
    confidence: float
    sources: List[str]
    upvotes: int = 0
    downvotes: int = 0