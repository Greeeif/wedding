// src/lib/db.ts
import { PrismaClient } from '@prisma/client';
import { RSVPData, GiftItem } from '@/types';

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
  // Create new RSVP
  async create(data: Omit<RSVPData, 'id' | 'createdAt'>) {
    return await prisma.rSVP.create({
      data: {
        name: data.name,
        email: data.email,
        attending: data.attending ?? false,
        guests: data.guests,
        dietaryRestrictions: data.dietaryRestrictions,
        message: data.message,
      },
    });
  },

  // Get all RSVPs
  async getAll() {
    return await prisma.rSVP.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  },

  // Get RSVP by ID
  async getById(id: string) {
    return await prisma.rSVP.findUnique({
      where: { id },
    });
  },

  // Update RSVP
  async update(id: string, data: Partial<RSVPData>) {
    return await prisma.rSVP.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.email && { email: data.email }),
        ...(data.attending !== undefined && { attending: data.attending }),
        ...(data.guests && { guests: data.guests }),
        ...(data.dietaryRestrictions !== undefined && { dietaryRestrictions: data.dietaryRestrictions }),
        ...(data.message !== undefined && { message: data.message }),
      },
    });
  },

  // Delete RSVP
  async delete(id: string) {
    await prisma.rSVP.delete({
      where: { id },
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

// Gift Registry Database Operations
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
  async create(data: Omit<GiftItem, 'id' | 'purchased'>) {
    return await prisma.gift.create({
      data: {
        name: data.name,
        price: data.price,
        url: data.url,
        image: data.image,
        description: data.description,
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