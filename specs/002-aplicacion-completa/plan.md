# Implementation Plan: Aplicación completa Puki y Tuki

**Branch**: sin rama; identificador `002-aplicacion-completa` | **Date**: 2026-11-09 | **Updated**: 2026-11-11 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/002-aplicacion-completa/spec.md`

## Summary

Página web para tablet, sin servidor de datos, que reproduce el cuento de Puki y Tuki
(`contenido/guion.md`), presenta las 13 preguntas con dos clips en bucle y una barra libre,
guarda cada partida en la memoria del navegador, permite continuar la última, muestra un
informe con puntaje por grupo y tabla por pregunta, y descarga un JSON por partida.

Enfoque técnico: HTML, CSS y JavaScript sin bibliotecas ni paso de compilación. Todo el
cuento se describe como datos (`contenido/historia.js`); un único motor lo recorre, de modo
que agregar un capítulo es agregar datos, no código (principio III). Los parámetros (40 s,
una repetición, centro ±5) están en un archivo de configuración. Ver [research.md](research.md).

## Technical Context

**Language/Version**: JavaScript moderno (ES2020, módulos nativos), HTML5, CSS3.

**Primary Dependencies**: Ninguna. Sin frameworks ni paquetes externos.

**Storage**: `localStorage` del navegador para las partidas (texto JSON). Videos y audios
como archivos en `media/`, no se guardan en el navegador.

**Testing**: Pruebas automáticas de la lógica pura (puntaje, temporizador, estados de la
partida, exportación) con el ejecutor incluido en Node (`node --test`), sin paquetes. Prueba
manual del recorrido con [quickstart.md](quickstart.md).

**Target Platform**: Tablet en horizontal: iPad con Safari 15 o más y tablets Android con
Chrome. También Chrome o Edge de escritorio para revisión.

**Project Type**: Aplicación web estática (solo frontend).

**Performance Goals**: Los dos clips de una pregunta empiezan juntos en menos de 1 s desde
que aparece la pregunta; la barra responde al dedo sin retraso visible (60 cuadros por segundo).

**Constraints**: Sin servidor de datos ni servicios externos; los datos no salen de la tablet
hasta que un adulto descarga el JSON. Debe funcionar en Safari de iPad, que exige un toque
del usuario antes de reproducir audio y `playsinline` + `muted` para videos automáticos.

**Scale/Scope**: 1 tablet a la vez; 8 pantallas (bienvenida, partidas guardadas, inicio
infantil, cuento, pregunta, pausa, despedida, informe) más modo revisión; 5 capítulos, 13
preguntas y la práctica, 28 clips de respuesta (dos por pregunta y dos de la práctica) y 88
escenas; español con audio y subtítulos en portugués e inglés.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio | Cómo lo cumple el plan | Estado |
|---|---|---|
| I. Decisiones explícitas | Todo lo técnico que no decidió Javiera queda en research.md con su razón. Lo que falta (clips por pregunta) no se inventa: se usa material provisional marcado como tal. | Cumple |
| II. Fidelidad al guion | Los textos de voz y preguntas se copian de `contenido/guion.md` a `contenido/subtitulos/es.js` sin reescribir. Una prueba compara todas las voces con el guion. | Cumple |
| III. Funcionamiento común | Un solo motor recorre la lista de escenas y preguntas. Los capítulos son datos. | Cumple |
| IV. Respuestas interpretables | La posición inicial no cuenta. La barra exige un toque. Centro, sin respuesta, no presentada y falla técnica son estados distintos. El puntaje se marca como hipótesis de diseño. | Cumple |
| V. Uso infantil | Sin texto para el niño, instrucciones por voz, controles grandes, flecha separada de la barra, pregunta a la vista con los dos clips y repetición. | Cumple |
| Alcance | Sin servidor de datos, sin cuentas, sin IA. Publicar en GitHub Pages solo entrega archivos; no recibe datos. | Cumple |
| Forma de trabajo | Se programa primero el capítulo 1 completo (fase de MVP) y después los demás. | Cumple en parte: ver Complexity Tracking |

**Re-check después del diseño (Phase 1)**: sin cambios; ninguna violación.

## Project Structure

### Documentation (this feature)

```text
specs/002-aplicacion-completa/
├── spec.md
├── plan.md              # Este archivo
├── research.md          # Decisiones técnicas
├── data-model.md        # Entidades y estados
├── quickstart.md        # Cómo probar
├── verificacion.md      # Qué se probó y qué falta
├── contracts/
│   ├── contenido.md     # Formato de historia.js (cómo se describe un capítulo)
│   └── exportacion-json.md  # Formato del JSON descargado
├── checklists/requirements.md
└── tasks.md             # Lista de tareas
```

### Source Code

```text
app/
├── index.html                # Única página
├── config.js                 # Parámetros: espera, repeticiones, centro, velocidades
├── contenido/
│   ├── guion.md              # Guion oficial (manda)
│   ├── historia.js           # Capítulos, escenas, preguntas y clips como datos
│   └── subtitulos/
│       ├── es.js             # Textos en español (los del guion)
│       ├── pt.js
│       └── en.js
├── src/
│   ├── main.js               # Arranque y navegación entre pantallas
│   ├── motor/
│   │   ├── recorrido.js      # Avanza por escenas y preguntas; punto para continuar
│   │   ├── temporizador.js   # Espera que se puede pausar
│   │   └── medios.js         # Video, audio, fallas técnicas, velocidad
│   ├── datos/
│   │   ├── partida.js        # Crear, actualizar y cerrar partidas; estados
│   │   ├── almacen.js        # Guardar y leer en localStorage
│   │   ├── puntaje.js        # Posición orientada y puntaje 0-1-2
│   │   └── exportar.js       # Arma y descarga el JSON
│   └── pantallas/
│       ├── bienvenida.js     # También partidas guardadas y modo revisión
│       ├── inicio.js         # Puki, Tuki y play
│       ├── escena.js         # Cuento y subtítulos
│       ├── pregunta.js       # Dos clips, barra y flecha
│       ├── pausa.js
│       ├── despedida.js
│       ├── informe.js
│       └── ui.js             # Ayudas comunes: avisos, mantener presionado
├── estilos/
│   └── app.css
├── media/
│   ├── personajes/           # Imágenes de referencia de Puki y Tuki
│   ├── bienvenida/           # Imágenes de la pantalla de bienvenida
│   ├── escenas/              # Videos del cuento
│   ├── clips/                # Clips de respuesta (R01-P.mp4, R01-T.mp4, ...)
│   ├── audio/                # Voces
│   └── provisional/          # Imágenes provisionales mientras no hay videos
├── tests/
│   ├── puntaje.test.js
│   ├── temporizador.test.js
│   ├── partida.test.js
│   ├── exportar.test.js
│   └── contenido.test.js
└── _demo_001/                # Código de la demostración 001, guardado sin usar
```

**Structure Decision**: aplicación web estática de una sola página dentro de `app/`. La
lógica que no toca la pantalla (`src/datos/`, `src/motor/temporizador.js`) se escribe sin
depender del navegador para poder probarla con Node.

## Complexity Tracking

| Desviación | Por qué | Cómo se corrige |
|---|---|---|
| Los capítulos 2 a 5 se cargaron como datos antes de cerrar el punto de control del capítulo 1 (falta la prueba en iPad, T041). La constitución pide comprobar el capítulo 1 antes de ampliar. | El contenido se genera completo de una vez desde el guion de tomas. | Hacer T041 antes de reemplazar medios provisionales o agregar funciones. |
