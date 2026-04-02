import React from 'react';

export default function Dashboard({ setActiveTab, user, labResults }) {
  const getTestData = (name) => {
    if (!labResults || !labResults.tests) return null;
    return labResults.tests.find(t => t.test.toLowerCase() === name.toLowerCase());
  };

  const hemoglobin = getTestData('Hemoglobin');
  const glucose = getTestData('Glucose');
  const cholesterol = getTestData('Cholesterol');

  return (
    <div>
      <div className="ph">
        <div>
          <h1 className="page-title">Health <span>Intelligence</span></h1>
          <p className="page-desc">Good morning, {user?.fullName || user?.name || 'User'}. Here's your complete health snapshot for today.</p>
        </div>
      </div>

      <div className="grid4">
        {/* HEMOGLOBIN CARD */}
        <div className={`stat-card ${hemoglobin ? 'sc-green' : ''}`} style={{ background: !hemoglobin ? 'rgba(255,255,255,0.03)' : '', opacity: !hemoglobin ? 0.9 : 1 }}>
          <div className="stat-tag">Hemoglobin</div>
          {hemoglobin ? (
            <>
              <div className="stat-num">{hemoglobin.value}</div>
              <div className="stat-unit">{hemoglobin.unit} · extracted</div>
              <div className={`stat-badge ${hemoglobin.status === 'Normal' ? 'badge-ok' : 'badge-warn'}`}>
                {hemoglobin.status.toUpperCase()}
              </div>
            </>
          ) : (
            <div className="stat-unit" style={{ marginTop: '10px', color: 'var(--text2)', fontWeight: '500' }}>No report uploaded</div>
          )}
        </div>

        {/* GLUCOSE CARD */}
        <div className={`stat-card ${glucose ? 'sc-blue' : ''}`} style={{ background: !glucose ? 'rgba(255,255,255,0.03)' : '', opacity: !glucose ? 0.9 : 1 }}>
          <div className="stat-tag">Glucose</div>
          {glucose ? (
            <>
              <div className="stat-num">{glucose.value}</div>
              <div className="stat-unit">{glucose.unit} · extracted</div>
              <div className={`stat-badge ${glucose.status === 'Normal' ? 'badge-ok' : 'badge-warn'}`}>
                {glucose.status.toUpperCase()}
              </div>
            </>
          ) : (
            <div className="stat-unit" style={{ marginTop: '10px', color: 'var(--text2)', fontWeight: '500' }}>No report uploaded</div>
          )}
        </div>

        {/* CHOLESTEROL CARD */}
        <div className={`stat-card ${cholesterol ? 'sc-amber' : ''}`} style={{ background: !cholesterol ? 'rgba(255,255,255,0.03)' : '', opacity: !cholesterol ? 0.9 : 1 }}>
          <div className="stat-tag">Cholesterol</div>
          {cholesterol ? (
            <>
              <div className="stat-num">{cholesterol.value}</div>
              <div className="stat-unit">{cholesterol.unit} · extracted</div>
              <div className={`stat-badge ${cholesterol.status === 'Normal' ? 'badge-ok' : 'badge-warn'}`}>
                {cholesterol.status.toUpperCase()}
              </div>
            </>
          ) : (
            <div className="stat-unit" style={{ marginTop: '10px', color: 'var(--text2)', fontWeight: '500' }}>No report uploaded</div>
          )}
        </div>

        {/* MED ADHERENCE CARD (STILL MOCK FOR NOW) */}
        <div className="stat-card sc-red">
          <div className="stat-tag">Med Adherence</div>
          <div className="stat-num">100<span style={{ fontSize: '18px', letterSpacing: '0' }}>%</span></div>
          <div className="stat-unit">today · on track</div>
          <div className="stat-badge badge-info">EXCELLENT</div>
        </div>
      </div>

      <div className="grid2">
        <div className="gcard">
          <div className="card-head">
            <div className="card-label">
              <div className="card-icon ci-green">🧪</div>
              <div>
                <div className="card-title">Latest Lab Summary</div>
                <div className="card-sub">{labResults ? 'EXTRACTION COMPLETE' : 'PENDING UPLOAD'}</div>
              </div>
            </div>
            <button className="btn-ghost" onClick={() => setActiveTab('lab')} style={{ fontSize: '12px', padding: '7px 14px' }}>
              {labResults ? 'Analyze Another' : 'Upload Now'} →
            </button>
          </div>
          <div className="results-list">
            {labResults && labResults.tests && labResults.tests.length > 0 ? (
              labResults.tests.map((test, idx) => (
                <div key={idx} className="result-row">
                  <div>
                    <div className="result-name">{test.test}</div>
                    <div className="result-range-text">Status: {test.status}</div>
                  </div>
                  <div className={`result-val ${test.status === 'Normal' ? 'rv-ok' : 'rv-warn'}`}>
                    {test.value} <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>{test.unit}</span>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 0', opacity: 0.8 }}>
                <div style={{ fontSize: '24px', marginBottom: '10px' }}>📄</div>
                <div style={{ fontSize: '13px', color: 'var(--text2)', fontWeight: '500' }}>No lab report uploaded yet</div>
              </div>
            )}
          </div>
        </div>

        <div className="gcard">
          <div className="card-head">
            <div className="card-label">
              <div className="card-icon ci-amber">💊</div>
              <div>
                <div className="card-title">Today's Medications</div>
                <div className="card-sub">SCHEDULED DOSES</div>
              </div>
            </div>
            <button className="btn-ghost" onClick={() => setActiveTab('meds')} style={{ fontSize: '12px', padding: '7px 14px' }}>
              Manage →
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
             <div style={{ textAlign: 'center', padding: '40px 0', opacity: 0.8 }}>
                <div style={{ fontSize: '24px', marginBottom: '10px' }}>💊</div>
                <div style={{ fontSize: '13px', color: 'var(--text2)', fontWeight: '500' }}>Check your medication tracking board</div>
              </div>
          </div>
        </div>

        <div className="gcard" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="card-head">
            <div className="card-label">
              <div className="card-icon ci-blue">💬</div>
              <div>
                <div className="card-title">AI Assistant</div>
                <div className="card-sub">ALWAYS ONLINE</div>
              </div>
            </div>
          </div>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px', padding: '16px', flex: 1, marginBottom: '16px' }}>
            <div className="ai-tag">HEALTH INSIGHT</div>
            <div style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: '1.7' }}>
              {labResults ? (
                `Based on your last report: ${labResults.overallSummary}`
              ) : (
                "Upload a lab report or chat with me to get personalized health insights and recommendations."
              )}
            </div>
          </div>
          <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setActiveTab('chat')}>
            Open Assistant →
          </button>
        </div>
      </div>
    </div>
  );
}
