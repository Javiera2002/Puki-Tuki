# Tasks: Recorrido compartido de Puki y Tuki

**Input**: spec.md, plan.md, research.md, data-model.md, contracts/interaction.md.

## Phase 1: Setup
- [x] T001 Crear estructura estática y exclusiones en index.html y .gitignore.

## Phase 2: Foundational
- [x] T002 Implementar contrato de selección y registro en engine.js: posición 0–100, omisión null, confirmación única.

## Phase 3: User Story 1 (P1)
Goal: ver y responder las dos preguntas. Independent test: recorrerlas y confirmar extremos y centro.
- [x] T003 [US1] Configurar textos del capítulo 1 y recursos opcionales en content.js.
- [x] T004 [US1] Construir escenarios, barra, destacado y confirmación en styles.css y app.js.
- [x] T005 [US1] Incorporar reproducción de escena y bucle silenciado con recuperación de errores en app.js.

## Phase 4: User Story 2 (P1)
Goal: conservar omisiones y pausas. Independent test: agotar tres esperas y verificar estado null.
- [x] T006 [US2] Implementar tres presentaciones, esperas 40 segundos ajustables, cancelación y pausa en app.js.

## Phase 5: User Story 3 (P2)
Goal: introducción y práctica. Independent test: seleccionar centro en práctica y empezar capítulo.
- [x] T007 [US3] Configurar introducción, práctica y voz provisional en content.js y app.js.

## Phase 6: User Story 4 (P2)
Goal: revisar datos y cambiar recursos. Independent test: descargar JSON y cargar clip de bucle.
- [x] T008 [US4] Añadir ajustes de evaluador, carga local de medios y exportación en index.html y app.js.

## Phase 7: Polish
- [x] T009 Verificar contratos con tests/engine.test.cjs y recorrido con tests/browser.cjs; registrar resultados en specs/001-recorrido-capitulos/verification.md.
- [x] T010 Documentar apertura, recursos pendientes y configuración en README.md y media/README.md.

## Dependencies & Execution Order
T001 → T002 → T003–T005 → T006 → T007 → T008 → T009–T010.
Una sola IA edita estos archivos; ninguna escritura paralela sobre app.js.
US1 puede comprobarse desde una pregunta; US2 con espera reducida; US3 solo práctica;
US4 con sesión sintética o recorrido completo. Documentación T010 puede avanzar separada
una vez fijado el comportamiento, pero se realiza secuencialmente en esta sesión.

## Implementation Strategy
Primero motor y recorrido; luego omisiones, práctica y resultados. Validación final visual
más pruebas de centro, ausencia, pausa, doble confirmación y bucle. No se generan clips
finales ni se atribuye validación clínica. Los parámetros provisionales son editables.
