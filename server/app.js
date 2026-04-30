import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

import express from 'express';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import { connectDB } from './config/db.js';
import { configurePassport } from './config/passport.js';
import authRoutes from './routes/authRoutes.js';
import debugRoutes from './routes/debugRoutes.js';
import historyRoutes from './routes/historyRoutes.js';
import communityRoutes from './routes/communityRoutes.js';

configurePassport();

const app = express();

const isProduction = process.env.NODE_ENV === 'production';

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: isProduction, httpOnly: true },
}));

app.use(passport.initialize());
app.use(passport.session());

await connectDB();

app.use('/auth', authRoutes);
app.use('/debug', debugRoutes);
app.use('/history', historyRoutes);
app.use('/community', communityRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`DebugGPT server running on port ${PORT}`);
});
