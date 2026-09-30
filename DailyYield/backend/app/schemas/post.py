from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class PostCreate(BaseModel):
    """Schema for creating a community post."""

    content: str = Field(..., min_length=1, max_length=5000)
    post_type: str = Field(default="discussion", max_length=30)
    tags: Optional[str] = None


class PostResponse(BaseModel):
    """Schema for returning post data."""

    id: str
    author_id: str
    author_name: str = ""
    author_avatar: Optional[str] = None
    content: str
    post_type: str
    likes: int
    comments: int
    shares: int
    created_at: datetime
    tags: Optional[str] = None

    model_config = {"from_attributes": True}


class PostComment(BaseModel):
    """Schema for commenting on a post."""

    content: str = Field(..., min_length=1, max_length=2000)
