import Link from 'next/link';
import { ShoppingCart, User } from 'lucide-react';

export default function Header() {
  return (
    <header className="w-full bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-purple-100 shadow-sm transition-mystic">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        {/* Balance de Marca */}
        <Link href="/" className="flex flex-col items-start group">
          <span className="font-serif text-2xl text-[#4a2e6b] leading-none group-hover:text-purple-600 transition-mystic">
            Johanna Grandón
          </span>
          <span className="text-[10px] text-[#cfaa66] tracking-[0.2em] uppercase mt-1 font-bold">
            Liberación Energética
          </span>
        </Link>
        
        {/* Navegación Principal */}
        <nav className="hidden md:flex space-x-8 text-sm font-medium text-gray-600">
          <Link href="/" className="hover:text-[#4a2e6b] transition-mystic">Inicio</Link>
          <Link href="/sobre-mi" className="hover:text-[#4a2e6b] transition-mystic">Sobre mí</Link>
          <Link href="/terapias" className="hover:text-[#4a2e6b] transition-mystic">Terapias</Link>
          <Link href="/testimonios" className="hover:text-[#4a2e6b] transition-mystic">Testimonios</Link>
          <Link href="/boutique" className="hover:text-[#4a2e6b] transition-mystic">Boutique</Link>
        </nav>

        {/* Acciones */}
        <div className="flex items-center space-x-5">
          <Link href="/login" className="text-[#4a2e6b] hover:text-[#cfaa66] transition-mystic">
            <User size={20} strokeWidth={1.5} />
          </Link>
          <button className="text-[#4a2e6b] hover:text-[#cfaa66] transition-mystic relative">
            <ShoppingCart size={20} strokeWidth={1.5} />
            <span className="absolute -top-2 -right-2 bg-[#cfaa66] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
              0
            </span>
          </button>
          <a 
            href="https://wa.me/tunumerowhatsapp" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hidden lg:inline-flex bg-[#4a2e6b] text-white px-6 py-2.5 rounded-full text-sm hover:bg-[#362051] transition-mystic shadow-md hover:shadow-lg"
          >
            Agenda tu sesión
          </a>
        </div>
      </div>
    </header>
  );
}