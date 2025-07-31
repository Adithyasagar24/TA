const express = require('express');
const Joi = require('joi');
const Product = require('../models/Product');
const router = express.Router();

// Validation schemas
const productSchema = Joi.object({
  name: Joi.string().required().max(200),
  brand: Joi.string().required().max(100),
  category: Joi.string().required().max(50),
  subCategory: Joi.string().max(50),
  description: Joi.string().max(1000),
  barcode: Joi.string().max(50),
  weight: Joi.number().positive(),
  volume: Joi.number().positive(),
  servingSize: Joi.string().max(50),
  manufacturer: Joi.string().max(100),
  countryOfOrigin: Joi.string().max(50),
  manufacturingDate: Joi.date(),
  expiryDate: Joi.date(),
  allergens: Joi.array().items(Joi.string()),
  nutritionalInfo: Joi.object({
    calories: Joi.number().min(0),
    protein: Joi.number().min(0),
    carbohydrates: Joi.number().min(0),
    fat: Joi.number().min(0),
    sugar: Joi.number().min(0),
    sodium: Joi.number().min(0),
    fiber: Joi.number().min(0)
  }),
  ingredients: Joi.array().items(Joi.object({
    name: Joi.string().required(),
    category: Joi.string().required(),
    purpose: Joi.string(),
    safetyRating: Joi.number().min(1).max(10),
    healthConcerns: Joi.array().items(Joi.string()),
    sources: Joi.array().items(Joi.string())
  })),
  certifications: Joi.array().items(Joi.object({
    name: Joi.string().required(),
    issuedBy: Joi.string().required(),
    validUntil: Joi.date(),
    verificationUrl: Joi.string().uri()
  })),
  sustainability: Joi.object({
    carbonFootprint: Joi.number().min(0),
    recyclablePackaging: Joi.boolean(),
    sustainableSourcing: Joi.boolean(),
    ethicalLabor: Joi.boolean(),
    animalTesting: Joi.boolean(),
    score: Joi.number().min(0).max(100)
  }),
  userId: Joi.string()
});

// GET /api/products - Get all products with optional filtering
router.get('/', async (req, res) => {
  try {
    const { 
      category, 
      brand, 
      status, 
      userId,
      page = 1, 
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};
    if (category) filter.category = new RegExp(category, 'i');
    if (brand) filter.brand = new RegExp(brand, 'i');
    if (status) filter.status = status;
    if (userId) filter.userId = userId;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query
    const products = await Product.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('reportId', 'reportNumber overallTransparencyScore status');

    const total = await Product.countDocuments(filter);

    res.json({
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// GET /api/products/:id - Get a specific product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('reportId');

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// POST /api/products - Create a new product
router.post('/', async (req, res) => {
  try {
    // Validate request body
    const { error, value } = productSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: error.details 
      });
    }

    // Create new product
    const product = new Product(value);
    await product.save();

    res.status(201).json({
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// PUT /api/products/:id - Update a product
router.put('/:id', async (req, res) => {
  try {
    // Validate request body
    const { error, value } = productSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: error.details 
      });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { ...value, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// PATCH /api/products/:id - Partially update a product
router.patch('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// DELETE /api/products/:id - Delete a product
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// GET /api/products/:id/completeness - Get product data completeness analysis
router.get('/:id/completeness', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Analyze data completeness
    const fields = [
      'name', 'brand', 'category', 'description', 'ingredients',
      'manufacturer', 'countryOfOrigin', 'certifications', 
      'nutritionalInfo', 'allergens', 'sustainability'
    ];

    const completeness = {};
    let totalScore = 0;

    fields.forEach(field => {
      const value = product[field];
      let isComplete = false;

      if (value) {
        if (Array.isArray(value)) {
          isComplete = value.length > 0;
        } else if (typeof value === 'object') {
          isComplete = Object.keys(value).length > 0;
        } else {
          isComplete = true;
        }
      }

      completeness[field] = isComplete;
      if (isComplete) totalScore++;
    });

    const overallCompleteness = (totalScore / fields.length) * 100;

    res.json({
      overallCompleteness: Math.round(overallCompleteness),
      fieldCompleteness: completeness,
      missingFields: fields.filter(field => !completeness[field]),
      recommendations: generateCompletenessRecommendations(completeness)
    });
  } catch (error) {
    console.error('Error analyzing completeness:', error);
    res.status(500).json({ error: 'Failed to analyze completeness' });
  }
});

// POST /api/products/search - Advanced search products
router.post('/search', async (req, res) => {
  try {
    const { 
      query, 
      filters = {}, 
      page = 1, 
      limit = 10 
    } = req.body;

    let searchQuery = {};

    // Text search
    if (query) {
      searchQuery.$or = [
        { name: new RegExp(query, 'i') },
        { brand: new RegExp(query, 'i') },
        { description: new RegExp(query, 'i') },
        { category: new RegExp(query, 'i') }
      ];
    }

    // Apply filters
    if (filters.category) searchQuery.category = filters.category;
    if (filters.brand) searchQuery.brand = new RegExp(filters.brand, 'i');
    if (filters.minHealthScore) {
      searchQuery.healthScore = { $gte: filters.minHealthScore };
    }
    if (filters.hasReport) {
      searchQuery.reportGenerated = filters.hasReport;
    }
    if (filters.allergens) {
      if (filters.allergens.exclude) {
        searchQuery.allergens = { $nin: filters.allergens.exclude };
      }
      if (filters.allergens.include) {
        searchQuery.allergens = { $in: filters.allergens.include };
      }
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const products = await Product.find(searchQuery)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('reportId', 'reportNumber overallTransparencyScore');

    const total = await Product.countDocuments(searchQuery);

    res.json({
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total
      },
      searchQuery: query,
      appliedFilters: filters
    });
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({ error: 'Failed to search products' });
  }
});

// Helper function to generate completeness recommendations
function generateCompletenessRecommendations(completeness) {
  const recommendations = [];
  
  if (!completeness.ingredients) {
    recommendations.push('Add detailed ingredient list for better health analysis');
  }
  
  if (!completeness.nutritionalInfo) {
    recommendations.push('Include nutritional information for comprehensive health scoring');
  }
  
  if (!completeness.certifications) {
    recommendations.push('Add any third-party certifications to improve transparency');
  }
  
  if (!completeness.sustainability) {
    recommendations.push('Provide sustainability information for environmental impact analysis');
  }
  
  if (!completeness.manufacturer) {
    recommendations.push('Include manufacturer information for supply chain transparency');
  }

  return recommendations;
}

module.exports = router;