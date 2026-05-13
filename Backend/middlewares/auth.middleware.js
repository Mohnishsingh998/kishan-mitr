const jwt = require('jsonwebtoken');
const { Farmer } = require('../models');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided. Please log in.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    const farmer = await Farmer.findByPk(decoded.id, {
      attributes: { exclude: ['password'] },
    });

    if (!farmer || !farmer.isActive) {
      return res.status(401).json({ message: 'Account not found or deactivated.' });
    }

    req.farmer = farmer;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired. Please refresh.' });
    }
    return res.status(401).json({ message: 'Invalid token.' });
  }
};

module.exports = { authenticate };
