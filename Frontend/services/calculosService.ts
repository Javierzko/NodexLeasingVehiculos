// src/services/calculosService.ts

import { apiClient } from '@/api/client';
import { RespuestaCalculosAPI } from '@/types/calculos';

export const calculosService = {
  /**
   * Obtiene los cálculos e indicadores de un caso usando la instancia de apiClient
   */
  async obtenerCalculosCaso(casoId: number): Promise<RespuestaCalculosAPI> {
    try {
      const res = await apiClient.get<RespuestaCalculosAPI>(
        `/calculos/${encodeURIComponent(casoId)}`
      );
      return res.data;
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Error al obtener los cálculos del caso';
      throw new Error(msg);
    }
  },
};