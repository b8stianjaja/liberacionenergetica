'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    // NextAuth handles the redirection internally if successful
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Credenciales inválidas. Verifica tu usuario y contraseña.';
        default:
          return 'Algo salió mal al intentar iniciar sesión.';
      }
    }
    
    // IMPORTANT: You must re-throw the error if it is NOT an AuthError.
    // Next.js uses errors under the hood to trigger the redirect upon successful login.
    throw error;
  }
}