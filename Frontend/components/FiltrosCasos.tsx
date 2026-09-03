'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Caso } from '@/types/leasing';
import { obtenerEstadosPorTipo } from '@/services/estado.service';

export interface FiltrosSeleccionados {
  estado: string;
  categoria: string;
  etapa: string;
  subetapa: string;
}

interface CatalogoEstado {
  id: number;
  nombre: string;
}

interface FiltrosCasosProps {
  casos: Caso[];
  filtros: FiltrosSeleccionados;
  onChange: (filtros: FiltrosSeleccionados) => void;
  onClear: () => void;
}

const getTextValue = (value: unknown): string => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string' || typeof value === 'number') return String(value);

  if (typeof value === 'object' && 'nombre' in value) {
    const nombre = (value as { nombre?: unknown }).nombre;
    return nombre === null || nombre === undefined ? '' : String(nombre);
  }

  return '';
};

const uniqueValues = (values: string[]) =>
  Array.from(new Set(values.map((value) => value.trim()).filter(Boolean))).sort((a, b) =>
    a.localeCompare(b, 'es'),
  );

export default function FiltrosCasos({ casos, filtros, onChange, onClear }: FiltrosCasosProps) {
  const [catalogos, setCatalogos] = useState({
    estados: [] as CatalogoEstado[],
    categorias: [] as CatalogoEstado[],
    etapas: [] as CatalogoEstado[],
    subetapas: [] as CatalogoEstado[],
  });
  const [cargandoCatalogos, setCargandoCatalogos] = useState(true);

  useEffect(() => {
    let activo = true;

    const cargarCatalogos = async () => {
      try {
        const [estados, categorias, etapas, subetapas] = await Promise.all([
          obtenerEstadosPorTipo('ESTADO_CASO'),
          obtenerEstadosPorTipo('CATEGORIA'),
          obtenerEstadosPorTipo('ETAPA'),
          obtenerEstadosPorTipo('SUBETAPA'),
        ]);

        if (activo) {
          setCatalogos({ estados, categorias, etapas, subetapas });
        }
      } catch (error) {
        console.error('Error al cargar opciones de filtros:', error);
      } finally {
        if (activo) setCargandoCatalogos(false);
      }
    };

    void cargarCatalogos();

    return () => {
      activo = false;
    };
  }, []);

  const opciones = useMemo(() => {
    const desdeCatalogo = (items: CatalogoEstado[]) => items.map((item) => item.nombre);

    return {
      estados: uniqueValues([
        ...desdeCatalogo(catalogos.estados),
        ...casos.map((caso) => getTextValue(caso.estado)),
      ]),
      categorias: uniqueValues([
        ...desdeCatalogo(catalogos.categorias),
        ...casos.map((caso) => getTextValue(caso.categoria)),
      ]),
      etapas: uniqueValues([
        ...desdeCatalogo(catalogos.etapas),
        ...casos.map((caso) => getTextValue((caso as Caso & { etapa?: unknown }).etapa)),
      ]),
      subetapas: uniqueValues([
        ...desdeCatalogo(catalogos.subetapas),
        ...casos.map((caso) => getTextValue((caso as Caso & { subetapa?: unknown }).subetapa)),
      ]),
    };
  }, [casos, catalogos]);

  const filtrosActivos = Object.values(filtros).filter(Boolean).length;

  const actualizarFiltro = (campo: keyof FiltrosSeleccionados, valor: string) => {
    onChange({ ...filtros, [campo]: valor });
  };

  const selectClassName =
    'mt-1 w-full rounded-lg border border-[#d8e8e4] bg-white px-2.5 py-2 text-xs text-[#31504b] outline-none transition focus:border-[#5fae9d] focus:ring-4 focus:ring-[#5fae9d]/15 disabled:cursor-wait disabled:bg-[#f7fbfa]';

  const renderSelect = (
    label: string,
    campo: keyof FiltrosSeleccionados,
    opcionesCampo: string[],
    textoVacio: string,
  ) => (
    <label className="block text-xs font-semibold text-[#52716b]" key={campo}>
      {label}
      <select
        value={filtros[campo]}
        onChange={(event) => actualizarFiltro(campo, event.target.value)}
        className={selectClassName}
        disabled={cargandoCatalogos && opcionesCampo.length === 0}
      >
        <option value="">{textoVacio}</option>
        {opcionesCampo.map((opcion) => (
          <option key={opcion} value={opcion}>{opcion}</option>
        ))}
      </select>
    </label>
  );

  return (
    <section className="mt-8 border-t border-[#d8e8e4] pt-5" aria-labelledby="filtros-casos-title">
      <div className="mb-3 flex items-center justify-between px-1">
        <div>
          <p id="filtros-casos-title" className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#52716b]">
            Filtros rápidos
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            {filtrosActivos ? `${filtrosActivos} activo${filtrosActivos > 1 ? 's' : ''}` : 'Sin filtros activos'}
          </p>
        </div>
        {filtrosActivos > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="!min-h-0 !border-0 !bg-transparent !px-1 !py-1 text-[11px] !font-semibold !text-[#438b7d] !shadow-none hover:!bg-transparent hover:!text-[#347365]"
          >
            Limpiar
          </button>
        )}
      </div>

      <div className="space-y-3">
        {renderSelect('Estado', 'estado', opciones.estados, 'Todos')}
        {renderSelect('Categoría', 'categoria', opciones.categorias, 'Todas')}
        {renderSelect('Etapa', 'etapa', opciones.etapas, 'Todas')}
        {renderSelect('Subetapa', 'subetapa', opciones.subetapas, 'Todas')}

        <button
          type="button"
          onClick={onClear}
          className="!mt-2 w-full !min-h-0 !border-[#d8e8e4] !bg-white !py-2 !text-xs !text-[#52716b] hover:!border-[#b9d3cd] hover:!bg-[#f7fbfa] hover:!text-[#347365]"
        >
          Limpiar filtros
        </button>
      </div>
    </section>
  );
}
