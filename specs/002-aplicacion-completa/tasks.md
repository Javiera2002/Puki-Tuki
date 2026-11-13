---

description: "Lista de tareas para programar la aplicación completa Puki y Tuki"
---

# Tasks: Aplicación completa Puki y Tuki

**Input**: `specs/002-aplicacion-completa/` (spec, plan, research, data-model, contracts, quickstart)

**Tests**: se incluyen pruebas automáticas solo de la lógica que decide qué se guarda
(puntaje, esperas, estados, guardado, exportación y contenido), porque SC-003 y SC-005 exigen
comprobar que los datos coinciden. Las pantallas se prueban a mano con quickstart.md.

**Orden**: primero el capítulo 1 completo, de la bienvenida al JSON, con material provisional
(fases 1 a 8, el MVP), probado en iPad. Después los capítulos 2 a 5 como datos (fase 9), el
modo revisión (fase 10) y el cierre (fase 11).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: se puede hacer en paralelo (otro archivo, sin depender de tareas pendientes)
- **[Story]**: historia de usuario de la spec (US1 a US7)

---

## Phase 1: Setup

- [x] T001 Mover la demostración 001 (`app.js`, `engine.js`, `content.js`, `styles.css`, `tests/`, `test-output/`) a `_demo_001/` y actualizar `README.md`
- [x] T002 Crear las carpetas del plan: `src/motor/`, `src/datos/`, `src/pantallas/`, `estilos/`, `contenido/subtitulos/`, `media/personajes/`, `media/escenas/`, `media/clips/`, `media/audio/`, `media/provisional/`, `tests/`
- [x] T003 [P] Crear `index.html` con un contenedor por pantalla, carga de `src/main.js` como módulo y orientación horizontal
- [x] T004 [P] Crear `config.js` con los parámetros de data-model.md (espera 40 s, 1 repetición, centro 5, límite 50, ×2 solo en medios, 3000 ms)
- [x] T005 [P] Crear `estilos/app.css` con colores suaves, botones grandes y la pantalla del cuento casi completa
- [x] T006 [P] Poner en `media/personajes/` la hoja de personajes de Puki y Tuki; en `media/provisional/` van las imágenes que existan, y para las que falten la app dibuja una tarjeta de color con el nombre de la toma (ver research 13)

---

## Phase 2: Foundational

**Purpose**: lo que usan todas las historias. Ninguna historia empieza antes de terminar esta fase.

- [x] T007 [P] Escribir `tests/puntaje.test.js`: posición orientada según `dificultad`, centro ±5, puntajes 0-1-2 en los bordes (5, 50), práctica sin puntaje y suma por grupo con faltantes
- [x] T008 [P] Escribir `tests/temporizador.test.js`: espera que se pausa, se reanuda con el tiempo restante y se reinicia al tocar
- [x] T009 [P] Escribir `tests/partida.test.js`: estados de la partida y de las respuestas según data-model.md, sin volver atrás ni duplicar; `presentada` pasa a `no_presentada` al continuar y al terminar antes, conservando los movimientos como uso; una partida `en_curso` se recupera como `en_pausa`
- [x] T010 [P] Implementar `src/datos/puntaje.js` hasta que pase T007
- [x] T011 [P] Implementar `src/motor/temporizador.js` con `performance.now()` hasta que pase T008
- [x] T012 Implementar `src/datos/partida.js` (código `PT-AAAAMMDD-HHMM-XXXX`, 13 respuestas `no_presentada`, cambios de estado, eventos) hasta que pase T009
- [x] T013 Implementar `src/datos/almacen.js`: guardar la partida en `localStorage` después de cada respuesta y escena (clave `pukituki.partida.<código>`), guardar cuál es la última, listar todas, recuperar al abrir una `en_curso` como `en_pausa`, y si guardar falla, registrar `guardado_fallido`, avisar y ofrecer descargar el JSON sin mostrarla como guardada
- [x] T014 [P] Escribir `contenido/historia.js` con introducción, práctica, capítulo 1 (preguntas 1 y 2) y despedida, según contracts/contenido.md, con escenas, clips y voces declarados provisionales
- [x] T015 [P] Escribir `contenido/subtitulos/es.js` copiando palabra por palabra de `contenido/guion.md` todas las voces de la introducción, el capítulo 1 y la despedida
- [x] T016 Escribir `tests/contenido.test.js`: claves de `historia.js` presentes en `es.js`, todas las voces (narración, diálogos y preguntas) iguales a `contenido/guion.md` y `dificultad` igual a la tabla de la spec
- [x] T017 Implementar `src/motor/medios.js`: reproducir video y voz comprobando que el navegador aceptó la reproducción (si la rechaza, botón para reanudar y sin correr la espera); una sola voz a la vez (una nueva corta la anterior e ignora su aviso de término); las voces de una escena una tras otra; sonido del video solo si `sonidoVideo`; usar lo provisional solo si está declarado, y si un archivo final no carga, reintentar una vez y reportar falla técnica
- [x] T018 Implementar `src/motor/recorrido.js`: avanzar por los pasos de `historia.js`, recordar la última escena y pausar o reanudar todo junto
- [x] T019 Implementar `src/main.js`: mostrar una pantalla a la vez y pausar todo con `visibilitychange` y `pagehide`

