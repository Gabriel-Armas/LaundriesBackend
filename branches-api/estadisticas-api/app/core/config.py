from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    ORDENES_API_BASE_URL: str
    SUCURSALES_API_BASE_URL: str
    EMPLEADOS_API_BASE_URL: str

    JWT_SECRET: str
    JWT_ALGORITHM: str = "HS256"

    LOG_LEVEL: str = "INFO"

    model_config = {
        "env_file": ".env",
        "extra": "ignore"
    }

settings = Settings()