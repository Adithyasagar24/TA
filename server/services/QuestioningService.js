const OpenAI = require('openai');

class QuestioningService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    
    this.questionCategories = {
      health: {
        weight: 0.25,
        questions: [
          'What are the main ingredients in this product?',
          'Does this product contain any allergens?',
          'What is the nutritional profile of this product?',
          'Are there any health warnings or precautions?',
          'What is the recommended serving size?'
        ]
      },
      sustainability: {
        weight: 0.25,
        questions: [
          'What type of packaging does this product use?',
          'Is the packaging recyclable or biodegradable?',
          'Where is this product manufactured?',
          'What is the carbon footprint of production?',
          'Are the ingredients sustainably sourced?'
        ]
      },
      ethics: {
        weight: 0.25,
        questions: [
          'What are the labor practices of the manufacturer?',
          'Does the company support fair trade practices?',
          'Is animal testing involved in product development?',
          'What is the company\'s stance on social responsibility?',
          'Are there any ethical certifications?'
        ]
      },
      transparency: {
        weight: 0.25,
        questions: [
          'How much information is publicly available about this product?',
          'Are third-party certifications or audits available?',
          'Can you trace the source of the main ingredients?',
          'Is the manufacturing process documented?',
          'Are there any independent reviews or studies?'
        ]
      }
    };
  }

  async generateInitialQuestions(productInfo) {
    try {
      const prompt = `
        Based on this product information: ${JSON.stringify(productInfo)}
        
        Generate 5 intelligent follow-up questions that would help create a comprehensive product transparency report. 
        Focus on gathering information about:
        1. Health and safety aspects
        2. Environmental sustainability
        3. Ethical manufacturing practices
        4. Information transparency
        
        Return the questions as a JSON array with this format:
        [
          {
            "question": "Question text",
            "category": "health|sustainability|ethics|transparency",
            "priority": "high|medium|low",
            "reasoning": "Why this question is important",
            "expectedAnswerType": "text|multiple_choice|yes_no|numeric"
          }
        ]
      `;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert in product transparency and consumer health. Generate intelligent, relevant questions to gather comprehensive product information.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      });

      const questions = JSON.parse(response.choices[0].message.content);
      return this.enhanceQuestions(questions, productInfo);
    } catch (error) {
      console.error('Error generating AI questions:', error);
      return this.getFallbackQuestions(productInfo);
    }
  }

  async generateFollowUpQuestions(productInfo, previousAnswers) {
    try {
      const prompt = `
        Product: ${JSON.stringify(productInfo)}
        Previous answers: ${JSON.stringify(previousAnswers)}
        
        Based on the product information and previous answers, generate 3-5 intelligent follow-up questions 
        that would help fill knowledge gaps and provide deeper insights for the transparency report.
        
        Prioritize questions in areas where information is missing or unclear.
        
        Return as JSON array with the same format as before.
      `;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert in product transparency. Generate targeted follow-up questions based on previous responses to maximize information quality.'
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
      console.error('Error generating follow-up questions:', error);
      return this.getContextualFallbackQuestions(productInfo, previousAnswers);
    }
  }

  enhanceQuestions(questions, productInfo) {
    return questions.map((q, index) => ({
      ...q,
      id: `q_${Date.now()}_${index}`,
      timestamp: new Date(),
      productCategory: productInfo.category,
      dynamicOptions: this.generateDynamicOptions(q, productInfo)
    }));
  }

  generateDynamicOptions(question, productInfo) {
    const category = productInfo.category?.toLowerCase();
    
    if (question.expectedAnswerType === 'multiple_choice') {
      switch (question.category) {
        case 'health':
          if (category === 'food') {
            return ['Organic', 'Non-GMO', 'Gluten-Free', 'Dairy-Free', 'Vegan', 'None of the above'];
          }
          return ['FDA Approved', 'Dermatologist Tested', 'Hypoallergenic', 'Natural', 'Chemical-Free', 'None of the above'];
        
        case 'sustainability':
          return ['Recyclable', 'Biodegradable', 'Compostable', 'Made from recycled materials', 'Minimal packaging', 'Not environmentally friendly'];
        
        case 'ethics':
          return ['Fair Trade Certified', 'Cruelty-Free', 'B-Corp Certified', 'Ethical sourcing', 'Local production', 'Unknown/No certification'];
        
        default:
          return ['Yes', 'No', 'Partially', 'Unknown'];
      }
    }
    return null;
  }

  getFallbackQuestions(productInfo) {
    const category = productInfo.category?.toLowerCase() || 'general';
    const baseQuestions = [];
    
    // Health questions
    baseQuestions.push({
      id: 'health_1',
      question: 'What are the main active ingredients in this product?',
      category: 'health',
      priority: 'high',
      reasoning: 'Understanding ingredients is crucial for health assessment',
      expectedAnswerType: 'text'
    });

    // Sustainability questions
    baseQuestions.push({
      id: 'sustainability_1',
      question: 'What type of packaging materials are used?',
      category: 'sustainability',
      priority: 'high',
      reasoning: 'Packaging impact is a key sustainability factor',
      expectedAnswerType: 'multiple_choice',
      dynamicOptions: ['Plastic', 'Glass', 'Cardboard', 'Metal', 'Biodegradable', 'Mixed materials']
    });

    // Ethics questions
    baseQuestions.push({
      id: 'ethics_1',
      question: 'Does the company have any ethical certifications?',
      category: 'ethics',
      priority: 'medium',
      reasoning: 'Certifications indicate commitment to ethical practices',
      expectedAnswerType: 'multiple_choice',
      dynamicOptions: this.generateDynamicOptions({ category: 'ethics', expectedAnswerType: 'multiple_choice' }, productInfo)
    });

    // Transparency questions
    baseQuestions.push({
      id: 'transparency_1',
      question: 'Is detailed ingredient sourcing information available?',
      category: 'transparency',
      priority: 'high',
      reasoning: 'Ingredient transparency is fundamental to consumer trust',
      expectedAnswerType: 'yes_no'
    });

    return baseQuestions;
  }

  getContextualFallbackQuestions(productInfo, previousAnswers) {
    const answeredCategories = new Set(
      Object.values(previousAnswers).map(answer => answer.category)
    );

    const unansweredCategories = Object.keys(this.questionCategories)
      .filter(cat => !answeredCategories.has(cat));

    return unansweredCategories.map(category => ({
      id: `fallback_${category}`,
      question: this.questionCategories[category].questions[0],
      category,
      priority: 'medium',
      reasoning: `Need information about ${category} for complete assessment`,
      expectedAnswerType: 'text'
    }));
  }

  analyzeCompleteness(productInfo, answers) {
    const categories = Object.keys(this.questionCategories);
    const answeredCategories = new Set(
      Object.values(answers).map(answer => answer.category)
    );

    const completeness = {
      overall: (answeredCategories.size / categories.length) * 100,
      byCategory: {}
    };

    categories.forEach(category => {
      completeness.byCategory[category] = answeredCategories.has(category) ? 100 : 0;
    });

    return completeness;
  }

  recommendNextQuestions(productInfo, answers) {
    const completeness = this.analyzeCompleteness(productInfo, answers);
    const recommendations = [];

    // Find categories with low completion
    Object.entries(completeness.byCategory).forEach(([category, score]) => {
      if (score < 100) {
        recommendations.push({
          category,
          priority: score === 0 ? 'high' : 'medium',
          reason: `No information collected for ${category}`,
          suggestedQuestions: this.questionCategories[category].questions.slice(0, 2)
        });
      }
    });

    return recommendations;
  }
}

module.exports = QuestioningService;