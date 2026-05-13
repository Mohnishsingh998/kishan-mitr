const router = require('express').Router();
const controller = require('../controllers/market.controller');

// Public routes - no auth required for market data

// GET /api/v1/market/prices?state=Madhya Pradesh&district=Indore&crop=soybean
router.get('/prices', controller.getPrices);

// GET /api/v1/market/prices/history?crop=soybean&mandi=<uuid>&days=180
router.get('/prices/history', controller.getPriceHistory);

// GET /api/v1/market/prices/forecast/:cropId
router.get('/prices/forecast/:cropId', controller.getPriceForecast);

// GET /api/v1/market/mandis?state=Madhya Pradesh
router.get('/mandis', controller.getMandis);

module.exports = router;
