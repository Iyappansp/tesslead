const express = require('express');
const cors = require('cors');
const { errorHandler } = require('./utils/errorHandler');
const authMiddleware = require('./middlewares/auth.middleware');
const employeeRoutes = require('./routes/employee.routes');

const app = express();

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Health check route (not protected)
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Employee Dashboard API is running',
    version: '1.0.0'
  });
});

/**
 * CRITICAL: Global Authentication Middleware Protection
 * 
 * All /employees routes are protected by authMiddleware
 * This is applied at the application level, NOT in individual route handlers
 * 
 * Any request to /employees/* must include:
 * Authorization: Bearer <token>
 */
app.use('/employees', authMiddleware, employeeRoutes);

// 404 handler for unknown routes
app.use('*', (req, res) => {
  res.status(404).json({
    error: true,
    message: 'Route not found'
  });
});

// Global error handler (must be last)
app.use(errorHandler);

module.exports = app;
