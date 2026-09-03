type ResumenTramiteProps = {
  etapaActual?: string;
  etapaNumero?: number;
  totalEtapas?: number;
  porcentaje?: number;
  tiempoEstimado?: string;
};

export function ResumenTramite({
  etapaActual = "Traspaso",
  etapaNumero = 4,
  totalEtapas = 6,
  porcentaje = 68,
  tiempoEstimado = "25 días hábiles",
}: ResumenTramiteProps) {
  return (
    <aside
      aria-label="Resumen de tu trámite"
      className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <h2 className="text-base font-black text-slate-950">
        Resumen de tu trámite
      </h2>

      <div className="mt-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm text-slate-600">
            Etapa actual:{" "}
            <span className="font-black text-[#b97800]">{etapaActual}</span>
          </p>
          <p className="mt-2 text-sm text-slate-600">
            Etapa {etapaNumero} de {totalEtapas}
          </p>
        </div>
        <span className="text-2xl font-black text-[#b97800]">
          {porcentaje}%
        </span>
      </div>

      <div
        aria-label={`Progreso del trámite: ${porcentaje}%`}
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={porcentaje}
        className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-200"
        role="progressbar"
      >
        <div
          className="h-full rounded-full bg-[#c88608] transition-[width] duration-300"
          style={{ width: `${porcentaje}%` }}
        />
      </div>

      <div className="mt-5 border-t border-slate-100 pt-4">
        <div className="flex items-start justify-between gap-3 text-sm text-slate-600">
          <p>
            Tiempo estimado para finalizar:{" "}
            <span className="font-semibold text-slate-800">
              {tiempoEstimado}
            </span>
          </p>
          <span
            aria-label="Información sobre el tiempo estimado"
            className="grid h-5 w-5 shrink-0 place-items-center rounded-full border border-slate-400 text-xs font-bold text-slate-500"
          >
            i
          </span>
        </div>
      </div>
    </aside>
  );
}
