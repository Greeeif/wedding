// src/app/page.tsx - Complete Wedding Landing Page
'use client';

import React, { useState, useEffect } from 'react';
import {
  BlissHeroSection,
  BlissStorySection,
  BlissDetailsSection,
  BlissGallerySection,
  BlissRSVPSection,
  BlissMenuSection,
  BlissRegistrySection,
  BlissFooter
} from '@/components/sections';
import { BlissNavigation } from '@/components/ui';

// Wedding data - customize this for your actual wedding
const weddingData = {
  coupleNames: {
    bride: "Yarah",
    groom: "Alex"
  },
  date: "September 15th, 2024",
  time: "4:00 PM",
  venue: {
    name: "Vineyard Estate",
    location: "Napa Valley, California",
    description: "A stunning vineyard nestled in the rolling hills of Napa Valley, offering panoramic views of the countryside and an intimate setting for our special day.",
    address: "1234 Vineyard Lane, Napa Valley, CA 94558",
    features: [
      "Outdoor ceremony pavilion",
      "Vineyard reception space",
      "Complimentary parking",
      "Wheelchair accessible"
    ]
  },
  story: {
    title: "How We Met",
    paragraphs: [
      "Our love story began five years ago at a small coffee shop in San Francisco. Alex was reading a book about sustainable architecture, and Yarah couldn't help but notice the passion in his eyes as he sketched building designs in the margins.",
      "What started as a conversation about green building practices turned into hours of talking about our dreams, travels, and shared love for creating beautiful spaces. From that first meeting, we knew we had found something special.",
      "Through adventures around the world, late-night design sessions, and quiet Sunday mornings, we've built a love that feels like home. Now, we're ready to start our greatest project yet – a lifetime together."
    ]
  },
  menuCategories: [
    {
      name: "Appetizers",
      items: [
        "Truffle Arancini with Wild Mushrooms",
        "Smoked Salmon Canapés with Dill Cream",
        "Heirloom Tomato Bruschetta",
        "Local Cheese & Charcuterie"
      ]
    },
    {
      name: "Main Course",
      items: [
        "Herb-Crusted Rack of Lamb",
        "Pan-Seared Halibut with Lemon Butter",
        "Wild Mushroom Wellington (Vegetarian)",
        "Seasonal Roasted Vegetables"
      ]
    },
    {
      name: "Desserts",
      items: [
        "Wedding Cake - Vanilla Bean & Raspberry",
        "Chocolate Lava Cake",
        "Seasonal Fruit Tart",
        "Local Ice Cream Selection"
      ]
    }
  ],
  barService: {
    title: "Premium Bar Service",
    description: "Featuring local wines, craft cocktails, and our signature drinks created just for our special day.",
    cocktails: ["Yarah's Garden Gin Fizz", "Alex's Old Fashioned", "Napa Sunset Spritz"]
  },
  registryItems: [
    {
      id: "crate-barrel",
      store: "Crate & Barrel",
      url: "https://crateandbarrel.com/gift-registry",
      description: "Home essentials and beautiful pieces for our first home together."
    },
    {
      id: "honeymoon",
      store: "Honeymoon Fund",
      url: "#honeymoon",
      description: "Help us create unforgettable memories on our European honeymoon adventure."
    }
  ]
};

const navigationItems = [
  { id: 'hero', label: 'Home' },
  { id: 'story', label: 'Our Story' },
  { id: 'details', label: 'Details' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'rsvp', label: 'RSVP' },
  { id: 'menu', label: 'Menu' },
  { id: 'registry', label: 'Registry' }
];

export default function WeddingPage() {
  const [currentSection, setCurrentSection] = useState('hero');
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
      
      // Update current section based on scroll position
      const sections = navigationItems.map(item => item.id);
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setCurrentSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSectionClick = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleRSVPClick = () => {
    const rsvpElement = document.getElementById('rsvp');
    if (rsvpElement) {
      rsvpElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleRSVPSubmit = async (data: any) => {
    try {
      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (result.success) {
        alert("Thank you for your RSVP! We can't wait to celebrate with you.");
      } else {
        throw new Error(result.error || 'Failed to submit RSVP');
      }
    } catch (error) {
      console.error('RSVP submission error:', error);
      alert('There was an error submitting your RSVP. Please try again.');
    }
  };

  const monogramLetters = `${weddingData.coupleNames.bride.charAt(0)}&${weddingData.coupleNames.groom.charAt(0)}`;

  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <BlissNavigation
        monogramLetters={monogramLetters}
        items={navigationItems}
        currentSection={currentSection}
        isScrolled={isScrolled}
        onSectionClick={handleSectionClick}
      />

      {/* Hero Section */}
      <BlissHeroSection
        coupleNames={weddingData.coupleNames}
        date={weddingData.date}
        time={weddingData.time}
        venue={weddingData.venue}
        onRSVPClick={handleRSVPClick}
      />

      {/* Our Story Section */}
      <BlissStorySection story={weddingData.story} />

      {/* Wedding Details Section */}
      <BlissDetailsSection venue={weddingData.venue} />

      {/* Gallery Section */}
      <BlissGallerySection />

      {/* RSVP Section */}
      <BlissRSVPSection
        deadline="August 1st, 2024"
        onRSVPSubmit={handleRSVPSubmit}
      />

      {/* Menu Section */}
      <BlissMenuSection
        menuCategories={weddingData.menuCategories}
        barService={weddingData.barService}
      />

      {/* Registry Section */}
      <BlissRegistrySection registryItems={weddingData.registryItems} />

      {/* Footer */}
      <BlissFooter
        coupleNames={weddingData.coupleNames}
        date={weddingData.date}
        venue={weddingData.venue}
      />
    </main>
  );
}