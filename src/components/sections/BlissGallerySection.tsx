import React from 'react';
import { Users, Gift, MapPin, Camera } from 'lucide-react';
import { SectionHeader, EditorialGrid, ImagePlaceholder } from '@/components/ui';

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
      content: <ImagePlaceholder icon={Users} label="Engagement Portrait" size="lg" />
    },
    {
      id: 'detail1',
      span: 'col-span-6 md:col-span-4',
      content: <ImagePlaceholder icon={Gift} label="couple photo 1" size="md" />
    },
    {
      id: 'detail2',
      span: 'col-span-6 md:col-span-4',
      content: <ImagePlaceholder icon={Camera} label="couple photo 2" size="md" />
    },
    {
      id: 'detail3',
      span: 'col-span-6 md:col-span-4',
      content: <ImagePlaceholder icon={Camera} label="couple photo 3" size="md" />
    },
        {
      id: 'detail4',
      span: 'col-span-6 md:col-span-4',
      content: <ImagePlaceholder icon={Camera} label="couple photo 4" size="md" />
    },
        {
      id: 'detail5',
      span: 'col-span-6 md:col-span-4',
      content: <ImagePlaceholder icon={MapPin} label="couple photo 5" size="md" />
    }
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