import { useState, useEffect } from 'react';
import axios from 'axios';
import { MessageSquare, Send, Bot, User, HelpCircle, Activity, Languages } from 'lucide-react';

export default function ChatAssistant() {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hey! I'm your HealthMate AI. I've analyzed your medical profile and I'm ready to help. Ask me anything about your lab reports, symptoms, or wellness goals!" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatLang, setChatLang] = useState('en');

  const translateInitialMessage = async () => {
    const originalText = "Hey! I'm your HealthMate AI. I've analyzed your medical profile and I'm ready to help. Ask me anything about your lab reports, symptoms, or wellness goals!";
    
    if (chatLang === 'en') {
      setMessages([{ role: 'assistant', text: originalText }]);
      return;
    }

    try {
      const res = await axios.post('http://localhost:3001/api/translate', { 
        text: originalText,
        targetLang: chatLang 
      });
      setMessages([{ role: 'assistant', text: res.data.translatedText }]);
    } catch (err) {
      console.error("Failed to translate greeting", err);
    }
  };

  useEffect(() => {
    if (messages.length === 1 && messages[0].role === 'assistant') {
      translateInitialMessage();
    }
  }, [chatLang]);

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:3001/api/chat', { 
        question: userMessage,
        language: chatLang 
      });
      setMessages(prev => [...prev, { role: 'assistant', text: res.data.response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', text: "Sorry, I couldn't process that right now." }]);
    } finally {
      setLoading(false);
    }
  };

  const quickAsk = (q) => {
    setInput(q);
  };

  return (
    <div className="page">
      <div className="ph">
        <div>
          <h1 className="page-title">Health <span>Assistant</span></h1>
          <p className="page-desc">Ask anything about your health results, symptoms, or general wellness. Powered by Gemini Pro.</p>
        </div>
      </div>

      <div className="grid2" style={{ gridTemplateColumns: '2fr 1fr', alignItems: 'start' }}>
        <div className="gcard chat-outer">
          <div className="card-head" style={{ marginBottom: '14px' }}>
            <div className="card-label">
              <div className="card-icon ci-blue"><Bot size={20} /></div>
              <div>
                <div className="card-title">HealthMate AI</div>
                <div className="card-sub">POWERED BY GEMINI</div>
              </div>
            </div>
            <div className="chip" style={{ fontSize: '10px', padding: '5px 10px' }}><div className="chip-dot"></div>Online</div>
          </div>
          
          <div className="qchips" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}>
            <div className="qchip" style={{ padding: '7px 14px', borderRadius: '99px', background: 'var(--surface)', border: '1px solid var(--border)', fontSize: '12px', cursor: 'pointer' }} 
                 onClick={() => quickAsk('How can I improve my hemoglobin?')}>💉 Hemoglobin tips</div>
            <div className="qchip" style={{ padding: '7px 14px', borderRadius: '99px', background: 'var(--surface)', border: '1px solid var(--border)', fontSize: '12px', cursor: 'pointer' }} 
                 onClick={() => quickAsk('What does borderline glucose mean?')}>🩸 Glucose info</div>
            <div className="qchip" style={{ padding: '7px 14px', borderRadius: '99px', background: 'var(--surface)', border: '1px solid var(--border)', fontSize: '12px', cursor: 'pointer' }} 
                 onClick={() => quickAsk('What foods lower cholesterol?')}>🥑 Cholesterol diet</div>
          </div>

          <div className="chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`msg ${msg.role === 'user' ? 'msg-user' : 'msg-ai'}`}>
                <span className="msg-label">{msg.role === 'user' ? 'You' : 'HealthMate AI'}</span>
                {msg.text}
              </div>
            ))}
            {loading && <div className="msg msg-ai"><span className="msg-label">AI</span>Thinking...</div>}
          </div>

          <form onSubmit={handleSend} className="chat-input-row" style={{ display: 'flex', gap: '8px', paddingTop: '14px', borderTop: '1px solid var(--border)' }}>
            <input 
              className="chat-input" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about your health..." 
              style={{ flex: 1, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px', padding: '13px 18px', color: 'var(--text)' }}
            />
            <button type="submit" className="send-btn" disabled={loading} style={{ background: 'var(--accent)', border: 'none', borderRadius: '14px', width: '46px', height: '46px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Send size={18} color="black" />
            </button>
          </form>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

          <div className="gcard">
            <div className="card-head">
              <div className="card-label">
                <div className="card-icon ci-amber"><Languages size={20} /></div>
                <div>
                  <div className="card-title">Language</div>
                  <div className="card-sub">AI RESPONSE</div>
                </div>
              </div>
            </div>
            <div className="lang-list">
              <button className={`lang-box ${chatLang === 'en' ? 'active' : ''}`} onClick={() => setChatLang('en')}>
                <span className="lang-flag">🇬🇧</span>
                <span className="lang-name">English</span>
              </button>
              <button className={`lang-box ${chatLang === 'ta' ? 'active' : ''}`} onClick={() => setChatLang('ta')}>
                <span className="lang-flag">🇮🇳</span>
                <span className="lang-name">Tamil · தமிழ்</span>
              </button>
              <button className={`lang-box ${chatLang === 'hi' ? 'active' : ''}`} onClick={() => setChatLang('hi')}>
                <span className="lang-flag">🇮🇳</span>
                <span className="lang-name">Hindi · हिन्दी</span>
              </button>
            </div>
          </div>

          <div className="gcard">
            <div style={{ fontFamily: 'var(--mono)', fontSize: '9px', color: 'var(--text3)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '10px' }}>Disclaimer</div>
            <div style={{ fontSize: '12px', color: 'var(--text3)', lineHeight: '1.6' }}>HealthMate AI provides general wellness info. Always consult a real doctor for medical decisions.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
