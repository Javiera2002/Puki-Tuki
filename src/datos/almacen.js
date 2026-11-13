// Guarda las partidas en la memoria del navegador (localStorage). Ver research.md, sección 8.
import { recuperar } from "./partida.js";

const PREFIJO = "pukituki.partida.";
const ULTIMA = "pukituki.ultima";

function memoria(alm) {
  return alm ?? (typeof localStorage !== "undefined" ? localStorage : null);
}

// Devuelve true si se guardó. Si falla, no se finge que se guardó.
export function guardar(partida, alm) {
  const m = memoria(alm);
  if (!m) return false;
  try {
    m.setItem(PREFIJO + partida.codigo, JSON.stringify(partida));
    m.setItem(ULTIMA, partida.codigo);
    return true;
  } catch (e) {
    return false;
  }
}

export function leer(codigo, alm) {
  const m = memoria(alm);
  try {
    const t = m?.getItem(PREFIJO + codigo);
    return t ? JSON.parse(t) : null;
  } catch (e) {
    return null;
  }
}

export function listar(alm) {
  const m = memoria(alm);
  if (!m) return [];
  const out = [];
  for (let i = 0; i < m.length; i++) {
    const k = m.key(i);
    if (k && k.startsWith(PREFIJO)) {
      const p = leer(k.slice(PREFIJO.length), m);
      if (p) out.push(p);
    }
  }
  return out.sort((a, b) => (a.inicio < b.inicio ? 1 : -1));
}

export function ultima(alm) {
  const m = memoria(alm);
  const c = m?.getItem(ULTIMA);
  return c ? leer(c, m) : null;
}

// Al abrir la app: una partida que quedó en_curso (se cerró sin pausar) pasa a en_pausa.
export function recuperarAlAbrir(alm) {
  const p = ultima(alm);
  if (p && recuperar(p)) guardar(p, alm);
  return p;
}
