# Feature Specification: Recorrido compartido de Puki y Tuki

**Feature Branch**: Sin rama nueva; función `001-recorrido-capitulos`.

**Created**: 2026-11-06

**Status**: Especificación de la primera demostración, 2026-11-08. Los parámetros iniciales ajustables se identifican en Assumptions; la interpretación del centro sigue siendo provisional.

**Input**: Javiera pide especificar el funcionamiento compartido de los capítulos y comenzar por el capítulo 1. Permite repetir la pregunta tras una espera y acuerda registrar «sin respuesta» cuando no contesta. Las funciones del prototipo anterior se comentan antes de incorporarlas.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Ver una escena y responder sobre sí mismo (Priority: P1)

El participante ve a Puki y Tuki en el colegio. Al llegar a una pregunta, la historia deja de avanzar, pero el fragmento que representa la pregunta sigue reproduciéndose en bucle. Ambos personajes quedan visibles y se escucha la pregunta. El participante indica a quién se parece y confirma con la flecha. El cuento continúa desde el punto que corresponde.

**Why this priority**: Es la interacción central del autorreporte y se repite en todos los capítulos.

**Independent Test**: Recorrer el capítulo 1 con sus dos preguntas, comprobar lo que aparece y comparar las elecciones con el registro final. Se puede probar con escenas provisionales identificadas como tales ante el equipo.

**Acceptance Scenarios**:

1. **Given** la escena de bloques terminada, **When** llega la pregunta 1, **Then** se escucha exactamente «¿Prefieres jugar solo como Tuki, o con otros niños como Puki?», con ambos personajes y el control de respuesta disponibles.
2. **Given** una elección realizada, **When** el participante la modifica antes de confirmar, **Then** se muestra la nueva elección y solo la confirmación determina la respuesta definitiva.
3. **Given** una elección confirmada con la flecha, **When** el cuento continúa, **Then** Puki coloca otro bloque y se lleva la mano a la guata, según el guion vigente.
4. **Given** la narración de los dolores terminada, **When** aparece la pregunta 2, **Then** se escucha exactamente «¿Te duele seguido la guata o la cabeza como a Puki, o casi nunca como a Tuki?».
5. **Given** la segunda pregunta resuelta, **When** termina el capítulo, **Then** se muestra el cierre de la escena de las construcciones y la profesora junto a Puki. Si el capítulo siguiente está disponible, sigue su título; en una demostración limitada al capítulo 1 se informa al evaluador que el recorrido terminó.
6. **Given** la pantalla de respuesta, **When** se mueve la barra hacia un personaje, **Then** ese personaje se destaca suavemente; al cambiar de lado, el destacado sigue la elección.
7. **Given** una selección deliberada del centro, **When** se confirma con la flecha, **Then** queda registrada como centro confirmado, diferente de una pregunta sin respuesta, sin atribuirle todavía un puntaje instrumental.

### User Story 2 - Escuchar de nuevo y dejar una pregunta sin respuesta (Priority: P1)

El participante que no responde recibe una repetición de la pregunta. Si sigue sin contestar después de otra espera, ante una omisión aislada el cuento continúa y se conserva «sin respuesta», sin atribuirle una elección de personaje o de grado. El tiempo transcurrido no permite establecer la causa de la omisión.

**Why this priority**: La ausencia de interacción debe distinguirse de una respuesta del niño.

**Independent Test**: Dejar una pregunta sin tocar y comprobar la repetición y el registro; repetir la prueba contestando antes del recordatorio.

**Acceptance Scenarios**:

1. **Given** la pregunta ya escuchada y ninguna respuesta confirmada, **When** transcurre la espera definida, **Then** se repite la misma pregunta sin cambiar sus palabras ni sugerir una respuesta.
2. **Given** una pregunta confirmada, **When** vence un recordatorio previamente previsto, **Then** no se reproduce sobre la escena siguiente.
3. **Given** una pregunta que se cierra sin contestación, **When** se consulta su registro, **Then** consta «sin respuesta», sin valor de personaje ni grado; nunca se convierte en el centro de la escala.
4. **Given** una elección modificada pero no confirmada, **When** se cierra la pregunta sin confirmación, **Then** no se registra como respuesta definitiva.
5. **Given** una omisión aislada y la repetición ya terminada, **When** transcurre la segunda espera sin respuesta, **Then** se registra «sin respuesta» y se reproduce el siguiente segmento del cuento, conservando las escenas intermedias anteriores a la siguiente pregunta.

### User Story 3 - Conocer cómo responder antes del cuento (Priority: P2)

El participante conoce a Puki y Tuki y practica con la manzana y el plátano antes de responder las preguntas del capítulo.

**Why this priority**: Permite presentar el control mediante una acción concreta.

