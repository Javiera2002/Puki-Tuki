import { test } from "node:test";
import assert from "node:assert/strict";
import { crearEspera } from "../src/motor/temporizador.js";

// Reloj y temporizadores falsos para controlar el tiempo.
function falso() {
  let ahora = 0;
  let tareas = [];
  let id = 0;
  return {
    reloj: () => ahora,
    programar: (fn, ms) => { tareas.push({ id: ++id, en: ahora + ms, fn }); return id; },
    cancelar: (i) => { tareas = tareas.filter((t) => t.id !== i); },
    avanzar(ms) {
      ahora += ms;
      const listas = tareas.filter((t) => t.en <= ahora);
      tareas = tareas.filter((t) => t.en > ahora);
      listas.forEach((t) => t.fn());
    },
  };
}

test("termina a los 40 s", () => {
  const f = falso();
  let fin = false;
  crearEspera(40000, () => (fin = true), f);
  f.avanzar(39999);
  assert.equal(fin, false);
  f.avanzar(1);
  assert.equal(fin, true);
});

test("en pausa no corre y al reanudar sigue con lo que faltaba", () => {
  const f = falso();
  let fin = false;
  const e = crearEspera(40000, () => (fin = true), f);
  f.avanzar(10000);
  e.pausar();
  f.avanzar(120000);
  assert.equal(fin, false);
  assert.equal(e.restante(), 30000);
  e.reanudar();
  f.avanzar(29999);
  assert.equal(fin, false);
  f.avanzar(1);
  assert.equal(fin, true);
});

test("tocar reinicia la espera completa", () => {
  const f = falso();
  let fin = false;
  const e = crearEspera(40000, () => (fin = true), f);
  f.avanzar(35000);
  e.reiniciar();
  f.avanzar(35000);
  assert.equal(fin, false);
  f.avanzar(5000);
  assert.equal(fin, true);
});

test("cancelada no termina", () => {
  const f = falso();
  let fin = false;
  const e = crearEspera(1000, () => (fin = true), f);
  e.cancelar();
  f.avanzar(5000);
  assert.equal(fin, false);
});
