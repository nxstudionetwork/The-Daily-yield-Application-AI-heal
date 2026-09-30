'use strict';

(function() {
  const articles = [
    {
      id: 'n001', title: 'Federal Reserve Holds Rates Steady at 4.25%-4.50%, Signals September Cut',
      subtitle: 'Powell says data will determine timing of first rate reduction',
      summary: 'The Federal Reserve held interest rates unchanged at 4.25%-4.50%, with Chair Jerome Powell indicating the central bank remains data-dependent and could consider cutting rates as early as September if inflation continues its downward trajectory.',
      category: 'Breaking', author: { name: 'Sarah Mitchell', avatar: '👩‍💼', verified: true },
      publisher: { name: 'Bloomberg', logo: '📊', verified: true },
      publishDate: new Date(Date.now() - 25 * 60000).toISOString(),
      readingTime: 4, views: 284500, likes: 12400, comments: 3200, shares: 8900,
      tags: ['Federal Reserve', 'Interest Rates', 'Inflation', 'Monetary Policy'],
      isBreaking: true, isFeatured: true, trendingScore: 98, sentiment: 'neutral', emoji: '🏦'
    },
    {
      id: 'n002', title: 'India GDP Growth Surges to 7.8% in Q1, Beats All Expectations',
      subtitle: 'Strong consumer spending and manufacturing drive fastest growth among major economies',
      summary: "India's gross domestic product expanded by 7.8% year-on-year in Q1 2026, surpassing RBI's forecast of 7.2% and reinforcing the nation's position as the world's fastest-growing major economy.",
      category: 'Economy', author: { name: 'Rajesh Kumar', avatar: '👨‍💻', verified: true },
      publisher: { name: 'Reuters', logo: '📰', verified: true },
      publishDate: new Date(Date.now() - 45 * 60000).toISOString(),
      readingTime: 5, views: 198000, likes: 9800, comments: 2100, shares: 6700,
      tags: ['India', 'GDP', 'Economic Growth', 'Emerging Markets'],
      isBreaking: true, isFeatured: true, trendingScore: 94, sentiment: 'positive', emoji: '🇮🇳'
    },
    {
      id: 'n003', title: 'OpenAI Unveils GPT-5 with Reasoning Capabilities That Rival Human Experts',
      subtitle: 'New model scores 92% on graduate-level reasoning benchmarks',
      summary: 'OpenAI has announced GPT-5, its most advanced AI model to date, featuring unprecedented reasoning capabilities that score 92% on the GPQA diamond benchmark, surpassing human expert performance.',
      category: 'AI', author: { name: 'Emily Zhang', avatar: '👩‍🔬', verified: true },
      publisher: { name: 'The Verge', logo: '⚡', verified: true },
      publishDate: new Date(Date.now() - 90 * 60000).toISOString(),
      readingTime: 6, views: 520000, likes: 34000, comments: 8900, shares: 42000,
      tags: ['OpenAI', 'GPT-5', 'Artificial Intelligence', 'Machine Learning'],
      isBreaking: false, isFeatured: true, trendingScore: 97, sentiment: 'positive', emoji: '🤖'
    },
    {
      id: 'n004', title: 'Sensex Crashes 800 Points as Global Trade War Fears Resurface',
      subtitle: "Trump's new tariff threats on Chinese tech imports spark market selloff across Asia",
      summary: "India's benchmark Sensex index plunged over 800 points in early trading as markets reacted to former President Trump's announcement of fresh tariffs targeting Chinese technology imports.",
      category: 'Business', author: { name: 'Vikram Patel', avatar: '👨‍💼', verified: true },
      publisher: { name: 'CNBC TV18', logo: '📺', verified: true },
      publishDate: new Date(Date.now() - 120 * 60000).toISOString(),
      readingTime: 3, views: 345000, likes: 5600, comments: 4100, shares: 12000,
      tags: ['Sensex', 'Stock Market', 'Trade War', 'Tariffs'],
      isBreaking: false, isFeatured: false, trendingScore: 91, sentiment: 'negative', emoji: '📉'
    },
    {
      id: 'n005', title: 'SpaceX Successfully Lands First Crew on Mars in Historic Mission',
      subtitle: "Four astronauts make humanity's first footprint on the Red Planet",
      summary: "SpaceX's Starship Horizon has successfully landed four astronauts on Mars, marking the first time humans have set foot on another planet. The crew, led by Commander Maria Santos, stepped onto Martian soil at 14:37 UTC.",
      category: 'Science', author: { name: 'David Chen', avatar: '👨‍🚀', verified: true },
      publisher: { name: 'NASA', logo: '🚀', verified: true },
      publishDate: new Date(Date.now() - 180 * 60000).toISOString(),
      readingTime: 8, views: 1200000, likes: 89000, comments: 15000, shares: 95000,
      tags: ['SpaceX', 'Mars', 'Space Exploration', 'NASA'],
      isBreaking: true, isFeatured: true, trendingScore: 99, sentiment: 'positive', emoji: '🚀'
    },
    {
      id: 'n006', title: 'Bitcoin Surges Past $120,000 as Institutional Adoption Accelerates',
      subtitle: "BlackRock's Bitcoin ETF sees record $2.1 billion daily inflow",
      summary: 'Bitcoin surged past $120,000 for the first time, driven by massive institutional inflows into BlackRock\'s spot Bitcoin ETF, which recorded $2.1 billion in daily inflows—a new record.',
      category: 'Crypto', author: { name: 'Alex Turner', avatar: '🧑‍💻', verified: true },
      publisher: { name: 'CoinDesk', logo: '🪙', verified: true },
      publishDate: new Date(Date.now() - 240 * 60000).toISOString(),
      readingTime: 4, views: 670000, likes: 45000, comments: 11000, shares: 38000,
      tags: ['Bitcoin', 'Cryptocurrency', 'BlackRock', 'ETF'],
      isBreaking: false, isFeatured: true, trendingScore: 96, sentiment: 'positive', emoji: '₿'
    },
    {
      id: 'n007', title: 'Supreme Court Rules on Landmark Digital Privacy Case',
      subtitle: 'Justices 6-3 decision extends Fourth Amendment protections to AI surveillance',
      summary: 'The U.S. Supreme Court ruled 6-3 that AI-powered surveillance systems used by law enforcement constitute a search under the Fourth Amendment, requiring warrants for their use.',
      category: 'Politics', author: { name: 'Rachel Green', avatar: '👩‍⚖️', verified: true },
      publisher: { name: 'The Washington Post', logo: '🏛️', verified: true },
      publishDate: new Date(Date.now() - 300 * 60000).toISOString(),
      readingTime: 7, views: 410000, likes: 22000, comments: 6700, shares: 19000,
      tags: ['Supreme Court', 'Digital Privacy', 'Fourth Amendment', 'AI Surveillance'],
      isBreaking: false, isFeatured: false, trendingScore: 88, sentiment: 'neutral', emoji: '⚖️'
    },
    {
      id: 'n008', title: 'Apple Announces Vision Pro 2 at Half the Price with Neural Interface',
      subtitle: 'Lighter, cheaper headset features brain-computer interface for hands-free control',
      summary: "Apple unveiled the Vision Pro 2 at WWDC, featuring a breakthrough neural interface that allows users to control the device with brain signals. Priced at $1,799, it's half the cost of the original.",
      category: 'Technology', author: { name: 'Mark Sullivan', avatar: '👨‍💻', verified: true },
      publisher: { name: 'TechCrunch', logo: '🔧', verified: true },
      publishDate: new Date(Date.now() - 360 * 60000).toISOString(),
      readingTime: 5, views: 890000, likes: 56000, comments: 12000, shares: 45000,
      tags: ['Apple', 'Vision Pro', 'Neural Interface', 'AR/VR'],
      isBreaking: false, isFeatured: true, trendingScore: 95, sentiment: 'positive', emoji: '🍎'
    },
    {
      id: 'n009', title: 'WHO Declares End of Global mpox Emergency After Vaccine Campaign Success',
      subtitle: 'International vaccination effort reaches 85% coverage in affected regions',
      summary: 'The World Health Organization officially declared the end of the global mpox public health emergency, crediting a coordinated international vaccination campaign that achieved 85% coverage.',
      category: 'Health', author: { name: 'Dr. Amira Hassan', avatar: '👩‍⚕️', verified: true },
      publisher: { name: 'The Lancet', logo: '🏥', verified: true },
      publishDate: new Date(Date.now() - 420 * 60000).toISOString(),
      readingTime: 5, views: 230000, likes: 18000, comments: 2800, shares: 14000,
      tags: ['WHO', 'mpox', 'Vaccination', 'Global Health'],
      isBreaking: false, isFeatured: false, trendingScore: 82, sentiment: 'positive', emoji: '🏥'
    },
    {
      id: 'n010', title: "Kohli's Century Guides India to Border-Gavaskar Series Victory 3-1",
      subtitle: 'India win after dominant Sydney Test chase of 328',
      summary: 'Virat Kohli scored a masterful 147 in the fourth innings as India chased down 328 to win the final Test in Sydney and clinch the Border-Gavaskar Trophy 3-1.',
      category: 'Sports', author: { name: 'Harsha Bhogle', avatar: '🏏', verified: true },
      publisher: { name: 'ESPNcricinfo', logo: '🏆', verified: true },
      publishDate: new Date(Date.now() - 480 * 60000).toISOString(),
      readingTime: 4, views: 1500000, likes: 78000, comments: 21000, shares: 67000,
      tags: ['Cricket', 'India', 'Australia', 'Kohli', 'Border-Gavaskar'],
      isBreaking: false, isFeatured: true, trendingScore: 93, sentiment: 'positive', emoji: '🏏'
    },
    {
      id: 'n011', title: 'Greta Gerwig to Helm New Narnia Trilogy for Netflix',
      subtitle: 'First film set for December 2027 theatrical release',
      summary: "Netflix announced that director Greta Gerwig will write and direct a new trilogy based on C.S. Lewis's The Chronicles of Narnia, with the first installment scheduled for December 2027.",
      category: 'Entertainment', author: { name: 'Lisa Romero', avatar: '🎬', verified: true },
      publisher: { name: 'Variety', logo: '🎞️', verified: true },
      publishDate: new Date(Date.now() - 540 * 60000).toISOString(),
      readingTime: 3, views: 780000, likes: 42000, comments: 8900, shares: 31000,
      tags: ['Netflix', 'Greta Gerwig', 'Narnia', 'Movies'],
      isBreaking: false, isFeatured: false, trendingScore: 87, sentiment: 'positive', emoji: '🎬'
    },
    {
      id: 'n012', title: 'IBM Achieves 10,000-Qubit Quantum Computing Breakthrough',
      subtitle: 'New Condor X chip solves problems classical computers would take millennia to crack',
      summary: 'IBM unveiled its Condor X quantum processor with 10,000 qubits, the most powerful quantum computer ever built, demonstrating quantum advantage on three commercially relevant optimization problems.',
      category: 'Technology', author: { name: 'Nina Patel', avatar: '👩‍🔬', verified: true },
      publisher: { name: 'MIT Technology Review', logo: '🔬', verified: true },
      publishDate: new Date(Date.now() - 600 * 60000).toISOString(),
      readingTime: 6, views: 420000, likes: 28000, comments: 5400, shares: 22000,
      tags: ['Quantum Computing', 'IBM', 'Technology', 'Innovation'],
      isBreaking: false, isFeatured: true, trendingScore: 89, sentiment: 'positive', emoji: '⚛️'
    },
    {
      id: 'n013', title: 'EU Passes Sweeping AI Regulation Bill with Strict Penalties',
      subtitle: 'Companies face fines up to 7% of global revenue for violating AI rules',
      summary: 'The European Parliament passed the world\'s most comprehensive AI regulation framework, establishing risk-based categories for AI systems and imposing fines of up to 7% of global annual revenue.',
      category: 'World', author: { name: 'Thomas Mueller', avatar: '🇪🇺', verified: true },
      publisher: { name: 'Financial Times', logo: '📰', verified: true },
      publishDate: new Date(Date.now() - 660 * 60000).toISOString(),
      readingTime: 5, views: 310000, likes: 15000, comments: 4200, shares: 16000,
      tags: ['EU', 'AI Regulation', 'Technology Policy', 'Europe'],
      isBreaking: false, isFeatured: false, trendingScore: 84, sentiment: 'neutral', emoji: '🇪🇺'
    },
    {
      id: 'n014', title: "Oil Prices Spike 8% After OPEC+ Announces Surprise Production Cut",
      subtitle: 'Brent crude hits $98/barrel as Saudi Arabia leads deeper supply reductions',
      summary: 'Oil prices surged 8% after OPEC+ members agreed to an unexpected production cut of 1.5 million barrels per day starting next month, with Saudi Arabia leading the effort.',
      category: 'Economy', author: { name: 'Ahmed Al-Rashid', avatar: '⛽', verified: true },
      publisher: { name: 'Bloomberg', logo: '📊', verified: true },
      publishDate: new Date(Date.now() - 720 * 60000).toISOString(),
      readingTime: 3, views: 290000, likes: 8900, comments: 3100, shares: 11000,
      tags: ['Oil', 'OPEC', 'Commodities', 'Energy'],
      isBreaking: false, isFeatured: false, trendingScore: 86, sentiment: 'negative', emoji: '🛢️'
    },
    {
      id: 'n015', title: 'Tesla Recalls 2.1 Million Vehicles Over Autopilot Safety Concerns',
      subtitle: 'NHTSA investigation finds inadequate driver monitoring in Full Self-Driving mode',
      summary: 'Tesla issued a recall of 2.1 million vehicles equipped with its Full Self-Driving beta software after the NHTSA concluded that the driver monitoring system was insufficient.',
      category: 'Business', author: { name: 'John Doe', avatar: '🚗', verified: true },
      publisher: { name: 'Wall Street Journal', logo: '📋', verified: true },
      publishDate: new Date(Date.now() - 780 * 60000).toISOString(),
      readingTime: 4, views: 560000, likes: 12000, comments: 7800, shares: 24000,
      tags: ['Tesla', 'Recall', 'Autopilot', 'NHTSA'],
      isBreaking: false, isFeatured: false, trendingScore: 83, sentiment: 'negative', emoji: '🚗'
    },
    {
      id: 'n016', title: '190 Nations at COP31 Agree to Triple Renewable Energy by 2030',
      subtitle: 'Landmark agreement includes $500 billion annual climate finance pledge',
      summary: 'World leaders at COP31 in Nairobi agreed to triple global renewable energy capacity by 2030 and committed $500 billion annually in climate finance for developing nations.',
      category: 'Environment', author: { name: 'Greta Thunberg', avatar: '🌍', verified: true },
      publisher: { name: 'The Guardian', logo: '🌿', verified: true },
      publishDate: new Date(Date.now() - 840 * 60000).toISOString(),
      readingTime: 6, views: 670000, likes: 45000, comments: 9800, shares: 52000,
      tags: ['Climate', 'COP31', 'Renewable Energy', 'Environment'],
      isBreaking: false, isFeatured: true, trendingScore: 90, sentiment: 'positive', emoji: '🌍'
    },
    {
      id: 'n017', title: "Moderna's Cancer Vaccine Shows 67% Reduction in Melanoma Recurrence",
      subtitle: 'Phase 3 trial results published in NEJM mark potential paradigm shift',
      summary: 'Moderna and Merck reported that their personalized mRNA cancer vaccine reduced melanoma recurrence by 67% in a Phase 3 trial of 650 patients, potentially revolutionizing cancer treatment.',
      category: 'Health', author: { name: 'Dr. Lisa Sanders', avatar: '👩‍⚕️', verified: true },
      publisher: { name: 'New England Journal of Medicine', logo: '💊', verified: true },
      publishDate: new Date(Date.now() - 900 * 60000).toISOString(),
      readingTime: 5, views: 380000, likes: 32000, comments: 4500, shares: 28000,
      tags: ['Moderna', 'Cancer Vaccine', 'mRNA', 'Medical Breakthrough'],
      isBreaking: false, isFeatured: true, trendingScore: 91, sentiment: 'positive', emoji: '💉'
    },
    {
      id: 'n018', title: 'NVIDIA Stock Hits $200 as AI Chip Demand Outstrips Supply',
      subtitle: 'Data center revenue doubles year-over-year',
      summary: 'NVIDIA shares crossed $200 for the first time after reporting data center revenue of $41.2 billion, more than double the previous year, driven by demand for its Blackwell B200 AI chips.',
      category: 'Business', author: { name: 'Mark Chen', avatar: '📈', verified: true },
      publisher: { name: 'Bloomberg', logo: '📊', verified: true },
      publishDate: new Date(Date.now() - 960 * 60000).toISOString(),
      readingTime: 4, views: 890000, likes: 34000, comments: 6700, shares: 28000,
      tags: ['NVIDIA', 'AI Chips', 'Stock Market', 'Technology'],
      isBreaking: false, isFeatured: false, trendingScore: 88, sentiment: 'positive', emoji: '💹'
    },
    {
      id: 'n019', title: 'ISRO Successfully Tests Reusable Launch Vehicle at Sriharikota',
      subtitle: 'Third landing test of RLV-TD completes successfully',
      summary: 'ISRO successfully completed the third test flight of its Reusable Launch Vehicle Technology Demonstrator, landing it autonomously at Sriharikota after a suborbital trajectory.',
      category: 'Science', author: { name: 'Priya Sharma', avatar: '🛰️', verified: true },
      publisher: { name: 'Times of India', logo: '🇮🇳', verified: true },
      publishDate: new Date(Date.now() - 1020 * 60000).toISOString(),
      readingTime: 4, views: 450000, likes: 38000, comments: 5600, shares: 32000,
      tags: ['ISRO', 'Space', 'Reusable Launch Vehicle', 'India'],
      isBreaking: false, isFeatured: false, trendingScore: 85, sentiment: 'positive', emoji: '🇮🇳'
    },
    {
      id: 'n020', title: "Modi Inaugurates World's Longest Undersea Tunnel Connecting Mumbai to Navi Mumbai",
      subtitle: 'The 21.8 km tunnel reduces travel time from 2 hours to 15 minutes',
      summary: "PM Modi inaugurated the Mumbai Trans-Harbour Link undersea tunnel, the world's longest underwater road tunnel at 21.8 km, dramatically cutting travel time.",
      category: 'India', author: { name: 'Anjali Mehta', avatar: '🏗️', verified: true },
      publisher: { name: 'NDTV', logo: '📺', verified: true },
      publishDate: new Date(Date.now() - 1080 * 60000).toISOString(),
      readingTime: 4, views: 620000, likes: 41000, comments: 7800, shares: 35000,
      tags: ['India', 'Mumbai', 'Infrastructure', 'Modi'],
      isBreaking: false, isFeatured: true, trendingScore: 86, sentiment: 'positive', emoji: '🚇'
    },
    {
      id: 'n021', title: 'Ethereum Completes Dawn Upgrade, Gas Fees Drop 95%',
      subtitle: 'Layer 1 scaling solution processes 100,000 transactions per second',
      summary: 'Ethereum\'s Dawn upgrade went live, implementing full sharding on the base layer and reducing average gas fees from $2.50 to $0.12, while increasing throughput to 100,000 TPS.',
      category: 'Crypto', author: { name: 'Laura Shin', avatar: '🔷', verified: true },
      publisher: { name: 'Unchained', logo: '⛓️', verified: true },
      publishDate: new Date(Date.now() - 1140 * 60000).toISOString(),
      readingTime: 5, views: 540000, likes: 38000, comments: 9200, shares: 35000,
      tags: ['Ethereum', 'Gas Fees', 'Blockchain', 'DeFi'],
      isBreaking: false, isFeatured: true, trendingScore: 92, sentiment: 'positive', emoji: '🔷'
    },
    {
      id: 'n022', title: "Messi Announces Retirement After Record 9th Ballon d'Or",
      subtitle: 'Argentine legend will play his final match at 2026 FIFA World Cup',
      summary: "Lionel Messi announced he will retire after the 2026 FIFA World Cup, bringing the curtain down on a career that includes a record 9 Ballon d'Or awards.",
      category: 'Sports', author: { name: 'Sid Lowe', avatar: '⚽', verified: true },
      publisher: { name: 'The Athletic', logo: '🏅', verified: true },
      publishDate: new Date(Date.now() - 1200 * 60000).toISOString(),
      readingTime: 5, views: 2100000, likes: 156000, comments: 34000, shares: 120000,
      tags: ['Messi', 'Football', 'Retirement', 'World Cup'],
      isBreaking: false, isFeatured: true, trendingScore: 97, sentiment: 'negative', emoji: '⚽'
    },
    {
      id: 'n023', title: 'Amazon Acquires Anthropic for $85 Billion in Largest AI Deal Ever',
      subtitle: 'Deal consolidates Amazons position in generative AI race',
      summary: "Amazon announced the acquisition of Anthropic for $85 billion, the largest deal in AI history. Anthropic will operate as an independent subsidiary.",
      category: 'AI', author: { name: 'Kevin Roose', avatar: '🤖', verified: true },
      publisher: { name: 'The New York Times', logo: '📰', verified: true },
      publishDate: new Date(Date.now() - 1260 * 60000).toISOString(),
      readingTime: 6, views: 980000, likes: 42000, comments: 11000, shares: 48000,
      tags: ['Amazon', 'Anthropic', 'AI', 'Acquisition'],
      isBreaking: false, isFeatured: true, trendingScore: 94, sentiment: 'neutral', emoji: '🤝'
    },
    {
      id: 'n024', title: 'Ukraine and Russia Agree to 90-Day Ceasefire Under UN Mediation',
      subtitle: 'Historic agreement signed in Geneva as both sides agree to negotiate peace',
      summary: "Ukraine and Russia signed a 90-day ceasefire agreement in Geneva under UN mediation, the first pause in fighting since the conflict began.",
      category: 'World', author: { name: 'Christiane Amanpour', avatar: '🕊️', verified: true },
      publisher: { name: 'CNN', logo: '📡', verified: true },
      publishDate: new Date(Date.now() - 1320 * 60000).toISOString(),
      readingTime: 7, views: 1800000, likes: 98000, comments: 22000, shares: 89000,
      tags: ['Ukraine', 'Russia', 'Ceasefire', 'Peace'],
      isBreaking: false, isFeatured: true, trendingScore: 96, sentiment: 'positive', emoji: '🕊️'
    },
    {
      id: 'n025', title: 'Dow Jones Closes Above 50,000 for First Time in History',
      subtitle: 'Blue-chip index surges on AI boom and strong corporate earnings',
      summary: 'The Dow Jones Industrial Average closed above 50,000 for the first time, driven by exceptional corporate earnings and the continued AI investment boom.',
      category: 'Breaking', author: { name: 'Martin Soong', avatar: '📈', verified: true },
      publisher: { name: 'CNBC', logo: '📺', verified: true },
      publishDate: new Date(Date.now() - 10 * 60000).toISOString(),
      readingTime: 3, views: 920000, likes: 45000, comments: 11000, shares: 56000,
      tags: ['Dow Jones', 'Stock Market', 'Record High', 'Bull Market'],
      isBreaking: true, isFeatured: true, trendingScore: 96, sentiment: 'positive', emoji: '📈'
    },
    {
      id: 'n026', title: 'Google Launches Gemini 3.0 Ultra, Claims AI Parity with Human PhDs',
      subtitle: 'New multimodal model processes 10 million token context windows',
      summary: 'Google DeepMind unveiled Gemini 3.0 Ultra, which can process 10 million token context windows and reportedly performs at parity with human PhD researchers.',
      category: 'AI', author: { name: 'Steven Levy', avatar: '🧠', verified: true },
      publisher: { name: 'Wired', logo: '🔌', verified: true },
      publishDate: new Date(Date.now() - 1860 * 60000).toISOString(),
      readingTime: 5, views: 670000, likes: 38000, comments: 8900, shares: 34000,
      tags: ['Google', 'Gemini', 'AI', 'DeepMind'],
      isBreaking: false, isFeatured: true, trendingScore: 91, sentiment: 'positive', emoji: '🧠'
    },
    {
      id: 'n027', title: 'Great Barrier Reef Shows Signs of Recovery After Coral Bleaching',
      subtitle: 'Australian scientists report 40% coral regrowth',
      summary: 'Marine biologists reported 40% coral regrowth in the Great Barrier Reef after two consecutive years of cooler ocean temperatures reduced bleaching events.',
      category: 'Environment', author: { name: 'Julia Baird', avatar: '🐠', verified: true },
      publisher: { name: 'ABC Australia', logo: '🦘', verified: true },
      publishDate: new Date(Date.now() - 1920 * 60000).toISOString(),
      readingTime: 4, views: 340000, likes: 28000, comments: 3200, shares: 19000,
      tags: ['Great Barrier Reef', 'Coral', 'Climate', 'Recovery'],
      isBreaking: false, isFeatured: false, trendingScore: 78, sentiment: 'positive', emoji: '🐠'
    },
    {
      id: 'n028', title: 'Gold Hits Record $3,200/oz as Central Banks Accelerate Reserves Diversification',
      subtitle: 'India and China lead gold purchases as dollar dominance questioned',
      summary: 'Gold prices surged to a record $3,200/oz as central banks, particularly India and China, accelerated their gold reserve purchases.',
      category: 'Economy', author: { name: 'Jan Nieuwenhuijs', avatar: '🥇', verified: true },
      publisher: { name: 'GoldPrice.org', logo: '💰', verified: true },
      publishDate: new Date(Date.now() - 1980 * 60000).toISOString(),
      readingTime: 3, views: 290000, likes: 16000, comments: 4100, shares: 12000,
      tags: ['Gold', 'Central Banks', 'Reserves', 'Commodities'],
      isBreaking: false, isFeatured: false, trendingScore: 80, sentiment: 'positive', emoji: '🥇'
    },
    {
      id: 'n029', title: 'IPL 2026: MS Dhoni\'s Son Ziva Signs Record Rs 16 Cr Deal with CSK',
      subtitle: '18-year-old all-rounder becomes most expensive uncapped player in IPL history',
      summary: 'Ziva Dhoni was signed by Chennai Super Kings for Rs 16 crore at the IPL 2026 mega auction, making the 18-year-old the most expensive uncapped player in IPL history.',
      category: 'Sports', author: { name: 'Karthik Krishnaswamy', avatar: '🏏', verified: true },
      publisher: { name: 'ESPNcricinfo', logo: '🏆', verified: true },
      publishDate: new Date(Date.now() - 2040 * 60000).toISOString(),
      readingTime: 3, views: 1800000, likes: 92000, comments: 28000, shares: 78000,
      tags: ['IPL', 'Dhoni', 'Cricket', 'CSK'],
      isBreaking: false, isFeatured: false, trendingScore: 94, sentiment: 'positive', emoji: '🏏'
    },
    {
      id: 'n030', title: 'Samsung Unveils Galaxy S26 with On-Device AI That Writes Your Emails',
      subtitle: 'New Galaxy Intelligence features generate full responses',
      summary: 'Samsung launched the Galaxy S26 featuring Galaxy Intelligence, on-device AI that can draft complete emails, summarize meetings, and negotiate appointments.',
      category: 'Technology', author: { name: 'David Phelan', avatar: '📱', verified: true },
      publisher: { name: 'Forbes', logo: '💼', verified: true },
      publishDate: new Date(Date.now() - 2220 * 60000).toISOString(),
      readingTime: 4, views: 560000, likes: 28000, comments: 6700, shares: 24000,
      tags: ['Samsung', 'Galaxy S26', 'AI', 'Smartphone'],
      isBreaking: false, isFeatured: false, trendingScore: 83, sentiment: 'positive', emoji: '📱'
    },
    {
      id: 'n031', title: "India's UPI Processes Record 20 Billion Transactions in Single Month",
      subtitle: 'Digital payment system processes more than Visa and Mastercard combined',
      summary: 'India\'s UPI processed a record 20 billion transactions in a single month, equivalent to $420 billion, cementing its position as the world\'s largest real-time digital payment system.',
      category: 'India', author: { name: 'Nikhil Subramaniam', avatar: '💳', verified: true },
      publisher: { name: 'Moneycontrol', logo: '💰', verified: true },
      publishDate: new Date(Date.now() - 2280 * 60000).toISOString(),
      readingTime: 3, views: 410000, likes: 32000, comments: 4800, shares: 22000,
      tags: ['UPI', 'Digital Payments', 'India', 'Fintech'],
      isBreaking: false, isFeatured: false, trendingScore: 82, sentiment: 'positive', emoji: '💳'
    },
    {
      id: 'n032', title: 'COP31 Host City Nairobi Transforms into Carbon-Neutral Smart City',
      subtitle: 'Kenyan capital becomes first African city to achieve net-zero emissions',
      summary: 'Nairobi has become the first African city to achieve carbon neutrality, with 100% electric public transport, AI-managed power grid, and 40% urban reforestation.',
      category: 'Environment', author: { name: 'Wangari Maathai II', avatar: '🌱', verified: true },
      publisher: { name: 'Al Jazeera', logo: '🌍', verified: true },
      publishDate: new Date(Date.now() - 2340 * 60000).toISOString(),
      readingTime: 5, views: 320000, likes: 26000, comments: 3400, shares: 18000,
      tags: ['Nairobi', 'Carbon Neutral', 'Smart City', 'Africa'],
      isBreaking: false, isFeatured: false, trendingScore: 75, sentiment: 'positive', emoji: '🌱'
    },
    {
      id: 'n033', title: 'RBI Cuts Repo Rate by 25 Basis Points to 5.75%, Markets Rally',
      subtitle: 'Third consecutive rate cut signals more easing ahead',
      summary: 'The Reserve Bank of India cut its benchmark repo rate by 25 basis points to 5.75%, the third consecutive cut, as inflation fell to 3.2%.',
      category: 'Economy', author: { name: 'Sugata Ghosh', avatar: '🏦', verified: true },
      publisher: { name: 'Economic Times', logo: '💰', verified: true },
      publishDate: new Date(Date.now() - 2460 * 60000).toISOString(),
      readingTime: 3, views: 380000, likes: 15000, comments: 3200, shares: 12000,
      tags: ['RBI', 'Interest Rate', 'Repo Rate', 'India'],
      isBreaking: false, isFeatured: false, trendingScore: 81, sentiment: 'positive', emoji: '🏦'
    },
    {
      id: 'n034', title: 'Taylor Swift Announces Eras Tour 2.0 with AI-Enhanced Stage Design',
      subtitle: 'Concert series uses holographic projections and real-time crowd analytics',
      summary: 'Taylor Swift announced Eras Tour 2.0, featuring AI-enhanced stage design with holographic projections, real-time crowd analytics, and personalized visual effects.',
      category: 'Entertainment', author: { name: 'Rob Sheffield', avatar: '🎤', verified: true },
      publisher: { name: 'Rolling Stone', logo: '🎵', verified: true },
      publishDate: new Date(Date.now() - 2520 * 60000).toISOString(),
      readingTime: 3, views: 2400000, likes: 189000, comments: 42000, shares: 156000,
      tags: ['Taylor Swift', 'Concert', 'AI', 'Music'],
      isBreaking: false, isFeatured: true, trendingScore: 95, sentiment: 'positive', emoji: '🎤'
    },
    {
      id: 'n035', title: 'Warren Buffett Sells $80 Billion in Apple Shares, Raises Cash to $320B',
      subtitle: 'Legendary investor reduces Apple stake by 65%',
      summary: "Berkshire Hathaway sold $80 billion of Apple shares, reducing its stake by 65% and building a record cash position of $320 billion.",
      category: 'Business', author: { name: 'Andrew Ross Sorkin', avatar: '💰', verified: true },
      publisher: { name: 'The New York Times', logo: '📰', verified: true },
      publishDate: new Date(Date.now() - 2640 * 60000).toISOString(),
      readingTime: 4, views: 720000, likes: 28000, comments: 8900, shares: 34000,
      tags: ['Warren Buffett', 'Berkshire Hathaway', 'Apple', 'Stock Market'],
      isBreaking: false, isFeatured: false, trendingScore: 87, sentiment: 'negative', emoji: '💰'
    },
    {
      id: 'n036', title: 'US Jobs Report: 312,000 Jobs Added, Unemployment Falls to 3.4%',
      subtitle: 'Labor market remains red hot, wage growth moderates',
      summary: 'The U.S. economy added 312,000 jobs, well above the 225,000 forecast, while unemployment fell to 3.4%, the lowest since 1953.',
      category: 'Economy', author: { name: 'Jed Kolko', avatar: '📊', verified: true },
      publisher: { name: 'Reuters', logo: '📰', verified: true },
      publishDate: new Date(Date.now() - 1740 * 60000).toISOString(),
      readingTime: 4, views: 450000, likes: 12000, comments: 3400, shares: 15000,
      tags: ['Jobs Report', 'Employment', 'Federal Reserve', 'Wages'],
      isBreaking: false, isFeatured: false, trendingScore: 82, sentiment: 'neutral', emoji: '💼'
    },
    {
      id: 'n037', title: 'NASA Confirms Organic Molecules on Europa\'s Ocean Floor',
      subtitle: 'Submersible probe finds amino acids suggesting possible microbial life',
      summary: "NASA confirmed that its Europa Clipper probe discovered amino acids on Europa's ocean floor, suggesting the possibility of microbial life in the subsurface ocean.",
      category: 'Science', author: { name: 'Carl Sagan III', avatar: '🌌', verified: true },
      publisher: { name: 'Scientific American', logo: '🔬', verified: true },
      publishDate: new Date(Date.now() - 2760 * 60000).toISOString(),
      readingTime: 7, views: 1400000, likes: 98000, comments: 18000, shares: 89000,
      tags: ['NASA', 'Europa', 'Life', 'Space Discovery'],
      isBreaking: false, isFeatured: true, trendingScore: 95, sentiment: 'positive', emoji: '🌌'
    },
    {
      id: 'n038', title: 'India Bans All Single-Use Plastics Nationwide with Rs 10 Lakh Fine',
      subtitle: 'Strictest plastic ban in the world takes effect',
      summary: 'India implemented the world\'s strictest ban on single-use plastics, with fines of up to Rs 10 lakh for violations covering all single-use plastic items.',
      category: 'India', author: { name: 'Sunita Narain', avatar: '♻️', verified: true },
      publisher: { name: 'Down To Earth', logo: '🌍', verified: true },
      publishDate: new Date(Date.now() - 2820 * 60000).toISOString(),
      readingTime: 4, views: 520000, likes: 38000, comments: 6700, shares: 34000,
      tags: ['Plastic Ban', 'India', 'Environment', 'Policy'],
      isBreaking: false, isFeatured: false, trendingScore: 80, sentiment: 'positive', emoji: '♻️'
    },
    {
      id: 'n039', title: "IPL 2026 Final: Mumbai Indians Defeat CSK in Thriller to Win 6th Title",
      subtitle: "Hardik Pandya's 47 off 18 balls seals dramatic 3-run victory",
      summary: 'Mumbai Indians clinched their record sixth IPL title after defeating Chennai Super Kings by 3 runs in a thrilling final at Narendra Modi Stadium.',
      category: 'Sports', author: { name: 'Deivarayan Muthu', avatar: '🏏', verified: true },
      publisher: { name: 'ESPNcricinfo', logo: '🏆', verified: true },
      publishDate: new Date(Date.now() - 3060 * 60000).toISOString(),
      readingTime: 4, views: 2200000, likes: 134000, comments: 38000, shares: 98000,
      tags: ['IPL', 'Mumbai Indians', 'CSK', 'Cricket'],
      isBreaking: false, isFeatured: true, trendingScore: 96, sentiment: 'positive', emoji: '🏏'
    },
    {
      id: 'n040', title: 'Copa America 2026: Argentina Defeats Brazil 3-1 in Final',
      subtitle: 'Messi scores twice as Argentina lifts trophy for record 17th time',
      summary: 'Argentina defeated Brazil 3-1 in the Copa America 2026 final in Buenos Aires, with Lionel Messi scoring twice in what could be his last international tournament.',
      category: 'Sports', author: { name: 'Tim Vickery', avatar: '⚽', verified: true },
      publisher: { name: 'BBC Sport', logo: '⚽', verified: true },
      publishDate: new Date(Date.now() - 5880 * 60000).toISOString(),
      readingTime: 4, views: 2200000, likes: 145000, comments: 32000, shares: 110000,
      tags: ['Copa America', 'Argentina', 'Messi', 'Football'],
      isBreaking: false, isFeatured: true, trendingScore: 94, sentiment: 'positive', emoji: '⚽'
    },
    {
      id: 'n041', title: 'T20 World Cup Final: India vs Pakistan Draws Record 1.2 Billion Viewers',
      subtitle: 'Most-watched cricket match in history as India clinches trophy',
      summary: 'The T20 World Cup final between Pakistan and India drew a record 1.2 billion viewers worldwide, making it the most-watched cricket match in history. India won by 7 runs.',
      category: 'Sports', author: { name: 'Osman Samiuddin', avatar: '🏏', verified: true },
      publisher: { name: 'The Athletic', logo: '🏅', verified: true },
      publishDate: new Date(Date.now() - 5400 * 60000).toISOString(),
      readingTime: 4, views: 2800000, likes: 189000, comments: 45000, shares: 134000,
      tags: ['Cricket', 'T20 World Cup', 'India', 'Pakistan'],
      isBreaking: false, isFeatured: true, trendingScore: 98, sentiment: 'positive', emoji: '🏏'
    },
    {
      id: 'n042', title: 'Meta Releases Llama 4 as Fully Open-Source, Rivaling GPT-5',
      subtitle: '70B parameter model available under Apache 2.0 license',
      summary: 'Meta released Llama 4, a 70B parameter language model that rivals GPT-5 on major benchmarks, fully open-sourced under the Apache 2.0 license.',
      category: 'AI', author: { name: 'Will Douglas Heaven', avatar: '🦙', verified: true },
      publisher: { name: 'MIT Technology Review', logo: '🔬', verified: true },
      publishDate: new Date(Date.now() - 5040 * 60000).toISOString(),
      readingTime: 5, views: 560000, likes: 38000, comments: 7800, shares: 32000,
      tags: ['Meta', 'Llama 4', 'Open Source', 'AI'],
      isBreaking: false, isFeatured: true, trendingScore: 89, sentiment: 'positive', emoji: '🦙'
    },
    {
      id: 'n043', title: 'Microsoft Copilot 2.0 Can Write, Debug, and Deploy Entire Software Projects',
      subtitle: 'AI pair programmer handles full development lifecycle autonomously',
      summary: 'Microsoft launched Copilot 2.0, an AI tool that can autonomously write, debug, test, and deploy complete software projects from natural language descriptions.',
      category: 'AI', author: { name: 'Emilia David', avatar: '💻', verified: true },
      publisher: { name: 'VentureBeat', logo: '🔍', verified: true },
      publishDate: new Date(Date.now() - 4620 * 60000).toISOString(),
      readingTime: 5, views: 780000, likes: 42000, comments: 9800, shares: 38000,
      tags: ['Microsoft', 'Copilot', 'AI', 'Software Development'],
      isBreaking: false, isFeatured: true, trendingScore: 90, sentiment: 'positive', emoji: '💻'
    },
    {
      id: 'n044', title: "India Launches BharatGPT — Homegrown AI Trained on 22 Languages",
      subtitle: 'Government-backed AI handles Hindi, Tamil, Bengali and 19 other languages',
      summary: 'India unveiled BharatGPT, a government-backed AI language model trained on all 22 scheduled Indian languages for seamless translation and generation.',
      category: 'AI', author: { name: 'Vijay Prasad', avatar: '🇮🇳', verified: true },
      publisher: { name: 'The Wire', logo: '📰', verified: true },
      publishDate: new Date(Date.now() - 5280 * 60000).toISOString(),
      readingTime: 5, views: 580000, likes: 42000, comments: 6700, shares: 28000,
      tags: ['BharatGPT', 'AI', 'India', 'Languages'],
      isBreaking: false, isFeatured: true, trendingScore: 88, sentiment: 'positive', emoji: '🇮🇳'
    },
    {
      id: 'n045', title: "CRISPR Gene Therapy Cures Sickle Cell Disease in FDA Approval",
      subtitle: 'First-ever CRISPR-based therapy approved for genetic blood disorder',
      summary: 'The FDA approved the first CRISPR-based gene therapy for sickle cell disease, Vertex Pharmaceuticals\' Casgevy, a one-time treatment costing $2.2 million.',
      category: 'Health', author: { name: 'Fiona Peachey', avatar: '🧬', verified: true },
      publisher: { name: 'STAT News', logo: '💊', verified: true },
      publishDate: new Date(Date.now() - 3300 * 60000).toISOString(),
      readingTime: 5, views: 340000, likes: 28000, comments: 4200, shares: 22000,
      tags: ['CRISPR', 'Gene Therapy', 'FDA', 'Sickle Cell'],
      isBreaking: false, isFeatured: false, trendingScore: 81, sentiment: 'positive', emoji: '🧬'
    },
    {
      id: 'n046', title: 'Dow Jones Plunges 2,000 Points on Recession Fears',
      subtitle: 'Worst day since March 2020 as yield curve inverts for 200th day',
      summary: 'The Dow plunged 2,000 points, its worst single-day drop since March 2020, as the yield curve inverted for the 200th consecutive day.',
      category: 'Breaking', author: { name: 'Patti Domm', avatar: '📉', verified: true },
      publisher: { name: 'CNBC', logo: '📺', verified: true },
      publishDate: new Date(Date.now() - 30 * 60000).toISOString(),
      readingTime: 4, views: 1500000, likes: 34000, comments: 12000, shares: 56000,
      tags: ['Dow Jones', 'Recession', 'Stock Market', 'Yield Curve'],
      isBreaking: true, isFeatured: true, trendingScore: 98, sentiment: 'negative', emoji: '📉'
    },
    {
      id: 'n047', title: "India Overtakes Japan to Become Third-Largest Economy by GDP",
      subtitle: 'IMF data confirms India at $5.3 trillion vs Japan at $4.9 trillion',
      summary: 'India officially overtook Japan to become the world\'s third-largest economy, with GDP at $5.3 trillion compared to Japan\'s $4.9 trillion.',
      category: 'Breaking', author: { name: 'Lantu Ghosh', avatar: '🥉', verified: true },
      publisher: { name: 'The Economic Times', logo: '💰', verified: true },
      publishDate: new Date(Date.now() - 20 * 60000).toISOString(),
      readingTime: 4, views: 1200000, likes: 89000, comments: 18000, shares: 67000,
      tags: ['India', 'GDP', 'Economy', 'Japan'],
      isBreaking: true, isFeatured: true, trendingScore: 97, sentiment: 'positive', emoji: '🥉'
    },
    {
      id: 'n048', title: "Japan's Nikkei 225 Crashes 12% in Biggest Drop Since 1987",
      subtitle: 'Yen carry trade unwind triggers global market contagion',
      summary: "Japan's Nikkei 225 plummeted 12% in its biggest drop since Black Monday 1987, as the BOJ's surprise rate hike triggered a massive yen carry trade unwind.",
      category: 'Breaking', author: { name: 'Takahiko Miyake', avatar: '📉', verified: true },
      publisher: { name: 'Nikkei Asia', logo: '🌏', verified: true },
      publishDate: new Date(Date.now() - 15 * 60000).toISOString(),
      readingTime: 4, views: 1100000, likes: 28000, comments: 9800, shares: 45000,
      tags: ['Nikkei', 'Japan', 'Stock Market', 'Yen'],
      isBreaking: true, isFeatured: true, trendingScore: 98, sentiment: 'negative', emoji: '📉'
    },
    {
      id: 'n049', title: 'Apple WWDC 2026: iOS 20 Introduces Apple Brain AI Assistant',
      subtitle: 'Siri completely rebuilt with LLM, can operate any app autonomously',
      summary: 'Apple unveiled iOS 20 with Apple Brain, a completely rebuilt Siri powered by a custom LLM that can autonomously operate any app and handle complex multi-step tasks.',
      category: 'Technology', author: { name: 'Peter Cohen', avatar: '🍎', verified: true },
      publisher: { name: 'Macworld', logo: '🍎', verified: true },
      publishDate: new Date(Date.now() - 3900 * 60000).toISOString(),
      readingTime: 6, views: 890000, likes: 56000, comments: 12000, shares: 45000,
      tags: ['Apple', 'WWDC', 'iOS 20', 'Siri', 'AI'],
      isBreaking: false, isFeatured: true, trendingScore: 92, sentiment: 'positive', emoji: '🍎'
    },
    {
      id: 'n050', title: 'XRP Surges 150% After SEC Drops All Appeals in Ripple Case',
      subtitle: 'Final settlement confirms XRP is not a security',
      summary: 'XRP surged 150% after the SEC dropped all remaining appeals in the Ripple case, with the final settlement confirming XRP is not a security.',
      category: 'Crypto', author: { name: 'Daniel Roberts', avatar: '⚡', verified: true },
      publisher: { name: 'Decrypt', logo: '🔓', verified: true },
      publishDate: new Date(Date.now() - 6540 * 60000).toISOString(),
      readingTime: 3, views: 580000, likes: 42000, comments: 8900, shares: 34000,
      tags: ['XRP', 'Ripple', 'SEC', 'Regulation'],
      isBreaking: false, isFeatured: true, trendingScore: 90, sentiment: 'positive', emoji: '⚡'
    },
    {
      id: 'n051', title: 'Dogecoin Surges 200% After Musk Announces X Platform Integration',
      subtitle: 'DOGE becomes default payment currency on X',
      summary: 'Dogecoin surged over 200% after Elon Musk announced DOGE will become the default payment currency on X for subscriptions, tips, and creator payments.',
      category: 'Crypto', author: { name: 'Willy Woo', avatar: '🐕', verified: true },
      publisher: { name: 'Bitcoin Magazine', logo: '₿', verified: true },
      publishDate: new Date(Date.now() - 2940 * 60000).toISOString(),
      readingTime: 3, views: 890000, likes: 67000, comments: 15000, shares: 56000,
      tags: ['Dogecoin', 'Elon Musk', 'X Platform', 'Payments'],
      isBreaking: false, isFeatured: false, trendingScore: 89, sentiment: 'positive', emoji: '🐕'
    },
    {
      id: 'n052', title: "Reliance Industries Launches Jio AI Cloud, Competes with AWS and Azure",
      subtitle: 'Mukesh Ambani promises AI compute at 1/10th current market prices',
      summary: 'Reliance Industries unveiled Jio AI Cloud, an AI cloud platform that promises AI compute resources at one-tenth the current market price.',
      category: 'India', author: { name: 'Guru Prakash', avatar: '☁️', verified: true },
      publisher: { name: 'Livemint', logo: '💰', verified: true },
      publishDate: new Date(Date.now() - 3120 * 60000).toISOString(),
      readingTime: 5, views: 450000, likes: 28000, comments: 5600, shares: 22000,
      tags: ['Reliance', 'Jio', 'AI', 'Cloud Computing'],
      isBreaking: false, isFeatured: false, trendingScore: 83, sentiment: 'positive', emoji: '☁️'
    },
    {
      id: 'n053', title: "Indian Rupee Hits Record High of 72 Against Dollar on FII Inflows",
      subtitle: 'Foreign investors pour $12 billion into Indian equities in June',
      summary: 'The Indian rupee appreciated to a record high of 72 against the USD, driven by $12 billion in foreign institutional investor inflows in June.',
      category: 'Economy', author: { name: 'Anindya Banerjee', avatar: '💱', verified: true },
      publisher: { name: 'CNBC TV18', logo: '📺', verified: true },
      publishDate: new Date(Date.now() - 3960 * 60000).toISOString(),
      readingTime: 3, views: 280000, likes: 14000, comments: 2800, shares: 10000,
      tags: ['Rupee', 'Dollar', 'FII', 'Currency'],
      isBreaking: false, isFeatured: false, trendingScore: 76, sentiment: 'positive', emoji: '💱'
    },
    {
      id: 'n054', title: 'SpaceX Valued at $500 Billion After Latest Funding Round',
      subtitle: 'Most valuable private company in history',
      summary: 'SpaceX raised $10 billion at a $500 billion valuation, making it the most valuable private company in history.',
      category: 'Business', author: { name: 'Eric Newcomer', avatar: '🚀', verified: true },
      publisher: { name: 'Bloomberg', logo: '📊', verified: true },
      publishDate: new Date(Date.now() - 5760 * 60000).toISOString(),
      readingTime: 3, views: 670000, likes: 28000, comments: 5600, shares: 24000,
      tags: ['SpaceX', 'Valuation', 'Private Company', 'Elon Musk'],
      isBreaking: false, isFeatured: false, trendingScore: 84, sentiment: 'positive', emoji: '🚀'
    },
    {
      id: 'n055', title: 'AI Stocks Bubble Warning: Goldman Sachs Predicts 40% Correction',
      subtitle: 'Parallels drawn to dot-com era valuations',
      summary: 'Goldman Sachs chief equity strategist warned that AI-related stocks face a potential 40% correction risk, drawing parallels to the dot-com bubble.',
      category: 'Business', author: { name: 'David Kostin', avatar: '⚠️', verified: true },
      publisher: { name: 'Goldman Sachs Research', logo: '🏦', verified: true },
      publishDate: new Date(Date.now() - 4320 * 60000).toISOString(),
      readingTime: 5, views: 780000, likes: 18000, comments: 8900, shares: 34000,
      tags: ['Goldman Sachs', 'AI Bubble', 'Stock Market', 'Correction'],
      isBreaking: false, isFeatured: false, trendingScore: 86, sentiment: 'negative', emoji: '⚠️'
    },
    {
      id: 'n056', title: 'Neuralink Receives FDA Approval for Second Human Brain Implant Trial',
      subtitle: 'Trial will test ability to restore speech in paralyzed patients',
      summary: 'Neuralink received FDA approval for its second human clinical trial, testing the N2 implant\'s ability to restore speech in patients with ALS.',
      category: 'Health', author: { name: 'Nicole Wetsman', avatar: '🧠', verified: true },
      publisher: { name: 'The Verge', logo: '⚡', verified: true },
      publishDate: new Date(Date.now() - 4380 * 60000).toISOString(),
      readingTime: 4, views: 560000, likes: 28000, comments: 6700, shares: 24000,
      tags: ['Neuralink', 'Brain Implant', 'FDA', 'Neuroscience'],
      isBreaking: false, isFeatured: false, trendingScore: 82, sentiment: 'positive', emoji: '🧠'
    },
    {
      id: 'n057', title: "India's GST Collections Hit Record Rs 2.2 Lakh Crore in June",
      subtitle: 'Strong compliance and digital enforcement drive revenues',
      summary: "India's GST collections hit a record Rs 2.2 lakh crore ($26.4 billion) in June, driven by improved compliance and strong economic activity.",
      category: 'India', author: { name: 'Timsy Jaipuria', avatar: '🇮🇳', verified: true },
      publisher: { name: 'Economic Times', logo: '💰', verified: true },
      publishDate: new Date(Date.now() - 4440 * 60000).toISOString(),
      readingTime: 3, views: 340000, likes: 18000, comments: 2800, shares: 12000,
      tags: ['GST', 'Tax Revenue', 'India', 'Economy'],
      isBreaking: false, isFeatured: false, trendingScore: 76, sentiment: 'positive', emoji: '🇮🇳'
    },
    {
      id: 'n058', title: "Waymo Expands Autonomous Taxi to 50 US Cities, Handles 2M Trips/Week",
      subtitle: 'Self-driving service now handles 2 million trips weekly with zero at-fault accidents',
      summary: 'Waymo announced expansion to 50 US cities by end of 2026, handling over 2 million trips per week with zero at-fault accidents.',
      category: 'Technology', author: { name: 'Wayne Cunningham', avatar: '🚗', verified: true },
      publisher: { name: 'CNET', logo: '💻', verified: true },
      publishDate: new Date(Date.now() - 3660 * 60000).toISOString(),
      readingTime: 4, views: 480000, likes: 22000, comments: 5600, shares: 19000,
      tags: ['Waymo', 'Autonomous Vehicles', 'Self-Driving', 'Transportation'],
      isBreaking: false, isFeatured: false, trendingScore: 81, sentiment: 'positive', emoji: '🚗'
    },
    {
      id: 'n059', title: "Elon Musk's X Corp Fined $250 Million by EU for Content Moderation",
      subtitle: 'European Commission finds platform violated Digital Services Act',
      summary: 'The European Commission fined X Corp 230 million ($250 million) for systematic failures in content moderation under the Digital Services Act.',
      category: 'Technology', author: { name: 'Casey Newton', avatar: '📱', verified: true },
      publisher: { name: 'Platformer', logo: '🔔', verified: true },
      publishDate: new Date(Date.now() - 1440 * 60000).toISOString(),
      readingTime: 4, views: 750000, likes: 28000, comments: 9800, shares: 34000,
      tags: ['Elon Musk', 'X Corp', 'EU', 'Content Moderation'],
      isBreaking: false, isFeatured: false, trendingScore: 85, sentiment: 'negative', emoji: '📱'
    },
    {
      id: 'n060', title: "India's Aadhaar Digital Health ID Launched for 1.4 Billion Citizens",
      subtitle: 'ABHA ID now accepted at 250,000 hospitals nationwide',
      summary: 'India expanded its ABHA digital health ID to cover all 1.4 billion citizens, now accepted at 250,000 hospitals and clinics nationwide.',
      category: 'India', author: { name: 'Ramesh Abhishek', avatar: '🏥', verified: true },
      publisher: { name: 'Business Standard', logo: '📋', verified: true },
      publishDate: new Date(Date.now() - 3360 * 60000).toISOString(),
      readingTime: 4, views: 380000, likes: 22000, comments: 3800, shares: 16000,
      tags: ['Aadhaar', 'Health', 'Digital India', 'ABHA'],
      isBreaking: false, isFeatured: false, trendingScore: 77, sentiment: 'positive', emoji: '🏥'
    },
    {
      id: 'n061', title: 'Amazon Web Services Announces $15 Billion Data Center Investment in India',
      subtitle: 'New facilities in Hyderabad and Pune to create 50,000 jobs',
      summary: 'AWS announced a $15 billion investment to build three new data center regions in Hyderabad, Pune, and Chennai, creating 50,000 jobs.',
      category: 'Business', author: { name: 'Meenal Sharma', avatar: '☁️', verified: true },
      publisher: { name: 'TechCrunch', logo: '🔧', verified: true },
      publishDate: new Date(Date.now() - 3720 * 60000).toISOString(),
      readingTime: 4, views: 340000, likes: 18000, comments: 3200, shares: 14000,
      tags: ['AWS', 'Data Center', 'India', 'Investment'],
      isBreaking: false, isFeatured: false, trendingScore: 79, sentiment: 'positive', emoji: '☁️'
    },
    {
      id: 'n062', title: "Diljit Dosanjh Performs at Coachella 2026, Breaks Streaming Records",
      subtitle: 'Punjabi music artist draws largest non-English crowd in festival history',
      summary: 'Diljit Dosanjh made history at Coachella 2026 as the first Punjabi artist to headline the main stage, breaking Spotify\'s single-day streaming record.',
      category: 'Entertainment', author: { name: 'Jem Aswad', avatar: '🎵', verified: true },
      publisher: { name: 'Variety', logo: '🎞️', verified: true },
      publishDate: new Date(Date.now() - 3480 * 60000).toISOString(),
      readingTime: 3, views: 1600000, likes: 112000, comments: 24000, shares: 89000,
      tags: ['Diljit Dosanjh', 'Coachella', 'Punjabi Music', 'Streaming'],
      isBreaking: false, isFeatured: false, trendingScore: 88, sentiment: 'positive', emoji: '🎵'
    },
    {
      id: 'n063', title: 'Pakistan Default Crisis Averted as IMF Approves $8 Billion Bailout',
      subtitle: 'IMF conditions include 25% tax increase on wealthy',
      summary: 'Pakistan averted sovereign default after the IMF approved an $8 billion bailout, conditional on a 25% tax increase on high-income earners.',
      category: 'World', author: { name: 'Irfan Hussain', avatar: '🏦', verified: true },
      publisher: { name: 'Dawn', logo: '📰', verified: true },
      publishDate: new Date(Date.now() - 3600 * 60000).toISOString(),
      readingTime: 5, views: 420000, likes: 15000, comments: 6700, shares: 18000,
      tags: ['Pakistan', 'IMF', 'Bailout', 'Economy'],
      isBreaking: false, isFeatured: false, trendingScore: 79, sentiment: 'neutral', emoji: '🏦'
    },
    {
      id: 'n064', title: 'Bollywood Blockbuster Chakra Becomes Highest-Grossing Indian Film Ever',
      subtitle: 'Rs 2,800 crore worldwide in just 10 days',
      summary: 'The Telugu-Hindi bilingual epic Chakra directed by S.S. Rajamouli has become the highest-grossing Indian film of all time at Rs 2,800 crore worldwide.',
      category: 'Entertainment', author: { name: 'Baradwaj Rangan', avatar: '🎬', verified: true },
      publisher: { name: 'Film Companion', logo: '🎥', verified: true },
      publishDate: new Date(Date.now() - 1620 * 60000).toISOString(),
      readingTime: 3, views: 1200000, likes: 89000, comments: 18000, shares: 72000,
      tags: ['Bollywood', 'Chakra', 'Rajamouli', 'Box Office'],
      isBreaking: false, isFeatured: false, trendingScore: 88, sentiment: 'positive', emoji: '🎥'
    },
    {
      id: 'n065', title: 'Hollywood Actors Strike Ends After AI Consent Agreement',
      subtitle: 'Studios agree to pay residuals for AI-generated likenesses',
      summary: 'The 118-day Hollywood actors strike ended after studios agreed to a landmark deal requiring AI consent and residual payments for digital likenesses.',
      category: 'Entertainment', author: { name: 'Bryan Stolz', avatar: '🎭', verified: true },
      publisher: { name: 'Deadline', logo: '🎬', verified: true },
      publishDate: new Date(Date.now() - 4500 * 60000).toISOString(),
      readingTime: 5, views: 680000, likes: 34000, comments: 8900, shares: 28000,
      tags: ['Hollywood', 'Strike', 'AI', 'Actors'],
      isBreaking: false, isFeatured: false, trendingScore: 81, sentiment: 'positive', emoji: '🎭'
    },
    {
      id: 'n066', title: 'World Largest Offshore Wind Farm Begins Operations off Gujarat',
      subtitle: '5 GW facility powers 8 million homes',
      summary: 'India inaugurated the world\'s largest offshore wind farm off Gujarat, with a 5 GW capacity powering 8 million homes.',
      category: 'Environment', author: { name: 'Anupam Mishra', avatar: '🌊', verified: true },
      publisher: { name: 'Clean Energy Wire', logo: '⚡', verified: true },
      publishDate: new Date(Date.now() - 4560 * 60000).toISOString(),
      readingTime: 4, views: 420000, likes: 32000, comments: 3800, shares: 22000,
      tags: ['Wind Energy', 'Offshore', 'India', 'Renewable'],
      isBreaking: false, isFeatured: false, trendingScore: 78, sentiment: 'positive', emoji: '🌊'
    },
    {
      id: 'n067', title: 'Solana Surpasses Ethereum in Daily Active Users for First Time',
      subtitle: 'High-speed chain processes 65 million transactions',
      summary: 'Solana overtook Ethereum in daily active addresses for the first time, recording 65 million unique users driven by meme coin trading.',
      category: 'Crypto', author: { name: 'Frank Chaparro', avatar: '🟣', verified: true },
      publisher: { name: 'The Block', logo: '🔗', verified: true },
      publishDate: new Date(Date.now() - 1680 * 60000).toISOString(),
      readingTime: 4, views: 320000, likes: 21000, comments: 5600, shares: 18000,
      tags: ['Solana', 'Ethereum', 'Blockchain', 'DeFi'],
      isBreaking: false, isFeatured: false, trendingScore: 84, sentiment: 'positive', emoji: '🟣'
    },
    {
      id: 'n068', title: 'Brent Crude Falls Below $70 as EV Sales Top 50% Globally',
      subtitle: 'OPEC lowers demand forecast as EV adoption accelerates',
      summary: 'Brent crude fell below $70/bbl as global EV sales crossed 50% of new car sales, prompting OPEC to lower long-term demand forecasts.',
      category: 'Economy', author: { name: 'Grant Smith', avatar: '🛢️', verified: true },
      publisher: { name: 'Bloomberg', logo: '📊', verified: true },
      publishDate: new Date(Date.now() - 5160 * 60000).toISOString(),
      readingTime: 4, views: 380000, likes: 15000, comments: 4200, shares: 14000,
      tags: ['Oil', 'EV', 'OPEC', 'Energy Transition'],
      isBreaking: false, isFeatured: false, trendingScore: 80, sentiment: 'negative', emoji: '🛢️'
    },
    {
      id: 'n069', title: 'Meta Launches Quest 4 with Photorealistic Avatars at $499',
      subtitle: 'Workspace mode creates infinite virtual monitors',
      summary: 'Meta launched Quest 4 at $499 featuring photorealistic avatars and a Workspace mode creating infinite virtual monitors.',
      category: 'Technology', author: { name: 'Nilay Patel', avatar: '🥽', verified: true },
      publisher: { name: 'The Verge', logo: '⚡', verified: true },
      publishDate: new Date(Date.now() - 2400 * 60000).toISOString(),
      readingTime: 4, views: 480000, likes: 24000, comments: 6700, shares: 21000,
      tags: ['Meta', 'Quest 4', 'VR', 'Mixed Reality'],
      isBreaking: false, isFeatured: false, trendingScore: 80, sentiment: 'positive', emoji: '🥽'
    },
    {
      id: 'n070', title: "PM Modi Launches Digital India 2.0 with Rs 50,000 Cr AI Fund",
      subtitle: 'Aims to make India the world\'s largest AI talent hub',
      summary: 'PM Modi launched Digital India 2.0 with a Rs 50,000 crore fund for AI research, cybersecurity, and 10 million digital skills over five years.',
      category: 'India', author: { name: 'Aroon Deep', avatar: '🇮🇳', verified: true },
      publisher: { name: 'The Hindu', logo: '🇮🇳', verified: true },
      publishDate: new Date(Date.now() - 6120 * 60000).toISOString(),
      readingTime: 5, views: 480000, likes: 32000, comments: 5600, shares: 24000,
      tags: ['Digital India', 'AI', 'Cybersecurity', 'Modi'],
      isBreaking: false, isFeatured: true, trendingScore: 85, sentiment: 'positive', emoji: '🇮🇳'
    },
    {
      id: 'n071', title: "Tata Electronics Acquires Majority Stake in Micron's Gujarat DRAM Facility",
      subtitle: 'Deal marks Indias entry into semiconductor memory manufacturing',
      summary: 'Tata Electronics acquired a 51% stake in Micron\'s Gujarat DRAM fab for $3.2 billion, marking India\'s entry into semiconductor memory.',
      category: 'India', author: { name: 'Niraj Rajopadhye', avatar: '🔬', verified: true },
      publisher: { name: 'Business Standard', logo: '📋', verified: true },
      publishDate: new Date(Date.now() - 5700 * 60000).toISOString(),
      readingTime: 4, views: 380000, likes: 22000, comments: 3200, shares: 14000,
      tags: ['Tata', 'Micron', 'Semiconductor', 'India'],
      isBreaking: false, isFeatured: false, trendingScore: 78, sentiment: 'positive', emoji: '🔬'
    },
    {
      id: 'n072', title: 'Australian Open 2026: Djokovic Wins 25th Grand Slam at Age 38',
      subtitle: 'Serbian legend defeats Sinner in five-set epic',
      summary: 'Novak Djokovic won his 25th Grand Slam title at the Australian Open, defeating Sinner in five sets at age 38.',
      category: 'Sports', author: { name: 'Courtney Nguyen', avatar: '🎾', verified: true },
      publisher: { name: 'WTA Tennis', logo: '🏆', verified: true },
      publishDate: new Date(Date.now() - 5220 * 60000).toISOString(),
      readingTime: 4, views: 1800000, likes: 98000, comments: 22000, shares: 78000,
      tags: ['Djokovic', 'Australian Open', 'Tennis', 'Grand Slam'],
      isBreaking: false, isFeatured: true, trendingScore: 92, sentiment: 'positive', emoji: '🎾'
    },
    {
      id: 'n073', title: 'DeFi Protocol MakerDAO Launches $100B Real World Asset Fund',
      subtitle: 'Largest RWA tokenization effort brings treasuries on-chain',
      summary: 'MakerDAO launched the largest RWA tokenization fund at $100 billion, bringing Treasury bonds and real estate onto the Ethereum blockchain.',
      category: 'Crypto', author: { name: 'Omkar Godbole', avatar: '🏛️', verified: true },
      publisher: { name: 'CoinDesk', logo: '🪙', verified: true },
      publishDate: new Date(Date.now() - 3540 * 60000).toISOString(),
      readingTime: 5, views: 290000, likes: 18000, comments: 4200, shares: 14000,
      tags: ['MakerDAO', 'DeFi', 'RWA', 'Tokenization'],
      isBreaking: false, isFeatured: false, trendingScore: 78, sentiment: 'positive', emoji: '🏛️'
    },
    {
      id: 'n074', title: 'Volkswagen ID.Buzz Outsells Tesla Model Y as Best-Selling EV in Europe',
      subtitle: 'Retro-designed van captures 12% of European EV market',
      summary: 'The Volkswagen ID.Buzz outsold the Tesla Model Y to become Europe\'s best-selling EV, capturing 12% of the market.',
      category: 'Business', author: { name: 'Norihiko Shirouzu', avatar: '🚐', verified: true },
      publisher: { name: 'Reuters', logo: '📰', verified: true },
      publishDate: new Date(Date.now() - 4800 * 60000).toISOString(),
      readingTime: 3, views: 420000, likes: 24000, comments: 5600, shares: 18000,
      tags: ['Volkswagen', 'EV', 'Europe', 'Tesla'],
      isBreaking: false, isFeatured: false, trendingScore: 79, sentiment: 'positive', emoji: '🚐'
    },
    {
      id: 'n075', title: 'Tether USDT Stablecoin Market Cap Surpasses $200 Billion',
      subtitle: 'Stablecoin dominance grows as adoption accelerates in emerging markets',
      summary: 'Tether\'s USDT market cap surpassed $200 billion, driven by explosive growth in emerging markets where it\'s used as a primary savings tool.',
      category: 'Crypto', author: { name: 'Nate DiCamillo', avatar: '💲', verified: true },
      publisher: { name: 'CoinDesk', logo: '🪙', verified: true },
      publishDate: new Date(Date.now() - 6000 * 60000).toISOString(),
      readingTime: 3, views: 340000, likes: 18000, comments: 4200, shares: 14000,
      tags: ['Tether', 'USDT', 'Stablecoin', 'Crypto'],
      isBreaking: false, isFeatured: false, trendingScore: 78, sentiment: 'positive', emoji: '💲'
    },
    {
      id: 'n076', title: 'JPMorgan Launches AI-Powered Financial Advisor for All 82M Customers',
      subtitle: 'Free AI wealth management uses GPT-5 for personalized advice',
      summary: 'JPMorgan Chase launched an AI-powered personal financial advisor for all 82 million customers, using GPT-5 for investment recommendations.',
      category: 'Business', author: { name: 'Hugh Son', avatar: '🏦', verified: true },
      publisher: { name: 'CNBC', logo: '📺', verified: true },
      publishDate: new Date(Date.now() - 4080 * 60000).toISOString(),
      readingTime: 4, views: 520000, likes: 22000, comments: 5600, shares: 20000,
      tags: ['JPMorgan', 'AI', 'Banking', 'Wealth Management'],
      isBreaking: false, isFeatured: false, trendingScore: 80, sentiment: 'positive', emoji: '🏦'
    },
    {
      id: 'n077', title: 'Rivian R3 SUV Launches at $27,000, Most Affordable Premium EV',
      subtitle: 'Compact electric SUV undercuts Tesla Model Y by $10,000',
      summary: 'Rivian launched the R3 compact EV at $27,000, undercutting Tesla Model Y by $10,000 and becoming the most affordable premium EV.',
      category: 'Technology', author: { name: 'Kevin Williams', avatar: '🚙', verified: true },
      publisher: { name: 'The Drive', logo: '🚗', verified: true },
      publishDate: new Date(Date.now() - 5460 * 60000).toISOString(),
      readingTime: 3, views: 620000, likes: 34000, comments: 7800, shares: 28000,
      tags: ['Rivian', 'Electric Vehicle', 'Affordable EV', 'Automotive'],
      isBreaking: false, isFeatured: false, trendingScore: 83, sentiment: 'positive', emoji: '🚙'
    },
    {
      id: 'n078', title: 'YouTube Launches Creator AI That Generates Full Videos from Scripts',
      subtitle: 'AI produces 10-minute videos with synthetic voices in minutes',
      summary: 'YouTube launched Creator AI, allowing creators to generate complete 10-minute videos from written scripts with AI voices and footage.',
      category: 'Technology', author: { name: 'Todd Spangler', avatar: '📺', verified: true },
      publisher: { name: 'Variety', logo: '🎞️', verified: true },
      publishDate: new Date(Date.now() - 3180 * 60000).toISOString(),
      readingTime: 4, views: 670000, likes: 32000, comments: 8900, shares: 28000,
      tags: ['YouTube', 'AI', 'Content Creation', 'Video'],
      isBreaking: false, isFeatured: false, trendingScore: 84, sentiment: 'neutral', emoji: '📺'
    },
    {
      id: 'n079', title: 'Amazon Rainforest Deforestation Drops 60% Under New Brazilian Govt',
      subtitle: 'Satellite data shows lowest forest loss in 15 years',
      summary: 'Deforestation in the Amazon dropped 60% under Brazil\'s new environmental regime, the lowest annual forest loss in 15 years.',
      category: 'Environment', author: { name: 'Ana Ionova', avatar: '🌳', verified: true },
      publisher: { name: 'Mongabay', logo: '🌿', verified: true },
      publishDate: new Date(Date.now() - 4140 * 60000).toISOString(),
      readingTime: 5, views: 380000, likes: 34000, comments: 4200, shares: 24000,
      tags: ['Amazon', 'Deforestation', 'Brazil', 'Environment'],
      isBreaking: false, isFeatured: false, trendingScore: 77, sentiment: 'positive', emoji: '🌳'
    },
    {
      id: 'n080', title: "India Launches Drone Fleet Delivering Medical Supplies to 500 Villages",
      subtitle: 'Vayu Seva program covers 10,000 sq km daily',
      summary: 'India\'s Vayu Seva drone delivery program reached 500 remote villages, delivering blood, vaccines, and emergency medications daily.',
      category: 'India', author: { name: 'Rashmi Singh', avatar: '🚁', verified: true },
      publisher: { name: 'The Hindu', logo: '🇮🇳', verified: true },
      publishDate: new Date(Date.now() - 2580 * 60000).toISOString(),
      readingTime: 4, views: 390000, likes: 35000, comments: 4200, shares: 28000,
      tags: ['Drones', 'Healthcare', 'India', 'Innovation'],
      isBreaking: false, isFeatured: false, trendingScore: 79, sentiment: 'positive', emoji: '🚁'
    },
    {
      id: 'n081', title: 'Cardano Launches Hydra L2, Achieves 1 Million TPS in Testnet',
      subtitle: 'Peer-reviewed blockchain claims fastest throughput among L1 chains',
      summary: "Cardano's Hydra scaling solution achieved 1 million TPS on testnet, positioning it as the fastest Layer 1 blockchain by throughput.",
      category: 'Crypto', author: { name: 'Tim Copple', avatar: '🔵', verified: true },
      publisher: { name: 'Cardano Feed', logo: '🔵', verified: true },
      publishDate: new Date(Date.now() - 2100 * 60000).toISOString(),
      readingTime: 4, views: 280000, likes: 19000, comments: 4800, shares: 14000,
      tags: ['Cardano', 'Hydra', 'Blockchain', 'Scaling'],
      isBreaking: false, isFeatured: false, trendingScore: 77, sentiment: 'positive', emoji: '🔵'
    },
    {
      id: 'n082', title: 'European Central Bank Raises Rates to 4.5% to Combat Inflation',
      subtitle: 'ECB hikes 50 basis points as core inflation sticks above 4%',
      summary: 'The ECB raised rates by 50 basis points to 4.5%, the highest in 22 years, as core inflation remained stubbornly above 4%.',
      category: 'Economy', author: { name: 'Martin Arnold', avatar: '🇪🇺', verified: true },
      publisher: { name: 'Financial Times', logo: '📰', verified: true },
      publishDate: new Date(Date.now() - 3000 * 60000).toISOString(),
      readingTime: 4, views: 310000, likes: 8900, comments: 2800, shares: 11000,
      tags: ['ECB', 'Interest Rates', 'Inflation', 'Europe'],
      isBreaking: false, isFeatured: false, trendingScore: 78, sentiment: 'negative', emoji: '🏦'
    },
    {
      id: 'n083', title: 'US-China Tensions Escalate Over Taiwan Strait',
      subtitle: 'USS Gerald Ford carrier group enters contested waters for third time',
      summary: 'The USS Gerald Ford entered the Taiwan Strait for the third time this month, prompting China to dispatch 30 military aircraft.',
      category: 'World', author: { name: 'Philip Wen', avatar: '🚢', verified: true },
      publisher: { name: 'Reuters', logo: '📰', verified: true },
      publishDate: new Date(Date.now() - 3240 * 60000).toISOString(),
      readingTime: 5, views: 520000, likes: 18000, comments: 7800, shares: 24000,
      tags: ['US-China', 'Taiwan', 'Military', 'Geopolitics'],
      isBreaking: false, isFeatured: false, trendingScore: 82, sentiment: 'negative', emoji: '🚢'
    },
    {
      id: 'n084', title: "WHO Warns of Drug-Resistant Malaria Strain in Southeast Asia",
      subtitle: 'Artemisinin-resistant parasite detected in Myanmar, Thailand, Vietnam',
      summary: 'WHO issued an urgent warning about drug-resistant malaria spreading across Southeast Asia.',
      category: 'Health', author: { name: 'Dr. Tedros Ghebreyesus', avatar: '🏥', verified: true },
      publisher: { name: 'WHO', logo: '🌍', verified: true },
      publishDate: new Date(Date.now() - 2160 * 60000).toISOString(),
      readingTime: 5, views: 180000, likes: 8900, comments: 2100, shares: 9800,
      tags: ['Malaria', 'Drug Resistance', 'WHO', 'Southeast Asia'],
      isBreaking: false, isFeatured: false, trendingScore: 76, sentiment: 'negative', emoji: '🦟'
    },
    {
      id: 'n085', title: "Boeing Starliner Successfully Docks with International Space Station",
      subtitle: 'First crewed flight completes critical milestone',
      summary: "Boeing's Starliner successfully docked with the ISS on its first crewed flight, completing a critical milestone after years of delays.",
      category: 'Science', author: { name: 'Justin Ray', avatar: '🛸', verified: true },
      publisher: { name: 'SpaceNews', logo: '🚀', verified: true },
      publishDate: new Date(Date.now() - 4740 * 60000).toISOString(),
      readingTime: 4, views: 340000, likes: 22000, comments: 3200, shares: 14000,
      tags: ['Boeing', 'Starliner', 'ISS', 'Space'],
      isBreaking: false, isFeatured: false, trendingScore: 76, sentiment: 'positive', emoji: '🛸'
    },
    {
      id: 'n086', title: 'Nobel Prize in Physics Awarded for Room-Temperature Superconductors',
      subtitle: 'Three physicists recognized for scalable LK-99 variant',
      summary: 'The Nobel Prize in Physics was awarded for developing the first commercially viable room-temperature superconductor.',
      category: 'Science', author: { name: 'Philip Ball', avatar: '🏆', verified: true },
      publisher: { name: 'Nature', logo: '🧪', verified: true },
      publishDate: new Date(Date.now() - 1560 * 60000).toISOString(),
      readingTime: 6, views: 890000, likes: 67000, comments: 8900, shares: 54000,
      tags: ['Nobel Prize', 'Superconductor', 'Physics', 'Breakthrough'],
      isBreaking: false, isFeatured: true, trendingScore: 93, sentiment: 'positive', emoji: '🏆'
    },
    {
      id: 'n087', title: 'India Tests Hypersonic Missile That Can Hit Any Target in 30 Minutes',
      subtitle: 'DRDO HSTDV achieves Mach 8 speed',
      summary: 'DRDO successfully tested its HSTDV, achieving Mach 8 speed and demonstrating the ability to strike any target within 30 minutes.',
      category: 'India', author: { name: 'Rajat Pandit', avatar: '🛡️', verified: true },
      publisher: { name: 'Times of India', logo: '🇮🇳', verified: true },
      publishDate: new Date(Date.now() - 4920 * 60000).toISOString(),
      readingTime: 4, views: 620000, likes: 38000, comments: 7800, shares: 32000,
      tags: ['DRDO', 'Hypersonic', 'Missile', 'India'],
      isBreaking: false, isFeatured: false, trendingScore: 84, sentiment: 'positive', emoji: '🛡️'
    },
    {
      id: 'n088', title: 'FTX 2.0 Relaunches After Completing $16.5 Billion Creditor Repayment',
      subtitle: 'New management rebuilds exchange with institutional-grade security',
      summary: 'FTX 2.0 went live after completing a record $16.5 billion creditor repayment with institutional-grade custody and proof-of-reserves.',
      category: 'Crypto', author: { name: 'Amy Castor', avatar: '🔄', verified: true },
      publisher: { name: 'CoinDesk', logo: '🪙', verified: true },
      publishDate: new Date(Date.now() - 4980 * 60000).toISOString(),
      readingTime: 5, views: 480000, likes: 22000, comments: 8900, shares: 24000,
      tags: ['FTX', 'Relaunch', 'Crypto Exchange', 'Bankruptcy'],
      isBreaking: false, isFeatured: false, trendingScore: 82, sentiment: 'neutral', emoji: '🔄'
    },
    {
      id: 'n089', title: "SpaceX Starlink Reaches 100 Million Subscribers Globally",
      subtitle: 'Satellite internet now available in 120 countries',
      summary: 'SpaceX\'s Starlink reached 100 million subscribers across 120 countries, with average speeds of 150 Mbps in rural areas.',
      category: 'Technology', author: { name: 'Jeff Foust', avatar: '📡', verified: true },
      publisher: { name: 'SpaceNews', logo: '🚀', verified: true },
      publishDate: new Date(Date.now() - 6180 * 60000).toISOString(),
      readingTime: 3, views: 420000, likes: 22000, comments: 4200, shares: 16000,
      tags: ['Starlink', 'SpaceX', 'Internet', 'Satellite'],
      isBreaking: false, isFeatured: false, trendingScore: 78, sentiment: 'positive', emoji: '📡'
    },
    {
      id: 'n090', title: 'Istanbul Named Most Visited City, Surpassing Bangkok and London',
      subtitle: '28.4 million international visitors in 2025',
      summary: 'Istanbul was named the world\'s most visited city with 28.4 million international visitors in 2025, surpassing Bangkok and London.',
      category: 'World', author: { name: 'Suzy Hansen', avatar: '🏙️', verified: true },
      publisher: { name: 'The Guardian', logo: '🌿', verified: true },
      publishDate: new Date(Date.now() - 5520 * 60000).toISOString(),
      readingTime: 3, views: 380000, likes: 22000, comments: 4200, shares: 16000,
      tags: ['Istanbul', 'Tourism', 'Travel', 'Most Visited'],
      isBreaking: false, isFeatured: false, trendingScore: 75, sentiment: 'positive', emoji: '🏙️'
    },
    {
      id: 'n091', title: 'Adani Group Market Cap Crosses $400 Billion',
      subtitle: 'Green energy push drives stock gains',
      summary: "Adani Group's combined market cap crossed $400 billion, driven by green energy, ports, and data center businesses.",
      category: 'Business', author: { name: 'Abhishek Ramanathan', avatar: '🏭', verified: true },
      publisher: { name: 'Moneycontrol', logo: '💰', verified: true },
      publishDate: new Date(Date.now() - 5580 * 60000).toISOString(),
      readingTime: 3, views: 340000, likes: 18000, comments: 5600, shares: 14000,
      tags: ['Adani', 'Indian Stocks', 'Market Cap', 'Conglomerate'],
      isBreaking: false, isFeatured: false, trendingScore: 79, sentiment: 'positive', emoji: '🏭'
    },
    {
      id: 'n092', title: 'Pandemic Preparedness Treaty Signed by 195 Nations',
      subtitle: 'Binding agreement mandates early warning systems and vaccine sharing',
      summary: '195 nations signed a binding pandemic preparedness treaty at WHO, mandating early warning systems and equitable vaccine distribution.',
      category: 'Health', author: { name: 'Brendan Borrell', avatar: '🏥', verified: true },
      publisher: { name: 'Nature Medicine', logo: '💊', verified: true },
      publishDate: new Date(Date.now() - 5640 * 60000).toISOString(),
      readingTime: 5, views: 420000, likes: 32000, comments: 4200, shares: 22000,
      tags: ['WHO', 'Pandemic', 'Treaty', 'Global Health'],
      isBreaking: false, isFeatured: false, trendingScore: 80, sentiment: 'positive', emoji: '🏥'
    },
    {
      id: 'n093', title: 'FIFA World Cup 2026 Ticket Sales Break Records: 10M Applications',
      subtitle: 'Demand exceeds supply 5:1 as football fever grips North America',
      summary: 'FIFA announced over 10 million ticket applications for the 2026 World Cup, with demand outstripping supply by 5 to 1.',
      category: 'Sports', author: { name: 'Marc Ogden', avatar: '⚽', verified: true },
      publisher: { name: 'ESPN', logo: '🏆', verified: true },
      publishDate: new Date(Date.now() - 6360 * 60000).toISOString(),
      readingTime: 3, views: 890000, likes: 45000, comments: 8900, shares: 34000,
      tags: ['FIFA', 'World Cup', 'Football', '2026'],
      isBreaking: false, isFeatured: false, trendingScore: 85, sentiment: 'positive', emoji: '⚽'
    },
    {
      id: 'n094', title: "China's Population Falls Below 1.3 Billion for First Time",
      subtitle: 'Birth rate hits record low as aging crisis deepens',
      summary: "China's population fell below 1.3 billion as the birth rate dropped to a record low of 6.3 per 1,000.",
      category: 'World', author: { name: 'Dami Adebayo', avatar: '🌏', verified: true },
      publisher: { name: 'BBC News', logo: '📺', verified: true },
      publishDate: new Date(Date.now() - 6420 * 60000).toISOString(),
      readingTime: 5, views: 560000, likes: 18000, comments: 8900, shares: 28000,
      tags: ['China', 'Population', 'Demographics', 'Aging'],
      isBreaking: false, isFeatured: false, trendingScore: 82, sentiment: 'negative', emoji: '🌏'
    },
    {
      id: 'n095', title: "ISRO Announces Gaganyaan Crew Mission for December 2026",
      subtitle: 'India will become fourth nation to send humans to space independently',
      summary: "ISRO announced India's first crewed space mission Gaganyaan will launch in December 2026 with three astronauts.",
      category: 'India', author: { name: 'Rakesh Sharma', avatar: '🛸', verified: true },
      publisher: { name: 'ISRO', logo: '🇮🇳', verified: true },
      publishDate: new Date(Date.now() - 6480 * 60000).toISOString(),
      readingTime: 4, views: 620000, likes: 45000, comments: 6700, shares: 32000,
      tags: ['ISRO', 'Gaganyaan', 'Space', 'India'],
      isBreaking: false, isFeatured: true, trendingScore: 87, sentiment: 'positive', emoji: '🛸'
    },
    {
      id: 'n096', title: 'Google Wins Antitrust Case, Avoids Breakup',
      subtitle: 'Judge rules remedies sufficient without structural separation',
      summary: 'Google avoided a potential breakup after the judge ruled behavioral remedies were sufficient to address its search monopoly.',
      category: 'Politics', author: { name: 'David McCabe', avatar: '⚖️', verified: true },
      publisher: { name: 'The New York Times', logo: '📰', verified: true },
      publishDate: new Date(Date.now() - 5820 * 60000).toISOString(),
      readingTime: 6, views: 580000, likes: 18000, comments: 7800, shares: 28000,
      tags: ['Google', 'Antitrust', 'Monopoly', 'DOJ'],
      isBreaking: false, isFeatured: false, trendingScore: 83, sentiment: 'neutral', emoji: '⚖️'
    },
    {
      id: 'n097', title: 'US Treasury Announces $1 Trillion Green Bond Issuance',
      subtitle: 'Leveraging surplus from AI tax revenue',
      summary: 'The U.S. Treasury announced a record $1 trillion green bond issuance funded by the newly implemented AI compute tax.',
      category: 'Economy', author: { name: 'Tara Patel', avatar: '💚', verified: true },
      publisher: { name: 'Financial Times', logo: '📰', verified: true },
      publishDate: new Date(Date.now() - 5340 * 60000).toISOString(),
      readingTime: 4, views: 340000, likes: 18000, comments: 3200, shares: 14000,
      tags: ['Green Bonds', 'Climate Finance', 'Treasury', 'Clean Energy'],
      isBreaking: false, isFeatured: false, trendingScore: 77, sentiment: 'positive', emoji: '💚'
    },
    {
      id: 'n098', title: 'Samsung Wins Patent for Phone That Folds Into a Circle',
      subtitle: 'Origami-inspired design uses flexible OLED',
      summary: 'Samsung was granted a patent for a foldable phone that folds into a perfect circle using origami-inspired flexible OLED.',
      category: 'Technology', author: { name: 'Max Jambor', avatar: '📱', verified: true },
      publisher: { name: '9to5Google', logo: '📱', verified: true },
      publishDate: new Date(Date.now() - 5940 * 60000).toISOString(),
      readingTime: 3, views: 480000, likes: 28000, comments: 6700, shares: 22000,
      tags: ['Samsung', 'Foldable Phone', 'Patent', 'Display'],
      isBreaking: false, isFeatured: false, trendingScore: 79, sentiment: 'positive', emoji: '📱'
    },
    {
      id: 'n099', title: 'Amazon Drone Delivery Launches in 100 Indian Cities',
      subtitle: 'Prime Air covers 80% of Indian pin codes',
      summary: 'Amazon launched Prime Air drone delivery in 100 Indian cities, covering 80% of pin codes with same-hour delivery.',
      category: 'Business', author: { name: 'Saurabh Singh', avatar: '🚁', verified: true },
      publisher: { name: 'TechCrunch', logo: '🔧', verified: true },
      publishDate: new Date(Date.now() - 6240 * 60000).toISOString(),
      readingTime: 3, views: 380000, likes: 18000, comments: 4200, shares: 16000,
      tags: ['Amazon', 'Drone Delivery', 'India', 'Logistics'],
      isBreaking: false, isFeatured: false, trendingScore: 77, sentiment: 'positive', emoji: '🚁'
    },
    {
      id: 'n100', title: 'Tata Communications Launches World\'s First 6G Test Network in Mumbai',
      subtitle: '100 Gbps speeds with sub-millisecond latency',
      summary: 'Tata Communications launched the world\'s first commercial 6G test network in Mumbai, demonstrating 100 Gbps speeds.',
      category: 'Technology', author: { name: 'Kunal Nerkar', avatar: '📶', verified: true },
      publisher: { name: 'ET Telecom', logo: '📡', verified: true },
      publishDate: new Date(Date.now() - 6300 * 60000).toISOString(),
      readingTime: 4, views: 340000, likes: 24000, comments: 3200, shares: 16000,
      tags: ['6G', 'Tata', '5G', 'Telecom'],
      isBreaking: false, isFeatured: false, trendingScore: 80, sentiment: 'positive', emoji: '📶'
    },
    {
      id: 'n101', title: "China's Evergrande Liquidation Begins, $300B in Assets",
      subtitle: 'Court-appointed liquidators begin selling across 200 cities',
      summary: "The liquidation of China Evergrande formally began with court-appointed administrators selling $300 billion in assets.",
      category: 'World', author: { name: 'Eva Dou', avatar: '🏗️', verified: true },
      publisher: { name: 'The Washington Post', logo: '🏛️', verified: true },
      publishDate: new Date(Date.now() - 2700 * 60000).toISOString(),
      readingTime: 6, views: 480000, likes: 12000, comments: 5600, shares: 18000,
      tags: ['China', 'Evergrande', 'Property Crisis', 'Liquidation'],
      isBreaking: false, isFeatured: false, trendingScore: 83, sentiment: 'negative', emoji: '🏗️'
    },
    {
      id: 'n102', title: 'US CPI Falls to 2.1%, Fed Rate Cut Now Almost Certain',
      subtitle: 'Core PCE drops to 2.3%, lowest since 2021',
      summary: 'CPI fell to 2.1% YoY while core PCE dropped to 2.3%, making a September rate cut virtually certain.',
      category: 'Breaking', author: { name: 'Jeanna Smialek', avatar: '📊', verified: true },
      publisher: { name: 'The New York Times', logo: '📰', verified: true },
      publishDate: new Date(Date.now() - 5 * 60000).toISOString(),
      readingTime: 4, views: 890000, likes: 34000, comments: 8900, shares: 42000,
      tags: ['CPI', 'Inflation', 'Federal Reserve', 'Rate Cut'],
      isBreaking: true, isFeatured: true, trendingScore: 97, sentiment: 'positive', emoji: '📊'
    },
    // Additional articles to reach 500+
    {
      id: 'n103', title: 'Microsoft Azure Revenue Surpasses $100 Billion for First Time',
      subtitle: 'Cloud computing division leads growth with 28% YoY increase',
      summary: 'Microsoft Azure revenue exceeded $100 billion annually for the first time, driven by enterprise AI adoption and cloud migration.',
      category: 'Business', author: { name: 'Satya Nadella', avatar: '☁️', verified: true },
      publisher: { name: 'Microsoft Blog', logo: '💻', verified: true },
      publishDate: new Date(Date.now() - 120 * 60000).toISOString(),
      readingTime: 4, views: 450000, likes: 22000, comments: 4500, shares: 18000,
      tags: ['Microsoft', 'Azure', 'Cloud Computing', 'AI'],
      isBreaking: false, isFeatured: true, trendingScore: 85, sentiment: 'positive', emoji: '☁️'
    },
    {
      id: 'n104', title: 'India Successfully Tests Hypersonic Missile with 7,000 km Range',
      subtitle: 'DRDO achieves breakthrough in indigenous defense technology',
      summary: 'DRDO successfully tested a hypersonic missile with 7,000 km range, marking a major breakthrough in India\'s indigenous defense capabilities.',
      category: 'India', author: { name: 'Rajat Pandit', avatar: '🚀', verified: true },
      publisher: { name: 'Times of India', logo: '🇮🇳', verified: true },
      publishDate: new Date(Date.now() - 180 * 60000).toISOString(),
      readingTime: 5, views: 670000, likes: 45000, comments: 8900, shares: 32000,
      tags: ['India', 'DRDO', 'Hypersonic Missile', 'Defense'],
      isBreaking: true, isFeatured: true, trendingScore: 92, sentiment: 'positive', emoji: '🚀'
    },
    {
      id: 'n105', title: 'Global Semiconductor Shortage Ends as New Fabs Come Online',
      subtitle: 'TSMC, Intel, Samsung add 50 million wafer capacity',
      summary: 'The global semiconductor shortage has ended as major foundries added 50 million wafer capacity, normalizing supply chains.',
      category: 'Technology', author: { name: 'Don Clark', avatar: '💾', verified: true },
      publisher: { name: 'Wall Street Journal', logo: '📋', verified: true },
      publishDate: new Date(Date.now() - 240 * 60000).toISOString(),
      readingTime: 4, views: 340000, likes: 18000, comments: 3200, shares: 14000,
      tags: ['Semiconductors', 'TSMC', 'Intel', 'Supply Chain'],
      isBreaking: false, isFeatured: false, trendingScore: 78, sentiment: 'positive', emoji: '💾'
    },
    {
      id: 'n106', title: 'Netflix Adds 15 Million Subscribers in Q2, Stock Hits All-Time High',
      subtitle: 'Strong content slate and password sharing crackdown drive growth',
      summary: 'Netflix added 15 million subscribers in Q2, beating expectations by 5 million, as its content slate and password sharing crackdown paid off.',
      category: 'Entertainment', author: { name: 'Alex Weprin', avatar: '📺', verified: true },
      publisher: { name: 'The Hollywood Reporter', logo: '🎬', verified: true },
      publishDate: new Date(Date.now() - 300 * 60000).toISOString(),
      readingTime: 3, views: 560000, likes: 28000, comments: 6700, shares: 24000,
      tags: ['Netflix', 'Streaming', 'Subscribers', 'Stock'],
      isBreaking: false, isFeatured: false, trendingScore: 82, sentiment: 'positive', emoji: '📺'
    },
    {
      id: 'n107', title: 'WHO Declares New Pandemic Protocol After COVID-19 Lessons',
      subtitle: '190 nations agree to early warning system and rapid response framework',
      summary: 'The WHO declared a new pandemic protocol after 190 nations agreed to an early warning system and rapid response framework.',
      category: 'Health', author: { name: 'Dr. Tedros Adhanom', avatar: '🏥', verified: true },
      publisher: { name: 'World Health Organization', logo: '🌐', verified: true },
      publishDate: new Date(Date.now() - 360 * 60000).toISOString(),
      readingTime: 5, views: 420000, likes: 24000, comments: 5600, shares: 22000,
      tags: ['WHO', 'Pandemic', 'COVID-19', 'Health Policy'],
      isBreaking: false, isFeatured: true, trendingScore: 84, sentiment: 'positive', emoji: '🏥'
    },
    {
      id: 'n108', title: 'Saudi Arabia Announces $500 Billion AI Fund to Diversify Economy',
      subtitle: 'PIF launches largest AI investment fund in history',
      summary: 'Saudi Arabia\'s PIF announced a $500 billion AI fund to diversify the economy beyond oil, the largest AI investment fund ever.',
      category: 'World', author: { name: 'Andrew Ross Sorkin', avatar: '💰', verified: true },
      publisher: { name: 'CNBC', logo: '📺', verified: true },
      publishDate: new Date(Date.now() - 420 * 60000).toISOString(),
      readingTime: 4, views: 580000, likes: 32000, comments: 7800, shares: 28000,
      tags: ['Saudi Arabia', 'AI', 'PIF', 'Investment'],
      isBreaking: false, isFeatured: true, trendingScore: 88, sentiment: 'positive', emoji: '💰'
    },
    {
      id: 'n109', title: 'Electric Vehicle Sales Surpass Gas Cars for First Time Globally',
      subtitle: 'EVs account for 51% of new car sales in Q2 2026',
      summary: 'Electric vehicles surpassed gas-powered cars for the first time globally, accounting for 51% of new car sales in Q2 2026.',
      category: 'Environment', author: { name: 'Phoebe Wall Howard', avatar: '⚡', verified: true },
      publisher: { name: 'USA Today', logo: '📰', verified: true },
      publishDate: new Date(Date.now() - 480 * 60000).toISOString(),
      readingTime: 4, views: 780000, likes: 45000, comments: 9800, shares: 38000,
      tags: ['Electric Vehicles', 'EV Sales', 'Climate', 'Automotive'],
      isBreaking: false, isFeatured: true, trendingScore: 91, sentiment: 'positive', emoji: '⚡'
    },
    {
      id: 'n110', title: 'Google DeepMind Solves 50-Year-Old Protein Folding Problem',
      subtitle: 'AlphaFold 3 predicts protein structures with 99% accuracy',
      summary: 'Google DeepMind\'s AlphaFold 3 solved the 50-year-old protein folding problem, predicting structures with 99% accuracy.',
      category: 'Science', author: { name: 'Ewen Callaway', avatar: '🧬', verified: true },
      publisher: { name: 'Nature', logo: '🔬', verified: true },
      publishDate: new Date(Date.now() - 540 * 60000).toISOString(),
      readingTime: 6, views: 890000, likes: 56000, comments: 12000, shares: 45000,
      tags: ['DeepMind', 'AlphaFold', 'Protein Folding', 'AI'],
      isBreaking: false, isFeatured: true, trendingScore: 94, sentiment: 'positive', emoji: '🧬'
    },
    {
      id: 'n111', title: 'India Becomes First Country to Land on Moon\'s South Pole',
      subtitle: 'Chandrayaan-4 mission discovers water ice deposits',
      summary: 'India became the first country to land on the Moon\'s south pole with Chandrayaan-4, discovering significant water ice deposits.',
      category: 'Science', author: { name: 'S Somnath', avatar: '🌙', verified: true },
      publisher: { name: 'ISRO', logo: '🚀', verified: true },
      publishDate: new Date(Date.now() - 600 * 60000).toISOString(),
      readingTime: 5, views: 1200000, likes: 89000, comments: 18000, shares: 67000,
      tags: ['India', 'ISRO', 'Moon', 'Space Exploration'],
      isBreaking: true, isFeatured: true, trendingScore: 96, sentiment: 'positive', emoji: '🌙'
    },
    {
      id: 'n112', title: 'Meta Launches Horizon World 2.0 with Photorealistic Graphics',
      subtitle: 'New VR platform rivals AAA game graphics quality',
      summary: 'Meta launched Horizon World 2.0 with photorealistic graphics that rival AAA game quality, marking a major leap in VR technology.',
      category: 'Technology', author: { name: 'Cecilia D\'Anastasio', avatar: '🥽', verified: true },
      publisher: { name: 'Wired', logo: '🔌', verified: true },
      publishDate: new Date(Date.now() - 660 * 60000).toISOString(),
      readingTime: 4, views: 560000, likes: 34000, comments: 7800, shares: 32000,
      tags: ['Meta', 'VR', 'Horizon World', 'Graphics'],
      isBreaking: false, isFeatured: false, trendingScore: 83, sentiment: 'positive', emoji: '🥽'
    },
    {
      id: 'n113', title: 'US Passes $2 Trillion Infrastructure Bill with AI Focus',
      subtitle: 'Largest infrastructure investment in US history includes AI computing centers',
      summary: 'The US passed a $2 trillion infrastructure bill, the largest in history, including funding for AI computing centers nationwide.',
      category: 'Politics', author: { name: 'Laura Barrón-López', avatar: '🏛️', verified: true },
      publisher: { name: 'PBS NewsHour', logo: '📺', verified: true },
      publishDate: new Date(Date.now() - 720 * 60000).toISOString(),
      readingTime: 5, views: 670000, likes: 38000, comments: 8900, shares: 34000,
      tags: ['Infrastructure', 'US', 'AI', 'Investment'],
      isBreaking: false, isFeatured: true, trendingScore: 86, sentiment: 'positive', emoji: '🏛️'
    },
    {
      id: 'n114', title: 'Bitcoin ETF Inflows Reach $50 Billion in Record Month',
      subtitle: 'Institutional adoption accelerates as traditional finance embraces crypto',
      summary: 'Bitcoin ETF inflows reached $50 billion in a single month, a record, as institutional adoption accelerated.',
      category: 'Crypto', author: { name: 'Nathaniel Whittemore', avatar: '₿', verified: true },
      publisher: { name: 'CoinDesk', logo: '🪙', verified: true },
      publishDate: new Date(Date.now() - 780 * 60000).toISOString(),
      readingTime: 3, views: 450000, likes: 28000, comments: 6700, shares: 24000,
      tags: ['Bitcoin', 'ETF', 'Institutional', 'Crypto'],
      isBreaking: false, isFeatured: false, trendingScore: 81, sentiment: 'positive', emoji: '₿'
    },
    {
      id: 'n115', title: 'Tennis: Carlos Alcaraz Wins Grand Slam, Youngest Since Nadal',
      subtitle: '21-year-old Spaniard dominates final in straight sets',
      summary: 'Carlos Alcaraz won his first Grand Slam at 21, the youngest since Rafael Nadal, dominating the final in straight sets.',
      category: 'Sports', author: { name: 'Christopher Clarey', avatar: '🎾', verified: true },
      publisher: { name: 'The New York Times', logo: '📰', verified: true },
      publishDate: new Date(Date.now() - 840 * 60000).toISOString(),
      readingTime: 4, views: 890000, likes: 56000, comments: 12000, shares: 45000,
      tags: ['Tennis', 'Alcaraz', 'Grand Slam', 'Sports'],
      isBreaking: false, isFeatured: true, trendingScore: 89, sentiment: 'positive', emoji: '🎾'
    },
    {
      id: 'n116', title: 'Adobe Firefly 3 Generates Full Video from Text Prompts',
      subtitle: 'AI video generation reaches Hollywood-quality output',
      summary: 'Adobe launched Firefly 3, which can generate full Hollywood-quality videos from text prompts, revolutionizing content creation.',
      category: 'Technology', author: { name: 'Amrita Khalid', avatar: '🎬', verified: true },
      publisher: { name: 'The Verge', logo: '⚡', verified: true },
      publishDate: new Date(Date.now() - 900 * 60000).toISOString(),
      readingTime: 5, views: 780000, likes: 45000, comments: 9800, shares: 38000,
      tags: ['Adobe', 'Firefly', 'AI Video', 'Content Creation'],
      isBreaking: false, isFeatured: true, trendingScore: 90, sentiment: 'positive', emoji: '🎬'
    },
    {
      id: 'n117', title: 'India\'s Adani Group Completes $10 Billion Renewable Energy Project',
      subtitle: 'World\'s largest solar-wind hybrid plant becomes operational',
      summary: 'Adani Group completed a $10 billion renewable energy project, the world\'s largest solar-wind hybrid plant.',
      category: 'India', author: { name: 'Rebecca Bundhun', avatar: '☀️', verified: true },
      publisher: { name: 'Bloomberg', logo: '📊', verified: true },
      publishDate: new Date(Date.now() - 960 * 60000).toISOString(),
      readingTime: 4, views: 340000, likes: 22000, comments: 4500, shares: 18000,
      tags: ['Adani', 'Renewable Energy', 'India', 'Solar'],
      isBreaking: false, isFeatured: false, trendingScore: 79, sentiment: 'positive', emoji: '☀️'
    },
    {
      id: 'n118', title: 'OpenAI Releases GPT-5 with Multimodal Capabilities',
      subtitle: 'New model processes text, images, audio, and video simultaneously',
      summary: 'OpenAI released GPT-5 with full multimodal capabilities, processing text, images, audio, and video simultaneously.',
      category: 'AI', author: { name: 'Sam Altman', avatar: '🤖', verified: true },
      publisher: { name: 'OpenAI Blog', logo: '🔬', verified: true },
      publishDate: new Date(Date.now() - 1020 * 60000).toISOString(),
      readingTime: 6, views: 1500000, likes: 89000, comments: 18000, shares: 95000,
      tags: ['OpenAI', 'GPT-5', 'Multimodal', 'AI'],
      isBreaking: true, isFeatured: true, trendingScore: 98, sentiment: 'positive', emoji: '🤖'
    },
    {
      id: 'n119', title: 'European Union Bans Single-Use Plastics Across All Member States',
      subtitle: 'Comprehensive ban takes effect January 1, 2027',
      summary: 'The EU banned single-use plastics across all member states, with the comprehensive ban taking effect January 1, 2027.',
      category: 'Environment', author: { name: 'Francesca Lynagh', avatar: '🌍', verified: true },
      publisher: { name: 'Reuters', logo: '📰', verified: true },
      publishDate: new Date(Date.now() - 1080 * 60000).toISOString(),
      readingTime: 4, views: 560000, likes: 34000, comments: 7800, shares: 32000,
      tags: ['EU', 'Plastic Ban', 'Environment', 'Policy'],
      isBreaking: false, isFeatured: false, trendingScore: 82, sentiment: 'positive', emoji: '🌍'
    },
    {
      id: 'n120', title: 'NVIDIA Announces Next-Gen GPU with 50% Performance Boost',
      subtitle: 'Blackwell B300 chip targets AI training workloads',
      summary: 'NVIDIA announced the Blackwell B300 GPU with 50% performance boost, specifically targeting AI training workloads.',
      category: 'Technology', author: { name: 'Ian King', avatar: '💻', verified: true },
      publisher: { name: 'Bloomberg', logo: '📊', verified: true },
      publishDate: new Date(Date.now() - 1140 * 60000).toISOString(),
      readingTime: 4, views: 670000, likes: 38000, comments: 8900, shares: 34000,
      tags: ['NVIDIA', 'GPU', 'AI', 'Blackwell'],
      isBreaking: false, isFeatured: true, trendingScore: 87, sentiment: 'positive', emoji: '💻'
    }
  ];

  // Generate additional articles programmatically to reach 500+
  const categories = ['Breaking', 'World', 'India', 'Politics', 'Business', 'Technology', 'AI', 'Science', 'Health', 'Sports', 'Entertainment', 'Crypto', 'Economy', 'Environment'];
  const sentiments = ['positive', 'negative', 'neutral'];
  const emojis = ['📰', '🌍', '🇮🇳', '🏛️', '💼', '💻', '🤖', '🔬', '🏥', '⚽', '🎬', '₿', '📈', '🌱'];
  const publishers = [
    { name: 'Bloomberg', logo: '📊', verified: true },
    { name: 'Reuters', logo: '📰', verified: true },
    { name: 'The New York Times', logo: '📰', verified: true },
    { name: 'CNBC', logo: '📺', verified: true },
    { name: 'TechCrunch', logo: '🔧', verified: true },
    { name: 'The Verge', logo: '⚡', verified: true },
    { name: 'Wired', logo: '🔌', verified: true },
    { name: 'Financial Times', logo: '📰', verified: true },
    { name: 'The Guardian', logo: '🌿', verified: true },
    { name: 'Wall Street Journal', logo: '📋', verified: true }
  ];
  const authors = [
    { name: 'Sarah Mitchell', avatar: '👩‍💼', verified: true },
    { name: 'John Smith', avatar: '👨‍💼', verified: true },
    { name: 'Emily Zhang', avatar: '👩‍🔬', verified: true },
    { name: 'David Chen', avatar: '👨‍🚀', verified: true },
    { name: 'Rachel Green', avatar: '👩‍⚖️', verified: true },
    { name: 'Mark Sullivan', avatar: '👨‍💻', verified: true },
    { name: 'Dr. Amira Hassan', avatar: '👩‍⚕️', verified: true },
    { name: 'Harsha Bhogle', avatar: '🏏', verified: true },
    { name: 'Lisa Romero', avatar: '🎬', verified: true },
    { name: 'Nina Patel', avatar: '👩‍🔬', verified: true }
  ];

  const titles = [
    'Global Markets Rally as Economic Data Exceeds Expectations',
    'New AI Breakthrough Promises to Revolutionize Healthcare Diagnostics',
    'Climate Summit Reaches Historic Agreement on Carbon Reduction',
    'Tech Giants Report Record Quarterly Earnings Amid AI Boom',
    'Central Banks Coordinate on Digital Currency Framework',
    'Space Agency Announces Ambitious Mars Mission Timeline',
    'Renewable Energy Investment Hits New Global Record',
    'Breakthrough Medical Treatment Shows Promise for Chronic Diseases',
    'Major Sports League Announces Expansion to New Markets',
    'Entertainment Industry Sees Streaming Wars Intensify',
    'Cryptocurrency Adoption Accelerates Among Institutional Investors',
    'Trade Agreement Signed Between Major Economic Powers',
    'Quantum Computing Reaches New Commercial Milestone',
    'Autonomous Vehicle Deployment Expands to New Cities',
    'Biotech Firm Receives FDA Approval for Gene Therapy',
    'Social Media Platform Launches Revolutionary AI Features',
    'Infrastructure Investment Bill Passes with Broad Support',
    'Electric Vehicle Battery Technology Sees Major Improvement',
    'Cybersecurity Threats Prompt New International Protocols',
    'Educational Technology Transforms Learning Landscape'
  ];

  for (let i = 121; i <= 500; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const sentiment = sentiments[Math.floor(Math.random() * sentiments.length)];
    const emoji = emojis[categories.indexOf(category)] || '📰';
    const publisher = publishers[Math.floor(Math.random() * publishers.length)];
    const author = authors[Math.floor(Math.random() * authors.length)];
    const title = titles[Math.floor(Math.random() * titles.length)] + ' - Update #' + i;
    const hoursAgo = Math.floor(Math.random() * 7200) + 120;
    
    articles.push({
      id: 'n' + i,
      title: title,
      subtitle: 'Latest developments in ' + category.toLowerCase() + ' sector',
      summary: 'Comprehensive coverage of recent developments in the ' + category.toLowerCase() + ' sector, with expert analysis and future implications.',
      category: category,
      author: author,
      publisher: publisher,
      publishDate: new Date(Date.now() - hoursAgo * 60000).toISOString(),
      readingTime: Math.floor(Math.random() * 5) + 3,
      views: Math.floor(Math.random() * 900000) + 100000,
      likes: Math.floor(Math.random() * 50000) + 5000,
      comments: Math.floor(Math.random() * 15000) + 1000,
      shares: Math.floor(Math.random() * 40000) + 5000,
      tags: [category, 'Update', 'News', 'Analysis'],
      isBreaking: Math.random() > 0.9,
      isFeatured: Math.random() > 0.7,
      trendingScore: Math.floor(Math.random() * 30) + 70,
      sentiment: sentiment,
      emoji: emoji
    });
  }

  window.NewsData = {
    articles,
    categories: ['Breaking', 'World', 'India', 'Politics', 'Business', 'Technology', 'AI', 'Science', 'Health', 'Sports', 'Entertainment', 'Crypto', 'Economy', 'Environment'],
    getByCategory: function(cat) { return articles.filter(function(a) { return a.category === cat; }); },
    getBreaking: function() { return articles.filter(function(a) { return a.isBreaking; }); },
    getFeatured: function() { return articles.filter(function(a) { return a.isFeatured; }); },
    getTrending: function(limit) {
      limit = limit || 10;
      return articles.slice().sort(function(a, b) { return b.trendingScore - a.trendingScore; }).slice(0, limit);
    },
    search: function(query) {
      var q = query.toLowerCase();
      return articles.filter(function(a) {
        return a.title.toLowerCase().indexOf(q) !== -1 ||
               a.summary.toLowerCase().indexOf(q) !== -1 ||
               a.tags.some(function(t) { return t.toLowerCase().indexOf(q) !== -1; });
      });
    },
    getById: function(id) { return articles.find(function(a) { return a.id === id; }); }
  };
})();
