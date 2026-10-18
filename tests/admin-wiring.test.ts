import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

function source(path: string): string {
  return readFileSync(new URL('../' + path, import.meta.url), 'utf8');
}

const guardedPages = [
  'src/app/(admin)/dashboard/page.tsx',
  'src/app/(admin)/dashboard/agenda/page.tsx',
  'src/app/(admin)/dashboard/clients/page.tsx',
  'src/app/(admin)/dashboard/store/page.tsx',
  'src/app/(admin)/dashboard/store/new/page.tsx',
  'src/app/(admin)/dashboard/banners/page.tsx',
  'src/app/(admin)/dashboard/banners/new/page.tsx',
];

for (const page of guardedPages) {
  test(`la página ${page} exige requireAdmin en el servidor`, () => {
    const content = source(page);
    assert.match(content, /await requireAdmin\(\);/);
  });
}

for (const [path, functions] of [
  ['src/app/(admin)/dashboard/store/actions.ts', ['createProduct', 'toggleProductStatus', 'deleteProduct']],
  ['src/app/(admin)/dashboard/banners/actions.ts', ['createBanner', 'toggleBannerStatus', 'deleteBanner']],
] as const) {
  test(`el módulo ${path} declara 'use server' al comienzo`, () => {
    assert.match(source(path), /^['"]use server['"];/);
  });

  for (const functionName of functions) {
    test(`la acción ${functionName} exige requireAdmin al comenzar`, () => {
      const content = source(path);
      const pattern = new RegExp(`export async function ${functionName}\\([^\\n]*\\) \\{\\s*await requireAdmin\\(\\);`);
      assert.match(content, pattern);
    });
  }
}

for (const action of ['completeAppointment', 'cancelAppointment']) {
  test(`la acción ${action} de agenda exige requireAdmin`, () => {
    const content = source('src/app/(admin)/dashboard/agenda/page.tsx');
    const pattern = new RegExp(`async function ${action}\\([^\\n]*\\) \\{\\s*["']use server["'];\\s*await requireAdmin\\(\\);`);
    assert.match(content, pattern);
  });
}

test('el seed no sobrescribe contraseñas de usuarios existentes', () => {
  const content = source('prisma/seed.ts');
  assert.match(content, /if \(existing\) \{/);
  assert.doesNotMatch(content, /upsert\s*\(/);
});

test('solo queda el proxy de Next 16, no la convención middleware anterior', () => {
  assert.match(source('src/proxy.ts'), /export const proxy/);
});
