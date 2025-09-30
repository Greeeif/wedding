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
      <BotanicalBackground className="min-h-screen">
        <div className="min-h-screen flex items-center justify-center px-6">
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