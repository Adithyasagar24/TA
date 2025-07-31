import { pgTable, text, varchar, timestamp, jsonb, boolean, integer, uuid, serial } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Products table
export const products = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  brand: varchar('brand', { length: 255 }),
  category: varchar('category', { length: 100 }),
  barcode: varchar('barcode', { length: 50 }),
  description: text('description'),
  imageUrl: varchar('image_url', { length: 500 }),
  userId: uuid('user_id').notNull(),
  status: varchar('status', { length: 20 }).default('draft').notNull(), // draft, analyzing, completed
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Question templates for the intelligent questionnaire system
export const questionTemplates = pgTable('question_templates', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
  question: text('question').notNull(),
  questionType: varchar('question_type', { length: 50 }).notNull(), // text, select, multiselect, boolean, number, scale
  options: jsonb('options'), // For select/multiselect questions
  category: varchar('category', { length: 100 }).notNull(), // ingredients, nutrition, sustainability, ethics, etc.
  priority: integer('priority').default(1), // Higher priority questions asked first
  triggerConditions: jsonb('trigger_conditions'), // Conditions that trigger this question
  followUpQuestions: jsonb('follow_up_questions'), // IDs of questions to ask based on answers
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// User questionnaire sessions
export const questionnaireSessions = pgTable('questionnaire_sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: uuid('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull(),
  status: varchar('status', { length: 20 }).default('active').notNull(), // active, completed, abandoned
  currentQuestionId: uuid('current_question_id'),
  progress: integer('progress').default(0), // Percentage completion
  totalQuestions: integer('total_questions').default(0),
  answeredQuestions: integer('answered_questions').default(0),
  startedAt: timestamp('started_at').defaultNow().notNull(),
  completedAt: timestamp('completed_at'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// User responses to questions
export const questionResponses = pgTable('question_responses', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionId: uuid('session_id').notNull().references(() => questionnaireSessions.id, { onDelete: 'cascade' }),
  questionId: uuid('question_id').notNull().references(() => questionTemplates.id),
  productId: uuid('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull(),
  answer: jsonb('answer').notNull(), // Flexible answer storage
  answerText: text('answer_text'), // Human-readable answer
  confidence: integer('confidence'), // User's confidence in their answer (1-10)
  source: varchar('source', { length: 100 }), // Where they got the information
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Product transparency reports
export const transparencyReports = pgTable('transparency_reports', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: uuid('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull(),
  sessionId: uuid('session_id').notNull().references(() => questionnaireSessions.id),
  overallScore: integer('overall_score'), // 0-100 transparency score
  healthScore: integer('health_score'), // 0-100 health score
  sustainabilityScore: integer('sustainability_score'), // 0-100 sustainability score
  ethicsScore: integer('ethics_score'), // 0-100 ethics score
  transparencyLevel: varchar('transparency_level', { length: 20 }), // excellent, good, fair, poor
  
  // Detailed analysis sections
  ingredientsAnalysis: jsonb('ingredients_analysis'),
  nutritionAnalysis: jsonb('nutrition_analysis'),
  sustainabilityAnalysis: jsonb('sustainability_analysis'),
  ethicsAnalysis: jsonb('ethics_analysis'),
  safetyAnalysis: jsonb('safety_analysis'),
  
  // Recommendations and insights
  recommendations: jsonb('recommendations'),
  concerns: jsonb('concerns'),
  positives: jsonb('positives'),
  alternatives: jsonb('alternatives'),
  
  // Metadata
  dataCompleteness: integer('data_completeness'), // Percentage of required data collected
  reportVersion: varchar('report_version', { length: 10 }).default('1.0'),
  isPublic: boolean('is_public').default(false),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// User accounts
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  name: varchar('name', { length: 255 }),
  avatar: varchar('avatar', { length: 500 }),
  preferences: jsonb('preferences'), // User preferences for reports, notifications, etc.
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Product categories and their specific question sets
export const productCategories = pgTable('product_categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  description: text('description'),
  parentId: uuid('parent_id'), // For hierarchical categories
  questionIds: jsonb('question_ids'), // Array of question template IDs for this category
  requiredDataPoints: jsonb('required_data_points'), // What data is essential for this category
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const productsRelations = relations(products, ({ many, one }) => ({
  questionnaireSessions: many(questionnaireSessions),
  questionResponses: many(questionResponses),
  transparencyReports: many(transparencyReports),
  user: one(users, {
    fields: [products.userId],
    references: [users.id],
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  products: many(products),
  questionnaireSessions: many(questionnaireSessions),
  questionResponses: many(questionResponses),
  transparencyReports: many(transparencyReports),
}));

export const questionnaireSessionsRelations = relations(questionnaireSessions, ({ one, many }) => ({
  product: one(products, {
    fields: [questionnaireSessions.productId],
    references: [products.id],
  }),
  user: one(users, {
    fields: [questionnaireSessions.userId],
    references: [users.id],
  }),
  responses: many(questionResponses),
  transparencyReport: one(transparencyReports, {
    fields: [questionnaireSessions.id],
    references: [transparencyReports.sessionId],
  }),
}));

export const questionResponsesRelations = relations(questionResponses, ({ one }) => ({
  session: one(questionnaireSessions, {
    fields: [questionResponses.sessionId],
    references: [questionnaireSessions.id],
  }),
  question: one(questionTemplates, {
    fields: [questionResponses.questionId],
    references: [questionTemplates.id],
  }),
  product: one(products, {
    fields: [questionResponses.productId],
    references: [products.id],
  }),
  user: one(users, {
    fields: [questionResponses.userId],
    references: [users.id],
  }),
}));

export const transparencyReportsRelations = relations(transparencyReports, ({ one }) => ({
  product: one(products, {
    fields: [transparencyReports.productId],
    references: [products.id],
  }),
  user: one(users, {
    fields: [transparencyReports.userId],
    references: [users.id],
  }),
  session: one(questionnaireSessions, {
    fields: [transparencyReports.sessionId],
    references: [questionnaireSessions.id],
  }),
}));

export const questionTemplatesRelations = relations(questionTemplates, ({ many }) => ({
  responses: many(questionResponses),
}));

export const productCategoriesRelations = relations(productCategories, ({ one, many }) => ({
  parent: one(productCategories, {
    fields: [productCategories.parentId],
    references: [productCategories.id],
  }),
  children: many(productCategories),
}));