// src/components/ui/Button.tsx
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  className = '',
  ...props 
}) => {
  const baseClasses = 'font-medium rounded-lg transition-all duration-200 transform hover:scale-105';
  
  const variants = {
    primary: 'bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:from-rose-600 hover:to-pink-600 shadow-lg hover:shadow-xl',
    secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 shadow-md hover:shadow-lg',
    outline: 'border-2 border-rose-500 text-rose-500 hover:bg-rose-50',
    ghost: 'text-gray-600 hover:text-rose-600 hover:bg-rose-50'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
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

// src/components/ui/Input.tsx
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ 
  label, 
  error, 
  className = '', 
  ...props 
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-colors ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

// src/components/ui/Card.tsx
interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  hover = true 
}) => {
  return (
    <div className={`bg-white rounded-2xl p-6 shadow-lg ${
      hover ? 'hover:shadow-xl transition-shadow duration-300' : ''
    } ${className}`}>
      {children}
    </div>
  );
};

// src/components/ui/index.ts
export { Button } from './Button';
export { Input } from './Input';
export { Card } from './Card';