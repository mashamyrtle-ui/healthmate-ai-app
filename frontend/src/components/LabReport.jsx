import { useState } from 'react';
import axios from 'axios';
import { Upload, Languages, Search, FileText } from 'lucide-react';

export default function LabReport() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [translationMode, setTranslationMode] = useState('en');

  const handleUpload = async (e, selectedFile = null) => {
    e.preventDefault();
    const uploadFile = selectedFile || file;
    if (!uploadFile) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('report', uploadFile);

    try {
      const res = await axios.post('http://localhost:3001/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResults(res.data);
    } catch (error) {
      console.error(error);
      alert('Failed to upload and analyze report.');
    } finally {
      setLoading(false);
    }
  };

  const handleTranslate = async (lang) => {
    if (!results || !results.overallSummary) return;
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:3001/api/translate', {
        text: results.overallSummary,
        targetLang: lang
      });
      setResults({ ...results, translatedSummary: res.data.translatedText });
      setTranslationMode(lang);
    } catch (error) {
      alert('Translation failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="ph">
        <div>
          <h1 className="page-title">Report <span>Analysis</span></h1>
          <p className="page-desc">Upload your medical report. HealthMate AI extracts values and explains them in plain language.</p>
        </div>
      </div>

      <div className="grid2">
        <div className="gcard">
          <div className="card-head">
            <div className="card-label">
              <div className="card-icon ci-green">📄</div>
              <div>
                <div className="card-title">Upload New Report</div>
                <div className="card-sub">IMAGE OR PDF</div>
              </div>
            </div>
          </div>

          {!results && !loading && (
            <div className="upload-zone" onClick={() => document.getElementById('labFileIn').click()}>
              <div className="upload-glyph">🔬</div>
              <div className="upload-title">Drop your medical report here</div>
              <div className="upload-hint">JPG · PNG · PDF · Reads values automatically</div>
              <button className="btn-primary" onClick={(e) => { e.stopPropagation(); document.getElementById('labFileIn').click(); }}>↑ Upload Report</button>
              <input type="file" id="labFileIn" style={{ display: 'none' }} accept="image/*,.pdf" onChange={(e) => {
                const f = e.target.files[0];
                if (f) {
                  setFile(f);
                  handleUpload(e, f);
                }
              }} />
            </div>
          )}

          {loading && (
            <div className="upload-zone">
              <div className="upload-glyph">
                <div className="chip-dot" style={{ width: '20px', height: '20px' }}></div>
              </div>
              <div className="upload-title">AI is analyzing your report...</div>
              <div className="upload-hint">Extracting medical markers with Gemini Vision</div>
            </div>
          )}

          {results && !loading && (
            <div className="results-list">
              {results.tests.length > 0 ? (
                results.tests.map((test, i) => (
                  <div key={i} className="gcard" style={{ marginBottom: '16px', padding: '18px', background: 'rgba(255,255,255,0.02)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                      <div>
                        <div className="result-name" style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text)' }}>{test.test}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text3)', fontFamily: 'var(--mono)', marginTop: '2px' }}>
                          REPORTED VALUE
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div className={`result-val ${test.status === 'Normal' ? 'rv-ok' : 'rv-warn'}`}>
                          {test.value} <span style={{ fontSize: '0.9rem', color: 'var(--text3)' }}>{test.unit}</span>
                        </div>
                        <div className={`stat-badge ${test.status === 'Normal' ? 'badge-ok' : 'badge-warn'}`} style={{ marginTop: '4px' }}>
                          {test.status.toUpperCase()}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                      <div>
                        <div className="ai-tag" style={{ color: 'var(--accent2)', marginBottom: '6px', fontSize: '10px' }}>What this means</div>
                        <div style={{ fontSize: '13px', color: 'rgba(240,246,255,0.7)', lineHeight: '1.6' }}>
                          {test.meaning}
                        </div>
                      </div>
                      <div>
                        <div className="ai-tag" style={{ color: 'var(--accent)', marginBottom: '6px', fontSize: '10px' }}>How to improve</div>
                        <div style={{ fontSize: '13px', color: 'rgba(240,246,255,0.7)', lineHeight: '1.6' }}>
                          {test.advice}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="stat-card sc-red">No medical markers detected.</div>
              )}

              <div className="ai-explain">
                <div className="ai-tag">HealthMate AI Explanation</div>
                <div style={{ fontSize: '13px', lineHeight: '1.7', color: 'var(--text2)', marginBottom: '16px' }}>
                  {translationMode === 'en' ? results.overallSummary : results.translatedSummary}
                </div>
                <div className="lang-strip">
                  <button className={`lang-btn ${translationMode === 'en' ? 'on' : ''}`} onClick={() => setTranslationMode('en')}>🇬🇧 English</button>
                  <button className={`lang-btn ${translationMode === 'ta' ? 'on' : ''}`} onClick={() => handleTranslate('ta')}>🇮🇳 தமிழ்</button>
                  <button className={`lang-btn ${translationMode === 'hi' ? 'on' : ''}`} onClick={() => handleTranslate('hi')}>🇮🇳 हिन्दी</button>
                </div>
              </div>

              <button className="btn-ghost" style={{ width: '100%', marginTop: '16px' }} onClick={() => { setResults(null); setFile(null); }}>Analyze Another Report</button>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="gcard">
            <div className="card-head">
              <div className="card-label">
                <div className="card-icon ci-blue">💡</div>
                <div>
                  <div className="card-title">AI Health Tips</div>
                  <div className="card-sub">BASED ON YOUR REPORT</div>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px 14px', background: 'rgba(0,245,160,0.04)', border: '1px solid rgba(0,245,160,0.1)', borderRadius: '12px' }}>
                <div style={{ fontSize: '18px' }}>🥗</div>
                <div style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: '1.6' }}>Eat more leafy greens like spinach — they boost hemoglobin levels.</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px 14px', background: 'rgba(245,160,0,0.04)', border: '1px solid rgba(245,160,0,0.1)', borderRadius: '12px' }}>
                <div style={{ fontSize: '18px' }}>🚶</div>
                <div style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: '1.6' }}>A 30-minute walk after meals can reduce glucose spikes.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
