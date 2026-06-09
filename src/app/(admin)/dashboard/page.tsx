import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  // Safety check, though middleware should handle this
  if (!session?.user) {
    redirect('/login');
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Panel de Control</h1>
          <p className="mt-2 text-gray-600">
            Bienvenido, has iniciado sesión como:{' '}
            <span className="font-semibold text-indigo-600">{session.user.email}</span>
          </p>
        </div>
        
        <form
          action={async () => {
            'use server';
            await signOut({ redirectTo: '/login' });
          }}
        >
          <button 
            type="submit" 
            className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Cerrar Sesión
          </button>
        </form>
      </div>
    </div>
  );
}