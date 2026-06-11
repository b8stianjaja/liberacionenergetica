'use client';

import { useActionState, useState } from 'react';
import { createProduct } from './actions';
import Link from 'next/link';

export default function NewProductPage() {
  const [state, formAction, isPending] = useActionState(createProduct, undefined);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Función para crear una vista previa instantánea de la imagen local
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    } else {
      setImagePreview(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animation-fade-in">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Nuevo Producto</h1>
          <p className="text-gray-500 mt-1">Añade un artículo físico o servicio a tu tienda.</p>
        </div>
        <Link 
          href="/dashboard/store"
          className="text-indigo-600 font-medium hover:bg-indigo-50 px-4 py-2 rounded-xl transition-colors"
        >
          ← Volver a la tienda
        </Link>
      </div>

      <form action={formAction} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8">
        
        {/* COLUMNA IZQUIERDA: Subida de Imagen */}
        <div className="w-full md:w-1/3 flex flex-col gap-4">
          <label className="block text-sm font-bold text-gray-700">Fotografía del Producto</label>
          
          <div className="relative group w-full aspect-square bg-gray-50 border-2 border-dashed border-gray-300 rounded-3xl overflow-hidden hover:border-indigo-500 hover:bg-indigo-50 transition-all cursor-pointer flex flex-col items-center justify-center">
            
            {/* Input invisible que cubre toda la caja */}
            <input 
              type="file" 
              name="image" 
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />

            {imagePreview ? (
              // Vista Previa
              <img 
                src={imagePreview} 
                alt="Vista previa" 
                className="w-full h-full object-cover"
              />
            ) : (
              // Estado Vacío
              <div className="text-center p-6 flex flex-col items-center">
                <svg className="w-12 h-12 text-gray-400 mb-3 group-hover:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                <span className="text-sm font-medium text-gray-500 group-hover:text-indigo-600">
                  Haz clic o arrastra una imagen
                </span>
              </div>
            )}
            
            {/* Overlay al hacer hover si ya hay imagen */}
            {imagePreview && (
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white font-medium text-sm px-4 py-2 bg-black/50 rounded-full backdrop-blur-sm">
                  Cambiar imagen
                </span>
              </div>
            )}
          </div>
        </div>

        {/* COLUMNA DERECHA: Datos del Producto */}
        <div className="w-full md:w-2/3 space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Nombre del Producto</label>
            <input 
              type="text" 
              name="name" 
              required 
              placeholder="Ej: Pulsera de Cuarzo Rosado"
              className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Descripción</label>
            <textarea 
              name="description" 
              required 
              rows={4}
              placeholder="Describe los beneficios y detalles de tu producto..."
              className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all resize-none"
            />
          </div>

          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Precio ($)</label>
              <input 
                type="number" 
                name="price" 
                required 
                min="0"
                step="0.01"
                placeholder="0.00"
                className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Stock Inicial</label>
              <input 
                type="number" 
                name="stock" 
                required 
                min="0"
                placeholder="Ej: 10"
                className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Tipo de Producto</label>
            <select 
              name="type" 
              className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all bg-white"
            >
              <option value="PHYSICAL">Producto Físico (Despacho)</option>
              <option value="DIGITAL">Servicio / Sesión / Digital</option>
            </select>
          </div>

          {state?.error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100 flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
              {state.error}
            </div>
          )}

          <div className="pt-4 border-t border-gray-100">
            <button 
              type="submit" 
              disabled={isPending}
              className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed transition-all flex justify-center items-center gap-2 active:scale-95"
            >
              {isPending ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creando y subiendo imagen...
                </>
              ) : (
                'Publicar Producto'
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}