import React from 'react';
import { Monogram } from '@/components/ui';

interface BlissFooterProps {
  coupleNames: {
    bride: string;
    groom: string;
  };
  date: string;
  venue: {
    location: string;
  };
  className?: string;
}

export const BlissFooter: React.FC<BlissFooterProps> = ({
  coupleNames,
  date,
  venue,
  className = ''
}) => {
  const monogramLetters = `${coupleNames.bride.charAt(0)}&${coupleNames.groom.charAt(0)}`;

  return (
    <footer className={`py-16 px-6 bg-white border-t border-stone-200 ${className}`}>
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <Monogram 
            letters={monogramLetters}
            size="md"
            className="mx-auto mb-4"
          />
        </div>
        
        <p className="text-stone-500 font-light text-sm tracking-wide mb-4">
          {date} • {venue.location}
        </p>
        
        <div className="flex justify-center space-x-8 text-xs text-stone-400 font-light tracking-wide">
          {/* <span>Ceremony at 4:00 PM</span>
          <span>•</span>
          <span>Reception to follow</span> */}
        </div>
      </div>
    </footer>
  );
};
