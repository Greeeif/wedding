// src/lib/validations.ts
import { z } from 'zod';

// RSVP validation schema
const rsvpSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  email: z.string().email('Invalid email address'),
  attending: z.boolean({ required_error: 'Please select if you can attend' }),
  guests: z.number().min(1).max(2, 'Maximum 2 guests allowed'),
  dietaryRestrictions: z.string().max(500, 'Message too long').optional(),
  message: z.string().max(1000, 'Message too long').optional()
});

// Gift validation schema
const giftSchema = z.object({
  name: z.string().min(1, 'Gift name is required'),
  price: z.string().min(1, 'Price is required'),
  url: z.string().url('Invalid URL').optional(),
  image: z.string().min(1, 'Image is required'),
  description: z.string().max(500).optional()
});

export const validateRSVP = (data: any) => {
  try {
    const validatedData = rsvpSchema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      };
    }
    return { success: false, errors: [{ field: 'general', message: 'Validation failed' }] };
  }
};

export const validateGift = (data: any) => {
  try {
    const validatedData = giftSchema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      };
    }
    return { success: false, errors: [{ field: 'general', message: 'Validation failed' }] };
  }
};

// Email validation
export const isValidEmail = (email: string): boolean => {
  return z.string().email().safeParse(email).success;
};

// Phone validation
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
};