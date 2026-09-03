//components/BusquedaCasos.tsx

'use client';

import React, { useState } from 'react';
import { useBusquedaInteligente, TipoBusqueda } from '@/hooks/useBusquedaInteligente';

export const BusquedaCasos = () => {
  const [tipoBusqueda, setTipoBusqueda] = useState<TipoBusqueda>('contrato');
  const [query, setQuery] = useState('');
  const [busquedaActiva, setBusquedaActiva] = useState('');

  // Petición única al backend NestJS
  const { data: resultado, isLoading, isError } = useBusquedaInteligente(tipoBusqueda, busquedaActiva);

  const handleBuscar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setBusquedaActiva(query.trim());
  };

  const handleCambiarTipo = (tipo: TipoBusqueda) => {
    setTipoBusqueda(tipo);
    setBusquedaActiva('');
    setQuery('');
  };

  const sinResultados =
    busquedaActiva !== '' &&
    !isLoading &&
    !isError &&
    (!resultado || !resultado.encontrado);

  const formatDate = (dateStr?: string | Date | null) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('es-CO');
  };

  const data = resultado?.data;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Búsqueda Inteligente de Casos</h1>

      {/* Botones de selección de tipo */}
      <div className="flex gap-3">
        {(['contrato', 'placa', 'nit'] as TipoBusqueda[]).map((tipo) => (
          <button
            key={tipo}
            onClick={() => handleCambiarTipo(tipo)}
            className={`px-4 py-2 rounded-md capitalize transition-colors ${
              tipoBusqueda === tipo
                ? 'bg-blue-600 text-white font-semibold'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            {tipo}
          </button>
        ))}
      </div>

      {/* Formulario de Búsqueda */}
      <form onSubmit={handleBuscar} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Buscar por ${tipoBusqueda}...`}
          className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Buscar
        </button>
      </form>

      {/* Estados de Carga y Error */}
      {isLoading && (
        <div className="p-4 bg-gray-50 text-gray-600 rounded-md">
          Cargando información desde el servidor...
        </div>
      )}

      {isError && (
        <div className="p-4 bg-red-50 text-red-600 rounded-md">
          Hubo un error al conectar con el backend.
        </div>
      )}

      {sinResultados && (
        <div className="p-4 bg-yellow-50 text-yellow-700 rounded-md">
          No se encontraron resultados para la búsqueda "{busquedaActiva}".
        </div>
      )}

     {/* Visualización de Resultados */}

{resultado?.encontrado && data && data.length > 0 && (
  <div className="space-y-4">
    <h2 className="text-lg font-bold border-b pb-2">
      Resultados para {tipoBusqueda.toUpperCase()}: {busquedaActiva}
    </h2>

    {data.map((caso) => (
      <div
        key={caso.id}
        className="p-6 border rounded-lg bg-white shadow-sm space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p>
              <strong>N° Contrato:</strong> {caso.numeroContrato || '-'}
            </p>

            <p>
              <strong>Fecha de Inicio:</strong>{' '}
              {formatDate(caso.fechaAsignacion)}
            </p>

            <p>
              <strong>Estado:</strong> {caso.estadoId || '-'}
            </p>
          </div>

          {caso.vehiculo && (
            <div className="bg-gray-50 p-3 rounded-md">
              <h3 className="font-semibold text-sm text-gray-700 mb-1">
                Vehículo Asociado
              </h3>

              <p>
                <strong>Placa:</strong> {caso.vehiculo.placa}
              </p>

              <p>
                <strong>Marca:</strong> {caso.vehiculo.marca || '-'}
              </p>
            </div>
          )}

          {caso.locatario && (
            <div className="bg-gray-50 p-3 rounded-md md:col-span-2">
              <h3 className="font-semibold text-sm text-gray-700 mb-1">
                Locatario Asociado
              </h3>

              <p>
                <strong>NIT/Doc:</strong> {caso.locatario.nit}
              </p>

              <p>
                <strong>Nombre/Razón Social:</strong>{' '}
                {caso.locatario.nombreBanco ||
                  caso.locatario.email ||
                  '-'}
              </p>
            </div>
          )}
        </div>
      </div>
    ))}
  </div>
)}

    </div>
  );
};