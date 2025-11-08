import React from 'react';
import { BotanicalBackground, InvitationCard } from '@/components/ui';

interface BlissHeroSectionProps {
  coupleNames: {
    bride: string;
    groom: string;
  };
  date: string;
  time: string;
  venue: {
    name: string;
    location: string;
  };
  onRSVPClick: () => void;
}

export const BlissHeroSection: React.FC<BlissHeroSectionProps> = ({
  coupleNames,
  date,
  time,
  venue,
  onRSVPClick
}) => {
  return (
    <section id="hero">
      {/* Full screen height on ALL devices */}
      <BotanicalBackground className="min-h-screen">
        <div className="min-h-screen flex items-center justify-center px-4 sm:px-12 md:px-6 py-20">
          <InvitationCard
            coupleNames={coupleNames}
            date={date}
            time={time}
            venue={venue}
            onRSVPClick={onRSVPClick}
          />
        </div>
      </BotanicalBackground>
    </section>
  );
};