import { apiClient } from "@/api/client"; 
import { Caso, Estado } from '@/types/leasing';

export interface CambiarEstadosMasivoInput {
  casoIds: number[];
  estadoId?: number;
  categoriaId?: number;
  etapaId?: number;
  subetapaId?: number;
}

export interface CambiarEstadosMasivoResponse {
  mensaje: string;
  cantidadActualizados?: number;
  casosActualizados?: Caso[];
}

export const gestionMasivaApi = {
  getEstados: async (): Promise<Estado[]> => {
    try {
      const response = await apiClient.get<Estado[]>('/estados');
      return Array.isArray(response.data) ? response.data : [];
    } catch (error: any) {
      const mensaje = error?.response?.data?.message || 'Error al obtener los catálogos';
      throw new Error(mensaje);
    }
  },

  cambiarEstadosMasivo: async (
    datos: CambiarEstadosMasivoInput,
  ): Promise<CambiarEstadosMasivoResponse> => {
    try {
      const response = await apiClient.patch<CambiarEstadosMasivoResponse>(
        '/gestion-masiva/estado',
        datos
      );
      return response.data;
    } catch (error: any) {
      const mensaje = error?.response?.data?.message || 'Error al actualizar los casos';
      throw new Error(mensaje);
    }
  },
};