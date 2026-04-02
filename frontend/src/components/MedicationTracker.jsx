import { useState, useEffect } from 'react';
import axios from 'axios';
import { Pill, Plus, CheckCircle, XCircle } from 'lucide-react';

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

  return (
    <div className="card">
      <h2 className="card-title">
        <Pill size={24} color="var(--primary)" />
        Medication Tracker
      </h2>

      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h3 style={{ margin: 0, color: 'var(--text-muted)' }}>Adherence Score</h3>
        <div style={{ fontSize: '3rem', fontWeight: '800', color: adherencePct >= 80 ? 'var(--success)' : (adherencePct > 50 ? 'var(--warning)' : 'var(--danger)') }}>
          {adherencePct}%
        </div>
        <p style={{ color: 'var(--text-muted)' }}>You followed {adherencePct}% of your medication schedule this week.</p>
      </div>

      <form onSubmit={handleAdd} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <input 
          type="text" 
          placeholder="Medicine Name" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input-field" 
          style={{ marginBottom: 0 }}
        />
        <input 
          type="time" 
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="input-field"
          style={{ marginBottom: 0, width: '150px' }}
        />
        <button type="submit" className="btn" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} /> Add
        </button>
      </form>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {meds.map((med) => (
          <div key={med._id} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem',
            background: '#f9fafb',
            border: '1px solid var(--border)',
            borderRadius: '8px'
          }}>
            <div>
              <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>{med.name}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{med.time} • {med.date}</div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <button 
                onClick={() => updateStatus(med._id, 'taken')}
                style={{
                  background: med.status === 'taken' ? 'var(--success)' : 'transparent',
                  color: med.status === 'taken' ? 'white' : 'var(--success)',
                  border: `2px solid var(--success)`,
                  padding: '0.5rem',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                <CheckCircle size={20} />
              </button>
              <button 
                onClick={() => updateStatus(med._id, 'missed')}
                style={{
                  background: med.status === 'missed' ? 'var(--danger)' : 'transparent',
                  color: med.status === 'missed' ? 'white' : 'var(--danger)',
                  border: `2px solid var(--danger)`,
                  padding: '0.5rem',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                <XCircle size={20} />
              </button>
            </div>
          </div>
        ))}
        {meds.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No medications added yet.</p>}
      </div>
    </div>
  );
}
