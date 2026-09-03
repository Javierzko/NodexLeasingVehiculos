'use client';

import { useState } from 'react';

type Pregunta = {
  pregunta: string;
  respuesta: string;
};

const PREGUNTAS: Pregunta[] = [
  {
    pregunta: '¿Qué significa la gestión actual de mi trámite?',
    respuesta: 'Indica qué equipo, entidad o persona está realizando la actividad necesaria para que el trámite avance.',
  },
  {
    pregunta: '¿Qué debo hacer si aparece una acción requerida?',
    respuesta: 'Revisa el mensaje de Acción requerida y completa la información o documentación solicitada.',
  },
  {
    pregunta: '¿Qué significa la próxima etapa?',
    respuesta: 'Es la actividad que normalmente continúa después de la gestión que aparece actualmente en tu trámite.',
  },
  {
    pregunta: '¿Qué significa que mi tarjeta de propiedad esté pendiente de envío?',
    respuesta: 'La tarjeta está en proceso de coordinación para ser enviada a la dirección registrada.',
  },
  {
    pregunta: '¿Qué hago si la tarjeta está pendiente por enviar sin dirección?',
    respuesta: 'Comparte los datos de entrega solicitados para poder programar el envío de la tarjeta de propiedad.',
  },
  {
    pregunta: '¿Por qué mi trámite puede permanecer varios días en una etapa?',
    respuesta: 'Algunas gestiones dependen de respuestas de entidades externas, validaciones documentales o procesos administrativos.',
  },
];

export default function PreguntasFrecuentes() {
  const [verTodas, setVerTodas] = useState(false);
  const preguntasVisibles = verTodas ? PREGUNTAS : PREGUNTAS.slice(0, 3);

  return (
    <section id="preguntas-frecuentes" className="rounded-xl border border-[#e5e2dc] bg-white px-6 py-5 shadow-[0_2px_10px_rgba(36,31,21,0.025)] sm:px-7" aria-labelledby="preguntas-frecuentes-titulo">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 id="preguntas-frecuentes-titulo" className="text-sm font-extrabold uppercase tracking-[-0.01em] text-[#1d1d1b]">Preguntas frecuentes</h2>
          <p className="mt-3 text-sm leading-6 text-[#5c5b57]">Consulta información sobre tiempos, novedades y documentos del trámite.</p>
        </div>
        <button
          type="button"
          onClick={() => setVerTodas((estadoActual) => !estadoActual)}
          aria-expanded={verTodas}
          className="shrink-0 rounded-lg border border-[#c78b21] bg-white px-4 py-2.5 text-sm font-bold text-[#a66e09] transition-colors hover:bg-[#fffaf0] focus:outline-none focus:ring-2 focus:ring-[#b87600]/35 focus:ring-offset-2"
        >
          {verTodas ? 'Ver menos preguntas' : 'Ver más preguntas'}
        </button>
      </div>

      <div className="mt-4 divide-y divide-[#eeeae4] overflow-hidden rounded-lg border border-[#eeeae4]">
        {preguntasVisibles.map(({ pregunta, respuesta }) => (
          <details key={pregunta} className="group px-4 py-1 transition-colors open:bg-[#fffaf0]">
            <summary className="cursor-pointer list-none py-3 pr-6 text-sm font-semibold leading-6 text-[#1d1d1b] focus:outline-none [&::-webkit-details-marker]:hidden">
              {pregunta}
            </summary>
            <p className="border-t border-[#eeeae4] pb-3 pt-2 text-sm leading-6 text-[#5c5b57]">{respuesta}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
