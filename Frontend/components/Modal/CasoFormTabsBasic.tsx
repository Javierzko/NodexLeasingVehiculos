// raiz/components/Modal/CasoFormTabsBasic.tsx

'use client';

import React from 'react';
import { CrearCasoInput } from '@/types/leasing';
import { TabId } from '@/hooks/useCrearCasoForm';

type ChangeHandler = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
) => void;

export function CasoFormTabsBasic({
  activeTab,
  formData,
  handleChange,
}: {
  activeTab: TabId;
  formData: CrearCasoInput;
  handleChange: ChangeHandler;
}) {
  return (
    <>
      {/* =========================================================
          PESTAÑA: BÁSICO
      ========================================================= */}
      {activeTab === 'basico' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Número de contrato */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700">
              No. Contrato *
            </label>

            <input
              required
              name="numeroContrato"
              value={formData.numeroContrato}
              onChange={handleChange}
              className="w-full border p-2 rounded text-sm"
              placeholder="Ej: CTR-1001"
            />
          </div>

          {/* Radicado Bizagi */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700">
              Radicado Bizagi
            </label>

            <input
              name="radicadoBizagi"
              value={formData.radicadoBizagi || ''}
              onChange={handleChange}
              className="w-full border p-2 rounded text-sm"
              placeholder="Ej: BZ-98765"
            />
          </div>

          {/* Analista responsable */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700">
              Analista Responsable
            </label>

            <input
              name="analistaResponsable"
              value={formData.analistaResponsable || ''}
              onChange={handleChange}
              className="w-full border p-2 rounded text-sm"
            />
          </div>




{/* Opción de compra */}
<div className="flex items-center gap-2">
  <input
    type="checkbox"
    name="aplicaInscripcionOpcionCompra"
    checked={formData.aplicaInscripcionOpcionCompra ?? false}
    onChange={handleChange}
  />
  <label className="text-sm font-medium text-slate-700">
    ¿Aplica inscripción de opción de compra?
  </label>
</div>

<div>
  <label className="block text-xs font-bold uppercase text-slate-700">
    Valor Opción de Compra ($)
  </label>
  <input
    type="number"
    min="0"
    step="0.01"
    name="valorOpcionCompra"
    value={formData.valorOpcionCompra ?? ''}
    onChange={handleChange}
    disabled={!formData.aplicaInscripcionOpcionCompra}
    className="w-full rounded border p-2 text-sm disabled:cursor-not-allowed disabled:bg-slate-100"
  />
</div>





          {/* Observaciones generales */}
          <div className="col-span-2">
            <label className="block text-xs font-bold uppercase text-slate-700">
              Observaciones Generales
            </label>

            <textarea
              name="observacionesGeneral"
              value={formData.observacionesGeneral || ''}
              onChange={handleChange}
              className="w-full border p-2 rounded text-sm"
              rows={2}
            />
          </div>

        </div>
      )}

      {/* =========================================================
          PESTAÑA: FECHAS
      ========================================================= */}
      {activeTab === 'fechas' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Fecha del caso - automática */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700">
              Fecha del Caso
            </label>

            <input
              type="date"
              name="fecha"
              value={formData.fecha || ''}
              readOnly
              className="w-full border p-2 rounded text-sm bg-slate-100 cursor-not-allowed"
            />
          </div>

          {/* Fecha asignación */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700">
              Fecha Asignación
            </label>

            <input
              type="date"
              name="fechaAsignacion"
              value={formData.fechaAsignacion || ''}
              onChange={handleChange}
              className="w-full border p-2 rounded text-sm"
            />
          </div>

          {/* Fecha cierre traspaso */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700">
              Fecha Cierre Traspaso
            </label>

            <input
              type="date"
              name="fechaCierreTraspaso"
              value={formData.fechaCierreTraspaso || ''}
              onChange={handleChange}
              className="w-full border p-2 rounded text-sm"
            />
          </div>

          {/* Fecha solicitud suspensión */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700">
              Fecha Solicitud Suspensión
            </label>

            <input
              type="date"
              name="fechaSolicitudSuspension"
              value={formData.fechaSolicitudSuspension || ''}
              onChange={handleChange}
              className="w-full border p-2 rounded text-sm"
            />
          </div>

          {/* Fecha hasta suspensión */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700">
              Fecha Hasta Suspensión
            </label>

            <input
              type="date"
              name="fechaHastaSuspension"
              value={formData.fechaHastaSuspension || ''}
              onChange={handleChange}
              className="w-full border p-2 rounded text-sm"
            />
          </div>

        </div>
      )}

      {/* =========================================================
          PESTAÑA: NOTIFICACIONES
      ========================================================= */}
      {activeTab === 'notificaciones' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Se envió notificación */}
          <div className="col-span-2 flex items-center gap-2">
            <input
              type="checkbox"
              name="seEnvioNotificacion"
              checked={formData.seEnvioNotificacion || false}
              onChange={handleChange}
            />

            <label className="text-sm font-medium text-slate-700">
              ¿Se envió notificación?
            </label>
          </div>

          {/* Fecha debes enviar notificación */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700">
              Fecha Debes Enviar Notificación
            </label>

            <input
              type="date"
              name="fechaDebesEnviarNotificacion"
              value={formData.fechaDebesEnviarNotificacion || ''}
              onChange={handleChange}
              className="w-full border p-2 rounded text-sm"
            />
          </div>

          {/* Fecha notificación inicial */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700">
              Fecha Notificación Inicial
            </label>

            <input
              type="date"
              name="fechaNotificacionInicial"
              value={formData.fechaNotificacionInicial || ''}
              onChange={handleChange}
              className="w-full border p-2 rounded text-sm"
            />
          </div>

          {/* Última notificación */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700">
              Fecha Última Notificación
            </label>

            <input
              type="date"
              name="fechaUltimaNotificacion"
              value={formData.fechaUltimaNotificacion || ''}
              onChange={handleChange}
              className="w-full border p-2 rounded text-sm"
            />
          </div>

          {/* Próxima notificación */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700">
              Fecha Próxima Notificación
            </label>

            <input
              type="date"
              name="fechaProximaNotificacion"
              value={formData.fechaProximaNotificacion || ''}
              onChange={handleChange}
              className="w-full border p-2 rounded text-sm"
            />
          </div>

        </div>
      )}

      {/* =========================================================
          PESTAÑA: TRASPASO
      ========================================================= */}
      {activeTab === 'traspaso' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Traspaso con cita */}
          <div className="col-span-2 flex items-center gap-2">
            <input
              type="checkbox"
              name="traspasoConCita"
              checked={formData.traspasoConCita || false}
              onChange={handleChange}
            />

            <label className="text-sm font-medium text-slate-700">
              Traspaso con Cita
            </label>
          </div>

          {/* Fecha inicio cita tránsito */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700">
              Fecha Inicio Cita Tránsito
            </label>

            <input
              type="date"
              name="fechaInicioCitaTransito"
              value={formData.fechaInicioCitaTransito || ''}
              onChange={handleChange}
              className="w-full border p-2 rounded text-sm"
            />
          </div>

          {/* Fecha consecución cita tránsito */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700">
              Fecha Consecución Cita Tránsito
            </label>

            <input
              type="date"
              name="fechaConsecucionCitaTransito"
              value={formData.fechaConsecucionCitaTransito || ''}
              onChange={handleChange}
              className="w-full border p-2 rounded text-sm"
            />
          </div>

          {/* Fecha cita tránsito */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700">
              Fecha Cita Tránsito
            </label>

            <input
              type="date"
              name="fechaCitaTransito"
              value={formData.fechaCitaTransito || ''}
              onChange={handleChange}
              className="w-full border p-2 rounded text-sm"
            />
          </div>

          {/* Fecha radicación traspaso */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700">
              Fecha Radicación Traspaso
            </label>

            <input
              type="date"
              name="fechaRadicacionTraspaso"
              value={formData.fechaRadicacionTraspaso || ''}
              onChange={handleChange}
              className="w-full border p-2 rounded text-sm"
            />
          </div>

          {/* Fecha rechazo */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700">
              Fecha Rechazo
            </label>

            <input
              type="date"
              name="fechaRechazo"
              value={formData.fechaRechazo || ''}
              onChange={handleChange}
              className="w-full border p-2 rounded text-sm"
            />
          </div>

          {/* Fecha subsanación rechazo */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700">
              Fecha Subsanación Rechazo
            </label>

            <input
              type="date"
              name="fechaSubsanacionRechazo"
              value={formData.fechaSubsanacionRechazo || ''}
              onChange={handleChange}
              className="w-full border p-2 rounded text-sm"
            />
          </div>

          {/* Fecha traspaso aprobado */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700">
              Fecha Traspaso Aprobado
            </label>

            <input
              type="date"
              name="fechaTraspasoAprobado"
              value={formData.fechaTraspasoAprobado || ''}
              onChange={handleChange}
              className="w-full border p-2 rounded text-sm"
            />
          </div>

          {/* Fecha cierre traspaso Bizagi */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700">
              Fecha Cierre Traspaso Bizagi
            </label>

            <input
              type="date"
              name="fechaCierreTraspasoBizagi"
              value={formData.fechaCierreTraspasoBizagi || ''}
              onChange={handleChange}
              className="w-full border p-2 rounded text-sm"
            />
          </div>

          {/* Ubicación tarjeta */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700">
              Ubicación Tarjeta
            </label>

            <input
              name="ubicacionTarjeta"
              value={formData.ubicacionTarjeta || ''}
              onChange={handleChange}
              className="w-full border p-2 rounded text-sm"
            />
          </div>

          {/* Corresponsal / tramitador */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700">
              Corresponsal / Tramitador
            </label>

            <input
              name="nombreCorresponsalTramitador"
              value={formData.nombreCorresponsalTramitador || ''}
              onChange={handleChange}
              className="w-full border p-2 rounded text-sm"
            />
          </div>

          {/* Fecha entrega datos envío */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700">
              Fecha Entrega Datos Envío
            </label>

            <input
              type="date"
              name="fechaEntregaDatosEnvio"
              value={formData.fechaEntregaDatosEnvio || ''}
              onChange={handleChange}
              className="w-full border p-2 rounded text-sm"
            />
          </div>

          {/* Fecha programación entrega TP */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700">
              Fecha Programación Entrega TP
            </label>

            <input
              type="date"
              name="fechaProgramacionEntregaTp"
              value={formData.fechaProgramacionEntregaTp || ''}
              onChange={handleChange}
              className="w-full border p-2 rounded text-sm"
            />
          </div>

          {/* Fecha entrega TP locatario */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700">
              Fecha Entrega TP Locatario
            </label>

            <input
              type="date"
              name="fechaEntregaTpLocatario"
              value={formData.fechaEntregaTpLocatario || ''}
              onChange={handleChange}
              className="w-full border p-2 rounded text-sm"
            />
          </div>

        </div>
      )}
    </>
  );
}