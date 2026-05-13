'use strict';

class PestDetectionService {
  constructor() {
    this.huggingFaceKey = process.env.HUGGINGFACE_API_KEY;
    this.huggingFaceEndpoint = process.env.HUGGINGFACE_ENDPOINT || 'https://api-inference.huggingface.co';
  }

  async detectFromImage(imageBase64, symptoms = '', cropName = '') {
    const symptomsResult = this.matchBySymptoms(symptoms, cropName);
    if (symptomsResult.detected) {
      return symptomsResult;
    }

    const predictions = await this.analyzeWithAI(imageBase64);
    if (predictions) return predictions;

    return this.getRuleBasedDetection();
  }

  matchBySymptoms(symptoms, cropName) {
    const text = (symptoms + ' ' + cropName).toLowerCase();
    const matches = [];

    const pestDatabase = {
      'yellowing|yellow leaf|mosaic|curl': { name: 'Yellow Mosaic Virus / Leaf Curl', severity: 'high', treatment: 'Control whitefly vector with Imidacloprid 0.3ml/L. Remove infected plants. Use resistant varieties.', confidence: 0.85 },
      'hole|chewed|eaten|defoliation': { name: 'Leaf Eating Caterpillar / Beetle', severity: 'medium', treatment: 'Spray neem oil 5ml/L or Chlorantraniliprole 0.4ml/L. Hand pick larger larvae.', confidence: 0.8 },
      'whitefly|white fly|small white insect': { name: 'Whitefly', severity: 'medium', treatment: 'Use yellow sticky traps. Spray neem oil 5ml/L or Imidacloprid 0.3ml/L.', confidence: 0.9 },
      'borer|stem borer|dead heart|drill': { name: 'Stem Borer', severity: 'high', treatment: 'Apply Carbofuran 3G 10kg/acre in whorls. Use Trichogramma cards for biological control.', confidence: 0.85 },
      'mildew|white powder|powdery': { name: 'Powdery Mildew', severity: 'medium', treatment: 'Spray Wettable Sulfur 2g/L or Tebuconazole 1ml/L. Ensure good air circulation.', confidence: 0.85 },
      'blight|spot|leaf spot|brown spot': { name: 'Leaf Blight / Spot', severity: 'medium', treatment: 'Spray Mancozeb 2g/L or Copper oxychloride 2.5g/L. Avoid overhead irrigation.', confidence: 0.8 },
      'rust|orange pustule|brown pustule': { name: 'Rust Disease', severity: 'high', treatment: 'Spray Tebuconazole 1ml/L or Propiconazole 1ml/L. Use resistant varieties next season.', confidence: 0.85 },
      'wilt|drooping|collapse|vascular': { name: 'Fusarium / Bacterial Wilt', severity: 'high', treatment: 'Remove and destroy affected plants. Drench soil with Copper oxychloride 3g/L. Use resistant varieties.', confidence: 0.8 },
      'aphid|sticky|honeydew|sooty mould': { name: 'Aphids / Sooty Mould', severity: 'medium', treatment: 'Spray neem oil 5ml/L or Dimethoate 1ml/L. Introduce ladybird beetles.', confidence: 0.85 },
      'fruit fly|maggot|rotten fruit': { name: 'Fruit Fly', severity: 'high', treatment: 'Use methyl eugenol traps. Bag developing fruits. Collect and destroy fallen fruits.', confidence: 0.85 },
      'mite|spider mite|webbing|stippling': { name: 'Spider Mites', severity: 'medium', treatment: 'Spray sulfur 2g/L or neem oil. Maintain proper irrigation to reduce dust.', confidence: 0.8 },
      'thrips|scratched|silver leaf': { name: 'Thrips', severity: 'medium', treatment: 'Use blue sticky traps. Spray Spinosad 0.3ml/L or neem oil 5ml/L.', confidence: 0.8 },
      'mealybug|cottony|white fluff': { name: 'Mealybug', severity: 'medium', treatment: 'Spray alcohol + soap solution. Introduce Cryptolaemus ladybird beetles.', confidence: 0.85 },
      'grasshopper|locust|jump|chewed leaf': { name: 'Grasshopper / Locust', severity: 'high', treatment: 'Spray Cypermethrin 25% EC 1ml/L. Install bird perches. Notify agriculture department if swarm.', confidence: 0.85 },
      'pink bollworm|boll rot|boll damage': { name: 'Pink Bollworm', severity: 'high', treatment: 'Use pheromone traps 5/acre. Spray Profenofos 50EC 2ml/L at boll formation. Harvest timely.', confidence: 0.85 },
    };

    for (const [keywords, pest] of Object.entries(pestDatabase)) {
      const patterns = keywords.split('|');
      if (patterns.some(p => text.includes(p))) {
        const isHigh = (text.match(/crop|soybean|cotton|rice|wheat|maize/i) !== null);
        matches.push({ ...pest, confidence: isHigh ? Math.min(pest.confidence + 0.05, 0.95) : pest.confidence });
      }
    }

    if (matches.length > 0) {
      matches.sort((a, b) => b.confidence - a.confidence);
      return {
        detected: true,
        pests: matches.slice(0, 3),
        suggestions: this.getGeneralPestManagement(),
        timestamp: new Date(),
      };
    }

    if (cropName) {
      const cropPests = this.getPestsForCrop(cropName);
      if (cropPests.length > 0) {
        return {
          detected: true,
          pests: cropPests,
          suggestions: this.getGeneralPestManagement(),
          timestamp: new Date(),
        };
      }
    }

    return { detected: false };
  }

