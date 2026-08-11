# ResolveHub — Universal AI Resolution Engine Workspace

![ResolveHub Banner](https://img.shields.io/badge/Status-Production%20Ready-emerald) ![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue) ![React](https://img.shields.io/badge/Framework-React%2018%20%2B%20Vite-61dafb) ![Firebase](https://img.shields.io/badge/Backend-Firebase%20%2F%20Firestore-ffca28) ![TailwindCSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-06b6d4)

**ResolveHub** is an autonomous AI customer dispute resolution platform designed to unify merchant e-commerce, food delivery, and mobility platforms under a single intelligent resolution engine. Built with React 18, TypeScript, Express, Firebase, and Gemini AI.

---

## 🌟 Key Features

* **Universal Platform Aggregation**: Unifies customer disputes from Shopify, Amazon, Flipkart, Swiggy, Zomato, Uber, Myntra, and Meesho in one real-time workspace.
* **Autonomous AI Resolution Engine**: Leverages Gemini AI to investigate issues, inspect order manifests, perform policy eligibility checks, and execute merchant refund/replacement APIs.
* **Safety Bounds & Auto-Refund Thresholds**: Configurable financial guards and automated safety limits. Refunds exceeding thresholds automatically trigger human review.
* **Real-time Audit Trail & Inspection Traces**: Full transparency with chronological step-by-step execution logs, confidence scoring, and API payload inspection.
* **Human-in-the-Loop Escalation**: Automatic escalation to senior support agents whenever AI confidence falls below configurable thresholds (< 85%).
* **Firebase Firestore & Authentication**: Real-time multi-tenant database persistence and user profile synchronization.
* **Obsidian Dark UI Experience**: High-contrast, accessibility-focused interface engineered with Tailwind CSS and responsive design primitives.

---

## 🏗️ Architecture & Project Structure

```text
ResolveHub/
├── src/
│   ├── components/
│   │   ├── common/           # Platform badges, scenario controls, UI badges
│   │   ├── layout/           # Sidebar navigation, header, navigation shell
│   │   ├── orders/           # Unified order cards, list views, modal details
│   │   └── resolution/       # AI trace inspector, investigation timeline
│   ├── context/
│   │   └── AppContext.tsx    # App-wide context, Firebase sync, active issue state
│   ├── data/
│   │   └── mockData.ts       # Baseline mock scenarios, platforms, initial state
│   ├── pages/
│   │   ├── DashboardPage.tsx # Analytics, AI insights, activity feed
│   │   ├── LandingPage.tsx   # Public marketing homepage & workflow pipeline
│   │   ├── LoginPage.tsx     # Firebase Google & Email Authentication
│   │   ├── SettingsPage.tsx  # AI safety limits, thresholds & permissions
│   │   └── ...               # Additional workspace views
│   ├── services/
│   │   ├── firebase.ts       # Firebase app init, Firestore & Auth helpers
│   │   └── shopify/          # Platform API adapter implementations
│   ├── types.ts              # Core TypeScript interfaces, types, enums
│   ├── App.tsx               # Primary route router & navigation handler
│   └── main.tsx              # Application entry point
├── server.ts                 # Full-stack Express backend server
├── firestore.rules           # Security rules for Cloud Firestore
├── .env.example              # Environment variables template
└── package.json              # Dependencies and scripts
```

---

## 🚀 Quick Start Guide

### Prerequisites
* **Node.js**: `v18.0.0` or higher
* **npm**: `v9.0.0` or higher

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-org/resolvehub.git
cd resolvehub
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and populate your credentials:
```bash
cp .env.example .env
```

Ensure your `.env` contains:
```env
GEMINI_API_KEY=your_gemini_api_key
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Run Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:3000`.

---

## 🛠️ Build & Production Deployment

### Build Application
Compile the client bundle and bundle the Express server into `dist/server.cjs`:
```bash
npm run build
```

### Start Production Server
Launch the compiled Node.js backend:
```bash
npm start
```

---

## 🛡️ Security & Privacy

* **Server-Side API Proxying**: API keys (including Gemini API) remain exclusively on the server side and are never exposed to the client browser.
* **Firestore Security Rules**: Strict document access controls enforced in `firestore.rules`.
* **Financial Safety Controls**: Hard limits on auto-executed refund amounts configurable in the Settings page.

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE.md`](./LICENSE.md) for more information.
