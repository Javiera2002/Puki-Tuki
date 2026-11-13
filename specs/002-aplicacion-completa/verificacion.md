# Verificación: versión 0.1.0 (09-11-2026)

Probado en Chrome de escritorio (1280 × 720) con material provisional. **No probado en iPad.**

## Pruebas automáticas

`node --test tests/*.test.js`: 21 de 21 pasan (puntaje, espera, estados de la partida, guardado,
JSON y contenido; las 77 voces de `contenido/historia.js` coinciden con `contenido/guion.md`). Vueltas a correr el
11-11-2026: 21 de 21.

## Recorridos de quickstart comprobados

| N.º | Resultado |
|---|---|
| 1 | La práctica sin respuesta se repite (3 presentaciones) y no avanza. ✔ |
| 2 | Al responder la práctica, sigue el cuento; se guarda posición −61 y su tiempo. ✔ |
| 3 | Pregunta con dos clips, Puki a la izquierda y Tuki a la derecha (tarjetas provisionales). ✔ |
| 4 | La flecha sin tocar la barra no hace nada. ✔ |
| 5 | Tocar un clip cuenta el toque y reinicia la espera. ✔ (el audio del diálogo es voz del navegador, provisional) |
| 6 | Tocar el medio de la barra y confirmar guarda «centro», posición 0, puntaje 0. ✔ |
| 7 | Sin tocar: se repite una vez y queda «sin respuesta» (probado con espera acortada a 3 s). ✔ |
| 8 | En pausa 8 s la pregunta no avanza. ✔ |
| 10 | Dejar en pausa → bienvenida → Continuar: sigue desde el inicio de la escena; la pregunta abierta se presenta de nuevo. ✔ |
| 12 | Terminar partida pide confirmación; queda «terminada antes» y las demás «no presentada». ✔ |
| 15–16 | Partidas guardadas (mantener presionado) → informe con puntaje por grupo y tabla; coincide con los datos. ✔ |
| 17b | Recargar la página con una partida en curso: aparece en pausa para continuar. ✔ |
| 18 | Modo revisión capítulo 1 a ×2: empieza en el capítulo 1 y al terminar vuelve a la bienvenida. ✔ |
| — | Puntaje: −93 con dificultad de Puki → orientada 93, puntaje 2. ✔ |

La pantalla de bienvenida (`src/pantallas/bienvenida.js`, `estilos/app.css`) tiene cambios de
diseño posteriores a estos recorridos. Los recorridos que pasan por ella (10, 12, 15–16, 17b y
18) se repiten en T052.

## Pendiente o con limitaciones

- **iPad con Safari:** sin probar (T041). Probar sonido, dos videos a la vez, pausa al bloquear y descarga del JSON.
- **Descarga del JSON:** el texto se comprobó; la descarga del archivo no se probó en tablet.
- **Recorrido 9 (bloquear la tablet)** y **13 (falla técnica)**: programados, sin probar.
- **Medios provisionales:** escenas y clips son tarjetas con la descripción de la toma; las voces de
  Puki, Tuki, la profesora y los compañeros las lee la voz del navegador hasta tener los videos de Flow.
- **Subtítulos pt/en:** la franja funciona, pero faltan las traducciones.
- **Toda la historia está cargada** (capítulos 1 a 5: 88 escenas y 28 clips, todos provisionales),
  pero solo el capítulo 1 se recorrió de punta a punta.
- **SC-002 (dos clips a la vez)** no se puede comprobar con tarjetas: necesita videos reales.
- **Voz del navegador:** en Chrome, las voces «naturales» o «Google» pueden necesitar internet. Solo
  leen texto del guion, nunca datos de la partida. Desaparece cuando estén los videos finales.

## Revisión de la spec contra el código (11-11-2026)

Lectura completa de spec, guion, constitución y código, sin cambiar el código. La spec, el
modelo de datos y los contratos describen ahora lo que el código hace. Lo que el código todavía
no cumple:

| Qué dice la spec | Qué hace el código 0.1.0 | Tarea |
|---|---|---|
| Los tres contenidos extra del PSC-17 conservan la marca de propuesta (constitución II) | El informe la muestra en el nombre del grupo; los ítems de `historia.js` y del JSON no la llevan | T055 |
| El JSON registra las salidas (`volver_inicio`) | «Dejar en pausa y volver al inicio» no deja evento propio; queda solo la pausa | T056 |
| El JSON registra `informe_abierto` y `descarga` | El evento se anota, pero no se guarda si el informe se abre desde «Partidas guardadas» | T056 |
| La voz del navegador lee solo voces declaradas provisionales | Lee cualquier voz sin archivo. Con videos finales que traigan la voz del personaje, se oiría dos veces | T057 |
| Cada voz muestra su subtítulo traducido (FR-014) | Las voces dentro de un video no tienen todavía cómo sincronizar su subtítulo | T057 |
| `grupo` coincide con el primer ítem; textos iguales al guion | No hay prueba de `grupo`. Los títulos de capítulo de `es.js` agregan «(sala)» o «(patio)», que el guion no tiene; se ven solo en el selector del modo revisión | T058 |
| La carpeta funciona sola | Funciona, pero `historia.js` y `es.js` se generan con archivos de fuera | Propuesta H |

## Qué falta para entregarla a profesionales

1. Videos de las 88 escenas y los 28 clips (T051). Las voces de los personajes vienen en ellos.
2. Prueba en iPad con Safari (T041) y recorrido completo de los capítulos 2 a 5 (T046, T052).
3. Probar bloqueo de la tablet y falla técnica (recorridos 9 y 13).
4. Traducciones al portugués y al inglés (T049), si los profesionales las necesitan.
5. Ajustes de la fase 12 (T055 a T058) y guía para el profesional (T059).
6. Publicación (T053) y README final (T054).
7. Fuera de la app: cuestionario de profesionales.

## Interfaz de decisión y pausa (13-11-2026)

- Integrados fondo crema elegido, barra ilustrada, círculo morado móvil, flecha y pausa amarilla.
- Panel de pausa con la composición de Javiera y botones funcionales; su arte contiene texto en español.
- 21/21 pruebas automáticas pasan. Sintaxis de pregunta.js y pausa.js comprobada con Node.
- Recorrido manual en navegador integrado de escritorio: práctica con flecha deshabilitada
  antes del toque, arrastre que cambia la posición, toque central que deja 0 y confirmación
  que avanza a I-04. Panel de pausa visible, continuar funciona, terminar muestra la segunda
  confirmación sin terminar al primer toque. El interruptor cambia a apagado y conserva ese
  estado al cerrar y reabrir el menú.
- Revisadas las proporciones de las imágenes en pantalla; la barra no estira los personajes.
- Pendiente: Safari en iPad, videos reales y prueba completa de los capítulos. Esta comprobación
  no reemplaza T041 ni T052. La mano permanece como propuesta, sin mostrarse.
