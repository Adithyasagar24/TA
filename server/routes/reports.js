const express = require('express');
const Joi = require('joi');
const Report = require('../models/Report');
const Product = require('../models/Product');
const ReportService = require('../services/ReportService');
const router = express.Router();

const reportService = new ReportService();

// Validation schema for report generation
const generateReportSchema = Joi.object({
  productId: Joi.string().required(),
  answers: Joi.object().default({}),
  customCriteria: Joi.array().items(Joi.string()),
  personalizedNotes: Joi.string().max(1000)
});

// POST /api/reports/generate - Generate a new transparency report
router.post('/generate', async (req, res) => {
  try {
    // Validate request body
    const { error, value } = generateReportSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: error.details 
      });
    }

    const { productId, answers, customCriteria, personalizedNotes } = value;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if report already exists for this product
    if (product.reportGenerated && product.reportId) {
      const existingReport = await Report.findById(product.reportId);
      if (existingReport) {
        return res.status(409).json({ 
          error: 'Report already exists for this product',
          reportId: existingReport._id,
          reportNumber: existingReport.reportNumber
        });
      }
    }

    // Generate the report
    const report = await reportService.generateReport(productId, answers);

    // Add custom criteria and notes if provided
    if (customCriteria) {
      report.customCriteria = customCriteria;
    }
    if (personalizedNotes) {
      report.personalizedNotes = personalizedNotes;
    }
    
    await report.save();

    res.status(201).json({
      message: 'Report generated successfully',
      report: {
        id: report._id,
        reportNumber: report.reportNumber,
        overallTransparencyScore: report.overallTransparencyScore,
        overallHealthScore: report.overallHealthScore,
        overallEthicsScore: report.overallEthicsScore,
        overallSustainabilityScore: report.overallSustainabilityScore,
        recommendationLevel: report.recommendationLevel,
        generatedAt: report.generatedAt,
        status: report.status
      }
    });
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

