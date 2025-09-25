import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface NavigationItem {
  id: string;
  label: string;
}

interface BlissNavigationProps {
  monogramLetters: string;
  items: NavigationItem[];
  currentSection: string;
  isScrolled: boolean;
  onSectionClick: (sectionId: string) => void;
}

export const BlissNavigation: React.FC<BlissNavigationProps> = ({
  monogramLetters,
  items,
  currentSection,
  isScrolled,
  onSectionClick
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSectionClick = (sectionId: string) => {
    onSectionClick(sectionId);
    setIsMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
      isScrolled ? 'bg-stone-50/95 backdrop-blur-lg shadow-sm' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo/Monogram */}
          <div className="text-2xl font-serif text-stone-700 tracking-wide">
            {monogramLetters}
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSectionClick(item.id)}
                className={`text-sm font-light tracking-wide transition-colors duration-300 ${
                  currentSection === item.id ? 'text-stone-900' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-stone-700"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-stone-200">
            <div className="flex flex-col space-y-3 pt-4">
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSectionClick(item.id)}
                  className="text-left text-stone-600 hover:text-stone-900 font-light tracking-wide"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};