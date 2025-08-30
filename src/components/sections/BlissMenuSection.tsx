import React from 'react';
import { Utensils } from 'lucide-react';
import { SectionHeader, BlissCard } from '@/components/ui';

interface MenuCategory {
  name: string;
  items: string[];
}

interface BlissMenuSectionProps {
  menuCategories: MenuCategory[];
  barService?: {
    title: string;
    description: string;
    cocktails?: string[];
  };
  className?: string;
}

export const BlissMenuSection: React.FC<BlissMenuSectionProps> = ({
  menuCategories,
  barService,
  className = ''
}) => {
  return (
    <section id="menu" className={`py-20 px-6 bg-white ${className}`}>
      <div className="max-w-6xl mx-auto">
        <SectionHeader 
          title="Reception Menu"
          subtitle="A curated dining experience prepared by our award-winning chef"
          className="mb-16"
        />

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {menuCategories.map((category, index) => (
            <BlissCard key={index}>
              <h3 className="text-xl font-serif text-stone-800 mb-6 capitalize text-center tracking-wide">
                {category.name}
              </h3>
              <ul className="space-y-3">
                {category.items.map((item, itemIndex) => (
                  <li 
                    key={itemIndex} 
                    className="text-stone-600 text-center py-2 border-b border-stone-100 last:border-b-0 font-light"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </BlissCard>
          ))}
        </div>

        {/* Bar Service */}
        {barService && (
          <BlissCard variant="minimal" className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-sm border border-stone-200">
              <Utensils className="w-5 h-5 text-stone-600" />
            </div>
            <h3 className="text-xl font-serif text-stone-800 mb-4 tracking-wide">
              {barService.title}
            </h3>
            <p className="text-stone-600 font-light leading-relaxed mb-4">
              {barService.description}
            </p>
            {barService.cocktails && (
              <div className="flex justify-center space-x-6 text-sm text-stone-500 font-light">
                {barService.cocktails.map((cocktail, index) => (
                  <span key={index} className="italic">"{cocktail}"</span>
                ))}
              </div>
            )}
          </BlissCard>
        )}
      </div>
    </section>
  );
};
