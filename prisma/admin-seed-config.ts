/**
 * La semilla administrativa debe fallar de forma explícita si faltan
 * credenciales seguras. Nunca hay contraseñas por defecto.
 */
export function readAdminSeedConfig(env: Readonly<Record<string, string | undefined>>) {
  const adminUsername = env.ADMIN_USERNAME?.trim();
  const adminPassword = env.ADMIN_PASSWORD;

  if (!adminUsername || adminUsername.length < 3) {
    throw new Error('ADMIN_USERNAME debe tener al menos 3 caracteres.');
  }

  if (!adminPassword || adminPassword.length < 12 || adminPassword.trim() !== adminPassword) {
    throw new Error('ADMIN_PASSWORD debe contener al menos 12 caracteres, sin espacios externos.');
  }

  return { adminUsername, adminPassword };
}
