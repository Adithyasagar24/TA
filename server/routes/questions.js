const express = require('express');
const Joi = require('joi');
const Product = require('../models/Product');
const QuestioningService = require('../services/QuestioningService');
const router = express.Router();

const questioningService = new QuestioningService();

// Validation schema for answer submission
const answerSchema = Joi.object({
  questionId: Joi.string().required(),
  question: Joi.string().required(),
  answer: Joi.alternatives().try(
    Joi.string(),
    Joi.array().items(Joi.string()),
    Joi.number(),
    Joi.boolean()
  ).required(),
  category: Joi.string().valid('health', 'sustainability', 'ethics', 'transparency').required(),
  confidence: Joi.number().min(0).max(100),
  additionalNotes: Joi.string().max(500)
});

// POST /api/questions/generate - Generate initial questions for a product
router.post('/generate', async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    // Get product information
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Generate questions based on product info
    const questions = await questioningService.generateInitialQuestions({
      name: product.name,
      brand: product.brand,
      category: product.category,
      description: product.description,
      ingredients: product.ingredients,
      allergens: product.allergens,
      certifications: product.certifications
    });

    res.json({
      productId,
      questions,
      totalQuestions: questions.length,
      estimatedTime: questions.length * 2, // 2 minutes per question estimate
      categories: [...new Set(questions.map(q => q.category))]
    });
  } catch (error) {
    console.error('Error generating questions:', error);
    res.status(500).json({ error: 'Failed to generate questions' });
  }
});

// POST /api/questions/follow-up - Generate follow-up questions based on previous answers
router.post('/follow-up', async (req, res) => {
  try {
    const { productId, previousAnswers } = req.body;

    if (!productId || !previousAnswers) {
      return res.status(400).json({ 
        error: 'Product ID and previous answers are required' 
      });
    }

    // Get product information
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Generate follow-up questions
    const followUpQuestions = await questioningService.generateFollowUpQuestions(
      {
        name: product.name,
        brand: product.brand,
        category: product.category,
        description: product.description,
        ingredients: product.ingredients
      },
      previousAnswers
    );

    // Analyze completeness
    const completeness = questioningService.analyzeCompleteness(product, previousAnswers);
    
    // Get recommendations for next questions
    const recommendations = questioningService.recommendNextQuestions(product, previousAnswers);

    res.json({
      productId,
      followUpQuestions,
      completeness,
      recommendations,
      suggestedNextSteps: generateNextSteps(completeness, recommendations)
    });
  } catch (error) {
    console.error('Error generating follow-up questions:', error);
    res.status(500).json({ error: 'Failed to generate follow-up questions' });
  }
});

// POST /api/questions/answer - Submit answer to a question
router.post('/answer', async (req, res) => {
  try {
    // Validate answer data
    const { error, value } = answerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: error.details 
      });
    }

    const { productId } = req.query;
    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    // Find and update product with the answer
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Add question ID to answered questions if not already present
    if (!product.questionsAnswered.includes(value.questionId)) {
      product.questionsAnswered.push(value.questionId);
      product.status = 'in_progress';
      await product.save();
    }

    res.json({
      message: 'Answer recorded successfully',
      questionId: value.questionId,
      category: value.category,
      productStatus: product.status,
      totalAnswered: product.questionsAnswered.length
    });
  } catch (error) {
    console.error('Error recording answer:', error);
    res.status(500).json({ error: 'Failed to record answer' });
  }
});

// GET /api/questions/progress/:productId - Get answering progress for a product
router.get('/progress/:productId', async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Calculate progress metrics
    const totalAnswered = product.questionsAnswered.length;
    const estimatedTotal = 15; // Estimated total questions for complete analysis
    const progressPercentage = Math.min(100, (totalAnswered / estimatedTotal) * 100);

    // Determine readiness for report generation
    const isReadyForReport = totalAnswered >= 8; // Minimum 8 answers for meaningful report
    const completenessScore = (totalAnswered / estimatedTotal) * 100;

    res.json({
      productId: product._id,
      productName: product.name,
      totalAnswered,
      estimatedTotal,
      progressPercentage: Math.round(progressPercentage),
      completenessScore: Math.round(completenessScore),
      isReadyForReport,
      status: product.status,
      lastUpdated: product.updatedAt,
      categories: {
        health: getAnsweredCountByCategory(product, 'health'),
        sustainability: getAnsweredCountByCategory(product, 'sustainability'),
        ethics: getAnsweredCountByCategory(product, 'ethics'),
        transparency: getAnsweredCountByCategory(product, 'transparency')
      }
    });
  } catch (error) {
    console.error('Error getting progress:', error);
    res.status(500).json({ error: 'Failed to get progress' });
  }
});

