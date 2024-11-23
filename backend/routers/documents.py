from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from typing import List
from motor.motor_asyncio import AsyncIOMotorDatabase
from database import get_database
from services.document_processor import DocumentProcessor
from models.document import DocumentResponse

router = APIRouter()
document_processor = DocumentProcessor()

@router.post("/process", response_model=DocumentResponse)
async def process_documents(
    files: List[UploadFile] = File(...),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    try:
        # Process and store documents
        vector_ids = []
        for file in files:
            content = await file.read()
            doc_id = await document_processor.process_document(
                content,
                file.filename,
                file.content_type,
                db
            )
            vector_ids.append(doc_id)

        return DocumentResponse(
            success=True,
            message=f"Successfully processed {len(files)} documents",
            vector_ids=vector_ids
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))