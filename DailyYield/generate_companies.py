import json
import random
import math
import os

random.seed(42)

def mini_chart():
    return [round(random.uniform(0.2, 0.98), 2) for _ in range(30)]

def news():
    options = [
        ["Q4 earnings beat expectations", "New expansion plans announced"],
        ["Revenue growth accelerates", "Analysts raise price targets"],
        ["Strong quarterly results", "Partnership deal signed"],
        ["Market share gains reported", "Dividend increase announced"],
        ["Innovation pipeline strong", "Regulatory approval received"],
        ["Debt reduction progress", "New product launch successful"],
        ["Cost optimization continues", "International expansion planned"],
        ["Cash flow improvement", "Insider buying activity noted"],
        ["Backlog growth strong", "Supply chain improvements"],
        ["Customer acquisition rises", "Technology upgrade completed"],
    ]
    return random.choice(options)

def rec():
    return random.choice(["Strong Buy", "Buy", "Hold", "Sell", "Strong Buy", "Buy", "Buy", "Hold"])

def risk():
    return random.choice(["Low", "Medium", "High", "Medium", "Low", "Medium"])

def sector_rank(sector):
    return random.randint(1, 50)

def industry_rank(ind):
    return random.randint(1, 30)

def make_id(i):
    return f"c{i:03d}"

companies = []

# ============================================================
# ENERGY (35 companies) - IDs c001-c035
# ============================================================
energy_us = [
    ("XOM", "ExxonMobil", "United States", "USD", 104.50, 103.20, 428.5e9, 13.8, 7.57, 3.80, 3.01, 120.70, 68.20, 1.12),
    ("CVX", "Chevron Corporation", "United States", "USD", 155.30, 154.10, 285.2e9, 12.5, 12.42, 6.52, 3.89, 171.70, 101.30, 1.05),
    ("COP", "ConocoPhillips", "United States", "USD", 118.75, 117.40, 138.9e9, 11.2, 10.60, 4.62, 3.55, 130.10, 69.50, 1.18),
    ("SLB", "Schlumberger", "United States", "USD", 52.40, 51.80, 72.1e9, 16.8, 3.12, 2.10, 3.40, 58.90, 30.20, 1.35),
    ("EOG", "EOG Resources", "United States", "USD", 125.60, 124.20, 70.5e9, 10.9, 11.52, 3.96, 3.12, 138.50, 72.40, 1.10),
    ("PXD", "Pioneer Natural Resources", "United States", "USD", 232.40, 230.80, 52.8e9, 12.3, 18.89, 9.20, 3.54, 260.10, 145.20, 1.25),
    ("MPC", "Marathon Petroleum", "United States", "USD", 148.90, 147.50, 55.2e9, 8.5, 17.52, 8.12, 4.82, 162.30, 82.50, 1.42),
    ("PSX", "Phillips 66", "United States", "USD", 132.40, 131.20, 54.8e9, 9.2, 14.39, 5.64, 3.88, 145.80, 75.30, 1.28),
    ("VLO", "Valero Energy", "United States", "USD", 142.80, 141.30, 48.5e9, 7.8, 18.31, 5.92, 3.72, 155.20, 78.40, 1.38),
    ("WMB", "Williams Companies", "United States", "USD", 37.20, 36.80, 44.2e9, 18.5, 2.01, 1.75, 4.12, 40.50, 24.80, 0.85),
    ("OXY", "Occidental Petroleum", "United States", "USD", 62.50, 61.80, 55.8e9, 14.2, 4.40, 2.08, 3.18, 72.80, 35.20, 1.45),
    ("HES", "Hess Corporation", "United States", "USD", 152.30, 151.00, 46.2e9, 11.8, 12.90, 4.35, 2.72, 165.40, 88.50, 1.15),
    ("DVN", "Devon Energy", "United States", "USD", 48.90, 48.20, 30.5e9, 8.2, 5.96, 2.95, 5.28, 58.40, 28.60, 1.55),
    ("FANG", "Diamondback Energy", "United States", "USD", 148.50, 147.10, 26.8e9, 9.5, 15.63, 5.20, 3.12, 162.80, 82.50, 1.22),
    ("HAL", "Halliburton", "United States", "USD", 38.70, 38.10, 33.8e9, 12.8, 3.02, 0.72, 1.62, 43.50, 24.20, 1.42),
    ("BKR", "Baker Hughes", "United States", "USD", 35.40, 34.90, 35.2e9, 22.5, 1.57, 0.82, 2.02, 38.80, 20.50, 1.28),
    ("OKE", "ONEOK", "United States", "USD", 72.80, 72.10, 42.5e9, 14.5, 5.02, 3.95, 4.82, 78.50, 45.20, 0.92),
    ("KMI", "Kinder Morgan", "United States", "USD", 28.50, 28.10, 62.8e9, 20.2, 1.41, 1.15, 3.62, 30.80, 18.50, 0.78),
    ("XLE", "Energy Select SPDR", "United States", "USD", 88.50, 87.80, 35.5e9, 15.2, 5.82, 3.52, 3.42, 95.20, 52.80, 1.15),
    ("MRO", "Marathon Oil", "United States", "USD", 26.80, 26.30, 18.2e9, 10.8, 2.48, 0.72, 2.38, 30.50, 16.20, 1.62),
    ("APA", "APA Corporation", "United States", "USD", 38.20, 37.60, 12.5e9, 8.5, 4.49, 1.20, 2.72, 45.80, 22.50, 1.72),
    ("CTRA", "Coterra Energy", "United States", "USD", 28.40, 27.90, 21.5e9, 11.2, 2.54, 1.42, 4.52, 32.50, 18.80, 1.18),
    ("EQT", "EQT Corporation", "United States", "USD", 42.80, 42.10, 15.8e9, 28.5, 1.50, 0.62, 1.28, 48.50, 22.80, 1.85),
    ("TRGP", "Targa Resources", "United States", "USD", 92.50, 91.20, 20.8e9, 12.8, 7.23, 2.85, 2.78, 98.50, 52.80, 1.12),
    ("WTS", "Watts Water Technologies", "United States", "USD", 182.40, 180.50, 6.2e9, 28.2, 6.47, 3.12, 1.48, 198.50, 112.50, 1.05),
    ("NOG", "Northern Oil and Gas", "United States", "USD", 58.20, 57.40, 4.1e9, 8.8, 6.61, 2.85, 4.52, 65.80, 32.50, 1.48),
    ("SM", "SM Energy", "United States", "USD", 48.50, 47.80, 5.5e9, 7.2, 6.74, 2.82, 5.25, 55.20, 28.50, 1.55),
    ("CRS", "Crescent Energy", "United States", "USD", 18.20, 17.80, 4.2e9, 10.5, 1.73, 0.52, 2.52, 22.50, 10.80, 1.62),
    ("MTDR", "Matador Resources", "United States", "USD", 62.80, 62.10, 7.2e9, 8.8, 7.14, 2.02, 2.82, 68.50, 35.20, 1.35),
    ("CIVI", "Civitas Resources", "United States", "USD", 68.50, 67.40, 5.8e9, 7.5, 9.13, 3.52, 4.55, 75.20, 38.50, 1.42),
    ("PE", "Parsley Energy", "United States", "USD", 28.50, 28.10, 8.5e9, 11.2, 2.54, 1.05, 3.32, 32.80, 16.50, 1.28),
    ("REI", "Ring Energy", "United States", "USD", 5.80, 5.60, 1.2e9, 6.8, 0.85, 0.18, 2.82, 6.80, 2.80, 1.72),
    ("VNOM", "Viper Energy Partners", "United States", "USD", 35.20, 34.60, 3.5e9, 10.2, 3.45, 2.15, 5.52, 40.50, 22.80, 1.18),
]

energy_in = [
    ("RELIANCE", "Reliance Industries", "India", "INR", 2485.50, 2462.30, 16.8e12, 25.2, 98.63, 34.00, 1.28, 2858.00, 1850.00, 0.92),
    ("ONGC", "Oil & Natural Gas Corp", "India", "INR", 265.80, 262.50, 3.35e12, 7.8, 34.08, 12.50, 4.25, 298.50, 152.80, 1.15),
    ("BPCL", "Bharat Petroleum Corp", "India", "INR", 625.40, 618.20, 1.35e12, 5.8, 107.83, 22.00, 3.18, 685.50, 352.80, 1.08),
    ("HINDPETRO", "Hindustan Petroleum", "India", "INR", 385.20, 380.50, 545e9, 6.2, 62.13, 18.50, 4.25, 420.80, 225.50, 1.22),
    ("IOCL", "Indian Oil Corporation", "India", "INR", 175.80, 173.50, 1.25e12, 6.5, 27.05, 8.50, 4.38, 195.20, 105.80, 1.05),
    ("GAIL", "GAIL India", "India", "INR", 198.50, 196.20, 895e9, 9.2, 21.58, 5.80, 2.62, 220.50, 118.80, 1.12),
]

# Add Energy companies
for i, (ticker, name, country, curr, price, prev, mcap, pe, eps, div, dy, h52, l52, beta) in enumerate(energy_us):
    chg = round(price - prev, 2)
    chg_pct = round((chg / prev) * 100, 2)
    vol = random.randint(2000000, 18000000)
    avg_vol = random.randint(3000000, 15000000)
    companies.append({
        "id": make_id(len(companies) + 1),
        "ticker": ticker, "name": name, "sector": "Energy",
        "industry": "Oil & Gas", "country": country, "currency": curr,
        "currentPrice": price, "previousClose": prev, "change": chg, "changePct": chg_pct,
        "open": round(prev + random.uniform(-1, 1), 2), "high": round(price + random.uniform(0.5, 3), 2),
        "low": round(price - random.uniform(0.5, 3), 2), "volume": vol, "avgVolume": avg_vol, "marketCap": mcap,
        "pe": pe, "eps": eps, "dividend": div, "dividendYield": dy,
        "week52High": h52, "week52Low": l52, "beta": beta,
        "rating": rec(), "analystTarget": round(price * random.uniform(1.1, 1.35), 2), "risk": risk(),
        "description": f"{name} is a leading energy company.",
        "logo": random.choice(["⛽", "🛢️", "🔥", "⚡", "💨"]),
        "miniChart": mini_chart(), "relatedNews": news(),
        "recommendation": rec(), "sectorRank": sector_rank("Energy"), "industryRank": industry_rank("Oil & Gas")
    })

for i, (ticker, name, country, curr, price, prev, mcap, pe, eps, div, dy, h52, l52, beta) in enumerate(energy_in):
    chg = round(price - prev, 2)
    chg_pct = round((chg / prev) * 100, 2)
    vol = random.randint(500000, 5000000)
    avg_vol = random.randint(800000, 4000000)
    companies.append({
        "id": make_id(len(companies) + 1),
        "ticker": ticker, "name": name, "sector": "Energy",
        "industry": "Oil & Gas", "country": country, "currency": curr,
        "currentPrice": price, "previousClose": prev, "change": chg, "changePct": chg_pct,
        "open": round(prev + random.uniform(-2, 2), 2), "high": round(price + random.uniform(1, 8), 2),
        "low": round(price - random.uniform(1, 8), 2), "volume": vol, "avgVolume": avg_vol, "marketCap": mcap,
        "pe": pe, "eps": eps, "dividend": div, "dividendYield": dy,
        "week52High": h52, "week52Low": l52, "beta": beta,
        "rating": rec(), "analystTarget": round(price * random.uniform(1.1, 1.35), 2), "risk": risk(),
        "description": f"{name} is a leading Indian energy company.",
        "logo": random.choice(["⛽", "🛢️", "🔥", "⚡"]),
        "miniChart": mini_chart(), "relatedNews": news(),
        "recommendation": rec(), "sectorRank": sector_rank("Energy"), "industryRank": industry_rank("Oil & Gas")
    })

# Pad Energy to 35 with additional companies
extra_energy_us = [
    ("CEIX", "CONSOL Energy", "United States", "USD", 52.80, 52.10, 3.2e9, 6.8, 7.76, 2.80, 4.68, 58.50, 30.20, 1.52),
    ("AR", "Antero Resources", "United States", "USD", 32.50, 31.90, 10.2e9, 12.5, 2.60, 0.28, 0.78, 38.20, 18.50, 1.62),
    ("RRC", "Range Resources", "United States", "USD", 35.80, 35.20, 8.5e9, 15.2, 2.35, 0.56, 1.42, 40.50, 20.80, 1.55),
    ("SWN", "Southwestern Energy", "United States", "USD", 7.20, 7.05, 8.2e9, 22.8, 0.32, 0.28, 3.52, 8.50, 4.20, 1.68),
    ("UPL", "Ultra Petroleum", "United States", "USD", 48.50, 47.80, 2.8e9, 8.2, 5.91, 0.85, 1.58, 55.20, 28.50, 1.72),
    ("ESTE", "Earthstone Energy", "United States", "USD", 14.80, 14.50, 1.5e9, 5.5, 2.69, 0.42, 2.55, 18.20, 8.50, 1.82),
    ("MTDR2", "Matador Midstream", "United States", "USD", 22.50, 22.10, 2.2e9, 12.8, 1.76, 0.62, 2.48, 25.80, 12.50, 1.35),
    ("KRy", "Kincerly Resources", "United States", "USD", 8.50, 8.30, 0.8e9, 9.5, 0.89, 0.15, 1.58, 10.20, 5.20, 1.65),
    ("CHRD", "Chord Energy", "United States", "USD", 165.20, 163.80, 14.5e9, 8.2, 20.15, 6.85, 3.72, 178.50, 95.20, 1.18),
]

