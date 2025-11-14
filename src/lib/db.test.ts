// src/lib/db.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Prisma Client - must be before imports
const mockPrismaInstance = {
  rSVP: {
    create: vi.fn(),
    findMany: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    count: vi.fn(),
    aggregate: vi.fn(),
  },
  gift: {
    findMany: vi.fn(),
    update: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
  },
};

vi.mock('@prisma/client', () => {
  class MockPrismaClient {
    constructor() {
      return mockPrismaInstance as any;
    }
  }
  return { PrismaClient: MockPrismaClient };
});

// Import after mock
const { rsvpQueries, giftQueries } = await import('./db');
const { prisma } = await import('./db');

describe('rsvpQueries', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Helper to get mocked prisma
  const getMockPrisma = () => mockPrismaInstance;

  describe('create', () => {
    it('should create a new RSVP with all fields', async () => {
      const newRsvp = {
        name: 'John Doe',
        email: 'john@example.com',
        attending: true,
        guests: 2,
        dietaryRestrictions: 'Vegetarian',
        message: 'Excited to attend!',
      };

      const mockCreatedRsvp = {
        id: '1',
        ...newRsvp,
        createdAt: new Date(),
      };

      vi.mocked(mockPrismaInstance.rSVP.create).mockResolvedValue(mockCreatedRsvp as any);

      const result = await rsvpQueries.create(newRsvp);

      expect(mockPrismaInstance.rSVP.create).toHaveBeenCalledWith({
        data: newRsvp,
      });
      expect(result).toEqual(mockCreatedRsvp);
    });

    it('should create RSVP with attending defaulting to false when undefined', async () => {
      const newRsvp = {
        name: 'Jane Smith',
        email: 'jane@example.com',
        attending: undefined as any,
        guests: 1,
      };

      const expectedData = {
        name: 'Jane Smith',
        email: 'jane@example.com',
        attending: false,
        guests: 1,
        dietaryRestrictions: undefined,
        message: undefined,
      };

      vi.mocked(mockPrismaInstance.rSVP.create).mockResolvedValue({ id: '2', ...expectedData, createdAt: new Date() } as any);

      await rsvpQueries.create(newRsvp);

      expect(mockPrismaInstance.rSVP.create).toHaveBeenCalledWith({
        data: expectedData,
      });
    });

    it('should create RSVP without optional fields', async () => {
      const newRsvp = {
        name: 'Bob Jones',
        email: 'bob@example.com',
        attending: false,
        guests: 1,
      };

      vi.mocked(mockPrismaInstance.rSVP.create).mockResolvedValue({ id: '3', ...newRsvp, createdAt: new Date() } as any);

      await rsvpQueries.create(newRsvp);

      expect(mockPrismaInstance.rSVP.create).toHaveBeenCalledWith({
        data: {
          ...newRsvp,
          dietaryRestrictions: undefined,
          message: undefined,
        },
      });
    });
  });

  describe('getAll', () => {
    it('should retrieve all RSVPs ordered by creation date descending', async () => {
      const mockRsvps = [
        { id: '2', name: 'Recent', email: 'recent@example.com', attending: true, guests: 1, createdAt: new Date('2024-02-01') },
        { id: '1', name: 'Older', email: 'older@example.com', attending: false, guests: 2, createdAt: new Date('2024-01-01') },
      ];

      vi.mocked(mockPrismaInstance.rSVP.findMany).mockResolvedValue(mockRsvps as any);

      const result = await rsvpQueries.getAll();

      expect(mockPrismaInstance.rSVP.findMany).toHaveBeenCalledWith({
        orderBy: {
          createdAt: 'desc',
        },
      });
      expect(result).toEqual(mockRsvps);
    });

    it('should return empty array when no RSVPs exist', async () => {
      vi.mocked(mockPrismaInstance.rSVP.findMany).mockResolvedValue([]);

      const result = await rsvpQueries.getAll();

      expect(result).toEqual([]);
    });
  });

  describe('getById', () => {
    it('should retrieve RSVP by ID', async () => {
      const mockRsvp = {
        id: '123',
        name: 'Test User',
        email: 'test@example.com',
        attending: true,
        guests: 2,
        createdAt: new Date(),
      };

      vi.mocked(mockPrismaInstance.rSVP.findUnique).mockResolvedValue(mockRsvp as any);

      const result = await rsvpQueries.getById('123');

      expect(mockPrismaInstance.rSVP.findUnique).toHaveBeenCalledWith({
        where: { id: '123' },
      });
      expect(result).toEqual(mockRsvp);
    });

    it('should return null when RSVP not found', async () => {
      vi.mocked(mockPrismaInstance.rSVP.findUnique).mockResolvedValue(null);

      const result = await rsvpQueries.getById('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update all fields when provided', async () => {
      const updateData = {
        name: 'Updated Name',
        email: 'updated@example.com',
        attending: false,
        guests: 1,
        dietaryRestrictions: 'Vegan',
        message: 'Updated message',
      };

      const mockUpdatedRsvp = { id: '1', ...updateData, createdAt: new Date() };
      vi.mocked(mockPrismaInstance.rSVP.update).mockResolvedValue(mockUpdatedRsvp as any);

      await rsvpQueries.update('1', updateData);

      expect(mockPrismaInstance.rSVP.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: updateData,
      });
    });

    it('should only update provided fields', async () => {
      const updateData = {
        attending: true,
        guests: 2,
      };

      vi.mocked(mockPrismaInstance.rSVP.update).mockResolvedValue({} as any);

      await rsvpQueries.update('1', updateData);

      expect(mockPrismaInstance.rSVP.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          attending: true,
          guests: 2,
        },
      });
    });

    it('should handle boolean attending value of false', async () => {
      const updateData = { attending: false };

      vi.mocked(mockPrismaInstance.rSVP.update).mockResolvedValue({} as any);

      await rsvpQueries.update('1', updateData);

      expect(mockPrismaInstance.rSVP.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { attending: false },
      });
    });

    it('should set dietaryRestrictions to null when empty string provided', async () => {
      const updateData = { dietaryRestrictions: '' };

      vi.mocked(mockPrismaInstance.rSVP.update).mockResolvedValue({} as any);

      await rsvpQueries.update('1', updateData);

      expect(mockPrismaInstance.rSVP.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { dietaryRestrictions: null },
      });
    });

    it('should set message to null when empty string provided', async () => {
      const updateData = { message: '' };

      vi.mocked(mockPrismaInstance.rSVP.update).mockResolvedValue({} as any);

      await rsvpQueries.update('1', updateData);

      expect(mockPrismaInstance.rSVP.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { message: null },
      });
    });

    it('should not update fields with undefined values', async () => {
      const updateData = {
        name: undefined,
        dietaryRestrictions: undefined,
      };

      vi.mocked(mockPrismaInstance.rSVP.update).mockResolvedValue({} as any);

      await rsvpQueries.update('1', updateData);

      // Both undefined values should be filtered out
      expect(mockPrismaInstance.rSVP.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {},
      });
    });
  });

  describe('delete', () => {
    it('should delete RSVP by ID', async () => {
      vi.mocked(mockPrismaInstance.rSVP.delete).mockResolvedValue({} as any);

      await rsvpQueries.delete('123');

      expect(mockPrismaInstance.rSVP.delete).toHaveBeenCalledWith({
        where: { id: '123' },
      });
    });
  });

  describe('getStats', () => {
    it('should calculate correct statistics', async () => {
      vi.mocked(mockPrismaInstance.rSVP.count)
        .mockResolvedValueOnce(10) // total responses
        .mockResolvedValueOnce(7)  // attending
        .mockResolvedValueOnce(3); // not attending

      vi.mocked(mockPrismaInstance.rSVP.aggregate).mockResolvedValue({
        _sum: { guests: 15 },
      } as any);

      const stats = await rsvpQueries.getStats();

      expect(stats).toEqual({
        total_responses: 10,
        attending_count: 7,
        not_attending_count: 3,
        total_guests: 15,
      });

      expect(mockPrismaInstance.rSVP.count).toHaveBeenCalledTimes(3);
      expect(mockPrismaInstance.rSVP.count).toHaveBeenNthCalledWith(1);
      expect(mockPrismaInstance.rSVP.count).toHaveBeenNthCalledWith(2, { where: { attending: true } });
      expect(mockPrismaInstance.rSVP.count).toHaveBeenNthCalledWith(3, { where: { attending: false } });
      expect(mockPrismaInstance.rSVP.aggregate).toHaveBeenCalledWith({
        where: { attending: true },
        _sum: { guests: true },
      });
    });

    it('should handle zero total guests when aggregate returns null', async () => {
      vi.mocked(mockPrismaInstance.rSVP.count)
        .mockResolvedValueOnce(5)
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(5);

      vi.mocked(mockPrismaInstance.rSVP.aggregate).mockResolvedValue({
        _sum: { guests: null },
      } as any);

      const stats = await rsvpQueries.getStats();

      expect(stats.total_guests).toBe(0);
    });

    it('should handle no RSVPs', async () => {
      vi.mocked(mockPrismaInstance.rSVP.count).mockResolvedValue(0);
      vi.mocked(mockPrismaInstance.rSVP.aggregate).mockResolvedValue({
        _sum: { guests: null },
      } as any);

      const stats = await rsvpQueries.getStats();

      expect(stats).toEqual({
        total_responses: 0,
        attending_count: 0,
        not_attending_count: 0,
        total_guests: 0,
      });
    });
  });
});

