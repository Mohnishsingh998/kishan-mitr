const router = require('express').Router();
const controller = require('../controllers/scheme.controller');

// Public routes - read don't need auth

// GET /api/v1/schemes
router.get('/', controller.getAll);

// GET /api/v1/schemes/eligible/:farmerId
router.get('/eligible/:farmerId', controller.getEligible);

// GET /api/v1/schemes/:id
router.get('/:id', controller.getById);

// Protected - need auth
const { authenticate } = require('../middlewares/auth.middleware');
router.post('/:id/apply', authenticate, controller.applyForScheme);

module.exports = router;
