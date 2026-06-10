import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  // Consultas optimizadas en paralelo
  const [customerCount, pendingAppointments, activeProducts] = await Promise.all([
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.order.count({ 
      where: { 
        bookingDate: { not: null },
        status: { in: ["NEW", "PROCESSING"] } 
      } 
    }),
    prisma.product.count({ where: { isActive: true } })
  ]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Panel de Control</h1>
          <p className="mt-1 text-gray-500 font-medium">
            Hola, <span className="font-bold text-indigo-600">{session.user.email}</span>
          </p>
        </div>
        
        <form action={async () => { 'use server'; await signOut({ redirectTo: '/login' }); }}>
          <button type="submit" className="w-full md:w-auto rounded-xl bg-white px-5 py-3 text-sm font-bold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 hover:bg-gray-50 transition-colors active:scale-95">
            Cerrar Sesión
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard title="Citas Pendientes" value={pendingAppointments.toString()} color="text-amber-600" bg="bg-amber-50" />
        <MetricCard title="Total Clientes" value={customerCount.toString()} color="text-indigo-600" bg="bg-indigo-50" />
        <MetricCard title="Catálogo Activo" value={activeProducts.toString()} color="text-emerald-600" bg="bg-emerald-50" />
      </div>
    </div>
  );
}

function MetricCard({ title, value, color, bg }: { title: string, value: string, color: string, bg: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5 hover:border-indigo-100 transition-colors">
      <div className={`w-16 h-16 rounded-2xl ${bg} flex items-center justify-center shadow-inner`}>
        <span className={`text-2xl font-black ${color}`}>{value}</span>
      </div>
      <div>
        <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">{title}</p>
        <p className="text-3xl font-black text-gray-900 mt-1">{value}</p>
      </div>
    </div>
  );
}