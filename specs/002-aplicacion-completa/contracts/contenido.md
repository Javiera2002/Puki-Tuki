# Contrato: formato de `contenido/historia.js`

Cómo se describe el cuento como datos. El motor recorre esta lista; agregar o cambiar un
capítulo es cambiar estos datos, sin tocar el código (principio III).

## Reglas

- El orden de `capitulos` y de `pasos` es el orden del guion `contenido/guion.md`.
- Los textos no se escriben aquí: cada voz tiene una `clave` que está en
  `contenido/subtitulos/es.js`, copiada palabra por palabra del guion.
- Los identificadores son los códigos de las tomas: `I-01` (introducción), `C1-04` (capítulo 1,
  toma 4), `R01` (clips de la pregunta 1; `R00` es la práctica).
- Archivos: videos de escenas en `media/escenas/<toma>.mp4`, clips en
  `media/clips/R<nn>-P.mp4` (Puki) y `R<nn>-T.mp4` (Tuki), voz en off en
  `media/audio/vo_<toma>.mp3`.
- Lo provisional se declara con `provisional: true`. En una escena o un clip significa que el
  video no existe todavía y se muestra una tarjeta con su `descripcion`. En una voz significa
  que no tiene archivo y la lee la voz del navegador. Un archivo que debería existir y no carga
  es **falla técnica**; nunca se reemplaza en silencio por lo provisional.
- `sonidoVideo: true` deja sonar el audio propio del video de la escena. Los clips de
  respuesta siempre van sin sonido.
- Las voces de una escena suenan una tras otra desde el inicio de la toma.
- `pregunta`, `dialogoPuki` y `dialogoTuki` son listas de voces. Un diálogo puede estar vacío.

## Ejemplo (capítulo 1, abreviado)

```js
export const historia = {
  version: "guion-2026-11-09",
  capitulos: [
    {
      id: "c1",
      titulo: "c1_titulo",
      pasos: [
        { tipo: "escena", id: "C1-07", titulo: "…", descripcion: "…", duracionMs: 6000,
          video: "media/escenas/C1-07.mp4", sonidoVideo: true, provisional: true,
          voces: [{ clave: "C1-07_1", quien: "narradora", audio: "media/audio/vo_C1-07.mp3" }] },
        { tipo: "pregunta", numero: 1, contenido: "Preferencia por estar solo",
          items: [{ instrumento: "SDQ", item: 6 }],
          grupo: "sdq_pares", dificultad: "tuki",
          clipPuki: { video: "media/clips/R01-P.mp4", provisional: true, descripcion: "…" },
          clipTuki: { video: "media/clips/R01-T.mp4", provisional: true, descripcion: "…" },
          dialogoPuki: [{ clave: "C1-04_1", quien: "puki", provisional: true }],
          dialogoTuki: [],
          pregunta: [{ clave: "R01_pregunta", quien: "narradora", audio: "media/audio/vo_R01.mp3" }] }
      ]
    }
  ]
};
```

## De dónde sale

`historia.js` y `subtitulos/es.js` se generan con una herramienta a partir del guion de tomas.
Los dos están fuera de esta carpeta (ver Propuesta H de la spec). La aplicación no los necesita
para funcionar.

## Comprobación

`tests/contenido.test.js` recorre `historia.js` y verifica: 13 preguntas numeradas 1 a 13 y
una práctica, `dificultad` igual a la tabla de la spec, cada `clave` existe en `es.js`, cada
texto de `es.js` usado como voz (narración, diálogos y preguntas) aparece igual en
`contenido/guion.md`, y cada archivo de audio declarado existe.
