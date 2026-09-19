from pydantic_settings import BaseSettings, SettingsConfigDict
import os

class Settings(BaseSettings):
    APP_NAME: str = "OAIAW"
    APP_ENV: str = "development"
    APP_DEBUG: bool = True

    BACKEND_HOST: str = "127.0.0.1"
    BACKEND_PORT: int = 8000

    FRONTEND_URL: str = "http://localhost:3000"

    DATABASE_URL: str = "postgresql+psycopg://postgres:Dinesh30112006@localhost:5432/oaiaw"

    JWT_SECRET: str = "CHANGE_ME"
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    LLM_PROVIDER: str = "groq"
    LLM_API_KEY: str = ""
    LLM_MODEL: str = ""

    CORS_ORIGINS: str = "http://localhost:3000"

    ASSESSMENT_DEFAULT_DURATION_MINUTES: int = 60
    ASSESSMENT_MAX_DURATION_MINUTES: int = 180

    SANDBOX_ENABLED: bool = True
    SANDBOX_NETWORK_ENABLED: bool = False
    SANDBOX_CPU_LIMIT: int = 2
    SANDBOX_MEMORY_LIMIT_MB: int = 1024
    SANDBOX_TIMEOUT_SECONDS: int = 30

    AI_MAX_CONTEXT_FILES: int = 20
    AI_MAX_FILE_SIZE_KB: int = 500
    AI_MAX_SEARCH_RESULTS: int = 50
    AI_MAX_CONTEXT_TOKENS: int = 16000

    LOG_LEVEL: str = "INFO"

    model_config = SettingsConfigDict(
        env_file=".env" if os.path.exists(".env") else "../.env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore"
    )

settings = Settings()
