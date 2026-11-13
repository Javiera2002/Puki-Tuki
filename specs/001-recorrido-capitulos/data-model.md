# Datos de la sesión

Session: schemaVersion, startedAt, completedAt, settings, contentVersion, responses, events.
Settings: waitSeconds (entero 1–120), presentations (entero 1–5); valores iniciales 40 y 3.
Step: id, kind (intro, practice, scene, question, end), chapter, text, item, left, right,
sceneVideo, loopVideo, audio; contenido y recursos separados del controlador.
Response: stepId, item, practice, status (confirmed o unanswered), position (0–100 o null),
centerSelected, selectedCharacter (puki, tuki o null), interacted, presentations, durationMs.
Sin confirmación: position, centerSelected y selectedCharacter son null. Un centro confirmado:
position=50, centerSelected=true, selectedCharacter=null. Duración no implica diagnóstico.
Event: tipo, stepId, instante; elección, presentación, pausa, reanudación, confirmación u omisión.
Sin información identificatoria. Una sesión incompleta exporta las respuestas existentes y los
pasos no alcanzados como not_presented en el resumen; no los convierte en omisiones.

Estados: portada → escena/introducción → pregunta/práctica → escena → cierre.
Cualquier paso activo puede pausarse; reanudar vuelve al mismo paso. La confirmación
es válida solo en pregunta activa con selección y solo una vez. El centro requiere interacción.
