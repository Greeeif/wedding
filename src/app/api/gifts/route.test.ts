// src/app/api/gifts/route.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, POST } from './route';
import { giftQueries } from '@/lib/db';

// Mock the database queries
vi.mock('@/lib/db', () => ({
  giftQueries: {
    getAll: vi.fn(),
    create: vi.fn(),
  },
}));

// Helper to create mock NextRequest
function createMockRequest(body: any): Request {
  return new Request('http://localhost:3000/api/gifts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
}

describe('GET /api/gifts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return all gifts', async () => {
    const mockGifts = [
      {
        id: '1',
        name: 'Coffee Maker',
        price: '$50',
        url: 'https://example.com/coffee',
        image: 'coffee.jpg',
        purchased: false,
      },
      {
        id: '2',
        name: 'Toaster',
        price: '$30',
        image: 'toaster.jpg',
        purchased: true,
        purchasedBy: 'John Doe',
      },
    ];

    vi.mocked(giftQueries.getAll).mockResolvedValue(mockGifts as any);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data).toEqual(mockGifts);
    expect(giftQueries.getAll).toHaveBeenCalledOnce();
  });

  it('should return empty array when no gifts exist', async () => {
    vi.mocked(giftQueries.getAll).mockResolvedValue([]);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data).toEqual([]);
  });

  it('should return 500 when database operation fails', async () => {
    vi.mocked(giftQueries.getAll).mockRejectedValue(new Error('Database error'));

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe('Failed to fetch gifts');
  });
});

