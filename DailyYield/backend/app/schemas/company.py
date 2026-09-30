from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel


class CompanyResponse(BaseModel):
    """Schema for returning company data."""

    id: str
    ticker: str
    name: str
    sector: Optional[str] = None
    industry: Optional[str] = None
    country: Optional[str] = None
    currency: str
    current_price: float
    pe_ratio: Optional[float] = None
    market_cap: Optional[int] = None
    volume: Optional[int] = None
    description: Optional[str] = None
    logo: Optional[str] = None
    rating: Optional[str] = None
    last_updated: datetime

    model_config = {"from_attributes": True}


class CompanyListResponse(BaseModel):
    """Paginated company list."""

    items: List[CompanyResponse]
    total: int
    page: int
    per_page: int


class SectorResponse(BaseModel):
    """Sector summary."""

    name: str
    count: int
    avg_change: float
