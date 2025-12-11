// src/app/page.tsx
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { WeddingClient } from './WeddingClient';

export default async function HomePage() {
  const session = await auth();
  
  // Redirect to login if not authenticated
  if (!session?.user) {
    redirect('/login');
  }

  // Get user data for personalization
  const userName = session.user.name || undefined;
  const userEmail = session.user.email || undefined;
  
  // TODO: Fetch maxGuests from database based on user
  const maxGuests = 4;

  return (
    <WeddingClient 
      userName={userName}
      userEmail={userEmail}
      maxGuests={maxGuests}
    />
  );
}