import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import BannerControls from "./BannerControls";
import { Cormorant_Garamond } from "next/font/google";

export const dynamic = 'force-dynamic';
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600"], display: "swap" });

export default async function BannersPage() {
  const banners = await prisma.banner.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white/60 backdrop-blur-xl p-8 rounded-[2rem] border-silver-real shadow-[0_10px_30px_rgba(0,0,0,0.02)] gap-6">
        <div>
          <h1 className={`text-3xl md:text-4xl text-silver-shimmer tracking-wide mb-1 ${cormorant.className}`}>Transmisiones</h1>
          <p className="text-zinc-500 text-[10px] font-black tracking-[0.2em] uppercase">Gestión de Carrusel Astral</p>
        </div>
        <Link href="/dashboard/banners/new" className="bg-gradient-to-b from-white to-zinc-50 border-silver-real px-8 py-3.5 rounded-full text-xs font-bold tracking-widest text-zinc-600 hover:text-zinc-900 hover:shadow-[0_5px_15px_rgba(161,161,170,0.2)] transition-all uppercase flex items-center gap-2 group">
          <span className="text-lg group-hover:rotate-90 transition-transform">+</span> Nueva Visión
        </Link>
      </div>

      <div className="bg-white/60 backdrop-blur-md rounded-[2.5rem] border-silver-real shadow-[0_8px_20px_rgba(0,0,0,0.02)] overflow-hidden">
        {banners.length === 0 ? (
          <div className="p-16 text-center text-zinc-400 text-xs font-bold tracking-[0.2em] uppercase">
            No hay visiones configuradas en este momento.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-zinc-200/50 bg-zinc-50/50">
                  <th className="p-6 font-black text-zinc-400 text-[10px] tracking-[0.2em] uppercase">Reflejo</th>
                  <th className="p-6 font-black text-zinc-400 text-[10px] tracking-[0.2em] uppercase">Invocación</th>
                  <th className="p-6 font-black text-zinc-400 text-[10px] tracking-[0.2em] uppercase text-right">Ritual</th>
                </tr>
              </thead>
              <tbody>
                {banners.map((banner) => (
                  <tr key={banner.id} className="border-b border-zinc-100 hover:bg-zinc-50/50 transition-colors">
                    <td className="p-6">
                      <div className="relative w-40 h-20 rounded-xl overflow-hidden bg-gradient-to-br from-zinc-100 to-zinc-200 border border-white shadow-inner">
                        <Image src={banner.imageUrl} alt={banner.title} fill className="object-cover" sizes="160px" />
                      </div>
                    </td>
                    <td className="p-6">
                      <p className={`text-xl text-zinc-800 ${cormorant.className}`}>{banner.title}</p>
                      <p className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase mt-1">{banner.subtitle || 'Silencio'}</p>
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