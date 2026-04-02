import { useState, useEffect } from 'react';
import axios from 'axios';
import { Activity, AlertTriangle, Plus } from 'lucide-react';

export default function GlucoseTracker() {
  const [readings, setReadings] = useState([]);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [value, setValue] = useState('');

  const fetchReadings = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/glucose');
      setReadings(res.data.readings || []);
      setAlert(res.data.alert || false);
      setAlertMessage(res.data.alertMessage || '');
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchReadings();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!value || isNaN(value)) return;

    try {
      await axios.post('http://localhost:3001/api/glucose', { value: Number(value) });
      setValue('');
      fetchReadings();
    } catch (error) {
      console.error("Failed to add reading");
    }
  };

  return (
    <div className="card">
      <h2 className="card-title">
        <Activity size={24} color="var(--primary)" />
        Glucose Trend Detection
      </h2>

      {alert && (
        <div className="alert alert-warning" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <AlertTriangle size={24} color="#b45309" />
          <div>{alertMessage}</div>
        </div>
      )}

      <form onSubmit={handleAdd} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <input 
          type="number" 
          placeholder="Enter daily glucose level (mg/dL)" 
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="input-field" 
          style={{ marginBottom: 0, flex: 1 }}
        />
        <button type="submit" className="btn" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} /> Add Reading
        </button>
      </form>

      <div>
        <h3>Recent Readings</h3>
        {readings.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No readings logged yet.</p>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            {readings.map((r, i) => {
              const date = new Date(r.date).toLocaleDateString();
              return (
                <div key={r._id || i} style={{
                  background: '#f9fafb',
                  padding: '1rem 1.5rem',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  minWidth: '120px',
                  textAlign: 'center'
                }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{date}</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{r.value}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
