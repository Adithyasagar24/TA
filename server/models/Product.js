const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  purpose: String,
  safetyRating: { type: Number, min: 1, max: 10 },
  healthConcerns: [String],
  sources: [String]
});

const certificationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  issuedBy: { type: String, required: true },
  validUntil: Date,
  verificationUrl: String
});

const sustainabilitySchema = new mongoose.Schema({
  carbonFootprint: Number,
  recyclablePackaging: Boolean,
  sustainableSourcing: Boolean,
  ethicalLabor: Boolean,
  animalTesting: Boolean,
  score: { type: Number, min: 0, max: 100 }
});

const productSchema = new mongoose.Schema({
  // Basic Information
  name: { type: String, required: true },
  brand: { type: String, required: true },
  category: { type: String, required: true },
  subCategory: String,
  description: String,
  
  // Product Details
  barcode: String,
  weight: Number,
  volume: Number,
  servingSize: String,
  
  // Ingredients & Composition
  ingredients: [ingredientSchema],
  allergens: [String],
  nutritionalInfo: {
    calories: Number,
    protein: Number,
    carbohydrates: Number,
    fat: Number,
    sugar: Number,
    sodium: Number,
    fiber: Number
  },
  
  // Manufacturing & Origin
  manufacturer: String,
  countryOfOrigin: String,
  manufacturingDate: Date,
  expiryDate: Date,
  
  // Health & Safety
  healthScore: { type: Number, min: 0, max: 100 },
  safetyWarnings: [String],
  ageRestrictions: String,
  medicalConditionWarnings: [String],
  
  // Certifications & Standards
  certifications: [certificationSchema],
  regulatoryApprovals: [String],
  
  // Sustainability & Ethics
  sustainability: sustainabilitySchema,
  
  // Transparency Metrics
  transparencyScore: { type: Number, min: 0, max: 100 },
  informationCompleteness: { type: Number, min: 0, max: 100 },
  
  // User Interaction Data
  questionsAnswered: [String],
  reportGenerated: { type: Boolean, default: false },
  reportId: { type: mongoose.Schema.Types.ObjectId, ref: 'Report' },
  
  // Metadata
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  userId: String,
  status: { 
    type: String, 
    enum: ['draft', 'in_progress', 'completed'], 
    default: 'draft' 
  }
});

// Indexes for better query performance
productSchema.index({ name: 'text', brand: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ barcode: 1 });
productSchema.index({ createdAt: -1 });

// Pre-save middleware to update timestamps
productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Product', productSchema);