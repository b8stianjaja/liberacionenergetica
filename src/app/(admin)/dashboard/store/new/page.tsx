'use client';

import { useActionState, useEffect } from 'react';
import { createProduct } from './actions';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewProductPage() {
  const router = useRouter();
  // useActionState maneja el estado del formulario automáticamente
  const [state, formAction, isPending] = useActionState(createProduct, {});

  // Redirección elegante cuando el estado cambia a success
  useEffect(() => {
    if (state.success) {
      router.push('/dashboard/store');
    }
  }, [state, router]);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-gray-900">Nuevo Elemento</h1>
        <Link href="/dashboard/store" className="text-indigo-600 font-bold hover:underline">&larr; Volver</Link>
      </div>

      {state.error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 font-bold">
          {state.error}
        </div>
      )}

      <form action={formAction} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-8">
        {/* ... [Mantén tus inputs aquí igual] ... */}
        
        <button 
          type="submit" 
          disabled={isPending}
          className="w-full bg-indigo-600 text-white font-bold p-4 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-all active:scale-95"
        >
          {isPending ? 'Procesando...' : 'Guardar y Publicar'}
        </button>
      </form>
    </div>
  );
}