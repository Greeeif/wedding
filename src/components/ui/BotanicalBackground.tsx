import React from 'react';

interface BotanicalBackgroundProps {
  children: React.ReactNode;
  // variant?: 'default' | 'light' | 'dark';
  className?: string;
}

export const BotanicalBackground: React.FC<BotanicalBackgroundProps> = ({
  children,
  // variant = 'default',
  className = ''
}) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Paper/Sandy texture background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/botanicalBackground.webp')",
          backgroundBlendMode: 'multiply'
        }}
      >
        {/* Subtle overlay for color tinting */}
        <div className="absolute inset-0 bg-stone-200/40"></div>
      </div>

      {/* Keep your existing botanical shadows */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-1/3 h-1/2 bg-gradient-to-br from-stone-600/20 to-transparent transform -rotate-12"></div>
        <div className="absolute top-1/4 right-0 w-1/4 h-3/4 bg-gradient-to-l from-stone-700/15 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};