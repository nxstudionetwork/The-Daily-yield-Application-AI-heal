# Daily Yield – Backend

Production-quality FastAPI backend for the Daily Yield financial news and investment platform.

## Quick Start

```bash
# 1. Create and activate a virtual environment
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # macOS / Linux

# 2. Install dependencies
pip install -r requirements.txt

# 3. Configure environment
copy .env.example .env         # Windows
# cp .env.example .env         # macOS / Linux
# Edit .env and set DATABASE_URL, SECRET_KEY, etc.

# 4. (Optional) Create the database tables manually
python -c "from app.database import init_db; init_db()"

# 5. Run the server
python run.py
```

The API will be available at **http://localhost:8000** and the interactive docs at **http://localhost:8000/docs**.

## Project Structure

```
backend/
├── app/
│   ├── api/              # Route handlers
│   │   ├── auth.py       # Registration, login, refresh tokens
│   │   ├── news.py       # Article CRUD and search
│   │   ├── companies.py  # Company listings and sectors
│   │   ├── investment.py # Portfolio, holdings, trading, watchlist
│   │   ├── posts.py      # Community posts
│   │   ├── notifications.py
│   │   ├── search.py     # Cross-module search
│   │   └── ws.py         # WebSocket market data stream
│   ├── middleware/
│   │   ├── auth.py       # JWT authentication dependency
│   │   └── cors.py       # CORS configuration
│   ├── models/           # SQLAlchemy ORM models
│   ├── schemas/          # Pydantic request/response schemas
│   ├── services/         # Business logic
│   │   ├── auth_service.py
│   │   ├── portfolio_service.py
│   │   └── market_service.py
│   ├── config.py         # Application settings
│   ├── database.py       # Engine, session, Base
│   └── main.py           # FastAPI app creation
├── alembic/              # Database migrations
├── alembic.ini
├── requirements.txt
├── .env.example
└── run.py
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/register` | Register a new account |
| POST | `/api/auth/login` | Login and get tokens |
| POST | `/api/auth/refresh` | Refresh access token |
| GET | `/api/auth/me` | Current user profile |
| GET | `/api/news/articles` | List articles |
| GET | `/api/news/articles/search` | Search articles |
| GET | `/api/news/articles/{id}` | Get single article |
| POST | `/api/news/articles` | Create article (auth) |
| GET | `/api/companies` | List companies |
| GET | `/api/companies/sectors` | Sector aggregates |
| GET | `/api/companies/search` | Search companies |
| GET | `/api/companies/{id}` | Get single company |
| GET | `/api/investment/portfolio` | Portfolio summary |
| POST | `/api/investment/buy` | Buy shares (auth) |
| POST | `/api/investment/sell` | Sell shares (auth) |
| GET | `/api/investment/holdings` | List holdings (auth) |
| GET | `/api/investment/transactions` | Transaction history (auth) |
| GET | `/api/investment/watchlist` | Watchlist (auth) |
| POST | `/api/investment/watchlist` | Add to watchlist (auth) |
| GET | `/api/posts` | Community posts |
| POST | `/api/posts` | Create post (auth) |
| POST | `/api/posts/{id}/like` | Like a post (auth) |
| POST | `/api/posts/{id}/comment` | Comment on a post (auth) |
| GET | `/api/notifications` | Notifications (auth) |
| PUT | `/api/notifications/{id}/read` | Mark read (auth) |
| PUT | `/api/notifications/read-all` | Mark all read (auth) |
| GET | `/api/search?q=` | Cross-module search |
| WS | `/ws/market-data` | Real-time price stream |

## Database

The default configuration uses **SQLite** for zero-config development.  
Set `DATABASE_URL` in `.env` to switch to PostgreSQL:

```
DATABASE_URL=postgresql://user:password@localhost:5432/dailyyield
```

### Migrations

```bash
alembic revision --autogenerate -m "description"
alembic upgrade head
```

## Seed Data

On first startup the application automatically seeds 20 well-known companies
into the database so the platform works out of the box.
