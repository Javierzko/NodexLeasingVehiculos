//raiz components/Modal/CasoFormSections.tsx

'use client';

import React from 'react';
import { CrearCasoInput } from '@/types/leasing';
import { TabId } from '@/hooks/useCrearCasoForm';
import { CasoFormTabsBasic } from '@/components/Modal/CasoFormTabsBasic';

export {
  LocatarioSection,
  VehiculoSection,
  CasoFormTabsNav,
} from '@/components/Modal/CasoFormEntitySections';

type ChangeHandler = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
) => void;

function CasoFormTabsAdvanced({
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
      {activeTab === 'facturacion' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700">
              Honorarios ($)
            </label>
            <input
              type="number"
              name="honorarios"
              value={formData.honorarios ?? ''}
              onChange={handleChange}
              className="w-full border p-2 rounded text-sm"
            />
          </div>

          <div className="flex items-center gap-2 mt-4">
            <input
              type="checkbox"
              name="facturado"
              checked={formData.facturado || false}
              onChange={handleChange}
            />
            <label className="text-sm font-medium text-slate-700">
              Facturado
            </label>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700">
              No. Factura
            </label>
            <input
              name="numeroFactura"
              value={formData.numeroFactura || ''}
              onChange={handleChange}
              className="w-full border p-2 rounded text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700">
              Fecha Factura
            </label>
            <input
              type="date"
              name="fechaFactura"
              value={formData.fechaFactura || ''}
              onChange={handleChange}
              className="w-full border p-2 rounded text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700">
              Honorarios Jurídicos ($)
            </label>
            <input
              type="number"
              name="honorariosServiciosJuridicos"
              value={formData.honorariosServiciosJuridicos ?? ''}
              onChange={handleChange}
              className="w-full border p-2 rounded text-sm"
            />
          </div>

          <div className="flex items-center gap-2 mt-4">
            <input
              type="checkbox"
              name="facturadoJuridico"
              checked={formData.facturadoJuridico || false}
              onChange={handleChange}
            />
            <label className="text-sm font-medium text-slate-700">
              Facturado Jurídico
            </label>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700">
              No. Factura Jurídico
            </label>
            <input
              name="numeroFacturaJuridico"
              value={formData.numeroFacturaJuridico || ''}
              onChange={handleChange}
              className="w-full border p-2 rounded text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700">
              Fecha Factura Jurídico
            </label>
            <input
              type="date"
              name="fechaFacturaJuridico"
              value={formData.fechaFacturaJuridico || ''}
              onChange={handleChange}
              className="w-full border p-2 rounded text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700">
              Fórmula Traspasos GPA
            </label>
            <input
              name="formulaTraspasosGpa"
              value={formData.formulaTraspasosGpa || ''}
              onChange={handleChange}
              className="w-full border p-2 rounded text-sm"
            />
          </div>

          <div className="col-span-2 border-t pt-3 font-bold text-slate-700 text-sm">
            Medición de Tiempos (Días / KPIs)
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700">
              Tiempo Entidades Externas
            </label>
            <input
              type="number"
              step="0.1"
              name="tiempoEntidadesExternas"
              value={formData.tiempoEntidadesExternas ?? ''}
              onChange={handleChange}
              className="w-full border p-2 rounded text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700">
              Tiempo Banco
            </label>
            <input
              type="number"
              step="0.1"
              name="tiempoBanco"
              value={formData.tiempoBanco ?? ''}
              onChange={handleChange}
              className="w-full border p-2 rounded text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700">
              Tiempo Jurídico Externo
            </label>
            <input
              type="number"
              step="0.1"
              name="tiempoJuridicoExterno"
              value={formData.tiempoJuridicoExterno ?? ''}
              onChange={handleChange}
              className="w-full border p-2 rounded text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700">
              Tiempo Jurídico Interno
            </label>
            <input
              type="number"
              step="0.1"
              name="tiempoJuridicoInterno"
              value={formData.tiempoJuridicoInterno ?? ''}
              onChange={handleChange}
              className="w-full border p-2 rounded text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700">
              Tiempo Tránsito
            </label>
            <input
              type="number"
              step="0.1"
              name="tiempoTransito"
              value={formData.tiempoTransito ?? ''}
              onChange={handleChange}
              className="w-full border p-2 rounded text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700">
              Tiempo Operativo Analista
            </label>
            <input
              type="number"
              step="0.1"
              name="tiempoOperativoAnalista"
              value={formData.tiempoOperativoAnalista ?? ''}
              onChange={handleChange}
              className="w-full border p-2 rounded text-sm"
            />
          </div>

        </div>
      )}

      {activeTab === 'juridico' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700">
              Fecha Escalamiento Entidad Ex.
            </label>
            <input
              type="date"
              name="juridico.fechaEscalamientoEntidadEx"
              value={formData.procesoJuridico?.fechaEscalamientoEntidadEx || ''}
              onChange={handleChange}
              className="w-full border p-2 rounded text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700">
              Fecha Respuesta Entidad Ex.
            </label>
            <input
              type="date"
              name="juridico.fechaRespuestaEntidadEx"
              value={formData.procesoJuridico?.fechaRespuestaEntidadEx || ''}
              onChange={handleChange}
              className="w-full border p-2 rounded text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700">
              Fecha Liquidación Total Pasivos
            </label>
            <input
              type="date"
              name="juridico.fechaLiquidacionTotalPasivos"
              value={formData.procesoJuridico?.fechaLiquidacionTotalPasivos || ''}
              onChange={handleChange}
              className="w-full border p-2 rounded text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700">
              Fecha Solicitud Recursos
            </label>
            <input
              type="date"
              name="juridico.fechaSolicitudRecursos"
              value={formData.procesoJuridico?.fechaSolicitudRecursos || ''}
              onChange={handleChange}
              className="w-full border p-2 rounded text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700">
              Fecha Desembolso Recursos
            </label>
            <input
              type="date"
              name="juridico.fechaDesembolsoRecursos"
              value={formData.procesoJuridico?.fechaDesembolsoRecursos || ''}
              onChange={handleChange}
              className="w-full border p-2 rounded text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700">
              Fecha Fin Diagnóstico Pago Pasivos
            </label>
            <input
              type="date"
              name="juridico.fechaFinDiagnosticoPagoPasivos"
              value={formData.procesoJuridico?.fechaFinDiagnosticoPagoPasivos || ''}
              onChange={handleChange}
              className="w-full border p-2 rounded text-sm"
            />
          </div>


          <div>
            <label className="block text-xs font-bold uppercase text-slate-700">
              Fecha Solicitud Saneamiento Jurídico
            </label>
            <input
              type="date"
              name="juridico.fechaSolicitudSaneamientoJuridico"
              value={formData.procesoJuridico?.fechaSolicitudSaneamientoJuridico || ''}
              onChange={handleChange}
              className="w-full border p-2 rounded text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700">
              Fecha Fin Saneamiento Jurídico
            </label>
            <input
              type="date"
              name="juridico.fechaFinSaneamientoJuridico"
              value={formData.procesoJuridico?.fechaFinSaneamientoJuridico || ''}
              onChange={handleChange}
              className="w-full border p-2 rounded text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700">
              Fecha Radicación DP
            </label>
            <input
              type="date"
              name="juridico.fechaRadicacionDp"
              value={formData.procesoJuridico?.fechaRadicacionDp || ''}
              onChange={handleChange}
              className="w-full border p-2 rounded text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700">
              Fecha Respuesta DP
            </label>
            <input
              type="date"
              name="juridico.fechaRespuestaDp"
              value={formData.procesoJuridico?.fechaRespuestaDp || ''}
              onChange={handleChange}
              className="w-full border p-2 rounded text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700">
              Fecha Radicación Tutela
            </label>
            <input
              type="date"
              name="juridico.fechaRadicacionTutela"
              value={formData.procesoJuridico?.fechaRadicacionTutela || ''}
              onChange={handleChange}
              className="w-full border p-2 rounded text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700">
              Radicado Tutela
            </label>
            <input
              name="juridico.numeroRadicadoTutela"
              value={formData.procesoJuridico?.numeroRadicadoTutela || ''}
              onChange={handleChange}
              className="w-full border p-2 rounded text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700">
              Juzgado
            </label>
            <input
              name="juridico.juzgado"
              value={formData.procesoJuridico?.juzgado || ''}
              onChange={handleChange}
              className="w-full border p-2 rounded text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700">
              Fecha Sol. Docs Adicionales Traspaso
            </label>
            <input
              type="date"
              name="juridico.fechaSolicitudDocsAdicionalesTraspaso"
              value={formData.procesoJuridico?.fechaSolicitudDocsAdicionalesTraspaso || ''}
              onChange={handleChange}
              className="w-full border p-2 rounded text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700">
              Fecha Entrega Docs Adicionales Traspaso
            </label>
            <input
              type="date"
              name="juridico.fechaEntregaDocsAdicionalesTraspaso"
              value={formData.procesoJuridico?.fechaEntregaDocsAdicionalesTraspaso || ''}
              onChange={handleChange}
              className="w-full border p-2 rounded text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700">
              Fecha Fin Gestión Documental Traspaso
            </label>
            <input
              type="date"
              name="juridico.fechaFinGestionDocumentalTraspaso"
              value={formData.procesoJuridico?.fechaFinGestionDocumentalTraspaso || ''}
              onChange={handleChange}
              className="w-full border p-2 rounded text-sm"
            />
          </div>

        </div>
      )}

      {activeTab === 'multas' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700">
              Limitaciones Propiedad
            </label>
            <input
              name="multa.limitacionesPropiedad"
              value={formData.auditoriaMulta?.limitacionesPropiedad || ''}
              onChange={handleChange}
              className="w-full border p-2 rounded text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700">
              Tipo Limitaciones
            </label>
            <input
              name="multa.tipoLimitaciones"
              value={formData.auditoriaMulta?.tipoLimitaciones || ''}
              onChange={handleChange}
              className="w-full border p-2 rounded text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700">
              Garantías Mobiliarias
            </label>
            <input
              name="multa.garantiasMobiliarias"
              value={formData.auditoriaMulta?.garantiasMobiliarias || ''}
              onChange={handleChange}
              className="w-full border p-2 rounded text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700">
              Simit Multas Propietario / Resoluciones
            </label>
            <input
              name="multa.simitMultasPropietarioResoluciones"
              value={formData.auditoriaMulta?.simitMultasPropietarioResoluciones || ''}
              onChange={handleChange}
              className="w-full border p-2 rounded text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700">
              Simit Multas Locatario
            </label>
            <input
              name="multa.simitMultasLocatario"
              value={formData.auditoriaMulta?.simitMultasLocatario || ''}
              onChange={handleChange}
              className="w-full border p-2 rounded text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700">
              Multas Placa
            </label>
            <input
              name="multa.multasPlaca"
              value={formData.auditoriaMulta?.multasPlaca || ''}
              onChange={handleChange}
              className="w-full border p-2 rounded text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700">
              Impuestos
            </label>
            <input
              name="multa.impuestos"
              value={formData.auditoriaMulta?.impuestos || ''}
              onChange={handleChange}
              className="w-full border p-2 rounded text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700">
              Vigencias Adeudadas
            </label>
            <input
              name="multa.vigenciasAdeudadas"
              value={formData.auditoriaMulta?.vigenciasAdeudadas || ''}
              onChange={handleChange}
              className="w-full border p-2 rounded text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700">
              Impuestos Tránsito
            </label>
            <input
              name="multa.impuestosTransito"
              value={formData.auditoriaMulta?.impuestosTransito || ''}
              onChange={handleChange}
              className="w-full border p-2 rounded text-sm"
            />
          </div>

        </div>
      )}
    </>
  );
}

export function CasoFormTabsContent({
  activeTab,
  formData,
  handleChange,
}: {
  activeTab: TabId;
  formData: CrearCasoInput;
  handleChange: ChangeHandler;
}) {
  return (
    <div className="space-y-4">
      <CasoFormTabsBasic
        activeTab={activeTab}
        formData={formData}
        handleChange={handleChange}
      />

      <CasoFormTabsAdvanced
        activeTab={activeTab}
        formData={formData}
        handleChange={handleChange}
      />
    </div>
  );
}