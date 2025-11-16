// src/types/index.ts

// Database models (matching Prisma schema)
export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  maxGuests: number;
  createdAt: Date;
  updatedAt: Date;
  rsvp?: RSVP | null;
}

export interface RSVP {
  id: string;
  userId: string;
  attending: boolean;
  guests: number;
  dietaryRestrictions: string | null;
  message: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// For displaying RSVP data with user info (what you actually use in your app)
export interface RSVPWithUser extends RSVP {
  user: {
    name: string;
    email: string;
  };
}

// Rest of your types remain the same...
export interface GiftItem {
  id: string;
  name: string;
  price: string;
  url: string | null;
  image: string;
  description: string | null;
  purchased: boolean;
  purchasedBy: string | null;
  purchasedAt: Date | null;
  createdAt: Date;
}

export interface RSVPFormData {
  attending: boolean;
  guests: number;
  dietaryRestrictions?: string;
  message?: string;
}

export interface GiftFormData {
  name: string;
  price: string;
  url?: string;
  image: string;
  description?: string;
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface MenuCategory {
  name: string;
  items: string[];
}

export interface WeddingDetails {
  coupleNames: {
    bride: string;
    groom: string;
  };
  date: string;
  time: string;
  venue: {
    name: string;
    address: string;
    ceremonyLocation: string;
    receptionLocation: string;
  };
  rsvpDeadline: string;
  dressCode: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
}

export interface NavigationSection {
  id: string;
  label: string;
  href: string;
}