**Checkpoint**: `node --test tests/` pasa y el motor recorre el capítulo 1 en datos.

---

## Phase 3: User Story 1 - Preparar y entrar al cuento (P1) 🎯 MVP

**Goal**: el adulto prepara la partida y el niño llega a la introducción.
**Independent Test**: quickstart, recorrido 2 (el 1 se comprueba al terminar la fase 5).

- [x] T020 [US1] Implementar `src/pantallas/bienvenida.js`: «Continuar partida» (solo si la última está en pausa), «Nueva partida», probar sonido, idioma de subtítulos, quién prueba y edad opcionales
- [x] T021 [US1] Implementar `src/pantallas/inicio.js`: Puki, Tuki y play grande sin texto; el toque habilita el audio y se comprueba que la primera voz sonó
- [x] T022 [US1] Implementar la introducción en `src/pantallas/escena.js` hasta llegar a la práctica

---

## Phase 4: User Story 2 - Recorrer los capítulos y responder (P1)

**Goal**: cada pregunta muestra dos clips en bucle, la barra y la flecha.
**Independent Test**: quickstart, recorridos 3 a 6 y 17c.

- [x] T023 [US2] Implementar en `src/pantallas/escena.js` las capas del cuento (video, voz en off, subtítulo arriba, controles) a casi toda la pantalla
- [x] T024 [US2] Implementar en `src/pantallas/pregunta.js` la transición: la última imagen de la escena queda quieta y se funde en 0,5 s con los dos clips; luego barra, flecha y pregunta; al confirmar, fundido de vuelta
- [x] T025 [US2] Implementar en `src/pantallas/pregunta.js` los dos clips grandes (Puki izquierda, Tuki derecha), `muted`, `loop`, `playsinline`, comprobando que ambos empezaron
- [x] T026 [US2] Implementar en `src/pantallas/pregunta.js` la barra libre de −100 a +100 que parte en el centro, se arrastra o se toca, y destaca suavemente el lado al que se acerca (verde de Puki a naranjo de Tuki)
- [x] T027 [US2] Implementar la flecha en `src/pantallas/pregunta.js`: inactiva sin toque, una sola confirmación aunque se toque varias veces, guarda `respondida` o `centro` y `tiempoHastaConfirmarMs`
- [x] T028 [US2] Implementar el toque de un clip en `src/pantallas/pregunta.js`: suena su diálogo (cortando cualquier otra voz) y se cuenta en `toquesClip`

---

## Phase 5: User Story 3 - Esperar, repetir y guardar «sin respuesta» (P1)

**Goal**: la pregunta se repite una vez y luego queda «sin respuesta».
**Independent Test**: quickstart, recorridos 1 y 7.

