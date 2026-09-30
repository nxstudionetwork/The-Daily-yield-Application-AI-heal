"""Market data simulation service."""

import random
from typing import Dict, List

from sqlalchemy.orm import Session

from app.models.company import Company


def get_all_companies(db: Session) -> List[Company]:
    """Return all companies from the database."""
    return db.query(Company).all()


def simulate_price_update(company: Company) -> float:
    """Simulate a small random price movement for a company.

    Returns the new price.
    """
    change_pct = random.uniform(-0.02, 0.02)
    new_price = round(company.current_price * (1 + change_pct), 2)
    company.current_price = max(new_price, 0.01)
    return company.current_price


def get_market_snapshot(db: Session) -> List[Dict]:
    """Return a list of dicts with the latest price for every company.

    This is used by the WebSocket endpoint to push periodic updates.
    """
    companies = db.query(Company).all()
    snapshot: List[Dict] = []
    for c in companies:
        simulate_price_update(c)
        snapshot.append(
            {
                "ticker": c.ticker,
                "name": c.name,
                "price": c.current_price,
                "change_pct": round(random.uniform(-3.0, 3.0), 2),
                "volume": c.volume or 0,
            }
        )
    db.commit()
    return snapshot


SEED_COMPANIES: List[Dict] = [
    {"ticker": "AAPL", "name": "Apple Inc.", "sector": "Technology", "industry": "Consumer Electronics", "country": "USA", "currency": "USD", "current_price": 182.52, "pe_ratio": 28.5, "market_cap": 2800000000000, "volume": 52000000, "description": "Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories.", "rating": "Buy"},
    {"ticker": "MSFT", "name": "Microsoft Corporation", "sector": "Technology", "industry": "Software", "country": "USA", "currency": "USD", "current_price": 404.87, "pe_ratio": 35.2, "market_cap": 3000000000000, "volume": 22000000, "description": "Microsoft Corporation develops and supports software, services, devices and solutions worldwide.", "rating": "Buy"},
    {"ticker": "GOOGL", "name": "Alphabet Inc.", "sector": "Technology", "industry": "Internet Content", "country": "USA", "currency": "USD", "current_price": 141.80, "pe_ratio": 24.1, "market_cap": 1800000000000, "volume": 25000000, "description": "Alphabet Inc. offers various products and platforms in the United States, Europe, Middle East, Africa, the Asia-Pacific, Canada, and Latin America.", "rating": "Buy"},
    {"ticker": "AMZN", "name": "Amazon.com Inc.", "sector": "Consumer Cyclical", "industry": "Internet Retail", "country": "USA", "currency": "USD", "current_price": 178.25, "pe_ratio": 60.3, "market_cap": 1800000000000, "volume": 47000000, "description": "Amazon.com, Inc. engages in the retail sale of consumer products and subscriptions through online and physical stores.", "rating": "Buy"},
    {"ticker": "NVDA", "name": "NVIDIA Corporation", "sector": "Technology", "industry": "Semiconductors", "country": "USA", "currency": "USD", "current_price": 875.28, "pe_ratio": 65.8, "market_cap": 2160000000000, "volume": 40000000, "description": "NVIDIA Corporation provides graphics and compute & networking solutions in the United States, Taiwan, China, and internationally.", "rating": "Strong Buy"},
    {"ticker": "TSLA", "name": "Tesla Inc.", "sector": "Consumer Cyclical", "industry": "Auto Manufacturers", "country": "USA", "currency": "USD", "current_price": 248.42, "pe_ratio": 72.4, "market_cap": 790000000000, "volume": 98000000, "description": "Tesla, Inc. designs, develops, manufactures, leases, and sells electric vehicles, and energy generation and storage systems.", "rating": "Hold"},
    {"ticker": "META", "name": "Meta Platforms Inc.", "sector": "Technology", "industry": "Social Media", "country": "USA", "currency": "USD", "current_price": 486.13, "pe_ratio": 32.1, "market_cap": 1240000000000, "volume": 16000000, "description": "Meta Platforms, Inc. engages in the development of products that enable people to connect and share with friends and family.", "rating": "Buy"},
    {"ticker": "JPM", "name": "JPMorgan Chase & Co.", "sector": "Financial Services", "industry": "Banking", "country": "USA", "currency": "USD", "current_price": 198.47, "pe_ratio": 11.8, "market_cap": 572000000000, "volume": 9000000, "description": "JPMorgan Chase & Co. operates as a financial services company worldwide.", "rating": "Buy"},
    {"ticker": "V", "name": "Visa Inc.", "sector": "Financial Services", "industry": "Credit Services", "country": "USA", "currency": "USD", "current_price": 281.35, "pe_ratio": 30.5, "market_cap": 576000000000, "volume": 7000000, "description": "Visa Inc. operates a payments technology company worldwide.", "rating": "Buy"},
    {"ticker": "JNJ", "name": "Johnson & Johnson", "sector": "Healthcare", "industry": "Drug Manufacturers", "country": "USA", "currency": "USD", "current_price": 156.74, "pe_ratio": 15.2, "market_cap": 378000000000, "volume": 7000000, "description": "Johnson & Johnson researches, develops, manufactures, and sells various products in the healthcare field worldwide.", "rating": "Hold"},
    {"ticker": "WMT", "name": "Walmart Inc.", "sector": "Consumer Defensive", "industry": "Retail", "country": "USA", "currency": "USD", "current_price": 165.23, "pe_ratio": 27.8, "market_cap": 446000000000, "volume": 8000000, "description": "Walmart Inc. engages in the retail and wholesale of various products in the United States and internationally.", "rating": "Buy"},
    {"ticker": "PG", "name": "Procter & Gamble Co.", "sector": "Consumer Defensive", "industry": "Household Products", "country": "USA", "currency": "USD", "current_price": 158.91, "pe_ratio": 25.6, "market_cap": 374000000000, "volume": 6000000, "description": "The Procter & Gamble Company provides branded consumer packaged goods worldwide.", "rating": "Hold"},
    {"ticker": "MA", "name": "Mastercard Inc.", "sector": "Financial Services", "industry": "Credit Services", "country": "USA", "currency": "USD", "current_price": 456.78, "pe_ratio": 34.2, "market_cap": 423000000000, "volume": 3000000, "description": "Mastercard Incorporated provides transaction processing and other payment-related products and services in the United States and internationally.", "rating": "Buy"},
    {"ticker": "UNH", "name": "UnitedHealth Group Inc.", "sector": "Healthcare", "industry": "Healthcare Plans", "country": "USA", "currency": "USD", "current_price": 527.32, "pe_ratio": 21.4, "market_cap": 488000000000, "volume": 4000000, "description": "UnitedHealth Group Incorporated operates as a diversified health care company in the United States and internationally.", "rating": "Buy"},
    {"ticker": "HD", "name": "Home Depot Inc.", "sector": "Consumer Cyclical", "industry": "Home Improvement", "country": "USA", "currency": "USD", "current_price": 346.16, "pe_ratio": 23.7, "market_cap": 343000000000, "volume": 4000000, "description": "The Home Depot, Inc. operates as a home improvement retailer.", "rating": "Buy"},
    {"ticker": "DIS", "name": "Walt Disney Co.", "sector": "Communication Services", "industry": "Entertainment", "country": "USA", "currency": "USD", "current_price": 111.28, "pe_ratio": 72.6, "market_cap": 204000000000, "volume": 10000000, "description": "The Walt Disney Company operates as an entertainment company worldwide.", "rating": "Hold"},
    {"ticker": "NFLX", "name": "Netflix Inc.", "sector": "Communication Services", "industry": "Entertainment", "country": "USA", "currency": "USD", "current_price": 605.88, "pe_ratio": 44.3, "market_cap": 261000000000, "volume": 6000000, "description": "Netflix, Inc. provides entertainment services worldwide.", "rating": "Buy"},
    {"ticker": "BABA", "name": "Alibaba Group Holding Ltd.", "sector": "Consumer Cyclical", "industry": "Internet Retail", "country": "China", "currency": "USD", "current_price": 74.65, "pe_ratio": 10.8, "market_cap": 188000000000, "volume": 18000000, "description": "Alibaba Group Holding Limited, through its subsidiaries, provides technology and commerce platforms.", "rating": "Hold"},
    {"ticker": "XOM", "name": "Exxon Mobil Corporation", "sector": "Energy", "industry": "Oil & Gas", "country": "USA", "currency": "USD", "current_price": 104.56, "pe_ratio": 12.3, "market_cap": 417000000000, "volume": 16000000, "description": "Exxon Mobil Corporation explores for and produces crude oil and natural gas in the United States and internationally.", "rating": "Hold"},
    {"ticker": "GS", "name": "Goldman Sachs Group Inc.", "sector": "Financial Services", "industry": "Investment Banking", "country": "USA", "currency": "USD", "current_price": 415.90, "pe_ratio": 15.7, "market_cap": 136000000000, "volume": 2000000, "description": "The Goldman Sachs Group, Inc. provides a range of financial services for corporations, financial institutions, governments, and individuals worldwide.", "rating": "Buy"},
]


def seed_companies(db: Session) -> None:
    """Insert seed company data if the table is empty."""
    if db.query(Company).count() == 0:
        for data in SEED_COMPANIES:
            company = Company(**data)
            db.add(company)
        db.commit()
