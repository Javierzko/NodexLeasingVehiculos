// hooks/usePortalConsulta.ts
// ================================
import { useMutation } from '@tanstack/react-query';
import {
  portalConsultaApi,
  PortalConsultaInput,
} from '@/services/portalConsultaApi';

export const usePortalConsulta = () => {
  return useMutation({
    mutationFn: (datos: PortalConsultaInput) =>
      portalConsultaApi.consultarSeguimiento(datos),
  });
};
