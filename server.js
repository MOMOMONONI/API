// Step 1: Import modules
const express = require('express');
const app = express();
const morgan = require('morgan');
const { readdirSync } = require('fs');
const cors = require('cors');

// Step 2: CORS configuration
const allowedOrigins = ['https://client-fawn-six-77.vercel.app'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true // เปิดไว้ถ้ามี auth header หรือ cookie
}));

// Step 3: Middleware
app.use(morgan('dev'));
app.use(express.json({ limit: '20mb' }));

// Step 4: Load all routes in the routes folder
readdirSync('./routes').map((routeFile) =>
  app.use('/api', require('./routes/' + routeFile))
);

// Step 5: Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
