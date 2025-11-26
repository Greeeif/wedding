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
  className = ''
}) => {
  return (
    <div className={`transform hover:scale-105 transition-transform duration-700 ease-out ${className}`}>
      <div className="absolute inset-0 bg-stone-900/20 blur-2xl transform translate-y-8 scale-85 -z-10"></div>
      {/* Responsive card sizing - wider on mobile for better readability */}
      <div className="bg-stone-50 border border-stone-300/60 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] p-6 sm:p-8 md:p-16 max-w-[280px] sm:max-w-sm md:max-w-md mx-auto relative overflow-hidden">
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
          <div className="w-10 sm:w-12 md:w-16 h-px bg-stone-400 mx-auto mb-2 sm:mb-6 md:mb-8"></div>
          
          {/* Header text - improved mobile readability */}
          <p className="text-[0.625rem] sm:text-[0.7rem] md:text-xs font-light tracking-[0.15em] sm:tracking-[0.2em] md:tracking-[0.25em] uppercase text-stone-700 mb-4 sm:mb-5 md:mb-8 leading-relaxed">
            The Pleasure of your company is requested<br />at the wedding of
          </p>
          
          {/* Circular Monogram with names and date */}
          <div className="mb-4 sm:mb-5 md:mb-8">
            <CircularMonogram
              bride={coupleNames.bride}
              groom={coupleNames.groom}
              date={date}
              size="sm"
              className="sm:hidden"
            />
            <CircularMonogram
              bride={coupleNames.bride}
              groom={coupleNames.groom}
              date={date}
              size="md"
              className="hidden sm:block"
            />
          </div>

          {/* Event details - improved mobile sizing */}
          <div className="space-y-2 sm:space-y-4 md:space-y-6 text-stone-700">
            <div className="py-1.5 sm:py-2 md:py-4">
              <div className="w-10 sm:w-10 md:w-12 h-px bg-stone-400 mx-auto mb-2 sm:mb-2 md:mb-4"></div>
              <p className="text-[0.7rem] sm:text-xs md:text-sm font-light tracking-wide">{time}</p>
              <div className="w-10 sm:w-10 md:w-12 h-px bg-stone-400 mx-auto mt-2 sm:mt-2 md:mt-4"></div>
            </div>
            
            <div className="space-y-1 sm:space-y-1">
              <p className="text-[0.7rem] sm:text-xs md:text-sm font-light tracking-wide">{venue.name}</p>
              <p className="text-[0.625rem] sm:text-[0.7rem] md:text-xs font-light text-stone-600 tracking-wide">{venue.location}</p>
            </div>
          </div>
          
          {/* Decorative bottom border */}
          <div className="w-10 sm:w-12 md:w-16 h-px bg-stone-400 mx-auto mt-4 sm:mt-5 md:mt-8 mb-2 sm:mb-2 md:mb-3"></div>
          
          {/* RSVP button - improved mobile size */}
          <p 
            className="text-[0.625rem] sm:text-[0.7rem] md:text-xs font-light tracking-[0.15em] uppercase text-stone-600 hover:text-stone-900 transition-colors duration-300"
          >
            save the date
          </p>
                    
          {/* Decorative bottom border */}
          <div className="w-10 sm:w-12 md:w-16 h-px bg-stone-400 mx-auto mt-2 sm:mt-2 md:mt-3 mb-2 sm:mb-2 md:mb-3"></div>
        </div>
      </div>
    </div>
  );
};