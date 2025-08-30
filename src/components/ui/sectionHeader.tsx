import React from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  align = 'center',
  className = ''
}) => {
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  };

  const lineAlign = {
    left: 'mr-auto',
    center: 'mx-auto',
    right: 'ml-auto'
  };

  return (
    <div className={`${alignClasses[align]} ${className}`}>
      <h2 className="text-3xl md:text-4xl font-serif text-stone-800 mb-4 tracking-wide">
        {title}
      </h2>
      <div className={`w-16 h-px bg-stone-300 mb-6 ${lineAlign[align]}`}></div>
      {subtitle && (
        <p className="text-stone-600 font-light leading-relaxed max-w-2xl">
          {subtitle}
        </p>
      )}
    </div>
  );
};