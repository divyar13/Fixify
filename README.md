# DebugGPT - AI-Powered Error Analyzer

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
- **Tagging System**: Tag errors by language, framework, or custom tags
- **Mark as Solved**: Track which errors you've fixed
- **Personal Notes**: Add notes to saved errors

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
- **Code Highlighting**: Syntax highlighting for code snippets

## Project Structure

```
debuggpt/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ErrorInput.jsx
│   │   │   ├── ExplanationCard.jsx
│   │   │   ├── CodeFixBlock.jsx
│   │   │   ├── HistoryList.jsx
│   │   │   ├── CommunityFeed.jsx
│   │   │   └── Dashboard.jsx
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

## Prerequisites

- Node.js (v14+)
- MongoDB (local or Atlas)
- Google OAuth 2.0 credentials
- Google Gemini API key

## Setup Instructions

### 1. Environment Variables

Create a `.env` file in the root directory (copy from `.env.example`):

```bash
cp .env.example .env
```

Fill in your credentials:
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Random string for JWT signing
- `GOOGLE_CLIENT_ID`: From Google Cloud Console
- `GOOGLE_CLIENT_SECRET`: From Google Cloud Console
- `GEMINI_API_KEY`: From Google AI Studio
- `CLIENT_URL`: http://localhost:5173 (for development)
- `PORT`: 5000 (or your preferred port)

### 2. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials (Web application)
5. Add authorized redirect URI: `http://localhost:5000/auth/google/callback`
6. Copy Client ID and Client Secret to `.env`

### 3. Google Gemini API Setup

1. Go to [Google AI Studio](https://aistudio.google.com)
2. Create a new API key
3. Copy to `GEMINI_API_KEY` in `.env`

### 4. MongoDB Setup

Option A: Local MongoDB
```bash
mongod
```

Option B: MongoDB Atlas
1. Create account at [mongodb.com](https://www.mongodb.com)
2. Create a cluster
3. Copy connection string to `MONGODB_URI`

### 5. Install Dependencies

**Server:**
```bash
cd server
npm install
```

**Client:**
```bash
cd client
npm install
```

### 6. Start the Application

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

Backend runs on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

Frontend runs on `http://localhost:5173`

Visit `http://localhost:5173` in your browser.

## API Endpoints

### Auth
- `GET /auth/google` - Start Google OAuth flow
- `GET /auth/google/callback` - OAuth callback
- `GET /auth/me` - Get current user (requires JWT)
- `POST /auth/logout` - Logout

### Debug/Analysis
- `POST /debug/analyze` - Analyze error (optional auth for save)
  - Body: `{ errorText: string, language: string }`
- `GET /debug/similar` - Get similar community errors
  - Query: `language=JavaScript`

### History (requires auth)
- `GET /history` - Get user's error history
  - Query: `search, language, tag, page, limit`
- `GET /history/stats` - Get user statistics
- `GET /history/:id` - Get error details
- `PUT /history/:id` - Update error (notes, tags, solved status)
- `DELETE /history/:id` - Delete error

### Community
- `POST /community/share` - Share error to community (requires auth)
  - Body: `{ errorId: string, isAnonymous: boolean }`
- `POST /community/unshare/:id` - Remove from community (requires auth)
- `GET /community/feed` - Get community feed
  - Query: `language, page, limit, sortBy`
- `POST /community/:id/upvote` - Upvote error
- `GET /community/languages` - Get all languages in community

## Usage

### Analyzing an Error

1. Go to Home page
2. Paste error/stack trace in textarea
3. Select language (optional)
4. Click "Analyze Error"
5. View AI explanation, root cause, and fix

### Saving & Sharing

1. After analysis, click "Save to History" (requires login)
2. View in History page later
3. Optionally share with community
4. Add tags and personal notes

### Community

1. Go to Community page
2. Browse shared errors
3. Filter by language
4. Sort by newest or popular
5. Upvote helpful solutions

### Dashboard

1. Login and go to Stats
2. View total errors analyzed
3. See solve rate
4. Check language breakdown pie chart
5. See this week's activity

## Dark Theme

The app uses a terminal-inspired dark theme:
- **Background**: Deep black (#0f0f0f)
- **Cards**: Dark gray (#1a1a1a)
- **Accent**: Green (#10b981)
- **Text**: White with gray selections

## Error Handling

- **Empty Input**: Validated before API call
- **Gemini API Error**: Retries once, shows friendly message
- **Rate Limiting**: Shows "Try again in a moment"
- **Auth Errors**: Redirects to login for protected routes

## Production Deployment

### Backend (Heroku/Railway)
1. Set environment variables
2. Deploy from GitHub
3. Ensure MongoDB URI is production
4. Update `CLIENT_URL` to production frontend

### Frontend (Vercel/Netlify)
1. Build: `npm run build`
2. Deploy `dist` folder
3. Set `API_BASE_URL` to production backend

## Development Notes

### Adding New Languages to Analyzer

Edit `client/src/components/ErrorInput.jsx` - `LANGUAGES` array

### Customizing AI Prompt

Edit `server/utils/promptBuilder.js` - `buildDebugPrompt` function

### Modifying Dark Theme

Edit `client/tailwind.config.js` - colors in theme extend

### Database

- Uses MongoDB with Mongoose ODM
- Models: User, ErrorLog
- Includes proper indexing for search performance
- Supports pagination

## Troubleshooting

### Gemini API Error
- Check `GEMINI_API_KEY` is valid
- Ensure quota not exceeded
- Try again in a moment

### MongoDB Connection Error
- Verify `MONGODB_URI` is correct
- Check MongoDB is running (local)
- Verify IP whitelist (Atlas)

### OAuth Error
- Verify OAuth redirect URI matches
- Check `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
- Clear browser cookies and try again

### CORS Error
- Check `CLIENT_URL` in backend .env
- Verify CORS middleware in `server/app.js`

## Video Demo

[Add demo video link]

## Future Enhancements

- [ ] Batch error analysis
- [ ] Custom AI model fine-tuning
- [ ] Team workspaces
- [ ] Error trending/predictions
- [ ] Integration with GitHub issues
- [ ] Email notifications
- [ ] Mobile app
- [ ] Slack bot integration
- [ ] IDE extensions (VS Code, JetBrains)

## License

MIT

## Support

For issues or questions:
1. Check troubleshooting section
2. Open GitHub issue
3. Contact support

---

Built with ❤️ using MERN stack + Gemini AI
