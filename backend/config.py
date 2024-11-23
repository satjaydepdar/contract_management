from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    # MongoDB Settings
    mongodb_url: str
    mongodb_db_name: str

    # Azure Storage Settings
    azure_storage_connection_string: str
    azure_storage_container: str

    # Vector Database Settings
    vector_db_host: str
    vector_db_port: int
    vector_db_api_key: str

    # JWT Settings
    jwt_secret_key: str
    jwt_algorithm: str
    access_token_expire_minutes: int

    # API Settings
    api_v1_prefix: str
    debug: bool
    environment: str

    class Config:
        env_file = ".env"
        case_sensitive = False

@lru_cache()
def get_settings() -> Settings:
    return Settings()