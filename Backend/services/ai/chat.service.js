'use strict';

const axios = require('axios');

class ChatService {
  constructor() {
    this.groqKey = process.env.GROQ_API_KEY;
    this.openaiKey = process.env.OPENAI_API_KEY;
    this.model = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
    this.baseUrl = process.env.GROQ_BASE_URL || 'https://api.groq.com/openai/v1';
  }

  async chat(message, context = {}, history = []) {
    const apiKey = this.groqKey || this.openaiKey;

    if (!apiKey) {
      return this.getFallbackResponse(message, context);
    }

    const systemPrompt = this.buildSystemPrompt(context);

    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.slice(-20),
      { role: 'user', content: message },
    ];

    try {
      const { data } = await axios.post(`${this.baseUrl}/chat/completions`, {
        model: this.model,
        messages,
        temperature: 0.7,
        max_tokens: 1000,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        timeout: 30000,
      });

      return data.choices?.[0]?.message?.content || this.getFallbackResponse(message, context);
    } catch (error) {
      console.error('AI chat error:', error.response?.data || error.message);
      return this.getFallbackResponse(message, context);
    }
  }

  buildSystemPrompt(context) {
    return `You are KrishiMitra, an AI farming assistant specializing in Indian agriculture. You help farmers with:
- Crop recommendations based on soil, climate, and season
- Pest and disease identification and control
- Weather advisory and risk assessment
- Government schemes and subsidies
- Market prices and selling strategies
- Modern farming techniques

Provide practical, actionable advice in simple language. Consider the farmer's context:
- Location: ${context.location || 'Not specified'}
- Season: ${context.season || 'Current'}
- Soil type: ${context.soilType || 'Not specified'}
- Crops grown: ${context.crops?.join(', ') || 'Not specified'}

Always prioritize sustainable and cost-effective solutions. Answer the user's specific question directly.`;
  }

  getFallbackResponse(message, context) {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('crop') || lowerMessage.includes('plant')) {
      return this.getCropAdvice(context);
    }
    if (lowerMessage.includes('pest') || lowerMessage.includes('disease') || lowerMessage.includes('insect')) {
      return this.getPestAdvice();
    }
    if (lowerMessage.includes('weather') || lowerMessage.includes('rain') || lowerMessage.includes('climate')) {
      return this.getWeatherAdvice();
    }
    if (lowerMessage.includes('scheme') || lowerMessage.includes('subsidy') || lowerMessage.includes('government')) {
      return this.getSchemeAdvice();
    }
    if (lowerMessage.includes('market') || lowerMessage.includes('price') || lowerMessage.includes('sell')) {
      return this.getMarketAdvice();
    }
    if (lowerMessage.includes('soil') || lowerMessage.includes('fertilizer')) {
      return this.getSoilAdvice();
    }
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('namaste')) {
      return `Namaste! I'm KrishiMitra, your AI farming assistant. I can help you with crops, pests, weather, government schemes, market prices, and more. What would you like to know about?`;
    }

    return `I'm here to help with your farming questions! Ask me about:
🌾 Best crops to grow this season
🐛 Pest and disease control
🌤 Weather and climate advisories
🏛 Government schemes you can apply for
💰 Market prices for your produce
🧪 Soil health and fertilizer recommendations

Please provide more details about your farm for personalized advice.`;
  }

  getCropAdvice(context) {
    const season = context.season || 'current';
    const location = context.location || 'your region';
    const advice = {
      kharif: `For Kharif season (June-October) in ${location}, consider: Rice, Cotton, Soybean, Maize, Groundnut, Pulses (Tur, Moong). Ensure irrigation during dry spells.`,
      rabi: `For Rabi season (October-March) in ${location}, consider: Wheat, Mustard, Gram, Barley, Lentils, Vegetables. Use drip irrigation for water efficiency.`,
      zaid: `For Zaid season (March-June) in ${location}, consider: Vegetables, Melons, Fodder crops. Ensure good drainage as this is summer season.`,
    };
    return advice[season] || advice.kharif;
  }

  getPestAdvice() {
    return `Common pest management strategies:
1. Use integrated pest management (IPM) - combine biological, cultural, and chemical methods
2. Use neem oil or organic pesticides first
3. Install pheromone traps for fruit flies
4. Encourage natural predators like ladybirds and spiders
5. Rotate crops to break pest cycles
6. For specific pest identification, upload a photo and I can help identify it.

Consult your local agricultural extension officer for region-specific advice.`;
  }

  getWeatherAdvice() {
    return `Weather advisory:
1. Check weather forecasts daily before planning farm activities
2. For rain: Avoid pesticide spraying, ensure proper drainage
3. For heat: Water crops early morning or evening, use mulching
4. For storms: Secure polytunnels, harvest mature crops if possible
5. Use weather-based crop insurance where available

Subscribe to IMD (India Meteorological Department) alerts for your district.`;
  }

  getSchemeAdvice() {
    return `Key government schemes for farmers:
1. PM-KISAN: ₹6000/year direct to bank account - apply at local tehsil
2. PMFBY: Crop insurance scheme - enroll through bank
3. Kisan Credit Card: Easy credit for farming needs
4. Agricultural subsidies: For drip irrigation, farm machinery
5. Soil health card: Free soil testing - available at local agri office

Visit your nearest Common Service Centre (CSC) or Krishi Vigyan Kendra (KVK) for application help.`;
  }

  getMarketAdvice() {
    return `Market price tips:
1. Check mandi prices daily before selling - prices vary by season
2. Consider grading and sorting your produce for better rates
3. Form farmer producer organizations (FPOs) for better bargaining power
4. Use e-NAM platform to compare prices across mandis
5. Store produce properly if waiting for better prices

Check the Market section of KrishiMitra for current mandi prices.`;
  }

  getSoilAdvice() {
    return `Soil health recommendations:
1. Get your soil tested every 2-3 years through Soil Health Card scheme
2. Use organic matter (compost, vermicompost) to improve soil structure
3. Practice crop rotation to maintain soil fertility
4. Apply fertilizers based on soil test results - avoid overuse
5. Use green manuring crops like sunn hemp to add nitrogen

Visit your local Krishi Vigyan Kendra (KVK) for free soil testing.`;
  }
}

module.exports = new ChatService();
