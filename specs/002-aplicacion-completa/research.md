# Research: Aplicación completa Puki y Tuki

Decisiones técnicas del plan. Cada una dice qué se eligió, por qué y qué otras opciones hubo.
Las decisiones de diseño de la experiencia están en la spec; aquí solo va el cómo construirla.

## 1. Tecnología base

- **Decision**: HTML, CSS y JavaScript con módulos nativos, sin frameworks ni compilación.
- **Rationale**: es una sola página con pocas pantallas; sin dependencias no hay nada que
  instalar ni actualizar, y cualquiera puede abrir el código y entenderlo.
- **Alternatives considered**: React o Vue (agregan instalación y compilación sin necesidad);
  una app nativa para iPad (exige otra herramienta y no corre en Android ni en escritorio).

## 2. Cómo se abre y se publica

- **Decision**: se publica como sitio estático en GitHub Pages, como el prototipo anterior.
  Para probar en el computador se usa un servidor local de archivos (`python -m http.server`).
- **Rationale**: los módulos de JavaScript no se cargan abriendo el archivo con doble clic
  (el navegador lo bloquea). GitHub Pages solo entrega archivos: no recibe ni guarda datos,
  así que respeta «sin servidor de datos».
- **Alternatives considered**: un solo archivo HTML con todo adentro (difícil de mantener con
  26 clips y 5 capítulos); servidor propio (contradice el alcance).

## 3. Videos en la publicación

- **Decision**: los videos se comprimen en MP4 (H.264, sin audio, 720p) y se copian a la
  carpeta de publicación. En la carpeta de trabajo siguen fuera de git (`.gitignore`).
- **Rationale**: lo publicado tiene que estar en lo que recibe GitHub Pages. Como en el
  prototipo anterior, se usa una copia de publicación fuera de OneDrive que sí incluye los
  videos comprimidos. Clips cortos sin audio pesan poco; GitHub rechaza archivos de más de
  100 MB. Una tarea prepara esa copia y comprueba que todas las rutas carguen.
- **Alternatives considered**: alojar los videos en otro servicio (agrega un tercero);
  cargarlos desde la tablet (descartado en la spec).

## 4. Dos clips a la vez en iPad

- **Decision**: dos elementos `<video>` con `muted`, `loop`, `playsinline` y `autoplay`,
  iniciados juntos al aparecer la pregunta. La voz va en un elemento de audio aparte.
- **Rationale**: Safari de iPad reproduce varios videos a la vez solo si están silenciados y
  en línea. Como los clips no tienen sonido (decisión de la spec), cumple.
- **Alternatives considered**: un solo video con los dos personajes lado a lado (obligaría a
  rehacer el video si cambia el lado o la composición).

## 5. Audio en iPad

- **Decision**: el play grande de la pantalla infantil es el primer toque que habilita el audio.
  Desde ahí el resto de las voces suena sin pedir otro toque.
- **Rationale**: Safari no deja reproducir sonido hasta que el usuario toca la pantalla. Aun
  así, cada reproducción se comprueba (el navegador responde si la aceptó o la rechazó); si la
  rechaza, se muestra al adulto un botón para reanudar y la espera no corre. Una voz nueva corta
  la anterior, y el aviso de «terminó» de una voz cortada se ignora para no disparar esperas.
- **Alternatives considered**: pedir un toque antes de cada escena (interrumpe el cuento).

## 6. Esperas que se pueden pausar

- **Decision**: un temporizador propio que lleva el tiempo restante y se detiene al pausar.
  Usa el reloj del navegador que no salta si cambia la hora (`performance.now()`).
- **Rationale**: los temporizadores normales siguen corriendo en pausa o con la tablet
  bloqueada, y producirían «sin respuesta» falsos (SC-005).
- **Alternatives considered**: reiniciar la espera completa al reanudar (cambiaría el tiempo
  real que tuvo el niño).

## 7. Pausa automática

- **Decision**: escuchar los avisos del navegador de que la página dejó de verse
  (`visibilitychange` y `pagehide`) y pausar todo.
- **Rationale**: cubre bloqueo de pantalla, cambio de aplicación y cambio de pestaña. Como en
  tablets esos avisos no siempre llegan, no se depende de ellos para guardar (ver 8).
- **Alternatives considered**: detectar inactividad (confundiría a un niño que piensa con una
  tablet bloqueada).

## 8. Guardar y continuar

- **Decision**: cada partida se guarda en `localStorage` después de cada evento importante
  (respuesta, cambio de escena, pausa). La clave es `pukituki.partida.<código>` y otra clave
  guarda cuál es la última.
- **Rationale**: es pequeño (pocos kB por partida), no necesita permisos y sobrevive a
  recargar o cerrar el navegador. Al abrir, una partida que quedó `en_curso` se recupera como
  pausada. Si guardar falla, se avisa y se ofrece descargar el JSON; nunca se muestra como
  guardada una partida que no se guardó. Safari puede borrar estos datos si la página no se
  usa por varios días; por eso se recomienda descargar el JSON al terminar.
