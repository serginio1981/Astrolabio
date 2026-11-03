// Ejecutar desde la raíz con: node --test
const test = require('node:test');
const assert = require('node:assert/strict');
const { kinMaya } = require('../src/kin.js');

test('1981-04-21 → Kin 88, Estrella Amarilla, tono Planetario', () => {
  assert.deepEqual(kinMaya(1981, 4, 21), { kin: 88, sello: 'Estrella Amarilla', tono: 'Planetario', nombre: 'Estrella Planetaria Amarilla' });
});

test('2006-09-21 → Kin 6, Enlazador de Mundos Blanco, tono Rítmico', () => {
  assert.deepEqual(kinMaya(2006, 9, 21), { kin: 6, sello: 'Enlazador de Mundos Blanco', tono: 'Rítmico', nombre: 'Enlazador de Mundos Rítmico Blanco' });
});

test('2012-12-21 (ancla) → Kin 207, Mano Azul, tono Cristal', () => {
  assert.deepEqual(kinMaya(2012, 12, 21), { kin: 207, sello: 'Mano Azul', tono: 'Cristal', nombre: 'Mano Cristal Azul' });
});

test('2024-02-29 → sin Kin (Hunab Ku 0.0)', () => {
  const r = kinMaya(2024, 2, 29);
  assert.equal(r.kin, 0);
  assert.equal(r.nombre, 'Día fuera del tiempo (Hunab Ku 0.0, sin Kin)');
});

test('2024-02-28 y 2024-03-01 son Kines consecutivos (el 29/02 no cuenta)', () => {
  assert.equal(kinMaya(2024, 3, 1).kin, kinMaya(2024, 2, 28).kin + 1);
});
