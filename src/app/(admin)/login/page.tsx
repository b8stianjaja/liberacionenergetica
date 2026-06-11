'use client';

import { useActionState } from 'react';
import { authenticate } from './actions';

export default function LoginPage() {
  // En React 19, useActionState reemplaza a useFormState
  const [errorMessage, formAction, isPending] = useActionState(authenticate, undefined);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <form 
        action={formAction} 
        className="w-full max-w-md bg-white p-8 rounded-3xl shadow-lg border border-gray-100"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-gray-900 mb-2">Bienvenido</h1>
          <p className="text-gray-500">Ingresa tus credenciales para continuar</p>
        </div>
        
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Usuario
            </label>
            <input 
              type="text" 
              name="username" 
              required 
              placeholder="tu_usuario"
              className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Contraseña
            </label>
            <input 
              type="password" 
              name="password" 
              required 
              placeholder="••••••••"
              className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
            />
          </div>

          <button 
            type="submit" 
            disabled={isPending}
            className="w-full bg-indigo-600 text-white font-bold p-4 rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
          >
            {isPending ? 'Verificando...' : 'Iniciar Sesión'}
          </button>
        </div>

        {errorMessage && (
          <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm text-center font-medium border border-red-100">
            {errorMessage}
          </div>
        )}
      </form>
    </div>
  );
}