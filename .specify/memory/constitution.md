<!--
Sync Impact Report 1.1.0 (2026-11-09): el guion oficial pasa a `contenido/guion.md`, dentro
de esta carpeta, que funciona sola. Se quitan referencias a archivos de fuera. Se precisa el
principio V (la pregunta queda a la vista y se repite), se agrega que los datos no salen de la
tablet hasta que un adulto descarga el JSON, y el control de respuesta queda definido en la
especificación.

Sync Impact Report anterior
Versión: plantilla sin completar → 1.0.0 (primera constitución del proyecto).
Principios: los cinco espacios de la plantilla se completan con reglas acordadas.
Secciones añadidas: Alcance del prototipo; Forma de trabajo.
Secciones eliminadas: ninguna. Pendientes de la constitución: ninguno.
Las decisiones de interacción aún abiertas corresponden a la especificación.
-->
# Puki y Tuki Constitution

## Core Principles

### I. Decisiones de diseño explícitas

Las decisiones de diseño pertenecen a Javiera. Toda alternativa introducida por la IA
debe identificarse como propuesta hasta que ella la adopte. Una duda pendiente no puede
convertirse en una decisión mediante la implementación. Los acuerdos deben quedar escritos
en la especificación.

### II. Fidelidad al contenido acordado

El guion oficial es `contenido/guion.md`, dentro de esta carpeta. Manda sobre cualquier
otro material. Las preguntas y sus correspondencias con los instrumentos deben conservarse.
Programar una pantalla no autoriza a reescribir una pregunta, alterar su significado ni sustituir una edición de Javiera.
Los ítems adicionales del PSC conservan la indicación de propuesta donde corresponda.

### III. Funcionamiento compartido entre capítulos

La reproducción de escenas, la presentación de preguntas, la respuesta y la continuación
del cuento deben especificarse como un funcionamiento común. Los capítulos aportan sus
propios videos, audios, imágenes y preguntas. El capítulo 1 será la primera implementación
para comprobar ese recorrido. Añadir otro capítulo no debe exigir copiar el código de
interacción; una interacción nueva sí requiere especificar su comportamiento particular.

### IV. Respuestas interpretables y alcance explícito

La aplicación debe conservar lo que el participante respondió sin atribuirle significados
que no se hayan definido. La posición inicial de un control no constituye por sí sola una
respuesta confirmada. El significado del centro, los grados de identificación y cualquier
conversión a puntaje deben definirse antes de utilizarlos para interpretar resultados.
El prototipo no puede presentar diagnósticos, puntos de corte ni equivalencia psicométrica
con los instrumentos originales sin el respaldo correspondiente.

### V. Comprensión y uso infantil

La experiencia se dirige a niños de 4 a 7 años. Las instrucciones deben ser breves y contar
con apoyo de audio, sin exigir lectura autónoma. Las acciones principales deben poder
realizarse mediante contacto en pantalla. Mientras se responde, la pregunta queda a la
vista con los dos clips y se repite si no hay respuesta. El avance debe distinguirse de la
elección. Revisar el diseño con IA permite
detectar posibles problemas; no sustituye observar su uso con participantes.

## Alcance del prototipo

El encargo es una aplicación de interfaz: las pantallas y las interacciones que utiliza
el participante, para tablet. No se debe incorporar un servidor, cuentas de usuario o
servicios de generación de contenido durante la sesión sin acordar un cambio de alcance.
Los datos quedan en la tablet hasta que un adulto descarga el JSON; no se envían a terceros.

Los videos y audios se preparan previamente. Su producción y la programación de los
controles son trabajos separados: cambiar la forma de responder no debe exigir generar
nuevamente los videos. El diseño debe conservar la apariencia de Puki y Tuki establecida
en sus imágenes de referencia, que se guardan en `media/`.

El control de respuesta, las reglas de almacenamiento y la exportación se definen en la
especificación.

## Forma de trabajo

1. Escribir qué debe hacer la función y cómo se comprobará, antes de programarla.
2. Registrar las dudas que afectan al comportamiento y resolverlas antes de implementar
   la parte que depende de ellas.
3. Preparar el plan y las tareas con Spec Kit a partir de la especificación acordada.
4. Construir primero el recorrido del capítulo 1 y comprobar reproducción, preguntas,
   respuesta y continuación antes de ampliar el contenido a los demás capítulos.
5. Verificar las interacciones afectadas por cada cambio y registrar las limitaciones
   observadas. Una demostración técnica no constituye una validación del instrumento.

Para corregir documentos entregados se crea una versión nueva. Una sola IA puede editar un mismo archivo a la vez.
Los prompts importantes usados para construir la aplicación se registran aparte.

## Governance

Esta constitución reúne las reglas acordadas para la aplicación y no reemplaza las
instrucciones de Javiera. Las especificaciones y los planes deben
comprobar su cumplimiento. Si una decisión nueva cambia estas reglas, se conversa con
Javiera y se actualiza el documento antes de implementar el cambio.

La versión aumenta de forma mayor si cambia un principio de manera incompatible, menor
si se añade una regla sustantiva y de parche si se aclara la redacción sin cambiarla.
Cada modificación debe registrar su fecha y explicar su efecto.

**Version**: 1.1.0 | **Ratified**: 2026-11-06 | **Last Amended**: 2026-11-09
