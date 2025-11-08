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
    } catch {
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