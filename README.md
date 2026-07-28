# GrowthPilot AI — Enterprise E-Commerce CRO & Sales Automation Platform 🚀⚡

> **Production-Quality MVP SaaS Engine for High-Velocity Growth Agencies & E-Commerce Brands**

GrowthPilot AI is a venture-ready, enterprise-grade AI internal tool designed for fast-moving agencies. Users paste any e-commerce brand website URL (e.g. `https://allbirds.com`), and the engine executes an end-to-end AI Growth Audit analyzing copy, visual hierarchy, page speed, and CRO friction points. 

Instead of delivering static feedback, GrowthPilot AI creates actionable, editable multi-channel sales assets (cold emails, LinkedIn messages, proposals, AI landing page rewrites, interactive heatmaps, and downloadable executive PDF reports) linked directly to a built-in CRM pipeline.

---

## ✨ Key Features & Capability Matrix

- **⚡ End-to-End E-Commerce Audit Engine:** Fetches HTML, OpenGraph metadata, JSON-LD schemas, headings, CTAs, testimonials, pricing models, and trust badges.
- **🎨 Modern Enterprise SaaS Design:** Crafted with Linear, Vercel, Stripe, and Raycast aesthetic principles — no flashy gradients, neon colors, glassmorphism, or AI generic tropes.
- **📈 Interactive Revenue Opportunity Calculator:** Real-time sliders for monthly traffic, AOV, and target conversion rate lift with live annual ARR projection calculations.
- **🔥 Simulated Interactive Heatmap Visualizer:** Wireframe view of audited sites with toggleable layers (Click Density, Attention Heatmaps, Scroll Dropoff).
- **⚡ PageSpeed & Core Web Vitals:** Evaluates LCP, INP, CLS, Performance, Accessibility, Best Practices, and SEO ratings.
- **✉️ Multi-Channel Outreach Studio:** Auto-generates editable Cold Emails, LinkedIn InMails, Twitter DMs, Follow-Up sequences, Founder scripts, and Sales Proposal briefs.
- **📄 Downloadable Executive PDF Reports:** Server-side ReportLab engine producing branded multi-page audit reports with metric tables and recommendations.
- **💼 CRM Lead Pipeline:** Track qualified accounts through stages (New, Contacted, Demo Scheduled, Proposal Sent, Closed Won), assign owners, set follow-up dates, and export to CSV (`⌘K` instant search support).
- **✨ AI Landing Page Rewrite Lab (Bonus Suite):** Generates high-converting headline variations (+18% lift predictions), improved CTAs, pricing suggestions, FAQs, hero redesign blueprints, and SEO meta tags.

---

## 🛠️ Tech Stack & Architecture

### **Frontend (Next.js 15 App Router & React 19)**
- **Framework:** Next.js 15 with TypeScript (Strict Typing)
- **Styling:** TailwindCSS with custom Enterprise Design Tokens (`#090D16` Slate Neutral, `#2563EB` Precision Blue, 10px rounded corners)
- **Icons & Animation:** Lucide Icons, Framer Motion (subtle micro-interactions)
- **State & Data Fetching:** TanStack React Query v5

### **Backend (FastAPI & Clean Architecture)**
- **Framework:** FastAPI with Python 3.11+ async handlers
- **Architecture:**
  - `routers/`: Clean endpoint handlers (`audits`, `crm`, `outreach`, `rewrites`, `reports`, `export`, `health`)
  - `services/`: Core logic (`scraper_service`, `vision_service`, `pagespeed_service`, `ai_analyzer_service`, `competitor_service`, `outreach_service`, `pdf_service`)
  - `schemas/`: Fully validated Pydantic v2 structured JSON models
  - `db/`: Persistent store backed by Supabase PostgreSQL schema migration

---

## 🚀 Quickstart & Running Locally

### 1. Backend Service (FastAPI)
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
Open `http://localhost:8000/docs` to view interactive OpenAPI docs.

### 2. Frontend UI (Next.js 15)
```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```
Open `http://localhost:3000` to launch the GrowthPilot AI agency dashboard.

---

## 🚢 Deployment

- **Docker:** Run `docker-compose up --build`
- **Vercel:** Deploy `./frontend` directly to Vercel
- **Railway / Render:** Deploy `./backend` with `uvicorn app.main:app`
