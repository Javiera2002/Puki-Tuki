# Implementation Plan: Recorrido compartido de Puki y Tuki

**Branch**: Sin rama nueva; identificador 001-recorrido-capitulos | **Date**: 2026-11-08 | **Spec**: [spec.md](spec.md)

## Summary

Aplicación estática con introducción, práctica y dos preguntas del capítulo 1. Máquina de
estados para escenas, pregunta, pausa y cierre. Videos en bucle durante las respuestas;
imágenes provisionales cuando no existe el video. Barra con selección explícita, confirmación,
repeticiones ajustables y exportación local de respuestas sin puntuaciones clínicas.

## Technical Context

**Language/Version**: HTML5, CSS y JavaScript moderno, scripts clásicos para permitir abrir index.html directamente.
**Primary Dependencies**: Ninguna en ejecución. API nativa de video y síntesis de voz como audio provisional, informada al evaluador.
**Storage**: Memoria de la sesión; descarga JSON por acción explícita. Sin servidor ni nombres personales.
**Testing**: Node test runner para temporización/registro y Playwright local para el recorrido y capturas.
**Target Platform**: Navegador de escritorio y tablet horizontal; interfaz adaptable a ventanas estrechas.
**Project Type**: Frontend estático.
**Performance Goals**: Respuesta visual inmediata del control, sin descargas remotas requeridas por el prototipo.
**Constraints**: Guion intacto; recursos existentes; ningún archivo del prototipo antiguo se modifica.
**Scale/Scope**: Una introducción, una práctica, dos preguntas y un cierre. Contenido en archivo separado para ampliar capítulos.

## Constitution Check

- Decisiones: centro y parámetros se presentan como provisionales en la pantalla del evaluador.
- Contenido: preguntas y frases tomadas del guion bueno; se documenta que las composiciones no son las escenas finales.
- Reutilización: un único controlador para cualquier pregunta configurada.
- Interpretación: valor crudo y estado; ninguna suma ni etiqueta clínica.
- Uso: voz provisional y controles táctiles; no se presume validación infantil.
- Alcance: sin backend ni generación de videos durante la sesión.

Revisión antes y después del diseño: cumple; no hay excepciones que justificar.

## Project Structure

### Documentation (this feature)

spec.md, plan.md, research.md, data-model.md, contracts/interaction.md,
quickstart.md, tasks.md y verification.md.

### Source Code (repository root)

- index.html: estructura, pantalla del evaluador y recorrido.
- styles.css: diseño adaptable, estados y destacado.
- content.js: texto del guion y rutas de clips opcionales.
- engine.js: selección, intentos y registro puro comprobable.
- app.js: voz, video, temporizadores, controles y descarga.
- tests/engine.test.cjs: pruebas de comportamiento.
- tests/browser.cjs: recorrido automático y capturas.
- media/README.md: contrato de recursos audiovisuales.
- README.md: cómo abrir y límites de la demostración.

**Structure Decision**: archivos pequeños sin compilación, recursos gráficos leídos desde ../Imagenes. Las imágenes originales se muestran con recorte CSS; no se editan.