- [x] T029 [US3] Conectar `src/motor/temporizador.js` en `src/pantallas/pregunta.js`: 40 s tras la voz, repetición, 40 s, «sin respuesta» y seguir; tocar barra o clip reinicia la espera, no las repeticiones
- [x] T030 [US3] Guardar en la respuesta `presentaciones`, `movimientosBarra` y `ultimaPosicionSinConfirmar`, y cancelar la repetición pendiente al confirmar
- [x] T031 [US1] Completar la práctica (pregunta 0) en `src/pantallas/pregunta.js`: se repite sin límite hasta responder y se guarda en `practica` con su tiempo, sin puntaje

---

## Phase 6: User Story 4 - Pausar, continuar y empezar de nuevo (P1)

**Goal**: pausar sin perder nada y continuar como en una película.
**Independent Test**: quickstart, recorridos 8 a 12 y 17b.

- [x] T032 [US4] Implementar `src/pantallas/pausa.js` con continuar, sonido, dejar en pausa y volver al inicio, y terminar la partida (con confirmación)
- [x] T033 [US4] Implementar en `src/motor/recorrido.js` continuar desde el inicio de `ultimaEscena`, con la pregunta que estaba presentada de vuelta en `no_presentada`
- [x] T034 [US4] Implementar «terminar partida» en `src/datos/partida.js`: estado `terminada_antes`, pregunta abierta a `no_presentada` con sus movimientos como uso, y evento
- [x] T035 [US4] Registrar `pausa_automatica`, `recuperada` y `continuar`, y comprobar que en pausa no corren esperas ni medios

---

## Phase 7: User Story 5 - Despedirse y entregar la tablet (P1)

**Goal**: cierre en la sala y acceso discreto al informe.
**Independent Test**: quickstart, recorridos 14 y 15.

- [x] T036 [US5] Implementar `src/pantallas/despedida.js`: escena final, estado `terminada` y acceso al informe en una esquina que se abre manteniendo presionado 3 s

---

## Phase 8: User Story 6 - Informe y JSON (P1)

**Goal**: el adulto ve el resultado y descarga el JSON de cualquier partida.
**Independent Test**: quickstart, recorridos 16 y 17.

- [x] T037 [P] [US6] Escribir `tests/exportar.test.js`: el JSON cumple contracts/exportacion-json.md con las 13 respuestas en cualquier estado y la práctica sin puntaje
- [x] T038 [US6] Implementar `src/datos/exportar.js`: armar el JSON y su nombre; descarga como vía principal; botón «Compartir archivo» solo si el navegador puede compartir JSON; «Mostrar texto» como último recurso
- [x] T039 [US6] Implementar `src/pantallas/informe.js`: puntaje por grupo con la nota de hipótesis de diseño, tabla por pregunta (contenido, personaje al que se pareció, posición), aparte sin respuesta, no presentadas y falla técnica, y los botones de T038
- [x] T040 [US6] Agregar en `src/pantallas/bienvenida.js` «Partidas guardadas» (mantener presionado): lista de partidas con su estado; cada una abre su informe y su descarga
- [ ] T041 Probar el capítulo 1 en un iPad con Safari según quickstart (3, 5, 7, 8, 9, 10, 17, 17b) y anotar lo observado en `specs/002-aplicacion-completa/verificacion.md`

**Checkpoint MVP**: el capítulo 1 funciona de la bienvenida al JSON, también en iPad. Revisar con Javiera antes de seguir.

---

## Phase 9: Capítulos 2 a 5 (US2)

**Goal**: el cuento completo, agregando solo datos. Se hacen en orden porque editan los mismos archivos.

- [x] T042 [US2] Agregar a `contenido/historia.js`, `contenido/subtitulos/es.js` y `media/provisional/` el capítulo 2 (preguntas 3 a 5)
- [x] T043 [US2] Agregar el capítulo 3 (preguntas 6 y 7)
- [x] T044 [US2] Agregar el capítulo 4 (preguntas 8 a 12)
- [x] T045 [US2] Agregar el capítulo 5 (pregunta 13) y la despedida en la sala
- [ ] T046 [US2] Ejecutar `tests/contenido.test.js` con las 13 preguntas y recorrer el cuento completo

