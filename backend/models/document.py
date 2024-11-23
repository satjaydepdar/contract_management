from pydantic import BaseModel
from typing import List, Optional

class DocumentResponse(BaseModel):
    success: bool
    message: str
    vector_ids: Optional[List[str]] = None