import { QuestionConfig } from '@/types';

// Base questions that apply to all products
export const baseQuestions: QuestionConfig[] = [
  {
    id: 'basic-ingredients',
    title: 'Ingredients & Composition',
    question: 'What are the main ingredients or materials in this product? Please list them in order of prominence.',
    type: 'text',
    category: 'ingredients',
    priority: 1,
    required: true,
    helpText: 'Include all ingredients you can find on the label, or main materials for non-food products.',
    placeholder: 'e.g., Organic almonds, filtered water, sea salt, natural vanilla extract...',
    followUpQuestions: ['ingredient-sources', 'preservatives-additives'],
  },
  {
    id: 'ingredient-sources',
    title: 'Ingredient Sourcing',
    question: 'Do you know where the main ingredients or materials come from?',
    type: 'text',
    category: 'ingredients',
    priority: 2,
    required: false,
    helpText: 'Information about country of origin, farming practices, or manufacturing location.',
    placeholder: 'e.g., Almonds from California, organic farms, etc.',
    triggerConditions: { 'basic-ingredients': { hasAnswer: true } },
  },
  {
    id: 'preservatives-additives',
    title: 'Preservatives & Additives',
    question: 'Does this product contain any preservatives, artificial colors, flavors, or other additives?',
    type: 'multiselect',
    category: 'ingredients',
    priority: 3,
    required: false,
    options: [
      { value: 'artificial-colors', label: 'Artificial Colors' },
      { value: 'artificial-flavors', label: 'Artificial Flavors' },
      { value: 'preservatives', label: 'Preservatives' },
      { value: 'stabilizers', label: 'Stabilizers/Emulsifiers' },
      { value: 'sweeteners', label: 'Artificial Sweeteners' },
      { value: 'none', label: 'None of the above' },
      { value: 'unknown', label: 'Unknown/Not sure' },
    ],
    triggerConditions: { 'basic-ingredients': { hasAnswer: true } },
    followUpQuestions: ['additive-concerns'],
  },
  {
    id: 'additive-concerns',
    title: 'Additive Concerns',
    question: 'Are there any specific additives in this product that concern you or that you try to avoid?',
    type: 'text',
    category: 'ingredients',
    priority: 4,
    required: false,
    helpText: 'Common concerns include MSG, high fructose corn syrup, trans fats, parabens, sulfates, etc.',
    triggerConditions: { 
      'preservatives-additives': { 
        excludes: ['none', 'unknown'] 
      } 
    },
  },
  {
    id: 'packaging-material',
    title: 'Packaging Information',
    question: 'What type of packaging does this product use?',
    type: 'multiselect',
    category: 'sustainability',
    priority: 2,
    required: false,
    options: [
      { value: 'plastic', label: 'Plastic container/bottle' },
      { value: 'glass', label: 'Glass container' },
      { value: 'metal', label: 'Metal can/container' },
      { value: 'cardboard', label: 'Cardboard box' },
      { value: 'paper', label: 'Paper packaging' },
      { value: 'biodegradable', label: 'Biodegradable materials' },
      { value: 'minimal', label: 'Minimal packaging' },
      { value: 'excessive', label: 'Excessive packaging' },
    ],
    followUpQuestions: ['packaging-recyclability'],
  },
  {
    id: 'packaging-recyclability',
    title: 'Packaging Recyclability',
    question: 'Is the packaging recyclable or environmentally friendly?',
    type: 'select',
    category: 'sustainability',
    priority: 3,
    required: false,
    options: [
      { value: 'fully-recyclable', label: 'Fully recyclable' },
      { value: 'partially-recyclable', label: 'Partially recyclable' },
      { value: 'not-recyclable', label: 'Not recyclable' },
      { value: 'biodegradable', label: 'Biodegradable/compostable' },
      { value: 'unknown', label: 'Unknown' },
    ],
    triggerConditions: { 'packaging-material': { hasAnswer: true } },
  },
  {
    id: 'ethical-certifications',
    title: 'Certifications & Standards',
    question: 'Does this product have any certifications or ethical labels?',
    type: 'multiselect',
    category: 'ethics',
    priority: 2,
    required: false,
    options: [
      { value: 'organic', label: 'Organic certified' },
      { value: 'fair-trade', label: 'Fair Trade' },
      { value: 'non-gmo', label: 'Non-GMO' },
      { value: 'cruelty-free', label: 'Cruelty-free' },
      { value: 'vegan', label: 'Vegan certified' },
      { value: 'sustainable', label: 'Sustainability certification' },
      { value: 'local', label: 'Locally sourced/made' },
      { value: 'b-corp', label: 'B-Corp certified' },
      { value: 'none', label: 'No certifications visible' },
    ],
  },
  {
    id: 'company-practices',
    title: 'Company Ethics',
    question: 'What do you know about the company\'s ethical practices and values?',
    type: 'text',
    category: 'ethics',
    priority: 3,
    required: false,
    helpText: 'Information about labor practices, environmental commitments, social responsibility, etc.',
    placeholder: 'e.g., Known for sustainable practices, supports local communities, etc.',
  },
];

