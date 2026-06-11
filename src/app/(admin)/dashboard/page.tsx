import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Cormorant_Garamond } from "next/font/google";

// Correct module-scope font assignment
const cormorant = Cormorant_Garamond({ 
  subsets: ["latin"], 
  weight: ["300", "400", "500", "600"], 
  display: "swap" 
});

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const [customerCount, pendingAppointments, activeProducts] = await Promise.all([
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.order.count({ where: { bookingDate: { not: null }, status: { in: ["NEW", "PROCESSING"] } } }),
    prisma.product.count({ where: { isActive: true } })
  ]);

  return (
    <div className="space-y-12 mt-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 relative z-10">
      
      {/* Pristine Altar Header */}
      <div className="relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-10 rounded-3xl border border-zinc-200 shadow-sm group">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-zinc-50 rounded-full blur-[80px] -z-10" />
        
        <div className="mb-8 md:mb-0">
          <h1 className={`text-4xl md:text-5xl font-medium text-zinc-800 uppercase tracking-widest mb-3 ${cormorant.className}`}>
            La Obra
          </h1>
          <p className="text-zinc-400 text-xs tracking-[0.3em] uppercase">
            Supervisor: <span className="text-zinc-600 font-bold">{session.user.username || session.user.email}</span>
          </p>
        </div>
        
        <form action={async () => { 'use server'; await signOut({ redirectTo: '/login' }); }}>
          <button type="submit" className="group flex items-center gap-3 bg-white px-6 py-3 border border-zinc-200 rounded-full shadow-sm hover:border-zinc-400 hover:shadow-md text-xs font-bold tracking-widest text-zinc-500 hover:text-zinc-800 transition-all duration-500 uppercase">
            <span>Sellar Vínculo</span>
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          </button>
        </form>
      </div>

      {/* Light Silver Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard title="Citas Alineadas" value={pendingAppointments.toString()} delay="delay-100" />
        <MetricCard title="Almas Registradas" value={customerCount.toString()} delay="delay-200" />
        <MetricCard title="Artefactos Activos" value={activeProducts.toString()} delay="delay-300" />
      </div>
    </div>
  );
}

function MetricCard({ title, value, delay }: { title: string, value: string, delay: string }) {
  return (
    <div className={`relative group bg-white p-8 rounded-3xl border border-zinc-100 shadow-sm hover:shadow-lg hover:border-zinc-200 transition-all duration-700 animate-in fade-in slide-in-from-bottom-4 hover:-translate-y-1 ${delay}`}>
      
      {/* Soft Chrome Gradient Hover Aura */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-50 to-transparent opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity duration-700 pointer-events-none" />
      
      {/* Corner Accents (Healing touch) */}
      <div className="absolute top-4 left-4 w-2 h-2 border-t border-l border-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-4 right-4 w-2 h-2 border-b border-r border-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="relative z-10 flex flex-col justify-between h-full min-h-[120px]">
        <div className="flex justify-between items-start">
          <p className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em]">{title}</p>
          <TetragrammatonIcon className="w-5 h-5 text-zinc-200 group-hover:text-zinc-400 transition-colors duration-700" />
        </div>
        
        <p className={`text-6xl text-zinc-800 mt-6 tracking-tighter ${cormorant.className}`}>
          {value}
        </p>
      </div>
    </div>
  );
}

function TetragrammatonIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1" {...props}>
      <circle cx="50" cy="50" r="45" />
      <polygon points="50,5 89,72 11,72" />
      <polygon points="50,95 11,28 89,28" />
    </svg>
  );
}