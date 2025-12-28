// src/app/api/rsvp/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { checkRateLimit } from '@/lib/rate-limit';
import { sanitizeInput } from '@/lib/sanitize';
import { z } from 'zod';

// ============================================================================
// INPUT VALIDATION SCHEMA
// ============================================================================

/**
 * Validates RSVP submission data
 * - attending: boolean (required)
 * - guests: 1-10 people (adjust max based on your needs)
 * - dietaryRestrictions: max 500 characters
 * - message: max 1000 characters
 */
const rsvpInputSchema = z.object({
  attending: z.boolean({
    required_error: 'Please indicate if you can attend',
    invalid_type_error: 'Attending must be true or false'
  }),
  guests: z.number({
    required_error: 'Number of guests is required',
    invalid_type_error: 'Guests must be a number'
  })
    .int('Guests must be a whole number')
    .min(1, 'At least 1 guest is required')
    .max(10, 'Maximum 10 guests allowed'),
  dietaryRestrictions: z.string()
    .max(500, 'Dietary restrictions must be less than 500 characters')
    .optional()
    .transform(val => val?.trim() || undefined),
  message: z.string()
    .max(1000, 'Message must be less than 1000 characters')
    .optional()
    .transform(val => val?.trim() || undefined)
});

// ============================================================================
// POST - Submit or Update RSVP
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    // -------------------------------------------------------------------------
    // 1. AUTHENTICATION CHECK
    // -------------------------------------------------------------------------
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized. Please log in first.'
      }, { status: 401 });
    }

    // -------------------------------------------------------------------------
    // 2. RATE LIMITING
    // -------------------------------------------------------------------------
    const { allowed, remaining } = await checkRateLimit(
      `rsvp:${session.user.id}`,
      10, // 10 submissions per window
      60 * 60 * 1000 // 1 hour window
    );

    if (!allowed) {
      return NextResponse.json({
        success: false,
        error: 'Too many requests. Please try again later.'
      }, { status: 429 });
    }

    // -------------------------------------------------------------------------
    // 3. PARSE AND VALIDATE INPUT
    // -------------------------------------------------------------------------
    const body = await request.json();

    const validationResult = rsvpInputSchema.safeParse(body);
    
    if (!validationResult.success) {
      // Return detailed validation errors to help user fix issues
      const errorMessages = validationResult.error.issues.map(issue => ({
        field: issue.path.join('.'),
        message: issue.message
      }));

      return NextResponse.json({
        success: false,
        error: 'Invalid input data',
        details: errorMessages
      }, { status: 400 });
    }

    const validatedData = validationResult.data;

    // -------------------------------------------------------------------------
    // 4. CHECK GUEST LIMIT
    // -------------------------------------------------------------------------
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { maxGuests: true }
    });

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 });
    }

    if (validatedData.guests > user.maxGuests) {
      return NextResponse.json({
        success: false,
        error: `You can only bring up to ${user.maxGuests} guest${user.maxGuests !== 1 ? 's' : ''}. Please contact us if you need to bring more guests.`
      }, { status: 400 });
    }

    // -------------------------------------------------------------------------
    // 5. SANITIZE USER INPUT (XSS Protection)
    // -------------------------------------------------------------------------
    const sanitizedData = {
      attending: validatedData.attending,
      guests: validatedData.guests,
      dietaryRestrictions: validatedData.dietaryRestrictions 
        ? sanitizeInput(validatedData.dietaryRestrictions) 
        : null,
      message: validatedData.message 
        ? sanitizeInput(validatedData.message) 
        : null
    };

    // -------------------------------------------------------------------------
    // 6. DATABASE OPERATION - Upsert (Create or Update)
    // -------------------------------------------------------------------------
    const existingRSVP = await prisma.rSVP.findUnique({
      where: { userId: session.user.id }
    });

    let rsvp;

    if (existingRSVP) {
      // Update existing RSVP
      rsvp = await prisma.rSVP.update({
        where: { userId: session.user.id },
        data: sanitizedData,
      });
    } else {
      // Create new RSVP
      rsvp = await prisma.rSVP.create({
        data: {
          userId: session.user.id,
          ...sanitizedData,
        },
      });
    }

    // -------------------------------------------------------------------------
    // 7. LOGGING (Development only)
    // -------------------------------------------------------------------------
    if (process.env.NODE_ENV === 'development') {
      console.log('[RSVP] Saved:', {
        userId: session.user.id,
        userName: session.user.name,
        attending: rsvp.attending,
        guests: rsvp.guests,
        isUpdate: !!existingRSVP
      });
    }

    // -------------------------------------------------------------------------
    // 8. SUCCESS RESPONSE
    // -------------------------------------------------------------------------
    return NextResponse.json({
      success: true,
      message: existingRSVP 
        ? 'RSVP updated successfully' 
        : 'RSVP received successfully. Thank you!',
      data: {
        id: rsvp.id,
        attending: rsvp.attending,
        guests: rsvp.guests,
        dietaryRestrictions: rsvp.dietaryRestrictions,
        message: rsvp.message,
        updatedAt: rsvp.updatedAt
      }
    });

  } catch (error) {
    // -------------------------------------------------------------------------
    // ERROR HANDLING - Log details server-side, send generic message to client
    // -------------------------------------------------------------------------
    console.error('[RSVP ERROR]:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });

    // Don't expose internal error details to the client
    return NextResponse.json({
      success: false,
      error: 'Failed to submit RSVP. Please try again or contact support if the problem persists.'
    }, { status: 500 });
  }
}

// ============================================================================
// GET - Retrieve Current User's RSVP
// ============================================================================

export async function GET() {
  try {
    // -------------------------------------------------------------------------
    // 1. AUTHENTICATION CHECK
    // -------------------------------------------------------------------------
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized. Please log in to view your RSVP.'
      }, { status: 401 });
    }

    // -------------------------------------------------------------------------
    // 2. FETCH RSVP FROM DATABASE
    // -------------------------------------------------------------------------
    const rsvp = await prisma.rSVP.findUnique({
      where: { userId: session.user.id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            maxGuests: true,
          }
        }
      }
    });

    // -------------------------------------------------------------------------
    // 3. RETURN RESPONSE
    // -------------------------------------------------------------------------
    if (!rsvp) {
      return NextResponse.json({
        success: true,
        data: null,
        message: 'No RSVP found for this user'
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: rsvp.id,
        attending: rsvp.attending,
        guests: rsvp.guests,
        dietaryRestrictions: rsvp.dietaryRestrictions,
        message: rsvp.message,
        createdAt: rsvp.createdAt,
        updatedAt: rsvp.updatedAt,
        user: {
          name: rsvp.user.name,
          email: rsvp.user.email,
          maxGuests: rsvp.user.maxGuests
        }
      }
    });

  } catch (error) {
    // -------------------------------------------------------------------------
    // ERROR HANDLING
    // -------------------------------------------------------------------------
    console.error('[RSVP GET ERROR]:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({
      success: false,
      error: 'Failed to retrieve RSVP. Please try again.'
    }, { status: 500 });
  }
}