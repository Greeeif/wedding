// src/app/api/cron/cleanup-rate-limits/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cleanupExpiredRateLimits } from '@/lib/rate-limit';

/**
 * Cron job to clean up expired rate limit records
 * This prevents the RateLimit table from growing indefinitely
 * 
 * Triggered automatically by Vercel Cron every 6 hours
 * Can also be triggered manually for testing
 */
export async function GET(request: NextRequest) {
  try {
    // SECURITY: Verify this request is from Vercel Cron, not a random visitor
    // Vercel automatically adds this header to cron requests
    const authHeader = request.headers.get('authorization');
    
    // Check if the request has the correct secret
    // This prevents anyone from manually calling this endpoint and overloading your DB
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      console.warn('Unauthorized cron access attempt');
      return new Response('Unauthorized', { status: 401 });
    }

    console.log('[CRON] Starting rate limit cleanup...');
    
    // Call your existing cleanup function
    await cleanupExpiredRateLimits();
    
    console.log('[CRON] Rate limit cleanup completed');

    return NextResponse.json({ 
      success: true,
      message: 'Rate limit cleanup completed',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('[CRON ERROR]:', error);
    
    return NextResponse.json({ 
      success: false, 
      error: 'Cleanup failed',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// Optional: Add a POST handler for manual testing in development
export async function POST(request: NextRequest) {
  // Only allow manual triggers in development
  if (process.env.NODE_ENV !== 'development') {
    return new Response('Not allowed', { status: 403 });
  }

  try {
    await cleanupExpiredRateLimits();
    return NextResponse.json({ success: true, message: 'Manual cleanup completed' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Cleanup failed' }, { status: 500 });
  }
}