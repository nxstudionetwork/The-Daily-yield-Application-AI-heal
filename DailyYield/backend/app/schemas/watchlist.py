from datetime import datetime

from pydantic import BaseModel


class WatchlistAdd(BaseModel):
    """Schema for adding a company to watchlist."""

    company_id: str


class WatchlistResponse(BaseModel):
    """Schema for returning watchlist entry."""

    id: str
    user_id: str
    company_id: str
    company_ticker: str = ""
    company_name: str = ""
    company_price: float = 0.0
    added_at: datetime

    model_config = {"from_attributes": True}
