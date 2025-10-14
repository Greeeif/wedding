// src/types/index.ts

export interface RSVPData {
  id?: string;
  name: string;
  email: string;
  attending: boolean;
  guests: number;
  dietaryRestrictions: string;
  message: string;
  createdAt?: Date;
}

export interface GiftItem {
  id: string;
  name: string;
  price: string;
  url: string;
  image: string;
  purchased: boolean;
  purchasedBy?: string;
  description?: string;
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

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}