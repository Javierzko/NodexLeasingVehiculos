import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  gestionMasivaApi,
  CambiarEstadosMasivoInput,
} from '@/services/gestionMasivaApi';
import { Estado } from '@/types/leasing';

export const useEstadosGestionMasiva = () =>
  useQuery<Estado[]>({
    queryKey: ['gestion-masiva', 'catalogos'],
    queryFn: gestionMasivaApi.getEstados,
  });

export const useCambiarEstadosMasivo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (datos: CambiarEstadosMasivoInput) =>
      gestionMasivaApi.cambiarEstadosMasivo(datos),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['casos'] });
    },
  });
};
