import Link from "next/link";
import type { PortalSeguimientoResponse } from "@/services/portalConsultaApi";
import { SEGUIMIENTO_ROUTES } from "../../constants/seguimiento.constants";

type TarjetaPropiedadProps = {
  seguimiento: PortalSeguimientoResponse;
};

const normalizar = (valor?: string | null) =>
  (valor ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

const obtenerEstado = (actividad?: string | null) => {
  const actividadNormalizada = normalizar(actividad);

  if (actividadNormalizada.includes("tarjeta de propiedad entregada")) {
    return {
      titulo: "Tarjeta de propiedad entregada",
      descripcion:
        "La tarjeta de propiedad fue entregada y el proceso se encuentra finalizado.",
      clases: "border-primary/50 bg-surface-muted text-primary-strong",
    };
  }

  if (actividadNormalizada.includes("tarjeta de propiedad enviada")) {
    return {
      titulo: "Tarjeta de propiedad enviada",
      descripcion:
        "La tarjeta de propiedad fue remitida y estamos realizando seguimiento a su entrega.",
      clases: "border-info/35 bg-surface-soft text-info",
    };
  }

  if (actividadNormalizada.includes("sin direccion")) {
    return {
      titulo: "Pendiente de datos de entrega",
      descripcion:
        "Necesitamos la información de entrega para programar el envío de la tarjeta de propiedad.",
      clases: "border-warning/40 bg-[var(--app-warning-bg)] text-warning",
    };
  }

  if (actividadNormalizada.includes("pendiente por enviar")) {
    return {
      titulo: "Pendiente de envío",
      descripcion:
        "La tarjeta de propiedad está en proceso de coordinación para su envío.",
      clases: "border-warning/40 bg-[var(--app-warning-bg)] text-warning",
    };
  }

  return {
    titulo: "En proceso",
    descripcion:
      "La entrega de la tarjeta de propiedad se habilitará cuando finalicen las gestiones del trámite.",
    clases: "border-border bg-surface-soft text-muted",
  };
};

export default function TarjetaPropiedad({
  seguimiento,
}: TarjetaPropiedadProps) {
  const { vehiculo, gestionActual } = seguimiento;
  const estado = obtenerEstado(gestionActual.actividad);
  const vehiculoTexto = [vehiculo.marca, vehiculo.linea, vehiculo.modelo]
    .filter(Boolean)
    .join(" ");
  const faltaDireccion = normalizar(gestionActual.actividad).includes(
    "sin direccion",
  );

  return (
    <section id="tarjeta-propiedad" aria-labelledby="tarjeta-propiedad-titulo">
      <article className="app-card overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-border bg-surface-soft px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.13em] text-primary">
              Documento del vehículo
            </p>
            <h2
              id="tarjeta-propiedad-titulo"
              className="mt-1 text-xl font-extrabold tracking-[-0.02em] text-foreground"
            >
              Tarjeta de propiedad
            </h2>
          </div>
          <span
            className={`w-fit rounded-full border px-3 py-1.5 text-xs font-extrabold ${estado.clases}`}
          >
            {estado.titulo}
          </span>
        </div>

        <div className="grid gap-5 px-5 py-5 sm:grid-cols-2 sm:px-6 sm:py-6">
          <div className="rounded-lg border border-border bg-surface-soft p-4">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted">
              Vehículo
            </p>
            <p className="mt-2 font-extrabold tracking-[-0.02em] text-foreground">
              {vehiculoTexto || "Vehículo en seguimiento"}
            </p>
            <p className="mt-1 text-sm font-bold text-primary">
              Placa: {vehiculo.placa || "Pendiente"}
            </p>
          </div>
          <div className="sm:border-l sm:border-border sm:pl-5">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted">
              Estado del documento
            </p>
            <p className="mt-2 text-sm leading-6 text-muted">
              {estado.descripcion}
            </p>
            <p className="mt-2 text-xs leading-5 text-muted">
              Actividad:{" "}
              <span className="font-bold text-foreground">
                {gestionActual.actividad || "Pendiente"}
              </span>
            </p>
          </div>
        </div>

        {faltaDireccion && (
          <div className="border-t border-warning/35 bg-[var(--app-warning-bg)] px-5 py-4 sm:px-6">
            <Link
              href={SEGUIMIENTO_ROUTES.cargaDocumentos}
              className="inline-flex rounded-lg bg-primary px-4 py-2.5 text-sm font-extrabold text-white shadow-sm transition-colors hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/35 focus:ring-offset-2"
            >
              Actualizar datos de entrega
            </Link>
          </div>
        )}
      </article>
    </section>
  );
}
