import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    // Inject the role and user ID into the token
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role; 
        token.username = (user as any).username;
      }
      return token;
    },
    // Expose the token data to the client session
    async session({ session, token }) {
      if (token?.id && session.user) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role as string;
        (session.user as any).username = token.username as string;
      }
      return session;
    },
    // Middleware protection logic
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const path = nextUrl.pathname;
      const isOnDashboard = path.startsWith('/dashboard');
      const isOnLogin = path === '/login';

      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } 
      
      if (isLoggedIn && isOnLogin) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }

      return true;
    },
  },
  providers: [], 
} satisfies NextAuthConfig;