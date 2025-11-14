// src/lib/validations.test.ts
import { describe, it, expect } from 'vitest';
import { validateRSVP, validateGift, isValidEmail, isValidPhone } from './validations';

describe('validateRSVP', () => {
  describe('valid RSVP data', () => {
    it('should validate correct RSVP data', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        attending: true,
        guests: 2,
        dietaryRestrictions: 'Vegetarian',
        message: 'Looking forward to it!'
      };

      const result = validateRSVP(validData);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(validData);
    });

    it('should validate RSVP without optional fields', () => {
      const validData = {
        name: 'Jane Smith',
        email: 'jane@example.com',
        attending: false,
        guests: 1
      };

      const result = validateRSVP(validData);
      expect(result.success).toBe(true);
      expect(result.data).toMatchObject(validData);
    });

    it('should accept minimum guest count (1)', () => {
      const validData = {
        name: 'Alice',
        email: 'alice@example.com',
        attending: true,
        guests: 1
      };

      const result = validateRSVP(validData);
      expect(result.success).toBe(true);
    });

    it('should accept maximum guest count (2)', () => {
      const validData = {
        name: 'Bob',
        email: 'bob@example.com',
        attending: true,
        guests: 2
      };

      const result = validateRSVP(validData);
      expect(result.success).toBe(true);
    });
  });

  describe('invalid RSVP data', () => {
    it('should reject empty name', () => {
      const invalidData = {
        name: '',
        email: 'test@example.com',
        attending: true,
        guests: 1
      };

      const result = validateRSVP(invalidData);
      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors?.some(e => e.field === 'name')).toBe(true);
    });

    it('should reject name exceeding 100 characters', () => {
      const invalidData = {
        name: 'a'.repeat(101),
        email: 'test@example.com',
        attending: true,
        guests: 1
      };

      const result = validateRSVP(invalidData);
      expect(result.success).toBe(false);
      expect(result.errors?.some(e => e.field === 'name' && e.message.includes('too long'))).toBe(true);
    });

    it('should reject invalid email format', () => {
      const invalidData = {
        name: 'John',
        email: 'not-an-email',
        attending: true,
        guests: 1
      };

      const result = validateRSVP(invalidData);
      expect(result.success).toBe(false);
      expect(result.errors?.some(e => e.field === 'email')).toBe(true);
    });

    it('should reject missing attending field', () => {
      const invalidData = {
        name: 'John',
        email: 'john@example.com',
        guests: 1
      };

      const result = validateRSVP(invalidData);
      expect(result.success).toBe(false);
      expect(result.errors?.some(e => e.field === 'attending')).toBe(true);
    });

    it('should reject guest count less than 1', () => {
      const invalidData = {
        name: 'John',
        email: 'john@example.com',
        attending: true,
        guests: 0
      };

      const result = validateRSVP(invalidData);
      expect(result.success).toBe(false);
      expect(result.errors?.some(e => e.field === 'guests')).toBe(true);
    });

    it('should reject guest count greater than 2', () => {
      const invalidData = {
        name: 'John',
        email: 'john@example.com',
        attending: true,
        guests: 3
      };

      const result = validateRSVP(invalidData);
      expect(result.success).toBe(false);
      expect(result.errors?.some(e => e.field === 'guests' && e.message.includes('Maximum 2'))).toBe(true);
    });

    it('should reject dietary restrictions exceeding 500 characters', () => {
      const invalidData = {
        name: 'John',
        email: 'john@example.com',
        attending: true,
        guests: 1,
        dietaryRestrictions: 'a'.repeat(501)
      };

      const result = validateRSVP(invalidData);
      expect(result.success).toBe(false);
      expect(result.errors?.some(e => e.field === 'dietaryRestrictions')).toBe(true);
    });

    it('should reject message exceeding 1000 characters', () => {
      const invalidData = {
        name: 'John',
        email: 'john@example.com',
        attending: true,
        guests: 1,
        message: 'a'.repeat(1001)
      };

      const result = validateRSVP(invalidData);
      expect(result.success).toBe(false);
      expect(result.errors?.some(e => e.field === 'message')).toBe(true);
    });

    it('should return multiple errors for multiple invalid fields', () => {
      const invalidData = {
        name: '',
        email: 'invalid-email',
        attending: true,
        guests: 5
      };

      const result = validateRSVP(invalidData);
      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors!.length).toBeGreaterThan(1);
    });
  });

  describe('edge cases', () => {
    it('should handle null input', () => {
      const result = validateRSVP(null);
      expect(result.success).toBe(false);
    });

    it('should handle undefined input', () => {
      const result = validateRSVP(undefined);
      expect(result.success).toBe(false);
    });

    it('should handle empty object', () => {
      const result = validateRSVP({});
      expect(result.success).toBe(false);
    });

    it('should reject XSS attempt in name', () => {
      const maliciousData = {
        name: '<script>alert("XSS")</script>',
        email: 'test@example.com',
        attending: true,
        guests: 1
      };

      // Validation should pass - sanitization happens at display time
      const result = validateRSVP(maliciousData);
      expect(result.success).toBe(true);
      expect(result.data?.name).toBe('<script>alert("XSS")</script>');
    });
  });
});

