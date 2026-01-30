require('dotenv').config();

/**
 * Authentication Middleware
 * 
 * Validates the Authorization header with Bearer token
 * Token must match the AUTH_TOKEN from environment variables
 * 
 * This middleware is applied GLOBALLY to all /employees routes in app.js
 */
const authMiddleware = (req, res, next) => {
  // Extract Authorization header
  const authHeader = req.headers.authorization;

  // Check if Authorization header exists
  if (!authHeader) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Missing Authorization header'
    });
  }

  // Check if header follows Bearer token format
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid Authorization format. Expected: Bearer <token>'
    });
  }

  // Extract token from "Bearer <token>"
  const token = authHeader.substring(7);

  // Validate token against environment variable
  if (token !== process.env.AUTH_TOKEN) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid token'
    });
  }

  // Token is valid, proceed to next middleware/route handler
  next();
};

module.exports = authMiddleware;
