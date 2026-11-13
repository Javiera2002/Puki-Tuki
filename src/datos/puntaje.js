// Puntaje (Decisión A de la spec). Hipótesis de diseño: no comparable con los puntos de corte del SDQ.
import { config } from "../../config.js";

// posicion: -100 (Puki) a +100 (Tuki). Devuelve +100 = personaje con la dificultad.
export function orientar(posicion, dificultad) {
  if (posicion == null || !dificultad) return null;
  return dificultad === "tuki" ? posicion : -posicion;
}

export function esCentro(posicion, margen = config.margenCentro) {
  return posicion != null && Math.abs(posicion) <= margen;
}

export function puntaje(orientada, margen = config.margenCentro, limite = config.limitePuntaje1) {
  if (orientada == null) return null;
  if (orientada <= margen) return 0;
  if (orientada <= limite) return 1;
  return 2;
}

export const GRUPOS = {
  sdq_emocional: { nombre: "SDQ · Síntomas emocionales", maximo: 10, preguntas: 5 },
  sdq_pares: { nombre: "SDQ · Problemas con compañeros", maximo: 10, preguntas: 5 },
  psc_extra: { nombre: "PSC-17 · Contenidos extra (propuesta)", maximo: 6, preguntas: 3 },
};

// respuestas: lista con {grupo, estado, puntaje}
export function sumaPorGrupo(respuestas) {
  const out = {};
  for (const [g, info] of Object.entries(GRUPOS)) {
    const del = respuestas.filter((r) => r.grupo === g);
    const validas = del.filter((r) => r.estado === "respondida" || r.estado === "centro");
    out[g] = {
      suma: validas.reduce((a, r) => a + (r.puntaje ?? 0), 0),
      respondidas: validas.length,
      faltan: info.preguntas - validas.length,
    };
  }
  return out;
}
