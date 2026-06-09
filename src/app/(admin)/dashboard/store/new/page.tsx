'use client';

import { useState } from 'react';
import { createProduct } from './actions';
import Link from 'next/link';

export default function NewProductPage() {
  const [productType, setProductType] = useState('PHYSICAL');
  const [isPending, setIsPending] = useState(false);

  // Wrapper function to handle loading state
  const handleSubmit = async (formData: FormData) => {
    setIsPending(true);
    try {
      await createProduct(formData);
    } catch (error) {
      console.error(error);
      setIsPending(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Nuevo Elemento</h1>
        <Link 
          href="/dashboard/store"
          className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
        >
          &larr; Volver a la Tienda
        </Link>
      </div>

      <form action={handleSubmit} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-8">
        
        {/* TIPO DE PRODUCTO */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-3">Tipo de Elemento</label>
          <div className="grid grid-cols-3 gap-4">
            {['PHYSICAL', 'DIGITAL', 'SERVICE'].map((type) => (
              <label 
                key={type} 
                className={`flex items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  productType === type 
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold' 
                    : 'border-gray-100 hover:border-indigo-200 text-gray-500 font-medium'
                }`}
              >
                <input 
                  type="radio" 
                  name="type" 
                  value={type} 
                  className="hidden"
                  onChange={(e) => setProductType(e.target.value)}
                  checked={productType === type}
                />
                {type === 'PHYSICAL' ? 'Producto Físico' : type === 'DIGITAL' ? 'Digital' : 'Servicio / Terapia'}
              </label>
            ))}
          </div>
        </div>

        {/* IMAGEN DEL PRODUCTO */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Imagen Destacada</label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-2xl hover:border-indigo-400 transition-colors bg-gray-50">
            <div className="space-y-1 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="flex text-sm text-gray-600 justify-center">
                <label htmlFor="image" className="relative cursor-pointer bg-transparent rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                  <span>Sube un archivo</span>
                  <input id="image" name="image" type="file" className="sr-only" accept="image/*" />
                </label>
                <p className="pl-1">o arrástralo aquí</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, WEBP hasta 10MB</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* NOMBRE */}
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-700 mb-2">Nombre del Elemento</label>
            <input 
              type="text" 
              name="name" 
              required 
              placeholder="Ej: Pulsera de Amatista"
              className="w-full border border-gray-200 p-3.5 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all"
            />
          </div>

          {/* PRECIO */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Precio (CLP)</label>
            <input 
              type="number" 
              name="price" 
              required 
              min="0"
              placeholder="0"
              className="w-full border border-gray-200 p-3.5 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all"
            />
          </div>

          {/* CAMPOS CONDICIONALES (STOCK / DURACIÓN) */}
          {productType === 'PHYSICAL' && (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Stock Inicial</label>
              <input 
                type="number" 
                name="stock" 
                min="0"
                defaultValue="1"
                className="w-full border border-gray-200 p-3.5 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all"
              />
            </div>
          )}

          {productType === 'SERVICE' && (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Duración (Minutos)</label>
              <input 
                type="number" 
                name="duration" 
                min="15"
                step="15"
                placeholder="60"
                className="w-full border border-gray-200 p-3.5 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all"
              />
            </div>
          )}

          {/* DESCRIPCIÓN */}
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-700 mb-2">Descripción</label>
            <textarea 
              name="description" 
              required 
              rows={4}
              placeholder="Describe los beneficios y detalles..."
              className="w-full border border-gray-200 p-3.5 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all resize-none"
            ></textarea>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isPending}
          className="w-full bg-gray-900 text-white font-bold p-4 rounded-xl hover:bg-indigo-600 disabled:opacity-50 transition-colors active:scale-95"
        >
          {isPending ? 'Creando Elemento...' : 'Guardar y Publicar'}
        </button>

      </form>
    </div>
  );
}