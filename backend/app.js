const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

const configuredOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  if (origin === 'http://localhost:5173') return true;
  if (configuredOrigins.includes(origin)) return true;

  if (process.env.ALLOW_VERCEL_PREVIEW === 'true') {
    try {
      const hostname = new URL(origin).hostname;
      if (hostname.endsWith('.vercel.app')) return true;
    } catch (error) {
      return false;
    }
  }

  return false;
};

app.use(
  cors({
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Origin not allowed by CORS'));
    },
    credentials: true
  })
);

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/plans', require('./routes/plans'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/users', require('./routes/users'));
app.use('/api/contact', require('./routes/contact'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'DFC Health & Harmony API is running' });
});

module.exports = app;
