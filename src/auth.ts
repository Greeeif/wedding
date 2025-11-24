import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        console.log('=== AUTHORIZE STARTED ===');
        console.log('Credentials received:', {
          email: credentials?.email,
          hasPassword: !!credentials?.password
        });

        try {
          if (!credentials?.email || !credentials?.password) {
            console.log('ERROR: Missing credentials');
            return null;
          }

          console.log('Querying database for user...');
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email as string,
            },
          });

          console.log('User found:', !!user);
          if (!user) {
            console.log('ERROR: User not found for email:', credentials.email);
            return null;
          }

          console.log('Comparing passwords...');
          const isPasswordValid = await bcrypt.compare(
            credentials.password as string,
            user.password
          );

          console.log('Password valid:', isPasswordValid);
          if (!isPasswordValid) {
            console.log('ERROR: Invalid password for:', credentials.email);
            return null;
          }

          console.log('Authentication successful! Returning user:', {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
          });

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          console.error('=== AUTHORIZE ERROR ===');
          console.error('Error type:', error?.constructor?.name);
          console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');
          console.error('Full error:', error);
          console.error('=== END AUTHORIZE ERROR ===');

          // Re-throw to see it in NextAuth error page
          throw error;
        }
      },
    }),
  ],
  callbacks: {

    async jwt({ token, user }) {
      console.log('JWT callback - user:', !!user);
      if (user) {
        token.id = user.id;
        token.role = user.role; // Ensure role is added to the token
      }
      return token;
    },
    // In callbacks:
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        // You need to fetch the role here or persist it in the token
        const user = await prisma.user.findUnique({ where: { id: token.sub } });
        if (user) {
        session.user.role = user?.role;
        }
      }
      return session;
    }

  },
  debug: true,
});