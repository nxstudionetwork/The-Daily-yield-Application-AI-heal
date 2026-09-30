const AI = (() => {
  let messages = [];
  let isTyping = false;

  function render(content) {
    if (!content) return;
    content.innerHTML = `
      <div class="ai-page fade-in">
        <div class="ai-sidebar">
          <div class="ai-sidebar-header">
            <h3>AI Assistant</h3>
            <button class="btn btn-sm btn-primary" id="new-chat-btn">New Chat</button>
          </div>
          <div class="ai-chats-list" id="ai-chats-list">
            <div class="ai-chat-item active">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              <span>New Conversation</span>
            </div>
          </div>
          <div class="ai-tools">
            <h4>Tools</h4>
            <button class="ai-tool-btn" data-tool="research">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              Research
            </button>
            <button class="ai-tool-btn" data-tool="translate">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 8l6 6"/><path d="M4 14l6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/></svg>
              Translation
            </button>
            <button class="ai-tool-btn" data-tool="analysis">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
              Market Analysis
            </button>
          </div>
        </div>
        <div class="ai-main">
          <div class="ai-messages" id="ai-messages">
            <div class="ai-welcome">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="1.5"><path d="M12 2a4 4 0 0 1 4 4v1a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z"/><rect x="2" y="14" width="20" height="8" rx="2"/></svg>
              <h2>How can I help you today?</h2>
              <p>Ask me anything about news, markets, or research.</p>
              <div class="ai-suggestions">
                <button class="ai-suggestion" data-msg="Summarize today's top market news">Summarize today's market news</button>
                <button class="ai-suggestion" data-msg="Analyze Nifty 50 performance">Analyze Nifty 50</button>
                <button class="ai-suggestion" data-msg="What are the latest technology breakthroughs?">Latest tech breakthroughs</button>
                <button class="ai-suggestion" data-msg="Compare Indian and US market trends">Compare IN vs US markets</button>
              </div>
            </div>
          </div>
          <div class="ai-input-area">
            <div class="ai-input-wrap">
              <textarea class="ai-input" id="ai-input" placeholder="Ask AI anything..." rows="1"></textarea>
              <button class="ai-send-btn" id="ai-send-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              </button>
            </div>
            <span class="ai-disclaimer">AI can make mistakes. Verify important information.</span>
          </div>
        </div>
      </div>
    `;
    bindEvents();
  }

  function bindEvents() {
    Utils.$('#ai-send-btn')?.addEventListener('click', sendMessage);
    Utils.$('#ai-input')?.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    });
    Utils.$('#new-chat-btn')?.addEventListener('click', () => {
      messages = [];
      const el = Utils.$('#ai-messages');
      if (el) el.innerHTML = '';
      renderWelcome();
    });
    Utils.$$('.ai-suggestion').forEach(btn => {
      btn.addEventListener('click', () => {
        const msg = btn.dataset.msg;
        if (msg) { Utils.$('#ai-input').value = msg; sendMessage(); }
      });
    });
    Utils.$$('.ai-tool-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tool = btn.dataset.tool;
        const prompts = {
          research: 'Help me research the latest developments in',
          translate: 'Translate the following to Hindi:',
          analysis: 'Analyze the market trends for'
        };
        Utils.$('#ai-input').value = prompts[tool] || '';
        Utils.$('#ai-input').focus();
      });
    });
  }

  function sendMessage() {
    const input = Utils.$('#ai-input');
    if (!input || !input.value.trim() || isTyping) return;
    const text = input.value.trim();
    input.value = '';
    input.style.height = 'auto';

    addMessage('user', text);
    isTyping = true;

    const welcome = Utils.$('.ai-welcome');
    if (welcome) welcome.remove();

    setTimeout(() => {
      const response = generateResponse(text);
      addMessage('assistant', response);
      isTyping = false;
    }, 800 + Math.random() * 1200);
  }

  function addMessage(role, text) {
    const container = Utils.$('#ai-messages');
    if (!container) return;
    messages.push({ role, text, time: Date.now() });
    const div = Utils.el('div', { className: `ai-msg ai-msg-${role}` });
    div.innerHTML = `
      <div class="ai-msg-avatar">${role === 'assistant' ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><path d="M12 2a4 4 0 0 1 4 4v1a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z"/><rect x="2" y="14" width="20" height="8" rx="2"/></svg>' : 'U'}</div>
      <div class="ai-msg-body">${role === 'assistant' ? formatAIResponse(text) : Utils.escapeHtml(text)}</div>
    `;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
  }

  function formatAIResponse(text) {
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
               .replace(/\n/g, '<br>')
               .replace(/• /g, '<br>• ');
  }

  function generateResponse(query) {
    const lower = query.toLowerCase();
    if (lower.includes('market') || lower.includes('nifty') || lower.includes('stock')) {
      return `Based on current market data:\n\n• **Nifty 50** is trading at **24,850** (+0.75%)\n• **Sensex** at **81,430** (+0.67%)\n• Key drivers: Strong FII inflows, positive global cues\n• **Top Gainers**: SBIN (+4.34%), WIPRO (+2.24%), KOTAKBANK (+2.28%)\n• **Top Losers**: BHARTIARTL (-1.83%), ADANIENT (-1.86%)\n\nThe overall market sentiment is bullish with strong institutional buying. Recommend monitoring global trade developments for further cues.`;
    }
    if (lower.includes('news') || lower.includes('today') || lower.includes('top')) {
      return `Here are today's top headlines:\n\n• **Global Trade Deal** — Major economies sign historic agreement\n• **ISRO Launch** — Reusable launch vehicle test successful\n• **Quantum Computing** — 1000-qubit processor achieved\n• **Climate Summit** — 190 nations sign binding accord\n• **Apple AR** — New glasses unveiled at WWDC\n\nWould you like me to elaborate on any of these stories?`;
    }
    if (lower.includes('tech') || lower.includes('technology') || lower.includes('ai')) {
      return `Latest in technology:\n\n• **GPT-6** launched with unprecedented reasoning capabilities\n• **6G Standards** finalized with 1Tbps speeds\n• **Apple M5** chip sets new efficiency records on 2nm process\n• **CRISPR** therapy approved for sickle cell disease\n\nAI continues to be the dominant theme, with increasing enterprise adoption across sectors. The convergence of AR/VR with AI is particularly noteworthy.`;
    }
    if (lower.includes('compare') || lower.includes('vs') || lower.includes('india')) {
      return `**India vs US Market Comparison:**\n\n| Metric | India | US |\n|--------|-------|----|\n| YTD Returns | +12.3% | +8.7% |\n| P/E Ratio | 24x | 22x |\n| FII Flow | +$28B | N/A |\n\nIndia is outperforming on growth metrics driven by domestic consumption and digital transformation. US markets are more sensitive to rate decisions. Both offer opportunities but India has higher beta.`;
    }
    return `Thank you for your question. Based on my analysis:\n\n• The current market environment is **favorable** with strong macroeconomic indicators\n• Key sectors to watch: Technology, Financial Services, and Clean Energy\n• Risk factors include global trade uncertainties and rate policy\n\nWould you like me to dive deeper into any specific topic? I can help with market analysis, news summaries, or research on any subject.`;
  }

  function renderWelcome() {
    const container = Utils.$('#ai-messages');
    if (!container) return;
    container.innerHTML = `
      <div class="ai-welcome">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="1.5"><path d="M12 2a4 4 0 0 1 4 4v1a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z"/><rect x="2" y="14" width="20" height="8" rx="2"/></svg>
        <h2>How can I help you today?</h2>
        <p>Ask me anything about news, markets, or research.</p>
      </div>
    `;
  }

  return { render };
})();
