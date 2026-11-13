// Arma y descarga el JSON de una partida (contracts/exportacion-json.md).
import { sumaPorGrupo } from "./puntaje.js";

const NOTA = "Hipótesis de diseño; no comparable con los puntos de corte del SDQ.";

export function armarJSON(partida) {
  const { practica, respuestas, eventos, formato, ...datos } = partida;
  const sumas = sumaPorGrupo(respuestas);
  const pr = practica
    ? { estado: practica.estado, posicion: practica.posicion, presentaciones: practica.presentaciones,
        tiempoHastaConfirmarMs: practica.tiempoHastaConfirmarMs, movimientosBarra: practica.movimientosBarra }
    : null;
  return {
    formato: formato || "pukituki.partida.v1",
    partida: datos,
    practica: pr,
    respuestas: respuestas.map((r) => ({ ...r })),
    puntajes: { nota: NOTA, ...sumas },
    eventos: eventos.map((e) => ({ ...e })),
  };
}

export function nombreArchivo(partida) {
  const f = (partida.inicio || "").slice(0, 16).replace(/[-:]/g, "").replace("T", "-");
  return `puki-tuki_${partida.codigo}_${f}.json`;
}

export function textoJSON(partida) {
  return JSON.stringify(armarJSON(partida), null, 2);
}

// Vía principal: descarga con enlace.
export function descargar(partida) {
  const blob = new Blob([textoJSON(partida)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nombreArchivo(partida);
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export function puedeCompartir(partida) {
  try {
    const f = new File([textoJSON(partida)], nombreArchivo(partida), { type: "application/json" });
    return !!(navigator.canShare && navigator.canShare({ files: [f] }));
  } catch (e) {
    return false;
  }
}

export async function compartir(partida) {
  const f = new File([textoJSON(partida)], nombreArchivo(partida), { type: "application/json" });
  await navigator.share({ files: [f], title: nombreArchivo(partida) });
}
