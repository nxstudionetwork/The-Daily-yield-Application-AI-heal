import json
import re
import random
from datetime import datetime, timedelta

# Read current file
with open(r'C:\Users\AICOE 5\Downloads\The Daily Yield\DailyYield\data\videosData.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract existing videos using regex
pattern = r"videos\s*=\s*\[(.*?)\];"
match = re.search(pattern, content, re.DOTALL)
if not match:
    raise Exception("Could not find videos array")

existing_videos_str = match.group(1)

# Count existing videos
video_block_pattern = r"\{[^{}]*\}"
existing_entries = re.findall(video_block_pattern, existing_videos_str, re.DOTALL)
print(f"Existing video count: {len(existing_entries)}")

# Categories to distribute among
categories = ['Markets', 'Crypto', 'Investing', 'Tech', 'Economy', 'Personal Finance', 'Trading', 'Education']

# Channel data
channels = [
    # Major financial news
    ('Bloomberg Television', '📊', '4.2M'), ('CNBC', '📺', '8.5M'), ('Wall Street Journal', '📰', '5.6M'),
    ('MarketWatch', '📈', '2.1M'), ('Financial Times', '📋', '3.4M'), ('Reuters', '📡', '6.7M'),
    ('Bloomberg Originals', '🎬', '2.8M'), ('CNBC International', '🌍', '3.2M'),
    # Indian channels
    ('CNBC TV18', '📺', '8.7M'), ('ET Now', '📈', '6.2M'), ('Zee Business', '💰', '4.8M'),
    ('NDTV Profit', '📊', '3.9M'), ('Business Today', '📋', '2.3M'),
    # Tech
    ('MKBHD', '📱', '19.2M'), ('Linus Tech Tips', '💻', '16.8M'), ('TechLinked', '🔧', '4.5M'),
    ('Two Minute Papers', '🔬', '3.1M'), ('Marques Brownlee', '📱', '19.2M'),
    ('Dave2D', '💻', '4.7M'), ('Mrwhosetheboss', '📱', '7.8M'),
    # Crypto
    ('CoinDesk', '🪙', '2.8M'), ('Coin Bureau', '🪙', '2.9M'), ('Finematics', '🔷', '1.2M'),
    ('InvestAnswers', '📊', '1.1M'), ('Benjamin Cowen', '📉', '1.8M'), ('The Coin Shop', '🪙', '890K'),
    # Finance/Investing
    ('The Plain Bagel', '🥯', '2.1M'), ('Patrick Boyle', '🎩', '1.8M'), ('Real Vision', '🔮', '2.3M'),
    ('Humphrey Mall', '💡', '1.6M'), ('Joseph Carlson', '📈', '1.2M'), ('Andrei Jikh', '🃏', '3.8M'),
    ('Graham Stephan', '🏠', '4.5M'), ('Meet Kevin', '🏘️', '3.1M'),
    # Indian finance
    ('Pranjal Kamra', '📈', '5.8M'), ('Abhi and Niyu', '🇮🇳', '6.2M'), ('Labour Law Advisor', '⚖️', '3.4M'),
    ('Sahil Bhadviya', '📊', '2.1M'), ('nitish rajpure', '📈', '1.4M'), ('finnovation', '💡', '1.8M'),
    ('Finance With Sharan', '💰', '2.5M'),
    # Economy
    ('Economics Explained', '💡', '3.5M'), ('Economics Explained (EE)', '🌏', '3.5M'),
    ('The Economist', '📰', '4.2M'), ('Marketplace APM', '📻', '1.3M'),
    # Education
    ('Kurzgesagt', '🐦', '22.4M'), ('Veritasium', '🔬', '16.2M'), ('3Blue1Brown', '🔵', '5.8M'),
    ('Ali Abdaal', '✍️', '6.4M'), ('Thomas Frank', '📚', '4.1M'),
    # Trading
    ('Rayner Teo', '📉', '1.5M'), ('The Trading Channel', '📊', '1.2M'), ('ClayTrader', '💹', '890K'),
    ('Chat With Traders', '🎙️', '620K'), ('Ricky Gutierrez', '📈', '780K'),
    # More general
    ('CNBC Squawk Box', '☕', '3.8M'), ('Bloomberg Markets', '📊', '3.2M'),
    ('Yahoo Finance', '💹', '4.1M'), ('Morningstar', '⭐', '1.3M'),
    ('TradingView', '📈', '1.6M'), ('Seeking Alpha', '📝', '980K'),
    ('The Motley Fool', '🐴', '2.4M'), ('Investopedia', '📚', '1.7M'),
    ('Moneycontrol', '💵', '3.1M'), ('Value Research', '📋', '1.2M'),
]

# Video title templates by category
titles = {
    'Markets': [
        "Sensex Nifty Analysis: {day} Market Wrap",
        "Why {stock} Is Crashing Today",
        "{stock} Q{quarter} Results: Beat or Miss?",
        "Market Rally: Is This Sustainable?",
        "FII DII Data: Who Is Buying What?",
        "Pre-Market Call: {day} Trading Plan",
        "Closing Bell: {day} Market Review",
        "Options Data: Nifty {value} Strike Analysis",
        "Market Outlook: {month} 2026 Strategy",
        "Sector Spotlight: {sector} Stocks to Watch",
        "Technical Analysis: {stock} Chart Breakdown",
        "F&O Ban Today: Stocks in Focus",
        "Bulk Deals: Who Bought What Today",
        "Global Markets Impact on Indian Indices",
        "Midcap & Smallcap Picks for {month}",
        "Avenue Supermarts Q{quarter} Analysis",
        "Indian IT Stocks: Buy or Avoid?",
        "PSU Bank Rally: Will It Continue?",
        "Auto Sector Sales Data Analysis",
        "Pharma Stocks: Defensive Play for Volatile Markets",
        "Earnings Season: Top Takeaways So Far",
        "Dividend Yield Stocks for Steady Income",
        "Why FMCG Stocks Are Underperforming",
        "Railway Stocks: The Next Multibaggers?",
        "IPO Analysis: {company} Should You Apply?",
        "Anchor Investor Activity: What It Signals",
        "MSCI Rebalancing: Stocks to Benefit",
        "Short Covering Rally or Genuine Reversal?",
        "Index Rejig: Nifty Changes Explained",
        "Mutual Fund SIP Data: Record Inflows Continue",
    ],
    'Crypto': [
        "Bitcoin {price}: Key Levels to Watch",
        "Ethereum Upgrade: What Changes?",
        "Altcoin Season: Top {n} Picks",
        "Crypto Market Cap Hits ${value}T: What Next?",
        "DeFi TVL Update: Top Protocols Ranked",
        "Solana vs Ethereum: Which Is Better?",
        "Ripple SEC Case: Latest Update",
        "NFT Market Crash: Is It Over?",
        "Top {n} Crypto Wallets Compared",
        "Crypto Regulation: Global Roundup",
        "Staking vs Lending: Best Passive Income",
        "Bitcoin Dominance Rising: Altseason Delayed?",
        "Layer 2 Solutions: Scaling Ethereum",
        "Meme Coins: Speculation or Investment?",
        "Web3 Gaming Tokens to Watch",
        "Stablecoins: Risks You Must Know",
        "Central Bank Digital Currencies Explained",
        "Crypto Tax: How to Stay Compliant",
        "Ethereum Gas Fees Update: L2 Solutions Working",
        "Avalanche vs Polygon: Which Ecosystem Wins?",
        "Token Unlocks: What Projects Are Vesting",
        "Crypto Mining: Post-Merge Reality",
        "DEX vs CEX: Which Is Safer?",
        "Portfolio Rebalancing: Crypto Edition",
        "Yield Farming Risks: What I Learned",
    ],
    'Investing': [
        "My Top {n} Stock Picks for {month}",
        "How I Built a {value}Lakh Portfolio in {years} Years",
        "SIP vs Lump Sum: Which Is Better Now?",
        "Value Investing in 2026: Graham Would Buy These",
        "Growth at Reasonable Price: {n} Stocks",
        "REITs: Real Estate Without Buying Property",
        "Index Funds vs Active Funds: Data Says...",
        "How to Analyze a Balance Sheet in 10 Minutes",
        "DCF Valuation of {company}",
        "PEG Ratio: Better Than PE?",
        "What I Learned From {investor} Investing Style",
        "Asset Allocation for Your 30s",
        "Emergency Fund: Why You Need {value} Months",
        "Swing Trading vs Long Term: Which Makes More?",
        "Portfolio Review: My {month} Holdings",
        "ESG Investing: Returns With Responsibility",
        "Dividend Investing: Building Passive Income",
        "Small Cap Investing: High Risk High Reward",
        "Trading vs Investing: The Real Difference",
        "Why Cash Is a Position Right Now",
        "Margin Trading: When It Makes Sense",
        "Portfolio Hedging Strategies for 2026",
        "I Bought {n} Shares of {company}: Here Is Why",
        "How to Read an Annual Report",
        "Warren Buffett Portfolio Tracker",
        "Rakesh Jhunjhunwala Portfolio: Lessons Learned",
        "This One Metric Predicts Stock Returns",
        "Concentrated vs Diversified Portfolio",
    ],
    'Tech': [
        "Apple {product}: First Look Review",
        "Samsung Galaxy S{num} Ultra: Full Review",
        "The Future of AI: What to Expect",
        "AI Tool Review: {tool} vs ChatGPT",
        "Google Pixel {num} : Should You Upgrade?",
        "Tesla {model}: Range Test and Review",
        "MacBook Air M{num}: {years} Months Later",
        "Best Budget Smartphone 2026",
        "Gaming Laptop Roundup: Top {n} Picks",
        "Smart Home Setup Tour 2026",
        "Noise Cancelling Headphones: Best 5",
        "Cloud Computing Trends for 2026",
        "Quantum Computing: Where We Are Now",
        "Self Driving Cars: Current State",
        "Wearable Tech: Beyond Smartwatches",
        "Best Mechanical Keyboards Under {value}",
        "How AI Is Changing Healthcare",
        "Tablet Showdown: iPad Pro vs Galaxy Tab",
        "Foldable Phones: Are They Worth It?",
        "Tech Stocks: Which Companies to Watch",
        "Cybersecurity Threats in 2026",
        "Electric Vehicles: Battery Tech Update",
        "Augmented Reality Applications in 2026",
        "Open Source AI: Democratizing Technology",
        "5G vs 6G: What the Next Gen Brings",
        "Robotics in Manufacturing Revolution",
        "Edge Computing Explained Simply",
        "Best Tech Gadgets Under {value}",
        "I Tested {n} AI Coding Assistants",
        "Autonomous Delivery Robots Update",
    ],
    'Economy': [
        "India GDP Growth: Q{quarter} Data Analysis",
        "Inflation Report: CPI and WPI Breakdown",
        "RBI Policy: Rate Decision Explained",
        "US Fed Rate Decision Impact on India",
        "Trade Deficit: What the Numbers Say",
        "Unemployment Data Is Encouraging",
        "Industrial Production Index Analysis",
        "GST Collection Update: Record High?",
        "Manufacturing PMI: Expansion Continues",
        "Services PMI: Growth Trajectory",
        "Export Data: Which Sectors Are Growing",
        "RBI MPC Minutes: Key Takeaways",
        "Bond Yields: What Falling Rates Mean",
        "Oil Prices Impact on Indian Economy",
        "Rupee vs Dollar: Currency Outlook",
        "Fiscal Deficit: Government Spending Analysis",
        "Rural Demand Recovery Signs",
        "Infrastructure Spending Boost: Impact Analysis",
        "Employment Report: Sector-wise Jobs Data",
        "Food Inflation: Vegetable Prices Surge",
        "Economic Survey 2026 Highlights",
        "Monsoon Impact on Agri Economy",
        "India Demographics: Demographic Dividend",
        "Global Recession Fears: India Impact",
        "Labour Force Participation Rate Trends",
        "Ease of Doing Business: India Ranking",
        "Startup Economy: Funding Trends 2026",
        "Digital Economy Contribution to GDP",
    ],
    'Personal Finance': [
        "Tax Saving Guide: Save {value} in Taxes",
        "How to Start Investing With {value} Per Month",
        "Credit Card Rewards: Best Cards for 2026",
        "Home Loan vs Rent: Which Is Better?",
        "Insurance Checklist: Do You Have Enough?",
        "NPS vs PPF vs EPF: Which Is Best?",
        "Building an Emergency Fund from Scratch",
        "How to Negotiate Your Salary in 2026",
        "Side Hustles That Actually Make Money",
        "Budgeting App Review: Top {n} Apps",
        "FIRE Movement: Can You Retire Early?",
        "Financial Literacy: What Schools Don't Teach",
        "Cibil Score: How to Improve It Fast",
        "Sovereign Gold Bonds vs Physical Gold",
        "ITR Filing: Complete Step by Step Guide",
        "Mutual Fund Selection: Step by Step",
        "Health Insurance: Critical Coverages Check",
        "Term Life Insurance: How Much You Need",
        "Children Education Planning: Best Options",
        "Retirement Planning Calculator Guide",
        "Debt Repayment Strategy: Snowball vs Avalanche",
        "How to Read Your Salary Slip",
        "Investment Mistakes Beginners Make",
        "Financial Goals: Setting Realistic Targets",
        "Wealth Building Habits That Actually Work",
        "Index Fund Investing: Complete Guide",
        "Senior Citizen Savings Scheme Explained",
        "Pradhan Mantri Schemes: What You Should Use",
    ],
    'Trading': [
        "Intraday Trading Strategy for {day}",
        "How I Made {value} in One Trade",
        "Options Trading: Basic to Advanced",
        "Breakout Trading: My Setup Explained",
        "Support and Resistance Trading Strategy",
        "Moving Average Crossover Strategy",
        "RSI Divergence: Spot Reversals Early",
        "Bank Nifty Options: Weekly Strategy",
        "Scalping Strategy: {n} Ticks Profit Target",
        "VWAP Trading: Institutional Tracker",
        "Ichimoku Cloud: Complete Trading System",
        "Futures vs Options: Which to Trade",
        "Loss Recovery: How to Bounce Back",
        "Risk Management: Position Sizing Formula",
        "Gap Up Gap Down: Opening Range Strategy",
        "Expiry Day: Option Strategies for Max Profit",
        "Price Action Trading: No Indicators Needed",
        "Trading Psychology: Overcoming Fear and Greed",
        "Backtesting: How to Test Your Strategy",
        "Earnings Trade: Straddle vs Strangle",
        "Algo Trading: Building Your First Bot",
        "Market Profile: Understanding TPO Charts",
        "Volume Profile: Key Trading Levels",
        "Weekly Options Trading Recap: P&L",
        "My Trading Journal: {month} Results",
        "Forex Trading for Indian Traders",
        "Commodity Trading: Gold Silver Crude",
        "Smart Money Concepts: ICT Trading Style",
    ],
    'Education': [
        "How the Stock Market Actually Works",
        "Compound Interest: The 8th Wonder of World",
        "Economics 101: Supply and Demand Explained",
        "How Central Banks Create Money",
        "Understanding Derivatives: Futures and Options",
        "Financial Statements Explained in 15 Minutes",
        "How Credit Default Swaps Work",
        "Game Theory in Finance Explained",
        "Behavioral Finance: Why We Make Bad Decisions",
        "Modern Portfolio Theory in Practice",
        "CAPM Model: Calculating Expected Returns",
        "DCF Model: Step by Step Valuation",
        "Technical Indicators Explained Simply",
        "How IPOs Work: Complete Process",
        "Foreign Exchange Market Explained",
        "How Bonds Work: Complete Beginner Guide",
        "Fractional Reserve Banking Explained",
        "Hedge Funds vs Mutual Funds: Key Differences",
        "Quantitative Easing: What It Really Means",
        "Arbitrage: Risk Free Profit Explained",
        "Leverage: The Double Edged Sword",
        "Inflation Accounting: Understanding Real Returns",
        "Time Value of Money: Essential Concept",
        "Basel Norms: Banking Regulations Explained",
        "How Stock Exchanges Work: BSE vs NSE",
        "Circuit Breakers: How Markets Halt Trading",
        "Corporate Actions: Dividends, Splits, Buybacks",
        "Business Cycles: Boom and Bust Explained",
        "Tax System Explained: Direct vs Indirect",
        "ESG Investing: Beyond the Buzzword",
    ],
}

# Helper functions
def random_view():
    r = random.random()
    if r < 0.1: return f"{random.randint(1,9)}K"           # 10% - very low
    elif r < 0.3: return f"{random.randint(10,99)}K"       # 20% - low
    elif r < 0.5: return f"{random.randint(100,900)}K"     # 20% - medium
    elif r < 0.7: return f"{random.randint(1,9)}M"         # 20% - high
    else: return f"{random.randint(1,5)}M"                  # 30% - very high

def random_likes(view_str):
    v = view_str
    if 'K' in v:
        n = int(v.replace('K',''))
        return f"{random.randint(max(1, n//50), max(10, n//10))}K"
    else:
        n = int(v.replace('M','')) * 1000
        return f"{random.randint(max(1, n//100), max(10, n//20))}K"

def random_duration(is_short, is_live):
    if is_short:
        return f"{random.randint(20,59)}:{random.randint(10,59)}"
    if is_live:
        mins = random.choice([15,30,45,60,90,120])
        return f"{mins}:00"
    # regular
    t = random.random()
    if t < 0.3:
        return f"{random.randint(5,9)}:{random.randint(10,59)}"
    elif t < 0.6:
        return f"{random.randint(10,20)}:{random.randint(10,59)}"
    elif t < 0.85:
        return f"{random.randint(21,45)}:{random.randint(10,59)}"
    else:
        return f"{random.randint(46,90)}:{random.randint(10,59)}"

def random_upload_date(days_ago=90):
    d = datetime.now() - timedelta(days=random.randint(1, days_ago), hours=random.randint(0,23), minutes=random.randint(0,59))
    return d.isoformat()

def random_tags(category, title, keywords_list):
    tags = set()
    # Add category-based tags
    cat_tags = {
        'Markets': ['Stocks', 'Nifty', 'Sensex', 'Trading', 'Investment', 'Stock Market', 'BSE', 'NSE', 'FII', 'DII'],
        'Crypto': ['Bitcoin', 'Ethereum', 'Crypto', 'Blockchain', 'DeFi', 'Web3', 'Altcoins', 'NFT', 'Trading'],
        'Investing': ['Investing', 'Portfolio', 'Stocks', 'Mutual Funds', 'SIP', 'Wealth', 'Value Investing'],
        'Tech': ['Technology', 'Gadgets', 'AI', 'Smartphone', 'Review', 'Innovation', 'Startup'],
        'Economy': ['Economy', 'GDP', 'Inflation', 'RBI', 'India', 'Growth', 'Fiscal Policy', 'Monetary'],
        'Personal Finance': ['Personal Finance', 'Tax', 'Insurance', 'Savings', 'Budget', 'Retirement', 'Money Management'],
        'Trading': ['Trading', 'Options', 'Futures', 'Intraday', 'Strategy', 'Technical Analysis', 'Nifty', 'Bank Nifty'],
        'Education': ['Education', 'Finance', 'Learn', 'Beginner', 'Explained', 'Course', 'Knowledge'],
    }
    tags.update(cat_tags.get(category, []))
    
    # Add specific relevant tags from title
    title_upper = title.upper()
    specific_tags = {
        'SENSEX': 'Sensex', 'NIFTY': 'Nifty', 'BANK NIFTY': 'Bank Nifty',
        'BITCOIN': 'Bitcoin', 'ETHEREUM': 'Ethereum', 'CRYPTO': 'Crypto',
        'AI': 'AI', 'GPT': 'AI', 'APPLE': 'Apple', 'TESLA': 'Tesla',
        'GOOGLE': 'Google', 'AMAZON': 'Amazon', 'META': 'Meta',
        'WARREN BUFFETT': 'Warren Buffett', 'RAKESH': 'Rakesh Jhunjhunwala',
        'IPO': 'IPO', 'DIVIDEND': 'Dividend', 'EARNINGS': 'Earnings',
        'INFLATION': 'Inflation', 'GDP': 'GDP', 'RBI': 'RBI',
        'FED': 'Fed', 'INTEREST': 'Interest Rates', 'RECESSION': 'Recession',
        'OPTIONS': 'Options', 'TRADING': 'Trading', 'STOCK': 'Stocks',
        'MUTUAL FUND': 'Mutual Funds', 'SIP': 'SIP', 'TAX': 'Tax',
        'INSURANCE': 'Insurance', 'RETIREMENT': 'Retirement',
    }
    for key, val in specific_tags.items():
        if key in title_upper:
            tags.add(val)
    
    # Ensure we have at least 3 tags
    if len(tags) < 3:
        fallback = cat_tags.get(category, ['Finance', 'Markets', 'Investing'])
        while len(tags) < 3:
            tags.add(random.choice(fallback))
    
    return list(tags)[:5]

def random_thumbnail(category):
    thumbs = {
        'Markets': ['📊', '📈', '📉', '💹', '🏦', '💰', '💵', '📋'],
        'Crypto': ['₿', '🪙', '🔷', '⚡', '🔗', '💎', '📊', '💰'],
        'Investing': ['📈', '💰', '💎', '🏦', '📊', '💡', '🎯', '📋'],
        'Tech': ['💻', '📱', '🤖', '🚀', '⚙️', '🔬', '🖥️', '⌚'],
        'Economy': ['🌍', '🏛️', '📊', '📉', '💼', '📰', '🌏', '📋'],
        'Personal Finance': ['💰', '💳', '🏠', '📋', '💡', '🎯', '📝', '🏦'],
        'Trading': ['📊', '📈', '📉', '💹', '⚡', '🎯', '📋', '💵'],
        'Education': ['📚', '🎓', '💡', '🔬', '📖', '✏️', '🧠', '📝'],
    }
    return random.choice(thumbs.get(category, ['📊', '💰']))

now = datetime.now()

# Generate new videos
new_videos = []
existing_ids = set()
for entry in existing_entries:
    id_match = re.search(r"id:\s*'([^']+)'", entry)
    if id_match:
        existing_ids.add(id_match.group(1))

max_id = max(int(pid.replace('v','')) for pid in existing_ids)

for i in range(1, 261):  # Add 260 new videos
    vid_num = max_id + i
    vid_id = f"v{vid_num:03d}"
    
    # Determine type
    r = random.random()
    if r < 0.70:
        is_short, is_live, is_premium = False, False, False
    elif r < 0.85:
        is_short, is_live, is_premium = True, False, False
    elif r < 0.95:
        is_short, is_live, is_premium = False, True, False
    else:
        is_short, is_live, is_premium = False, False, True
    
    # Pick category
    category = random.choice(categories)
    
    # Pick channel
    channel_name, channel_avatar, channel_subs = random.choice(channels)
    
    # Generate title
    title_template = random.choice(titles[category])
    
    # Fill template variables
    day_names = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    sectors = ['IT', 'Pharma', 'Banking', 'Auto', 'FMCG', 'Metals', 'PSU', 'Realty', 'Power', 'Oil & Gas']
    companies = ['TCS', 'Reliance', 'HDFC Bank', 'Infosys', 'ICICI Bank', 'SBI', 'Bharti Airtel', 'ITC', 'Wipro', 'HUL', 'NTPC', 'L&T', 'Axis Bank', 'Maruti', 'Tata Motors', 'Asian Paints', 'Bajaj Finance', 'Adani Ports', 'Titan', 'Sun Pharma']
    company = random.choice(companies)
    stock = random.choice(companies)
    sector = random.choice(sectors)
    value = random.choice(['5000', '10000', '25000', '50000', '1 Lakh', '2 Lakh'])
    n = random.choice(['3', '5', '7', '10'])
    years = random.choice(['2', '3', '5'])
    price = random.choice(['90K', '100K', '110K', '120K', '85K', '95K'])
    tool = random.choice(['Claude', 'Gemini', 'Copilot', 'Perplexity', 'Midjourney'])
    product = random.choice(['iPhone 18', 'MacBook Pro M6', 'iPad Pro M6', 'Apple Watch Ultra 3', 'AirPods Pro 3'])
    model = random.choice(['Cybertruck', 'Model 3 Highland', 'Model Y Juniper', 'Roadster 2.0'])
    num = random.choice(['26', '27'])
    
    title = title_template.format(
        day=random.choice(day_names),
        month=random.choice(months),
        stock=stock, company=company, sector=sector,
        value=value, n=n, years=years,
        price=price, tool=tool, product=product,
        model=model, num=num, quarter=random.choice(['1','2','3','4']),
        investor=random.choice(['Warren Buffett', 'Rakesh Jhunjhunwala', 'Charlie Munger', 'Benjamin Graham', 'Peter Lynch', 'Radhakishan Damani'])
    )
    
    # Generate description
    desc_templates = [
        f"Complete analysis of {title.lower()}. In-depth coverage with expert insights and data-driven conclusions.",
        f"A detailed breakdown of {title.lower()}. Everything you need to know in one video.",
        f"Understanding the latest developments in {category}. Expert analysis and market implications.",
        f"Your go-to guide for {title.lower()}. Actionable insights for investors and traders.",
        f"In this video, we explore {title.lower()} with comprehensive research and real-world examples.",
    ]
    description = random.choice(desc_templates)
    
    # Generate metadata
    views = random_view()
    likes = random_likes(views)
    duration = random_duration(is_short, is_live)
    upload_date = random_upload_date()
    thumbnail = random_thumbnail(category)
    tags = random_tags(category, title, [])
    
    # Quality
    quality = random.choice(['HD', 'HD', 'HD', 'HD', '4K', '4K', '4K', '8K'])
    
    new_videos.append({
        'id': vid_id,
        'title': title,
        'channel': channel_name,
        'channelAvatar': channel_avatar,
        'channelSubs': channel_subs,
        'duration': duration,
        'views': views,
        'uploadDate': f"new Date('{upload_date}').toISOString()",
        'category': category,
        'thumbnail': thumbnail,
        'isLive': is_live,
        'isShort': is_short,
        'isPremium': is_premium,
        'description': description,
        'likes': likes,
        'tags': tags,
        'quality': quality,
    })

# Build output
def format_video(v):
    tags_str = ", ".join(f"'{t}'" for t in v['tags'])
    return f"""    {{ id: '{v['id']}', title: '{v['title']}', channel: '{v['channel']}', channelAvatar: '{v['channelAvatar']}', channelSubs: '{v['channelSubs']}', duration: '{v['duration']}', views: '{v['views']}', uploadDate: {v['uploadDate']}, category: '{v['category']}', thumbnail: '{v['thumbnail']}', isLive: {str(v['isLive']).lower()}, isShort: {str(v['isShort']).lower()}, isPremium: {str(v['isPremium']).lower()}, description: '{v['description']}', likes: '{v['likes']}', tags: [{tags_str}], quality: '{v['quality']}' }}"""

# Build complete file
existing_lines = existing_videos_str.strip().split('\n')
existing_formatted = []
for entry in existing_entries:
    existing_formatted.append("    " + entry.strip())

all_video_entries = existing_formatted + [format_video(v) for v in new_videos]

videos_array_str = ",\n".join(all_video_entries)

output = f"""'use strict';

(function() {{
  var videos = [
{videos_array_str}
  ];

  window.VideosData = {{
    videos: videos,
    getByCategory: function(cat) {{ return videos.filter(function(v) {{ return v.category === cat; }}); }},
    getFeatured: function() {{ return videos.filter(function(v) {{ return parseFloat(v.views) > 5000000; }}); }},
    getShorts: function() {{ return videos.filter(function(v) {{ return v.isShort; }}); }},
    getLive: function() {{ return videos.filter(function(v) {{ return v.isLive; }}); }},
    getRecent: function(n) {{
      n = n || 10;
      return videos.slice().sort(function(a, b) {{ return new Date(b.uploadDate) - new Date(a.uploadDate); }}).slice(0, n);
    }},
    getById: function(id) {{ return videos.find(function(v) {{ return v.id === id; }}); }}
  }};
}})();
"""

with open(r'C:\Users\AICOE 5\Downloads\The Daily Yield\DailyYield\data\videosData.js', 'w', encoding='utf-8') as f:
    f.write(output)

print(f"\nTotal videos written: {len(existing_entries) + len(new_videos)}")
print(f"Existing: {len(existing_entries)}, New: {len(new_videos)}")

# Verify by re-reading and counting
with open(r'C:\Users\AICOE 5\Downloads\The Daily Yield\DailyYield\data\videosData.js', 'r', encoding='utf-8') as f:
    verify = f.read()

verify_count = len(re.findall(r"\{[^{}]*\}", verify))
print(f"Verified count (regex): {verify_count}")

# More accurate count by counting 'id:' occurrences
id_count = len(re.findall(r"id:\s*'v\d+'", verify))
print(f"Verified count (id matches): {id_count}")
