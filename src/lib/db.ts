// src/lib/db.ts
import { PrismaClient } from '@prisma/client';
import { RSVPFormData, GiftItem } from '@/types';

// Singleton pattern for Prisma Client
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// RSVP Database Operations
export const rsvpQueries = {
  // Create or update RSVP for a user
  async upsert(userId: string, data: RSVPFormData) {
    return await prisma.rSVP.upsert({
      where: { userId },
      update: {
        attending: data.attending,
        guests: data.guests,
        dietaryRestrictions: data.dietaryRestrictions || null,
        message: data.message || null,
      },
      create: {
        userId,
        attending: data.attending,
        guests: data.guests,
        dietaryRestrictions: data.dietaryRestrictions || null,
        message: data.message || null,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
  },

  // Get all RSVPs with user information
  async getAll() {
    return await prisma.rSVP.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  },

  // Get RSVP by user ID
  async getByUserId(userId: string) {
    return await prisma.rSVP.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
  },

  // Get RSVP by ID
  async getById(id: string) {
    return await prisma.rSVP.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
  },

  // Update RSVP
  async update(userId: string, data: Partial<RSVPFormData>) {
    return await prisma.rSVP.update({
      where: { userId },
      data: {
        ...(typeof data.attending === 'boolean' && { attending: data.attending }),
        ...(data.guests !== undefined && { guests: data.guests }),
        ...(data.dietaryRestrictions !== undefined && { 
          dietaryRestrictions: data.dietaryRestrictions || null 
        }),
        ...(data.message !== undefined && { message: data.message || null }),
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
  },

  // Delete RSVP
  async delete(userId: string) {
    await prisma.rSVP.delete({
      where: { userId },
    });
  },

  // Get statistics
  async getStats() {
    const totalResponses = await prisma.rSVP.count();
    const attendingCount = await prisma.rSVP.count({
      where: { attending: true },
    });
    const notAttendingCount = await prisma.rSVP.count({
      where: { attending: false },
    });
    const totalGuestsResult = await prisma.rSVP.aggregate({
      where: { attending: true },
      _sum: {
        guests: true,
      },
    });

    return {
      total_responses: totalResponses,
      attending_count: attendingCount,
      not_attending_count: notAttendingCount,
      total_guests: totalGuestsResult._sum.guests || 0,
    };
  },
};

// Gift Registry Database Operations (unchanged)
export const giftQueries = {
  // Get all gifts
  async getAll() {
    return await prisma.gift.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  },

  // Mark gift as purchased
  async markPurchased(id: string, purchasedBy?: string) {
    return await prisma.gift.update({
      where: { id },
      data: {
        purchased: true,
        purchasedBy: purchasedBy || 'Anonymous',
        purchasedAt: new Date(),
      },
    });
  },

  // Add new gift
  async create(data: Omit<GiftItem, 'id' | 'purchased' | 'purchasedBy' | 'purchasedAt' | 'createdAt'>) {
    return await prisma.gift.create({
      data: {
        name: data.name,
        price: data.price,
        url: data.url || null,
        image: data.image,
        description: data.description || null,
      },
    });
  },

  // Remove gift
  async delete(id: string) {
    await prisma.gift.delete({
      where: { id },
    });
  },
};