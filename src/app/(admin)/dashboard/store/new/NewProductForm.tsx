'use client';

import { useState, useTransition } from 'react';
import { createProduct } from '../actions'; 
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Category = { id: string; name: string };

export default function NewProductForm({ initialCategories }: { initialCategories: Category[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  
  const [productType, setProductType] = useState('PHYSICAL');
  const [isNewCategory, setIsNewCategory] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      try {
        const result = await createProduct(null, formData);
        
        if (result?.error) {
          setError(result.error);
        } else if (result?.success) {
          router.push('/dashboard/store');
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
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Nuevo Elemento</h1>
        <Link href="/dashboard/store" className="px-5 py-2.5 rounded-xl bg-gray-100 text-gray-600 font-bold hover:bg-gray-200 transition-colors">
          Cancelar
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100 font-medium flex items-center gap-2">
          <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Nombre de Terapia o Producto</label>
              <input name="name" required className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none" placeholder="Ej: Lectura de Registros Akáshicos" />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Descripción</label>
              <textarea name="description" required rows={4} className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none outline-none" placeholder="Explica en qué consiste y sus beneficios..." />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Precio (CLP)</label>
                <input type="number" name="price" required min="0" className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none" placeholder="25000" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Naturaleza</label>
                <select name="type" value={productType} onChange={(e) => setProductType(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none font-medium">
                  <option value="SERVICE">Terapia (Servicio)</option>
                  <option value="PHYSICAL">Producto Físico</option>
                  <option value="DIGITAL">Producto Digital</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            
            <div className="bg-indigo-50/40 p-6 rounded-[2rem] border border-indigo-100/50 space-y-4">
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-bold text-indigo-900">Categoría del Catálogo</label>
                <button type="button" onClick={() => setIsNewCategory(!isNewCategory)} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-white px-3 py-1.5 rounded-lg border border-indigo-100 shadow-sm transition-all active:scale-95">
                  {isNewCategory ? 'Elegir Existente' : '+ Crear Nueva'}
                </button>
              </div>
              
              {isNewCategory ? (
                <div className="animate-in fade-in zoom-in-95 duration-200">
                  <input name="categoryName" required={isNewCategory} className="w-full bg-white border border-indigo-200 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none" placeholder="Ej: Amuletos de Protección" />
                </div>
              ) : (
                <div className="animate-in fade-in zoom-in-95 duration-200">
                  <select name="categoryId" className="w-full bg-white border border-indigo-200 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none">
                    <option value="">Sin Categoría Especial</option>
                    {initialCategories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </select>
                </div>
              )}
            </div>

            {productType === 'SERVICE' && (
              <div className="animate-in fade-in slide-in-from-left-2 duration-300">
                <label className="block text-sm font-bold text-gray-700 mb-2">Duración (Minutos)</label>
                <input type="number" name="duration" min="1" className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none" placeholder="Ej: 60" />
              </div>
            )}

            {productType === 'PHYSICAL' && (
              <div className="animate-in fade-in slide-in-from-left-2 duration-300">
                <label className="block text-sm font-bold text-gray-700 mb-2">Inventario Físico</label>
                <input type="number" name="stock" min="0" className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none" placeholder="Cantidad disponible" />
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Imagen o GIF Animado</label>
              <input 
                type="file" 
                name="image" 
                accept="image/jpeg, image/png, image/webp, image/gif" 
                className="w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-gray-900 file:text-white hover:file:bg-indigo-600 file:transition-colors file:cursor-pointer" 
              />
                </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-100">
          <button type="submit" disabled={isPending} className="w-full md:w-auto md:px-16 bg-gray-900 text-white font-bold py-4 rounded-2xl hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 shadow-xl flex items-center justify-center gap-2">
            {isPending ? 'Procesando...' : 'Publicar Elemento'}
          </button>
        </div>
      </form>
    </div>
  );
}