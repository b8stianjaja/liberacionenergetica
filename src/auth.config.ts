// src/auth.config.ts
import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role; 
        token.username = (user as any).username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id && session.user) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role as string;
        (session.user as any).username = token.username as string;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      const isOnLogin = nextUrl.pathname === '/login';

      // 1. Proteger el Dashboard
      if (isOnDashboard) {
        return isLoggedIn; // Si está logueado, pasa. Si no, redirige a /login
      } 
      
      // 2. Si ya está logueado y intenta ir a /login, mandarlo al dashboard
      if (isLoggedIn && isOnLogin) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }

      // 3. Permitir el paso para cualquier otra cosa
      return true;
    },
  },
  providers: [], 
} satisfies NextAuthConfig;