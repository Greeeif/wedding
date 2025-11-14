// src/app/api/gifts/[id]/route.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PUT, DELETE } from './route';
import { giftQueries } from '@/lib/db';

// Mock the database queries
vi.mock('@/lib/db', () => ({
  giftQueries: {
    markPurchased: vi.fn(),
    delete: vi.fn(),
  },
}));

// Helper to create mock NextRequest for PUT
function createMockPutRequest(body: any): Request {
  return new Request('http://localhost:3000/api/gifts/123', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
}

// Helper to create mock NextRequest for DELETE
function createMockDeleteRequest(): Request {
  return new Request('http://localhost:3000/api/gifts/123', {
    method: 'DELETE',
  });
}

// Helper to create mock params
function createMockParams(id: string) {
  return { params: Promise.resolve({ id }) };
}

describe('PUT /api/gifts/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('successful purchase marking', () => {
    it('should mark gift as purchased with purchaser name', async () => {
      const requestBody = {
        purchased: true,
        purchasedBy: 'John Doe',
      };

      const mockUpdatedGift = {
        id: '123',
        name: 'Coffee Maker',
        price: '$50',
        purchased: true,
        purchasedBy: 'John Doe',
        purchasedAt: new Date(),
        image: 'coffee.jpg',
      };

      vi.mocked(giftQueries.markPurchased).mockResolvedValue(mockUpdatedGift as any);

      const request = createMockPutRequest(requestBody);
      const params = createMockParams('123');
      const response = await PUT(request as any, params as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe('Gift marked as purchased');
      // Dates are serialized to strings in JSON
      expect(data.data).toMatchObject({
        id: '123',
        name: 'Coffee Maker',
        price: '$50',
        purchased: true,
        purchasedBy: 'John Doe',
        image: 'coffee.jpg',
      });
      expect(data.data.purchasedAt).toBeDefined();
      expect(giftQueries.markPurchased).toHaveBeenCalledWith('123', 'John Doe');
    });

    it('should mark gift as purchased without purchaser name', async () => {
      const requestBody = {
        purchased: true,
      };

      const mockUpdatedGift = {
        id: '456',
        name: 'Toaster',
        price: '$30',
        purchased: true,
        purchasedBy: 'Anonymous',
        purchasedAt: new Date(),
        image: 'toaster.jpg',
      };

      vi.mocked(giftQueries.markPurchased).mockResolvedValue(mockUpdatedGift as any);

      const request = createMockPutRequest(requestBody);
      const params = createMockParams('456');
      const response = await PUT(request as any, params as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(giftQueries.markPurchased).toHaveBeenCalledWith('456', undefined);
    });

    it('should handle different gift IDs', async () => {
      const giftIds = ['abc123', 'xyz789', '12345'];

      for (const giftId of giftIds) {
        vi.clearAllMocks();
        const requestBody = { purchased: true };

        vi.mocked(giftQueries.markPurchased).mockResolvedValue({} as any);

        const request = createMockPutRequest(requestBody);
        const params = createMockParams(giftId);
        const response = await PUT(request as any, params as any);

        expect(response.status).toBe(200);
        expect(giftQueries.markPurchased).toHaveBeenCalledWith(giftId, undefined);
      }
    });

    it('should handle special characters in purchaser name', async () => {
      const requestBody = {
        purchased: true,
        purchasedBy: "O'Brien-Smith & Co.",
      };

      vi.mocked(giftQueries.markPurchased).mockResolvedValue({} as any);

      const request = createMockPutRequest(requestBody);
      const params = createMockParams('123');
      const response = await PUT(request as any, params as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(giftQueries.markPurchased).toHaveBeenCalledWith('123', "O'Brien-Smith & Co.");
    });
  });

  describe('validation errors', () => {
    it('should return 400 when purchased is not true', async () => {
      const requestBody = {
        purchased: false,
      };

      const request = createMockPutRequest(requestBody);
      const params = createMockParams('123');
      const response = await PUT(request as any, params as any);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Invalid request');
      expect(giftQueries.markPurchased).not.toHaveBeenCalled();
    });

    it('should return 400 when purchased field is missing', async () => {
      const requestBody = {
        purchasedBy: 'John Doe',
      };

      const request = createMockPutRequest(requestBody);
      const params = createMockParams('123');
      const response = await PUT(request as any, params as any);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Invalid request');
      expect(giftQueries.markPurchased).not.toHaveBeenCalled();
    });

    it('should return 400 when purchased is not a boolean', async () => {
      const requestBody = {
        purchased: 'true', // string instead of boolean
      };

      const request = createMockPutRequest(requestBody);
      const params = createMockParams('123');
      const response = await PUT(request as any, params as any);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(giftQueries.markPurchased).not.toHaveBeenCalled();
    });

    it('should return 400 for empty request body', async () => {
      const requestBody = {};

      const request = createMockPutRequest(requestBody);
      const params = createMockParams('123');
      const response = await PUT(request as any, params as any);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(giftQueries.markPurchased).not.toHaveBeenCalled();
    });
  });

  describe('error handling', () => {
    it('should return 500 when database operation fails', async () => {
      const requestBody = {
        purchased: true,
        purchasedBy: 'John Doe',
      };

      vi.mocked(giftQueries.markPurchased).mockRejectedValue(new Error('Database error'));

      const request = createMockPutRequest(requestBody);
      const params = createMockParams('123');
      const response = await PUT(request as any, params as any);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Failed to update gift');
    });

    it('should handle gift not found error', async () => {
      const requestBody = {
        purchased: true,
      };

      vi.mocked(giftQueries.markPurchased).mockRejectedValue(
        new Error('Record not found')
      );

      const request = createMockPutRequest(requestBody);
      const params = createMockParams('nonexistent');
      const response = await PUT(request as any, params as any);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
    });

    it('should handle malformed JSON', async () => {
      const request = new Request('http://localhost:3000/api/gifts/123', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: 'invalid json{',
      });

      const params = createMockParams('123');
      const response = await PUT(request as any, params as any);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
    });

    it('should handle race condition (already purchased)', async () => {
      const requestBody = {
        purchased: true,
        purchasedBy: 'User A',
      };

      // Simulate race condition where gift is already marked as purchased
      vi.mocked(giftQueries.markPurchased).mockRejectedValue(
        new Error('Gift already purchased')
      );

      const request = createMockPutRequest(requestBody);
      const params = createMockParams('123');
      const response = await PUT(request as any, params as any);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should handle very long purchaser names', async () => {
      const requestBody = {
        purchased: true,
        purchasedBy: 'A'.repeat(500),
      };

      vi.mocked(giftQueries.markPurchased).mockResolvedValue({} as any);

      const request = createMockPutRequest(requestBody);
      const params = createMockParams('123');
      const response = await PUT(request as any, params as any);

      expect(response.status).toBe(200);
    });

    it('should handle unicode in purchaser name', async () => {
      const requestBody = {
        purchased: true,
        purchasedBy: '李明 👋',
      };

      vi.mocked(giftQueries.markPurchased).mockResolvedValue({} as any);

      const request = createMockPutRequest(requestBody);
      const params = createMockParams('123');
      const response = await PUT(request as any, params as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });
  });
});

describe('DELETE /api/gifts/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('successful deletion', () => {
    it('should delete gift by ID', async () => {
      vi.mocked(giftQueries.delete).mockResolvedValue(undefined);

      const request = createMockDeleteRequest();
      const params = createMockParams('123');
      const response = await DELETE(request as any, params as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe('Gift deleted successfully');
      expect(giftQueries.delete).toHaveBeenCalledWith('123');
    });

    it('should handle different gift IDs', async () => {
      const giftIds = ['abc123', 'xyz789', '12345', 'uuid-like-id-123'];

      for (const giftId of giftIds) {
        vi.clearAllMocks();
        vi.mocked(giftQueries.delete).mockResolvedValue(undefined);

        const request = createMockDeleteRequest();
        const params = createMockParams(giftId);
        const response = await DELETE(request as any, params as any);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.success).toBe(true);
        expect(giftQueries.delete).toHaveBeenCalledWith(giftId);
      }
    });
  });

  describe('error handling', () => {
    it('should return 500 when database operation fails', async () => {
      vi.mocked(giftQueries.delete).mockRejectedValue(new Error('Database error'));

      const request = createMockDeleteRequest();
      const params = createMockParams('123');
      const response = await DELETE(request as any, params as any);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Failed to delete gift');
    });

    it('should handle gift not found error', async () => {
      vi.mocked(giftQueries.delete).mockRejectedValue(
        new Error('Record not found')
      );

      const request = createMockDeleteRequest();
      const params = createMockParams('nonexistent');
      const response = await DELETE(request as any, params as any);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
    });

    it('should handle database constraint violations', async () => {
      vi.mocked(giftQueries.delete).mockRejectedValue(
        new Error('Foreign key constraint failed')
      );

      const request = createMockDeleteRequest();
      const params = createMockParams('123');
      const response = await DELETE(request as any, params as any);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
    });

    it('should handle database timeout', async () => {
      vi.mocked(giftQueries.delete).mockRejectedValue(
        new Error('Query timeout')
      );

      const request = createMockDeleteRequest();
      const params = createMockParams('123');
      const response = await DELETE(request as any, params as any);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should handle deletion of already purchased gift', async () => {
      // Should still succeed - no validation preventing this
      vi.mocked(giftQueries.delete).mockResolvedValue(undefined);

      const request = createMockDeleteRequest();
      const params = createMockParams('123');
      const response = await DELETE(request as any, params as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });

    it('should handle special characters in ID', async () => {
      const specialIds = ['id-with-dashes', 'id_with_underscores', 'id.with.dots'];

      for (const id of specialIds) {
        vi.clearAllMocks();
        vi.mocked(giftQueries.delete).mockResolvedValue(undefined);

        const request = createMockDeleteRequest();
        const params = createMockParams(id);
        const response = await DELETE(request as any, params as any);

        expect(response.status).toBe(200);
        expect(giftQueries.delete).toHaveBeenCalledWith(id);
      }
    });
  });
});