**Independent Test**: Recorrer únicamente la introducción, realizar la práctica y comprobar que no se incorpora como respuesta a un ítem.

**Acceptance Scenarios**:

1. **Given** la introducción, **When** se presenta a los personajes y sus frutas, **Then** se usa el texto del guion vigente y se demuestra el mismo control que se utilizará en el cuento.
2. **Given** la práctica confirmada, **When** comienza el capítulo 1, **Then** se escucha «¡Día de escuela!» y la elección de fruta queda separada de las respuestas del autorreporte.

### User Story 4 - Revisar el registro y reutilizar el recorrido (Priority: P2)

La investigadora puede consultar las respuestas de la demostración y añadir los contenidos de otro capítulo manteniendo la interacción común.

**Why this priority**: Permite comprobar qué información produce el prototipo y ampliarlo sin rediseñar cada pantalla de respuesta.

**Independent Test**: Completar una sesión de demostración y revisar su archivo de resultados. Cargar un segundo contenido de prueba y comprobar que conserva el mismo recorrido.

**Acceptance Scenarios**:

1. **Given** una sesión con una respuesta confirmada y una ausente, **When** se obtiene el registro, **Then** ambas aparecen diferenciadas, con su pregunta, capítulo y correspondencia instrumental.
2. **Given** otra escena con sus personajes, pregunta y audio, **When** se utiliza en el mismo recorrido, **Then** se reproduce, se responde y se continúa sin cambiar el comportamiento común.

### Edge Cases

- Si falta un video o un audio, la aplicación informa al evaluador y permite reintentar; no registra ese fallo como ausencia de respuesta del participante. Propuesta de manejo técnico pendiente de la revisión visual.
- Dos toques consecutivos de confirmación producen un solo avance y un solo registro definitivo.
- La repetición no puede superponerse con la pregunta inicial ni con el audio de la siguiente escena.
- Una posición inicial del control y una posición elegida deliberadamente deben poder distinguirse.
- Si se cierra o recarga la página, la recuperación de la sesión queda fuera de esta primera entrega; antes de finalizar una prueba se debe obtener su registro. La recuperación se puede proponer posteriormente.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El recorrido debe incluir introducción, práctica, escenas, preguntas, confirmación y cierre, usando el guion vigente sin reescribir sus textos.
- **FR-002**: Debe mostrar el video con protagonismo durante el cuento. Durante la respuesta mantiene en bucle el fragmento asociado a la pregunta y ambos personajes visibles. El bucle visual no repite los diálogos continuamente: la pregunta se escucha según la secuencia de repeticiones, sin audio superpuesto. En ausencia del clip definitivo, la demostración usa una composición provisional identificada al evaluador.
- **FR-003**: Cada pregunta debe tener su audio y sus experiencias asociadas a Puki y Tuki. La ubicación de un personaje no se confundirá con presentar o no una dificultad.
- **FR-004**: La especificación contempla la barra del guion, modificable antes de confirmar con la flecha inferior derecha. Al acercarse a un personaje, este se destaca suavemente. El centro elegido y confirmado debe distinguirse de la posición inicial sin interacción. Su significado propuesto es «no me pasa como a ninguno» o «no me siento tan identificado con ninguno»; la interpretación definitiva se revisará con profesionales y no se transforma en puntaje clínico en esta entrega. Para la demostración, tocar la barra o manejarla con teclado constituye selección deliberada, incluido tocar su centro; después se confirma con la flecha. La flecha permanece deshabilitada mientras no haya selección.
- **FR-005**: La práctica debe usar el mismo control que las preguntas; su respuesta queda separada del autorreporte.
- **FR-006**: Configuración inicial ajustable de la demostración: tres reproducciones de la pregunta en total (inicial más dos repeticiones), con 40 segundos de espera tras finalizar cada audio. Sin confirmación al terminar la tercera espera, se registra «sin respuesta» y continúa el cuento. Manipular la barra reinicia la espera vigente; no reinicia el número de reproducciones. Se registra si hubo interacción sin confirmación, además de la ausencia total de interacción. La práctica permite continuar tras agotar la espera, pero queda separada del autorreporte. Las omisiones consecutivas se conservan sin clasificación clínica automática.
- **FR-007**: Toda pregunta cerrada sin confirmación debe registrar «sin respuesta» y ningún valor de respuesta. Una pregunta todavía no presentada debe distinguirse de una presentada sin contestación.
- **FR-008**: La confirmación debe registrar una sola respuesta definitiva por pregunta y continuar desde el siguiente segmento del guion.
- **FR-009**: Al finalizar, la investigadora debe poder obtener un archivo de resultados que identifique capítulo, pregunta, ítem de referencia, respuesta confirmada o ausente y formato utilizado. El registro no debe incluir nombres de niños para la demostración.
- **FR-010**: No debe producir diagnósticos ni convertir posiciones en puntajes de los instrumentos en esta entrega.
- **FR-011**: Los capítulos deben aportar sus contenidos al mismo funcionamiento. Cambiar el control de respuesta debe poder hacerse sin volver a producir los videos.
- **FR-012**: Las acciones principales deben poder realizarse mediante toque y las instrucciones infantiles deben disponer de audio. La demostración se revisará en tablet y computador.
- **FR-013**: La primera entrega comprende introducción, práctica y capítulo 1. Los demás capítulos usan este recorrido cuando sus contenidos estén disponibles.
- **FR-014**: La demostración ofrece pausa y reanudación para el adulto: se detienen video, voz y espera. Al reanudar durante una pregunta se reproduce de nuevo la pregunta, sin consumir otra repetición, y se reinicia la espera. Este control es una propuesta funcional para la demostración, visible junto a sus ajustes.

