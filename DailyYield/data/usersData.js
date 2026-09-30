'use strict';

(function() {
  var currentUser = {
    id: 'u001',
    name: 'Arjun Mehta',
    username: '@arjunmehta',
    avatar: '🧑‍💼',
    bio: 'Tech enthusiast | Finance nerd | Building at the intersection of AI and markets',
    location: 'Mumbai, India',
    website: 'arjunmehta.dev',
    joinDate: '2024-03-15',
    followers: 2340,
    following: 892,
    postsCount: 156,
    verified: false,
    premium: true,
    interests: ['Markets', 'AI', 'Technology', 'India', 'Crypto'],
    readHistory: ['n001', 'n003', 'n006', 'n018', 'n025'],
    savedArticles: ['n005', 'n022', 'n037'],
    subscribedChannels: ['ch001', 'ch003', 'ch004', 'ch005', 'ch007', 'ch009', 'ch013', 'ch017', 'ch020'],
    watchlist: ['RELIANCE', 'TCS', 'NVDA', 'BTC', 'GOLD'],
    notificationSettings: {
      breakingNews: true,
      marketAlerts: true,
      portfolioAlerts: true,
      digest: 'daily',
      quietHours: { start: '23:00', end: '06:00' }
    }
  };

  var suggestedUsers = [
    { id: 'su001', name: 'Priya Sharma', username: '@priyasharma', avatar: '👩‍💻', bio: 'AI Researcher at IIT Bombay | Deep learning enthusiast', followers: 12400, following: 456, verified: true, reason: 'Based on your interest in AI' },
    { id: 'su002', name: 'Rahul Verma', username: '@rahulvcapital', avatar: '📈', bio: 'Fund Manager at Kotak AMC | 15+ years in Indian equities', followers: 45600, following: 234, verified: true, reason: 'Popular in Markets' },
    { id: 'su003', name: 'Ananya Patel', username: '@ananyawrites', avatar: '✍️', bio: 'Journalist at The Economic Times | Covering fintech and crypto', followers: 8900, following: 1200, verified: true, reason: 'Writes about your interests' },
    { id: 'su004', name: 'Vikram Singh', username: '@vikramcrypto', avatar: '🪙', bio: 'Crypto analyst | Bitcoin maximalist | DeFi researcher', followers: 23400, following: 567, verified: false, reason: 'Followed by people you follow' },
    { id: 'su005', name: 'Deepika Nair', username: '@deepikanomics', avatar: '📊', bio: 'Chief Economist at a Big4 firm | RBI watcher | Policy wonk', followers: 34500, following: 345, verified: true, reason: 'Top voice in Economy' },
    { id: 'su006', name: 'Amit Kumar', username: '@amitktech', avatar: '🔧', bio: 'CTO at a Series B startup | Full-stack | Open source contributor', followers: 5600, following: 890, verified: false, reason: 'Based on your interest in Technology' },
    { id: 'su007', name: 'Neha Gupta', username: '@nehagstocks', avatar: '💹', bio: 'SEBI registered research analyst | Technical analysis expert', followers: 67000, following: 123, verified: true, reason: 'Top voice in Markets' },
    { id: 'su008', name: 'Sanjay Deshmukh', username: '@sanjayd_space', avatar: '🚀', bio: 'ISRO scientist | Space enthusiast | Rockets and code', followers: 18900, following: 345, verified: true, reason: 'Followed by people you follow' },
    { id: 'su009', name: 'Kavita Reddy', username: '@kavitarhealth', avatar: '💊', bio: 'Biotech analyst | Pharma industry expert | Healthcare investing', followers: 12300, following: 567, verified: false, reason: 'Popular in Health' },
    { id: 'su010', name: 'Mohit Bansal', username: '@mohitb_finance', avatar: '💰', bio: 'Personal finance educator | 2M+ YouTube subscribers | Book author', followers: 89000, following: 234, verified: true, reason: 'Top voice in Finance' }
  ];

  var trendingTopics = [
    { topic: '#FedRateCut', posts: '2.4M', category: 'Economy' },
    { topic: '#MarsLanding', posts: '5.6M', category: 'Science' },
    { topic: '#Bitcoin120K', posts: '1.8M', category: 'Crypto' },
    { topic: '#IndiaGDP', posts: '890K', category: 'Economy' },
    { topic: '#IPL2026', posts: '12.3M', category: 'Sports' },
    { topic: '#GPT5', posts: '3.4M', category: 'AI' },
    { topic: '#Sensex82K', posts: '567K', category: 'Markets' },
    { topic: '#Dow50K', posts: '1.2M', category: 'Markets' }
  ];

  window.UsersData = {
    currentUser: currentUser,
    suggestedUsers: suggestedUsers,
    trendingTopics: trendingTopics,
    getSuggestedUsers: function(n) { return suggestedUsers.slice(0, n || 5); },
    getTrendingTopics: function() { return trendingTopics; },
    toggleSubscription: function(channelId) {
      var idx = currentUser.subscribedChannels.indexOf(channelId);
      if (idx > -1) { currentUser.subscribedChannels.splice(idx, 1); } 
      else { currentUser.subscribedChannels.push(channelId); }
    },
    addToWatchlist: function(symbol) {
      if (currentUser.watchlist.indexOf(symbol) === -1) {
        currentUser.watchlist.push(symbol);
      }
    },
    removeFromWatchlist: function(symbol) {
      var idx = currentUser.watchlist.indexOf(symbol);
      if (idx > -1) { currentUser.watchlist.splice(idx, 1); }
    }
  };
})();
