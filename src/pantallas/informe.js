// Informe del adulto: puntaje por grupo, tabla por pregunta y aparte las pendientes. Sin frases redactadas.
import { el, mostrar, limpiar } from "./ui.js";
import { GRUPOS, sumaPorGrupo } from "../datos/puntaje.js";
import { descargar, puedeCompartir, compartir, textoJSON } from "../datos/exportar.js";
import * as P from "../datos/partida.js";

const ESTADO = {
  respondida: "Respondida",
  centro: "Centro («no me pasa como a ninguno»)",
  sin_respuesta: "Sin respuesta",
  no_presentada: "No presentada",
  falla_tecnica: "Falla técnica",
  presentada: "Abierta",
};

const ESTADO_PARTIDA = {
  en_curso: "En curso",
  en_pausa: "En pausa",
  terminada: "Completa",
  terminada_antes: "Terminada antes",
};

function parecidoBadge(r) {
  if (r.posicion == null) return el("span", {}, "—");
  if (r.estado === "centro") return el("span", { class: "pill-resp centro" }, "No me pasa como a ninguno");
  const esPuki = r.posicion < 0;
  const quien = esPuki ? "Puki" : "Tuki";
  const conDif = (esPuki ? "puki" : "tuki") === r.dificultad;
  return el("span", { class: `pill-resp ${esPuki ? "puki" : "tuki"}` },
    `${quien} ${conDif ? "(con la dificultad)" : "(sin la dificultad)"}`);
}

function formatoPosicion(r) {
  if (r.posicion == null) return "—";
  if (r.estado === "centro" || r.posicion === 0) return "Centro (0%)";
  const pct = Math.abs(Math.round(r.posicion));
  return `${pct}% hacia ${r.posicion < 0 ? "Puki" : "Tuki"}`;
}

