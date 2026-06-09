import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from '@/auth.config';
import { prisma } from '@/lib/prisma';
import { UserRegistrationSchema } from '@/lib/validations';
import bcrypt from 'bcryptjs';

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  session: { strategy: 'jwt' },
  callbacks: {
    // Inject the role and user ID into the token
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role; // From our DB
      }
      return token;
    },
    // Expose the token data to the client session
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role as string;
      }
      return session;
    }
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = UserRegistrationSchema.safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          
          const user = await prisma.user.findUnique({ where: { email } });
          if (!user) return null;

          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (passwordsMatch) return user;
        }

        return null; // Invalid credentials
      },
    }),
  ],
});