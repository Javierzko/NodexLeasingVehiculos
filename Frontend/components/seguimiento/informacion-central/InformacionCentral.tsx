import { SEGUIMIENTO_ROUTES } from "../../../constants/seguimiento.constants";
import type { PortalSeguimientoResponse } from "@/services/portalConsultaApi";
import ExplicacionGestion from "./ExplicacionGestion";
import { calcularPorcentajeAvance } from "../linea-tiempo/lineaTiempo.utils";

type InformacionCentralProps = {
  seguimiento: PortalSeguimientoResponse;
  tarjetaPropiedadAbierta: boolean;
  onCambiarTarjetaPropiedad: () => void;
};

export default function InformacionCentral({
  seguimiento,
  tarjetaPropiedadAbierta,
  onCambiarTarjetaPropiedad,
}: InformacionCentralProps) {
  const { caso, gestionActual, vehiculo } = seguimiento;

  const porcentaje = calcularPorcentajeAvance(
    caso.etapa?.nombre ?? null,
    caso.subetapa?.nombre ?? null,
  );

  return (
    <section
      className="grid gap-5 lg:grid-cols-[minmax(0,1.7fr)_minmax(300px,0.65fr)] items-start"
      aria-label="Información central del seguimiento"
    >
      <article className="app-card px-5 py-5 sm:px-6 sm:py-6">
        {/* Fila principal de datos clave */}
        <div className="grid gap-5 md:grid-cols-3 md:divide-x md:divide-border">
          <div className="md:pr-5">
            <p className="text-xs font-bold uppercase tracking-wider text-muted">
              Etapa actual
            </p>
            <p className="mt-2 text-base font-extrabold tracking-[-0.01em] text-foreground">
              {caso.etapa?.nombre || "Pendiente"}
            </p>
            <p className="mt-1 text-xs font-bold uppercase tracking-wider text-primary">
              {caso.estado?.nombre || "En seguimiento"}
            </p>
          </div>

          <div className="md:px-5">
            <p className="text-xs font-bold uppercase tracking-wider text-muted">
              Gestión actual
            </p>
            <p className="mt-2 text-base font-extrabold tracking-[-0.01em] text-foreground">
              {gestionActual.actividad}
            </p>
            <p className="mt-1 text-sm font-medium text-muted capitalize">
              {vehiculo.transito || "Organismo de tránsito pendiente"}
            </p>
          </div>

          <div className="md:pl-5">
            <p className="text-xs font-bold uppercase tracking-wider text-muted">
              Responsable
            </p>
            <p className="mt-2 text-base font-extrabold tracking-[-0.01em] text-foreground">
              {caso.analistaResponsable || gestionActual.responsable}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted">
              Gestión a cargo del equipo correspondiente.
            </p>
          </div>
        </div>

        {/* Banner/Bloque de Siguiente Etapa y Disparador de Explicación */}
        <div className="mt-6 rounded-xl border border-border/80 bg-slate-50/70 p-4 transition-all">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted">
                Siguiente etapa
              </p>
              <p className="mt-1 text-sm font-extrabold text-foreground">
                {gestionActual.proximoPaso}
              </p>
            </div>

            <button
              type="button"
              onClick={onCambiarTarjetaPropiedad}
              aria-expanded={tarjetaPropiedadAbierta}
              aria-controls="tarjeta-propiedad"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-primary/30 bg-white px-4 py-2 text-xs font-extrabold text-primary shadow-xs transition-colors hover:bg-surface-soft hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary/35 focus:ring-offset-2"
            >
              {tarjetaPropiedadAbierta
                ? "Ocultar explicación de gestión"
                : "Ver explicación de gestión"}
              <span
                aria-hidden="true"
                className={`text-sm leading-none transition-transform duration-200 ${
                  tarjetaPropiedadAbierta ? "rotate-180" : ""
                }`}
              >
                ⌄
              </span>
            </button>
          </div>

          {/* Desplegable con ExplicacionGestion */}
          {tarjetaPropiedadAbierta && (
            <div
              id="tarjeta-propiedad"
              className="mt-4 border-t border-border/60 pt-4 transition-all"
            >
              <ExplicacionGestion gestion={gestionActual} />
            </div>
          )}
        </div>
      </article>

      {/* Aside - Acciones del trámite */}
      <aside
        id="carga-documentos"
        className="rounded-xl border border-border bg-surface-soft p-5 shadow-xs sm:p-6"
        aria-labelledby="acciones-seguimiento-titulo"
      >
        <p className="text-xs font-extrabold uppercase tracking-[0.13em] text-primary">
          Acciones del trámite
        </p>
        <h2
          id="acciones-seguimiento-titulo"
          className="mt-1 text-lg font-extrabold tracking-[-0.02em] text-foreground"
        >
          Gestiona tu proceso
        </h2>
        <p className="mt-1 text-xs leading-relaxed text-muted">
          Consulta el avance actual o carga los documentos solicitados.
        </p>

        <div className="mt-5 grid gap-3">
          <div className="rounded-lg border border-border bg-white p-4 text-center sm:text-left">
            <p className="text-xs font-bold uppercase tracking-wider text-muted">
              Avance general
            </p>
            <p className="mt-1 text-3xl font-black tracking-tight text-primary">
              {porcentaje}%
            </p>
            <p className="mt-1 text-xs leading-normal text-muted">
              Calculado con base en las seis etapas del trámite.
            </p>
          </div>

          <a
            href={`${SEGUIMIENTO_ROUTES.cargaDocumentos}?numeroContrato=${encodeURIComponent(
              caso.numeroContrato,
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-extrabold text-white shadow-xs transition-colors hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/35 focus:ring-offset-2"
          >
            Cargar documentos
          </a>
        </div>
      </aside>
    </section>
  );
}