"""Community posts routes."""

from typing import List

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.middleware.auth import get_current_user
from app.models.post import Post
from app.models.user import User
from app.schemas.post import PostCreate, PostResponse

router = APIRouter(prefix="/api/posts", tags=["posts"])


def _post_response(post: Post, db: Session) -> PostResponse:
    """Build a ``PostResponse`` with author info."""
    author = db.query(User).filter(User.id == post.author_id).first()
    return PostResponse(
        id=post.id,
        author_id=post.author_id,
        author_name=author.name if author else "Unknown",
        author_avatar=author.avatar if author else None,
        content=post.content,
        post_type=post.post_type,
        likes=post.likes,
        comments=post.comments,
        shares=post.shares,
        created_at=post.created_at,
        tags=post.tags,
    )


@router.get("", response_model=List[PostResponse])
def list_posts(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
) -> List[PostResponse]:
    """Return a paginated list of community posts."""
    posts = (
        db.query(Post)
        .order_by(Post.created_at.desc())
        .offset((page - 1) * per_page)
        .limit(per_page)
        .all()
    )
    return [_post_response(p, db) for p in posts]


@router.post("", response_model=PostResponse, status_code=status.HTTP_201_CREATED)
def create_post(
    data: PostCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> PostResponse:
    """Create a new community post."""
    post = Post(
        author_id=user.id,
        content=data.content,
        post_type=data.post_type,
        tags=data.tags,
    )
    db.add(post)
    db.commit()
    db.refresh(post)
    return _post_response(post, db)


@router.post("/{post_id}/like", response_model=PostResponse)
def like_post(
    post_id: str,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> PostResponse:
    """Increment the like count on a post."""
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    post.likes += 1
    db.commit()
    db.refresh(post)
    return _post_response(post, db)


@router.post("/{post_id}/comment", response_model=PostResponse)
def comment_on_post(
    post_id: str,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> PostResponse:
    """Increment the comment count on a post (actual comments stored separately in future)."""
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    post.comments += 1
    db.commit()
    db.refresh(post)
    return _post_response(post, db)
