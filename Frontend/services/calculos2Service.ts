// src/services/calculos2Service.ts

import { apiClient } from '@/api/client';

export interface IndicadoresCalculos2 {
  analistaCalculado: string;
  tiempoTotalProceso: number | null;
  tiempoLocatario: number;
  entidadesExternas: number;
  bancoConSuspension: number;
  juridicoExterno: number;
  juridicoInterno: number;
  bloqueJuridicoTotal: number;
  tiempoTransito: number;
  operativoAnalista: number | null;
  causaAtraso: string;
}

export interface RespuestaCalculos2 {
  casoId: number;
  indicadores: IndicadoresCalculos2;
}

export const calculos2Service = {
  /**
   * Obtiene los indicadores y tiempos calculados v2 de un expediente
   */
  async obtenerCalculos2(casoId: number): Promise<RespuestaCalculos2> {
    try {
      const res = await apiClient.get<RespuestaCalculos2>(`/calculos2/${encodeURIComponent(casoId)}`);
      return res.data;
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Error al obtener los cálculos de tiempos v2';
      throw new Error(msg);
    }
  },
};