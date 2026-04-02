import { useState, useEffect } from 'react';
import axios from 'axios';
import { Activity, TrendingUp, AlertTriangle, CheckCircle2, ChevronRight } from 'lucide-react';

export default function GlucoseTracker() {
  const [readings, setReadings] = useState([]);
  const [val, setVal] = useState('');
  const [trend, setTrend] = useState(null);

  const fetchReadings = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/glucose');
      setReadings(res.data.readings || []);
      setTrend(res.data.trend || null);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchReadings();
  }, []);

  const handleLog = async (e) => {
    e.preventDefault();
    if (!val) return;

    try {
      await axios.post('http://localhost:3001/api/glucose', {
        value: parseInt(val),
        date: new Date().toLocaleDateString('en-US', { weekday: 'short' })
      });
      setVal('');
      fetchReadings();
    } catch (error) {
      alert('Log failed.');
    }
  };

  const latest = readings.length > 0 ? readings[readings.length - 1].value : '--';
  const avg = readings.length > 0 ? (readings.reduce((a, b) => a + b.value, 0) / readings.length).toFixed(1) : '--';
  const isRising = readings.length >= 3 && readings[readings.length-1].value > readings[readings.length-2].value && readings[readings.length-2].value > readings[readings.length-3].value;

  return (
    <div className="page">
      <div className="ph">
        <div>
          <h1 className="page-title">Glucose <span>Monitor</span></h1>
          <p className="page-desc">Track levels and detect rising trends before they become concerning.</p>
        </div>
      </div>

      <div className="grid3" style={{ marginBottom: '20px' }}>
        <div className="stat-card sc-blue">
          <div className="stat-tag">Latest Reading</div>
          <div className="stat-num">{latest}</div>
          <div className="stat-unit">mg/dL</div>
          <div className="stat-badge badge-info">{latest < 100 ? 'NORMAL' : latest < 126 ? 'BORDERLINE' : 'HIGH'}</div>
        </div>
        <div className="stat-card sc-amber">
          <div className="stat-tag">Avg Reading</div>
          <div className="stat-num">{avg}</div>
          <div className="stat-unit">mg/dL · last 7 reads</div>
          <div className="stat-badge badge-warn">ELEVATED</div>
        </div>
        <div className="stat-card sc-red">
          <div className="stat-tag">AI Trend</div>
          <div className="stat-num" style={{ fontSize: '22px', letterSpacing: '-1px' }}>{isRising ? '↑ Rising' : '→ Stable'}</div>
          <div className="stat-unit">last 3 readings</div>
          <div className="stat-badge badge-danger">{isRising ? 'ALERT' : 'STABLE'}</div>
        </div>
      </div>

      <div className="grid2">
        <div className="gcard">
          <div className="card-head">
            <div className="card-label">
              <div className="card-icon ci-red"><TrendingUp size={20} /></div>
              <div>
                <div className="card-title">Glucose Chart</div>
                <div className="card-sub">READINGS IN mg/dL</div>
              </div>
            </div>
          </div>
          
          <div className="glu-bars" style={{ height: '140px', display: 'flex', alignItems: 'flex-end', gap: '10px', marginBottom: '20px' }}>
            {readings.map((r, i) => (
              <div key={i} className="g-wrap" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div 
                  className="g-bar" 
                  style={{ 
                    height: `${(r.value / 200) * 100}%`, 
                    width: '100%', 
                    background: r.value < 100 ? 'var(--accent)' : r.value < 126 ? 'var(--accent3)' : 'var(--accent4)',
                    borderRadius: '6px 6px 0 0',
                    position: 'relative'
                  }}
                >
                  <div style={{ position: 'absolute', top: '-20px', left: '50%', transform: 'translateX(-50%)', fontFamily: 'var(--mono)', fontSize: '10px', fontWeight: '600' }}>
                    {r.value}
                  </div>
                </div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '9px', color: 'var(--text3)', marginTop: '8px' }}>{r.date}</div>
              </div>
            ))}
          </div>

          <form onSubmit={handleLog} style={{ display: 'flex', gap: '8px', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
            <input 
              type="number" 
              className="field" 
              placeholder="Log glucose (mg/dL)" 
              value={val}
              onChange={(e) => setVal(e.target.value)}
              style={{ flex: 1 }}
            />
            <button type="submit" className="btn-primary" style={{ padding: '10px 22px' }}>LOG →</button>
          </form>
          
          {isRising && (
            <div className="alert-strip" style={{ marginTop: '20px', padding: '14px', background: 'rgba(255,77,109,0.06)', border: '1px solid rgba(255,77,109,0.2)', borderRadius: '14px', display: 'flex', gap: '12px' }}>
              <div style={{ fontSize: '18px' }}>⚠️</div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--accent4)' }}>Rising Trend Detected</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,77,109,0.7)' }}>Your glucose level has increased consecutively. Please consult your doctor.</div>
              </div>
            </div>
          )}
        </div>

        <div className="gcard">
          <div className="card-head">
            <div className="card-label">
              <div className="card-icon ci-blue"><Activity size={20} /></div>
              <div>
                <div className="card-title">Reference Ranges</div>
                <div className="card-sub">NORMAL VS DIABETIC</div>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: 'rgba(0,245,160,0.05)', borderRadius: '10px' }}>
              <span style={{ fontSize: '12px' }}>Normal</span>
              <span style={{ fontFamily: 'var(--mono)', fontSize: '12px' }}>&lt; 100 mg/dL</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: 'rgba(245,160,0,0.05)', borderRadius: '10px' }}>
              <span style={{ fontSize: '12px' }}>Pre-Diabetic</span>
              <span style={{ fontFamily: 'var(--mono)', fontSize: '12px' }}>100-125 mg/dL</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: 'rgba(255,77,109,0.05)', borderRadius: '10px' }}>
              <span style={{ fontSize: '12px' }}>Diabetic</span>
              <span style={{ fontFamily: 'var(--mono)', fontSize: '12px' }}>&gt; 126 mg/dL</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
