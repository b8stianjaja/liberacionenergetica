import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from '@/auth.config';
import { prisma } from '@/lib/prisma';
import { UserRegistrationSchema } from '@/lib/validations';
import bcrypt from 'bcryptjs';

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  session: { strategy: 'jwt' },
  providers: [
    Credentials({
      // CRITICAL FIX: NextAuth needs to know exactly what fields to extract from the FormData
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // Now 'credentials' will properly contain { username: '...', password: '...' }
        const parsedCredentials = UserRegistrationSchema.safeParse(credentials);

        if (parsedCredentials.success) {
          const { username, password } = parsedCredentials.data;
          
          const user = await prisma.user.findUnique({ where: { username } });
          if (!user) return null; // User not found

          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (passwordsMatch) return user; // Success
        }

        console.log("Validation failed or wrong password");
        return null; // Fallback failure
      },
    }),
  ],
});