import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

// Next.js 16: filtro anticipado (no sustituye requireAdmin en el servidor).
export const proxy = NextAuth(authConfig).auth;

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};
