export const mockWeather = {
  location: 'Indore, Madhya Pradesh',
  temperature: 28,
  humidity: 65,
  rainfall: 2.4,
  windSpeed: 12,
  condition: 'Partly Cloudy',
  uvIndex: 6,
  forecast: [
    { day: 'Mon', high: 30, low: 22, rain: 10, icon: '🌤' },
    { day: 'Tue', high: 28, low: 21, rain: 40, icon: '🌦' },
    { day: 'Wed', high: 25, low: 20, rain: 70, icon: '🌧' },
    { day: 'Thu', high: 27, low: 21, rain: 30, icon: '⛅' },
    { day: 'Fri', high: 31, low: 23, rain: 5,  icon: '☀️' },
    { day: 'Sat', high: 32, low: 24, rain: 5,  icon: '☀️' },
    { day: 'Sun', high: 29, low: 22, rain: 20, icon: '🌤' },
  ]
}

export const mockAdvisory = {
  id: 'ADV-2024-001',
  farmerId: 'F001',
  generatedAt: '2024-03-17T09:00:00Z',
  season: 'Kharif 2024',
  topRecommendations: [
    {
      rank: 1,
      cropId: 'C001',
      cropName: 'Soybean',
      cropNameHindi: 'सोयाबीन',
      suitabilityScore: 94,
      expectedYield: '25-30 quintals/acre',
      estimatedRevenue: '₹45,000 – ₹54,000',
      waterRequirement: 'Moderate (450–700mm)',
      soilSuitability: 'Excellent',
      marketDemand: 'High',
      risks: ['Stem fly', 'Yellow mosaic virus'],
      reasons: [
        'Ideal for black cotton soil in your region',
        'Strong mandi prices in Indore (₹5,200/quintal)',
        'Low water requirement fits current rainfall forecast',
      ],
      activities: [
        { week: 1, task: 'Land preparation & sowing', type: 'field' },
        { week: 2, task: 'Germination check', type: 'monitor' },
        { week: 4, task: 'First fertilizer dose', type: 'input' },
        { week: 8, task: 'Pest scouting', type: 'monitor' },
        { week: 14, task: 'Harvest preparation', type: 'harvest' },
      ]
    },
    {
      rank: 2,
      cropId: 'C002',
      cropName: 'Maize',
      cropNameHindi: 'मक्का',
      suitabilityScore: 87,
      expectedYield: '30-35 quintals/acre',
      estimatedRevenue: '₹36,000 – ₹42,000',
      waterRequirement: 'High (600–900mm)',
      soilSuitability: 'Good',
      marketDemand: 'High',
      risks: ['Fall armyworm', 'Leaf blight'],
      reasons: [
        'Good market prices at nearby mandis',
        'Suitable for loamy soils',
        'Short duration variety available',
      ],
      activities: []
    },
    {
      rank: 3,
      cropId: 'C003',
      cropName: 'Cotton',
      cropNameHindi: 'कपास',
      suitabilityScore: 79,
      expectedYield: '18-22 quintals/acre',
      estimatedRevenue: '₹54,000 – ₹66,000',
      waterRequirement: 'Moderate (500–800mm)',
      soilSuitability: 'Good',
      marketDemand: 'Very High',
      risks: ['Pink bollworm', 'Sucking pests'],
      reasons: [
        'Black cotton soil is ideal',
        'High MSP and market demand',
        'Long duration but high value',
      ],
      activities: []
    }
  ]
}

