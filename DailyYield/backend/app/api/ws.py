"""WebSocket endpoint for real-time market data."""

import asyncio
import json
import logging
from typing import Set

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.database import SessionLocal
from app.services.market_service import get_market_snapshot

logger = logging.getLogger(__name__)
router = APIRouter(tags=["websocket"])

connected_clients: Set[WebSocket] = set()


async def broadcast_market_data() -> None:
    """Periodically push market snapshots to all connected WebSocket clients."""
    while True:
        if connected_clients:
            db = SessionLocal()
            try:
                snapshot = get_market_snapshot(db)
                message = json.dumps({"type": "market_update", "data": snapshot})
                stale: list[WebSocket] = []
                for ws in connected_clients:
                    try:
                        await ws.send_text(message)
                    except Exception:
                        stale.append(ws)
                for ws in stale:
                    connected_clients.discard(ws)
            except Exception:
                logger.exception("Error broadcasting market data")
            finally:
                db.close()
        await asyncio.sleep(5)


@router.websocket("/ws/market-data")
async def market_data_ws(websocket: WebSocket) -> None:
    """WebSocket endpoint that streams real-time price updates.

    Clients receive JSON messages of the form::

        {"type": "market_update", "data": [{"ticker": "AAPL", ...}, ...]}
    """
    await websocket.accept()
    connected_clients.add(websocket)
    logger.info("WebSocket client connected (%d total)", len(connected_clients))
    try:
        while True:
            # Keep the connection alive; also echo client messages as pong
            data = await websocket.receive_text()
            if data == "ping":
                await websocket.send_text(json.dumps({"type": "pong"}))
    except WebSocketDisconnect:
        connected_clients.discard(websocket)
        logger.info("WebSocket client disconnected (%d total)", len(connected_clients))
