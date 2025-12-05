import React from 'react';

interface GridItem {
  id: string;
  span: string; // Tailwind grid classes like "col-span-8"
  content: React.ReactNode;
}

interface EditorialGridProps {
  items: GridItem[];
  className?: string;
}

export const EditorialGrid: React.FC<EditorialGridProps> = ({
  items,
  className = ''
}) => {
  return (
    <div className={`grid grid-cols-12 grid-rows-2 gap-4 h-[600px] md:h-[800px] ${className}`}>
      {items.map((item) => (
        <div key={item.id} className={`${item.span} overflow-hidden`}>
          {item.content}
        </div>
      ))}
    </div>
  );
};