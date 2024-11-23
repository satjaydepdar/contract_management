from llama_index import Document, VectorStoreIndex
from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import datetime
import uuid

class DocumentProcessor:
    async def process_document(
        self,
        content: bytes,
        filename: str,
        content_type: str,
        db: AsyncIOMotorDatabase
    ) -> str:
        # Generate unique ID for the document
        doc_id = str(uuid.uuid4())

        # Create document metadata
        metadata = {
            "filename": filename,
            "content_type": content_type,
            "upload_date": datetime.utcnow(),
            "doc_id": doc_id
        }

        # Process document content
        text_content = content.decode('utf-8')
        document = Document(text=text_content, metadata=metadata)

        # Create vector store index
        index = VectorStoreIndex.from_documents([document])

        # Store document metadata in MongoDB
        await db.documents.insert_one({
            "_id": doc_id,
            **metadata,
            "vector_store_id": index.index_id
        })

        return doc_id