// src/components/forms/RSVPForm.tsx
import React, { useState } from 'react';
import { BlissButton, BlissInput, BlissCard } from '@/components/ui';
import { RSVPData, RSVPFormData } from '@/types';

interface RSVPFormProps {
  onSubmit: (data: RSVPFormData) => Promise<void>;
  loading?: boolean;
}

export const RSVPForm: React.FC<RSVPFormProps> = ({ onSubmit, loading = false }) => {
  const [formData, setFormData] = useState<RSVPFormData>({
    name: '',
    email: '',
    attending: null,
    guests: 1,
    dietaryRestrictions: '',
    message: ''
  });

  const [errors, setErrors] = useState<Partial<RSVPFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<RSVPFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (formData.attending === null) {
      newErrors.attending = 'Please let us know if you can attend' as any;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await onSubmit(formData);
      // Reset form on success
      setFormData({
        name: '',
        email: '',
        attending: null,
        guests: 1,
        dietaryRestrictions: '',
        message: ''
      });
    } catch (error) {
      console.error('RSVP submission error:', error);
    }
  };

  const updateField = (field: keyof RSVPFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <BlissCard className="max-w-2xl mx-auto">
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <BlissInput
          label="Full Name *"
          type="text"
          value={formData.name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('name', e.target.value)}
          error={errors.name}
          disabled={loading}
        />
        
        <BlissInput
          label="Email *"
          type="email"
          value={formData.email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('email', e.target.value)}
          error={errors.email}
          disabled={loading}
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Will you be attending? *
        </label>
        <div className="flex space-x-4">
          <BlissButton
            variant={formData.attending === true ? 'primary' : 'outline'}
            onClick={() => updateField('attending', true)}
            disabled={loading}
          >
            ✓ Joyfully Accept
          </BlissButton>
          <BlissButton
            variant={formData.attending === false ? 'secondary' : 'outline'}
            onClick={() => updateField('attending', false)}
            disabled={loading}
          >
            ✗ Regretfully Decline
          </BlissButton>
        </div>
        {errors.attending && (
          <p className="mt-2 text-sm text-red-600">{errors.attending}</p>
        )}
      </div>

      {formData.attending && (
        <>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Guests
            </label>
            <select
              value={formData.guests}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateField('guests', parseInt(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              disabled={loading}
            >
              <option value={1}>1 Guest</option>
              <option value={2}>2 Guests</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dietary Restrictions
            </label>
            <textarea
              value={formData.dietaryRestrictions}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateField('dietaryRestrictions', e.target.value)}
              placeholder="Please let us know about any dietary restrictions or allergies..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent h-24 resize-none"
              disabled={loading}
            />
          </div>
        </>
      )}

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Message for the Couple
        </label>
        <textarea
          value={formData.message}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateField('message', e.target.value)}
          placeholder="Share your well wishes..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent h-24 resize-none"
          disabled={loading}
        />
      </div>

      <BlissButton
        size="lg"
        onClick={handleSubmit}
        disabled={loading}
        className="w-full"
      >
        {loading ? 'Submitting...' : 'Submit RSVP'}
      </BlissButton>
    </BlissCard>
  );
};