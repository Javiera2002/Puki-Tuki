// Medios reales ya disponibles en media/escenas/, media/clips/ y media/imagenes_escenas/.
// Cuando un ID está en VIDEOS_LISTOS, se reproduce el .mp4 en vez de la tarjeta provisional.
export const VIDEOS_LISTOS = new Set([
  "I-01",
  "I-02",
  "I-05",
  "R00-P",
  "R00-T",
  "C1-01",
  "C1-02",
]);

// Solo los videos listados aquí mantienen su propio audio; los demás van en silencio (solo suena la voz en off).
export const VIDEOS_CON_SONIDO = new Set([
  "C1-02",
]);

// Escenas cuyo video continúa en la escena siguiente sin cortarse (ej. I-02 sigue en I-03).
export const VIDEOS_CONTINUOS = {
  "I-02": "I-03",
};

export const IMAGENES_LISTAS = {
  "I-04": "media/imagenes_escenas/I-04.png",
  "C1-03": "media/imagenes_escenas/C1-03.png",
  "C1-04": "media/imagenes_escenas/C1-04.png",
  "C1-05": "media/imagenes_escenas/C1-05.png",
  "C1-06": "media/imagenes_escenas/C1-06.png",
  "C1-07": "media/imagenes_escenas/C1-07.png",
  "C1-10": "media/imagenes_escenas/C1-10.png",
  "C1-11": "media/imagenes_escenas/C1-10.png",
  "C1-12": "media/imagenes_escenas/C1-12.png",
  "R01-P": "media/imagenes_escenas/R01-P.png",
  "R01-T": "media/imagenes_escenas/R01-T.png",
  "R02-P": "media/imagenes_escenas/C1-10.png",
  "R02-T": "media/imagenes_escenas/C1-12.png",
  "C2-01": "media/imagenes_escenas/C2-01.png",
  "C2-02": "media/imagenes_escenas/C2-02.png",
  "C2-03": "media/imagenes_escenas/C2-03.png",
  "C2-04": "media/imagenes_escenas/C2-04.png",
  "C2-05": "media/imagenes_escenas/C2-05.png",
};
