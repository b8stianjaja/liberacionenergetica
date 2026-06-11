import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Product } from "@prisma/client";

export default async function StorePage() {
  // Fetch de productos activos ordenados por el más reciente
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' }
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header Estilo Premium (Igual al Dashboard) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/70 backdrop-blur-xl p-8 rounded-[2rem] shadow-sm border border-white/50 gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Mi Catálogo</h1>
          <p className="text-gray-500 mt-1 font-medium">Administra tus terapias y productos a la venta.</p>
        </div>
        <Link 
          href="/dashboard/store/new"
          className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3.5 rounded-2xl font-bold hover:bg-indigo-600 transition-all shadow-lg hover:shadow-indigo-200 hover:-translate-y-1 active:scale-95"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Agregar Nuevo</span>
        </Link>
      </div>

      {/* Grid de Productos */}
      {products.length === 0 ? (
        <div className="text-center bg-white/60 backdrop-blur-xl p-16 rounded-[2rem] border border-dashed border-gray-300 shadow-sm">
          <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
            <ShoppingBagIcon className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Aún no tienes elementos</h3>
          <p className="text-gray-500 mb-8 max-w-md mx-auto text-lg">Comienza agregando tu primera terapia o producto para que tus clientes puedan comprar.</p>
          <Link 
            href="/dashboard/store/new"
            className="text-indigo-600 font-bold hover:text-indigo-800 bg-indigo-50 px-6 py-3 rounded-full transition-colors"
          >
            + Crear mi primer elemento
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product: Product) => (
            <div key={product.id} className="group bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
              
              {/* Contenedor de Imagen */}
              <div className="relative w-full aspect-[4/3] bg-gray-50 rounded-[1.5rem] mb-5 overflow-hidden flex items-center justify-center">
                
                {/* Badges */}
                <div className="absolute top-4 left-4 z-10">
                  <span className={`text-[10px] uppercase tracking-widest font-black px-4 py-1.5 rounded-full shadow-sm backdrop-blur-md border ${
                    product.type === 'SERVICE' ? 'bg-purple-500/10 text-purple-700 border-purple-200/50' :
                    product.type === 'PHYSICAL' ? 'bg-orange-500/10 text-orange-700 border-orange-200/50' :
                    'bg-blue-500/10 text-blue-700 border-blue-200/50'
                  }`}>
                    {product.type === 'SERVICE' ? 'Terapia' : product.type === 'PHYSICAL' ? 'Físico' : 'Digital'}
                  </span>
                </div>

                <div className="absolute top-4 right-4 z-10">
                  <button className="bg-white/90 backdrop-blur-md p-2 rounded-xl text-gray-500 hover:text-gray-900 shadow-sm transition-colors hover:scale-105 active:scale-95">
                    <DotsIcon className="w-5 h-5" />
                  </button>
                </div>

                {product.imageUrl ? (
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                ) : (
                  <ShoppingBagIcon className="w-12 h-12 text-gray-300" />
                )}
              </div>
              
              <div className="flex-1 px-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight group-hover:text-indigo-600 transition-colors">{product.name}</h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2 leading-relaxed">{product.description}</p>
              </div>
              
              <div className="pt-4 border-t border-gray-50 flex items-end justify-between mt-auto px-1">
                <div>
                  <p className="text-[11px] text-gray-400 uppercase tracking-widest font-bold mb-1">Precio</p>
                  <p className="text-xl font-black text-gray-900">{formatPrice(product.price)}</p>
                </div>
                
                <div className="text-right">
                  {product.type === 'SERVICE' && product.duration && (
                    <p className="text-xs text-gray-600 flex items-center gap-1.5 justify-end font-bold bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                      <ClockIcon className="w-4 h-4" /> {product.duration} min
                    </p>
                  )}
                  {product.type === 'PHYSICAL' && (
                    <p className={`text-xs font-bold px-3 py-1.5 rounded-lg border ${product.stock > 0 ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                      Stock: {product.stock}
                    </p>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Iconos
function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>;
}
function ClockIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
}
function DotsIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" /></svg>;
}
function ShoppingBagIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>;
}