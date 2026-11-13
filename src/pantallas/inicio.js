// Inicio infantil: Puki y Tuki en la sala y el botón de play en el centro. El toque habilita el sonido.
import { el, mostrar, limpiar } from "./ui.js";

export function mostrarInicio(app, alTocarPlay) {
  const c = limpiar("inicio");
  const play = el("button", { class: "play", "aria-label": "Comenzar" },
    el("img", { class: "play-boton-img", src: "media/inicio/boton-play.png", alt: "" }));
  play.addEventListener("click", () => {
    // un audio vacío dentro del toque desbloquea el sonido en Safari
    try { new Audio("data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=").play().catch(() => {}); } catch (e) {}
    alTocarPlay();
  }, { once: true });
  c.append(
    el("img", { class: "fondo-inicio-full", src: "media/inicio/aula-inicio.png", alt: "" }),
    play);
  mostrar("inicio");
}
