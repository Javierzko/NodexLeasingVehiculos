//razi components/Modal/CrearCasoModal.tsx

'use client';

import React from 'react';
import { useCrearCasoForm } from '@/hooks/useCrearCasoForm';
import { Caso } from '@/types/leasing';
import {
  LocatarioSection,
  VehiculoSection,
  CasoFormTabsNav,
  CasoFormTabsContent,
} from '@/components/Modal/CasoFormSections';

type CrearCasoFormProps = {
  presentation?: 'page' | 'modal';
  onSuccess?: () => void;
  onCancel?: () => void;
  casoAEditar?: Caso | null;
};

export function CrearCasoForm({
  presentation = 'page',
  onSuccess,
  onCancel,
  casoAEditar,
}: CrearCasoFormProps) {
  const {
    activeTab,
    setActiveTab,
    locatarios,
    vehiculos,
    loading,
    submitting,
    error,
    modoLocatario,
    setModoLocatario,
    modoVehiculo,
    setModoVehiculo,
    nuevoLocatario,
    setNuevoLocatario,
    nuevoVehiculo,
    setNuevoVehiculo,
    formData,
    handleChange,
    handleSubmit,
  } = useCrearCasoForm({ presentation, onSuccess, casoAEditar });

  if (loading) return <p className="p-6 text-center text-slate-600">Cargando formulario...</p>;

  const esEdicion = Boolean(casoAEditar);

  return (
    <form
      onSubmit={handleSubmit}
      className={
        presentation === 'page'
          ? 'bg-white p-6 rounded-xl shadow-md space-y-6 max-w-5xl mx-auto border border-slate-200'
          : 'p-6 overflow-y-auto flex-1 space-y-6'
      }
    >
      <div className="border-b pb-3">
        <h2 className="text-xl font-bold text-slate-800">
          {esEdicion ? '✏️ Editar Expediente de Leasing' : '📋 Nuevo Expediente de Leasing'}
        </h2>
        <p className="text-sm text-slate-500">
          Diligencie la información completa del caso organizándolo mediante las pestañas inferiores.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-lg">
          {error}
        </div>
      )}

      <LocatarioSection
        modoLocatario={modoLocatario}
        setModoLocatario={setModoLocatario}
        locatarios={locatarios}
        formData={formData}
        handleChange={handleChange}
        nuevoLocatario={nuevoLocatario}
        setNuevoLocatario={setNuevoLocatario}
      />

      <VehiculoSection
        modoVehiculo={modoVehiculo}
        setModoVehiculo={setModoVehiculo}
        vehiculos={vehiculos}
        formData={formData}
        handleChange={handleChange}
        nuevoVehiculo={nuevoVehiculo}
        setNuevoVehiculo={setNuevoVehiculo}
      />

      <CasoFormTabsNav activeTab={activeTab} setActiveTab={setActiveTab} />
      <CasoFormTabsContent activeTab={activeTab} formData={formData} handleChange={handleChange} />

      <div className="flex justify-end gap-2 border-t pt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100 text-sm"
          >
            Cancelar
          </button>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg shadow-sm transition disabled:bg-slate-400 text-sm mt-4"
        >
          {submitting
            ? 'Guardando Registro en Sistema...'
            : esEdicion
              ? 'Actualizar Expediente'
              : presentation === 'modal'
                ? 'Guardar Caso Completo'
                : 'Crear Expediente de Leasing Completo'}
        </button>
      </div>
    </form>
  );
}

export interface CrearCasoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCasoCreado: () => void;
  casoAEditar?: Caso | null;
}

export default function CrearCasoModal({
  isOpen,
  onClose,
  onCasoCreado,
  casoAEditar,
}: CrearCasoModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="crear-caso-modal-title"
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2
            id="crear-caso-modal-title"
            className="text-xl font-bold text-slate-800"
          >
            {casoAEditar ? 'Editar Expediente de Leasing' : 'Crear Nuevo Expediente de Leasing'}
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar ventana"
            className="text-gray-500 hover:text-gray-700 font-bold"
          >
            ✕
          </button>
        </div>

        <CrearCasoForm
          presentation="modal"
          onCancel={onClose}
          onSuccess={onCasoCreado}
          casoAEditar={casoAEditar}
        />
      </div>
    </div>
  );
}