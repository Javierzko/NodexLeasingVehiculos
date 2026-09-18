// src/components/CampoDetallesCaso/SeccionTiemposKPI2.tsx

'use client';

import React from 'react';
import { useCalculos2Caso } from '@/hooks/useCalculos2Caso';
import { Clock, RefreshCw, AlertCircle, UserCheck } from 'lucide-react';

interface SeccionTiemposKPI2Props {
  casoId: number;
  placa?: string;
  estadoContrato?: string;
  categoria?: string;
  etapa?: string;
  subetapa?: string;
  observacionesGestion?: string | null;
  ultimoComentario?: string | null;
  observacionesGp?: string | null;
  observacionesGeneral?: string | null;
}

const texto = (valor: unknown, alt = '—') => (valor === null || valor === undefined || valor === '' ? alt : String(valor));
const formatoDias = (valor: number | null | undefined) => (valor !== null && valor !== undefined ? `${valor} días` : '—');

export const SeccionTiemposKPI2: React.FC<SeccionTiemposKPI2Props> = ({
  casoId,
  placa,
  estadoContrato,
  categoria,
  etapa,
  subetapa,
  observacionesGestion,
  ultimoComentario,
  observacionesGp,
  observacionesGeneral,
}) => {
  const { indicadores, cargando, error, recargar } = useCalculos2Caso(casoId);

  if (cargando) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-slate-100 bg-slate-50/50 p-8 text-xs text-slate-500">
        <RefreshCw className="mr-2 h-4 w-4 animate-spin text-slate-400" />
        Calculando tiempos de proceso y causa de atraso...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-between rounded-lg border border-red-100 bg-red-50/50 p-4 text-xs text-red-600">
        <span>No se pudieron obtener los tiempos KPI: {error}</span>
        <button type="button" onClick={recargar} className="font-semibold underline hover:text-red-800">
          Reintentar
        </button>
      </div>
    );
  }

  if (!indicadores) return null;

  const notas = [
    ['Observaciones de gestión', observacionesGestion],
    ['Último comentario', ultimoComentario],
    ['Observaciones GP', observacionesGp],
    ['Observaciones generales', observacionesGeneral],
  ].filter(([, contenido]) => contenido);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* BLOQUE 1: TIEMPOS TRANSCURRIDOS CALCULADOS */}
        <div className="rounded-lg border border-slate-100 bg-slate-50/30 p-4">
          <h3 className="mb-3 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <Clock className="h-3.5 w-3.5 text-slate-500" />
            Tiempos Transcurridos (Calculados V2)
          </h3>

          <div className="divide-y divide-slate-100 text-xs">
            <ItemKPI etiqueta="Tiempo total del proceso" valor={formatoDias(indicadores.tiempoTotalProceso)} destacado />
            <ItemKPI etiqueta="Tiempo locatario" valor={formatoDias(indicadores.tiempoLocatario)} />
            <ItemKPI etiqueta="Entidades externas" valor={formatoDias(indicadores.entidadesExternas)} />
            <ItemKPI etiqueta="Banco (con suspensión)" valor={formatoDias(indicadores.bancoConSuspension)} />
            <ItemKPI etiqueta="Jurídico externo" valor={formatoDias(indicadores.juridicoExterno)} />
            <ItemKPI etiqueta="Jurídico interno" valor={formatoDias(indicadores.juridicoInterno)} />
            <ItemKPI etiqueta="Bloque jurídico total" valor={formatoDias(indicadores.bloqueJuridicoTotal)} destacado />
            <ItemKPI etiqueta="Tiempo tránsito" valor={formatoDias(indicadores.tiempoTransito)} />
            <ItemKPI etiqueta="Operativo analista" valor={formatoDias(indicadores.operativoAnalista)} destacado />
          </div>
        </div>

        {/* BLOQUE 2: INFORMACIÓN ADICIONAL Y ANALISTA */}
        <div className="rounded-lg border border-slate-100 bg-slate-50/30 p-4">
          <h3 className="mb-3 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <UserCheck className="h-3.5 w-3.5 text-emerald-600" />
            Diagnóstico y Responsable
          </h3>

          <div className="divide-y divide-slate-100 text-xs">
            <ItemKPI etiqueta="Analista asignado (calculado)" valor={texto(indicadores.analistaCalculado)} destacado />
            <ItemKPI etiqueta="Causa del atraso" valor={texto(indicadores.causaAtraso)} esAlerta={Boolean(indicadores.causaAtraso)} destacado />
            <ItemKPI etiqueta="Vehículo" valor={texto(placa)} />
            <ItemKPI etiqueta="Estado contrato" valor={texto(estadoContrato)} />
            <ItemKPI etiqueta="Categoría" valor={texto(categoria)} />
            <ItemKPI etiqueta="Etapa" valor={texto(etapa)} />
            <ItemKPI etiqueta="Subetapa" valor={texto(subetapa)} />
          </div>
        </div>
      </div>

      {/* BLOQUE DE NOTAS */}
      {notas.length > 0 && (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {notas.map(([titulo, contenido]) => (
            <div key={titulo} className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-xs">
              <p className="font-semibold text-slate-700">{titulo}</p>
              <p className="mt-1 whitespace-pre-wrap text-slate-600">{contenido}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ItemKPI = ({
  etiqueta,
  valor,
  destacado = false,
  esAlerta = false,
}: {
  etiqueta: string;
  valor: string;
  destacado?: boolean;
  esAlerta?: boolean;
}) => (
  <div className="flex items-center justify-between gap-3 py-2">
    <span className="shrink-0 font-medium text-slate-500">{etiqueta}</span>
    <span
      className={`text-right ${
        esAlerta
          ? 'font-bold text-amber-600'
          : destacado
          ? 'font-bold text-slate-900'
          : 'font-semibold text-slate-800'
      }`}
    >
      {valor}
    </span>
  </div>
);