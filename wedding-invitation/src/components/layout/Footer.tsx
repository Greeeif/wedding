import React from 'react';
import { Heart, Mail, Phone } from 'lucide-react';
import { ContactInfo, WeddingDetails } from '@/types';

interface FooterProps {
  coupleNames: WeddingDetails['coupleNames'];
  contactInfo: ContactInfo;
}

export const Footer: React.FC<FooterProps> = ({ coupleNames, contactInfo }) => {
  return (
    <footer className="bg-gray-50 py-12 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-6">
          <Heart className="w-8 h-8 text-rose-400 mx-auto mb-4" />
          <h3 className="text-2xl font-light text-gray-800 mb-2">Questions?</h3>
        </div>
        
        <div className="flex justify-center space-x-8 mb-8">
          <div className="flex items-center space-x-2">
            <Mail className="w-5 h-5 text-rose-500" />
            <span className="text-gray-600">{contactInfo.email}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Phone className="w-5 h-5 text-rose-500" />
            <span className="text-gray-600">{contactInfo.phone}</span>
          </div>
        </div>
        
        <p className="text-gray-500 text-sm">
          Can't wait to celebrate with you! ♥ {coupleNames.bride} & {coupleNames.groom}
        </p>
      </div>
    </footer>
  );
};