import { test } from "node:test";
import assert from "node:assert/strict";
import * as P from "../src/datos/partida.js";
import { armarJSON, nombreArchivo } from "../src/datos/exportar.js";
import { historia } from "../contenido/historia.js";

const preguntas = historia.capitulos.flatMap((c) => c.pasos).filter((p) => p.tipo === "pregunta");

test("el JSON tiene las 13 respuestas en cualquier estado y la práctica sin puntaje", () => {
  const p = P.crearPartida({ preguntas, ahora: new Date(2026, 10, 14, 15, 32), azar: () => 0 });
  P.presentar(p, 0);
  P.confirmar(p, 0, -64, 15200);
  P.presentar(p, 1);
  P.confirmar(p, 1, 72, 8420);
  P.presentar(p, 2);
  P.presentar(p, 2);
  P.sinRespuesta(p, 2);
  const j = armarJSON(p);
  assert.equal(j.formato, "pukituki.partida.v1");
  assert.equal(j.respuestas.length, 13);
  assert.equal(j.respuestas[0].estado, "respondida");
  assert.equal(j.respuestas[1].estado, "sin_respuesta");
  assert.equal(j.respuestas[1].posicion, null);
  assert.equal(j.respuestas[2].estado, "no_presentada");
  assert.equal(j.practica.tiempoHastaConfirmarMs, 15200);
  assert.ok(!("puntaje" in j.practica));
  assert.equal(j.puntajes.sdq_pares.suma, 2);
  assert.match(j.puntajes.nota, /Hipótesis/);
  assert.equal(j.partida.codigo, p.codigo);
  assert.ok(Array.isArray(j.eventos));
  assert.equal(nombreArchivo(p), "puki-tuki_PT-20261114-1532-AAAA_20261114-1532.json");
});
