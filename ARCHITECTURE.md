# EduGuardian AI - System Architecture

EduGuardian AI is a full-stack predictive analytics platform designed to monitor student academic risk and provide AI-driven interventions.

## 🏗️ Core Architecture

The application follows a **Full-Stack Single Page Application (SPA)** architecture.

### 1. Frontend (Client-Side)
- **Framework**: React 18+ with TypeScript.
- **Build Tool**: Vite.
- **Styling**: Tailwind CSS (Utility-first styling).
- **Animations**: Framer Motion (`motion/react`) for fluid UI transitions.
- **Data Visualization**: Recharts for performance trends and risk distribution.
- **Icons**: Lucide React.
- **Real-time**: Socket.io-client for live risk score updates.

### 2. Backend (Server-Side)
- **Runtime**: Node.js.
- **Framework**: Express.js.
- **Language**: TypeScript (via `tsx`).
- **Real-time Engine**: Socket.io for bidirectional communication.
- **AI Integration**: Google Gemini API (`@google/genai`) for:
  - Predictive risk analysis commentary.
  - Personalized intervention plan generation.
  - Interactive AI academic companion (Chatbot).

### 3. Database (Persistence)
- **Engine**: SQLite (`better-sqlite3`).
- **Schema**:
  - `students`: Core user data (GPA, Attendance, Role).
  - `academic_records`: Subject-wise marks and assignment delays.
  - `behavior_logs`: LMS engagement metrics (logins, study hours).
  - `emotional_surveys`: Stress levels and student feedback.
  - `peer_interactions`: Social engagement data.
  - `risk_scores`: Calculated risk metrics and AI-generated reasons.
  - `interventions`: History of AI-generated support plans.

## 🔄 Data Flow & Risk Engine

1.  **Data Ingestion**: Activity is logged via API endpoints (e.g., `simulate-activity`).
2.  **Risk Calculation**:
    - The `calculateRisk` engine processes raw data from 4 dimensions:
      - **Academic** (40%): Based on GPA and assignment delays.
      - **Behavioral** (25%): Based on LMS logins and study hours.
      - **Emotional** (20%): Based on self-reported stress levels.
      - **Social** (15%): Based on peer interaction frequency.
3.  **Real-time Updates**: Once calculated, scores are persisted in SQLite and broadcasted to connected clients via WebSockets.
4.  **AI Intervention**: When requested, the Gemini model analyzes the `DashboardData` and generates a structured Markdown intervention plan.

## 🛠️ Deployment & Environment
- **Port**: 3000 (Standardized for the platform).
- **Environment Variables**:
  - `GEMINI_API_KEY`: Required for AI features.
  - `NODE_ENV`: Production/Development toggle.
