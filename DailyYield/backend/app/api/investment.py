"""Investment / portfolio routes."""

from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.middleware.auth import get_current_user
from app.models.holding import Holding
from app.models.user import User
from app.models.watchlist import Watchlist
from app.schemas.holding import HoldingResponse
from app.schemas.portfolio import PortfolioResponse
from app.schemas.transaction import TransactionCreate, TransactionResponse
from app.schemas.watchlist import WatchlistAdd, WatchlistResponse
from app.services.market_service import simulate_price_update
from app.services.portfolio_service import (
    buy_shares,
    get_holdings,
    get_or_create_portfolio,
    get_transactions,
    sell_shares,
)

router = APIRouter(prefix="/api/investment", tags=["investment"])


def _holding_response(h: Holding) -> HoldingResponse:
    """Build a ``HoldingResponse`` with computed P/L fields."""
    pnl = (h.current_price - h.avg_price) * h.quantity
    pnl_pct = ((h.current_price - h.avg_price) / h.avg_price * 100) if h.avg_price else 0.0
    return HoldingResponse(
        id=h.id,
        portfolio_id=h.portfolio_id,
        company_id=h.company_id,
        quantity=h.quantity,
        avg_price=h.avg_price,
        current_price=h.current_price,
        company_ticker=h.company.ticker if h.company else None,
        company_name=h.company.name if h.company else None,
        pnl=round(pnl, 2),
        pnl_percent=round(pnl_pct, 2),
    )


@router.get("/portfolio", response_model=PortfolioResponse)
def get_portfolio(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> PortfolioResponse:
    """Return the current user's portfolio summary with holdings."""
    portfolio = get_or_create_portfolio(db, user.id)

    holdings = db.query(Holding).filter(Holding.portfolio_id == portfolio.id).all()
    total_invested = sum(h.quantity * h.avg_price for h in holdings)
    total_market = sum(h.quantity * h.current_price for h in holdings)

    portfolio.invested_amount = round(total_invested, 2)
    portfolio.total_value = round(portfolio.cash_balance + total_market, 2)
    db.commit()
    db.refresh(portfolio)

    return PortfolioResponse(
        id=portfolio.id,
        user_id=portfolio.user_id,
        cash_balance=portfolio.cash_balance,
        invested_amount=portfolio.invested_amount,
        total_value=portfolio.total_value,
        holdings=[_holding_response(h) for h in holdings],
    )


@router.post("/buy", response_model=TransactionResponse, status_code=status.HTTP_201_CREATED)
def buy(
    data: TransactionCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> TransactionResponse:
    """Buy shares of a company."""
    transaction = buy_shares(db, user.id, data.company_id, data.quantity)
    return TransactionResponse(
        id=transaction.id,
        portfolio_id=transaction.portfolio_id,
        company_id=transaction.company_id,
        type=transaction.type,
        quantity=transaction.quantity,
        price=transaction.price,
        total=transaction.total,
        timestamp=transaction.timestamp,
        status=transaction.status,
        company_ticker=transaction.company.ticker if transaction.company else None,
        company_name=transaction.company.name if transaction.company else None,
    )


@router.post("/sell", response_model=TransactionResponse, status_code=status.HTTP_201_CREATED)
def sell(
    data: TransactionCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> TransactionResponse:
    """Sell shares of a company."""
    transaction = sell_shares(db, user.id, data.company_id, data.quantity)
    return TransactionResponse(
        id=transaction.id,
        portfolio_id=transaction.portfolio_id,
        company_id=transaction.company_id,
        type=transaction.type,
        quantity=transaction.quantity,
        price=transaction.price,
        total=transaction.total,
        timestamp=transaction.timestamp,
        status=transaction.status,
        company_ticker=transaction.company.ticker if transaction.company else None,
        company_name=transaction.company.name if transaction.company else None,
    )


@router.get("/holdings", response_model=List[HoldingResponse])
def list_holdings(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> List[HoldingResponse]:
    """Return all holdings for the authenticated user."""
    holdings = get_holdings(db, user.id)
    return [_holding_response(h) for h in holdings]


@router.get("/transactions", response_model=List[TransactionResponse])
def list_transactions(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> List[TransactionResponse]:
    """Return recent transactions for the authenticated user."""
    transactions = get_transactions(db, user.id)
    return [
        TransactionResponse(
            id=t.id,
            portfolio_id=t.portfolio_id,
            company_id=t.company_id,
            type=t.type,
            quantity=t.quantity,
            price=t.price,
            total=t.total,
            timestamp=t.timestamp,
            status=t.status,
            company_ticker=t.company.ticker if t.company else None,
            company_name=t.company.name if t.company else None,
        )
        for t in transactions
    ]


@router.get("/watchlist", response_model=List[WatchlistResponse])
def get_watchlist(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> List[WatchlistResponse]:
    """Return the user's watchlist."""
    entries = db.query(Watchlist).filter(Watchlist.user_id == user.id).all()
    result: List[WatchlistResponse] = []
    for entry in entries:
        company = entry.company
        result.append(
            WatchlistResponse(
                id=entry.id,
                user_id=entry.user_id,
                company_id=entry.company_id,
                company_ticker=company.ticker if company else "",
                company_name=company.name if company else "",
                company_price=company.current_price if company else 0.0,
                added_at=entry.added_at,
            )
        )
    return result


@router.post("/watchlist", response_model=WatchlistResponse, status_code=status.HTTP_201_CREATED)
def add_to_watchlist(
    data: WatchlistAdd,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> WatchlistResponse:
    """Add a company to the user's watchlist."""
    existing = (
        db.query(Watchlist)
        .filter(Watchlist.user_id == user.id, Watchlist.company_id == data.company_id)
        .first()
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Already in watchlist",
        )

    from app.models.company import Company

    company = db.query(Company).filter(Company.id == data.company_id).first()
    if not company:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Company not found")

    entry = Watchlist(user_id=user.id, company_id=data.company_id)
    db.add(entry)
    db.commit()
    db.refresh(entry)

    return WatchlistResponse(
        id=entry.id,
        user_id=entry.user_id,
        company_id=entry.company_id,
        company_ticker=company.ticker,
        company_name=company.name,
        company_price=company.current_price,
        added_at=entry.added_at,
    )
