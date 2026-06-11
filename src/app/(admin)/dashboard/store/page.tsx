import { prisma } from "@/lib/prisma";
import Link from "next/link";
import ProductControls from "./ProductControls";
import { Cormorant_Garamond } from "next/font/google";

const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600"], display: "swap" });

export default async function StorePage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    include: { category: true } 
  });

  const formatPrice = (price: number) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(price);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header Alquímico */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white/60 backdrop-blur-xl p-8 rounded-[2rem] border-silver-real shadow-[0_10px_30px_rgba(0,0,0,0.02)] gap-6">
        <div>
          <h1 className={`text-3xl md:text-4xl text-silver-shimmer tracking-wide mb-1 ${cormorant.className}`}>Artefactos & Terapias</h1>
          <p className="text-zinc-500 text-[10px] font-black tracking-[0.2em] uppercase">Gestor de Catálogo</p>
        </div>
        <Link href="/dashboard/store/new" className="bg-gradient-to-b from-white to-zinc-50 border-silver-real px-8 py-3.5 rounded-full text-xs font-bold tracking-widest text-zinc-600 hover:text-zinc-900 hover:shadow-[0_5px_15px_rgba(161,161,170,0.2)] transition-all uppercase flex items-center gap-2 group">
          <span className="text-lg group-hover:rotate-90 transition-transform">+</span> Forjar Nuevo
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {products.map((product) => (
          <div key={product.id} className={`group relative bg-white/70 backdrop-blur-md p-5 rounded-[2rem] border-silver-real flex flex-col h-full hover:shadow-[0_15px_35px_rgba(161,161,170,0.15)] transition-all duration-500 ${product.isActive ? '' : 'opacity-60 grayscale-[50%]'}`}>
            
            <div className="relative w-full aspect-[4/3] bg-gradient-to-br from-zinc-50 to-zinc-100 rounded-[1.5rem] mb-5 overflow-hidden flex items-center justify-center border border-white shadow-inner">
              <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                {product.category && (
                  <span className="text-[8px] uppercase font-black px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-zinc-600 border border-zinc-200 shadow-sm">{product.category.name}</span>
                )}
                {!product.isActive && (
                  <span className="text-[8px] uppercase font-black px-3 py-1.5 rounded-full bg-zinc-800/90 text-white shadow-sm">Oculto del Plano</span>
                )}
              </div>
              
              <div className="absolute top-3 right-3 z-20">
                <ProductControls id={product.id} isActive={product.isActive} />
              </div>

              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              ) : (
                <span className="text-zinc-300 font-medium tracking-widest text-xs uppercase">Vacío</span>
              )}
            </div>
            
            <div className="flex-1 px-2">
              <h3 className={`text-2xl text-zinc-800 mb-2 leading-tight ${cormorant.className}`}>{product.name}</h3>
              <p className="text-zinc-500 text-[11px] mb-4 line-clamp-2 leading-relaxed">{product.description}</p>
            </div>
            
            <div className="pt-4 border-t border-zinc-100 flex items-end justify-between px-2">
              <p className={`text-xl font-semibold text-zinc-800 ${cormorant.className}`}>{formatPrice(product.price)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}