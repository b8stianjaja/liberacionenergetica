import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const path = nextUrl.pathname;

      // Extract precise booleans for our route checks
      const isOnDashboard = path.startsWith('/dashboard');
      const isOnLogin = path === '/login';

      // 1. Dashboard Protection
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Securely redirects unauthenticated users to pages.signIn ('/login')
      } 
      
      // 2. Redirect authenticated users away from the login page ONLY
      // We removed 'isOnHome' so you can browse the store while logged in!
      if (isLoggedIn && isOnLogin) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }

      // 3. Fallback: Allow access to all other routes (like '/' for the shop)
      return true;
    },
  },
  providers: [], 
} satisfies NextAuthConfig;