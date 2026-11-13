// Ayudas de pantalla compartidas.
import { config } from "../../config.js";

export function el(etiqueta, props = {}, ...hijos) {
  const e = document.createElement(etiqueta);
  for (const [k, v] of Object.entries(props)) {
    if (k === "class") e.className = v;
    else if (k.startsWith("on")) e.addEventListener(k.slice(2), v);
    else if (k === "html") e.innerHTML = v;
    else if (v !== false && v != null) e.setAttribute(k, v === true ? "" : v);
  }
  for (const h of hijos.flat()) if (h != null && h !== false) e.append(h.nodeType ? h : document.createTextNode(String(h)));
  return e;
}

// Muestra una pantalla (id del contenedor en index.html) y oculta las demás.
export function mostrar(id) {
  document.querySelectorAll(".pantalla").forEach((p) => p.classList.toggle("visible", p.id === id));
}

export function limpiar(id) {
  const c = document.getElementById(id);
  c.replaceChildren();
  return c;
}

// Acción que se activa manteniendo presionado (para que el niño no la abra por accidente).
export function pulsacionLarga(elem, fn, ms = config.msParaAbrirOculto) {
  let t = null;
  const empezar = (e) => {
    e.preventDefault();
    elem.classList.add("presionando");
    t = setTimeout(() => { elem.classList.remove("presionando"); fn(); }, ms);
  };
  const soltar = () => { clearTimeout(t); elem.classList.remove("presionando"); };
  elem.addEventListener("pointerdown", empezar);
  ["pointerup", "pointerleave", "pointercancel"].forEach((ev) => elem.addEventListener(ev, soltar));
  elem.style.setProperty("--ms-larga", ms + "ms");
}

// Aviso para el adulto, arriba de la pantalla.
export function aviso(texto, { boton, alTocar, ms = 7000 } = {}) {
  const zona = document.getElementById("avisos");
  const caja = el("div", { class: "aviso" }, el("span", {}, texto));
  if (boton) caja.append(el("button", { class: "btn-chico", onclick: () => { caja.remove(); alTocar?.(); } }, boton));
  caja.append(el("button", { class: "cerrar", "aria-label": "Cerrar", onclick: () => caja.remove() }, "×"));
  zona.append(caja);
  if (ms) setTimeout(() => caja.remove(), ms);
  return caja;
}

export function esperar(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
