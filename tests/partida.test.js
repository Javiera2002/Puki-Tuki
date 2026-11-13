import { test } from "node:test";
import assert from "node:assert/strict";
import * as P from "../src/datos/partida.js";
import { guardar, recuperarAlAbrir, ultima } from "../src/datos/almacen.js";
import { historia } from "../contenido/historia.js";

const preguntas = historia.capitulos.flatMap((c) => c.pasos).filter((p) => p.tipo === "pregunta");
const nueva = () => P.crearPartida({ preguntas, ahora: new Date(2026, 10, 14, 15, 32), azar: () => 0 });

test("partida nueva: código, 13 respuestas no presentadas y práctica", () => {
  const p = nueva();
  assert.equal(p.codigo, "PT-20261114-1532-AAAA");
  assert.equal(p.respuestas.length, 13);
  assert.ok(p.respuestas.every((r) => r.estado === "no_presentada"));
  assert.equal(p.practica.estado, "no_presentada");
  assert.ok(!("puntaje" in p.practica));
});

test("confirmar fuera del centro, en el centro y sin repetir", () => {
  const p = nueva();
  P.presentar(p, 1);
  assert.ok(P.confirmar(p, 1, 72, 8000));
  const r1 = P.respuestaDe(p, 1);
  assert.equal(r1.estado, "respondida");
  assert.equal(r1.posicionOrientada, 72); // dificultad de Tuki
  assert.equal(r1.puntaje, 2);
  assert.equal(P.confirmar(p, 1, -50, 1000), false, "no se confirma dos veces");
  assert.equal(P.presentar(p, 1), false, "no vuelve atrás");

  P.presentar(p, 2);
  P.confirmar(p, 2, 3, 2000);
  assert.equal(P.respuestaDe(p, 2).estado, "centro");
  assert.equal(P.respuestaDe(p, 2).puntaje, 0);
});

test("sin respuesta conserva los movimientos como uso", () => {
  const p = nueva();
  P.presentar(p, 3);
  P.usoBarra(p, 3, 40);
  P.presentar(p, 3);
  assert.ok(P.sinRespuesta(p, 3));
  const r = P.respuestaDe(p, 3);
  assert.equal(r.estado, "sin_respuesta");
  assert.equal(r.posicion, null);
  assert.equal(r.ultimaPosicionSinConfirmar, 40);
  assert.equal(r.presentaciones, 2);
});

test("la práctica no queda sin respuesta", () => {
  const p = nueva();
  P.presentar(p, 0);
  assert.equal(P.sinRespuesta(p, 0), false);
});

test("pausar y continuar: la pregunta abierta vuelve a no presentada", () => {
  const p = nueva();
  P.escena(p, "C1-07");
  P.presentar(p, 1);
  P.usoBarra(p, 1, -20);
  P.pausar(p, true);
  assert.equal(p.estado, "en_pausa");
  assert.ok(P.continuar(p));
  const r = P.respuestaDe(p, 1);
  assert.equal(r.estado, "no_presentada");
  assert.equal(r.ultimaPosicionSinConfirmar, -20);
  assert.equal(p.ultimaEscena, "C1-07");
});

test("terminar antes deja abiertas como no presentadas", () => {
  const p = nueva();
  P.presentar(p, 1);
  assert.ok(P.terminarAntes(p));
  assert.equal(p.estado, "terminada_antes");
  assert.equal(P.respuestaDe(p, 1).estado, "no_presentada");
  assert.ok(p.fin);
});

test("una partida en curso se recupera como pausada al abrir", () => {
  const datos = new Map();
  const alm = {
    setItem: (k, v) => datos.set(k, String(v)),
    getItem: (k) => (datos.has(k) ? datos.get(k) : null),
    key: (i) => [...datos.keys()][i],
    get length() { return datos.size; },
  };
  const p = nueva();
  assert.ok(guardar(p, alm));
  const r = recuperarAlAbrir(alm);
  assert.equal(r.estado, "en_pausa");
  assert.equal(ultima(alm).estado, "en_pausa");
  assert.ok(ultima(alm).eventos.some((e) => e.tipo === "recuperada"));
});

test("si guardar falla, devuelve false", () => {
  const alm = { setItem: () => { throw new Error("lleno"); }, getItem: () => null, key: () => null, length: 0 };
  assert.equal(guardar(nueva(), alm), false);
});
