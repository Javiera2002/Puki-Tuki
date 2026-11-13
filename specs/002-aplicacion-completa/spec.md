# Feature Specification: Aplicación completa Puki y Tuki

**Feature Branch**: Sin rama nueva; identificador 002-aplicacion-completa.
**Created**: 2026-11-08 | **Updated**: 2026-11-11
**Status**: Decisiones A, C, D y E cerradas el 09-11 y F el 11-11. Siguen abiertas la propuesta B (clips por
pregunta) y las de la sección «Propuestas abiertas». Programada la versión 0.1.0 con material
provisional; lo que se probó y lo que falta está en `verificacion.md` y `tasks.md`.
**Input**: Especificar toda la aplicación antes de programar. Recorrido: entrada del adulto →
inicio infantil → introducción y práctica → cinco capítulos con preguntas → despedida →
informe adulto. Guardar las partidas, descargar JSON, poder continuar la última partida y
mostrar dos clips a la vez en cada pregunta.

## Alcance y fuente de decisiones

Esta carpeta de aplicación funciona por sí sola. Lo marcado como **propuesta** todavía no está
aprobado.

El guion oficial es `contenido/guion.md`, dentro de esta carpeta. Manda sobre todo: texto
de cada pregunta, qué personaje tiene la dificultad y en qué orden se nombran. Tiene cinco
capítulos y trece preguntas: diez ítems SDQ y tres contenidos adicionales del PSC-17
(propuesta). No se reescriben preguntas al programar. El módulo de reconocimiento de
emociones está en pausa.

En esta etapa la aplicación la revisan profesionales adultos; la especificación describe la
experiencia infantil prevista, sin autorizar su aplicación a niños. Es solo frontend para
tablet, sin servidor. Los videos y audios se preparan como recursos del proyecto; quien usa
la aplicación no carga archivos.

La demostración 001 (`specs/001-recorrido-capitulos/` y `_demo_001/`) se programó antes de
tiempo y no es base obligatoria.

### Preguntas y personaje con la dificultad (según el guion)

Puki siempre a la izquierda y Tuki a la derecha. Quién tiene la dificultad se turna.

| N.º | Capítulo | Ítem | Personaje con la dificultad | Se nombra primero |
|---|---|---|---|---|
| 1 | 1. Día de escuela | SDQ 6 | Tuki (prefiere jugar solo) | dificultad |
| 2 | 1. Día de escuela | SDQ 3 | Puki (le duele la guata) | dificultad |
| 3 | 2. Educación Física | SDQ 16 | Puki (nervioso ante lo nuevo) | dificultad |
| 4 | 2. Educación Física | PSC 9 (propuesta) | Tuki (malo para todo) | dificultad |
| 5 | 2. Educación Física | PSC 6 (propuesta) | Tuki (nunca le va a salir) | dificultad |
| 6 | 3. La colación | SDQ 23 | Tuki (mejor con adultos) | dificultad |
| 7 | 3. La colación | SDQ 13 / PSC 2 | Puki (triste muchos días) | dificultad |
| 8 | 4. El recreo | SDQ 14 | Puki (no lo llaman a jugar) | sin dificultad |
| 9 | 4. El recreo | SDQ 11 | Puki (sin un buen amigo) | sin dificultad |
| 10 | 4. El recreo | PSC 11 (propuesta) | Tuki (se divierte menos) | sin dificultad |
| 11 | 4. El recreo | SDQ 24 | Puki (muchos miedos) | dificultad |
| 12 | 4. El recreo | SDQ 19 | Tuki (se burlan de él) | dificultad |
| 13 | 5. De vuelta a casa | SDQ 8 / PSC 15 | Tuki (se preocupa mucho) | dificultad |

Cuando una pregunta corresponde a dos instrumentos, el SDQ va primero y el PSC se registra
igual.

## User Scenarios & Testing *(mandatory)*

Cómo leer esta sección: cada *historia de usuario* cuenta algo que una persona hace con la
aplicación. Debajo, cada *escenario de aceptación* es una prueba que se hará al terminar:
**Given** = la situación de partida, **When** = lo que hace la persona, **Then** = lo que la
aplicación debe hacer.

### User Story 1 - Preparar y entrar al cuento (Priority: P1)

