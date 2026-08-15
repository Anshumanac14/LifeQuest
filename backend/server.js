require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// ============================================
// DATABASE
// ============================================

connectDB();


// ============================================
// APP
// ============================================

const app = express();


// ============================================
// TRUST PROXY
// Required when deployed behind a reverse proxy
// such as Render
// ============================================

app.set('trust proxy', 1);


// ============================================
// SECURITY
// ============================================

app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
  })
);


// ============================================
// CORS
// ============================================

const allowedOrigin =
  process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,

    methods: [
      'GET',
      'POST',
      'PUT',
      'DELETE',
      'OPTIONS',
    ],

    allowedHeaders: [
      'Content-Type',
      'Authorization',
    ],
  })
);


// ============================================
// BODY PARSING
// ============================================

app.use(
  express.json({
    limit: '10mb',
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: '10mb',
  })
);

app.use(cookieParser());


// ============================================
// LOGGING
// ============================================

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}


// ============================================
// HEALTH CHECK
// ============================================

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'LifeQuest API is running! 🚀',
    environment:
      process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});


// ============================================
// API ROUTES
// ============================================

app.use(
  '/api/auth',
  require('./routes/authRoutes')
);

app.use(
  '/api/user',
  require('./routes/userRoutes')
);

app.use(
  '/api/habits',
  require('./routes/habitRoutes')
);

app.use(
  '/api/dashboard',
  require('./routes/dashboardRoutes')
);

app.use(
  '/api/achievements',
  require('./routes/achievementRoutes')
);

app.use(
  '/api/analytics',
  require('./routes/analyticsRoutes')
);


// ============================================
// 404 HANDLER
// ============================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});


// ============================================
// GLOBAL ERROR HANDLER
// ============================================

app.use(errorHandler);


// ============================================
// SERVER
// ============================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `🚀 LifeQuest Server running on port ${PORT}`
  );

  console.log(
    `📡 Environment: ${
      process.env.NODE_ENV || 'development'
    }`
  );

  console.log(
    `🌐 Frontend URL: ${
      process.env.FRONTEND_URL ||
      'http://localhost:5173'
    }`
  );
});


module.exports = app;