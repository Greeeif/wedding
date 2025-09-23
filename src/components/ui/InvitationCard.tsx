import React from 'react';

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
    <div className={`transform hover:scale-150 transition-transform duration-700 ease-out ${className}`}>
      <div className="bg-stone-50/95 backdrop-blur-sm border border-stone-200/50 shadow-2xl shadow-stone-900/10 p-12 md:p-16 max-w-md mx-auto relative">
        {/* Subtle paper texture */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-stone-100/30 pointer-events-none"></div>
        
        {/* Invitation content */}
        <div className="relative text-center">
          {/* Decorative top border */}
          <div className="w-16 h-px bg-stone-400 mx-auto mb-8"></div>
          
          {/* Monogram */}
          <div className="mb-8">
            <div className="w-16 h-16 mx-auto border border-stone-400 rounded-full flex items-center justify-center mb-3">
              <span className="text-lg font-serif text-stone-700 tracking-[0.2em]">
                {coupleNames.bride.charAt(0)}&{coupleNames.groom.charAt(0)}
              </span>
            </div>
          </div>

          {/* Main invitation text */}
          <div className="space-y-6 text-stone-700">
            <p className="text-xs font-light tracking-[0.3em] uppercase">
              Together with our families
            </p>
            
            <h1 className="text-3xl md:text-4xl font-serif tracking-wide leading-tight">
              {coupleNames.bride} & {coupleNames.groom}
            </h1>
            
            <p className="text-xs font-light tracking-[0.2em] uppercase">
              Request the pleasure of your company
            </p>
            
            <div className="py-4">
              <div className="w-12 h-px bg-stone-400 mx-auto mb-4"></div>
              <p className="text-sm font-light tracking-wide">{date}</p>
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