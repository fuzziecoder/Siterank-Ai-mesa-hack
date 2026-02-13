# SITERANK AI - PRD

## Original Problem Statement
Build an AI Website Competitor Analyzer where business owners can:
- Upload their website URL and competitor website URLs
- System scrapes and extracts SEO, UI, performance, content info
- AI analyzes differences
- Dashboard shows score comparison, weakness areas, AI suggestions, action plan
- Features: URL input, auto competitor scrape, score comparison chart, AI suggestion text, download PDF report

## Latest Enhancement: Optimization Engine (Feb 2026)
Transform from reporting tool to optimization engine with:
- **"Optimize My Site" button** - One-click comprehensive analysis
- **AI Optimization Blueprint** - Actionable recommendations
- **Critical Fixes** - Top 5 issues with priority scoring
- **Quick Wins** - 5 tasks for 24-hour improvements
- **7-Day Action Plan** - Day-by-day roadmap
- **30-Day Strategy** - Week-by-week growth plan
- **Competitor Insights** - Advantages, gaps, and outrank strategy
- **Predicted Improvements** - Score and traffic estimates

## Architecture

### Backend (FastAPI + MongoDB)
- `/app/backend/server.py` - Main API with all endpoints
- `/app/backend/optimization_engine.py` - **NEW: AI optimization blueprint generator**
- `/app/backend/competitor_detector.py` - Auto-detect competitors with AI
- `/app/backend/scraper.py` - BeautifulSoup web scraper
- `/app/backend/analyzer.py` - Score calculation engine
- `/app/backend/llm_engine.py` - GPT-5.2 AI suggestions
- `/app/backend/auth.py` - JWT authentication

### Frontend (React + Tailwind CSS)
- `/app/frontend/src/pages/OptimizePage.js` - **NEW: Optimization blueprint page**
- Landing, Dashboard, Analyze, Results, History pages
- Feature pages: SEO Analysis, Speed Metrics, Content Score
- Solution pages: For Marketers, For Agencies, For Enterprise
- Resource pages: Blog, Documentation, Support

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/analyze` | Create new analysis |
| GET | `/api/analyses` | List user analyses |
| GET | `/api/analyses/{id}` | Get specific analysis |
| DELETE | `/api/analyses/{id}` | Delete analysis |
| GET | `/api/analyses/{id}/report` | Download report |
| GET | `/api/dashboard/stats` | Get dashboard stats |
| POST | `/api/competitors/detect` | Auto-detect competitors |
| **POST** | **`/api/optimize`** | **Generate optimization blueprint** |
| **GET** | **`/api/optimizations`** | **Get optimization history** |

## What's Been Implemented

### Core Features
- [x] JWT authentication (7-day token)
- [x] Website scraping (SEO, speed, content, UX)
- [x] Score calculation with weighted scoring
- [x] Competitor comparison with charts
- [x] AI suggestions (GPT-5.2)
- [x] Auto-detect competitors
- [x] **Optimize My Site feature with full blueprint**

### Navigation Pages (All Functional)
- [x] Features: SEO Analysis, Speed Metrics, Content Score
- [x] Solutions: For Marketers, For Agencies, For Enterprise
- [x] Resources: Blog, Documentation, Support

### UI/UX
- [x] Dark theme throughout
- [x] SITERANK AI branding with shiny text
- [x] Transparent logo
- [x] Gradient "Optimize My Site" button in navbar
- [x] Expandable blueprint sections

## Prioritized Backlog

### P0 (Done)
- [x] Core analysis MVP
- [x] Auto-detect competitors
- [x] Optimize My Site feature

### P1 (Next)
- [ ] Upgrade Feature pages with AI actions (SEO Fix Engine, Speed Optimizer, Content Enhancer)
- [ ] Add copy-to-clipboard for all AI recommendations
- [ ] PDF report generation for optimization blueprint

### P2 (Future)
- [ ] Enhanced Solutions pages (multi-client dashboard, content calendar)
- [ ] AI Support Agent in Resources
- [ ] Continuous monitoring with alerts
- [ ] Light/Dark mode toggle

## Testing Status
- Backend API: Verified working (optimize endpoint returns full blueprint)
- Frontend: Pages render correctly
- Test report: `/app/test_reports/iteration_3.json`

## Tech Stack
- Backend: FastAPI, MongoDB, BeautifulSoup, emergentintegrations (GPT-5.2)
- Frontend: React, TailwindCSS, Shadcn UI, Recharts, Lucide icons
- Auth: JWT (7-day expiry)
