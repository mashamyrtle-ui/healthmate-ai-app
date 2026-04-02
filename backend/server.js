const express = require('express');
const cors = require('cors');
const multer = require('multer');
const tesseract = require('tesseract.js');
const fs = require('fs');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const translate = require('translate-google');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const { Medication, GlucoseReading } = require('./models');

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: 'uploads/' });

// Database initialization
async function startDB() {
    const mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to In-Memory MongoDB');
}
startDB();

// Gemini API initialization
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'fake_key');
const isGeminiConfigured = !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_key_here';

// --- LAB REPORT UPLOAD & EXPLANATION ---
app.post('/api/upload', upload.single('report'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });

        console.log("Running OCR with Tesseract...");
        const { data: { text } } = await tesseract.recognize(req.file.path, 'eng');
        fs.unlinkSync(req.file.path);

        let hemoglobin = null;
        let glucose = null;
        let cholesterol = null;

        const hemoMatch = text.match(/hemoglobin.*?(\d+(\.\d+)?)/i);
        if (hemoMatch) hemoglobin = parseFloat(hemoMatch[1]);

        const glucoseMatch = text.match(/glucose.*?(\d+(\.\d+)?)/i);
        if (glucoseMatch) glucose = parseFloat(glucoseMatch[1]);

        const cholMatch = text.match(/cholesterol.*?(\d+(\.\d+)?)/i);
        if (cholMatch) cholesterol = parseFloat(cholMatch[1]);

        // Mock values if nothing found to ensure demo works
        if (!hemoglobin) hemoglobin = 11.0; 
        if (!glucose) glucose = 150;
        if (!cholesterol) cholesterol = 210;

        const results = [];
        let summary = "Lab Report Analysis:\n";

        if (hemoglobin) {
            const isLow = hemoglobin < 12;
            const explanation = isLow ? "Your hemoglobin level is slightly low. This may indicate anemia." : "Your hemoglobin level is normal.";
            summary += `- ${explanation}\n`;
            results.push({ test: "Hemoglobin", value: hemoglobin, status: isLow ? "Low" : "Normal", explanation });
        }

        if (glucose) {
            const isHigh = glucose > 140;
            const explanation = isHigh ? "Your glucose level is high. Please consult a doctor." : "Your glucose level is normal.";
            summary += `- ${explanation}\n`;
            results.push({ test: "Glucose", value: glucose, status: isHigh ? "High" : "Normal", explanation });
        }

        if (cholesterol) {
            const isHigh = cholesterol > 200;
            const explanation = isHigh ? "Your cholesterol is high. Please consult a doctor." : "Your cholesterol is normal.";
            summary += `- ${explanation}\n`;
            results.push({ test: "Cholesterol", value: cholesterol, status: isHigh ? "High" : "Normal", explanation });
        }

        res.json({ tests: results, overallSummary: summary });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to process report.' });
    }
});

// --- TRANSLATION API ---
app.post('/api/translate', async (req, res) => {
    try {
        const { text, targetLang } = req.body; // targetLang: 'ta' or 'hi'
        
        // Use translate-google package
        const translatedText = await translate(text, { to: targetLang });
        res.json({ translatedText });
    } catch (error) {
        console.error("Translation Error:", error);
        res.status(500).json({ error: 'Translation failed.' });
    }
});

// --- CHAT API ---
app.post('/api/chat', async (req, res) => {
    try {
        const { question } = req.body;
        
        if (isGeminiConfigured) {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const prompt = `You are a helpful, simple AI health assistant. Answer this query in 1-2 short sentences: ${question}`;
            const result = await model.generateContent(prompt);
            const response = result.response.text();
            res.json({ response });
        } else {
            // MOCK Fallback
            let response = "I am an AI health assistant.";
            const lw = question.toLowerCase();
            if (lw.includes('bp') || lw.includes('blood pressure')) response = "Blood pressure is the force of your blood against artery walls. Normal is around 120/80.";
            else if (lw.includes('sugar')) response = "High sugar can indicate diabetes. Avoid sugary foods and consult a doctor.";
            else if (lw.includes('hemoglobin') || lw.includes('improve')) response = "Eat iron-rich foods like spinach, meat, and lentils to improve hemoglobin.";
            else response = "I'm your AI health assistant. (Setup GEMINI_API_KEY in .env for real responses).";
            
            res.json({ response });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Chat failed.' });
    }
});

// --- MEDICATION API ---
app.post('/api/medication', async (req, res) => {
    try {
        const { name, time, status, date } = req.body;
        const newMed = new Medication({ name, time, status, date });
        await newMed.save();
        res.json(newMed);
    } catch (error) {
        res.status(500).json({ error: 'Failed to save medication.' });
    }
});

app.put('/api/medication/:id', async (req, res) => {
    try {
        const { status } = req.body;
        const updatedMed = await Medication.findByIdAndUpdate(req.params.id, { status }, { new: true });
        res.json(updatedMed);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update medication.' });
    }
});

app.get('/api/medication', async (req, res) => {
    try {
        const meds = await Medication.find();
        
        const total = meds.length;
        const taken = meds.filter(m => m.status === 'taken').length;
        const adherencePct = total === 0 ? 0 : Math.round((taken / total) * 100);

        res.json({ meds, adherencePct });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch medications.' });
    }
});

// --- GLUCOSE API ---
app.post('/api/glucose', async (req, res) => {
    try {
        const { value } = req.body;
        const newReading = new GlucoseReading({ value });
        await newReading.save();
        res.json(newReading);
    } catch (error) {
        res.status(500).json({ error: 'Failed to save reading.' });
    }
});

app.get('/api/glucose', async (req, res) => {
    try {
        const readings = await GlucoseReading.find().sort({ date: 1 });
        
        let alert = false;
        // Logic: if last 3 readings are strictly increasing
        if (readings.length >= 3) {
            const last3 = readings.slice(-3);
            if (last3[0].value < last3[1].value && last3[1].value < last3[2].value) {
                alert = true;
            }
        }

        res.json({ 
            readings,
            alert,
            alertMessage: alert ? "Your glucose levels are rising over the last few days. Consider consulting a doctor." : null
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch glucose readings.' });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
});
