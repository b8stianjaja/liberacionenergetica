import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Product } from "@prisma/client"; // <-- 1. Importamos el tipo exacto de Prisma

export default async function StorePage() {
  // Fetch all active products/services, ordered by newest first
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' }
  });

  // Helper to format the price in Chilean Pesos (CLP)
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mi Catálogo</h1>
          <p className="text-gray-500 mt-1">Administra tus terapias y productos a la venta.</p>
        </div>
        <Link 
          href="/dashboard/store/new"
          className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-sm active:scale-95"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Agregar Nuevo</span>
        </Link>
      </div>

      {/* Grid of Products/Services */}
      {products.length === 0 ? (
        <div className="text-center bg-white p-12 rounded-2xl border border-dashed border-gray-300">
          <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <ShoppingBagIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">Aún no tienes elementos</h3>
          <p className="text-gray-500 mb-6">Comienza agregando tu primera terapia o producto para que tus clientes puedan comprar.</p>
          <Link 
            href="/dashboard/store/new"
            className="text-indigo-600 font-bold hover:text-indigo-700"
          >
            + Crear mi primer elemento
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 2. Añadimos el tipado explícito al parámetro product */}
          {products.map((product: Product) => (
            <div key={product.id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
              
              {/* IMAGE PREVIEW BOX */}
              <div className="relative w-full aspect-[4/3] bg-gray-50 rounded-xl mb-4 overflow-hidden flex items-center justify-center group">
                {/* Badges over the image */}
                <div className="absolute top-3 left-3 z-10">
                  <span className={`text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full shadow-sm backdrop-blur-md ${
                    product.type === 'SERVICE' ? 'bg-purple-100/90 text-purple-800' :
                    product.type === 'PHYSICAL' ? 'bg-orange-100/90 text-orange-800' :
                    'bg-blue-100/90 text-blue-800'
                  }`}>
                    {product.type === 'SERVICE' ? 'Terapia' : product.type === 'PHYSICAL' ? 'Físico' : 'Digital'}
                  </span>
                </div>

                <div className="absolute top-3 right-3 z-10">
                  <button className="bg-white/80 backdrop-blur-md p-1.5 rounded-lg text-gray-600 hover:text-gray-900 shadow-sm transition-colors">
                    <DotsIcon className="w-5 h-5" />
                  </button>
                </div>

                {product.imageUrl ? (
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                ) : (
                  <ShoppingBagIcon className="w-12 h-12 text-gray-300" />
                )}
              </div>
              
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-1 leading-tight">{product.name}</h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.description}</p>
              </div>
              
              <div className="pt-4 border-t border-gray-100 flex items-end justify-between mt-auto">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-0.5">Precio</p>
                  <p className="text-lg font-black text-indigo-700">{formatPrice(product.price)}</p>
                </div>
                
                <div className="text-right">
                  {product.type === 'SERVICE' && product.duration && (
                    <p className="text-sm text-gray-600 flex items-center gap-1 justify-end font-medium bg-gray-50 px-2 py-1 rounded-md">
                      <ClockIcon className="w-4 h-4" /> {product.duration} min
                    </p>
                  )}
                  {product.type === 'PHYSICAL' && (
                    <p className={`text-sm font-bold px-2 py-1 rounded-md ${product.stock > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
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

// Iconos SVG simples...
function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>;
}
function ClockIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
}
function DotsIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" /></svg>;
}
function ShoppingBagIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>;
}