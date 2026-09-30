"""Daily Yield – FastAPI application entry point."""

import asyncio
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.database import init_db
from app.middleware.cors import get_cors_middleware_args
from app.services.market_service import seed_companies

settings = get_settings()

logging.basicConfig(level=logging.DEBUG if settings.DEBUG else logging.INFO)
logger = logging.getLogger(__name__)

_ws_task = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup / shutdown lifecycle for the FastAPI application."""
    global _ws_task

    logger.info("Starting %s v%s", settings.APP_NAME, settings.APP_VERSION)

    # Create tables and seed data
    init_db()
    from app.database import SessionLocal
    db = SessionLocal()
    try:
        seed_companies(db)
    finally:
        db.close()

    # Start background WebSocket broadcaster
    from app.api.ws import broadcast_market_data
    _ws_task = asyncio.create_task(broadcast_market_data())

    yield

    # Shutdown
    if _ws_task:
        _ws_task.cancel()
        try:
            await _ws_task
        except asyncio.CancelledError:
            pass
    logger.info("Shutting down %s", settings.APP_NAME)


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="REST API for the Daily Yield financial news and investment platform.",
    lifespan=lifespan,
)

# CORS
app.add_middleware(CORSMiddleware, **get_cors_middleware_args())

# ── Register routers ──────────────────────────────────────────────
from app.api.auth import router as auth_router
from app.api.news import router as news_router
from app.api.companies import router as companies_router
from app.api.investment import router as investment_router
from app.api.posts import router as posts_router
from app.api.notifications import router as notifications_router
from app.api.search import router as search_router
from app.api.ws import router as ws_router

app.include_router(auth_router)
app.include_router(news_router)
app.include_router(companies_router)
app.include_router(investment_router)
app.include_router(posts_router)
app.include_router(notifications_router)
app.include_router(search_router)
    # Serve static files for vanilla frontend
    from fastapi.staticfiles import StaticFiles
    # Assuming the vanilla assets are located at ../frontend-vanilla/static relative to backend/app
    app.mount("/static", StaticFiles(directory="../frontend-vanilla/static"), name="static")


@app.get("/", tags=["root"])
def root() -> dict:
    """Health-check / root endpoint."""
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "running",
    }


@app.get("/api/health", tags=["root"])
def health() -> dict:
    """Simple health-check endpoint for load balancers."""
    return {"status": "healthy"}
