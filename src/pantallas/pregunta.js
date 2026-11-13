// Pregunta: dos clips en bucle (Puki izquierda, Tuki derecha), barra libre y flecha.
// Espera de 40 s después de cada presentación; una repetición; luego «sin respuesta».
import { config } from "../../config.js";
import { el, esperar, aviso } from "./ui.js";
import { crearEspera } from "../motor/temporizador.js";
import { reproducirVoces, cortarVoz, cargarVideo } from "../motor/medios.js";
import { tarjetaProvisional } from "./escena.js?v=14";
import { VIDEOS_LISTOS, IMAGENES_LISTAS } from "../../contenido/medios_listos.js?v=14";
import * as P from "../datos/partida.js";

function idDeClip(ruta) {
  return ruta.split("/").pop().replace(/\.mp4$/i, "");
}

async function armarClip(app, clip, quien) {
  const nombre = quien === "puki" ? "Puki" : "Tuki";
  const caja = el("button", { class: `clip clip-${quien}`, "aria-label": `Clip de ${nombre}` });
  const id = idDeClip(clip.video);
  const tieneVideo = !clip.provisional || VIDEOS_LISTOS.has(id);
  const imgSrc = IMAGENES_LISTAS[id];

  if (tieneVideo) {
    const v = await cargarVideo(clip.video, { bucle: true });
    if (!v) return { caja, falla: clip.video };
    v.className = "video-clip";
    caja.append(v);
  } else if (imgSrc) {
    caja.append(el("img", { class: "video-clip", src: imgSrc, alt: nombre }));
  } else {
    caja.append(tarjetaProvisional(nombre, clip.descripcion, quien));
  }
  return { caja, falla: null };
}

function crearBarra(alMover, esPractica = false) {
  const barra = el("div", { class: "barra", role: "slider", "aria-valuemin": "-100", "aria-valuemax": "100", "aria-valuenow": "0" });
  const pista = el("div", { class: "pista" }, el("div", { class: "marca-centro" }));
  const pieza = el("div", { class: "pieza", "aria-hidden": "true" });
  const mano = esPractica
    ? el("img", { class: "mano-practica", src: "media/decision/mano.png", alt: "", "aria-hidden": "true" })
    : null;
  barra.append(el("div", { class: "extremo extremo-puki" }), pista, el("div", { class: "extremo extremo-tuki" }));
  pista.append(pieza);
  if (mano) pista.append(mano);
  let pos = 0;
  const pintar = () => {
    pieza.style.left = `${(pos + 100) / 2}%`;
    barra.setAttribute("aria-valuenow", String(Math.round(pos)));
  };
  const desdeEvento = (e) => {
    if (mano && mano.isConnected) mano.remove();
    const r = pista.getBoundingClientRect();
    const x = Math.min(Math.max(e.clientX - r.left, 0), r.width);
    pos = (x / r.width) * 200 - 100;
    pintar();
    alMover(pos);
  };
  let arrastrando = false;
  barra.addEventListener("pointerdown", (e) => { arrastrando = true; barra.setPointerCapture(e.pointerId); desdeEvento(e); });
  barra.addEventListener("pointermove", (e) => { if (arrastrando) desdeEvento(e); });
  const soltar = () => { arrastrando = false; };
  barra.addEventListener("pointerup", soltar);
  barra.addEventListener("pointercancel", soltar);
  pintar();
  return { barra, posicion: () => pos };
}

