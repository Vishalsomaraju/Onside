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
app.use(cors());

// Body Parsing
app.use(express.json());

// Rate Limiting
app.use(globalRateLimiter);

// API Routes
app.use('/api/route', routeRouter);
app.use('/api/directions', directionsRouter);

// Global Error Handling (Must be last)
app.use(errorHandler);
