// Parámetros de la aplicación (spec 002, data-model.md). Cambiarlos aquí no exige programar.
export const config = {
  versionApp: "0.1.0",
  esperaSegundos: 40,        // espera después de cada presentación de la pregunta
  repeticiones: 1,           // repeticiones de la pregunta antes de «sin respuesta»
  margenCentro: 5,           // zona del centro: de -5 a +5
  limitePuntaje1: 50,        // posición orientada > 5 y <= 50 vale 1; > 50 vale 2
  velocidadRevision: 2,      // modo revisión: velocidad de videos y voces (las esperas no cambian)
  msParaAbrirOculto: 3000,   // mantener presionado para abrir informe o partidas guardadas
  transicionMs: 500,         // fundido entre la escena y los clips
  caracteresPorSegundo: 13,  // para estimar la duración de una voz provisional
};
