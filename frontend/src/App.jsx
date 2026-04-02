import { useState } from 'react';
import './index.css';
import LabReport from './components/LabReport';
import ChatAssistant from './components/ChatAssistant';
import MedicationTracker from './components/MedicationTracker';
import GlucoseTracker from './components/GlucoseTracker';

function App() {
  const [activeTab, setActiveTab] = useState('lab');

  return (
    <div className="container">
      <h1 className="app-title">AI HealthMate</h1>
      
      <div className="nav-tabs">
        <button 
          className={`nav-tab ${activeTab === 'lab' ? 'active' : ''}`}
          onClick={() => setActiveTab('lab')}
        >
          Lab Results
        </button>
        <button 
          className={`nav-tab ${activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          AI Assistant
        </button>
        <button 
          className={`nav-tab ${activeTab === 'meds' ? 'active' : ''}`}
          onClick={() => setActiveTab('meds')}
        >
          Medications
        </button>
        <button 
          className={`nav-tab ${activeTab === 'glucose' ? 'active' : ''}`}
          onClick={() => setActiveTab('glucose')}
        >
          Glucose Trend
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'lab' && <LabReport />}
        {activeTab === 'chat' && <ChatAssistant />}
        {activeTab === 'meds' && <MedicationTracker />}
        {activeTab === 'glucose' && <GlucoseTracker />}
      </div>
    </div>
  );
}

export default App;
