//raiz hooks/useBusquedaInteligente.ts

import { useQuery } from '@tanstack/react-query';
import {
  leasingApi,
  TipoBusquedaGestion,
  BuscarCasoGestionResponse,
} from '@/services/leasingApi';

export type TipoBusqueda = TipoBusquedaGestion;

export const useBusquedaInteligente = (
  tipo: TipoBusqueda,
  query: string
) => {
  return useQuery<BuscarCasoGestionResponse>({
    queryKey: ['busqueda-inteligente', tipo, query],
    queryFn: () => leasingApi.buscarCasosGestion(tipo, query),
    enabled: !!query.trim(),
  });
};