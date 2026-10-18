// src/auth.config.ts
import type { NextAuthConfig } from 'next-auth';
import { isAdminSession } from '@/lib/admin-access';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role; 
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.username = token.username as string | null | undefined;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isAdmin = isAdminSession(auth);
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      const isOnLogin = nextUrl.pathname === '/login';

      // 1. Proteger el Dashboard
      if (isOnDashboard) {
        return isAdmin; // El acceso optimista exige rol ADMIN; las páginas y acciones validan el rol vigente.
      } 
      
      // 2. Si ya está logueado y intenta ir a /login, mandarlo al dashboard
      if (isAdmin && isOnLogin) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }

      // 3. Permitir el paso para cualquier otra cosa
      return true;
    },
  },
  providers: [], 
} satisfies NextAuthConfig;