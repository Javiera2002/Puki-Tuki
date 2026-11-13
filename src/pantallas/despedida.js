// Cierre: Puki y Tuki se despiden; botón visible para ver el reporte/resultados o volver al inicio.
import { el, mostrar, limpiar, pulsacionLarga } from "./ui.js";
import { mostrarInforme } from "./informe.js";

export function mostrarDespedida(app) {
  const c = limpiar("despedida");
  const irAlInforme = () => mostrarInforme(app, app.partida, () => app.irBienvenida());
  const barraFinal = el("div", { class: "acciones-despedida" },
    el("button", { class: "btn grande", onclick: irAlInforme }, "Ver reporte / resultados"),
    el("button", { class: "btn", onclick: () => app.irBienvenida() }, "Volver al inicio"));
  const esquina = el("button", { class: "esquina-informe", "aria-label": "Informe para el adulto", onclick: irAlInforme }, "⋯");
  pulsacionLarga(esquina, irAlInforme);
  c.append(
    el("img", { class: "fondo-difuso", src: "media/provisional/INICIO-1_inicio-infantil.webp", alt: "" }),
    el("img", { class: "fondo-inicio", src: "media/provisional/INICIO-1_inicio-infantil.webp", alt: "" }),
    barraFinal,
    esquina);
  mostrar("despedida");
}
