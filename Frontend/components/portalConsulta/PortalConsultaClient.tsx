"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  PortalConsultaResponse,
  PortalHistorialItem,
} from "../../services/portalConsultaApi";
import { usePortalConsulta } from "../../hooks/usePortalConsulta";

const formatoFecha = (fecha?: string | null) => {
  if (!fecha) return "Pendiente";
  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
  }).format(new Date(fecha));
};

const etiquetaTipo = (tipo: string) => {
  const etiquetas: Record<string, string> = {
    ESTADO: "Estado",
    CATEGORIA: "Categoría",
    ETAPA: "Etapa",
    SUBETAPA: "Subetapa",
  };
  return etiquetas[tipo] || tipo;
};

type IconoPortalTipo =
  | "busqueda"
  | "escudo"
  | "ayuda"
  | "telefono"
  | "correo"
  | "check"
  | "placa";

function IconoPortal({
  tipo,
  className = "h-5 w-5",
}: {
  tipo: IconoPortalTipo;
  className?: string;
}) {
  const trazos = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      {tipo === "busqueda" && (
        <>
          <circle {...trazos} cx="10.75" cy="10.75" r="5.75" />
          <path {...trazos} d="m15.1 15.1 4.15 4.15" />
        </>
      )}
      {tipo === "escudo" && (
        <>
          <path
            {...trazos}
            d="M12 3.5 19 6v5.4c0 4.4-2.75 7.55-7 9.1-4.25-1.55-7-4.7-7-9.1V6z"
          />
          <path {...trazos} d="m8.8 12.1 2.05 2.05 4.3-4.3" />
        </>
      )}
      {tipo === "ayuda" && (
        <>
          <circle {...trazos} cx="12" cy="12" r="8.5" />
          <path
            {...trazos}
            d="M9.75 9.5a2.35 2.35 0 1 1 3.9 1.75c-.95.75-1.65 1.2-1.65 2.55M12 16.9h.01"
          />
        </>
      )}
      {tipo === "telefono" && (
        <path
          {...trazos}
          d="M7.1 4.75 9.5 4l1.35 3.4-1.6 1.25c.85 1.7 2.15 3 3.85 3.85l1.25-1.6L17.75 12l-.75 2.4c-.28.9-1.2 1.42-2.08 1.17-4.7-1.33-7.63-4.25-8.96-8.96-.25-.88.27-1.8 1.17-2.08Z"
        />
      )}
      {tipo === "correo" && (
        <>
          <rect {...trazos} x="3.5" y="5.5" width="17" height="13" rx="2" />
          <path {...trazos} d="m4.5 7 7.5 5.5L19.5 7" />
        </>
      )}
      {tipo === "check" && (
        <>
          <circle {...trazos} cx="12" cy="12" r="8.5" />
          <path {...trazos} d="m8.3 12.05 2.35 2.35 5.05-5.05" />
        </>
      )}
      {tipo === "placa" && (
        <>
          <rect {...trazos} x="3.5" y="6.5" width="17" height="11" rx="2" />
          <path {...trazos} d="M7 10h.01M10 10h7M7 14h10" />
        </>
      )}
    </svg>
  );
}

