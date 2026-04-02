const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: 'c:/Users/DELL/healthmate-ai-app/backend/.env' });

async function test() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    try {
        console.log("Testing model 'gemini-1.5-flash'...");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Hi");
        console.log("Result:", result.response.text());
    } catch (e) {
        console.error("Failed with 'gemini-1.5-flash':", e.status, e.message);
        
        try {
            console.log("Testing model 'models/gemini-1.5-flash'...");
            const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });
            const result = await model.generateContent("Hi");
            console.log("Result:", result.response.text());
        } catch (e2) {
            console.error("Failed with 'models/gemini-1.5-flash':", e2.status, e2.message);
            
            try {
                console.log("Testing model 'gemini-pro'...");
                const model = genAI.getGenerativeModel({ model: "gemini-pro" });
                const result = await model.generateContent("Hi");
                console.log("Result:", result.response.text());
            } catch (e3) {
                console.error("Failed with 'gemini-pro':", e3.status, e3.message);
            }
        }
    }
}

test();
