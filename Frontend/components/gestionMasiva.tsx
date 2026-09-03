'use client';

import { useMemo, useState } from 'react';
import { Caso, Estado } from '@/types/leasing';
import {
  useCambiarEstadosMasivo,
  useEstadosGestionMasiva,
} from '@/hooks/useGestionMasiva';
import { useBuscarCasosGestion } from '@/hooks/useGestion';

interface Props {
  casos?: Caso[];
  onClose?: () => void;
  onActualizado?: () => void | Promise<void>;
}

type CampoCatalogo = 'estadoId' | 'categoriaId' | 'etapaId' | 'subetapaId';
type Filtros = Record<CampoCatalogo, string>;
type NuevosValores = Record<CampoCatalogo, string>;

const campos: Array<{ key: CampoCatalogo; label: string }> = [
  { key: 'estadoId', label: 'Estado' },
  { key: 'categoriaId', label: 'Categoría' },
  { key: 'etapaId', label: 'Etapa' },
  { key: 'subetapaId', label: 'Subetapa' },
];

const vacio = (): Filtros => ({
  estadoId: '',
  categoriaId: '',
  etapaId: '',
  subetapaId: '',
});

const catalogosPorTipo: Record<CampoCatalogo, string> = {
  estadoId: 'ESTADO_CASO',
  categoriaId: 'CATEGORIA',
  etapaId: 'ETAPA',
  subetapaId: 'SUBETAPA',
};

