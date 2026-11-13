# Decisiones técnicas para la demostración

## Aplicación estática
Decision: HTML, CSS y JavaScript sin librerías en ejecución.
Rationale: el encargo es frontend y debe abrirse fácilmente; no necesita cuentas ni servidor.
Alternatives considered: aplicación con compilador o servidor, innecesarios para dos preguntas.

## Recursos
Decision: mostrar recortes CSS de la hoja de personajes y composiciones temporales, permitir
seleccionar clips locales para escena y bucle, y audios por paso antes de iniciar.
Rationale: no se encontraron videos del capítulo 1 en la carpeta, solo videos del guion anterior.
Alternatives considered: usar clips viejos con contenido distinto; descartado por falta de fidelidad.

## Audio
Decision: audio cargado por el evaluador; si falta, voz del navegador en español como recurso provisional.
Rationale: permite recorrer el texto mientras se producen las voces. Si no hay voz disponible o falla,
mostrar error y permitir reintentar o modo lectura; no fingir reproducción. No es voz final de Puki/Tuki.
Alternatives considered: generar audio externo ahora, que requeriría elegir voces y servicios.

## Temporización y pausa
Decision: programar espera solo al terminar la pregunta; invalidar callbacks al cambiar de estado;
limpiar el temporizador al pausar. Al reanudar pregunta, volver a leer sin gastar otro intento.
Rationale: evita omisiones durante pausas y recordatorios tardíos. Registrar manipulación sin confirmación.
Alternatives considered: intervalo global independiente del audio; descartado por superposición.

## Evidencia
Fuentes del alcance: spec.md, constitución, guion bueno y acuerdos del 2026-11-08.
Son decisiones de implementación de la demostración, no hallazgos psicométricos.
