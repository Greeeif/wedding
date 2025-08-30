import React from 'react';
import { Clock, MapPin } from 'lucide-react';
import { Card } from '@/components/ui';
import { WeddingDetails } from '@/types';

interface DetailsSectionProps {
  weddingDetails: WeddingDetails;
}

export const DetailsSection: React.FC<DetailsSectionProps> = ({ weddingDetails }) => {
  const { venue, dressCode } = weddingDetails;

  return (
    <section id="details" className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-light text-center text-gray-800 mb-16">
          Our Special Day
        </h2>
        
        <div className="grid md:grid-cols-2 gap-12">
          <Card hover>
            <h3 className="text-2xl font-medium text-gray-800 mb-4">Ceremony</h3>
            <div className="space-y-3 text-gray-600">
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-rose-500" />
                <span>4:00 PM - 4:30 PM</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-rose-500 mt-1" />
                <div>
                  <p>{venue.ceremonyLocation}</p>
                  <p className="text-sm text-gray-500">{venue.address}</p>
                </div>
              </div>
            </div>
          </Card>
          
          <Card hover>
            <h3 className="text-2xl font-medium text-gray-800 mb-4">Reception</h3>
            <div className="space-y-3 text-gray-600">
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-rose-500" />
                <span>6:00 PM - 12:00 AM</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-rose-500 mt-1" />
                <div>
                  <p>{venue.receptionLocation}</p>
                  <p className="text-sm text-gray-500">Same location as ceremony</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-12 bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl p-8">
          <h3 className="text-2xl font-medium text-gray-800 mb-4 text-center">
            Dress Code
          </h3>
          <p className="text-gray-600 text-center">{dressCode}</p>
        </div>
      </div>
    </section>
  );
};