El adulto entra a una pantalla de bienvenida. Puede continuar la última partida o empezar
una nueva. El niño ve a Puki y Tuki con un play grande, sin texto. Al tocarlo comienza la
introducción y la práctica de manzana y plátano.

**Independent Test**: desde la entrada del adulto, llegar a la práctica sin que el niño lea
ni complete formularios.

**Acceptance Scenarios**:

1. **Given** la bienvenida, **When** el adulto empieza una partida nueva, **Then** la
   aplicación le asigna un código propio y pasa a la pantalla infantil con el play.
2. **Given** la pantalla infantil, **When** se toca play, **Then** suena la introducción del
   guion: presentación, ejemplo de frutas, uso de la barra, significado del centro y flecha.
3. **Given** la práctica, **When** el niño elige y confirma, **Then** comienza el cuento. La
   elección de fruta se guarda aparte de las respuestas de los instrumentos.
4. **Given** la práctica sin respuesta, **When** se agota la espera, **Then** la práctica se
   repite. No se avanza al cuento sin responderla.

### User Story 2 - Recorrer los capítulos y responder (Priority: P1)

El cuento ocupa casi toda la pantalla. En cada pregunta se detiene la narración y aparecen
dos videos grandes lado a lado, Puki a la izquierda y Tuki a la derecha. Cada uno muestra en
bucle, sin sonido, lo que hace ese personaje en esa parte del guion. Debajo está la barra
ilustrada y abajo a la derecha la flecha.

Transición: al terminar la escena anterior a la pregunta, su última imagen se
queda quieta y se funde en medio segundo con los dos clips; después aparecen la barra y la
flecha y suena la pregunta. Al confirmar, los clips se funden de vuelta al cuento.

**Independent Test**: una pregunta de cada capítulo; comprobar que cada clip muestra la
experiencia de su personaje, la elección y la confirmación.

**Acceptance Scenarios**:

1. **Given** la pregunta 1, **When** aparecen los clips, **Then** Tuki juega solo a la derecha
   y Puki con compañeros a la izquierda.
2. **Given** los dos clips, **When** el niño toca uno, **Then** se vuelve a escuchar lo que dice
   el guion de ese personaje y la espera vuelve a empezar.
3. **Given** la barra, **When** se mueve hacia un personaje, **Then** ese lado se destaca
   suavemente. La señal comunica selección, no acierto.
4. **Given** la barra tocada, **When** el niño la cambia antes de confirmar, **Then** vale la
   última posición. Al tocar la flecha se confirma y sigue el cuento.
5. **Given** el niño toca el medio de la barra, **When** confirma, **Then** se guarda como centro
   («no me pasa como a ninguno»), distinto de «sin respuesta».
6. **Given** la barra nunca tocada, **When** se toca la flecha, **Then** no pasa nada.
7. **Given** el capítulo 5 terminado, **When** sigue el cuento, **Then** llega a la despedida.

### User Story 3 - Esperar, repetir y guardar «sin respuesta» (Priority: P1)

Si no hay respuesta, la pregunta se repite una vez. Si sigue sin respuesta, queda «sin
respuesta» y el cuento continúa. No se deduce la causa.

**Independent Test**: en una pregunta, no tocar nada (quickstart, recorrido 7).

**Acceptance Scenarios**:

1. **Given** ninguna interacción, **When** pasan 40 s desde que termina la voz de la pregunta,
   **Then** la pregunta se repite.
2. **Given** la repetición sin respuesta, **When** pasan otros 40 s, **Then** se guarda «sin
   respuesta» y sigue la escena siguiente, sin saltarse partes del cuento.
3. **Given** movimientos de la barra sin confirmar, **When** se cierra la pregunta, **Then** se
   guardan como uso, no como respuesta.
4. **Given** una respuesta confirmada, **When** quedaba una repetición pendiente, **Then** se
   cancela.
5. **Given** una pregunta ya pasada, **When** el cuento sigue, **Then** no se vuelve a preguntar.

### User Story 4 - Pausar, continuar y empezar de nuevo (Priority: P1)

Como en una película: al volver se ofrece continuar donde quedó o empezar de nuevo.

**Independent Test**: pausar en una pregunta, salir, continuar y terminar antes (quickstart,
recorridos 8 a 12 y 17b).

**Acceptance Scenarios**:

1. **Given** una partida empezada, **When** se toca el botón de pausa de la esquina, **Then**
   aparecen: continuar, sonido, dejar en pausa y volver al inicio, y terminar la partida.
