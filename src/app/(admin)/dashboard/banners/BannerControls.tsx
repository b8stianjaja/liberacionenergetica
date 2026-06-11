'use client';

import { useTransition } from 'react';
import { toggleBannerStatus, deleteBanner } from './actions';

export default function BannerControls({ id, isActive }: { id: string, isActive: boolean }) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(() => {
      toggleBannerStatus(id, isActive);
    });
  };

  const handleDelete = () => {
    if (confirm('¿Estás seguro de que deseas eliminar este banner permanentemente?')) {
      startTransition(() => {
        deleteBanner(id);
      });
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button 
        onClick={handleToggle}
        disabled={isPending}
        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
          isActive 
            ? 'bg-green-100 text-green-700 hover:bg-green-200' 
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        } disabled:opacity-50`}
      >
        {isPending ? '...' : isActive ? '👁️ Activo' : '🙈 Oculto'}
      </button>
      
      <button 
        onClick={handleDelete}
        disabled={isPending}
        className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl text-sm font-bold transition-colors disabled:opacity-50"
      >
        🗑️ Eliminar
      </button>
    </div>
  );
}