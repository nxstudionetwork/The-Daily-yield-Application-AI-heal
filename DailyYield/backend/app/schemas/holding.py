from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class HoldingResponse(BaseModel):
    """Schema for returning holding data."""

    id: str
    portfolio_id: str
    company_id: str
    quantity: int
    avg_price: float
    current_price: float
    company_ticker: Optional[str] = None
    company_name: Optional[str] = None
    pnl: float = 0.0
    pnl_percent: float = 0.0

    model_config = {"from_attributes": True}
