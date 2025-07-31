import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { questionnaireSessions, questionResponses } from '@/lib/schema';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { and, eq, desc } from 'drizzle-orm';

const createSessionSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  userId: z.string().min(1, 'User ID is required'),
  responses: z.array(z.object({
    questionId: z.string(),
    answer: z.any(),
    answerText: z.string(),
    confidence: z.number().optional(),
    source: z.string().optional(),
    notes: z.string().optional(),
  })),
  totalQuestions: z.number(),
  answeredQuestions: z.number(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createSessionSchema.parse(body);

    // Create questionnaire session
    const sessionId = uuidv4();
    const session = await db.insert(questionnaireSessions).values({
      id: sessionId,
      productId: validatedData.productId,
      userId: validatedData.userId,
      status: 'completed',
      progress: Math.round((validatedData.answeredQuestions / validatedData.totalQuestions) * 100),
      totalQuestions: validatedData.totalQuestions,
      answeredQuestions: validatedData.answeredQuestions,
      startedAt: new Date(),
      completedAt: new Date(),
      updatedAt: new Date(),
    }).returning();

    // Save all responses
    if (validatedData.responses.length > 0) {
      const responseRecords = validatedData.responses.map(response => ({
        id: uuidv4(),
        sessionId: sessionId,
        questionId: response.questionId,
        productId: validatedData.productId,
        userId: validatedData.userId,
        answer: response.answer,
        answerText: response.answerText,
        confidence: response.confidence || null,
        source: response.source || null,
        notes: response.notes || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      await db.insert(questionResponses).values(responseRecords);
    }

    return NextResponse.json({
      success: true,
      data: {
        session: session[0],
        responseCount: validatedData.responses.length,
      },
      message: 'Questionnaire session created successfully',
    });
  } catch (error) {
    console.error('Error creating questionnaire session:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create questionnaire session',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const productId = searchParams.get('productId');

    let query = db.select().from(questionnaireSessions);
    
    if (userId && productId) {
      query = query.where(
        and(
          eq(questionnaireSessions.userId, userId),
          eq(questionnaireSessions.productId, productId)
        )
      );
    } else if (userId) {
      query = query.where(eq(questionnaireSessions.userId, userId));
    } else if (productId) {
      query = query.where(eq(questionnaireSessions.productId, productId));
    }

    const sessions = await query.orderBy(desc(questionnaireSessions.createdAt));

    return NextResponse.json({
      success: true,
      data: sessions,
    });
  } catch (error) {
    console.error('Error fetching questionnaire sessions:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch questionnaire sessions',
      },
      { status: 500 }
    );
  }
}