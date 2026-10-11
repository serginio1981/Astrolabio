/* ── Utilidades de interfaz ───────────────────────────────────────── */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const VS = '︎';
const gl = (key) => {
  const b = BODY[key];
  if (b.angle) return `<span class="mono" style="font-size:.78em;font-weight:600">${b.glyph}</span>`;
  return `<span class="gl">${b.glyph}${VS}</span>`;
};
const sgl = (sign) => `<span class="gl el-${sign.el}">${sign.glyph}${VS}</span>`;
const signTag = (lon) => { const s = signOf(lon); return `<span class="sg">${sgl(s)} <span class="mono">${fmtDeg(lon, false)}</span> ${s.name}</span>`; };
const pname = (key) => `<span class="pname">${gl(key)}${BODY[key].name}</span>`;
const ASP = Object.fromEntries(ASPECTS.map((a) => [a.key, a]));
const natCls = (n) => ({ 'armónico': 'harm', 'tenso': 'tense', 'menor': 'minor', 'mixto': 'mixto' }[n]);
const store = {
  get(k, d) { try { const v = localStorage.getItem('astrolabio.' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('astrolabio.' + k, JSON.stringify(v)); } catch (e) { /* sin almacenamiento */ } },
};
const normTxt = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
function fmtOffset(min) {
  const s = min < 0 ? '−' : '+', a = Math.abs(min), h = Math.floor(a / 60), m = a % 60;
  return `UTC${s}${h}${m ? ':' + String(m).padStart(2, '0') : ''}`;
}
function fmtCoord(lat, lon) {
  const f = (v, p, n) => { const a = Math.abs(v), d = Math.floor(a), m = Math.round((a - d) * 60); return `${d}°${String(m).padStart(2, '0')}′${v >= 0 ? p : n}`; };
  return `${f(lat, 'N', 'S')} ${f(lon, 'E', 'O')}`;
}
const fmtDate = (y, mo, d) => new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(Date.UTC(y, mo - 1, d)));
const withArticle = (key) => ({ sun: 'el Sol', moon: 'la Luna', node: 'el Nodo Norte', asc: 'el Ascendente', mc: 'el Medio Cielo' }[key] || BODY[key].name);

function dignityOf(key, signKey) {
  const d = DIGNITY[key];
  if (!d) return null;
  const opp = (k) => SIGNS[(SIGNS.findIndex((s) => s.key === k) + 6) % 12].key;
  if (d.dom.includes(signKey)) return { cls: 'dom', name: 'Domicilio' };
  if (d.exa.includes(signKey)) return { cls: 'exa', name: 'Exaltación' };
  if (d.dom.map(opp).includes(signKey)) return { cls: 'exi', name: 'Exilio' };
  if (d.exa.map(opp).includes(signKey)) return { cls: 'cai', name: 'Caída' };
  return null;
}

/* ── Pestañas ─────────────────────────────────────────────────────── */
const tabState = store.get('tabs', {});
function activate(group, tab, focus) {
  const list = $(`[role="tablist"][data-group="${group}"]`);
  $$('[role="tab"]', list).forEach((b) => {
    const on = b.dataset.tab === tab;
    b.setAttribute('aria-selected', on); b.tabIndex = on ? 0 : -1;
    if (on && focus) b.focus();
    if (on) b.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  });
  $$(`[role="tabpanel"][data-group="${group}"]`).forEach((p) => { p.hidden = p.dataset.panel !== tab; });
  tabState[group] = tab; store.set('tabs', tabState);
  if (group === 'main') { try { history.replaceState(null, '', '#' + tab); } catch (e) { /* sin historial */ } }
}
function setupTabs(group, fallback) {
  const list = $(`[role="tablist"][data-group="${group}"]`);
  const tabs = $$('[role="tab"]', list);
  list.addEventListener('click', (e) => { const b = e.target.closest('[role="tab"]'); if (b) activate(group, b.dataset.tab); });
  list.addEventListener('keydown', (e) => {
    const i = tabs.findIndex((b) => b.getAttribute('aria-selected') === 'true');
    let j = null;
    if (e.key === 'ArrowRight') j = (i + 1) % tabs.length;
    if (e.key === 'ArrowLeft') j = (i - 1 + tabs.length) % tabs.length;
    if (e.key === 'Home') j = 0;
    if (e.key === 'End') j = tabs.length - 1;
    if (j !== null) { e.preventDefault(); activate(group, tabs[j].dataset.tab, true); }
  });
  tabs.forEach((b) => { const panel = $(`[role="tabpanel"][data-group="${group}"][data-panel="${b.dataset.tab}"]`); if (panel) panel.dataset.printTitle = b.textContent.trim(); });
  const valid = tabs.map((b) => b.dataset.tab);
  activate(group, valid.includes(tabState[group]) ? tabState[group] : fallback);
}

/* ── Formularios de persona ───────────────────────────────────────── */
const EXAMPLES = [
  { id: 'ex-juanita', example: true, name: 'Juanita', date: '2006-09-21', time: '21:00', unknown: false, city: 'Popayán|Colombia' },
  { id: 'ex-sergio', example: true, name: 'Sergio', date: '1981-04-21', time: '02:00', unknown: false, city: 'Concepción|Chile' },
];
const findCity = (id) => CITIES.find((c) => `${c.name}|${c.country}` === id) || null;
let TZS = [];
try { TZS = Intl.supportedValuesOf('timeZone'); } catch (e) { /* navegador antiguo */ }
if (!TZS.length) TZS = [...new Set(CITIES.map((c) => c.tz))].sort();
const BROWSER_TZ = (() => { try { return Intl.DateTimeFormat().resolvedOptions().timeZone; } catch (e) { return 'UTC'; } })();
const placeSel = {};
const isExample = {};
const PERSON_LABEL = { n: null, a: { t: 'Persona A', c: 'var(--ring-a)' }, b: { t: 'Persona B', c: 'var(--ring-b)' } };

function personHTML(p) {
  const L = PERSON_LABEL[p];
  return `
  <div class="person-head">
    ${L ? `<span class="tag"><span class="dot" style="background:${L.c}"></span>${L.t}</span>` : '<span></span>'}
    <div class="actions">
      ${p !== 'n' ? `<button class="btn small" type="button" data-copy="${p}">Usar carta natal</button>` : ''}
      <select id="${p}-load" aria-label="Cargar persona guardada" style="width:auto;padding:5px 8px;font-size:.84rem"></select>
    </div>
  </div>
  <div class="field"><label for="${p}-name">Nombre</label><input type="text" id="${p}-name" autocomplete="off" placeholder="Nombre o apodo"></div>
  <div class="row2">
    <div class="field"><label for="${p}-date">Fecha</label><input type="date" id="${p}-date" min="1800-01-01" max="2199-12-31"></div>
    <div class="field"><label for="${p}-time">Hora local</label><input type="time" id="${p}-time"></div>
  </div>
  <label class="check"><input type="checkbox" id="${p}-unknown"> No sé la hora exacta</label>
  <div class="field place">
    <label for="${p}-place">Lugar de nacimiento</label>
    <input type="text" id="${p}-place" autocomplete="off" role="combobox" aria-expanded="false" aria-controls="${p}-sugg" aria-autocomplete="list" placeholder="Busca una ciudad">
    <ul class="suggest" id="${p}-sugg" role="listbox" hidden></ul>
  </div>
  <details class="manual" id="${p}-manual">
    <summary>¿Tu ciudad no aparece? Introduce coordenadas</summary>
    <div class="row3">
      <div class="field"><label for="${p}-lat">Latitud</label><input type="number" id="${p}-lat" step="0.0001" min="-90" max="90" placeholder="40.42"></div>
      <div class="field"><label for="${p}-lon">Longitud</label><input type="number" id="${p}-lon" step="0.0001" min="-180" max="180" placeholder="-3.70"></div>
      <div class="field"><label for="${p}-tz">Zona horaria</label><select id="${p}-tz">${TZS.map((t) => `<option>${esc(t)}</option>`).join('')}</select></div>
    </div>
    <p class="note" style="margin-top:6px">Latitud norte y longitud este en positivo; sur y oeste en negativo.</p>
  </details>`;
}

function refreshLoadSelects() {
  const saved = store.get('personas', []);
  for (const p of ['n', 'a', 'b']) {
    const sel = $(`#${p}-load`);
    if (!sel) continue;
    sel.innerHTML = `<option value="">Cargar…</option>` +
      (saved.length ? `<optgroup label="Guardadas">${saved.map((s, i) => `<option value="s${i}">${esc(s.name)}</option>`).join('')}</optgroup>` : '') +
      `<optgroup label="Ejemplos">${EXAMPLES.map((e, i) => `<option value="e${i}">${esc(e.name)} (ejemplo)</option>`).join('')}</optgroup>`;
  }
}

function citySearch(q) {
  const n = normTxt(q);
  if (!n) return [];
  const scored = [];
  for (const c of CITIES) {
    const name = normTxt(c.name), full = normTxt(`${c.name} ${c.country}`);
    let s = -1;
    if (name.startsWith(n)) s = 0; else if (name.includes(n)) s = 1; else if (full.includes(n)) s = 2;
    if (s >= 0) scored.push([s, c]);
  }
  return scored.sort((a, b) => a[0] - b[0]).slice(0, 12).map((x) => x[1]);
}

function setupPerson(p) {
  const host = $(`[data-person="${p}"]`);
  host.innerHTML = personHTML(p);
  if (p === 'n') host.classList.add('person');
  const input = $(`#${p}-place`), list = $(`#${p}-sugg`);
  let items = [], idx = -1;
  const close = () => { list.hidden = true; input.setAttribute('aria-expanded', 'false'); idx = -1; };
  const choose = (c) => {
    placeSel[p] = c; input.value = `${c.name}, ${c.country}`;
    $(`#${p}-tz`).value = c.tz; $(`#${p}-lat`).value = ''; $(`#${p}-lon`).value = '';
    close();
  };
  const draw = () => {
    list.innerHTML = items.map((c, i) => `<li role="option" id="${p}-opt-${i}" aria-selected="${i === idx}" data-i="${i}"><span>${esc(c.name)}</span><small>${esc(c.country)}</small></li>`).join('') ||
      '<li aria-disabled="true"><small>Sin resultados. Usa las coordenadas manuales.</small></li>';
    list.hidden = false; input.setAttribute('aria-expanded', 'true');
    if (idx >= 0) input.setAttribute('aria-activedescendant', `${p}-opt-${idx}`); else input.removeAttribute('aria-activedescendant');
  };
  input.addEventListener('input', () => { placeSel[p] = null; items = citySearch(input.value); idx = items.length ? 0 : -1; input.value.trim() ? draw() : close(); });
  input.addEventListener('keydown', (e) => {
    if (list.hidden) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); idx = Math.min(items.length - 1, idx + 1); draw(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); idx = Math.max(0, idx - 1); draw(); }
    else if (e.key === 'Enter' && idx >= 0) { e.preventDefault(); choose(items[idx]); }
    else if (e.key === 'Escape') close();
  });
  input.addEventListener('blur', () => setTimeout(close, 150));
  list.addEventListener('mousedown', (e) => e.preventDefault());
  list.addEventListener('click', (e) => { const li = e.target.closest('li[data-i]'); if (li) choose(items[+li.dataset.i]); });
  $(`#${p}-unknown`).addEventListener('change', (e) => { $(`#${p}-time`).disabled = e.target.checked; });
  $(`#${p}-load`).addEventListener('change', (e) => {
    const v = e.target.value; e.target.value = '';
    if (!v) return;
    const src = v[0] === 'e' ? EXAMPLES[+v.slice(1)] : store.get('personas', [])[+v.slice(1)];
    if (src) fillPerson(p, src);
  });
  host.addEventListener('input', (e) => { if (e.target.id !== `${p}-load`) isExample[p] = false; });
  $(`#${p}-tz`).value = BROWSER_TZ;
}