# Only add enough to reach 35 total
needed = 35 - len(companies)
for i, (ticker, name, country, curr, price, prev, mcap, pe, eps, div, dy, h52, l52, beta) in enumerate(extra_energy_us[:needed]):
    chg = round(price - prev, 2)
    chg_pct = round((chg / prev) * 100, 2)
    vol = random.randint(1000000, 8000000)
    avg_vol = random.randint(1500000, 6000000)
    companies.append({
        "id": make_id(len(companies) + 1),
        "ticker": ticker, "name": name, "sector": "Energy",
        "industry": "Oil & Gas", "country": country, "currency": curr,
        "currentPrice": price, "previousClose": prev, "change": chg, "changePct": chg_pct,
        "open": round(prev + random.uniform(-0.5, 0.5), 2), "high": round(price + random.uniform(0.5, 2), 2),
        "low": round(price - random.uniform(0.5, 2), 2), "volume": vol, "avgVolume": avg_vol, "marketCap": mcap,
        "pe": pe, "eps": eps, "dividend": div, "dividendYield": dy,
        "week52High": h52, "week52Low": l52, "beta": beta,
        "rating": rec(), "analystTarget": round(price * random.uniform(1.1, 1.3), 2), "risk": risk(),
        "description": f"{name} is a leading energy company.",
        "logo": random.choice(["⛽", "🛢️", "🔥"]),
        "miniChart": mini_chart(), "relatedNews": news(),
        "recommendation": rec(), "sectorRank": sector_rank("Energy"), "industryRank": industry_rank("Oil & Gas")
    })

print(f"After Energy: {len(companies)} companies")

# ============================================================
# TECHNOLOGY (55 companies) - IDs c036 onward
# ============================================================
tech_us = [
    ("AAPL", "Apple Inc.", "United States", "USD", 195.20, 193.80, 3.05e12, 31.2, 6.26, 0.96, 0.44, 199.60, 124.10, 1.22),
    ("MSFT", "Microsoft Corporation", "United States", "USD", 425.50, 423.20, 3.15e12, 35.8, 11.88, 3.32, 0.72, 440.80, 275.50, 1.08),
    ("GOOGL", "Alphabet Inc.", "United States", "USD", 178.40, 176.80, 2.22e12, 25.5, 7.00, 0.80, 0.40, 191.50, 120.20, 1.12),
    ("AMZN", "Amazon.com Inc.", "United States", "USD", 192.80, 191.20, 2.02e12, 58.2, 3.31, 0.00, 0.00, 201.20, 118.50, 1.25),
    ("NVDA", "NVIDIA Corporation", "United States", "USD", 925.40, 918.20, 2.28e12, 68.5, 13.51, 0.16, 0.02, 974.00, 298.50, 1.72),
    ("META", "Meta Platforms Inc.", "United States", "USD", 515.80, 512.40, 1.32e12, 28.5, 18.09, 2.00, 0.35, 542.80, 274.50, 1.32),
    ("TSM", "Taiwan Semiconductor", "Taiwan", "USD", 148.50, 147.10, 768e9, 24.8, 5.99, 2.48, 1.48, 158.20, 84.50, 1.15),
    ("AVGO", "Broadcom Inc.", "United States", "USD", 1325.20, 1318.50, 552e9, 38.2, 34.69, 21.00, 1.42, 1438.50, 658.20, 1.28),
    ("ORCL", "Oracle Corporation", "United States", "USD", 128.40, 127.10, 352e9, 34.5, 3.72, 1.60, 1.18, 132.50, 72.80, 1.12),
    ("CRM", "Salesforce Inc.", "United States", "USD", 298.50, 296.20, 288e9, 48.2, 6.19, 0.00, 0.00, 318.50, 162.50, 1.28),
    ("AMD", "Advanced Micro Devices", "United States", "USD", 178.20, 176.50, 288e9, 38.5, 4.63, 0.00, 0.00, 227.50, 93.50, 1.78),
    ("INTC", "Intel Corporation", "United States", "USD", 43.50, 42.80, 182e9, 108.2, 0.40, 0.50, 1.02, 51.20, 26.80, 1.08),
    ("CSCO", "Cisco Systems", "United States", "USD", 50.80, 50.20, 202e9, 14.5, 3.50, 1.62, 3.02, 58.20, 36.50, 0.82),
    ("ADBE", "Adobe Inc.", "United States", "USD", 572.80, 568.50, 255e9, 42.5, 13.48, 0.00, 0.00, 638.50, 328.50, 1.22),
    ("NFLX", "Netflix Inc.", "United States", "USD", 628.50, 624.20, 275e9, 45.2, 13.90, 0.00, 0.00, 639.50, 345.20, 1.35),
    ("QCOM", "Qualcomm Inc.", "United States", "USD", 168.50, 167.10, 188e9, 22.8, 7.39, 3.40, 1.88, 178.20, 105.50, 1.18),
    ("TXN", "Texas Instruments", "United States", "USD", 172.40, 171.20, 158e9, 28.5, 6.05, 5.20, 2.72, 188.50, 108.20, 1.05),
    ("IBM", "IBM Corporation", "United States", "USD", 192.80, 191.50, 178e9, 22.5, 8.57, 6.64, 3.22, 199.50, 120.80, 0.85),
    ("NOW", "ServiceNow Inc.", "United States", "USD", 785.20, 778.50, 162e9, 82.5, 9.52, 0.00, 0.00, 815.50, 428.50, 1.28),
    ("INTU", "Intuit Inc.", "United States", "USD", 628.50, 624.20, 178e9, 48.2, 13.04, 3.60, 0.52, 652.80, 388.50, 1.12),
    ("AMAT", "Applied Materials", "United States", "USD", 178.40, 176.80, 148e9, 25.8, 6.91, 1.36, 0.68, 192.50, 105.20, 1.42),
    ("MU", "Micron Technology", "United States", "USD", 98.50, 97.20, 108e9, 18.5, 5.32, 0.48, 0.42, 105.80, 48.50, 1.68),
    ("LRCX", "Lam Research", "United States", "USD", 785.20, 778.50, 102e9, 26.5, 29.63, 8.20, 0.88, 828.50, 452.80, 1.35),
    ("KLAC", "KLA Corporation", "United States", "USD", 628.40, 624.50, 85e9, 24.2, 25.97, 6.80, 0.98, 685.20, 388.50, 1.28),
    ("SNPS", "Synopsys Inc.", "United States", "USD", 585.20, 580.80, 88e9, 58.2, 10.05, 0.00, 0.00, 628.50, 348.50, 1.18),
    ("CDNS", "Cadence Design Systems", "United States", "USD", 312.80, 310.50, 85e9, 62.5, 5.00, 0.00, 0.00, 328.50, 188.50, 1.22),
    ("PANW", "Palo Alto Networks", "United States", "USD", 342.50, 339.80, 112e9, 48.2, 7.10, 0.00, 0.00, 380.50, 185.20, 1.32),
    ("MRVL", "Marvell Technology", "United States", "USD", 72.40, 71.50, 62e9, 42.5, 1.70, 0.24, 0.28, 85.20, 38.50, 1.55),
    ("FTNT", "Fortinet Inc.", "United States", "USD", 78.50, 77.20, 62e9, 48.2, 1.63, 0.00, 0.00, 88.50, 42.80, 1.18),
    ("APH", "Amphenol Corporation", "United States", "USD", 98.50, 97.20, 58e9, 32.5, 3.03, 0.82, 0.75, 105.20, 58.50, 1.25),
    ("NXPI", "NXP Semiconductors", "Netherlands", "USD", 258.40, 256.10, 65e9, 22.8, 11.33, 4.12, 1.48, 272.50, 155.20, 1.18),
    ("MSI", "Motorola Solutions", "United States", "USD", 342.80, 340.10, 58e9, 38.2, 8.97, 3.52, 0.92, 358.50, 218.50, 1.05),
    ("ADSK", "Autodesk Inc.", "United States", "USD", 252.40, 250.10, 55e9, 52.8, 4.78, 0.00, 0.00, 278.50, 158.50, 1.22),
    ("WDAY", "Workday Inc.", "United States", "USD", 268.50, 265.80, 68e9, 45.2, 5.94, 0.00, 0.00, 282.50, 152.50, 1.28),
    ("TEAM", "Atlassian Corporation", "Australia", "USD", 198.20, 196.50, 52e9, 125.2, 1.58, 0.00, 0.00, 215.80, 115.50, 1.32),
    ("DELL", "Dell Technologies", "United States", "USD", 128.40, 127.10, 88e9, 18.5, 6.94, 1.68, 1.22, 138.50, 62.80, 1.45),
    ("HPE", "Hewlett Packard Enterprise", "United States", "USD", 18.50, 18.20, 24e9, 12.8, 1.45, 0.52, 2.52, 20.50, 10.80, 1.15),
    ("HPQ", "HP Inc.", "United States", "USD", 32.80, 32.30, 32e9, 10.5, 3.12, 1.02, 2.82, 38.50, 22.50, 0.92),
    ("MCHP", "Microchip Technology", "United States", "USD", 92.50, 91.20, 48e9, 18.2, 5.08, 1.62, 1.58, 105.80, 52.80, 1.32),
    ("ANSS", "ANSYS Inc.", "United States", "USD", 342.80, 340.10, 30e9, 52.5, 6.53, 0.00, 0.00, 365.20, 218.50, 1.12),
    ("KEYS", "Keysight Technologies", "United States", "USD", 158.40, 156.80, 28e9, 32.2, 4.92, 1.82, 1.05, 172.50, 105.20, 1.18),
    ("TTWO", "Take-Two Interactive", "United States", "USD", 178.50, 176.80, 30e9, 42.8, 4.17, 0.00, 0.00, 192.50, 115.20, 1.25),
    ("OKTA", "Okta Inc.", "United States", "USD", 82.40, 81.50, 14e9, 525.2, 0.16, 0.00, 0.00, 98.50, 42.80, 1.42),
    ("DDOG", "Datadog Inc.", "United States", "USD", 128.50, 127.20, 42e9, 385.2, 0.33, 0.00, 0.00, 138.50, 72.50, 1.32),
    ("NET", "Cloudflare Inc.", "United States", "USD", 92.40, 91.50, 32e9, 885.2, 0.10, 0.00, 0.00, 105.20, 45.80, 1.45),
    ("UBER", "Uber Technologies", "United States", "USD", 78.50, 77.20, 165e9, 28.5, 2.75, 0.00, 0.00, 82.50, 42.80, 1.32),
    ("ABNB", "Airbnb Inc.", "United States", "USD", 162.40, 160.80, 72e9, 38.2, 4.25, 0.00, 0.00, 175.50, 98.50, 1.28),
    ("SNOW", "Snowflake Inc.", "United States", "USD", 178.50, 176.20, 58e9, 285.2, 0.63, 0.00, 0.00, 195.20, 108.50, 1.52),
    ("PLTR", "Palantir Technologies", "United States", "USD", 22.80, 22.40, 48e9, 72.5, 0.31, 0.00, 0.00, 24.50, 8.80, 1.82),
]

