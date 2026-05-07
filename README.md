# 🛡️ HealthGuard AI

HealthGuard AI is an intelligent health monitoring and analysis platform that leverages AI agents to provide clinical-grade insights from lab reports, symptoms, and environmental data. It combines medical reasoning with real-world context (weather, pollution) to help users understand their health better.

## 🚀 Key Features

*   **AI-Powered Lab Analysis**: Upload lab results (images/PDFs) for automated extraction and interpretation.
*   **Multi-Agent Reasoning**: Uses a sophisticated agent architecture:
    *   **IntakeAgent**: Extracts clinical variables and identifies missing data.
    *   **ContextAgent**: Integrates location-based weather and air quality data.
    *   **InsightAgent**: Provides plain-language explanations of complex medical data.
    *   **NoteAgent**: Generates clinical summaries (SBAR format) for healthcare providers.
    *   **SafetyAgent**: Screens for red flags and provides emergency warnings.
*   **Health Dashboard**: Visualizes risk factors, severity trends, and clinical insights.
*   **Clinical Report Generation**: Generates professional PDF health reports using `pdfkit`.
*   **Environmental Awareness**: Factors in local AQI and weather conditions into health recommendations.
*   **Secure Authentication**: JWT-based user authentication and encrypted profile storage.

## 🛠️ Tech Stack

### Frontend
*   **Framework**: React 18+ (Vite)
*   **Styling**: Tailwind CSS, Framer Motion
*   **State Management**: React Context/Hooks
*   **Routing**: React Router
*   **Charts**: Recharts
*   **Icons**: Lucide React

### Backend
*   **Runtime**: Node.js (Express)
*   **Database**: MongoDB (Mongoose)
*   **AI Engine**: Groq SDK / Gemini API
*   **File Processing**: Multer, Tesseract.js (OCR), pdf-parse
*   **Reporting**: pdfkit
*   **Security**: Bcryptjs, JWT

---

## ⚙️ Setup & Installation

### Prerequisites
*   Node.js (v18+)
*   MongoDB (Local or Atlas)
*   Groq or Gemini API Key
*   OpenWeather API Key (for environmental context)

### Backend Setup
1.  Navigate to the `backend/` directory.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file based on `.env.example`:
    ```env
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/healthguard
    JWT_SECRET=your_jwt_secret
    GROQ_API_KEY=your_groq_api_key
    WEATHER_API_KEY=your_weather_api_key
    ```
4.  Start the server:
    ```bash
    npm start
    ```

### Frontend Setup
1.  Navigate to the `frontend/` directory.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```

---

## 📂 Project Structure

*   **[backend/](backend/)**: Express server with AI agent logic and PDF generation.
    *   `agents/`: Specialized AI agents for triage, context, and safety.
    *   `controllers/`: Request handling for analysis and user management.
    *   `utils/`: OCR, AI client, and medical reference ranges.
*   **[frontend/](frontend/)**: Vite + React SPA.
    *   `src/components/Dashboard`: Visualization and analysis components.
    *   `src/pages`: Auth, Upload, Reports, and Dashboard views.
    *   `src/api`: Axios instance for backend communication.

---

## 🛡️ Safety Warning
HealthGuard AI is an educational tool and **is not a substitute for professional medical advice, diagnosis, or treatment**. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