export const mockMarketPrices = [
  { crop: 'Soybean', cropHindi: 'सोयाबीन', mandi: 'Indore', price: 5200, change: +120, unit: 'quintal', trend: 'up' },
  { crop: 'Wheat',   cropHindi: 'गेहूं',    mandi: 'Bhopal', price: 2200, change: -30,  unit: 'quintal', trend: 'down' },
  { crop: 'Cotton',  cropHindi: 'कपास',     mandi: 'Indore', price: 6700, change: +200, unit: 'quintal', trend: 'up' },
  { crop: 'Maize',   cropHindi: 'मक्का',    mandi: 'Ujjain', price: 1900, change: +50,  unit: 'quintal', trend: 'up' },
  { crop: 'Onion',   cropHindi: 'प्याज',    mandi: 'Dewas',  price: 1500, change: -150, unit: 'quintal', trend: 'down' },
  { crop: 'Garlic',  cropHindi: 'लहसुन',    mandi: 'Manasa', price: 8400, change: +300, unit: 'quintal', trend: 'up' },
]

export const mockPriceHistory = [
  { month: 'Oct', soybean: 4800, maize: 1750, cotton: 6200 },
  { month: 'Nov', soybean: 4950, maize: 1800, cotton: 6350 },
  { month: 'Dec', soybean: 5100, maize: 1850, cotton: 6500 },
  { month: 'Jan', soybean: 4900, maize: 1900, cotton: 6400 },
  { month: 'Feb', soybean: 5000, maize: 1870, cotton: 6600 },
  { month: 'Mar', soybean: 5200, maize: 1900, cotton: 6700 },
]

export const mockFarmerProfile = {
  id: 'F001',
  name: 'Ramesh Patidar',
  nameHindi: 'रमेश पाटीदार',
  phone: '+91 98765 43210',
  village: 'Badnawar',
  district: 'Dhar',
  state: 'Madhya Pradesh',
  totalLand: 4.5,
  landUnit: 'acres',
  irrigationType: 'Borewell',
  soilType: 'Black Cotton',
  annualIncome: '₹2.8 Lakhs',
  loans: '₹1.2 Lakhs',
  scheme: 'PM-KISAN',
  lands: [
    { id: 'L001', name: 'Main Field', area: 2.5, soilType: 'Black Cotton', lastCrop: 'Soybean', irrigation: 'Borewell' },
    { id: 'L002', name: 'East Field',  area: 1.0, soilType: 'Loamy',       lastCrop: 'Maize',   irrigation: 'Canal' },
    { id: 'L003', name: 'South Plot',  area: 1.0, soilType: 'Sandy Loam',  lastCrop: 'Wheat',   irrigation: 'Rainfed' },
  ]
}

export const mockAlerts = [
  { id: 1, type: 'pest',    severity: 'high',   title: 'Fall Armyworm Alert',       message: 'Outbreak reported in Dhar district – inspect fields immediately.', time: '2h ago' },
  { id: 2, type: 'weather', severity: 'medium', title: 'Heavy Rain Expected',        message: 'IMD forecast: 60–80mm rainfall in next 48 hours. Delay sowing.', time: '5h ago' },
  { id: 3, type: 'market',  severity: 'low',    title: 'Soybean Price Rise',         message: 'Soybean price up ₹120/q in Indore mandi. Consider selling stored produce.', time: '1d ago' },
  { id: 4, type: 'scheme',  severity: 'info',   title: 'PM-KISAN Installment',       message: 'Next PM-KISAN installment of ₹2,000 due Apr 1. Check your e-KYC status.', time: '2d ago' },
]

export const mockSchemes = [
  { id: 'S001', name: 'PM-KISAN', nameHindi: 'पीएम-किसान', benefit: '₹6,000/year', deadline: 'Rolling',      status: 'enrolled',    category: 'Income Support' },
  { id: 'S002', name: 'PMFBY',   nameHindi: 'PMFBY',      benefit: 'Crop Insurance', deadline: '31 Jul 2024', status: 'eligible',    category: 'Insurance' },
  { id: 'S003', name: 'KCC',     nameHindi: 'किसान क्रेडिट कार्ड', benefit: 'Credit up to ₹3L', deadline: 'Rolling', status: 'not-applied', category: 'Credit' },
  { id: 'S004', name: 'eNAM',    nameHindi: 'ई-नाम',     benefit: 'Better prices',   deadline: 'Rolling',     status: 'eligible',    category: 'Market' },
]