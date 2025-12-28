// src/app/api/gifts/route.ts
import { NextResponse } from 'next/server';
import { giftQueries } from '@/lib/db';
import { auth } from '@/auth';

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const gifts = await giftQueries.getAll();
    return NextResponse.json({ success: true, data: gifts });
  } catch (error) {
    console.error('[GIFTS GET ERROR]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch gifts' },
      { status: 500 }
    );
  }
}