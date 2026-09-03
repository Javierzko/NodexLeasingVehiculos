import { Caso, Estado } from '@/types/leasing';

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || 'http://10.0.4.4:5001'
).replace(/\/$/, '');

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
    const response = await fetch(`${API_BASE_URL}/estados`);

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Error al obtener los catálogos');
    }

    const data: unknown = await response.json();

    return Array.isArray(data) ? (data as Estado[]) : [];
  },

  cambiarEstadosMasivo: async (
    datos: CambiarEstadosMasivoInput,
  ): Promise<CambiarEstadosMasivoResponse> => {
    const response = await fetch(`${API_BASE_URL}/gestion-masiva/estado`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Error al actualizar los casos');
    }

    return response.json();
  },
};
