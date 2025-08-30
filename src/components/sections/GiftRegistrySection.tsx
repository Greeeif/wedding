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

// src/components/cards/GiftCard.tsx
import { Button, Card } from '@/components/ui';
import { GiftItem } from '@/types';

interface GiftCardProps {
  gift: GiftItem;
  onPurchase: () => void;
}

export const GiftCard: React.FC<GiftCardProps> = ({ gift, onPurchase }) => {
  return (
    <Card className="hover:scale-105 transition-transform duration-300">
      <div className="text-4xl mb-4 text-center">{gift.image}</div>
      <h3 className="text-xl font-medium text-gray-800 mb-2">{gift.name}</h3>
      <p className="text-rose-600 font-medium mb-4">{gift.price}</p>
      {gift.description && (
        <p className="text-sm text-gray-600 mb-4">{gift.description}</p>
      )}
      
      {gift.purchased ? (
        <div className="w-full py-2 text-center text-gray-500 bg-gray-100 rounded-lg">
          Already Purchased
        </div>
      ) : (
        <Button onClick={onPurchase} className="w-full">
          Purchase Gift
        </Button>
      )}
    </Card>
  );
};