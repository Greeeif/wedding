// src/types/index.ts - Updated to match Prisma schema

export interface RSVPData {
  id: string;
  name: string;
  email: string;
  attending: boolean | null;
  guests: number;
  dietaryRestrictions?: string | null;
  message?: string | null;
  createdAt: Date;
  updatedAt?: Date;
}

export interface GiftItem {
  id: string;
  name: string;
  price: string;
  url?: string | null;
  image: string;
  description?: string | null;
  purchased: boolean;
  purchasedBy?: string | null;
  purchasedAt?: Date | null;
  createdAt?: Date;
}

// Form submission types (before DB insertion)
export interface RSVPFormData {
  name: string;
  email: string;
  attending: boolean | null;
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

// API Response type
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Additional types for wedding app
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