import React from 'react';

interface BotanicalBackgroundProps {
  children: React.ReactNode;
  variant?: 'default' | 'light' | 'dark';
  className?: string;
}

export const BotanicalBackground: React.FC<BotanicalBackgroundProps> = ({
  children,
  variant = 'default',
  className = ''
}) => {
  const variants = {
    default: 'from-stone-100 via-stone-200 to-stone-300',
    light: 'from-stone-50 via-stone-100 to-stone-200',
    dark: 'from-stone-200 via-stone-300 to-stone-400'
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Botanical background with subtle texture */}
      <div className={`absolute inset-0 bg-gradient-to-br ${variants[variant]}`}>
        {/* Botanical shadow overlay - mimicking plant shadows */}
        <div className="absolute inset-0 opacity-30">
          {/* Large leaf shadow - top left */}
          <div className="absolute top-0 left-0 w-1/3 h-1/2 bg-gradient-to-br from-stone-600/20 to-transparent transform -rotate-12"></div>
          
          {/* Branch shadows - right side */}
          <div className="absolute top-1/4 right-0 w-1/4 h-3/4 bg-gradient-to-l from-stone-700/15 to-transparent"></div>
          
          {/* Delicate leaf patterns */}
          <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-stone-600/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-1/4 left-1/3 w-24 h-24 bg-stone-600/8 rounded-full blur-xl"></div>
          <div className="absolute top-2/3 right-1/3 w-16 h-16 bg-stone-600/12 rounded-full blur-lg"></div>
        </div>
        
        {/* Soft light filtering effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-stone-50/30 via-transparent to-stone-100/20"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};