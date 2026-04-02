import { useState } from 'react';
import { ShieldAlert, Phone, User, Heart, Zap, Waves } from 'lucide-react';

export default function EmergencyResponse() {
  const [alertMode, setAlertMode] = useState(false);
  const [aidTab, setAidTab] = useState('low-sugar');

  const helplines = [
    { name: 'National Emergency', num: '112', desc: 'Police · Fire · Ambulance' },
    { name: 'Ambulance', num: '108', desc: 'Free · 24/7 · Tamil Nadu' },
    { name: 'Health Helpline', num: '104', desc: 'Medical advice · Free' },
    { name: 'Mental Health', num: '9152987821', label: 'iCall', desc: 'Emotional support' }
  ];

  return (
    <div className={alertMode ? 'alert-mode' : ''}>
      <div className="ph" style={{ marginBottom: '20px' }}>
        <div>
          <div className="page-label" style={{ color: 'var(--accent4)' }}>// EMERGENCY</div>
          <h1 className="page-title">Emergency <span>Response</span></h1>
          <p className="page-desc">Quick access to emergency services, contacts, and first-aid guidance.</p>
        </div>
        <div className="chip" style={{ background: alertMode ? 'rgba(255,77,109,0.1)' : '', borderColor: alertMode ? 'var(--accent4)' : '' }} onClick={() => setAlertMode(!alertMode)}>
          <div className="chip-dot" style={{ background: 'var(--accent4)', boxShadow: '0 0 8px var(--accent4)' }}></div>
          <span style={{ color: alertMode ? 'var(--accent4)' : '' }}>Alert Mode: {alertMode ? 'ON' : 'OFF'}</span>
        </div>
      </div>

      <div className="grid2" style={{ gridTemplateColumns: '1fr 1.2fr', alignItems: 'start' }}>
        
        {/* SOS Card */}
        <div className="gcard">
          <div className="card-head">
            <div className="card-label">
              <div className="card-icon ci-red"><ShieldAlert size={20} /></div>
              <div>
                <div className="card-title">Emergency SOS</div>
                <div className="card-sub">CALLS 112 IMMEDIATELY</div>
              </div>
            </div>
          </div>
          
          <div className="sos-btn">
            <div className="sos-pulse"></div>
            <div style={{ fontSize: '32px', fontWeight: '900', letterSpacing: '4px', position: 'relative' }}>SOS</div>
            <div style={{ fontSize: '10px', fontFamily: 'var(--mono)', color: 'var(--text3)', marginTop: '8px' }}>EMERGENCY</div>
          </div>
          
          <div style={{ textAlign: 'center', fontSize: '11px', color: 'var(--text3)', fontFamily: 'var(--mono)', lineHeight: '1.6' }}>
            Hold to call · Sends location<br/>to emergency contacts
          </div>
        </div>

        {/* Contacts */}
        <div className="gcard">
          <div className="card-head">
            <div className="card-label">
              <div className="card-icon ci-amber"><Phone size={20} /></div>
              <div>
                <div className="card-title">Emergency Contacts</div>
                <div className="card-sub">TAP TO CALL</div>
              </div>
            </div>
            <button className="badge-warn" style={{ border: 'none', background: 'rgba(245,160,0,0.1)' }}>+ Add</button>
          </div>
          
          <div>
            <div className="contact-card">
              <div className="contact-avatar">A</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: '700' }}>Amma (Mom)</div>
                <div style={{ fontSize: '10px', color: 'var(--text3)', fontFamily: 'var(--mono)' }}>PRIMARY · +91 98765 43210</div>
              </div>
              <button className="btn-primary" style={{ padding: '6px 14px' }}>CALL</button>
            </div>
            <div className="contact-card">
              <div className="contact-avatar" style={{ color: 'var(--accent2)' }}>D</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: '700' }}>Dr. Kavitha</div>
                <div style={{ fontSize: '10px', color: 'var(--text3)', fontFamily: 'var(--mono)' }}>FAMILY DOCTOR · +91 94400 11223</div>
              </div>
              <button className="btn-primary" style={{ padding: '6px 14px' }}>CALL</button>
            </div>
            <div className="contact-card">
              <div className="contact-avatar" style={{ color: 'var(--accent4)' }}>🏥</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: '700' }}>RMKCET Clinic</div>
                <div style={{ fontSize: '10px', color: 'var(--text3)', fontFamily: 'var(--mono)' }}>CAMPUS MEDICAL · +91 44 2791 5100</div>
              </div>
              <button className="btn-primary" style={{ padding: '6px 14px' }}>CALL</button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid2" style={{ gridTemplateColumns: '1fr 1fr', marginTop: '20px' }}>
        
        {/* Helplines */}
        <div className="gcard">
          <div className="card-head">
            <div className="card-label">
              <div className="card-icon ci-blue"><Zap size={20} /></div>
              <div>
                <div className="card-title">National Helplines</div>
                <div className="card-sub">INDIA · ALWAYS FREE</div>
              </div>
            </div>
          </div>
          
          <div>
            {helplines.map((h, i) => (
              <div key={i} className="helpline-item">
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '700' }}>{h.name}</div>
                  <div style={{ fontSize: '10px', color: 'var(--text3)' }}>{h.desc}</div>
                </div>
                <div className="helpline-num">{h.num}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Health Summary */}
          <div className="gcard">
            <div className="card-head">
              <div className="card-label">
                <div className="card-icon ci-green"><Waves size={20} /></div>
                <div>
                  <div className="card-title">My Health Summary</div>
                  <div className="card-sub">SHARE WITH DOCTOR</div>
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
              {[
                { label: 'Blood Glucose', val: '118 mg/dL', c: 'var(--accent3)' },
                { label: 'Hemoglobin', val: '16.3 g/dL', c: 'var(--accent)' },
                { label: 'Cholesterol', val: '192 mg/dL', c: 'var(--accent2)' },
                { label: 'Current Meds', val: 'Metformin · VitD3 · Iron', c: 'var(--accent2)' },
                { label: 'Allergies', val: 'None on record', c: 'var(--accent4)' },
              ].map((s, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '13px', color: 'var(--text2)' }}>{s.label}</div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: s.c }}>{s.val}</div>
                </div>
              ))}
            </div>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="lang-box" style={{ flex: 1, padding: '8px', justifyContent: 'center' }}>WhatsApp</button>
              <button className="lang-box" style={{ flex: 1, padding: '8px', justifyContent: 'center' }}>PDF</button>
            </div>
          </div>

          {/* Blood & ID Card */}
          <div className="id-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '10px', color: 'var(--accent4)', fontWeight: '700', letterSpacing: '1px' }}>BLOOD GROUP</div>
                <div style={{ fontSize: '36px', fontWeight: '900', color: 'var(--accent4)' }}>B+</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '15px', fontWeight: '800' }}>Monika R.</div>
                <div style={{ fontSize: '9px', color: 'var(--text3)', marginTop: '4px' }}>DOB: 12 Mar 2003</div>
                <div style={{ fontSize: '9px', color: 'var(--text3)' }}>RMKCET · CHENNAI</div>
                <div className="badge-warn" style={{ fontSize: '8px', marginTop: '10px' }}>ID: HM-2026-0042</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* First Aid Guide */}
      <div className="gcard" style={{ marginTop: '20px' }}>
        <div className="card-head">
          <div className="card-label">
            <div className="card-icon ci-blue"><Zap size={20} /></div>
            <div>
              <div className="card-title">Quick First Aid Guide</div>
              <div className="card-sub">AI-CURATED FOR YOUR CONDITIONS</div>
            </div>
          </div>
          <div className="lang-strip">
            <button className={`lang-btn ${aidTab === 'low-sugar' ? 'on' : ''}`} onClick={() => setAidTab('low-sugar')}>Low Sugar</button>
            <button className={`lang-btn ${aidTab === 'high-sugar' ? 'on' : ''}`} onClick={() => setAidTab('high-sugar')}>High Sugar</button>
            <button className={`lang-btn ${aidTab === 'fainting' ? 'on' : ''}`} onClick={() => setAidTab('fainting')}>Fainting</button>
          </div>
        </div>
        
        <div className="grid2" style={{ gap: '14px' }}>
          {[
            { n: 1, t: 'Stay calm — sit or lie down immediately to prevent falling.' },
            { n: 2, t: 'Consume 15g fast sugar: 4 glucose tabs, ½ cup juice, or 3 tsp sugar.' },
            { n: 3, t: 'Wait 15 minutes and recheck. If still low, repeat step 2.' },
            { n: 4, t: 'Once recovered, eat a small meal or snack. Call Dr. Kavitha if no improvement.' }
          ].map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: '14px', background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '16px', border: '1px solid var(--border)' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255,77,109,0.1)', color: 'var(--accent4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '800', flexShrink: 0 }}>{step.n}</div>
              <div style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: '1.6' }}>{step.t}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
