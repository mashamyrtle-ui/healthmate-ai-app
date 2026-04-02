import { useState, useEffect } from 'react';
import axios from 'axios';
import { Pill, Plus, CheckCircle, XCircle, Calendar, Target } from 'lucide-react';

export default function MedicationTracker() {
  const [meds, setMeds] = useState([]);
  const [adherencePct, setAdherencePct] = useState(0);
  const [name, setName] = useState('');
  const [time, setTime] = useState('');

  const fetchMeds = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/medication');
      setMeds(res.data.meds || []);
      setAdherencePct(res.data.adherencePct || 0);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMeds();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name || !time) return;

    try {
      await axios.post('http://localhost:3001/api/medication', {
        name,
        time,
        date: new Date().toISOString().split('T')[0],
        status: 'pending'
      });
      setName('');
      setTime('');
      fetchMeds();
    } catch (error) {
       console.error("Failed to add medication");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:3001/api/medication/${id}`, { status });
      fetchMeds();
    } catch (error) {
      console.error("Update failed");
    }
  };

  const offset = 251.3 * (1 - adherencePct / 100);

  return (
    <div className="page">
      <div className="ph">
        <div>
          <h1 className="page-title">Medication <span>Tracker</span></h1>
          <p className="page-desc">Manage your daily prescriptions and monitor your adherence score over time.</p>
        </div>
      </div>

      <div className="grid2" style={{ gridTemplateColumns: '3fr 2fr' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="gcard">
            <div className="card-head">
              <div className="card-label">
                <div className="card-icon ci-amber"><Pill size={20} /></div>
                <div>
                  <div className="card-title">Today's Schedule</div>
                  <div className="card-sub">{meds.length} MEDICATIONS</div>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {meds.map((med) => (
                <div key={med._id} className={`med-row ${med.status === 'taken' ? 'taken' : ''}`}>
                  <div className="med-info">
                    <div className="med-orb" style={{ background: med.status === 'taken' ? 'var(--accent)' : 'var(--accent3)', boxShadow: `0 0 8px ${med.status === 'taken' ? 'var(--accent)' : 'var(--accent3)'}` }}></div>
                    <div>
                      <div className="med-name">{med.name}</div>
                      <div className="med-time">{med.time} · {med.date}</div>
                    </div>
                  </div>
                  {med.status === 'pending' ? (
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button className="btn-take" onClick={() => updateStatus(med._id, 'taken')}>TAKE ✓</button>
                      <button className="btn-miss" onClick={() => updateStatus(med._id, 'missed')}>MISS ✗</button>
                    </div>
                  ) : (
                    <span style={{ fontSize: '11px', color: med.status === 'taken' ? 'var(--accent)' : 'var(--accent4)', fontFamily: 'var(--mono)', fontWeight: '600' }}>
                      {med.status.toUpperCase()} {med.status === 'taken' ? '✓' : '✗'}
                    </span>
                  )}
                </div>
              ))}
              {meds.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text3)', fontSize: '13px', padding: '20px' }}>No medications scheduled for today.</p>}
            </div>
            
            <form onSubmit={handleAdd} className="add-row" style={{ display: 'flex', gap: '8px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
              <input 
                className="field" 
                placeholder="Medicine name..." 
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ flex: 1 }}
              />
              <input 
                className="field" 
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                style={{ maxWidth: '130px' }}
              />
              <button type="submit" className="btn-add">+ Add</button>
            </form>
          </div>

          <div className="gcard">
            <div className="card-head">
              <div className="card-label">
                <div className="card-icon ci-green"><Calendar size={20} /></div>
                <div>
                  <div className="card-title">Recent History</div>
                  <div className="card-sub">LAST 3 DAYS</div>
                </div>
              </div>
            </div>
            <div style={{ padding: '4px' }}>
               <div style={{ fontSize: '13px', color: 'var(--text2)', padding: '10px 0', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Tue 01 Apr</span>
                  <span className="stat-badge badge-warn">67% Adherence</span>
               </div>
               <div style={{ fontSize: '13px', color: 'var(--text2)', padding: '10px 0', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Mon 31 Mar</span>
                  <span className="stat-badge badge-ok">100% Adherence</span>
               </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="gcard">
            <div className="card-head">
              <div className="card-label">
                <div className="card-icon ci-blue"><Target size={20} /></div>
                <div>
                  <div className="card-title">Adherence Score</div>
                  <div className="card-sub">WEEKLY GOAL: 95%</div>
                </div>
              </div>
            </div>
            <div className="ring-wrap" style={{ position: 'relative', width: '100px', height: '100px', margin: '10px auto 20px' }}>
              <svg width="100" height="100" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8"/>
                <circle 
                  cx="50" cy="50" r="40" fill="none" 
                  stroke={adherencePct >= 80 ? 'var(--accent)' : 'var(--accent3)'} 
                  strokeWidth="8" 
                  strokeDasharray="251.3" 
                  strokeDashoffset={offset} 
                  strokeLinecap="round" 
                  style={{ transition: 'stroke-dashoffset 0.5s ease', transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                />
              </svg>
              <div className="ring-label" style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--mono)', fontSize: '18px', fontWeight: '600', color: 'var(--accent)' }}>
                {adherencePct}%
              </div>
            </div>
            <div style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text2)' }}>
              {adherencePct >= 80 ? 'Good work! You are staying consistent 🔥' : 'Try to stay more consistent with your schedule.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
