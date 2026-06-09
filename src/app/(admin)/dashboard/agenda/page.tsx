import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// SERVER ACTION: Marca una cita como completada en la base de datos
async function completeAppointment(formData: FormData) {
  "use server";
  const orderId = formData.get("orderId") as string;

  await prisma.order.update({
    where: { id: orderId },
    data: { status: "COMPLETED" },
  });

  revalidatePath("/dashboard/agenda");
}

export default async function AgendaPage() {
  // Buscamos todas las órdenes que tengan una fecha de reserva agendada
  const appointments = await prisma.order.findMany({
    where: {
      bookingDate: { not: null },
    },
    orderBy: { bookingDate: "asc" }, // Las más próximas primero
    include: {
      user: true, // Para obtener el nombre y correo del cliente
      items: {
        include: {
          product: true, // Para obtener el nombre del servicio (terapia)
        },
      },
    },
  });

  // Separamos las citas pendientes de las ya realizadas para no mezclar
  const pendingAppointments = appointments.filter((app) => app.status === "NEW" || app.status === "PROCESSING");
  const completedAppointments = appointments.filter((app) => app.status === "COMPLETED");

  return (
    <div className="space-y-8">
      {/* CABECERA */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900">Mi Agenda</h1>
        <p className="text-gray-500 mt-1">Tus próximas sesiones y terapias programadas.</p>
      </div>

      {/* CITAS PENDIENTES */}
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-4 px-2">Próximas Citas</h2>
        
        {pendingAppointments.length === 0 ? (
          <div className="bg-gray-50 rounded-2xl p-8 text-center border border-dashed border-gray-300">
            <p className="text-gray-500 font-medium">No tienes citas pendientes por ahora.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingAppointments.map((appointment) => (
              <AppointmentCard 
                key={appointment.id} 
                appointment={appointment} 
                isCompleted={false} 
              />
            ))}
          </div>
        )}
      </section>

      {/* CITAS REALIZADAS (Historial) */}
      {completedAppointments.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold text-gray-500 mb-4 px-2">Sesiones Realizadas</h2>
          <div className="space-y-4 opacity-75">
            {completedAppointments.map((appointment) => (
              <AppointmentCard 
                key={appointment.id} 
                appointment={appointment} 
                isCompleted={true} 
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// ==========================================
// Componente de Tarjeta de Cita (Diseño Móvil)
// ==========================================

function AppointmentCard({ appointment, isCompleted }: { appointment: any; isCompleted: boolean }) {
  // Formateador de fechas nativo de JavaScript (Muestra: "jueves, 15 de octubre - 10:30 AM")
  const dateFormatter = new Intl.DateTimeFormat("es-CL", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  
  const timeFormatter = new Intl.DateTimeFormat("es-CL", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const dateObj = new Date(appointment.bookingDate);
  const formattedDate = dateFormatter.format(dateObj);
  const formattedTime = timeFormatter.format(dateObj);

  // Extraemos el primer servicio de la orden (asumimos que agendan 1 terapia a la vez)
  const serviceName = appointment.items[0]?.product?.name || "Servicio no especificado";

  return (
    <div className={`flex flex-col bg-white rounded-2xl p-5 shadow-sm border transition-all ${
      isCompleted ? "border-gray-200 bg-gray-50" : "border-indigo-100"
    }`}>
      {/* Fecha y Hora Destacadas */}
      <div className="flex items-start justify-between border-b border-gray-100 pb-4 mb-4">
        <div>
          <p className="text-indigo-600 font-bold uppercase tracking-wide text-sm">
            {formattedDate}
          </p>
          <p className="text-3xl font-black text-gray-900 mt-1">{formattedTime}</p>
        </div>
        {isCompleted && (
          <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-lg">
            Realizada
          </span>
        )}
      </div>

      {/* Detalles del Cliente y Servicio */}
      <div className="space-y-2 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-700 font-bold">
            {appointment.user.name ? appointment.user.name.charAt(0).toUpperCase() : "@"}
          </div>
          <div>
            <p className="font-bold text-gray-900 text-lg">
              {appointment.user.name || "Cliente sin nombre"}
            </p>
            <p className="text-gray-500 text-sm">{serviceName}</p>
          </div>
        </div>
      </div>

      {/* Acción Rápida (Solo si no está completada) */}
      {!isCompleted && (
        <div className="mt-auto pt-2">
          <form action={completeAppointment}>
            <input type="hidden" name="orderId" value={appointment.id} />
            <button
              type="submit"
              className="w-full bg-indigo-50 text-indigo-700 font-bold py-3.5 rounded-xl hover:bg-indigo-100 hover:text-indigo-800 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircleIcon className="w-6 h-6" />
              <span>Marcar como Realizada</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

// ==========================================
// Iconos
// ==========================================

function CheckCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}