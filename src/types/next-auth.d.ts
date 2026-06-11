import NextAuth, { type DefaultSession } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: string;
      username?: string | null; // <-- Añadimos esto
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    role: string;
    username?: string | null; // <-- Añadimos esto
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
    username?: string | null; // <-- Añadimos esto
  }
}