'use client';

import { useTransition } from 'react';
import { toggleProductStatus, deleteProduct } from './actions';

export default function ProductControls({ id, isActive }: { id: string, isActive: boolean }) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => startTransition(async () => { await toggleProductStatus(id, isActive); });
  const handleDelete = () => {
    if (confirm('¿Eliminar permanentemente? Si ya ha sido vendido, el sistema bloqueará la eliminación para no romper tus finanzas. Se recomienda usar el botón del ojo para ocultarlo.')) {
      startTransition(async () => {
        const res = await deleteProduct(id);
        if (res?.error) alert(res.error);
      });
    }
  };

  return (
    <div className="flex flex-col gap-2 relative z-20">
      <button onClick={handleToggle} disabled={isPending} className={`p-2.5 rounded-xl shadow-lg backdrop-blur-md border transition-all ${isActive ? 'bg-white/90 text-gray-600 border-white/50' : 'bg-gray-900/90 text-white border-gray-800'}`}>
        {isActive ? '👁️' : '🙈'}
      </button>
      <button onClick={handleDelete} disabled={isPending} className="p-2.5 rounded-xl shadow-lg backdrop-blur-md bg-white/90 text-red-500 border border-red-100 hover:bg-red-50">
        🗑️
      </button>
    </div>
  );
}