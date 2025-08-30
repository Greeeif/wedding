// src/components/sections/HeroSection.tsx
import React from 'react';
import { Heart, Calendar, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui';
import { WeddingDetails } from '@/types';

interface HeroSectionProps {
  weddingDetails: WeddingDetails;
  onRSVPClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ 
  weddingDetails, 
  onRSVPClick 
}) => {
  const { coupleNames, date, time, venue } = weddingDetails;

  return (
    <section 
      id="hero" 
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-rose-100/50 to-pink-200/30"></div>
      
      <div className="relative text-center px-6 max-w-4xl mx-auto">
        <div className="mb-8 animate-pulse">
          <Heart className="w-16 h-16 text-rose-400 mx-auto mb-4" />
        </div>
        
        <h1 className="text-6xl md:text-8xl font-light text-gray-800 mb-4 tracking-tight">
          {coupleNames.bride} & {coupleNames.groom}
        </h1>
        
        <div className="w-32 h-px bg-gradient-to-r from-transparent via-rose-300 to-transparent mx-auto mb-6"></div>
        
        <p className="text-xl md:text-2xl text-gray-600 mb-8 font-light">
          Together with our families, we invite you to celebrate our love
        </p>
        
        <div className="space-y-2 text-lg text-gray-700 mb-12">
          <div className="flex items-center justify-center space-x-2">
            <Calendar className="w-5 h-5 text-rose-500" />
            <span>{date}</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <Clock className="w-5 h-5 text-rose-500" />
            <span>{time}</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <MapPin className="w-5 h-5 text-rose-500" />
            <span>{venue.name}</span>
          </div>
        </div>
        
        <Button size="lg" onClick={onRSVPClick}>
          RSVP Now
        </Button>
      </div>
    </section>
  );
};