- **Alternatives considered**: IndexedDB (más complejo sin necesidad); guardar solo al final
  (se pierde todo si se cierra).

## 9. Código de la partida

- **Decision**: lo genera la app: `PT-AAAAMMDD-HHMM-XXXX` (fecha, hora y 4 letras al azar).
- **Rationale**: es legible para el adulto, no se repite en la práctica y no identifica al niño.
- **Alternatives considered**: un número correlativo (se repite entre tablets).

## 10. Descarga del JSON

- **Decision**: la vía principal es crear el archivo y descargarlo con un enlace de descarga.
  Aparte hay un botón «Compartir archivo», que solo aparece si el navegador permite compartir
  archivos JSON, y como último recurso «Mostrar texto» para copiarlo. Nada pasa solo: cada vía
  la elige el adulto.
- **Rationale**: Safari de iPad descarga a la app Archivos; algunos navegadores lo bloquean.
- **Alternatives considered**: enviarlo por correo o a un servidor (los datos saldrían de la tablet).

## 11. Barra y puntaje

- **Decision**: la barra va de −100 (Puki) a +100 (Tuki). Se guarda esa posición y además la
  posición orientada hacia el personaje con la dificultad (se invierte el signo si la dificultad
  es de Puki). Puntaje: orientada ≤ 5 → 0; de 5 a 50 → 1; más de 50 → 2. Centro: entre −5 y +5.
- **Rationale**: aplica la Decisión A de la spec sin perder la posición original.
- **Alternatives considered**: guardar solo el puntaje (se pierde información).

## 12. Subtítulos y textos

- **Decision**: cada texto tiene una clave (por ejemplo `c1_p1_pregunta`). El español sale del
  guion; portugués e inglés van en archivos aparte. Si falta una traducción, no se muestra
  subtítulo en ese idioma.
- **Rationale**: es la forma de diccionarios por idioma; permite traducir sin tocar el código.
- **Alternatives considered**: textos escritos dentro del código (obliga a programar para traducir).

## 13. Material provisional

- **Decision**: mientras no estén los videos, las escenas y clips declarados provisionales se
  muestran como una tarjeta con el código, el nombre y la descripción de la toma, y las voces
  sin archivo las lee la voz del navegador. Un archivo final que falta es falla técnica, no se
  reemplaza. El JSON marca `medios: "provisional"`. La voz del navegador se elige en este
  orden: español de Chile, luego de Latinoamérica, luego de España, prefiriendo voces
  «naturales». La voz en off no es provisional: son archivos de audio (ver 16).
- **Rationale**: permite probar todo el recorrido antes de producir los videos, sin confundir
  esas partidas con las finales.
- **Alternatives considered**: esperar todos los videos para programar (retrasa la entrega).

## 14. Velocidad ×2 en revisión

- **Decision**: en modo revisión, videos y audios a velocidad ×2 (o normal, si se elige); las
  esperas siguen en 40 s (FR-015).
- **Rationale**: permite a un profesional recorrer un capítulo rápido; esas partidas quedan
  marcadas como revisión y no se mezclan con las normales.
- **Alternatives considered**: acortar también las esperas (cambiaría el tiempo para responder); saltar escenas
  (se perdería el contexto de la pregunta).

## 15. Demostración 001

- **Decision**: el código de la demostración 001 se guarda en `_demo_001/`; no se reutiliza.
- **Rationale**: evita mezclar archivos de la demo con la app nueva; se conservan como antecedente.
- **Alternatives considered**: borrarlos (se pierde el antecedente).

## 16. Capas de imagen y sonido

- **Decision**: cuatro capas: video de la escena (con su sonido propio si `sonidoVideo`), voz
  en off en audio aparte, subtítulo arriba y controles. Cada escena es una toma corta; sus
  voces suenan una tras otra desde el inicio de la toma. La voz en off es una voz de IA (Fola,
  de Google AI Studio) y las voces de los personajes vienen dentro de los videos.
- **Rationale**: separar la voz en off del video permite cambiarla sin rehacer los videos
  (constitución: producción y programación separadas). Como cada toma es corta, no hace falta
  indicar en qué segundo entra cada voz.
- **Pendiente**: cuando un video traiga la voz de un personaje, la app no debe leerla además
  con la voz del navegador, y el subtítulo de esa voz necesita saber cuándo empieza (T057).
- **Alternatives considered**: todo el sonido dentro del video (cambiar una voz obliga a
  rehacer el video); un audio largo por capítulo (difícil de sincronizar y de continuar a mitad).

## 17. Transición a la pregunta

- **Decision** (aprobada por Javiera el 09-11): la última imagen de la escena se queda quieta
  y se funde en 0,5 s con los dos clips; luego aparecen barra y flecha y suena la pregunta.
- **Rationale**: un fundido corto es suave y no exige producir un video de transición.
- **Alternatives considered**: corte directo (brusco); video de transición propio (más producción).
