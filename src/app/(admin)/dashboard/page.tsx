import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Cormorant_Garamond } from "next/font/google";
import { Users, CalendarClock, PackageOpen, LogOut } from "lucide-react";

const cormorant = Cormorant_Garamond({ 
  subsets: ["latin"], 
  weight: ["400", "500", "600"], 
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
    <div className="w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      {/* HEADER BENTO CARD */}
      <div className="bg-[var(--purple-deep)] rounded-[2rem] p-8 md:p-12 mb-8 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-end border border-[var(--purple-deep)] shadow-xl">
        
        {/* Efecto de luz mística en el fondo */}
        <div className="absolute -top-[50%] -right-[20%] w-[80%] h-[200%] bg-[var(--gold-magic)]/20 blur-[100px] rounded-full pointer-events-none mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('/file.svg')] opacity-[0.03] pointer-events-none" />

        <div className="relative z-10 mb-8 md:mb-0">
          <p className="text-[var(--gold-magic)] text-[10px] tracking-[0.3em] uppercase font-bold mb-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[var(--gold-magic)] rounded-full animate-pulse" />
            Portal de Administración
          </p>
          <h1 className={`text-4xl md:text-5xl text-white tracking-wide ${cormorant.className}`}>
            Bienvenida, {session.user.name?.split(' ')[0] || session.user.username || 'Johanna'}.
          </h1>
          <p className="text-[var(--purple-light)]/70 mt-2 font-light text-sm max-w-md">
            Este es tu centro de control de energía. Aquí gestionas las citas, tu inventario de luz y los registros de tus consultantes.
          </p>
        </div>

        <form action={async () => { 'use server'; await signOut({ redirectTo: '/login' }); }} className="relative z-10 w-full md:w-auto">
          <button type="submit" className="w-full md:w-auto flex items-center justify-center gap-2 bg-white/10 hover:bg-red-500/90 text-white px-6 py-3 rounded-full backdrop-blur-md border border-white/10 transition-all duration-300 text-xs font-bold tracking-widest uppercase">
            <LogOut size={16} strokeWidth={2} />
            Cerrar Sesión
          </button>
        </form>
      </div>

      {/* MÉTRICAS BENTO GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-white rounded-[2rem] p-8 border border-[var(--purple-deep)]/10 shadow-sm hover:shadow-lg transition-all duration-300 group relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-500 text-[var(--purple-deep)]">
            <CalendarClock size={120} strokeWidth={1} />
          </div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-[var(--purple-light)]/50 text-[var(--purple-deep)] rounded-2xl flex items-center justify-center mb-12 border border-[var(--purple-deep)]/10">
              <CalendarClock size={24} strokeWidth={1.5} />
            </div>
            <p className="text-zinc-500 text-[11px] font-bold uppercase tracking-widest mb-1">Citas Pendientes</p>
            <p className={`text-6xl text-[var(--purple-deep)] leading-none ${cormorant.className}`}>{pendingAppointments}</p>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] p-8 border border-[var(--purple-deep)]/10 shadow-sm hover:shadow-lg transition-all duration-300 group relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-500 text-[var(--gold-magic)]">
            <Users size={120} strokeWidth={1} />
          </div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-[var(--gold-magic)]/10 text-[var(--gold-magic)] rounded-2xl flex items-center justify-center mb-12 border border-[var(--gold-magic)]/20">
              <Users size={24} strokeWidth={1.5} />
            </div>
            <p className="text-zinc-500 text-[11px] font-bold uppercase tracking-widest mb-1">Consultantes</p>
            <p className={`text-6xl text-[var(--purple-deep)] leading-none ${cormorant.className}`}>{customerCount}</p>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] p-8 border border-[var(--purple-deep)]/10 shadow-sm hover:shadow-lg transition-all duration-300 group relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-500 text-[var(--purple-deep)]">
            <PackageOpen size={120} strokeWidth={1} />
          </div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-[var(--purple-light)]/50 text-[var(--purple-deep)] rounded-2xl flex items-center justify-center mb-12 border border-[var(--purple-deep)]/10">
              <PackageOpen size={24} strokeWidth={1.5} />
            </div>
            <p className="text-zinc-500 text-[11px] font-bold uppercase tracking-widest mb-1">Materia Activa (Tienda)</p>
            <p className={`text-6xl text-[var(--purple-deep)] leading-none ${cormorant.className}`}>{activeProducts}</p>
          </div>
        </div>

      </div>

    </div>
  );
}