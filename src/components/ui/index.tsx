// src/components/ui/index.ts
export const Button = ({ children, onClick, className = "", disabled = false, ...props }: any) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`font-medium rounded-lg transition-all duration-200 transform hover:scale-105 bg-gradient-to-r from-rose-500 to-pink-500 text-white px-6 py-3 hover:from-rose-600 hover:to-pink-600 shadow-lg hover:shadow-xl ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const Input = ({ label, className = "", ...props }: any) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent ${className}`}
        {...props}
      />
    </div>
  );
};

export const Card = ({ children, className = "" }: any) => {
  return (
    <div className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 ${className}`}>
      {children}
    </div>
  );
};