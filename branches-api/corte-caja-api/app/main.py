from dotenv import load_dotenv
load_dotenv()

import os
import logging
import logging.config

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware
from starlette.middleware.trustedhost import TrustedHostMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.infrastructure.db import Base, engine, get_db
from app.corte_caja.models import CorteCajaModel  # noqa: F401
from app.corte_caja.router import router as corte_caja_router

# ----------------------------------------------------
# LOGGING ESTRUCTURADO
# ----------------------------------------------------
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO").upper()

LOG_CONFIG = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "structured": {
            "format": (
                "time=%(asctime)s "
                "level=%(levelname)s "
                "logger=%(name)s "
                "message=\"%(message)s\" "
                "module=%(module)s "
                "func=%(funcName)s "
                "line=%(lineno)d"
            )
        }
    },
    "handlers": {
        "default": {
            "class": "logging.StreamHandler",
            "formatter": "structured",
        }
    },
    "root": {
        "handlers": ["default"],
        "level": LOG_LEVEL,
    },
}

logging.config.dictConfig(LOG_CONFIG)
logger = logging.getLogger("corte_caja_api")

# ----------------------------------------------------
# APP
# ----------------------------------------------------
app = FastAPI(title="Corte Caja API en capas")

# ----------------------------------------------------
# CORS
# ----------------------------------------------------
origins_str = os.getenv("FRONTEND_ORIGINS", "*")
if origins_str == "*":
    allow_origins = ["*"]
else:
    allow_origins = [o.strip() for o in origins_str.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------------------------------------
# HTTPS opcional
# ----------------------------------------------------
if os.getenv("FORCE_HTTPS", "0") == "1":
    app.add_middleware(HTTPSRedirectMiddleware)

# ----------------------------------------------------
# Trusted Hosts
# ----------------------------------------------------
allowed_hosts_str = os.getenv("ALLOWED_HOSTS", "*")
allowed_hosts = [h.strip() for h in allowed_hosts_str.split(",") if h.strip()]

if "*" not in allowed_hosts:
    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=allowed_hosts,
    )

# ----------------------------------------------------
# Middlewares de seguridad
# ----------------------------------------------------
@app.middleware("http")
async def security_headers_middleware(request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "geolocation=(), camera=(), microphone=()"
    return response

# ----------------------------------------------------
# Startup
# ----------------------------------------------------
@app.on_event("startup")
def on_startup():
    logger.info("Starting up Corte Caja API, creating tables if not exist")
    Base.metadata.create_all(bind=engine)
    logger.info("Startup complete")

# ----------------------------------------------------
# Health check
# ----------------------------------------------------
@app.get("/health", tags=["health"])
def health_check(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        db_status = "ok"
    except Exception as e:
        logger.exception("DB health check failed")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database not available",
        ) from e

    return {"status": "ok", "db": db_status}

# ----------------------------------------------------
# Routers
# ----------------------------------------------------
app.include_router(corte_caja_router)