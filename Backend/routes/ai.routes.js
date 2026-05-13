'use strict';

const express = require('express');
const router = express.Router();

const {
  chatService,
  cropRecommendationService,
  pestDetectionService,
  yieldPredictionService,
  marketForecastService,
  weatherAlertService,
} = require('../services/ai');

router.post('/chat', async (req, res, next) => {
  try {
    const { message, context, history } = req.body;
    
    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    const response = await chatService.chat(message, context || {}, history || []);
    
    res.json({ response });
  } catch (error) {
    next(error);
  }
});

router.post('/crop-recommend', async (req, res, next) => {
  try {
    const { farmerId, landId, soil_type, season, state } = req.body;
    
    let recommendations;
    if (landId) {
      recommendations = await cropRecommendationService.getRecommendations(farmerId, landId);
    } else if (soil_type) {
      const resolvedSeason = season || cropRecommendationService.getCurrentSeason();
      const soilData = { soilType: soil_type, ph: 7.0, nitrogen: 'medium', phosphorus: 'medium', potassium: 'medium', irrigation: 'rainfed' };
      const crops = await cropRecommendationService.mlRecommend(soilData, resolvedSeason, state);
      recommendations = { soilData, season: resolvedSeason, location: state || 'Madhya Pradesh', recommendations: crops, timestamp: new Date() };
    } else {
      return res.status(400).json({ message: 'Provide landId or soil_type for recommendations.' });
    }
    
    res.json(recommendations);
  } catch (error) {
    next(error);
  }
});

router.post('/pest-detect', async (req, res, next) => {
  try {
    const { image, imageUrl, symptoms, cropName } = req.body;
    
    if (!image && !imageUrl && !symptoms) {
      return res.status(400).json({ message: 'Image (base64), imageUrl, or symptoms is required' });
    }

    const imageData = image || imageUrl;
    const result = await pestDetectionService.detectFromImage(imageData, symptoms || '', cropName || '');
    
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/pest-database', async (req, res, next) => {
  try {
    const { Pest } = require('../models');
    const pests = await Pest.findAll({ limit: 20 });
    const database = pestDetectionService.getPestDatabase();
    
    res.json({ database, pests });
  } catch (error) {
    next(error);
  }
});

router.post('/yield-predict', async (req, res, next) => {
  try {
    const { crop, area, area_acres, region, state, weather } = req.body;
    const resolvedArea = area || area_acres;
    const resolvedRegion = region || state;
    
    if (!crop || !resolvedArea || !resolvedRegion) {
      return res.status(400).json({ message: 'crop, area (or area_acres), and region (or state) are required' });
    }

    const prediction = await yieldPredictionService.predictYield(crop, resolvedArea, resolvedRegion, weather || {});
    
    res.json(prediction);
  } catch (error) {
    next(error);
  }
});

router.get('/yield-forecast/:crop', async (req, res, next) => {
  try {
    const { crop } = req.params;
    const { mandi, days = 30 } = req.query;
    
    const forecast = await yieldPredictionService.getYieldForecast(crop, mandi || 'default', parseInt(days));
    
    res.json(forecast);
  } catch (error) {
    next(error);
  }
});

router.get('/market-forecast/:crop', async (req, res, next) => {
  try {
    const { crop } = req.params;
    const { mandi, days = 30 } = req.query;
    
    const forecast = await marketForecastService.forecastPrices(crop, mandi || 'default', parseInt(days));
    
    res.json(forecast);
  } catch (error) {
    next(error);
  }
});

router.get('/market-compare/:crop', async (req, res, next) => {
  try {
    const { crop } = req.params;
    const { state = 'maharashtra' } = req.query;
    
    const comparison = await marketForecastService.compareMandis(crop, state);
    
    res.json({ crop, state, mandis: comparison });
  } catch (error) {
    next(error);
  }
});

router.get('/weather-alerts', async (req, res, next) => {
  try {
    const { location } = req.query;
    
    if (!location) {
      return res.status(400).json({ message: 'location query parameter is required' });
    }

    const alerts = await weatherAlertService.getWeatherAlerts(location);
    
    res.json(alerts);
  } catch (error) {
    next(error);
  }
});

router.get('/weather-history', async (req, res, next) => {
  try {
    const { location, days = 30 } = req.query;
    
    if (!location) {
      return res.status(400).json({ message: 'location query parameter is required' });
    }

    const history = await weatherAlertService.getHistoricalWeather(location, parseInt(days));
    
    res.json({ location, history });
  } catch (error) {
    next(error);
  }
});

module.exports = router;