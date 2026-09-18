// hooks/useGestion.ts

import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { apiClient } from '@/api/client'; 
import { Caso } from '../types/leasing';

// ==========================================
// TIPOS
// ==========================================

export interface CrearGestionInput {
  casoId: number | string;
  tipoObservacion: string;
  comentario: string;
  fechaProximaGestion?: string | null;
  analistaResponsable?: string | null;
}

export interface GestionCaso {
  id: number;
  casoId: number;
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
      try {
        const payload = {
          ...datos,
          casoId: Number(datos.casoId),
        };

        console.log('===[ HOOK CREAR GESTIÓN ]=== Enviando datos:', payload);

        const response = await apiClient.post<GestionCaso>(
          '/gestion',
          payload
        );
        return response.data;
      } catch (error: any) {
        const mensaje =
          error?.response?.data?.message || 'Error al crear la gestión';
        throw new Error(Array.isArray(mensaje) ? mensaje.join(', ') : mensaje);
      }
    },

    onSuccess: (_, variables) => {
      const idNumerico = Number(variables.casoId);

      // 1. Actualiza el historial de gestiones
      queryClient.invalidateQueries({
        queryKey: ['historial-gestiones', idNumerico],
      });
      queryClient.invalidateQueries({
        queryKey: ['historial-gestiones', String(variables.casoId)],
      });

      // 2. Actualiza la lista general de casos y tarjetas de métricas
      queryClient.invalidateQueries({
        queryKey: ['casos'],
      });

      // 3. Actualiza el caso individual
      queryClient.invalidateQueries({
        queryKey: ['caso', idNumerico],
      });
      queryClient.invalidateQueries({
        queryKey: ['caso', 'id', idNumerico],
      });

      // 4. Invalida búsquedas de gestión activas
      queryClient.invalidateQueries({
        queryKey: ['buscar-casos-gestion'],
      });

      // 5. Invalida los cálculos del caso
      queryClient.invalidateQueries({
        queryKey: ['calculos', idNumerico],
      });
    },
  });
};

// ==========================================
// OBTENER HISTORIAL DE GESTIONES
// ==========================================

export const useHistorialGestiones = (
  casoId: number | string | null
) => {
  const idNumerico = casoId ? Number(casoId) : null;

  return useQuery<GestionCaso[]>({
    queryKey: [
      'historial-gestiones',
      idNumerico,
    ],

    queryFn: async () => {
      try {
        const response = await apiClient.get<GestionCaso[]>(
          `/gestion/${encodeURIComponent(Number(idNumerico))}/gestiones`
        );
        return response.data;
      } catch (error: any) {
        const mensaje =
          error?.response?.data?.message ||
          'Error al obtener el historial de gestiones';
        throw new Error(Array.isArray(mensaje) ? mensaje.join(', ') : mensaje);
      }
    },

    enabled: !!idNumerico && !isNaN(idNumerico),
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
      try {
        const response = await apiClient.get<ResultadoBusquedaGestion>(
          `/gestion/buscar?tipo=${encodeURIComponent(tipo)}&q=${encodeURIComponent(q)}`
        );
        return response.data;
      } catch (error: any) {
        const mensaje =
          error?.response?.data?.message ||
          'Error al buscar casos para gestión';
        throw new Error(Array.isArray(mensaje) ? mensaje.join(', ') : mensaje);
      }
    },

    enabled: !!tipo && !!q.trim(),
  });
};