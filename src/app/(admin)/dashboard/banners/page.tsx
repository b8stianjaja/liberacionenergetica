import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import BannerControls from "./BannerControls";

export const dynamic = 'force-dynamic';

export default async function BannersPage() {
  const banners = await prisma.banner.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between bg-white/70 backdrop-blur-xl p-6 rounded-[2rem] border border-white/50 shadow-sm">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Promociones</h1>
          <p className="text-gray-500 font-medium mt-1">Gestiona los banners del carrusel principal.</p>
        </div>
        <Link href="/dashboard/banners/new" className="px-6 py-3 rounded-2xl bg-gray-900 text-white font-bold hover:bg-indigo-600 transition-colors shadow-lg active:scale-95 flex items-center gap-2">
          <span>+</span> Nuevo Banner
        </Link>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        {banners.length === 0 ? (
          <div className="p-12 text-center text-gray-500 font-medium">
            No hay banners configurados. Crea uno para activar el carrusel en la tienda.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="p-6 font-bold text-gray-500 text-sm">Vista Previa</th>
                  <th className="p-6 font-bold text-gray-500 text-sm">Contenido</th>
                  <th className="p-6 font-bold text-gray-500 text-sm text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {banners.map((banner) => (
                  <tr key={banner.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="p-6">
                      <div className="relative w-40 h-20 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                        <Image src={banner.imageUrl} alt={banner.title} fill className="object-cover" sizes="160px" />
                      </div>
                    </td>
                    <td className="p-6">
                      <p className="font-bold text-gray-900 text-lg">{banner.title}</p>
                      <p className="text-sm text-gray-500 font-medium">{banner.subtitle || 'Sin subtítulo'}</p>
                    </td>
                    <td className="p-6">
                      <div className="flex justify-end">
                        <BannerControls id={banner.id} isActive={banner.isActive} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}