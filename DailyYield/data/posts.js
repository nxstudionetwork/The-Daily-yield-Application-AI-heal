const PostsData = {
  trending: [
    { id: 'po1', author: 'MarketGuru', avatar: 'M', time: '2h ago', content: 'Nifty hitting 25K is a watershed moment for Indian markets. But let\'s look at the fundamentals: P/E ratios are at 24x, which is elevated but not bubbly given earnings growth of 18% YoY. The key question is whether FII flows will sustain. My read: yes, but with corrections along the way.', likes: 342, comments: 87, shares: 45, tags: ['Nifty', 'Markets', 'Investing'], bookmarked: false },
    { id: 'po2', author: 'TechInsider', avatar: 'T', time: '4h ago', content: 'Just tried the new Apple AR glasses. Genuinely impressive how they handled spatial computing. The hand tracking is sub-millimeter accurate. This is the computing platform we\'ve been waiting for since the iPhone. Full review dropping tomorrow.', likes: 891, comments: 156, shares: 234, tags: ['Apple', 'AR', 'Tech'], bookmarked: true },
    { id: 'po3', author: 'PolicyWatch', avatar: 'P', time: '6h ago', content: 'The new Data Privacy Bill is actually quite strong. Section 15 gives citizens the right to demand algorithmic explanations. This puts India ahead of GDPR in AI transparency. However, enforcement will be the real test. We need a well-funded DPA with technical expertise.', likes: 567, comments: 123, shares: 89, tags: ['Policy', 'Privacy', 'India'], bookmarked: false },
    { id: 'po4', author: 'ScienceDaily', avatar: 'S', time: '8h ago', content: 'The CRISPR sickle cell cure is not just a medical breakthrough — it\'s a moral imperative. Millions suffer from this genetic disease, mostly in developing nations. The real challenge now is making this therapy affordable and accessible globally. Pharma needs to step up.', likes: 1240, comments: 234, shares: 567, tags: ['CRISPR', 'Health', 'Science'], bookmarked: false },
    { id: 'po5', author: 'CryptoNaut', avatar: 'C', time: '10h ago', content: 'Bitcoin at $95K with institutional ETFs holding 5% of supply. The supply squeeze narrative is playing out exactly as the models predicted. Next stop $100K by month end? The halving cycle analysis suggests we\'re only at mid-cycle. Not financial advice.', likes: 678, comments: 345, shares: 123, tags: ['Bitcoin', 'Crypto', 'Investing'], bookmarked: false }
  ],
  groups: [
    { id: 'g1', name: 'Indian Market Mavericks', members: 45200, description: 'Technical and fundamental analysis of Indian markets', icon: '📈', active: true },
    { id: 'g2', name: 'AI & Future Tech', members: 32100, description: 'Discussions on AI, quantum computing, and emerging technologies', icon: '🤖', active: true },
    { id: 'g3', name: 'Personal Finance India', members: 78500, description: 'Mutual funds, tax planning, and wealth building strategies', icon: '💰', active: false },
    { id: 'g4', name: 'Climate Action Hub', members: 18900, description: 'Climate science, policy, and sustainable living discussions', icon: '🌍', active: false },
    { id: 'g5', name: 'Startup India', members: 56300, description: 'Entrepreneurship, funding, and startup ecosystem news', icon: '🚀', active: true }
  ],
  polls: [
    { id: 'pl1', question: 'Where will Nifty be at end of 2026?', options: [{ text: '28,000+', pct: 35 }, { text: '25,000-28,000', pct: 42 }, { text: '22,000-25,000', pct: 18 }, { text: 'Below 22,000', pct: 5 }], totalVotes: 12450, timeLeft: '3 days' },
    { id: 'pl2', question: 'Which tech trend will have the biggest impact in 2027?', options: [{ text: 'Generative AI', pct: 45 }, { text: 'AR/VR', pct: 22 }, { text: 'Quantum Computing', pct: 18 }, { text: 'Fusion Energy', pct: 15 }], totalVotes: 8900, timeLeft: '5 days' },
    { id: 'pl3', question: 'Best long-term investment right now?', options: [{ text: 'Index Funds', pct: 38 }, { text: 'Gold', pct: 25 }, { text: 'Real Estate', pct: 22 }, { text: 'Crypto', pct: 15 }], totalVotes: 15200, timeLeft: '1 week' }
  ]
};
