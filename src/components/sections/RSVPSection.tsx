import React from 'react';
import { Users } from 'lucide-react';
import { RSVPForm } from '@/components/forms/RSVPForm';
import { RSVPData } from '@/types';

interface RSVPSectionProps {
  onRSVPSubmit: (data: RSVPData) => Promise<void>;
  loading: boolean;
  deadline: string;
}

export const RSVPSection: React.FC<RSVPSectionProps> = ({ 
  onRSVPSubmit, 
  loading, 
  deadline 
}) => {
  return (
    <section id="rsvp" className="py-20 px-6 bg-gradient-to-br from-rose-50 to-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Users className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-4xl font-light text-gray-800 mb-4">RSVP</h2>
          <p className="text-gray-600">Please respond by {deadline}</p>
        </div>

        <RSVPForm onSubmit={onRSVPSubmit} loading={loading} />
      </div>
    </section>
  );
};