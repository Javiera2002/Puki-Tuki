// Espera que se puede pausar, reanudar con el tiempo restante y reiniciar.
// El reloj y los temporizadores se pueden inyectar para probarla sin navegador.
const relojPorDefecto = () => (typeof performance !== "undefined" ? performance.now() : Date.now());

export function crearEspera(ms, alTerminar, { reloj = relojPorDefecto, programar = setTimeout, cancelar = clearTimeout } = {}) {
  let restante = ms;
  let inicio = null;
  let id = null;
  let terminada = false;

  function arrancar() {
    if (terminada || id !== null) return;
    inicio = reloj();
    id = programar(() => {
      id = null;
      terminada = true;
      restante = 0;
      alTerminar();
    }, restante);
  }

  function detener() {
    if (id === null) return;
    cancelar(id);
    id = null;
    restante = Math.max(0, restante - (reloj() - inicio));
  }

  arrancar();

  return {
    pausar: detener,
    reanudar: arrancar,
    reiniciar(nuevoMs = ms) {
      if (terminada) return;
      const enPausa = id === null;
      detener();
      restante = nuevoMs;
      if (!enPausa) arrancar();
    },
    cancelar() {
      detener();
      terminada = true;
    },
    restante() {
      return id === null ? restante : Math.max(0, restante - (reloj() - inicio));
    },
    get activa() {
      return id !== null;
    },
  };
}
