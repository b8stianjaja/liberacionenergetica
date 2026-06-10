import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
// Exportamos la función auth para que NextAuth intercepte las peticiones
export default NextAuth(authConfig).auth;

export const config = {
  // Optimizamos el matcher para ignorar TODAS las extensiones de archivos estáticos.
  // Evita que el middleware se ejecute en requests de .svg, .ico, .jpg, etc.
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};