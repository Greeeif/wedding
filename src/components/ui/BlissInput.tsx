import React from 'react';

interface BlissInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const BlissInput: React.FC<BlissInputProps> = ({
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
      <input
        className={`w-full px-4 py-3 border border-stone-200 rounded-sm focus:outline-none focus:border-stone-400 transition-colors font-light ${
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
