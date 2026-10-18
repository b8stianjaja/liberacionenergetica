import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { hasCurrentAdminAccess } from '@/lib/admin-access';
import { notFound, redirect } from 'next/navigation';

/**
 * Proteger cada lectura administrativa y cada Server Action.
 * Se consulta el rol actual en PostgreSQL para que una revocación
 * de permisos invalide también una sesión JWT todavía vigente.
 */
export async function requireAdmin() {
  const session = await auth();

  if (!session?.user) redirect('/login');

  const authorized = await hasCurrentAdminAccess(session, async (id) => {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { role: true },
    });
    return user?.role;
  });

  if (!authorized) notFound();

  return session;
}
