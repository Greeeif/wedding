import React from 'react';
import { LucideIcon } from 'lucide-react';
import { BlissCard } from './BlissCard';

interface DetailCardProps {
  icon: LucideIcon;
  title: string;
  details: string[];
  className?: string;
}

export const DetailCard: React.FC<DetailCardProps> = ({
  icon: Icon,
  title,
  details,
  className = ''
}) => {
  return (
    <BlissCard className={`text-center ${className}`}>
      <div className="w-16 h-16 mx-auto mb-6 bg-white rounded-full flex items-center justify-center shadow-sm border border-stone-200">
        <Icon className="w-6 h-6 text-stone-600" />
      </div>
      <h3 className="text-xl font-serif text-stone-800 mb-4 tracking-wide">{title}</h3>
      <div className="space-y-2 text-stone-600 font-light">
        {details.map((detail, index) => (
          <p key={index}>{detail}</p>
        ))}
      </div>
    </BlissCard>
  );
};