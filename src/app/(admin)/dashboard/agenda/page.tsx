import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

// Definimos el tipo exacto que retorna Prisma al incluir estas relaciones
type AppointmentWithRelations = Prisma.OrderGetPayload<{
  include: {
    user: true;
    items: {
      include: {
        product: true;
      };
    };
  };
}>;

// SERVER ACTIONS
async function completeAppointment(formData: FormData) {
  "use server";
  await prisma.order.update({
    where: { id: formData.get("orderId") as string },
    data: { status: "COMPLETED" },
  });
  revalidatePath("/dashboard/agenda");
}

async function cancelAppointment(formData: FormData) {
  "use server";
  await prisma.order.update({
    where: { id: formData.get("orderId") as string },
    data: { status: "CANCELLED" },
  });
  revalidatePath("/dashboard/agenda");
}

export default async function AgendaPage() {
  const appointments = await prisma.order.findMany({
    where: { bookingDate: { not: null } },
    orderBy: { bookingDate: "asc" },
    include: {
      user: true,
      items: { include: { product: true } },
    },
  });

  const pendingAppointments = appointments.filter(
    (app: AppointmentWithRelations) => app.status === "NEW" || app.status === "PROCESSING"
  );
  
  const completedAppointments = appointments.filter(
    (app: AppointmentWithRelations) => app.status === "COMPLETED"
  );

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Mi Agenda</h1>
        <p className="text-gray-500 mt-1 font-medium">Tus próximas sesiones y terapias programadas.</p>
      </div>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-4 px-2">Próximas Citas</h2>
        {pendingAppointments.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-dashed border-gray-300">
            <p className="text-gray-500 font-medium">No tienes citas pendientes por ahora.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* AQUÍ ESTÁ LA SOLUCIÓN: Tipado explícito en el .map */}
            {pendingAppointments.map((appointment: AppointmentWithRelations) => (
              <AppointmentCard key={appointment.id} appointment={appointment} isCompleted={false} />
            ))}
          </div>
        )}
      </section>

      {completedAppointments.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold text-gray-500 mb-4 px-2">Historial de Sesiones</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 opacity-75">
            {/* AQUÍ ESTÁ LA SOLUCIÓN: Tipado explícito en el .map */}
            {completedAppointments.map((appointment: AppointmentWithRelations) => (
              <AppointmentCard key={appointment.id} appointment={appointment} isCompleted={true} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// Componente tipado de forma segura
function AppointmentCard({ 
  appointment, 
  isCompleted 
}: { 
  appointment: AppointmentWithRelations; 
  isCompleted: boolean; 
}) {
  const dateFormatter = new Intl.DateTimeFormat("es-CL", { weekday: "long", day: "numeric", month: "long" });
  const timeFormatter = new Intl.DateTimeFormat("es-CL", { hour: "numeric", minute: "2-digit", hour12: true });

  const dateObj = new Date(appointment.bookingDate as Date);
  const formattedDate = dateFormatter.format(dateObj);
  const formattedTime = timeFormatter.format(dateObj);
  const serviceName = appointment.items[0]?.product?.name || "Servicio no especificado";

  return (
    <div className={`flex flex-col bg-white rounded-2xl p-6 shadow-sm border transition-all h-full ${
      isCompleted ? "border-gray-200 bg-gray-50/50" : "border-indigo-100 hover:border-indigo-300 hover:shadow-md"
    }`}>
      <div className="flex items-start justify-between border-b border-gray-100 pb-4 mb-4">
        <div>
          <p className="text-indigo-600 font-bold uppercase tracking-wider text-xs mb-1">
            {formattedDate}
          </p>
          <p className="text-3xl font-black text-gray-900">{formattedTime}</p>
        </div>
        {isCompleted && (
          <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-3 py-1.5 rounded-lg uppercase tracking-wide">
            Realizada
          </span>
        )}
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-700 font-black text-lg shadow-inner">
          {appointment.user.name ? appointment.user.name.charAt(0).toUpperCase() : "@"}
        </div>
        <div>
          <p className="font-bold text-gray-900 text-lg leading-tight">
            {appointment.user.name || "Cliente sin nombre"}
          </p>
          <p className="text-gray-500 text-sm font-medium mt-0.5">{serviceName}</p>
        </div>
      </div>

      {!isCompleted && (
        <div className="mt-auto pt-2 flex gap-3">
          <form action={completeAppointment} className="flex-1">
            <input type="hidden" name="orderId" value={appointment.id} />
            <button type="submit" className="w-full bg-indigo-50 text-indigo-700 font-bold py-3 rounded-xl hover:bg-indigo-100 active:scale-95 transition-all text-sm flex items-center justify-center gap-2">
              <svg fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
              Completar
            </button>
          </form>
          
          <form action={cancelAppointment} className="flex-1">
            <input type="hidden" name="orderId" value={appointment.id} />
            <button type="submit" className="w-full bg-red-50 text-red-700 font-bold py-3 rounded-xl hover:bg-red-100 active:scale-95 transition-all text-sm flex items-center justify-center gap-2">
              <svg fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              Cancelar
            </button>
          </form>
        </div>
      )}
    </div>
  );
}