from typing import List, Optional

from pydantic import BaseModel

from app.schemas.holding import HoldingResponse


class PortfolioResponse(BaseModel):
    """Schema for returning portfolio data."""

    id: str
    user_id: str
    cash_balance: float
    invested_amount: float
    total_value: float
    holdings: List[HoldingResponse] = []

    model_config = {"from_attributes": True}
