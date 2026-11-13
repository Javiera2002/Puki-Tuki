# Contrato: JSON descargado

Un archivo por partida: `puki-tuki_<codigo>_<AAAAMMDD-HHMM>.json`. No contiene el nombre del
niño. Formato `pukituki.partida.v1`. Los campos están explicados en [data-model.md](../data-model.md).

```json
{
  "formato": "pukituki.partida.v1",
  "partida": {
    "codigo": "PT-20261114-1532-K7QM",
    "quienPrueba": "Psicóloga 1",
    "edad": null,
    "revision": null,
    "idiomaSubtitulos": "pt",
    "estado": "terminada",
    "inicio": "2026-11-14T15:32:08-03:00",
    "fin": "2026-11-14T15:51:40-03:00",
    "ultimaEscena": "C5-09",
    "versiones": { "app": "0.1.0", "guion": "guion-2026-11-09" },
    "medios": "provisional",
    "dispositivo": { "ancho": 1180, "alto": 820, "orientacion": "horizontal", "navegador": "..." }
  },
  "practica": { "estado": "respondida", "posicion": -64, "presentaciones": 3, "tiempoHastaConfirmarMs": 15200, "movimientosBarra": 2 },
  "respuestas": [
    {
      "numero": 1,
      "contenido": "Preferencia por estar solo",
      "items": [{ "instrumento": "SDQ", "item": 6 }],
      "grupo": "sdq_pares",
      "dificultad": "tuki",
      "estado": "respondida",
      "posicion": 72,
      "posicionOrientada": 72,
      "puntaje": 2,
      "tiempoHastaConfirmarMs": 8420,
      "presentaciones": 1,
      "toquesClip": { "puki": 0, "tuki": 1 },
      "movimientosBarra": 3,
      "ultimaPosicionSinConfirmar": null
    }
  ],
  "puntajes": {
    "nota": "Hipótesis de diseño; no comparable con los puntos de corte del SDQ.",
    "sdq_emocional": { "suma": 4, "respondidas": 5, "faltan": 0 },
    "sdq_pares": { "suma": 3, "respondidas": 4, "faltan": 1 },
    "psc_extra": { "suma": 1, "respondidas": 3, "faltan": 0 }
  },
  "eventos": [
    { "hora": "2026-11-14T15:40:02-03:00", "tipo": "pausa_automatica", "escena": "C3-07" },
    { "hora": "2026-11-14T15:41:10-03:00", "tipo": "continuar", "escena": "C3-07" }
  ]
}
```

## Tipos de evento

`inicio`, `escena`, `pregunta_presentada`, `repeticion`, `confirmada`, `sin_respuesta`,
`pausa`, `pausa_automatica`, `continuar`, `recuperada`, `volver_inicio`, `terminar_partida`,
`fin`, `falla_tecnica`, `guardado_fallido`, `informe_abierto`, `descarga`.

Según el tipo, el evento lleva además `escena`, `pregunta` o `detalle` (el archivo que falló).

## Reglas

- Las 13 respuestas aparecen siempre, aunque estén `no_presentada`.
- `posicion`, `posicionOrientada` y `puntaje` son `null` salvo en `respondida` y `centro`.
- Se puede descargar en cualquier estado de la partida.
- La práctica no tiene `posicionOrientada` ni `puntaje`.
- En una partida en pausa, la pregunta que quedó abierta aparece como `presentada`.
- `tiempoHastaConfirmarMs` se cuenta desde que termina la primera lectura de la pregunta, sin
  contar las pausas.
- En una partida de revisión, `revision` es `{capitulo, velocidad}`.