  async analyzeWithAI(imageBase64) {
    if (!this.huggingFaceKey) return null;
    try {
      const model = 'google/vit-base-patch16-224';
      const response = await fetch(`${this.huggingFaceEndpoint}/models/${model}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.huggingFaceKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs: imageBase64 }),
      });
      const result = await response.json();
      return this.interpretPredictions(result);
    } catch (error) {
      console.error('Pest detection AI error:', error.message);
      return null;
    }
  }

  interpretPredictions(predictions) {
    if (!predictions || !Array.isArray(predictions)) return null;

    const pestKeywords = {
      'beetle': { name: 'Leaf Beetle', severity: 'medium', treatment: 'Spray neem oil 5ml/L or Chlorantraniliprole 0.4ml/L.' },
      'caterpillar': { name: 'Caterpillar', severity: 'high', treatment: 'Spray Bacillus thuringiensis (Bt) 1g/L or Emamectin benzoate 0.4g/L.' },
      'bug': { name: 'Plant Bug', severity: 'medium', treatment: 'Spray neem oil or Dimethoate 1ml/L. Remove weeds.' },
      'moth': { name: 'Moth (Adult)', severity: 'low', treatment: 'Install pheromone traps. Monitor for egg masses on leaves.' },
      'ant': { name: 'Ant', severity: 'low', treatment: 'Drench ant mounds with soap water. Control aphids as ants farm them.' },
      'grasshopper': { name: 'Grasshopper', severity: 'medium', treatment: 'Spray Malathion 2ml/L. Encourage bird populations.' },
      'leaf': { name: 'Leaf Damage', severity: 'medium', treatment: 'Inspect for underlying pest. Apply neem oil spray as broad-spectrum prevention.' },
      'fruit': { name: 'Fruit Pest', severity: 'medium', treatment: 'Use fruit fly traps. Spray Malathion if infestation is severe.' },
      'worm': { name: 'Cutworm / Armyworm', severity: 'high', treatment: 'Spray Emamectin benzoate 0.4g/L. Use light traps at night.' },
    };

    const matched = predictions.slice(0, 5).map(p => {
      const label = p.label?.toLowerCase() || '';
      for (const [kw, pest] of Object.entries(pestKeywords)) {
        if (label.includes(kw)) {
          return { ...pest, confidence: p.score || 0.5 };
        }
      }
      return null;
    }).filter(Boolean);

    if (matched.length > 0) {
      return {
        detected: true,
        pests: matched.slice(0, 3),
        suggestions: this.getGeneralPestManagement(),
        timestamp: new Date(),
      };
    }
    return null;
  }

  getRuleBasedDetection() {
    const commonPests = [
      { name: 'Aphids', severity: 'medium', confidence: 0.7, treatment: 'Spray neem oil 5ml/L water. Introduce ladybird beetles.' },
      { name: 'Whitefly', severity: 'medium', confidence: 0.65, treatment: 'Use yellow sticky traps. Spray neem oil or Imidacloprid 0.3ml/L.' },
      { name: 'Caterpillar', severity: 'high', confidence: 0.6, treatment: 'Hand pick visible larvae. Spray Bt 1g/L or Emamectin benzoate 0.4g/L.' },
    ];
    return {
      detected: true,
      pests: commonPests,
      suggestions: this.getGeneralPestManagement(),
      timestamp: new Date(),
    };
  }

  getGeneralPestManagement() {
    return [
      'Prevention: Use certified seeds, practice crop rotation',
      'Monitoring: Check crops weekly for pest signs',
      'Biological: Encourage natural predators (ladybirds, spiders, birds)',
      'Chemical: Use pesticides as last resort, follow waiting period',
      'Cultural: Remove crop residues, maintain field sanitation',
      'Resistant varieties: Use ICAR recommended varieties',
    ];
  }

  getPestsForCrop(cropName) {
    const map = {
      soybean: [
        { name: 'Yellow Mosaic Virus', severity: 'high', confidence: 0.7, treatment: 'Control whitefly vector. Use resistant varieties. Remove infected plants.' },
        { name: 'Stem Fly', severity: 'medium', confidence: 0.65, treatment: 'Seed treatment with Imidacloprid. Spray Dimethoate if infestation >10%.' },
        { name: 'Leaf Blight', severity: 'medium', confidence: 0.6, treatment: 'Spray Mancozeb 2g/L. Ensure proper drainage.' },
      ],
      cotton: [
        { name: 'Pink Bollworm', severity: 'high', confidence: 0.8, treatment: 'Use pheromone traps 5/acre. Spray Profenofos 2ml/L. Harvest timely.' },
        { name: 'Whitefly', severity: 'medium', confidence: 0.75, treatment: 'Yellow sticky traps. Spray Imidacloprid 0.3ml/L.' },
        { name: 'Leafhopper / Jassid', severity: 'medium', confidence: 0.7, treatment: 'Spray neem oil 5ml/L or Dimethoate 1ml/L.' },
      ],
      maize: [
        { name: 'Fall Armyworm', severity: 'high', confidence: 0.8, treatment: 'Spray Emamectin benzoate 0.4g/L in whorls. Use neem cake soil application.' },
        { name: 'Stem Borer', severity: 'high', confidence: 0.75, treatment: 'Apply Carbofuran 3G granules in whorls. Use Trichogramma cards.' },
        { name: 'Leaf Blight', severity: 'medium', confidence: 0.65, treatment: 'Spray Mancozeb 2g/L. Avoid dense planting.' },
      ],
      wheat: [
        { name: 'Yellow Rust', severity: 'high', confidence: 0.8, treatment: 'Spray Propiconazole 1ml/L or Tebuconazole 1ml/L at first signs.' },
        { name: 'Powdery Mildew', severity: 'medium', confidence: 0.7, treatment: 'Spray Sulfur 2g/L. Avoid excessive nitrogen.' },
        { name: 'Aphids', severity: 'medium', confidence: 0.65, treatment: 'Spray neem oil 5ml/L or Dimethoate 1ml/L.' },
      ],
      rice: [
        { name: 'Blast Disease', severity: 'high', confidence: 0.8, treatment: 'Spray Tricyclazole 1g/L or Carbendazim 1g/L at first signs.' },
        { name: 'Stem Borer', severity: 'high', confidence: 0.75, treatment: 'Apply Carbofuran 3G. Use light traps for monitoring.' },
        { name: 'Brown Plant Hopper', severity: 'medium', confidence: 0.7, treatment: 'Spray Imidacloprid 0.3ml/L. Drain field if infested.' },
      ],
      chickpea: [
        { name: 'Gram Pod Borer', severity: 'high', confidence: 0.8, treatment: 'Install pheromone traps. Spray Bt 1g/L or Indoxacarb 0.5ml/L.' },
        { name: 'Wilt Disease', severity: 'high', confidence: 0.7, treatment: 'Seed treatment with Trichoderma. Use resistant varieties.' },
      ],
      groundnut: [
        { name: 'Tikka / Leaf Spot', severity: 'high', confidence: 0.75, treatment: 'Spray Mancozeb 2g/L or Carbendazim 1g/L at 15-day intervals.' },
        { name: 'Stem Rot', severity: 'high', confidence: 0.7, treatment: 'Seed treatment with Trichoderma. Ensure proper drainage.' },
      ],
    };
    const key = cropName.toLowerCase();
    return map[key] || [];
  }

  getPestDatabase() {
    return {
      insects: [
        { id: 1, name: 'Aphids', crops: ['Cotton', 'Vegetables', 'Pulses'], season: 'Kharif/Rabi' },
        { id: 2, name: 'Whiteflies', crops: ['Cotton', 'Vegetables'], season: 'Kharif' },
        { id: 3, name: 'Helicoverpa', crops: ['Cotton', 'Chickpea', 'Tomato'], season: 'Kharif/Rabi' },
        { id: 4, name: 'Stem Borer', crops: ['Rice', 'Maize', 'Sorghum'], season: 'Kharif' },
        { id: 5, name: 'Fruit Fly', crops: ['Fruits', 'Vegetables'], season: 'All' },
        { id: 6, name: 'Pink Bollworm', crops: ['Cotton'], season: 'Kharif' },
        { id: 7, name: 'Leafhopper', crops: ['Cotton', 'Pulses'], season: 'Kharif' },
      ],
      diseases: [
        { id: 1, name: 'Powdery Mildew', crops: ['Wheat', 'Grapes', 'Cucurbits'], season: 'Rabi' },
        { id: 2, name: 'Rust', crops: ['Wheat', 'Barley'], season: 'Rabi' },
        { id: 3, name: 'Blast', crops: ['Rice'], season: 'Kharif' },
        { id: 4, name: 'Bacterial Blight', crops: ['Rice', 'Cotton'], season: 'Kharif' },
        { id: 5, name: 'Downy Mildew', crops: ['Grapes', 'Cucurbits'], season: 'All' },
      ],
    };
  }
}

module.exports = new PestDetectionService();
