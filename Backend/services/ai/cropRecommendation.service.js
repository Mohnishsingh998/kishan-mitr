'use strict';

const { CropRecommendation, Land, Farmer } = require('../../models');

class CropRecommendationService {
  constructor() {
    this.huggingFaceKey = process.env.HUGGINGFACE_API_KEY;
    this.huggingFaceEndpoint = process.env.HUGGINGFACE_ENDPOINT || 'https://api-inference.huggingface.co';
  }

  async getRecommendations(farmerId, landId) {
    const land = await Land.findByPk(landId, {
      include: [{ model: Farmer, as: 'farmer' }]
    });

    if (!land) {
      throw new Error('Land not found');
    }

    const soilData = {
      ph: land.soilPH || 7.0,
      nitrogen: land.nitrogen || 'medium',
      phosphorus: land.phosphorus || 'medium',
      potassium: land.potassium || 'medium',
      soilType: land.soilType || 'loamy',
      irrigation: land.irrigationType || 'rainfed',
    };

    const location = land.location || land.farmer?.village;
    const season = this.getCurrentSeason();

    const recommendations = await this.mlRecommend(soilData, season, location);

    return {
      landId,
      soilData,
      season,
      location,
      recommendations,
      timestamp: new Date(),
    };
  }

  getCurrentSeason() {
    const month = new Date().getMonth();
    if (month >= 5 && month <= 9) return 'kharif';
    if (month >= 10 || month <= 2) return 'rabi';
    return 'zaid';
  }

  async mlRecommend(soilData, season, location) {
    const cropDatabase = {
      kharif: [
        { name: 'Rice', suitable: ['loamy', 'clay'], phRange: [5.5, 7.0], water: 'high' },
        { name: 'Cotton', suitable: ['black', 'loamy'], phRange: [6.0, 8.0], water: 'medium' },
        { name: 'Soybean', suitable: ['loamy', 'sandy loam'], phRange: [6.0, 7.5], water: 'medium' },
        { name: 'Maize', suitable: ['loamy', 'sandy loam'], phRange: [5.5, 7.5], water: 'medium' },
        { name: 'Groundnut', suitable: ['sandy loam', 'loamy'], phRange: [5.5, 6.5], water: 'medium' },
      ],
      rabi: [
        { name: 'Wheat', suitable: ['loamy', 'clay loam'], phRange: [6.0, 7.5], water: 'medium' },
        { name: 'Mustard', suitable: ['sandy loam', 'loamy'], phRange: [6.0, 7.5], water: 'low' },
        { name: 'Gram', suitable: ['loamy', 'sandy loam'], phRange: [6.0, 7.5], water: 'low' },
        { name: 'Barley', suitable: ['loamy', 'sandy'], phRange: [6.5, 8.0], water: 'low' },
        { name: 'Lentils', suitable: ['loamy', 'sandy loam'], phRange: [6.0, 7.5], water: 'low' },
      ],
      zaid: [
        { name: 'Watermelon', suitable: ['sandy', 'loamy'], phRange: [6.0, 7.0], water: 'high' },
        { name: 'Muskmelon', suitable: ['sandy', 'loamy'], phRange: [6.0, 7.0], water: 'medium' },
        { name: 'Fodder Maize', suitable: ['loamy', 'alluvial'], phRange: [6.0, 7.5], water: 'medium' },
        { name: 'Vegetables', suitable: ['loamy', 'well-drained'], phRange: [6.0, 7.0], water: 'high' },
      ],
    };

    const seasonCrops = cropDatabase[season] || cropDatabase.kharif;
    const scored = seasonCrops.map(crop => {
      let score = 50;
      
      if (crop.suitable.includes(soilData.soilType.toLowerCase())) score += 20;
      
      const ph = parseFloat(soilData.ph);
      if (ph >= crop.phRange[0] && ph <= crop.phRange[1]) score += 15;
      
      if (soilData.irrigation === 'irrigated' && crop.water === 'high') score += 10;
      if (soilData.irrigation === 'rainfed' && crop.water === 'low') score += 10;

      return { ...crop, score: Math.min(score, 100) };
    });

    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(c => ({
        crop: c.name,
        suitability: c.score >= 70 ? 'Excellent' : c.score >= 50 ? 'Good' : 'Moderate',
        score: c.score,
        reasons: this.getCropReasons(c, soilData),
      }));
  }

  getCropReasons(crop, soilData) {
    const reasons = [];
    if (crop.suitable.includes(soilData.soilType?.toLowerCase())) {
      reasons.push(`Suitable for ${soilData.soilType} soil`);
    }
    if (crop.water === 'low') {
      reasons.push('Drought tolerant - suitable for rainfed farming');
    } else if (crop.water === 'high') {
      reasons.push('Requires good irrigation facilities');
    }
    return reasons;
  }

  async getRecommendationsFromAI(soilData, season) {
    if (!this.huggingFaceKey) {
      return null;
    }

    try {
      const prompt = `Based on soil pH ${soilData.ph}, soil type ${soilData.soilType}, nitrogen ${soilData.nitrogen}, and ${season} season, recommend top 3 crops for Indian farming. Return JSON array with crop name, expected yield per acre, and brief advice.`;

      const response = await fetch(`${this.huggingFaceEndpoint}/models/mistralai/Mistral-7B-Instruct-v0.2`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.huggingFaceKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs: prompt }),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('HuggingFace API error:', error.message);
      return null;
    }
  }
}

module.exports = new CropRecommendationService();