// Food & Beverage specific questions
export const foodQuestions: QuestionConfig[] = [
  {
    id: 'nutrition-facts',
    title: 'Nutritional Information',
    question: 'Can you provide the key nutritional information per serving?',
    type: 'text',
    category: 'nutrition',
    priority: 1,
    required: false,
    helpText: 'Include calories, protein, carbs, fat, sugar, sodium, fiber, etc.',
    placeholder: 'e.g., 150 calories, 8g protein, 12g carbs, 2g sugar, 180mg sodium...',
  },
  {
    id: 'allergens',
    title: 'Allergen Information',
    question: 'Does this product contain or was it processed in facilities with common allergens?',
    type: 'multiselect',
    category: 'health',
    priority: 1,
    required: false,
    options: [
      { value: 'dairy', label: 'Dairy/Milk' },
      { value: 'eggs', label: 'Eggs' },
      { value: 'nuts', label: 'Tree nuts' },
      { value: 'peanuts', label: 'Peanuts' },
      { value: 'soy', label: 'Soy' },
      { value: 'wheat', label: 'Wheat/Gluten' },
      { value: 'shellfish', label: 'Shellfish' },
      { value: 'fish', label: 'Fish' },
      { value: 'none', label: 'None listed' },
    ],
  },
  {
    id: 'dietary-restrictions',
    title: 'Dietary Compatibility',
    question: 'Is this product suitable for specific dietary needs?',
    type: 'multiselect',
    category: 'health',
    priority: 2,
    required: false,
    options: [
      { value: 'vegetarian', label: 'Vegetarian' },
      { value: 'vegan', label: 'Vegan' },
      { value: 'gluten-free', label: 'Gluten-free' },
      { value: 'dairy-free', label: 'Dairy-free' },
      { value: 'keto', label: 'Keto-friendly' },
      { value: 'paleo', label: 'Paleo-friendly' },
      { value: 'low-sodium', label: 'Low sodium' },
      { value: 'sugar-free', label: 'Sugar-free' },
    ],
  },
  {
    id: 'expiration-freshness',
    title: 'Freshness & Storage',
    question: 'How fresh is this product and how should it be stored?',
    type: 'text',
    category: 'safety',
    priority: 2,
    required: false,
    helpText: 'Include expiration date, storage requirements, and any freshness indicators.',
    placeholder: 'e.g., Expires in 2 weeks, refrigerate after opening, etc.',
  },
  {
    id: 'processing-level',
    title: 'Processing Level',
    question: 'How processed is this food product?',
    type: 'select',
    category: 'health',
    priority: 2,
    required: false,
    options: [
      { value: 'whole-food', label: 'Whole food/minimally processed' },
      { value: 'lightly-processed', label: 'Lightly processed' },
      { value: 'moderately-processed', label: 'Moderately processed' },
      { value: 'highly-processed', label: 'Highly processed' },
      { value: 'ultra-processed', label: 'Ultra-processed' },
      { value: 'unknown', label: 'Unknown' },
    ],
  },
];

