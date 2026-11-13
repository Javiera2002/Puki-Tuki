# Quickstart: cómo abrir y probar la aplicación

## Abrir en el computador

1. En una terminal, dentro de la carpeta `app/`:

   ```bash
   python -m http.server 8770
   ```

2. Abrir `http://localhost:8770` en Chrome o Edge. Para ver como tablet, usar el modo de
   dispositivo del navegador en horizontal (por ejemplo 1180 × 820).

## Pruebas automáticas de la lógica

```bash
node --test tests/*.test.js
```

Deben pasar todas: puntaje, temporizador, estados de la partida, exportación y contenido.

## Recorridos a comprobar a mano

| N.º | Qué hacer | Qué debe pasar | Spec |
|---|---|---|---|
| 1 | Nueva partida → play → práctica sin tocar nada | La práctica se repite; no avanza al cuento | US1 |
| 2 | Responder la práctica | Empieza el capítulo 1 | US1 |
| 3 | En la pregunta 1, mirar los clips | Puki con compañeros a la izquierda, Tuki solo a la derecha, ambos en bucle | US2, SC-002 |
| 4 | Tocar la flecha sin tocar la barra | No pasa nada | US2 |
| 5 | Tocar un clip | Suena el diálogo de ese personaje; la espera vuelve a empezar | US2 |
| 6 | Tocar el medio de la barra y confirmar | Se guarda «centro» | US2 |
| 7 | No tocar nada en una pregunta | Se repite a los 40 s; a los otros 40 s queda «sin respuesta» y sigue el cuento | US3 |
| 8 | Pausar 2 minutos en una pregunta | No avanza ni queda «sin respuesta» | US4, SC-005 |
| 9 | Bloquear la tablet o cambiar de pestaña | Se pausa sola | US4 |
| 10 | Dejar en pausa y volver al inicio → Continuar | Sigue desde el inicio de esa escena con las respuestas anteriores | US4, SC-004 |
| 11 | Nueva partida | Otro código; la anterior sigue guardada | US4 |
| 12 | Terminar partida a mitad | Queda «terminada antes»; las que faltan, «no presentada» | US4 |
| 13 | Quitar un archivo de clip y llegar a esa pregunta | Aviso al adulto y «falla técnica» | Edge cases |
| 14 | Terminar el cuento | Despedida en la sala y la voz pide pasar la tablet | US5 |
| 15 | En la pantalla final, mantener presionado 3 s el botón «⋯» de la esquina | Se abre el informe de esta partida | US5 |
| 16 | Comparar informe y JSON con lo respondido | Coinciden todos los estados y posiciones | US6, SC-003 |
| 17 | Dejar una partida en pausa → bienvenida → mantener presionado 3 s «Partidas guardadas» → «Ver informe» → «Descargar JSON» | Se descarga el `.json` con su estado | SC-006 |
| 17b | Cerrar el navegador a mitad de una escena, sin pausar, y volver a abrir | La partida aparece en pausa y se puede continuar | Edge cases |
| 17c | Llegar a una pregunta | La escena se funde con los dos clips; luego barra, flecha y pregunta | US2 |
| 18 | Modo revisión, capítulo 3, ×2, subtítulos en inglés | Empieza en el capítulo 3, rápido, con texto arriba; al terminar vuelve a la bienvenida y la partida figura como revisión | US7, SC-008 |

Al terminar el capítulo 1, repetir 3, 5, 7, 8, 9, 10 y 17 en un iPad con Safari, tocando los
dos clips seguidos para comprobar que una voz corta a la otra. Al final, repetirlo todo en iPad.
