# Fixify - AI-Powered Error Analyzer

A full-stack MERN application that uses Google's Gemini AI to analyze error messages and stack traces, providing plain English explanations, root causes, and exact fixes.

## Features

### Core Features
- **Error Analysis**: Paste any error or stack trace → AI explains what went wrong
- **Plain English Explanation**: Easy-to-understand explanations without jargon
- **Root Cause Analysis**: Understand why the error occurred
- **Exact Code Fixes**: Get working code snippets to fix the error
- **Prevention Tips**: Learn how to avoid similar errors in the future
- **Documentation Links**: Relevant official documentation references

### User Features
- **Google OAuth Authentication**: Secure login with Google
- **Error History**: Save and search analyzed errors
- **Mark as Solved**: Track which errors you've fixed
- **Login Prompt**: Smart popup encouraging users to save their work

### Community Features
- **Share Errors**: Anonymously share errors with the community
- **Community Feed**: Browse errors shared by other users
- **Upvoting**: Upvote helpful solutions
- **Filter by Language**: Find errors for specific languages
- **Similar Errors**: See related errors when analyzing

### Dashboard & Analytics
- **Error Statistics**: Track total errors analyzed
- **Solve Rate**: See percentage of errors you've solved
- **Language Breakdown**: Pie chart showing languages you struggle with most
- **Weekly Activity**: Errors debugged this week

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express.js
- **Database**: MongoDB + Mongoose
- **Authentication**: Passport.js (Google OAuth) + JWT
- **AI**: Google Gemini API (gemini-1.5-flash)
- **UI Libraries**: react-syntax-highlighter, recharts, react-hot-toast

## Project Structure

```
Fixify/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ErrorInput.jsx
│   │   │   ├── ExplanationCard.jsx
│   │   │   ├── CodeFixBlock.jsx
│   │   │   ├── HistoryList.jsx
│   │   │   ├── CommunityFeed.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── LoginPrompt.jsx
│   │   │   └── Footer.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── History.jsx
│   │   │   ├── Community.jsx
│   │   │   └── Stats.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
├── server/
│   ├── config/
│   │   ├── db.js
│   │   ├── passport.js
│   │   └── gemini.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── debugController.js
│   │   ├── historyController.js
│   │   └── communityController.js
│   ├── models/
│   │   ├── User.js
│   │   └── ErrorLog.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── debugRoutes.js
│   │   ├── historyRoutes.js
│   │   └── communityRoutes.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── utils/
│   │   └── promptBuilder.js
│   ├── app.js
│   └── package.json
├── .env.example
└── README.md
```

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/divyar13/Fixify.git
cd Fixify
```

### 2. Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Fill in your credentials:
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Any random string for JWT signing
- `GOOGLE_CLIENT_ID`: From Google Cloud Console
- `GOOGLE_CLIENT_SECRET`: From Google Cloud Console
- `GEMINI_API_KEY`: From Google AI Studio
- `CLIENT_URL`: `http://localhost:5173` (for development)
- `PORT`: `5000`

### 3. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials (Web application)
5. Add authorized redirect URI: `http://localhost:5000/auth/google/callback`
6. Copy Client ID and Secret to `.env`

### 4. Google Gemini API Setup

1. Go to [Google AI Studio](https://aistudio.google.com)
2. Create a new API key
3. Copy to `GEMINI_API_KEY` in `.env`

### 5. Install Dependencies

```bash
# Server
cd server
npm install

# Client
cd ../client
npm install
```

### 6. Run the App

```bash
# Terminal 1 — Backend
cd server
npm run dev

# Terminal 2 — Frontend
cd client
npm run dev
```

- Backend: `http://localhost:5000`
- Frontend: `http://localhost:5173`

## API Endpoints

### Auth
- `GET /auth/google` — Start Google OAuth flow
- `GET /auth/google/callback` — OAuth callback
- `GET /auth/me` — Get current user (requires JWT)

### Debug / Analysis
- `POST /debug/analyze` — Analyze error (saves if logged in)
- `GET /debug/similar` — Get similar community errors

### History (requires auth)
- `GET /history` — Get user's error history
- `GET /history/stats` — Get user statistics
- `GET /history/:id` — Get error details
- `PUT /history/:id` — Update error (notes, tags, solved status)
- `DELETE /history/:id` — Delete error

### Community
- `POST /community/share` — Share error (requires auth)
- `GET /community/feed` — Get community feed
- `POST /community/:id/upvote` — Upvote an error
- `GET /community/languages` — Get all languages in feed

## License

MIT

---

Built with MERN stack + Gemini AI
