# SITERANK AI - PRD

## Original Problem Statement
Build an AI Website Competitor Analyzer that transforms from a reporting tool into an optimization engine.

## Latest Enhancement: Smart Analysis Flow - COMPLETED (Feb 2026)
- **The 3 User Types (Fully Implemented):**
  1. **Website Owners** → Generate fix code with COPY-PASTE FIXES + CMS instructions
  2. **SEO Agencies** → Exportable client reports (PDF/TXT) with fix packages
  3. **Competitor Researchers** → Intelligence only mode with competitive insights
- **New Component:** `/app/frontend/src/pages/SiteRankFeatures.jsx`
  - 3-step flow: Role Selection → URL Entry → Analysis Results
  - Beautiful dark theme UI with animations
  - Multi-tab analysis (SEO/Speed/Content)
  - Role-specific features:
    - Owner: "GENERATE AI FIXES" button, copy-paste code blocks with CMS notes
    - Agency: "EXPORT REPORT" button for white-label PDF reports
    - Research: "INTELLIGENCE MODE — VIEW ONLY" badge, competitive insights
  - Score visualization with animated ring and progress bars
  - Issues list with impact scoring
  - Demo data fallback when API unavailable
- **Route:** `/smart-analyze` → `SiteRankFeatures` component
- **Key Principle:** AI generates fix code, user applies it themselves (legitimate & legal)
- **Testing:** 100% pass rate (iteration_5.json) - All 12 features verified

## Previous Enhancement: Auto-Fix Engine (Dec 2025)
- **Shift:** From "Reporting" → "Doing"
- **New Flow:** Analyze → See Issues → Click "Fix" → AI Generates Code → Copy & Paste
- **APIs Added:**
  - `POST /api/fix/seo` - Generate SEO fixes (meta tags, schema, titles)
  - `POST /api/fix/speed` - Generate performance configs (nginx/apache)
  - `POST /api/fix/content` - Generate content improvements (rewrites, FAQs)
  - `POST /api/fix/download-zip` - Download all fixes as ZIP package
- **Frontend Features:**
  - "Fix This" button per issue
  - "Fix All" batch generation
  - Syntax-highlighted code blocks
  - One-click copy functionality
  - "Download All Fixes" page (/features/download)
  - ZIP package with README, seo-fixes.html, speed-fixes.conf, content-fixes.html, summary.json

## Previous Enhancement: Help Bot Assistant (Dec 2025)
- **Component:** `ChatBot.js` - Floating chatbot widget in bottom-right corner
- **Features:**
  - Toggle open/close on button click
  - Quick question buttons for common queries
  - Keyword-based response system (client-side)
  - Covers: optimize, SEO, speed, content, dashboard, pricing, support topics
  - Visible on all pages globally

## Previous Enhancement: Feature Pages Upgraded (Feb 2026)

### SEO Analysis → AI SEO Fix Engine
- **Endpoint:** `POST /api/seo/analyze`
- **Features:**
  - Detect meta tag issues
  - AI-generated title and description fixes
  - Auto schema.org generator
  - Internal linking analysis
  - One-click copy for all fixes
  - Priority scoring (Critical/High/Medium)

### Speed Metrics → AI Performance Optimizer  
- **Endpoint:** `POST /api/speed/analyze`
- **Features:**
  - Load time and page size analysis
  - Core Web Vitals estimation
  - Image optimization recommendations
  - Compression and caching suggestions
  - Resource bundling recommendations
  - Code snippets for fixes

### Content Score → AI Content Enhancement Engine
- **Endpoint:** `POST /api/content/analyze`
- **Features:**
  - Word count and readability analysis
  - Thin content detection
  - Heading structure analysis
  - AI-generated content ideas (3 blog topics)
  - Keyword detection and suggestions
  - FAQ section recommendations

## Complete API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/analyze` | Create full analysis |
| GET | `/api/analyses` | List analyses |
| GET | `/api/analyses/{id}` | Get analysis |
| DELETE | `/api/analyses/{id}` | Delete analysis |
| GET | `/api/analyses/{id}/report` | Download report |
| GET | `/api/dashboard/stats` | Dashboard stats |
| POST | `/api/competitors/detect` | Auto-detect competitors |
| POST | `/api/optimize` | Generate optimization blueprint |
| **POST** | **`/api/seo/analyze`** | **SEO analysis with AI fixes** |
| **POST** | **`/api/speed/analyze`** | **Speed analysis with optimization** |
| **POST** | **`/api/content/analyze`** | **Content analysis with AI ideas** |

## Architecture

### Backend Files
- `/app/backend/server.py` - Main API server
- `/app/backend/optimization_engine.py` - Optimization blueprint generator
- `/app/backend/seo_analyzer.py` - SEO analysis with AI fixes
- `/app/backend/speed_analyzer.py` - Speed analysis engine
- `/app/backend/content_analyzer.py` - Content analysis engine
- `/app/backend/competitor_detector.py` - Auto-detect competitors
- `/app/backend/scraper.py` - Website scraper (improved URL handling)

### Frontend Pages
- `/app/frontend/src/pages/OptimizePage.js` - "Optimize My Site" feature
- `/app/frontend/src/pages/SEOAnalysisPage.js` - AI SEO Fix Engine
- `/app/frontend/src/pages/SpeedMetricsPage.js` - AI Performance Optimizer
- `/app/frontend/src/pages/ContentScorePage.js` - AI Content Enhancement

### Frontend Components
- `/app/frontend/src/components/ChatBot.js` - Floating help bot assistant

## Prioritized Backlog

### P0 (Complete)
- [x] Core analysis MVP
- [x] Auto-detect competitors
- [x] "Optimize My Site" blueprint
- [x] SEO Analysis with AI fixes
- [x] Speed Analysis with optimization tips
- [x] Content Analysis with AI ideas
- [x] Help Bot Assistant (floating chatbot)
- [x] MetaMask error suppression
- [x] Codebase cleanup (removed unused StarBorder.js, PillNav.js)
- [x] **Smart Analysis Flow (3-user-type model) - SiteRankFeatures.jsx**
  - [x] Role selection (Owner/Agency/Research)
  - [x] URL entry with role context
  - [x] Multi-tab analysis results (SEO/Speed/Content)
  - [x] Score ring + sub-score progress bars
  - [x] Issues list with impact scoring
  - [x] Owner: Generate AI Fixes with code blocks
  - [x] Agency: Export Report (PDF/TXT)
  - [x] Research: Competitive Intelligence insights

### P1 (Next)
- [ ] Solutions pages upgrade (multi-client dashboard for agencies)
- [ ] AI Support Agent in Resources
- [ ] Export optimization blueprint to PDF

### P2 (Future)
- [ ] Content calendar generator
- [ ] Keyword gap analyzer
- [ ] Continuous monitoring
- [ ] Email notifications

## Testing Status
- All APIs verified working
- SEO Analysis: Returns score, issues, fixes, schema generator
- Speed Analysis: Returns metrics, issues, image optimization tips
- Content Analysis: Returns metrics, issues, blog ideas, keywords
- Chatbot: 100% frontend tests passed (iteration_4.json)
  - Button visibility on all pages
  - Open/close toggle
  - Quick questions working
  - Message input/send working
  - Bot responses relevant
- **Smart Analysis Flow: 100% frontend tests passed (iteration_5.json)**
  - Role selection (3 cards)
  - URL entry with validation
  - Analysis results with score ring
  - Tab switching (SEO/Speed/Content)
  - Owner mode: Generate AI Fixes
  - Agency mode: Export Report
  - Research mode: Intelligence Only
  - Navigation (Back/NEW buttons)
