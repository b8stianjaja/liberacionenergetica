"use client";

import { useCart } from "@/context/CartContext";
import { Cormorant_Garamond } from "next/font/google";
import Image from "next/image";

const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "600"] });

export default function CartDrawer() {
  const { isCartOpen, closeCart, items, removeItem, updateQuantity, totalPrice, isHydrated } = useCart();

  if (!isHydrated) return null;

  return (
    <>
      {/* Overlay oscuro */}
      <div 
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-[100] transition-opacity duration-500 ${isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={closeCart}
      />

      {/* Panel lateral */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[101] transform transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] flex flex-col ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className={`text-2xl font-semibold text-gray-900 ${cormorant.className}`}>Tu Bolsa</h2>
          <button onClick={closeCart} className="p-2 text-gray-400 hover:text-gray-900 transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Lista de items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4">
              <svg className="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" /></svg>
              <p>Tu bolsa está vacía</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 items-center">
                <div className="relative w-20 h-20 bg-gray-50 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                  {item.imageUrl && <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />}
                </div>
                <div className="flex-1">
                  <h3 className={`font-semibold text-gray-900 ${cormorant.className} text-lg`}>{item.name}</h3>
                  <p className="text-gray-500 text-sm mb-2">${item.price}</p>
                  <div className="flex items-center gap-3">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-6 h-6 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100">-</button>
                    <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-6 h-6 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100">+</button>
                  </div>
                </div>
                <button onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-red-500 transition-colors p-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer del Drawer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-gray-50/50">
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-500 font-medium">Subtotal</span>
              <span className={`text-2xl font-semibold text-gray-900 ${cormorant.className}`}>${totalPrice}</span>
            </div>
            <button className="w-full bg-gray-900 text-white py-4 rounded-xl font-medium tracking-wide hover:bg-gray-800 transition-colors shadow-lg shadow-gray-900/20 active:scale-[0.98]">
              Iniciar Pago Seguro
            </button>
          </div>
        )}
      </div>
    </>
  );
}