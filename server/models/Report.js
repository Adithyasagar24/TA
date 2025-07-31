const mongoose = require('mongoose');

const healthAnalysisSchema = new mongoose.Schema({
  overallScore: { type: Number, min: 0, max: 100 },
  nutritionalValue: { type: Number, min: 0, max: 100 },
  safetyProfile: { type: Number, min: 0, max: 100 },
  allergenWarnings: [String],
  healthBenefits: [String],
  healthConcerns: [String],
  recommendations: [String]
});

const ethicsAnalysisSchema = new mongoose.Schema({
  overallScore: { type: Number, min: 0, max: 100 },
  laborPractices: { type: Number, min: 0, max: 100 },
  animalWelfare: { type: Number, min: 0, max: 100 },
  environmentalImpact: { type: Number, min: 0, max: 100 },
  fairTrade: Boolean,
  corporateResponsibility: { type: Number, min: 0, max: 100 },
  concerns: [String],
  positives: [String]
});

const sustainabilityAnalysisSchema = new mongoose.Schema({
  overallScore: { type: Number, min: 0, max: 100 },
  packagingScore: { type: Number, min: 0, max: 100 },
  carbonFootprintScore: { type: Number, min: 0, max: 100 },
  waterUsageScore: { type: Number, min: 0, max: 100 },
  renewableEnergyUse: Boolean,
  wasteReduction: { type: Number, min: 0, max: 100 },
  biodiversityImpact: { type: Number, min: 0, max: 100 },
  improvements: [String],
  strengths: [String]
});

const transparencyAnalysisSchema = new mongoose.Schema({
  overallScore: { type: Number, min: 0, max: 100 },
  informationAvailability: { type: Number, min: 0, max: 100 },
  sourceTraceability: { type: Number, min: 0, max: 100 },
  thirdPartyVerification: { type: Number, min: 0, max: 100 },
  missingInformation: [String],
  availableDocumentation: [String]
});

const reportSchema = new mongoose.Schema({
  // Associated Product
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  },
  
  // Report Metadata
  reportNumber: { type: String, unique: true, required: true },
  generatedAt: { type: Date, default: Date.now },
  version: { type: String, default: '1.0' },
  
  // Overall Scores
  overallTransparencyScore: { type: Number, min: 0, max: 100 },
  overallHealthScore: { type: Number, min: 0, max: 100 },
  overallEthicsScore: { type: Number, min: 0, max: 100 },
  overallSustainabilityScore: { type: Number, min: 0, max: 100 },
  
  // Detailed Analysis
  healthAnalysis: healthAnalysisSchema,
  ethicsAnalysis: ethicsAnalysisSchema,
  sustainabilityAnalysis: sustainabilityAnalysisSchema,
  transparencyAnalysis: transparencyAnalysisSchema,
  
  // Key Findings
  keyStrengths: [String],
  keyConcerns: [String],
  actionableRecommendations: [String],
  
  // Decision Support
  recommendationLevel: {
    type: String,
    enum: ['highly_recommended', 'recommended', 'acceptable', 'caution', 'not_recommended']
  },
  targetAudience: [String], // e.g., ['health_conscious', 'environmentally_aware', 'general_consumer']
  alternatives: [String],
  
  // Compliance & Certifications
  complianceStatus: {
    fda: Boolean,
    usda: Boolean,
    epa: Boolean,
    organic: Boolean,
    fairTrade: Boolean,
    other: [String]
  },
  
  // Data Sources & Methodology
  dataSources: [String],
  analysisMethodology: String,
  lastUpdated: { type: Date, default: Date.now },
  dataReliability: { type: Number, min: 0, max: 100 },
  
  // User Context
  userId: String,
  customCriteria: [String],
  personalizedNotes: String,
  
  // Report Status
  status: {
    type: String,
    enum: ['generating', 'completed', 'updated', 'archived'],
    default: 'generating'
  }
});

// Generate unique report number
reportSchema.pre('save', function(next) {
  if (!this.reportNumber) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    this.reportNumber = `TR-${timestamp}-${random}`.toUpperCase();
  }
  next();
});

// Indexes
reportSchema.index({ productId: 1 });
reportSchema.index({ reportNumber: 1 });
reportSchema.index({ generatedAt: -1 });
reportSchema.index({ overallTransparencyScore: -1 });

module.exports = mongoose.model('Report', reportSchema);