export default function GestionMasiva({
  casos = [],
  onClose,
  onActualizado,
}: Props) {
  const [filtros, setFiltros] = useState<Filtros>(vacio);
  const [placaBusqueda, setPlacaBusqueda] = useState<string>('');
  const [nuevos, setNuevos] = useState<NuevosValores>(vacio);
  const [seleccionados, setSeleccionados] = useState<number[]>([]);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { data: catalogos = [], isLoading: cargandoCatalogos } =
    useEstadosGestionMasiva();
  const mutacion = useCambiarEstadosMasivo();

  // BÚSQUEDA EN BACKEND: Llama a la API cuando el usuario escribe en el input de placa
  const { data: resultadoBackend, isLoading: cargandoBackend } =
    useBuscarCasosGestion('placa', placaBusqueda);

  const opciones = useMemo(() => {
    const resultado = {} as Record<CampoCatalogo, Estado[]>;

    for (const campo of campos) {
      resultado[campo.key] = (catalogos ?? []).filter(
        (item) => item.tipo === catalogosPorTipo[campo.key] && item.activo,
      );
    }

    return resultado;
  }, [catalogos]);

  // COMBINACIÓN: Si hay búsqueda de la API, toma data del backend; si no, toma la lista de props
  const baseDeCasos = useMemo(() => {
    if (placaBusqueda.trim()) {
      return resultadoBackend?.data ?? [];
    }
    return casos ?? [];
  }, [placaBusqueda, resultadoBackend, casos]);

  // FILTRADO LOCAL SOBRE LOS RESULTADOS (Backend + Selects de estado/etapa/etc)
  const casosFiltrados = useMemo(() => {
    return baseDeCasos.filter((caso) =>
      campos.every(({ key }) => {
        const filtro = filtros[key];
        return !filtro || String(caso[key]) === filtro;
      }),
    );
  }, [baseDeCasos, filtros]);

  const idsFiltrados = useMemo(
    () => casosFiltrados.map((caso) => caso.id),
    [casosFiltrados],
  );

  const todosSeleccionados =
    idsFiltrados.length > 0 &&
    idsFiltrados.every((id) => seleccionados.includes(id));

  const cambiarFiltro = (campo: CampoCatalogo, valor: string) => {
    setFiltros((actual) => ({ ...actual, [campo]: valor }));
    setSeleccionados([]);
    setMensaje(null);
    setError(null);
  };

  const cambiarPlacaBusqueda = (valor: string) => {
    setPlacaBusqueda(valor);
    setSeleccionados([]);
    setMensaje(null);
    setError(null);
  };

  const cambiarNuevo = (campo: CampoCatalogo, valor: string) => {
    setNuevos((actual) => ({ ...actual, [campo]: valor }));
    setMensaje(null);
    setError(null);
  };

  const alternarSeleccion = (id: number) => {
    setSeleccionados((actual) =>
      actual.includes(id)
        ? actual.filter((item) => item !== id)
        : [...actual, id],
    );
  };

  const seleccionarFiltrados = () => {
    if (todosSeleccionados) {
      const filtrados = new Set(idsFiltrados);
      setSeleccionados((actual) =>
        actual.filter((id) => !filtrados.has(id)),
      );
      return;
    }

    setSeleccionados((actual) => [
      ...new Set([...actual, ...idsFiltrados]),
    ]);
  };

  const actualizarMasivo = async () => {
    setMensaje(null);
    setError(null);

    if (seleccionados.length === 0) {
      setError('Debe seleccionar al menos un caso.');
      return;
    }

    const payload = Object.fromEntries(
      Object.entries(nuevos)
        .filter(([, valor]) => Boolean(valor))
        .map(([campo, valor]) => [campo, Number(valor)]),
    ) as Partial<Record<CampoCatalogo, number>>;

    if (Object.keys(payload).length === 0) {
      setError(
        'Debe seleccionar al menos un nuevo valor: estado, categoría, etapa o subetapa.',
      );
      return;
    }

    try {
      const respuesta = await mutacion.mutateAsync({
        casoIds: seleccionados,
        ...payload,
      });

      setMensaje(
        respuesta.mensaje ||
          `${respuesta.cantidadActualizados ?? seleccionados.length} caso(s) actualizado(s).`,
      );
      setSeleccionados([]);
      setNuevos(vacio);
      await onActualizado?.();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'No fue posible actualizar los casos.',
      );
    }
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <header className="flex items-start justify-between border-b border-slate-200 bg-slate-900 px-5 py-4 text-white">
        <div>
          <h2 className="text-sm font-bold">Gestión masiva de casos</h2>
          <p className="mt-1 text-xs text-slate-300">
            Filtra por los valores actuales y asigna los nuevos valores a los casos seleccionados.
          </p>
        </div>
        {onClose && (
          <button type="button" onClick={onClose} className="text-lg text-slate-300 hover:text-white">
            ×
          </button>
        )}
      </header>

      <div className="space-y-5 p-5">
        <div>
          <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-700">
            1. Filtros de búsqueda: valores actuales
          </h3>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
            <div>
              <label className="mb-1 block text-[11px] font-semibold text-slate-700">
                Buscar Placa en base
              </label>
              <input
                type="text"
                placeholder="Ej. ABC123"
                value={placaBusqueda}
                onChange={(e) => cambiarPlacaBusqueda(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {campos.map(({ key, label }) => (
              <SelectCatalogo
                key={`filtro-${key}`}
                label={`${label} actual`}
                value={filtros[key]}
                options={opciones[key]}
                placeholder={`Todos los ${label.toLowerCase()}s`}
                loading={cargandoCatalogos}
                onChange={(valor) => cambiarFiltro(key, valor)}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-slate-50 p-3 text-xs">
          <strong className="text-slate-700">
            {casosFiltrados.length} encontrados · {seleccionados.length} seleccionados
          </strong>
          <button
            type="button"
            onClick={seleccionarFiltrados}
            disabled={idsFiltrados.length === 0}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 font-semibold text-slate-700 disabled:opacity-50 hover:bg-slate-50"
          >
            {todosSeleccionados ? 'Quitar selección' : 'Seleccionar filtrados'}
          </button>
        </div>

        <div className="max-h-64 overflow-y-auto rounded-lg border border-slate-200">
          {cargandoBackend ? (
            <p className="p-6 text-center text-xs text-slate-500">
              Buscando en la base de datos...
            </p>
          ) : casosFiltrados.length === 0 ? (
            <p className="p-6 text-center text-xs text-slate-500">
              No existen casos con esos filtros.
            </p>
          ) : (
            casosFiltrados.map((caso) => (
              <label key={caso.id} className="flex cursor-pointer items-center gap-3 border-b border-slate-100 p-3 text-xs last:border-0 hover:bg-amber-50">
                <input
                  type="checkbox"
                  checked={seleccionados.includes(caso.id)}
                  onChange={() => alternarSeleccion(caso.id)}
                  className="h-4 w-4 rounded border-slate-300 text-amber-600"
                />
                <span className="text-slate-700">
                  <strong>Contrato: {caso.numeroContrato || 'N/A'}</strong>
                  <span className="ml-3 text-slate-500">
                    Placa: {caso.vehiculoPlaca || caso.vehiculo?.placa || 'N/A'}
                  </span>
                </span>
              </label>
            ))
          )}
        </div>

        <div>
          <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-700">
            2. Nuevos valores para los casos seleccionados
          </h3>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
            {campos.map(({ key, label }) => (
              <SelectCatalogo
                key={`nuevo-${key}`}
                label={`Nuevo ${label.toLowerCase()}`}
                value={nuevos[key]}
                options={opciones[key]}
                placeholder={`Seleccione ${label.toLowerCase()}`}
                loading={cargandoCatalogos}
                onChange={(valor) => cambiarNuevo(key, valor)}
              />
            ))}
          </div>
          <p className="mt-2 text-[11px] text-slate-500">
            Solo se actualizarán los nuevos valores que selecciones. Los que queden vacíos conservarán su valor actual.
          </p>
        </div>

        {mensaje && <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-700">{mensaje}</div>}
        {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-600">{error}</div>}

        <div className="flex justify-end gap-2 border-t border-slate-200 pt-4">
          {onClose && <button type="button" onClick={onClose} className="rounded-lg bg-slate-200 px-4 py-2 text-xs font-semibold text-slate-700">Cancelar</button>}
          <button
            type="button"
            onClick={actualizarMasivo}
            disabled={mutacion.isPending}
            className="rounded-lg bg-purple-600 px-4 py-2 text-xs font-semibold text-white hover:bg-purple-500 disabled:bg-purple-300"
          >
            {mutacion.isPending ? 'Actualizando...' : 'Aplicar cambios masivos'}
          </button>
        </div>
      </div>
    </section>
  );
}

interface SelectCatalogoProps {
  label: string;
  value: string;
  options?: Estado[];
  placeholder: string;
  loading?: boolean;
  onChange: (value: string) => void;
}

function SelectCatalogo({
  label,
  value,
  options = [],
  placeholder,
  loading = false,
  onChange,
}: SelectCatalogoProps) {
  return (
    <div>
      <label className="mb-1 block text-[11px] font-semibold text-slate-700">{label}</label>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={loading}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-slate-100"
      >
        <option value="">{loading ? 'Cargando...' : placeholder}</option>
        {(options ?? []).map((item) => (
          <option key={item.id} value={item.id}>{item.nombre}</option>
        ))}
      </select>
    </div>
  );
}