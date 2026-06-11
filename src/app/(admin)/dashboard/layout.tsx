'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Cormorant_Garamond, Montserrat } from "next/font/google";

// Typographic alchemy
const cormorant = Cormorant_Garamond({ 
  subsets: ["latin"], 
  weight: ["300", "400", "500", "600", "700"],
  display: "swap"
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap"
});

const navItems = [
  { name: 'Resumen', href: '/dashboard', icon: HomeIcon },
  { name: 'Mi Agenda', href: '/dashboard/agenda', icon: CalendarIcon },
  { name: 'Mi Tienda', href: '/dashboard/store', icon: ShoppingBagIcon }, 
  { name: 'Promociones', href: '/dashboard/banners', icon: MegaphoneIcon },
  { name: 'Mis Clientes', href: '/dashboard/clients', icon: UsersIcon },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className={`flex h-screen bg-[#07050A] text-gray-200 ${montserrat.className} selection:bg-fuchsia-900 selection:text-fuchsia-100 overflow-hidden relative`}>
      
      {/* HOLOGRAPHIC NOISE SURFACE (Tetragrammaton Void) */}
      <div className="fixed inset-0 z-0 opacity-[0.08] mix-blend-screen pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}/>

      {/* AMBIENT MAGICAL ORBS */}
      <div className="absolute top-[-10%] left-[-5%] w-[40vw] h-[40vw] bg-fuchsia-900/20 blur-[120px] rounded-full pointer-events-none z-0 animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-[-10%] right-[-5%] w-[30vw] h-[30vw] bg-indigo-900/20 blur-[100px] rounded-full pointer-events-none z-0 animate-pulse" style={{ animationDuration: '12s' }} />
      <div className="absolute top-[40%] left-[50%] w-[50vw] h-[50vw] bg-amber-900/10 blur-[150px] rounded-full pointer-events-none z-0 -translate-x-1/2 -translate-y-1/2" />

      {/* DESKTOP SIDEBAR - Glassmorphic Altar */}
      <aside className="hidden md:flex flex-col w-72 bg-white/[0.02] backdrop-blur-3xl border-r border-white/10 shadow-[4px_0_24px_rgba(0,0,0,0.5)] z-20">
        <div className="p-8 relative overflow-hidden">
          {/* Subtle geometric accent in header */}
          <div className="absolute -top-10 -right-10 opacity-10">
            <EsotericGeometryIcon className="w-40 h-40 animate-[spin_40s_linear_infinite]" />
          </div>
          <h2 className={`text-3xl font-bold bg-gradient-to-br from-fuchsia-300 to-indigo-400 bg-clip-text text-transparent ${cormorant.className}`}>
            L.E. Creador
          </h2>
          <p className="text-xs text-gray-500 mt-2 font-medium tracking-[0.2em] uppercase">Velo Interno</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4 z-10">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/dashboard');
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-500 relative overflow-hidden ${
                  isActive 
                    ? 'text-fuchsia-100 font-semibold shadow-[0_0_20px_rgba(192,132,252,0.1)]' 
                    : 'text-gray-400 hover:text-white font-medium hover:bg-white/5'
                }`}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-500/20 to-transparent border-l-2 border-fuchsia-400 -z-10" />
                )}
                <item.icon className={`w-6 h-6 transition-transform duration-500 ${isActive ? 'text-fuchsia-400 scale-110' : 'text-gray-500 group-hover:scale-110'}`} />
                <span className="text-[15px] tracking-wide">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto pb-24 md:pb-8 p-4 md:p-8 z-10 custom-scrollbar">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>

      {/* MOBILE BOTTOM NAVIGATION */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0A0710]/80 backdrop-blur-2xl border-t border-white/10 flex justify-around items-center h-20 px-2 z-50 pb-safe overflow-x-auto shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/dashboard');
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center min-w-[70px] h-full space-y-1.5 active:scale-95 transition-transform ${
                isActive ? 'text-fuchsia-300' : 'text-gray-500'
              }`}
            >
              <div className={`p-1.5 rounded-full transition-all duration-500 ${isActive ? 'bg-fuchsia-500/20 shadow-[0_0_15px_rgba(192,132,252,0.3)]' : 'bg-transparent'}`}>
                 <item.icon className={`w-6 h-6 ${isActive ? 'text-fuchsia-300' : 'text-gray-500'}`} />
              </div>
              <span className={`text-[10px] tracking-widest uppercase ${isActive ? 'font-bold' : 'font-medium'}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

// --- Icons ---
function HomeIcon(props: React.SVGProps<SVGSVGElement>) { return <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>; }
function CalendarIcon(props: React.SVGProps<SVGSVGElement>) { return <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" /></svg>; }
function ShoppingBagIcon(props: React.SVGProps<SVGSVGElement>) { return <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>; }
function UsersIcon(props: React.SVGProps<SVGSVGElement>) { return <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>; }
function MegaphoneIcon(props: React.SVGProps<SVGSVGElement>) { return <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 013.656-.59m0-8.228a18.03 18.03 0 01-3.656-.59m0 8.228L21 14.625m0-8.25l-7.018 1.185" /></svg>; }

// Sacred Geometry Background SVG for the dark mystic vibe
function EsotericGeometryIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5" {...props}>
      <circle cx="50" cy="50" r="48" />
      <circle cx="50" cy="50" r="35" />
      <polygon points="50,2 93,75 7,75" />
      <polygon points="50,98 7,25 93,25" />
      <circle cx="50" cy="50" r="20" />
      <line x1="50" y1="2" x2="50" y2="98" />
      <line x1="7" y1="25" x2="93" y2="75" />
      <line x1="7" y1="75" x2="93" y2="25" />
    </svg>
  );
}