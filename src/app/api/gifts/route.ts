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

export async function POST(request: NextRequest) {
  const session = await auth();

  // 1. Check if logged in
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. CHECK FOR ADMIN ROLE (Vital!)
  // You must have added the 'role' field to your Prisma schema as discussed in the review.
  if (session.user.role !== 'ADMIN') { 
    return NextResponse.json({ error: 'Forbidden: Admins only' }, { status: 403 });
  }

  try {
    const body = await request.json();
    if (!body.name || !body.price || !body.image) {
      return NextResponse.json({ success: false, error: 'Missing fields' }, { status: 400 });
    }

    const gift = await giftQueries.create({
      name: body.name,
      price: body.price,
      url: body.url,
      image: body.image,
      description: body.description,
    });
    
    return NextResponse.json({ success: true, message: 'Gift added', data: gift });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create gift' }, { status: 500 });
  }
}