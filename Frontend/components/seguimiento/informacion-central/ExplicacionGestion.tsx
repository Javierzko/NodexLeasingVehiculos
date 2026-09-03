import type { PortalGestionActual } from "@/services/portalConsultaApi";

type ExplicacionGestionProps = {
  gestion: PortalGestionActual;
};

export default function ExplicacionGestion({
  gestion,
}: ExplicacionGestionProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-lg bg-white/70 p-3.5 border border-border/40">
        <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
          ¿Qué significa esta gestión?
        </h3>
        <p className="mt-1.5 text-xs leading-relaxed text-muted">
          {gestion.significado}
        </p>
      </div>
      <div className="rounded-lg bg-white/70 p-3.5 border border-border/40">
        <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
          ¿Qué está ocurriendo?
        </h3>
        <p className="mt-1.5 text-xs leading-relaxed text-muted">
          {gestion.situacion}
        </p>
      </div>
    </div>
  );
}