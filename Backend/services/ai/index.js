'use strict';

const chatService = require('./chat.service');
const cropRecommendationService = require('./cropRecommendation.service');
const pestDetectionService = require('./pestDetection.service');
const yieldPredictionService = require('./yieldPrediction.service');
const marketForecastService = require('./marketForecast.service');
const weatherAlertService = require('./weatherAlert.service');

module.exports = {
  chatService,
  cropRecommendationService,
  pestDetectionService,
  yieldPredictionService,
  marketForecastService,
  weatherAlertService,
};