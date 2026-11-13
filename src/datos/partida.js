// Partida: crear, cambiar de estado y registrar eventos (data-model.md). Sin navegador.
import { orientar, esCentro, puntaje } from "./puntaje.js";

const LETRAS = "ABCDEFGHJKLMNPQRSTUVWXYZ";
const dos = (n) => String(n).padStart(2, "0");

export function horaLocalISO(fecha = new Date()) {
  const off = -fecha.getTimezoneOffset();
  const signo = off >= 0 ? "+" : "-";
  return `${fecha.getFullYear()}-${dos(fecha.getMonth() + 1)}-${dos(fecha.getDate())}T${dos(fecha.getHours())}:${dos(fecha.getMinutes())}:${dos(fecha.getSeconds())}${signo}${dos(Math.floor(Math.abs(off) / 60))}:${dos(Math.abs(off) % 60)}`;
}

export function crearCodigo(fecha = new Date(), azar = Math.random) {
  let x = "";
  for (let i = 0; i < 4; i++) x += LETRAS[Math.floor(azar() * LETRAS.length)];
  return `PT-${fecha.getFullYear()}${dos(fecha.getMonth() + 1)}${dos(fecha.getDate())}-${dos(fecha.getHours())}${dos(fecha.getMinutes())}-${x}`;
}

function respuestaVacia(p) {
  return {
    numero: p.numero,
    contenido: p.contenido,
    items: p.items,
    grupo: p.grupo,
    dificultad: p.dificultad,
    estado: "no_presentada",
    posicion: null,
    posicionOrientada: null,
    puntaje: null,
    tiempoHastaConfirmarMs: null,
    presentaciones: 0,
    toquesClip: { puki: 0, tuki: 0 },
    movimientosBarra: 0,
    ultimaPosicionSinConfirmar: null,
  };
}

// preguntas: metadatos de las 13 preguntas (numero 1..13) y la práctica (numero 0)
export function crearPartida({ preguntas, quienPrueba = "", edad = null, idiomaSubtitulos = null, revision = null,
  versiones = {}, medios = "provisional", dispositivo = {}, ahora = new Date(), azar = Math.random }) {
  const practica = preguntas.find((p) => p.numero === 0);
  const p = {
    formato: "pukituki.partida.v1",
    codigo: crearCodigo(ahora, azar),
    quienPrueba: quienPrueba || "",
    edad: edad ?? null,
    revision,
    idiomaSubtitulos,
    estado: "en_curso",
    inicio: horaLocalISO(ahora),
    fin: null,
    ultimaEscena: null,
    versiones,
    medios,
    dispositivo,
    practica: practica ? respuestaVacia(practica) : null,
    respuestas: preguntas.filter((q) => q.numero > 0).sort((a, b) => a.numero - b.numero).map(respuestaVacia),
    eventos: [],
  };
  if (p.practica) {
    delete p.practica.posicionOrientada;
    delete p.practica.puntaje;
  }
  evento(p, "inicio", {}, ahora);
  return p;
}

export function evento(partida, tipo, datos = {}, ahora = new Date()) {
  partida.eventos.push({ hora: horaLocalISO(ahora), tipo, ...datos });
}

export function respuestaDe(partida, numero) {
  return numero === 0 ? partida.practica : partida.respuestas.find((r) => r.numero === numero);
}

export function escena(partida, id, ahora) {
  partida.ultimaEscena = id;
  evento(partida, "escena", { escena: id }, ahora);
}

export function presentar(partida, numero, ahora) {
  const r = respuestaDe(partida, numero);
  if (!r || (r.estado !== "no_presentada" && r.estado !== "presentada")) return false;
  r.estado = "presentada";
  r.presentaciones += 1;
  evento(partida, r.presentaciones === 1 ? "pregunta_presentada" : "repeticion", { pregunta: numero }, ahora);
  return true;
}

export function confirmar(partida, numero, posicion, tiempoMs, ahora) {
  const r = respuestaDe(partida, numero);
  if (!r || r.estado !== "presentada") return false;
  const centro = esCentro(posicion);
  r.estado = centro ? "centro" : "respondida";
  r.posicion = Math.round(posicion);
  r.tiempoHastaConfirmarMs = Math.round(tiempoMs);
  r.ultimaPosicionSinConfirmar = null;
  if (numero !== 0) {
    r.posicionOrientada = orientar(r.posicion, r.dificultad);
    r.puntaje = puntaje(r.posicionOrientada);
  }
  evento(partida, "confirmada", { pregunta: numero }, ahora);
  return true;
}

export function sinRespuesta(partida, numero, ahora) {
  const r = respuestaDe(partida, numero);
  if (!r || r.estado !== "presentada" || numero === 0) return false;
  r.estado = "sin_respuesta";
  evento(partida, "sin_respuesta", { pregunta: numero }, ahora);
  return true;
}

export function fallaTecnica(partida, numero, detalle, ahora) {
  const r = numero == null ? null : respuestaDe(partida, numero);
  if (r && r.estado === "presentada") r.estado = "falla_tecnica";
  evento(partida, "falla_tecnica", { pregunta: numero ?? null, detalle }, ahora);
}

export function usoBarra(partida, numero, posicion) {
  const r = respuestaDe(partida, numero);
  if (!r || r.estado !== "presentada") return;
  r.movimientosBarra += 1;
  r.ultimaPosicionSinConfirmar = Math.round(posicion);
}

export function toqueClip(partida, numero, quien) {
  const r = respuestaDe(partida, numero);
  if (!r) return;
  r.toquesClip[quien] += 1;
}

// La pregunta abierta vuelve a no_presentada (al continuar o al terminar antes). Sus movimientos quedan como uso.
function cerrarAbiertas(partida) {
  for (const r of [partida.practica, ...partida.respuestas]) {
    if (r && r.estado === "presentada") r.estado = "no_presentada";
  }
}

export function pausar(partida, automatica = false, ahora) {
  if (partida.estado !== "en_curso") return;
  partida.estado = "en_pausa";
  evento(partida, automatica ? "pausa_automatica" : "pausa", { escena: partida.ultimaEscena }, ahora);
}

export function continuar(partida, ahora) {
  if (partida.estado !== "en_pausa") return false;
  cerrarAbiertas(partida);
  partida.estado = "en_curso";
  evento(partida, "continuar", { escena: partida.ultimaEscena }, ahora);
  return true;
}

export function reanudarSinSalir(partida, ahora) {
  if (partida.estado !== "en_pausa") return;
  partida.estado = "en_curso";
  evento(partida, "continuar", { escena: partida.ultimaEscena }, ahora);
}

export function recuperar(partida, ahora) {
  if (partida.estado !== "en_curso") return false;
  partida.estado = "en_pausa";
  evento(partida, "recuperada", { escena: partida.ultimaEscena }, ahora);
  return true;
}

export function terminarAntes(partida, ahora) {
  if (partida.estado !== "en_curso" && partida.estado !== "en_pausa") return false;
  cerrarAbiertas(partida);
  partida.estado = "terminada_antes";
  partida.fin = horaLocalISO(ahora);
  evento(partida, "terminar_partida", {}, ahora);
  return true;
}

export function terminar(partida, ahora) {
  if (partida.estado !== "en_curso") return false;
  partida.estado = "terminada";
  partida.fin = horaLocalISO(ahora);
  evento(partida, "fin", {}, ahora);
  return true;
}
