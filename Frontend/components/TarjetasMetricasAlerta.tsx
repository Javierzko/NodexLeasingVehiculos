// raiz components/TarjetasMetricasAlertas

'use client';

import React from 'react';
import { Caso } from '@/types/leasing';

interface Props {
  casos: Caso[];
  casosFiltradosCount: number;
}

export const TarjetasMetricasAlerta: React.FC<Props> = ({ casos, casosFiltradosCount }) => {
  // =========================================================================
  // 1. EXTRAER ALERTA DESDE BACKEND CON LOGS DE INSPECCIÓN
  // =========================================================================
  const obtenerAlertaBackend = (caso: Caso): string => {
    const alerta = caso.camposCalculados?.alertaActualizacionBase as unknown;

    // 🔍 LOG 3: INSPECCIÓN DE DATOS RECIBIDOS DESDE LA API EN EL FRONTEND
    //console.log(`===[ FRONTEND TARJETAS ]=== Caso ID: ${caso.id} | Contrato: ${caso.numeroContrato} | Alerta en camposCalculados:`, alerta);

    if (typeof alerta === 'string') {
      return alerta.trim();
    }

    return '';
  };

  // =========================================================================
  // 2. FILTRADO Y CONTEOS DE TARJETAS
  // =========================================================================
  const conteoVencidos = casos.filter(
    (c) => obtenerAlertaBackend(c) === 'Seguimiento Vencido'
  ).length;

  const conteoVenceHoy = casos.filter(
    (c) => obtenerAlertaBackend(c) === 'Seguimiento Vence Hoy'
  ).length;

  const conteoProximoVencer = casos.filter(
    (c) => obtenerAlertaBackend(c) === 'Seguimiento Próximo a vencer'
  ).length;

  const conteoAlDia = casos.filter(
    (c) => obtenerAlertaBackend(c) === 'Seguimiento al día'
  ).length;

  const conteoSinAlerta = casos.filter(
    (c) => obtenerAlertaBackend(c) === ''
  ).length;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
      {/* TOTAL EXPEDIENTES */}
      <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 shadow-xs transition-all hover:border-slate-300 hover:shadow-md">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Total expedientes
        </p>
        <p className="mt-1 text-2xl font-extrabold text-slate-900">
          {casos.length}
        </p>
        <p className="mt-1 text-[10px] font-medium text-slate-500">
          {casosFiltradosCount} en vista actual
        </p>
      </div>

      {/* SEGUIMIENTO VENCIDO */}
      <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 shadow-xs transition-all hover:border-slate-300 hover:shadow-md">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Seguimiento Vencido
        </p>
        <p className="mt-1 text-2xl font-extrabold text-slate-900">
          {conteoVencidos}
        </p>
        <p className="mt-1 text-[10px] font-medium text-slate-500">
          Requiere acción urgente
        </p>
      </div>

      {/* VENCE HOY */}
      <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 shadow-xs transition-all hover:border-slate-300 hover:shadow-md">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Vence Hoy
        </p>
        <p className="mt-1 text-2xl font-extrabold text-slate-900">
          {conteoVenceHoy}
        </p>
        <p className="mt-1 text-[10px] font-medium text-slate-500">
          Atención prioritaria
        </p>
      </div>

      {/* PRÓXIMO A VENCER */}
      <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 shadow-xs transition-all hover:border-slate-300 hover:shadow-md">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Próximo a Vencer
        </p>
        <p className="mt-1 text-2xl font-extrabold text-slate-900">
          {conteoProximoVencer}
        </p>
        <p className="mt-1 text-[10px] font-medium text-slate-500">
          En los próximos 3 días
        </p>
      </div>

      {/* SEGUIMIENTO AL DÍA */}
      <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 shadow-xs transition-all hover:border-slate-300 hover:shadow-md">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Seguimiento al Día
        </p>
        <p className="mt-1 text-2xl font-extrabold text-slate-900">
          {conteoAlDia}
        </p>
        <p className="mt-1 text-[10px] font-medium text-slate-500">
          Sin novedades pendientes
        </p>
      </div>

      {/* SIN ALERTA */}
      <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 shadow-xs transition-all hover:border-slate-300 hover:shadow-md">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Sin Alerta
        </p>
        <p className="mt-1 text-2xl font-extrabold text-slate-900">
          {conteoSinAlerta}
        </p>
        <p className="mt-1 text-[10px] font-medium text-slate-500">
          No aplica alerta
        </p>
      </div>
    </div>
  );
};