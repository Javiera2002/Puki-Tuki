# Data Model: Aplicación completa Puki y Tuki

Qué datos maneja la aplicación, cómo se relacionan y qué estados pueden tener.

## Contenido (lo que se reproduce)

Se describe en `contenido/historia.js` según [contracts/contenido.md](contracts/contenido.md).

### Capítulo

| Campo | Qué es |
|---|---|
| `id` | `intro`, `c1` … `c5`. La despedida es el final de `c5` |
| `titulo` | Clave de texto del título |
| `pasos` | Lista ordenada de escenas y preguntas |

### Escena

| Campo | Qué es |
|---|---|
| `id` | Código de la toma, por ejemplo `C1-04` |
| `titulo`, `descripcion` | Nombre y descripción de la toma; se muestran en la tarjeta provisional |
| `duracionMs` | Cuánto dura la toma; lo usa la tarjeta provisional |
| `video` | Archivo en `media/escenas/` |
| `sonidoVideo` | `true` si el video trae su propio sonido (ambiente o voces de personajes) |
| `provisional` | `true` mientras no existe el video: se muestra una tarjeta en su lugar |
| `voces` | Lista de voces en orden; suenan una tras otra desde el inicio de la toma |

Una escena es una toma corta y es el punto desde donde se continúa una partida (Decisión C).

**Voz** (misma forma en escenas, preguntas y diálogos): `{clave, quien, audio}`. `clave` es el
texto en `contenido/subtitulos/<idioma>.js`; `quien` es quién habla (`narradora`, `puki`,
`tuki`…); `audio` es el archivo. Una voz sin archivo lleva `provisional: true` y la lee la voz
del navegador.

### Pregunta

| Campo | Qué es |
|---|---|
| `numero` | 1 a 13; `0` para la práctica |
| `contenido` | Nombre corto del contenido, por ejemplo «Tristeza»; se muestra en el informe |
| `items` | Lista ordenada, SDQ primero: por ejemplo `[{instrumento:"SDQ", item:13}, {instrumento:"PSC-17", item:2}]`. Los tres contenidos extra del PSC-17 llevan `propuesta: true` |
| `grupo` | `sdq_emocional`, `sdq_pares` o `psc_extra`; `null` en la práctica |
| `dificultad` | `puki` o `tuki` (según el guion); `null` en la práctica |
| `clipPuki`, `clipTuki` | `{video, provisional, descripcion}`: archivo en `media/clips/`, si es provisional y qué hace el personaje |
| `dialogoPuki`, `dialogoTuki` | Lista de voces que suenan al tocar cada clip; puede estar vacía |
| `pregunta` | Lista de voces de la pregunta |

Validación: 13 preguntas; cada `numero` una sola vez; `dificultad` coincide con la tabla de
la spec; `grupo` coincide con el primer ítem.

## Partida (lo que se guarda)

| Campo | Qué es |
|---|---|
| `codigo` | `PT-AAAAMMDD-HHMM-XXXX`, generado por la app |
| `quienPrueba` | Texto opcional |
| `edad` | Número opcional (4 a 7) |
| `revision` | `{capitulo, velocidad}` o `null` |
| `idiomaSubtitulos` | `null`, `pt` o `en` |
| `estado` | ver estados abajo |
| `inicio`, `fin` | Fecha y hora (ISO) |
| `ultimaEscena` | `id` de la escena donde continuar |
| `practica` | Respuesta de la práctica: misma forma, sin `posicionOrientada` ni `puntaje`, con todas las presentaciones que hagan falta |
| `respuestas` | Una por pregunta (13), creadas como `no_presentada` |
| `eventos` | Lista con hora; los tipos están en [contracts/exportacion-json.md](contracts/exportacion-json.md) |
| `formato` | `pukituki.partida.v1` |
| `versiones` | Versión de la app y del guion |
| `medios` | `final` o `provisional` |
| `dispositivo` | Ancho y alto de pantalla, orientación, navegador |

### Estados de la partida

```text
en_curso ──pausa──> en_pausa ──continuar──> en_curso
en_curso ──termina el cuento──> terminada
en_curso / en_pausa ──«terminar partida»──> terminada_antes
```

Al abrir la app, si la última partida quedó `en_curso` (se cerró sin pausar), pasa a
`en_pausa` con un evento `recuperada`. Solo la última partida puede continuarse, y solo si
está `en_pausa`. «Nueva partida» deja la anterior como está y crea otra. Ninguna partida se
borra. Una partida de revisión usa estos mismos estados y lleva además el campo `revision`.

## Respuesta

| Campo | Qué es |
|---|---|
| `numero` | Pregunta |
| `contenido`, `items`, `grupo`, `dificultad` | Copiados de la pregunta |
| `estado` | ver estados abajo |
| `posicion` | −100 (Puki) a +100 (Tuki); `null` si no hubo respuesta |
| `posicionOrientada` | Igual, pero +100 = personaje con la dificultad |
| `puntaje` | 0, 1 o 2 según Decisión A; `null` si no hubo respuesta |
| `tiempoHastaConfirmarMs` | Desde que termina la primera lectura de la pregunta, sin contar las pausas |
| `presentaciones` | 1 o 2 (en la práctica, las que hagan falta) |
| `toquesClip` | `{puki: n, tuki: n}` |
| `movimientosBarra` | Número de veces que se movió |
| `ultimaPosicionSinConfirmar` | Si se movió y no confirmó; dato de uso, no respuesta |

### Estados de una respuesta

```text
no_presentada ──aparece la pregunta──> presentada
presentada ──flecha con barra fuera del centro──> respondida
presentada ──flecha con barra en el centro (tocada)──> centro
presentada ──2 presentaciones sin confirmar──> sin_respuesta
presentada ──falla de video o audio tras reintento──> falla_tecnica
```

Reglas: la barra sin tocar no permite confirmar; una pregunta que salió de `presentada` no
vuelve atrás; mientras la partida está en pausa, la pregunta abierta sigue `presentada`;
al continuar una partida, una pregunta que estaba `presentada` vuelve a
`no_presentada` y se presenta de nuevo desde el inicio de su escena. Al terminar la partida
antes de tiempo, una pregunta `presentada` pasa a `no_presentada`. En ambos casos sus
movimientos se conservan como datos de uso, no como respuesta.

## Puntaje por grupo (informe y JSON)

| Grupo | Preguntas (ítem) | Rango |
|---|---|---|
| SDQ síntomas emocionales | 2 (3), 13 (8), 7 (13), 3 (16), 11 (24) | 0 a 10 |
| SDQ problemas con compañeros | 1 (6), 9 (11), 8 (14), 12 (19), 6 (23) | 0 a 10 |
| PSC-17 contenidos extra (propuesta) | 4 (9), 5 (6), 10 (11) | 0 a 6 |

Se suma solo lo respondido o centro. Se informa cuántas preguntas faltan en cada grupo; si
falta alguna, la suma se muestra como incompleta.

## Configuración (`config.js`)

| Parámetro | Valor |
|---|---|
| `esperaSegundos` | 40 |
| `repeticiones` | 1 |
| `margenCentro` | 5 |
| `limitePuntaje1` | 50 |
| `velocidadRevision` | 2 (solo videos y audios; las esperas siguen en 40 s) |
| `msParaAbrirOculto` | 3000 (mantener presionado para abrir el informe o «Partidas guardadas») |
| `transicionMs` | 500 (fundido entre la escena y los clips) |
| `caracteresPorSegundo` | 13 (para estimar cuánto dura una voz provisional) |
| `versionApp` | 0.1.0 |
