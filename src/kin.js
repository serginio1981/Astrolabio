/* ── Kin maya: Dreamspell / Sincronario de las 13 Lunas ─────────────── */
// Cuenta de José Argüelles, no el Tzolk'in tradicional (correlación GMT).
// Ancla: 21/12/2012 = Kin 207 (Mano Cristal Azul). El 29 de febrero no tiene Kin
// (Hunab Ku 0.0), así que no cuenta al medir la distancia en días.
const KIN_ANCLA = { y: 2012, mo: 12, d: 21, kin: 207 };

// [nombre, color masculino, color femenino según el género del sello]
const KIN_SELLOS = [
  ['Dragón', 'Rojo', 'm'], ['Viento', 'Blanco', 'm'], ['Noche', 'Azul', 'f'], ['Semilla', 'Amarillo', 'f'],
  ['Serpiente', 'Rojo', 'f'], ['Enlazador de Mundos', 'Blanco', 'm'], ['Mano', 'Azul', 'f'], ['Estrella', 'Amarillo', 'f'],
  ['Luna', 'Rojo', 'f'], ['Perro', 'Blanco', 'm'], ['Mono', 'Azul', 'm'], ['Humano', 'Amarillo', 'm'],
  ['Caminante del Cielo', 'Rojo', 'm'], ['Mago', 'Blanco', 'm'], ['Águila', 'Azul', 'f'], ['Guerrero', 'Amarillo', 'm'],
  ['Tierra', 'Rojo', 'f'], ['Espejo', 'Blanco', 'm'], ['Tormenta', 'Azul', 'f'], ['Sol', 'Amarillo', 'm'],
];
// [masculino, femenino]
const KIN_TONOS = [
  ['Magnético', 'Magnética'], ['Lunar', 'Lunar'], ['Eléctrico', 'Eléctrica'], ['Autoexistente', 'Autoexistente'],
  ['Entonado', 'Entonada'], ['Rítmico', 'Rítmica'], ['Resonante', 'Resonante'], ['Galáctico', 'Galáctica'],
  ['Solar', 'Solar'], ['Planetario', 'Planetaria'], ['Espectral', 'Espectral'], ['Cristal', 'Cristal'], ['Cósmico', 'Cósmica'],
];
const KIN_FEM = { Rojo: 'Roja', Blanco: 'Blanca', Azul: 'Azul', Amarillo: 'Amarilla' };
const KIN_NOTA = "Sistema Dreamspell (Argüelles), no la cuenta Tzolk'in tradicional (correlación GMT)";

const esBisiesto = (y) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;

/* Días entre el ancla y la fecha, sin contar los 29 de febrero intermedios */
function diasDreamspell(y, mo, d) {
  const a = Date.UTC(KIN_ANCLA.y, KIN_ANCLA.mo - 1, KIN_ANCLA.d), b = Date.UTC(y, mo - 1, d);
  const lo = Math.min(a, b), hi = Math.max(a, b);
  let bisiestos = 0;
  for (let yy = new Date(lo).getUTCFullYear(); yy <= new Date(hi).getUTCFullYear(); yy++) {
    const f = Date.UTC(yy, 1, 29);
    if (esBisiesto(yy) && f > lo && f <= hi) bisiestos++;
  }
  const dias = Math.round((b - a) / 86400000);
  return dias >= 0 ? dias - bisiestos : dias + bisiestos;
}

/* Kin de una fecha de calendario (y, mo 1-12, d), como fmtDate y localToUTC */
function kinMaya(y, mo, d) {
  if (mo === 2 && d === 29) return { kin: 0, sello: null, tono: null, nombre: 'Día fuera del tiempo (Hunab Ku 0.0, sin Kin)' };
  const kin = ((((KIN_ANCLA.kin + diasDreamspell(y, mo, d) - 1) % 260) + 260) % 260) + 1;
  const [sello, color, genero] = KIN_SELLOS[(kin - 1) % 20];
  const [tonoM, tonoF] = KIN_TONOS[(kin - 1) % 13];
  const colorG = genero === 'f' ? KIN_FEM[color] : color;
  return { kin, sello: `${sello} ${colorG}`, tono: tonoM, nombre: `${sello} ${genero === 'f' ? tonoF : tonoM} ${colorG}` };
}

if (typeof module !== 'undefined') module.exports = { kinMaya, diasDreamspell, KIN_NOTA };
