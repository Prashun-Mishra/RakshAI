
# ====================================================================
# PROJECT NAME
# ====================================================================

GuardianAI – AI Emergency Response Platform

# ====================================================================
# PROJECT TYPE
# ====================================================================

Next.js 15 + TypeScript + MongoDB Atlas + Mongoose + Gemini AI

# ====================================================================
# PRIMARY OBJECTIVE
# ====================================================================

Build an AI-powered emergency response platform that helps users during
the first critical minutes of an emergency.

Core Modules
1. AI Emergency Assessment
2. Injury Image Analysis
3. Emergency Services Locator
4. Emergency Medical Report
5. Emergency Timeline & History

AI must be the core functionality, not just a chatbot.

# ====================================================================
# FINAL TECH STACK
# ====================================================================

FRONTEND
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion
- React Hook Form
- Zod
- TanStack Query
- Lucide React

BACKEND
- Next.js Route Handlers
- Server Actions (where suitable)

DATABASE
- MongoDB Atlas
- Mongoose ODM

AUTH
- NextAuth Credentials Provider
- JWT Session
- bcryptjs Password Hashing

AI
- Gemini 2.5 Flash
- Gemini Vision

MAPS
- Google Maps Places API
- Google Geocoding API
- Browser Geolocation API

VOICE
- Web Speech API

REPORTS
- @react-pdf/renderer

DEPLOYMENT
- Vercel

# ====================================================================
# DATABASE COLLECTIONS
# ====================================================================

users
emergency_sessions
emergency_messages
image_analyses
emergency_reports
emergency_contacts

Store image URLs only.
Do not store images inside MongoDB.

# ====================================================================
# PROJECT STRUCTURE
# ====================================================================

guardian-ai/

app/
components/
lib/
lib/db/
lib/models/
lib/actions/
hooks/
types/
public/

# ====================================================================
# MONGOOSE MODELS
# ====================================================================

User
- name
- email (unique)
- password
- phone
- createdAt

EmergencySession
- userId
- title
- severity
- location
- createdAt

EmergencyMessage
- sessionId
- role
- message
- createdAt

ImageAnalysis
- sessionId
- imageUrl
- injuryType
- severity
- confidence
- recommendations

EmergencyContact
- userId
- name
- relationship
- phone

EmergencyReport
- sessionId
- summary
- pdfUrl
- createdAt

# ====================================================================
# AUTHENTICATION
# ====================================================================

Registration
- Name
- Email
- Password

Login
- Email
- Password

Passwords hashed using bcryptjs.

Protect every dashboard route.

# ====================================================================
# AI WORKFLOW
# ====================================================================

User Input
↓
Gemini Assessment
↓
Follow-up Questions
↓
Risk Classification
↓
First Aid
↓
Nearby Services
↓
Emergency Summary
↓
PDF Report

# ====================================================================
# FEATURES
# ====================================================================

- AI Emergency Chat
- Injury Image Analysis
- Voice Input
- Emergency Timeline
- Session History
- Hospital Finder
- Pharmacy Finder
- Police Finder
- Blood Bank Finder
- Emergency Contacts
- PDF Report Download

# ====================================================================
# API ROUTES
# ====================================================================

POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me

POST /api/chat
POST /api/analyze-image
POST /api/report

GET /api/history
GET /api/profile

POST /api/contact
PATCH /api/contact/:id
DELETE /api/contact/:id

GET /api/maps

# ====================================================================
# GEMINI RESPONSE FORMAT
# ====================================================================

Return JSON only.

{
 severity:"",
 confidence:"",
 likelyConditions:[],
 firstAid:[],
 questions:[],
 disclaimer:"",
 summary:""
}

Never claim certainty.
Always recommend emergency services for HIGH or CRITICAL risk.

# ====================================================================
# UI
# ====================================================================

Minimal
Modern
Apple + Linear inspired
Rounded cards
Responsive
Professional

# ====================================================================
# ENVIRONMENT VARIABLES
# ====================================================================

MONGODB_URI

JWT_SECRET

NEXTAUTH_URL

NEXTAUTH_SECRET

GOOGLE_MAPS_API_KEY

GEMINI_API_KEY

# ====================================================================
# IMPLEMENTATION RULES
# ====================================================================

1. Use MongoDB Atlas only.
2. Use Mongoose only.
3. Do NOT use Prisma.
4. Do NOT use Supabase.
5. Do NOT use Firebase.
6. Keep authentication JWT based.
7. Store passwords using bcryptjs.
8. Create reusable models.
9. Use server-side validation.
10. Validate all API inputs.
11. Never expose secrets.
12. Every page must be responsive.
13. Use loading and error states.
14. Deploy on Vercel.
15. Keep UI minimal and professional.

# ====================================================================
# SUCCESS CRITERIA
# ====================================================================

- Register/Login works
- MongoDB Atlas connected
- Mongoose models functional
- AI assessment works
- Image analysis works
- Google Maps integration works
- PDF generation works
- Session history works
- Responsive design
- Public GitHub repository
- Successful Vercel deployment

# ====================================================================
# END OF SPEC
# ====================================================================
