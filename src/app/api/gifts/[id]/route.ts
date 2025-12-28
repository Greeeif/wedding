// src/app/api/gifts/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { giftQueries, prisma } from '@/lib/db';
import { auth } from '@/auth';
import { checkRateLimit } from '@/lib/rate-limit';
import { z } from 'zod';

// ============================================================================
// INPUT VALIDATION SCHEMAS
// ============================================================================

/**
 * Validates gift ID format
 * - Must be a non-empty string
 * - Max 50 characters (CUID IDs are ~25 chars)
 * - No path traversal or injection characters
 */
const giftIdSchema = z.string()
  .min(1, 'Gift ID is required')
  .max(50, 'Invalid gift ID')
  .regex(/^[a-zA-Z0-9_-]+$/, 'Invalid gift ID format');

/**
 * Validates purchase request body
 */
const purchaseSchema = z.object({
  purchased: z.literal(true, {
    errorMap: () => ({ message: 'Invalid purchase request' })
  })
});

// ============================================================================
// GET - Retrieve Single Gift
// ============================================================================

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // -------------------------------------------------------------------------
    // 1. AUTHENTICATION CHECK
    // -------------------------------------------------------------------------
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // -------------------------------------------------------------------------
    // 2. VALIDATE GIFT ID
    // -------------------------------------------------------------------------
    const { id } = await params;
    
    const idValidation = giftIdSchema.safeParse(id);
    if (!idValidation.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid gift ID' },
        { status: 400 }
      );
    }

    // -------------------------------------------------------------------------
    // 3. FETCH GIFT FROM DATABASE
    // -------------------------------------------------------------------------
    const gift = await prisma.gift.findUnique({
      where: { id: idValidation.data }
    });

    if (!gift) {
      return NextResponse.json(
        { success: false, error: 'Gift not found' },
        { status: 404 }
      );
    }

    // -------------------------------------------------------------------------
    // 4. SUCCESS RESPONSE
    // -------------------------------------------------------------------------
    return NextResponse.json({
      success: true,
      data: gift
    });

  } catch (error) {
    console.error('[GIFT GET ERROR]:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });

    return NextResponse.json(
      { success: false, error: 'Failed to retrieve gift' },
      { status: 500 }
    );
  }
}

// ============================================================================
// PUT - Mark Gift as Purchased
// ============================================================================

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // -------------------------------------------------------------------------
    // 1. AUTHENTICATION CHECK
    // -------------------------------------------------------------------------
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Please log in first.' },
        { status: 401 }
      );
    }

    // -------------------------------------------------------------------------
    // 2. RATE LIMITING
    // -------------------------------------------------------------------------
    const { allowed } = await checkRateLimit(
      `gift:${session.user.id}`,
      10,              // 10 gift purchases per window
      60 * 60 * 1000   // 1 hour window
    );

    if (!allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    // -------------------------------------------------------------------------
    // 3. VALIDATE GIFT ID
    // -------------------------------------------------------------------------
    const { id } = await params;
    
    const idValidation = giftIdSchema.safeParse(id);
    if (!idValidation.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid gift ID' },
        { status: 400 }
      );
    }

    // -------------------------------------------------------------------------
    // 4. PARSE AND VALIDATE REQUEST BODY
    // -------------------------------------------------------------------------
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const bodyValidation = purchaseSchema.safeParse(body);
    if (!bodyValidation.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid request. Expected { purchased: true }' },
        { status: 400 }
      );
    }

    // -------------------------------------------------------------------------
    // 5. CHECK IF GIFT EXISTS AND IS AVAILABLE
    // -------------------------------------------------------------------------
    const existingGift = await prisma.gift.findUnique({
      where: { id: idValidation.data }
    });

    if (!existingGift) {
      return NextResponse.json(
        { success: false, error: 'Gift not found' },
        { status: 404 }
      );
    }

    if (existingGift.purchased) {
      return NextResponse.json(
        { success: false, error: 'This gift has already been purchased by another guest' },
        { status: 409 } // Conflict
      );
    }

    // -------------------------------------------------------------------------
    // 6. MARK GIFT AS PURCHASED
    // -------------------------------------------------------------------------
    // SECURITY: Use session name, never trust client-provided purchasedBy
    const gift = await giftQueries.markPurchased(
      idValidation.data,
      session.user.name || 'Anonymous'
    );

    // -------------------------------------------------------------------------
    // 7. LOGGING (Development only)
    // -------------------------------------------------------------------------
    if (process.env.NODE_ENV === 'development') {
      console.log('[GIFT] Purchased:', {
        giftId: gift.id,
        giftName: gift.name,
        purchasedBy: gift.purchasedBy,
        userId: session.user.id,
        timestamp: new Date().toISOString()
      });
    }

    // -------------------------------------------------------------------------
    // 8. SUCCESS RESPONSE
    // -------------------------------------------------------------------------
    return NextResponse.json({
      success: true,
      message: 'Thank you for your generous gift!',
      data: {
        id: gift.id,
        name: gift.name,
        purchased: gift.purchased,
        purchasedAt: gift.purchasedAt
      }
    });

  } catch (error) {
    // -------------------------------------------------------------------------
    // ERROR HANDLING
    // -------------------------------------------------------------------------
    console.error('[GIFT PURCHASE ERROR]:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json(
      { success: false, error: 'Failed to process gift purchase. Please try again.' },
      { status: 500 }
    );
  }
}