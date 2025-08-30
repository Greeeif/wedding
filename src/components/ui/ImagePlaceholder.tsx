import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ImagePlaceholderProps {
  icon: LucideIcon;
  label: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({
  icon: Icon,
  label,
  size = 'md',
  className = ''
}) => {
  const sizes = {
    sm: { container: 'w-12 h-12', icon: 16, text: 'text-xs' },
    md: { container: 'w-16 h-16', icon: 24, text: 'text-sm' },
    lg: { container: 'w-20 h-20', icon: 32, text: 'text-sm' }
  };

  return (
    <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-stone-200 to-stone-300 ${className}`}>
      <div className="text-center text-stone-500">
        <div className={`${sizes[size].container} mx-auto mb-4 bg-stone-400/20 rounded-full flex items-center justify-center`}>
          <Icon size={sizes[size].icon} className="text-stone-400" />
        </div>
        <p className={`${sizes[size].text} font-light`}>{label}</p>
      </div>
    </div>
  );
};