---

## Phase 10: User Story 7 - Revisión por profesionales (P2)

**Goal**: ver un capítulo suelto, a ×2 y con subtítulos traducidos.
**Independent Test**: quickstart, recorrido 18.

- [x] T047 [US7] Implementar el modo revisión en `src/pantallas/bienvenida.js`: elegir capítulo y velocidad; la partida queda marcada como revisión
- [x] T048 [US7] Aplicar la velocidad ×2 a videos y voces en `src/motor/medios.js`; las esperas siguen en 40 s
- [ ] T049 [P] [US7] Crear `contenido/subtitulos/pt.js` y `contenido/subtitulos/en.js` con las claves de `es.js` (traducción por revisar)
- [x] T050 [US7] Mostrar el subtítulo del idioma elegido arriba de la escena en `src/pantallas/escena.js` y `src/pantallas/pregunta.js`, sin tapar los clips

---

## Phase 11: Polish

- [ ] T051 Reemplazar los medios provisionales por los videos y voces finales a medida que existan, quitar la marca `provisional` y dejar `medios: "final"`
- [ ] T052 Recorrer quickstart.md completo en Chrome y en un iPad con Safari; completar `specs/002-aplicacion-completa/verificacion.md`
- [ ] T053 Preparar la copia de publicación fuera de OneDrive con `app/` y los videos comprimidos, publicarla en GitHub Pages y comprobar que todas las rutas de `media/` cargan
- [ ] T054 Actualizar `README.md` con cómo abrir, probar y publicar la aplicación

---

## Phase 12: Ajustes detectados al revisar la spec (11-11-2026)

**Purpose**: dejar el código igual a lo que dicen la spec, el modelo de datos y los contratos.
Ninguna cambia una decisión de diseño. Detalle en `verificacion.md`.

- [ ] T055 Marcar `propuesta: true` en los ítems PSC-17 9, 6 y 11 de `contenido/historia.js` para que salga en el JSON (constitución II, data-model.md)
- [ ] T056 Registrar el evento `volver_inicio` y guardar la partida al registrar `informe_abierto` y `descarga` en `src/main.js` y `src/pantallas/informe.js` (contracts/exportacion-json.md)
- [ ] T057 En `src/motor/medios.js` y `src/pantallas/escena.js`: cuando el video de una escena es final y trae la voz de un personaje, no leerla con la voz del navegador y mostrar su subtítulo en el momento en que se dice (research 16); leer con la voz del navegador solo las voces declaradas `provisional`
- [ ] T058 Ampliar `tests/contenido.test.js`: `grupo` coincide con el primer ítem y los títulos de capítulo de `contenido/subtitulos/es.js` son iguales a los de `contenido/guion.md`
- [ ] T059 Escribir una guía de una página para el profesional que revisa: cómo abrir la aplicación, qué hacer en la pantalla final y cómo descargar el JSON

---

**Estado 11-11-2026 (v0.1.0):** hechas las tareas marcadas. Los capítulos 2 a 5 están cargados como datos, pero solo el capítulo 1 se recorrió entero. Falta T041 (iPad), T046, T049 (traducciones), T051 a T054 y la fase 12. Ver `verificacion.md`.

## Dependencies & Execution Order

- Fase 1 → Fase 2 → Fases 3 a 8 en orden → Fase 9 → Fase 10 → Fase 11.
- T031 (práctica) necesita la barra, la flecha y la espera (T026, T027, T029).
- T040 necesita el informe (T039). T041 cierra el MVP.
- Fase 10 empieza después de la Fase 8; T048 necesita T017 y T029.
- Las tareas [P] de una misma fase se pueden hacer a la vez porque tocan archivos distintos.
- Fase 9 usa tarjetas provisionales mientras no existan los videos de los clips (Propuesta B).
- Fase 12: T055 a T058 antes de T051; T059 antes de entregar a profesionales.