2. **Given** «dejar en pausa y volver al inicio», **When** se vuelve a entrar, **Then** la
   bienvenida ofrece «Continuar» la última partida y «Empezar de nuevo».
3. **Given** continuar, **When** se reanuda, **Then** se pasa otra vez por la pantalla del
   play (el navegador exige un toque para dejar sonar el audio) y el cuento parte desde el
   inicio de la escena donde quedó, como una película que retoma unos segundos antes, con las
   respuestas confirmadas guardadas y sin duplicarlas. Si había una pregunta abierta, se
   presenta de nuevo.
4. **Given** empezar de nuevo, **When** se crea la partida nueva, **Then** recibe otro código y
   las partidas anteriores quedan guardadas.
5. **Given** «terminar la partida», **When** se confirma, **Then** la partida queda cerrada y
   guardada; las preguntas que faltaban quedan como no presentadas. Terminar no implica que
   algo salió mal, solo que no se continuará.
6. **Given** la tablet se bloquea, se cambia de aplicación o se sale de la pestaña, **When**
   ocurre, **Then** la partida se pausa sola y no corren las esperas.
7. **Given** pausa, **When** pasa el tiempo, **Then** no avanzan cuento, clips ni esperas.

### User Story 5 - Despedirse y entregar la tablet (Priority: P1)

El capítulo 5 ocurre en la sala, porque de pre-kínder a segundo básico las familias suelen
ir a buscar a los niños a la sala. Puki y Tuki se despiden mirando a la pantalla y la voz
pide pasar la tablet al adulto. Después queda una pantalla quieta con un acceso discreto al
informe.

**Independent Test**: terminar el cuento y abrir el informe (quickstart, recorridos 14 y 15).

**Acceptance Scenarios**:

1. **Given** las últimas escenas del capítulo 5, **When** Puki y Tuki se despiden, **Then**
   se escucha «Ahora pásale la tablet al adulto que está contigo» y la partida queda terminada.
2. **Given** la pantalla final, **When** el adulto mantiene presionado el acceso al informe,
   **Then** ve la partida recién jugada, no una anterior.

### User Story 6 - Consultar el informe y descargar el JSON (Priority: P1)

El adulto ve el puntaje por grupo, después una tabla con cada pregunta, a qué personaje se
pareció y cuánto, y aparte las que quedaron sin respuesta, no presentadas o con falla
técnica. Puede descargar el JSON aunque la partida esté incompleta.

**Independent Test**: comparar informe y JSON con lo respondido (quickstart, recorridos 16 y 17).

**Acceptance Scenarios**:

1. **Given** una respuesta confirmada, **When** aparece en el informe, **Then** coincide con la
   pregunta, el personaje y la posición guardados.
2. **Given** «sin respuesta», «no presentada» o «falla técnica», **When** se muestran,
   **Then** se distinguen entre sí y ninguna se convierte en centro ni en puntaje.
3. **Given** una partida incompleta, **When** el adulto abre «Partidas guardadas» en la
   bienvenida y descarga su JSON, **Then** contiene lo registrado y el estado de la partida.

### User Story 7 - Revisión por profesionales (Priority: P2)

Los profesionales pueden ver un capítulo suelto, acelerar a ×2 y leer arriba de la escena el
texto traducido (portugués o inglés). El audio queda en español.

**Independent Test**: ver el capítulo 3 a ×2 con subtítulos (quickstart, recorrido 18).

**Acceptance Scenarios**:

1. **Given** el modo revisión, **When** se elige un capítulo, **Then** se reproduce desde su
   inicio, sin introducción ni práctica, y la partida queda marcada como revisión. Al terminar
   el capítulo se vuelve a la bienvenida, sin despedida. Las preguntas de los otros capítulos
   quedan como no presentadas.
2. **Given** un idioma de subtítulo elegido, **When** suena una voz, **Then** su traducción
   aparece arriba, sin tapar la escena ni los clips.

### Edge Cases

- Tocar la flecha varias veces: una sola confirmación y un solo avance.
- Volver al inicio mientras suena una pregunta: se detienen audio y esperas.
- **Falla técnica**: un video o audio no carga o no se reproduce (archivo que falta, sin
  memoria, error del navegador). Se reintenta una vez; si sigue fallando, se avisa al adulto
  y la pregunta queda como «falla técnica», no como «sin respuesta». Si lo que falla es una
  escena del cuento (no una pregunta), se anota la falla, se avisa al adulto y el cuento sigue.
