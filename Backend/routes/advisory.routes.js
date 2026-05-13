const router = require('express').Router();
const { body, query } = require('express-validator');
const controller = require('../controllers/advisory.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');

// Public routes - for demo/testing
router.get('/calendar', controller.getCropCalendar);

// POST /api/v1/advisory/recommend - simplified for demo
router.post(
  '/recommend',
  [
    body('landId').notEmpty().withMessage('landId is required.'),
  ],
  validate,
  controller.getRecommendation
);

// Protected routes
router.get('/sowing-schedule', authenticate, controller.getSowingSchedule);
router.get('/farmer/:id', authenticate, controller.getForFarmer);
router.get('/:id', authenticate, controller.getById);

module.exports = router;