tech_in = [
    ("TCS", "Tata Consultancy Services", "India", "INR", 3985.20, 3962.50, 14.5e12, 32.5, 122.62, 115.00, 2.58, 4258.50, 2852.80, 0.72),
    ("INFY", "Infosys Limited", "India", "INR", 1528.40, 1515.20, 6.35e12, 28.8, 53.07, 34.00, 2.08, 1682.50, 1185.20, 0.82),
    ("WIPRO", "Wipro Limited", "India", "INR", 485.20, 480.50, 2.52e12, 22.5, 21.56, 22.00, 4.12, 558.50, 352.80, 0.85),
    ("HCLTECH", "HCL Technologies", "India", "INR", 1428.50, 1415.20, 3.88e12, 25.8, 55.37, 48.00, 3.15, 1582.80, 952.50, 0.92),
    ("TECHM", "Tech Mahindra", "India", "INR", 1285.40, 1272.80, 1.25e12, 32.2, 39.92, 28.00, 1.98, 1385.20, 885.50, 0.95),
    ("LTIM", "LTIMindtree", "India", "INR", 5285.20, 5252.80, 1.55e12, 35.5, 148.87, 45.00, 0.82, 5852.80, 3528.50, 1.02),
    ("MPHASIS", "Mphasis Limited", "India", "INR", 2585.40, 2562.80, 485e9, 28.2, 91.68, 38.00, 1.35, 2852.50, 1685.20, 0.98),
    ("PERSISTENT", "Persistent Systems", "India", "INR", 5125.80, 5082.50, 385e9, 42.5, 120.61, 22.00, 0.42, 5552.50, 2852.80, 1.12),
    ("COFORGE", "Coforge Limited", "India", "INR", 5852.40, 5812.50, 358e9, 32.8, 178.42, 32.00, 0.52, 6252.80, 3582.50, 1.08),
    ("BSOFT", "Birlasoft Limited", "India", "INR", 685.20, 678.50, 188e9, 25.2, 27.19, 12.00, 1.58, 752.50, 385.20, 1.15),
    ("POLYCAB", "Polycab India", "India", "INR", 6528.40, 6485.20, 982e9, 38.5, 169.57, 18.00, 0.25, 7052.50, 3852.80, 1.05),
]

for i, (ticker, name, country, curr, price, prev, mcap, pe, eps, div, dy, h52, l52, beta) in enumerate(tech_us):
    chg = round(price - prev, 2)
    chg_pct = round((chg / prev) * 100, 2)
    vol = random.randint(3000000, 45000000)
    avg_vol = random.randint(5000000, 35000000)
    companies.append({
        "id": make_id(len(companies) + 1),
        "ticker": ticker, "name": name, "sector": "Technology",
        "industry": "Software & Services", "country": country, "currency": curr,
        "currentPrice": price, "previousClose": prev, "change": chg, "changePct": chg_pct,
        "open": round(prev + random.uniform(-1, 1), 2), "high": round(price + random.uniform(0.5, 3), 2),
        "low": round(price - random.uniform(0.5, 3), 2), "volume": vol, "avgVolume": avg_vol, "marketCap": mcap,
        "pe": pe, "eps": eps, "dividend": div, "dividendYield": dy,
        "week52High": h52, "week52Low": l52, "beta": beta,
        "rating": rec(), "analystTarget": round(price * random.uniform(1.1, 1.35), 2), "risk": risk(),
        "description": f"{name} is a leading technology company.",
        "logo": random.choice(["💻", "🖥️", "📱", "🔧", "💡"]),
        "miniChart": mini_chart(), "relatedNews": news(),
        "recommendation": rec(), "sectorRank": sector_rank("Technology"), "industryRank": industry_rank("Software & Services")
    })

for i, (ticker, name, country, curr, price, prev, mcap, pe, eps, div, dy, h52, l52, beta) in enumerate(tech_in):
    chg = round(price - prev, 2)
    chg_pct = round((chg / prev) * 100, 2)
    vol = random.randint(300000, 3500000)
    avg_vol = random.randint(500000, 2800000)
    companies.append({
        "id": make_id(len(companies) + 1),
        "ticker": ticker, "name": name, "sector": "Technology",
        "industry": "IT Services", "country": country, "currency": curr,
        "currentPrice": price, "previousClose": prev, "change": chg, "changePct": chg_pct,
        "open": round(prev + random.uniform(-5, 5), 2), "high": round(price + random.uniform(5, 20), 2),
        "low": round(price - random.uniform(5, 20), 2), "volume": vol, "avgVolume": avg_vol, "marketCap": mcap,
        "pe": pe, "eps": eps, "dividend": div, "dividendYield": dy,
        "week52High": h52, "week52Low": l52, "beta": beta,
        "rating": rec(), "analystTarget": round(price * random.uniform(1.1, 1.35), 2), "risk": risk(),
        "description": f"{name} is a leading Indian IT services company.",
        "logo": random.choice(["💻", "🖥️", "📱", "🔧"]),
        "miniChart": mini_chart(), "relatedNews": news(),
        "recommendation": rec(), "sectorRank": sector_rank("Technology"), "industryRank": industry_rank("IT Services")
    })

print(f"After Technology: {len(companies)} companies")

# ============================================================
# HEALTHCARE (40 companies)
# ============================================================
health_us = [
    ("JNJ", "Johnson & Johnson", "United States", "USD", 158.40, 157.10, 380e9, 10.8, 14.67, 4.76, 2.82, 175.50, 121.50, 0.55),
    ("UNH", "UnitedHealth Group", "United States", "USD", 528.50, 524.20, 485e9, 22.5, 23.49, 7.52, 1.28, 558.20, 436.50, 0.72),
    ("PFE", "Pfizer Inc.", "United States", "USD", 28.40, 28.10, 158e9, 18.2, 1.56, 1.68, 5.55, 33.50, 22.80, 0.62),
    ("MRK", "Merck & Co.", "United States", "USD", 125.80, 124.50, 318e9, 15.8, 7.96, 3.08, 2.28, 134.50, 99.50, 0.58),
    ("ABBV", "AbbVie Inc.", "United States", "USD", 172.40, 171.10, 305e9, 14.2, 12.14, 6.28, 3.35, 182.50, 130.50, 0.68),
    ("LLY", "Eli Lilly & Co.", "United States", "USD", 785.20, 778.50, 748e9, 108.5, 7.24, 5.20, 0.58, 808.50, 468.50, 0.48),
    ("TMO", "Thermo Fisher Scientific", "United States", "USD", 572.80, 568.50, 218e9, 35.2, 16.27, 3.92, 0.62, 602.50, 412.80, 0.82),
    ("ABT", "Abbott Laboratories", "United States", "USD", 112.40, 111.50, 195e9, 28.5, 3.94, 1.92, 1.58, 118.50, 78.50, 0.72),
    ("DHR", "Danaher Corporation", "United States", "USD", 252.40, 250.10, 188e9, 42.8, 5.89, 0.98, 0.35, 278.50, 182.50, 0.88),
    ("BMY", "Bristol-Myers Squibb", "United States", "USD", 52.80, 52.10, 108e9, 15.2, 3.47, 2.40, 4.28, 62.50, 38.50, 0.55),
    ("AMGN", "Amgen Inc.", "United States", "USD", 282.50, 280.10, 152e9, 18.5, 15.27, 8.82, 2.92, 312.50, 212.80, 0.62),
    ("GILD", "Gilead Sciences", "United States", "USD", 78.40, 77.50, 98e9, 12.8, 6.12, 3.08, 3.58, 88.50, 58.50, 0.68),
    ("ISRG", "Intuitive Surgical", "United States", "USD", 398.50, 395.20, 178e9, 68.2, 5.84, 0.00, 0.00, 412.50, 228.50, 1.42),
    ("MDT", "Medtronic PLC", "United States", "USD", 82.40, 81.80, 108e9, 24.5, 3.36, 2.88, 3.22, 92.50, 68.50, 0.68),
    ("SYK", "Stryker Corporation", "United States", "USD", 342.80, 340.10, 132e9, 38.2, 8.97, 3.20, 0.82, 358.50, 228.50, 0.92),
    ("BSX", "Boston Scientific", "United States", "USD", 68.50, 67.80, 98e9, 48.2, 1.42, 0.00, 0.00, 72.50, 42.80, 1.05),
    ("REGN", "Regeneron Pharmaceuticals", "United States", "USD", 985.20, 978.50, 108e9, 22.5, 43.79, 0.00, 0.00, 1028.50, 712.50, 0.82),
    ("VRTX", "Vertex Pharmaceuticals", "United States", "USD", 428.50, 425.20, 112e9, 28.5, 15.03, 0.00, 0.00, 448.50, 285.50, 0.92),
    ("BIIB", "Biogen Inc.", "United States", "USD", 228.40, 225.80, 32e9, 15.8, 14.46, 0.00, 0.00, 268.50, 182.50, 0.82),
    ("ZTS", "Zoetis Inc.", "United States", "USD", 178.50, 176.80, 82e9, 35.2, 5.07, 1.72, 0.88, 198.50, 128.50, 0.82),
    ("CI", "Cigna Group", "United States", "USD", 328.40, 325.80, 92e9, 12.5, 26.27, 4.88, 1.35, 358.50, 248.50, 0.72),
    ("ELV", "Elevance Health", "United States", "USD", 472.80, 468.50, 112e9, 18.2, 25.98, 5.80, 1.12, 512.50, 382.50, 0.68),
    ("HCA", "HCA Healthcare", "United States", "USD", 298.50, 295.20, 78e9, 10.2, 29.26, 4.80, 1.48, 318.50, 208.50, 1.28),
    ("CNC", "Centene Corporation", "United States", "USD", 78.40, 77.50, 42e9, 12.8, 6.12, 0.00, 0.00, 82.50, 52.80, 0.85),
    ("MRNA", "Moderna Inc.", "United States", "USD", 98.50, 97.20, 38e9, 8.5, 11.59, 0.00, 0.00, 128.50, 62.50, 1.52),
    ("ILMN", "Illumina Inc.", "United States", "USD", 128.40, 127.10, 20e9, 352.5, 0.36, 0.00, 0.00, 158.50, 82.50, 1.15),
    ("GWPH", "GW Pharmaceuticals", "United Kingdom", "USD", 18.50, 18.20, 6.5e9, 42.5, 0.44, 0.00, 0.00, 22.50, 8.50, 1.28),
    ("ALNY", "Alnylam Pharmaceuticals", "United States", "USD", 218.40, 215.80, 28e9, 485.2, 0.45, 0.00, 0.00, 238.50, 128.50, 1.08),
    ("BMRN", "BioMarin Pharmaceutical", "United States", "USD", 88.50, 87.20, 16e9, 38.2, 2.32, 0.00, 0.00, 95.50, 52.80, 0.92),
    ("SRPT", "Sarepta Therapeutics", "United States", "USD", 128.40, 126.50, 12e9, 42.8, 2.95, 0.00, 0.00, 142.50, 62.50, 1.18),
    ("EXAS", "Exact Sciences", "United States", "USD", 72.40, 71.50, 14e9, 325.2, 0.22, 0.00, 0.00, 82.50, 42.80, 1.22),
    ("GEN", "Gen Digital Inc.", "United States", "USD", 22.80, 22.40, 14.5e9, 14.2, 1.61, 0.52, 2.12, 25.80, 14.50, 0.82),
    ("NVCR", "NovoCure Limited", "United States", "USD", 82.40, 81.20, 8.2e9, 125.2, 0.66, 0.00, 0.00, 92.50, 42.80, 1.35),
    ("PODD", "Insulet Corporation", "United States", "USD", 178.50, 176.80, 25e9, 62.5, 2.86, 0.00, 0.00, 198.50, 108.50, 1.22),
    ("DXCM", "DexCom Inc.", "United States", "USD", 128.40, 127.10, 50e9, 82.5, 1.56, 0.00, 0.00, 142.50, 62.50, 1.35),
    ("HOLX", "Hologic Inc.", "United States", "USD", 78.50, 77.20, 18e9, 22.5, 3.49, 0.00, 0.00, 82.50, 48.50, 0.88),
    ("TECH", "Bio-Techne Corp", "United States", "USD", 72.40, 71.50, 11.5e9, 38.2, 1.90, 1.32, 1.62, 78.50, 42.80, 1.12),
    ("IQV", "IQVIA Holdings", "United States", "USD", 228.50, 226.10, 42e9, 32.5, 7.03, 0.00, 0.00, 248.50, 168.50, 1.08),
]

health_in = [
    ("SUNPHARMA", "Sun Pharmaceutical", "India", "INR", 1185.40, 1172.80, 2.82e12, 32.8, 36.14, 14.00, 1.08, 1285.20, 885.50, 0.72),
    ("DRREDDY", "Dr. Reddy's Laboratories", "India", "INR", 5852.40, 5812.50, 982e9, 18.2, 321.55, 48.00, 0.78, 6252.50, 3852.80, 0.65),
    ("CIPLA", "Cipla Limited", "India", "INR", 1428.50, 1415.20, 1.15e12, 28.5, 50.12, 16.00, 1.02, 1552.50, 985.20, 0.78),
    ("DIVISLAB", "Divi's Laboratories", "India", "INR", 3852.40, 3828.50, 1.02e12, 42.5, 90.64, 32.00, 0.78, 4252.80, 2685.20, 0.82),
    ("LUPIN", "Lupin Limited", "India", "INR", 1985.20, 1968.50, 925e9, 22.8, 87.07, 22.00, 1.02, 2152.50, 1152.80, 0.85),
    ("AUROPHARMA", "Aurobindo Pharma", "India", "INR", 1185.40, 1172.80, 685e9, 18.5, 64.07, 16.00, 1.28, 1352.50, 785.20, 0.92),
    ("TORNTPHARM", "Torrent Pharmaceuticals", "India", "INR", 2852.40, 2828.50, 958e9, 38.2, 74.68, 22.00, 0.72, 3152.50, 1885.20, 0.62),
    ("ALKEM", "Alkem Laboratories", "India", "INR", 5125.80, 5082.50, 625e9, 42.5, 120.61, 28.00, 0.52, 5552.50, 3252.80, 0.72),
]

