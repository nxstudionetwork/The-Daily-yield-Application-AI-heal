"""Company / stock listing routes."""

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.company import Company
from app.schemas.company import CompanyListResponse, CompanyResponse, SectorResponse

router = APIRouter(prefix="/api/companies", tags=["companies"])


@router.get("/sectors", response_model=list[SectorResponse])
def list_sectors(db: Session = Depends(get_db)) -> list[SectorResponse]:
    """Return aggregate stats per sector."""
    rows = (
        db.query(Company.sector, func.count(Company.id))
        .group_by(Company.sector)
        .all()
    )
    result: list[SectorResponse] = []
    for sector_name, count in rows:
        companies_in_sector = (
            db.query(Company).filter(Company.sector == sector_name).all()
        )
        avg_change = 0.0
        if companies_in_sector:
            prices = [c.current_price for c in companies_in_sector]
            avg_change = round(sum(prices) / len(prices), 2)
        result.append(
            SectorResponse(name=sector_name or "Unknown", count=count, avg_change=avg_change)
        )
    return result


@router.get("/search", response_model=CompanyListResponse)
def search_companies(
    q: str = Query(..., min_length=1),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
) -> CompanyListResponse:
    """Search companies by name or ticker."""
    pattern = f"%{q}%"
    query = db.query(Company).filter(
        (Company.name.ilike(pattern)) | (Company.ticker.ilike(pattern))
    )
    total = query.count()
    items = (
        query.order_by(Company.name)
        .offset((page - 1) * per_page)
        .limit(per_page)
        .all()
    )
    return CompanyListResponse(
        items=[CompanyResponse.model_validate(c) for c in items],
        total=total,
        page=page,
        per_page=per_page,
    )


@router.get("", response_model=CompanyListResponse)
def list_companies(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    sector: Optional[str] = None,
    db: Session = Depends(get_db),
) -> CompanyListResponse:
    """Return a paginated list of companies, optionally filtered by sector."""
    query = db.query(Company)
    if sector:
        query = query.filter(Company.sector == sector)
    total = query.count()
    items = (
        query.order_by(Company.name)
        .offset((page - 1) * per_page)
        .limit(per_page)
        .all()
    )
    return CompanyListResponse(
        items=[CompanyResponse.model_validate(c) for c in items],
        total=total,
        page=page,
        per_page=per_page,
    )


@router.get("/{company_id}", response_model=CompanyResponse)
def get_company(company_id: str, db: Session = Depends(get_db)) -> CompanyResponse:
    """Return details for a single company."""
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Company not found")
    return CompanyResponse.model_validate(company)
