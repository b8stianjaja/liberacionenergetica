'use client';

import { useCart } from '@/context/CartContext';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { useEffect } from 'react';

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, updateQuantity, removeItem, total } = useCart();

  // Bloquear scroll del body cuando el carrito está abierto
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const formatPrice = (price: number) => 
    new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(price);

  return (
    <>
      {/* Overlay Oscuro */}
      <div 
        className={`fixed inset-0 bg-[var(--purple-deep)]/40 backdrop-blur-sm z-[99] transition-opacity duration-500 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer Panel */}
      <div className={`fixed top-0 right-0 h-[100svh] w-full sm:w-[450px] bg-white shadow-2xl z-[100] transform transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header del Carrito */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-[var(--purple-deep)]/10 bg-[var(--bg-canvas)]">
          <div className="flex items-center gap-3 text-[var(--purple-deep)]">
            <ShoppingBag size={24} strokeWidth={1.5} />
            <h2 className="font-playfair text-2xl">Tu Cesta</h2>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-2 text-zinc-400 hover:text-[var(--purple-deep)] hover:bg-[var(--purple-light)] rounded-full transition-colors">
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* Lista de Items */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-[var(--bg-canvas)]">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-50 space-y-4">
              <ShoppingBag size={48} strokeWidth={1} className="text-[var(--purple-deep)]" />
              <p className="font-playfair text-xl text-[var(--purple-deep)]">Tu cesta está esperando su luz.</p>
              <button onClick={() => setIsOpen(false)} className="text-xs uppercase tracking-widest border-b border-current pb-1 mt-4">Explorar Boutique</button>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 bg-white p-4 rounded-2xl shadow-sm border border-[var(--purple-deep)]/5 group">
                  <div className="w-20 h-24 relative bg-[var(--purple-light)]/30 rounded-xl overflow-hidden flex-shrink-0">
                    {item.imageUrl ? (
                      <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-[var(--purple-deep)]/20"><ShoppingBag size={24}/></div>
                    )}
                  </div>
                  
                  <div className="flex flex-col flex-grow justify-between py-1">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-playfair text-lg text-[var(--purple-deep)] leading-tight">{item.name}</h3>
                      <button onClick={() => removeItem(item.id)} className="text-zinc-300 hover:text-red-500 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-semibold text-zinc-700">{formatPrice(item.price)}</span>
                      
                      <div className="flex items-center gap-3 bg-[var(--bg-canvas)] border border-[var(--purple-deep)]/10 rounded-full px-2 py-1">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-zinc-500 hover:text-[var(--purple-deep)] w-6 h-6 flex items-center justify-center"><Minus size={14} strokeWidth={2}/></button>
                        <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-zinc-500 hover:text-[var(--purple-deep)] w-6 h-6 flex items-center justify-center"><Plus size={14} strokeWidth={2}/></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer / Checkout */}
        {items.length > 0 && (
          <div className="border-t border-[var(--purple-deep)]/10 bg-white p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.03)] z-10">
            <div className="flex justify-between items-end mb-6">
              <span className="text-sm font-bold uppercase tracking-widest text-zinc-400">Total a pagar</span>
              <span className="font-playfair text-3xl text-[var(--purple-deep)]">{formatPrice(total)}</span>
            </div>
            
            <button className="w-full bg-[var(--purple-deep)] text-white py-4 rounded-full flex items-center justify-center gap-3 uppercase tracking-widest text-xs font-bold hover:bg-[var(--gold-magic)] transition-colors duration-300 shadow-md">
              Iniciar Ritual de Pago <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </>
  );
}