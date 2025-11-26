import React from 'react';
import { Users } from 'lucide-react';
import { SectionHeader, ImagePlaceholder } from '@/components/ui';

interface BlissStorySectionProps {
  story: {
    title?: string;
    paragraphs: string[];
  };
  className?: string;
}

export const BlissStorySection: React.FC<BlissStorySectionProps> = ({
  story,
  className = ''
}) => {
  // Split paragraphs around the flowers
  const flowerIndex = story.paragraphs.findIndex(p => p.includes('𓆸'));
  const beforeFlowers = flowerIndex !== -1 ? story.paragraphs.slice(0, flowerIndex) : story.paragraphs;
  const flowers = flowerIndex !== -1 ? story.paragraphs[flowerIndex] : null;
  const afterFlowers = flowerIndex !== -1 ? story.paragraphs.slice(flowerIndex + 1) : [];

  return (
    <section id="story" className={`py-20 px-6 bg-white ${className}`}>
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <SectionHeader 
              title={story.title || "Our Story"} 
              align="center"
            />
            
            {/* Before flowers */}
            <div className="space-y-6 text-stone-600 font-normal leading-relaxed text-center text-md">
              {beforeFlowers.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
            
            {/* Flowers - bigger and centered */}
            {flowers && (
              <div className="my-4 text-center">
                <p className="text-2xl md:text-4xl leading-none">{flowers}</p>
              </div>
            )}
            
            {/* After flowers */}
            <div className="space-y-6 text-stone-600 font-normal leading-relaxed text-center">
              {afterFlowers.map((paragraph, index) => (
                <p key={`after-${index}`}>{paragraph}</p>
              ))}
            </div>
          </div>
          
          <div className="relative">
            <div 
              className="aspect-[4/5] rounded-lg shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-stone-200/60 overflow-hidden"
              style={{
                backgroundImage: "url('/images/holidayPhoto.jpg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
            </div>
            {/* Decorative shadow */}
            <div className="absolute -bottom-4 -right-4 w-full h-full bg-stone-300/30 rounded-sm -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
};