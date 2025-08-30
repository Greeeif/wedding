// src/app/api/rsvp/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // For now, just log the RSVP data
    console.log('RSVP received:', body);
    
    return NextResponse.json({
      success: true,
      message: 'RSVP received successfully'
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
  return NextResponse.json({
    success: true,
    message: 'RSVP API is working'
  });
}