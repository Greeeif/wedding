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
      {/* Use 60vh on mobile, full screen on md+ */}
      <BotanicalBackground className="min-h-[60vh] md:min-h-screen">
        <div className="min-h-[60vh] md:min-h-screen flex items-center justify-center px-8 sm:px-12 md:px-6 pt-12 md:pt-32 pb-10 md:pb-20">
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