import { prisma } from "@/lib/prisma";
import Link from "next/link";

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product.id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  product.type === 'SERVICE' ? 'bg-purple-100 text-purple-700' :
                  product.type === 'PHYSICAL' ? 'bg-orange-100 text-orange-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {product.type === 'SERVICE' ? 'Terapia / Servicio' :
                   product.type === 'PHYSICAL' ? 'Producto Físico' : 'Digital'}
                </span>
                
                {/* Opciones (Editar/Ocultar - se puede implementar después) */}
                <button className="text-gray-400 hover:text-gray-600">
                  <DotsIcon className="w-5 h-5" />
                </button>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-1 leading-tight">{product.name}</h3>
              <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.description}</p>
              
              <div className="pt-4 border-t border-gray-100 flex items-end justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-0.5">Precio</p>
                  <p className="text-lg font-bold text-indigo-700">{formatPrice(product.price)}</p>
                </div>
                
                <div className="text-right">
                  {product.type === 'SERVICE' && product.duration && (
                    <p className="text-sm text-gray-600 flex items-center gap-1 justify-end">
                      <ClockIcon className="w-4 h-4" /> {product.duration} min
                    </p>
                  )}
                  {product.type === 'PHYSICAL' && (
                    <p className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
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

// ==========================================
// Iconos SVG simples
// ==========================================

function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
}

function ClockIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function DotsIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
    </svg>
  );
}

function ShoppingBagIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
  );
}