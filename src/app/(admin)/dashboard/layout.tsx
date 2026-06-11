'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Cormorant_Garamond, Montserrat } from "next/font/google";

const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600"], display: "swap" });
const montserrat = Montserrat({ subsets: ["latin"], weight: ["300", "400", "500"], display: "swap" });

const navItems = [
  { name: 'Altar (Resumen)', href: '/dashboard', icon: HomeIcon },
  { name: 'Rituales (Agenda)', href: '/dashboard/agenda', icon: CalendarIcon },
  { name: 'Artefactos (Tienda)', href: '/dashboard/store', icon: StoreIcon }, 
  { name: 'Transmisiones', href: '/dashboard/banners', icon: MegaphoneIcon },
  { name: 'Almas (Clientes)', href: '/dashboard/clients', icon: UsersIcon },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className={`flex h-screen bg-[#FCFCFD] text-zinc-800 ${montserrat.className} selection:bg-zinc-200 selection:text-black overflow-hidden relative`}>
      
      {/* SOFT SILVER GRAIN (Admin) */}
      <div className="fixed inset-0 z-0 opacity-[0.2] mix-blend-multiply pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.95\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}/>

      {/* ADMIN TETRAGRAMMATON WATERMARK */}
      <div className="absolute top-[10%] -left-[10%] w-[80vw] h-[80vw] opacity-[0.02] pointer-events-none z-0 text-zinc-500">
        <TetragrammatonIcon className="w-full h-full animate-[spin_240s_linear_infinite]" />
      </div>

      {/* LIGHT CHROME SIDEBAR */}
      <aside className="hidden md:flex flex-col w-72 bg-white/80 backdrop-blur-3xl border-r border-zinc-200 shadow-[4px_0_40px_rgba(0,0,0,0.02)] z-20">
        <div className="p-8 relative overflow-hidden">
          <div className="w-12 h-12 mb-6 border border-zinc-200 rounded-full flex items-center justify-center shadow-sm bg-white">
            <TetragrammatonIcon className="w-6 h-6 text-zinc-400" />
          </div>
          <h2 className={`text-2xl font-medium text-zinc-800 uppercase tracking-widest ${cormorant.className}`}>
            El Velo
          </h2>
          <p className="text-[9px] text-zinc-400 mt-2 font-black tracking-[0.3em] uppercase">Control Interno</p>
        </div>
        
        {/* STYLIZED ADMIN OPTIONS */}
        <nav className="flex-1 px-5 space-y-3 mt-4 z-10">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/dashboard');
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-500 border ${
                  isActive 
                    ? 'bg-zinc-50 text-zinc-900 border-zinc-200 shadow-sm' 
                    : 'border-transparent text-zinc-500 hover:text-zinc-800 hover:bg-white hover:border-zinc-200 hover:shadow-sm'
                }`}
              >
                <div className={`p-1.5 rounded-full transition-colors duration-500 ${isActive ? 'bg-zinc-200/50' : 'bg-transparent group-hover:bg-zinc-100'}`}>
                  <item.icon className={`w-5 h-5 transition-transform duration-500 ${isActive ? 'text-zinc-800 scale-105' : 'text-zinc-400 group-hover:scale-105'}`} />
                </div>
                <span className="text-[11px] tracking-[0.1em] uppercase font-bold">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto pb-24 md:pb-8 p-6 md:p-12 z-10 custom-scrollbar relative">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>

      {/* MOBILE NAV */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-3xl border-t border-zinc-200 flex justify-around items-center h-20 px-2 z-50 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/dashboard');
          return (
            <Link key={item.name} href={item.href} className="flex flex-col items-center justify-center min-w-[70px] h-full space-y-1.5 active:scale-95">
              <item.icon className={`w-5 h-5 ${isActive ? 'text-zinc-800' : 'text-zinc-400'}`} />
              <span className={`text-[8px] tracking-widest uppercase ${isActive ? 'text-zinc-800 font-black' : 'text-zinc-400 font-medium'}`}>{item.name.split(' ')[0]}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

// Icons
function HomeIcon(props: React.SVGProps<SVGSVGElement>) { return <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>; }
function CalendarIcon(props: React.SVGProps<SVGSVGElement>) { return <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008z" /></svg>; }
function StoreIcon(props: React.SVGProps<SVGSVGElement>) { return <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" /></svg>; }
function UsersIcon(props: React.SVGProps<SVGSVGElement>) { return <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>; }
function MegaphoneIcon(props: React.SVGProps<SVGSVGElement>) { return <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 013.656-.59m0-8.228a18.03 18.03 0 01-3.656-.59m0 8.228L21 14.625m0-8.25l-7.018 1.185" /></svg>; }

function TetragrammatonIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="1" {...props}>
      <circle cx="100" cy="100" r="95" strokeDasharray="2 6" />
      <circle cx="100" cy="100" r="85" />
      <polygon points="100,15 174,143 26,143" />
      <polygon points="100,185 26,57 174,57" />
      <circle cx="100" cy="100" r="8" fill="currentColor" />
    </svg>
  );
}