// Personal Care & Beauty specific questions
export const personalCareQuestions: QuestionConfig[] = [
  {
    id: 'skin-safety',
    title: 'Skin Safety',
    question: 'Does this product contain any ingredients that might be harsh on skin?',
    type: 'multiselect',
    category: 'health',
    priority: 1,
    required: false,
    options: [
      { value: 'sulfates', label: 'Sulfates (SLS/SLES)' },
      { value: 'parabens', label: 'Parabens' },
      { value: 'alcohol', label: 'Drying alcohols' },
      { value: 'fragrances', label: 'Artificial fragrances' },
      { value: 'essential-oils', label: 'Essential oils' },
      { value: 'acids', label: 'Strong acids (AHA/BHA)' },
      { value: 'retinoids', label: 'Retinoids' },
      { value: 'none', label: 'None of the above' },
    ],
  },
  {
    id: 'skin-type-suitability',
    title: 'Skin Type Suitability',
    question: 'What skin types is this product designed for?',
    type: 'multiselect',
    category: 'health',
    priority: 2,
    required: false,
    options: [
      { value: 'all-skin-types', label: 'All skin types' },
      { value: 'sensitive', label: 'Sensitive skin' },
      { value: 'dry', label: 'Dry skin' },
      { value: 'oily', label: 'Oily skin' },
      { value: 'combination', label: 'Combination skin' },
      { value: 'acne-prone', label: 'Acne-prone skin' },
      { value: 'mature', label: 'Mature skin' },
    ],
  },
  {
    id: 'testing-practices',
    title: 'Animal Testing',
    question: 'What is the animal testing status of this product and brand?',
    type: 'select',
    category: 'ethics',
    priority: 1,
    required: false,
    options: [
      { value: 'cruelty-free-certified', label: 'Certified cruelty-free' },
      { value: 'claims-cruelty-free', label: 'Claims to be cruelty-free' },
      { value: 'tests-on-animals', label: 'Tests on animals' },
      { value: 'sells-in-china', label: 'Sells in China (required testing)' },
      { value: 'unknown', label: 'Unknown' },
    ],
  },
  {
    id: 'natural-synthetic',
    title: 'Natural vs Synthetic',
    question: 'Is this product marketed as natural, organic, or synthetic?',
    type: 'select',
    category: 'ingredients',
    priority: 2,
    required: false,
    options: [
      { value: 'certified-organic', label: 'Certified organic' },
      { value: 'natural', label: 'Natural/plant-based' },
      { value: 'mixed', label: 'Mix of natural and synthetic' },
      { value: 'synthetic', label: 'Primarily synthetic' },
      { value: 'unknown', label: 'Unknown' },
    ],
  },
];

// Electronics specific questions
export const electronicsQuestions: QuestionConfig[] = [
  {
    id: 'conflict-minerals',
    title: 'Conflict Minerals',
    question: 'Does the company disclose information about conflict minerals in their supply chain?',
    type: 'select',
    category: 'ethics',
    priority: 1,
    required: false,
    options: [
      { value: 'conflict-free-certified', label: 'Certified conflict-free' },
      { value: 'reports-compliance', label: 'Reports on compliance' },
      { value: 'no-disclosure', label: 'No disclosure found' },
      { value: 'unknown', label: 'Unknown' },
    ],
  },
  {
    id: 'repairability',
    title: 'Repairability',
    question: 'How repairable is this product?',
    type: 'select',
    category: 'sustainability',
    priority: 1,
    required: false,
    options: [
      { value: 'highly-repairable', label: 'Highly repairable (parts/service available)' },
      { value: 'moderately-repairable', label: 'Moderately repairable' },
      { value: 'difficult-to-repair', label: 'Difficult to repair' },
      { value: 'not-repairable', label: 'Not repairable/disposable' },
      { value: 'unknown', label: 'Unknown' },
    ],
  },
  {
    id: 'energy-efficiency',
    title: 'Energy Efficiency',
    question: 'What is the energy efficiency rating or power consumption of this product?',
    type: 'text',
    category: 'sustainability',
    priority: 2,
    required: false,
    helpText: 'Include Energy Star rating, power consumption, or battery life information.',
    placeholder: 'e.g., Energy Star certified, 15W power consumption, etc.',
  },
  {
    id: 'end-of-life',
    title: 'End-of-Life Management',
    question: 'Does the manufacturer provide recycling or take-back programs?',
    type: 'select',
    category: 'sustainability',
    priority: 2,
    required: false,
    options: [
      { value: 'comprehensive-program', label: 'Comprehensive take-back program' },
      { value: 'limited-program', label: 'Limited recycling program' },
      { value: 'no-program', label: 'No specific program' },
      { value: 'unknown', label: 'Unknown' },
    ],
  },
];