for i, (ticker, name, country, curr, price, prev, mcap, pe, eps, div, dy, h52, l52, beta) in enumerate(health_us):
    chg = round(price - prev, 2)
    chg_pct = round((chg / prev) * 100, 2)
    vol = random.randint(1000000, 18000000)
    avg_vol = random.randint(2000000, 12000000)
    companies.append({
        "id": make_id(len(companies) + 1),
        "ticker": ticker, "name": name, "sector": "Healthcare",
        "industry": "Pharmaceuticals", "country": country, "currency": curr,
        "currentPrice": price, "previousClose": prev, "change": chg, "changePct": chg_pct,
        "open": round(prev + random.uniform(-1, 1), 2), "high": round(price + random.uniform(0.5, 3), 2),
        "low": round(price - random.uniform(0.5, 3), 2), "volume": vol, "avgVolume": avg_vol, "marketCap": mcap,
        "pe": pe, "eps": eps, "dividend": div, "dividendYield": dy,
        "week52High": h52, "week52Low": l52, "beta": beta,
        "rating": rec(), "analystTarget": round(price * random.uniform(1.1, 1.35), 2), "risk": risk(),
        "description": f"{name} is a leading healthcare company.",
        "logo": random.choice(["💊", "🏥", "🩺", "💉", "🧬"]),
        "miniChart": mini_chart(), "relatedNews": news(),
        "recommendation": rec(), "sectorRank": sector_rank("Healthcare"), "industryRank": industry_rank("Pharmaceuticals")
    })

for i, (ticker, name, country, curr, price, prev, mcap, pe, eps, div, dy, h52, l52, beta) in enumerate(health_in):
    chg = round(price - prev, 2)
    chg_pct = round((chg / prev) * 100, 2)
    vol = random.randint(200000, 2500000)
    avg_vol = random.randint(300000, 2000000)
    companies.append({
        "id": make_id(len(companies) + 1),
        "ticker": ticker, "name": name, "sector": "Healthcare",
        "industry": "Pharmaceuticals", "country": country, "currency": curr,
        "currentPrice": price, "previousClose": prev, "change": chg, "changePct": chg_pct,
        "open": round(prev + random.uniform(-5, 5), 2), "high": round(price + random.uniform(5, 25), 2),
        "low": round(price - random.uniform(5, 25), 2), "volume": vol, "avgVolume": avg_vol, "marketCap": mcap,
        "pe": pe, "eps": eps, "dividend": div, "dividendYield": dy,
        "week52High": h52, "week52Low": l52, "beta": beta,
        "rating": rec(), "analystTarget": round(price * random.uniform(1.1, 1.35), 2), "risk": risk(),
        "description": f"{name} is a leading Indian pharmaceutical company.",
        "logo": random.choice(["💊", "🏥", "🩺", "💉"]),
        "miniChart": mini_chart(), "relatedNews": news(),
        "recommendation": rec(), "sectorRank": sector_rank("Healthcare"), "industryRank": industry_rank("Pharmaceuticals")
    })

print(f"After Healthcare: {len(companies)} companies")

# ============================================================
# FINANCIAL SERVICES (45 companies)
# ============================================================
fin_us = [
    ("JPM", "JPMorgan Chase & Co.", "United States", "USD", 198.40, 196.80, 572e9, 11.8, 16.81, 4.60, 2.15, 208.50, 135.20, 1.12),
    ("BAC", "Bank of America", "United States", "USD", 38.50, 38.10, 302e9, 10.5, 3.67, 0.92, 2.22, 42.50, 24.80, 1.25),
    ("WFC", "Wells Fargo & Co.", "United States", "USD", 58.40, 57.80, 202e9, 10.8, 5.41, 1.40, 2.25, 62.50, 38.50, 1.15),
    ("GS", "Goldman Sachs", "United States", "USD", 458.50, 455.20, 152e9, 15.2, 30.16, 12.00, 2.28, 485.20, 285.50, 1.35),
    ("MS", "Morgan Stanley", "United States", "USD", 92.40, 91.50, 148e9, 14.8, 6.24, 3.40, 3.38, 102.50, 62.80, 1.22),
    ("C", "Citigroup Inc.", "United States", "USD", 58.50, 57.80, 112e9, 9.5, 6.16, 2.08, 3.32, 65.20, 38.50, 1.35),
    ("V", "Visa Inc.", "United States", "USD", 285.40, 283.10, 582e9, 30.2, 9.45, 2.08, 0.68, 298.50, 208.50, 1.02),
    ("MA", "Mastercard Inc.", "United States", "USD", 472.80, 468.50, 438e9, 35.2, 13.43, 2.28, 0.45, 492.50, 348.50, 1.08),
    ("BRK.B", "Berkshire Hathaway B", "United States", "USD", 412.50, 409.80, 885e9, 9.2, 44.84, 0.00, 0.00, 438.50, 298.50, 0.85),
    ("AXP", "American Express", "United States", "USD", 228.50, 226.10, 168e9, 18.5, 12.35, 2.40, 0.98, 242.50, 148.50, 1.18),
    ("BLK", "BlackRock Inc.", "United States", "USD", 828.50, 822.40, 122e9, 22.8, 36.34, 16.80, 1.82, 885.20, 588.50, 1.15),
    ("SCHW", "Charles Schwab", "United States", "USD", 72.40, 71.50, 132e9, 28.5, 2.54, 0.82, 1.02, 78.50, 42.80, 1.12),
    ("CB", "Chubb Limited", "United States", "USD", 258.40, 256.10, 105e9, 10.8, 23.93, 3.52, 1.28, 272.50, 185.50, 0.72),
    ("PGR", "Progressive Corporation", "United States", "USD", 178.50, 176.80, 102e9, 12.5, 14.28, 1.62, 0.82, 198.50, 118.50, 0.92),
    ("MMC", "Marsh & McLennan", "United States", "USD", 212.40, 210.50, 108e9, 28.2, 7.53, 2.88, 1.28, 222.50, 162.50, 0.82),
    ("AON", "Aon PLC", "United States", "USD", 328.50, 325.80, 72e9, 25.8, 12.73, 2.52, 0.72, 352.50, 238.50, 0.92),
    ("TFC", "Truist Financial", "United States", "USD", 38.40, 38.10, 52e9, 8.5, 4.52, 1.68, 4.08, 42.50, 25.80, 1.08),
    ("USB", "U.S. Bancorp", "United States", "USD", 42.80, 42.20, 62e9, 9.2, 4.65, 1.48, 3.28, 48.50, 28.50, 1.12),
    ("PNC", "PNC Financial Services", "United States", "USD", 168.40, 166.80, 68e9, 11.5, 14.64, 5.20, 2.82, 178.50, 108.50, 1.12),
    ("CFG", "Citizens Financial Group", "United States", "USD", 38.40, 38.10, 18e9, 9.2, 4.17, 1.68, 4.02, 42.50, 22.50, 1.22),
    ("CME", "CME Group", "United States", "USD", 212.40, 210.50, 75e9, 22.5, 9.44, 4.12, 1.82, 225.50, 162.50, 0.72),
    ("ICE", "Intercontinental Exchange", "United States", "USD", 138.50, 136.80, 78e9, 32.2, 4.30, 1.82, 1.22, 148.50, 98.50, 1.05),
    ("LULU", "Lululemon Athletica", "Canada", "USD", 428.50, 425.20, 55e9, 35.8, 11.97, 0.00, 0.00, 485.20, 285.50, 1.32),
    ("COIN", "Coinbase Global", "United States", "USD", 228.40, 225.80, 55e9, 22.5, 10.15, 0.00, 0.00, 252.50, 82.50, 2.52),
    ("SQ", "Block Inc.", "United States", "USD", 78.50, 77.20, 48e9, 85.2, 0.92, 0.00, 0.00, 85.50, 42.80, 2.22),
    ("PYPL", "PayPal Holdings", "United States", "USD", 68.40, 67.50, 72e9, 15.2, 4.50, 0.00, 0.00, 78.50, 50.50, 1.42),
    ("DFS", "Discover Financial", "United States", "USD", 128.40, 127.10, 35e9, 8.8, 14.59, 2.80, 1.98, 138.50, 88.50, 1.18),
    ("FIS", "Fidelity National Info", "United States", "USD", 72.50, 71.80, 42e9, 28.5, 2.54, 1.82, 2.32, 78.50, 42.80, 1.12),
    ("SPGI", "S&P Global Inc.", "United States", "USD", 458.20, 455.10, 142e9, 32.5, 14.10, 3.52, 0.68, 482.50, 318.50, 1.05),
    ("MCO", "Moody's Corporation", "United States", "USD", 428.50, 425.20, 78e9, 35.2, 12.17, 3.28, 0.68, 452.50, 298.50, 1.08),
    ("FDS", "FactSet Research", "United States", "USD", 458.20, 455.10, 17e9, 32.8, 13.97, 4.12, 0.82, 482.50, 318.50, 0.85),
]

fin_in = [
    ("HDFCBANK", "HDFC Bank", "India", "INR", 1652.40, 1638.50, 12.5e12, 18.8, 87.89, 76.00, 1.22, 1798.50, 1258.20, 0.82),
    ("ICICIBANK", "ICICI Bank", "India", "INR", 1125.80, 1115.20, 7.85e12, 18.2, 61.85, 8.50, 0.68, 1252.50, 752.80, 0.92),
    ("SBIN", "State Bank of India", "India", "INR", 785.40, 778.50, 6.95e12, 10.5, 74.80, 14.80, 1.72, 825.50, 485.20, 1.05),
    ("KOTAKBANK", "Kotak Mahindra Bank", "India", "INR", 1785.20, 1768.50, 3.52e12, 22.5, 79.34, 8.00, 0.42, 1952.50, 1485.20, 0.88),
    ("AXISBANK", "Axis Bank", "India", "INR", 1128.40, 1118.50, 3.52e12, 12.8, 88.16, 0.00, 0.00, 1252.80, 752.50, 1.08),
    ("INDUSINDBK", "IndusInd Bank", "India", "INR", 1452.80, 1438.50, 1.12e12, 12.5, 116.22, 22.00, 1.38, 1585.20, 885.50, 1.15),
    ("BajajFinance", "Bajaj Finance", "India", "INR", 7125.40, 7052.80, 4.38e12, 32.5, 219.24, 44.00, 0.55, 8052.50, 5528.50, 1.22),
    ("BAJAJFINSV", "Bajaj Finserv", "India", "INR", 1652.80, 1638.50, 2.62e12, 28.2, 58.61, 12.00, 0.68, 1852.50, 1085.20, 1.18),
    ("HDFCLIFE", "HDFC Life Insurance", "India", "INR", 685.40, 678.50, 1.48e12, 72.5, 9.45, 7.50, 0.98, 752.50, 485.20, 0.72),
    ("SBILIFE", "SBI Life Insurance", "India", "INR", 1525.80, 1512.50, 1.52e12, 48.5, 31.46, 12.00, 0.72, 1685.20, 1085.50, 0.78),
    ("ICICIPRULI", "ICICI Prudential Life", "India", "INR", 585.20, 578.50, 595e9, 42.8, 13.67, 4.80, 0.78, 652.50, 385.20, 0.82),
    ("PNB", "Punjab National Bank", "India", "INR", 112.40, 110.80, 1.22e12, 6.8, 16.53, 3.85, 3.22, 125.50, 52.80, 1.22),
    ("BANKBARODA", "Bank of Baroda", "India", "INR", 258.40, 255.20, 1.32e12, 6.2, 41.68, 7.50, 2.72, 285.50, 128.50, 1.18),
    ("IDFCFIRSTB", "IDFC First Bank", "India", "INR", 78.50, 77.20, 578e9, 18.5, 4.24, 0.62, 0.72, 92.50, 42.80, 1.28),
]

