# SITERANK AI - AI-Powered Website Competitor Analyzer

<p align="center">
  <strong>Transform your website from underperformer to industry leader with AI-powered competitive intelligence</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#smart-analysis-flow">Smart Analysis</a> •
  <a href="#technology-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#api-documentation">API Docs</a>
</p>

---

## 🎯 What is SITERANK AI?

SITERANK AI is an AI-powered website analysis platform that helps you understand and improve your website's SEO, speed, and content compared to competitors. Unlike traditional tools that just show data, SITERANK AI provides **actionable code fixes** you can copy-paste directly into your site.

### Key Value Proposition

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   INPUT: Your website URL                                       │
│                           ↓                                     │
│   PROCESS: AI-powered SEO, Speed, Content analysis              │
│                           ↓                                     │
│   OUTPUT: Copy-paste code fixes + actionable insights           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## ✨ Features

### 🔄 Smart Analysis Flow (NEW)

SITERANK AI offers a **role-based experience** tailored to three user types:

| User Type | What They Get |
|-----------|---------------|
| **Website Owners** | Copy-paste code fixes with CMS instructions |
| **SEO Agencies** | Exportable white-label PDF reports |
| **Competitor Researchers** | Competitive intelligence insights only |

### 📊 Analysis Categories

1. **SEO Analysis** (Score 0-100)
   - Meta tags, title, description
   - Heading structure (H1-H6)
   - Schema.org structured data
   - Canonical URLs & sitemaps
   - Internal/external linking

2. **Speed Analysis** (Score 0-100)
   - Core Web Vitals (LCP, CLS, FID)
   - Resource optimization
   - Caching & compression
   - Render-blocking resources

3. **Content Analysis** (Score 0-100)
   - Word count & readability
   - Keyword usage
   - Content structure
   - E-E-A-T signals

### ⚡ Auto-Fix Engine

- AI-generated code fixes for every issue
- Copy-paste ready HTML, CSS, JSON
- CMS-specific instructions (WordPress, Shopify, etc.)
- Impact scoring (HIGH/MED/LOW)
- One-click copy functionality

### 🤖 AI Chatbot Assistant

- Powered by NVIDIA DeepSeek AI
- Contextual help and guidance
- Answers questions about features
- Available on all pages

### 📱 Fully Responsive Design

- **Mobile (320px+)**: Full-screen chatbot, stacked layouts
- **Tablet (768px+)**: Optimized spacing
- **Desktop (1920px+)**: Full feature display

---

## 🛠 Technology Stack

### Backend
- **Framework**: FastAPI (Python 3.11)
- **Database**: MongoDB
- **AI/LLM**: OpenAI GPT-5.2 (analysis), NVIDIA DeepSeek (chatbot)
- **Authentication**: JWT tokens
- **PDF Generation**: ReportLab

### Frontend
- **Framework**: React 18
- **Styling**: TailwindCSS + Shadcn/UI
- **Animations**: Framer Motion, GSAP
- **Charts**: Recharts

### Infrastructure
- **Deployment**: Kubernetes
- **Process Management**: Supervisor
- **Reverse Proxy**: Nginx

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.11+
- MongoDB

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/siterank-ai.git
cd siterank-ai
```

2. **Backend Setup**
```bash
cd backend
pip install -r requirements.txt
# Configure .env with your API keys
python -m uvicorn server:app --reload --port 8001
```

3. **Frontend Setup**
```bash
cd frontend
yarn install
yarn start
```

4. **Access the App**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8001/api

### Environment Variables

**Backend (.env)**
```
MONGO_URL=mongodb://localhost:27017
DB_NAME=siterank_ai
OPENAI_API_KEY=your_openai_key
NVIDIA_API_KEY=your_nvidia_key
SECRET_KEY=your_jwt_secret
```

**Frontend (.env)**
```
REACT_APP_BACKEND_URL=http://localhost:8001
```

---

## 📚 API Documentation

### Authentication

```bash
# Register
POST /api/auth/register
Body: { "username": "user", "email": "user@example.com", "password": "pass" }

# Login
POST /api/auth/login
Body: { "email": "user@example.com", "password": "pass" }
Returns: { "token": "jwt_token" }
```

### Analysis Endpoints

```bash
# SEO Analysis
POST /api/seo/analyze
Body: { "url": "https://example.com" }
Returns: { "score": 70, "issues": [...], "sub_scores": {...} }

# Speed Analysis
POST /api/speed/analyze
Body: { "url": "https://example.com" }

# Content Analysis
POST /api/content/analyze
Body: { "url": "https://example.com" }
```

### Fix Generation

```bash
# Generate SEO Fixes
POST /api/fix/seo
Body: { "url": "https://example.com", "issues": ["Missing meta description"] }
Returns: { "fixes": [{ "issue": "...", "fixed_code": "...", "instructions": "..." }] }

# Generate Speed Fixes
POST /api/fix/speed

# Generate Content Fixes
POST /api/fix/content
```

### Chatbot

```bash
POST /api/chatbot
Body: { "messages": [{ "role": "user", "content": "How do I use this?" }] }
Returns: { "response": "..." }
```

---

## 🗺 Roadmap

### Completed ✅
- [x] Core analysis engine (SEO, Speed, Content)
- [x] Auto-Fix code generation
- [x] Smart Analysis flow (3 user types)
- [x] AI Chatbot (DeepSeek)
- [x] Responsive design (mobile/tablet/desktop)
- [x] JWT authentication
- [x] Download all fixes as ZIP

### In Progress 🔄
- [ ] WordPress CMS direct integration
- [ ] GitHub PR auto-generation
- [ ] White-label PDF reports

### Planned 📋
- [ ] Multi-client agency dashboard
- [ ] Continuous monitoring
- [ ] Email notifications
- [ ] API access (Enterprise)
- [ ] Chrome extension

---

## 📁 Project Structure

```
/app
├── backend/
│   ├── server.py           # Main FastAPI app
│   ├── auth.py             # JWT authentication
│   ├── analyzer.py         # Main analysis logic
│   ├── seo_analyzer.py     # SEO analysis
│   ├── speed_analyzer.py   # Speed analysis
│   ├── content_analyzer.py # Content analysis
│   ├── auto_fix_engine.py  # AI fix generation
│   ├── llm_engine.py       # OpenAI integration
│   ├── scraper.py          # Web scraping
│   ├── models.py           # Pydantic models
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.js          # Main React app
│   │   ├── components/
│   │   │   ├── ChatBot.js  # AI chatbot
│   │   │   ├── Navbar.js   # Navigation
│   │   │   └── ui/         # Shadcn components
│   │   └── pages/
│   │       ├── SiteRankFeatures.jsx  # Smart Analysis
│   │       ├── LandingPage.js
│   │       ├── DashboardPage.js
│   │       └── ...
│   └── package.json
└── README.md
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Support

- **Documentation**: [docs.siterank.ai](https://docs.siterank.ai)
- **Issues**: [GitHub Issues](https://github.com/yourusername/siterank-ai/issues)
- **Chat**: Use the in-app AI assistant

---

<p align="center">
  <strong>Built with ❤️ for website optimization</strong>
</p>
