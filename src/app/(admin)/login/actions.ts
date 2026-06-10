'use server'

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export async function loginAction(prevState: string | undefined, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return "Por favor, completa todos los campos.";
  }

  try {
    // Usamos el signIn configurado en tu servidor (@/auth.ts)
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      // NextAuth v5 usa este tipo para errores de credenciales
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Correo o contraseña incorrectos.';
        default:
          return 'Error de autenticación.';
      }
    }
    // IMPORTANTE: Los redireccionamientos de Next.js lanzan errores internos.
    // Debemos dejar que el error de redirect pase para que Next.js haga su trabajo.
    throw error;
  }
}