function rawPerson(p) {
  return {
    name: $(`#${p}-name`).value.trim(), date: $(`#${p}-date`).value, time: $(`#${p}-time`).value, unknown: $(`#${p}-unknown`).checked,
    city: placeSel[p] ? `${placeSel[p].name}|${placeSel[p].country}` : null, placeText: $(`#${p}-place`).value,
    lat: $(`#${p}-lat`).value, lon: $(`#${p}-lon`).value, tz: $(`#${p}-tz`).value, example: !!isExample[p],
  };
}
function fillPerson(p, r) {
  $(`#${p}-name`).value = r.name || '';
  $(`#${p}-date`).value = r.date || '';
  $(`#${p}-time`).value = r.time || '';
  $(`#${p}-unknown`).checked = !!r.unknown; $(`#${p}-time`).disabled = !!r.unknown;
  const c = r.city ? findCity(r.city) : null;
  placeSel[p] = c;
  $(`#${p}-place`).value = c ? `${c.name}, ${c.country}` : (r.placeText || '');
  $(`#${p}-lat`).value = r.lat || ''; $(`#${p}-lon`).value = r.lon || '';
  $(`#${p}-tz`).value = r.tz || (c ? c.tz : BROWSER_TZ);
  $(`#${p}-manual`).open = !!(r.lat && r.lon);
  isExample[p] = !!r.example;
}

function readPerson(p) {
  const r = rawPerson(p);
  const who = PERSON_LABEL[p] ? PERSON_LABEL[p].t + ': ' : '';
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(r.date);
  if (!m) return { error: `${who}falta la fecha de nacimiento.` };
  const y = +m[1], mo = +m[2], d = +m[3];
  if (y < 1800 || y > 2199) return { error: `${who}la fecha debe estar entre 1800 y 2199.` };
  let h = 12, mi = 0;
  if (!r.unknown) {
    const t = /^(\d{2}):(\d{2})/.exec(r.time);
    if (!t) return { error: `${who}falta la hora. Si no la sabes, marca «No sé la hora exacta».` };
    h = +t[1]; mi = +t[2];
  }
  let lat, lon, zone, placeLabel;
  if (r.lat !== '' && r.lon !== '') {
    lat = +r.lat; lon = +r.lon; zone = r.tz;
    if (!(Math.abs(lat) <= 90 && Math.abs(lon) <= 180)) return { error: `${who}las coordenadas no son válidas.` };
    placeLabel = r.placeText && !placeSel[p] ? r.placeText : 'Coordenadas manuales';
  } else {
    let c = placeSel[p];
    if (!c && r.placeText.trim()) {
      const typed = normTxt(r.placeText);
      c = CITIES.find((x) => normTxt(`${x.name}, ${x.country}`) === typed) || null;
      if (!c) { const found = citySearch(r.placeText.split(',')[0]); if (found.length) c = found[0]; }
    }
    if (!c) return { error: `${who}elige un lugar de la lista o introduce coordenadas.` };
    placeSel[p] = c; lat = c.lat; lon = c.lon; zone = c.tz; placeLabel = `${c.name}, ${c.country}`;
  }
  return { data: { name: r.name || 'Sin nombre', y, mo, d, h, mi, unknownTime: r.unknown, lat, lon, zone, placeLabel, example: r.example }, raw: r };
}

/* ── Rueda ────────────────────────────────────────────────────────── */
function spread(items, minSep) {
  const arr = items.map((x) => ({ ...x, d: x.lon })).sort((a, b) => a.lon - b.lon);
  const n = arr.length;
  if (n < 2) return arr;
  for (let it = 0; it < 80; it++) {
    let moved = false;
    arr.sort((a, b) => a.d - b.d);
    for (let i = 0; i < n; i++) {
      const A = arr[i], B = arr[(i + 1) % n];
      const gap = norm(B.d - A.d);
      if (gap < minSep) { const push = (minSep - gap) / 2 + 0.05; A.d = norm(A.d - push); B.d = norm(B.d + push); moved = true; }
    }
    if (!moved) break;
  }
  return arr;
}

