// src/lib/sanitize.ts
import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitizes user input to prevent XSS attacks
 * Removes potentially dangerous HTML/JavaScript while preserving safe text
 * 
 * @param input - The string to sanitize
 * @param allowBasicFormatting - If true, allows <b>, <i>, <em>, <strong> tags
 * @returns Sanitized string safe for storage and display
 */
export function sanitizeInput(input: string, allowBasicFormatting = false): string {
  if (!input) return '';

  const config = allowBasicFormatting 
    ? {
        ALLOWED_TAGS: ['b', 'i', 'em', 'strong'], // Only allow basic formatting
        ALLOWED_ATTR: [] // No attributes allowed
      }
    : {
        ALLOWED_TAGS: [], // Strip all HTML tags
        ALLOWED_ATTR: []
      };

  // DOMPurify removes all dangerous content and returns safe text
  return DOMPurify.sanitize(input.trim(), config);
}

/**
 * Sanitizes multiple fields at once
 */
export function sanitizeObject<T extends Record<string, any>>(
  obj: T, 
  fields: (keyof T)[]
): T {
  const sanitized = { ...obj };
  
  fields.forEach(field => {
    if (typeof sanitized[field] === 'string') {
      sanitized[field] = sanitizeInput(sanitized[field] as string) as T[keyof T];
    }
  });
  
  return sanitized;
}