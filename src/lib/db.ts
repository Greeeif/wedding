// src/lib/db.ts
import { sql } from '@vercel/postgres';
import { RSVPData, GiftItem } from '@/types';

// RSVP Database Operations
export const rsvpQueries = {
  // Create new RSVP
  async create(data: Omit<RSVPData, 'id' | 'createdAt'>) {
    const result = await sql`
      INSERT INTO rsvps (name, email, attending, guests, dietary_restrictions, message, created_at)
      VALUES (${data.name}, ${data.email}, ${data.attending}, ${data.guests}, ${data.dietaryRestrictions}, ${data.message}, NOW())
      RETURNING *
    `;
    return result.rows[0];
  },

  // Get all RSVPs
  async getAll() {
    const result = await sql`
      SELECT * FROM rsvps 
      ORDER BY created_at DESC
    `;
    return result.rows;
  },

  // Get RSVP by ID
  async getById(id: string) {
    const result = await sql`
      SELECT * FROM rsvps 
      WHERE id = ${id}
    `;
    return result.rows[0];
  },

  // Update RSVP
  async update(id: string, data: Partial<RSVPData>) {
    const result = await sql`
      UPDATE rsvps 
      SET name = ${data.name}, 
          email = ${data.email}, 
          attending = ${data.attending}, 
          guests = ${data.guests}, 
          dietary_restrictions = ${data.dietaryRestrictions}, 
          message = ${data.message}
      WHERE id = ${id}
      RETURNING *
    `;
    return result.rows[0];
  },

  // Delete RSVP
  async delete(id: string) {
    await sql`DELETE FROM rsvps WHERE id = ${id}`;
  },

  // Get statistics
  async getStats() {
    const result = await sql`
      SELECT 
        COUNT(*) as total_responses,
        COUNT(*) FILTER (WHERE attending = true) as attending_count,
        COUNT(*) FILTER (WHERE attending = false) as not_attending_count,
        SUM(guests) FILTER (WHERE attending = true) as total_guests
      FROM rsvps
    `;
    return result.rows[0];
  }
};

// Gift Registry Database Operations
export const giftQueries = {
  // Get all gifts
  async getAll() {
    const result = await sql`
      SELECT * FROM gifts 
      ORDER BY name ASC
    `;
    return result.rows;
  },

  // Mark gift as purchased
  async markPurchased(id: string, purchasedBy?: string) {
    const result = await sql`
      UPDATE gifts 
      SET purchased = true, 
          purchased_by = ${purchasedBy || 'Anonymous'}, 
          purchased_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;
    return result.rows[0];
  },

  // Add new gift
  async create(data: Omit<GiftItem, 'id' | 'purchased'>) {
    const result = await sql`
      INSERT INTO gifts (name, price, url, image, description)
      VALUES (${data.name}, ${data.price}, ${data.url}, ${data.image}, ${data.description})
      RETURNING *
    `;
    return result.rows[0];
  },

  // Remove gift
  async delete(id: string) {
    await sql`DELETE FROM gifts WHERE id = ${id}`;
  }
};

// Database initialization
export const initDatabase = async () => {
  try {
    // Create RSVPs table
    await sql`
      CREATE TABLE IF NOT EXISTS rsvps (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        attending BOOLEAN NOT NULL,
        guests INTEGER DEFAULT 1,
        dietary_restrictions TEXT,
        message TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Create gifts table
    await sql`
      CREATE TABLE IF NOT EXISTS gifts (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price VARCHAR(100) NOT NULL,
        url VARCHAR(500),
        image VARCHAR(500) NOT NULL,
        description TEXT,
        purchased BOOLEAN DEFAULT false,
        purchased_by VARCHAR(255),
        purchased_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Seed initial gift registry
    const existingGifts = await sql`SELECT COUNT(*) FROM gifts`;
    if (existingGifts.rows[0].count === '0') {
      await seedGifts();
    }

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
};

// Seed initial gift data
const seedGifts = async () => {
  const initialGifts = [
    {
      name: 'Honeymoon Fund',
      price: 'Any Amount',
      url: '#',
      image: '🏝️',
      description: 'Help us create unforgettable memories on our honeymoon'
    },
    {
      name: 'Kitchen Aid Mixer',
      price: '$299',
      url: 'https://amazon.com/kitchenaid-mixer',
      image: '🍰',
      description: 'For all our future baking adventures together'
    },
    {
      name: 'Fine China Set',
      price: '$450',
      url: 'https://williams-sonoma.com/china-set',
      image: '🍽️',
      description: 'Beautiful dinnerware for hosting family and friends'
    },
    {
      name: 'Travel Luggage Set',
      price: '$199',
      url: 'https://away.com/luggage',
      image: '🧳',
      description: 'For all our adventures around the world'
    },
    {
      name: 'Home Decor Fund',
      price: 'Any Amount',
      url: '#',
      image: '🏠',
      description: 'Help us make our house a home'
    },
    {
      name: 'Wine Collection',
      price: '$150',
      url: 'https://wine.com/collection',
      image: '🍷',
      description: 'Curated wines to celebrate special moments'
    }
  ];

  for (const gift of initialGifts) {
    await sql`
      INSERT INTO gifts (name, price, url, image, description)
      VALUES (${gift.name}, ${gift.price}, ${gift.url}, ${gift.image}, ${gift.description})
    `;
  }
};