function wheelSVG({ ref, houses, rings, aspects, bi }) {
  const C = 300, Z1 = 290, Z0 = 250;
  const aspR = 142, numR = bi ? 152 : 157;
  const ang = (lon) => (180 + lon - ref) * D2R;
  const P = (lon, r) => [(C + r * Math.cos(ang(lon))).toFixed(2), (C - r * Math.sin(ang(lon))).toFixed(2)];
  const L = (l1, r1, l2, r2, cls, extra = '') => { const [x1, y1] = P(l1, r1), [x2, y2] = P(l2, r2); return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${cls}" ${extra}/>`; };
  const T = (lon, r, txt, cls, title) => { const [x, y] = P(lon, r); return `<text x="${x}" y="${y}" class="${cls}" text-anchor="middle" dominant-baseline="central">${title ? `<title>${esc(title)}</title>` : ''}${txt}</text>`; };
  let s = `<svg class="wheel" viewBox="-34 -34 668 668" role="img" aria-label="Rueda zodiacal">`;
  s += `<circle cx="${C}" cy="${C}" r="${Z1}" class="disc"/>`;
  for (let i = 0; i < 12; i++) {
    const a1 = i * 30, a2 = a1 + 30, el = { fuego: 'fire', tierra: 'earth', aire: 'air', agua: 'water' }[SIGNS[i].el];
    const [ox1, oy1] = P(a1, Z1), [ox2, oy2] = P(a2, Z1), [ix2, iy2] = P(a2, Z0), [ix1, iy1] = P(a1, Z0);
    s += `<path class="${el} zs" d="M${ox1} ${oy1} A${Z1} ${Z1} 0 0 0 ${ox2} ${oy2} L${ix2} ${iy2} A${Z0} ${Z0} 0 0 1 ${ix1} ${iy1} Z"/>`;
    s += T(a1 + 15, 270, SIGNS[i].glyph + VS, `zg t${el}`, SIGNS[i].name);
  }
  for (let d = 0; d < 360; d++) s += L(d, Z0, d, Z0 - (d % 10 === 0 ? 7 : d % 5 === 0 ? 5 : 2.5), 'tick');
  s += `<circle cx="${C}" cy="${C}" r="${Z0}" class="ring strong"/>`;
  if (bi) s += `<circle cx="${C}" cy="${C}" r="206" class="ring"/><circle cx="${C}" cy="${C}" r="162" class="ring"/>`;
  else s += `<circle cx="${C}" cy="${C}" r="172" class="ring"/>`;
  s += `<circle cx="${C}" cy="${C}" r="${aspR}" class="ring strong"/>`;
  if (houses) {
    houses.forEach((c, i) => {
      const angular = i % 3 === 0;
      s += L(c, aspR, c, angular ? Z1 + 6 : Z0, angular ? 'cusp ang' : 'cusp');
      const mid = c + norm(houses[(i + 1) % 12] - c) / 2;
      s += T(mid, numR, i + 1, 'hn');
    });
    [['AC', 0], ['IC', 3], ['DC', 6], ['MC', 9]].forEach(([t, i]) => { s += T(houses[i], Z1 + 20, t, 'angl'); });
  }
  for (const a of aspects || []) {
    if (a.type === 'conj') continue;
    const cls = natCls(ASP[a.type].nature);
    const [x1, y1] = P(a.l1, aspR), [x2, y2] = P(a.l2, aspR);
    s += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="asp ${cls}" opacity="${(0.3 + 0.7 * a.strength).toFixed(2)}"/>`;
  }
  for (const ring of rings) {
    const sp = spread(ring.items, ring.minSep || 7.5);
    for (const it of sp) {
      const b = BODY[it.key], label = b.angle ? b.glyph : b.glyph + VS;
      s += L(it.lon, Z0, it.lon, Z0 - 9, `s${ring.cls}`, 'stroke-width="1.6"');
      s += L(it.lon, Z0 - 9, it.d, ring.r + 13, `lead s${ring.cls}`);
      s += T(it.d, ring.r, label, (b.angle ? 'angl ' : 'pg ') + 'r' + ring.cls, `${b.name} ${fmtDeg(it.lon)}${it.retro ? ' (retrógrado)' : ''}`);
      if (ring.degR) s += T(it.d, ring.degR, `${Math.floor(norm(it.lon) % 30)}°${it.retro ? '℞' : ''}`, `pd r${ring.cls}`);
    }
  }
  return s + '</svg>';
}
const ringItems = (pos, skipAngles) => Object.keys(pos).filter((k) => !(skipAngles && BODY[k].angle)).map((k) => ({ key: k, lon: pos[k].lon, retro: pos[k].retro }));
const legend = (extra = '') => `<div class="legend">${extra}<span><i style="border-color:var(--harm)"></i>Armónico</span><span><i style="border-color:var(--tense)"></i>Tenso</span><span><i style="border-color:var(--minor);border-top-style:dashed"></i>Menor</span></div>`;

/* ── Piezas compartidas ───────────────────────────────────────────── */
function chipsHTML(id) {
  const f = [['all', 'Todos'], ['harm', 'Armónicos'], ['tense', 'Tensos'], ['mixto', 'Conjunciones'], ['minor', 'Menores']];
  return `<div class="chips" id="${id}" role="group" aria-label="Filtrar aspectos">${f.map(([k, t], i) => `<button type="button" class="chip" data-f="${k}" aria-pressed="${i === 0}">${t}</button>`).join('')}</div>`;
}
function bindChips(id, onChange) {
  const box = $('#' + id);
  box.addEventListener('click', (e) => {
    const b = e.target.closest('.chip'); if (!b) return;
    $$('.chip', box).forEach((c) => c.setAttribute('aria-pressed', c === b));
    onChange(b.dataset.f);
  });
}
const aspFilter = (list, f) => (f === 'all' ? list : list.filter((a) => natCls(ASP[a.type].nature) === f));
const aspBadge = (a) => { const A = ASP[a.type]; return `<span class="badge ${natCls(A.nature)}"><span class="gl">${A.glyph}${VS}</span> ${A.name}</span>`; };
const orbTxt = (o) => { const d = Math.floor(o), m = Math.round((o - d) * 60); return `${d}°${String(m === 60 ? 59 : m).padStart(2, '0')}′`; };

function aspectGrid(rows, cols, lookup, triangular) {
  const head = (k) => `<th class="${BODY[k].angle ? 'ang' : ''}" scope="col" title="${BODY[k].name}">${BODY[k].angle ? BODY[k].glyph : BODY[k].glyph + VS}</th>`;
  let h = '<div class="grid-wrap"><table class="agrid"><thead><tr><th></th>' + (triangular ? cols.slice(0, -1) : cols).map(head).join('') + '</tr></thead><tbody>';
  rows.forEach((r, i) => {
    if (triangular && i === 0) return;
    h += `<tr>${head(r).replace('<th', '<th scope="row"').replace('scope="col"', '')}`;
    const cs = triangular ? cols.slice(0, -1) : cols;
    cs.forEach((c, j) => {
      if (triangular && j >= i) { h += '<td class="empty"></td>'; return; }
      const a = lookup(r, c);
      if (!a) { h += '<td></td>'; return; }
      const A = ASP[a.type];
      h += `<td title="${esc(`${BODY[r].name} ${A.name} ${BODY[c].name}, orbe ${orbTxt(a.orb)}`)}"><span class="cell c-${natCls(A.nature)}"><span class="gl">${A.glyph}${VS}</span><small>${Math.round(a.orb)}°</small></span></td>`;
    });
    h += '</tr>';
  });
  return h + '</tbody></table></div>';
}

function elementBars(bal) {
  const tot = Object.values(bal.el).reduce((a, b) => a + b, 0) || 1;
  const mt = Object.values(bal.mod).reduce((a, b) => a + b, 0) || 1;
  const bar = (label, v, t, cls, keys) => `<div class="bar"><span>${label}</span><div><div class="track"><div class="fill ${cls}" style="width:${(100 * v / t).toFixed(1)}%"></div></div><div class="who">${keys.map((k) => `${gl(k)}`).join(' ')}</div></div><span class="val">${Math.round(100 * v / t)}%</span></div>`;
  return {
    el: ['fuego', 'tierra', 'aire', 'agua'].map((e) => bar(cap(e), bal.el[e], tot, e, bal.list[e])).join(''),
    mod: ['cardinal', 'fijo', 'mutable'].map((m) => bar(cap(m), bal.mod[m], mt, '', bal.list[m])).join(''),
    tot, mt,
  };
}
const dominant = (o) => Object.entries(o).sort((a, b) => b[1] - a[1])[0][0];

/* ── Carta natal ──────────────────────────────────────────────────── */
let natal = null;
function summaryHTML(ch, data, extra = '') {
  const pill = (key, label) => {
    const p = ch.pos[key];
    if (!p) return `<div class="pillar"><div class="eyebrow">${label}</div><b class="muted">Sin hora</b></div>`;
    const s = signOf(p.lon);
    return `<div class="pillar"><div class="eyebrow">${label}</div><b>${sgl(s)} ${s.name} <span class="mono muted" style="font-weight:400;font-size:.8rem">${fmtDeg(p.lon, false)}</span></b></div>`;
  };
  const hs = { placidus: 'Placidus', equal: 'Casas iguales', whole: 'Signo entero' }[ch.houseSystem];
  return `
    <div class="section-title"><h2>${esc(data.name)} ${data.example ? '<span class="sample">Ejemplo</span>' : ''}</h2>${extra}</div>
    <div class="meta">
      <span>${fmtDate(data.y, data.mo, data.d)}${data.unknownTime ? ' · hora desconocida' : ` · ${String(data.h).padStart(2, '0')}:${String(data.mi).padStart(2, '0')} (${fmtOffset(ch.offset)})`}</span>
      <span>${esc(data.placeLabel)} · <span class="mono">${fmtCoord(data.lat, data.lon)}</span></span>
      ${ch.houses ? `<span>Casas: ${hs}</span>` : ''}
    </div>
    <div class="pillars">${pill('sun', 'Sol')}${pill('moon', 'Luna')}${pill('asc', 'Ascendente')}</div>`;
}

function renderNatal() {
  const { chart: ch, data } = natal;
  $('#natal-summary').innerHTML = summaryHTML(ch, data) + saveRowHTML('n');
  bindSaveRow('n');
  const notes = [];
  if (ch.unknownTime) notes.push('Sin hora de nacimiento no se calculan Ascendente ni casas, y la Luna puede variar hasta ±6° respecto a lo mostrado (calculado a mediodía).');
  if (ch.houseNote) notes.push(ch.houseNote);
  const noteHTML = notes.map((n) => `<p class="note">${n}</p>`).join('');

  // Rueda
  const major = ch.aspects.filter((a) => !BODY[a.a].minor && !BODY[a.b].minor);
  $('#n-rueda').innerHTML = `<div class="wheel-box">${wheelSVG({
    ref: ch.asc ?? 0, houses: ch.houses,
    rings: [{ items: ringItems(ch.pos, true), r: 222, degR: 194, cls: 'a', minSep: 7.5 }],
    aspects: major.map((a) => ({ l1: ch.pos[a.a].lon, l2: ch.pos[a.b].lon, type: a.type, strength: a.strength })),
  })}${legend()}${noteHTML}</div>`;

  // Planetas
  const rows = BODIES.filter((b) => ch.pos[b.key]).map((b) => {
    const p = ch.pos[b.key], s = signOf(p.lon), dg = dignityOf(b.key, s.key);
    const mov = b.angle ? '<span class="muted">—</span>' : (p.retro ? '<span class="badge retro">℞ Retrógrado</span>' : '<span class="badge">Directo</span>');
    return `<tr><td>${pname(b.key)}</td><td>${signTag(p.lon)}</td><td class="mono">${p.house ?? '—'}</td><td>${mov}</td>
      <td class="mono muted">${b.angle ? '' : `${p.speed >= 0 ? '+' : '−'}${Math.abs(p.speed).toFixed(p.speed > 2 || p.speed < -2 ? 1 : 3)}°/día`}</td>
      <td>${dg ? `<span class="badge ${dg.cls}">${dg.name}</span>` : ''}</td></tr>`;
  }).join('');
  $('#n-planetas').innerHTML = `<p class="panel-intro">Posición de cada astro en el zodiaco, la casa que ocupa y su movimiento aparente visto desde la Tierra. La dignidad indica si el planeta está en un signo afín (domicilio, exaltación) o incómodo (exilio, caída).</p>
    <div class="tbl-wrap"><table><thead><tr><th>Astro</th><th>Posición</th><th>Casa</th><th>Movimiento</th><th>Velocidad</th><th>Dignidad</th></tr></thead><tbody>${rows}</tbody></table></div>${noteHTML}`;

  // Casas
  if (!ch.houses) {
    $('#n-casas').innerHTML = `<div class="empty-state">Las casas dependen de la hora exacta de nacimiento. Añade la hora para verlas.</div>`;
  } else {
    const cards = ch.houses.map((c, i) => {
      const s = signOf(c), ruler = s.ruler, rp = ch.pos[ruler];
      const inside = BODIES.filter((b) => !b.angle && ch.pos[b.key] && ch.pos[b.key].house === i + 1);
      return `<article class="item"><h3><span class="mono muted" style="font-size:.9rem">${i + 1}</span> ${HOUSE_NAME[i]}</h3>
        <dl class="kv"><dt>Cúspide</dt><dd>${signTag(c)}</dd>
        <dt>Regente</dt><dd>${pname(ruler)} <span class="muted">en Casa ${rp.house}</span></dd>
        <dt>Planetas</dt><dd>${inside.length ? inside.map((b) => pname(b.key)).join(' ') : '<span class="muted">Ninguno</span>'}</dd></dl>
        <p class="note">${cap(HOUSE_THEME[i])}.</p></article>`;
    }).join('');
    $('#n-casas').innerHTML = `<p class="panel-intro">Cada casa es un área de la vida. El signo en la cúspide marca el tono; su planeta regente y los planetas que la ocupan dicen dónde se pone la energía.</p><div class="cols">${cards}</div>${noteHTML}`;
  }

  // Aspectos
  const keys = BODIES.filter((b) => ch.pos[b.key]).map((b) => b.key);
  const map = {}; ch.aspects.forEach((a) => { map[a.a + '|' + a.b] = a; map[a.b + '|' + a.a] = a; });
  $('#n-aspectos').innerHTML = `<p class="panel-intro">Los aspectos son ángulos entre astros. Los armónicos (trígono, sextil) facilitan; los tensos (cuadratura, oposición) generan conflicto y motivación. El orbe indica la distancia al ángulo exacto: cuanto menor, más se nota.</p>
    ${aspectGrid(keys, keys, (r, c) => map[r + '|' + c], true)}
    <div class="section-title"><h3>Lista de aspectos</h3>${chipsHTML('n-chips')}</div><div id="n-asp-list"></div>`;
  const drawList = (f) => {
    const list = aspFilter(ch.aspects, f);
    $('#n-asp-list').innerHTML = list.length ? `<div class="tbl-wrap"><table><thead><tr><th>Astros</th><th>Aspecto</th><th>Orbe</th><th>Fase</th></tr></thead><tbody>${list.map((a) => `
      <tr><td>${pname(a.a)} <span class="muted">·</span> ${pname(a.b)}</td><td>${aspBadge(a)}</td><td class="mono">${orbTxt(a.orb)}</td>
      <td class="muted">${a.applying === null || BODY[a.a].angle && BODY[a.b].angle ? '—' : a.applying ? 'Aplicativo' : 'Separativo'}</td></tr>`).join('')}</tbody></table></div>` : '<div class="empty-state">No hay aspectos de este tipo.</div>';
  };
  drawList('all'); bindChips('n-chips', drawList);

  // Equilibrio
  const bal = balance(ch), eb = elementBars(bal);
  const dEl = dominant(bal.el), dMod = dominant(bal.mod);
  const lacking = Object.entries(bal.el).filter(([, v]) => v / eb.tot < 0.1).map(([k]) => k);
  const yang = bal.el.fuego + bal.el.aire, yin = bal.el.tierra + bal.el.agua;
  const hemi = ch.houses ? `<article class="item"><h3>Hemisferios</h3>
      <div class="bars">
        <div class="bar"><span>Oriental</span><div class="track"><div class="fill" style="width:${(100 * bal.hemi.este / 10)}%"></div></div><span class="val">${bal.hemi.este}</span></div>
        <div class="bar"><span>Occidental</span><div class="track"><div class="fill" style="width:${(100 * bal.hemi.oeste / 10)}%"></div></div><span class="val">${bal.hemi.oeste}</span></div>
        <div class="bar"><span>Nocturno</span><div class="track"><div class="fill" style="width:${(100 * bal.hemi.norte / 10)}%"></div></div><span class="val">${bal.hemi.norte}</span></div>
        <div class="bar"><span>Diurno</span><div class="track"><div class="fill" style="width:${(100 * bal.hemi.sur / 10)}%"></div></div><span class="val">${bal.hemi.sur}</span></div>
      </div>
      <p class="note">${bal.hemi.este >= bal.hemi.oeste ? 'Predomina el hemisferio oriental: tiendes a decidir por ti y a iniciar.' : 'Predomina el hemisferio occidental: te defines mucho a través de los demás.'}
      ${bal.hemi.sur > bal.hemi.norte ? ' Mayoría por encima del horizonte: vida orientada hacia fuera y lo público.' : ' Mayoría bajo el horizonte: vida orientada hacia lo íntimo y personal.'}</p>
    </article>` : '';
  $('#n-equilibrio').innerHTML = `<p class="panel-intro">Reparto de los astros por elemento y modalidad. Sol, Luna y Ascendente cuentan doble; los planetas lentos, la mitad.</p>
    <div class="cols">
      <article class="item"><h3>Elementos</h3><div class="bars">${eb.el}</div><p class="note">${ELEMENT_TEXT[dEl]} ${lacking.map((l) => ELEMENT_LACK[l]).join(' ')}</p></article>
      <article class="item"><h3>Modalidades</h3><div class="bars">${eb.mod}</div><p class="note">${MODE_TEXT[dMod]}</p></article>
      <article class="item"><h3>Polaridad</h3><div class="bars">
        <div class="bar"><span>Activa</span><div class="track"><div class="fill fuego" style="width:${(100 * yang / eb.tot).toFixed(1)}%"></div></div><span class="val">${Math.round(100 * yang / eb.tot)}%</span></div>
        <div class="bar"><span>Receptiva</span><div class="track"><div class="fill agua" style="width:${(100 * yin / eb.tot).toFixed(1)}%"></div></div><span class="val">${Math.round(100 * yin / eb.tot)}%</span></div></div>
        <p class="note">${yang >= yin ? 'Energía más extrovertida: fuego y aire, acción e intercambio.' : 'Energía más introvertida: tierra y agua, contención y profundidad.'}</p></article>
      ${hemi}
    </div>`;

  // Lectura
  const pillars = ['sun', 'moon', 'asc'].filter((k) => ch.pos[k]).map((k) => {
    const s = signOf(ch.pos[k].lon), t = SIGN_TEXT[s.key];
    return `<article class="item"><span class="eyebrow">${BODY[k].name}</span><h3>${sgl(s)} ${s.name}</h3>
      <p>${PILLAR_INTRO[k](s.name)}</p>
      <dl class="kv"><dt>Claves</dt><dd>${t.kw}</dd><dt>Fortaleza</dt><dd>${t.strong}</dd><dt>Reto</dt><dd>${t.challenge}</dd></dl></article>`;
  }).join('');
  const planets = BODIES.filter((b) => !b.angle && ch.pos[b.key] && !['sun', 'moon'].includes(b.key)).map((b) => {
    const p = ch.pos[b.key], s = signOf(p.lon);
    return `<article class="item"><h3>${gl(b.key)} ${b.name} en ${s.name}${p.house ? ` <span class="muted" style="font-size:.9rem">· Casa ${p.house}</span>` : ''}${p.retro && !b.minor ? ' <span class="badge retro">℞</span>' : ''}</h3>
      <p>${cap(PLANET_MEANING[b.key])} se expresa ${SIGN_TEXT[s.key].style}${p.house ? `, sobre todo en ${HOUSE_THEME[p.house - 1]}` : ''}.${p.retro && !b.minor ? ' Al estar retrógrado, esta energía se vive de forma más interna y reflexiva.' : ''}</p></article>`;
  }).join('');
  const topAsp = ch.aspects.filter((a) => ASP[a.type].nature !== 'menor' && !BODY[a.a].minor && !BODY[a.b].minor).slice(0, 8).map((a) => `
    <article class="item"><h3>${gl(a.a)} ${BODY[a.a].name} ${aspBadge(a)} ${gl(a.b)} ${BODY[a.b].name}</h3>
    <p>${cap(PLANET_MEANING[a.a])} y ${PLANET_MEANING[a.b]} ${ASPECT_VERB[a.type]}. <span class="muted mono">Orbe ${orbTxt(a.orb)}</span></p></article>`).join('');
  $('#n-lectura').innerHTML = `<div class="reading"><h3>Los tres pilares</h3><div class="cols">${pillars}</div></div>
    <div class="reading"><h3>Planetas en signos y casas</h3>${planets}</div>
    <div class="reading"><h3>Aspectos más exactos</h3>${topAsp || '<p class="muted">No hay aspectos mayores cerrados.</p>'}</div>`;
}

function computeNatal() {
  const res = readPerson('n');
  const err = $('#natal-error');
  if (res.error) { err.textContent = res.error; err.hidden = false; return false; }
  err.hidden = true;
  natal = { data: res.data, chart: computeChart({ ...res.data, houseSystem: $('#house-system').value }) };
  if (saved.n && saved.n.key !== personKey(rawPerson('n'))) saved.n = null;
  store.set('natal', rawPerson('n')); store.set('houseSystem', $('#house-system').value);
  renderNatal();
  return true;
}

/* ── Sinastría ────────────────────────────────────────────────────── */
let syn = null, biCenter = 'a';
const elCompat = (e1, e2) => {
  if (e1 === e2) return { v: 1, t: 'Afín' };
  const pair = [e1, e2].sort().join('-');
  if (pair === 'aire-fuego' || pair === 'agua-tierra') return { v: 0.85, t: 'Complementario' };
  return { v: 0.35, t: 'Desafiante' };
};
function categoriesFor(a, b) {
  const has = (k) => a === k || b === k;
  const any = (...ks) => ks.some((k) => (a === k ? true : b === k));
  const other = (k) => (a === k ? b : a);
  const out = [];
  if ((has('venus') && has('mars')) || (has('mars') && has('asc')) || (has('venus') && has('asc')) || (has('sun') && has('venus')) ||
      (has('pluto') && any('venus', 'mars')) || (a === 'mars' && b === 'mars') || (has('sun') && has('mars'))) out.push('atraccion');
  if (has('moon') && ['moon', 'sun', 'venus', 'asc', 'jupiter', 'saturn', 'mars', 'mercury'].includes(other('moon'))) out.push('emocion');
  if (has('mercury') && ['mercury', 'sun', 'moon', 'venus', 'jupiter', 'asc', 'uranus', 'mars'].includes(other('mercury'))) out.push('comunicacion');
  if ((has('saturn') && ['sun', 'moon', 'venus', 'asc', 'mars', 'mercury'].includes(other('saturn'))) || (a === 'sun' && b === 'sun') || (has('sun') && has('moon') && a !== b)) out.push('compromiso');
  if ((has('jupiter') && ['sun', 'moon', 'venus', 'mercury', 'mars', 'asc'].includes(other('jupiter'))) || (has('node') && ['sun', 'moon', 'venus', 'mars', 'asc'].includes(other('node')))) out.push('crecimiento');
  return out;
}
function aspectValue(asp, a, b, cat) {
  const n = ASP[asp.type].nature, w = 0.5 + 0.5 * asp.strength;
  const heavy = [a, b].some((k) => k === 'saturn' || k === 'pluto');
  let v;
  if (n === 'armónico') v = 1;
  else if (n === 'tenso') v = cat === 'atraccion' ? 0.4 : -0.8;
  else if (n === 'mixto') v = heavy ? (cat === 'compromiso' ? 0.6 : -0.2) : 1;
  else v = asp.type === 'qx' ? -0.2 : 0.15;
  return v * w;
}
function scoreSyn(A, B, cross) {
  const cats = Object.fromEntries(CATEGORIES.map((c) => [c.key, { sum: 0, n: 0, list: [] }]));
  for (const asp of cross) {
    for (const c of categoriesFor(asp.a, asp.b)) {
      const v = aspectValue(asp, asp.a, asp.b, c);
      cats[c].sum += v; cats[c].n++; cats[c].list.push({ asp, v });
    }
  }
  for (const c of Object.values(cats)) {
    c.score = c.n ? Math.round(50 + 50 * Math.tanh(c.sum / 2.5)) : 45;
    c.list.sort((x, y) => Math.abs(y.v) - Math.abs(x.v));
  }
  const pairs = [['sun', 'sun'], ['moon', 'moon'], ['sun', 'moon'], ['moon', 'sun'], ['venus', 'mars'], ['mars', 'venus'], ['asc', 'asc'], ['venus', 'venus']]
    .filter(([x, y]) => A.pos[x] && B.pos[y])
    .map(([x, y]) => { const ea = signOf(A.pos[x].lon).el, eb = signOf(B.pos[y].lon).el; return { x, y, ea, eb, ...elCompat(ea, eb) }; });
  const elemScore = Math.round(100 * pairs.reduce((s, p) => s + p.v, 0) / pairs.length);
  const catAvg = CATEGORIES.reduce((s, c) => s + cats[c.key].score, 0) / CATEGORIES.length;
  return { cats, pairs, elemScore, overall: Math.round(0.75 * catAvg + 0.25 * elemScore) };
}
const scoreLabel = (s) => (s >= 75 ? 'Muy alta' : s >= 60 ? 'Alta' : s >= 45 ? 'Media' : 'Retadora');
function scoreRing(v) {
  const r = 46, c = 2 * Math.PI * r;
  return `<svg class="score-ring" viewBox="0 0 112 112" role="img" aria-label="Afinidad ${v} de 100"><circle cx="56" cy="56" r="${r}" class="bgc"/><circle cx="56" cy="56" r="${r}" class="fgc" stroke-dasharray="${(c * v / 100).toFixed(1)} ${c.toFixed(1)}" transform="rotate(-90 56 56)"/><text x="56" y="58" text-anchor="middle" dominant-baseline="central">${v}</text></svg>`;
}
function synText(asp, nA, nB) {
  const pair = SYN_PAIR[`${asp.a}-${asp.b}`] || SYN_PAIR[`${asp.b}-${asp.a}`];
  const heavy = SYN_PLANET[asp.a] || SYN_PLANET[asp.b];
  const theme = pair || heavy || `${PLANET_SHORT[asp.a]} y ${PLANET_SHORT[asp.b]}`;
  return `${cap(withArticle(asp.a))} de ${esc(nA)} y ${withArticle(asp.b)} de ${esc(nB)}: este contacto ${SYN_NATURE[ASP[asp.type].nature]} ${theme.startsWith('la ') || theme.startsWith('el ') || theme.startsWith('los ') || theme.startsWith('las ') ? theme : 'el terreno de ' + theme}.`;
}

function renderSyn() {
  const { A, B, dA, dB, cross, score } = syn;
  const nA = dA.name, nB = dB.name;
  const pill = (ch, key) => ch.pos[key] ? `${sgl(signOf(ch.pos[key].lon))} ${signOf(ch.pos[key].lon).name}` : '<span class="muted">sin hora</span>';
  const whoRow = (ch, d, cls) => `<div class="pillar"><div class="eyebrow"><span class="dot" style="background:var(--ring-${cls})"></span> ${esc(d.name)}${d.example ? ' <span class="sample">Ejemplo</span>' : ''}</div>
     <b style="font-weight:500;font-size:.88rem">☉${VS} ${pill(ch, 'sun')} · ☽${VS} ${pill(ch, 'moon')} · AC ${pill(ch, 'asc')}</b>
     <div class="note">${fmtDate(d.y, d.mo, d.d)} · ${esc(d.placeLabel)}</div></div>`;
  $('#syn-summary').innerHTML = `<div class="score">${scoreRing(score.overall)}<div style="display:grid;gap:6px;min-width:0">
      <span class="eyebrow">Afinidad global · ${scoreLabel(score.overall)}</span><h2>${esc(nA)} y ${esc(nB)}</h2>
      <p class="note">${cross.filter((a) => ASP[a.type].nature === 'armónico').length} aspectos armónicos, ${cross.filter((a) => ASP[a.type].nature === 'tenso').length} tensos y ${cross.filter((a) => a.type === 'conj').length} conjunciones entre ambas cartas.</p></div></div>
    <div class="pillars" style="grid-template-columns:repeat(auto-fit,minmax(240px,1fr))">${whoRow(A, dA, 'a')}${whoRow(B, dB, 'b')}</div>` + saveRowHTML('s');
  bindSaveRow('s');

  // Doble rueda
  const drawBi = () => {
    const inner = biCenter === 'a' ? A : B, outer = biCenter === 'a' ? B : A;
    const iCls = biCenter === 'a' ? 'a' : 'b', oCls = biCenter === 'a' ? 'b' : 'a';
    const slow = ['uranus', 'neptune', 'pluto'];
    const asp = cross.filter((x) => ASP[x.type].nature !== 'menor' && !BODY[x.a].minor && !BODY[x.b].minor && x.orb <= 4 && !(slow.includes(x.a) && slow.includes(x.b)))
      .map((x) => ({ l1: A.pos[x.a].lon, l2: B.pos[x.b].lon, type: x.type, strength: x.strength }));
    $('#bi-wheel').innerHTML = wheelSVG({
      ref: inner.asc ?? 0, houses: inner.houses, bi: true, aspects: asp,
      rings: [{ items: ringItems(inner.pos, true), r: 184, cls: iCls, minSep: 9 }, { items: ringItems(outer.pos, true), r: 228, cls: oCls, minSep: 7.5 }],
    });
    $('#bi-note').textContent = inner.houses ? `Casas de ${biCenter === 'a' ? nA : nB}.` : 'Sin hora de nacimiento en la carta central: se muestra con 0° Aries a la izquierda y sin casas.';
  };
  $('#s-birueda').innerHTML = `<div class="section-title"><p class="panel-intro">La carta central marca las casas; la exterior muestra dónde caen los planetas de la otra persona. Las líneas unen aspectos entre ambas cartas.</p>
      <div class="chips" id="bi-center" role="group" aria-label="Carta central"><button type="button" class="chip" data-c="a" aria-pressed="${biCenter === 'a'}">Centro: ${esc(nA)}</button><button type="button" class="chip" data-c="b" aria-pressed="${biCenter === 'b'}">Centro: ${esc(nB)}</button></div></div>
    <div class="wheel-box"><div id="bi-wheel" style="width:100%;display:grid;justify-items:center"></div>
    ${legend(`<span><span class="dot" style="background:var(--ring-a)"></span>${esc(nA)}</span><span><span class="dot" style="background:var(--ring-b)"></span>${esc(nB)}</span>`)}<p class="note" id="bi-note"></p></div>`;
  $('#bi-center').addEventListener('click', (e) => {
    const b = e.target.closest('.chip'); if (!b) return;
    biCenter = b.dataset.c; $$('#bi-center .chip').forEach((c) => c.setAttribute('aria-pressed', c === b)); drawBi();
  });
  drawBi();

  // Aspectos cruzados
  const rows = BODIES.filter((b) => A.pos[b.key]).map((b) => b.key), cols = BODIES.filter((b) => B.pos[b.key]).map((b) => b.key);
  const map = {}; cross.forEach((a) => { map[a.a + '|' + a.b] = a; });
  $('#s-aspectos').innerHTML = `<p class="panel-intro">Filas: astros de <b>${esc(nA)}</b>. Columnas: astros de <b>${esc(nB)}</b>. Los orbes de sinastría son algo más estrechos que en la carta natal.</p>
    ${aspectGrid(rows, cols, (r, c) => map[r + '|' + c], false)}
    <div class="section-title"><h3>Lista de contactos</h3>${chipsHTML('s-chips')}</div><div id="s-asp-list" class="reading"></div>`;
  const drawList = (f) => {
    const list = aspFilter(cross, f);
    $('#s-asp-list').innerHTML = list.length ? list.map((a) => `<article class="item"><h3><span style="color:var(--ring-a)">${gl(a.a)}</span> ${BODY[a.a].name} ${aspBadge(a)} <span style="color:var(--ring-b)">${gl(a.b)}</span> ${BODY[a.b].name} <span class="mono muted" style="font-size:.82rem">orbe ${orbTxt(a.orb)}</span></h3><p>${synText(a, nA, nB)}</p></article>`).join('') : '<div class="empty-state">No hay contactos de este tipo.</div>';
  };
  drawList('all'); bindChips('s-chips', drawList);

  // Casas superpuestas
  const overlay = (from, to, nFrom, nTo, cls) => {
    if (!to.houses) return `<div class="empty-state">Hace falta la hora de nacimiento de ${esc(nTo)} para conocer sus casas.</div>`;
    return BODIES.filter((b) => !b.angle && from.pos[b.key]).map((b) => {
      const h = houseOf(from.pos[b.key].lon, to.houses);
      return `<article class="item"><h3><span style="color:var(--ring-${cls})">${gl(b.key)}</span> ${b.name} de ${esc(nFrom)} <span class="muted">→</span> Casa ${h} de ${esc(nTo)} <span class="badge">${HOUSE_NAME[h - 1]}</span></h3>
        <p>${cap(PLANET_SHORT[b.key])} de ${esc(nFrom)} activa en ${esc(nTo)} ${HOUSE_THEME[h - 1]}.</p></article>`;
    }).join('');
  };
  $('#s-casas').innerHTML = `<p class="panel-intro">Dónde caen los planetas de una persona dentro de las casas de la otra: qué áreas de su vida despierta.</p>
    <div class="cols" style="align-items:start"><div class="reading"><h3>${esc(nA)} en las casas de ${esc(nB)}</h3>${overlay(A, B, nA, nB, 'a')}</div>
    <div class="reading"><h3>${esc(nB)} en las casas de ${esc(nA)}</h3>${overlay(B, A, nB, nA, 'b')}</div></div>`;

  // Compuesta
  const comp = { pos: {}, houses: null };
  for (const k of Object.keys(A.pos)) if (B.pos[k]) comp.pos[k] = { lon: midpoint(A.pos[k].lon, B.pos[k].lon), speed: 0, retro: false };
  if (A.houses && B.houses) comp.houses = A.houses.map((c, i) => midpoint(c, B.houses[i]));
  for (const k in comp.pos) comp.pos[k].house = comp.houses ? houseOf(comp.pos[k].lon, comp.houses) : null;
  comp.aspects = findAspects(comp.pos, comp.pos, false);
  const compRows = BODIES.filter((b) => comp.pos[b.key]).map((b) => `<tr><td>${pname(b.key)}</td><td>${signTag(comp.pos[b.key].lon)}</td><td class="mono">${comp.pos[b.key].house ?? '—'}</td></tr>`).join('');
  const compRead = ['sun', 'moon', 'venus', 'asc'].filter((k) => comp.pos[k]).map((k) => {
    const s = signOf(comp.pos[k].lon), h = comp.pos[k].house;
    const what = { sun: 'El propósito de la relación', moon: 'La vida emocional en común', venus: 'La forma de quererse', asc: 'La imagen que la pareja proyecta' }[k];
    return `<article class="item"><h3>${gl(k)} ${BODY[k].name} compuesto en ${s.name}${h ? ` <span class="muted" style="font-size:.9rem">· Casa ${h}</span>` : ''}</h3><p>${what} se vive ${SIGN_TEXT[s.key].style}${h ? `, con foco en ${HOUSE_THEME[h - 1]}` : ''}.</p></article>`;
  }).join('');
  $('#s-compuesta').innerHTML = `<p class="panel-intro">La carta compuesta toma el punto medio de cada par de planetas y describe la relación como si fuera una tercera persona.</p>
    <div class="wheel-box">${wheelSVG({
      ref: comp.pos.asc ? comp.pos.asc.lon : 0, houses: comp.houses,
      rings: [{ items: ringItems(comp.pos, true), r: 222, degR: 194, cls: 'b', minSep: 7.5 }],
      aspects: comp.aspects.filter((a) => !BODY[a.a].minor && !BODY[a.b].minor).map((a) => ({ l1: comp.pos[a.a].lon, l2: comp.pos[a.b].lon, type: a.type, strength: a.strength })),
    })}${legend()}${comp.houses ? '' : '<p class="note">Sin las dos horas de nacimiento no hay Ascendente ni casas compuestas.</p>'}</div>
    <div class="cols" style="align-items:start"><div class="tbl-wrap"><table><thead><tr><th>Astro</th><th>Punto medio</th><th>Casa</th></tr></thead><tbody>${compRows}</tbody></table></div>
    <div class="reading">${compRead}</div></div>`;

  // Elementos
  const bA = balance(A), bB = balance(B);
  const tA = Object.values(bA.el).reduce((a, b) => a + b, 0), tB = Object.values(bB.el).reduce((a, b) => a + b, 0);
  const mA = Object.values(bA.mod).reduce((a, b) => a + b, 0), mB = Object.values(bB.mod).reduce((a, b) => a + b, 0);
  const dual = (label, va, ta, vb, tb, cls) => `<div class="bar dual"><span>${label}</span><div class="track"><div><div class="fill a" style="width:${(100 * va / ta).toFixed(1)}%"></div></div><div><div class="fill b" style="width:${(100 * vb / tb).toFixed(1)}%"></div></div></div><span class="val">${Math.round(100 * va / ta)}<br>${Math.round(100 * vb / tb)}</span></div>`;
  const pairRows = score.pairs.map((p) => `<tr><td>${gl(p.x)} ${BODY[p.x].name} <span class="muted">de ${esc(nA)}</span></td><td><span class="el-${p.ea}">${cap(p.ea)}</span> · <span class="el-${p.eb}">${cap(p.eb)}</span></td><td>${gl(p.y)} ${BODY[p.y].name} <span class="muted">de ${esc(nB)}</span></td><td><span class="badge ${p.v === 1 ? 'dom' : p.v > 0.5 ? 'exa' : 'exi'}">${p.t}</span></td></tr>`).join('');
  const lowA = Object.entries(bA.el).filter(([, v]) => v / tA < 0.12).map(([k]) => k), lowB = Object.entries(bB.el).filter(([, v]) => v / tB < 0.12).map(([k]) => k);
  const fills = lowA.filter((e) => bB.el[e] / tB > 0.3).map((e) => `${esc(nB)} aporta el ${e} que le falta a ${esc(nA)}.`)
    .concat(lowB.filter((e) => bA.el[e] / tA > 0.3).map((e) => `${esc(nA)} aporta el ${e} que le falta a ${esc(nB)}.`));
  $('#s-elementos').innerHTML = `<p class="panel-intro">Comparación del temperamento de cada persona. La barra superior es <b>${esc(nA)}</b> y la inferior <b>${esc(nB)}</b>.</p>
    <div class="cols">
      <article class="item"><h3>Elementos</h3><div class="bars">${['fuego', 'tierra', 'aire', 'agua'].map((e) => dual(cap(e), bA.el[e], tA, bB.el[e], tB)).join('')}</div>
        <p class="note">${fills.length ? fills.join(' ') : `Elemento dominante: ${dominant(bA.el)} en ${esc(nA)} y ${dominant(bB.el)} en ${esc(nB)}.`}</p></article>
      <article class="item"><h3>Modalidades</h3><div class="bars">${['cardinal', 'fijo', 'mutable'].map((m) => dual(cap(m), bA.mod[m], mA, bB.mod[m], mB)).join('')}</div>
        <p class="note">${dominant(bA.mod) === dominant(bB.mod) ? `Ambos comparten modalidad ${dominant(bA.mod)}: ritmo parecido, aunque pueden competir.` : `Ritmos distintos (${dominant(bA.mod)} y ${dominant(bB.mod)}): se complementan si respetan los tiempos del otro.`}</p></article>
    </div>
    <h3>Combinación de elementos clave</h3>
    <div class="tbl-wrap"><table><thead><tr><th>${esc(nA)}</th><th>Elementos</th><th>${esc(nB)}</th><th>Relación</th></tr></thead><tbody>${pairRows}</tbody></table></div>`;

  // Compatibilidad
  const catHTML = CATEGORIES.map((c) => {
    const k = score.cats[c.key];
    const top = k.list.slice(0, 3).map(({ asp }) => `<span class="badge ${natCls(ASP[asp.type].nature)}">${BODY[asp.a].name} <span class="gl">${ASP[asp.type].glyph}${VS}</span> ${BODY[asp.b].name}</span>`).join(' ');
    return `<article class="item cat"><div class="cat-head"><b>${c.name}</b><span class="mono">${k.score}<span class="muted">/100</span></span></div>
      <div class="bar" style="grid-template-columns:1fr"><div class="track"><div class="fill" style="width:${k.score}%"></div></div></div>
      <p>${c.desc} ${k.n ? '' : 'Pocos contactos directos en esta área.'}</p>${top ? `<div class="chips">${top}</div>` : ''}</article>`;
  }).join('');
  $('#s-compat').innerHTML = `<div class="score card" style="padding:16px">${scoreRing(score.overall)}<div style="display:grid;gap:6px">
      <span class="eyebrow">Afinidad global</span><h2>${scoreLabel(score.overall)}</h2>
      <p class="note">Combina los aspectos entre ambas cartas por área (75 %) y la afinidad de elementos de Sol, Luna, Venus, Marte y Ascendente (25 %, aquí ${score.elemScore}/100). Los aspectos tensos restan en casi todas las áreas, salvo en atracción, donde aportan chispa.</p></div></div>
    <div class="cols">${catHTML}</div>
    <p class="note">Es una puntuación orientativa: una relación depende de mucho más que de una carta. Úsala para conversar, no para decidir.</p>`;
}

function computeSyn() {
  const ra = readPerson('a'), rb = readPerson('b');
  const err = $('#syn-error');
  const e = ra.error || rb.error;
  if (e) { err.textContent = e; err.hidden = false; return false; }
  err.hidden = true;
  const hs = $('#house-system').value;
  const A = computeChart({ ...ra.data, houseSystem: hs }), B = computeChart({ ...rb.data, houseSystem: hs });
  const cross = findAspects(A.pos, B.pos, true);
  syn = { A, B, dA: ra.data, dB: rb.data, cross, score: scoreSyn(A, B, cross) };
  if (saved.s && saved.s.key !== personKey(rawPerson('a')) + '|' + personKey(rawPerson('b'))) saved.s = null;
  store.set('synA', rawPerson('a')); store.set('synB', rawPerson('b'));
  $('#syn-content').classList.remove('is-empty');
  renderSyn();
  return true;
}

/* ── Guardado en la nube (capacidad db del visor de claude.ai) ─────── */
const capOf = (name) => (window.claude && typeof window.claude.use === 'function' ? window.claude.use(name).catch(() => null) : Promise.resolve(null));
const dbCap = capOf('db'), userCap = capOf('user');
const saved = { n: null, s: null }, notes = { n: '', s: '' };
let savedDocs = [], savedFilter = 'all', canWrite = true, confirmDel = null;
const personKey = (r) => JSON.stringify([r.name, r.date, r.time, r.unknown, r.city, r.lat, r.lon, r.city ? '' : r.tz]);
const cleanRaw = (r) => ({ name: r.name, date: r.date, time: r.time, unknown: !!r.unknown, city: r.city || null, placeText: r.placeText || '', lat: r.lat || '', lon: r.lon || '', tz: r.tz || '' });
const fmtStamp = (iso) => { try { return new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(iso)); } catch (e) { return ''; } };

function saveRowHTML(k) {
  const what = k === 'n' ? 'esta carta' : 'esta comparación';
  return `<div class="save-row cloud-only">
      <label class="lbl" for="${k}-note">Notas</label>
      <textarea id="${k}-note" rows="2" placeholder="Tus observaciones sobre ${what}">${esc(notes[k])}</textarea>
      <div class="actions">
        <button class="btn primary small save-btn" type="button" id="${k}-save">${saved[k] ? 'Actualizar guardado' : 'Guardar resultado'}</button>
        ${saved[k] ? `<button class="btn small save-btn" type="button" id="${k}-save-new">Guardar como nuevo</button>` : ''}
        <span class="note save-status" id="${k}-save-status" role="status">${saved[k] ? 'Abierto desde Guardados.' : ''}</span>
      </div>
    </div>
    <p class="note-view${notes[k].trim() ? ' has-note' : ''}">${esc(notes[k])}</p>`;
}
function bindSaveRow(k) {
  const ta = $(`#${k}-note`);
  ta.addEventListener('input', () => { notes[k] = ta.value; });
  $(`#${k}-save`).addEventListener('click', () => saveResult(k, false));
  const sn = $(`#${k}-save-new`);
  if (sn) sn.addEventListener('click', () => saveResult(k, true));
}

function resultDoc(k) {
  const now = new Date().toISOString();
  const hs = $('#house-system').value;
  if (k === 'n') {
    const ch = natal.chart, pos = {};
    for (const key in ch.pos) pos[key] = Math.round(ch.pos[key].lon * 100) / 100;
    const res = (key) => (ch.pos[key] ? { signo: signOf(ch.pos[key].lon).key, grados: fmtDeg(ch.pos[key].lon, false) } : null);
    return { tipo: 'natal', nombre: natal.data.name, datos: cleanRaw(rawPerson('n')), sistemaCasas: hs,
      resumen: { sun: res('sun'), moon: res('moon'), asc: res('asc') }, posiciones: pos, nota: notes.n.trim(), updatedAt: now };
  }
  const areas = Object.fromEntries(CATEGORIES.map((c) => [c.key, syn.score.cats[c.key].score]));
  return { tipo: 'comparacion', nombre: `${syn.dA.name} y ${syn.dB.name}`, datosA: cleanRaw(rawPerson('a')), datosB: cleanRaw(rawPerson('b')), sistemaCasas: hs,
    resumen: { afinidad: syn.score.overall, etiqueta: scoreLabel(syn.score.overall), elementos: syn.score.elemScore, areas,
      solA: signOf(syn.A.pos.sun.lon).key, solB: signOf(syn.B.pos.sun.lon).key }, nota: notes.s.trim(), updatedAt: now };
}

async function saveResult(k, asNew) {
  const st = $(`#${k}-save-status`), db = await dbCap;
  if (!db || (k === 'n' ? !natal : !syn)) return;
  $$(`#${k}-save, #${k}-save-new`).forEach((b) => { b.disabled = true; });
  st.textContent = 'Guardando…';
  const body = resultDoc(k);
  const prev = asNew ? null : saved[k];
  const u = await userCap;
  body.createdAt = prev ? prev.createdAt : body.updatedAt;
  body.createdBy = prev ? prev.createdBy : (u ? await u.id() : null);
  const ref = prev ? db.collection('resultados').doc(prev.id) : db.collection('resultados').doc();
  const attempt = () => ref.set(body);
  try {
    try { await attempt(); } catch (err) {
      if (err && err.code === 'unavailable') { await new Promise((r) => setTimeout(r, 600 + Math.random() * 600)); await attempt(); } else throw err;
    }
    const key = k === 'n' ? personKey(rawPerson('n')) : personKey(rawPerson('a')) + '|' + personKey(rawPerson('b'));
    saved[k] = { id: ref.id, createdAt: body.createdAt, createdBy: body.createdBy, key };
    if (k === 'n') renderNatal(); else renderSyn();
    $(`#${k}-save-status`).textContent = `Guardado el ${fmtStamp(body.updatedAt)}. Lo encontrarás en «Guardados».`;
  } catch (err) {
    const code = err && err.code;
    if (code === 'invalid_argument') { canWrite = false; document.body.classList.add('db-readonly'); }
    st.textContent = code === 'invalid_argument' ? 'Tu acceso a este enlace es de solo lectura: puedes ver los guardados, pero no guardar.'
      : code === 'quota_exceeded' ? 'Se llegó al límite de resultados guardados. Borra algunos en «Guardados» para guardar nuevos.'
      : 'No se pudo guardar. Revisa la conexión e inténtalo de nuevo.';
    $$(`#${k}-save, #${k}-save-new`).forEach((b) => { b.disabled = false; });
  }
}

function savedCardHTML(d) {
  const isNatal = d.tipo === 'natal';
  const r = d.resumen || {};
  let line = '';
  if (isNatal) {
    const sp = (x, label) => { if (!x || !x.signo) return ''; const sg = SIGNS.find((z) => z.key === x.signo); return sg ? `<span class="sg">${label} ${sgl(sg)} ${sg.name} <span class="mono muted">${esc(x.grados)}</span></span>` : ''; };
    const dd = d.datos || {};
    line = `<div class="saved-line">${sp(r.sun, '☉' + VS)}${sp(r.moon, '☽' + VS)}${sp(r.asc, 'AC')}</div>
      <p class="note">${/^\d{4}-\d{2}-\d{2}$/.test(dd.date || '') ? fmtDate(+dd.date.slice(0, 4), +dd.date.slice(5, 7), +dd.date.slice(8, 10)) : esc(dd.date || '')}${dd.unknown ? ' · hora desconocida' : dd.time ? ' · ' + esc(dd.time) : ''}${dd.city ? ' · ' + esc(dd.city.split('|')[0]) : dd.placeText ? ' · ' + esc(dd.placeText) : ''}</p>`;
  } else {
    const areas = r.areas || {};
    line = `<div class="saved-line"><span><b class="mono">${Number(r.afinidad) || 0}</b><span class="muted">/100</span> · ${esc(r.etiqueta || '')}</span></div>
      <div class="mini-areas">${CATEGORIES.filter((c) => areas[c.key] != null).map((c) => `<span class="badge">${c.name} ${Number(areas[c.key])}</span>`).join('')}</div>`;
  }
  const del = confirmDel === d.id
    ? `<span class="note">¿Borrar para todos?</span><button class="btn small" type="button" data-del-yes="${esc(d.id)}">Sí, borrar</button><button class="btn small" type="button" data-del-no>No</button>`
    : (canWrite ? `<button class="btn small" type="button" data-del="${esc(d.id)}">Borrar</button>` : '');
  return `<article class="item saved-item">
    <div class="section-title"><span class="badge ${isNatal ? 'exa' : 'dom'}">${isNatal ? 'Carta natal' : 'Comparación'}</span><span class="note">${esc(fmtStamp(d.updatedAt))}</span></div>
    <h3>${esc(d.nombre || 'Sin nombre')}</h3>
    ${line}
    ${d.nota ? `<p class="saved-note">${esc(d.nota)}</p>` : ''}
    <p class="note">Guardado por <span data-uid="${esc(d.createdBy || '')}">alguien</span></p>
    <div class="actions"><button class="btn primary small" type="button" data-open="${esc(d.id)}">Abrir</button>${del}</div>
  </article>`;
}

async function renderSaved() {
  const q = normTxt($('#saved-search').value || '');
  const list = savedDocs.filter((d) => (savedFilter === 'all' || d.tipo === savedFilter) &&
    (!q || normTxt(`${d.nombre || ''} ${d.nota || ''}`).includes(q)));
  $('#saved-count').textContent = savedDocs.length ? `${savedDocs.length} en total` : '';
  $('#saved-list').innerHTML = list.length ? list.map(savedCardHTML).join('')
    : `<div class="empty-state">${savedDocs.length ? 'Ningún resultado coincide con la búsqueda.' : 'Todavía no hay resultados guardados. Calcula una carta o una comparación y pulsa «Guardar resultado».'}</div>`;
  const u = await userCap;
  const ids = [...new Set($$('#saved-list [data-uid]').map((e) => e.dataset.uid).filter(Boolean))];
  if (u && ids.length) {
    const ps = await u.profiles(ids);
    $$('#saved-list [data-uid]').forEach((e) => { const p = ps[e.dataset.uid]; if (p) e.textContent = p.isMe ? 'ti' : (p.name || 'alguien'); });
  }
}

function openSaved(id) {
  const d = savedDocs.find((x) => x.id === id);
  if (!d) return;
  if (d.sistemaCasas) $('#house-system').value = d.sistemaCasas;
  if (d.tipo === 'natal') {
    fillPerson('n', { ...d.datos, example: false });
    notes.n = d.nota || '';
    saved.n = { id: d.id, createdAt: d.createdAt, createdBy: d.createdBy, key: personKey(rawPerson('n')) };
    if (!computeNatal()) return;
    activate('main', 'natal');
  } else {
    fillPerson('a', { ...d.datosA, example: false }); fillPerson('b', { ...d.datosB, example: false });
    notes.s = d.nota || '';
    saved.s = { id: d.id, createdAt: d.createdAt, createdBy: d.createdBy, key: personKey(rawPerson('a')) + '|' + personKey(rawPerson('b')) };
    if (!computeSyn()) return;
    activate('main', 'sinastria');
  }
  window.scrollTo(0, 0);
}

async function initCloud() {
  $('#saved-filter').addEventListener('click', (e) => {
    const b = e.target.closest('.chip'); if (!b) return;
    savedFilter = b.dataset.f; $$('#saved-filter .chip').forEach((c) => c.setAttribute('aria-pressed', c === b)); renderSaved();
  });
  $('#saved-search').addEventListener('input', () => renderSaved());
  $('#saved-list').addEventListener('click', async (e) => {
    const t = e.target.closest('button'); if (!t) return;
    if (t.dataset.open) openSaved(t.dataset.open);
    else if (t.dataset.del) { confirmDel = t.dataset.del; renderSaved(); }
    else if (t.hasAttribute('data-del-no')) { confirmDel = null; renderSaved(); }
    else if (t.dataset.delYes) {
      const db = await dbCap; const id = t.dataset.delYes; confirmDel = null;
      try { await db.collection('resultados').doc(id).delete(); if (saved.n && saved.n.id === id) saved.n = null; if (saved.s && saved.s.id === id) saved.s = null; }
      catch (err) { $('#saved-count').textContent = 'No se pudo borrar. Inténtalo de nuevo.'; }
      renderSaved();
    }
  });

  const db = await dbCap;
  if (!db) {
    $('#saved-intro').textContent = 'Los resultados se guardan en la nube cuando abres Astrolabio desde su enlace de claude.ai con la sesión iniciada. En esta copia puedes usar «Guardar persona», que guarda los datos de nacimiento solo en este navegador.';
    $('#saved-list').innerHTML = '';
    return;
  }
  document.body.classList.add('has-db');
  $('#saved-tools').hidden = false;
  const u = await userCap;
  const can = u ? await u.can('data.write') : null;
  canWrite = can !== false;
  if (!canWrite) {
    document.body.classList.add('db-readonly');
    $('#saved-intro').textContent += ' Tu acceso es de solo lectura: puedes ver y abrir los resultados, pero no guardar ni borrar.';
  }
  db.collection('resultados').orderBy('updatedAt', 'desc').limit(500).onSnapshot(
    (snap) => { savedDocs = snap.docs.map((x) => ({ id: x.id, ...x.data() })); renderSaved(); },
    () => { $('#saved-list').innerHTML = '<div class="empty-state">No se pudieron cargar los resultados guardados. Recarga la página.</div>'; },
  );
}

/* ── Arranque ─────────────────────────────────────────────────────── */
const exampleRaw = (i) => { const e = EXAMPLES[i]; const c = findCity(e.city); return { ...e, tz: c.tz }; };
function collapseOnMobile(id, target) {
  if (window.innerWidth < 980) { $(id).open = false; try { $(target).scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (e) { /* sin scroll */ } }
}

function boot() {
  if (typeof Astronomy === 'undefined') {
    $('#natal-summary').innerHTML = '<p class="error">No se pudo cargar el motor astronómico. Revisa tu conexión y recarga la página.</p>';
    return;
  }
  ['n', 'a', 'b'].forEach(setupPerson);
  refreshLoadSelects();
  $('#house-system').value = store.get('houseSystem', 'placidus');
  // Datos recordados de visitas anteriores, salvo ejemplos que ya no existen
  const remembered = (k) => { const r = store.get(k, null); return r && r.example && !EXAMPLES.some((e) => e.name === r.name && e.date === r.date) ? null : r; };
  fillPerson('n', remembered('natal') || exampleRaw(0));
  fillPerson('a', remembered('synA') || exampleRaw(0));
  fillPerson('b', remembered('synB') || exampleRaw(1));

  const hash = (location.hash || '').slice(1);
  if (['natal', 'sinastria', 'guardados'].includes(hash)) tabState.main = hash;
  setupTabs('main', 'natal'); setupTabs('natal', 'rueda'); setupTabs('syn', 'birueda');

  if (!computeNatal()) { fillPerson('n', exampleRaw(0)); computeNatal(); }
  if (!computeSyn()) {
    $('#syn-error').hidden = true;
    $('#syn-content').classList.add('is-empty');
    $('#syn-summary').innerHTML = `<div class="empty-state">Añade los datos de nacimiento de la persona B y pulsa «Comparar cartas» para ver la doble rueda, los aspectos cruzados y la compatibilidad.</div>`;
    $('#syn-form-card').open = true;
  }

  $('#natal-form').addEventListener('submit', (e) => { e.preventDefault(); if (computeNatal()) collapseOnMobile('#natal-form-card', '#natal-content'); });
  $('#house-system').addEventListener('change', () => { computeNatal(); if (syn) computeSyn(); });
  $('#syn-form').addEventListener('submit', (e) => { e.preventDefault(); if (computeSyn()) collapseOnMobile('#syn-form-card', '#syn-content'); });
  $('#syn-swap').addEventListener('click', () => { const a = rawPerson('a'), b = rawPerson('b'); fillPerson('a', b); fillPerson('b', a); computeSyn(); });
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-copy]'); if (!b) return;
    fillPerson(b.dataset.copy, rawPerson('n'));
  });
  $('#natal-save').addEventListener('click', () => {
    const r = rawPerson('n'), msg = $('#natal-saved');
    if (!r.name) { msg.textContent = 'Escribe un nombre para guardar la persona.'; msg.hidden = false; return; }
    const res = readPerson('n');
    if (res.error) { msg.textContent = res.error; msg.hidden = false; return; }
    const list = store.get('personas', []).filter((x) => x.name !== r.name);
    list.push({ ...r, example: false }); store.set('personas', list);
    refreshLoadSelects();
    msg.textContent = `${r.name} guardada en este navegador. Puedes cargarla también en «Comparar cartas».`; msg.hidden = false;
  });
  if (window.innerWidth < 980) { $('#natal-form-card').open = false; if (syn) $('#syn-form-card').open = false; }
}