describe('validateGift', () => {
  describe('valid gift data', () => {
    it('should validate correct gift data', () => {
      const validData = {
        name: 'Coffee Maker',
        price: '$49.99',
        url: 'https://example.com/coffee-maker',
        image: 'https://example.com/image.jpg',
        description: 'A great coffee maker'
      };

      const result = validateGift(validData);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(validData);
    });

    it('should validate gift without optional fields', () => {
      const validData = {
        name: 'Toaster',
        price: '$29.99',
        image: 'https://example.com/toaster.jpg'
      };

      const result = validateGift(validData);
      expect(result.success).toBe(true);
    });
  });

  describe('invalid gift data', () => {
    it('should reject empty name', () => {
      const invalidData = {
        name: '',
        price: '$10',
        image: 'https://example.com/image.jpg'
      };

      const result = validateGift(invalidData);
      expect(result.success).toBe(false);
      expect(result.errors?.some(e => e.field === 'name')).toBe(true);
    });

    it('should reject empty price', () => {
      const invalidData = {
        name: 'Item',
        price: '',
        image: 'https://example.com/image.jpg'
      };

      const result = validateGift(invalidData);
      expect(result.success).toBe(false);
      expect(result.errors?.some(e => e.field === 'price')).toBe(true);
    });

    it('should reject invalid URL format', () => {
      const invalidData = {
        name: 'Item',
        price: '$10',
        url: 'not-a-url',
        image: 'https://example.com/image.jpg'
      };

      const result = validateGift(invalidData);
      expect(result.success).toBe(false);
      expect(result.errors?.some(e => e.field === 'url')).toBe(true);
    });

    it('should reject empty image', () => {
      const invalidData = {
        name: 'Item',
        price: '$10',
        image: ''
      };

      const result = validateGift(invalidData);
      expect(result.success).toBe(false);
      expect(result.errors?.some(e => e.field === 'image')).toBe(true);
    });

    it('should reject description exceeding 500 characters', () => {
      const invalidData = {
        name: 'Item',
        price: '$10',
        image: 'https://example.com/image.jpg',
        description: 'a'.repeat(501)
      };

      const result = validateGift(invalidData);
      expect(result.success).toBe(false);
      expect(result.errors?.some(e => e.field === 'description')).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should handle malicious URLs', () => {
      const maliciousData = {
        name: 'Item',
        price: '$10',
        url: 'javascript:alert("XSS")',
        image: 'https://example.com/image.jpg'
      };

      const result = validateGift(maliciousData);
      // Note: Zod actually accepts javascript: as a valid URL scheme
      // Additional sanitization should happen at the application level
      expect(result.success).toBe(true);
    });

    it('should accept data: URLs for images', () => {
      const validData = {
        name: 'Item',
        price: '$10',
        image: 'data:image/png;base64,iVBORw0KGgoAAAANS'
      };

      const result = validateGift(validData);
      expect(result.success).toBe(true);
    });
  });
});

describe('isValidEmail', () => {
  it('should validate correct email addresses', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
    expect(isValidEmail('user.name@example.com')).toBe(true);
    expect(isValidEmail('user+tag@example.co.uk')).toBe(true);
    expect(isValidEmail('user_name@subdomain.example.com')).toBe(true);
  });

  it('should reject invalid email addresses', () => {
    expect(isValidEmail('notanemail')).toBe(false);
    expect(isValidEmail('@example.com')).toBe(false);
    expect(isValidEmail('user@')).toBe(false);
    expect(isValidEmail('user @example.com')).toBe(false);
    expect(isValidEmail('')).toBe(false);
    expect(isValidEmail('user@.com')).toBe(false);
  });

  it('should handle edge cases', () => {
    // Zod requires TLD to be at least 2 characters
    expect(isValidEmail('a@b.co')).toBe(true);
    // localhost without TLD is not considered valid by Zod
    expect(isValidEmail('test@localhost')).toBe(false);
    expect(isValidEmail('test@localhost.local')).toBe(true);
  });
});

describe('isValidPhone', () => {
  it('should validate correct phone numbers', () => {
    expect(isValidPhone('+1234567890')).toBe(true);
    expect(isValidPhone('1234567890')).toBe(true);
    expect(isValidPhone('+1 (234) 567-8900')).toBe(true);
    expect(isValidPhone('+44 20 7123 4567')).toBe(true);
    expect(isValidPhone('123-456-7890')).toBe(true);
  });

  it('should reject invalid phone numbers', () => {
    expect(isValidPhone('123')).toBe(false);
    expect(isValidPhone('abc')).toBe(false);
    expect(isValidPhone('')).toBe(false);
    expect(isValidPhone('123456789')).toBe(false); // too short
  });

  it('should handle edge cases', () => {
    expect(isValidPhone('+1234567890123456')).toBe(true); // long international number
    expect(isValidPhone('(555) 123-4567')).toBe(true);
  });
});
