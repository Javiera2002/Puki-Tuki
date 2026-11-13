// Voces y videos. Una sola voz a la vez; cada reproducción se comprueba; un archivo final que no
// carga se reintenta una vez y luego se informa como falla técnica (research.md 4, 5, 13).
import { config } from "../../config.js";

let velocidad = 1;
let silencio = false;
let actual = null;        // voz en curso: { cortar, pausar, reanudar }
let enPausa = false;
const oyentes = { subtitulo: () => {}, bloqueo: async () => {} };

export function fijarVelocidad(v) { velocidad = v; }
export function alternarSonido() { silencio = !silencio; return silencio; }
export function sonidoSilenciado() { return silencio; }
export function hayPausa() { return enPausa; }
export function alSubtitulo(fn) { oyentes.subtitulo = fn; }
// fn() debe devolver una promesa que se resuelve cuando el adulto toca «reanudar sonido».
export function alBloqueo(fn) { oyentes.bloqueo = fn; }

let vozNavegador = null;
function elegirVoz() {
  if (vozNavegador || typeof speechSynthesis === "undefined") return vozNavegador;
  const vs = speechSynthesis.getVoices().filter((v) => v.lang && v.lang.toLowerCase().startsWith("es"));
  const natural = (v) => /natural|online|google/i.test(v.name) ? 0 : 1;
  const orden = (v) => {
    const l = v.lang.toLowerCase();
    if (l === "es-cl") return 0;
    if (["es-419", "es-mx", "es-us", "es-ar", "es-co", "es-pe"].includes(l)) return 1;
    return 2;
  };
  vs.sort((a, b) => orden(a) - orden(b) || natural(a) - natural(b));
  vozNavegador = vs[0] || null;
  return vozNavegador;
}
if (typeof speechSynthesis !== "undefined") speechSynthesis.onvoiceschanged = () => { vozNavegador = null; elegirVoz(); };

export function cortarVoz() {
  if (actual) actual.cortar();
  actual = null;
}

export function pausarTodo() {
  enPausa = true;
  if (actual) actual.pausar();
  document.querySelectorAll("video").forEach((v) => v.pause());
}

export function reanudarTodo() {
  enPausa = false;
  if (actual) actual.reanudar();
  document.querySelectorAll("video[data-activo]").forEach((v) => v.play().catch(() => {}));
}

function esperarMs(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// Reproduce un archivo de audio. Devuelve "ok", "cortada" o "falla".
function audioArchivo(src) {
  return new Promise((resolver) => {
    let intentos = 0;
    let a = null;
    let fin = false;
    const terminar = (r) => { if (!fin) { fin = true; if (a) { a.onended = a.onerror = null; a.pause(); } resolver(r); } };
    const control = {
      cortar: () => terminar("cortada"),
      pausar: () => a && a.pause(),
      reanudar: () => a && !fin && intentarPlay(),
    };
    actual = control;
    function intentarPlay() {
      a.playbackRate = velocidad;
      a.muted = silencio;
      a.play().catch(async (e) => {
        if (fin) return;
        if (e && e.name === "NotAllowedError") {
          await oyentes.bloqueo();      // el adulto toca «reanudar sonido»
          if (!fin && !enPausa) intentarPlay();
        } else {
          error();
        }
      });
    }
    function error() {
      if (fin) return;
      intentos += 1;
      if (intentos <= 1) cargar(); else terminar("falla");
    }
    function cargar() {
      if (a) { a.onended = a.onerror = null; a.pause(); }
      a = new Audio(src);
      a.onended = () => terminar("ok");
      a.onerror = error;
      if (!enPausa) intentarPlay();
    }
    cargar();
  });
}

// Voz provisional: la lee la voz del navegador. Si no hay, espera lo que duraría.
function audioNavegador(texto) {
  return new Promise((resolver) => {
    let fin = false;
    let u = null;
    let espera = null;
    const terminar = (r) => {
      if (fin) return;
      fin = true;
      clearTimeout(espera);
      if (u) { u.onend = u.onerror = null; try { speechSynthesis.cancel(); } catch (e) {} }
      resolver(r);
    };
    const durMs = Math.max(1200, (texto.length / config.caracteresPorSegundo) * 1000) / velocidad;
    function hablar() {
      if (fin || enPausa) return;
      if (typeof speechSynthesis === "undefined" || silencio) {
        espera = setTimeout(() => terminar("ok"), durMs);
        return;
      }
      speechSynthesis.cancel();
      u = new SpeechSynthesisUtterance(texto);
      u.lang = "es-CL";
      const v = elegirVoz();
      if (v) u.voice = v;
      u.rate = velocidad;
      u.onend = () => terminar("ok");
      u.onerror = (e) => { if (e.error !== "interrupted" && e.error !== "canceled") terminar("ok"); };
      speechSynthesis.speak(u);
      // red de seguridad si el navegador no avisa el final
      espera = setTimeout(() => terminar("ok"), durMs * 2.5 + 3000);
    }
    actual = {
      cortar: () => terminar("cortada"),
      pausar: () => { clearTimeout(espera); if (u) { u.onend = u.onerror = null; try { speechSynthesis.cancel(); } catch (e) {} } },
      reanudar: () => hablar(),   // al reanudar, la frase provisional se repite desde el inicio
    };
    hablar();
  });
}

// voz: { clave, audio?, provisional? }, texto: el texto en español (para la voz del navegador)
export async function reproducirVoz(voz, texto) {
  cortarVoz();
  oyentes.subtitulo(voz.clave);
  const r = voz.audio ? await audioArchivo(voz.audio) : await audioNavegador(texto || "");
  if (r !== "cortada") { actual = null; oyentes.subtitulo(null); }
  return r;
}

export async function reproducirVoces(voces, textos) {
  for (const v of voces) {
    const r = await reproducirVoz(v, textos[v.clave]);
    if (r === "cortada") return "cortada";
    if (r === "falla") return { falla: v.audio || v.clave };
    while (enPausa) await esperarMs(200);
  }
  return "ok";
}

// Video de una escena o un clip. Devuelve el elemento ya andando, o null si falló dos veces.
export function cargarVideo(src, { bucle = false, conSonido = false } = {}) {
  return new Promise((resolver) => {
    let intentos = 0;
    const v = document.createElement("video");
    v.playsInline = true;
    v.setAttribute("playsinline", "");
    v.muted = !conSonido || silencio;
    v.loop = bucle;
    v.preload = "auto";
    v.dataset.activo = "1";
    const probar = () => {
      v.src = src;
      v.playbackRate = velocidad;
      const pr = enPausa ? Promise.resolve() : v.play();
      pr.then(() => resolver(v)).catch(() => {
        intentos += 1;
        if (intentos <= 1) probar(); else resolver(null);
      });
    };
    v.onerror = () => { intentos += 1; if (intentos <= 1) probar(); else resolver(null); };
    probar();
  });
}
