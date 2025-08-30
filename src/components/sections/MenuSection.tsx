import React from 'react';
import { Utensils } from 'lucide-react';
import { Card } from '@/components/ui';
import { MenuCategory } from '@/types';

const menuData: Record<string, string[]> = {
  appetizers: ["Truffle Arancini", "Smoked Salmon Canapés", "Wild Mushroom Bruschetta"],
  mains: ["Herb-Crusted Lamb", "Pan-Seared Sea Bass", "Vegetarian Wellington"],
  desserts: ["Wedding Cake", "Chocolate Lava Cake", "Seasonal Fruit Tart"]
};

export const MenuSection: React.FC = () => {
  return (
    <section id="menu" className="py-20 px-6 bg-gradient-to-br from-rose-50 to-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Utensils className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-4xl font-light text-gray-800 mb-4">Reception Menu</h2>
          <p className="text-gray-600">
            A curated dining experience prepared by our award-winning chef
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {Object.entries(menuData).map(([category, items]) => (
            <Card key={category}>
              <h3 className="text-2xl font-medium text-gray-800 mb-6 capitalize text-center">
                {category}
              </h3>
              <ul className="space-y-3">
                {items.map((item, index) => (
                  <li 
                    key={index} 
                    className="text-gray-600 text-center py-2 border-b border-gray-100 last:border-b-0"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>

        <div className="mt-12 bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-medium text-gray-800 mb-4">Bar Service</h3>
          <p className="text-gray-600">
            Full premium bar with signature cocktails: "Sarah's Sunset" and "James' Old Fashioned"
          </p>
        </div>
      </div>
    </section>
  );
};