import React, { useState } from 'react';
import { SectionHeader, BlissCard, BlissInput, BlissTextarea, BlissButton } from '@/components/ui';

interface RSVPFormData {
  name: string;
  email: string;
  attending: boolean | null;
  guests: number;
  message: string;
}

interface BlissRSVPSectionProps {
  deadline: string;
  onRSVPSubmit: (data: RSVPFormData) => Promise<void>;
  className?: string;
}

export const BlissRSVPSection: React.FC<BlissRSVPSectionProps> = ({
  deadline,
  onRSVPSubmit,
  className = ''
}) => {
  const [formData, setFormData] = useState<RSVPFormData>({
    name: '',
    email: '',
    attending: null,
    guests: 1,
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onRSVPSubmit(formData);
    } catch (error) {
      console.error('RSVP submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field: keyof RSVPFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <section id="rsvp" className={`py-20 px-6 bg-stone-50 ${className}`}>
      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left side - Content */}
          <div>
            <SectionHeader 
              title="Join Us"
              align="left"
              subtitle="get Yarah to write something sweet here later"
            />
            <p className="text-sm text-stone-500 font-light mt-6">
              Kindly respond by {deadline}
            </p>
          </div>

          {/* Right side - RSVP Form */}
          <BlissCard>
            suppressHydrationWarning
            <div className="space-y-6">
              <BlissInput
                label="Full Name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
              />

              <BlissInput
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
              />

              <div>
                <label className="block text-sm font-light text-stone-700 mb-3 tracking-wide">
                  Will you be attending?
                </label>
                <div className="flex space-x-4">
                  <BlissButton
                    variant={formData.attending === true ? 'primary' : 'outline'}
                    onClick={() => updateField('attending', true)}
                    className="flex-1"
                  >
                    We're Coming for Cake!
                  </BlissButton>
                  <BlissButton
                    variant={formData.attending === false ? 'primary' : 'outline'}
                    onClick={() => updateField('attending', false)}
                    className="flex-1"
                  >
                    No, we hate fun
                  </BlissButton>
                </div>
              </div>

              {formData.attending && (
                <div>
                  <label className="block text-sm font-light text-stone-700 mb-2 tracking-wide">
                    Number of Guests
                  </label>
                  <select 
                    value={formData.guests}
                    onChange={(e) => updateField('guests', parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-stone-200 rounded-sm focus:outline-none focus:border-stone-400 transition-colors font-light"
                  >
                    <option value={1}>1 Guest</option>
                    <option value={2}>2 Guests</option>
                  </select>
                </div>
              )}

              <BlissTextarea
                label="Message for the Couple"
                placeholder="Share your well wishes..."
                rows={4}
                value={formData.message}
                onChange={(e) => updateField('message', e.target.value)}
              />

              <BlissButton
                variant="primary"
                size="lg"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? 'Submitting...' : 'Submit RSVP'}
              </BlissButton>
            </div>
          </BlissCard>
        </div>
      </div>
    </section>
  );
};