### Key Entities

- **Capítulo**: título y secuencia de escenas y preguntas.
- **Escena**: contenido audiovisual y lugar en la secuencia.
- **Pregunta**: identificador, texto del guion, audio, ítem de referencia y experiencia de cada personaje.
- **Respuesta**: posición elegida y confirmada, incluido el centro, o estado sin respuesta. Incluye el formato utilizado y la versión de sus instrucciones para conservar el significado propuesto que se presentó. No supone una puntuación clínica ni atribuye automáticamente un grado de dificultad a la posición central.
- **Sesión de demostración**: recorrido realizado, preguntas presentadas y respuestas. La práctica se identifica aparte.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Se puede completar introducción, práctica y las dos preguntas del capítulo 1 en el orden del guion, sin saltos ni repeticiones de escenas por doble confirmación.
- **SC-002**: En todas las pruebas de elegir, cambiar y confirmar, el registro coincide con la última elección confirmada.
- **SC-003**: En todas las pruebas sin respuesta, no aparece una elección atribuida al participante ni un valor equivalente al centro.
- **SC-004**: Las dos preguntas se escuchan completas, sin audio superpuesto, y los recordatorios pendientes no aparecen después de abandonar una pregunta.
- **SC-005**: Se puede incorporar otro contenido de prueba manteniendo reproducción, pregunta, respuesta y continuación compartidas.
- **SC-006**: Un evaluador puede obtener y distinguir las dos respuestas del capítulo y la práctica al terminar la demostración. Esta comprobación técnica no acredita comprensión infantil ni validez de medición.
- **SC-007**: En las pruebas de centro elegido y confirmado frente a ausencia de interacción, los dos casos producen registros distintos. El destacado visual cambia al mover la barra hacia el personaje contrario.
- **SC-008**: Al aportar un clip de pregunta, se mantiene en bucle hasta confirmar, omitir o pausar; al salir de la pregunta se detiene. La pausa impide que venza la espera y que se registre una omisión mientras está activa.

## Assumptions

- Fuente de contenido: `03_prototipo/Guion_Puki_Tuki_bueno.docx`, consultado el 2026-11-06. Primera pregunta: SDQ 6, preferencia por jugar solo, Tuki. Segunda: SDQ 3, dolores frecuentes, Puki.
- Los videos y audios se preparan previamente. Mientras se producen, se pueden usar imágenes y audio provisionales para comprobar el recorrido, indicándolo a los evaluadores.
- La revisión de esta etapa se realiza con profesionales adultos; no se incorpora una aplicación a niños como tarea de implementación.
- Configuración inicial propuesta para poder probar el recorrido: 40 segundos por espera y tres reproducciones totales. Se puede cambiar antes de empezar la sesión. Estos valores no son tiempos validados. El registro conserva la configuración utilizada.
- Propuestas visuales por comentar: halo suave proporcional a la cercanía; conservar la expresión que representa la experiencia de cada personaje al seleccionarlo; destacar la flecha cuando haya una selección. Propuesta para el centro: permitir tocarlo expresamente y después confirmar, sin exigir arrastrar hacia un lado y volver. No se añaden estas propuestas como decisiones aprobadas.
- La primera demostración incorpora una pausa manual para el adulto como propuesta. No detiene automáticamente las omisiones consecutivas ni detecta llanto, distracción o malestar. Los registros permiten observar la secuencia de omisiones sin atribuirle un significado.
- El archivo de resultados se conserva localmente por la investigadora. La aplicación no requiere cuentas ni envío a un servidor; el detalle técnico pertenece al plan.
- Los controles antiguos de salida, recuperación y repetición manual quedan fuera de esta primera entrega. La pausa manual se incorpora como propuesta explícita para probar interrupciones.
- Un video explicativo del proceso de trabajo queda como material posterior solicitado por Javiera; esta entrega documenta la especificación y no incluye esa producción audiovisual.
