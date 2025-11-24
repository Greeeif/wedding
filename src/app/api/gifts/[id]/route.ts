// src/app/api/gifts/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { giftQueries } from '@/lib/db';
import { auth } from '@/auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Guests need to be logged in to claim a gift
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id } = await params;

    if (body.purchased === true) {
      // SECURITY FIX: Don't trust body.purchasedBy. Use the session name.
      const gift = await giftQueries.markPurchased(id, session.user.name || 'Anonymous');

      return NextResponse.json({
        success: true,
        message: 'Gift marked as purchased',
        data: gift
      });
    }
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  // 1. Check Login
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. CHECK ADMIN ROLE (Vital!)
  if (session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { id } = await params;
    await giftQueries.delete(id);
    return NextResponse.json({ success: true, message: 'Gift deleted' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete' }, { status: 500 });
  }
}