- Tablet en vertical: la aplicación pide girarla; se usa en horizontal.
- Recargar o cerrar la aplicación: la partida se guarda en la memoria del navegador de esa
  tablet después de cada respuesta y cada escena. Si la app se cerró sin pausar, al volver a
  abrirla la última partida aparece en pausa y se puede continuar. Se pierde si se borran los
  datos del navegador o en modo incógnito; Safari también puede borrarlos si la página no se
  usa por varios días, por eso conviene descargar el JSON al terminar. No hay sincronización.
- Si guardar falla (memoria llena), se avisa al adulto y se ofrece descargar el JSON de inmediato.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Cubrir bienvenida del adulto, inicio infantil, introducción, práctica, cinco
  capítulos, despedida, informe y modo revisión, con los textos del guion sin reescribirlos.
- **FR-002**: La bienvenida se ve como un juego infantil colorido, con Puki y Tuki a un lado
  (diseño de Javiera). Tiene dos botones, «Nueva partida» y «Continuar partida» (activo solo
  si la última partida está en pausa); un botón para probar el sonido; el idioma de los subtítulos (ninguno,
  portugués o inglés); el acceso al modo revisión; «Partidas guardadas» (se abre manteniendo
  presionado), para ver el informe y descargar el JSON de cualquier partida, también
  incompleta; y dos campos opcionales: quién prueba y edad del niño. No se pide el nombre del niño.
- **FR-003**: El inicio infantil muestra a Puki y Tuki y un play grande, sin texto.
- **FR-004**: En cada pregunta, dos clips grandes a la vez, Puki a la izquierda y Tuki a la
  derecha, en bucle y sin sonido. Tocar un clip vuelve a reproducir el diálogo del guion de
  ese personaje. Si el guion no le da diálogo en esa parte, no suena nada y el toque se
  cuenta igual (Decisión F).
- **FR-005**: Barra sin pasos que parte en el centro. Zona del centro pequeña: ±5 en una escala
  de −100 a +100; fuera de ella indica un lado. Tocar la barra, aunque quede
  en el centro, cuenta como elección. Sin tocarla, la flecha no hace nada. El lado al que se
  acerca se destaca suavemente, con colores del verde de Puki al naranjo de Tuki.
- **FR-006**: Espera de 40 s después de cada presentación de la pregunta, contados desde que
  termina su voz (parámetro ajustable). Una repetición. Después, «sin respuesta» y continúa. Tocar la barra o un clip
  reinicia la espera, no el número de repeticiones.
- **FR-007**: La práctica se repite mientras no se responda.
- **FR-008**: No se vuelve a preguntar una pregunta pasada. Una elección sin confirmar no es
  respuesta.
- **FR-009**: Cada partida tiene su propio código. Se puede continuar solo la última. Todas
  las partidas se guardan, también las incompletas y las terminadas antes de tiempo.
- **FR-010**: Durante el cuento hay un botón de pausa en una esquina. El menú de pausa tiene
  continuar, sonido, dejar en pausa y volver al inicio, y terminar la partida (pide tocar dos
  veces para confirmar). Pausa automática al bloquear la tablet o salir de la aplicación.
- **FR-011**: Despedida en la sala con la indicación por voz de pasar la tablet al adulto.
  El acceso al informe es discreto: se mantiene presionado 3 s (parámetro ajustable), para
  que el niño no lo abra por accidente. «Partidas guardadas» se abre igual.
- **FR-012**: Informe con puntaje por grupo (Decisión A), tabla por pregunta (contenido,
  personaje al que se pareció y posición) y aparte las preguntas sin respuesta, no
  presentadas o con falla técnica. Sin frases redactadas ni IA.
- **FR-013**: Descarga de un JSON por partida, también incompleta (ver Decisión E).
- **FR-014**: Textos en diccionario por idioma. Español con audio; portugués e inglés como
  subtítulo en una franja blanca con letra negra, arriba de la escena. La franja usa el espacio
  que sobra porque el video no llena la pantalla de la tablet; no tapa la imagen ni la barra.
