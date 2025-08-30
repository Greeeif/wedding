import React from 'react';

interface BlissTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const BlissTextarea: React.FC<BlissTextareaProps> = ({
  label,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-light text-stone-700 mb-2 tracking-wide">
          {label}
        </label>
      )}
      <textarea
        className={`w-full px-4 py-3 border border-stone-200 rounded-sm focus:outline-none focus:border-stone-400 transition-colors font-light resize-none ${
          error ? 'border-red-400' : ''
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-2 text-sm text-red-500 font-light">{error}</p>
      )}
    </div>
  );
};