// POST /api/questions/batch-answer - Submit multiple answers at once
router.post('/batch-answer', async (req, res) => {
  try {
    const { productId, answers } = req.body;

    if (!productId || !answers || !Array.isArray(answers)) {
      return res.status(400).json({ 
        error: 'Product ID and answers array are required' 
      });
    }

    // Validate each answer
    const validationErrors = [];
    const validAnswers = [];

    answers.forEach((answer, index) => {
      const { error, value } = answerSchema.validate(answer);
      if (error) {
        validationErrors.push({ index, errors: error.details });
      } else {
        validAnswers.push(value);
      }
    });

    if (validationErrors.length > 0) {
      return res.status(400).json({ 
        error: 'Validation failed for some answers',
        validationErrors 
      });
    }

    // Update product with answers
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Add new question IDs to answered questions
    const newQuestionIds = validAnswers
      .map(answer => answer.questionId)
      .filter(id => !product.questionsAnswered.includes(id));

    product.questionsAnswered.push(...newQuestionIds);
    product.status = 'in_progress';
    await product.save();

    res.json({
      message: 'Answers recorded successfully',
      totalProcessed: validAnswers.length,
      newAnswers: newQuestionIds.length,
      totalAnswered: product.questionsAnswered.length,
      productStatus: product.status
    });
  } catch (error) {
    console.error('Error recording batch answers:', error);
    res.status(500).json({ error: 'Failed to record answers' });
  }
});

// GET /api/questions/suggestions/:productId - Get suggested questions based on category gaps
router.get('/suggestions/:productId', async (req, res) => {
  try {
    const { category, priority } = req.query;
    const product = await Product.findById(req.params.productId);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Get base suggestions from service
    const recommendations = questioningService.recommendNextQuestions(product, {});
    
    let suggestions = recommendations;

    // Filter by category if specified
    if (category) {
      suggestions = suggestions.filter(rec => rec.category === category);
    }

    // Filter by priority if specified
    if (priority) {
      suggestions = suggestions.filter(rec => rec.priority === priority);
    }

    res.json({
      productId: product._id,
      suggestions,
      filters: { category, priority },
      totalSuggestions: suggestions.length
    });
  } catch (error) {
    console.error('Error getting suggestions:', error);
    res.status(500).json({ error: 'Failed to get suggestions' });
  }
});

// GET /api/questions/categories - Get available question categories and their descriptions
router.get('/categories', (req, res) => {
  try {
    const categories = {
      health: {
        name: 'Health & Safety',
        description: 'Questions about ingredients, nutrition, allergens, and health impacts',
        color: '#e74c3c',
        icon: 'heart',
        weight: 0.30,
        expectedQuestions: 4
      },
      sustainability: {
        name: 'Sustainability',
        description: 'Environmental impact, packaging, carbon footprint, and resource usage',
        color: '#27ae60',
        icon: 'leaf',
        weight: 0.25,
        expectedQuestions: 4
      },
      ethics: {
        name: 'Ethics & Social Impact',
        description: 'Labor practices, fair trade, animal welfare, and corporate responsibility',
        color: '#9b59b6',
        icon: 'users',
        weight: 0.25,
        expectedQuestions: 3
      },
      transparency: {
        name: 'Transparency',
        description: 'Information availability, traceability, and third-party verification',
        color: '#3498db',
        icon: 'eye',
        weight: 0.20,
        expectedQuestions: 4
      }
    };

    res.json({
      categories,
      totalWeight: Object.values(categories).reduce((sum, cat) => sum + cat.weight, 0),
      totalExpectedQuestions: Object.values(categories).reduce((sum, cat) => sum + cat.expectedQuestions, 0)
    });
  } catch (error) {
    console.error('Error getting categories:', error);
    res.status(500).json({ error: 'Failed to get categories' });
  }
});

// Helper functions
function generateNextSteps(completeness, recommendations) {
  const steps = [];
  
  if (completeness.overall < 50) {
    steps.push('Continue answering questions to improve analysis quality');
  }
  
  if (completeness.overall >= 50 && completeness.overall < 80) {
    steps.push('Focus on categories with low completion for comprehensive insights');
  }
  
  if (completeness.overall >= 80) {
    steps.push('Ready to generate detailed transparency report');
  }

  // Add specific recommendations
  recommendations.forEach(rec => {
    if (rec.priority === 'high') {
      steps.push(`Priority: Answer questions about ${rec.category}`);
    }
  });

  return steps;
}

function getAnsweredCountByCategory(product, category) {
  // This is a simplified implementation
  // In a real app, you'd store answers with categories and count them
  const totalByCategory = {
    health: 4,
    sustainability: 4,
    ethics: 3,
    transparency: 4
  };
  
  const estimatedAnswered = Math.min(
    totalByCategory[category], 
    Math.floor(product.questionsAnswered.length / 4)
  );
  
  return {
    answered: estimatedAnswered,
    total: totalByCategory[category],
    percentage: Math.round((estimatedAnswered / totalByCategory[category]) * 100)
  };
}

module.exports = router;