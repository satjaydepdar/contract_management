from llama_index import VectorStoreIndex, StorageContext
from motor.motor_asyncio import AsyncIOMotorDatabase
import uuid

class QAService:
    async def get_answer(
        self,
        prompt: str,
        document_ids: list[str],
        db: AsyncIOMotorDatabase
    ):
        # Retrieve documents from MongoDB
        documents = await db.documents.find({
            "_id": {"$in": document_ids}
        }).to_list(None)

        # Load vector store indices
        indices = [
            VectorStoreIndex.load(
                doc["vector_store_id"],
                storage_context=StorageContext.from_defaults()
            )
            for doc in documents
        ]

        # Create query engine
        query_engine = indices[0].as_query_engine()
        for idx in indices[1:]:
            query_engine = query_engine.combine(idx.as_query_engine())

        # Get response
        response = query_engine.query(prompt)

        # Create answer record
        answer_id = str(uuid.uuid4())
        answer_record = {
            "_id": answer_id,
            "prompt": prompt,
            "answer": response.response,
            "sources": response.source_nodes,
            "confidence": response.confidence,
            "document_ids": document_ids,
            "upvotes": 0,
            "downvotes": 0
        }

        # Store answer in MongoDB
        await db.answers.insert_one(answer_record)

        return {
            "id": answer_id,
            "answer": response.response,
            "confidence": response.confidence,
            "sources": [node.node.text[:100] + "..." for node in response.source_nodes],
            "upvotes": 0,
            "downvotes": 0
        }