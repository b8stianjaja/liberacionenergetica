import { prisma } from "@/lib/prisma";
import Link from "next/link";
import ProductControls from "./ProductControls";

export default async function StorePage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    include: { category: true } 
  });

  const formatPrice = (price: number) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(price);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center bg-white/70 backdrop-blur-xl p-8 rounded-[2rem] shadow-sm border border-white/50">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Gestor de Catálogo</h1>
          <p className="text-gray-500">Administra terapias e inventario.</p>
        </div>
        <Link href="/dashboard/store/new" className="bg-gray-900 text-white px-7 py-4 rounded-2xl font-bold hover:bg-indigo-600 transition-all shadow-xl">
          + Agregar Nuevo
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {products.map((product) => (
          <div key={product.id} className={`group bg-white p-5 rounded-[2rem] border flex flex-col h-full ${product.isActive ? 'border-gray-100 shadow-sm' : 'border-red-100/50 opacity-75 grayscale-[30%]'}`}>
            <div className="relative w-full aspect-[4/3] bg-gray-100 rounded-[1.5rem] mb-5 overflow-hidden flex items-center justify-center">
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                {product.category && (
                  <span className="text-[10px] uppercase font-black px-4 py-1.5 rounded-full bg-white/90 shadow-sm border">{product.category.name}</span>
                )}
                {!product.isActive && (
                  <span className="text-[10px] uppercase font-black px-4 py-1.5 rounded-full bg-red-600/90 text-white">Oculto</span>
                )}
              </div>
              
              <div className="absolute top-4 right-4 z-20">
                <ProductControls id={product.id} isActive={product.isActive} />
              </div>

              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              ) : (
                <span className="text-gray-300">Sin Imagen</span>
              )}
            </div>
            
            <div className="flex-1 px-2">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
              <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.description}</p>
            </div>
            
            <div className="pt-4 border-t border-gray-50 flex items-end justify-between px-2">
              <p className="text-xl font-black text-gray-900">{formatPrice(product.price)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}