// Clothing & Textiles specific questions
export const clothingQuestions: QuestionConfig[] = [
  {
    id: 'fabric-composition',
    title: 'Fabric Composition',
    question: 'What materials and fabrics is this item made from?',
    type: 'text',
    category: 'ingredients',
    priority: 1,
    required: false,
    helpText: 'Include percentages if known (e.g., 80% cotton, 20% polyester)',
    placeholder: 'e.g., 100% organic cotton, recycled polyester blend, etc.',
  },
  {
    id: 'manufacturing-location',
    title: 'Manufacturing Location',
    question: 'Where was this product manufactured?',
    type: 'text',
    category: 'ethics',
    priority: 1,
    required: false,
    helpText: 'Country or region of manufacturing',
    placeholder: 'e.g., Made in Bangladesh, USA, etc.',
  },
  {
    id: 'labor-standards',
    title: 'Labor Standards',
    question: 'What do you know about the labor practices in the manufacturing of this item?',
    type: 'select',
    category: 'ethics',
    priority: 1,
    required: false,
    options: [
      { value: 'fair-trade-certified', label: 'Fair trade certified' },
      { value: 'ethical-manufacturing', label: 'Claims ethical manufacturing' },
      { value: 'fast-fashion', label: 'Fast fashion brand' },
      { value: 'unknown', label: 'Unknown' },
    ],
  },
  {
    id: 'durability',
    title: 'Durability & Quality',
    question: 'How would you rate the expected durability and quality of this item?',
    type: 'select',
    category: 'sustainability',
    priority: 2,
    required: false,
    options: [
      { value: 'high-quality', label: 'High quality, built to last' },
      { value: 'good-quality', label: 'Good quality' },
      { value: 'average-quality', label: 'Average quality' },
      { value: 'low-quality', label: 'Low quality, disposable' },
      { value: 'unknown', label: 'Unknown' },
    ],
  },
  {
    id: 'care-instructions',
    title: 'Care Instructions',
    question: 'What are the care instructions for this item?',
    type: 'multiselect',
    category: 'sustainability',
    priority: 3,
    required: false,
    options: [
      { value: 'machine-wash-cold', label: 'Machine wash cold' },
      { value: 'hand-wash', label: 'Hand wash only' },
      { value: 'dry-clean', label: 'Dry clean only' },
      { value: 'air-dry', label: 'Air dry' },
      { value: 'tumble-dry', label: 'Tumble dry' },
      { value: 'iron-required', label: 'Requires ironing' },
    ],
  },
];

export const getQuestionsForCategory = (category: string): QuestionConfig[] => {
  const baseQs = [...baseQuestions];
  
  switch (category?.toLowerCase()) {
    case 'food & beverages':
      return [...baseQs, ...foodQuestions];
    case 'personal care & beauty':
      return [...baseQs, ...personalCareQuestions];
    case 'electronics':
      return [...baseQs, ...electronicsQuestions];
    case 'clothing & textiles':
      return [...baseQs, ...clothingQuestions];
    default:
      return baseQs;
  }
};

export const getAllQuestions = (): QuestionConfig[] => {
  return [
    ...baseQuestions,
    ...foodQuestions,
    ...personalCareQuestions,
    ...electronicsQuestions,
    ...clothingQuestions,
  ];
};