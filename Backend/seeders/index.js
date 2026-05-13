require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const { sequelize, Farmer, Land, Advisory, CropRecommendation, Mandi, MarketPrice, Pest, PestOutbreak, Scheme, SchemeApplication, Notification } = require('../models');
const bcrypt = require('bcryptjs');

async function seed() {
  console.log('🌱 Starting KrishiMitra database seed...\n');

  await sequelize.sync({ force: true });
  console.log('✅ Database tables created (force sync).\n');

  // ─── 1. Farmers ──────────────────────────────────────────────────────────────
  console.log('👨‍🌾 Seeding farmers...');
  const hashedPw = await bcrypt.hash('krishimitra123', 10);

  const farmers = await Farmer.bulkCreate([
    {
      name: 'Ramesh Patel',
      nameHindi: 'रमेश पटेल',
      phone: '9826012345',
      password: hashedPw,
      state: 'Madhya Pradesh',
      district: 'Indore',
      village: 'Sanwer',
      pincode: '453551',
      latitude: 22.9734,
      longitude: 75.8330,
      totalLandAcres: 4.5,
      irrigationType: 'mixed',
      annualIncomeRange: '1-2 lakh',
      hasKisanCard: true,
      preferredLanguage: 'hi',
    },
    {
      name: 'Sunita Verma',
      nameHindi: 'सुनीता वर्मा',
      phone: '9425112233',
      password: hashedPw,
      state: 'Madhya Pradesh',
      district: 'Bhopal',
      village: 'Berasia',
      pincode: '462038',
      latitude: 23.2599,
      longitude: 77.4126,
      totalLandAcres: 2.0,
      irrigationType: 'rainfed',
      annualIncomeRange: 'below 1 lakh',
      hasKisanCard: false,
      preferredLanguage: 'hi',
    },
    {
      name: 'Vikram Singh Chouhan',
      nameHindi: 'विक्रम सिंह चौहान',
      phone: '9301445566',
      password: hashedPw,
      state: 'Madhya Pradesh',
      district: 'Ujjain',
      village: 'Nagda',
      pincode: '456335',
      latitude: 23.4532,
      longitude: 75.4166,
      totalLandAcres: 8.0,
      irrigationType: 'canal',
      annualIncomeRange: '2-5 lakh',
      hasKisanCard: true,
      preferredLanguage: 'hi',
    },
    {
      name: 'Meena Kushwaha',
      nameHindi: 'मीना कुशवाहा',
      phone: '8109223344',
      password: hashedPw,
      state: 'Madhya Pradesh',
      district: 'Dewas',
      village: 'Bagli',
      pincode: '455227',
      latitude: 22.9614,
      longitude: 76.0524,
      totalLandAcres: 3.0,
      irrigationType: 'borewell',
      annualIncomeRange: '1-2 lakh',
      hasKisanCard: true,
      preferredLanguage: 'hi',
    },
  ]);
  console.log(`   ✓ ${farmers.length} farmers created. (Login: phone + password: krishimitra123)\n`);

  // ─── 2. Land Parcels ─────────────────────────────────────────────────────────
  console.log('🌾 Seeding land parcels...');
  const lands = await Land.bulkCreate([
    // Ramesh's fields
    {
      farmerId: farmers[0].id,
      name: 'Khet 1 - Main Field',
      areaAcres: 2.5,
      soilType: 'black',
      soilPh: 7.2,
      irrigationType: 'mixed',
      latitude: 22.9710,
      longitude: 75.8280,
      lastCrop: 'wheat',
      lastCropHindi: 'गेहूँ',
      suitableCrops: ['soybean', 'cotton', 'chickpea'],
      notes: 'Good moisture retention. Flood-irrigated from Shipra canal.',
    },
    {
      farmerId: farmers[0].id,
      name: 'Khet 2 - Back Field',
      areaAcres: 2.0,
      soilType: 'loamy',
      soilPh: 6.8,
      irrigationType: 'borewell',
      latitude: 22.9750,
      longitude: 75.8310,
      lastCrop: 'maize',
      lastCropHindi: 'मक्का',
      suitableCrops: ['wheat', 'maize', 'mustard'],
    },
    // Sunita's field
    {
      farmerId: farmers[1].id,
      name: 'Badi Zameen',
      areaAcres: 2.0,
      soilType: 'black',
      soilPh: 7.5,
      irrigationType: 'rainfed',
      latitude: 23.2560,
      longitude: 77.4100,
      lastCrop: 'soybean',
      lastCropHindi: 'सोयाबीन',
      suitableCrops: ['chickpea', 'wheat', 'mustard'],
    },
    // Vikram's fields
    {
      farmerId: farmers[2].id,
      name: 'Field A - Canal Side',
      areaAcres: 4.0,
      soilType: 'alluvial',
      soilPh: 7.0,
      irrigationType: 'canal',
      latitude: 23.4500,
      longitude: 75.4120,
      lastCrop: 'wheat',
      lastCropHindi: 'गेहूँ',
      suitableCrops: ['maize', 'cotton', 'soybean'],
    },
    {
      farmerId: farmers[2].id,
      name: 'Field B - Drip Zone',
      areaAcres: 4.0,
      soilType: 'black',
      soilPh: 7.3,
      irrigationType: 'drip',
      latitude: 23.4560,
      longitude: 75.4180,
      lastCrop: 'cotton',
      lastCropHindi: 'कपास',
      suitableCrops: ['soybean', 'chickpea', 'maize'],
    },
    // Meena's field
    {
      farmerId: farmers[3].id,
      name: 'Home Farm',
      areaAcres: 3.0,
      soilType: 'black',
      soilPh: 7.1,
      irrigationType: 'borewell',
      latitude: 22.9580,
      longitude: 76.0490,
      lastCrop: 'chickpea',
      lastCropHindi: 'चना',
      suitableCrops: ['soybean', 'wheat', 'maize'],
    },
  ]);
  console.log(`   ✓ ${lands.length} land parcels created.\n`);

  // ─── 3. Mandis ───────────────────────────────────────────────────────────────
  console.log('🏪 Seeding mandis...');
  const mandis = await Mandi.bulkCreate([
    { name: 'Indore', nameHindi: 'इंदौर', district: 'Indore', state: 'Madhya Pradesh', latitude: 22.7196, longitude: 75.8577 },
    { name: 'Bhopal', nameHindi: 'भोपाल', district: 'Bhopal', state: 'Madhya Pradesh', latitude: 23.2599, longitude: 77.4126 },
    { name: 'Ujjain', nameHindi: 'उज्जैन', district: 'Ujjain', state: 'Madhya Pradesh', latitude: 23.1765, longitude: 75.7885 },
    { name: 'Dewas', nameHindi: 'देवास', district: 'Dewas', state: 'Madhya Pradesh', latitude: 22.9623, longitude: 76.0508 },
    { name: 'Manasa', nameHindi: 'मनासा', district: 'Neemuch', state: 'Madhya Pradesh', latitude: 24.4917, longitude: 75.1449 },
    { name: 'Sehore', nameHindi: 'सीहोर', district: 'Sehore', state: 'Madhya Pradesh', latitude: 23.2001, longitude: 77.0851 },
  ]);
  console.log(`   ✓ ${mandis.length} mandis created.\n`);

  // ─── 4. Market Prices ────────────────────────────────────────────────────────
  console.log('💰 Seeding market prices (6-month history)...');
  const crops = [
    { name: 'soybean', nameHindi: 'सोयाबीन', basePrice: 4200, msp: 4600 },
    { name: 'maize',   nameHindi: 'मक्का',    basePrice: 1750, msp: 2090 },
    { name: 'cotton',  nameHindi: 'कपास',     basePrice: 6400, msp: 7020 },
    { name: 'wheat',   nameHindi: 'गेहूँ',    basePrice: 2200, msp: 2275 },
    { name: 'chickpea',nameHindi: 'चना',      basePrice: 5300, msp: 5440 },
    { name: 'mustard', nameHindi: 'सरसों',    basePrice: 5500, msp: 5650 },
  ];

  const priceRecords = [];
  const today = new Date();

  for (const mandi of mandis) {
    for (const crop of crops) {
      for (let d = 180; d >= 0; d -= 3) {
        const date = new Date(today);
        date.setDate(date.getDate() - d);
        const fluctuation = (Math.random() - 0.5) * crop.basePrice * 0.1;
        const price = Math.round(crop.basePrice + fluctuation);
        const prev = Math.round(crop.basePrice + (Math.random() - 0.5) * crop.basePrice * 0.05);

        priceRecords.push({
          mandiId: mandi.id,
          cropName: crop.name,
          cropNameHindi: crop.nameHindi,
          pricePerQuintal: price,
          minPrice: Math.round(price * 0.97),
          maxPrice: Math.round(price * 1.03),
          mspPrice: crop.msp,
          priceChange: price - prev,
          trend: price > prev ? 'up' : price < prev ? 'down' : 'stable',
          tradeDate: date.toISOString().split('T')[0],
          source: 'seed',
        });
      }
    }
  }

  // Batch insert
  const chunkSize = 500;
  for (let i = 0; i < priceRecords.length; i += chunkSize) {
    await MarketPrice.bulkCreate(priceRecords.slice(i, i + chunkSize), { ignoreDuplicates: true });
  }
  console.log(`   ✓ ~${priceRecords.length} market price records created.\n`);

  // ─── 5. Pests & Diseases ──────────────────────────────────────────────────────
  console.log('🐛 Seeding pests & diseases...');
  const pests = await Pest.bulkCreate([
    {
      name: 'Yellow Mosaic Virus (YMV)',
      nameHindi: 'पीला मोज़ेक वायरस',
      type: 'disease',
      affectedCrops: ['soybean', 'moongbean'],
      symptoms: 'Yellow mosaic patterns on leaves, stunted growth, leaf curling, yellowing between veins.',
      symptomsHindi: 'पत्तियों पर पीले धब्बे, बौनापन, पत्ती का मुड़ना।',
      treatments: [
        { method: 'chemical', productName: 'Imidacloprid 17.8 SL', dosage: '0.5 ml/L water', cost: 'Low', description: 'Spray to control whitefly vector' },
        { method: 'biological', productName: 'Neem oil 3%', dosage: '3 ml/L water', cost: 'Very Low', description: 'Repels whitefly naturally' },
        { method: 'cultural', description: 'Remove and destroy infected plants immediately. Use virus-resistant varieties.' },
      ],
      preventions: [
        'Use certified YMV-resistant seed varieties',
        'Control whitefly population with sticky yellow traps',
        'Avoid planting near infected fields',
        'Treat seeds with Thiram + Carbendazim before sowing',
      ],
      season: ['kharif'],
      severityLevel: 'high',
    },
    {
      name: 'Pink Bollworm',
      nameHindi: 'गुलाबी सुंडी',
      type: 'pest',
      affectedCrops: ['cotton'],
      symptoms: 'Pink larvae inside cotton bolls, premature boll opening, damaged lint, flower shedding.',
      symptomsHindi: 'कपास के टिंडों के अंदर गुलाबी लार्वा, समय से पहले टिंडा खुलना।',
      treatments: [
        { method: 'chemical', productName: 'Chlorpyrifos 20 EC', dosage: '2.5 ml/L water', cost: 'Moderate', description: 'Apply when infestation crosses ETL (8 moths/trap/week)' },
        { method: 'biological', productName: 'Bacillus thuringiensis (Bt)', dosage: '1 g/L water', cost: 'Low', description: 'Eco-friendly larvicide' },
        { method: 'trap', description: 'Install pheromone traps (5/acre) for early monitoring and mass trapping.' },
      ],
      preventions: [
        'Use Bt cotton varieties',
        'Install pheromone traps before flowering stage',
        'Avoid ratoon cotton cropping',
        'Destroy crop residue after harvest',
      ],
      season: ['kharif'],
      severityLevel: 'critical',
    },
    {
      name: 'Gram Pod Borer (Helicoverpa)',
      nameHindi: 'चना फली बेधक',
      type: 'pest',
      affectedCrops: ['chickpea', 'pigeonpea', 'soybean'],
      symptoms: 'Larvae boring into pods, circular holes in pods, fecal matter near entry holes, wilting of terminal shoots.',
      symptomsHindi: 'फलियों में गोल छेद, मल द्रव्य, अंकुर का मुरझाना।',
      treatments: [
        { method: 'chemical', productName: 'Indoxacarb 14.5 SC', dosage: '0.5 ml/L water', cost: 'Moderate', description: 'Spray at egg-laying stage' },
        { method: 'biological', productName: 'NPV (Nuclear Polyhedrosis Virus)', dosage: '250 LE/ha', cost: 'Low', description: 'Evening spray for larval control' },
      ],
      preventions: [
        'Install pheromone traps (5/acre) at flowering',
        'Spray Ha-NPV at 1% larval infestation',
        'Intercrop with coriander or fennel to attract natural enemies',
      ],
      season: ['rabi'],
      severityLevel: 'high',
    },
    {
      name: 'Wheat Yellow Rust (Stripe Rust)',
      nameHindi: 'गेहूँ पीला रतुआ',
      type: 'disease',
      affectedCrops: ['wheat'],
      symptoms: 'Yellow-orange pustules in stripes along leaf veins, white powdery mass on leaf, premature leaf death.',
      symptomsHindi: 'पत्तियों पर पीली-नारंगी धारियाँ, सफेद चूर्ण जैसा पदार्थ।',
      treatments: [
        { method: 'chemical', productName: 'Propiconazole 25 EC', dosage: '0.1% solution (1 ml/L)', cost: 'Low', description: 'Apply at first sign of infection' },
        { method: 'chemical', productName: 'Tebuconazole 25.9 EC', dosage: '1 ml/L water', cost: 'Low', description: 'Systemic fungicide — very effective' },
      ],
      preventions: [
        'Grow rust-resistant wheat varieties (HD-2967, WR-544)',
        'Avoid dense canopy and excessive nitrogen',
        'Spray preventively in cool, humid weather (Dec–Jan)',
        'Monitor fields weekly during January–February',
      ],
      season: ['rabi'],
      severityLevel: 'high',
    },
    {
      name: 'Stem Borer',
      nameHindi: 'तना बेधक',
      type: 'pest',
      affectedCrops: ['maize', 'sorghum', 'sugarcane'],
      symptoms: 'Dead heart in young plants, window-pane feeding on leaves, frass in whorls, broken tassels.',
      symptomsHindi: 'पौधे के तने में छेद, पत्तियों पर पारदर्शी धब्बे, डेड हर्ट।',
      treatments: [
        { method: 'chemical', productName: 'Carbofuran 3G', dosage: '10 kg/acre in whorls', cost: 'Low', description: 'Apply granules in whorls at 15 days' },
        { method: 'biological', productName: 'Trichogramma chilonis', dosage: '50,000 eggs/acre/week', cost: 'Very Low', description: 'Parasitoid of stem borer eggs' },
      ],
      preventions: [
        'Deep ploughing to destroy pupae',
        'Use Trichogramma cards from Krishi Vigyan Kendra',
        'Remove and destroy infected plants early',
      ],
      season: ['kharif'],
      severityLevel: 'medium',
    },
    {
      name: 'Whitefly',
      nameHindi: 'सफेद मक्खी',
      type: 'pest',
      affectedCrops: ['soybean', 'cotton', 'tomato', 'chilli'],
      symptoms: 'Tiny white insects on leaf undersides, yellowing and curling of leaves, honeydew and sooty mould on leaf surface.',
      symptomsHindi: 'पत्तियों की निचली सतह पर सफेद कीट, पत्तियों का पीला पड़ना।',
      treatments: [
        { method: 'chemical', productName: 'Imidacloprid 17.8 SL', dosage: '0.3 ml/L water', cost: 'Low', description: 'Systemic insecticide — highly effective' },
        { method: 'biological', productName: 'Neem oil + liquid soap', dosage: '5 ml neem + 2 ml soap/L', cost: 'Very Low', description: 'Homemade organic spray' },
        { method: 'trap', description: 'Yellow sticky traps — 10 per acre to monitor and trap adults' },
      ],
      preventions: [
        'Avoid water stress — whitefly thrives on stressed plants',
        'Install yellow sticky traps as early warning',
        'Intercrop with marigold as trap crop',
      ],
      season: ['kharif', 'rabi'],
      severityLevel: 'medium',
    },
  ]);
  console.log(`   ✓ ${pests.length} pest/disease records created.\n`);

  // ─── 6. Pest Outbreaks ────────────────────────────────────────────────────────
  console.log('🚨 Seeding pest outbreaks...');
  await PestOutbreak.bulkCreate([
    {
      pestId: pests[0].id, // YMV
      reportedBy: farmers[0].id,
      district: 'Indore',
      village: 'Sanwer',
      latitude: 22.9680,
      longitude: 75.8260,
      affectedAreaAcres: 5.0,
      crop: 'soybean',
      severity: 'high',
      description: 'Significant YMV spread reported in 3 adjacent fields. Whitefly population very high.',
      status: 'verified',
      reportedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
    {
      pestId: pests[1].id, // Pink Bollworm
      reportedBy: farmers[2].id,
      district: 'Ujjain',
      village: 'Nagda',
      latitude: 23.4510,
      longitude: 75.4145,
      affectedAreaAcres: 12.0,
      crop: 'cotton',
      severity: 'critical',
      description: 'Pink bollworm pheromone traps showing >15 moths/trap/week. Boll damage visible.',
      status: 'verified',
      reportedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
    {
      pestId: pests[4].id, // Stem Borer
      reportedBy: farmers[3].id,
      district: 'Dewas',
      village: 'Bagli',
      latitude: 22.9600,
      longitude: 76.0470,
      affectedAreaAcres: 2.0,
      crop: 'maize',
      severity: 'medium',
      description: 'Dead heart symptoms visible in ~20% of maize plants.',
      status: 'reported',
      reportedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
  ]);
  console.log('   ✓ 3 pest outbreaks created.\n');

  // ─── 7. Government Schemes ────────────────────────────────────────────────────
  console.log('📋 Seeding government schemes...');
  const schemes = await Scheme.bulkCreate([
    {
      code: 'PM-KISAN',
      name: 'PM Kisan Samman Nidhi',
      nameHindi: 'पीएम किसान सम्मान निधि',
      description: 'Income support of ₹6,000 per year in three equal installments to all land-holding farmer families.',
      descriptionHindi: 'सभी भूमिधारक किसान परिवारों को ₹6,000 प्रति वर्ष तीन समान किश्तों में आय सहायता।',
      ministry: 'Ministry of Agriculture & Farmers Welfare',
      benefit: '₹6,000 per year (₹2,000 per installment, 3 installments)',
      eligibilityCriteria: { maxLandAcres: 12, requiresBankAccount: true, requiresAadhaar: true },
      requiredDocuments: ['Aadhaar Card', 'Bank Passbook', 'Land Records (Khasra/Khatauni)', 'Mobile Number'],
      applicationUrl: 'https://pmkisan.gov.in',
      isActive: true,
    },
    {
      code: 'PMFBY',
      name: 'Pradhan Mantri Fasal Bima Yojana',
      nameHindi: 'प्रधानमंत्री फसल बीमा योजना',
      description: 'Crop insurance scheme providing financial support to farmers suffering crop loss/damage due to unforeseen events.',
      descriptionHindi: 'प्राकृतिक आपदाओं से फसल नुकसान पर वित्तीय सहायता।',
      ministry: 'Ministry of Agriculture & Farmers Welfare',
      benefit: 'Up to ₹2 lakh crop insurance coverage. Farmer pays only 1.5-2% premium for Rabi, 2% for Kharif.',
      eligibilityCriteria: { requiresBankAccount: true },
      requiredDocuments: ['Aadhaar Card', 'Bank Account', 'Land Records', 'Sowing Certificate'],
      applicationUrl: 'https://pmfby.gov.in',
      isActive: true,
    },
    {
      code: 'KCC',
      name: 'Kisan Credit Card',
      nameHindi: 'किसान क्रेडिट कार्ड',
      description: 'Provides adequate and timely credit to farmers for agriculture and allied activities at subsidized interest rates.',
      descriptionHindi: 'कृषि और संबद्ध गतिविधियों के लिए सब्सिडी वाले ब्याज दर पर ऋण।',
      ministry: 'Ministry of Finance / NABARD',
      benefit: 'Credit limit up to ₹3 lakh at 4% interest rate (with timely repayment). ATM card facility.',
      eligibilityCriteria: { requiresBankAccount: true, minLandAcres: 0.5 },
      requiredDocuments: ['Aadhaar Card', 'Land Records', 'Passport Photo', 'Bank Account', 'Income Certificate'],
      applicationUrl: 'https://www.nabard.org/content1.aspx?id=572',
      isActive: true,
    },
    {
      code: 'eNAM',
      name: 'National Agriculture Market (eNAM)',
      nameHindi: 'राष्ट्रीय कृषि बाजार (ई-नाम)',
      description: 'Online trading platform for agricultural commodities enabling farmers to sell produce at best prices across India.',
      descriptionHindi: 'किसानों को पूरे भारत में सर्वोत्तम मूल्य पर उपज बेचने के लिए ऑनलाइन मंडी।',
      ministry: 'Ministry of Agriculture & Farmers Welfare',
      benefit: 'Access to pan-India market, transparent price discovery, direct payment to bank account.',
      eligibilityCriteria: { requiresBankAccount: true },
      requiredDocuments: ['Aadhaar Card', 'Bank Passbook', 'Mobile Number', 'Mandi License (if applicable)'],
      applicationUrl: 'https://enam.gov.in/web/registration/farmer-registration',
      isActive: true,
    },
    {
      code: 'PMKSY',
      name: 'PM Krishi Sinchai Yojana',
      nameHindi: 'पीएम कृषि सिंचाई योजना',
      description: 'Ensures access to protective irrigation to all agricultural farms (Har Khet Ko Pani) and improves water use efficiency.',
      descriptionHindi: 'हर खेत को पानी और पानी का कुशल उपयोग।',
      ministry: 'Ministry of Jal Shakti',
      benefit: 'Subsidy up to 55% for small/marginal farmers on drip and sprinkler irrigation systems.',
      eligibilityCriteria: { maxLandAcres: 5 },
      requiredDocuments: ['Aadhaar Card', 'Land Records', 'Bank Account', 'Caste Certificate (if applicable)'],
      applicationUrl: 'https://pmksy.gov.in',
      isActive: true,
    },
  ]);
  console.log(`   ✓ ${schemes.length} government schemes created.\n`);

  // ─── 8. Scheme Applications ───────────────────────────────────────────────────
  console.log('📝 Seeding scheme applications...');
  await SchemeApplication.bulkCreate([
    {
      schemeId: schemes[0].id, // PM-KISAN
      farmerId: farmers[0].id,
      status: 'enrolled',
      referenceNumber: 'KM-PM-KISAN-R001',
      appliedAt: new Date('2023-06-15'),
      approvedAt: new Date('2023-07-01'),
      applicationData: { installmentsReceived: 3, totalReceived: 6000 },
    },
    {
      schemeId: schemes[2].id, // KCC
      farmerId: farmers[2].id,
      status: 'enrolled',
      referenceNumber: 'KM-KCC-V001',
      appliedAt: new Date('2023-03-10'),
      approvedAt: new Date('2023-04-05'),
      applicationData: { creditLimit: 150000, bankName: 'State Bank of India', branchName: 'Ujjain Main' },
    },
    {
      schemeId: schemes[1].id, // PMFBY
      farmerId: farmers[1].id,
      status: 'applied',
      referenceNumber: 'KM-PMFBY-S001',
      appliedAt: new Date(),
      applicationData: { crop: 'wheat', season: 'rabi', sumInsured: 75000 },
    },
  ]);
  console.log('   ✓ 3 scheme applications created.\n');

  // ─── 9. Sample Advisory ────────────────────────────────────────────────────────
  console.log('🌱 Seeding sample advisory...');
  const advisory = await Advisory.create({
    farmerId: farmers[0].id,
    landId: lands[0].id,
    season: 'kharif',
    year: 2024,
    soilData: { soilType: 'black', irrigationType: 'mixed' },
    status: 'viewed',
  });

  await CropRecommendation.bulkCreate([
    {
      advisoryId: advisory.id,
      rank: 1,
      cropName: 'soybean',
      cropNameHindi: 'सोयाबीन',
      suitabilityScore: 88,
      estimatedYieldPerAcre: 8,
      estimatedRevenue: 84000,
      reasons: ['Best suited for black cotton soil of MP', 'Rainfed crop — no irrigation dependency', 'Strong MSP support from government'],
      risks: ['Susceptible to yellow mosaic virus', 'Waterlogging causes root rot'],
      activities: [
        { week: 1, task: 'Seed treatment with fungicide + rhizobium', type: 'input' },
        { week: 2, task: 'Sowing at 45×5 cm spacing', type: 'field' },
        { week: 14, task: 'Harvest when pods turn brown', type: 'harvest' },
      ],
      sowingStart: '2024-06-15',
      harvestDate: '2024-09-20',
    },
    {
      advisoryId: advisory.id,
      rank: 2,
      cropName: 'cotton',
      cropNameHindi: 'कपास',
      suitabilityScore: 74,
      estimatedYieldPerAcre: 6,
      estimatedRevenue: 97500,
      reasons: ['High value cash crop', 'Black soil retains moisture well for cotton'],
      risks: ['Pink bollworm — major threat in MP', 'Long duration crop (180+ days)'],
      activities: [
        { week: 1, task: 'Bt cotton seed selection & treatment', type: 'input' },
        { week: 24, task: 'First picking when bolls open fully', type: 'harvest' },
      ],
      sowingStart: '2024-05-20',
      harvestDate: '2024-11-15',
    },
  ]);
  console.log('   ✓ 1 advisory with 2 crop recommendations created.\n');

  // ─── 10. Notifications ────────────────────────────────────────────────────────
  console.log('🔔 Seeding notifications...');
  await Notification.bulkCreate([
    {
      farmerId: farmers[0].id,
      type: 'pest',
      severity: 'high',
      title: 'YMV Alert in Your District',
      titleHindi: 'आपके जिले में YMV का प्रकोप',
      message: 'Yellow Mosaic Virus reported in 5 fields near Sanwer. Monitor your soybean crop daily.',
      messageHindi: 'सांवेर के पास 5 खेतों में YMV की सूचना। रोज अपनी सोयाबीन फसल की जांच करें।',
      isRead: false,
      metadata: { pestId: pests[0].id, district: 'Indore' },
    },
    {
      farmerId: farmers[0].id,
      type: 'weather',
      severity: 'medium',
      title: 'Heavy Rain Expected',
      titleHindi: 'भारी वर्षा की संभावना',
      message: 'IMD forecast: 50mm+ rainfall expected in next 48 hours. Ensure proper field drainage.',
      messageHindi: 'अगले 48 घंटों में 50mm+ बारिश की संभावना। खेत में जल निकासी सुनिश्चित करें।',
      isRead: false,
      metadata: { district: 'Indore' },
    },
    {
      farmerId: farmers[0].id,
      type: 'scheme',
      severity: 'info',
      title: 'PM-KISAN Installment Released',
      titleHindi: 'PM-KISAN की किश्त जारी',
      message: 'Your PM-KISAN installment of ₹2,000 has been released to your bank account.',
      messageHindi: '₹2,000 की PM-KISAN किश्त आपके बैंक खाते में जमा हो गई है।',
      isRead: true,
      readAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      metadata: { schemeCode: 'PM-KISAN', amount: 2000 },
    },
    {
      farmerId: farmers[0].id,
      type: 'market',
      severity: 'info',
      title: 'Soybean Price Up ₹120 in Indore',
      titleHindi: 'इंदौर में सोयाबीन ₹120 बढ़ा',
      message: 'Soybean prices in Indore Mandi rose by ₹120/quintal to ₹4,320 today.',
      messageHindi: 'आज इंदौर मंडी में सोयाबीन ₹120/क्विंटल बढ़कर ₹4,320 हो गया।',
      isRead: false,
      metadata: { crop: 'soybean', mandi: 'Indore', price: 4320 },
    },
  ]);
  console.log('   ✓ 4 notifications created.\n');

  console.log('═══════════════════════════════════════════════════');
  console.log('✅ KrishiMitra seed completed successfully!');
  console.log('');
  console.log('📌 Test credentials (all farmers):');
  console.log('   Password: krishimitra123');
  console.log('   Ramesh Patel   → phone: 9826012345');
  console.log('   Sunita Verma   → phone: 9425112233');
  console.log('   Vikram Chouhan → phone: 9301445566');
  console.log('   Meena Kushwaha → phone: 8109223344');
  console.log('═══════════════════════════════════════════════════\n');

  await sequelize.close();
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
