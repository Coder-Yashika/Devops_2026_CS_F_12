// Because we import 'express-async-errors' in server.js, any error thrown
// inside an async route handler automatically lands here - no need to wrap
// every controller in try/catch. This is the ONE place that decides what
// error shape goes back to the client.
export function errorHandler(err, req, res, next) {
  console.error(err);

  // Mongoose validation errors -> 400 with field-level messages
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ message: 'Validation failed', errors });
  }

  // Duplicate key (e.g. email or enrollment number already exists)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({ message: `${field} already in use` });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || 'Something went wrong on our end',
  });
}

export function notFound(req, res) {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
}
