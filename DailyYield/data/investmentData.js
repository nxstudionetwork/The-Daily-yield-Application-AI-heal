(function() {
  var sectors = [
    { name: 'Technology', industries: ['Cloud Infrastructure', 'Enterprise SaaS', 'Semiconductors', 'AI Platforms'], risk: 'Medium', logo: '⬢' },
    { name: 'Banking', industries: ['Retail Banking', 'Corporate Banking', 'Wealth Management', 'Digital Payments'], risk: 'Medium', logo: '◈' },
    { name: 'Healthcare', industries: ['Pharma', 'Medical Devices', 'Diagnostics', 'Biotech'], risk: 'Defensive', logo: '✚' },
    { name: 'Energy', industries: ['Oil & Gas', 'Renewables', 'Utilities', 'Power Equipment'], risk: 'Medium', logo: '⬡' },
    { name: 'Consumer', industries: ['Retail', 'Consumer Goods', 'Luxury Goods', 'Food & Beverage'], risk: 'Low', logo: '◉' },
    { name: 'Automotive', industries: ['EV Manufacturing', 'Auto Components', 'Commercial Vehicles', 'Mobility Tech'], risk: 'High', logo: '◌' },
    { name: 'Financial Services', industries: ['NBFC', 'Insurance', 'Asset Management', 'Fintech'], risk: 'Medium', logo: '◆' },
    { name: 'Telecom', industries: ['Wireless', 'Broadband', 'Infrastructure', 'Communications'], risk: 'Medium', logo: '◐' },
    { name: 'Industrial', industries: ['Capital Goods', 'Construction', 'Defense', 'Logistics'], risk: 'Medium', logo: '▣' },
    { name: 'Materials', industries: ['Steel', 'Cement', 'Chemicals', 'Mining'], risk: 'High', logo: '▤' },
    { name: 'Media', industries: ['Streaming', 'Publishing', 'Broadcast', 'Creator Platforms'], risk: 'High', logo: '▶' },
    { name: 'Real Estate', industries: ['Commercial Real Estate', 'Residential Projects', 'REIT', 'Property Tech'], risk: 'Medium', logo: '▥' }
  ];

  var prefixes = ['Astra', 'Vertex', 'Nova', 'Zenith', 'Nimbus', 'Atlas', 'Aurora', 'Summit', 'Orbit', 'Meridian', 'Pioneer', 'Sterling', 'Crest', 'Quantum', 'BluePeak', 'IronGate', 'Everstone', 'Cedar', 'Monarch', 'Silverline'];
  var suffixes = ['Global', 'Capital', 'Dynamics', 'Holdings', 'Systems', 'Labs', 'Energy', 'Industries', 'Works', 'Networks', 'Enterprises', 'Partners', 'Logistics', 'Media', 'Bank', 'Health', 'Retail', 'Ventures', 'Power', 'Infrastructure'];
  var countries = ['India', 'United States', 'Singapore', 'United Kingdom', 'Germany', 'Japan', 'UAE', 'Canada'];
  var sentiments = ['Bullish', 'Constructive', 'Accumulate', 'Market Perform', 'Selective'];

  function seeded(index, offset) {
    return ((index * 9301 + 49297 + offset * 233) % 233280) / 233280;
  }

  function round(value) {
    return Math.round(value * 100) / 100;
  }

  function makeTicker(nameA, nameB, index) {
    return (nameA.replace(/[^A-Z]/gi, '').slice(0, 3) + nameB.replace(/[^A-Z]/gi, '').slice(0, 2) + index)
      .toUpperCase()
      .slice(0, 5);
  }

  function makeSparkline(price, index) {
    var points = [];
    for (var i = 0; i < 12; i++) {
      var variance = (seeded(index, i) - 0.46) * price * 0.06;
      points.push(round(Math.max(price * 0.72, price + variance)));
    }
    points[points.length - 1] = price;
    return points;
  }

  function makeNews(company, sector, industry, index) {
    return [
      company + ' expands ' + industry + ' pipeline with new multi-region deployment.',
      sector + ' analysts cite resilient demand trends and pricing discipline for ' + company + '.',
      company + ' featured in allocation screens as institutions rebalance toward ' + sector + '.'
    ].slice(0, 2 + (index % 2));
  }

  var companies = [];
  for (var i = 0; i < 320; i++) {
    var sector = sectors[i % sectors.length];
    var prefix = prefixes[i % prefixes.length];
    var suffix = suffixes[(i * 3) % suffixes.length];
    var companyName = prefix + ' ' + suffix;
    var industry = sector.industries[i % sector.industries.length];
    var country = countries[i % countries.length];
    var basePrice = 45 + (i % 17) * 38 + seeded(i, 2) * 640;
    var dayChangePct = round((seeded(i, 5) - 0.48) * 8.4);
    var currentPrice = round(basePrice);
    var dayChange = round(currentPrice * dayChangePct / 100);
    var high52w = round(currentPrice * (1.08 + seeded(i, 7) * 0.44));
    var low52w = round(currentPrice * (0.58 + seeded(i, 8) * 0.18));
    var dividend = round((seeded(i, 9) * 4.4));
    var volume = Math.round(120000 + seeded(i, 10) * 9800000);
    var marketCapValue = round((currentPrice * (280 + seeded(i, 11) * 520)) / 10);
    var ratingScore = 3.2 + seeded(i, 12) * 1.8;
    var recommendation = sentiments[i % sentiments.length];
    var ticker = makeTicker(prefix, suffix, i);
    var risk = sector.risk === 'Defensive'
      ? (dayChangePct > 2 ? 'Medium' : 'Low')
      : (Math.abs(dayChangePct) > 3.5 ? 'High' : sector.risk);

    companies.push({
      id: 'cmp_' + (i + 1),
      companyName: companyName,
      ticker: ticker,
      sector: sector.name,
      industry: industry,
      country: country,
      currentPrice: currentPrice,
      dayChange: dayChange,
      dayChangePct: dayChangePct,
      previousClose: round(currentPrice - dayChange),
      marketCap: '₹' + marketCapValue.toFixed(1) + 'B',
      volume: volume,
      logo: sector.logo,
      rating: round(ratingScore),
      risk: risk,
      description: companyName + ' is a ' + country + '-listed leader in ' + industry + ', with institutional interest supported by operating leverage, disciplined capital allocation, and cross-market expansion.',
      miniChart: makeSparkline(currentPrice, i),
      relatedNews: makeNews(companyName, sector.name, industry, i),
      analystRecommendation: recommendation,
      dividend: dividend,
      week52High: high52w,
      week52Low: low52w
    });
  }

  var marketOverview = [
    { label: 'Nifty 50', value: 25128.45, change: 184.2, changePct: 0.74 },
    { label: 'Sensex', value: 82456.78, change: 502.18, changePct: 0.61 },
    { label: 'Nasdaq', value: 18923.45, change: 234.56, changePct: 1.26 },
    { label: 'Dow Jones', value: 50234.12, change: 156.78, changePct: 0.31 },
    { label: 'Gold', value: 3245.6, change: 28.9, changePct: 0.9 },
    { label: 'USD/INR', value: 82.45, change: -0.32, changePct: -0.39 }
  ];

  var aiInsights = [
    { tone: 'Balanced', title: 'Diversification gap', body: 'Technology and financials dominate most mock allocations. Consider adding healthcare or utilities to reduce cyclical concentration.' },
    { tone: 'Positive', title: 'Momentum cluster', body: 'Auto and industrial names are showing broader participation, which usually improves portfolio breadth.' },
    { tone: 'Cautious', title: 'Liquidity watch', body: 'High-beta names have accelerated faster than defensive sectors. Tighten position sizing when volatility rises.' },
    { tone: 'Positive', title: 'Dividend resilience', body: 'Cash-generative businesses with dividend support improve stability during choppy sessions.' }
  ];

  var earnings = [
    { company: 'Astra Systems', ticker: 'ASTSY', date: 'Jul 13', time: 'Before Open', expected: '₹24.8B revenue' },
    { company: 'Nimbus Capital', ticker: 'NIMCA', date: 'Jul 14', time: 'After Close', expected: 'Net interest margin expansion' },
    { company: 'Vertex Health', ticker: 'VERHE', date: 'Jul 15', time: 'Before Open', expected: 'Pipeline update' },
    { company: 'Quantum Power', ticker: 'QUAPO', date: 'Jul 16', time: 'After Close', expected: 'Renewables margin strength' },
    { company: 'BluePeak Retail', ticker: 'BLURE', date: 'Jul 17', time: 'After Close', expected: 'Same-store sales acceleration' }
  ];

  var economicCalendar = [
    { title: 'India CPI', date: 'Jul 12', impact: 'High', note: 'Inflation print could shift rate-cut expectations.' },
    { title: 'US Initial Jobless Claims', date: 'Jul 13', impact: 'Medium', note: 'Labor softness may support growth-sensitive sectors.' },
    { title: 'ECB Minutes', date: 'Jul 14', impact: 'Medium', note: 'FX-sensitive holdings may react to policy tone.' },
    { title: 'India WPI', date: 'Jul 15', impact: 'Medium', note: 'Input-cost signals matter for industrials and materials.' },
    { title: 'FOMC Speaker Panel', date: 'Jul 16', impact: 'High', note: 'Duration-sensitive assets may reprice on hawkish commentary.' }
  ];

  var stockNews = companies.slice(0, 40).map(function(company, index) {
    return {
      id: 'news_' + company.ticker,
      ticker: company.ticker,
      title: company.companyName + ' draws fresh inflows as ' + company.industry + ' demand remains resilient',
      impact: index % 3 === 0 ? 'Positive' : index % 3 === 1 ? 'Neutral' : 'Watch',
      sentiment: index % 3 === 0 ? 78 : index % 3 === 1 ? 54 : 38,
      source: ['Bloom Desk', 'Market Pulse', 'Yield Research', 'Capital Wire'][index % 4],
      time: (index + 1) + 'h ago',
      summary: company.relatedNews[0]
    };
  });

  function compareByChange(a, b) {
    return b.dayChangePct - a.dayChangePct;
  }

  function getByTicker(ticker) {
    return companies.find(function(company) {
      return company.ticker === ticker;
    }) || null;
  }

  function search(query) {
    var value = String(query || '').trim().toLowerCase();
    if (!value) return companies.slice(0, 24);
    return companies.filter(function(company) {
      return company.companyName.toLowerCase().indexOf(value) >= 0 ||
        company.ticker.toLowerCase().indexOf(value) >= 0 ||
        company.sector.toLowerCase().indexOf(value) >= 0 ||
        company.industry.toLowerCase().indexOf(value) >= 0;
    });
  }

  window.InvestmentData = {
    sectors: sectors,
    companies: companies,
    marketOverview: marketOverview,
    aiInsights: aiInsights,
    earnings: earnings,
    economicCalendar: economicCalendar,
    stockNews: stockNews,
    getByTicker: getByTicker,
    search: search,
    getTrending: function(count) {
      count = count || 8;
      return companies.slice(0).sort(compareByChange).slice(0, count);
    },
    getTopGainers: function(count) {
      count = count || 8;
      return companies.slice(0).sort(compareByChange).slice(0, count);
    },
    getTopLosers: function(count) {
      count = count || 8;
      return companies.slice(0).sort(function(a, b) {
        return a.dayChangePct - b.dayChangePct;
      }).slice(0, count);
    },
    getRecommended: function(count) {
      count = count || 8;
      return companies.filter(function(company) {
        return company.analystRecommendation !== 'Market Perform';
      }).slice(0, count);
    }
  };
})();
