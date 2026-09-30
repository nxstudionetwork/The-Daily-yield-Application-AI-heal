const NewsData = {
  breaking: [
    { id: 'b1', title: 'Global Markets Rally as Trade Deal Reached Between Major Economies', summary: 'Stock markets worldwide surge after historic trade agreement signed between US, EU, and Asia-Pacific nations.', category: 'business', time: Date.now() - 300000, image: '', source: 'Reuters', readTime: 4 },
    { id: 'b2', title: 'ISRO Successfully Tests Reusable Launch Vehicle', summary: 'India\'s space agency completes critical test for next-gen orbital vehicle, paving way for cost-effective space access.', category: 'science', time: Date.now() - 600000, image: '', source: 'PTI', readTime: 3 },
    { id: 'b3', title: 'Quantum Computing Breakthrough: 1000-Qubit Processor Achieved', summary: 'Researchers demonstrate stable quantum processor, marking major milestone in computational power.', category: 'technology', time: Date.now() - 900000, image: '', source: 'Nature', readTime: 6 },
    { id: 'b4', title: 'Central Banks Signal Coordinated Rate Policy Shift', summary: 'Federal Reserve, ECB, and Bank of England hint at synchronized monetary policy changes for 2027.', category: 'business', time: Date.now() - 1200000, image: '', source: 'Bloomberg', readTime: 5 },
    { id: 'b5', title: 'Historic Climate Agreement Signed by 190 Nations', summary: 'Comprehensive accord commits nations to net-zero by 2045 with enforceable carbon reduction targets.', category: 'world', time: Date.now() - 1800000, image: '', source: 'AP News', readTime: 7 },
  ],
  world: [
    { id: 'w1', title: 'EU Unveils Digital Sovereignty Act', summary: 'European Union passes landmark legislation to reduce dependence on foreign tech platforms.', category: 'world', time: Date.now() - 3600000, image: '', source: 'EU Times', readTime: 5 },
    { id: 'w2', title: 'UN General Assembly Votes on AI Governance Framework', summary: 'Proposed resolution would create international body to oversee advanced AI development and deployment.', category: 'world', time: Date.now() - 5400000, image: '', source: 'UN News', readTime: 4 },
    { id: 'w3', title: 'Pacific Islands Form Climate Resilience Coalition', summary: 'Small island nations band together to fund adaptation and secure climate justice through collective action.', category: 'world', time: Date.now() - 7200000, image: '', source: 'The Guardian', readTime: 6 },
    { id: 'w4', title: 'African Continental Free Trade Area Shows Record Growth', summary: 'Intra-African trade hits all-time high as tariff reductions take full effect across the continent.', category: 'world', time: Date.now() - 9000000, image: '', source: 'BBC', readTime: 4 },
    { id: 'w5', title: 'Space Tourism Industry Reaches New Milestone', summary: 'Over 100 civilians have now traveled to orbit, as costs decrease and safety records improve.', category: 'world', time: Date.now() - 10800000, image: '', source: 'CNN', readTime: 5 },
  ],
  india: [
    { id: 'in1', title: 'India Launches National Quantum Mission with $2B Investment', summary: 'Government approves ambitious program to make India a global leader in quantum technologies by 2030.', category: 'india', time: Date.now() - 2400000, image: '', source: 'Economic Times', readTime: 5 },
    { id: 'in2', title: 'Digital India 2.0: Next Phase of Rural Connectivity Begins', summary: 'Phase 2 targets 100% broadband access in villages with fiber-optic and satellite hybrid network.', category: 'india', time: Date.now() - 4800000, image: '', source: 'NDTV', readTime: 4 },
    { id: 'in3', title: 'IIT Researchers Develop Breakthrough Battery Technology', summary: 'Solid-state batteries with 3x energy density developed at IIT Bombay, attracting global automotive interest.', category: 'india', time: Date.now() - 7200000, image: '', source: 'India Today', readTime: 3 },
    { id: 'in4', title: 'Nifty Hits Historic 25,000 Mark on Strong FII Inflows', summary: 'Indian benchmark indices scale new peaks as foreign institutional investors increase allocation.', category: 'india', time: Date.now() - 9600000, image: '', source: 'Moneycontrol', readTime: 3 },
    { id: 'in5', title: 'India Overtakes Japan as Third-Largest Economy', summary: 'IMF data confirms India\'s nominal GDP surpasses Japan, cementing position behind US and China.', category: 'india', time: Date.now() - 14400000, image: '', source: 'Livemint', readTime: 6 },
  ],
  politics: [
    { id: 'p1', title: 'Parliament Passes Landmark Data Privacy Bill', summary: 'Comprehensive legislation gives citizens control over personal data and establishes Digital Protection Authority.', category: 'politics', time: Date.now() - 6000000, image: '', source: 'Hindustan Times', readTime: 5 },
    { id: 'p2', title: 'G7 Leaders Agree on Global Minimum Tax Implementation', summary: 'Major economies finalize details for 15% corporate minimum tax across participating nations.', category: 'politics', time: Date.now() - 12000000, image: '', source: 'Reuters', readTime: 4 },
    { id: 'p3', title: 'Election Commission Announces Digital Voting Pilot', summary: 'Blockchain-based remote voting system to be tested in select constituencies for upcoming elections.', category: 'politics', time: Date.now() - 18000000, image: '', source: 'The Hindu', readTime: 6 },
  ],
  business: [
    { id: 'bu1', title: 'Apple Unveils AR Glasses at Record-Breaking WWDC', summary: 'Lightweight augmented reality device promises to replace smartphones within a decade.', category: 'business', time: Date.now() - 4200000, image: '', source: 'TechCrunch', readTime: 5 },
    { id: 'bu2', title: 'Global EV Sales Surpass 30 Million Units Annually', summary: 'Electric vehicle adoption accelerates with China and Europe leading the charge toward clean transportation.', category: 'business', time: Date.now() - 8400000, image: '', source: 'Bloomberg', readTime: 4 },
    { id: 'bu3', title: 'RBI Introduces Central Bank Digital Currency for Retail', summary: 'e-Rupee expands to all commercial banks with real-time settlement capabilities.', category: 'business', time: Date.now() - 12600000, image: '', source: 'Moneycontrol', readTime: 5 },
  ],
  technology: [
    { id: 't1', title: 'OpenAI Announces GPT-6 with Unprecedented Reasoning', summary: 'Latest model demonstrates expert-level performance across all professional licensing exams.', category: 'technology', time: Date.now() - 3600000, image: '', source: 'The Verge', readTime: 6 },
    { id: 't2', title: '6G Network Standards Finalized by ITU', summary: 'Terahertz-band communications standard promises 1Tbps speeds and microsecond latency.', category: 'technology', time: Date.now() - 7200000, image: '', source: 'Wired', readTime: 5 },
    { id: 't3', title: 'Apple Silicon M5 Chip Sets New Performance Records', summary: 'TSMC 2nm process delivers 60% improvement in efficiency for next-generation Mac lineup.', category: 'technology', time: Date.now() - 10800000, image: '', source: 'Ars Technica', readTime: 4 },
  ],
  science: [
    { id: 's1', title: 'CRISPR Gene Therapy Cures Sickle Cell Disease', summary: 'FDA approves first permanent cure for sickle cell using CRISPR-Cas9 gene editing.', category: 'science', time: Date.now() - 5400000, image: '', source: 'Nature Medicine', readTime: 7 },
    { id: 's2', title: 'JWST Detects Signs of Life on Exoplanet K2-18b', summary: 'Atmospheric analysis reveals dimethyl sulfide, a biosignature gas produced by living organisms.', category: 'science', time: Date.now() - 10800000, image: '', source: 'Science', readTime: 8 },
    { id: 's3', title: 'Fusion Energy Achieves Net Positive for 100 Hours', summary: 'ITER experiment maintains sustained energy gain, bringing commercial fusion closer to reality.', category: 'science', time: Date.now() - 16200000, image: '', source: 'Physics Today', readTime: 6 },
  ],
  health: [
    { id: 'h1', title: 'WHO Endorses Universal mRNA Vaccine Platform', summary: 'Plug-and-play mRNA technology adapted for rapid response against emerging infectious diseases.', category: 'health', time: Date.now() - 4500000, image: '', source: 'WHO', readTime: 5 },
    { id: 'h2', title: 'AI System Detects Cancer 5 Years Before Symptoms', summary: 'Deep learning model analyzes routine blood tests to identify cancer markers with 92% accuracy.', category: 'health', time: Date.now() - 9000000, image: '', source: 'The Lancet', readTime: 6 },
    { id: 'h3', title: 'Sleep Study Reveals Optimal Duration for Cognitive Health', summary: '7-hour sleep sweet spot identified for maintaining memory and preventing neurodegeneration.', category: 'health', time: Date.now() - 13500000, image: '', source: 'JAMA', readTime: 4 },
  ],
  sports: [
    { id: 'sp1', title: 'India Wins Historic Cricket World Cup Double', summary: 'Back-to-back ODI and T20 World Cup victories make India first team to hold both titles simultaneously.', category: 'sports', time: Date.now() - 3000000, image: '', source: 'ESPN', readTime: 4 },
    { id: 'sp2', title: 'Olympic Committee Announces Esports as Official Event', summary: 'Competitive gaming joins the 2028 Los Angeles Olympics with five inaugural titles.', category: 'sports', time: Date.now() - 6000000, image: '', source: 'Olympics.com', readTime: 3 },
    { id: 'sp3', title: 'F1 Expands to Indian Grand Prix at New Circuit', summary: 'Formula 1 returns to India with a purpose-built track near Hyderabad for the 2027 season.', category: 'sports', time: Date.now() - 9000000, image: '', source: 'Autosport', readTime: 4 },
  ],
  entertainment: [
    { id: 'e1', title: 'Bollywood Records Highest-Grossing Year Ever', summary: 'Indian cinema crosses $5B global box office with three films earning over $500M each.', category: 'entertainment', time: Date.now() - 3600000, image: '', source: 'Variety', readTime: 4 },
    { id: 'e2', title: 'Streaming Wars: Netflix Launches Free Ad-Supported Tier', summary: 'Major platform offers free content library supported by next-generation contextual advertising.', category: 'entertainment', time: Date.now() - 7200000, image: '', source: 'Hollywood Reporter', readTime: 3 },
    { id: 'e3', title: 'AI-Generated Film Wins Independent Spirit Award', summary: 'First major award for AI-assisted filmmaking sparks debate about creative authenticity.', category: 'entertainment', time: Date.now() - 10800000, image: '', source: 'IndieWire', readTime: 5 },
  ]
};
