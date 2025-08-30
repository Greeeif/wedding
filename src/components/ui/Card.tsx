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