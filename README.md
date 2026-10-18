# Liberación Energética

Web de presentación de terapias y boutique de Johanna Grandón, con panel administrativo para productos, banners, clientes y agenda basada en pedidos.

**Estado:** base de código existente bajo revisión técnica. El carrito es local; el pago en línea y las reservas públicas **no deben anunciarse como funcionales** hasta que se implementen y verifiquen. Antes de desplegar nuevas funciones, resolver los hallazgos de autorización recogidos en la auditoría.

- [Manual operativo de desarrollo](./docs/MANUAL_DESARROLLO.md)
- [Diagnóstico inicial del repositorio (2026-10-18)](./docs/DIAGNOSTICO_2026-10-18.md)

## Stack existente

Next.js 16 · React 19 · TypeScript · Prisma 7 · PostgreSQL · NextAuth (Credentials) · Cloudinary · Tailwind CSS.

## Verificación local

Usar Node.js compatible con Next.js 16 y un archivo de entorno **local no versionado** con las variables requeridas por el entorno. No ejecutar semillas ni modificar la base de datos de producción durante la revisión.

```powershell
npm ci
npx prisma validate
npx tsc --noEmit
npm run lint
npm run build
```

Estos comandos son el procedimiento propuesto; **la revisión inicial no los ejecutó**. El estado de sus resultados debe documentarse en cada PR.
