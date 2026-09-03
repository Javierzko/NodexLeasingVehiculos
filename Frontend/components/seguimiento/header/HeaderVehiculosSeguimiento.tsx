import type { PortalSeguimientoResponse } from "@/services/portalConsultaApi";
import { formatearFechaHora } from "../shared/seguimiento-formatters";
import Image from "next/image";

type HeaderVehiculosSeguimientoProps = {
  seguimiento: PortalSeguimientoResponse;
  onLogout?: () => void;
};

export default function HeaderVehiculosSeguimiento({
  seguimiento,
  onLogout,
}: HeaderVehiculosSeguimientoProps) {
  const nombre = seguimiento.locatario.nombre || "cliente";

  return (
    <header className="border-b border-border bg-white">
      <div className="mx-auto flex w-full max-w-[1536px] flex-col gap-4 px-4 py-4 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
        <div className="flex items-center gap-5 sm:gap-7">
          <div
            className="flex items-center gap-3"
            aria-label="Gómez Pineda Abogados"
          >
            <Image
              src="/image/GP L-06.png"
              alt="Gómez Pineda Abogados"
              width={160}
              height={40}
              className="h-10 w-auto object-contain"
              priority
            />
          </div>
          <div className="hidden h-10 w-px bg-primary/50 sm:block" />
          <div className="border-l border-border pl-5 sm:border-l-0 sm:pl-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-foreground">
              Aliado estratégico de
            </p>
            <p className="mt-1 text-xl font-extrabold tracking-[-0.03em] text-foreground">
              Bancolombia
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 border-t border-border pt-3 text-sm sm:gap-7 sm:pt-4 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
          <div>
            <p className="text-xs font-semibold text-muted">
              Información actualizada al:
            </p>
            <p className="mt-1 font-semibold text-foreground">
              {formatearFechaHora(seguimiento.ultimaActualizacion)}
            </p>
          </div>

          <button
            className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-sm font-semibold text-foreground transition-colors hover:bg-surface-soft focus:outline-none focus:ring-2 focus:ring-primary/35 focus:ring-offset-2"
            onClick={onLogout}
            type="button"
          >
            <span className="text-xl leading-none" aria-hidden="true">
              ⇥
            </span>
            Cerrar sesión
          </button>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1536px] border-t border-border/60 px-4 py-4 sm:px-8 lg:px-10 lg:py-3">
        <h1 className="text-[30px] font-extrabold leading-tight tracking-[-0.035em] text-foreground sm:text-[34px]">
          Hola, {nombre}.
        </h1>
        <p className="mt-1 text-base leading-6 text-muted">
          Así va el estado de tu trámite de Finalización Leasing Vehículos.
        </p>
      </div>
    </header>
  );
}