import React from 'react';
import { CircularMonogram } from './CircularMonogram';

interface InvitationCardProps {
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
  className?: string;
}

export const InvitationCard: React.FC<InvitationCardProps> = ({
  coupleNames,
  date,
  time,
  venue,
  onRSVPClick,
  className = ''
}) => {
  return (
    <div className={`transform hover:scale-105 transition-transform duration-700 ease-out ${className}`}>
      {/* Shadow behind card */}
      <div className="absolute inset-0 bg-stone-900/20 blur-2xl transform translate-y-8 scale-95 -z-10"></div>
      
      <div className="bg-stone-50 border border-stone-300/60 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] p-12 md:p-16 max-w-md mx-auto relative overflow-hidden">
        
        {/* Your actual paper texture image*/}
        <div 
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            backgroundImage: "url('/images/invitationTexture.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            mixBlendMode: 'multiply'
          }}
        ></div>

        {/* Botanical image overlay */}
        <div 
          className="absolute inset-0 opacity-25 bg-cover bg-center bg-no-repeat pointer-events-none"
          style={{
            backgroundImage: "url('/images/cardBotanical.webp')",
            backgroundPosition: 'right center',
            mixBlendMode: 'multiply'
          }}
        ></div>

        {/* Slight vignette for depth */}
        <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(0,0,0,0.05)] pointer-events-none"></div>
        
        {/* Invitation content */}
        <div className="relative text-center">
          {/* Decorative top border */}
          <div className="w-16 h-px bg-stone-400 mx-auto mb-8"></div>
          
          {/* Header text */}
          <p className="text-xs font-light tracking-[0.3em] uppercase text-stone-700 mb-8">
            The honor of your presence is requested<br />at the wedding of
          </p>
          
          {/* Circular Monogram with names and date */}
          <div className="mb-8">
            <CircularMonogram
              bride={coupleNames.bride}
              groom={coupleNames.groom}
              date={date}
              size="md"
            />
          </div>

          {/* Event details */}
          <div className="space-y-6 text-stone-700">
            <div className="py-4">
              <div className="w-12 h-px bg-stone-400 mx-auto mb-4"></div>
              <p className="text-sm font-light tracking-wide">{time}</p>
              <div className="w-12 h-px bg-stone-400 mx-auto mt-4"></div>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-light tracking-wide">{venue.name}</p>
              <p className="text-xs font-light text-stone-600 tracking-wide">{venue.location}</p>
            </div>
          </div>
          
          {/* Decorative bottom border */}
          <div className="w-16 h-px bg-stone-400 mx-auto mt-8 mb-6"></div>
          
          {/* RSVP button */}
          <button 
            onClick={onRSVPClick}
            className="text-xs font-light tracking-[0.2em] uppercase text-stone-600 hover:text-stone-800 transition-colors duration-300 border-b border-stone-400 hover:border-stone-600 pb-1"
          >
            RSVP
          </button>
        </div>
      </div>
    </div>
  );
};