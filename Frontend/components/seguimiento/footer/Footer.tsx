"use client";

import { useEffect, useState } from "react";

type PreguntaFrecuente = {
  categoria: string;
  pregunta: string;
  respuesta: string;
};

const PREGUNTAS_FRECUENTES: PreguntaFrecuente[] = [
  {
    categoria: "Generalidades",
    pregunta: "¿Qué puedo consultar en este Portal?",
    respuesta:
      "Puedes consultar el estado y avance de tu trámite de Finalización Leasing Vehículos, conocer en qué etapa se encuentra, quién está gestionando actualmente el proceso, qué está ocurriendo y si debes realizar alguna acción.",
  },

  {
    categoria: "Generalidades",
    pregunta: "¿Cómo consulto mi trámite?",
    respuesta:
      "Ingresa tu número de contrato y el documento de identidad del locatario registrado en el trámite.",
  },

  {
    categoria: "Generalidades",
    pregunta: "¿Qué información puedo ver sobre mi trámite?",
    respuesta:
      "Podrás consultar la información general de tu trámite, su estado actual, el avance del proceso, la gestión que se está realizando, las acciones que debas realizar y los principales avances registrados.",
  },

  {
    categoria: "Generalidades",
    pregunta: "¿Cada cuánto se actualiza la información?",
    respuesta:
      "La información se actualiza varias veces durante el día. El Portal te mostrará la fecha y hora de la última actualización.",
  },

  {
    categoria: "Consulta",
    pregunta: "¿Qué significa la fecha de última actualización?",
    respuesta:
      "Es la fecha y hora en la que la información disponible en el Portal fue actualizada por última vez.",
  },

  {
    categoria: "Consulta",
    pregunta: "¿Por qué mi trámite puede no mostrar cambios inmediatamente?",
    respuesta:
      "Algunas actividades requieren tiempos de gestión o respuesta de las entidades que participan en el proceso. Además, la información se actualiza varias veces durante el día.",
  },

  {
    categoria: "Investigación y diagnóstico",
    pregunta: "¿Qué significa esta etapa?",
    respuesta:
      "En esta etapa se realizan las verificaciones iniciales necesarias para conocer la situación del vehículo y determinar las gestiones requeridas para continuar con el proceso.",
  },

  {
    categoria: "Investigación y diagnóstico",
    pregunta: "¿Debo realizar alguna acción durante esta etapa?",
    respuesta:
      'Si el Portal no muestra una sección de "Acción requerida", no debes realizar ninguna gestión. El trámite continuará con las actividades correspondientes.',
  },

  {
    categoria: "Saneamiento",
    pregunta: "¿Qué significa esta etapa?",
    respuesta:
      "En esta etapa se gestionan las situaciones u obligaciones pendientes que deben resolverse para poder avanzar con el traspaso del vehículo.",
  },

  {
    categoria: "Saneamiento",
    pregunta: "¿Por qué mi trámite está en esta etapa?",
    respuesta:
      "Durante la revisión del vehículo se identificó una situación que debe ser gestionada antes de continuar con el proceso.",
  },

  {
    categoria: "Saneamiento",
    pregunta: "¿Debo realizar alguna acción durante el saneamiento?",
    respuesta:
      'Si se requiere una acción de tu parte, el Portal te mostrará una sección de "Acción requerida" con las instrucciones correspondientes.',
  },

  {
    categoria: "Gestión documental",
    pregunta: "¿Qué significa esta etapa?",
    respuesta:
      "En esta etapa se preparan, validan y gestionan los documentos necesarios para continuar con el proceso de traspaso.",
  },

  {
    categoria: "Gestión documental",
    pregunta: "¿Por qué mi trámite se encuentra en gestión documental?",
    respuesta:
      "Porque se están realizando las actividades necesarias para contar con la documentación requerida y continuar con el trámite.",
  },

  {
    categoria: "Gestión documental",
    pregunta: "¿Debo entregar algún documento?",
    respuesta:
      'Si necesitamos documentación de tu parte, el Portal te mostrará una "Acción requerida" y, cuando corresponda, habilitará la opción para adjuntar los documentos.',
  },

  {
    categoria: "Traspaso",
    pregunta: "¿Qué significa esta etapa?",
    respuesta:
      "En esta etapa se realizan las gestiones necesarias ante el organismo de tránsito para formalizar el traspaso del vehículo.",
  },

  {
    categoria: "Traspaso",
    pregunta: "¿Qué significa que mi traspaso esté en proceso?",
    respuesta:
      "Significa que el trámite se encuentra en gestión ante el organismo de tránsito y se está realizando el seguimiento correspondiente.",
  },

  {
    categoria: "Traspaso",
    pregunta: "¿Cuánto puede tardar el traspaso?",
    respuesta:
      "Para el Traspaso Unilateral, el tiempo establecido para la gestión es de hasta 30 días calendario. El tiempo puede variar de acuerdo con las gestiones requeridas y los tiempos de respuesta de las entidades que intervienen en el proceso.",
  },

  {
    categoria: "Traspaso",
    pregunta: "¿Qué ocurre si se presenta una novedad durante el traspaso?",
    respuesta:
      "Nuestro equipo realizará las gestiones necesarias para atender la novedad y continuar con el trámite. El estado de tu proceso se actualizará en el Portal.",
  },

  {
    categoria: "Tarjeta de propiedad",
    pregunta: "¿Qué significa esta etapa?",
    respuesta:
      "Esta etapa corresponde a las gestiones relacionadas con la tarjeta de propiedad una vez realizado el traspaso del vehículo.",
  },

  {
    categoria: "Tarjeta de propiedad",
    pregunta: "¿Cómo sabré si mi tarjeta de propiedad ya fue enviada?",
    respuesta:
      "El Portal actualizará la información cuando se registre el envío de la tarjeta de propiedad.",
  },

  {
    categoria: "Tarjeta de propiedad",
    pregunta:
      "¿Qué pasa si necesitan información para entregar mi tarjeta de propiedad?",
    respuesta:
      'Si necesitamos una acción o información de tu parte, el Portal mostrará una sección de "Acción requerida" con las instrucciones correspondientes.',
  },

  {
    categoria: "Finalización",
    pregunta: "¿Qué significa que mi trámite esté finalizado?",
    respuesta:
      "Significa que las actividades correspondientes al proceso de Finalización Leasing Vehículos han concluido de acuerdo con la información registrada.",
  },

  {
    categoria: "Finalización",
    pregunta: "¿Debo realizar alguna acción cuando mi trámite esté finalizado?",
    respuesta:
      'Si el Portal no muestra una "Acción requerida", no debes realizar ninguna gestión adicional.',
  },

  {
    categoria: "Gestión actual",
    pregunta: "¿Quién está gestionando actualmente mi trámite?",
    respuesta:
      "El Portal te indicará quién tiene actualmente a cargo la gestión: Gómez Pineda Abogados, Bancolombia, tú como cliente o el organismo de tránsito, según la actividad que se esté realizando.",
  },

  {
    categoria: "Gestión actual",
    pregunta: '¿Qué significa "Gestión Gómez Pineda"?',
    respuesta:
      "Significa que nuestro equipo está realizando actualmente las actividades necesarias para avanzar con tu trámite.",
  },

  {
    categoria: "Gestión actual",
    pregunta: '¿Qué significa "Gestión Bancolombia"?',
    respuesta:
      "Significa que la actividad se encuentra actualmente en gestión o validación por parte de Bancolombia.",
  },

  {
    categoria: "Gestión actual",
    pregunta: '¿Qué significa "Gestión del Cliente"?',
    respuesta:
      "Significa que necesitamos una acción, información o documento de tu parte para continuar con el trámite.",
  },

  {
    categoria: "Gestión actual",
    pregunta: '¿Qué significa "Gestión de Tránsito"?',
    respuesta:
      "Significa que la actividad se encuentra en gestión ante el organismo de tránsito correspondiente.",
  },

  {
    categoria: "Acción requerida",
    pregunta: "¿Cómo sé si debo realizar alguna acción?",
    respuesta:
      'Cuando sea necesaria una acción de tu parte, el Portal mostrará una sección denominada "Acción requerida" con las instrucciones correspondientes.',
  },

  {
    categoria: "Acción requerida",
    pregunta: "¿Puedo adjuntar documentos desde el Portal?",
    respuesta:
      "Sí. Cuando el trámite requiera documentos de tu parte, el Portal habilitará la opción para adjuntarlos.",
  },

  {
    categoria: "Acción requerida",
    pregunta: "¿Cómo sé si recibieron los documentos que envié?",
    respuesta:
      "Una vez realizada la carga, el Portal mostrará una confirmación de recepción de la documentación.",
  },

  {
    categoria: "Acción requerida",
    pregunta: "¿Qué pasa después de enviar un documento?",
    respuesta:
      "La documentación será recibida para continuar con la gestión correspondiente y el estado del trámite se actualizará de acuerdo con su avance.",
  },

  {
    categoria: "Historial",
    pregunta: "¿Puedo consultar lo que ha ocurrido con mi trámite?",
    respuesta:
      "Sí. El Portal mostrará los principales avances y novedades registrados durante el proceso.",
  },

  {
    categoria: "Historial",
    pregunta: "¿El historial muestra todas las gestiones realizadas?",
    respuesta:
      "El historial muestra los principales avances del trámite y no necesariamente cada una de las actividades internas realizadas durante la gestión.",
  },

  {
    categoria: "Ayuda",
    pregunta: "¿Qué hago si no entiendo el estado de mi trámite?",
    respuesta:
      'Revisa la información de la etapa actual, la gestión que se está realizando y el mensaje "¿Qué está ocurriendo?". Si tienes alguna inquietud adicional, puedes comunicarte con nuestros canales de atención.',
  },

  {
    categoria: "Ayuda",
    pregunta: "¿Qué hago si mi trámite no avanza?",
    respuesta:
      "Revisa la fecha de última actualización y la información de la etapa actual. Si tienes alguna inquietud adicional, puedes comunicarte con nuestros canales de atención.",
  },

  {
    categoria: "Ayuda",
    pregunta: "¿Cómo puedo comunicarme con Gómez Pineda Abogados?",
    respuesta: "Puedes comunicarte a la línea (604) 6041990.",
  },

  {
    categoria: "Desistido",
    pregunta: "¿Qué significa que mi trámite aparezca como desistido?",
    respuesta:
      "Significa que, de acuerdo con la información registrada, el proceso fue clasificado como desistido y no continúa bajo el flujo normal del trámite.",
  },

  {
    categoria: "Desistido",
    pregunta: "¿Qué debo hacer si mi trámite aparece como desistido?",
    respuesta:
      "Para obtener mayor información sobre tu trámite, comunícate con tu asesor comercial de Bancolombia.",
  },
];

