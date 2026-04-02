import { useState } from 'react';
import axios from 'axios';
import { MessageSquare, Send } from 'lucide-react';

export default function ChatAssistant() {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hello! I am your AI Health Assistant. Ask me anything about health, blood pressure, or lab results.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:3001/api/chat', { question: userMessage });
      setMessages(prev => [...prev, { role: 'assistant', text: res.data.response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', text: "Sorry, I couldn't process that right now." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '600px' }}>
      <h2 className="card-title">
        <MessageSquare size={24} color="var(--primary)" />
        AI Health Chat Assistant
      </h2>

      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        padding: '1rem', 
        background: '#f9fafb', 
        borderRadius: '8px',
        marginBottom: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
            background: msg.role === 'user' ? 'var(--primary)' : 'white',
            color: msg.role === 'user' ? 'white' : 'var(--text-main)',
            padding: '0.75rem 1rem',
            borderRadius: '12px',
            borderBottomRightRadius: msg.role === 'user' ? '0' : '12px',
            borderBottomLeftRadius: msg.role === 'assistant' ? '0' : '12px',
            maxWidth: '80%',
            boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
          }}>
            {msg.text}
          </div>
        ))}
        {loading && (
          <div style={{ alignSelf: 'flex-start', padding: '0.75rem 1rem', background: 'white', borderRadius: '12px' }}>
            Thinking...
          </div>
        )}
      </div>

      <form onSubmit={handleSend} style={{ display: 'flex', gap: '0.5rem' }}>
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g., Why is my sugar level high?"
          className="input-field"
          style={{ marginBottom: 0, flex: 1 }}
        />
        <button type="submit" disabled={loading} className="btn" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Send size={18} />
          Send
        </button>
      </form>
    </div>
  );
}
