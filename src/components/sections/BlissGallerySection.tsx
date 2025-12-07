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
      id: 'main',
      span: 'col-span-12 md:col-span-8 row-span-2',
      content: (
        <div className="w-full h-full overflow-hidden rounded-lg">
          <img
            src="/images/IMG_3436.JPG"
            alt="Engagement Portrait"
            className="w-full h-full object-cover"
          />
        </div>
      )
    },
    {
      id: 'detail1',
      span: 'col-span-6 md:col-span-4',
      content: (
        <div className="w-full h-full overflow-hidden rounded-lg">
          <img
            src="/images/DUVSE3002.JPG"
            alt="Couple Photo"
            className="w-full h-full object-cover"
          />
        </div>
      )
    },
    {
      id: 'detail2',
      span: 'col-span-6 md:col-span-4',
      content: (
        <div className="w-full h-full overflow-hidden rounded-lg">
          <img
            src="/images/EBNFE6738.JPG"
            alt="Couple Photo"
            className="w-full h-full object-cover"
          />
        </div>
      )
    },
    {
      id: 'detail3',
      span: 'col-span-6 md:col-span-4',
      content: (
        <div className="w-full h-full overflow-hidden rounded-lg">
          <img
            src="/images/IMG_2849.jpg"
            alt="Couple Photo"
            className="w-full h-full object-cover"
          />
        </div>
      )
    },
    {
      id: 'detail4',
      span: 'col-span-6 md:col-span-4',
      content: (
        <div className="w-full h-full overflow-hidden rounded-lg">
          <img
            src="/images/IMG_3855.jpg"
            alt="Couple Photo"
            className="w-full h-full object-cover"
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