for i, (ticker, name, country, curr, price, prev, mcap, pe, eps, div, dy, h52, l52, beta) in enumerate(fin_us):
    chg = round(price - prev, 2)
    chg_pct = round((chg / prev) * 100, 2)
    vol = random.randint(2000000, 20000000)
    avg_vol = random.randint(3000000, 15000000)
    companies.append({
        "id": make_id(len(companies) + 1),
        "ticker": ticker, "name": name, "sector": "Financial Services",
        "industry": "Banking & Finance", "country": country, "currency": curr,
        "currentPrice": price, "previousClose": prev, "change": chg, "changePct": chg_pct,
        "open": round(prev + random.uniform(-1, 1), 2), "high": round(price + random.uniform(0.5, 3), 2),
        "low": round(price - random.uniform(0.5, 3), 2), "volume": vol, "avgVolume": avg_vol, "marketCap": mcap,
        "pe": pe, "eps": eps, "dividend": div, "dividendYield": dy,
        "week52High": h52, "week52Low": l52, "beta": beta,
        "rating": rec(), "analystTarget": round(price * random.uniform(1.1, 1.35), 2), "risk": risk(),
        "description": f"{name} is a leading financial services company.",
        "logo": random.choice(["🏦", "💰", "📈", "💎", "💵"]),
        "miniChart": mini_chart(), "relatedNews": news(),
        "recommendation": rec(), "sectorRank": sector_rank("Financial Services"), "industryRank": industry_rank("Banking & Finance")
    })

for i, (ticker, name, country, curr, price, prev, mcap, pe, eps, div, dy, h52, l52, beta) in enumerate(fin_in):
    chg = round(price - prev, 2)
    chg_pct = round((chg / prev) * 100, 2)
    vol = random.randint(500000, 8000000)
    avg_vol = random.randint(800000, 6000000)
    companies.append({
        "id": make_id(len(companies) + 1),
        "ticker": ticker, "name": name, "sector": "Financial Services",
        "industry": "Banking & Finance", "country": country, "currency": curr,
        "currentPrice": price, "previousClose": prev, "change": chg, "changePct": chg_pct,
        "open": round(prev + random.uniform(-3, 3), 2), "high": round(price + random.uniform(3, 15), 2),
        "low": round(price - random.uniform(3, 15), 2), "volume": vol, "avgVolume": avg_vol, "marketCap": mcap,
        "pe": pe, "eps": eps, "dividend": div, "dividendYield": dy,
        "week52High": h52, "week52Low": l52, "beta": beta,
        "rating": rec(), "analystTarget": round(price * random.uniform(1.1, 1.35), 2), "risk": risk(),
        "description": f"{name} is a leading Indian financial services company.",
        "logo": random.choice(["🏦", "💰", "📈", "💎"]),
        "miniChart": mini_chart(), "relatedNews": news(),
        "recommendation": rec(), "sectorRank": sector_rank("Financial Services"), "industryRank": industry_rank("Banking & Finance")
    })

print(f"After Financial Services: {len(companies)} companies")

# ============================================================
# CONSUMER DISCRETIONARY (30 companies)
# ============================================================
cd_us = [
    ("TSLA", "Tesla Inc.", "United States", "USD", 248.50, 245.20, 785e9, 42.5, 5.85, 0.00, 0.00, 299.50, 138.50, 2.12),
    ("HD", "Home Depot Inc.", "United States", "USD", 365.20, 362.50, 362e9, 25.2, 14.49, 8.90, 2.28, 385.50, 278.50, 1.08),
    ("MCD", "McDonald's Corporation", "United States", "USD", 298.40, 296.10, 215e9, 25.8, 11.56, 6.44, 2.08, 318.50, 218.50, 0.72),
    ("NKE", "Nike Inc.", "United States", "USD", 108.50, 107.20, 168e9, 32.5, 3.34, 1.52, 1.32, 128.50, 82.50, 1.12),
    ("SBUX", "Starbucks Corporation", "United States", "USD", 98.40, 97.50, 112e9, 28.2, 3.49, 2.40, 2.28, 118.50, 68.50, 0.92),
    ("LOW", "Lowe's Companies", "United States", "USD", 232.50, 230.20, 135e9, 22.5, 10.33, 4.40, 1.78, 248.50, 172.50, 1.12),
    ("TGT", "Target Corporation", "United States", "USD", 148.40, 147.10, 68e9, 15.8, 9.40, 4.28, 2.62, 168.50, 102.50, 1.18),
    ("TJX", "TJX Companies", "United States", "USD", 98.50, 97.20, 115e9, 25.8, 3.82, 1.22, 1.12, 105.50, 68.50, 0.92),
    ("ROST", "Ross Stores", "United States", "USD", 142.80, 141.20, 48e9, 28.2, 5.06, 1.42, 0.92, 152.50, 98.50, 1.08),
    ("DG", "Dollar General", "United States", "USD", 128.40, 127.10, 28e9, 18.5, 6.94, 2.48, 1.82, 158.50, 82.50, 0.88),
    ("DLTR", "Dollar Tree", "United States", "USD", 148.50, 146.80, 32e9, 22.8, 6.51, 0.00, 0.00, 168.50, 92.50, 1.12),
    ("GM", "General Motors", "United States", "USD", 42.80, 42.20, 48e9, 5.2, 8.23, 1.52, 3.38, 52.50, 25.80, 1.35),
    ("F", "Ford Motor Company", "United States", "USD", 12.40, 12.15, 48e9, 7.8, 1.59, 0.75, 5.68, 15.20, 8.50, 1.42),
    ("MAR", "Marriott International", "United States", "USD", 248.40, 245.80, 72e9, 28.5, 8.71, 2.12, 0.78, 262.50, 168.50, 1.22),
    ("HLT", "Hilton Worldwide", "United States", "USD", 218.50, 216.10, 55e9, 32.8, 6.66, 1.58, 0.65, 232.50, 142.50, 1.18),
    ("CMG", "Chipotle Mexican Grill", "United States", "USD", 2852.50, 2828.50, 78e9, 58.2, 49.01, 0.00, 0.00, 2985.50, 1685.20, 1.32),
    ("YUM", "Yum! Brands", "United States", "USD", 132.40, 131.20, 38e9, 28.5, 4.64, 2.52, 1.78, 142.50, 98.50, 0.92),
    ("ORLY", "O'Reilly Automotive", "United States", "USD", 1085.20, 1072.50, 62e9, 28.2, 38.48, 0.00, 0.00, 1152.50, 685.20, 1.18),
    ("AZO", "AutoZone Inc.", "United States", "USD", 2852.40, 2828.50, 48e9, 22.5, 126.77, 0.00, 0.00, 2985.50, 1885.20, 1.15),
    ("EBAY", "eBay Inc.", "United States", "USD", 48.50, 47.80, 24e9, 12.8, 3.79, 1.02, 1.98, 55.20, 32.50, 1.18),
    ("BKNG", "Booking Holdings", "United States", "USD", 3852.40, 3828.50, 142e9, 28.5, 135.17, 14.80, 0.32, 4152.50, 2585.20, 1.12),
    ("RCL", "Royal Caribbean Cruises", "United States", "USD", 148.50, 146.80, 35e9, 12.5, 11.88, 0.00, 0.00, 158.50, 62.50, 2.32),
    ("CCL", "Carnival Corporation", "United States", "USD", 18.40, 18.15, 25e9, 18.2, 1.01, 0.00, 0.00, 22.50, 8.50, 2.52),
    ("BBY", "Best Buy Co.", "United States", "USD", 82.40, 81.20, 22e9, 12.5, 6.59, 3.52, 3.88, 92.50, 58.50, 1.22),
    ("W", "Wayfair Inc.", "United States", "USD", 58.40, 57.50, 6.2e9, 48.5, 1.20, 0.00, 0.00, 72.50, 22.50, 2.52),
    ("ETSY", "Etsy Inc.", "United States", "USD", 72.80, 71.50, 8.5e9, 18.2, 4.00, 0.00, 0.00, 82.50, 42.80, 1.82),
    ("CHWY", "Chewy Inc.", "United States", "USD", 22.50, 22.10, 9.2e9, 38.2, 0.59, 0.00, 0.00, 28.50, 12.50, 1.52),
    ("LEVI", "Levi Strauss & Co.", "United States", "USD", 22.80, 22.40, 8.8e9, 18.5, 1.23, 0.52, 2.12, 25.80, 12.50, 1.15),
    ("CROX", "Crocs Inc.", "United States", "USD", 148.50, 146.80, 9.2e9, 12.5, 11.88, 0.00, 0.00, 162.50, 68.50, 1.62),
]

cd_in = [
    ("MARUTI", "Maruti Suzuki India", "India", "INR", 11252.80, 11152.50, 3.58e12, 28.5, 394.83, 120.00, 0.98, 12552.50, 8552.80, 0.82),
    ("TATAMOTORS", "Tata Motors", "India", "INR", 785.40, 778.50, 2.85e12, 8.2, 95.78, 3.50, 0.42, 985.20, 385.50, 1.62),
]

for i, (ticker, name, country, curr, price, prev, mcap, pe, eps, div, dy, h52, l52, beta) in enumerate(cd_us):
    chg = round(price - prev, 2)
    chg_pct = round((chg / prev) * 100, 2)
    vol = random.randint(1000000, 20000000)
    avg_vol = random.randint(2000000, 15000000)
    companies.append({
        "id": make_id(len(companies) + 1),
        "ticker": ticker, "name": name, "sector": "Consumer Discretionary",
        "industry": "Retail & Consumer", "country": country, "currency": curr,
        "currentPrice": price, "previousClose": prev, "change": chg, "changePct": chg_pct,
        "open": round(prev + random.uniform(-1, 1), 2), "high": round(price + random.uniform(0.5, 3), 2),
        "low": round(price - random.uniform(0.5, 3), 2), "volume": vol, "avgVolume": avg_vol, "marketCap": mcap,
        "pe": pe, "eps": eps, "dividend": div, "dividendYield": dy,
        "week52High": h52, "week52Low": l52, "beta": beta,
        "rating": rec(), "analystTarget": round(price * random.uniform(1.1, 1.35), 2), "risk": risk(),
        "description": f"{name} is a leading consumer discretionary company.",
        "logo": random.choice(["🛒", "🛍️", "🚗", "🏠", "🎮"]),
        "miniChart": mini_chart(), "relatedNews": news(),
        "recommendation": rec(), "sectorRank": sector_rank("Consumer Discretionary"), "industryRank": industry_rank("Retail & Consumer")
    })

for i, (ticker, name, country, curr, price, prev, mcap, pe, eps, div, dy, h52, l52, beta) in enumerate(cd_in):
    chg = round(price - prev, 2)
    chg_pct = round((chg / prev) * 100, 2)
    vol = random.randint(200000, 3000000)
    avg_vol = random.randint(300000, 2500000)
    companies.append({
        "id": make_id(len(companies) + 1),
        "ticker": ticker, "name": name, "sector": "Consumer Discretionary",
        "industry": "Automobiles", "country": country, "currency": curr,
        "currentPrice": price, "previousClose": prev, "change": chg, "changePct": chg_pct,
        "open": round(prev + random.uniform(-8, 8), 2), "high": round(price + random.uniform(8, 30), 2),
        "low": round(price - random.uniform(8, 30), 2), "volume": vol, "avgVolume": avg_vol, "marketCap": mcap,
        "pe": pe, "eps": eps, "dividend": div, "dividendYield": dy,
        "week52High": h52, "week52Low": l52, "beta": beta,
        "rating": rec(), "analystTarget": round(price * random.uniform(1.1, 1.35), 2), "risk": risk(),
        "description": f"{name} is a leading Indian automobile company.",
        "logo": random.choice(["🚗", "🚘", "🏍️"]),
        "miniChart": mini_chart(), "relatedNews": news(),
        "recommendation": rec(), "sectorRank": sector_rank("Consumer Discretionary"), "industryRank": industry_rank("Automobiles")
    })

print(f"After Consumer Discretionary: {len(companies)} companies")

