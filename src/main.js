// Arranque y navegación entre pantallas.
import { historia } from "../contenido/historia.js";
import es from "../contenido/subtitulos/es.js";
import { config } from "../config.js";
import * as M from "./motor/medios.js";
import * as A from "./datos/almacen.js";
import * as P from "./datos/partida.js";
import { descargar } from "./datos/exportar.js";
import { aplanar, preguntasDe, correr, indiceContinuar, indiceCapitulo } from "./motor/recorrido.js?v=14";
import { mostrarBienvenida } from "./pantallas/bienvenida.js?v=14";
import { mostrarInicio } from "./pantallas/inicio.js?v=14";
import { abrirPausa, cerrarPausa } from "./pantallas/pausa.js?v=14";
import { mostrarDespedida } from "./pantallas/despedida.js?v=14";
import { mostrarInforme } from "./pantallas/informe.js?v=14";
import { aviso, mostrar } from "./pantallas/ui.js?v=14";

const app = {
  historia,
  pasos: aplanar(historia),
  textosEs: es,
  textosIdioma: null,
  partida: null,
  sesion: null,
  velocidad: 1,
  enCuento: false,
  enPausa: false,
  esperas: new Set(),
  relojes: new Set(),
  voz: null,
  avisoGuardado: false,

  guardar() {
    if (!this.partida) return;
    if (A.guardar(this.partida)) return;
    if (this.avisoGuardado) return;
    this.avisoGuardado = true;
    P.evento(this.partida, "guardado_fallido");
    aviso("No se pudo guardar la partida en esta tablet. Descarga el JSON para no perder los datos.",
      { boton: "Descargar JSON", alTocar: () => descargar(this.partida), ms: 0 });
  },
  registrarEspera(e) { this.esperas.add(e); if (this.enPausa) e.pausar(); },
  agregarReloj(r) { this.relojes.add(r); },
  quitarReloj(r) { this.relojes.delete(r); },
  mostrarTituloCapitulo(id) { document.body.dataset.capitulo = id; },

  nuevaSesion() {
    let fin;
    const s = { abortada: false };
    s.promesaAborto = new Promise((r) => (fin = r));
    s.abortar = () => { if (!s.abortada) { s.abortada = true; fin(); } };
    this.sesion = s;
    this.esperas.clear();
    this.relojes.clear();
  },

  pausar(automatica = false) {
    if (!this.enCuento || this.enPausa) return;
    this.enPausa = true;
    P.pausar(this.partida, automatica);
    this.guardar();
    M.pausarTodo();
    this.esperas.forEach((e) => e.pausar());
    this.relojes.forEach((r) => r.pausar());
    abrirPausa(this);
  },

  reanudar() {
    if (!this.enPausa) return;
    this.enPausa = false;
    P.reanudarSinSalir(this.partida);
    this.guardar();
    cerrarPausa();
    M.reanudarTodo();
    this.esperas.forEach((e) => e.reanudar());
    this.relojes.forEach((r) => r.reanudar());
  },

  salirAlInicio() {          // la partida queda en pausa para continuarla después
    this.sesion?.abortar();
    M.cortarVoz();
    M.reanudarTodo();
    this.enPausa = false;
    this.enCuento = false;
    cerrarPausa();
    this.guardar();
    this.irBienvenida();
  },

  terminarPartida() {
    this.sesion?.abortar();
    M.cortarVoz();
    M.reanudarTodo();
    this.enPausa = false;
    this.enCuento = false;
    cerrarPausa();
    P.terminarAntes(this.partida);
    this.guardar();
    mostrarInforme(this, this.partida, () => this.irBienvenida());
  },

  async cargarIdioma(idioma) {
    this.textosIdioma = null;
    if (!idioma) return;
    try {
      this.textosIdioma = (await import(`../contenido/subtitulos/${idioma}.js`)).default;
    } catch (e) {
      this.textosIdioma = null;
    }
  },

  async empezarNueva({ quienPrueba, edad, idiomaSubtitulos, revision }) {
    this.partida = P.crearPartida({
      preguntas: preguntasDe(historia),
      quienPrueba, edad, idiomaSubtitulos, revision,
      versiones: { app: config.versionApp, guion: historia.version },
      medios: "provisional",
      dispositivo: { ancho: innerWidth, alto: innerHeight, orientacion: innerWidth >= innerHeight ? "horizontal" : "vertical", navegador: navigator.userAgent },
    });
    this.avisoGuardado = false;
    this.guardar();
    await this.cargarIdioma(idiomaSubtitulos);
    this.velocidad = revision ? revision.velocidad : 1;
    M.fijarVelocidad(this.velocidad);
    let desde = 0;
    let hasta = Infinity;
    if (revision) {
      desde = indiceCapitulo(this.pasos, revision.capitulo);
      const sig = this.pasos.findIndex((p, i) => i > desde && p.capitulo !== revision.capitulo);
      hasta = sig < 0 ? Infinity : sig;
    }
    mostrarInicio(this, () => this.iniciarCuento(desde, hasta));
  },

  async continuarUltima() {
    const p = A.ultima();
    if (!p || p.estado !== "en_pausa") return;
    this.partida = p;
    P.continuar(p);
    this.avisoGuardado = false;
    this.guardar();
    await this.cargarIdioma(p.idiomaSubtitulos);
    this.velocidad = p.revision ? p.revision.velocidad : 1;
    M.fijarVelocidad(this.velocidad);
    const desde = indiceContinuar(this.pasos, p);
    let hasta = Infinity;
    if (p.revision) {
      const sig = this.pasos.findIndex((x, i) => i > desde && x.capitulo !== p.revision.capitulo);
      hasta = sig < 0 ? Infinity : sig;
    }
    mostrarInicio(this, () => this.iniciarCuento(desde, hasta));
  },

  async iniciarCuento(desde, hasta) {
    this.nuevaSesion();
    this.enCuento = true;
    this.enPausa = false;
    mostrar("cuento");
    const r = await correr(this, desde, hasta);
    if (r !== "terminada") return;
    this.enCuento = false;
    P.terminar(this.partida);
    this.guardar();
    mostrarInforme(this, this.partida, () => this.irBienvenida());
  },

  irBienvenida() {
    mostrarBienvenida(this);
  },
};

// Subtítulo traducido arriba de la escena (solo portugués o inglés) y texto de la voz provisional.
M.alSubtitulo((clave) => {
  app.voz?.(clave);
  const franja = document.getElementById("subtitulo");
  const t = clave && app.textosIdioma ? app.textosIdioma[clave] : null;
  franja.textContent = t || "";
  franja.classList.toggle("visible", !!t);
});

// Si el navegador bloquea el sonido, el adulto lo reanuda con un toque.
M.alBloqueo(() => new Promise((res) => {
  aviso("El navegador detuvo el sonido.", { boton: "Reanudar sonido", alTocar: res, ms: 0 });
}));

// Pausa automática al bloquear la tablet, cambiar de aplicación o de pestaña.
document.addEventListener("visibilitychange", () => { if (document.hidden) app.pausar(true); });
addEventListener("pagehide", () => { app.pausar(true); app.guardar(); });

document.getElementById("boton-pausa").addEventListener("click", () => app.pausar(false));

A.recuperarAlAbrir();
app.irBienvenida();
window.__app = app;   // para revisar en la consola del navegador
