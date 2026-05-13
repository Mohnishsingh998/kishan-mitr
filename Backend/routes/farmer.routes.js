const router = require('express').Router();
const controller = require('../controllers/farmer.controller');
const { authenticate } = require('../middlewares/auth.middleware');

// All farmer routes are protected
router.use(authenticate);

// GET  /api/v1/farmers
router.get('/', controller.getAll);

// GET  /api/v1/farmers/:id
router.get('/:id', controller.getById);

// POST /api/v1/farmers
router.post('/', controller.create);

// PUT  /api/v1/farmers/:id
router.put('/:id', controller.update);

// DELETE /api/v1/farmers/:id
router.delete('/:id', controller.remove);

// GET  /api/v1/farmers/:id/lands
router.get('/:id/lands', controller.getLands);

// POST /api/v1/farmers/:id/lands
router.post('/:id/lands', controller.createLand);

// PUT /api/v1/farmers/:id/lands/:landId/soil
router.put('/:id/lands/:landId/soil', controller.updateLandSoil);

module.exports = router;