# ============================================================
# CONSUMER STAPLES (25 companies)
# ============================================================
cs_us = [
    ("PG", "Procter & Gamble", "United States", "USD", 162.40, 161.10, 382e9, 25.2, 6.44, 3.96, 2.28, 172.50, 128.50, 0.55),
    ("KO", "Coca-Cola Company", "United States", "USD", 62.80, 62.20, 272e9, 24.5, 2.56, 1.94, 2.92, 68.50, 50.50, 0.58),
    ("PEP", "PepsiCo Inc.", "United States", "USD", 178.50, 177.20, 245e9, 25.8, 6.92, 5.25, 2.78, 188.50, 148.50, 0.58),
    ("COST", "Costco Wholesale", "United States", "USD", 728.40, 722.50, 325e9, 48.2, 15.11, 4.28, 0.52, 785.20, 485.50, 0.82),
    ("WMT", "Walmart Inc.", "United States", "USD", 172.80, 171.50, 465e9, 28.5, 6.06, 2.49, 1.35, 178.50, 135.20, 0.52),
    ("PM", "Philip Morris International", "United States", "USD", 98.50, 97.20, 155e9, 18.2, 5.41, 5.28, 4.98, 108.50, 78.50, 0.72),
    ("MO", "Altria Group", "United States", "USD", 42.80, 42.20, 72e9, 11.2, 3.82, 4.08, 8.92, 48.50, 35.50, 0.62),
    ("CL", "Colgate-Palmolive", "United States", "USD", 92.40, 91.50, 78e9, 28.2, 3.28, 1.92, 1.98, 98.50, 72.50, 0.52),
    ("KMB", "Kimberly-Clark", "United States", "USD", 128.50, 127.20, 42e9, 22.5, 5.71, 4.80, 3.52, 138.50, 98.50, 0.52),
    ("GIS", "General Mills", "United States", "USD", 72.40, 71.50, 42e9, 18.2, 3.98, 2.42, 3.12, 78.50, 55.50, 0.52),
    ("K", "Kellogg Company", "United States", "USD", 58.40, 57.80, 10e9, 15.8, 3.69, 2.22, 3.52, 62.50, 42.50, 0.55),
    ("HSY", "Hershey Company", "United States", "USD", 198.40, 196.80, 42e9, 22.8, 8.70, 5.52, 2.58, 218.50, 162.50, 0.52),
    ("MNST", "Monster Beverage", "United States", "USD", 52.80, 52.10, 55e9, 32.5, 1.62, 0.00, 0.00, 58.50, 32.50, 1.12),
    ("STZ", "Constellation Brands", "United States", "USD", 258.40, 255.80, 48e9, 22.5, 11.48, 3.80, 1.38, 278.50, 198.50, 0.92),
    ("KHC", "Kraft Heinz Company", "United States", "USD", 38.40, 38.10, 45e9, 12.2, 3.15, 1.68, 4.12, 42.50, 28.50, 0.55),
    ("SYY", "Sysco Corporation", "United States", "USD", 78.40, 77.50, 38e9, 18.5, 4.24, 2.12, 2.48, 82.50, 52.50, 0.92),
    ("ADM", "Archer-Daniels-Midland", "United States", "USD", 62.80, 62.10, 35e9, 11.2, 5.61, 1.82, 2.68, 72.50, 48.50, 0.72),
    ("MDLZ", "Mondelez International", "United States", "USD", 72.40, 71.50, 98e9, 22.5, 3.22, 1.82, 2.38, 78.50, 52.50, 0.55),
    ("TSN", "Tyson Foods", "United States", "USD", 58.40, 57.50, 20e9, 12.8, 4.56, 1.82, 2.98, 68.50, 42.50, 0.72),
    ("CAG", "Conagra Brands", "United States", "USD", 28.40, 28.10, 14e9, 14.5, 1.96, 1.42, 4.68, 32.50, 22.50, 0.55),
]

cs_in = [
    ("HUL", "Hindustan Unilever", "India", "INR", 2585.40, 2562.80, 6.05e12, 52.5, 49.24, 24.00, 0.88, 2852.50, 1985.20, 0.42),
    ("ITC", "ITC Limited", "India", "INR", 462.80, 458.50, 5.78e12, 28.2, 16.41, 12.50, 2.52, 498.50, 352.50, 0.62),
    ("NESTLEIND", "Nestle India", "India", "INR", 25852.40, 25628.50, 2.48e12, 72.8, 354.97, 32.00, 0.12, 27852.50, 19552.80, 0.42),
    ("BRITANNIA", "Britannia Industries", "India", "INR", 5125.80, 5082.50, 1.22e12, 52.5, 97.63, 38.00, 0.72, 5552.50, 3652.80, 0.48),
    ("DABUR", "Dabur India", "India", "INR", 585.40, 578.50, 1.02e12, 55.2, 10.60, 5.80, 0.92, 652.50, 425.80, 0.52),
]

for i, (ticker, name, country, curr, price, prev, mcap, pe, eps, div, dy, h52, l52, beta) in enumerate(cs_us):
    chg = round(price - prev, 2)
    chg_pct = round((chg / prev) * 100, 2)
    vol = random.randint(2000000, 12000000)
    avg_vol = random.randint(3000000, 10000000)
    companies.append({
        "id": make_id(len(companies) + 1),
        "ticker": ticker, "name": name, "sector": "Consumer Staples",
        "industry": "Food & Beverage", "country": country, "currency": curr,
        "currentPrice": price, "previousClose": prev, "change": chg, "changePct": chg_pct,
        "open": round(prev + random.uniform(-0.5, 0.5), 2), "high": round(price + random.uniform(0.3, 2), 2),
        "low": round(price - random.uniform(0.3, 2), 2), "volume": vol, "avgVolume": avg_vol, "marketCap": mcap,
        "pe": pe, "eps": eps, "dividend": div, "dividendYield": dy,
        "week52High": h52, "week52Low": l52, "beta": beta,
        "rating": rec(), "analystTarget": round(price * random.uniform(1.08, 1.28), 2), "risk": risk(),
        "description": f"{name} is a leading consumer staples company.",
        "logo": random.choice(["🛒", "🥤", "🍫", "🍿", "🧹"]),
        "miniChart": mini_chart(), "relatedNews": news(),
        "recommendation": rec(), "sectorRank": sector_rank("Consumer Staples"), "industryRank": industry_rank("Food & Beverage")
    })

for i, (ticker, name, country, curr, price, prev, mcap, pe, eps, div, dy, h52, l52, beta) in enumerate(cs_in):
    chg = round(price - prev, 2)
    chg_pct = round((chg / prev) * 100, 2)
    vol = random.randint(200000, 2000000)
    avg_vol = random.randint(300000, 1500000)
    companies.append({
        "id": make_id(len(companies) + 1),
        "ticker": ticker, "name": name, "sector": "Consumer Staples",
        "industry": "FMCG", "country": country, "currency": curr,
        "currentPrice": price, "previousClose": prev, "change": chg, "changePct": chg_pct,
        "open": round(prev + random.uniform(-20, 20), 2), "high": round(price + random.uniform(20, 80), 2),
        "low": round(price - random.uniform(20, 80), 2), "volume": vol, "avgVolume": avg_vol, "marketCap": mcap,
        "pe": pe, "eps": eps, "dividend": div, "dividendYield": dy,
        "week52High": h52, "week52Low": l52, "beta": beta,
        "rating": rec(), "analystTarget": round(price * random.uniform(1.08, 1.28), 2), "risk": risk(),
        "description": f"{name} is a leading Indian consumer staples company.",
        "logo": random.choice(["🛒", "🥤", "🍫", "🧹"]),
        "miniChart": mini_chart(), "relatedNews": news(),
        "recommendation": rec(), "sectorRank": sector_rank("Consumer Staples"), "industryRank": industry_rank("FMCG")
    })

print(f"After Consumer Staples: {len(companies)} companies")

# ============================================================
# INDUSTRIALS (30 companies)
# ============================================================
ind_us = [
    ("HON", "Honeywell International", "United States", "USD", 212.40, 210.50, 138e9, 24.8, 8.56, 4.32, 1.92, 228.50, 168.50, 1.02),
    ("UPS", "United Parcel Service", "United States", "USD", 168.50, 166.80, 142e9, 18.2, 9.26, 6.52, 3.62, 185.50, 128.50, 0.92),
    ("BA", "Boeing Company", "United States", "USD", 228.40, 225.80, 132e9, 42.5, 5.37, 0.00, 0.00, 268.50, 142.50, 1.62),
    ("CAT", "Caterpillar Inc.", "United States", "USD", 342.80, 340.10, 168e9, 18.5, 18.53, 5.52, 1.48, 382.50, 228.50, 1.08),
    ("DE", "Deere & Company", "United States", "USD", 428.50, 425.20, 122e9, 12.8, 33.48, 5.48, 1.15, 468.50, 308.50, 1.05),
    ("GE", "General Electric", "United States", "USD", 168.40, 166.80, 182e9, 32.5, 5.18, 1.08, 0.58, 185.20, 88.50, 1.12),
    ("MMM", "3M Company", "United States", "USD", 98.50, 97.20, 55e9, 8.5, 11.59, 6.08, 5.72, 128.50, 72.50, 0.92),
    ("RTX", "RTX Corporation", "United States", "USD", 92.40, 91.50, 122e9, 22.8, 4.05, 2.48, 2.42, 102.50, 68.50, 0.92),
    ("LMT", "Lockheed Martin", "United States", "USD", 462.80, 458.50, 115e9, 16.2, 28.57, 12.80, 2.52, 485.50, 382.50, 0.62),
    ("GD", "General Dynamics", "United States", "USD", 285.40, 282.80, 78e9, 18.5, 15.43, 5.64, 1.82, 302.50, 212.50, 0.72),
    ("NOC", "Northrop Grumman", "United States", "USD", 485.20, 482.50, 72e9, 18.2, 26.66, 8.12, 1.52, 512.50, 385.50, 0.68),
    ("EMR", "Emerson Electric", "United States", "USD", 98.40, 97.50, 58e9, 22.5, 4.37, 2.12, 2.02, 105.50, 68.50, 1.02),
    ("ITW", "Illinois Tool Works", "United States", "USD", 258.40, 255.80, 78e9, 25.2, 10.25, 6.28, 2.25, 272.50, 198.50, 1.02),
    ("ETN", "Eaton Corporation", "United States", "USD", 285.20, 282.80, 112e9, 32.5, 8.78, 3.88, 1.28, 302.50, 182.50, 1.12),
    ("ROK", "Rockwell Automation", "United States", "USD", 312.40, 308.50, 35e9, 32.2, 9.70, 4.92, 1.48, 348.50, 225.50, 1.15),
    ("WM", "Waste Management", "United States", "USD", 198.40, 196.80, 78e9, 28.5, 6.96, 2.82, 1.32, 212.50, 148.50, 0.72),
    ("CSX", "CSX Corporation", "United States", "USD", 35.40, 35.10, 72e9, 18.2, 1.95, 1.08, 2.82, 38.50, 24.50, 1.12),
    ("NSC", "Norfolk Southern", "United States", "USD", 258.40, 255.80, 62e9, 22.5, 11.48, 5.28, 1.88, 282.50, 168.50, 1.18),
    ("FAST", "Fastenal Company", "United States", "USD", 58.40, 57.80, 32e9, 28.2, 2.07, 1.52, 2.42, 62.50, 38.50, 0.92),
    ("ODP", "ODP Corporation", "United States", "USD", 52.40, 51.80, 3.2e9, 8.5, 6.16, 0.00, 0.00, 58.50, 32.50, 1.52),
    ("GWW", "W.W. Grainger", "United States", "USD", 885.20, 878.50, 45e9, 28.5, 31.06, 7.28, 0.75, 952.50, 625.50, 1.08),
    ("PCAR", "PACCAR Inc.", "United States", "USD", 118.40, 117.20, 62e9, 10.8, 10.96, 3.12, 2.48, 128.50, 72.50, 1.15),
    ("TDG", "TransDigm Group", "United States", "USD", 1085.20, 1072.50, 58e9, 32.5, 33.39, 0.00, 0.00, 1152.50, 725.20, 1.32),
    ("CTAS", "Cintas Corporation", "United States", "USD", 685.40, 678.50, 72e9, 38.2, 17.94, 5.12, 0.68, 725.20, 485.50, 1.02),
    ("JCI", "Johnson Controls", "United States", "USD", 58.40, 57.80, 38e9, 15.2, 3.84, 1.52, 2.42, 65.20, 38.50, 1.12),
    ("IR", "Ingersoll Rand", "United States", "USD", 62.80, 62.10, 25e9, 32.2, 1.95, 0.00, 0.00, 68.50, 38.50, 1.18),
]

ind_in = [
    ("LT", "Larsen & Toubro", "India", "INR", 3528.40, 3498.50, 4.85e12, 34.2, 103.17, 28.00, 0.78, 3852.50, 2585.20, 0.82),
    ("TATASTEEL", "Tata Steel", "India", "INR", 142.80, 140.50, 1.72e12, 8.2, 17.41, 3.50, 2.28, 168.50, 82.50, 1.35),
    ("ADANIENT", "Adani Enterprises", "India", "INR", 2852.40, 2828.50, 3.22e12, 68.5, 41.64, 0.80, 0.02, 3452.50, 1685.20, 1.82),
]

for i, (ticker, name, country, curr, price, prev, mcap, pe, eps, div, dy, h52, l52, beta) in enumerate(ind_us):
    chg = round(price - prev, 2)
    chg_pct = round((chg / prev) * 100, 2)
    vol = random.randint(1000000, 12000000)
    avg_vol = random.randint(2000000, 10000000)
    companies.append({
        "id": make_id(len(companies) + 1),
        "ticker": ticker, "name": name, "sector": "Industrials",
        "industry": "Industrial Manufacturing", "country": country, "currency": curr,
        "currentPrice": price, "previousClose": prev, "change": chg, "changePct": chg_pct,
        "open": round(prev + random.uniform(-1, 1), 2), "high": round(price + random.uniform(0.5, 3), 2),
        "low": round(price - random.uniform(0.5, 3), 2), "volume": vol, "avgVolume": avg_vol, "marketCap": mcap,
        "pe": pe, "eps": eps, "dividend": div, "dividendYield": dy,
        "week52High": h52, "week52Low": l52, "beta": beta,
        "rating": rec(), "analystTarget": round(price * random.uniform(1.1, 1.3), 2), "risk": risk(),
        "description": f"{name} is a leading industrials company.",
        "logo": random.choice(["🏭", "⚙️", "🔧", "🏗️", "✈️"]),
        "miniChart": mini_chart(), "relatedNews": news(),
        "recommendation": rec(), "sectorRank": sector_rank("Industrials"), "industryRank": industry_rank("Industrial Manufacturing")
    })

