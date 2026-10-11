# Astrolabio

Aplicación web responsiva para generar una carta astral y comparar dos cartas. Todo el cálculo ocurre en el navegador; no hay servidor.

## Módulos

**Carta natal**: Rueda · Planetas · Casas · Aspectos · Equilibrio · Lectura

**Comparar cartas**: Doble rueda · Aspectos cruzados · Casas superpuestas · Carta compuesta · Elementos · Compatibilidad

## Uso

Abre `index.html` en el navegador, o publícalo con GitHub Pages (rama `main`, carpeta raíz).

### Exportar a PDF

El botón **Exportar PDF** de la cabecera genera en el navegador un PDF A4 con todas las pestañas de la carta natal y de la comparación, sin importar cuál esté seleccionada, y lo descarga. No depende del motor de impresión, así que sale igual en iPad, iPhone, Android y ordenador. Cada sección se convierte en imagen con [html2canvas](https://html2canvas.hertzen.com/) 1.4.1 y se compone con [jsPDF](https://github.com/parallax/jsPDF) 2.5.1; ambas se cargan de cdnjs solo al exportar. Los cortes de página caen entre tarjetas, filas y párrafos, nunca a mitad de uno. Cada página lleva pie con nombre y número.

En el mismo diálogo queda la opción **Usar la impresión del navegador** (texto seleccionable), que funciona bien en ordenador pero no en iOS, donde el motor de impresión corta los documentos largos.

En la versión publicada en claude.ai la descarga pasa por la capacidad `downloads` del visor, que muestra un aviso de confirmación. Fuera de claude.ai se descarga directamente.

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
