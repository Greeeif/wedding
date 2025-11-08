// src/app/api/gifts/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { giftQueries } from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { id } = await params;
    
    // Mark gift as purchased
    if (body.purchased === true) {
      const gift = await giftQueries.markPurchased(id, body.purchasedBy);
      
      return NextResponse.json({
        success: true,
        message: 'Gift marked as purchased',
        data: gift
      });
    }
    
    return NextResponse.json({
      success: false,
      error: 'Invalid request'
    }, { status: 400 });
    
  } catch (error) {
    console.error('Error updating gift:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to update gift'
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    await giftQueries.delete(id);
    
    return NextResponse.json({
      success: true,
      message: 'Gift deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting gift:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to delete gift'
    }, { status: 500 });
  }
}