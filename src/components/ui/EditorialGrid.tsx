import React from 'react';

interface GridItem {
  id: string;
  span?: string; // Optional, kept for backwards compatibility
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
    <div className={`columns-1 md:columns-2 lg:columns-3 gap-4 ${className}`}>
      {items.map((item) => (
        <div key={item.id} className="break-inside-avoid mb-4">
          {item.content}
        </div>
      ))}
    </div>
  );
};