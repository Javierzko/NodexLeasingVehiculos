import type { PortalSeguimientoResponse } from "@/services/portalConsultaApi";
import { formatearFecha, mostrarValor } from "../shared/seguimiento-formatters";

type InformacionGeneralSeguimientoProps = {
  seguimiento: PortalSeguimientoResponse;
};

type IconoDato =
  | "contrato"
  | "documento"
  | "vehiculo"
  | "placa"
  | "calendario"
  | "reloj";

const ICONOS_DATOS: IconoDato[] = [
  "contrato",
  "documento",
  "vehiculo",
  "placa",
  "calendario",
  "reloj",
];

function IconoInformacion({ tipo }: { tipo: IconoDato }) {
  const atributosComunes = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      {tipo === "contrato" && (
        <>
          <path {...atributosComunes} d="M7 3.75h7.2L18 7.55V20.25H7z" />
          <path {...atributosComunes} d="M14 3.75v4h4M10 12h5M10 15.5h5" />
        </>
      )}
      {tipo === "documento" && (
        <>
          <rect
            {...atributosComunes}
            x="3.5"
            y="5.5"
            width="17"
            height="13"
            rx="2"
          />
          <circle {...atributosComunes} cx="8.25" cy="11" r="1.5" />
          <path
            {...atributosComunes}
            d="M5.9 16c.65-1.65 1.5-2.45 2.35-2.45S10 14.35 10.6 16M13 10h4M13 13.5h4"
          />
        </>
      )}
      {tipo === "vehiculo" && (
        <>
          <path
            {...atributosComunes}
            d="M5.2 10.2 6.8 6h10.4l1.6 4.2M4.5 10.2h15v7.3h-15z"
          />
          <path {...atributosComunes} d="M4.5 13h15M7 17.5v1.75M17 17.5v1.75" />
          <circle {...atributosComunes} cx="7.6" cy="13.5" r=".8" />
          <circle {...atributosComunes} cx="16.4" cy="13.5" r=".8" />
        </>
      )}
      {tipo === "placa" && (
        <>
          <rect
            {...atributosComunes}
            x="3.5"
            y="6.5"
            width="17"
            height="11"
            rx="2"
          />
          <path {...atributosComunes} d="M7 10h.01M10 10h7M7 14h10" />
        </>
      )}
      {tipo === "calendario" && (
        <>
          <rect
            {...atributosComunes}
            x="4.5"
            y="5.5"
            width="15"
            height="14"
            rx="2"
          />
          <path
            {...atributosComunes}
            d="M8 3.75v3.5M16 3.75v3.5M4.5 9.5h15M8 13h.01M12 13h.01M16 13h.01M8 16.5h.01M12 16.5h.01"
          />
        </>
      )}
      {tipo === "reloj" && (
        <>
          <circle {...atributosComunes} cx="12" cy="12" r="8.5" />
          <path {...atributosComunes} d="M12 7v5l3.25 2" />
        </>
      )}
    </svg>
  );
}

export default function InformacionGeneralSeguimiento({
  seguimiento,
}: InformacionGeneralSeguimientoProps) {
  const { caso, locatario, vehiculo } = seguimiento;
  const descripcionVehiculo = [vehiculo.marca, vehiculo.linea, vehiculo.modelo]
    .filter(Boolean)
    .join(" ");
  const datos = [
    ["Número de contrato", mostrarValor(caso.numeroContrato)],
    ["NIT o documento", mostrarValor(locatario.nit)],
    ["Vehículo", mostrarValor(descripcionVehiculo)],
    ["Placa", mostrarValor(vehiculo.placa)],
    ["Fecha de asignación", formatearFecha(caso.fechaAsignacion)],
    ["Última actualización", formatearFecha(seguimiento.ultimaActualizacion)],
  ];

  return (
    <section
      className="app-card overflow-hidden"
      aria-labelledby="informacion-general-titulo"
    >
      <div className="flex flex-col gap-2 border-b border-border bg-surface-soft px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
            Resumen del trámite
          </p>
          <h2
            id="informacion-general-titulo"
            className="mt-1 text-lg font-extrabold tracking-[-0.02em] text-foreground"
          >
            Información general
          </h2>
        </div>
        <span className="inline-flex w-fit items-center rounded-full border border-primary/25 bg-white px-3 py-1 text-xs font-semibold text-primary-strong">
          Datos principales
        </span>
      </div>

      <div className="grid gap-3 p-5 sm:grid-cols-2 sm:p-6 xl:grid-cols-3">
        {datos.map(([etiqueta, valor], indice) => (
          <div
            key={etiqueta}
            className="group flex min-w-0 items-start gap-3 rounded-lg border border-border bg-white p-4 transition-colors hover:border-primary/50 hover:bg-surface-soft"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-surface-muted text-primary transition-colors group-hover:bg-primary group-hover:text-white">
              <IconoInformacion tipo={ICONOS_DATOS[indice] ?? "contrato"} />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-semibold leading-5 text-muted">
                {etiqueta}
              </p>
              <p className="mt-1.5 break-words text-sm font-extrabold tracking-[-0.01em] text-foreground sm:text-base">
                {valor}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
