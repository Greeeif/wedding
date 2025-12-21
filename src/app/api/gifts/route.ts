// src/app/api/gifts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { giftQueries } from '@/lib/db';
import { auth } from '@/auth'; // Import auth

export async function GET() {
  // GET is public so guests can see the registry
  try {
    const gifts = await giftQueries.getAll();
    return NextResponse.json({ success: true, data: gifts });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 });
  }
}

