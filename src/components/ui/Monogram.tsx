import React from 'react';

interface MonogramProps {
  letters: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'circle' | 'square' | 'minimal';
  className?: string;
}

export const Monogram: React.FC<MonogramProps> = ({
  letters,
  size = 'md',
  variant = 'circle',
  className = ''
}) => {
  const sizes = {
    sm: 'w-12 h-12 text-sm',
    md: 'w-16 h-16 text-lg',
    lg: 'w-24 h-24 text-2xl'
  };

  const variants = {
    circle: 'rounded-full border border-stone-400',
    square: 'rounded-sm border border-stone-400',
    minimal: 'border-b border-stone-400 rounded-none'
  };

  return (
    <div className={`${sizes[size]} ${variants[variant]} flex items-center justify-center bg-stone-50/50 ${className}`}>
      <span className="font-serif text-stone-700 tracking-[0.2em]">
        {letters}
      </span>
    </div>
  );
};