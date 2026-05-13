'use strict';

const axios = require('axios');

class MarketForecastService {
  constructor() {
    this.groqKey = process.env.GROQ_API_KEY;
    this.model = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
    this.baseUrl = process.env.GROQ_BASE_URL || 'https://api.groq.com/openai/v1';

    this.priceDatabase = {
      paddy: { min: 2000, max: 2300 },
      wheat: { min: 2650, max: 3000 },
      mustard: { min: 5000, max: 5500 },
      gram: { min: 5500, max: 6200 },
      cotton: { min: 6000, max: 6600 },
      soybean: { min: 4500, max: 5000 },
      maize: { min: 1800, max: 2100 },
      groundnut: { min: 5000, max: 5500 },
      potato: { min: 1000, max: 1500 },
      onion: { min: 1200, max: 2000 },
      tomato: { min: 1500, max: 2500 },
    };
  }

  async forecastPrices(crop, mandi, days = 30) {
    if (this.groqKey) {
      return this.forecastFromLLM(crop, mandi, days);
    }
    return this.getFallbackForecast(crop, mandi, days);
  }

  async forecastFromLLM(crop, mandi, days) {
    const range = this.priceDatabase[crop.toLowerCase()] || { min: 2000, max: 2500 };

    const weekCount = Math.ceil(days / 7);
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];

    const prompt = `You are a market price forecasting expert for Indian agricultural commodities.
Predict mandi prices for ${crop} at ${mandi} over the next ${days} days starting from ${dateStr}.

Current price range for ${crop}: ₹${range.min} to ₹${range.max} per quintal.

Return ONLY valid JSON (no markdown, no backticks, no explanation):
{
  "crop": "${crop}",
  "mandi": "${mandi}",
  "forecastPeriod": "${days} days",
  "historicalSummary": {
    "average": <realistic avg ₹/quintal within ${range.min}-${range.max}>,
    "min": <min price ₹/quintal>,
    "max": <max price ₹/quintal>,
    "totalVolume": <1500-5000>,
    "trend": "increasing" or "decreasing" or "stable"
  },
  "forecast": [
    {
      "date": "YYYY-MM-DD",
      "predictedPrice": <₹/quintal>,
      "trend": "up" or "down" or "stable",
      "confidence": <60-95>,
      "factors": ["<reason>"]
    }
  ],
  "advice": ["<actionable advice>", "<more advice>"]
}

CRITICAL:
- TODAY'S DATE IS ${dateStr}. All forecast dates must be AFTER ${dateStr}.
- Generate EXACTLY ${weekCount} entries, one per week, 7 days apart
- Entry 1 date: ${dateStr} + 7 days
- Prices within ₹${range.min}-${range.max}
- Confidence starts ~92%, drops by ~1 each entry
- Factors must mention real events relevant to ${crop} in India (harvest, MSP, demand, exports, weather)
- Advice specific to ${crop} farmers`;

    const response = await axios.post(
      `${this.baseUrl}/chat/completions`,
      {
        model: this.model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 1500,
      },
      {
        headers: {
          'Authorization': `Bearer ${this.groqKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 20000,
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

  async compareMandis(crop, state) {
    const mandis = this.getMandisInState(state);
    const basePrice = this.getBasePrice(crop);
    return mandis.map(m => ({
      mandi: m.name,
      price: Math.round(basePrice * (0.9 + Math.random() * 0.2)),
      distance: m.distance,
    })).sort((a, b) => b.price - a.price);
  }

  getBasePrice(crop) {
    const data = this.priceDatabase[crop.toLowerCase()];
    return data ? Math.round((data.min + data.max) / 2) : 2200;
  }

  getMandisInState(state) {
    const db = {
      'Madhya Pradesh': [
        { name: 'Indore', distance: 0 },
        { name: 'Bhopal', distance: 190 },
        { name: 'Ujjain', distance: 55 },
        { name: 'Dewas', distance: 40 },
        { name: 'Sehore', distance: 40 },
        { name: 'Manasa', distance: 150 },
      ],
      maharashtra: [
        { name: 'Vashi', distance: 0 },
        { name: 'Pune', distance: 150 },
        { name: 'Nagpur', distance: 500 },
      ],
      haryana: [
        { name: 'Azadpur', distance: 0 },
        { name: 'Karnal', distance: 130 },
      ],
      gujarat: [
        { name: 'Ahmedabad', distance: 0 },
        { name: 'Rajkot', distance: 300 },
      ],
      punjab: [
        { name: 'Azadpur', distance: 0 },
        { name: 'Moga', distance: 170 },
      ],
    };
    return db[state] || db['Madhya Pradesh'];
  }

  getFallbackForecast(crop, mandi, days) {
    const basePrice = this.getBasePrice(crop);
    const today = new Date();
    const historical = [];
    for (let i = 30; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      historical.push({ date: d.toISOString().split('T')[0], price: Math.round(basePrice * (1 + (Math.random() - 0.5) * 0.2)) });
    }
    const avg = Math.round(historical.reduce((a, b) => a + b.price, 0) / historical.length);
    const prices = historical.map(h => h.price);

    const forecast = [];
    for (let i = 1; i <= days; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      const p = Math.round(basePrice * (1 + (Math.random() - 0.5) * 0.15));
      forecast.push({ date: d.toISOString().split('T')[0], predictedPrice: p, trend: p > avg ? 'up' : 'down', confidence: Math.round(80 - i * 0.4), factors: [] });
    }

    return {
      crop, mandi, forecastPeriod: `${days} days`,
      historicalSummary: { average: avg, min: Math.min(...prices), max: Math.max(...prices), totalVolume: Math.round(1000 + Math.random() * 2000), trend: 'stable' },
      forecast,
      advice: ['Monitor daily updates for better timing', 'Check multiple mandis before selling', 'Use e-NAM platform for better price discovery'],
      generatedAt: new Date(),
    };
  }
}

module.exports = new MarketForecastService();
