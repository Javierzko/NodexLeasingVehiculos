//components/SeccionCamposANS.tsx


'use client';

import React from 'react';
import { useCalculosCaso } from '@/hooks/useCalculosCaso';
import { Clock, AlertTriangle, CheckCircle2, RefreshCw } from 'lucide-react';

interface SeccionCamposANSProps {
  casoId: number;
}

export const SeccionCamposANS: React.FC<SeccionCamposANSProps> = ({ casoId }) => {
  const { calculos, cargando, error, recargarCalculos } = useCalculosCaso(casoId);

  if (cargando) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-slate-100 bg-slate-50/50 p-8 text-xs text-slate-500">
        <RefreshCw className="mr-2 h-4 w-4 animate-spin text-slate-400" />
        Calculando indicadores y alertas ANS...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-between rounded-lg border border-red-100 bg-red-50/50 p-4 text-xs text-red-600">
        <span>No se pudieron cargar los campos ANS: {error}</span>
        <button
          type="button"
          onClick={recargarCalculos}
          className="font-semibold underline hover:text-red-800"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (!calculos) return null;

  const esAlerta = (texto: string) =>
    texto.includes('⚠️') ||
    texto.includes('🚨') ||
    texto.includes('Vencido') ||
    texto.includes('por enviar') ||
    texto.includes('REACTIVAR');

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* BLOQUE 1: ALERTAS Y SEGUIMIENTO */}
        <div className="rounded-lg border border-slate-100 bg-slate-50/30 p-4">
          <h3 className="mb-3 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
            Alertas de Notificación y Gestión
          </h3>

          <div className="divide-y divide-slate-100 text-xs">
            <ItemANS etiqueta="Notificación inicial" valor={calculos.alertaCorreoNotificacionInicial} esAlerta={esAlerta(calculos.alertaCorreoNotificacionInicial)} />
            <ItemANS etiqueta="Notificación locatario" valor={calculos.alertaNotificacionLocatario} esAlerta={esAlerta(calculos.alertaNotificacionLocatario)} />
            <ItemANS etiqueta="Actualización base" valor={calculos.alertaActualizacionBase} esAlerta={esAlerta(calculos.alertaActualizacionBase)} />
            <ItemANS etiqueta="Reactivación caso" valor={calculos.alertaReactivacionCaso} esAlerta={esAlerta(calculos.alertaReactivacionCaso)} />
          </div>
        </div>

        {/* BLOQUE 2: TIEMPOS DE SANEAMIENTO */}
        <div className="rounded-lg border border-slate-100 bg-slate-50/30 p-4">
          <h3 className="mb-3 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <Clock className="h-3.5 w-3.5 text-slate-500" />
            Tiempos y Saneamiento Jurídico
          </h3>

          <div className="divide-y divide-slate-100 text-xs">
            <ItemANS etiqueta="Días desde último comentario" valor={calculos.diasDesdeUltimoComentario !== null ? `${calculos.diasDesdeUltimoComentario} días` : '—'} />
            <ItemANS etiqueta="Días respuesta DP" valor={calculos.diasDp !== null ? `${calculos.diasDp} días` : '—'} />
            <ItemANS etiqueta="Alerta respuesta DP" valor={calculos.alertaRespuestaDp} esAlerta={esAlerta(calculos.alertaRespuestaDp)} />
            <ItemANS etiqueta="Días respuesta tutela" valor={calculos.diasRespuestaTutela !== null ? `${calculos.diasRespuestaTutela} días` : '—'} />
            <ItemANS etiqueta="Alerta respuesta tutela" valor={calculos.alertaRespuestaTutela} esAlerta={esAlerta(calculos.alertaRespuestaTutela)} />
            <ItemANS etiqueta="Días suspensión caso" valor={calculos.diasSuspensionCaso !== null ? `${calculos.diasSuspensionCaso} días` : '—'} />
          </div>
        </div>

        {/* BLOQUE 3: CÓMPUTO ANS */}
        <div className="rounded-lg border border-slate-100 bg-slate-50/30 p-4">
          <h3 className="mb-3 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            Indicadores ANS y Tiempos Totales
          </h3>

          <div className="divide-y divide-slate-100 text-xs">
            <ItemANS etiqueta="Tiempo total del proceso" valor={calculos.tiempoTotalProceso !== null ? `${calculos.tiempoTotalProceso} días` : '—'} destacado />
            <ItemANS etiqueta="Bloque jurídico total" valor={`${calculos.bloqueJuridicoTotal} días`} destacado />
            <ItemANS etiqueta="Alerta ANS completa" valor={calculos.alertaAnsCompleta} esAlerta={esAlerta(calculos.alertaAnsCompleta)} destacado />
            <ItemANS etiqueta="ANS GPA" valor={calculos.ansGpa} esAlerta={esAlerta(calculos.ansGpa)} destacado />
            <ItemANS etiqueta="Vencimiento ANS" valor={calculos.estadoVencimientoAns} esAlerta={esAlerta(calculos.estadoVencimientoAns)} destacado />
          </div>
        </div>
      </div>
    </div>
  );
};

const ItemANS = ({
  etiqueta,
  valor,
  esAlerta = false,
  destacado = false,
}: {
  etiqueta: string;
  valor: string;
  esAlerta?: boolean;
  destacado?: boolean;
}) => (
  <div className="flex items-center justify-between gap-3 py-2">
    <span className="shrink-0 font-medium text-slate-500">{etiqueta}</span>
    <span
      className={`text-right font-semibold ${
        esAlerta
          ? 'font-bold text-red-600'
          : destacado
          ? 'font-bold text-slate-900'
          : 'text-slate-800'
      }`}
    >
      {valor || '—'}
    </span>
  </div>
);