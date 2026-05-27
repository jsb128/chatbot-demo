(function() {
  // ============================================
  // CONFIGURATION — Change these for each client
  // ============================================
  var CONFIG = {
    businessName: "Jake's Electric",
    businessEmoji: "⚡",
    accentColor: "#f5c518",
    accentText: "#0d0f12",
    welcomeMessage: "Hey! I'm Jake's virtual assistant. Ask me anything about our services, pricing, or availability.",
    apiEndpoint: "https://chatbot-demo-gilt.vercel.app/api/chat",
    systemPrompt: `You are the AI assistant for Jake's Electric, a licensed electrician business. 
Answer questions exactly as Jake's assistant would — friendly, professional, and concise.
Never make up information. If you don't know something specific, say they can call Jake directly.

BUSINESS INFO:
- Business name: Jake's Electric
- Owner: Jake Miller, Licensed Master Electrician (20+ years experience)
- Phone: (555) 847-2291
- Hours: Mon–Fri 7am–6pm, Saturday 8am–2pm, closed Sunday
- Emergency service: Available 24/7 for emergencies (after-hours fee applies)

SERVICES:
- Panel upgrades and replacements
- Outlet and switch installation/repair
- Ceiling fan installation
- EV charger installation (Level 1 and Level 2)
- Lighting installation (indoor and outdoor)
- Whole-home rewiring
- Generator hookups
- Code violation repairs
- Smoke/CO detector installation
- Commercial electrical work

PRICING:
- Service call fee: $75 (waived if work is booked)
- Hourly rate: $95–$125/hr depending on job complexity
- Free written estimates for larger jobs
- Emergency/after-hours rate: $150/hr
- Most common jobs: Outlet install $150–200, Panel upgrade $1,500–3,500, Ceiling fan $100–175, EV charger $500–1,200

BOOKING:
- Call or text (555) 847-2291 to book
- Usually available within 3–5 business days
- Emergency calls responded to within 1–2 hours

Keep responses short — 2-4 sentences max. Sound like a real local business, not a corporate robot.`
  };

  // ============================================
  // STYLES
  // ============================================
  var style = document.createElement('style');
  style.textContent = `
    #cb-bubble {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 56px;
      height: 56px;
      background: ${CONFIG.accentColor};
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 26px;
      cursor: pointer;
      box-shadow: 0 4px 20px rgba(0,0,0,0.2);
      z-index: 99999;
      transition: transform 0.2s, box-shadow 0.2s;
      border: none;
      outline: none;
    }
    #cb-bubble:hover {
      transform: scale(1.08);
      box-shadow: 0 6px 28px rgba(0,0,0,0.25);
    }
    #cb-window {
      position: fixed;
      bottom: 92px;
      right: 24px;
      width: 360px;
      height: 500px;
      background: #0d0f12;
      border-radius: 16px;
      box-shadow: 0 8px 40px rgba(0,0,0,0.3);
      z-index: 99998;
      display: none;
      flex-direction: column;
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      border: 1px solid #2a3040;
    }
    #cb-window.open { display: flex; }
    #cb-header {
      background: #161a20;
      padding: 14px 16px;
      display: flex;
      align-items: center;
      gap: 10px;
      border-bottom: 1px solid #2a3040;
      flex-shrink: 0;
    }
    #cb-avatar {
      width: 36px; height: 36px;
      background: ${CONFIG.accentColor};
      border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
      font-size: 18px;
      flex-shrink: 0;
    }
    #cb-header-info { flex: 1; }
    #cb-name {
      font-size: 14px;
      font-weight: 600;
      color: #e8eaf0;
    }
    #cb-status {
      font-size: 11px;
      color: #22c55e;
      display: flex;
      align-items: center;
      gap: 4px;
      margin-top: 2px;
    }
    #cb-status::before {
      content: '';
      width: 6px; height: 6px;
      background: #22c55e;
      border-radius: 50%;
      display: inline-block;
    }
    #cb-close {
      background: none;
      border: none;
      color: #6b7585;
      font-size: 20px;
      cursor: pointer;
      padding: 0 4px;
      line-height: 1;
    }
    #cb-close:hover { color: #e8eaf0; }
    #cb-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px 12px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      scroll-behavior: smooth;
    }
    #cb-messages::-webkit-scrollbar { width: 3px; }
    #cb-messages::-webkit-scrollbar-thumb { background: #2a3040; border-radius: 2px; }
    .cb-msg {
      display: flex;
      gap: 8px;
      max-width: 88%;
      animation: cbMsgIn 0.2s ease;
    }
    @keyframes cbMsgIn {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .cb-msg.bot { align-self: flex-start; }
    .cb-msg.user { align-self: flex-end; flex-direction: row-reverse; }
    .cb-av {
      width: 26px; height: 26px;
      border-radius: 6px;
      display: flex; align-items: center; justify-content: center;
      font-size: 12px;
      flex-shrink: 0;
      margin-top: 2px;
    }
    .cb-msg.bot .cb-av { background: ${CONFIG.accentColor}; }
    .cb-msg.user .cb-av { background: #1e242d; border: 1px solid #2a3040; }
    .cb-bubble-msg {
      padding: 9px 13px;
      border-radius: 12px;
      font-size: 13px;
      line-height: 1.5;
    }
    .cb-msg.bot .cb-bubble-msg {
      background: #1e242d;
      border: 1px solid #2a3040;
      color: #e8eaf0;
      border-radius: 4px 12px 12px 12px;
    }
    .cb-msg.user .cb-bubble-msg {
      background: ${CONFIG.accentColor};
      color: ${CONFIG.accentText};
      font-weight: 500;
      border-radius: 12px 4px 12px 12px;
    }
    .cb-typing {
      display: flex;
      gap: 8px;
      align-self: flex-start;
      animation: cbMsgIn 0.2s ease;
    }
    .cb-typing-dots {
      background: #1e242d;
      border: 1px solid #2a3040;
      border-radius: 4px 12px 12px 12px;
      padding: 12px 16px;
      display: flex;
      gap: 4px;
      align-items: center;
    }
    .cb-dot {
      width: 5px; height: 5px;
      background: #6b7585;
      border-radius: 50%;
      animation: cbBounce 1.2s infinite;
    }
    .cb-dot:nth-child(2) { animation-delay: 0.2s; }
    .cb-dot:nth-child(3) { animation-delay: 0.4s; }
    @keyframes cbBounce {
      0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
      30% { transform: translateY(-4px); opacity: 1; }
    }
    #cb-input-area {
      padding: 12px;
      background: #161a20;
      border-top: 1px solid #2a3040;
      display: flex;
      gap: 8px;
      flex-shrink: 0;
    }
    #cb-input {
      flex: 1;
      background: #1e242d;
      border: 1px solid #2a3040;
      border-radius: 8px;
      padding: 9px 13px;
      color: #e8eaf0;
      font-size: 13px;
      outline: none;
      font-family: inherit;
      transition: border-color 0.15s;
    }
    #cb-input::placeholder { color: #6b7585; }
    #cb-input:focus { border-color: rgba(245,197,24,0.4); }
    #cb-send {
      width: 36px; height: 36px;
      background: ${CONFIG.accentColor};
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 15px;
      display: flex; align-items: center; justify-content: center;
      transition: opacity 0.15s;
      flex-shrink: 0;
    }
    #cb-send:hover { opacity: 0.85; }
    #cb-send:disabled { opacity: 0.4; cursor: not-allowed; }
    #cb-footer {
      text-align: center;
      padding: 6px;
      font-size: 10px;
      color: #3a4050;
      background: #0d0f12;
      flex-shrink: 0;
    }
    @media (max-width: 480px) {
      #cb-window {
        width: calc(100vw - 24px);
        right: 12px;
        bottom: 84px;
        height: 460px;
      }
      #cb-bubble { right: 16px; bottom: 16px; }
    }
  `;
  document.head.appendChild(style);

  // ============================================
  // HTML
  // ============================================
  var bubble = document.createElement('button');
  bubble.id = 'cb-bubble';
  bubble.innerHTML = CONFIG.businessEmoji;
  bubble.title = 'Chat with us';

  var win = document.createElement('div');
  win.id = 'cb-window';
  win.innerHTML = `
    <div id="cb-header">
      <div id="cb-avatar">${CONFIG.businessEmoji}</div>
      <div id="cb-header-info">
        <div id="cb-name">${CONFIG.businessName}</div>
        <div id="cb-status">Available 24/7</div>
      </div>
      <button id="cb-close">×</button>
    </div>
    <div id="cb-messages"></div>
    <div id="cb-input-area">
      <input id="cb-input" type="text" placeholder="Ask us anything..." />
      <button id="cb-send">➤</button>
    </div>
    <div id="cb-footer">Powered by Claude AI</div>
  `;

  document.body.appendChild(bubble);
  document.body.appendChild(win);

  // ============================================
  // LOGIC
  // ============================================
  var messages = [];
  var isLoading = false;
  var opened = false;

  bubble.addEventListener('click', function() {
    win.classList.toggle('open');
    if (!opened) {
      opened = true;
      addMessage(CONFIG.welcomeMessage, 'bot');
    }
  });

  document.getElementById('cb-close').addEventListener('click', function() {
    win.classList.remove('open');
  });

  document.getElementById('cb-input').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') sendMessage();
  });

  document.getElementById('cb-send').addEventListener('click', sendMessage);

  function addMessage(text, role) {
    var msgs = document.getElementById('cb-messages');
    var div = document.createElement('div');
    div.className = 'cb-msg ' + role;
    div.innerHTML = `
      <div class="cb-av">${role === 'bot' ? CONFIG.businessEmoji : '👤'}</div>
      <div class="cb-bubble-msg">${text}</div>
    `;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function showTyping() {
    var msgs = document.getElementById('cb-messages');
    var div = document.createElement('div');
    div.className = 'cb-typing';
    div.id = 'cb-typing';
    div.innerHTML = `
      <div class="cb-av" style="background:${CONFIG.accentColor}">${CONFIG.businessEmoji}</div>
      <div class="cb-typing-dots">
        <div class="cb-dot"></div>
        <div class="cb-dot"></div>
        <div class="cb-dot"></div>
      </div>
    `;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function removeTyping() {
    var t = document.getElementById('cb-typing');
    if (t) t.remove();
  }

  async function sendMessage() {
    if (isLoading) return;
    var input = document.getElementById('cb-input');
    var text = input.value.trim();
    if (!text) return;

    input.value = '';
    isLoading = true;
    document.getElementById('cb-send').disabled = true;

    addMessage(text, 'user');
    messages.push({ role: 'user', content: text });
    showTyping();

    try {
      var response = await fetch(CONFIG.apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: messages, system: CONFIG.systemPrompt })
      });
      var data = await response.json();
      removeTyping();
      var reply = data.reply || "Sorry, something went wrong. Please call us directly.";
      messages.push({ role: 'assistant', content: reply });
      addMessage(reply, 'bot');
    } catch (err) {
      removeTyping();
      addMessage("Sorry, something went wrong. Please call us directly.", 'bot');
    }

    isLoading = false;
    document.getElementById('cb-send').disabled = false;
  }
})();
