import { auth } from '@/auth';
import { WeddingClient } from './wedding-client';
import { prisma } from '@/lib/db';

export default async function WeddingPage() {
  const session = await auth();
  
  // Get the user's full info including maxGuests
  const user = session?.user?.id 
    ? await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          name: true,
          email: true,
          maxGuests: true,
        }
      })
    : null;
  
  return (
    <WeddingClient 
      userName={user?.name}
      userEmail={user?.email}
      maxGuests={user?.maxGuests}
    />
  );
}