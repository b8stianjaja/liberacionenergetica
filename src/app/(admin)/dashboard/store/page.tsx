'use client';

import { useState } from 'react';
import { createProduct } from './actions';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Importante para redirección segura

export default function NewProductPage() {
  const router = useRouter();
  const [productType, setProductType] = useState('PHYSICAL');
  const [isPending, setIsPending] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Generar vista previa
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (formData: FormData) => {
    setIsPending(true);
    setErrorMessage('');
    
    const result = await createProduct(formData);
    
    if (result.success) {
      // Redirección segura desde el cliente
      router.push('/dashboard/store');
    } else {
      setErrorMessage(result.error || 'Ocurrió un error inesperado');
      setIsPending(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Nuevo Elemento</h1>
        <Link href="/dashboard/store" className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors">
          &larr; Volver a la Tienda
        </Link>
      </div>

      {errorMessage && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl font-medium border border-red-100">
          {errorMessage}
        </div>
      )}

      <form action={handleSubmit} className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-8">
        
        {/* TIPO DE PRODUCTO */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-3">Tipo de Elemento</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

        {/* IMAGEN DEL PRODUCTO (Con vista previa) */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Imagen Destacada</label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-2xl hover:border-indigo-400 transition-colors bg-gray-50 relative overflow-hidden group">
            
            {imagePreview ? (
               <div className="relative w-full max-w-sm aspect-[4/3] rounded-xl overflow-hidden">
                 <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                 <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white font-bold bg-black/50 px-4 py-2 rounded-full">Cambiar</span>
                 </div>
                 <input id="image" name="image" type="file" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*" />
               </div>
            ) : (
              <div className="space-y-1 text-center relative z-10 pointer-events-none">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="flex text-sm text-gray-600 justify-center">
                  <span className="font-medium text-indigo-600">Sube un archivo o arrástralo</span>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, WEBP hasta 10MB</p>
              </div>
            )}
            
            {/* Input oculto si no hay imagen (cubre todo el div) */}
            {!imagePreview && (
              <input id="image" name="image" type="file" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*" />
            )}
          </div>
        </div>

        {/* RESTO DE DATOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-700 mb-2">Nombre del Elemento</label>
            <input type="text" name="name" required placeholder="Ej: Pulsera de Amatista" className="w-full border border-gray-200 p-3.5 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all" />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Precio (CLP)</label>
            <input type="number" name="price" required min="0" placeholder="0" className="w-full border border-gray-200 p-3.5 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all" />
          </div>

          {productType === 'PHYSICAL' && (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Stock Inicial</label>
              <input type="number" name="stock" min="0" defaultValue="1" className="w-full border border-gray-200 p-3.5 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all" />
            </div>
          )}

          {productType === 'SERVICE' && (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Duración (Minutos)</label>
              <input type="number" name="duration" min="15" step="15" placeholder="60" className="w-full border border-gray-200 p-3.5 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all" />
            </div>
          )}

          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-700 mb-2">Descripción</label>
            <textarea name="description" required rows={4} placeholder="Describe los beneficios y detalles..." className="w-full border border-gray-200 p-3.5 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all resize-none"></textarea>
          </div>
        </div>

        <button type="submit" disabled={isPending} className="w-full bg-indigo-600 text-white font-bold p-4 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-all active:scale-95 flex justify-center items-center gap-2">
          {isPending ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Procesando y subiendo...
            </>
          ) : 'Guardar y Publicar'}
        </button>
      </form>
    </div>
  );
}