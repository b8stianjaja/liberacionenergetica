/**
 * Regla de autorización común para el filtro de rutas y los servicios.
 * El rol del JWT es solo una comprobación preliminar: las operaciones
 * administrativas consultan además el rol vigente en la base de datos.
 */
export type AdminSession = {
  user?: { id?: string | null; role?: string | null } | null;
} | null | undefined;

export function isAdminSession(session: AdminSession): boolean {
  return session?.user?.role === 'ADMIN';
}

export async function hasCurrentAdminAccess(
  session: AdminSession,
  getRoleByUserId: (id: string) => Promise<string | null | undefined>,
): Promise<boolean> {
  if (!isAdminSession(session) || !session?.user?.id) return false;
  return (await getRoleByUserId(session.user.id)) === 'ADMIN';
}
