// src/components/ui/BlissButton.tsx
import React from 'react';

interface BlissButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'minimal' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const BlissButton: React.FC<BlissButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}) => {
  const baseClasses = 'font-light tracking-wider transition-all duration-300 focus:outline-none';
  
  const variants = {
    primary: 'bg-stone-700 text-stone-50 hover:bg-stone-800',
    secondary: 'bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-300',
    minimal: 'text-stone-600 hover:text-stone-800 border-b border-stone-400 hover:border-stone-600 pb-1 rounded-none',
    outline: 'border border-stone-400 text-stone-700 hover:bg-stone-50'
  };

  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-sm'
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};