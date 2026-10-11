# Astrolabio

Aplicación web responsiva para generar una carta astral y comparar dos cartas. Todo el cálculo ocurre en el navegador; no hay servidor.

## Módulos

**Carta natal**: Rueda · Planetas · Casas · Aspectos · Equilibrio · Lectura

**Comparar cartas**: Doble rueda · Aspectos cruzados · Casas superpuestas · Carta compuesta · Elementos · Compatibilidad

## Uso

Abre `index.html` en el navegador, o publícalo con GitHub Pages (rama `main`, carpeta raíz).

### Exportar a PDF

El botón **Exportar PDF** de la cabecera abre el informe completo, con todas las pestañas de la carta natal y de la comparación, sin importar cuál esté seleccionada. Después abre la ventana de impresión del navegador: elige **Guardar como PDF**. La barra superior del informe permite volver a guardarlo o regresar a la vista normal. Ctrl/Cmd + P también exporta todo.

El PDF sale en A4 y tema claro, con texto seleccionable y la rueda en vector. Los estilos de impresión usan bloques en lugar de grid para que Firefox y Safari repartan bien las secciones largas entre páginas.

Las vistas incrustadas que bloquean la impresión (por ejemplo, la vista previa de claude.ai) no pueden exportar; abre `index.html` directamente.

## Desarrollo

El código fuente está en `src/` y se une en `index.html` con:

```sh
./build.sh
```

| Archivo | Contenido |
| --- | --- |
| `src/head.html` | Título, fuentes y estilos (tokens de color para modo claro y oscuro) |
| `src/body.html` | Estructura de pestañas y formularios |
| `src/data.js` | Ciudades (lat, lon, zona IANA) y textos de interpretación |
| `src/engine.js` | Cálculo astronómico: planetas, Ascendente, MC, casas, aspectos, equilibrio |
| `src/app.js` | Interfaz: formularios, ruedas SVG, tablas, sinastría y compatibilidad |

## Cálculo

- Zodiaco tropical; posiciones geocéntricas aparentes con [Astronomy Engine](https://github.com/cosinekitty/astronomy) 2.1.19 (cargado desde jsDelivr).
- Ascendente y Medio Cielo a partir del tiempo sidéreo aparente de Greenwich.
- Casas Placidus (iterativo por semiarcos), iguales o de signo entero. Por encima de ~66° de latitud, Placidus pasa a casas iguales.
- Nodo Norte y Lilith medios.
- La hora local se convierte a UTC con la base de zonas horarias del navegador (`Intl`), incluido el horario de verano histórico.
- La puntuación de compatibilidad es una heurística propia y orientativa.

## Licencia

GPL-3.0. Ver `LICENSE`.
