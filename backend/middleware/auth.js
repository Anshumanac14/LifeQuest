const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    let token = null;

    // Check Authorization header first
    const authHeader = req.headers.authorization;

    if (
      authHeader &&
      authHeader.startsWith('Bearer ')
    ) {
      const parts = authHeader.split(' ');

      // Make sure we actually have a token
      if (parts.length === 2 && parts[1]) {
        token = parts[1];
      }
    }

    // Fallback to cookie
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    // No token
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Please log in.',
      });
    }

    // Verify JWT
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Make sure the token contains a user ID
    if (!decoded?.id) {
      return res.status(401).json({
        success: false,
        message: 'Invalid authentication token.',
      });
    }

    // Find authenticated user
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found. Please log in again.',
      });
    }

    // Attach authenticated user to request
    req.user = user;

    next();
  } catch (error) {
    // Invalid, expired, malformed, or otherwise unusable JWT
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token. Please log in again.',
    });
  }
};

module.exports = {
  protect,
};