//raiz services/leasingApi.ts


import { apiClient } from '@/api/client';
import {
  Caso,
  Locatario,
  Vehiculo,
  Propietario,
  ProcesoJuridico,
  AuditoriaMulta,
  CrearCasoInput,
  ProcesoJuridicoInput,
  AuditoriaMultaInput,
  TipoBusquedaGestion,
  BuscarCasoGestionResponse,
  CrearGestionInput,
  GestionCaso,
} from '@/types/leasing';

function handleAxiosError(
  error: any,
  defaultErrorMessage: string,
  options?: { silentStatuses?: number[] }
): never {
  const status = error?.response?.status;
  const data = error?.response?.data;

  if (status && !options?.silentStatuses?.includes(status)) {
    console.error('API Error:', { status, data });
  }

  let errorMsg = defaultErrorMessage;

  if (data?.message) {
    errorMsg = Array.isArray(data.message)
      ? data.message.join(', ')
      : data.message;
  } else if (data?.error) {
    errorMsg = data.error;
  }

  throw new Error(`${errorMsg}${status ? ` (HTTP ${status})` : ''}`);
}

function sanitizePayload<T>(datos: T): T {
  if (datos === null || datos === undefined) {
    return datos;
  }

  if (Array.isArray(datos)) {
    return datos.map(sanitizePayload) as unknown as T;
  }

  if (typeof datos === 'object') {
    const limpio: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(
      datos as Record<string, unknown>
    )) {
      if (value && typeof value === 'object') {
        limpio[key] = sanitizePayload(value);
      } else {
        limpio[key] = value === '' ? undefined : value;
      }
    }

    return limpio as T;
  }

  return datos;
}

