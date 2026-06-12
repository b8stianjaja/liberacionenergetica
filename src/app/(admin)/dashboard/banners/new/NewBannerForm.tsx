'use client';

import { useState, useTransition } from 'react';
import { createBanner } from '../actions';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewBannerForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      try {
        const result = await createBanner(null, formData);
        
        if (result?.error) {
          setError(result.error);
        } else if (result?.success) {
          router.push('/dashboard/banners');
          router.refresh(); 
        }
      } catch (err) {
        setError('Ocurrió un problema de conexión. Inténtalo de nuevo.');
      }
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between bg-white/70 backdrop-blur-xl p-6 rounded-[2rem] border border-white/50 shadow-sm">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Nueva Visión</h1>
        <Link href="/dashboard/banners" className="px-5 py-2.5 rounded-xl bg-gray-100 text-gray-600 font-bold hover:bg-gray-200 transition-colors">
          Cancelar
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100 font-medium flex items-center gap-2">
          <span>⚠️</span> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-8">
        <div className="space-y-6 max-w-2xl">
          <div>
            <div className="flex justify-between items-end mb-2">
              <label className="block text-sm font-bold text-gray-700">Título Principal</label>
              <span className="text-[10px] text-gray-400 font-bold tracking-wider uppercase">Max 80 carácteres</span>
            </div>
            {/* SOLUCIÓN DE RAÍZ: maxLength evita que el usuario rompa el diseño desde el inicio */}
            <input 
              name="title" 
              required 
              maxLength={80}
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-500 transition-all outline-none" 
              placeholder="Ej: Renovación Cósmica" 
            />
          </div>

          <div>
            <div className="flex justify-between items-end mb-2">
              <label className="block text-sm font-bold text-gray-700">Subtítulo (Opcional)</label>
              <span className="text-[10px] text-gray-400 font-bold tracking-wider uppercase">Max 160 carácteres</span>
            </div>
            {/* SOLUCIÓN DE RAÍZ: maxLength */}
            <input 
              name="subtitle" 
              maxLength={160}
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-500 transition-all outline-none" 
              placeholder="Ej: Sumérgete en nuestras nuevas terapias de sonido" 
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Imagen de Fondo o GIF Animado</label>
            <div className="p-4 bg-fuchsia-50 border border-fuchsia-100 rounded-2xl">
              <input 
                type="file" 
                name="image" 
                required
                accept="image/jpeg, image/png, image/webp, image/gif" 
                className="w-full text-sm text-gray-600 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-gray-900 file:text-white hover:file:bg-fuchsia-600 file:transition-colors file:cursor-pointer" 
              />
              <p className="text-xs text-gray-500 mt-3 font-medium leading-relaxed">
                El diseño recortará automáticamente cualquier imagen al formato ideal en tiempo real. Aunque no requieres medidas exactas, sugerimos usar imágenes apaisadas para mejores resultados.
              </p>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-100">
          <button type="submit" disabled={isPending} className="w-full md:w-auto md:px-16 bg-gray-900 text-white font-bold py-4 rounded-2xl hover:bg-fuchsia-600 disabled:opacity-50 transition-all active:scale-95 shadow-xl">
            {isPending ? 'Procesando...' : 'Publicar Banner'}
          </button>
        </div>
      </form>
    </div>
  );
}