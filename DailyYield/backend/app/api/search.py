"""Cross-module search endpoint."""

from typing import Any, Dict, List

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.article import Article
from app.models.company import Company
from app.models.post import Post
from app.schemas.article import ArticleResponse
from app.schemas.company import CompanyResponse
from app.schemas.post import PostResponse

router = APIRouter(prefix="/api/search", tags=["search"])


@router.get("")
def global_search(
    q: str = Query(..., min_length=1),
    db: Session = Depends(get_db),
) -> Dict[str, Any]:
    """Search across articles, companies, and posts simultaneously."""
    pattern = f"%{q}%"

    articles = (
        db.query(Article)
        .filter(Article.title.ilike(pattern) | Article.summary.ilike(pattern))
        .limit(10)
        .all()
    )
    companies = (
        db.query(Company)
        .filter(Company.name.ilike(pattern) | Company.ticker.ilike(pattern))
        .limit(10)
        .all()
    )
    posts = (
        db.query(Post)
        .filter(Post.content.ilike(pattern))
        .limit(10)
        .all()
    )

    return {
        "articles": [ArticleResponse.model_validate(a).model_dump() for a in articles],
        "companies": [CompanyResponse.model_validate(c).model_dump() for c in companies],
        "posts": [PostResponse.model_validate(p).model_dump() for p in posts],
        "total": len(articles) + len(companies) + len(posts),
    }
