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
  try {
    const parsed = new URL(origin);
    if (parsed.hostname === 'localhost') return true;
    if (parsed.hostname === '127.0.0.1') return true;
  } catch (error) {
    return false;
  }
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
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/users', require('./routes/users'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/wishlist', require('./routes/wishlist'));
app.use('/api/admin', require('./routes/admin'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'DFC Health & Harmony API is running' });
});

module.exports = app;
