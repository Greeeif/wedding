import React from 'react';

interface CircularMonogramProps {
  bride: string;
  groom: string;
  date: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const CircularMonogram: React.FC<CircularMonogramProps> = ({
  bride,
  groom,
  date,
  size = 'md',
  className = ''
}) => {
  const sizes = {
    sm: { 
      viewBox: 'w-48 h-48', 
      fontSize: 'text-[6px]', 
      initialSize: 'text-2xl',
      topCurve: 'M 50,200 A 75,100 0 0,1 250,200',
      bottomCurve: 'M 50,120 A 100,130 0 0,0 250,120',
      bottomTracking: 'tracking-[0.5em]'
    },
    md: { 
      viewBox: 'w-64 h-64', 
      fontSize: 'text-xs', 
      initialSize: 'text-5xl',
      topCurve: 'M 50,200 A 75,100 0 0,1 250,200',
      bottomCurve: 'M 50,120 A 100,130 0 0,0 250,120',
      bottomTracking: 'tracking-[0.5em]'
    },
    lg: { 
      viewBox: 'w-80 h-80', 
      fontSize: 'text-sm', 
      initialSize: 'text-6xl',
      topCurve: 'M 50,200 A 75,100 0 0,1 250,200',
      bottomCurve: 'M 50,120 A 100,130 0 0,0 250,120',
      bottomTracking: 'tracking-[0.5em]'
    }
  };

  const currentSize = sizes[size];
  
  // Create unique IDs for this instance
  const topCurveId = `topCurve-${size}`;
  const bottomCurveId = `bottomCurve-${size}`;

  return (
    <svg
      viewBox="0 0 300 300"
      className={`${currentSize.viewBox} mx-auto ${className}`}
    >
      {/* Top curved text - names */}
      <path
        id={topCurveId}
        d={currentSize.topCurve}
        fill="transparent"
      />
      <text className={`${currentSize.fontSize} font-light tracking-[0.5em] uppercase fill-stone-700`}>
        <textPath href={`#${topCurveId}`} startOffset="50%" textAnchor="middle">
          {bride.toUpperCase()} AND {groom.toUpperCase()}
        </textPath>
      </text>

      {/* Center monogram initials */}
      <text
        x="150"
        y="160"
        textAnchor="middle"
        dominantBaseline="middle"
        className={`${currentSize.initialSize} font-serif fill-stone-700`}
        style={{ letterSpacing: '-0.05em' }}
      >
        {bride.charAt(0)}
        <tspan dy="5" fontSize="0.7em">{groom.charAt(0)}</tspan>
      </text>

      {/* Bottom curved text - date */}
      <path
        id={bottomCurveId}
        d={currentSize.bottomCurve}
        fill="transparent"
      />
      <text className={`${currentSize.fontSize} font-light ${currentSize.bottomTracking} uppercase fill-stone-700`}>
        <textPath href={`#${bottomCurveId}`} startOffset="50%" textAnchor="middle">
          {date.trim().replace(/\s+/g, ' ').toUpperCase()}
        </textPath>
      </text>
    </svg>
  );
};