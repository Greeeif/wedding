// src/hooks/useScrollPosition.ts
import { useState, useEffect } from 'react';

export const useScrollPosition = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return isScrolled;
};

// src/hooks/useRSVP.ts
import { useState } from 'react';
import { RSVPData, APIResponse } from '@/types';

export const useRSVP = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitRSVP = async (data: RSVPData): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result: APIResponse = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to submit RSVP');
      }

      // Success feedback could be handled here
      alert("Thank you for your RSVP! We can't wait to celebrate with you.");
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Something went wrong';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    submitRSVP,
    loading,
    error
  };
};

// src/hooks/useGiftRegistry.ts
import { useState, useEffect } from 'react';
import { GiftItem, APIResponse } from '@/types';

export const useGiftRegistry = () => {
  const [gifts, setGifts] = useState<GiftItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGifts = async () => {
    try {
      const response = await fetch('/api/gifts');
      const result: APIResponse<GiftItem[]> = await response.json();
      
      if (result.success && result.data) {
        setGifts(result.data);
      } else {
        throw new Error(result.error || 'Failed to fetch gifts');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load gifts');
    } finally {
      setLoading(false);
    }
  };

  const purchaseGift = async (giftId: string) => {
    try {
      const response = await fetch(`/api/gifts/${giftId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ purchased: true }),
      });

      const result: APIResponse = await response.json();
      
      if (result.success) {
        // Update local state
        setGifts(prev => prev.map(gift => 
          gift.id === giftId ? { ...gift, purchased: true } : gift
        ));
        alert('Thank you for your generous gift!');
      } else {
        throw new Error(result.error || 'Failed to purchase gift');
      }
    } catch (err) {
      alert('There was an error processing your gift purchase. Please try again.');
    }
  };

  useEffect(() => {
    fetchGifts();
  }, []);

  return {
    gifts,
    loading,
    error,
    purchaseGift,
    refetch: fetchGifts
  };
};

// src/hooks/index.ts
export { useScrollPosition } from './useScrollPosition';
export { useRSVP } from './useRSVP';
export { useGiftRegistry } from './useGiftRegistry';