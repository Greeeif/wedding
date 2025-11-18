import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized. Please log in first.'
      }, { status: 401 });
    }

    const body = await request.json();
    
    if (body.attending === undefined) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: attending status'
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
    
    console.log('RSVP saved:', rsvp);
    
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