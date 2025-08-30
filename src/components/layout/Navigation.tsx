// src/components/layout/Navigation.tsx
import React from 'react';
import { NavigationSection } from '@/types';

interface NavigationProps {
  currentSection: string;
  isScrolled: boolean;
  onSectionClick: (sectionId: string) => void;
}

const navigationSections: NavigationSection[] = [
  { id: 'hero', label: 'Home', href: '#hero' },
  { id: 'details', label: 'Details', href: '#details' },
  { id: 'rsvp', label: 'RSVP', href: '#rsvp' },
  { id: 'registry', label: 'Registry', href: '#registry' },
  { id: 'menu', label: 'Menu', href: '#menu' }
];

export const Navigation: React.FC<NavigationProps> = ({ 
  currentSection, 
  isScrolled, 
  onSectionClick 
}) => {
  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/90 backdrop-blur-lg shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex justify-center space-x-8">
          {navigationSections.map((section) => (
            <button
              key={section.id}
              onClick={() => onSectionClick(section.id)}
              className={`text-sm font-medium transition-colors duration-200 hover:text-rose-600 ${
                currentSection === section.id ? 'text-rose-600' : 'text-gray-600'
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};