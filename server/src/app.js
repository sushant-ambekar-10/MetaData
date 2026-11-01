import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import mongoose from 'mongoose';
import { corsOptions } from './config/cors.js';
import { isProd, isTest } from './config/env.js';
import { apiLimiter } from './middleware/rateLimit.js';
import { csrfGuard } from './middleware/csrf.js';
import { notFound, errorHandler } from './middleware/error.js';
import routes from './routes/index.js';

const app = express();

app.set('trust proxy', 1); // Render / Vercel sit behind one proxy; needed for correct rate-limit IPs
app.disable('x-powered-by');

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } })); // images from /uploads are used cross-origin
app.use(cors(corsOptions));
app.use(compression());
app.use(express.json({ limit: '100kb' }));
app.use(cookieParser());
if (!isTest) app.use(morgan(isProd ? 'combined' : 'dev'));

// Health check sits before rate limiting so uptime pings never get throttled
app.get('/api/health', (_req, res) => {
  const dbState = mongoose.connection.readyState === 1 ? 'up' : 'down';
  res.status(dbState === 'up' ? 200 : 503).json({
    success: true,
    data: { status: dbState === 'up' ? 'ok' : 'degraded', db: dbState, uptime: Math.round(process.uptime()) },
  });
});

app.use('/api', apiLimiter, csrfGuard, routes);

app.use(notFound);
app.use(errorHandler);

export default app;