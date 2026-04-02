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

// Helper for Gemini Multimodal
function fileToGenerativePart(path, mimeType) {
    return {
        inlineData: {
            data: Buffer.from(fs.readFileSync(path)).toString("base64"),
            mimeType,
        },
    };
}

// --- LAB REPORT UPLOAD & EXPLANATION ---
app.post('/api/upload', upload.single('report'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });

        console.log("Analyzing report...");
        
        let extractedData = {
            hemoglobin: null,
            glucose: null,
            cholesterol: null,
            rawText: ""
        };

        if (isGeminiConfigured) {
            try {
                console.log("Using Gemini for extraction...");
                const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
                const prompt = `Extract medical test results (specifically Hemoglobin, Glucose, and Cholesterol). 
                Return ONLY a JSON object with keys 'hemoglobin', 'glucose', and 'cholesterol'. 
                Each value should be an object with:
                - 'value': number (e.g., 14.2)
                - 'unit': string (e.g., 'g/dL')
                - 'meaning': a short explanation of what this specific value means for the user's health (e.g., 'Low hemoglobin may cause fatigue.')
                - 'advice': actionable clinical or lifestyle advice to improve this value (e.g., 'Eat iron-rich foods like spinach and meat.').
                If a test is not found, use null.`;
                
                const imagePart = fileToGenerativePart(req.file.path, req.file.mimetype);
                const result = await model.generateContent([prompt, imagePart]);
                const responseText = result.response.text();
                
                try {
                    const jsonStr = responseText.replace(/```json|```/g, '').trim();
                    const aiData = JSON.parse(jsonStr);
                    extractedData.hemoglobin = aiData.hemoglobin;
                    extractedData.glucose = aiData.glucose;
                    extractedData.cholesterol = aiData.cholesterol;
                } catch (e) {
                    console.error("Gemini Response parsing failed. Response text:", responseText);
                }
            } catch (geminiError) {
                console.error("Gemini Extraction Error (Falling back to Tesseract):", geminiError.message);
                extractedData.error = geminiError.message;
            }
        }

        // Fallback or Supplemental OCR with Tesseract
        if (!extractedData.hemoglobin || !extractedData.glucose || !extractedData.cholesterol) {
            console.log("Running Tesseract OCR fallback...");
            const { data: { text } } = await tesseract.recognize(req.file.path, 'eng');
            extractedData.rawText = text;

            // Improved Regex: Handle potential spaces around dots or units
            if (!extractedData.hemoglobin) {
                const hemoMatch = text.match(/hemoglobin.*?(\d+[\s.]?\d*)/i);
                if (hemoMatch) {
                    const val = parseFloat(hemoMatch[1].replace(/\s/g, ''));
                    if (!isNaN(val)) extractedData.hemoglobin = { value: val, unit: "g/dL" };
                }
            }
            if (!extractedData.glucose) {
                const glucoseMatch = text.match(/glucose.*?(\d+[\s.]?\d*)/i);
                if (glucoseMatch) {
                    const val = parseFloat(glucoseMatch[1].replace(/\s/g, ''));
                    if (!isNaN(val)) extractedData.glucose = { value: val, unit: "mg/dL" };
                }
            }
            if (!extractedData.cholesterol) {
                const cholMatch = text.match(/cholesterol.*?(\d+[\s.]?\d*)/i);
                if (cholMatch) {
                    const val = parseFloat(cholMatch[1].replace(/\s/g, ''));
                    if (!isNaN(val)) extractedData.cholesterol = { value: val, unit: "mg/dL" };
                }
            }
        }

        fs.unlinkSync(req.file.path);

        const results = [];
        let summary = "Lab Report Analysis:\n";

        if (extractedData.hemoglobin) {
            const val = extractedData.hemoglobin.value;
            const isLow = val < 12;
            const isHigh = val > 18;
            const status = isLow ? "Low" : (isHigh ? "High" : "Normal");
            
            const meaning = extractedData.hemoglobin.meaning || (
                isLow ? "Low hemoglobin may cause fatigue, shortness of breath, and pale skin." : 
                (isHigh ? "High hemoglobin is uncommon and may indicate dehydration or bone marrow issues." : 
                "Your hemoglobin levels are in the optimal range for oxygen transport.")
            );
            const advice = extractedData.hemoglobin.advice || (
                isLow ? "Increase iron-rich foods (meat, lentils, spinach) and consult a doctor." : 
                (isHigh ? "Hydrate well and consult a specialist to rule out underlying causes." : 
                "Maintain your current balanced diet and stay active.")
            );
            
            results.push({ 
                test: "Hemoglobin", 
                value: val, 
                unit: extractedData.hemoglobin.unit || "g/dL",
                status, 
                explanation: `Your hemoglobin level is ${status.toLowerCase()}.`,
                meaning,
                advice
            });
        }

        if (extractedData.glucose) {
            const val = extractedData.glucose.value;
            const isLow = val < 70;
            const isHigh = val > 140;
            const status = isLow ? "Low" : (isHigh ? "High" : "Normal");
            
            const meaning = extractedData.glucose.meaning || (
                isLow ? "Low glucose (hypoglycemia) can cause dizziness and confusion." : 
                (isHigh ? "High glucose may indicate pre-diabetes or diabetes risks." : 
                "Your blood sugar levels are healthy and well-regulated.")
            );
            const advice = extractedData.glucose.advice || (
                isLow ? "Consume fast-acting carbs (juice, honey) and consult a doctor." : 
                (isHigh ? "Avoid refined sugars and consider a light walk after meals." : 
                "Continue eating balanced, low-glycemic meals.")
            );

            results.push({ 
                test: "Glucose", 
                value: val, 
                unit: extractedData.glucose.unit || "mg/dL",
                status, 
                explanation: `Your glucose level is ${status.toLowerCase()}.`,
                meaning,
                advice
            });
        }

        if (extractedData.cholesterol) {
            const val = extractedData.cholesterol.value;
            const isHigh = val > 200;
            const status = isHigh ? "High" : "Normal";
            
            const meaning = extractedData.cholesterol.meaning || (
                isHigh ? "High cholesterol increases the risk of heart disease and blood clots." : 
                "Your cholesterol levels support good cardiovascular health."
            );
            const advice = extractedData.cholesterol.advice || (
                isHigh ? "Reduce saturated fats and include more fiber (oats, beans, nuts)." : 
                "Keep up your healthy lifestyle and physical activity."
            );

            results.push({ 
                test: "Cholesterol", 
                value: val, 
                unit: extractedData.cholesterol.unit || "mg/dL",
                status, 
                explanation: `Your cholesterol is ${status.toLowerCase()}.`,
                meaning,
                advice
            });
        }

        if (results.length === 0) {
            summary = "No common medical markers (Hemoglobin, Glucose, Cholesterol) were detected in the report.";
        } else {
            summary = results.map(r => `${r.test}: ${r.explanation}`).join('\n');
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
        const { question, language = 'en' } = req.body;
        const langNames = { 'en': 'English', 'ta': 'Tamil', 'hi': 'Hindi' };
        const targetLangName = langNames[language] || 'English';

        let finalResponse = "";

        if (isGeminiConfigured) {
            try {
                const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
                const prompt = `You are a helpful AI health assistant. Respond strictly in ${targetLangName}. Answer this query in 1-2 short sentences: ${question}`;
                const result = await model.generateContent(prompt);
                finalResponse = result.response.text();
            } catch (geminiError) {
                console.error("Gemini Chat Error (Falling back to mock):", geminiError.message);
                // Fall through to mock logic
            }
        }
        
        if (!finalResponse) {
            // MOCK Fallback / Safe Mode
            const lw = question.toLowerCase();
            if (lw.includes('bp') || lw.includes('blood pressure')) finalResponse = "Blood pressure is the force of your blood against artery walls. Normal is around 120/80.";
            else if (lw.includes('glucose') || lw.includes('sugar')) finalResponse = "High sugar can indicate diabetes. Avoid sugary foods and consult a doctor.";
            else if (lw.includes('hemoglobin') || lw.includes('iron')) finalResponse = "Eat iron-rich foods like spinach, meat, and lentils to improve hemoglobin.";
            else finalResponse = "I am your AI health assistant. Currently, I'm in safe-mode but here to help with general questions.";
        }

        // Apply Final Translation layer if not English
        if (language !== 'en') {
            try {
                finalResponse = await translate(finalResponse, { to: language });
            } catch (transError) {
                console.error("Chat Translation Error:", transError);
                // Keep the English response as absolute last resort
            }
        }
        
        res.json({ response: finalResponse });
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



// --- MOCK DB ---
const mockUsers = [];

// --- MOCK AUTH ROUTES ---
app.post('/api/register', async (req, res) => {
    const { email, password, fullName } = req.body;
    console.log(`Registering user: ${fullName} (${email})`);
    mockUsers.push({ email, password, fullName });
    res.json({ success: true, message: "Account created successfully!" });
});

app.post('/api/login', async (req, res) => {
    const { email, password, fullName } = req.body;
    console.log(`Login attempt: ${email} (Name: ${fullName})`);
    
    // Find user in mock DB or use fallback
    const existingUser = mockUsers.find(u => u.email === email);
    
    if (email && password) {
        res.json({ 
            success: true, 
            token: "mock-jwt-token-xyz", 
            user: { 
                email, 
                name: email.split('@')[0],
                fullName: fullName || (existingUser ? existingUser.fullName : (email.split('@')[0]))
            } 
        });
    } else {
        res.status(401).json({ success: false, message: "Invalid credentials" });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
});
