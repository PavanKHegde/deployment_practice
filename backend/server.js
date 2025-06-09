require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const db = require('./models');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
// app.use(cors({
//   origin: process.env.NODE_ENV === 'production' 
//     ? ['https://your-frontend-domain.com'] 
//     : ['http://localhost:3000'],
//   credentials: true
// }));


app.use(cors({
  origin: [
    'http://localhost:3000', // local dev
    'https://deployment-practice-3-f5yh.onrender.com', // production frontend
  ],
  credentials: true,
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', userRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV 
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Database connection and server start
const startServer = async () => {
  try {
    await db.sequelize.authenticate();
    console.log('Database connected successfully.');
    
    // Sync database (create tables)
    await db.sequelize.sync({ force: false });
    console.log('Database synced successfully.');
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
};

// Root endpoint for deployment testing
app.get('/', (req, res) => {
  res.json({ 
    message: 'Backend API is running!',
    status: 'success',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      users: '/api/users'
    }
  });
});
startServer();