# Acuerdos para la especificación

Registro de cómo se tomaron las decisiones. Si algo difiere, vale
`specs/002-aplicacion-completa/spec.md`. Lo marcado como **propuesta** todavía no está aprobado.

## Alcance

- Primero se especifica con Spec Kit TODA la aplicación y después se programa. El
  capítulo 1 puede ser la primera parte que se programe, pero no limita la especificación.
- Javiera diseña la página inicial y la final.
- Los videos y audios son parte del proyecto. Quien usa la aplicación no carga archivos.
- La información de la partida se guarda y se descarga en JSON.
- El guion oficial `contenido/guion.md` manda sobre los demás materiales:
  textos de las preguntas, qué personaje tiene la dificultad y en qué orden se nombran.

## Preguntas y clips (09-11-2026)

- En cada pregunta hay dos videos grandes a la vez, uno por personaje, en bucle mientras
  se elige. Muestran las acciones de cada personaje en esa parte del guion.
- Se turna qué personaje tiene la dificultad y cuál se nombra primero, para evitar
  sesgos de respuesta. Se respeta lo que dice el guion en cada pregunta.
- Puki va siempre a la izquierda y Tuki a la derecha.
- Transición a la pregunta: la última imagen de la escena se queda quieta y se funde en medio
  segundo con los dos clips; luego barra, flecha y pregunta. Al confirmar, fundido de vuelta.
- Los clips van sin sonido. Si el niño toca un clip, se vuelve a escuchar lo que dice el
  guion de ese personaje. Si después se ve que hace falta más voz, se cambia.

## Barra (09-11-2026)

- Se mueve libre (sin pasos) y parte en el centro.
- El centro es una zona pequeña: justo el centro y un margen chico. Fuera de esa zona ya
  indica un lado. Las zonas de los extremos son más grandes.
- El centro elegido significa «no me pasa como a ninguno». La introducción del guion lo dice:
  «Si no te pasa como a ninguno de los dos, toca el medio de la barra». Es distinto de «sin respuesta».
- Si la barra nunca se tocó, la flecha no hace nada y la pregunta se repite.
- Se destaca suavemente al personaje hacia el que se acerca la barra. Colores graduales del
  verde de Puki al naranjo de Tuki (hoja de ruta).
- Puntaje (opción 2): lado sin dificultad y centro = 0; lado con dificultad hasta la mitad = 1;
  más allá = 2. Se suma por subescala. Es una hipótesis de diseño.

## Espera y repetición (09-11-2026)

- Tras cada pregunta se esperan 40 segundos. No hay fuente que respalde otro tiempo; queda
  como parámetro ajustable.
- La pregunta se repite una vez. Si sigue sin respuesta, queda «sin respuesta» y el cuento
  continúa. No se elige un personaje ni el centro automáticamente.
- No se deduce la causa de una omisión.
- Las preguntas ocurren cuando ocurren: no se vuelve a preguntar una pregunta anterior.
  Una elección sin confirmar no se guarda como respuesta.
- La duración total no se limita por ahora. Si queda muy largo, se ajusta al final.
- En la práctica de las frutas, si no responde, la práctica se repite. No se avanza al
  cuento sin responderla.

## Partidas, pausa y retomar (09-11-2026)

- Partida = cada vez que se juega el cuento. Cada partida tiene su propio código, porque una
  misma persona puede jugar varias veces.
- Al entrar se ofrece continuar la última partida o empezar una nueva, como en una película.
  Solo se retoma la última. Empezar una nueva no borra las anteriores.
- Todas las partidas se guardan, también las incompletas.
- Pausa automática si la tablet se bloquea, se cambia de aplicación o se sale de la pestaña.
- El menú de pausa ofrece: continuar, sonido, dejar la partida en pausa y volver al inicio,
  y terminar la partida.

## Informe adulto (09-11-2026)

- Grupos como en los instrumentos originales: SDQ síntomas emocionales (3, 8, 13, 16, 24),
  SDQ problemas con compañeros (6, 11, 14, 19, 23) y aparte los contenidos extra del PSC-17
  (autocrítica, desesperanza, menor disfrute).
- El informe muestra puntaje por grupo y una tabla por pregunta, sin frases redactadas ni IA.
- El SDQ va primero. Las preguntas 7 (SDQ 13) y 13 (SDQ 8) se ubican en su ítem del SDQ;
  su correspondencia con el PSC se registra igual.

## Idiomas y revisión (09-11-2026)

- Los otros idiomas son para profesionales que revisan desde otros países. El audio queda
  en español. El texto traducido va en una franja blanca con letra negra arriba de la escena,
  sin tapar la imagen.
- La bienvenida del adulto se ve como un juego infantil colorido, con Puki y Tuki a un lado.
- Idea para revisar: velocidad ×2 y elegir un capítulo para verlo.
- La introducción dice «No hay respuestas buenas ni malas».
- La práctica con respuesta correcta (perro y hormiga) se verá más adelante.

## Despedida (09-11-2026)

- Termina en la sala, porque de pre-kínder a segundo básico las familias suelen ir a buscar
  a los niños a la sala. La despedida dice «Ahora pásale la tablet al adulto que está contigo».
- Las frases del centro, «no hay respuestas buenas ni malas» y la despedida las escribió la IA
  en el guion a pedido de Javiera el 09-11; ella las revisa.

## Antecedentes

- La demostración del capítulo 1 (`specs/001-recorrido-capitulos/` y `_demo_001/`) se
  programó antes de tiempo. Sus pantallas, tiempos y pruebas no son decisiones aprobadas ni base obligatoria.
- El prototipo anterior «Puki en el patio», guardado fuera de esta carpeta, es otro
  diseño. Se consulta como antecedente; sus tiempos y su elección automática de una opción
  no se trasladan.
- La constitución 1.1.0 es una primera redacción; Javiera está revisando su alcance.

## Integración visual (13-11-2026)

Javiera pidió integrar los recursos de «11_ Pantalla desicion» y tomar su imagen adjunta
como referencia del panel de pausa. Eligió el fondo crema con formas de colores.
La implementación y la propuesta pendiente para la mano están descritas en la spec,
sección «Recursos visuales de decisión y pausa». No se cambia el guion ni el puntaje.
