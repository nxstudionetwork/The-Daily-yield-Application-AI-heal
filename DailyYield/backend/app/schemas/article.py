from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field


class ArticleCreate(BaseModel):
    """Schema for creating an article."""

    title: str = Field(..., min_length=5, max_length=500)
    subtitle: Optional[str] = Field(None, max_length=500)
    summary: Optional[str] = None
    content: str = Field(..., min_length=10)
    category: str = Field(..., min_length=2, max_length=100)
    publisher: Optional[str] = Field(None, max_length=200)
    tags: Optional[str] = None
    is_breaking: bool = False
    is_featured: bool = False
    image_url: Optional[str] = None
    reading_time: int = Field(default=5, ge=1, le=120)


class ArticleResponse(BaseModel):
    """Schema for returning article data."""

    id: str
    title: str
    subtitle: Optional[str] = None
    summary: Optional[str] = None
    content: str
    category: str
    author_id: Optional[str] = None
    publisher: Optional[str] = None
    publish_date: datetime
    views: int
    likes: int
    comments: int
    tags: Optional[str] = None
    is_breaking: bool
    is_featured: bool
    image_url: Optional[str] = None
    reading_time: int

    model_config = {"from_attributes": True}


class ArticleListResponse(BaseModel):
    """Paginated article list."""

    items: List[ArticleResponse]
    total: int
    page: int
    per_page: int
