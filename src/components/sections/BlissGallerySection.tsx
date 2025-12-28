import React from 'react';
import Image from 'next/image';
import { SectionHeader } from '@/components/ui/SectionHeader';

interface BlissGallerySectionProps {
  className?: string;
}

export const BlissGallerySection: React.FC<BlissGallerySectionProps> = ({
  className = ''
}) => {
  const galleryImages = [
    {
      id: 'party',
      src: '/images/couple_party.jpg',
      alt: 'Elodie and Beckett at a party',
      width: 2000,
      height: 1499,
      rowSpan: 'row-span-1',
    },
    // {
    //   id: 'tokyo-night',
    //   src: '/images/couple_tokyo_night.jpg',
    //   alt: 'Elodie and Beckett in Tokyo at night',
    //   width: 3024,
    //   height: 4032,
    //   rowSpan: 'row-span-2',
    // },
    // {
    //   id: 'waterfall',
    //   src: '/images/couple_waterfall.jpg',
    //   alt: 'Elodie and Beckett at a waterfall',
    //   width: 626,
    //   height: 835,
    //   rowSpan: 'row-span-2',
    // },

    {
      id: 'archway',
      src: '/images/couple_archway.jpg',
      alt: 'Elodie and Beckett at an archway',
      width: 1500,
      height: 2000,
      rowSpan: 'row-span-2',
    },
    {
      id: 'ice-cream',
      src: '/images/couple_ice_cream.jpg',
      alt: 'Elodie and Beckett with ice cream',
      width: 2000,
      height: 2000,
      rowSpan: 'row-span-2',
    },
    {
      id: 'archway-playful',
      src: '/images/couple_forest.jpg',
      alt: 'Elodie and Beckett being playful at archway',
      width: 683,
      height: 911,
      rowSpan: 'row-span-1',
    },
    {
      id: 'archway-fun',
      src: '/images/couple_archway_fun.jpg',
      alt: 'Elodie and Beckett having fun at archway',
      width: 683,
      height: 911,
      rowSpan: 'row-span-2',
    },
    {
      id: 'engagement',
      src: '/images/couple_engagement.jpg',
      alt: 'Elodie and Beckett engagement photo',
      width: 683,
      height: 911,
      rowSpan: 'row-span-2',
    },
        {
      id: 'city-night',
      src: '/images/couple_city_night.jpg',
      alt: 'Elodie and Beckett city night',
      width: 4032,
      height: 3024,
      rowSpan: 'row-span-1',
    },
    {
      id: 'temple',
      src: '/images/couple_temple.jpg',
      alt: 'Elodie and Beckett at a temple',
      width: 1215,
      height: 911,
      rowSpan: 'row-span-1',
    },
  ];

 return (
    <section id="gallery" className={`py-20 px-6 bg-white ${className}`}>
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          title="Moments"
          className="mb-16"
        />
        
        {/* Hybrid Masonry Grid - Uniform bottom edge with natural flow */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[200px] gap-4">
          {galleryImages.map((image) => (
            <div
              key={image.id}
              className={`group ${image.rowSpan}`}
            >
              <div className="relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 h-full">
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};


