import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// Definimos el tipo exacto del cliente que incluye el conteo de órdenes
type CustomerWithCounts = Prisma.UserGetPayload<{
  include: {
    _count: {
      select: { orders: true };
    };
  };
}>;

export default async function ClientesPage() {
  const customers = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { orders: true } } }
  });

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Mis Clientes</h1>
        <p className="text-gray-500 mt-1 font-medium">Directorio de personas que han interactuado con tu tienda.</p>
      </div>

      <section>
        {customers.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-dashed border-gray-300">
            <p className="text-gray-500 font-medium">Aún no tienes clientes registrados.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* AQUÍ ESTÁ LA SOLUCIÓN: Tipado explícito en el .map */}
            {customers.map((customer: CustomerWithCounts) => (
              <CustomerCard key={customer.id} customer={customer} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

// Componente tipado de forma segura
function CustomerCard({ customer }: { customer: CustomerWithCounts }) {
  const joinedDate = new Intl.DateTimeFormat("es-CL", { 
    month: "long", 
    year: "numeric" 
  }).format(new Date(customer.createdAt));
  
  const orderCount = customer._count.orders;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-md hover:border-indigo-100 transition-all">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-700 font-black text-xl shadow-inner">
          {customer.name ? customer.name.charAt(0).toUpperCase() : "@"}
        </div>
        <div>
          <h3 className="font-bold text-lg text-gray-900 leading-tight">
            {customer.name || "Cliente sin nombre"}
          </h3>
          <p className="text-sm text-gray-500 mt-0.5 font-medium">Desde {joinedDate}</p>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100 flex justify-between items-center">
        <span className="text-sm text-gray-600 font-bold">Actividad:</span>
        <span className={`font-black px-3 py-1 rounded-lg text-xs tracking-wide ${
          orderCount > 0 ? "bg-emerald-100 text-emerald-800" : "bg-gray-200 text-gray-600"
        }`}>
          {orderCount === 1 ? "1 Reserva" : `${orderCount} Reservas`}
        </span>
      </div>

      <div className="mt-auto grid grid-cols-1 gap-3">
        <a href={`mailto:${customer.email}`} className="flex items-center justify-center gap-2 w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold py-3 rounded-xl transition-colors active:scale-95 text-sm">
          <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
          Correo
        </a>

        {customer.phone ? (
          <a href={`https://wa.me/${customer.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full bg-green-50 hover:bg-green-100 text-green-700 font-bold py-3 rounded-xl transition-colors active:scale-95 text-sm">
            <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.896-1.596-5.265-3.965-6.861-6.861l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
            WhatsApp
          </a>
        ) : (
          <button disabled className="flex items-center justify-center gap-2 w-full bg-gray-50 text-gray-400 font-bold py-3 rounded-xl cursor-not-allowed border border-gray-100 text-sm">
            <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.896-1.596-5.265-3.965-6.861-6.861l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
            Sin teléfono
          </button>
        )}
      </div>
    </div>
  );
}