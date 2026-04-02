import { useState } from 'react';
import axios from 'axios';
import { Upload, Languages } from 'lucide-react';

export default function LabReport() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [translationMode, setTranslationMode] = useState(''); // 'ta' or 'hi'
  const [translatedText, setTranslatedText] = useState('');
  const [translating, setTranslating] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('report', file);

    try {
      const res = await axios.post('http://localhost:3001/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResults(res.data);
      setTranslationMode('');
      setTranslatedText('');
    } catch (error) {
      console.error(error);
      alert('Failed to upload and analyze report.');
    } finally {
      setLoading(false);
    }
  };

  const handleTranslate = async (lang) => {
    if (!results || !results.overallSummary) return;
    
    setTranslating(true);
    try {
      const res = await axios.post('http://localhost:3001/api/translate', {
        text: results.overallSummary,
        targetLang: lang
      });
      setTranslatedText(res.data.translatedText);
      setTranslationMode(lang);
    } catch (error) {
      alert('Translation failed.');
    } finally {
      setTranslating(false);
    }
  };

  return (
    <div className="card">
      <h2 className="card-title">
        <Upload size={24} color="var(--primary)" />
        Lab Report Upload & AI Explanation
      </h2>
      
      <form onSubmit={handleUpload} style={{ marginBottom: '2rem' }}>
        <input 
          type="file" 
          accept="image/*,.pdf"
          onChange={(e) => setFile(e.target.files[0])}
          className="input-field"
        />
        <button type="submit" disabled={!file || loading} className="btn">
          {loading ? 'Analyzing...' : 'Upload & Analyze'}
        </button>
      </form>

      {results && (
        <div style={{ marginTop: '2rem' }}>
          <h3>Extracted Results</h3>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            {results.tests.map((test, i) => (
              <div key={i} style={{ 
                padding: '1rem', 
                border: `2px solid ${test.status === 'High' || test.status === 'Low' ? 'var(--danger)' : 'var(--success)'}`,
                borderRadius: '8px',
                minWidth: '200px'
              }}>
                <div style={{ fontWeight: 'bold' }}>{test.test}</div>
                <div style={{ fontSize: '1.5rem' }}>{test.value}</div>
                <div style={{ color: test.status === 'Normal' ? 'var(--success)' : 'var(--danger)', fontWeight: 'bold' }}>
                  {test.status}
                </div>
              </div>
            ))}
          </div>

          <h3>AI Explanation</h3>
          <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '8px', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
            {results.overallSummary}
          </div>

          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Languages size={20} />
            <button onClick={() => handleTranslate('ta')} className="btn btn-secondary" disabled={translating}>
               {translating && translationMode === 'ta' ? 'Translating...' : 'Translate to Tamil'}
            </button>
            <button onClick={() => handleTranslate('hi')} className="btn btn-secondary" disabled={translating}>
              {translating && translationMode === 'hi' ? 'Translating...' : 'Translate to Hindi'}
            </button>
          </div>

          {translatedText && (
            <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#eef2ff', borderRadius: '8px', borderLeft: '4px solid var(--primary)', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
              <h4>Translated ({translationMode === 'ta' ? 'Tamil' : 'Hindi'})</h4>
              {translatedText}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
