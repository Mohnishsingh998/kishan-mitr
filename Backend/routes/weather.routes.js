const router = require('express').Router();
const controller = require('../controllers/weather.controller');

// Public routes - no auth required for weather data

// GET /api/v1/weather/current?lat=22.71&lng=75.85
router.get('/current', controller.getCurrent);

// GET /api/v1/weather/forecast?lat=22.71&lng=75.85&days=7
router.get('/forecast', controller.getForecast);

// GET /api/v1/weather/historical?lat=22.71&lng=75.85&from=2024-01-01&to=2024-03-31
router.get('/historical', controller.getHistorical);

// GET /api/v1/weather/agri-alerts?lat=22.71&lng=75.85
router.get('/agri-alerts', controller.getAgriAlert);

module.exports = router;
