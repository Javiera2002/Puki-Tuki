# Puki y Tuki

Aplicación web para tablet del autorreporte con Puki y Tuki. Versión 0.1.0: el recorrido
completo funciona con **material provisional** (tarjetas en vez de videos) y con la voz en off
ya generada. Qué se probó y qué falta: `specs/002-aplicacion-completa/verificacion.md`.

## Cómo abrirla

En una terminal, dentro de esta carpeta:

```bash
python -m http.server 8770
```

Abrir `http://localhost:8770` en Chrome o Edge. No funciona con doble clic en `index.html`
(el navegador bloquea los módulos de JavaScript).

## Cómo probarla

```bash
node --test tests/*.test.js
```

Recorridos a mano: `specs/002-aplicacion-completa/quickstart.md`.

## Archivos

| Archivo | Qué es |
|---|---|
| `specs/002-aplicacion-completa/` | Spec, plan, tareas, modelo de datos, contratos y verificación. |
| `contenido/guion.md` | Guion oficial de la aplicación. Manda sobre cualquier otro material. |
| `contenido/historia.js` | El cuento como datos (escenas, voces, preguntas). Se genera con una herramienta que está fuera de esta carpeta; la aplicación no la necesita para funcionar. |
| `contenido/subtitulos/` | Textos por idioma (`es.js` con los textos del guion; `pt.js` y `en.js` por traducir). |
| `config.js` | Parámetros: 40 s de espera, 1 repetición, centro ±5, etc. |
| `src/` | Código: `datos/` (partida, puntaje, guardado, JSON), `motor/` (recorrido, esperas, voces y videos), `pantallas/`. |
| `media/` | Voz en off (`audio/`), imágenes de la bienvenida y de los personajes. Los videos van en `escenas/` y `clips/`. Ver `media/README.md`. |
| `tests/` | Pruebas automáticas de la lógica. |
| `ACUERDOS.md` | Registro de cómo se tomaron las decisiones. La que vale es la spec. |