/* ── Exportar a PDF: vista de informe + impresión del navegador ──── */
const inFrame = (() => { try { return window.self !== window.top; } catch (e) { return true; } })();
/* En el visor de claude.ai las descargas pasan por la capacidad `downloads`; fuera de él, window.claude no existe */
const downloadsCap = window.claude && typeof window.claude.use === 'function' ? window.claude.use('downloads').catch(() => null) : Promise.resolve(null);
let report = null, savePDF = null;
function enterReport(withNatal, withSyn, auto) {
  if (report) exitReport();
  if (withNatal && natal) renderNatal();
  if (withSyn && syn) renderSyn();
  report = { hidden: $$('[role="tabpanel"]').map((p) => [p, p.hidden]), scroll: window.scrollY, auto };
  $$('[role="tabpanel"][data-group="natal"], [role="tabpanel"][data-group="syn"]').forEach((p) => {
    p.hidden = false;
    const h = document.createElement('h2'); h.className = 'report-title'; h.textContent = p.dataset.printTitle; p.prepend(h);
  });
  $('#view-natal').hidden = !withNatal;
  $('#view-sinastria').hidden = !withSyn;
  $('#view-guardados').hidden = true;
  document.body.classList.add('report');
  document.body.classList.toggle('p-natal', withNatal);
  document.body.classList.toggle('p-syn', withSyn);
  $('#report-bar').hidden = false;
  $('#print-date').textContent = 'Informe generado el ' + new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());
  const names = [withNatal && natal ? natal.data.name : null, withSyn && syn ? `${syn.dA.name} y ${syn.dB.name}` : null].filter(Boolean);
  document.title = `Astrolabio – ${names.join(' · ')}`;
  if (!auto) window.scrollTo(0, 0);
}
function exitReport() {
  if (!report) return;
  report.hidden.forEach(([p, h]) => { p.hidden = h; });
  $$('.report-title').forEach((h) => h.remove());
  document.body.classList.remove('report', 'p-natal', 'p-syn');
  $('#report-bar').hidden = true;
  document.title = 'Astrolabio';
  const y = report.scroll; report = null;
  window.scrollTo(0, y);
}
window.addEventListener('beforeprint', () => { if (!report) enterReport(!!natal, !!syn, true); });
window.addEventListener('afterprint', () => { if (report && report.auto) exitReport(); });

