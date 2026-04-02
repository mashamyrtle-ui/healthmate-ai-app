# AI Health-Tech Web Application

A full-stack, AI-powered health dashboard providing Lab Report analysis, AI Chat assistant, Medication Adherence tracking, and Glucose Trend Detection.

## Features Let's Write

1. **Lab Report Upload & AI Explanation**: Upload your report, parse it with OCR, and let AI tell you if your levels are abnormal.
2. **Translation**: Translate the analysis to regional languages (Tamil, Hindi).
3. **AI Chat Assistant**: Ask health queries using Google Gemini AI.
4. **Medication Tracker**: Track your daily pills and see adherence %.
5. **Glucose Trend Analysis**: Enter glucose values and get smart alerts if it's rising continuously.

## Tech Stack
- **Frontend**: React + Vite + Axios
- **Backend**: Node.js + Express
- **Database**: Mongoose powered by an In-Memory MongoDB (Zero-setup!).
- **AI**: Google Generative AI (Gemini Flash).

## How to Run

1. Open `backend/.env` and insert your Gemini API Key. (If no key is present, it uses mock responses).
2. Start Backend:
   ```bash
   cd backend
   npm install
   npm start
   ```
3. Start Frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Folder Structure
- `backend/` - The Express API.
- `frontend/` - The Vite React App.
