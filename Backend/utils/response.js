/**
 * Standard response helpers
 */

const success = (res, data, statusCode = 200) => {
  return res.status(statusCode).json(data);
};

const created = (res, data) => {
  return res.status(201).json(data);
};

const error = (res, message, statusCode = 500) => {
  return res.status(statusCode).json({ message });
};

const notFound = (res, message = 'Resource not found.') => {
  return res.status(404).json({ message });
};

const unauthorized = (res, message = 'Unauthorized.') => {
  return res.status(401).json({ message });
};

module.exports = { success, created, error, notFound, unauthorized };
