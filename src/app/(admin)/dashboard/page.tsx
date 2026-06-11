import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Cormorant_Garamond } from "next/font/google";

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
    <div className="space-y-12 mt-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 relative z-10">
      
      {/* Altar Header - Bloque de Cristal y Plata */}
      <div className="relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center bg-white/70 backdrop-blur-2xl p-10 md:p-12 rounded-[2.5rem] border border-white shadow-[0_15px_40px_rgba(0,0,0,0.03),inset_0_1px_1px_rgba(255,255,255,1)] group">
        
        {/* Aura interior y resplandor de plata */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-zinc-100 to-transparent rounded-full blur-[80px] -z-10 group-hover:scale-110 transition-transform duration-[2s]" />
        
        <div className="mb-8 md:mb-0 relative z-10">
          <h1 className={`text-4xl md:text-6xl font-medium text-silver-shimmer uppercase tracking-widest mb-4 ${cormorant.className}`}>
            La Obra Magna
          </h1>
          <p className="text-zinc-500 text-xs tracking-[0.4em] uppercase font-bold flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-zinc-400 animate-pulse" />
            Alquimista: <span className="text-zinc-800">{session.user.username || session.user.email}</span>
          </p>
        </div>
        
        <form action={async () => { 'use server'; await signOut({ redirectTo: '/login' }); }} className="relative z-10 w-full md:w-auto">
          <button type="submit" className="group w-full md:w-auto flex justify-center items-center gap-4 bg-gradient-to-b from-white to-zinc-50 px-8 py-4 border-silver-real rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.02)] hover:shadow-[0_10px_25px_rgba(161,161,170,0.3)] hover:-translate-y-1 text-xs font-black tracking-widest text-zinc-600 hover:text-zinc-900 transition-all duration-500 uppercase">
            <span>Sellar Vínculo</span>
            <div className="p-1.5 rounded-full bg-zinc-100 group-hover:bg-zinc-200 transition-colors">
              <svg className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-900 group-hover:translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            </div>
          </button>
        </form>
      </div>

      {/* Joyas de Datos (Métricas) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <MetricCard title="Citas Alineadas" value={pendingAppointments.toString()} delay="delay-100" />
        <MetricCard title="Almas Atendidas" value={customerCount.toString()} delay="delay-200" />
        <MetricCard title="Frecuencias Activas" value={activeProducts.toString()} delay="delay-300" />
      </div>
    </div>
  );
}

function MetricCard({ title, value, delay }: { title: string, value: string, delay: string }) {
  return (
    <div className={`relative group bg-white/60 backdrop-blur-xl p-8 rounded-[2rem] border-silver-real shadow-[0_8px_20px_rgba(0,0,0,0.02),inset_0_1px_1px_rgba(255,255,255,1)] hover:shadow-[0_20px_40px_rgba(161,161,170,0.15)] transition-all duration-700 animate-in fade-in slide-in-from-bottom-6 hover:-translate-y-2 overflow-hidden ${delay}`}>
      
      {/* Brillo de metal líquido que pasa en hover */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white to-transparent opacity-0 group-hover:opacity-60 -translate-x-full group-hover:translate-x-full transition-all duration-[1.5s] ease-in-out pointer-events-none" />
      
      {/* Marca de agua geométrica en la esquina */}
      <div className="absolute -bottom-10 -right-10 text-zinc-100 opacity-50 group-hover:scale-110 group-hover:rotate-12 group-hover:text-zinc-200 transition-all duration-1000 pointer-events-none">
        <TetragrammatonIcon className="w-48 h-48" />
      </div>

      <div className="relative z-10 flex flex-col justify-between h-full min-h-[140px]">
        <div className="flex justify-between items-start">
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em]">{title}</p>
          <div className="p-2 rounded-full bg-zinc-50 border border-white shadow-sm group-hover:bg-zinc-100 transition-colors duration-500">
             <TetragrammatonIcon className="w-5 h-5 text-zinc-400 group-hover:text-zinc-700 transition-colors" />
          </div>
        </div>
        
        <p className={`text-6xl text-zinc-800 mt-8 tracking-tighter drop-shadow-sm ${cormorant.className}`}>
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
      <circle cx="50" cy="50" r="10" strokeDasharray="1 2"/>
    </svg>
  );
}