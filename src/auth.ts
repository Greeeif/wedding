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
        try {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }
          
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email as string,
            },
          });
          
          if (!user) {
            return null;
          }
          
          const isPasswordValid = await bcrypt.compare(
            credentials.password as string,
            user.password
          );

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          // Re-throw to see it in NextAuth error page
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // When user signs in, add role to token
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    
    async session({ session, token }) {
      // Read from token instead of database
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.role = token.role; // ✅ Read from token, not database
      }
      return session;
    }
  },
  debug: process.env.NODE_ENV === 'development',
});