for i, (ticker, name, country, curr, price, prev, mcap, pe, eps, div, dy, h52, l52, beta) in enumerate(ind_in):
    chg = round(price - prev, 2)
    chg_pct = round((chg / prev) * 100, 2)
    vol = random.randint(300000, 5000000)
    avg_vol = random.randint(500000, 4000000)
    companies.append({
        "id": make_id(len(companies) + 1),
        "ticker": ticker, "name": name, "sector": "Industrials",
        "industry": "Industrial Manufacturing", "country": country, "currency": curr,
        "currentPrice": price, "previousClose": prev, "change": chg, "changePct": chg_pct,
        "open": round(prev + random.uniform(-3, 3), 2), "high": round(price + random.uniform(3, 12), 2),
        "low": round(price - random.uniform(3, 12), 2), "volume": vol, "avgVolume": avg_vol, "marketCap": mcap,
        "pe": pe, "eps": eps, "dividend": div, "dividendYield": dy,
        "week52High": h52, "week52Low": l52, "beta": beta,
        "rating": rec(), "analystTarget": round(price * random.uniform(1.1, 1.3), 2), "risk": risk(),
        "description": f"{name} is a leading Indian industrials company.",
        "logo": random.choice(["🏭", "⚙️", "🔧", "🏗️"]),
        "miniChart": mini_chart(), "relatedNews": news(),
        "recommendation": rec(), "sectorRank": sector_rank("Industrials"), "industryRank": industry_rank("Industrial Manufacturing")
    })

print(f"After Industrials: {len(companies)} companies")

# ============================================================
# MATERIALS (20 companies)
# ============================================================
mat_us = [
    ("LIN", "Linde PLC", "United States", "USD", 458.40, 455.10, 222e9, 32.5, 14.10, 5.28, 1.08, 485.50, 352.50, 0.72),
    ("APD", "Air Products & Chemicals", "United States", "USD", 278.40, 275.80, 62e9, 25.8, 10.79, 6.82, 2.28, 302.50, 208.50, 0.82),
    ("SHW", "Sherwin-Williams", "United States", "USD", 342.50, 340.10, 88e9, 28.5, 12.02, 2.82, 0.78, 358.50, 238.50, 1.08),
    ("FCX", "Freeport-McMoRan", "United States", "USD", 48.40, 47.80, 68e9, 18.2, 2.66, 0.62, 1.22, 52.50, 28.50, 1.72),
    ("NEM", "Newmont Corporation", "United States", "USD", 42.80, 42.20, 48e9, 22.5, 1.90, 1.08, 2.38, 48.50, 28.50, 0.82),
    ("NUE", "Nucor Corporation", "United States", "USD", 178.40, 176.80, 42e9, 10.5, 16.99, 6.82, 3.58, 208.50, 118.50, 1.32),
    ("DOW", "Dow Inc.", "United States", "USD", 58.40, 57.80, 42e9, 22.8, 2.56, 2.82, 4.52, 68.50, 42.50, 1.12),
    ("DD", "DuPont de Nemours", "United States", "USD", 78.40, 77.50, 38e9, 32.5, 2.41, 1.52, 1.78, 85.50, 52.50, 1.08),
    ("PPG", "PPG Industries", "United States", "USD", 148.40, 146.80, 35e9, 22.2, 6.68, 2.68, 1.68, 158.50, 108.50, 1.02),
    ("ECL", "Ecolab Inc.", "United States", "USD", 198.40, 196.80, 55e9, 35.2, 5.64, 2.48, 1.18, 212.50, 148.50, 0.92),
    ("VMC", "Vulcan Materials", "United States", "USD", 258.40, 255.80, 35e9, 32.5, 7.95, 1.82, 0.62, 282.50, 168.50, 1.12),
    ("MLM", "Martin Marietta Materials", "United States", "USD", 585.40, 580.80, 35e9, 35.8, 16.35, 3.12, 0.48, 625.50, 385.50, 1.15),
    ("ALB", "Albemarle Corporation", "United States", "USD", 128.40, 127.10, 15e9, 8.5, 15.11, 1.62, 1.18, 168.50, 62.50, 1.52),
    ("CE", "Celanese Corporation", "United States", "USD", 148.40, 146.80, 16e9, 8.2, 18.10, 2.82, 1.72, 168.50, 82.50, 1.35),
    ("MOS", "The Mosaic Company", "United States", "USD", 38.40, 37.80, 12e9, 12.5, 3.07, 0.82, 2.02, 45.20, 25.50, 1.42),
    ("CF", "CF Industries", "United States", "USD", 78.40, 77.50, 15e9, 8.5, 9.22, 1.82, 2.12, 88.50, 42.50, 1.48),
    ("EMN", "Eastman Chemical", "United States", "USD", 98.40, 97.50, 12e9, 12.8, 7.69, 3.28, 3.12, 108.50, 68.50, 1.18),
    ("IFF", "International Flavors", "United States", "USD", 82.40, 81.50, 20e9, 22.5, 3.66, 3.12, 3.52, 92.50, 58.50, 0.92),
]

mat_in = [
    ("ULTRACEMCO", "UltraTech Cement", "India", "INR", 9852.40, 9785.50, 2.82e12, 38.5, 255.91, 72.00, 0.68, 10852.50, 6552.80, 0.82),
    ("GRASIM", "Grasim Industries", "India", "INR", 2252.40, 2232.50, 1.48e12, 18.2, 123.75, 22.00, 0.92, 2552.50, 1585.20, 0.95),
]

for i, (ticker, name, country, curr, price, prev, mcap, pe, eps, div, dy, h52, l52, beta) in enumerate(mat_us):
    chg = round(price - prev, 2)
    chg_pct = round((chg / prev) * 100, 2)
    vol = random.randint(800000, 8000000)
    avg_vol = random.randint(1500000, 6000000)
    companies.append({
        "id": make_id(len(companies) + 1),
        "ticker": ticker, "name": name, "sector": "Materials",
        "industry": "Chemicals & Materials", "country": country, "currency": curr,
        "currentPrice": price, "previousClose": prev, "change": chg, "changePct": chg_pct,
        "open": round(prev + random.uniform(-0.5, 0.5), 2), "high": round(price + random.uniform(0.3, 2), 2),
        "low": round(price - random.uniform(0.3, 2), 2), "volume": vol, "avgVolume": avg_vol, "marketCap": mcap,
        "pe": pe, "eps": eps, "dividend": div, "dividendYield": dy,
        "week52High": h52, "week52Low": l52, "beta": beta,
        "rating": rec(), "analystTarget": round(price * random.uniform(1.1, 1.3), 2), "risk": risk(),
        "description": f"{name} is a leading materials company.",
        "logo": random.choice(["🧪", "🔬", "⚗️", "🪨", "💎"]),
        "miniChart": mini_chart(), "relatedNews": news(),
        "recommendation": rec(), "sectorRank": sector_rank("Materials"), "industryRank": industry_rank("Chemicals & Materials")
    })

for i, (ticker, name, country, curr, price, prev, mcap, pe, eps, div, dy, h52, l52, beta) in enumerate(mat_in):
    chg = round(price - prev, 2)
    chg_pct = round((chg / prev) * 100, 2)
    vol = random.randint(100000, 1500000)
    avg_vol = random.randint(150000, 1200000)
    companies.append({
        "id": make_id(len(companies) + 1),
        "ticker": ticker, "name": name, "sector": "Materials",
        "industry": "Cement & Building Materials", "country": country, "currency": curr,
        "currentPrice": price, "previousClose": prev, "change": chg, "changePct": chg_pct,
        "open": round(prev + random.uniform(-10, 10), 2), "high": round(price + random.uniform(10, 40), 2),
        "low": round(price - random.uniform(10, 40), 2), "volume": vol, "avgVolume": avg_vol, "marketCap": mcap,
        "pe": pe, "eps": eps, "dividend": div, "dividendYield": dy,
        "week52High": h52, "week52Low": l52, "beta": beta,
        "rating": rec(), "analystTarget": round(price * random.uniform(1.1, 1.3), 2), "risk": risk(),
        "description": f"{name} is a leading Indian materials company.",
        "logo": random.choice(["🧪", "🔬", "🪨", "💎"]),
        "miniChart": mini_chart(), "relatedNews": news(),
        "recommendation": rec(), "sectorRank": sector_rank("Materials"), "industryRank": industry_rank("Cement & Building Materials")
    })

print(f"After Materials: {len(companies)} companies")

# ============================================================
# UTILITIES (15 companies)
# ============================================================
util_us = [
    ("NEE", "NextEra Energy", "United States", "USD", 72.40, 71.50, 148e9, 22.8, 3.18, 2.06, 2.68, 78.50, 48.50, 0.52),
    ("DUK", "Duke Energy", "United States", "USD", 98.40, 97.50, 75e9, 18.5, 5.32, 4.12, 3.92, 105.50, 78.50, 0.42),
    ("SO", "Southern Company", "United States", "USD", 78.40, 77.50, 85e9, 22.2, 3.53, 2.88, 3.48, 82.50, 58.50, 0.42),
    ("D", "Dominion Energy", "United States", "USD", 48.40, 47.80, 42e9, 28.5, 1.70, 2.68, 5.25, 55.20, 35.50, 0.52),
    ("AEP", "American Electric Power", "United States", "USD", 92.40, 91.50, 48e9, 18.2, 5.08, 3.52, 3.62, 98.50, 72.50, 0.52),
    ("XEL", "Xcel Energy", "United States", "USD", 62.40, 61.80, 35e9, 20.5, 3.04, 2.12, 3.18, 68.50, 48.50, 0.52),
    ("EXC", "Exelon Corporation", "United States", "USD", 38.40, 38.10, 38e9, 15.8, 2.43, 1.52, 3.72, 42.50, 28.50, 0.52),
    ("ED", "Consolidated Edison", "United States", "USD", 92.40, 91.50, 32e9, 15.2, 6.08, 3.32, 3.42, 98.50, 72.50, 0.42),
    ("WEC", "WEC Energy Group", "United States", "USD", 82.40, 81.50, 25e9, 18.5, 4.45, 3.18, 3.62, 88.50, 62.50, 0.42),
    ("ES", "Eversource Energy", "United States", "USD", 62.40, 61.80, 22e9, 20.2, 3.09, 2.82, 4.22, 68.50, 48.50, 0.48),
    ("DTE", "DTE Energy", "United States", "USD", 108.40, 107.50, 22e9, 18.2, 5.96, 4.12, 3.58, 115.50, 82.50, 0.52),
    ("CMS", "CMS Energy", "United States", "USD", 62.40, 61.80, 18e9, 20.5, 3.04, 1.82, 2.72, 68.50, 48.50, 0.48),
    ("ETR", "Entergy Corporation", "United States", "USD", 108.40, 107.50, 22e9, 15.2, 7.13, 4.28, 3.68, 118.50, 78.50, 0.62),
    ("FE", "FirstEnergy Corp", "United States", "USD", 42.40, 42.10, 25e9, 18.2, 2.33, 1.68, 3.72, 45.50, 32.50, 0.48),
    ("PNW", "Pinnacle West Capital", "United States", "USD", 82.40, 81.50, 9.2e9, 16.5, 4.99, 3.52, 4.02, 88.50, 62.50, 0.52),
]

for i, (ticker, name, country, curr, price, prev, mcap, pe, eps, div, dy, h52, l52, beta) in enumerate(util_us):
    chg = round(price - prev, 2)
    chg_pct = round((chg / prev) * 100, 2)
    vol = random.randint(500000, 6000000)
    avg_vol = random.randint(800000, 5000000)
    companies.append({
        "id": make_id(len(companies) + 1),
        "ticker": ticker, "name": name, "sector": "Utilities",
        "industry": "Electric Utilities", "country": country, "currency": curr,
        "currentPrice": price, "previousClose": prev, "change": chg, "changePct": chg_pct,
        "open": round(prev + random.uniform(-0.3, 0.3), 2), "high": round(price + random.uniform(0.2, 1.5), 2),
        "low": round(price - random.uniform(0.2, 1.5), 2), "volume": vol, "avgVolume": avg_vol, "marketCap": mcap,
        "pe": pe, "eps": eps, "dividend": div, "dividendYield": dy,
        "week52High": h52, "week52Low": l52, "beta": beta,
        "rating": rec(), "analystTarget": round(price * random.uniform(1.08, 1.25), 2), "risk": risk(),
        "description": f"{name} is a leading utilities company.",
        "logo": random.choice(["💡", "⚡", "🔋", "🔌"]),
        "miniChart": mini_chart(), "relatedNews": news(),
        "recommendation": rec(), "sectorRank": sector_rank("Utilities"), "industryRank": industry_rank("Electric Utilities")
    })

