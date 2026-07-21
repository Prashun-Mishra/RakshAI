# 🛡️ RakshAI (GuardianAI) – AI-Powered Emergency Response Platform

![Next.js 15](https://img.shields.io/badge/Next.js-15.1-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=for-the-badge&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=for-the-badge&logo=mongodb)
![Gemini AI](https://img.shields.io/badge/Gemini-2.5_Flash-8E75FF?style=for-the-badge&logo=google-gemini)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38BDF8?style=for-the-badge&logo=tailwind-css)

**RakshAI (GuardianAI)** is an intelligent, real-time emergency triage and first-aid response platform designed to assist users during the critical first minutes of a medical emergency. Powered by Google Gemini 2.5/2.0 Flash, RakshAI assesses urgent situations, analyzes visible injury photos, locates nearby emergency services, and generates downloadable PDF clinical summary reports.

---

## 🌟 Key Features

- **🚨 AI Emergency Chat & Triage:** Real-time, step-by-step first-aid guidance with risk level classification (`LOW`, `MODERATE`, `HIGH`, `CRITICAL`) and structured disclaimer management.
- **📸 Visual Injury Analysis:** Upload or submit an injury image URL to get visual assessments powered by Gemini 2.5 Flash Vision for immediate first-aid recommendations.
- **🗣️ Hands-Free Voice Input:** Web Speech API integration allows panicked users to speak their emergency details aloud without typing.
- **📍 Nearby Emergency Services Finder:** Integrated with Google Places API to quickly locate nearby Hospitals, Pharmacies, Police Stations, and Blood Banks based on live GPS location or typed location.
- **📄 Downloadable PDF Reports:** Auto-generates formal clinical PDF emergency session reports via `@react-pdf/renderer` for medical responders or family members.
- **⏱️ Private Emergency Session Timeline:** Secure history of past emergencies, stored securely in MongoDB Atlas with NextAuth JWT authentication.

---

## 🏗️ Technical Architecture

```
User Input (Voice / Text / Image)
            │
            ▼
┌─────────────────────────┐
│ Next.js 15 App Router   │
│   (Server Actions/APIs) │
└────────────┬────────────┘
             │
   ┌─────────┴─────────┐
   ▼                   ▼
┌──────────────┐    ┌─────────────────────┐
│  Gemini AI   │    │ Google Places API   │
│ (2.5 Flash / │    │ (Emergency Locator) │
│  2.0 Vision) │    └─────────────────────┘
└──────┬───────┘
       │
       ▼
┌─────────────────────────┐
│ MongoDB Atlas / Mongoose│
│ (Session & History Data)│
└─────────────────────────┘
```

---

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router, Server Actions)
- **Language:** TypeScript
- **Styling:** Tailwind CSS, Framer Motion, Lucide Icons
- **Database:** MongoDB Atlas + Mongoose ODM
- **Authentication:** NextAuth.js (Credentials Provider, JWT Session, bcryptjs)
- **AI Core:** Google Gemini 2.5 Flash & Gemini 2.0 Flash Vision
- **Location Services:** Google Places API & Geocoding API
- **PDF Generation:** `@react-pdf/renderer`

---

## 🚀 Quick Start & Local Setup

### 1. Prerequisites
- Node.js 18.x or 20.x
- npm / pnpm / yarn
- MongoDB Atlas cluster URI
- Google Gemini API key
- Google Maps Places API key

### 2. Clone the Repository
```bash
git clone https://github.com/Prashun-Mishra/RakshAI.git
cd RakshAI
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Create a `.env.local` file in the root directory:

```env
# Database
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/rakshai?retryWrites=true&w=majority

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_super_secret_jwt_key_here
JWT_SECRET=your_super_secret_jwt_key_here

# AI & APIs
GEMINI_API_KEY=AIzaSy...
GOOGLE_MAPS_API_KEY=AIzaSy...
```

### 5. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ Database Models Schema

- `User`: Handles account registration and password hashing via `bcryptjs`.
- `EmergencySession`: Stores session metadata, severity status (`LOW`, `MODERATE`, `HIGH`, `CRITICAL`), and user location.
- `EmergencyMessage`: Stores timeline of user prompts and AI first-aid responses.
- `ImageAnalysis`: Stores injury visual evaluation output and safe URL references.
- `EmergencyContact`: Stores designated emergency contact numbers for instant notification.
- `EmergencyReport`: Tracks generated PDF reports for session histories.

---

## ☁️ Deployment on Vercel

1. Push your repository to GitHub.
2. Import the repository into **Vercel**.
3. Set the Framework Preset to **Next.js**.
4. Add all environment variables (`MONGODB_URI`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `GEMINI_API_KEY`, `GOOGLE_MAPS_API_KEY`) under Project Settings -> Environment Variables.
5. Click **Deploy**.

---

## ⚠️ Disclaimer

RakshAI is an AI-assisted first-aid triage guidance system. It is **not** a replacement for professional emergency services or qualified clinical diagnoses. For life-threatening emergencies, always dial your local emergency phone number immediately.
