import React from 'react';
import { ExternalLink } from 'lucide-react';
import { SectionHeader, BlissCard, BlissButton } from '@/components/ui';

interface RegistryItem {
  id: string;
  store: string;
  url: string;
  description?: string;
}

interface BlissRegistrySectionProps {
  registryItems: RegistryItem[];
  message?: string;
  className?: string;
}

export const BlissRegistrySection: React.FC<BlissRegistrySectionProps> = ({
  registryItems,
  message = "enter short message about your registry here later / get Yarah to write something",
  className = ''
}) => {
  return (
    <section id="registry" className={`py-20 px-6 bg-white ${className}`}>
      <div className="max-w-4xl mx-auto">
        <SectionHeader 
          title="Gift Registry"
          subtitle={message}
          className="mb-16"
        />

        <div className="grid md:grid-cols-2 gap-8">
          {registryItems.map((item) => (
            <BlissCard key={item.id} className="text-center">
              <h3 className="text-xl font-serif text-stone-800 mb-4 tracking-wide">
                {item.store}
              </h3>
              {item.description && (
                <p className="text-stone-600 font-light mb-6 leading-relaxed">
                  {item.description}
                </p>
              )}
              <BlissButton
                variant="outline"
                onClick={() => window.open(item.url, '_blank')}
                className="inline-flex items-center space-x-2"
              >
                <span>View Registry</span>
                <ExternalLink className="w-4 h-4" />
              </BlissButton>
            </BlissCard>
          ))}
        </div>
      </div>
    </section>
  );
};
