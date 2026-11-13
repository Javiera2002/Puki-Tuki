# Medios de la aplicación

| Carpeta | Qué va | Estado |
|---|---|---|
| `audio/` | Voz en off, un MP3 por frase: `vo_<toma>.mp3` (por ejemplo `vo_C1-07.mp3`, `vo_R01.mp3`) | 44 archivos, voz Fola de Google AI Studio |
| `escenas/` | Videos del cuento: `<toma>.mp4` (por ejemplo `C1-04.mp4`). Traen las voces de los personajes | Vacía: las 88 escenas son provisionales |
| `clips/` | Clips de respuesta, sin sonido y en bucle: `R<nn>-P.mp4` (Puki) y `R<nn>-T.mp4` (Tuki); `R00` es la práctica | Vacía: los 28 clips son provisionales |
| `bienvenida/` | Imágenes de la pantalla de bienvenida | Listas |
| `personajes/` | Hoja de referencia de Puki y Tuki | Lista |
| `provisional/` | Imagen del inicio infantil y de la pantalla final | Provisional |

Los nombres de archivo que espera la aplicación están en `contenido/historia.js`. Mientras un
video no existe, su escena o clip está marcado `provisional: true` y se muestra una tarjeta con
la descripción de la toma.

Los videos no van a git (`.gitignore`); se respaldan aparte.

## Recursos de interfaz (13-11-2026)

`decision/`: copias de la barra, el fondo crema elegido por Javiera, la lámina de círculo,
mano y flecha y el botón amarillo de pausa. Se muestran partes de las láminas mediante CSS,
sin modificar las imágenes originales. La mano todavía no se muestra (propuesta en la spec).

`pausa/panel.png`: composición entregada por Javiera, con botones reales superpuestos y
estados de sonido y confirmación dibujados por la app. Incluye textos en español dentro de
la imagen; no es un panel traducible automáticamente.
