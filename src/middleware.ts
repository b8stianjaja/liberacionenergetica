// src/middleware.ts
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

export default NextAuth(authConfig).auth;

export const config = {
  // SOLO interceptar el dashboard y el login. 
  // Todas las demás rutas (públicas) son ignoradas por el middleware.
  matcher: ['/dashboard/:path*', '/login'],
};