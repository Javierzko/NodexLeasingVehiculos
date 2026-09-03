'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Caso } from '@/types/leasing';
import {
  useBusquedaInteligente,
  TipoBusqueda,
} from '@/hooks/useBusquedaInteligente';
import { leasingApi } from '@/services/leasingApi';
import { DetalleCaso } from '@/components/DetalleCaso';

export default function ModuloDetalleCaso() {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [tipoBusqueda, setTipoBusqueda] = useState<TipoBusqueda>('contrato');
  const [query, setQuery] = useState('');
  const [casoSeleccionado, setCasoSeleccionado] = useState<Caso | null>(null);
  const [cargandoDetalle, setCargandoDetalle] = useState(false);
  const [errorDetalle, setErrorDetalle] = useState<string | null>(null);

  const { data, isLoading, isError, error } = useBusquedaInteligente(tipoBusqueda, query);

  const handleAbrirModal = () => {
    setModalAbierto(true);
    setErrorDetalle(null);
  };

  const handleCerrarModal = useCallback(() => {
    setModalAbierto(false);
    setQuery('');
  }, []);

  const cerrarExpediente = useCallback(() => {
    setCasoSeleccionado(null);
    setErrorDetalle(null);
  }, []);

  useEffect(() => {
    if (modalAbierto || casoSeleccionado) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [modalAbierto, casoSeleccionado]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (modalAbierto) handleCerrarModal();
        else if (casoSeleccionado) cerrarExpediente();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modalAbierto, casoSeleccionado, handleCerrarModal, cerrarExpediente]);

  const handleSeleccionarCaso = async (caso: Caso) => {
    if (!caso.id) {
      setErrorDetalle('El caso seleccionado no tiene un ID válido.');
      return;
    }

    try {
      setCargandoDetalle(true);
      setErrorDetalle(null);

      const casoCompleto = await leasingApi.getCasoById(caso.id);

      setCasoSeleccionado(casoCompleto);
      setModalAbierto(false);
      setQuery('');
    } catch (err: unknown) {
      console.error('Error al obtener el detalle completo del caso:', err);

      setErrorDetalle(
        err instanceof Error
          ? err.message
          : 'No fue posible obtener el detalle completo del expediente.'
      );
    } finally {
      setCargandoDetalle(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleAbrirModal}
        className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow transition-all flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-400"
      >
        <span>🔍</span>
        Ver Detalles
      </button>

      {modalAbierto && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 [zoom:1]"
        >
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh] border border-slate-200">
            <div className="bg-slate-900 text-white px-5 py-3 flex justify-between items-center">
              <div>
                <h2 className="text-sm font-bold">
                  Búsqueda Inteligente de Expediente
                </h2>
                <p className="text-[11px] text-slate-400">
                  Consulte el expediente directamente en el servidor
                </p>
              </div>

              <button
                type="button"
                onClick={handleCerrarModal}
                className="text-slate-400 hover:text-white text-lg font-bold px-2 py-1 rounded transition-colors"
                aria-label="Cerrar modal"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-slate-50 border-b flex flex-col sm:flex-row gap-2">
              <select
                value={tipoBusqueda}
                onChange={(e) => setTipoBusqueda(e.target.value as TipoBusqueda)}
                className="bg-white border border-slate-300 text-slate-800 text-xs rounded-lg px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="contrato">N° Contrato</option>
                <option value="placa">Placa Vehículo</option>
                <option value="nit">NIT Locatario</option>
              </select>

              <input
                type="text"
                placeholder={`Buscar por ${tipoBusqueda.toUpperCase()}...`}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
                className="flex-1 bg-white border border-slate-300 text-slate-900 text-xs rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {!query.trim() && (
                <p className="text-center text-xs text-slate-400 py-8">
                  Ingrese un término para iniciar la búsqueda.
                </p>
              )}

              {isLoading && (
                <p className="text-center text-xs text-indigo-600 font-semibold animate-pulse py-8">
                  Consultando servidor...
                </p>
              )}

              {isError && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-xs border border-red-200">
                  {(error as Error)?.message || 'Error al consultar el servidor.'}
                </div>
              )}

              {data?.data?.length === 0 && query.trim() && !isLoading && (
                <p className="text-center text-xs text-slate-500 py-8">
                  No se encontraron coincidencias.
                </p>
              )}

              {data?.data && data.data.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[11px] text-slate-500 font-medium px-1">
                    Coincidencias encontradas: {data.data.length}
                  </p>

                  <div className="divide-y border rounded-lg bg-white overflow-hidden">
                    {data.data.map((caso) => (
                      <button
                        type="button"
                        key={caso.id}
                        onClick={() => handleSeleccionarCaso(caso)}
                        disabled={cargandoDetalle}
                        className="w-full text-left p-3 hover:bg-indigo-50/50 cursor-pointer transition-colors flex justify-between items-center text-xs disabled:opacity-50"
                      >
                        <div>
                          <p className="font-bold text-slate-800">
                            Contrato: {caso.numeroContrato || 'N/A'}
                          </p>

                          <p className="text-slate-500 text-[11px]">
                            Placa: {caso.vehiculoPlaca || 'N/A'} | NIT:{' '}
                            {caso.locatario?.nit || 'N/A'}
                          </p>

                          {caso.locatario?.nombreComercial && (
                            <p className="text-slate-600 text-[11px] font-medium mt-0.5">
                              {caso.locatario.nombreComercial}
                            </p>
                          )}
                        </div>

                        <span className="text-indigo-600 font-semibold text-[11px] bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
                          Ver →
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {cargandoDetalle && (
                <div className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center">
                  <div className="bg-white rounded-xl shadow-xl px-6 py-5 text-center">
                    <p className="text-sm font-semibold text-slate-800">
                      Cargando expediente...
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Obteniendo información actual del servidor
                    </p>
                  </div>
                </div>
              )}

              {errorDetalle && (
                <div className="bg-red-50 text-red-700 p-3 rounded-lg text-xs border border-red-200">
                  {errorDetalle}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {casoSeleccionado && (
        <div className="fixed inset-0 z-[9999] bg-slate-100 flex flex-col h-full w-full overflow-hidden [zoom:1]">
          <div className="bg-slate-900 text-white px-6 py-3 flex justify-between items-center shadow-md shrink-0">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={cerrarExpediente}
                className="bg-slate-800 hover:bg-slate-700 text-white text-xs px-3 py-1.5 rounded-lg border border-slate-700 transition-colors flex items-center gap-1 font-semibold"
              >
                ← Cerrar Expediente
              </button>

              <div>
                <h2 className="text-sm font-bold text-white">
                  Expediente Contrato N°: {casoSeleccionado.numeroContrato || 'N/A'}
                </h2>

                <p className="text-[11px] text-slate-400">
                  Placa: {casoSeleccionado.vehiculoPlaca || 'N/A'} | NIT:{' '}
                  {casoSeleccionado.locatario?.nit || 'N/A'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAbrirModal}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow transition-all"
            >
              🔍 Buscar Otro Caso
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 max-w-[1600px] w-full mx-auto">
            <DetalleCaso caso={casoSeleccionado} />
          </div>
        </div>
      )}
    </>
  );
}