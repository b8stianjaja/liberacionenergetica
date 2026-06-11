import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { Cormorant_Garamond } from "next/font/google";

const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600"], display: "swap" });

type CustomerWithCounts = Prisma.UserGetPayload<{ include: { _count: { select: { orders: true }; }; }; }>;

export default async function ClientesPage() {
  const customers = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { orders: true } } }
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <div className="bg-white/60 backdrop-blur-xl p-8 rounded-[2rem] border-silver-real shadow-[0_10px_30px_rgba(0,0,0,0.02)]">
        <h1 className={`text-3xl md:text-4xl text-silver-shimmer tracking-wide mb-1 ${cormorant.className}`}>Almas Conectadas</h1>
        <p className="text-zinc-500 text-[10px] font-black tracking-[0.2em] uppercase">Registro del Vínculo Material</p>
      </div>

      <section>
        {customers.length === 0 ? (
          <div className="bg-white/50 rounded-[2.5rem] p-16 text-center border-silver-real shadow-sm">
            <p className="text-zinc-400 text-xs font-bold tracking-[0.2em] uppercase">El registro se encuentra en silencio.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {customers.map((customer: CustomerWithCounts) => (
              <CustomerCard key={customer.id} customer={customer} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function CustomerCard({ customer }: { customer: CustomerWithCounts }) {
  const joinedDate = new Intl.DateTimeFormat("es-CL", { month: "long", year: "numeric" }).format(new Date(customer.createdAt));
  const orderCount = customer._count.orders;

  return (
    <div className="bg-white/70 backdrop-blur-md rounded-[2rem] p-6 border-silver-real flex flex-col h-full hover:shadow-[0_15px_30px_rgba(161,161,170,0.15)] hover:-translate-y-1 transition-all duration-500">
      
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-full bg-gradient-to-b from-white to-zinc-100 flex items-center justify-center text-zinc-500 border border-zinc-200 shadow-[inset_0_2px_5px_rgba(0,0,0,0.02)]">
          <span className={`text-2xl ${cormorant.className}`}>{customer.name ? customer.name.charAt(0).toUpperCase() : "A"}</span>
        </div>
        <div>
          <h3 className={`text-xl text-zinc-800 leading-tight ${cormorant.className}`}>
            {customer.name || "Alma anónima"}
          </h3>
          <p className="text-[9px] text-zinc-400 uppercase font-black tracking-widest mt-1">Conexión: {joinedDate}</p>
        </div>
      </div>

      <div className="bg-zinc-50/50 rounded-xl p-4 mb-6 border border-zinc-100 flex justify-between items-center shadow-inner">
        <span className="text-[10px] text-zinc-500 font-bold tracking-[0.2em] uppercase">Frecuencia:</span>
        <span className={`font-black px-3 py-1.5 rounded-full text-[9px] tracking-widest uppercase ${
          orderCount > 0 ? "bg-white text-zinc-800 border border-zinc-200 shadow-sm" : "bg-transparent text-zinc-400 border border-zinc-200"
        }`}>
          {orderCount === 1 ? "1 Sincronización" : `${orderCount} Sincronizaciones`}
        </span>
      </div>

      <div className="mt-auto grid grid-cols-1 gap-3">
        <a href={`mailto:${customer.email}`} className="flex items-center justify-center gap-2 w-full bg-white border border-zinc-200 hover:border-zinc-400 text-zinc-600 hover:text-zinc-900 font-bold py-3 rounded-xl transition-all shadow-sm text-[10px] uppercase tracking-widest">
          <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
          Proyectar
        </a>

        {customer.phone ? (
          <a href={`https://wa.me/${customer.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full bg-gradient-to-b from-white to-zinc-50 border border-zinc-200 hover:border-zinc-400 text-zinc-600 hover:text-zinc-900 font-bold py-3 rounded-xl transition-all shadow-sm text-[10px] uppercase tracking-widest">
            <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.896-1.596-5.265-3.965-6.861-6.861l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
            Resonar
          </a>
        ) : (
          <button disabled className="flex items-center justify-center gap-2 w-full bg-transparent border border-zinc-100 text-zinc-300 font-bold py-3 rounded-xl cursor-not-allowed text-[10px] uppercase tracking-widest">
            Sin Canal
          </button>
        )}
      </div>
    </div>
  );
}