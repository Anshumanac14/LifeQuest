const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Server error';

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    statusCode = 400;

    const field = Object.keys(err.keyValue || {})[0];

    if (field) {
      message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    } else {
      message = 'Duplicate value already exists';
    }
  }

  // Mongoose cast error
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  // ------------------------------------------------
  // DEVELOPMENT ERROR LOGGING
  // ------------------------------------------------

  console.log('\n========================================');
  console.log('           BACKEND ERROR');
  console.log('========================================');

  console.error('Error name:', err.name);
  console.error('Error message:', err.message);
  console.error('Error status:', statusCode);

  console.error('\nFull error:');
  console.error(err);

  console.error('\nStack trace:');
  console.error(err.stack);

  console.log('========================================\n');

  // ------------------------------------------------
  // RESPONSE
  // ------------------------------------------------

  res.status(statusCode).json({
    success: false,
    message,

    // Show stack while debugging
    stack: err.stack,
  });
};

module.exports = errorHandler;