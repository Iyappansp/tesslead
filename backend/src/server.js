require('dotenv').config();
const app = require('./app');
const pool = require('./db');

const PORT = process.env.PORT || 5000;

/**
 * Start Server
 * 
 * 1. Test database connection
 * 2. Start Express server
 */
const startServer = async () => {
  try {
    // Test database connection
    await pool.query('SELECT NOW()');
    console.log('✅ Database connection verified');
    
    // Starting the server after all the connections are well satisfied
    app.listen(PORT, () => {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 Health check: http://localhost:${PORT}/`);
      console.log(`📍 API endpoint: http://localhost:${PORT}/employees`);
      console.log(`🔒 Auth token: ${process.env.AUTH_TOKEN}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
