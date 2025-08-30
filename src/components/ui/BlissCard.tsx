import React from 'react';

interface BlissCardProps {
  children: React.ReactNode;
  variant?: 'default' | 'minimal' | 'elevated';
  className?: string;
  hover?: boolean;
}

export const BlissCard: React.FC<BlissCardProps> = ({
  children,
  variant = 'default',
  className = '',
  hover = true
}) => {
  const variants = {
    default: 'bg-white shadow-sm border border-stone-200/50',
    minimal: 'bg-stone-50/50 border border-stone-200/30',
    elevated: 'bg-white shadow-lg shadow-stone-900/5'
  };

  const hoverEffect = hover ? 'hover:shadow-xl hover:shadow-stone-900/10 transition-shadow duration-500' : '';

  return (
    <div className={`${variants[variant]} ${hoverEffect} rounded-sm p-8 ${className}`}>
      {children}
    </div>
  );
};
