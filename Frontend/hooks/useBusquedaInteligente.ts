//raiz hooks/useBusquedaInteligente.ts

import { leasingApi } from '../services/leasingApi';
import { useQuery } from '@tanstack/react-query';
import {TipoBusquedaGestion,BuscarCasoGestionResponse,} from '../types/leasing';

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