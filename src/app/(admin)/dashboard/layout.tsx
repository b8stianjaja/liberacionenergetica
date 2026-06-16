'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import { Home, CalendarDays, ShoppingBag, Megaphone, Users, Menu, X, LogOut } from 'lucide-react';

const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600", "700"], display: "swap" });
const montserrat = Montserrat({ subsets: ["latin"], weight: ["300", "400", "500", "600"], display: "swap" });

// UX: Nombres primarios funcionales, nombres secundarios temáticos
const navItems = [
  { name: 'Resumen', theme: 'Altar', href: '/dashboard', icon: Home },
  { name: 'Agenda', theme: 'Rituales', href: '/dashboard/agenda', icon: CalendarDays },
  { name: 'Tienda', theme: 'Artefactos', href: '/dashboard/store', icon: ShoppingBag }, 
  { name: 'Banners', theme: 'Transmisiones', href: '/dashboard/banners', icon: Megaphone },
  { name: 'Clientes', theme: 'Almas', href: '/dashboard/clients', icon: Users },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className={`flex h-screen bg-[#F8F9FA] text-zinc-800 ${montserrat.className} selection:bg-[#cfaa66]/20 selection:text-[#4a2e6b] overflow-hidden relative`}>
      
      {/* BACKGROUND DECORATIVO (Seguro, no bloquea clics) */}
      <div className="absolute top-0 right-0 w-[80vw] h-[80vw] bg-gradient-to-bl from-[#cfaa66]/5 to-transparent rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[50vw] h-[50vw] bg-gradient-to-tr from-[#4a2e6b]/5 to-transparent rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* --- TOP BAR MÓVIL --- */}
      <div className="md:hidden absolute top-0 left-0 w-full h-16 bg-white/90 backdrop-blur-lg border-b border-zinc-200 z-40 flex items-center justify-between px-4">
        <span className={`font-serif text-xl text-[#4a2e6b] ${cormorant.className}`}>Velo Interno</span>
        <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-zinc-600 bg-zinc-100 rounded-lg">
          <Menu size={20} />
        </button>
      </div>

      {/* --- SIDEBAR (Desktop & Mobile Drawer) --- */}
      <aside 
        className={`fixed md:relative top-0 left-0 h-full w-72 bg-white/80 backdrop-blur-2xl border-r border-zinc-200 shadow-2xl md:shadow-none z-50 flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between p-6 md:p-8">
          <div className="flex flex-col">
            <h2 className={`text-2xl font-bold text-[#4a2e6b] tracking-wide ${cormorant.className}`}>
              Velo Interno
            </h2>
            <p className="text-[10px] text-[#cfaa66] font-bold tracking-[0.2em] uppercase mt-1">
              Portal Administrativo
            </p>
          </div>
          <button className="md:hidden text-zinc-400 hover:text-zinc-800" onClick={() => setIsMobileMenuOpen(false)}>
            <X size={24} />
          </button>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/dashboard');
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`group flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 relative ${
                  isActive 
                    ? 'bg-gradient-to-r from-[#4a2e6b] to-[#362051] text-white shadow-md' 
                    : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                }`}
              >
                <item.icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} strokeWidth={isActive ? 2 : 1.5} />
                <div className="flex flex-col">
                  <span className="text-[13px] font-semibold tracking-wide">{item.name}</span>
                  <span className={`text-[9px] uppercase tracking-wider ${isActive ? 'text-[#cfaa66]' : 'text-zinc-400'}`}>
                    {item.theme}
                  </span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Footer Sidebar */}
        <div className="p-4 border-t border-zinc-200">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 text-[13px] font-medium text-zinc-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors">
            <LogOut size={18} />
            Volver a la Web
          </Link>
        </div>
      </aside>

      {/* --- MOBILE OVERLAY --- */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* --- ÁREA DE CONTENIDO PRINCIPAL --- */}
      <main className="flex-1 h-full overflow-y-auto pt-20 md:pt-8 pb-12 px-4 md:px-10 z-10 custom-scrollbar relative">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>

    </div>
  );
}