export const leasingApi = {
  // ===================================================
  // LOCATARIOS
  // ===================================================

  getLocatarios: async (): Promise<Locatario[]> => {
    try {
      const res = await apiClient.get<Locatario[]>('/locatarios');
      return res.data;
    } catch (error) {
      return handleAxiosError(
        error,
        'Error al obtener la lista de locatarios.'
      );
    }
  },

  getLocatarioByIdentificacion: async (
    identificacion: string
  ): Promise<Locatario> => {
    try {
      const res = await apiClient.get<Locatario>(
        `/locatarios/identificacion/${encodeURIComponent(identificacion)}`
      );
      return res.data;
    } catch (error) {
      return handleAxiosError(
        error,
        'Error al obtener el locatario por identificación.',
        { silentStatuses: [404] }
      );
    }
  },

  getLocatarioById: async (id: number): Promise<Locatario> => {
    try {
      const res = await apiClient.get<Locatario>(
        `/locatarios/${encodeURIComponent(id)}`
      );
      return res.data;
    } catch (error) {
      return handleAxiosError(error, 'Error al obtener el locatario por ID.');
    }
  },

  createLocatario: async (datos: Partial<Locatario>): Promise<Locatario> => {
    try {
      const res = await apiClient.post<Locatario>(
        '/locatarios',
        sanitizePayload(datos)
      );
      return res.data;
    } catch (error) {
      return handleAxiosError(error, 'Error al registrar el locatario.');
    }
  },

  updateLocatario: async (
    id: number,
    datos: Partial<Locatario>
  ): Promise<Locatario> => {
    try {
      const res = await apiClient.patch<Locatario>(
        `/locatarios/${encodeURIComponent(id)}`,
        sanitizePayload(datos)
      );
      return res.data;
    } catch (error) {
      return handleAxiosError(error, 'Error al actualizar el locatario.');
    }
  },


  deleteLocatario: async (id: number): Promise<void> => {
    try {
      await apiClient.delete(
        `/casos/locatario/${encodeURIComponent(id)}`
      );
    } catch (error) {
      return handleAxiosError(error, 'Error al eliminar el locatario.');
    }
  },

  // ===================================================
  // VEHÍCULOS
  // ===================================================

  getVehiculos: async (): Promise<Vehiculo[]> => {
    try {
      const res = await apiClient.get<Vehiculo[]>('/vehiculos');
      return res.data;
    } catch (error) {
      return handleAxiosError(
        error,
        'Error al obtener la lista de vehículos.'
      );
    }
  },

  getVehiculoByPlaca: async (placa: string): Promise<Vehiculo> => {
    try {
      const res = await apiClient.get<Vehiculo>(
        `/vehiculos/${encodeURIComponent(placa)}`
      );
      return res.data;
    } catch (error) {
      return handleAxiosError(
        error,
        'Error al obtener el vehículo por placa.',
        { silentStatuses: [404] }
      );
    }
  },

  createVehiculo: async (datos: Partial<Vehiculo>): Promise<Vehiculo> => {
    try {
      const res = await apiClient.post<Vehiculo>(
        '/vehiculos',
        sanitizePayload(datos)
      );
      return res.data;
    } catch (error) {
      return handleAxiosError(error, 'Error al registrar el vehículo.');
    }
  },

  updateVehiculo: async (
    placa: string,
    datos: Partial<Vehiculo>
  ): Promise<Vehiculo> => {
    try {
      const res = await apiClient.patch<Vehiculo>(
        `/vehiculos/${encodeURIComponent(placa)}`,
        sanitizePayload(datos)
      );
      return res.data;
    } catch (error) {
      return handleAxiosError(error, 'Error al actualizar el vehículo.');
    }
  },

  deleteVehiculo: async (placa: string): Promise<void> => {
    try {
      await apiClient.delete(`/vehiculos/${encodeURIComponent(placa)}`);
    } catch (error) {
      return handleAxiosError(error, 'Error al eliminar el vehículo.');
    }
  },

  // ===================================================
  // PROPIETARIOS
  // ===================================================

  getPropietarios: async (): Promise<Propietario[]> => {
    try {
      const res = await apiClient.get<Propietario[]>('/propietarios');
      return res.data;
    } catch (error) {
      return handleAxiosError(
        error,
        'Error al obtener la lista de propietarios.'
      );
    }
  },

  createPropietario: async (
    datos: Partial<Propietario>
  ): Promise<Propietario> => {
    try {
      const res = await apiClient.post<Propietario>(
        '/propietarios',
        sanitizePayload(datos)
      );
      return res.data;
    } catch (error) {
      return handleAxiosError(error, 'Error al registrar el propietario.');
    }
  },

  // ===================================================
  // CASOS
  // ===================================================

  getCasos: async (): Promise<Caso[]> => {
    try {
      const res = await apiClient.get<Caso[]>('/casos');
      return res.data;
    } catch (error) {
      return handleAxiosError(error, 'Error al obtener los casos.');
    }
  },

  getCasoById: async (id: number): Promise<Caso> => {
    try {
      const res = await apiClient.get<Caso>(
        `/casos/${encodeURIComponent(id)}`
      );
      return res.data;
    } catch (error) {
      return handleAxiosError(error, 'Error al obtener el caso por ID.');
    }
  },

  getCasoByContrato: async (numeroContrato: string): Promise<Caso> => {
    try {
      const res = await apiClient.get<Caso>(
        `/casos/contrato/${encodeURIComponent(numeroContrato)}`
      );
      return res.data;
    } catch (error) {
      return handleAxiosError(
        error,
        'Error al obtener el caso por número de contrato.'
      );
    }
  },

  createCaso: async (datos: CrearCasoInput): Promise<Caso> => {
    try {
      const res = await apiClient.post<Caso>(
        '/casos',
        sanitizePayload(datos)
      );
      return res.data;
    } catch (error) {
      return handleAxiosError(error, 'Error al crear el caso de leasing.');
    }
  },

  updateCaso: async (
    id: number,
    datos: Partial<CrearCasoInput>
  ): Promise<Caso> => {
    try {
      const payload = sanitizePayload(datos);

      const res = await apiClient.patch<Caso>(
        `/casos/${encodeURIComponent(id)}`,
        payload
      );
      return res.data;
    } catch (error) {
      return handleAxiosError(
        error,
        'Error al actualizar el caso de leasing.'
      );
    }
  },

  deleteCaso: async (id: number): Promise<void> => {
    try {
      await apiClient.delete(`/casos/${encodeURIComponent(id)}`);
    } catch (error) {
      return handleAxiosError(error, 'Error al eliminar el caso de leasing.');
    }
  },

  // ===================================================
  // PROCESO JURÍDICO
  // ===================================================

  updateProcesoJuridico: async (
    procesoJuridicoId: number,
    datos: ProcesoJuridicoInput
  ): Promise<ProcesoJuridico> => {
    try {
      const res = await apiClient.patch<ProcesoJuridico>(
        `/proceso-juridico/${encodeURIComponent(procesoJuridicoId)}`,
        sanitizePayload(datos)
      );
      return res.data;
    } catch (error) {
      return handleAxiosError(
        error,
        'Error al actualizar el proceso jurídico.'
      );
    }
  },

  // ===================================================
  // AUDITORÍA MULTAS
  // ===================================================

  updateAuditoriaMulta: async (
    auditoriaId: number,
    datos: AuditoriaMultaInput
  ): Promise<AuditoriaMulta> => {
    try {
      const res = await apiClient.patch<AuditoriaMulta>(
        `/auditoria-multas/${encodeURIComponent(auditoriaId)}`,
        sanitizePayload(datos)
      );
      return res.data;
    } catch (error) {
      return handleAxiosError(
        error,
        'Error al actualizar la auditoría de multas.'
      );
    }
  },

  // ===================================================
  // GESTIÓN
  // ===================================================

  buscarCasosGestion: async (
    tipo: TipoBusquedaGestion,
    q: string
  ): Promise<BuscarCasoGestionResponse> => {
    try {
      const res = await apiClient.get<BuscarCasoGestionResponse>(
        `/gestion/buscar?tipo=${encodeURIComponent(tipo)}&q=${encodeURIComponent(q)}`
      );
      return res.data;
    } catch (error) {
      return handleAxiosError(
        error,
        'Error al buscar el caso para gestión.'
      );
    }
  },

  crearGestion: async (datos: CrearGestionInput): Promise<GestionCaso> => {
    try {
      const res = await apiClient.post<GestionCaso>(
        '/gestion',
        sanitizePayload(datos)
      );
      return res.data;
    } catch (error) {
      return handleAxiosError(error, 'Error al registrar la gestión.');
    }
  },

  obtenerHistorialGestiones: async (
    casoId: number
  ): Promise<GestionCaso[]> => {
    try {
      const res = await apiClient.get<GestionCaso[]>(
        `/gestion/${encodeURIComponent(casoId)}/gestiones`
      );
      return res.data;
    } catch (error) {
      return handleAxiosError(
        error,
        'Error al obtener el historial de gestiones.'
      );
    }
  },
};