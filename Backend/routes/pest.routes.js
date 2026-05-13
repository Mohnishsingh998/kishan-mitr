const router = require('express').Router();
const { body } = require('express-validator');
const controller = require('../controllers/pest.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');

// Public routes - read don't need auth

// GET /api/v1/pests?type=pest&crop=soybean&season=kharif
router.get('/', controller.getAll);

// GET /api/v1/pests/outbreaks/nearby?lat=22.71&lng=75.85&radius=50
router.get('/outbreaks/nearby', controller.getNearbyOutbreaks);

// GET /api/v1/pests/:id/treatments
router.get('/:id/treatments', controller.getTreatments);

// Protected routes - need auth

// POST /api/v1/pests/identify
router.post(
  '/identify',
  authenticate,
  [body('symptoms').notEmpty().withMessage('symptoms field is required for identification.')],
  validate,
  controller.identify
);

// POST /api/v1/pests/outbreak
router.post(
  '/outbreak',
  authenticate,
  [
    body('pestId').isUUID().withMessage('Valid pestId (UUID) is required.'),
    body('district').notEmpty().withMessage('district is required.'),
    body('severity')
      .isIn(['low', 'medium', 'high', 'critical'])
      .withMessage("severity must be 'low', 'medium', 'high', or 'critical'."),
  ],
  validate,
  controller.reportOutbreak
);

module.exports = router;
