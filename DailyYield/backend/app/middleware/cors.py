"""CORS configuration."""

from starlette.middleware.cors import CORSMiddleware

from app.config import get_settings

settings = get_settings()


def get_cors_middleware_args() -> dict:
    """Return keyword arguments for ``CORSMiddleware``."""
    return {
        "allow_origins": settings.CORS_ORIGINS,
        "allow_credentials": True,
        "allow_methods": ["*"],
        "allow_headers": ["*"],
        "expose_headers": ["X-Total-Count"],
    }
