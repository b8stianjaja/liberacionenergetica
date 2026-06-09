'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    // CRITICAL FIX: Convert FormData to a standard plain object.
    // NextAuth v5 credentials provider handles plain objects much more predictably.
    const credentials = Object.fromEntries(formData.entries());

    // Call NextAuth signIn, passing the credentials object and redirection path
    await signIn('credentials', {
      ...credentials,
      redirectTo: '/dashboard',
    });
  } catch (error) {
    if (error instanceof AuthError) {
      // Map Auth.js specific errors to UI-friendly messages
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Credenciales inválidas. Verifica tu correo y contraseña.';
        default:
          return 'Error en el servidor. Intenta de nuevo más tarde.';
      }
    }
    
    // CRITICAL: Next.js 'redirect()' internally throws an error to halt execution.
    // We MUST rethrow the error if it is not an AuthError, otherwise the redirect fails.
    throw error;
  }
}