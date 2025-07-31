const OpenAI = require('openai');
const Report = require('../models/Report');
const Product = require('../models/Product');

class ReportService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    this.scoringWeights = {
      health: 0.30,
      sustainability: 0.25,
      ethics: 0.25,
      transparency: 0.20
    };

    this.healthCriteria = {
      ingredients: 0.25,
      nutrition: 0.20,
      safety: 0.25,
      allergens: 0.15,
      certifications: 0.15
    };

    this.sustainabilityCriteria = {
      packaging: 0.25,
      carbonFootprint: 0.20,
      sourcing: 0.20,
      waste: 0.15,
      energy: 0.20
    };

    this.ethicsCriteria = {
      labor: 0.30,
      animalWelfare: 0.25,
      fairTrade: 0.20,
      community: 0.25
    };

    this.transparencyCriteria = {
      informationAvailability: 0.30,
      sourceTraceability: 0.25,
      thirdPartyVerification: 0.25,
      documentation: 0.20
    };
  }

  async generateReport(productId, answers = {}) {
    try {
      const product = await Product.findById(productId);
      if (!product) {
        throw new Error('Product not found');
      }

      // Analyze different aspects
      const healthAnalysis = await this.analyzeHealth(product, answers);
      const sustainabilityAnalysis = await this.analyzeSustainability(product, answers);
      const ethicsAnalysis = await this.analyzeEthics(product, answers);
      const transparencyAnalysis = await this.analyzeTransparency(product, answers);

      // Calculate overall scores
      const overallScores = this.calculateOverallScores({
        healthAnalysis,
        sustainabilityAnalysis,
        ethicsAnalysis,
        transparencyAnalysis
      });

      // Generate insights and recommendations
      const insights = await this.generateInsights(product, {
        healthAnalysis,
        sustainabilityAnalysis,
        ethicsAnalysis,
        transparencyAnalysis
      });

      // Create report document
      const report = new Report({
        productId: product._id,
        ...overallScores,
        healthAnalysis,
        sustainabilityAnalysis,
        ethicsAnalysis,
        transparencyAnalysis,
        ...insights,
        dataSources: this.getDataSources(answers),
        analysisMethodology: 'AI-powered analysis combining user input, product data, and expert knowledge base',
        dataReliability: this.calculateDataReliability(product, answers),
        status: 'completed'
      });

      await report.save();

      // Update product with report reference
      product.reportGenerated = true;
      product.reportId = report._id;
      product.status = 'completed';
      await product.save();

      return report;
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  }

  async analyzeHealth(product, answers) {
    const healthAnswers = this.filterAnswersByCategory(answers, 'health');
    
    let nutritionalValue = 50; // Default score
    let safetyProfile = 50;
    let allergenWarnings = [];
    let healthBenefits = [];
    let healthConcerns = [];
    let recommendations = [];

    // Analyze ingredients
    if (product.ingredients && product.ingredients.length > 0) {
      const ingredientAnalysis = await this.analyzeIngredients(product.ingredients);
      safetyProfile = ingredientAnalysis.averageSafety;
      healthConcerns.push(...ingredientAnalysis.concerns);
    }

    // Analyze nutritional information
    if (product.nutritionalInfo) {
      nutritionalValue = this.scoreNutritionalValue(product.nutritionalInfo);
      const nutritionInsights = this.getNutritionalInsights(product.nutritionalInfo);
      healthBenefits.push(...nutritionInsights.benefits);
      healthConcerns.push(...nutritionInsights.concerns);
    }

    // Process allergen information
    if (product.allergens && product.allergens.length > 0) {
      allergenWarnings = product.allergens.map(allergen => 
        `Contains ${allergen} - may cause allergic reactions in sensitive individuals`
      );
    }

    // Incorporate user answers
    for (const answer of healthAnswers) {
      const analysisResult = await this.analyzeHealthAnswer(answer);
      if (analysisResult.impact > 0) {
        safetyProfile = Math.min(100, safetyProfile + analysisResult.impact);
      } else {
        safetyProfile = Math.max(0, safetyProfile + analysisResult.impact);
      }
      
      if (analysisResult.concerns) {
        healthConcerns.push(...analysisResult.concerns);
      }
      if (analysisResult.benefits) {
        healthBenefits.push(...analysisResult.benefits);
      }
    }

    const overallScore = Math.round(
      (nutritionalValue * this.healthCriteria.nutrition) +
      (safetyProfile * this.healthCriteria.safety) +
      (this.getIngredientScore(product.ingredients) * this.healthCriteria.ingredients) +
      (this.getAllergenScore(product.allergens) * this.healthCriteria.allergens) +
      (this.getCertificationScore(product.certifications, 'health') * this.healthCriteria.certifications)
    );

    // Generate recommendations
    recommendations = this.generateHealthRecommendations(overallScore, healthConcerns, product);

    return {
      overallScore: Math.max(0, Math.min(100, overallScore)),
      nutritionalValue: Math.max(0, Math.min(100, nutritionalValue)),
      safetyProfile: Math.max(0, Math.min(100, safetyProfile)),
      allergenWarnings,
      healthBenefits: [...new Set(healthBenefits)], // Remove duplicates
      healthConcerns: [...new Set(healthConcerns)],
      recommendations
    };
  }

  async analyzeSustainability(product, answers) {
    const sustainabilityAnswers = this.filterAnswersByCategory(answers, 'sustainability');
    
    let packagingScore = 50;
    let carbonFootprintScore = 50;
    let waterUsageScore = 50;
    let wasteReduction = 50;
    let biodiversityImpact = 50;
    let improvements = [];
    let strengths = [];

    // Analyze packaging
    if (product.sustainability?.recyclablePackaging) {
      packagingScore += 20;
      strengths.push('Uses recyclable packaging materials');
    }

    // Analyze sustainability metrics
    if (product.sustainability) {
      const sustainability = product.sustainability;
      
      if (sustainability.carbonFootprint) {
        carbonFootprintScore = this.scoreCarbonFootprint(sustainability.carbonFootprint);
      }
      
      if (sustainability.sustainableSourcing) {
        biodiversityImpact += 15;
        strengths.push('Committed to sustainable sourcing practices');
      }
      
      if (sustainability.ethicalLabor) {
        strengths.push('Maintains ethical labor standards');
      }
    }

    // Process sustainability answers
    for (const answer of sustainabilityAnswers) {
      const impact = await this.analyzeSustainabilityAnswer(answer);
      
      switch (answer.question.toLowerCase()) {
        case 'packaging':
          packagingScore += impact.score;
          if (impact.positive) strengths.push(...impact.positive);
          if (impact.negative) improvements.push(...impact.negative);
          break;
        case 'carbon footprint':
          carbonFootprintScore += impact.score;
          break;
        default:
          biodiversityImpact += impact.score * 0.5;
      }
    }

    const overallScore = Math.round(
      (packagingScore * this.sustainabilityCriteria.packaging) +
      (carbonFootprintScore * this.sustainabilityCriteria.carbonFootprint) +
      (biodiversityImpact * this.sustainabilityCriteria.sourcing) +
      (wasteReduction * this.sustainabilityCriteria.waste) +
      (waterUsageScore * this.sustainabilityCriteria.energy)
    );

    return {
      overallScore: Math.max(0, Math.min(100, overallScore)),
      packagingScore: Math.max(0, Math.min(100, packagingScore)),
      carbonFootprintScore: Math.max(0, Math.min(100, carbonFootprintScore)),
      waterUsageScore: Math.max(0, Math.min(100, waterUsageScore)),
      renewableEnergyUse: product.sustainability?.renewableEnergyUse || false,
      wasteReduction: Math.max(0, Math.min(100, wasteReduction)),
      biodiversityImpact: Math.max(0, Math.min(100, biodiversityImpact)),
      improvements: [...new Set(improvements)],
      strengths: [...new Set(strengths)]
    };
  }

  async analyzeEthics(product, answers) {
    const ethicsAnswers = this.filterAnswersByCategory(answers, 'ethics');
    
    let laborPractices = 50;
    let animalWelfare = 50;
    let environmentalImpact = 50;
    let corporateResponsibility = 50;
    let concerns = [];
    let positives = [];

    // Analyze existing product data
    if (product.sustainability?.ethicalLabor) {
      laborPractices += 20;
      positives.push('Company commits to ethical labor practices');
    }

    if (product.sustainability?.animalTesting === false) {
      animalWelfare = 90;
      positives.push('No animal testing conducted');
    } else if (product.sustainability?.animalTesting === true) {
      animalWelfare = 20;
      concerns.push('Product involves animal testing');
    }

    // Process ethics answers
    for (const answer of ethicsAnswers) {
      const impact = await this.analyzeEthicsAnswer(answer);
      
      laborPractices += impact.laborImpact || 0;
      animalWelfare += impact.animalImpact || 0;
      corporateResponsibility += impact.corporateImpact || 0;
      
      if (impact.concerns) concerns.push(...impact.concerns);
      if (impact.positives) positives.push(...impact.positives);
    }

    const fairTrade = this.checkFairTrade(product.certifications);
    
    const overallScore = Math.round(
      (laborPractices * this.ethicsCriteria.labor) +
      (animalWelfare * this.ethicsCriteria.animalWelfare) +
      (corporateResponsibility * this.ethicsCriteria.community) +
      ((fairTrade ? 80 : 40) * this.ethicsCriteria.fairTrade)
    );

    return {
      overallScore: Math.max(0, Math.min(100, overallScore)),
      laborPractices: Math.max(0, Math.min(100, laborPractices)),
      animalWelfare: Math.max(0, Math.min(100, animalWelfare)),
      environmentalImpact: Math.max(0, Math.min(100, environmentalImpact)),
      fairTrade,
      corporateResponsibility: Math.max(0, Math.min(100, corporateResponsibility)),
      concerns: [...new Set(concerns)],
      positives: [...new Set(positives)]
    };
  }

  async analyzeTransparency(product, answers) {
    const transparencyAnswers = this.filterAnswersByCategory(answers, 'transparency');
    
    let informationAvailability = 30; // Start low, build up
    let sourceTraceability = 30;
    let thirdPartyVerification = 30;
    let missingInformation = [];
    let availableDocumentation = [];

    // Analyze product data completeness
    const completenessScore = this.calculateProductDataCompleteness(product);
    informationAvailability += completenessScore * 0.7;

    // Check certifications for third-party verification
    if (product.certifications && product.certifications.length > 0) {
      thirdPartyVerification += 30;
      availableDocumentation.push(`${product.certifications.length} third-party certifications`);
    }

    // Check ingredient information
    if (product.ingredients && product.ingredients.length > 0) {
      sourceTraceability += 25;
      availableDocumentation.push('Detailed ingredient list');
    } else {
      missingInformation.push('Ingredient information not provided');
    }

    // Process transparency answers
    for (const answer of transparencyAnswers) {
      const impact = await this.analyzeTransparencyAnswer(answer);
      
      informationAvailability += impact.infoImpact || 0;
      sourceTraceability += impact.traceImpact || 0;
      thirdPartyVerification += impact.verificationImpact || 0;
      
      if (impact.missing) missingInformation.push(...impact.missing);
      if (impact.available) availableDocumentation.push(...impact.available);
    }

    const overallScore = Math.round(
      (informationAvailability * this.transparencyCriteria.informationAvailability) +
      (sourceTraceability * this.transparencyCriteria.sourceTraceability) +
      (thirdPartyVerification * this.transparencyCriteria.thirdPartyVerification) +
      (completenessScore * this.transparencyCriteria.documentation)
    );

    return {
      overallScore: Math.max(0, Math.min(100, overallScore)),
      informationAvailability: Math.max(0, Math.min(100, informationAvailability)),
      sourceTraceability: Math.max(0, Math.min(100, sourceTraceability)),
      thirdPartyVerification: Math.max(0, Math.min(100, thirdPartyVerification)),
      missingInformation: [...new Set(missingInformation)],
      availableDocumentation: [...new Set(availableDocumentation)]
    };
  }

  calculateOverallScores(analyses) {
    const { healthAnalysis, sustainabilityAnalysis, ethicsAnalysis, transparencyAnalysis } = analyses;
    
    const overallTransparencyScore = Math.round(
      (healthAnalysis.overallScore * this.scoringWeights.health) +
      (sustainabilityAnalysis.overallScore * this.scoringWeights.sustainability) +
      (ethicsAnalysis.overallScore * this.scoringWeights.ethics) +
      (transparencyAnalysis.overallScore * this.scoringWeights.transparency)
    );

    return {
      overallTransparencyScore,
      overallHealthScore: healthAnalysis.overallScore,
      overallEthicsScore: ethicsAnalysis.overallScore,
      overallSustainabilityScore: sustainabilityAnalysis.overallScore
    };
  }

  async generateInsights(product, analyses) {
    try {
      const prompt = `
        Based on this product analysis data:
        Product: ${product.name} by ${product.brand}
        Health Score: ${analyses.healthAnalysis.overallScore}
        Sustainability Score: ${analyses.sustainabilityAnalysis.overallScore}
        Ethics Score: ${analyses.ethicsAnalysis.overallScore}
        Transparency Score: ${analyses.transparencyAnalysis.overallScore}
        
        Generate:
        1. 3-5 key strengths
        2. 3-5 key concerns
        3. 5-7 actionable recommendations
        4. Overall recommendation level (highly_recommended, recommended, acceptable, caution, not_recommended)
        5. 2-3 alternative products (generic suggestions)
        
        Return as JSON with this structure:
        {
          "keyStrengths": ["strength1", "strength2"],
          "keyConcerns": ["concern1", "concern2"],
          "actionableRecommendations": ["rec1", "rec2"],
          "recommendationLevel": "level",
          "alternatives": ["alt1", "alt2"]
        }
      `;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert in product analysis and consumer health. Provide clear, actionable insights based on transparency data.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.6,
        max_tokens: 800
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('Error generating insights:', error);
      return this.getFallbackInsights(analyses);
    }
  }

  // Helper methods
  filterAnswersByCategory(answers, category) {
    return Object.values(answers).filter(answer => answer.category === category);
  }

  async analyzeIngredients(ingredients) {
    // Simplified ingredient analysis
    const totalIngredients = ingredients.length;
    const safetyRatings = ingredients.map(ing => ing.safetyRating || 5);
    const averageSafety = (safetyRatings.reduce((a, b) => a + b, 0) / totalIngredients) * 10;
    
    const concerns = ingredients
      .filter(ing => ing.healthConcerns && ing.healthConcerns.length > 0)
      .flatMap(ing => ing.healthConcerns);

    return { averageSafety, concerns };
  }

  scoreNutritionalValue(nutrition) {
    let score = 50;
    
    // Positive factors
    if (nutrition.protein && nutrition.protein > 10) score += 10;
    if (nutrition.fiber && nutrition.fiber > 5) score += 10;
    
    // Negative factors
    if (nutrition.sugar && nutrition.sugar > 20) score -= 15;
    if (nutrition.sodium && nutrition.sodium > 1000) score -= 10;
    if (nutrition.fat && nutrition.fat > 20) score -= 5;
    
    return Math.max(0, Math.min(100, score));
  }

  getNutritionalInsights(nutrition) {
    const benefits = [];
    const concerns = [];
    
    if (nutrition.protein > 15) benefits.push('High protein content supports muscle health');
    if (nutrition.fiber > 7) benefits.push('Good source of dietary fiber');
    if (nutrition.sugar > 25) concerns.push('High sugar content may impact blood glucose');
    if (nutrition.sodium > 1200) concerns.push('High sodium content may affect blood pressure');
    
    return { benefits, concerns };
  }

  async analyzeHealthAnswer(answer) {
    // Simplified analysis - in production, use more sophisticated NLP
    const positiveKeywords = ['organic', 'natural', 'healthy', 'certified', 'safe'];
    const negativeKeywords = ['artificial', 'chemical', 'processed', 'warning', 'risk'];
    
    let impact = 0;
    const concerns = [];
    const benefits = [];
    
    const answerText = answer.answer.toLowerCase();
    
    positiveKeywords.forEach(keyword => {
      if (answerText.includes(keyword)) {
        impact += 5;
        benefits.push(`Product contains ${keyword} elements`);
      }
    });
    
    negativeKeywords.forEach(keyword => {
      if (answerText.includes(keyword)) {
        impact -= 5;
        concerns.push(`Product may contain ${keyword} elements`);
      }
    });
    
    return { impact, concerns, benefits };
  }

  async analyzeSustainabilityAnswer(answer) {
    // Simplified sustainability analysis
    const answerText = answer.answer.toLowerCase();
    let score = 0;
    const positive = [];
    const negative = [];
    
    if (answerText.includes('recyclable')) {
      score += 15;
      positive.push('Uses recyclable packaging');
    }
    
    if (answerText.includes('plastic')) {
      score -= 10;
      negative.push('Consider reducing plastic packaging');
    }
    
    return { score, positive, negative };
  }

  async analyzeEthicsAnswer(answer) {
    // Simplified ethics analysis
    const answerText = answer.answer.toLowerCase();
    let laborImpact = 0;
    let animalImpact = 0;
    let corporateImpact = 0;
    const concerns = [];
    const positives = [];
    
    if (answerText.includes('fair trade')) {
      laborImpact += 15;
      corporateImpact += 10;
      positives.push('Fair trade certified');
    }
    
    if (answerText.includes('cruelty-free')) {
      animalImpact += 20;
      positives.push('Cruelty-free practices');
    }
    
    return { laborImpact, animalImpact, corporateImpact, concerns, positives };
  }

  async analyzeTransparencyAnswer(answer) {
    // Simplified transparency analysis
    const answerText = answer.answer.toLowerCase();
    let infoImpact = 0;
    let traceImpact = 0;
    let verificationImpact = 0;
    const missing = [];
    const available = [];
    
    if (answerText.includes('available') || answerText.includes('documented')) {
      infoImpact += 15;
      available.push('Documentation is available');
    }
    
    if (answerText.includes('traceable')) {
      traceImpact += 20;
      available.push('Supply chain is traceable');
    }
    
    if (answerText.includes('unknown') || answerText.includes('unavailable')) {
      infoImpact -= 10;
      missing.push('Information not publicly available');
    }
    
    return { infoImpact, traceImpact, verificationImpact, missing, available };
  }

  getIngredientScore(ingredients) {
    if (!ingredients || ingredients.length === 0) return 30;
    
    const naturalCount = ingredients.filter(ing => 
      ing.category && ing.category.toLowerCase().includes('natural')
    ).length;
    
    return Math.min(100, 40 + (naturalCount / ingredients.length) * 40);
  }

  getAllergenScore(allergens) {
    if (!allergens || allergens.length === 0) return 100;
    return Math.max(30, 100 - (allergens.length * 15));
  }

  getCertificationScore(certifications, type) {
    if (!certifications || certifications.length === 0) return 20;
    
    const relevantCerts = certifications.filter(cert => {
      const certName = cert.name.toLowerCase();
      switch (type) {
        case 'health':
          return certName.includes('fda') || certName.includes('health') || certName.includes('organic');
        case 'sustainability':
          return certName.includes('eco') || certName.includes('green') || certName.includes('sustainable');
        case 'ethics':
          return certName.includes('fair') || certName.includes('ethical') || certName.includes('cruelty');
        default:
          return true;
      }
    });
    
    return Math.min(100, 40 + (relevantCerts.length * 20));
  }

  scoreCarbonFootprint(footprint) {
    // Simplified scoring - lower is better
    if (footprint < 1) return 90;
    if (footprint < 5) return 70;
    if (footprint < 10) return 50;
    if (footprint < 20) return 30;
    return 10;
  }

  checkFairTrade(certifications) {
    if (!certifications) return false;
    return certifications.some(cert => 
      cert.name.toLowerCase().includes('fair trade') || 
      cert.name.toLowerCase().includes('fairtrade')
    );
  }

  calculateProductDataCompleteness(product) {
    const fields = [
      'name', 'brand', 'category', 'description', 'ingredients',
      'manufacturer', 'countryOfOrigin', 'certifications'
    ];
    
    const completedFields = fields.filter(field => {
      const value = product[field];
      return value && (typeof value !== 'object' || 
        (Array.isArray(value) && value.length > 0) ||
        (typeof value === 'object' && Object.keys(value).length > 0));
    }).length;
    
    return (completedFields / fields.length) * 100;
  }

  generateHealthRecommendations(score, concerns, product) {
    const recommendations = [];
    
    if (score < 50) {
      recommendations.push('Consider consulting healthcare provider before use');
    }
    
    if (concerns.length > 0) {
      recommendations.push('Review all ingredients for potential allergens');
    }
    
    if (product.allergens && product.allergens.length > 0) {
      recommendations.push('Check allergen warnings carefully');
    }
    
    recommendations.push('Use as directed and do not exceed recommended dosage');
    
    return recommendations;
  }

  getDataSources(answers) {
    const sources = ['Product labeling', 'User provided information'];
    
    if (Object.keys(answers).length > 0) {
      sources.push('User questionnaire responses');
    }
    
    sources.push('Industry databases', 'Regulatory information');
    
    return sources;
  }

  calculateDataReliability(product, answers) {
    let reliability = 50; // Base score
    
    // Boost for complete product data
    const completeness = this.calculateProductDataCompleteness(product);
    reliability += completeness * 0.3;
    
    // Boost for user answers
    const answerCount = Object.keys(answers).length;
    reliability += Math.min(20, answerCount * 3);
    
    // Boost for certifications
    if (product.certifications && product.certifications.length > 0) {
      reliability += product.certifications.length * 5;
    }
    
    return Math.min(100, reliability);
  }

  getFallbackInsights(analyses) {
    const avgScore = (
      analyses.healthAnalysis.overallScore +
      analyses.sustainabilityAnalysis.overallScore +
      analyses.ethicsAnalysis.overallScore +
      analyses.transparencyAnalysis.overallScore
    ) / 4;

    let recommendationLevel = 'acceptable';
    if (avgScore >= 80) recommendationLevel = 'highly_recommended';
    else if (avgScore >= 65) recommendationLevel = 'recommended';
    else if (avgScore < 40) recommendationLevel = 'caution';

    return {
      keyStrengths: ['Product information available', 'Meets basic standards'],
      keyConcerns: ['Limited transparency data', 'More information needed'],
      actionableRecommendations: [
        'Verify product certifications',
        'Check for additional product information',
        'Consider alternative products',
        'Consult healthcare provider if needed'
      ],
      recommendationLevel,
      alternatives: ['Similar products from certified brands', 'Organic alternatives']
    };
  }
}

module.exports = ReportService;