'use strict';

(function() {
  var indices = [
    { symbol: 'SENSEX', name: 'BSE Sensex', exchange: 'BSE', price: 82456.78, change: -342.15, changePct: -0.41, dayHigh: 82901.22, dayLow: 82100.45, volume: 185000000 },
    { symbol: 'NIFTY50', name: 'NSE Nifty 50', exchange: 'NSE', price: 25128.45, change: -98.30, changePct: -0.39, dayHigh: 25280.00, dayLow: 25010.25, volume: 320000000 },
    { symbol: 'DOW', name: 'Dow Jones Industrial Average', exchange: 'NYSE', price: 50234.12, change: 156.78, changePct: 0.31, dayHigh: 50301.50, dayLow: 49980.00, volume: 420000000 },
    { symbol: 'NASDAQ', name: 'NASDAQ Composite', exchange: 'NASDAQ', price: 18923.45, change: 234.56, changePct: 1.26, dayHigh: 18950.00, dayLow: 18650.30, volume: 580000000 },
    { symbol: 'SPX', name: 'S&P 500', exchange: 'NYSE', price: 5678.90, change: 42.34, changePct: 0.75, dayHigh: 5690.00, dayLow: 5620.10, volume: 310000000 },
    { symbol: 'FTSE', name: 'FTSE 100', exchange: 'LSE', price: 8345.67, change: -12.45, changePct: -0.15, dayHigh: 8380.00, dayLow: 8310.20, volume: 95000000 },
    { symbol: 'NIKKEI', name: 'Nikkei 225', exchange: 'TSE', price: 38567.89, change: -523.45, changePct: -1.34, dayHigh: 39100.00, dayLow: 38400.50, volume: 2100000000 },
    { symbol: 'HSI', name: 'Hang Seng Index', exchange: 'HKEX', price: 18234.56, change: -178.90, changePct: -0.97, dayHigh: 18450.00, dayLow: 18100.30, volume: 1450000000 }
  ];

  var stocks = [
    { symbol: 'RELIANCE', name: 'Reliance Industries Ltd', exchange: 'NSE', price: 2945.60, change: 32.45, changePct: 1.11, volume: 12500000, marketCap: '20.1L Cr', high52w: 3024.90, low52w: 2220.30, pe: 28.5, dividend: 0.35, sector: 'Oil & Gas', rating: 'BUY', sparkline: [2800,2850,2900,2880,2920,2910,2945] },
    { symbol: 'TCS', name: 'Tata Consultancy Services', exchange: 'NSE', price: 4123.80, change: -28.90, changePct: -0.70, volume: 3800000, marketCap: '15.1L Cr', high52w: 4254.00, low52w: 3056.40, pe: 33.2, dividend: 1.15, sector: 'IT Services', rating: 'HOLD', sparkline: [4200,4180,4150,4160,4130,4140,4123] },
    { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd', exchange: 'NSE', price: 1678.45, change: 18.70, changePct: 1.13, volume: 8900000, marketCap: '12.8L Cr', high52w: 1794.00, low52w: 1363.55, pe: 19.8, dividend: 0.73, sector: 'Banking', rating: 'BUY', sparkline: [1620,1640,1650,1660,1670,1675,1678] },
    { symbol: 'INFY', name: 'Infosys Ltd', exchange: 'NSE', price: 1834.20, change: -15.30, changePct: -0.83, volume: 6200000, marketCap: '7.6L Cr', high52w: 1918.00, low52w: 1215.45, pe: 29.1, dividend: 0.88, sector: 'IT Services', rating: 'HOLD', sparkline: [1870,1860,1850,1845,1840,1838,1834] },
    { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd', exchange: 'NSE', price: 1245.75, change: 22.40, changePct: 1.83, volume: 11200000, marketCap: '8.7L Cr', high52w: 1362.35, low52w: 898.20, pe: 18.4, dividend: 0.42, sector: 'Banking', rating: 'BUY', sparkline: [1190,1200,1210,1220,1230,1240,1245] },
    { symbol: 'TATAMOTORS', name: 'Tata Motors Ltd', exchange: 'NSE', price: 987.30, change: 45.60, changePct: 4.84, volume: 28500000, marketCap: '3.6L Cr', high52w: 1180.00, low52w: 585.40, pe: 8.2, dividend: 0.00, sector: 'Automobile', rating: 'BUY', sparkline: [890,910,930,950,960,975,987] },
    { symbol: 'SBIN', name: 'State Bank of India', exchange: 'NSE', price: 823.45, change: 12.80, changePct: 1.58, volume: 18700000, marketCap: '7.4L Cr', high52w: 912.00, low52w: 555.00, pe: 10.5, dividend: 1.42, sector: 'Banking', rating: 'BUY', sparkline: [780,790,800,805,810,818,823] },
    { symbol: 'BHARTIARTL', name: 'Bharti Airtel Ltd', exchange: 'NSE', price: 1567.90, change: -23.45, changePct: -1.47, volume: 4100000, marketCap: '9.3L Cr', high52w: 1779.00, low52w: 877.50, pe: 78.3, dividend: 0.18, sector: 'Telecom', rating: 'HOLD', sparkline: [1600,1590,1580,1575,1570,1568,1567] },
    { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank', exchange: 'NSE', price: 1856.30, change: 8.90, changePct: 0.48, volume: 3200000, marketCap: '3.7L Cr', high52w: 2068.50, low52w: 1543.85, pe: 22.1, dividend: 0.28, sector: 'Banking', rating: 'HOLD', sparkline: [1840,1845,1848,1850,1852,1854,1856] },
    { symbol: 'LT', name: 'Larsen & Toubro Ltd', exchange: 'NSE', price: 3745.60, change: 67.80, changePct: 1.84, volume: 2800000, marketCap: '5.1L Cr', high52w: 3956.00, low52w: 2789.30, pe: 36.4, dividend: 0.56, sector: 'Infrastructure', rating: 'BUY', sparkline: [3620,3650,3680,3700,3720,3735,3745] },
    { symbol: 'ITC', name: 'ITC Ltd', exchange: 'NSE', price: 478.25, change: -3.40, changePct: -0.71, volume: 15600000, marketCap: '5.9L Cr', high52w: 528.50, low52w: 399.35, pe: 25.8, dividend: 2.82, sector: 'FMCG', rating: 'HOLD', sparkline: [485,483,481,480,479,478,478] },
    { symbol: 'WIPRO', name: 'Wipro Ltd', exchange: 'NSE', price: 567.80, change: -8.90, changePct: -1.54, volume: 7800000, marketCap: '2.9L Cr', high52w: 620.00, low52w: 370.50, pe: 24.6, dividend: 0.22, sector: 'IT Services', rating: 'SELL', sparkline: [590,585,580,575,572,570,567] },
    { symbol: 'ADANIENT', name: 'Adani Enterprises Ltd', exchange: 'NSE', price: 3245.70, change: 123.45, changePct: 3.96, volume: 6500000, marketCap: '3.7L Cr', high52w: 3743.85, low52w: 1942.00, pe: 112.5, dividend: 0.00, sector: 'Diversified', rating: 'HOLD', sparkline: [3050,3080,3120,3150,3180,3220,3245] },
    { symbol: 'ASIANPAINT', name: 'Asian Paints Ltd', exchange: 'NSE', price: 2867.40, change: -45.20, changePct: -1.55, volume: 1900000, marketCap: '2.7L Cr', high52w: 3395.00, low52w: 2380.50, pe: 52.3, dividend: 0.95, sector: 'Consumer Goods', rating: 'SELL', sparkline: [2920,2910,2900,2890,2880,2875,2867] },
    { symbol: 'MARUTI', name: 'Maruti Suzuki India Ltd', exchange: 'NSE', price: 12456.80, change: 234.50, changePct: 1.91, volume: 1200000, marketCap: '3.9L Cr', high52w: 13680.00, low52w: 9738.50, pe: 31.2, dividend: 0.80, sector: 'Automobile', rating: 'BUY', sparkline: [12000,12100,12200,12300,12380,12420,12456] },
    { symbol: 'HCLTECH', name: 'HCL Technologies Ltd', exchange: 'NSE', price: 1678.90, change: -12.30, changePct: -0.73, volume: 3400000, marketCap: '4.6L Cr', high52w: 1905.00, low52w: 1186.20, pe: 26.8, dividend: 0.68, sector: 'IT Services', rating: 'HOLD', sparkline: [1700,1695,1690,1685,1682,1680,1678] },
    { symbol: 'SUNPHARMA', name: 'Sun Pharmaceutical Industries', exchange: 'NSE', price: 1823.45, change: 34.60, changePct: 1.94, volume: 4500000, marketCap: '4.4L Cr', high52w: 1960.35, low52w: 1085.00, pe: 38.7, dividend: 0.32, sector: 'Pharma', rating: 'BUY', sparkline: [1750,1765,1780,1795,1805,1815,1823] },
    { symbol: 'TITAN', name: 'Titan Company Ltd', exchange: 'NSE', price: 3567.80, change: -78.90, changePct: -2.16, volume: 1800000, marketCap: '3.1L Cr', high52w: 3887.00, low52w: 2895.40, pe: 68.2, dividend: 0.15, sector: 'Consumer Goods', rating: 'HOLD', sparkline: [3650,3630,3610,3595,3585,3575,3567] },
    { symbol: 'BAJFINANCE', name: 'Bajaj Finance Ltd', exchange: 'NSE', price: 7234.50, change: 156.70, changePct: 2.21, volume: 2100000, marketCap: '4.5L Cr', high52w: 8191.50, low52w: 5875.20, pe: 32.4, dividend: 0.00, sector: 'Finance', rating: 'BUY', sparkline: [7000,7050,7100,7140,7170,7200,7234] },
    { symbol: 'AXISBANK', name: 'Axis Bank Ltd', exchange: 'NSE', price: 1134.60, change: 18.90, changePct: 1.69, volume: 12400000, marketCap: '3.5L Cr', high52w: 1340.00, low52w: 890.50, pe: 14.8, dividend: 0.18, sector: 'Banking', rating: 'BUY', sparkline: [1080,1090,1100,1110,1120,1130,1134] },
    { symbol: 'TATASTEEL', name: 'Tata Steel Ltd', exchange: 'NSE', price: 178.45, change: 6.30, changePct: 3.66, volume: 45600000, marketCap: '2.1L Cr', high52w: 184.60, low52w: 116.10, pe: 62.5, dividend: 0.00, sector: 'Metals', rating: 'HOLD', sparkline: [165,168,170,172,174,176,178] },
    { symbol: 'ONGC', name: 'Oil & Natural Gas Corp', exchange: 'NSE', price: 312.80, change: 8.90, changePct: 2.93, volume: 22300000, marketCap: '3.9L Cr', high52w: 345.00, low52w: 192.50, pe: 8.1, dividend: 3.85, sector: 'Oil & Gas', rating: 'BUY', sparkline: [295,298,302,305,308,310,312] },
    { symbol: 'POWERGRID', name: 'Power Grid Corp of India', exchange: 'NSE', price: 324.50, change: -4.20, changePct: -1.28, volume: 8900000, marketCap: '3.0L Cr', high52w: 366.00, low52w: 222.50, pe: 17.2, dividend: 3.95, sector: 'Power', rating: 'HOLD', sparkline: [330,329,328,327,326,325,324] },
    { symbol: 'NTPC', name: 'NTPC Ltd', exchange: 'NSE', price: 412.30, change: 15.60, changePct: 3.93, volume: 16700000, marketCap: '4.0L Cr', high52w: 448.00, low52w: 248.30, pe: 18.9, dividend: 2.45, sector: 'Power', rating: 'BUY', sparkline: [385,390,395,400,405,408,412] },
    { symbol: 'TECHM', name: 'Tech Mahindra Ltd', exchange: 'NSE', price: 1567.40, change: -22.80, changePct: -1.43, volume: 3100000, marketCap: '1.5L Cr', high52w: 1686.00, low52w: 1062.50, pe: 42.1, dividend: 0.45, sector: 'IT Services', rating: 'SELL', sparkline: [1600,1595,1590,1585,1580,1572,1567] },
    { symbol: 'ULTRACEMCO', name: 'UltraTech Cement Ltd', exchange: 'NSE', price: 11234.50, change: 234.70, changePct: 2.13, volume: 680000, marketCap: '3.2L Cr', high52w: 12143.00, low52w: 8267.50, pe: 44.8, dividend: 0.20, sector: 'Cement', rating: 'BUY', sparkline: [10800,10900,10950,11000,11080,11150,11234] },
    { symbol: 'DRREDDY', name: "Dr. Reddy's Laboratories", exchange: 'NSE', price: 6234.80, change: 89.40, changePct: 1.45, volume: 1200000, marketCap: '1.0L Cr', high52w: 6542.00, low52w: 4752.30, pe: 21.3, dividend: 1.60, sector: 'Pharma', rating: 'HOLD', sparkline: [6100,6120,6140,6160,6180,6210,6234] }
  ];

  // Add US stocks
  const usStocks = [
    { symbol: 'AAPL', name: 'Apple Inc', exchange: 'NASDAQ', price: 189.45, change: 2.34, changePct: 1.25, volume: 52300000, marketCap: '2.95T', high52w: 199.62, low52w: 164.08, pe: 28.5, dividend: 0.52, sector: 'Technology', rating: 'BUY', sparkline: [185,186,187,188,189,189,189] },
    { symbol: 'MSFT', name: 'Microsoft Corp', exchange: 'NASDAQ', price: 378.91, change: 5.67, changePct: 1.52, volume: 28700000, marketCap: '2.81T', high52w: 384.30, low52w: 309.45, pe: 35.2, dividend: 0.83, sector: 'Technology', rating: 'BUY', sparkline: [370,372,374,376,378,378,378] },
    { symbol: 'GOOGL', name: 'Alphabet Inc', exchange: 'NASDAQ', price: 141.23, change: -0.89, changePct: -0.63, volume: 21400000, marketCap: '1.78T', high52w: 151.55, low52w: 123.40, pe: 25.8, dividend: 0.00, sector: 'Technology', rating: 'HOLD', sparkline: [142,142,141,141,141,141,141] },
    { symbol: 'AMZN', name: 'Amazon.com Inc', exchange: 'NASDAQ', price: 153.42, change: 1.78, changePct: 1.17, volume: 35600000, marketCap: '1.59T', high52w: 175.43, low52w: 118.20, pe: 62.5, dividend: 0.00, sector: 'Consumer', rating: 'BUY', sparkline: [150,151,152,152,153,153,153] },
    { symbol: 'TSLA', name: 'Tesla Inc', exchange: 'NASDAQ', price: 248.67, change: 8.92, changePct: 3.72, volume: 112400000, marketCap: '789B', high52w: 299.29, low52w: 152.37, pe: 72.5, dividend: 0.00, sector: 'Automobile', rating: 'HOLD', sparkline: [235,240,242,245,247,248,248] },
    { symbol: 'META', name: 'Meta Platforms Inc', exchange: 'NASDAQ', price: 456.78, change: 12.34, changePct: 2.78, volume: 28900000, marketCap: '1.18T', high52w: 485.00, low52w: 278.90, pe: 32.4, dividend: 0.00, sector: 'Technology', rating: 'BUY', sparkline: [440,445,450,452,455,456,456] },
    { symbol: 'NVDA', name: 'NVIDIA Corp', exchange: 'NASDAQ', price: 876.45, change: 34.56, changePct: 4.10, volume: 45600000, marketCap: '2.15T', high52w: 950.02, low52w: 392.30, pe: 68.2, dividend: 0.00, sector: 'Technology', rating: 'BUY', sparkline: [830,840,850,860,870,875,876] },
    { symbol: 'JPM', name: 'JPMorgan Chase & Co', exchange: 'NYSE', price: 178.34, change: 2.45, changePct: 1.40, volume: 8900000, marketCap: '523B', high52w: 195.50, low52w: 145.20, pe: 11.8, dividend: 2.45, sector: 'Banking', rating: 'BUY', sparkline: [175,176,177,178,178,178,178] },
    { symbol: 'V', name: 'Visa Inc', exchange: 'NYSE', price: 267.89, change: 3.12, changePct: 1.18, volume: 6700000, marketCap: '545B', high52w: 289.00, low52w: 223.40, pe: 30.5, dividend: 0.78, sector: 'Finance', rating: 'BUY', sparkline: [263,264,265,266,267,267,267] },
    { symbol: 'JNJ', name: 'Johnson & Johnson', exchange: 'NYSE', price: 156.78, change: -1.23, changePct: -0.78, volume: 5600000, marketCap: '378B', high52w: 173.50, low52w: 148.90, pe: 15.2, dividend: 2.95, sector: 'Healthcare', rating: 'HOLD', sparkline: [158,158,157,157,157,157,156] }
  ];

  stocks = stocks.concat(usStocks);

  // Generate additional stocks to reach 300+
  const sectors = ['Technology', 'Banking', 'Healthcare', 'Consumer', 'Energy', 'Industrial', 'Finance', 'Telecom', 'Utilities', 'Real Estate'];
  const ratings = ['BUY', 'HOLD', 'SELL'];
  const exchanges = ['NSE', 'BSE', 'NASDAQ', 'NYSE', 'LSE', 'TSE', 'HKEX'];

  for (let i = 31; i <= 300; i++) {
    const sector = sectors[Math.floor(Math.random() * sectors.length)];
    const rating = ratings[Math.floor(Math.random() * ratings.length)];
    const exchange = exchanges[Math.floor(Math.random() * exchanges.length)];
    const price = Math.floor(Math.random() * 5000) + 100;
    const change = (Math.random() - 0.5) * 100;
    const changePct = (change / price) * 100;
    const volume = Math.floor(Math.random() * 50000000) + 1000000;
    const marketCap = (Math.random() * 100 + 1).toFixed(1) + (Math.random() > 0.5 ? 'B' : 'L Cr');
    
    stocks.push({
      symbol: 'STK' + i,
      name: 'Company ' + i + ' Ltd',
      exchange: exchange,
      price: price,
      change: change,
      changePct: changePct,
      volume: volume,
      marketCap: marketCap,
      high52w: price * 1.3,
      low52w: price * 0.7,
      pe: Math.floor(Math.random() * 50) + 10,
      dividend: Math.random() * 3,
      sector: sector,
      rating: rating,
      sparkline: [price * 0.95, price * 0.97, price * 0.98, price * 0.99, price * 1.0, price * 1.01, price]
    });
  }

  var crypto = [
    { symbol: 'BTC', name: 'Bitcoin', price: 121456.78, change: 3245.60, changePct: 2.74, marketCap: '2.38T', volume24h: '58.2B', sparkline: [115000,117000,118000,119500,120000,120800,121456] },
    { symbol: 'ETH', name: 'Ethereum', price: 8934.50, change: 456.30, changePct: 5.40, marketCap: '1.07T', volume24h: '32.1B', sparkline: [8200,8400,8500,8600,8750,8850,8934] },
    { symbol: 'SOL', name: 'Solana', price: 456.78, change: 34.20, changePct: 8.10, marketCap: '212B', volume24h: '12.4B', sparkline: [400,410,420,430,440,450,456] },
    { symbol: 'BNB', name: 'BNB', price: 723.40, change: 12.80, changePct: 1.80, marketCap: '108B', volume24h: '2.8B', sparkline: [700,705,710,715,718,720,723] },
    { symbol: 'XRP', name: 'XRP', price: 4.23, change: 0.89, changePct: 26.60, marketCap: '242B', volume24h: '18.5B', sparkline: [3.10,3.30,3.50,3.70,3.90,4.10,4.23] },
    { symbol: 'ADA', name: 'Cardano', price: 2.87, change: 0.45, changePct: 18.60, marketCap: '102B', volume24h: '8.9B', sparkline: [2.30,2.40,2.50,2.60,2.70,2.80,2.87] },
    { symbol: 'DOGE', name: 'Dogecoin', price: 0.89, change: 0.52, changePct: 140.50, marketCap: '132B', volume24h: '22.1B', sparkline: [0.30,0.40,0.50,0.60,0.70,0.82,0.89] },
    { symbol: 'AVAX', name: 'Avalanche', price: 134.56, change: 8.90, changePct: 7.10, marketCap: '56B', volume24h: '3.2B', sparkline: [120,123,125,128,130,132,134] },
    { symbol: 'DOT', name: 'Polkadot', price: 28.45, change: 1.20, changePct: 4.41, marketCap: '42B', volume24h: '1.8B', sparkline: [26.5,27.0,27.3,27.6,27.9,28.2,28.4] },
    { symbol: 'LINK', name: 'Chainlink', price: 42.30, change: 2.10, changePct: 5.22, marketCap: '28B', volume24h: '2.1B', sparkline: [39.5,40.0,40.5,41.0,41.5,42.0,42.3] }
  ];

  var commodities = [
    { symbol: 'GOLD', name: 'Gold', price: 3245.60, change: 28.90, changePct: 0.90, unit: '/oz', sparkline: [3180,3190,3200,3210,3220,3235,3245] },
    { symbol: 'SILVER', name: 'Silver', price: 42.30, change: 0.85, changePct: 2.05, unit: '/oz', sparkline: [40.5,40.8,41.0,41.3,41.6,42.0,42.3] },
    { symbol: 'CRUDE', name: 'Brent Crude', price: 97.45, change: 3.20, changePct: 3.40, unit: '/bbl', sparkline: [92,93,94,95,96,97,97] },
    { symbol: 'WTI', name: 'WTI Crude', price: 92.30, change: 2.80, changePct: 3.12, unit: '/bbl', sparkline: [88,89,89.5,90,91,91.5,92.3] },
    { symbol: 'NATGAS', name: 'Natural Gas', price: 3.45, change: -0.12, changePct: -3.36, unit: '/MMBtu', sparkline: [3.60,3.55,3.52,3.50,3.48,3.46,3.45] },
    { symbol: 'COPPER', name: 'Copper', price: 9876.50, change: 123.40, changePct: 1.26, unit: '/ton', sparkline: [9600,9650,9700,9750,9800,9850,9876] },
    { symbol: 'PLATINUM', name: 'Platinum', price: 1234.80, change: 45.60, changePct: 3.83, unit: '/oz', sparkline: [1150,1170,1190,1200,1210,1225,1234] },
    { symbol: 'ALUMINIUM', name: 'Aluminium', price: 2678.90, change: -34.50, changePct: -1.27, unit: '/ton', sparkline: [2720,2710,2700,2695,2690,2685,2678] }
  ];

  var forex = [
    { pair: 'USD/INR', rate: 82.45, change: -0.32, changePct: -0.39 },
    { pair: 'EUR/USD', rate: 1.0876, change: 0.0045, changePct: 0.41 },
    { pair: 'GBP/USD', rate: 1.2734, change: -0.0023, changePct: -0.18 },
    { pair: 'USD/JPY', rate: 158.90, change: 2.34, changePct: 1.49 },
    { pair: 'USD/CNY', rate: 7.2340, change: 0.0560, changePct: 0.78 },
    { pair: 'AUD/USD', rate: 0.6734, change: 0.0034, changePct: 0.51 },
    { pair: 'USD/CHF', rate: 0.8678, change: -0.0045, changePct: -0.52 },
    { pair: 'EUR/GBP', rate: 0.8541, change: 0.0012, changePct: 0.14 },
    { pair: 'USD/CAD', rate: 1.3678, change: -0.0089, changePct: -0.65 },
    { pair: 'NZD/USD', rate: 0.6123, change: 0.0023, changePct: 0.38 }
  ];

  window.StocksData = {
    indices: indices,
    stocks: stocks,
    crypto: crypto,
    commodities: commodities,
    forex: forex,
    getStock: function(sym) { return stocks.find(function(s) { return s.symbol === sym; }); },
    getCrypto: function(sym) { return crypto.find(function(c) { return c.symbol === sym; }); },
    getCommodity: function(sym) { return commodities.find(function(c) { return c.symbol === sym; }); },
    getTopGainers: function(n) {
      n = n || 5;
      return stocks.slice().sort(function(a, b) { return b.changePct - a.changePct; }).slice(0, n);
    },
    getTopLosers: function(n) {
      n = n || 5;
      return stocks.slice().sort(function(a, b) { return a.changePct - b.changePct; }).slice(0, n);
    },
    getMostActive: function(n) {
      n = n || 5;
      return stocks.slice().sort(function(a, b) { return b.volume - a.volume; }).slice(0, n);
    }
  };
})();
