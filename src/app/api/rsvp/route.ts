// src/app/api/rsvp/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { rsvpQueries } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.email || body.attending === undefined) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: name, email, and attending status'
      }, { status: 400 });
    }

    // Save RSVP to database using Prisma
    const rsvp = await rsvpQueries.create({
      name: body.name,
      email: body.email,
      attending: body.attending,
      guests: body.guests || 1,
      dietaryRestrictions: body.dietaryRestrictions || null,
      message: body.message || null,
    });
    
    console.log('RSVP saved:', rsvp);
    
    return NextResponse.json({
      success: true,
      message: 'RSVP received successfully',
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
    // Get all RSVPs
    const rsvps = await rsvpQueries.getAll();
    
    return NextResponse.json({
      success: true,
      data: rsvps
    });
  } catch (error) {
    console.error('Error fetching RSVPs:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch RSVPs'
    }, { status: 500 });
  }
}