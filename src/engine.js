/* ── Motor astronómico ─────────────────────────────────────────────── */
const D2R = Math.PI / 180, R2D = 180 / Math.PI;
const norm = (x) => ((x % 360) + 360) % 360;
const sind = (x) => Math.sin(x * D2R), cosd = (x) => Math.cos(x * D2R), tand = (x) => Math.tan(x * D2R);
const atan2d = (y, x) => Math.atan2(y, x) * R2D;
const asind = (x) => Math.asin(Math.max(-1, Math.min(1, x))) * R2D;
const angDist = (a, b) => { const d = Math.abs(norm(a) - norm(b)) % 360; return d > 180 ? 360 - d : d; };

const SIGNS = [
  { key: 'aries', name: 'Aries', glyph: '♈', el: 'fuego', mod: 'cardinal', ruler: 'mars' },
  { key: 'tauro', name: 'Tauro', glyph: '♉', el: 'tierra', mod: 'fijo', ruler: 'venus' },
  { key: 'geminis', name: 'Géminis', glyph: '♊', el: 'aire', mod: 'mutable', ruler: 'mercury' },
  { key: 'cancer', name: 'Cáncer', glyph: '♋', el: 'agua', mod: 'cardinal', ruler: 'moon' },
  { key: 'leo', name: 'Leo', glyph: '♌', el: 'fuego', mod: 'fijo', ruler: 'sun' },
  { key: 'virgo', name: 'Virgo', glyph: '♍', el: 'tierra', mod: 'mutable', ruler: 'mercury' },
  { key: 'libra', name: 'Libra', glyph: '♎', el: 'aire', mod: 'cardinal', ruler: 'venus' },
  { key: 'escorpio', name: 'Escorpio', glyph: '♏', el: 'agua', mod: 'fijo', ruler: 'pluto' },
  { key: 'sagitario', name: 'Sagitario', glyph: '♐', el: 'fuego', mod: 'mutable', ruler: 'jupiter' },
  { key: 'capricornio', name: 'Capricornio', glyph: '♑', el: 'tierra', mod: 'cardinal', ruler: 'saturn' },
  { key: 'acuario', name: 'Acuario', glyph: '♒', el: 'aire', mod: 'fijo', ruler: 'uranus' },
  { key: 'piscis', name: 'Piscis', glyph: '♓', el: 'agua', mod: 'mutable', ruler: 'neptune' },
];

const BODIES = [
  { key: 'sun', name: 'Sol', glyph: '☉', astro: 'Sun', w: 2, orbBonus: 2 },
  { key: 'moon', name: 'Luna', glyph: '☽', astro: 'Moon', w: 2, orbBonus: 2 },
  { key: 'mercury', name: 'Mercurio', glyph: '☿', astro: 'Mercury', w: 1 },
  { key: 'venus', name: 'Venus', glyph: '♀', astro: 'Venus', w: 1 },
  { key: 'mars', name: 'Marte', glyph: '♂', astro: 'Mars', w: 1 },
  { key: 'jupiter', name: 'Júpiter', glyph: '♃', astro: 'Jupiter', w: 1 },
  { key: 'saturn', name: 'Saturno', glyph: '♄', astro: 'Saturn', w: 1 },
  { key: 'uranus', name: 'Urano', glyph: '♅', astro: 'Uranus', w: 0.5 },
  { key: 'neptune', name: 'Neptuno', glyph: '♆', astro: 'Neptune', w: 0.5 },
  { key: 'pluto', name: 'Plutón', glyph: '♇', astro: 'Pluto', w: 0.5 },
  { key: 'node', name: 'Nodo Norte', glyph: '☊', w: 0, minor: true },
  { key: 'lilith', name: 'Lilith', glyph: '⚸', w: 0, minor: true },
  { key: 'asc', name: 'Ascendente', glyph: 'AC', w: 2, angle: true },
  { key: 'mc', name: 'Medio Cielo', glyph: 'MC', w: 1, angle: true },
];
const BODY = Object.fromEntries(BODIES.map((b) => [b.key, b]));

const ASPECTS = [
  { key: 'conj', name: 'Conjunción', glyph: '☌', angle: 0, orb: 8, nature: 'mixto' },
  { key: 'opp', name: 'Oposición', glyph: '☍', angle: 180, orb: 8, nature: 'tenso' },
  { key: 'tri', name: 'Trígono', glyph: '△', angle: 120, orb: 7, nature: 'armónico' },
  { key: 'sq', name: 'Cuadratura', glyph: '□', angle: 90, orb: 7, nature: 'tenso' },
  { key: 'sex', name: 'Sextil', glyph: '⚹', angle: 60, orb: 5, nature: 'armónico' },
  { key: 'qx', name: 'Quincuncio', glyph: '⚻', angle: 150, orb: 3, nature: 'menor' },
  { key: 'ssx', name: 'Semisextil', glyph: '⚺', angle: 30, orb: 2, nature: 'menor' },
];

