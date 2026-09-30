"""Portfolio and trading service."""

from typing import List, Tuple

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.company import Company
from app.models.holding import Holding
from app.models.portfolio import Portfolio
from app.models.transaction import Transaction


def get_or_create_portfolio(db: Session, user_id: str) -> Portfolio:
    """Return the user's portfolio, creating one if it doesn't exist."""
    portfolio = db.query(Portfolio).filter(Portfolio.user_id == user_id).first()
    if not portfolio:
        portfolio = Portfolio(user_id=user_id)
        db.add(portfolio)
        db.commit()
        db.refresh(portfolio)
    return portfolio


def buy_shares(db: Session, user_id: str, company_id: str, quantity: int) -> Transaction:
    """Buy *quantity* shares of a company.

    Raises:
        HTTPException: 400 if the user has insufficient funds or the company
            does not exist; 422 for other validation errors.
    """
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Company not found")

    portfolio = get_or_create_portfolio(db, user_id)
    total_cost = company.current_price * quantity

    if portfolio.cash_balance < total_cost:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Insufficient funds",
        )

    # Update portfolio balances
    portfolio.cash_balance -= total_cost
    portfolio.invested_amount += total_cost
    portfolio.total_value = portfolio.cash_balance + portfolio.invested_amount

    # Create or update the holding
    holding = (
        db.query(Holding)
        .filter(Holding.portfolio_id == portfolio.id, Holding.company_id == company_id)
        .first()
    )

    if holding:
        new_quantity = holding.quantity + quantity
        holding.avg_price = (
            (holding.avg_price * holding.quantity + total_cost) / new_quantity
        )
        holding.quantity = new_quantity
        holding.current_price = company.current_price
    else:
        holding = Holding(
            portfolio_id=portfolio.id,
            company_id=company_id,
            quantity=quantity,
            avg_price=company.current_price,
            current_price=company.current_price,
        )
        db.add(holding)

    # Record transaction
    transaction = Transaction(
        portfolio_id=portfolio.id,
        company_id=company_id,
        type="buy",
        quantity=quantity,
        price=company.current_price,
        total=total_cost,
        status="completed",
    )
    db.add(transaction)

    # Update portfolio total
    portfolio.total_value = portfolio.cash_balance + sum(
        h.quantity * h.current_price for h in portfolio.holdings
    )

    db.commit()
    db.refresh(transaction)
    return transaction


def sell_shares(db: Session, user_id: str, company_id: str, quantity: int) -> Transaction:
    """Sell *quantity* shares of a company.

    Raises:
        HTTPException: 400 if the user does not hold enough shares.
    """
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Company not found")

    portfolio = get_or_create_portfolio(db, user_id)

    holding = (
        db.query(Holding)
        .filter(Holding.portfolio_id == portfolio.id, Holding.company_id == company_id)
        .first()
    )
    if not holding or holding.quantity < quantity:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Insufficient shares",
        )

    total_revenue = company.current_price * quantity

    # Update portfolio
    portfolio.cash_balance += total_revenue
    portfolio.invested_amount -= holding.avg_price * quantity

    # Update holding
    holding.quantity -= quantity
    holding.current_price = company.current_price

    if holding.quantity == 0:
        db.delete(holding)

    # Record transaction
    transaction = Transaction(
        portfolio_id=portfolio.id,
        company_id=company_id,
        type="sell",
        quantity=quantity,
        price=company.current_price,
        total=total_revenue,
        status="completed",
    )
    db.add(transaction)

    # Recalculate
    portfolio.total_value = portfolio.cash_balance + sum(
        h.quantity * h.current_price for h in portfolio.holdings
    )

    db.commit()
    db.refresh(transaction)
    return transaction


def get_holdings(db: Session, user_id: str) -> List[Holding]:
    """Return all holdings for a user's portfolio."""
    portfolio = get_or_create_portfolio(db, user_id)
    return db.query(Holding).filter(Holding.portfolio_id == portfolio.id).all()


def get_transactions(db: Session, user_id: str, limit: int = 50) -> List[Transaction]:
    """Return recent transactions for a user."""
    portfolio = get_or_create_portfolio(db, user_id)
    return (
        db.query(Transaction)
        .filter(Transaction.portfolio_id == portfolio.id)
        .order_by(Transaction.timestamp.desc())
        .limit(limit)
        .all()
    )
