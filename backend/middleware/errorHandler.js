const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Server error';

  // ============================================
  // MONGOOSE VALIDATION ERROR
  // ============================================

  if (err.name === 'ValidationError') {
    statusCode = 400;

    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
  }

  // ============================================
  // MONGOOSE DUPLICATE KEY ERROR
  // ============================================

  if (err.code === 11000) {
    statusCode = 400;

    const field = Object.keys(err.keyValue || {})[0];

    if (field) {
      message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    } else {
      message = 'Duplicate value already exists';
    }
  }

  // ============================================
  // MONGOOSE CAST ERROR
  // ============================================

  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  }

  // ============================================
  // JWT ERRORS
  // ============================================

  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  // ============================================
  // SERVER-SIDE LOGGING
  // ============================================

  console.error('\n========================================');
  console.error('           BACKEND ERROR');
  console.error('========================================');

  console.error('Error name:', err.name);
  console.error('Error message:', err.message);
  console.error('Error status:', statusCode);

  if (process.env.NODE_ENV !== 'production') {
    console.error('\nFull error:');
    console.error(err);

    console.error('\nStack trace:');
    console.error(err.stack);
  } else {
    console.error('Production error occurred.');
    console.error('Stack:', err.stack);
  }

  console.error('========================================\n');

  // ============================================
  // RESPONSE
  // ============================================

  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = errorHandler;