import { test } from "node:test";
import assert from "node:assert/strict";
import { orientar, esCentro, puntaje, sumaPorGrupo } from "../src/datos/puntaje.js";

test("posición orientada hacia el personaje con la dificultad", () => {
  assert.equal(orientar(80, "tuki"), 80);
  assert.equal(orientar(80, "puki"), -80);
  assert.equal(orientar(-30, "puki"), 30);
  assert.equal(orientar(null, "puki"), null);
});

test("centro de -5 a +5", () => {
  assert.ok(esCentro(0));
  assert.ok(esCentro(5));
  assert.ok(esCentro(-5));
  assert.ok(!esCentro(6));
});

test("puntaje 0-1-2 (opción 2)", () => {
  assert.equal(puntaje(-100), 0);
  assert.equal(puntaje(0), 0);
  assert.equal(puntaje(5), 0);
  assert.equal(puntaje(6), 1);
  assert.equal(puntaje(50), 1);
  assert.equal(puntaje(51), 2);
  assert.equal(puntaje(100), 2);
  assert.equal(puntaje(null), null);
});

test("suma por grupo con faltantes", () => {
  const r = [
    { grupo: "sdq_pares", estado: "respondida", puntaje: 2 },
    { grupo: "sdq_pares", estado: "centro", puntaje: 0 },
    { grupo: "sdq_pares", estado: "sin_respuesta", puntaje: null },
    { grupo: "psc_extra", estado: "respondida", puntaje: 1 },
  ];
  const s = sumaPorGrupo(r);
  assert.deepEqual(s.sdq_pares, { suma: 2, respondidas: 2, faltan: 3 });
  assert.deepEqual(s.psc_extra, { suma: 1, respondidas: 1, faltan: 2 });
  assert.deepEqual(s.sdq_emocional, { suma: 0, respondidas: 0, faltan: 5 });
});
