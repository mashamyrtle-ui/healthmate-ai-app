import { useState } from 'react';
import './index.css';
import Dashboard from './components/Dashboard';
import LabReport from './components/LabReport';
import ChatAssistant from './components/ChatAssistant';
import MedicationTracker from './components/MedicationTracker';
import GlucoseTracker from './components/GlucoseTracker';

import EmergencyResponse from './components/EmergencyResponse';

import Login from './components/Login';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [labResults, setLabResults] = useState(null);

  if (!user) {
    return <Login onLoginSuccess={(u) => setUser(u)} />;
  }

  return (
    <div className="app-container">
      <div className="grain"></div>
      
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="logo">
          <div className="logo-text">HealthMate</div>
          <div className="logo-sub">AI Health OS · v2.0</div>
        </div>
        
        <div className="nav-section">Overview</div>
        <button 
          className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <span className="nav-icon">⬡</span>Dashboard
        </button>
        <button 
          className={`nav-item ${activeTab === 'emergency' ? 'active' : ''}`}
          onClick={() => setActiveTab('emergency')}
          style={{ color: activeTab === 'emergency' ? 'var(--accent4)' : '' }}
        >
          <span className="nav-icon" style={{ color: 'var(--accent4)' }}>🚨</span>Emergency
        </button>
        
        <div className="nav-section">Modules</div>
        <button 
          className={`nav-item ${activeTab === 'lab' ? 'active' : ''}`}
          onClick={() => setActiveTab('lab')}
        >
          <span className="nav-icon">🧪</span>Lab Reports
        </button>
        <button 
          className={`nav-item ${activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          <span className="nav-icon">💬</span>AI Assistant
        </button>
        <button 
          className={`nav-item ${activeTab === 'meds' ? 'active' : ''}`}
          onClick={() => setActiveTab('meds')}
        >
          <span className="nav-icon">💊</span>Medications
        </button>
        <button 
          className={`nav-item ${activeTab === 'glucose' ? 'active' : ''}`}
          onClick={() => setActiveTab('glucose')}
        >
          <span className="nav-icon">📈</span>Glucose Trends
        </button>
        
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        <div className="page">
          {activeTab === 'dashboard' && <Dashboard user={user} labResults={labResults} setActiveTab={setActiveTab} />}
          {activeTab === 'lab' && <LabReport labResults={labResults} setLabResults={setLabResults} />}
          {activeTab === 'chat' && <ChatAssistant />}
          {activeTab === 'meds' && <MedicationTracker />}
          {activeTab === 'glucose' && <GlucoseTracker />}
          {activeTab === 'emergency' && <EmergencyResponse />}
        </div>
      </main>
    </div>
  );
}

export default App;