// Devuelve "ok" (respondida, centro, sin respuesta o falla técnica) o "abortada".
export async function presentarPregunta(app, paso) {
  const partida = app.partida;
  const n = paso.numero;
  const esPractica = n === 0;
  const escenario = document.getElementById("escenario");
  const zona = document.getElementById("zona-pregunta");

  // Transición: la última imagen de la escena se queda quieta y se funde con los clips.
  escenario.classList.add("desvanecer");
  await esperar(config.transicionMs);

  const [cp, ct] = await Promise.all([armarClip(app, paso.clipPuki, "puki"), armarClip(app, paso.clipTuki, "tuki")]);
  const flecha = el("button", { class: "flecha", "aria-label": "Continuar", disabled: true });
  let tocado = false;
  let resuelto = false;
  let espera = null;
  let tiempoActivo = 0;      // ms desde que terminó la primera voz, sin contar pausas
  let marca = null;

  const resaltar = (pos) => {
    cp.caja.style.setProperty("--brillo", String(Math.max(0, -pos) / 100));
    ct.caja.style.setProperty("--brillo", String(Math.max(0, pos) / 100));
  };
  const { barra, posicion } = crearBarra((pos) => {
    if (resuelto) return;
    tocado = true;
    flecha.disabled = false;
    flecha.classList.add("lista");
    P.usoBarra(partida, n, pos);
    resaltar(pos);
    if (espera) espera.reiniciar();
  }, esPractica);

  zona.replaceChildren(el("div", { class: "clips" }, cp.caja, ct.caja), el("div", { class: "fila-barra" }, barra, flecha));
  document.body.classList.add("en-pregunta");
  escenario.classList.remove("desvanecer");

  return new Promise((resolver) => {
    const cerrar = (r) => {
      if (resuelto) return;
      resuelto = true;
      if (espera) espera.cancelar();
      app.quitarReloj(reloj);
      cortarVoz();
      document.body.classList.remove("en-pregunta");
      zona.replaceChildren();
      app.guardar();
      resolver(r);
    };
    app.sesion.promesaAborto.then(() => cerrar("abortada"));

    const reloj = {
      pausar() { if (marca != null) { tiempoActivo += performance.now() - marca; marca = null; } espera?.pausar(); },
      reanudar() { if (primeraVozTermino && marca === null && !resuelto) marca = performance.now(); espera?.reanudar(); },
    };
    let primeraVozTermino = false;
    app.agregarReloj(reloj);

    if (cp.falla || ct.falla) {
      P.presentar(partida, n);
      P.fallaTecnica(partida, n, cp.falla || ct.falla);
      aviso(`No cargó ${cp.falla || ct.falla}. La pregunta ${n} quedó como falla técnica y el cuento sigue.`);
      return cerrar("ok");
    }

    async function presentarUnaVez() {
      if (resuelto) return;
      P.presentar(partida, n);
      app.guardar();
      const r = await reproducirVoces(paso.pregunta, app.textosEs);
      if (resuelto) return;
      if (r && r.falla) {
        P.fallaTecnica(partida, n, r.falla);
        aviso(`No cargó el audio ${r.falla}. La pregunta ${n} quedó como falla técnica y el cuento sigue.`);
        return cerrar("ok");
      }
      if (!primeraVozTermino) { primeraVozTermino = true; marca = app.enPausa ? null : performance.now(); }
      // si la cortó un clip, la espera parte igual (y el toque la reinicia)
      if (r === "cortada" && espera) return;
      iniciarEspera();
    }

    function iniciarEspera() {
      if (resuelto) return;
      if (espera) espera.cancelar();
      espera = crearEspera(config.esperaSegundos * 1000, alTerminarEspera);
      if (app.enPausa) espera.pausar();
    }

    function alTerminarEspera() {
      if (resuelto) return;
      const r = P.respuestaDe(partida, n);
      if (esPractica || r.presentaciones <= config.repeticiones) {
        espera = null;
        presentarUnaVez();
      } else {
        P.sinRespuesta(partida, n);
        cerrar("ok");
      }
    }

    const tocarClip = async (quien, dialogo) => {
      if (resuelto) return;
      P.toqueClip(partida, n, quien);
      if (espera) espera.reiniciar();
      if (dialogo.length) await reproducirVoces(dialogo, app.textosEs);
    };
    cp.caja.addEventListener("click", () => tocarClip("puki", paso.dialogoPuki));
    ct.caja.addEventListener("click", () => tocarClip("tuki", paso.dialogoTuki));

    flecha.addEventListener("click", () => {
      if (!tocado || resuelto) return;
      if (marca != null) { tiempoActivo += performance.now() - marca; marca = null; }
      P.confirmar(partida, n, posicion(), tiempoActivo);
      cerrar("ok");
    });

    presentarUnaVez();
  });
}
