// Cuento: capas de video (o imagen/tarjeta provisional), voz en off, subtítulo arriba y controles.
import { el, aviso } from "./ui.js";
import { crearEspera } from "../motor/temporizador.js";
import { reproducirVoces, cargarVideo, cortarVoz } from "../motor/medios.js";
import { VIDEOS_LISTOS, VIDEOS_CON_SONIDO, VIDEOS_CONTINUOS, IMAGENES_LISTAS } from "../../contenido/medios_listos.js?v=14";
import * as P from "../datos/partida.js";

export function tarjetaProvisional(titulo, descripcion, clase = "") {
  return el("div", { class: "tarjeta-provisional " + clase },
    el("div", { class: "etiqueta-prov" }, "provisional"),
    el("div", { class: "tarjeta-titulo" }, titulo),
    el("div", { class: "tarjeta-desc" }, descripcion || ""),
    el("div", { class: "tarjeta-voz" }));
}

// Devuelve "ok" o "abortada".
export async function reproducirEscena(app, paso) {
  const lienzo = document.getElementById("escenario");
  const previo = lienzo.querySelector("video[data-sigue-en]");
  const reusaVideo = previo && previo.dataset.sigueEn === paso.id;

  let video = null;
  let tarjeta = null;
  const tieneVideo = !paso.provisional || VIDEOS_LISTOS.has(paso.id);
  const conSonido = VIDEOS_CON_SONIDO.has(paso.id);
  const imgSrc = IMAGENES_LISTAS[paso.id];
  const sigueEn = VIDEOS_CONTINUOS[paso.id] || null;

  if (reusaVideo) {
    video = previo;
    delete video.dataset.sigueEn;
  } else {
    lienzo.replaceChildren();
    if (tieneVideo) {
      video = await cargarVideo(paso.video, { conSonido });
      if (!video) {
        P.fallaTecnica(app.partida, null, paso.video);
        app.guardar();
        aviso(`No cargó el video ${paso.video}. Se anotó como falla técnica y el cuento sigue.`);
        tarjeta = tarjetaProvisional(`${paso.id} · ${paso.titulo}`, "(video no disponible)", "escena");
        lienzo.append(tarjeta);
      } else {
        video.className = "video-escena";
        if (sigueEn) video.dataset.sigueEn = sigueEn;
        lienzo.append(video);
      }
    } else if (imgSrc) {
      lienzo.append(el("img", { class: "video-escena", src: imgSrc, alt: paso.titulo }));
    } else {
      tarjeta = tarjetaProvisional(`${paso.id} · ${paso.titulo}`, paso.descripcion, "escena");
      lienzo.append(tarjeta);
    }
  }
  if (app.sesion.abortada) return "abortada";

  // Si el video continúa en la escena siguiente (ej. I-02 -> I-03), pasamos apenas termine la voz de I-02.
  const minimo = new Promise((res) => {
    if (video && sigueEn) { res(); return; }
    if (video) {
      if (video.ended) { res(); return; }
      video.onended = res;
      return;
    }
    const e = crearEspera(paso.duracionMs / app.velocidad, res);
    app.registrarEspera(e);
  });
  const muestraVoz = (clave) => { if (tarjeta) tarjeta.querySelector(".tarjeta-voz").textContent = clave ? `«${app.textosEs[clave] ?? ""}»` : ""; };
  app.voz = muestraVoz;
  // Si el video trae su propio diálogo hablado (ej. C1-02), omitir las voces provisionales del navegador.
  const vocesAReproducir = video && conSonido ? paso.voces.filter((v) => !v.provisional) : paso.voces;
  const voces = await reproducirVoces(vocesAReproducir, app.textosEs);
  app.voz = null;
  if (voces && voces.falla) {
    P.fallaTecnica(app.partida, null, voces.falla);
    app.guardar();
    aviso(`No cargó el audio ${voces.falla}. Se anotó como falla técnica y el cuento sigue.`);
  }
  if (app.sesion.abortada) { cortarVoz(); return "abortada"; }
  await Promise.race([minimo, app.sesion.promesaAborto]);
  return app.sesion.abortada ? "abortada" : "ok";
}
