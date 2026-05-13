const router = require('express').Router();
const controller = require('../controllers/notification.controller');
const { authenticate } = require('../middlewares/auth.middleware');

router.use(authenticate);

// GET  /api/v1/notifications
router.get('/', controller.getAll);

// PATCH /api/v1/notifications/read-all
router.patch('/read-all', controller.markAllRead);

// PATCH /api/v1/notifications/:id/read
router.patch('/:id/read', controller.markRead);

// PUT  /api/v1/notifications/preferences
router.put('/preferences', controller.updatePreferences);

module.exports = router;