describe('POST /api/gifts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('successful gift creation', () => {
    it('should create gift with all fields', async () => {
      const requestBody = {
        name: 'Blender',
        price: '$80',
        url: 'https://example.com/blender',
        image: 'https://example.com/blender.jpg',
        description: 'High-powered blender',
      };

      const mockCreatedGift = {
        id: '1',
        ...requestBody,
        purchased: false,
      };

      vi.mocked(giftQueries.create).mockResolvedValue(mockCreatedGift as any);

      const request = createMockRequest(requestBody);
      const response = await POST(request as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe('Gift added successfully');
      expect(data.data).toEqual(mockCreatedGift);
      expect(giftQueries.create).toHaveBeenCalledWith(requestBody);
    });

    it('should create gift with only required fields', async () => {
      const requestBody = {
        name: 'Towels',
        price: '$25',
        image: 'towels.jpg',
      };

      const mockCreatedGift = {
        id: '2',
        ...requestBody,
        purchased: false,
      };

      vi.mocked(giftQueries.create).mockResolvedValue(mockCreatedGift as any);

      const request = createMockRequest(requestBody);
      const response = await POST(request as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(giftQueries.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Towels',
          price: '$25',
          image: 'towels.jpg',
        })
      );
    });

    it('should accept optional url field', async () => {
      const requestBody = {
        name: 'Item',
        price: '$10',
        image: 'item.jpg',
        url: 'https://store.com/item',
      };

      vi.mocked(giftQueries.create).mockResolvedValue({} as any);

      const request = createMockRequest(requestBody);
      const response = await POST(request as any);

      expect(response.status).toBe(200);
      expect(giftQueries.create).toHaveBeenCalledWith(
        expect.objectContaining({ url: 'https://store.com/item' })
      );
    });

    it('should accept optional description field', async () => {
      const requestBody = {
        name: 'Item',
        price: '$10',
        image: 'item.jpg',
        description: 'A wonderful gift',
      };

      vi.mocked(giftQueries.create).mockResolvedValue({} as any);

      const request = createMockRequest(requestBody);
      const response = await POST(request as any);

      expect(response.status).toBe(200);
      expect(giftQueries.create).toHaveBeenCalledWith(
        expect.objectContaining({ description: 'A wonderful gift' })
      );
    });
  });

  describe('validation errors', () => {
    it('should return 400 when name is missing', async () => {
      const requestBody = {
        price: '$10',
        image: 'image.jpg',
      };

      const request = createMockRequest(requestBody);
      const response = await POST(request as any);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toContain('Missing required fields');
      expect(giftQueries.create).not.toHaveBeenCalled();
    });

    it('should return 400 when price is missing', async () => {
      const requestBody = {
        name: 'Item',
        image: 'image.jpg',
      };

      const request = createMockRequest(requestBody);
      const response = await POST(request as any);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toContain('Missing required fields');
      expect(giftQueries.create).not.toHaveBeenCalled();
    });

    it('should return 400 when image is missing', async () => {
      const requestBody = {
        name: 'Item',
        price: '$10',
      };

      const request = createMockRequest(requestBody);
      const response = await POST(request as any);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toContain('Missing required fields');
      expect(giftQueries.create).not.toHaveBeenCalled();
    });

    it('should return 400 when name is empty string', async () => {
      const requestBody = {
        name: '',
        price: '$10',
        image: 'image.jpg',
      };

      const request = createMockRequest(requestBody);
      const response = await POST(request as any);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
    });

    it('should return 400 when price is empty string', async () => {
      const requestBody = {
        name: 'Item',
        price: '',
        image: 'image.jpg',
      };

      const request = createMockRequest(requestBody);
      const response = await POST(request as any);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
    });

    it('should return 400 when image is empty string', async () => {
      const requestBody = {
        name: 'Item',
        price: '$10',
        image: '',
      };

      const request = createMockRequest(requestBody);
      const response = await POST(request as any);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
    });

    it('should return 400 when all required fields are missing', async () => {
      const requestBody = {};

      const request = createMockRequest(requestBody);
      const response = await POST(request as any);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(giftQueries.create).not.toHaveBeenCalled();
    });
  });

  describe('error handling', () => {
    it('should return 500 when database operation fails', async () => {
      const requestBody = {
        name: 'Item',
        price: '$10',
        image: 'image.jpg',
      };

      vi.mocked(giftQueries.create).mockRejectedValue(new Error('Database error'));

      const request = createMockRequest(requestBody);
      const response = await POST(request as any);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Failed to create gift');
    });

    it('should handle malformed JSON', async () => {
      const request = new Request('http://localhost:3000/api/gifts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: 'invalid json{',
      });

      const response = await POST(request as any);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
    });

    it('should handle unique constraint violation', async () => {
      const requestBody = {
        name: 'Duplicate Item',
        price: '$10',
        image: 'image.jpg',
      };

      vi.mocked(giftQueries.create).mockRejectedValue(
        new Error('Unique constraint failed')
      );

      const request = createMockRequest(requestBody);
      const response = await POST(request as any);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should handle special characters in fields', async () => {
      const requestBody = {
        name: 'Item & Things',
        price: '$10.99',
        image: 'image.jpg',
        description: 'Description with <special> "characters"',
      };

      vi.mocked(giftQueries.create).mockResolvedValue({} as any);

      const request = createMockRequest(requestBody);
      const response = await POST(request as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });

    it('should handle very long description', async () => {
      const requestBody = {
        name: 'Item',
        price: '$10',
        image: 'image.jpg',
        description: 'a'.repeat(1000),
      };

      vi.mocked(giftQueries.create).mockResolvedValue({} as any);

      const request = createMockRequest(requestBody);
      const response = await POST(request as any);

      expect(response.status).toBe(200);
    });

    it('should handle unicode in gift names', async () => {
      const requestBody = {
        name: 'Café ☕ Set',
        price: '$25',
        image: 'cafe.jpg',
      };

      vi.mocked(giftQueries.create).mockResolvedValue({} as any);

      const request = createMockRequest(requestBody);
      const response = await POST(request as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });

    it('should handle various price formats', async () => {
      const testCases = ['$10', '$10.99', '$1,000', '€50', '£25.50'];

      for (const price of testCases) {
        vi.clearAllMocks();
        const requestBody = {
          name: 'Item',
          price,
          image: 'image.jpg',
        };

        vi.mocked(giftQueries.create).mockResolvedValue({} as any);

        const request = createMockRequest(requestBody);
        const response = await POST(request as any);

        expect(response.status).toBe(200);
      }
    });
  });
});
