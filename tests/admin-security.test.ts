import test from 'node:test';
import assert from 'node:assert/strict';

import { hasCurrentAdminAccess, isAdminSession } from '../src/lib/admin-access';
import { readAdminSeedConfig } from '../prisma/admin-seed-config';

test('solo el rol exacto ADMIN pasa el filtro preliminar', () => {
  assert.equal(isAdminSession(null), false);
  assert.equal(isAdminSession({}), false);
  assert.equal(isAdminSession({ user: null }), false);
  assert.equal(isAdminSession({ user: { id: '1', role: 'CUSTOMER' } }), false);
  assert.equal(isAdminSession({ user: { id: '1', role: 'admin' } }), false);
  assert.equal(isAdminSession({ user: { id: '1', role: 'ADMIN' } }), true);
});

test('una sesión no autorizada jamás consulta los roles de la base de datos', async () => {
  let calls = 0;
  const load = async () => { calls++; return 'ADMIN'; };
  assert.equal(await hasCurrentAdminAccess(null, load), false);
  assert.equal(await hasCurrentAdminAccess({ user: { role: 'ADMIN' } }, load), false);
  assert.equal(await hasCurrentAdminAccess({ user: { id: 'user', role: 'CUSTOMER' } }, load), false);
  assert.equal(calls, 0);
});

test('la autorización usa el rol vigente de la base de datos, no solo el JWT', async () => {
  const admin = { user: { id: 'user', role: 'ADMIN' } };
  const seen: string[] = [];
  const check = (role: string | null) => hasCurrentAdminAccess(admin, async (id) => {
    seen.push(id);
    return role;
  });
  assert.equal(await check('ADMIN'), true);
  assert.equal(await check('CUSTOMER'), false);
  assert.equal(await check(null), false);
  assert.deepEqual(seen, ['user', 'user', 'user']);
});

test('no admite semillas administrativas sin credenciales ni con claves débiles', () => {
  assert.throws(() => readAdminSeedConfig({}), /ADMIN_USERNAME/);
  assert.throws(() => readAdminSeedConfig({ ADMIN_USERNAME: 'admin' }), /ADMIN_PASSWORD/);
  assert.throws(() => readAdminSeedConfig({ ADMIN_USERNAME: 'admin', ADMIN_PASSWORD: 'admin1234' }), /ADMIN_PASSWORD/);
  assert.throws(() => readAdminSeedConfig({ ADMIN_USERNAME: 'ab', ADMIN_PASSWORD: 'una_clave_larga' }), /ADMIN_USERNAME/);
  assert.throws(() => readAdminSeedConfig({ ADMIN_USERNAME: 'admin', ADMIN_PASSWORD: ' contrasena-segura-2026 ' }), /ADMIN_PASSWORD/);
  assert.deepEqual(
    readAdminSeedConfig({ ADMIN_USERNAME: ' johanna ', ADMIN_PASSWORD: 'clave-larga-para-pruebas' }),
    { adminUsername: 'johanna', adminPassword: 'clave-larga-para-pruebas' },
  );
});
