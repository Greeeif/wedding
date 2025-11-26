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
import { BlissNavigation, PageTransition } from '@/components/ui';

const weddingData = {
  coupleNames: {
    bride: "Yarah",
    groom: "Alex"
  },
  date: "May 20th, 2027",
  time: "1:00 PM",
  venue: {
    name: "Crowcombe Court",
    location: "Crowcombe, Taunton, Somerset, TA4 4AD",
    description: "Crowcombe Court is a magnificent Grade I listed Georgian manor house, nestled in the heart of Somerset on the edge of the breathtaking Quantock Hills.",
    address: "Crowcombe, Taunton, Somerset, TA4 4AD",
    features: [
      "Historic Grade I Listed Architecture",
      "Accommodation available on-site",
      "Complimentary parking"
    ]
  },
  story: {
    title: "How We Met",
    paragraphs: [
      "Two different people, two separate lives, running on parallel tracks.",
      "Until the moment fate intervened.",
      "When we met, everything just clicked, and it all led to this.",
      "We found something rare: a love that feels like coming home.",
      "𓆸𓆸𓆸",
      "We can’t wait to celebrate this milestone and all that the future holds!"
    ]
  },
  menuCategories: [
    {
      name: "Starters",
      items: [
        "TBD"
      ]
    },
    {
      name: "Main Course",
      items: [
        "TBD"
      ]
    },
    {
      name: "Dessert",
      items: [
        "TBD"
      ]
    }
  ],
  barService: {
    title: "*Enter type of bar service later once decided.",
    description: "TBD",
    cocktails: ["_customCocktail1", "_customCocktail1", "_customCocktail1"]
  },
  registryItems: [
    {
      id: "crate-barrel",
      store: "enter name of provider",
      url: "enter url here",
      description: "enter description here."
    },
    {
      id: "honeymoon",
      store: "Honeymoon Fund",
      url: "#honeymoon",
      description: "Enter description here."
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

interface WeddingClientProps {
  userName?: string;
  userEmail?: string;
  maxGuests?: number;
}

export function WeddingClient({ userName, userEmail, maxGuests }: WeddingClientProps) {
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
  
  const monogramLetters = `${weddingData.coupleNames.bride[0]}&${weddingData.coupleNames.groom[0]}`;

  return (
    <PageTransition>
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
            onRSVPClick={() => handleSectionClick('rsvp')}
        />

        {/* Our Story Section */}
        <BlissStorySection story={weddingData.story} />

        {/* Wedding Details Section */}
        <BlissDetailsSection venue={weddingData.venue} />

        {/* Gallery Section */}
        <BlissGallerySection />

        {/* RSVP Section */}
        <BlissRSVPSection
            deadline="May 20th, 2026"
            userName={userName}
            userEmail={userEmail}
            maxGuests={maxGuests}
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
    </PageTransition>
  );
}