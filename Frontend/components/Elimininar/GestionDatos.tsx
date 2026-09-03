'use client';

import { useState } from 'react';
import {
  useBusquedaInteligente,
  TipoBusqueda,
} from '@/hooks/useBusquedaInteligente';
import { leasingApi } from '@/services/leasingApi';

interface GestionDatosProps {
  onClose: () => void;
}

export default function GestionDatos({ onClose }: GestionDatosProps) {
  const [tipo, setTipo] = useState<TipoBusqueda>('nit');
  const [busqueda, setBusqueda] = useState('');
  const [query, setQuery] = useState('');

  const [resultadoDirecto, setResultadoDirecto] = useState<any>(null);
  const [buscandoDirecto, setBuscandoDirecto] = useState(false);

  // CONTRATO sigue usando la búsqueda inteligente original
  const {
    data: dataContrato,
    isLoading: loadingContrato,
    error: errorContrato,
  } = useBusquedaInteligente(
    tipo,
    tipo === 'contrato' ? query : '',
  );

  const resultadoContrato = dataContrato?.data ?? null;

  const resultado =
    tipo === 'contrato' ? resultadoContrato : resultadoDirecto;

  const isLoading =
    tipo === 'contrato' ? loadingContrato : buscandoDirecto;

  const error =
    tipo === 'contrato' ? errorContrato : null;

  // =====================================================
  // BUSCAR
  // =====================================================

  const buscar = async () => {
    const termino = busqueda.trim();

    if (!termino) return;

    setQuery(termino);
    setResultadoDirecto(null);

    // CONTRATO
    if (tipo === 'contrato') return;

    try {
      setBuscandoDirecto(true);

      // LOCATARIO POR NIT
      if (tipo === 'nit') {
        const locatarios = await leasingApi.getLocatarios();

        const encontrado = locatarios.find(
          (locatario) =>
            locatario.nit?.trim().toLowerCase() ===
            termino.toLowerCase(),
        );

        setResultadoDirecto(encontrado ?? null);
      }

      // VEHÍCULO POR PLACA
      if (tipo === 'placa') {
        const vehiculos = await leasingApi.getVehiculos();

        const encontrado = vehiculos.find(
          (vehiculo) =>
            vehiculo.placa?.trim().toLowerCase() ===
            termino.toLowerCase(),
        );

        setResultadoDirecto(encontrado ?? null);
      }
    } catch (error) {
      console.error('Error al buscar datos:', error);
      setResultadoDirecto(null);
    } finally {
      setBuscandoDirecto(false);
    }
  };

  // =====================================================
  // CAMBIAR TIPO
  // =====================================================

  const cambiarTipo = (nuevoTipo: TipoBusqueda) => {
    setTipo(nuevoTipo);
    setBusqueda('');
    setQuery('');
    setResultadoDirecto(null);
  };

  // =====================================================
  // ELIMINAR LOCATARIO
  // =====================================================

  const eliminarLocatario = async () => {
    if (!resultado?.id) {
      alert('No se encontró el ID del locatario.');
      return;
    }

    const confirmar = confirm(
      `¿Está seguro de eliminar al locatario ${resultado.nit}?`,
    );

    if (!confirmar) return;

    try {
      // resultado.id corresponde al ID interno numérico del locatario
      await leasingApi.deleteLocatario(resultado.id);

      alert('Locatario eliminado correctamente.');

      setBusqueda('');
      setQuery('');
      setResultadoDirecto(null);
    } catch (error: any) {
      console.error('Error al eliminar locatario:', error);

      alert(
        error?.message ||
          'No se pudo eliminar el locatario.',
      );
    }
  };

  // =====================================================
  // ELIMINAR VEHÍCULO
  // =====================================================

  const eliminarVehiculo = async () => {
    if (!resultado?.placa) {
      alert('No se encontró la placa del vehículo.');
      return;
    }

    const confirmar = confirm(
      `¿Está seguro de eliminar el vehículo ${resultado.placa}?`,
    );

    if (!confirmar) return;

    try {
      // La placa continúa siendo string
      await leasingApi.deleteVehiculo(resultado.placa);

      alert('Vehículo eliminado correctamente.');

      setBusqueda('');
      setQuery('');
      setResultadoDirecto(null);
    } catch (error: any) {
      console.error('Error al eliminar vehículo:', error);

      alert(
        error?.message ||
          'No se pudo eliminar el vehículo.',
      );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow border border-slate-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={onClose}
          className="text-slate-500 hover:text-red-600 text-lg font-bold px-2"
          title="Cerrar"
        >
          ×
        </button>
      </div>

      <h2 className="text-sm font-bold text-slate-800 mb-3">
        Gestión de locatarios y vehículos
      </h2>

      {/* =====================================================
          BUSCADOR
      ====================================================== */}

      <div className="flex gap-2">
        <select
          value={tipo}
          onChange={(e) =>
            cambiarTipo(e.target.value as TipoBusqueda)
          }
          className="border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900"
        >
          <option value="nit">NIT</option>
          <option value="placa">Placa</option>
          <option value="contrato">Contrato</option>
        </select>

        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              buscar();
            }
          }}
          placeholder={`Buscar por ${tipo}...`}
          className="flex-1 border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900"
        />

        <button
          type="button"
          onClick={buscar}
          disabled={!busqueda.trim() || isLoading}
          className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-300 text-white px-4 py-2 rounded-md text-sm font-semibold"
        >
          {isLoading ? 'Buscando...' : 'Buscar'}
        </button>
      </div>

      {/* =====================================================
          ERROR
      ====================================================== */}

      {error && (
        <p className="mt-3 text-sm text-red-600">
          Error al realizar la búsqueda.
        </p>
      )}

      {/* =====================================================
          SIN RESULTADOS
      ====================================================== */}

      {query && !isLoading && !resultado && !error && (
        <p className="mt-3 text-sm text-slate-500">
          No se encontraron resultados.
        </p>
      )}

      {/* =====================================================
          LOCATARIO
      ====================================================== */}

      {resultado && tipo === 'nit' && (
        <div className="mt-4 border border-slate-200 rounded-md p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <span className="text-xs text-slate-500">NIT</span>
              <p className="font-semibold text-sm text-slate-900">
                {resultado.nit || 'Sin información'}
              </p>
            </div>

            <div>
              <span className="text-xs text-slate-500">
                Nombre / Banco
              </span>
              <p className="font-semibold text-sm text-slate-900">
                {resultado.nombreBanco || 'Sin información'}
              </p>
            </div>

            <div>
              <span className="text-xs text-slate-500">
                Email
              </span>
              <p className="font-semibold text-sm text-slate-900">
                {resultado.email || 'Sin información'}
              </p>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={eliminarLocatario}
              className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-md text-xs font-semibold"
            >
              Eliminar locatario
            </button>
          </div>
        </div>
      )}

      {/* =====================================================
          VEHÍCULO
      ====================================================== */}

      {resultado && tipo === 'placa' && (
        <div className="mt-4 border border-slate-200 rounded-md p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <span className="text-xs text-slate-500">
                Placa
              </span>
              <p className="font-semibold text-sm text-slate-900">
                {resultado.placa || 'Sin información'}
              </p>
            </div>

            <div>
              <span className="text-xs text-slate-500">
                Marca
              </span>
              <p className="font-semibold text-sm text-slate-900">
                {resultado.marca || 'Sin información'}
              </p>
            </div>

            <div>
              <span className="text-xs text-slate-500">
                Línea
              </span>
              <p className="font-semibold text-sm text-slate-900">
                {resultado.linea || 'Sin información'}
              </p>
            </div>

            <div>
              <span className="text-xs text-slate-500">
                Modelo
              </span>
              <p className="font-semibold text-sm text-slate-900">
                {resultado.modelo || 'Sin información'}
              </p>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={eliminarVehiculo}
              className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-md text-xs font-semibold"
            >
              Eliminar vehículo
            </button>
          </div>
        </div>
      )}

      {/* =====================================================
          CONTRATO
      ====================================================== */}

      {resultado && tipo === 'contrato' && (
        <div className="mt-4 border border-slate-200 rounded-md p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <span className="text-xs text-slate-500">
                Contrato
              </span>
              <p className="font-semibold text-sm text-slate-900">
                {resultado.numeroContrato ||
                  'Sin información'}
              </p>
            </div>

            <div>
              <span className="text-xs text-slate-500">
                Locatario
              </span>

              <p className="font-semibold text-sm text-slate-900">
                {resultado.locatario?.nombreBanco ||
                  'Sin información'}
              </p>

              <p className="text-xs text-slate-500">
                NIT:{' '}
                {resultado.locatario?.nit || 'Sin NIT'}
              </p>
            </div>

            <div>
              <span className="text-xs text-slate-500">
                Vehículo
              </span>

              <p className="font-semibold text-sm text-slate-900">
                {resultado.vehiculo?.placa || 'Sin placa'}
              </p>

              <p className="text-xs text-slate-500">
                {resultado.vehiculo?.marca || ''}{' '}
                {resultado.vehiculo?.linea || ''}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}