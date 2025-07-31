'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  AlertCircle,
  HelpCircle,
  Shield,
  Clock,
  Loader2
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { getQuestionsForCategory } from '@/lib/question-templates';
import type { QuestionConfig, Product } from '@/types';

interface QuestionResponse {
  questionId: string;
  answer: any;
  answerText: string;
  confidence?: number;
  source?: string;
  notes?: string;
}

export default function QuestionnairePage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [questions, setQuestions] = useState<QuestionConfig[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, QuestionResponse>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm();

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const progress = totalQuestions > 0 ? ((currentQuestionIndex + 1) / totalQuestions) * 100 : 0;
  const answeredQuestions = Object.keys(responses).length;

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  useEffect(() => {
    if (product) {
      const categoryQuestions = getQuestionsForCategory(product.category || '');
      setQuestions(categoryQuestions);
      setIsLoading(false);
    }
  }, [product]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${productId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch product');
      }
      const result = await response.json();
      setProduct(result.data);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to load product information');
      router.push('/products');
    }
  };

  const saveResponse = (data: any) => {
    if (!currentQuestion) return;

    const answerText = Array.isArray(data.answer) 
      ? data.answer.join(', ') 
      : String(data.answer || '');

    const response: QuestionResponse = {
      questionId: currentQuestion.id,
      answer: data.answer,
      answerText,
      confidence: data.confidence,
      source: data.source,
      notes: data.notes,
    };

    setResponses(prev => ({
      ...prev,
      [currentQuestion.id]: response
    }));
  };

  const handleNext = (data: any) => {
    saveResponse(data);
    
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      reset();
    } else {
      // Questionnaire completed
      handleSubmitQuestionnaire();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      // Pre-fill form with previous response
      const prevResponse = responses[questions[currentQuestionIndex - 1]?.id];
      if (prevResponse) {
        setValue('answer', prevResponse.answer);
        setValue('confidence', prevResponse.confidence);
        setValue('source', prevResponse.source);
        setValue('notes', prevResponse.notes);
      }
    }
  };

  const handleSubmitQuestionnaire = async () => {
    setIsSubmitting(true);
    
    try {
      // Save all responses to database
      const sessionResponse = await fetch('/api/questionnaire/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          userId: 'temp-user-id', // TODO: Replace with actual user ID
          responses: Object.values(responses),
          totalQuestions,
          answeredQuestions: Object.keys(responses).length,
        }),
      });

      if (!sessionResponse.ok) {
        throw new Error('Failed to save questionnaire');
      }

      const sessionResult = await sessionResponse.json();
      
      toast.success('Questionnaire completed! Generating your transparency report...');
      
      // Redirect to report generation
      router.push(`/products/${productId}/report`);
      
    } catch (error) {
      console.error('Error submitting questionnaire:', error);
      toast.error('Failed to submit questionnaire. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const shouldShowQuestion = (question: QuestionConfig): boolean => {
    if (!question.triggerConditions) return true;

    for (const [triggerQuestionId, condition] of Object.entries(question.triggerConditions)) {
      const triggerResponse = responses[triggerQuestionId];
      
      if (!triggerResponse) return false;

      // Check if has answer
      if (condition.hasAnswer && !triggerResponse.answer) {
        return false;
      }

      // Check excludes condition
      if (condition.excludes && Array.isArray(triggerResponse.answer)) {
        const hasExcluded = condition.excludes.some((excluded: string) => 
          triggerResponse.answer.includes(excluded)
        );
        if (hasExcluded) return false;
      }

      // Check includes condition
      if (condition.includes && Array.isArray(triggerResponse.answer)) {
        const hasIncluded = condition.includes.some((included: string) => 
          triggerResponse.answer.includes(included)
        );
        if (!hasIncluded) return false;
      }
    }

    return true;
  };

  const renderQuestionInput = () => {
    if (!currentQuestion) return null;

    switch (currentQuestion.type) {
      case 'text':
        return (
          <textarea
            {...register('answer', { 
              required: currentQuestion.required ? 'This field is required' : false 
            })}
            rows={4}
            placeholder={currentQuestion.placeholder}
            className="form-input"
          />
        );

      case 'select':
        return (
          <select
            {...register('answer', { 
              required: currentQuestion.required ? 'Please select an option' : false 
            })}
            className="form-input"
          >
            <option value="">Select an option...</option>
            {currentQuestion.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'multiselect':
        return (
          <div className="space-y-3">
            {currentQuestion.options?.map((option) => (
              <label key={option.value} className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  value={option.value}
                  {...register('answer')}
                  className="mt-1 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <div>
                  <div className="font-medium text-gray-900">{option.label}</div>
                  {option.description && (
                    <div className="text-sm text-gray-500">{option.description}</div>
                  )}
                </div>
              </label>
            ))}
          </div>
        );

      case 'boolean':
        return (
          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input
                type="radio"
                value="true"
                {...register('answer', { 
                  required: currentQuestion.required ? 'Please select an option' : false 
                })}
                className="text-primary focus:ring-primary"
              />
              <span>Yes</span>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="radio"
                value="false"
                {...register('answer')}
                className="text-primary focus:ring-primary"
              />
              <span>No</span>
            </label>
          </div>
        );

      case 'scale':
        return (
          <div className="space-y-4">
            <input
              type="range"
              min="1"
              max="10"
              {...register('answer')}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>1 (Poor)</span>
              <span>5 (Average)</span>
              <span>10 (Excellent)</span>
            </div>
          </div>
        );

      case 'number':
        return (
          <input
            type="number"
            {...register('answer', { 
              required: currentQuestion.required ? 'This field is required' : false 
            })}
            placeholder={currentQuestion.placeholder}
            className="form-input"
          />
        );

      default:
        return (
          <input
            type="text"
            {...register('answer', { 
              required: currentQuestion.required ? 'This field is required' : false 
            })}
            placeholder={currentQuestion.placeholder}
            className="form-input"
          />
        );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Loading questionnaire...</p>
        </div>
      </div>
    );
  }

  if (!product || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h1>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
          <Link href="/products" className="btn-primary">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link 
                href={`/products/${productId}`}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Product
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-primary" />
                <span className="font-semibold text-gray-900">Transparency Questionnaire</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                {answeredQuestions} / {totalQuestions} completed
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-medium text-gray-700">
                {product.name} - {product.brand}
              </h2>
              <span className="text-sm text-gray-500">
                {Math.round(progress)}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {currentQuestion && (
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-sm p-8"
            >
              <form onSubmit={handleSubmit(handleNext)}>
                {/* Question Header */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                        Question {currentQuestionIndex + 1} of {totalQuestions}
                      </span>
                      <span className="text-sm text-gray-500 capitalize">
                        {currentQuestion.category}
                      </span>
                    </div>
                    {currentQuestion.helpText && (
                      <button
                        type="button"
                        onClick={() => setShowHelp(!showHelp)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <HelpCircle className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                  
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {currentQuestion.title}
                  </h1>
                  <p className="text-gray-600 text-lg">
                    {currentQuestion.question}
                  </p>

                  {showHelp && currentQuestion.helpText && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200"
                    >
                      <div className="flex items-start space-x-2">
                        <HelpCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-blue-700">{currentQuestion.helpText}</p>
                      </div>
                    </motion.div>
                  )}

                  {currentQuestion.required && (
                    <p className="text-sm text-red-600 mt-2">
                      * This question is required
                    </p>
                  )}
                </div>

                {/* Question Input */}
                <div className="mb-8">
                  {renderQuestionInput()}
                  {errors.answer && (
                    <p className="form-error">{errors.answer.message}</p>
                  )}
                </div>

                {/* Additional Information */}
                <div className="space-y-4 mb-8">
                  <div>
                    <label className="form-label">
                      Confidence Level (Optional)
                    </label>
                    <select {...register('confidence')} className="form-input">
                      <option value="">Select confidence level...</option>
                      <option value="10">Very confident - I'm certain</option>
                      <option value="8">Confident - Pretty sure</option>
                      <option value="6">Somewhat confident - Reasonably sure</option>
                      <option value="4">Not very confident - Unsure</option>
                      <option value="2">Guessing - Not sure at all</option>
                    </select>
                  </div>

                  <div>
                    <label className="form-label">
                      Information Source (Optional)
                    </label>
                    <input
                      {...register('source')}
                      type="text"
                      placeholder="e.g., Product label, company website, personal experience..."
                      className="form-input"
                    />
                  </div>

                  <div>
                    <label className="form-label">
                      Additional Notes (Optional)
                    </label>
                    <textarea
                      {...register('notes')}
                      rows={2}
                      placeholder="Any additional information or context..."
                      className="form-input"
                    />
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handlePrevious}
                    disabled={currentQuestionIndex === 0}
                    className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </button>

                  <div className="text-sm text-gray-500">
                    {currentQuestionIndex + 1} of {totalQuestions}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating Report...
                      </>
                    ) : currentQuestionIndex === totalQuestions - 1 ? (
                      <>
                        Complete & Generate Report
                        <CheckCircle className="w-4 h-4 ml-2" />
                      </>
                    ) : (
                      <>
                        Next Question
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress Indicator */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 mb-4">
            Your responses help us generate a comprehensive transparency report
          </p>
          <div className="flex items-center justify-center space-x-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500">
              Estimated time remaining: {Math.max(1, Math.ceil((totalQuestions - currentQuestionIndex) * 0.5))} minutes
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}