type FooterProps = {
  telefono?: string;
  correo?: string;
};

export default function Footer({
  telefono = "(604) 604 1990",
  correo = "finalizacionleasing@gomezpinedaabogados.com",
}: FooterProps) {
  const [panelAbierto, setPanelAbierto] = useState(false);

  useEffect(() => {
    if (!panelAbierto) return;

    const cerrarConEscape = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") setPanelAbierto(false);
    };

    const overflowOriginal = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", cerrarConEscape);

    return () => {
      document.body.style.overflow = overflowOriginal;
      window.removeEventListener("keydown", cerrarConEscape);
    };
  }, [panelAbierto]);

  const cerrarPanel = () => setPanelAbierto(false);

  return (
    <>
      <footer className="grid gap-5 lg:grid-cols-[0.95fr_1.1fr]">
        <section
          className="app-card px-6 py-5 sm:px-7"
          aria-labelledby="preguntas-frecuentes-boton-titulo"
        >
          <button
            type="button"
            onClick={() => setPanelAbierto(true)}
            aria-haspopup="dialog"
            aria-expanded={panelAbierto}
            aria-controls="panel-preguntas-frecuentes"
            className="flex w-full items-center justify-between gap-4 text-left focus:outline-none focus:ring-2 focus:ring-primary/35 focus:ring-offset-2"
          >
            <span>
              <span
                id="preguntas-frecuentes-boton-titulo"
                className="block text-sm font-extrabold uppercase tracking-[-0.01em] text-foreground"
              >
                Preguntas frecuentes
              </span>
              <span className="mt-3 block text-sm leading-6 text-muted">
                Abre todas las preguntas y respuestas del trámite.
              </span>
            </span>
            <span className="shrink-0 rounded-lg border border-primary bg-white px-4 py-2.5 text-sm font-bold text-primary transition-colors hover:bg-surface-muted">
              Ver más preguntas
            </span>
          </button>
        </section>

        <section className="app-card px-6 py-5 text-center sm:px-7">
          <h2 className="text-sm font-extrabold uppercase tracking-[-0.01em] text-foreground">
            ¿Necesitas ayuda?
          </h2>
          <p className="mt-1 text-sm leading-6 text-muted">
            Estamos para acompañarte en cada etapa del proceso.
          </p>
          <div className="mt-4 grid gap-5 text-left text-sm sm:grid-cols-2 sm:divide-x sm:divide-border">
            <div>
              <p className="font-bold text-muted">Línea telefónica</p>
              <p className="mt-1 text-lg font-extrabold tracking-[-0.02em] text-foreground">
                {telefono}
              </p>
            </div>
            <div>
              <p className="font-bold text-muted">Correo electrónico</p>
              <p className="mt-1 break-words font-semibold text-foreground">
                {correo}
              </p>
            </div>
          </div>
        </section>

        <p className="border-t border-border pt-4 text-center text-xs leading-5 text-muted lg:col-span-2">
          Este portal utiliza conexión segura y protege la información del
          titular.
        </p>
      </footer>

      {panelAbierto && (
        <div
          id="panel-preguntas-frecuentes"
          role="dialog"
          aria-modal="true"
          aria-labelledby="panel-preguntas-titulo"
          className="fixed inset-0 z-50 flex h-[100dvh] w-full items-stretch justify-center bg-foreground/60 p-0 sm:p-5"
          onMouseDown={(evento) => {
            if (evento.target === evento.currentTarget) cerrarPanel();
          }}
        >
          <div
            className="flex h-full min-h-0 w-full max-w-6xl flex-col overflow-hidden bg-background shadow-lg sm:rounded-xl"
            onMouseDown={(evento) => evento.stopPropagation()}
          >
            <header className="flex shrink-0 items-start justify-between gap-4 border-b border-border bg-white px-5 py-5 sm:px-8 sm:py-6">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-primary">
                  Centro de ayuda
                </p>
                <h2
                  id="panel-preguntas-titulo"
                  className="mt-1 text-2xl font-extrabold tracking-[-0.03em] text-foreground"
                >
                  Preguntas frecuentes
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted">
                  Consulta las preguntas y respuestas sobre tu trámite de
                  leasing vehicular.
                </p>
              </div>
              <button
                type="button"
                onClick={cerrarPanel}
                aria-label="Cerrar preguntas frecuentes"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border text-2xl leading-none text-muted transition hover:bg-surface-soft hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/35"
              >
                ×
              </button>
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-8 sm:py-7">
              <div className="mx-auto grid w-full max-w-4xl gap-3">
                {PREGUNTAS_FRECUENTES.map((item, indice) => (
                  <details
                    key={`${item.categoria}-${item.pregunta}`}
                    className="group rounded-xl border border-border bg-white shadow-xs open:border-primary/50 open:bg-surface-soft"
                  >
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-4 p-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 sm:p-5 [&::-webkit-details-marker]:hidden">
                      <span>
                        <span className="block text-[11px] font-extrabold uppercase tracking-[0.14em] text-primary">
                          {indice + 1}. {item.categoria}
                        </span>
                        <span className="mt-1 block text-sm font-extrabold leading-6 text-foreground">
                          {item.pregunta}
                        </span>
                      </span>
                      <span
                        className="mt-1 text-xl font-normal text-primary transition group-open:rotate-45"
                        aria-hidden="true"
                      >
                        +
                      </span>
                    </summary>
                    <p className="border-t border-border/70 px-4 pb-5 pt-3 text-sm leading-6 text-muted sm:px-5">
                      {item.respuesta}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
