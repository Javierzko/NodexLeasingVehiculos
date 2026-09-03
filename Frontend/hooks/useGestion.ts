// raiz hooks/useGestion.ts

import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { Caso } from '../types/leasing';

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || 'http://10.0.4.4:5001'
).replace(/\/$/, '');

// ==========================================
// TIPOS
// ==========================================

export interface CrearGestionInput {
  casoId: string;
  tipoObservacion: string;
  comentario: string;
  fechaProximaGestion?: string | null;
  analistaResponsable?: string | null;
}

export interface GestionCaso {
  id: string;
  casoId: string;
  tipoObservacion: string;
  comentario: string;
  fechaGestion: string;
  fechaProximaGestion: string | null;
  analistaResponsable: string | null;
  createdAt: string;
  updatedAt: string;
}

export type TipoBusquedaGestion =
  | 'contrato'
  | 'placa'
  | 'nit';

export interface ResultadoBusquedaGestion {
  tipo: TipoBusquedaGestion;
  busqueda: string;
  encontrado: boolean;
  data: Caso[];
}

// ==========================================
// CREAR GESTIÓN
// ==========================================

export const useCrearGestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      datos: CrearGestionInput
    ): Promise<GestionCaso> => {
      const response = await fetch(
        `${API_BASE_URL}/gestion`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(datos),
        }
      );

      if (!response.ok) {
        const error = await response.text();

        throw new Error(
          error || 'Error al crear la gestión'
        );
      }

      return response.json();
    },

onSuccess: (_, variables) => {
  // Actualiza el historial de gestiones
  queryClient.invalidateQueries({
    queryKey: [
      'historial-gestiones',
      variables.casoId,
    ],
  });

  // Actualiza la lista general de casos
  queryClient.invalidateQueries({
    queryKey: ['casos'],
  });

  // Actualiza el caso individual con fechaUltimaGestion
  queryClient.invalidateQueries({
    queryKey: [
      'caso',
      'id',
      variables.casoId,
    ],
  });
},

  });
};

// ==========================================
// OBTENER HISTORIAL DE GESTIONES
// ==========================================

export const useHistorialGestiones = (
  casoId: string
) => {
  return useQuery<GestionCaso[]>({
    queryKey: [
      'historial-gestiones',
      casoId,
    ],

    queryFn: async () => {
      const response = await fetch(
        `${API_BASE_URL}/gestion/${encodeURIComponent(
          casoId
        )}/gestiones`
      );

      if (!response.ok) {
        throw new Error(
          'Error al obtener el historial de gestiones'
        );
      }

      return response.json();
    },

    enabled: !!casoId,
  });
};

// ==========================================
// BUSCAR CASOS PARA GESTIÓN
// ==========================================

export const useBuscarCasosGestion = (
  tipo: TipoBusquedaGestion,
  q: string
) => {
  return useQuery<ResultadoBusquedaGestion>({
    queryKey: [
      'buscar-casos-gestion',
      tipo,
      q,
    ],

    queryFn: async () => {
      const response = await fetch(
        `${API_BASE_URL}/gestion/buscar?tipo=${encodeURIComponent(
          tipo
        )}&q=${encodeURIComponent(q)}`
      );

      if (!response.ok) {
        const error = await response.text();

        throw new Error(
          error ||
            'Error al buscar casos para gestión'
        );
      }

      return response.json();
    },

    enabled: !!tipo && !!q.trim(),
  });
};