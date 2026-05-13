'use strict';

const axios = require('axios');

class YieldPredictionService {
  constructor() {
    this.groqKey = process.env.GROQ_API_KEY;
    this.model = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
    this.baseUrl = process.env.GROQ_BASE_URL || 'https://api.groq.com/openai/v1';
  }

  async predictYield(crop, area, region, weatherData = {}) {
    const prompt = this.buildPrompt(crop, area, region, weatherData);
    let result;

    if (this.groqKey) {
      result = await this.callGroq(prompt);
    } else {
      result = this.getFallback(crop, area, region, weatherData);
    }

    return result;
  }

  buildPrompt(crop, area, region, weather) {
    const weatherDesc = Object.entries(weather)
      .map(([k, v]) => `${k}: ${v}`)
      .join(', ') || 'typical seasonal conditions';

    const yieldRanges = {
      rice: { min: 22, max: 40, avg: 27 },
      wheat: { min: 25, max: 40, avg: 32 },
      cotton: { min: 3, max: 8, avg: 4.5 },
      soybean: { min: 8, max: 18, avg: 11 },
      maize: { min: 25, max: 55, avg: 42 },
      groundnut: { min: 10, max: 20, avg: 14 },
      mustard: { min: 8, max: 16, avg: 11 },
      gram: { min: 8, max: 18, avg: 14 },
      potato: { min: 150, max: 300, avg: 230 },
      onion: { min: 120, max: 220, avg: 160 },
    };
    const range = yieldRanges[crop.toLowerCase()] || { min: 8, max: 50, avg: 20 };

    return `You are an agricultural yield prediction expert for India. Given a farmer's crop, land area, region, and weather conditions, predict the expected yield.

REALISTIC yield ranges per hectare (quintals) for ${crop}:
- Range: ${range.min} to ${range.max} quintals/hectare
- Typical: ${range.avg} quintals/hectare
- Your value MUST be between ${range.min} and ${range.max}

Return ONLY valid JSON. No markdown, no backticks, no explanation:
{
  "crop": "${crop}",
  "area": { "value": ${parseFloat(area) || 1}, "unit": "hectares" },
  "region": "${region}",
  "predictedYield": {
    "value": <CHOOSE a number between ${range.min} and ${range.max} based on weather>,
    "unit": "quintals/hectare",
    "historical": <TYPICAL average for ${crop} in ${region}>
  },
  "totalExpectedProduction": {
    "value": <predictedYield.value * area>,
    "unit": "quintals"
  },
  "confidence": <number 60-99>,
  "factors": [
    { "factor": "<e.g. Weather, Soil, Irrigation>", "impact": "Positive|Negative|Normal", "weight": <1-100> }
  ],
  "recommendations": ["<specific advice for this crop in this region>", "<more recommendations>"]
}

Crop: ${crop}, Area: ${area}ha, Region: ${region}, Weather: ${weatherDesc}
Make the yield vary based on weather — worse weather = lower end of range.`;
  }

  async callGroq(prompt) {
    const response = await axios.post(
      `${this.baseUrl}/chat/completions`,
      {
        model: this.model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 800,
      },
      {
        headers: {
          'Authorization': `Bearer ${this.groqKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 15000,
      }
    );

    const content = response.data.choices[0]?.message?.content || '';
    const cleaned = content.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('Failed to parse Groq response as JSON');
  }

  getFallback(crop, area, region, weatherData) {
    const yieldDatabase = {
      rice: 27, wheat: 32, cotton: 4.5, soybean: 11,
      maize: 42, groundnut: 14, mustard: 11, gram: 14,
      potato: 230, onion: 160,
    };
    const historical = yieldDatabase[crop.toLowerCase()] || 20;
    const weatherScore = weatherData?.temperature > 35 ? 0.9 : 1.0;
    const predicted = Math.round(historical * weatherScore * 100) / 100;
    const total = Math.round(predicted * parseFloat(area || 1) * 100) / 100;

    return {
      crop,
      area: { value: parseFloat(area || 1), unit: 'hectares' },
      region,
      predictedYield: { value: predicted, unit: 'quintals/hectare', historical },
      totalExpectedProduction: { value: total, unit: 'quintals' },
      confidence: 75,
      factors: [
        { factor: 'Weather Conditions', impact: weatherScore < 1 ? 'Negative' : 'Normal', weight: 40 },
        { factor: 'Soil Health', impact: 'Normal', weight: 30 },
        { factor: 'Crop Variety', impact: 'Normal', weight: 20 },
        { factor: 'Management Practices', impact: 'Normal', weight: 10 },
      ],
      recommendations: [
        'Monitor weather forecasts closely',
        'Apply crop insurance for risk mitigation',
        'Practice integrated nutrient management (INM)',
        'Use drip irrigation for water efficiency',
      ],
      timestamp: new Date(),
    };
  }

  async getYieldForecast(crop, mandi, days = 30) {
    if (this.groqKey) {
      return this.getForecastFromLLM(crop, mandi, days);
    }
    return this.getFallbackForecast(crop, mandi, days);
  }

  async getForecastFromLLM(crop, mandi, days) {
    const prompt = `Return ONLY valid JSON for a ${days}-day yield forecast for ${crop} at ${mandi} mandi in India:
{
  "crop": "${crop}",
  "mandi": "${mandi}",
  "forecastDays": ${days},
  "currentPrice": <number>,
  "predictions": [
    { "date": "YYYY-MM-DD", "predictedPrice": <number>, "trend": "up|down|stable", "confidence": <number> }
  ],
  "generatedAt": "${new Date().toISOString()}"
}`;

    const response = await axios.post(
      `${this.baseUrl}/chat/completions`,
      {
        model: this.model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 800,
      },
      {
        headers: {
          'Authorization': `Bearer ${this.groqKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 15000,
      }
    );

    const content = response.data.choices[0]?.message?.content || '';
    const cleaned = content.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    return this.getFallbackForecast(crop, mandi, days);
  }

  getFallbackForecast(crop, mandi, days) {
    const prices = { paddy: 2100, wheat: 2800, mustard: 5200, gram: 6000, cotton: 6200, soybean: 4800, maize: 1900, potato: 1200, onion: 1500 };
    const basePrice = prices[crop.toLowerCase()] || 2000;
    const predictions = [];
    const today = new Date();
    for (let i = 1; i <= days; i += 7) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      const variance = (Math.random() - 0.5) * 0.15;
      predictions.push({
        date: date.toISOString().split('T')[0],
        predictedPrice: Math.round(basePrice * (1 + variance)),
        trend: variance > 0 ? 'up' : variance < 0 ? 'down' : 'stable',
        confidence: Math.round(70 + Math.random() * 20),
      });
    }
    return { crop, mandi, forecastDays: days, currentPrice: basePrice, predictions, generatedAt: new Date() };
  }
}

module.exports = new YieldPredictionService();