export default function PortalConsultaClient() {
  const [numeroContrato, setNumeroContrato] = useState("");
  const [documento, setDocumento] = useState("");
  const [resultado, setResultado] = useState<PortalConsultaResponse | null>(
    null,
  );
  const consulta = usePortalConsulta();
  const router = useRouter();

  const consultar = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setResultado(null);

    if (!numeroContrato.trim() || !documento.trim()) return;

    const data = await consulta.mutateAsync({
      numeroContrato: numeroContrato.trim(),
      documento: documento.trim(),
    });

    window.sessionStorage.setItem("portal-seguimiento", JSON.stringify(data));
    router.push("/seguimiento");
  };

  return (
    <main className="min-h-screen bg-background text-foreground [zoom:0.75]">
      <div className="mx-auto min-h-screen w-full max-w-[1536px] px-4 py-7 sm:px-8 lg:px-10 lg:py-8">
        <header className="flex flex-col items-center justify-between gap-5 border-b border-border pb-6 sm:flex-row">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 sm:gap-x-7">
            <div className="flex items-center border-r border-primary/50 pr-6 sm:pr-7">
              <Image
                src="/image/GP L-06.png"
                alt="Gómez Pineda Abogados"
                width={160}
                height={40}
                className="h-10 w-auto object-contain"
                priority
              />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-foreground">
                Aliado estratégico de
              </p>
              <p className="mt-0.5 text-2xl font-extrabold tracking-[-0.03em] text-foreground">
                Bancolombia
              </p>
            </div>
          </div>
          <div className="text-center sm:text-right">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">
              Atención al cliente
            </p>
            <p className="mt-1 text-sm font-semibold text-foreground">
              Consulta segura y transparente
            </p>
          </div>
        </header>

        <section className="grid gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_430px] lg:items-start lg:py-16">
          <div className="pt-2 lg:pt-10">
            <p className="mb-4 text-sm font-black uppercase tracking-[0.22em] text-primary">
              Finalización leasing vehículos
            </p>
            <h1 className="max-w-2xl text-5xl font-black leading-[0.98] tracking-[-0.045em] text-foreground sm:text-6xl">
              Consulta el estado de tu trámite
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-muted">
              Ingresa tus datos para conocer el avance de tu proceso de forma
              rápida, segura y transparente.
            </p>
          </div>

          <section className="app-card relative overflow-hidden rounded-2xl border border-border bg-white p-6 shadow-sm transition-all sm:p-8 hover:shadow-md">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl border border-primary/15 bg-surface-muted text-primary shadow-xs">
              <IconoPortal tipo="busqueda" className="h-7 w-7" />
            </div>
            <h2 className="text-xl font-black tracking-tight text-foreground">
              Consulta tu trámite
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Usa el número de contrato y el documento del titular.
            </p>

            <form onSubmit={consultar} className="mt-7 space-y-5">
              <div>
                <label
                  htmlFor="numeroContrato"
                  className="mb-2 block text-sm font-bold text-foreground"
                >
                  Número de contrato
                </label>
                <input
                  id="numeroContrato"
                  value={numeroContrato}
                  onChange={(event) => setNumeroContrato(event.target.value)}
                  placeholder="Ingresa el número de contrato"
                  autoComplete="off"
                  className="w-full rounded-xl border border-border bg-white px-4 py-3.5 text-sm shadow-xs outline-none transition-all hover:border-primary/50 focus:border-primary focus:ring-4 focus:ring-primary/20"
                />
              </div>
              <div>
                <label
                  htmlFor="documento"
                  className="mb-2 block text-sm font-bold text-foreground"
                >
                  Documento de identidad del locatario
                </label>
                <input
                  id="documento"
                  value={documento}
                  onChange={(event) => setDocumento(event.target.value)}
                  placeholder="Ingresa el número de documento"
                  inputMode="numeric"
                  autoComplete="off"
                  className="w-full rounded-xl border border-border bg-white px-4 py-3.5 text-sm shadow-xs outline-none transition-all hover:border-primary/50 focus:border-primary focus:ring-4 focus:ring-primary/20"
                />
              </div>

              {consulta.isError && (
                <div
                  className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700 shadow-xs"
                  role="alert"
                >
                  {consulta.error instanceof Error
                    ? consulta.error.message
                    : "No fue posible validar los datos."}
                </div>
              )}

              <button
                type="submit"
                disabled={
                  consulta.isPending ||
                  !numeroContrato.trim() ||
                  !documento.trim()
                }
                className="w-full rounded-xl bg-primary px-5 py-4 text-sm font-extrabold text-white shadow-sm transition-all hover:-translate-y-px hover:bg-primary-hover hover:shadow-md active:translate-y-0 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {consulta.isPending ? "Consultando..." : "Consultar trámite"}
              </button>
            </form>

            <div className="mt-6 space-y-3 border-t border-border/50 pt-5 text-xs leading-5 text-muted">
              <p className="flex items-center gap-2">
                <span className="inline-flex shrink-0 text-primary">
                  <IconoPortal tipo="escudo" className="h-4 w-4" />
                </span>
                <span>
                  Información protegida bajo la Ley 1581 de 2012 de Protección de
                  Datos Personales.
                </span>
              </p>
              <p className="flex items-center gap-2">
                <span className="inline-flex shrink-0 text-primary">
                  <IconoPortal tipo="check" className="h-4 w-4" />
                </span>
                <span>
                  Consulta disponible únicamente para titulares del trámite.
                </span>
              </p>
            </div>
          </section>
        </section>

        {resultado && <ResultadoConsulta resultado={resultado} />}

        <footer className="app-card mt-8 rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-primary/15 bg-surface-muted text-primary shadow-xs">
              <IconoPortal tipo="ayuda" className="h-6 w-6" />
            </div>
            <h2 className="mt-3 text-2xl font-black text-primary-strong">
              Contáctanos
            </h2>
            <p className="mt-1 text-sm text-muted">
              Estamos para acompañarte en cada etapa de tu proceso.
            </p>
          </div>
          <div className="mx-auto mt-7 grid max-w-3xl gap-6 text-center sm:grid-cols-2 sm:text-left">
            <div className="border-b border-border pb-5 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-6">
              <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted">
                <IconoPortal tipo="telefono" className="h-4 w-4 text-primary" />
                Línea telefónica
              </p>
              <p className="mt-1 text-2xl font-black text-foreground">
                (604) 604 1990
              </p>
              <p className="mt-2 text-sm text-muted">
                Lunes a viernes · Horario de atención
              </p>
            </div>
            <div className="sm:pl-2">
              <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted">
                <IconoPortal tipo="correo" className="h-4 w-4 text-primary" />
                Correo electrónico
              </p>
              <p className="mt-2 break-words text-sm font-bold text-foreground">
                finalizacionesleasing@empresa.com
              </p>
              <p className="mt-2 text-sm text-muted">
                Atenderemos tu solicitud lo antes posible.
              </p>
            </div>
          </div>
        </footer>

        <div className="mt-6 border-t border-border py-5 text-center text-xs text-muted">
          Este portal utiliza conexión segura y cumple con la Ley 1581 de 2012.
        </div>
      </div>
    </main>
  );
}

