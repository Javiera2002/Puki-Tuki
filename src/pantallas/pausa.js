// Panel de pausa en HTML/CSS (traducible) sobre fondo real difuminado, con Puki y Tuki asomados.
import { el } from "./ui.js";
import { alternarSonido, sonidoSilenciado } from "../motor/medios.js";

export function abrirPausa(app) {
  const capa = document.getElementById("pausa");
  const esIngles = app.partida?.idiomaSubtitulos === "en";

  const continuar = el("button", {
    class: "pausa-btn pausa-btn-verde",
    "aria-label": "Continuar",
    onclick: () => app.reanudar(),
  },
    el("img", { class: "pausa-icono", src: "media/pausa/icono-play.png", alt: "" }),
    el("span", { class: "pausa-btn-texto" }, "Continuar"));

  const sonido = el("button", { class: "pausa-btn pausa-btn-crema", role: "switch" });
  const pintarSonido = () => {
    const silencio = sonidoSilenciado();
    sonido.setAttribute("aria-checked", String(!silencio));
    sonido.setAttribute("aria-label", silencio ? "Sonido: apagado" : "Sonido: activado");
    sonido.classList.toggle("apagado", silencio);
    sonido.replaceChildren(
      el("img", {
        class: "pausa-icono",
        src: silencio ? "media/pausa/icono-sonido-off.png" : "media/pausa/icono-sonido-on.png",
        alt: "",
      }),
      el("span", { class: "pausa-btn-texto" }, silencio ? "Sonido: apagado" : "Sonido: activado"),
      el("span", { class: "pausa-interruptor", "aria-hidden": "true" }));
  };
  sonido.addEventListener("click", () => { alternarSonido(); pintarSonido(); });
  pintarSonido();

  const volverInicio = el("button", {
    class: "pausa-btn pausa-btn-amarillo",
    "aria-label": "Dejar en pausa y volver al inicio",
    onclick: () => app.salirAlInicio(),
  },
    el("img", { class: "pausa-icono", src: "media/pausa/icono-casa.png", alt: "" }),
    el("span", { class: "pausa-btn-texto" }, "Dejar en pausa y volver al inicio"));

  const terminar = el("button", {
    class: "pausa-btn pausa-btn-rosa",
    "aria-label": "Terminar partida",
  },
    el("img", { class: "pausa-icono", src: "media/pausa/icono-cerrar.png", alt: "" }),
    el("span", { class: "pausa-btn-texto" }, "Terminar partida"));

  terminar.addEventListener("click", () => {
    if (terminar.dataset.confirmar) return app.terminarPartida();
    terminar.dataset.confirmar = "1";
    terminar.classList.add("confirmar");
    const msg = "¿Seguro? Toca otra vez para terminar y ver reporte";
    terminar.setAttribute("aria-label", msg);
    terminar.querySelector(".pausa-btn-texto").textContent = msg;
  });

  const cabecera = el("div", { class: "pausa-cabecera", "aria-hidden": "true" },
    el("img", { class: "pausa-personaje puki", src: "media/pausa/puki.png", alt: "" }),
    el("img", {
      class: "pausa-titulo-img",
      src: esIngles ? "media/pausa/titulo-pause.png" : "media/pausa/titulo-pausa.png",
      alt: "",
    }),
    el("img", { class: "pausa-personaje tuki", src: "media/pausa/tuki.png", alt: "" }));

  const cuerpo = el("div", { class: "pausa-cuerpo" },
    continuar,
    sonido,
    volverInicio,
    terminar);

  capa.replaceChildren(
    el("section", { class: "panel-pausa", role: "dialog", "aria-modal": "true", "aria-label": "Pausa" },
      cabecera,
      cuerpo));
  capa.classList.add("visible");
  continuar.focus();
}

export function cerrarPausa() {
  document.getElementById("pausa").classList.remove("visible");
}
