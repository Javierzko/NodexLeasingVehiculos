// hooks/useLeasing.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leasingApi } from '../services/leasingApi';
import {
  Caso,
  Locatario,
  Vehiculo,
  Propietario,
  CrearCasoInput,
  ProcesoJuridicoInput,
  AuditoriaMultaInput,
} from '../types/leasing';

// ==========================================
// --- QUERIES (CONSULTAS) ---
// ==========================================

// 1. Obtener todos los casos
export const useCasos = () => {
  return useQuery({
    queryKey: ['casos'],
    queryFn: () => leasingApi.getCasos(),
  });
};

// 2. Obtener un caso por ID
export const useCasoById = (id: number) => {
  return useQuery({
    queryKey: ['caso', 'id', id],
    queryFn: () => leasingApi.getCasoById(id),
    enabled: !!id,
  });
};

// 3. Buscar un caso por Número de Contrato
export const useCasoByContrato = (numeroContrato: string) => {
  return useQuery({
    queryKey: ['caso', 'contrato', numeroContrato],
    queryFn: () => leasingApi.getCasoByContrato(numeroContrato),
    enabled: !!numeroContrato,
  });
};

// 4. Obtener todos los locatarios
export const useLocatarios = () => {
  return useQuery({
    queryKey: ['locatarios'],
    queryFn: () => leasingApi.getLocatarios(),
  });
};

// 5. Buscar locatario por NIT / Identificación
export const useLocatarioByIdentificacion = (nit: string) => {
  return useQuery({
    queryKey: ['locatario', nit],
    queryFn: () => leasingApi.getLocatarioByIdentificacion(nit),
    enabled: !!nit,
  });
};

// 6. Obtener todos los vehículos
export const useVehiculos = () => {
  return useQuery({
    queryKey: ['vehiculos'],
    queryFn: () => leasingApi.getVehiculos(),
  });
};

// 7. Buscar vehículo por Placa
export const useVehiculoByPlaca = (placa: string) => {
  return useQuery({
    queryKey: ['vehiculo', placa],
    queryFn: () => leasingApi.getVehiculoByPlaca(placa),
    enabled: !!placa,
  });
};

// 8. Obtener todos los propietarios
export const usePropietarios = () => {
  return useQuery({
    queryKey: ['propietarios'],
    queryFn: () => leasingApi.getPropietarios(),
  });
};

// ==========================================
// --- MUTATIONS (CREACIONES Y EDICIONES) ---
// ==========================================

// 9. Crear nuevo Caso de Leasing
export const useCreateCaso = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (datos: CrearCasoInput) =>
      leasingApi.createCaso(datos),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['casos'],
      });
    },
  });
};

// 10. Actualizar Caso de Leasing por ID
export const useUpdateCaso = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      datos,
    }: {
      id: number;
      datos: Partial<CrearCasoInput>;
    }) => leasingApi.updateCaso(id, datos),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['casos'],
      });

      queryClient.invalidateQueries({
        queryKey: ['caso', 'id', variables.id],
      });
    },
  });
};

// 11. Crear Locatario
export const useCreateLocatario = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (datos: Partial<Locatario>) =>
      leasingApi.createLocatario(datos),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['locatarios'],
      });
    },
  });
};

// 12. Crear Vehículo
export const useCreateVehiculo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (datos: Partial<Vehiculo>) =>
      leasingApi.createVehiculo(datos),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['vehiculos'],
      });
    },
  });
};

// 13. Crear Propietario
export const useCreatePropietario = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (datos: Partial<Propietario>) =>
      leasingApi.createPropietario(datos),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['propietarios'],
      });
    },
  });
};

// 14. Actualizar Proceso Jurídico
export const useUpdateProcesoJuridico = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      casoId,
      datos,
    }: {
      casoId: number;
      datos: ProcesoJuridicoInput;
    }) => leasingApi.updateProcesoJuridico(casoId, datos),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['casos'],
      });

      queryClient.invalidateQueries({
        queryKey: ['caso', 'id', variables.casoId],
      });
    },
  });
};

// 15. Actualizar Auditoría de Multas
export const useUpdateAuditoriaMulta = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      casoId,
      datos,
    }: {
      casoId: number;
      datos: AuditoriaMultaInput;
    }) => leasingApi.updateAuditoriaMulta(casoId, datos),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['casos'],
      });

      queryClient.invalidateQueries({
        queryKey: ['caso', 'id', variables.casoId],
      });
    },
  });
};