from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class TransactionCreate(BaseModel):
    """Schema for creating a buy/sell transaction."""

    company_id: str
    quantity: int = Field(..., ge=1)


class TransactionResponse(BaseModel):
    """Schema for returning transaction data."""

    id: str
    portfolio_id: str
    company_id: str
    type: str
    quantity: int
    price: float
    total: float
    timestamp: datetime
    status: str
    company_ticker: Optional[str] = None
    company_name: Optional[str] = None

    model_config = {"from_attributes": True}
