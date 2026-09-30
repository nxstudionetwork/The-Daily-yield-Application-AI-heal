from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field


class UserCreate(BaseModel):
    """Schema for user registration."""

    email: EmailStr
    name: str = Field(..., min_length=2, max_length=150)
    password: str = Field(..., min_length=8, max_length=128)
    mobile: Optional[str] = Field(None, max_length=20)
    country: Optional[str] = Field(None, max_length=100)


class UserLogin(BaseModel):
    """Schema for user login."""

    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    """Schema for updating user profile."""

    name: Optional[str] = Field(None, min_length=2, max_length=150)
    mobile: Optional[str] = Field(None, max_length=20)
    country: Optional[str] = Field(None, max_length=100)
    avatar: Optional[str] = None
    bio: Optional[str] = None


class UserResponse(BaseModel):
    """Schema for returning user data."""

    id: str
    email: str
    name: str
    mobile: Optional[str] = None
    country: Optional[str] = None
    avatar: Optional[str] = None
    bio: Optional[str] = None
    created_at: datetime
    is_verified: bool
    role: str

    model_config = {"from_attributes": True}


class Token(BaseModel):
    """JWT token response."""

    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserResponse


class TokenRefresh(BaseModel):
    """Refresh token request."""

    refresh_token: str
