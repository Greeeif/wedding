import { useState } from 'react';
import { RSVPFormData, APIResponse } from '@/types';

export const useRSVP = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitRSVP = async (data: RSVPFormData): Promise<void> => {
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