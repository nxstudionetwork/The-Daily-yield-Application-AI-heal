"""News / article routes."""

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.middleware.auth import get_current_user, get_optional_user
from app.models.article import Article
from app.models.user import User
from app.schemas.article import ArticleCreate, ArticleListResponse, ArticleResponse

router = APIRouter(prefix="/api/news", tags=["news"])


@router.get("/articles", response_model=ArticleListResponse)
def list_articles(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    category: Optional[str] = None,
    db: Session = Depends(get_db),
) -> ArticleListResponse:
    """Return a paginated list of articles, optionally filtered by category."""
    query = db.query(Article)
    if category:
        query = query.filter(Article.category == category)
    total = query.count()
    items = (
        query.order_by(Article.publish_date.desc())
        .offset((page - 1) * per_page)
        .limit(per_page)
        .all()
    )
    return ArticleListResponse(
        items=[ArticleResponse.model_validate(a) for a in items],
        total=total,
        page=page,
        per_page=per_page,
    )


@router.get("/articles/search", response_model=ArticleListResponse)
def search_articles(
    q: str = Query(..., min_length=1),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
) -> ArticleListResponse:
    """Full-text search across article titles, summaries, and tags."""
    pattern = f"%{q}%"
    query = db.query(Article).filter(
        (Article.title.ilike(pattern))
        | (Article.summary.ilike(pattern))
        | (Article.tags.ilike(pattern))
    )
    total = query.count()
    items = (
        query.order_by(Article.publish_date.desc())
        .offset((page - 1) * per_page)
        .limit(per_page)
        .all()
    )
    return ArticleListResponse(
        items=[ArticleResponse.model_validate(a) for a in items],
        total=total,
        page=page,
        per_page=per_page,
    )


@router.get("/articles/{article_id}", response_model=ArticleResponse)
def get_article(article_id: str, db: Session = Depends(get_db)) -> ArticleResponse:
    """Return a single article by its ID, incrementing the view count."""
    article = db.query(Article).filter(Article.id == article_id).first()
    if not article:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Article not found")
    article.views += 1
    db.commit()
    return ArticleResponse.model_validate(article)


@router.post("/articles", response_model=ArticleResponse, status_code=status.HTTP_201_CREATED)
def create_article(
    data: ArticleCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> ArticleResponse:
    """Create a new article (requires authentication)."""
    article = Article(
        title=data.title,
        subtitle=data.subtitle,
        summary=data.summary,
        content=data.content,
        category=data.category,
        author_id=user.id,
        publisher=data.publisher,
        tags=data.tags,
        is_breaking=data.is_breaking,
        is_featured=data.is_featured,
        image_url=data.image_url,
        reading_time=data.reading_time,
    )
    db.add(article)
    db.commit()
    db.refresh(article)
    return ArticleResponse.model_validate(article)
