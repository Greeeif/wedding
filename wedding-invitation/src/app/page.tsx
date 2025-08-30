// src/app/page.tsx
'use client';

import React, { useState } from 'react';
import { Navigation } from '@/components/layout/Navigation';
import { HeroSection } from '@/components/sections/HeroSection';
import { DetailsSection } from '@/components/sections/DetailsSection';
import { RSVPSection } from '@/components/sections/RSVPSection';
import { GiftRegistrySection } from '@/components/sections/GiftRegistrySection';
import { MenuSection } from '@/components/sections/MenuSection';
import { Footer } from '@/components/layout/Footer';
import { useScrollPosition, useRSVP, useGiftRegistry } from '@/hooks';
import { WeddingDetails, ContactInfo } from '@/types';

// Wedding data - in a real app, this might come from a CMS or database
const weddingDetails: WeddingDetails = {
  coupleNames: {
    bride: 'Sarah',
    groom: 'James'
  },
  date: 'September 15th, 2024',
  time: '4:00 PM',
  venue: {
    name: 'Vineyard Estate, Napa Valley',
    address: '1234 Wine Country Road, Napa Valley, CA',
    ceremonyLocation: 'Vineyard Estate Gardens',
    receptionLocation: 'Grand Ballroom'
  },
  rsvpDeadline: 'August 1st, 2024',
  dressCode: 'Cocktail attire requested. Think garden party elegance - florals, pastels, and comfortable shoes for dancing!'
};

const contactInfo: ContactInfo = {
  email: 'sarah.james.wedding@email.com',
  phone: '(555) 123-4567'
};

const WeddingInvitationPage: React.FC = () => {
  const [currentSection, setCurrentSection] = useState('hero');
  const isScrolled = useScrollPosition();
  const { submitRSVP, loading: rsvpLoading } = useRSVP();
  const { gifts, purchaseGift, loading: giftsLoading } = useGiftRegistry();

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    setCurrentSection(sectionId);
  };

  const handleRSVPClick = () => {
    scrollToSection('rsvp');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50">
      <Navigation
        currentSection={currentSection}
        isScrolled={isScrolled}
        onSectionClick={scrollToSection}
      />

      <HeroSection
        weddingDetails={weddingDetails}
        onRSVPClick={handleRSVPClick}
      />

      <DetailsSection weddingDetails={weddingDetails} />

      <RSVPSection
        onRSVPSubmit={submitRSVP}
        loading={rsvpLoading}
        deadline={weddingDetails.rsvpDeadline}
      />

      <GiftRegistrySection
        gifts={gifts}
        onGiftPurchase={purchaseGift}
      />

      <MenuSection />

      <Footer
        coupleNames={weddingDetails.coupleNames}
        contactInfo={contactInfo}
      />
    </div>
  );
};

export default WeddingInvitationPage;