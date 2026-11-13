// Bienvenida del adulto: continuar o empezar, datos opcionales, sonido, subtítulos, revisión y partidas guardadas.
import { el, mostrar, limpiar, pulsacionLarga } from "./ui.js";
import { reproducirVoz } from "../motor/medios.js";
import * as A from "../datos/almacen.js";
import { mostrarInforme } from "./informe.js";

const ESTADOS = {
  en_curso: "en curso", en_pausa: "en pausa", terminada: "terminada",
  terminada_antes: "terminada antes", revision: "revisión",
};
export const estadoTexto = (p) => (p.revision ? `revisión · ${ESTADOS[p.estado] || p.estado}` : ESTADOS[p.estado] || p.estado);

export function mostrarBienvenida(app) {
  const c = limpiar("bienvenida");
  const ultima = A.ultima();
  const puedeContinuar = ultima && ultima.estado === "en_pausa";

  const quien = el("input", { type: "text", id: "quien", placeholder: "Quién prueba (opcional)", autocomplete: "off", "aria-label": "Quién prueba" });
  const edad = el("select", { id: "edad", "aria-label": "Edad del niño" }, el("option", { value: "" }, "Edad del niño (opcional)"),
    ...[4, 5, 6, 7].map((e) => el("option", { value: String(e) }, `${e} años`)));
  const idioma = el("select", { id: "idioma", "aria-label": "Subtítulos" }, el("option", { value: "" }, "Sin subtítulos"),
    el("option", { value: "pt" }, "Portugués"), el("option", { value: "en" }, "Inglés"));
  const datos = () => ({ quienPrueba: quien.value.trim(), edad: edad.value ? Number(edad.value) : null, idiomaSubtitulos: idioma.value || null });

  const capitulos = app.historia.capitulos.filter((x) => x.id !== "intro");
  const capSel = el("select", {}, ...capitulos.map((x) => el("option", { value: x.id }, app.textosEs[x.titulo])));
  const velSel = el("select", {}, el("option", { value: "1" }, "×1"), el("option", { value: "1.5" }, "×1.5"));
  const revision = el("details", { class: "revision" },
    el("summary", {}, "Modo revisión (profesionales)"),
    el("p", {}, "Ver un capítulo suelto. La partida queda marcada como revisión y no se mezcla con las demás."),
    el("div", { class: "fila" }, capSel, velSel,
      el("button", { class: "btn", onclick: () => app.empezarNueva({ ...datos(), revision: { capitulo: capSel.value, velocidad: Number(velSel.value) } }) }, "Ver capítulo")));

  const guardadas = el("button", { class: "btn-oculto", title: "Mantener presionado 3 segundos" }, "Partidas guardadas");
  pulsacionLarga(guardadas, () => mostrarGuardadas(app));

  c.append(
    el("div", { class: "bv-izquierda" },
      el("img", { class: "bv-titulo", src: "media/bienvenida/titulo.png", alt: "Puki y Tuki: un día en el colegio" }),
      el("img", { class: "bv-personajes", src: "media/bienvenida/puki-tuki.png", alt: "" })),
    el("div", { class: "bv-panel" },
      el("p", { class: "bv-descripcion" }, "Prototipo de autorreporte para niños de 4 a 7 años.", el("br"), "Propuesta para revisión de profesionales."),
      el("button", { class: "bv-boton verde", onclick: () => app.empezarNueva(datos()) }, el("span", {}, "Nueva partida")),
      el("button", { class: "bv-boton naranjo", disabled: !puedeContinuar, onclick: () => app.continuarUltima() },
        el("span", {}, "Continuar partida")),
      el("hr"),
      el("div", { class: "bv-campo persona" }, quien),
      el("div", { class: "bv-campo calendario" }, edad),
      el("div", { class: "bv-fila" },
        el("div", { class: "bv-campo idioma" }, idioma),
        el("button", { class: "bv-sonido",
          onclick: () => reproducirVoz({ clave: "I-01_1", audio: "media/audio/vo_I-01.mp3" }) },
          el("img", { src: "media/bienvenida/icono-sonido.png", alt: "" }), el("span", {}, "Probar sonido"))),
      revision,
      el("div", { class: "bv-pie" },
        el("span"),
        guardadas)));
  mostrar("bienvenida");
}

export function mostrarGuardadas(app) {
  const c = limpiar("guardadas");
  const lista = A.listar();
  const tarjeta = el("section", { class: "informe-caja" },
    el("div", { class: "informe-cabecera" },
      el("img", { class: "informe-logo", src: "media/bienvenida/titulo.png", alt: "Puki y Tuki" }),
      el("div", { class: "informe-titulo-wrap" },
        el("h2", { class: "informe-titulo" }, "Partidas guardadas en esta tablet"))),
    lista.length
      ? el("div", { class: "tabla-marco" },
          el("table", { class: "tabla" },
            el("tr", {}, el("th", {}, "Código"), el("th", {}, "Inicio"), el("th", {}, "Quién prueba"), el("th", {}, "Estado"), el("th", {}, "")),
            ...lista.map((p) => el("tr", {},
              el("td", {}, p.codigo), el("td", {}, p.inicio.slice(0, 16).replace("T", " ")), el("td", {}, p.quienPrueba || "—"),
              el("td", {}, estadoTexto(p)),
              el("td", {}, el("button", { class: "btn-informe morado chico", onclick: () => mostrarInforme(app, p, () => mostrarGuardadas(app)) }, "Ver informe"))))))
      : el("p", { class: "informe-vacio" }, "Todavía no hay partidas."),
    el("div", { class: "fila informe-acciones" },
      el("button", { class: "btn-informe crema", onclick: () => app.irBienvenida() },
        el("img", { class: "btn-informe-icono", src: "media/pausa/icono-casa.png", alt: "" }),
        "Volver")));
  c.append(tarjeta);
  mostrar("guardadas");
}
