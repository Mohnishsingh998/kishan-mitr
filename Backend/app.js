require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth.routes');
const farmerRoutes = require('./routes/farmer.routes');
const advisoryRoutes = require('./routes/advisory.routes');
const weatherRoutes = require('./routes/weather.routes');
const marketRoutes = require('./routes/market.routes');
const pestRoutes = require('./routes/pest.routes');
const schemeRoutes = require('./routes/scheme.routes');
const notificationRoutes = require('./routes/notification.routes');
const aiRoutes = require('./routes/ai.routes');

const app = express();

// ─── Security Middlewares ────────────────────────────────────────────────────
app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    credentials: true,
  })
);

// ─── Rate Limiting ───────────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: { message: 'Too many requests. Please try again later.' },
});
app.use('/api', limiter);

// ─── Body Parsing ────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Logging ─────────────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', app: 'KrishiMitra API', version: '1.0.0' });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
const API = '/api/v1';
app.use(`${API}/auth`, authRoutes);
app.use(`${API}/farmers`, farmerRoutes);
app.use(`${API}/advisory`, advisoryRoutes);
app.use(`${API}/weather`, weatherRoutes);
app.use(`${API}/market`, marketRoutes);
app.use(`${API}/pests`, pestRoutes);
app.use(`${API}/schemes`, schemeRoutes);
app.use(`${API}/notifications`, notificationRoutes);
app.use(`${API}/ai`, aiRoutes);

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found.` });
});

// ─── Global Error Handler ────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('❌ Unhandled error:', err);
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || 'Internal server error.',
  });
});

module.exports = app;
