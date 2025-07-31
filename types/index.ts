import { 
  products, 
  users, 
  questionTemplates, 
  questionnaireSessions, 
  questionResponses, 
  transparencyReports,
  productCategories 
} from '@/lib/schema';

// Database types
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type QuestionTemplate = typeof questionTemplates.$inferSelect;
export type NewQuestionTemplate = typeof questionTemplates.$inferInsert;

export type QuestionnaireSession = typeof questionnaireSessions.$inferSelect;
export type NewQuestionnaireSession = typeof questionnaireSessions.$inferInsert;

export type QuestionResponse = typeof questionResponses.$inferSelect;
export type NewQuestionResponse = typeof questionResponses.$inferInsert;

export type TransparencyReport = typeof transparencyReports.$inferSelect;
export type NewTransparencyReport = typeof transparencyReports.$inferInsert;

export type ProductCategory = typeof productCategories.$inferSelect;
export type NewProductCategory = typeof productCategories.$inferInsert;

// Question types
export type QuestionType = 'text' | 'select' | 'multiselect' | 'boolean' | 'number' | 'scale' | 'date' | 'file';

export interface QuestionOption {
  value: string;
  label: string;
  description?: string;
}

export interface QuestionConfig {
  id: string;
  title: string;
  question: string;
  type: QuestionType;
  options?: QuestionOption[];
  category: string;
  priority: number;
  required: boolean;
  triggerConditions?: Record<string, any>;
  followUpQuestions?: string[];
  helpText?: string;
  placeholder?: string;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    required?: boolean;
  };
}

// Analysis types
export interface AnalysisSection {
  score: number;
  level: 'excellent' | 'good' | 'fair' | 'poor' | 'unknown';
  summary: string;
  details: string[];
  concerns: string[];
  positives: string[];
  dataPoints: Record<string, any>;
}

export interface ReportAnalysis {
  ingredients: AnalysisSection;
  nutrition: AnalysisSection;
  sustainability: AnalysisSection;
  ethics: AnalysisSection;
  safety: AnalysisSection;
}

export interface Recommendation {
  type: 'warning' | 'caution' | 'info' | 'positive';
  title: string;
  description: string;
  action?: string;
  priority: 'high' | 'medium' | 'low';
}

export interface Alternative {
  name: string;
  brand: string;
  reason: string;
  score: number;
  url?: string;
}

// UI types
export interface FormData {
  [key: string]: any;
}

export interface StepData {
  currentStep: number;
  totalSteps: number;
  isComplete: boolean;
  progress: number;
}

export interface NotificationData {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

// API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Product analysis types
export interface ProductAnalysisInput {
  productId: string;
  responses: Record<string, any>;
  userPreferences?: Record<string, any>;
}

export interface ProductAnalysisResult {
  reportId: string;
  scores: {
    overall: number;
    health: number;
    sustainability: number;
    ethics: number;
    transparency: number;
  };
  analysis: ReportAnalysis;
  recommendations: Recommendation[];
  alternatives: Alternative[];
  dataCompleteness: number;
  generatedAt: Date;
}

// Session types
export interface SessionData {
  sessionId: string;
  productId: string;
  userId: string;
  currentQuestionIndex: number;
  responses: Record<string, any>;
  progress: number;
  startedAt: Date;
  lastUpdated: Date;
}