/* ── PDF generado en el navegador (no depende del motor de impresión) ─ */
const PDF_LIBS = [
  'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
];
const loadScript = (src) => new Promise((res, rej) => {
  if ([...document.scripts].some((x) => x.src === src)) { res(); return; }
  const el = document.createElement('script');
  el.src = src; el.onload = res; el.onerror = () => rej(new Error('No se pudo cargar la librería de PDF. Revisa tu conexión.'));
  document.head.appendChild(el);
});
const frame = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

/* Pinta un SVG en un canvas leyendo los estilos calculados (html2canvas no aplica el CSS de la página dentro de un SVG) */
function svgToImage(svg, scale) {
  const box = svg.getBoundingClientRect(), vb = svg.viewBox.baseVal;
  const c = document.createElement('canvas');
  c.width = Math.max(1, Math.round(box.width * scale)); c.height = Math.max(1, Math.round(box.height * scale));
  const ctx = c.getContext('2d');
  ctx.scale(c.width / vb.width, c.height / vb.height); ctx.translate(-vb.x, -vb.y);
  const num = (el, a) => parseFloat(el.getAttribute(a)) || 0;
  for (const el of svg.querySelectorAll('circle, line, path, text')) {
    const cs = getComputedStyle(el);
    if (cs.display === 'none') continue;
    ctx.save();
    ctx.globalAlpha = parseFloat(el.getAttribute('opacity') ?? cs.opacity) || 1;
    const tr = /rotate\(([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)\)/.exec(el.getAttribute('transform') || '');
    if (tr) { ctx.translate(+tr[2], +tr[3]); ctx.rotate(+tr[1] * D2R); ctx.translate(-tr[2], -tr[3]); }
    const fill = cs.fill, stroke = cs.stroke, sw = parseFloat(cs.strokeWidth) || 1;
    const dash = cs.strokeDasharray && cs.strokeDasharray !== 'none' ? cs.strokeDasharray.split(/[ ,]+/).map(parseFloat).filter((n) => !isNaN(n)) : [];
    if (el.tagName === 'text') {
      const txt = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join('');
      ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
      const anchor = el.getAttribute('text-anchor');
      ctx.textAlign = anchor === 'middle' ? 'center' : anchor === 'end' ? 'right' : 'left';
      ctx.textBaseline = el.getAttribute('dominant-baseline') === 'central' ? 'middle' : 'alphabetic';
      ctx.fillStyle = fill && fill !== 'none' ? fill : '#000';
      ctx.fillText(txt, num(el, 'x'), num(el, 'y'));
    } else {
      let path;
      if (el.tagName === 'circle') { path = new Path2D(); path.arc(num(el, 'cx'), num(el, 'cy'), num(el, 'r'), 0, 2 * Math.PI); }
      else if (el.tagName === 'line') { path = new Path2D(); path.moveTo(num(el, 'x1'), num(el, 'y1')); path.lineTo(num(el, 'x2'), num(el, 'y2')); }
      else path = new Path2D(el.getAttribute('d'));
      if (fill && fill !== 'none' && el.tagName !== 'line') { ctx.fillStyle = fill; ctx.fill(path); }
      if (stroke && stroke !== 'none') {
        ctx.strokeStyle = stroke; ctx.lineWidth = sw; ctx.setLineDash(dash); ctx.lineCap = cs.strokeLinecap || 'butt'; ctx.stroke(path);
      }
    }
    ctx.restore();
  }
  const img = new Image();
  img.src = c.toDataURL('image/png');
  img.style.width = box.width + 'px'; img.style.height = box.height + 'px'; img.style.display = 'block'; img.style.margin = getComputedStyle(svg).margin;
  return img;
}
function swapSVGs(root, scale) {
  const swaps = [];
  for (const svg of root.querySelectorAll('svg.wheel, svg.score-ring')) {
    const img = svgToImage(svg, scale);
    svg.replaceWith(img); swaps.push([img, svg]);
  }
  return () => swaps.forEach(([img, svg]) => img.replaceWith(svg));
}

/* Puntos donde se puede cortar una sección sin partir tarjetas, filas ni párrafos */
const ATOMS = '.item, tr, .bar, .pillar, .wheel-box, .legend, h2, h3, p, .section-title, .score, .cat, .card, .print-head, dl';
function cutPlanner(el) {
  const top = el.getBoundingClientRect().top;
  const rects = [...el.querySelectorAll(ATOMS)].map((a) => { const r = a.getBoundingClientRect(); return [r.top - top, r.bottom - top]; }).filter(([t, b]) => b - t > 0);
  const ys = [...new Set(rects.flatMap(([t, b]) => [Math.floor(t) - 1, Math.ceil(b) + 1]))].sort((a, b) => b - a);
  const heads = [...el.querySelectorAll('h2, h3, .section-title, .panel-intro')].map((h) => h.getBoundingClientRect().bottom - top);
  return (start, end) => {
    for (const y of ys) {
      if (y > end || y <= start + 30) continue;
      if (heads.some((b) => b <= y && y - b < 20)) continue;
      if (!rects.some(([t, b]) => t < y && b > y)) return y;
    }
    return null;
  };
}

async function downloadPDF(withNatal, withSyn) {
  const ov = $('#pdf-overlay'), status = $('#pdf-status');
  ov.hidden = false; $('#pdf-done').hidden = true; $('#pdf-spin').hidden = false; $('#pdf-open').hidden = false; $('#pdf-again').hidden = true;
  status.textContent = 'Preparando el informe…';
  const restoreScroll = window.scrollY;
  let entered = false;
  try {
    await Promise.all(PDF_LIBS.map(loadScript));
    if (document.fonts && document.fonts.ready) await document.fonts.ready;
    enterReport(withNatal, withSyn, false); entered = true;
    document.body.classList.add('pdf-capture');
    window.scrollTo(0, 0);
    await frame();

    const sections = [];
    sections.push({ el: $('.print-head'), page: false });
    if (withNatal) {
      sections.push({ el: $('#natal-summary'), page: false });
      $$('#natal-content > [role="tabpanel"]').forEach((p, i) => sections.push({ el: p, page: i > 0 }));
    }
    if (withSyn) {
      sections.push({ el: $('#syn-summary'), page: withNatal });
      $$('#syn-content > [role="tabpanel"]').forEach((p, i) => sections.push({ el: p, page: i > 0 }));
    }
    sections.push({ el: $('.foot'), page: false });

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: 'mm', format: 'a4', compress: true });
    const PW = 210, PH = 297, M = 12, TOP = 12, BOT = 16, CW = PW - 2 * M, LIMIT = PH - BOT;
    const refW = $('#natal-content').getBoundingClientRect().width || $('#syn-content').getBoundingClientRect().width;
    const k = CW / refW;
    let y = TOP, pageEmpty = true;
    const newPage = () => { doc.addPage(); y = TOP; pageEmpty = true; };

    for (let i = 0; i < sections.length; i++) {
      const { el, page } = sections[i];
      status.textContent = `Generando PDF… ${Math.round(100 * i / sections.length)} %`;
      await frame();
      if (page && !pageEmpty) newPage();
      const box = el.getBoundingClientRect(), H = box.height, W = box.width;
      if (H < 1) continue;
      const scale = Math.max(1, Math.min(1.8, Math.sqrt(14e6 / (W * H)), 30000 / H));
      const restore = swapSVGs(el, scale);
      let canvas;
      try {
        canvas = await window.html2canvas(el, { scale, backgroundColor: '#ffffff', logging: false, useCORS: true, scrollX: 0, scrollY: 0, ignoreElements: (n) => n.id === 'pdf-overlay' });
      } finally { restore(); }
      const plan = cutPlanner(el), sc = canvas.height / H;
      let start = 0;
      while (start < H - 1) {
        let room = (LIMIT - y) / k;
        if (room < 80 && !pageEmpty) { newPage(); room = (LIMIT - y) / k; }
        let end = Math.min(H, start + room);
        if (end < H) {
          const cut = plan(start, end);
          if (cut) end = cut;
          else if (!pageEmpty) { newPage(); continue; }
        }
        const sh = Math.max(1, Math.round((end - start) * sc));
        const part = document.createElement('canvas');
        part.width = canvas.width; part.height = sh;
        const pc = part.getContext('2d');
        pc.fillStyle = '#ffffff'; pc.fillRect(0, 0, part.width, sh);
        pc.drawImage(canvas, 0, Math.round(start * sc), canvas.width, sh, 0, 0, canvas.width, sh);
        doc.addImage(part.toDataURL('image/jpeg', 0.9), 'JPEG', M, y, W * k, (end - start) * k, undefined, 'FAST');
        y += (end - start) * k + 4; pageEmpty = false;
        start = end;
        if (start < H - 1) newPage();
      }
    }

    const who = [withNatal && natal ? natal.data.name : null, withSyn && syn ? `${syn.dA.name} y ${syn.dB.name}` : null].filter(Boolean).join(' · ');
    const n = doc.getNumberOfPages();
    for (let p = 1; p <= n; p++) {
      doc.setPage(p); doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(110, 118, 135);
      doc.text(`Astrolabio · ${who}`, M, PH - 8);
      doc.text(`${p} / ${n}`, PW - M, PH - 8, { align: 'right' });
    }
    const file = `Astrolabio - ${who.replace(/[\\/:*?"<>|]/g, '')}.pdf`;
    const blob = doc.output('blob');
    const pages = n;
    // Restaurar la vista antes de pedir la descarga
    $('#pdf-spin').hidden = true;
    document.body.classList.remove('pdf-capture');
    if (entered) { exitReport(); entered = false; }
    window.scrollTo(0, restoreScroll);

    const dl = await downloadsCap;
    if (dl) {
      $('#pdf-open').hidden = true;
      savePDF = async () => {
        status.textContent = 'Confirma la descarga en el aviso de claude.ai…';
        $('#pdf-again').hidden = true;
        try {
          await dl.save({ filename: file, data: blob });
          status.textContent = `PDF guardado: ${pages} páginas.`;
        } catch (err) {
          const code = err && err.code;
          status.textContent = code === 'declined' ? 'Descarga cancelada.' : code === 'rate_limited' ? 'Ya hay un aviso de descarga abierto. Espera un momento y vuelve a intentarlo.' : 'Esta vista no permite descargar archivos. Abre index.html del repositorio para exportar.';
        }
        $('#pdf-again').hidden = false; $('#pdf-done').hidden = false;
      };
      await savePDF();
    } else {
      const url = URL.createObjectURL(blob);
      const a = $('#pdf-open'); a.href = url; a.download = file;
      try { doc.save(file); } catch (err) { /* la descarga puede estar bloqueada; queda el botón Abrir */ }
      status.textContent = `PDF listo: ${pages} páginas. Si no se descargó solo, toca «Abrir PDF».`;
      $('#pdf-done').hidden = false;
    }
  } catch (err) {
    status.textContent = `No se pudo generar el PDF. ${err && err.message ? err.message : ''}`;
    $('#pdf-done').hidden = false; $('#pdf-open').hidden = true;
  } finally {
    $('#pdf-spin').hidden = true;
    document.body.classList.remove('pdf-capture');
    if (entered) { exitReport(); window.scrollTo(0, restoreScroll); }
  }
}