- **FR-015**: Modo revisión: elegir un capítulo y la velocidad (×2 o normal). La velocidad
  cambia videos y voces; las esperas siguen en 40 s. Esas partidas quedan marcadas como
  revisión.
- **FR-016**: Colores suaves, fondos despejados, controles grandes e ilustrados. Se usa con la
  tablet en horizontal. Escenarios: sala y patio con cancha sencilla y un sector pequeño de
  piso de colores.
- **FR-017**: Sin diagnósticos ni puntos de corte clínicos. El puntaje es una hipótesis de
  diseño y se presenta así.
- **FR-018**: Capas: (1) video de la escena, que puede traer su propio sonido de ambiente y
  voces de los personajes; (2) voz en off como audio aparte; (3) subtítulo arriba; (4)
  controles. Cada escena es una toma corta con sus voces. La voz en off es una voz de IA
  (Fola, de Google AI Studio), en archivos de audio aparte, y se puede reemplazar sin rehacer
  los videos. Las voces de los personajes vienen dentro de los videos; mientras un video no
  exista, su escena es provisional y esas voces las lee la voz del navegador. Nunca suenan
  dos voces a la vez: una voz nueva corta la anterior. Si una voz dura más que el video de su
  escena, el video se queda quieto en su última imagen hasta que la voz termina.

### Key Entities

- **Partida**: cada vez que se juega el cuento. Código propio, estado (en curso, en pausa,
  terminada o terminada antes), marca de revisión si corresponde, datos de la bienvenida y
  progreso.
- **Pregunta**: número, capítulo, ítems, personaje con la dificultad, textos y clips.
- **Respuesta**: posición de −100 (Puki) a +100 (Tuki), la misma posición orientada hacia el
  personaje con la dificultad, y estado: respondida, centro, sin respuesta, no presentada o
  falla técnica. Mientras una partida está en pausa, la pregunta que quedó abierta figura como
  «presentada» (abierta) hasta que se continúa o se termina la partida.
- **Datos de uso**: tiempos, cambios de la barra, repeticiones, toques a los clips y pausas,
  separados de las respuestas.
- **Informe**: puntaje por grupo y tabla por pregunta de una partida.

## Success Criteria *(mandatory)*

- **SC-001**: Un adulto, simulando al niño, completa el recorrido sin cargar archivos ni leer.
- **SC-002**: En las 13 preguntas, ambos clips siguen a la vez mientras se elige y la flecha
  confirma una sola respuesta.
- **SC-003**: En una partida de prueba, todas las respuestas coinciden en informe y JSON;
  centro, sin respuesta, no presentada y falla técnica se distinguen en el 100 % de los casos.
- **SC-004**: Una partida pausada se continúa con sus respuestas; empezar otra no la borra.
- **SC-005**: Pausar (a mano o automáticamente) no produce «sin respuesta» ni avances.
- **SC-006**: Se descarga el JSON de una partida terminada y de una incompleta, en la tablet.
- **SC-007**: Cada puntaje y fila del informe corresponde a respuestas guardadas.
- **SC-008**: En modo revisión con un idioma elegido, cada voz del capítulo muestra su
  traducción arriba y la partida aparece marcada como revisión en el informe y en el JSON.

## Assumptions

- En esta etapa quien usa la aplicación es un profesional adulto que simula al niño.
- Hay un adulto presente: prepara la partida, recibe la tablet al final y descarga el JSON.
- Una tablet a la vez, en horizontal, con Safari (iPad) o Chrome (Android). Para revisar
  también sirve Chrome o Edge en computador.
- Los videos y audios finales se producen fuera de la aplicación; mientras no estén, se usa
  material provisional y el JSON lo indica.

## Decisiones de diseño

### Decisión A — Puntaje (opción 2, Javiera 09-11)

La posición se guarda siempre tal cual. Como está orientada hacia el personaje con la
dificultad, los ítems redactados en positivo (SDQ 11 y 14) no necesitan invertirse.
Se lleva a 0-1-2 como el SDQ y el PSC:

- Lado sin dificultad y centro = 0 («no es verdad» / «nunca»).
- Lado con dificultad hasta la mitad = 1 («a medias» / «a veces»).
- Lado con dificultad más allá de la mitad = 2 («verdaderamente sí» / «seguido»).

Se suma por grupo: 0 a 10 en cada subescala SDQ y 0 a 6 en los tres contenidos PSC. Es una
hipótesis de diseño, no comparable con los puntos de corte del SDQ. La posición en el lado
sin dificultad no suma puntaje, pero queda guardada.

