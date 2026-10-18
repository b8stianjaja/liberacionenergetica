# Diagnóstico técnico inicial — 18 de octubre de 2026

**Repositorio:** `b8stianjaja/liberacionenergetica` · **Rama observada:** `main`  
**HEAD observado:** `6dfe53203cac38306e34030912f1314eb52eb5d5` (commit “Full update”, 17-06-2026).  
**Método:** inspección estática del árbol y archivos obtenidos directamente de GitHub. **No** se ejecutaron build, pruebas, despliegue, acceso a BD ni auditoría de secretos históricos. No extrapolar este diagnóstico al estado real de una eventual instancia desplegada.

## Lo presente en el repositorio

- Web pública con secciones informativas, banners y listado dinámico de productos; carrito persistido en `localStorage`.
- Login mediante NextAuth con proveedor Credentials; PostgreSQL/Prisma; Cloudinary para imágenes.
- Panel con clientes, agenda alimentada por pedidos, catálogo, banners y resumen.
- Solo rama `main`, sin PR/issues en la consulta. No existe `.github/workflows/`, ni archivos de test ni carpeta de migraciones en el árbol inspeccionado. El último commit consultado registra **0 check runs y 0 status checks**.
- El `README.md` era el texto genérico de `create-next-app` y no describía este sistema.

## Hallazgos demostrados y prioridad

| Nivel | Evidencia | Consecuencia / criterio de cierre |
| --- | --- | --- |
| **P0** | `src/auth.config.ts`: `authorized` solo exige sesión en `/dashboard`; `src/app/(admin)/dashboard/page.tsx` solo verifica `session.user`; otras páginas consultan clientes/pedidos sin chequeo independiente del rol. | Requerir servidor + rol `ADMIN` al leer datos administrativos, incluidos accesos directos. Comprobar negativas de anónimo y cliente autenticado. |
| **P0** | `src/app/(admin)/dashboard/store/actions.ts`, `banners/actions.ts` y `agenda/page.tsx`: operaciones mutadoras sin autorización explícita dentro de la acción. | Validar autorización en **cada** acción antes de tocar BD/Cloudinary; probar sin sesión y con rol `CUSTOMER`. |
| **P0** | `prisma/seed.ts`: faltando `ADMIN_USERNAME` / `ADMIN_PASSWORD` usa credenciales predecibles; `upsert` restablece la clave al repetir seed. | Eliminar valores por defecto inseguros; exigir credenciales administradas. **Revisar/rotar claves del entorno real**; no conocemos su configuración. |
| **P1** | `src/components/CartDrawer.tsx` enlaza `/checkout`; el árbol no contiene `src/app/**/checkout/page.tsx`. | Decidir objetivo del carrito y reemplazar/eliminar el enlace roto hasta existir flujo comprobado. |
| **P1** | No se encuentran pruebas, workflows ni historial de ejecución para `main`. | Introducir smoke checks y tests de autorización antes de declarar el sistema listo para operar transacciones. |
| **P1** | `prisma/schema.prisma` contiene `Float` para importes; no hay carpeta de migraciones versionadas. | Definir representación monetaria/migraciones con diagnóstico de datos y estrategia reversible, sin tocar tablas existentes por intuición. |
| **P2** | Next.js 16 usa convención `proxy.ts`; el árbol aún conserva `src/middleware.ts`. | Migración de convención tras verificar comportamiento, **sin confundirla con autorización de servidor**. |

## Conclusión y primer incremento

**No afirmar que compras o reservas públicas están operativas.** Mantener `main` sin cambios hasta disponer de PR revisable y pruebas pertinentes. **Siguiente cambio recomendado:** reforzar rol administrador en las rutas administrativas y todas las operaciones mutadoras; incorporar tests negativos. Separar la eliminación del fallback inseguro del seed en el mismo ciclo de saneamiento, con un plan de rotación fuera del repositorio.

**No verificado:** estado del hosting, usuarios reales, ejecución de migraciones previas, seguridad de la instancia pública, copia de seguridad, rendimiento y resultado de `npm run build`.