// GET /api/reports - Get all reports with optional filtering
router.get('/', async (req, res) => {
  try {
    const {
      userId,
      status,
      recommendationLevel,
      minTransparencyScore,
      page = 1,
      limit = 10,
      sortBy = 'generatedAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};
    if (userId) filter.userId = userId;
    if (status) filter.status = status;
    if (recommendationLevel) filter.recommendationLevel = recommendationLevel;
    if (minTransparencyScore) {
      filter.overallTransparencyScore = { $gte: parseInt(minTransparencyScore) };
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query
    const reports = await Report.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('productId', 'name brand category')
      .select('reportNumber overallTransparencyScore overallHealthScore overallEthicsScore overallSustainabilityScore recommendationLevel generatedAt status productId');

    const total = await Report.countDocuments(filter);

    res.json({
      reports,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

// GET /api/reports/:id - Get a specific report by ID
router.get('/:id', async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('productId');

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    res.json(report);
  } catch (error) {
    console.error('Error fetching report:', error);
    res.status(500).json({ error: 'Failed to fetch report' });
  }
});

// GET /api/reports/number/:reportNumber - Get report by report number
router.get('/number/:reportNumber', async (req, res) => {
  try {
    const report = await Report.findOne({ reportNumber: req.params.reportNumber })
      .populate('productId');

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    res.json(report);
  } catch (error) {
    console.error('Error fetching report:', error);
    res.status(500).json({ error: 'Failed to fetch report' });
  }
});

// GET /api/reports/product/:productId - Get report for a specific product
router.get('/product/:productId', async (req, res) => {
  try {
    const report = await Report.findOne({ productId: req.params.productId })
      .populate('productId')
      .sort({ generatedAt: -1 }); // Get the most recent report

    if (!report) {
      return res.status(404).json({ error: 'No report found for this product' });
    }

    res.json(report);
  } catch (error) {
    console.error('Error fetching product report:', error);
    res.status(500).json({ error: 'Failed to fetch product report' });
  }
});

// POST /api/reports/:id/regenerate - Regenerate an existing report
router.post('/:id/regenerate', async (req, res) => {
  try {
    const { answers } = req.body;
    
    const existingReport = await Report.findById(req.params.id);
    if (!existingReport) {
      return res.status(404).json({ error: 'Report not found' });
    }

    // Generate new report
    const newReport = await reportService.generateReport(
      existingReport.productId, 
      answers || {}
    );

    // Archive the old report
    existingReport.status = 'archived';
    await existingReport.save();

    // Update product reference
    await Product.findByIdAndUpdate(existingReport.productId, {
      reportId: newReport._id,
      updatedAt: new Date()
    });

    res.json({
      message: 'Report regenerated successfully',
      newReport: {
        id: newReport._id,
        reportNumber: newReport.reportNumber,
        overallTransparencyScore: newReport.overallTransparencyScore,
        status: newReport.status
      },
      previousReportId: existingReport._id
    });
  } catch (error) {
    console.error('Error regenerating report:', error);
    res.status(500).json({ error: 'Failed to regenerate report' });
  }
});

// PATCH /api/reports/:id - Update report with additional information
router.patch('/:id', async (req, res) => {
  try {
    const allowedUpdates = ['personalizedNotes', 'customCriteria', 'targetAudience'];
    const updates = {};
    
    // Filter to only allowed updates
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No valid updates provided' });
    }

    updates.lastUpdated = new Date();

    const report = await Report.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    res.json({
      message: 'Report updated successfully',
      report
    });
  } catch (error) {
    console.error('Error updating report:', error);
    res.status(500).json({ error: 'Failed to update report' });
  }
});

// GET /api/reports/:id/summary - Get executive summary of report
router.get('/:id/summary', async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('productId', 'name brand category');

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    const summary = {
      reportNumber: report.reportNumber,
      productName: report.productId.name,
      productBrand: report.productId.brand,
      productCategory: report.productId.category,
      generatedAt: report.generatedAt,
      overallScores: {
        transparency: report.overallTransparencyScore,
        health: report.overallHealthScore,
        ethics: report.overallEthicsScore,
        sustainability: report.overallSustainabilityScore
      },
      recommendationLevel: report.recommendationLevel,
      keyStrengths: report.keyStrengths?.slice(0, 3) || [],
      keyConcerns: report.keyConcerns?.slice(0, 3) || [],
      topRecommendations: report.actionableRecommendations?.slice(0, 3) || [],
      dataReliability: report.dataReliability,
      status: report.status
    };

    res.json(summary);
  } catch (error) {
    console.error('Error getting report summary:', error);
    res.status(500).json({ error: 'Failed to get report summary' });
  }
});

// GET /api/reports/:id/export - Export report in various formats
router.get('/:id/export', async (req, res) => {
  try {
    const { format = 'json' } = req.query;
    
    const report = await Report.findById(req.params.id)
      .populate('productId');

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    switch (format.toLowerCase()) {
      case 'json':
        res.json(report);
        break;
      
      case 'summary':
        const summaryData = generateReportSummary(report);
        res.json(summaryData);
        break;
      
      case 'csv':
        const csvData = generateCSVData(report);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="report-${report.reportNumber}.csv"`);
        res.send(csvData);
        break;
      
      default:
        res.status(400).json({ error: 'Unsupported export format' });
    }
  } catch (error) {
    console.error('Error exporting report:', error);
    res.status(500).json({ error: 'Failed to export report' });
  }
});

// GET /api/reports/analytics/overview - Get analytics overview
router.get('/analytics/overview', async (req, res) => {
  try {
    const { timeframe = '30d' } = req.query;
    
    // Calculate date range
    const now = new Date();
    let startDate;
    
    switch (timeframe) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Aggregate data
    const analytics = await Report.aggregate([
      {
        $match: {
          generatedAt: { $gte: startDate },
          status: 'completed'
        }
      },
      {
        $group: {
          _id: null,
          totalReports: { $sum: 1 },
          avgTransparencyScore: { $avg: '$overallTransparencyScore' },
          avgHealthScore: { $avg: '$overallHealthScore' },
          avgEthicsScore: { $avg: '$overallEthicsScore' },
          avgSustainabilityScore: { $avg: '$overallSustainabilityScore' },
          recommendationLevels: { $push: '$recommendationLevel' }
        }
      }
    ]);

    const result = analytics[0] || {
      totalReports: 0,
      avgTransparencyScore: 0,
      avgHealthScore: 0,
      avgEthicsScore: 0,
      avgSustainabilityScore: 0,
      recommendationLevels: []
    };

    // Count recommendation levels
    const recommendationCounts = result.recommendationLevels.reduce((acc, level) => {
      acc[level] = (acc[level] || 0) + 1;
      return acc;
    }, {});

    res.json({
      timeframe,
      totalReports: result.totalReports,
      averageScores: {
        transparency: Math.round(result.avgTransparencyScore || 0),
        health: Math.round(result.avgHealthScore || 0),
        ethics: Math.round(result.avgEthicsScore || 0),
        sustainability: Math.round(result.avgSustainabilityScore || 0)
      },
      recommendationDistribution: recommendationCounts,
      generatedAt: new Date()
    });
  } catch (error) {
    console.error('Error getting analytics:', error);
    res.status(500).json({ error: 'Failed to get analytics' });
  }
});

// Helper functions
function generateReportSummary(report) {
  return {
    reportNumber: report.reportNumber,
    product: {
      name: report.productId.name,
      brand: report.productId.brand,
      category: report.productId.category
    },
    scores: {
      overall: report.overallTransparencyScore,
      health: report.overallHealthScore,
      ethics: report.overallEthicsScore,
      sustainability: report.overallSustainabilityScore
    },
    recommendation: report.recommendationLevel,
    keyFindings: {
      strengths: report.keyStrengths,
      concerns: report.keyConcerns,
      recommendations: report.actionableRecommendations
    },
    metadata: {
      generatedAt: report.generatedAt,
      dataReliability: report.dataReliability,
      version: report.version
    }
  };
}

function generateCSVData(report) {
  const product = report.productId;
  const rows = [
    ['Report Number', 'Product Name', 'Brand', 'Category', 'Transparency Score', 'Health Score', 'Ethics Score', 'Sustainability Score', 'Recommendation', 'Generated At'],
    [
      report.reportNumber,
      product.name,
      product.brand,
      product.category,
      report.overallTransparencyScore,
      report.overallHealthScore,
      report.overallEthicsScore,
      report.overallSustainabilityScore,
      report.recommendationLevel,
      report.generatedAt.toISOString()
    ]
  ];

  return rows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
}

module.exports = router;