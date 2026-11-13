# Verificación de la demostración

Fecha: 2026-11-08.

## Resultados

- Node test runner: 5 pruebas aprobadas. Centro explícito frente a inicial, omisión sin
interacción, manipulación sin confirmación, confirmación única, última elección y práctica.
- Playwright con Edge headless: recorrido completo aprobado en modo lectura; práctica,
centro, pausa y reanudación, tres presentaciones antes de omitir, exportación JSON.
- Clip sintético local: video real en bucle silenciado durante la respuesta, pausa y reanudación.
- Voz simulada: la espera empieza después de terminar el audio y no avanza estando en pausa.
- Sin errores JavaScript en el recorrido principal.
- Capturas revisadas: portada y respuesta a 1280×900, bucle a 1024×768 y ventana a 390×844.
Se corrigió el recorte CSS de orejas y pies; las imágenes originales no se modificaron.

## Límites

Las pruebas de voz verifican la coordinación de eventos mediante voz simulada; la calidad y
disponibilidad de la voz real del sistema deben comprobarse en el equipo de presentación.
La tablet se comprobó mediante tamaño de ventana, no en un dispositivo físico.
No existen clips finales del capítulo 1 en la carpeta. Los personajes y las composiciones
provisionales permiten comprobar controles, pero no representan todas las acciones del guion.
No se realizó evaluación con niños ni validación de los contenidos.

## Reproducción

node --test tests/engine.test.cjs
node tests/browser.cjs

Las pruebas del navegador usan el Playwright del entorno y Edge instalado. Las capturas
y el JSON de prueba están en test-output/, excluido de git.
