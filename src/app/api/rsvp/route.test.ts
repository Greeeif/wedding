// src/app/api/rsvp/route.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST, GET } from './route';
import { rsvpQueries } from '@/lib/db';

// Mock the database queries
vi.mock('@/lib/db', () => ({
  rsvpQueries: {
    create: vi.fn(),
    getAll: vi.fn(),
  },
}));

// Helper to create mock NextRequest
function createMockRequest(body: any): Request {
  return new Request('http://localhost:3000/api/rsvp', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
}

describe('POST /api/rsvp', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('successful RSVP creation', () => {
    it('should create RSVP with all fields', async () => {
      const requestBody = {
        name: 'John Doe',
        email: 'john@example.com',
        attending: true,
        guests: 2,
        dietaryRestrictions: 'Vegetarian',
        message: 'Looking forward!',
      };

      const mockCreatedRsvp = {
        id: '1',
        ...requestBody,
        createdAt: new Date(),
      };

      vi.mocked(rsvpQueries.create).mockResolvedValue(mockCreatedRsvp as any);

      const request = createMockRequest(requestBody);
      const response = await POST(request as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe('RSVP received successfully');
      // Dates are serialized to strings in JSON
      expect(data.data).toMatchObject({
        id: '1',
        ...requestBody,
      });
      expect(data.data.createdAt).toBeDefined();
      expect(rsvpQueries.create).toHaveBeenCalledWith(requestBody);
    });

    it('should create RSVP with only required fields', async () => {
      const requestBody = {
        name: 'Jane Smith',
        email: 'jane@example.com',
        attending: false,
      };

      const expectedData = {
        name: 'Jane Smith',
        email: 'jane@example.com',
        attending: false,
        guests: 1,
        dietaryRestrictions: null,
        message: null,
      };

      vi.mocked(rsvpQueries.create).mockResolvedValue({ id: '2', ...expectedData } as any);

      const request = createMockRequest(requestBody);
      const response = await POST(request as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(rsvpQueries.create).toHaveBeenCalledWith(expectedData);
    });

    it('should default guests to 1 when not provided', async () => {
      const requestBody = {
        name: 'Bob',
        email: 'bob@example.com',
        attending: true,
      };

      vi.mocked(rsvpQueries.create).mockResolvedValue({} as any);

      const request = createMockRequest(requestBody);
      await POST(request as any);

      expect(rsvpQueries.create).toHaveBeenCalledWith(
        expect.objectContaining({ guests: 1 })
      );
    });

    it('should accept attending status of false', async () => {
      const requestBody = {
        name: 'Alice',
        email: 'alice@example.com',
        attending: false,
      };

      vi.mocked(rsvpQueries.create).mockResolvedValue({} as any);

      const request = createMockRequest(requestBody);
      const response = await POST(request as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(rsvpQueries.create).toHaveBeenCalledWith(
        expect.objectContaining({ attending: false })
      );
    });
  });

  describe('validation errors', () => {
    it('should return 400 when name is missing', async () => {
      const requestBody = {
        email: 'test@example.com',
        attending: true,
      };

      const request = createMockRequest(requestBody);
      const response = await POST(request as any);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toContain('Missing required fields');
      expect(rsvpQueries.create).not.toHaveBeenCalled();
    });

    it('should return 400 when email is missing', async () => {
      const requestBody = {
        name: 'John Doe',
        attending: true,
      };

      const request = createMockRequest(requestBody);
      const response = await POST(request as any);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toContain('Missing required fields');
      expect(rsvpQueries.create).not.toHaveBeenCalled();
    });

    it('should return 400 when attending is missing', async () => {
      const requestBody = {
        name: 'John Doe',
        email: 'john@example.com',
      };

      const request = createMockRequest(requestBody);
      const response = await POST(request as any);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toContain('Missing required fields');
      expect(rsvpQueries.create).not.toHaveBeenCalled();
    });

    it('should return 400 when name is empty string', async () => {
      const requestBody = {
        name: '',
        email: 'test@example.com',
        attending: true,
      };

      const request = createMockRequest(requestBody);
      const response = await POST(request as any);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
    });

    it('should return 400 when email is empty string', async () => {
      const requestBody = {
        name: 'John',
        email: '',
        attending: true,
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
      expect(rsvpQueries.create).not.toHaveBeenCalled();
    });
  });

  describe('error handling', () => {
    it('should return 500 when database operation fails', async () => {
      const requestBody = {
        name: 'John Doe',
        email: 'john@example.com',
        attending: true,
      };

      vi.mocked(rsvpQueries.create).mockRejectedValue(new Error('Database error'));

      const request = createMockRequest(requestBody);
      const response = await POST(request as any);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Failed to submit RSVP');
    });

    it('should handle malformed JSON', async () => {
      const request = new Request('http://localhost:3000/api/rsvp', {
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
  });

  describe('edge cases', () => {
    it('should handle very long strings in optional fields', async () => {
      const requestBody = {
        name: 'John',
        email: 'john@example.com',
        attending: true,
        dietaryRestrictions: 'a'.repeat(1000),
        message: 'b'.repeat(2000),
      };

      vi.mocked(rsvpQueries.create).mockResolvedValue({} as any);

      const request = createMockRequest(requestBody);
      const response = await POST(request as any);

      expect(response.status).toBe(200);
    });

    it('should handle special characters in fields', async () => {
      const requestBody = {
        name: "O'Brien-Smith",
        email: 'test+tag@example.com',
        attending: true,
        message: 'Hello! <>&"',
      };

      vi.mocked(rsvpQueries.create).mockResolvedValue({} as any);

      const request = createMockRequest(requestBody);
      const response = await POST(request as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });
  });
});

describe('GET /api/rsvp', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return all RSVPs', async () => {
    const mockRsvps = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        attending: true,
        guests: 2,
        createdAt: new Date(),
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        attending: false,
        guests: 1,
        createdAt: new Date(),
      },
    ];

    vi.mocked(rsvpQueries.getAll).mockResolvedValue(mockRsvps as any);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    // Dates are serialized to strings in JSON
    expect(data.data).toHaveLength(2);
    expect(data.data[0]).toMatchObject({
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      attending: true,
      guests: 2,
    });
    expect(data.data[1]).toMatchObject({
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      attending: false,
      guests: 1,
    });
    expect(rsvpQueries.getAll).toHaveBeenCalledOnce();
  });

  it('should return empty array when no RSVPs exist', async () => {
    vi.mocked(rsvpQueries.getAll).mockResolvedValue([]);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data).toEqual([]);
  });

  it('should return 500 when database operation fails', async () => {
    vi.mocked(rsvpQueries.getAll).mockRejectedValue(new Error('Database error'));

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe('Failed to fetch RSVPs');
  });

  it('should handle database timeout', async () => {
    vi.mocked(rsvpQueries.getAll).mockRejectedValue(new Error('Timeout'));

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
  });
});
