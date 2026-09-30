const StocksData = {
  indices: [
    { symbol: 'NIFTY 50', name: 'Nifty 50', price: 24850.65, change: 185.30, changePct: 0.75, sparkline: [24200,24350,24100,24500,24600,24450,24700,24650,24800,24850] },
    { symbol: 'SENSEX', name: 'BSE Sensex', price: 81430.20, change: 542.15, changePct: 0.67, sparkline: [80200,80500,80100,80800,80900,80600,81100,81000,81300,81430] },
    { symbol: 'SPX', name: 'S&P 500', price: 5850.40, change: 42.80, changePct: 0.74, sparkline: [5750,5780,5720,5800,5820,5790,5830,5810,5840,5850] },
    { symbol: 'DJI', name: 'Dow Jones', price: 43250.75, change: -85.20, changePct: -0.20, sparkline: [43400,43350,43500,43200,43100,43300,43150,43280,43200,43250] },
    { symbol: 'NASDAQ', name: 'Nasdaq', price: 19820.30, change: 156.45, changePct: 0.80, sparkline: [19400,19500,19350,19600,19700,19550,19750,19680,19800,19820] }
  ],
  stocks: [
    { symbol: 'RELIANCE', name: 'Reliance Industries', price: 2950.40, change: 45.20, changePct: 1.56, volume: '12.5M', marketCap: '20.1T', sparkline: [2850,2870,2840,2900,2920,2880,2930,2910,2940,2950] },
    { symbol: 'TCS', name: 'Tata Consultancy', price: 4125.80, change: -32.50, changePct: -0.78, volume: '3.2M', marketCap: '15.2T', sparkline: [4200,4180,4220,4150,4130,4170,4110,4140,4100,4125] },
    { symbol: 'HDFCBANK', name: 'HDFC Bank', price: 1780.60, change: 22.30, changePct: 1.27, volume: '8.7M', marketCap: '13.5T', sparkline: [1720,1740,1710,1750,1760,1730,1770,1755,1775,1780] },
    { symbol: 'INFY', name: 'Infosys', price: 1685.25, change: 18.90, changePct: 1.13, volume: '5.4M', marketCap: '7.0T', sparkline: [1640,1650,1630,1660,1670,1655,1680,1665,1680,1685] },
    { symbol: 'ICICIBANK', name: 'ICICI Bank', price: 1245.30, change: 8.75, changePct: 0.71, volume: '9.1M', marketCap: '8.7T', sparkline: [1210,1220,1205,1230,1240,1225,1245,1235,1240,1245] },
    { symbol: 'TATAMOTORS', name: 'Tata Motors', price: 985.40, change: -15.60, changePct: -1.56, volume: '15.3M', marketCap: '3.6T', sparkline: [1010,1000,1020,995,990,1005,985,995,980,985] },
    { symbol: 'WIPRO', name: 'Wipro', price: 562.75, change: 12.30, changePct: 2.24, volume: '6.8M', marketCap: '2.9T', sparkline: [530,540,525,545,550,540,555,550,560,562] },
    { symbol: 'BHARTIARTL', name: 'Bharti Airtel', price: 1520.90, change: -28.40, changePct: -1.83, volume: '4.2M', marketCap: '9.1T', sparkline: [1560,1550,1570,1540,1530,1555,1520,1540,1525,1520] },
    { symbol: 'SBIN', name: 'State Bank of India', price: 845.60, change: 35.20, changePct: 4.34, volume: '22.1M', marketCap: '7.6T', sparkline: [790,800,785,810,820,805,830,840,835,845] },
    { symbol: 'ADANIENT', name: 'Adani Enterprises', price: 3280.45, change: -62.30, changePct: -1.86, volume: '7.5M', marketCap: '3.7T', sparkline: [3400,3380,3420,3350,3320,3370,3290,3310,3270,3280] },
    { symbol: 'BAJFINANCE', name: 'Bajaj Finance', price: 7420.80, change: 125.40, changePct: 1.72, volume: '1.8M', marketCap: '4.6T', sparkline: [7200,7250,7180,7300,7350,7280,7380,7360,7400,7420] },
    { symbol: 'KOTAKBANK', name: 'Kotak Mahindra', price: 1920.35, change: 42.80, changePct: 2.28, volume: '5.6M', marketCap: '3.8T', sparkline: [1850,1860,1840,1870,1890,1875,1900,1895,1910,1920] }
  ],
  crypto: [
    { symbol: 'BTC', name: 'Bitcoin', price: 95420.80, change: 2340.50, changePct: 2.52, sparkline: [91000,91500,90800,92000,93000,92500,94000,94500,95000,95420] },
    { symbol: 'ETH', name: 'Ethereum', price: 4850.25, change: -85.30, changePct: -1.73, sparkline: [5000,4980,5020,4950,4900,4940,4870,4890,4860,4850] },
    { symbol: 'SOL', name: 'Solana', price: 285.40, change: 12.80, changePct: 4.70, sparkline: [265,268,260,272,278,270,280,282,284,285] },
    { symbol: 'XRP', name: 'Ripple', price: 2.35, change: 0.08, changePct: 3.52, sparkline: [2.20,2.22,2.18,2.25,2.28,2.24,2.30,2.32,2.33,2.35] }
  ],
  forex: [
    { symbol: 'USD/INR', name: 'US Dollar / Indian Rupee', price: 83.25, change: -0.15, changePct: -0.18 },
    { symbol: 'EUR/INR', name: 'Euro / Indian Rupee', price: 90.85, change: 0.22, changePct: 0.24 },
    { symbol: 'GBP/INR', name: 'British Pound / Indian Rupee', price: 105.40, change: 0.35, changePct: 0.33 },
    { symbol: 'JPY/INR', name: 'Japanese Yen / Indian Rupee', price: 0.56, change: -0.003, changePct: -0.53 }
  ],
  commodities: [
    { symbol: 'GOLD', name: 'Gold (per oz)', price: 2485.30, change: 32.50, changePct: 1.32 },
    { symbol: 'SILVER', name: 'Silver (per oz)', price: 31.45, change: -0.82, changePct: -2.54 },
    { symbol: 'CRUDE', name: 'Crude Oil WTI', price: 78.90, change: 1.45, changePct: 1.87 },
    { symbol: 'NATGAS', name: 'Natural Gas', price: 2.85, change: -0.12, changePct: -4.04 }
  ],
  trending: ['RELIANCE', 'SBIN', 'WIPRO', 'BTC', 'GOLD'],
  topGainers: [
    { symbol: 'SBIN', changePct: 4.34 },
    { symbol: 'SOL', changePct: 4.70 },
    { symbol: 'KOTAKBANK', changePct: 2.28 },
    { symbol: 'WIPRO', changePct: 2.24 },
    { symbol: 'BAJFINANCE', changePct: 1.72 }
  ],
  topLosers: [
    { symbol: 'BHARTIARTL', changePct: -1.83 },
    { symbol: 'ADANIENT', changePct: -1.86 },
    { symbol: 'TATAMOTORS', changePct: -1.56 },
    { symbol: 'ETH', changePct: -1.73 },
    { symbol: 'NATGAS', changePct: -4.04 }
  ]
};
