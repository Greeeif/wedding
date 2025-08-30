// src/components/sections/GiftRegistrySection.tsx
import React from 'react';
import { Gift } from 'lucide-react';
import { GiftCard } from '@/components/cards/GiftCard';
import { GiftItem } from '@/types';

interface GiftRegistrySectionProps {
  gifts: GiftItem[];
  onGiftPurchase: (giftId: string) => void;
}

export const GiftRegistrySection: React.FC<GiftRegistrySectionProps> = ({ 
  gifts, 
  onGiftPurchase 
}) => {
  return (
    <section id="registry" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <Gift className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-4xl font-light text-gray-800 mb-4">Gift Registry</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Your presence is the greatest gift, but if you wish to honor us with something special, 
            these items would help us start our journey together.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {gifts.map((gift) => (
            <GiftCard
              key={gift.id}
              gift={gift}
              onPurchase={() => onGiftPurchase(gift.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};