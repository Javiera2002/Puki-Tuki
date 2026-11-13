# Abrir y revisar la demostración

Abrir `03_prototipo/app/index.html` en Edge o Chrome. No requiere instalación.
La portada explica que las escenas y la voz son provisionales. Se pueden seleccionar clips
locales y audios antes de empezar. Usar espera 1 segundo para una revisión rápida de omisiones;
para demostración normal dejar 40 segundos y tres reproducciones.

Verificar: práctica; elegir extremo; cambiar a centro tocándolo y confirmar; pausa durante
espera; reanudar; dejar sin responder una pregunta; descargar resultados. Confirmar que centro
es 50 confirmado y omisión tiene position null. No mostrar resultados como puntajes clínicos.

Pruebas: `node --test tests/engine.test.cjs`; pruebas del navegador con `node tests/browser.cjs`
y Playwright disponible. Detalles de los datos en data-model.md y del flujo en contracts/interaction.md.

Limitación: faltan clips y voces finales. Los recursos locales seleccionados deben volver a
seleccionarse al recargar. La sesión no se recupera al cerrar o recargar la pestaña.
