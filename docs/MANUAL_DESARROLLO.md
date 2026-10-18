# Manual operativo de desarrollo — Liberación Energética

**Edición:** 0.1 · **Ámbito:** trabajo conjunto con GitHub · **Idioma:** español.  
**Principio:** una sola fuente de verdad para cada asunto: *el repositorio muestra qué está implementado; las decisiones aprobadas explican qué debe construirse; la evidencia de pruebas confirma qué funciona*. No convertir propuestas en funcionalidades existentes.

## 1. Producto y límites comprobados

**Decisión de producto aprobada (18-10-2026):** desarrollar una **plataforma integral** que cubra **web pública, agenda de sesiones, consultantes, tienda y administración**. Es el **alcance objetivo**, no una declaración de funcionalidades completadas. Toda ampliación debe mantener separadas las decisiones de negocio y la evidencia de implementación.

Proyecto web para presentar los servicios de Johanna Grandón y gestionar un catálogo/boutique y contenidos desde un panel administrativo. **En el código actual existen:** portada pública, secciones informativas, catálogo de productos dinámico, carrito local, acceso mediante credenciales, panel con resumen, agenda basada en pedidos, listado de clientes y administración de banners/productos. **No considerar operativos** el checkout, pagos, registro público ni reservas autoservicio: no hay rutas ni flujo completo para acreditarlo.

No incorporar afirmaciones de diagnóstico médico o resultados terapéuticos garantizados en contenidos. Los cambios de alcance comercial, agenda o tienda necesitan una decisión explícita antes de implementarse.

## 2. Mapa técnico mínimo

| Ubicación | Función |
| --- | --- |
| `src/app/(public)/` | Portada y estructura pública |
| `src/components/`, `src/context/` | Cabecera, carrito y estado local |
| `src/app/(admin)/` | Login y páginas administrativas |
| `src/app/(admin)/dashboard/**/actions.ts` | Operaciones que escriben en base de datos |
| `src/auth.ts`, `src/auth.config.ts`, `src/middleware.ts` | Autenticación y control de entrada |
| `prisma/schema.prisma`, `prisma.config.ts` | Modelo de datos y configuración PostgreSQL |
| `prisma/seed.ts` | Creación/actualización de administrador: operación sensible |
| `public/` | Imágenes y activos visuales |

Stack registrado: Next.js 16, React 19, TypeScript, NextAuth v5 beta, Prisma 7, PostgreSQL, Cloudinary, Tailwind. Usar **`package-lock.json`** mediante `npm ci`; no cambiar dependencias sin motivo demostrado. El repositorio no contiene migraciones versionadas ni pruebas automatizadas verificadas en la revisión inicial.

## 3. Orden obligatorio de prioridades

1. **P0 — Acceso y datos:** exigir privilegio `ADMIN` en cada vista administrativa *y* cada Server Action; nunca confiar solo en enlaces, interfaz o proxy. Revisar el alta/seed: no se permiten credenciales administrativas de respaldo conocidas. Evaluar y ejecutar rotación de claves reales fuera de GitHub.
2. **P1 — Flujos reales:** resolver el enlace `/checkout`, hoy sin ruta, **según una decisión de negocio** (pago integrado, solicitud, WhatsApp o deshabilitar acción). No fingir que hay compras funcionando.
3. **P1 — Verificación:** añadir casos de prueba mínimos de autorización y operaciones críticas, más un control reproducible (lint, TypeScript, build y tests si se incorporan). No afirmar que una compilación pasó sin ejecutarla.
4. **P1 — Datos:** establecer estrategia de migraciones y respaldo antes de cambiar el esquema o tocar producción. Revisar dinero (`Float`), estados, stock y zonas horarias según el flujo aprobado.
5. **P2 — Experiencia y ampliaciones:** accesibilidad, rendimiento de imágenes/animaciones, textos, agenda avanzada, tienda y experiencia cliente, solo después de asegurar la base.

El diagnóstico que justifica el orden está en [DIAGNOSTICO_2026-10-18.md](./DIAGNOSTICO_2026-10-18.md).

## 4. Contrato para cada incremento

Antes de tocar archivos, registrar en una issue o propuesta:

- **Objetivo:** un comportamiento comprobable, no una aspiración vaga.
- **Estado inicial:** rama, SHA, rutas afectadas y evidencia del defecto/requisito.
- **Alcance mínimo:** archivos y comportamiento que sí se modifican; exclusiones expresas.
- **Criterios de aceptación:** escenarios autorizados/no autorizados, error y caso normal.
- **Verificación:** comandos realmente ejecutados y resultados; pruebas pendientes identificadas.
- **Entrega:** rama de trabajo, PR revisable y checkpoint final. No fusionar automáticamente cambios críticos.

**Definición de terminado:** cambio pequeño y entendible, revisión del diff, permisos comprobados en servidor, pruebas correspondientes, ausencia de regresiones conocidas, instrucciones de despliegue/reversión cuando corresponda. Si falta evidencia, el estado es **pendiente de verificar**, nunca “terminado”.

## 5. Procedimiento exacto de trabajo

1. Revisar `main` remoto, PR abiertas, último SHA y archivos existentes; comprobar si otra persona trabajó entre sesiones.
2. Seleccionar **un** problema demostrado y su criterio de aceptación. Acordar cualquier decisión de negocio aún abierta.
3. Crear rama desde el último `main`; nunca experimentar directamente en `main`.
4. Implementar el cambio mínimo; no reestructurar archivos ajenos ni cambiar el modelo de datos como efecto secundario.
5. Revisar cambios y pasar el gate correspondiente. No utilizar datos reales de consultantes para pruebas ni imprimir secretos en logs.
6. Abrir PR con: propósito, evidencia, pruebas, riesgos, pasos de despliegue y reversión.
7. Actualizar checkpoint: `base_sha`, `head_sha`, URL de PR, estado de pruebas, pendientes y siguiente paso único.

**Estados admitidos:** `propuesto` → `en desarrollo` → `en revisión` → `verificado` → `integrado`. No saltar `verificado` si no hay evidencia.

## 6. Comandos de verificación local (PowerShell)

```powershell
git status --short
git branch --show-current
git log -1 --format="%h %s"
node --version
npm ci
npx prisma validate
npx tsc --noEmit
npm run lint
npm run build
```

Se requiere configuración local de entorno apropiada para validación Prisma y build; **no publicar valores de `.env`**. Un fallo por dependencia externa o falta de credenciales debe registrarse como no verificado, no como prueba satisfactoria. `npm run seed` altera datos y **no** forma parte de la validación básica. No ejecutar `prisma db push` ni migraciones sobre producción sin respaldo y plan aprobado.

## 7. Decisiones de producto todavía abiertas

- ¿La boutique permite pagar en línea, pedir cotización o derivar a WhatsApp?
- ¿Cómo nace una reserva pública y cómo se evitan horarios duplicados?
- ¿Habrá cuentas de clientes o solo cuentas administrativas?
- ¿Cuáles son los estados permitidos, medios de pago, políticas de privacidad y retención de datos?

No asumir respuestas a partir de elementos visuales. Priorizar la seguridad del sistema presente antes de construir estos flujos.

## 8. Instrucción compacta para nuestras próximas sesiones

> Trabaja sobre `b8stianjaja/liberacionenergetica`. Compara el estado real de `main`, PR y último SHA con el manual y diagnóstico. Elige el siguiente incremento prioritario **demostrado**; separa implementación real de ideas, evita rediseños no justificados y cambios en producción. Usa una rama y PR pequeños, valida con evidencia, declara expresamente lo que no pudiste probar y termina con checkpoint y un siguiente paso único.
