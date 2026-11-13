import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { historia } from "../contenido/historia.js";
import es from "../contenido/subtitulos/es.js";

const raiz = new URL("../", import.meta.url);
const guion = readFileSync(new URL("contenido/guion.md", raiz), "utf8").replace(/\s+/g, " ");
const pasos = historia.capitulos.flatMap((c) => c.pasos);
const preguntas = pasos.filter((p) => p.tipo === "pregunta" && p.numero > 0);

const TABLA = { 1: "tuki", 2: "puki", 3: "puki", 4: "tuki", 5: "tuki", 6: "tuki", 7: "puki",
  8: "puki", 9: "puki", 10: "tuki", 11: "puki", 12: "tuki", 13: "tuki" };

test("13 preguntas numeradas 1 a 13 y la práctica", () => {
  assert.deepEqual(preguntas.map((p) => p.numero), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
  assert.equal(pasos.filter((p) => p.tipo === "pregunta" && p.numero === 0).length, 1);
});

test("dificultad igual a la tabla de la spec", () => {
  for (const p of preguntas) assert.equal(p.dificultad, TABLA[p.numero], `pregunta ${p.numero}`);
});

test("todas las voces existen en es.js y son iguales al guion oficial", () => {
  const voces = pasos.flatMap((p) => (p.tipo === "escena" ? p.voces : [...p.pregunta, ...p.dialogoPuki, ...p.dialogoTuki]));
  assert.ok(voces.length > 50);
  for (const v of voces) {
    const t = es[v.clave];
    assert.ok(t, `falta ${v.clave}`);
    assert.ok(guion.includes(t), `${v.clave} no aparece igual en guion.md: «${t}»`);
  }
});

test("los audios declarados existen", () => {
  for (const p of pasos) {
    const vs = p.tipo === "escena" ? p.voces : p.pregunta;
    for (const v of vs) if (v.audio) assert.ok(existsSync(new URL(v.audio, raiz)), v.audio);
  }
});