describe('giftQueries', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAll', () => {
    it('should retrieve all gifts ordered by name ascending', async () => {
      const mockGifts = [
        { id: '1', name: 'Blender', price: '$50', purchased: false, image: 'blender.jpg' },
        { id: '2', name: 'Toaster', price: '$30', purchased: true, image: 'toaster.jpg' },
      ];

      vi.mocked(mockPrismaInstance.gift.findMany).mockResolvedValue(mockGifts as any);

      const result = await giftQueries.getAll();

      expect(mockPrismaInstance.gift.findMany).toHaveBeenCalledWith({
        orderBy: { name: 'asc' },
      });
      expect(result).toEqual(mockGifts);
    });

    it('should return empty array when no gifts exist', async () => {
      vi.mocked(mockPrismaInstance.gift.findMany).mockResolvedValue([]);

      const result = await giftQueries.getAll();

      expect(result).toEqual([]);
    });
  });

  describe('markPurchased', () => {
    it('should mark gift as purchased with purchaser name', async () => {
      const mockDate = new Date('2024-01-15');
      vi.setSystemTime(mockDate);

      const mockUpdatedGift = {
        id: '123',
        name: 'Coffee Maker',
        price: '$80',
        purchased: true,
        purchasedBy: 'John Doe',
        purchasedAt: mockDate,
        image: 'coffee.jpg',
      };

      vi.mocked(mockPrismaInstance.gift.update).mockResolvedValue(mockUpdatedGift as any);

      const result = await giftQueries.markPurchased('123', 'John Doe');

      expect(mockPrismaInstance.gift.update).toHaveBeenCalledWith({
        where: { id: '123' },
        data: {
          purchased: true,
          purchasedBy: 'John Doe',
          purchasedAt: expect.any(Date),
        },
      });
      expect(result).toEqual(mockUpdatedGift);

      vi.useRealTimers();
    });

    it('should mark gift as purchased by Anonymous when no name provided', async () => {
      vi.mocked(mockPrismaInstance.gift.update).mockResolvedValue({} as any);

      await giftQueries.markPurchased('123');

      expect(mockPrismaInstance.gift.update).toHaveBeenCalledWith({
        where: { id: '123' },
        data: {
          purchased: true,
          purchasedBy: 'Anonymous',
          purchasedAt: expect.any(Date),
        },
      });
    });

    it('should use Anonymous when empty string provided', async () => {
      vi.mocked(mockPrismaInstance.gift.update).mockResolvedValue({} as any);

      await giftQueries.markPurchased('123', '');

      expect(mockPrismaInstance.gift.update).toHaveBeenCalledWith({
        where: { id: '123' },
        data: {
          purchased: true,
          purchasedBy: 'Anonymous',
          purchasedAt: expect.any(Date),
        },
      });
    });

    it('should set purchasedAt to current timestamp', async () => {
      const beforeTime = Date.now();

      vi.mocked(mockPrismaInstance.gift.update).mockResolvedValue({} as any);

      await giftQueries.markPurchased('123', 'Test User');

      const afterTime = Date.now();
      const callArgs = vi.mocked(mockPrismaInstance.gift.update).mock.calls[0][0];
      const purchasedAt = (callArgs.data as any).purchasedAt;

      expect(purchasedAt.getTime()).toBeGreaterThanOrEqual(beforeTime);
      expect(purchasedAt.getTime()).toBeLessThanOrEqual(afterTime);
    });
  });

  describe('create', () => {
    it('should create a new gift with all fields', async () => {
      const newGift = {
        name: 'Dish Set',
        price: '$120',
        url: 'https://example.com/dishes',
        image: 'https://example.com/dishes.jpg',
        description: 'Beautiful ceramic dish set',
      };

      const mockCreatedGift = {
        id: '456',
        ...newGift,
        purchased: false,
      };

      vi.mocked(mockPrismaInstance.gift.create).mockResolvedValue(mockCreatedGift as any);

      const result = await giftQueries.create(newGift);

      expect(mockPrismaInstance.gift.create).toHaveBeenCalledWith({
        data: newGift,
      });
      expect(result).toEqual(mockCreatedGift);
    });

    it('should create gift without optional fields', async () => {
      const newGift = {
        name: 'Towel Set',
        price: '$40',
        image: 'towels.jpg',
      };

      vi.mocked(mockPrismaInstance.gift.create).mockResolvedValue({} as any);

      await giftQueries.create(newGift as any);

      expect(mockPrismaInstance.gift.create).toHaveBeenCalledWith({
        data: {
          name: 'Towel Set',
          price: '$40',
          image: 'towels.jpg',
          url: undefined,
          description: undefined,
        },
      });
    });
  });

  describe('delete', () => {
    it('should delete gift by ID', async () => {
      vi.mocked(mockPrismaInstance.gift.delete).mockResolvedValue({} as any);

      await giftQueries.delete('789');

      expect(mockPrismaInstance.gift.delete).toHaveBeenCalledWith({
        where: { id: '789' },
      });
    });
  });
});
