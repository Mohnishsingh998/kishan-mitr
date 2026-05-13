const router = require('express').Router();
const { body } = require('express-validator');
const controller = require('../controllers/auth.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');

// POST /api/v1/auth/register
router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required.'),
    body('phone').matches(/^[6-9]\d{9}$/).withMessage('Valid 10-digit Indian mobile number required.'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),
    body('district').trim().notEmpty().withMessage('District is required.'),
  ],
  validate,
  controller.register
);

// POST /api/v1/auth/login
router.post(
  '/login',
  [
    body('phone').notEmpty().withMessage('Phone is required.'),
    body('password').notEmpty().withMessage('Password is required.'),
  ],
  validate,
  controller.login
);

// POST /api/v1/auth/refresh
router.post(
  '/refresh',
  [body('refresh_token').notEmpty().withMessage('refresh_token is required.')],
  validate,
  controller.refreshToken
);

// GET /api/v1/auth/profile  (protected)
router.get('/profile', authenticate, controller.getProfile);

// PUT /api/v1/auth/profile  (protected)
router.put('/profile', authenticate, controller.updateProfile);

module.exports = router;
