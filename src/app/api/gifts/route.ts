// src/app/api/gifts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { giftQueries } from '@/lib/db';

export async function GET() {
  try {
    const gifts = await giftQueries.getAll();
    
    return NextResponse.json({
      success: true,
      data: gifts
    });
  } catch (error) {
    console.error('Error fetching gifts:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch gifts'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.price || !body.image) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: name, price, and image'
      }, { status: 400 });
    }

    // Create new gift
    const gift = await giftQueries.create({
      name: body.name,
      price: body.price,
      url: body.url,
      image: body.image,
      description: body.description,
    });
    
    return NextResponse.json({
      success: true,
      message: 'Gift added successfully',
      data: gift
    });
    
  } catch (error) {
    console.error('Error creating gift:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to create gift'
    }, { status: 500 });
  }
}