import React from 'react';
import { Clock, Users, Gift, MapPin } from 'lucide-react';
import { SectionHeader, DetailCard, BlissCard, ImagePlaceholder } from '@/components/ui';

interface VenueDetails {
  name: string;
  description: string;
  address: string;
  features: string[];
}

interface BlissDetailsSectionProps {
  venue: VenueDetails;
  className?: string;
}

export const BlissDetailsSection: React.FC<BlissDetailsSectionProps> = ({
  venue,
  className = ''
}) => {
  const detailCards = [
    {
      icon: Clock,
      title: "Ceremony",
      details: ["4:00 PM", "Garden Pavilion", "Vineyard Estate"]
    },
    {
      icon: Users,
      title: "Reception", 
      details: ["6:00 PM", "Tasting Room", "Dinner & Dancing"]
    },
    {
      icon: Gift,
      title: "Attire",
      details: ["Garden Party", "Cocktail Attire", "Earth Tones Preferred"]
    }
  ];

  return (
    <section id="details" className={`py-20 px-6 bg-stone-50 ${className}`}>
      <div className="max-w-6xl mx-auto">
        <SectionHeader 
          title="Celebration Details"
          align="left"
          className="mb-16"
        />

        <div className="grid md:grid-cols-3 gap-12 mb-20">
          {detailCards.map((card, index) => (
            <DetailCard
              key={index}
              icon={card.icon}
              title={card.title}
              details={card.details}
            />
          ))}
        </div>

        {/* Venue Information */}
        <BlissCard variant="elevated" className="p-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-serif text-stone-800 mb-4 tracking-wide">
                {venue.name}
              </h3>
              <div className="w-12 h-px bg-stone-300 mb-6"></div>
              <p className="text-stone-600 font-light leading-relaxed mb-6">
                {venue.description}
              </p>
              <div className="space-y-2 text-sm text-stone-500 font-light">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>{venue.address}</span>
                </div>
                {venue.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-4 h-4 flex items-center justify-center">
                      <div className="w-1 h-1 bg-stone-400 rounded-full"></div>
                    </div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="aspect-[4/3] rounded-sm overflow-hidden">
              <ImagePlaceholder 
                icon={MapPin} 
                label="Venue Photography" 
                size="lg"
              />
            </div>
          </div>
        </BlissCard>
      </div>
    </section>
  );
};
