# Troopod Agency Engine — Autonomous E-Commerce CRO & Sales Platform 🧠⚡

> **Production-Quality Agentic SaaS Engine for Fast-Moving Agencies & E-Commerce Growth Teams**

The **Troopod Agency Engine** is an enterprise-grade AI internal platform built to empower fast-moving growth agencies and e-commerce teams. Inspired by the core principles of **Troopod**—autonomous multi-step execution, structured JSON synthesis, and multi-agent workflow automation—this application takes a single high-level input (any e-commerce store URL like `https://allbirds.com` or `https://gymshark.com`) and autonomously executes an end-to-end growth sprint.

Instead of delivering static feedback or generic AI summaries, Troopod Agency Engine turns website data into pitch-ready sales assets: cold email sequences, LinkedIn InMails, Twitter DMs, founder intros, executive proposal briefs, interactive heatmaps, AI landing page rewrites, and downloadable executive PDF reports linked directly to an integrated CRM lead pipeline.

---

## 🤖 Alignment with Troopod Architecture & Vision

Troopod Agency Engine directly models Troopod's autonomous agentic workflow principles:

1. **Autonomous Multi-Step Execution Pipeline:** Just as Troopod accepts complex goals and breaks them down into chained autonomous steps, this engine takes a URL and executes a multi-stage pipeline:
   - **Step 1:** HTML & metadata extraction
   - **Step 2:** Visual hierarchy & contrast analysis
   - **Step 3:** PageSpeed & Core Web Vitals calculation
   - **Step 4:** CRO friction point & revenue leakage diagnosis
   - **Step 5:** Competitor benchmarking
   - **Step 6:** Multi-channel sales asset synthesis & PDF report generation
2. **Agentic Sales Asset Synthesis:** Operates like a specialized workforce of CRO strategists, copywriters, performance engineers, and sales reps working concurrently to produce multi-channel deliverables.
3. **Structured JSON Validation:** Every AI analysis output uses strict Pydantic v2 schemas with automated retry logic to guarantee 100% predictable JSON structures.

---

## 🛠️ Detailed Technical Implementation

### **Backend Architecture (FastAPI & Clean Architecture)**
- **Framework:** FastAPI with Python 3.11+ async handlers and Pydantic v2 validation.
- **Clean Folder Structure:**
  - `routers/`: Endpoint handlers (`audits.py`, `crm.py`, `outreach.py`, `rewrites.py`, `reports.py`, `export.py`, `health.py`)
  - `services/`: Core logic (`scraper_service.py`, `vision_service.py`, `pagespeed_service.py`, `ai_analyzer_service.py`, `competitor_service.py`, `outreach_service.py`, `pdf_service.py`, `crm_service.py`)
  - `schemas/`: Pydantic structured output models (`AuditSchema`, `PageSpeedMetric`, `VisionAnalysis`, `FrictionPoint`, `RevenueOpportunity`, `CompetitorBenchmark`, `OutreachCampaign`, `LandingPageRewrite`)
  - `db/`: Persistent store backed by Supabase PostgreSQL schema migration
- **Asynchronous Scraping Pipeline:** `httpx` + `BeautifulSoup4` extracts headlines, primary & secondary CTAs, testimonials, product lists, pricing structures, navigation links, JSON-LD schema markup, OpenGraph tags, and trust badges.
- **Visual UX & Layout Analysis:** Evaluates visual hierarchy, whitespace density, button contrast ratios, readability, and accessibility.
- **PageSpeed & Web Vitals Engine:** Audits LCP, INP, CLS, Performance, Accessibility, Best Practices, and SEO ratings.
- **Executive PDF Synthesis Engine:** Server-side ReportLab document builder rendering multi-page executive audit reports with metric tables and recommendations.

### **Frontend Architecture (Next.js 15 App Router & React 19)**
- **Enterprise Design System:** Built to match **Linear, Vercel, Stripe, and Raycast** aesthetic standards — high-contrast dark theme (`#090D16`), precision blue (`#2563EB`) accent, `10px` rounded corners, 1px subtle borders, Inter font, and zero flashy gradients or neon blobs.
- **Interactive Revenue Opportunity Calculator:** Real-time sliders for monthly traffic, AOV, and target conversion rate lift with live annual ARR projection calculations.
- **Simulated Interactive Heatmap Visualizer:** Wireframe view of audited sites with toggleable layers (Click Density, Attention Heatmaps, Scroll Dropoff).
- **Multi-Channel Sales Outreach Studio:** Auto-generates editable Cold Emails, LinkedIn InMails, Twitter DMs, Follow-Up sequences, Founder scripts, and Sales Proposals.
- **CRM Lead Pipeline & CSV Export:** Track qualified accounts through stages (`New`, `Contacted`, `Demo Scheduled`, `Proposal Sent`, `Closed Won`), assign owners, set follow-up dates, and export to CSV (`⌘K` instant search support).
- **AI Landing Page Rewrite Lab:** Generates high-converting headline variations (+18% lift predictions), improved CTAs, pricing suggestions, FAQs, hero redesign blueprints, and SEO meta tags.

---

## 🚀 Quickstart & Local Setup

### 1. Backend Service (FastAPI)
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
Access OpenAPI interactive docs at `http://localhost:8000/docs`.

### 2. Frontend UI (Next.js 15)
```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```
Open `http://localhost:3000` to launch the agency dashboard.

---

## 🚢 Deployment Ready

- **Docker:** `docker-compose up --build`
- **Vercel:** Deploy `./frontend` to Vercel
- **Railway / Render:** Deploy `./backend` with `uvicorn app.main:app`
- **Database:** Execute `supabase/schema.sql` on Supabase PostgreSQL
