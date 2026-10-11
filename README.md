# Astrolabio

Aplicación web responsiva para generar una carta astral y comparar dos cartas. Todo el cálculo ocurre en el navegador; no hay servidor.

## Módulos

**Carta natal**: Rueda · Planetas · Casas · Aspectos · Equilibrio · Lectura

**Comparar cartas**: Doble rueda · Aspectos cruzados · Casas superpuestas · Carta compuesta · Elementos · Compatibilidad

## Uso

Abre `index.html` en el navegador, o publícalo con GitHub Pages (rama `main`, carpeta raíz).

### Exportar a PDF

El botón **Exportar PDF** de la cabecera genera un informe A4 con todas las pestañas de la carta natal y, si se marca, de la comparación. Usa la impresión del navegador: en el diálogo elige **Guardar como PDF**. El PDF sale siempre en tema claro, con texto seleccionable y la rueda en vector. También funciona con Ctrl/Cmd + P, que exporta el módulo abierto.

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
