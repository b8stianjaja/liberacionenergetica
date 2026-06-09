import { prisma } from "@/lib/prisma";

export default async function ClientesPage() {
  // Buscamos a todos los usuarios que tengan el rol de "CUSTOMER" (Clientes)
  // e incluimos la cantidad de pedidos/citas que han hecho.
  const customers = await prisma.user.findMany({
    where: { 
      role: "CUSTOMER" 
    },
    orderBy: { 
      createdAt: "desc" // Los más nuevos primero
    },
    include: {
      _count: {
        select: { orders: true } // Contamos cuántas órdenes tienen
      }
    }
  });

  return (
    <div className="space-y-8">
      {/* CABECERA */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900">Mis Clientes</h1>
        <p className="text-gray-500 mt-1">Directorio de personas que han interactuado con tu tienda.</p>
      </div>

      {/* LISTA DE CLIENTES */}
      <section>
        {customers.length === 0 ? (
          <div className="bg-gray-50 rounded-2xl p-8 text-center border border-dashed border-gray-300">
            <p className="text-gray-500 font-medium">Aún no tienes clientes registrados.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {customers.map((customer) => (
              <CustomerCard key={customer.id} customer={customer} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

// ==========================================
// Componente de Tarjeta de Cliente
// ==========================================

function CustomerCard({ customer }: { customer: any }) {
  // Formateamos la fecha para que diga "octubre de 2023"
  const joinedDate = new Intl.DateTimeFormat("es-CL", {
    month: "long",
    year: "numeric",
  }).format(new Date(customer.createdAt));

  const orderCount = customer._count.orders;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col h-full hover:border-indigo-200 transition-colors">
      
      {/* INFO PRINCIPAL */}
      <div className="flex items-center gap-4 mb-5">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-700 font-black text-xl shadow-inner">
          {customer.name ? customer.name.charAt(0).toUpperCase() : "@"}
        </div>
        <div>
          <h3 className="font-bold text-lg text-gray-900 leading-tight">
            {customer.name || "Cliente sin nombre"}
          </h3>
          <p className="text-sm text-gray-500 mt-0.5">Cliente desde {joinedDate}</p>
        </div>
      </div>

      {/* MÉTRICAS DEL CLIENTE */}
      <div className="bg-gray-50 rounded-xl p-3 mb-5 border border-gray-100 flex justify-between items-center">
        <span className="text-sm text-gray-600 font-medium">Historial:</span>
        <span className={`font-bold px-3 py-1 rounded-lg text-xs ${
          orderCount > 0 
            ? "bg-emerald-100 text-emerald-700" 
            : "bg-gray-200 text-gray-600"
        }`}>
          {orderCount === 1 ? "1 Compra/Reserva" : `${orderCount} Compras/Reservas`}
        </span>
      </div>

      {/* BOTONES DE ACCIÓN (MÓVILES) */}
      <div className="mt-auto grid grid-cols-1 gap-2">
        {/* Botón de Email nativo (abre la app de correo del celular) */}
        <a 
          href={`mailto:${customer.email}`}
          className="flex items-center justify-center gap-2 w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold py-3 rounded-xl transition-colors active:scale-95"
        >
          <MailIcon className="w-5 h-5" />
          <span>Enviar Correo</span>
        </a>

        {/* Botón de WhatsApp preparado para el futuro. 
          Está comentado/desactivado visualmente hasta que agregues "phone" al esquema de Prisma.
        */}
        <button 
          disabled
          title="Requiere agregar teléfono en la base de datos"
          className="flex items-center justify-center gap-2 w-full bg-gray-50 text-gray-400 font-bold py-3 rounded-xl cursor-not-allowed border border-gray-100"
        >
          <PhoneIcon className="w-5 h-5" />
          <span>WhatsApp (Próximamente)</span>
        </button>
      </div>
    </div>
  );
}

// ==========================================
// Iconos
// ==========================================

function MailIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  );
}

function PhoneIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
    </svg>
  );
}