function ResultadoConsulta({
  resultado,
}: {
  resultado: PortalConsultaResponse;
}) {
  const estadosActuales = [
    ["Estado", resultado.estado?.nombre],
    ["Categoría", resultado.categoria?.nombre],
    ["Etapa", resultado.etapa?.nombre],
    ["Subetapa", resultado.subetapa?.nombre],
  ];

  return (
    <section className="mb-10 rounded-2xl border border-primary/35 bg-surface-muted p-6 shadow-sm sm:p-8">
      <div className="flex flex-col justify-between gap-4 border-b border-primary/35 pb-5 sm:flex-row sm:items-center">
        <div>
          <p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-primary-strong">
            <IconoPortal tipo="check" className="h-4 w-4 text-primary" />
            Resultado de consulta
          </p>
          <h2 className="mt-1 text-2xl font-black text-foreground">
            Contrato {resultado.numeroContrato}
          </h2>
        </div>
        <div className="rounded-xl border border-primary/15 bg-white px-4 py-3 text-center shadow-xs">
          <p className="inline-flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase text-muted-light">
            <IconoPortal tipo="placa" className="h-3.5 w-3.5 text-primary" />
            Placa
          </p>
          <p className="font-black text-foreground">
            {resultado.vehiculoPlaca || "No registrada"}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {estadosActuales.map(([label, value]) => (
          <div
            key={label}
            className="rounded-xl border border-primary/10 bg-white p-4 shadow-xs transition-shadow hover:shadow-sm"
          >
            <p className="text-xs font-bold text-muted-light">{label}</p>
            <p className="mt-2 text-sm font-black text-foreground">
              {value || "Pendiente"}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-xl border border-border/60 bg-white p-5 shadow-xs">
          <h3 className="font-black text-foreground">
            Información del trámite
          </h3>
          <dl className="mt-4 space-y-4 text-sm">
            <div className="flex justify-between gap-4 border-b border-border/50 pb-3">
              <dt className="text-muted">Asignación</dt>
              <dd className="font-bold text-foreground">
                {formatoFecha(resultado.fechaAsignacion)}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Próxima gestión</dt>
              <dd className="font-bold text-foreground">
                {formatoFecha(resultado.fechaProximaGestion)}
              </dd>
            </div>
          </dl>
        </div>
        <div className="rounded-xl border border-border/60 bg-white p-5 shadow-xs">
          <h3 className="font-black text-foreground">Trazabilidad</h3>
          <div className="mt-4 space-y-4">
            {resultado.historial.length === 0 ? (
              <p className="text-sm text-muted">
                No hay movimientos registrados.
              </p>
            ) : (
              resultado.historial.map((item: PortalHistorialItem, index) => (
                <div
                  key={`${item.tipo}-${item.fechaInicio}-${index}`}
                  className="relative flex gap-3.5 before:absolute before:left-[5px] before:top-5 before:h-[calc(100%+0.75rem)] before:w-px before:bg-primary/25 last:before:hidden"
                >
                  <div className="relative z-10 mt-1 h-3 w-3 shrink-0 rounded-full bg-primary ring-4 ring-white" />
                  <div className="w-full border-b border-border/50 pb-3 text-sm last:border-0">
                    <p className="font-bold text-foreground">
                      {etiquetaTipo(item.tipo)}: {item.nombre}
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      Desde {formatoFecha(item.fechaInicio)}
                      {item.fechaFin
                        ? ` hasta ${formatoFecha(item.fechaFin)}`
                        : " · Actual"}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}