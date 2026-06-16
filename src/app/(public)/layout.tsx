import Header from '@/components/Header';
import CartDrawer from '@/components/CartDrawer';
import { CartProvider } from '@/context/CartContext';
import { ReactNode } from 'react';

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <div className="flex flex-col min-h-screen relative">
        
        {/* Navegación Principal */}
        <Header />
        
        {/* Contenido Dinámico (Hero, Terapias, Boutique) */}
        <main className="flex-grow">
          {children}
        </main>

        {/* Panel lateral del carrito (Oculto por defecto, activado por Context) */}
        <CartDrawer />

        {/* Footer */}
        <footer className="w-full bg-[var(--purple-deep)] text-white py-12 px-6 lg:px-16 border-t border-white/10 relative z-10">
          <div className="max-w-[90rem] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col items-center md:items-start">
               <span className="font-playfair text-2xl tracking-wider">Johanna Grandón</span>
               <span className="text-[10px] text-[var(--gold-magic)] tracking-[0.25em] uppercase mt-1 font-bold">
                 Liberación Energética
               </span>
            </div>
            <p className="text-white/40 text-xs font-light text-center md:text-right">
              &copy; {new Date().getFullYear()} Creado con intención. Todos los derechos reservados.
            </p>
          </div>
        </footer>

      </div>
    </CartProvider>
  );
}