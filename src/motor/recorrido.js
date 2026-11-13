// Recorre los pasos de historia.js con un solo funcionamiento para todos los capítulos.
import { reproducirEscena } from "../pantallas/escena.js?v=14";
import { presentarPregunta } from "../pantallas/pregunta.js?v=14";
import * as P from "../datos/partida.js";

export function aplanar(historia) {
  const pasos = [];
  for (const c of historia.capitulos) for (const p of c.pasos) pasos.push({ ...p, capitulo: c.id });
  return pasos;
}

export function preguntasDe(historia) {
  return aplanar(historia).filter((p) => p.tipo === "pregunta");
}

// Índice desde donde continuar: el inicio de la última escena registrada.
export function indiceContinuar(pasos, partida) {
  if (!partida.ultimaEscena) return 0;
  const i = pasos.findIndex((p) => p.tipo === "escena" && p.id === partida.ultimaEscena);
  return i < 0 ? 0 : i;
}

export function indiceCapitulo(pasos, capitulo) {
  const i = pasos.findIndex((p) => p.capitulo === capitulo);
  return i < 0 ? 0 : i;
}

// Devuelve "terminada" o "abortada".
export async function correr(app, desde, hasta = Infinity) {
  const pasos = app.pasos;
  for (let i = desde; i < pasos.length && i < hasta; i++) {
    if (app.sesion.abortada) return "abortada";
    const paso = pasos[i];
    app.mostrarTituloCapitulo(paso.capitulo);
    if (paso.tipo === "escena") {
      P.escena(app.partida, paso.id);
      app.guardar();
      if ((await reproducirEscena(app, paso)) === "abortada") return "abortada";
    } else {
      const r = P.respuestaDe(app.partida, paso.numero);
      if (!r || r.estado !== "no_presentada") continue;   // las preguntas ya pasadas no se repiten
      if ((await presentarPregunta(app, paso)) === "abortada") return "abortada";
    }
  }
  return app.sesion.abortada ? "abortada" : "terminada";
}
