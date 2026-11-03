# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Proyecto

Astrolabio: aplicación web (HTML + JavaScript sin framework ni dependencias de npm) que calcula la carta astral y compara dos cartas en el navegador. Todo el texto de la interfaz está en español.

## Comandos

```sh
./build.sh       # une src/ en index.html (hay que ejecutarlo tras cualquier cambio en src/)
node --test      # ejecuta los tests de tests/*.test.js
```

`index.html` es un artefacto generado: no se edita a mano.

## Estructura

- `src/head.html` — título, fuentes y CSS (tokens de color con modo claro/oscuro y estilos de impresión).
- `src/body.html` — marcado de las pestañas y formularios.
- `src/data.js` — ciudades (`nombre|país|lat|lon|zona IANA`) y textos de interpretación.
- `src/engine.js` — cálculo astronómico: `computeChart(input)` recibe `{ y, mo, d, h, mi, zone, lat, lon, unknownTime, houseSystem }` (fecha y hora locales, `mo` 1-12) y devuelve posiciones, casas y aspectos. Usa Astronomy Engine, que se carga de jsDelivr.
- `src/kin.js` — Kin maya: `kinMaya(y, mo, d)` devuelve `{ kin, sello, tono, nombre }` según el sistema Dreamspell (ancla 21/12/2012 = Kin 207). Los 29 de febrero no cuentan en la distancia de días y devuelven `kin: 0` («Día fuera del tiempo (Hunab Ku 0.0, sin Kin)»).
- `src/app.js` — interfaz: formularios, ruedas SVG, pestañas, sinastría, exportación a PDF (html2canvas + jsPDF, cargados al exportar) y guardado en la nube.

`build.sh` concatena `data.js`, `engine.js`, `kin.js` y `app.js` en ese orden dentro de un único `<script>`, así que comparten ámbito global; un módulo nuevo de cálculo se añade a esa lista. Los módulos que se prueban con Node terminan con `if (typeof module !== 'undefined') module.exports = {...}`.

## Convenciones

- Las fechas de nacimiento circulan como `y, mo, d` (mes 1-12) en hora local; la conversión a UTC la hace `localToUTC` con la zona IANA.
- Los resultados se muestran en el resumen de cada carta (`summaryHTML` en `app.js`) y en pestañas (`role="tab"` / `role="tabpanel"` con `data-group`).
- Todo el texto que viene de usuarios o de la base de datos se escapa con `esc()`.
- La versión publicada en claude.ai usa las capacidades `db` (colección `resultados`), `user` y `downloads` del visor; fuera de claude.ai `window.claude` no existe y esas funciones se ocultan.
