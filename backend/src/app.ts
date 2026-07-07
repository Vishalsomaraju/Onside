import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { globalRateLimiter } from './middleware/rateLimit';
import { errorHandler } from './middleware/errorHandler';
import { routeRouter } from './api/route';
import { directionsRouter } from './api/directions';

export const app = express();

// Security Headers
app.use(helmet());

// Cross-Origin Resource Sharing
const allowedOrigins = [
  process.env.FRONTEND_ORIGIN,
  'http://localhost:5173'
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      if (origin.endsWith('.vercel.app')) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST'],
    credentials: false
  })
);

// Body Parsing
app.use(express.json());

// Rate Limiting
app.use(globalRateLimiter);

// API Routes
app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/route', routeRouter);
app.use('/api/directions', directionsRouter);

// Global Error Handling (Must be last)
app.use(errorHandler);
