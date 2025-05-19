const express = require('express');
const app = express();
const morgan = require('morgan');
const { readdirSync } = require('fs');
const cors = require('cors');

// CORS configuration
const allowedOrigins = ['https://client-fawn-six-77.vercel.app'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(morgan('dev'));
app.use(express.json({ limit: '20mb' }));

// Load all routes
readdirSync('./routes').map((routeFile) =>
  app.use('/api', require('./routes/' + routeFile))
);

// ✅ Export handler for Vercel
module.exports = app;
