import { useState } from 'react';
import axios from 'axios';

export default function Login({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const endpoint = isLogin ? '/api/login' : '/api/register';
    const payload = { email, password, fullName };
    
    try {
      const res = await axios.post(`http://localhost:3001${endpoint}`, payload);
      if (res.data.success) {
        if (isLogin) {
          onLoginSuccess(res.data.user);
        } else {
          setIsLogin(true);
          setError('Account created! Please login.');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg">
        <div className="nebula-1"></div>
        <div className="nebula-2"></div>
      </div>

      <div className="login-card">
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div className="logo-text" style={{ fontSize: '28px', marginBottom: '4px' }}>HealthMate</div>
          <div style={{ fontSize: '12px', color: 'var(--text3)', letterSpacing: '2px', fontWeight: '500' }}>AI HEALTH OS</div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>
              {isLogin ? 'Welcome back' : 'Create account'}
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text2)' }}>
              {isLogin ? 'Enter your credentials to access your health data.' : 'Join HealthMate to start tracking your laboratory vitals.'}
            </p>
          </div>

          {error && (
            <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(255,77,109,0.1)', border: '1px solid rgba(255,77,109,0.2)', color: 'var(--accent4)', fontSize: '13px', marginBottom: '20px' }}>
              {error}
            </div>
          )}

          <input 
            type="text" 
            placeholder="Full Name" 
            className="glass-input"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <input 
            type="email" 
            placeholder="Email Address" 
            className="glass-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="glass-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button 
            type="submit" 
            className="btn-primary" 
            style={{ width: '100%', padding: '14px', borderRadius: '16px', fontSize: '15px', marginTop: '10px' }}
            disabled={loading}
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>

          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <button 
              type="button"
              style={{ background: 'none', border: 'none', color: 'var(--text3)', fontSize: '13px', cursor: 'pointer' }}
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <span style={{ color: 'var(--accent)', fontWeight: '600' }}>{isLogin ? 'Sign Up' : 'Log In'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
