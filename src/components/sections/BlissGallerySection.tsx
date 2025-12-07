import React from 'react';
import { SectionHeader, EditorialGrid } from '@/components/ui';

interface BlissGallerySectionProps {
  className?: string;
}

export const BlissGallerySection: React.FC<BlissGallerySectionProps> = ({
  className = ''
}) => {
  const galleryItems = [
    {
      id: 'img1',
      content: (
        <div className="relative w-full overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
          <img
            src="/images/DUVSE3002.JPG"
            alt="Couple Photo"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>
      )
    },
    {
      id: 'img2',
      content: (
        <div className="relative w-full overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
          <img
            src="/images/IMG_2849.jpg"
            alt="Couple Photo"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>
      )
    },
    {
      id: 'img3',
      content: (
        <div className="relative w-full overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
          <img
            src="/images/EBNFE6738.JPG"
            alt="Couple Photo"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>
      )
    },
    {
      id: 'img4',
      content: (
        <div className="relative w-full overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
          <img
            src="/images/IMG_3436.JPG"
            alt="Engagement Portrait"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>
      )
    },
    {
      id: 'img5',
      content: (
        <div className="relative w-full overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
          <img
            src="/images/IMG_3855.jpg"
            alt="Couple Photo"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>
      )
    },
  ];

  return (
    <section id="gallery" className={`py-20 px-6 bg-white ${className}`}>
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          title="Moments"
          className="mb-16"
        />
        <EditorialGrid items={galleryItems} />
      </div>
    </section>
  );
};