const signOf = (lon) => SIGNS[Math.floor(norm(lon) / 30)];
function fmtDeg(lon, withSign = true) {
  const l = norm(lon), d = Math.floor(l % 30), mFull = (l % 30 - d) * 60;
  let m = Math.round(mFull), dd = d;
  if (m === 60) { m = 0; dd += 1; }
  return `${dd}°${String(m).padStart(2, '0')}′` + (withSign ? ' ' + signOf(l).name : '');
}

/* Convierte fecha/hora local en una zona IANA a instante UTC */
function tzOffsetMinutes(utcMs, tz) {
  const f = new Intl.DateTimeFormat('en-US', {
    timeZone: tz, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
  const p = Object.fromEntries(f.formatToParts(new Date(utcMs)).map((x) => [x.type, x.value]));
  const asUTC = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour % 24, +p.minute, +p.second);
  return Math.round((asUTC - utcMs) / 60000);
}
function localToUTC(y, mo, d, h, mi, zone) {
  const naive = Date.UTC(y, mo - 1, d, h, mi);
  if (typeof zone === 'number') return { ms: naive - zone * 60000, offset: zone };
  let off = tzOffsetMinutes(naive, zone);
  off = tzOffsetMinutes(naive - off * 60000, zone);
  return { ms: naive - off * 60000, offset: off };
}

function eclipticLon(bodyName, time) {
  const v = Astronomy.GeoVector(bodyName, time, true);
  const rot = Astronomy.Rotation_EQJ_ECT(time);
  return norm(Astronomy.SphereFromVector(Astronomy.RotateVector(rot, v)).lon);
}

/* Placidus: iteración por semiarcos */
function placidusCusp(ramc, eps, phi, frac, above) {
  let ra = above ? ramc + frac * 90 : ramc + 180 - frac * 90;
  for (let i = 0; i < 60; i++) {
    const lon = norm(atan2d(sind(ra), cosd(ra) * cosd(eps)));
    const dec = asind(sind(eps) * sind(lon));
    const x = tand(phi) * tand(dec);
    if (Math.abs(x) >= 1) return null;
    const ad = asind(x);
    const next = above ? ramc + frac * (90 + ad) : ramc + 180 - frac * (90 - ad);
    if (Math.abs(norm(next - ra + 180) - 180) < 1e-7) { ra = next; break; }
    ra = next;
  }
  return norm(atan2d(sind(ra), cosd(ra) * cosd(eps)));
}

function computeChart(input) {
  const { y, mo, d, h, mi, zone, lat, lon, unknownTime, houseSystem = 'placidus' } = input;
  const { ms, offset } = localToUTC(y, mo, d, unknownTime ? 12 : h, unknownTime ? 0 : mi, zone);
  const date = new Date(ms);
  const time = Astronomy.MakeTime(date);
  const T = (time.tt) / 36525;
  const pos = {};
  const tPrev = Astronomy.MakeTime(new Date(ms - 43200000)), tNext = Astronomy.MakeTime(new Date(ms + 43200000));
  for (const b of BODIES) {
    if (!b.astro) continue;
    const l = eclipticLon(b.astro, time);
    let speed = norm(eclipticLon(b.astro, tNext) - eclipticLon(b.astro, tPrev) + 180) - 180;
    pos[b.key] = { lon: l, speed, retro: speed < 0 && b.key !== 'sun' && b.key !== 'moon' };
  }
  const node = norm(125.04452 - 1934.136261 * T + 0.0020708 * T * T + (T * T * T) / 450000);
  pos.node = { lon: node, speed: -0.053, retro: true };
  const perigee = 83.3532465 + 4069.0137287 * T - 0.01032 * T * T - (T * T * T) / 80053;
  pos.lilith = { lon: norm(perigee + 180), speed: 0.111, retro: false };

  const eps = 23.4392911 - 0.0130042 * T - 1.64e-7 * T * T;
  let houses = null, asc = null, mc = null, houseNote = null, usedSystem = houseSystem;
  if (!unknownTime) {
    const gast = Astronomy.SiderealTime(time);
    const ramc = norm(gast * 15 + lon);
    mc = norm(atan2d(sind(ramc), cosd(ramc) * cosd(eps)));
    asc = norm(atan2d(cosd(ramc), -(sind(ramc) * cosd(eps) + tand(lat) * sind(eps))));
    pos.asc = { lon: asc, speed: 0 };
    pos.mc = { lon: mc, speed: 0 };
    if (houseSystem === 'placidus') {
      const c11 = placidusCusp(ramc, eps, lat, 1 / 3, true), c12 = placidusCusp(ramc, eps, lat, 2 / 3, true);
      const c2 = placidusCusp(ramc, eps, lat, 2 / 3, false), c3 = placidusCusp(ramc, eps, lat, 1 / 3, false);
      if ([c11, c12, c2, c3].some((c) => c === null)) {
        usedSystem = 'equal';
        houseNote = 'Placidus no es calculable a esta latitud; se usan casas iguales.';
      } else {
        houses = [asc, c2, c3, norm(mc + 180), norm(c11 + 180), norm(c12 + 180), norm(asc + 180), norm(c2 + 180), norm(c3 + 180), mc, c11, c12];
      }
    }
    if (usedSystem === 'equal') houses = Array.from({ length: 12 }, (_, i) => norm(asc + 30 * i));
    if (usedSystem === 'whole') houses = Array.from({ length: 12 }, (_, i) => norm(Math.floor(asc / 30) * 30 + 30 * i));
  }
  for (const k in pos) pos[k].house = houses ? houseOf(pos[k].lon, houses) : null;
  return { input, utc: date, offset, pos, houses, asc, mc, houseSystem: usedSystem, houseNote, unknownTime, aspects: findAspects(pos, pos, false) };
}

function houseOf(lon, cusps) {
  for (let i = 0; i < 12; i++) {
    const a = cusps[i], b = cusps[(i + 1) % 12];
    const span = norm(b - a), off = norm(lon - a);
    if (off < span) return i + 1;
  }
  return 1;
}

function orbFor(asp, b1, b2, cross) {
  let o = asp.orb + Math.max(BODY[b1].orbBonus || 0, BODY[b2].orbBonus || 0) * (asp.nature === 'menor' ? 0 : 1);
  if (BODY[b1].minor || BODY[b2].minor || BODY[b1].angle || BODY[b2].angle) o = Math.min(o, asp.nature === 'menor' ? 1.5 : 4);
  if (cross) o *= 0.8;
  return o;
}

function findAspects(posA, posB, cross) {
  const out = [];
  const keysA = Object.keys(posA), keysB = Object.keys(posB);
  for (let i = 0; i < keysA.length; i++) {
    for (let j = cross ? 0 : i + 1; j < keysB.length; j++) {
      const a = keysA[i], b = keysB[j];
      if (!cross && ((a === 'asc' && b === 'mc') || (a === 'mc' && b === 'asc'))) continue;
      if ((a === 'node' && b === 'lilith') || (a === 'lilith' && b === 'node')) continue;
      const sep = angDist(posA[a].lon, posB[b].lon);
      for (const asp of ASPECTS) {
        const orb = Math.abs(sep - asp.angle), max = orbFor(asp, a, b, cross);
        if (orb <= max) {
          let applying = null;
          if (!cross) {
            const dt = 0.01;
            const sep2 = angDist(posA[a].lon + posA[a].speed * dt, posB[b].lon + posB[b].speed * dt);
            applying = Math.abs(sep2 - asp.angle) < orb;
          }
          out.push({ a, b, type: asp.key, orb, exact: orb < 1, applying, strength: 1 - orb / max });
          break;
        }
      }
    }
  }
  return out.sort((x, y) => x.orb - y.orb);
}

function balance(chart) {
  const el = { fuego: 0, tierra: 0, aire: 0, agua: 0 }, mod = { cardinal: 0, fijo: 0, mutable: 0 };
  const list = { fuego: [], tierra: [], aire: [], agua: [], cardinal: [], fijo: [], mutable: [] };
  for (const b of BODIES) {
    const p = chart.pos[b.key];
    if (!p || !b.w) continue;
    const s = signOf(p.lon);
    el[s.el] += b.w; mod[s.mod] += b.w;
    list[s.el].push(b.key); list[s.mod].push(b.key);
  }
  const hemi = { norte: 0, sur: 0, este: 0, oeste: 0 }, quad = [0, 0, 0, 0];
  if (chart.houses) {
    for (const b of BODIES) {
      const p = chart.pos[b.key];
      if (!p || b.angle || b.minor) continue;
      const hh = p.house;
      if (hh >= 1 && hh <= 6) hemi.norte++; else hemi.sur++;
      if (hh >= 10 || hh <= 3) hemi.este++; else hemi.oeste++;
      quad[Math.floor(((hh - 1) % 12) / 3)]++;
    }
  }
  return { el, mod, list, hemi, quad };
}

function midpoint(a, b) {
  const d = norm(b - a);
  return d <= 180 ? norm(a + d / 2) : norm(b + (360 - d) / 2);
}
