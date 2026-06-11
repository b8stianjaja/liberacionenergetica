import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { Cormorant_Garamond } from "next/font/google";

const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600"], display: "swap" });

type AppointmentWithRelations = Prisma.OrderGetPayload<{
  include: { user: true; items: { include: { product: true; }; }; };
}>;

async function completeAppointment(formData: FormData) {
  "use server";
  await prisma.order.update({ where: { id: formData.get("orderId") as string }, data: { status: "COMPLETED" } });
  revalidatePath("/dashboard/agenda");
}

async function cancelAppointment(formData: FormData) {
  "use server";
  await prisma.order.update({ where: { id: formData.get("orderId") as string }, data: { status: "CANCELLED" } });
  revalidatePath("/dashboard/agenda");
}

export default async function AgendaPage() {
  const appointments = await prisma.order.findMany({
    where: { bookingDate: { not: null } },
    orderBy: { bookingDate: "asc" },
    include: { user: true, items: { include: { product: true } } },
  });

  const pendingAppointments = appointments.filter((app: AppointmentWithRelations) => app.status === "NEW" || app.status === "PROCESSING");
  const completedAppointments = appointments.filter((app: AppointmentWithRelations) => app.status === "COMPLETED");

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <div className="bg-white/60 backdrop-blur-xl p-8 rounded-[2rem] border-silver-real shadow-[0_10px_30px_rgba(0,0,0,0.02)]">
        <h1 className={`text-3xl md:text-4xl text-silver-shimmer tracking-wide mb-1 ${cormorant.className}`}>Rituales & Encuentros</h1>
        <p className="text-zinc-500 text-[10px] font-black tracking-[0.2em] uppercase">Lectura del Tiempo Acordado</p>
      </div>

      <section>
        <h2 className="text-xs font-black text-zinc-400 tracking-[0.3em] uppercase mb-6 px-2">Alineaciones Futuras</h2>
        {pendingAppointments.length === 0 ? (
          <div className="bg-white/50 rounded-[2.5rem] p-16 text-center border-silver-real shadow-sm">
            <p className="text-zinc-400 text-xs font-bold tracking-[0.2em] uppercase">La línea temporal está despejada.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {pendingAppointments.map((appointment: AppointmentWithRelations) => (
              <AppointmentCard key={appointment.id} appointment={appointment} isCompleted={false} />
            ))}
          </div>
        )}
      </section>

      {completedAppointments.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xs font-black text-zinc-300 tracking-[0.3em] uppercase mb-6 px-2">Ecos del Pasado</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 opacity-60 hover:opacity-100 transition-opacity duration-700">
            {completedAppointments.map((appointment: AppointmentWithRelations) => (
              <AppointmentCard key={appointment.id} appointment={appointment} isCompleted={true} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function AppointmentCard({ appointment, isCompleted }: { appointment: AppointmentWithRelations; isCompleted: boolean; }) {
  const dateFormatter = new Intl.DateTimeFormat("es-CL", { weekday: "long", day: "numeric", month: "long" });
  const timeFormatter = new Intl.DateTimeFormat("es-CL", { hour: "numeric", minute: "2-digit", hour12: true });

  const dateObj = new Date(appointment.bookingDate as Date);
  const formattedDate = dateFormatter.format(dateObj);
  const formattedTime = timeFormatter.format(dateObj);
  const serviceName = appointment.items[0]?.product?.name || "Manifestación Desconocida";

  return (
    <div className={`flex flex-col bg-white/70 backdrop-blur-md rounded-[2rem] p-6 border-silver-real shadow-sm transition-all h-full ${
      isCompleted ? "bg-zinc-50/50" : "hover:shadow-[0_15px_30px_rgba(161,161,170,0.15)] hover:-translate-y-1 duration-500"
    }`}>
      <div className="flex items-start justify-between border-b border-zinc-100 pb-5 mb-5 relative">
        <div className="absolute -bottom-px left-0 w-1/3 h-px bg-gradient-to-r from-zinc-300 to-transparent" />
        <div>
          <p className="text-zinc-400 font-black uppercase tracking-[0.2em] text-[9px] mb-1">
            {formattedDate}
          </p>
          <p className={`text-4xl text-zinc-800 ${cormorant.className}`}>{formattedTime}</p>
        </div>
        {isCompleted && (
          <span className="bg-white text-zinc-500 border border-zinc-200 shadow-sm text-[8px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest">
            Consumado
          </span>
        )}
      </div>

      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-full bg-gradient-to-b from-white to-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-500 shadow-inner">
          <span className={`text-xl ${cormorant.className}`}>{appointment.user.name ? appointment.user.name.charAt(0).toUpperCase() : "A"}</span>
        </div>
        <div>
          <p className={`text-xl text-zinc-800 leading-tight ${cormorant.className}`}>
            {appointment.user.name || "Alma anónima"}
          </p>
          <p className="text-zinc-400 text-[10px] font-bold tracking-widest uppercase mt-1">{serviceName}</p>
        </div>
      </div>

      {!isCompleted && (
        <div className="mt-auto pt-2 flex gap-3">
          <form action={completeAppointment} className="flex-1">
            <input type="hidden" name="orderId" value={appointment.id} />
            <button type="submit" className="w-full bg-white border border-zinc-200 hover:border-zinc-800 text-zinc-500 hover:text-zinc-900 shadow-sm font-bold py-3.5 rounded-xl transition-all text-[9px] tracking-[0.2em] uppercase flex items-center justify-center gap-2 group">
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-300 group-hover:bg-zinc-800 transition-colors" />
              Sellar
            </button>
          </form>
          
          <form action={cancelAppointment} className="flex-1">
            <input type="hidden" name="orderId" value={appointment.id} />
            <button type="submit" className="w-full bg-transparent border border-zinc-200 hover:bg-zinc-50 text-zinc-400 hover:text-zinc-600 font-bold py-3.5 rounded-xl transition-all text-[9px] tracking-[0.2em] uppercase flex items-center justify-center gap-2">
              <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              Disolver
            </button>
          </form>
        </div>
      )}
    </div>
  );
}