export function mostrarInforme(app, partida, alVolver) {
  P.evento(partida, "informe_abierto");
  const c = limpiar("informe");
  const sumas = sumaPorGrupo(partida.respuestas);
  const hechas = partida.respuestas.filter((r) => r.estado === "respondida" || r.estado === "centro");
  const pendientes = partida.respuestas.filter((r) => !(r.estado === "respondida" || r.estado === "centro"));
  const atencion = pendientes.filter((r) => r.estado !== "no_presentada");
  const noPresentadas = pendientes.filter((r) => r.estado === "no_presentada");
  const salida = el("pre", { class: "json-texto", hidden: true });

  const fila = (r) => el("tr", {},
    el("td", {}, r.numero),
    el("td", {}, r.contenido),
    el("td", {}, r.items.map((i) => `${i.instrumento} ${i.item}`).join(" / ")),
    el("td", {}, parecidoBadge(r)),
    el("td", {}, formatoPosicion(r)),
    el("td", {}, r.puntaje ?? "—"));

  const metaPills = [
    el("span", { class: "meta-pill" }, `📅 ${partida.inicio.slice(0, 16).replace("T", " ")}`),
    el("span", { class: "meta-pill" }, `Estado: ${ESTADO_PARTIDA[partida.estado] || partida.estado}`),
    partida.edad ? el("span", { class: "meta-pill" }, `Edad: ${partida.edad} años`) : null,
    partida.revision ? el("span", { class: "meta-pill acento" }, "Modo revisión") : null,
    el("span", { class: "meta-pill suave" }, `Código: ${partida.codigo}`),
  ].filter(Boolean);

  const bloquePendientes = [];
  if (atencion.length) {
    bloquePendientes.push(
      el("h3", { class: "informe-subtitulo" }, "Sin respuesta y fallas técnicas"),
      el("div", { class: "tabla-marco" },
        el("table", { class: "tabla" },
          el("tr", {}, el("th", {}, "N.º"), el("th", {}, "Contenido"), el("th", {}, "Estado")),
          ...atencion.map((r) => el("tr", {}, el("td", {}, r.numero), el("td", {}, r.contenido), el("td", {}, ESTADO[r.estado] || r.estado))))));
  }
  if (noPresentadas.length) {
    bloquePendientes.push(
      el("details", { class: "informe-desplegable" },
        el("summary", {}, `${noPresentadas.length} ${noPresentadas.length === 1 ? "pregunta no presentada" : "preguntas no presentadas"} — Ver detalle`),
        el("div", { class: "tabla-marco" },
          el("table", { class: "tabla" },
            el("tr", {}, el("th", {}, "N.º"), el("th", {}, "Contenido"), el("th", {}, "Estado")),
            ...noPresentadas.map((r) => el("tr", {}, el("td", {}, r.numero), el("td", {}, r.contenido), el("td", {}, ESTADO[r.estado] || r.estado)))))));
  }
  if (!atencion.length && !noPresentadas.length) {
    bloquePendientes.push(
      el("h3", { class: "informe-subtitulo" }, "Pendientes"),
      el("p", { class: "informe-vacio" }, "Todas las preguntas fueron respondidas."));
  }

  const tarjeta = el("section", { class: "informe-caja" },
    el("div", { class: "informe-cabecera" },
      el("img", { class: "informe-logo", src: "media/bienvenida/titulo.png", alt: "Puki y Tuki" }),
      el("div", { class: "informe-titulo-wrap" },
        el("h2", { class: "informe-titulo" }, "Informe de la partida"),
        el("div", { class: "meta-fila" }, ...metaPills))),
    el("h3", { class: "informe-subtitulo" }, "Puntaje por grupo"),
    el("div", { class: "leyenda-escala" },
      el("p", { class: "leyenda-titulo" }, "Puntaje exploratorio (hipótesis de diseño, no comparable con puntos de corte clínicos del SDQ)."),
      el("div", { class: "leyenda-items" },
        el("span", {}, el("strong", {}, "0:"), " «no me pasa como a ninguno» o lado sin la dificultad"),
        el("span", {}, el("strong", {}, "1:"), " se parece un poco al personaje con la dificultad"),
        el("span", {}, el("strong", {}, "2:"), " se parece mucho"))),
    el("div", { class: "grupos" }, ...Object.entries(GRUPOS).map(([g, info]) => {
      const s = sumas[g];
      const txtEstado = s.faltan === 0
        ? `Completo · ${s.respondidas} de ${info.preguntas} respondidas`
        : `${s.respondidas} de ${info.preguntas} respondidas (faltan ${s.faltan})`;
      return el("div", { class: `grupo grupo-${g}` },
        el("div", { class: "grupo-nombre" }, info.nombre),
        el("div", { class: "grupo-suma" }, `${s.suma} / ${info.maximo}`),
        el("div", { class: "grupo-faltan" }, txtEstado));
    })),
    el("h3", { class: "informe-subtitulo" }, "Respuestas"),
    hechas.length
      ? el("div", { class: "tabla-marco" },
          el("table", { class: "tabla" },
            el("tr", {}, el("th", {}, "N.º"), el("th", {}, "Contenido"), el("th", {}, "Ítem"), el("th", {}, "Se pareció a"), el("th", {}, "Posición en barra"), el("th", {}, "Puntaje")),
            ...hechas.map(fila)))
      : el("p", { class: "informe-vacio" }, "Ninguna respuesta confirmada en esta sesión."),
    ...bloquePendientes,
    el("p", { class: "nota" }, "El archivo JSON incluye el detalle completo de tiempos de respuesta, movimientos de la barra, repeticiones de audio y pausas."),
    el("div", { class: "fila informe-acciones" },
      el("button", { class: "btn-informe morado", onclick: () => { P.evento(partida, "descarga"); app.partida === partida && app.guardar(); descargar(partida); } }, "⬇ Descargar JSON"),
      puedeCompartir(partida) ? el("button", { class: "btn-informe verde", onclick: () => compartir(partida).catch(() => {}) }, "Compartir archivo") : null,
      el("button", { class: "btn-informe amarillo", onclick: () => { salida.hidden = !salida.hidden; salida.textContent = textoJSON(partida); } }, "Ver JSON en pantalla"),
      el("button", { class: "btn-informe crema", onclick: alVolver },
        el("img", { class: "btn-informe-icono", src: "media/pausa/icono-casa.png", alt: "" }),
        "Volver")),
    salida);

  c.append(tarjeta);
  mostrar("informe");
}
