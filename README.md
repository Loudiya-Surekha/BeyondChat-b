# BeyondChats Article Management System

A full-stack application for scraping, managing, and AI-enhancing articles from BeyondChats blog.

## 🚀 Features

### Phase 1: Article Scraping
- Scrapes 5 oldest articles from BeyondChats blog
- Extracts title, content, and URL
- Stores in MongoDB database
- Full CRUD API operations

### Phase 2: AI Enhancement
- Searches Google for similar articles
- Scrapes content from top-ranking articles
- Uses OpenAI GPT to rewrite and optimize content
- Improves SEO, readability, and structure
- Adds references to source articles

### Phase 3: Professional Frontend
- Clean, responsive React interface
- Bootstrap 5 styling
- Article listing with filters
- Detailed article view
- Side-by-side comparison (original vs enhanced)
- Admin panel for operations

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (running locally or cloud)
- OpenAI API Key (optional, for AI features)

## 🛠️ Installation

### 1. Clone the Repository
```bash
cd /workspace/BeyondChats-Enhanced
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file
cp .env.example .env

# Edit .env with your credentials:
# MONGO_URI=mongodb://localhost:27017/beyondchats
# OPENAI_KEY=your_openai_api_key_here
# PORT=5000
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

## 🚀 Running the Application

### Start Backend Server
```bash
cd backend
npm start
# Server runs on http://localhost:5000
```

### Start Frontend Development Server
```bash
cd frontend
npm run dev
# Frontend runs on http://localhost:5173
```

## 📡 API Endpoints

### Articles
- `POST /api/articles/scrape` - Scrape articles from BeyondChats
- `POST /api/articles/update-with-ai` - Enhance articles with AI
- `GET /api/articles` - Get all articles
- `GET /api/articles/:id` - Get single article
- `POST /api/articles` - Create new article
- `PUT /api/articles/:id` - Update article
- `DELETE /api/articles/:id` - Delete article

## 🎨 Frontend Pages

1. **Home Page** (`/`)
   - Displays all articles
   - Filter by original/enhanced
   - Statistics dashboard
   - Responsive grid layout

2. **Article Detail** (`/article/:id`)
   - Full article view
   - Toggle between original and enhanced
   - Side-by-side comparison
   - References list

3. **Admin Panel** (`/admin`)
   - Trigger scraping operation
   - Start AI enhancement
   - View operation results
   - Setup instructions

## 🏗️ Project Structure

```
BeyondChats-Enhanced/
├── backend/
│   ├── .env.example
│   ├── package.json
│   ├── server.js
│   └── src/
│       ├── app.js
│       ├── config/
│       │   └── db.js
│       ├── controllers/
│       │   └── articleController.js
│       ├── models/
│       │   └── Article.js
│       ├── routes/
│       │   └── articleRoutes.js
│       ├── services/
│       │   ├── scraper.js
│       │   ├── googleSearch.js
│       │   └── llmService.js
│       ├── scripts/
│       │   └── updateArticles.js
│       └── utils/
│           └── logger.js
└── frontend/
    ├── package.json
    ├── index.html
    └── src/
        ├── App.jsx
        ├── App.css
        ├── main.jsx
        ├── components/
        │   ├── Navbar.jsx
        │   ├── Footer.jsx
        │   ├── ArticleCard.jsx
        │   ├── ComparisonView.jsx
        │   ├── LoadingSpinner.jsx
        │   └── ErrorMessage.jsx
        ├── pages/
        │   ├── Home.jsx
        │   ├── ArticlePage.jsx
        │   └── AdminPanel.jsx
        └── services/
            └── api.js
```

## 🔧 Technologies Used

### Backend
- Node.js & Express.js
- MongoDB & Mongoose
- Puppeteer (web scraping)
- OpenAI API (content enhancement)
- Axios & Cheerio

### Frontend
- React 18
- React Router v6
- Bootstrap 5
- Bootstrap Icons
- Axios
- Vite

## 📝 Usage Guide

### Step 1: Scrape Articles
1. Navigate to Admin Panel
2. Click "Start Scraping"
3. Wait for operation to complete
4. Articles will be saved to database

### Step 2: Enhance with AI
1. Ensure articles are scraped
2. Click "Enhance with AI"
3. System will:
   - Search Google for each article
   - Scrape reference content
   - Generate enhanced version
   - Save with references

### Step 3: View Results
1. Go to Home page
2. Browse articles
3. Click "View Details" to see full content
4. Toggle between original and enhanced
5. Use comparison view for side-by-side

## ⚙️ Configuration

### Environment Variables

**Backend (.env)**
```env
MONGO_URI=mongodb://localhost:27017/beyondchats
OPENAI_KEY=sk-your-openai-api-key
PORT=5000
NODE_ENV=development
```

**Frontend**
- API URL is auto-configured for localhost
- For production, set `VITE_API_URL` in .env

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check connection string in .env
- Verify network access

### Scraping Failures
- Website structure may have changed
- Check network connectivity
- Review error logs

### AI Enhancement Not Working
- Verify OpenAI API key
- Check API quota/limits
- System will use fallback if key missing

## 🎯 Future Enhancements

- [ ] Batch operations
- [ ] Scheduled scraping
- [ ] Multiple website support
- [ ] Advanced filtering & search
- [ ] Export functionality
- [ ] User authentication
- [ ] Analytics dashboard

## 📄 License

MIT License - feel free to use for your projects!

## 👥 Contributing

Contributions welcome! Please open an issue or submit a PR.

## 📧 Support

For issues or questions, please open a GitHub issue.

---

Built with ❤️ using React, Node.js, and AI
