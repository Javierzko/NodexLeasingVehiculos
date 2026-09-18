'use client';

import React, { useMemo } from 'react';
import { Caso } from '@/types/leasing';

export interface FiltrosAlertasSeleccionados {
  analista: string;
  alerta: string;
}

interface Props {
  casos: Caso[];
  filtros: FiltrosAlertasSeleccionados;
  onChange: (filtros: FiltrosAlertasSeleccionados) => void;
  onClear: () => void;
}

const OPCIONES_ALERTA = [
  { value: '', label: 'Todas las alertas' },
  { value: 'SIN_ALERTA', label: 'Sin alerta' },
  { value: 'Seguimiento Vencido', label: 'Seguimiento Vencido' },
  { value: 'Seguimiento Vence Hoy', label: 'Seguimiento Vence Hoy' },
  { value: 'Seguimiento Próximo a vencer', label: 'Seguimiento Próximo a vencer' },
  { value: 'Seguimiento al día', label: 'Seguimiento al día' },
];

export const FiltrosCasosAlertas: React.FC<Props> = ({
  casos,
  filtros,
  onChange,
  onClear,
}) => {
  // Extrae dinámicamente la lista única de analistas presentes en los casos cargados
  const analistasDisponibles = useMemo(() => {
    const nombres = casos
      .map((c) => c.analistaResponsable)
      .filter((nombre): nombre is string => Boolean(nombre && nombre.trim() !== ''));

    return Array.from(new Set(nombres)).sort();
  }, [casos]);

  const handleChangeAnalista = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...filtros, analista: e.target.value });
  };

  const handleChangeAlerta = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...filtros, alerta: e.target.value });
  };

  return (
    <div className="mt-4 border-t border-slate-200 pt-3">
      <p className="mb-2 px-2.5 text-[9px] font-bold uppercase tracking-widest text-slate-400">
        Filtros Avanzados
      </p>

      <div className="space-y-2.5 px-1">
        {/* FILTRO ANALISTA */}
        <div>
          <label
            htmlFor="filtro-analista"
            className="mb-1 block text-[11px] font-medium text-slate-600"
          >
            Analista
          </label>
          <select
            id="filtro-analista"
            value={filtros.analista}
            onChange={handleChangeAnalista}
            className="w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-800 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
          >
            <option value="">Todos los analistas</option>
            {analistasDisponibles.map((nombre) => (
              <option key={nombre} value={nombre}>
                {nombre}
              </option>
            ))}
          </select>
        </div>

        {/* FILTRO ALERTA ACTUALIZACIÓN BASE */}
        <div>
          <label
            htmlFor="filtro-alerta"
            className="mb-1 block text-[11px] font-medium text-slate-600"
          >
            Alerta actualización base
          </label>
          <select
            id="filtro-alerta"
            value={filtros.alerta}
            onChange={handleChangeAlerta}
            className="w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-800 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
          >
            {OPCIONES_ALERTA.map((opcion) => (
              <option key={opcion.value} value={opcion.value}>
                {opcion.label}
              </option>
            ))}
          </select>
        </div>

        {/* BOTÓN LIMPIAR */}
        {(filtros.analista || filtros.alerta) && (
          <button
            type="button"
            onClick={onClear}
            className="w-full rounded-md border border-slate-200 bg-white py-1 text-[11px] font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            Limpiar filtros de alerta
          </button>
        )}
      </div>
    </div>
  );
};