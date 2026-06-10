'use server'

import { signIn } from "@/auth"; // <-- THIS IS THE KEY: Import from your local auth config
import { AuthError } from "next-auth";

export async function loginAction(prevState: string | undefined, formData: FormData) {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/dashboard", // Where to go after success
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Credenciales inválidas.'; // User-friendly error
        default:
          return 'Algo salió mal.';
      }
    }
    throw error; // Essential: Let NextAuth handle the redirect error
  }
}