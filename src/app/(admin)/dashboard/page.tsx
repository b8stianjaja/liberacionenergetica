import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Cormorant_Garamond } from "next/font/google";

const cormorant = Cormorant_Garamond({ 
  subsets: ["latin"], 
  weight: ["400", "500", "600", "700"],
  display: "swap"
});

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
    <div className="space-y-12 mt-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      
      {/* Control Panel Header - Glassmorphic Altar */}
      <div className="relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center bg-white/[0.03] backdrop-blur-2xl p-10 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/10 gap-6 group">
        
        {/* Subtle glowing aura inside the header */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-fuchsia-600/10 rounded-full blur-[80px] -z-10 group-hover:bg-fuchsia-500/20 transition-colors duration-1000" />
        
        <div>
          <h1 className={`text-5xl font-medium text-white tracking-tight mb-2 ${cormorant.className}`}>
            Tablero de Manifestación
          </h1>
          <p className="text-gray-400 font-light text-lg">
            Bienvenido al origen, <span className="font-semibold text-fuchsia-300">{session.user.username || session.user.email}</span>
          </p>
        </div>
        
        <form action={async () => { 'use server'; await signOut({ redirectTo: '/login' }); }}>
          <button type="submit" className="w-full md:w-auto relative group flex items-center gap-3 rounded-full bg-white/5 backdrop-blur-md px-8 py-4 text-sm font-bold text-gray-300 border border-white/10 hover:border-red-500/50 hover:text-red-400 hover:bg-red-500/10 shadow-lg shadow-black/20 transition-all duration-500 active:scale-95 overflow-hidden">
            <span className="relative z-10 tracking-[0.15em] uppercase text-xs">Desconectar Portal</span>
            <svg className="w-4 h-4 relative z-10 group-hover:rotate-90 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          </button>
        </form>
      </div>

      {/* Esoteric Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <MetricCard 
          title="Citas Pendientes" 
          value={pendingAppointments.toString()} 
          glowColor="from-amber-500/20 to-orange-600/5" 
          textColor="text-amber-400"
          iconColor="text-amber-200"
        />
        <MetricCard 
          title="Total Almas (Clientes)" 
          value={customerCount.toString()} 
          glowColor="from-indigo-500/20 to-blue-600/5" 
          textColor="text-indigo-400"
          iconColor="text-indigo-200"
        />
        <MetricCard 
          title="Frecuencias Activas" 
          value={activeProducts.toString()} 
          glowColor="from-fuchsia-500/20 to-purple-600/5" 
          textColor="text-fuchsia-400"
          iconColor="text-fuchsia-200"
        />
      </div>
    </div>
  );
}

// Redesigned Metric Card: Glassmorphic with Sacred Geometry
function MetricCard({ title, value, glowColor, textColor, iconColor }: { title: string, value: string, glowColor: string, textColor: string, iconColor: string }) {
  return (
    <div className={`relative group bg-white/[0.02] backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)] hover:-translate-y-2 transition-all duration-500 overflow-hidden`}>
      
      {/* Background Gradient Aura */}
      <div className={`absolute inset-0 bg-gradient-to-br ${glowColor} opacity-50 group-hover:opacity-100 transition-opacity duration-700`} />
      
      {/* Spinning Sacred Geometry Watermark */}
      <div className={`absolute -bottom-12 -right-12 opacity-[0.04] group-hover:opacity-[0.08] transition-opacity duration-700 pointer-events-none ${textColor}`}>
        <EsotericGeometryIcon className="w-64 h-64 animate-[spin_60s_linear_infinite]" />
      </div>

      <div className="relative z-10 flex flex-col gap-6">
        <div className={`w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner backdrop-blur-md group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500`}>
          <SparkleStarIcon className={`w-6 h-6 ${iconColor}`} />
        </div>
        
        <div>
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">{title}</p>
          <p className={`text-6xl font-medium tracking-tighter ${textColor} drop-shadow-[0_0_15px_currentColor]`}>
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

// Icons
function SparkleStarIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg fill="currentColor" viewBox="0 0 24 24" {...props}><path d="M12 2L14.09 9.91L22 12L14.09 14.09L12 22L9.91 14.09L2 12L9.91 9.91L12 2Z" /></svg>;
}

// Geometric SVG for the esoteric vibe
function EsotericGeometryIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1" {...props}>
      <circle cx="50" cy="50" r="45" />
      <circle cx="50" cy="50" r="30" />
      <polygon points="50,5 89,72 11,72" />
      <polygon points="50,95 11,28 89,28" />
      <line x1="50" y1="5" x2="50" y2="95" />
      <line x1="11" y1="28" x2="89" y2="72" />
      <line x1="11" y1="72" x2="89" y2="28" />
    </svg>
  );
}