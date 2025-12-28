import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { checkRateLimit } from '@/lib/rate-limit';
import { z } from 'zod';

const rsvpInputSchema = z.object({
  attending: z.boolean(),
  guests: z.number().int().min(1).max(10), // Adjust max based on your needs
  dietaryRestrictions: z.string().max(500).optional().transform(val => val?.trim()),
  message: z.string().max(1000).optional().transform(val => val?.trim())
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { allowed } = await checkRateLimit(
      `rsvp:${session.user.id}`,
      10,
      60 * 60 * 1000
    );
    if (!allowed) {
      return NextResponse.json({ success: false, error: 'Too many requests' }, { status: 429 });
    }

    const body = await request.json();
    
    // VALIDATE INPUT
    const validationResult = rsvpInputSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json({
        success: false,
        error: 'Invalid input',
        details: validationResult.error.issues
      }, { status: 400 });
    }

    const validatedData = validationResult.data;

    // Check user's maxGuests limit
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { maxGuests: true }
    });

    if (validatedData.guests > (user?.maxGuests || 1)) {
      return NextResponse.json({
        success: false,
        error: `You can only bring up to ${user?.maxGuests} guests`
      }, { status: 400 });
    }

    // Check if user already has an RSVP
    const existingRSVP = await prisma.rSVP.findUnique({
      where: { userId: session.user.id }
    });

    let rsvp;

    if (existingRSVP) {
      // Update existing RSVP
      rsvp = await prisma.rSVP.update({
        where: { userId: session.user.id },
        data: {
          attending: body.attending,
          guests: body.guests || 1,
          dietaryRestrictions: body.dietaryRestrictions || null,
          message: body.message || null,
        },
      });
    } else {
      // Create new RSVP
      rsvp = await prisma.rSVP.create({
        data: {
          userId: session.user.id,
          attending: body.attending,
          guests: body.guests || 1,
          dietaryRestrictions: body.dietaryRestrictions || null,
          message: body.message || null,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: existingRSVP ? 'RSVP updated successfully' : 'RSVP received successfully',
      data: rsvp
    });

  } catch (error) {
    console.error('RSVP error:', error);

    return NextResponse.json({
      success: false,
      error: 'Failed to submit RSVP'
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 });
    }

    // Get the current user's RSVP
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

    return NextResponse.json({
      success: true,
      data: rsvp
    });
  } catch (error) {
    console.error('Error fetching RSVP:', error);

    return NextResponse.json({
      success: false,
      error: 'Failed to fetch RSVP'
    }, { status: 500 });
  }
}