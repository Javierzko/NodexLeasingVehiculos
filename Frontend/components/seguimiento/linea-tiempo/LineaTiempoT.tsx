import { ETAPAS_VISIBLES_SEGUIMIENTO } from "@/constants/seguimiento.constants";
import type { PortalHistorialItem } from "@/services/portalConsultaApi";
import { formatearFecha } from "../shared/seguimiento-formatters";
import { normalizar, obtenerIndiceEtapaVisible } from "./lineaTiempo.utils";

// ETAPA identifica el grupo operativo actual.
// SUBETAPA identifica la actividad interna de ese grupo.
type LineaTiempoTProps = {
  historial: PortalHistorialItem[];
  etapaActual: string | null;
  subetapaActual: string | null;
};

type EstadoVisual = "completada" | "actual" | "pendiente";

/**
 * Obtiene la actividad que se está ejecutando actualmente.
 * Si existe una subetapa actual, se utiliza esa información.
 * Si no existe, se busca la última subetapa registrada en el historial.
 */
const obtenerActividadActual = (
  subetapaActual: string | null,
  historial: PortalHistorialItem[],
) => {
  if (subetapaActual) {
    return subetapaActual;
  }

  return (
    historial.filter((item) => normalizar(item.tipo) === "subetapa").at(-1)
      ?.nombre || null
  );
};

export default function LineaTiempoT({
  historial,
  etapaActual,
  subetapaActual,
}: LineaTiempoTProps) {
  const indiceActual = obtenerIndiceEtapaVisible(etapaActual, subetapaActual);

  const actividadActual = obtenerActividadActual(subetapaActual, historial);

  return (
    <section
      className="app-card px-5 py-5 sm:px-6 sm:py-6"
      aria-labelledby="linea-tiempo-titulo"
    >
      <h2
        id="linea-tiempo-titulo"
        className="text-base font-extrabold text-foreground"
      >
        Línea de tiempo del trámite
      </h2>

      <p className="mt-1 text-sm text-muted">Avance general del proceso</p>

      <ol className="mt-7 grid gap-6 sm:grid-cols-2 lg:grid-cols-6 lg:gap-3">
        {ETAPAS_VISIBLES_SEGUIMIENTO.map((grupo, indice) => {
          // Las etapas anteriores se completan.
          // La etapa actual se destaca.
          // Las etapas posteriores quedan pendientes.
          const estado: EstadoVisual =
            indiceActual < 0 || indice > indiceActual
              ? "pendiente"
              : indice === indiceActual
                ? "actual"
                : "completada";

          return (
            <li key={grupo.id} className="relative text-center">
              <div
                className={`mx-auto flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-extrabold ${
                  estado === "actual"
                    ? "border-primary bg-primary text-white ring-4 ring-surface-muted"
                    : estado === "completada"
                      ? "border-primary bg-primary text-white"
                      : "border-border bg-white text-muted"
                }`}
              >
                {estado === "completada" ? "✓" : indice + 1}
              </div>

              <h3
                className={`mt-3 text-sm font-extrabold leading-5 ${
                  estado === "actual" ? "text-primary" : "text-foreground"
                }`}
              >
                {grupo.nombre}
              </h3>

              <p className="mt-1 text-xs font-semibold text-muted">
                {estado === "actual"
                  ? "En curso"
                  : estado === "completada"
                    ? "Completado"
                    : "Pendiente"}
              </p>

              {estado === "actual" && actividadActual && (
                <p className="mt-2 text-xs leading-5 text-muted">
                  Actividad: {actividadActual}
                </p>
              )}

              {estado === "completada" && historial[indice] && (
                <p className="mt-2 text-xs text-muted">
                  {formatearFecha(historial[indice].fechaInicio)}
                </p>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
