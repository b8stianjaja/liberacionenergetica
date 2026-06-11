import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white/70 backdrop-blur-xl p-8 rounded-[2rem] shadow-sm border border-white/50 gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Panel de Control</h1>
          <p className="mt-1 text-gray-500 font-medium">
            Hola, <span className="font-bold text-indigo-600">{session.user.username || session.user.email}</span>
          </p>
        </div>
        
        <form action={async () => { 'use server'; await signOut({ redirectTo: '/login' }); }}>
          <button type="submit" className="w-full md:w-auto rounded-2xl bg-white px-6 py-3.5 text-sm font-bold text-red-600 shadow-sm ring-1 ring-inset ring-red-50 hover:bg-red-50 transition-all active:scale-95 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Cerrar Sesión
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard title="Citas Pendientes" value={pendingAppointments.toString()} color="text-amber-600" bg="bg-amber-100" />
        <MetricCard title="Total Clientes" value={customerCount.toString()} color="text-indigo-600" bg="bg-indigo-100" />
        <MetricCard title="Catálogo Activo" value={activeProducts.toString()} color="text-emerald-600" bg="bg-emerald-100" />
      </div>
    </div>
  );
}

// Tu misma tarjeta, pero con hover effects y escalas
function MetricCard({ title, value, color, bg }: { title: string, value: string, color: string, bg: string }) {
  return (
    <div className="group bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-5">
      <div className={`w-16 h-16 rounded-2xl ${bg} flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}>
        <span className={`text-2xl font-black ${color}`}>{value}</span>
      </div>
      <div>
        <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">{title}</p>
        <p className="text-4xl font-black text-gray-900 mt-1">{value}</p>
      </div>
    </div>
  );
}