### Propuesta B — Clips por pregunta

Para cada pregunta se describe qué hace cada personaje en su clip, tomado del guion. La
descripción de cada clip está en `contenido/historia.js` (campo `descripcion`). En las
preguntas que dependen de un pensamiento (4, 5, 10, 13) o de la frecuencia (7), se prueba
primero solo con la imagen; si no se entiende, se agrega voz. Sigue como propuesta hasta que
Javiera apruebe cómo se muestran esas cinco preguntas.

### Decisión C — Continuar

Continuar parte al inicio de la escena donde quedó, para no perder el contexto de la pregunta.

### Decisión D — Informe sin frases

El informe no redacta frases por pregunta, porque repetirían la tabla sin agregar
información. Tampoco usa IA: conectarla exigiría dejar la clave dentro de la página y enviar
las respuestas fuera de la tablet, lo que contradice la constitución y no está revisado por
el comité de ética.

### Decisión E — Contenido del JSON

Archivo `puki-tuki_<código>_<fecha>.json`, sin el nombre del niño.

1. **Partida**: código, quién prueba, edad, modo revisión, inicio, fin,
   estado, idioma de subtítulos, versión del guion y de la app, tamaño y orientación de
   pantalla, si los videos eran provisionales.
2. **Práctica**: posición, tiempo y repeticiones.
3. **Cada pregunta**: número, contenido, ítems SDQ y PSC, personaje con la dificultad,
   posición, estado, puntaje 0-1-2 según la decisión A, tiempo hasta confirmar, repeticiones,
   toques a cada clip y cambios de la barra.
4. **Eventos con hora**: escenas, preguntas presentadas y repetidas, confirmaciones, pausas,
   pausas automáticas, salidas, fallas técnicas, apertura del informe y descargas.
5. **Resumen por grupo**: sumas según la decisión A, marcadas como hipótesis de diseño.

El formato exacto está en `contracts/exportacion-json.md`.

### Decisión F — Qué suena al tocar un clip (Javiera 11-11)

Al tocar un clip suena solo el diálogo que el guion le da a ese personaje en esa parte. Si
no tiene diálogo, no suena nada. Así, en las preguntas 7, 8, 9, 10 y 12 ningún clip tiene
sonido, y en las preguntas 1, 2, 3, 11 y 13 solo uno. No se agrega la voz en off.

## Propuestas abiertas

No están aprobadas ni programadas. Las decide Javiera.

- **Propuesta B — Clips por pregunta**: ver arriba.
- **Propuesta G — Aviso para el adulto** (11-11): el acceso al informe y «Partidas guardadas»
  se abren manteniendo presionado, y ninguna pantalla lo explica. Se propone una línea de
  texto en la bienvenida que lo diga.
- **Propuesta H — Generador del contenido** (11-11): `contenido/historia.js` y
  `contenido/subtitulos/es.js` se generan con una herramienta y un guion de tomas que están
  fuera de esta carpeta. La aplicación funciona sin ellos, pero no se pueden volver a generar
  desde aquí. Se propone copiar ambos a esta carpeta cuando el guion de tomas esté cerrado.

## Pendiente fuera de la app

Alcance e idioma del cuestionario de profesionales (dentro o fuera de la aplicación).

## Recursos visuales de decisión y pausa (13-11-2026)

- Javiera entregó la barra con Puki a la izquierda y Tuki a la derecha, el círculo morado,
  la flecha y el botón amarillo de pausa. Se usan copias dentro de `media/decision/`.
- Javiera eligió el fondo crema con formas de colores. La barra es de respuesta, no de progreso:
  conserva su rango continuo de −100 a +100, centro ±5 y confirmación separada.
- La pausa usa la composición adjunta de Javiera (`media/pausa/panel.png`) con botones HTML
  superpuestos. Sonido y confirmación de terminar tienen indicadores dinámicos. El arte de
  este panel está en español; una futura traducción del menú requiere separar sus textos.
- La mano está incluida en la lámina de recursos, pero no se muestra todavía. **Propuesta**:
  usarla solo como ayuda en la práctica y retirarla al primer toque; pendiente de Javiera.
- Los originales de tomas no se modifican. La aplicación carga únicamente las copias internas.