print(f"After Utilities: {len(companies)} companies")

# ============================================================
# REAL ESTATE (15 companies)
# ============================================================
re_us = [
    ("PLD", "Prologis Inc.", "United States", "USD", 128.40, 127.10, 118e9, 28.5, 4.50, 3.52, 2.58, 142.50, 98.50, 0.82),
    ("AMT", "American Tower", "United States", "USD", 198.40, 196.80, 92e9, 35.2, 5.64, 6.28, 2.92, 228.50, 158.50, 0.82),
    ("EQIX", "Equinix Inc.", "United States", "USD", 828.40, 822.50, 78e9, 82.5, 10.04, 12.80, 1.42, 885.50, 625.50, 1.02),
    ("SPG", "Simon Property Group", "United States", "USD", 148.40, 147.10, 48e9, 20.2, 7.35, 8.00, 5.02, 158.50, 102.50, 1.18),
    ("O", "Realty Income Corp.", "United States", "USD", 58.40, 57.80, 42e9, 38.2, 1.53, 3.12, 5.08, 65.20, 42.50, 0.62),
    ("PSA", "Public Storage", "United States", "USD", 285.40, 282.80, 48e9, 32.5, 8.78, 12.00, 3.92, 312.50, 225.50, 0.82),
    ("WELL", "Welltower Inc.", "United States", "USD", 92.40, 91.50, 48e9, 42.2, 2.19, 2.82, 2.82, 102.50, 58.50, 1.05),
    ("DLR", "Digital Realty Trust", "United States", "USD", 148.40, 147.10, 42e9, 38.5, 3.85, 5.28, 3.28, 162.50, 98.50, 1.02),
    ("AVB", "AvalonBay Communities", "United States", "USD", 198.40, 196.80, 28e9, 28.2, 7.03, 7.12, 3.32, 218.50, 158.50, 0.92),
    ("EQR", "Equity Residential", "United States", "USD", 68.40, 67.50, 25e9, 25.8, 2.65, 2.82, 3.82, 75.20, 52.50, 0.82),
    ("VICI", "VICI Properties", "United States", "USD", 28.40, 28.10, 28e9, 12.2, 2.33, 1.68, 5.58, 32.50, 18.50, 0.82),
    ("ARE", "Alexandria Real Estate", "United States", "USD", 118.40, 117.10, 20e9, 42.5, 2.79, 5.28, 4.12, 138.50, 78.50, 1.05),
    ("INVH", "Invitation Homes", "United States", "USD", 35.40, 35.10, 22e9, 48.2, 0.73, 1.02, 2.68, 38.50, 22.50, 0.92),
    ("MAA", "Mid-America Apartment", "United States", "USD", 148.40, 147.10, 17e9, 22.5, 6.60, 5.62, 3.52, 162.50, 108.50, 0.82),
    ("ESS", "Essex Property Trust", "United States", "USD", 285.40, 282.80, 18e9, 32.2, 8.86, 10.02, 3.22, 312.50, 212.50, 0.92),
]

for i, (ticker, name, country, curr, price, prev, mcap, pe, eps, div, dy, h52, l52, beta) in enumerate(re_us):
    chg = round(price - prev, 2)
    chg_pct = round((chg / prev) * 100, 2)
    vol = random.randint(500000, 8000000)
    avg_vol = random.randint(800000, 6000000)
    companies.append({
        "id": make_id(len(companies) + 1),
        "ticker": ticker, "name": name, "sector": "Real Estate",
        "industry": "REITs", "country": country, "currency": curr,
        "currentPrice": price, "previousClose": prev, "change": chg, "changePct": chg_pct,
        "open": round(prev + random.uniform(-0.5, 0.5), 2), "high": round(price + random.uniform(0.3, 2), 2),
        "low": round(price - random.uniform(0.3, 2), 2), "volume": vol, "avgVolume": avg_vol, "marketCap": mcap,
        "pe": pe, "eps": eps, "dividend": div, "dividendYield": dy,
        "week52High": h52, "week52Low": l52, "beta": beta,
        "rating": rec(), "analystTarget": round(price * random.uniform(1.08, 1.28), 2), "risk": risk(),
        "description": f"{name} is a leading real estate company.",
        "logo": random.choice(["🏢", "🏠", "🏘️", "🏗️"]),
        "miniChart": mini_chart(), "relatedNews": news(),
        "recommendation": rec(), "sectorRank": sector_rank("Real Estate"), "industryRank": industry_rank("REITs")
    })

print(f"After Real Estate: {len(companies)} companies")

# ============================================================
# COMMUNICATION SERVICES (15 companies)
# ============================================================
comm_us = [
    ("DIS", "Walt Disney Company", "United States", "USD", 112.40, 111.50, 205e9, 72.5, 1.55, 0.00, 0.00, 128.50, 78.50, 1.28),
    ("CMCSA", "Comcast Corporation", "United States", "USD", 42.40, 42.10, 168e9, 12.2, 3.48, 1.28, 2.82, 48.50, 28.50, 1.08),
    ("T", "AT&T Inc.", "United States", "USD", 17.40, 17.15, 125e9, 7.8, 2.23, 1.12, 6.12, 18.50, 12.50, 0.62),
    ("VZ", "Verizon Communications", "United States", "USD", 42.40, 42.10, 178e9, 8.5, 4.99, 2.71, 6.18, 45.50, 30.50, 0.42),
    ("TMUS", "T-Mobile US", "United States", "USD", 168.40, 166.80, 198e9, 24.5, 6.87, 0.00, 0.00, 178.50, 118.50, 0.82),
    ("ROKU", "Roku Inc.", "United States", "USD", 68.40, 67.50, 9.5e9, 52.2, 1.31, 0.00, 0.00, 78.50, 32.50, 1.82),
    ("CHTR", "Charter Communications", "United States", "USD", 298.40, 295.80, 42e9, 42.5, 7.02, 0.00, 0.00, 358.50, 182.50, 1.52),
    ("MTCH", "Match Group Inc.", "United States", "USD", 42.40, 42.10, 12e9, 28.2, 1.50, 0.00, 0.00, 48.50, 22.50, 1.62),
    ("WBD", "Warner Bros. Discovery", "United States", "USD", 8.40, 8.20, 20e9, 8.5, 0.99, 0.00, 0.00, 12.50, 3.80, 1.72),
    ("PARA", "Paramount Global", "United States", "USD", 11.40, 11.20, 7.5e9, 15.2, 0.75, 0.24, 1.98, 16.50, 8.50, 1.62),
    ("OMC", "Omnicom Group", "United States", "USD", 92.40, 91.50, 18e9, 13.2, 7.00, 3.12, 3.18, 98.50, 68.50, 1.02),
    ("FOXA", "Fox Corporation", "United States", "USD", 32.40, 32.10, 15e9, 12.5, 2.59, 0.52, 1.48, 35.50, 22.50, 1.12),
    ("NWSA", "News Corp", "United States", "USD", 22.40, 22.10, 12e9, 28.2, 0.79, 0.22, 0.92, 25.50, 14.50, 1.22),
    ("LUMN", "Lumen Technologies", "United States", "USD", 2.40, 2.35, 2.5e9, 5.2, 0.46, 0.00, 0.00, 4.50, 0.85, 1.82),
]

for i, (ticker, name, country, curr, price, prev, mcap, pe, eps, div, dy, h52, l52, beta) in enumerate(comm_us):
    chg = round(price - prev, 2)
    chg_pct = round((chg / prev) * 100, 2)
    vol = random.randint(2000000, 20000000)
    avg_vol = random.randint(3000000, 15000000)
    companies.append({
        "id": make_id(len(companies) + 1),
        "ticker": ticker, "name": name, "sector": "Communication Services",
        "industry": "Media & Entertainment", "country": country, "currency": curr,
        "currentPrice": price, "previousClose": prev, "change": chg, "changePct": chg_pct,
        "open": round(prev + random.uniform(-0.5, 0.5), 2), "high": round(price + random.uniform(0.3, 2), 2),
        "low": round(price - random.uniform(0.3, 2), 2), "volume": vol, "avgVolume": avg_vol, "marketCap": mcap,
        "pe": pe, "eps": eps, "dividend": div, "dividendYield": dy,
        "week52High": h52, "week52Low": l52, "beta": beta,
        "rating": rec(), "analystTarget": round(price * random.uniform(1.1, 1.35), 2), "risk": risk(),
        "description": f"{name} is a leading communication services company.",
        "logo": random.choice(["📡", "📺", "🎬", "🎮", "📻"]),
        "miniChart": mini_chart(), "relatedNews": news(),
        "recommendation": rec(), "sectorRank": sector_rank("Communication Services"), "industryRank": industry_rank("Media & Entertainment")
    })

print(f"After Communication Services: {len(companies)} companies")

# ============================================================
# WRITE OUTPUT FILE
# ============================================================
output_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data", "companiesData.js")

lines = []
lines.append("'use strict';")
lines.append("(function() {")
lines.append("  var companies = [")

for idx, c in enumerate(companies):
    comma = "," if idx < len(companies) - 1 else ""
    mini_arr = ",".join(str(x) for x in c["miniChart"])
    news_arr = ",".join(f'"{n}"' for n in c["relatedNews"])
    lines.append(f'    {{id:"{c["id"]}",ticker:"{c["ticker"]}",name:"{c["name"]}",sector:"{c["sector"]}",industry:"{c["industry"]}",country:"{c["country"]}",currency:"{c["currency"]}",currentPrice:{c["currentPrice"]},previousClose:{c["previousClose"]},change:{c["change"]},changePct:{c["changePct"]},open:{c["open"]},high:{c["high"]},low:{c["low"]},volume:{c["volume"]},avgVolume:{c["avgVolume"]},marketCap:{c["marketCap"]},pe:{c["pe"]},eps:{c["eps"]},dividend:{c["dividend"]},dividendYield:{c["dividendYield"]},week52High:{c["week52High"]},week52Low:{c["week52Low"]},beta:{c["beta"]},rating:"{c["rating"]}",analystTarget:{c["analystTarget"]},risk:"{c["risk"]}",description:"{c["description"]}",logo:"{c["logo"]}",miniChart:[{mini_arr}],relatedNews:[{news_arr}],recommendation:"{c["recommendation"]}",sectorRank:{c["sectorRank"]},industryRank:{c["industryRank"]}}}{comma}')

lines.append("  ];")
lines.append("  window.CompaniesData = {")
lines.append("    companies: companies,")
lines.append("    getTopGainers: function(n) { return companies.slice().sort((a,b) => b.changePct - a.changePct).slice(0, n || 10); },")
lines.append("    getTopLosers: function(n) { return companies.slice().sort((a,b) => a.changePct - b.changePct).slice(0, n || 10); },")
lines.append("    search: function(q) { var query = q.toLowerCase(); return companies.filter(c => c.ticker.toLowerCase().includes(query) || c.name.toLowerCase().includes(query)); },")
lines.append("    getSectors: function() { var s = {}; companies.forEach(c => { if (!s[c.sector]) s[c.sector] = []; s[c.sector].push(c); }); return s; },")
lines.append("    getById: function(id) { return companies.find(c => c.id === id); },")
lines.append("    getByTicker: function(t) { return companies.find(c => c.ticker === t); }")
lines.append("  };")
lines.append("})();")

os.makedirs(os.path.dirname(output_path), exist_ok=True)
with open(output_path, "w", encoding="utf-8") as f:
    f.write("\n".join(lines))

file_size = os.path.getsize(output_path)
print(f"\n=== DONE ===")
print(f"Total companies: {len(companies)}")
print(f"Output file: {output_path}")
print(f"File size: {file_size:,} bytes ({file_size/1024:.1f} KB)")

# Quick verification
sectors = {}
for c in companies:
    s = c["sector"]
    sectors[s] = sectors.get(s, 0) + 1
print(f"\nSector distribution:")
for s, cnt in sorted(sectors.items()):
    print(f"  {s}: {cnt}")

# Check for duplicates
tickers = [c["ticker"] for c in companies]
ids = [c["id"] for c in companies]
if len(set(tickers)) != len(tickers):
    print(f"\nWARNING: {len(tickers) - len(set(tickers))} duplicate tickers!")
if len(set(ids)) != len(ids):
    print(f"WARNING: {len(ids) - len(set(ids))} duplicate IDs!")
