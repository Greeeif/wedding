// src/app/page.tsx
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { WeddingClient } from './WeddingClient';
import { prisma } from '@/lib/db';

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
// Fetch actual maxGuests from database
const user = await prisma.user.findUnique({
  where: { id: session.user.id },
  select: { maxGuests: true }
});

const maxGuests = user?.maxGuests ?? 1;
  return (
    <WeddingClient 
      userName={userName}
      userEmail={userEmail}
      maxGuests={maxGuests}
    />
  );
}