function setupExport() {
  const dlg = $('#export-dlg');
  $('#export-btn').addEventListener('click', () => {
    $('#exp-natal-name').textContent = natal ? natal.data.name : '—';
    $('#exp-syn-name').textContent = syn ? `${syn.dA.name} y ${syn.dB.name}` : '—';
    $('#exp-natal').checked = !!natal; $('#exp-natal').disabled = !natal;
    $('#exp-syn').checked = !!syn; $('#exp-syn').disabled = !syn;
    $('#export-error').hidden = true;
    $('#export-frame-note').hidden = true;
    $('#export-form button[value="print"]').hidden = inFrame;
    downloadsCap.then((d) => { $('#export-frame-note').hidden = !(inFrame && !d); });
    if (typeof dlg.showModal === 'function') dlg.showModal();
    else { enterReport(!!natal, !!syn, false); setTimeout(() => window.print(), 300); }
  });
  $('#export-form').addEventListener('submit', (e) => {
    if (e.submitter && e.submitter.value === 'cancel') return;
    const withNatal = $('#exp-natal').checked, withSyn = $('#exp-syn').checked;
    if (!withNatal && !withSyn) { e.preventDefault(); const er = $('#export-error'); er.textContent = 'Marca al menos una sección.'; er.hidden = false; return; }
    const how = e.submitter ? e.submitter.value : 'download';
    dlg.addEventListener('close', () => {
      if (how === 'print') { enterReport(withNatal, withSyn, false); setTimeout(() => window.print(), 300); }
      else downloadPDF(withNatal, withSyn);
    }, { once: true });
  });
  $('#report-print').addEventListener('click', () => window.print());
  $('#pdf-close').addEventListener('click', () => { $('#pdf-overlay').hidden = true; });
  $('#pdf-again').addEventListener('click', () => { if (savePDF) savePDF(); });
  $('#report-exit').addEventListener('click', exitReport);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && report && !dlg.open) exitReport(); });
}

boot();
setupExport();
initCloud();
