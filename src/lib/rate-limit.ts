// src/lib/rate-limit.ts
import { prisma } from '@/lib/db';

export async function checkRateLimit(
  key: string, 
  maxAttempts: number = 5,
  windowMs: number = 15 * 60 * 1000 // 15 minutes
): Promise<{ allowed: boolean; remaining: number; resetAt: Date }> {
  const now = new Date();
  const resetAt = new Date(now.getTime() + windowMs);

  // Try to get existing rate limit record
  const existing = await prisma.rateLimit.findUnique({
    where: { key },
  });

  // If record exists and window hasn't expired, increment attempts
  if (existing && existing.resetAt > now) {
    const updated = await prisma.rateLimit.update({
      where: { key },
      data: {
        attempts: existing.attempts + 1,
      },
    });

    const allowed = updated.attempts <= maxAttempts;
    const remaining = Math.max(0, maxAttempts - updated.attempts);

    return { allowed, remaining, resetAt: existing.resetAt };
  }

  // If no record or window expired, create/reset
  await prisma.rateLimit.upsert({
    where: { key },
    create: {
      key,
      attempts: 1,
      resetAt,
    },
    update: {
      attempts: 1,
      resetAt,
    },
  });

  return { allowed: true, remaining: maxAttempts - 1, resetAt };
}

// Optional: Cleanup function to run periodically (removes expired records)
export async function cleanupExpiredRateLimits(): Promise<number> {
  const now = new Date();
  
  try {
    // Delete all records where resetAt is in the past
    const result = await prisma.rateLimit.deleteMany({
      where: {
        resetAt: {
          lt: now, // "less than" now = expired
        },
      },
    });

    console.log(`[CLEANUP] Deleted ${result.count} expired rate limit records`);
    return result.count;
  } catch (error) {
    console.error('[CLEANUP ERROR]:', error);
    throw error;
  }
}

