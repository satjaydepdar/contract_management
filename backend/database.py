from motor.motor_asyncio import AsyncIOMotorClient
from config import get_settings

class Database:
    client: AsyncIOMotorClient = None

async def get_database() -> AsyncIOMotorClient:
    settings = get_settings()
    return AsyncIOMotorClient(settings.mongodb_url)[settings.mongodb_db_name]

async def connect_to_mongo():
    settings = get_settings()
    Database.client = AsyncIOMotorClient(settings.mongodb_url)

async def close_mongo_connection():
    Database.client.close()