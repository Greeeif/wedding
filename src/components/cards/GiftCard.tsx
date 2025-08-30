// src/components/cards/GiftCard.tsx
import React from 'react';
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