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
} from '@/types/leasing';

export type TipoBusquedaGestion = 'contrato' | 'placa' | 'nit';

export interface BuscarCasoGestionResponse {
  tipo: TipoBusquedaGestion;
  busqueda: string;
  encontrado: boolean;
  data: Caso[];
}

export interface CrearGestionInput {
  casoId: number;
  tipoObservacion: string;
  comentario: string;
  fechaProximaGestion?: string;
  analistaResponsable: string;
}

export interface GestionCaso {
  id: number;
  casoId: number;
  tipoObservacion: string;
  comentario: string;
  fechaGestion: string;
  fechaProximaGestion?: string | null;
  analistaResponsable: string;
}

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
).replace(/\/$/, '');

interface BackendErrorResponse {
  message?: string | string[];
  error?: string;
  statusCode?: number;
}

async function handleResponse<T>(
  res: Response,
  defaultErrorMessage: string,
  options?: { silentStatuses?: number[] }
): Promise<T> {
  if (!res.ok) {
    let errorMsg = defaultErrorMessage;

    try {
      const data: BackendErrorResponse = await res.json();

      if (!options?.silentStatuses?.includes(res.status)) {
        console.error('API Error:', {
          status: res.status,
          data,
        });
      }

      if (data.message) {
        errorMsg = Array.isArray(data.message)
          ? data.message.join(', ')
          : data.message;
      } else if (data.error) {
        errorMsg = data.error;
      }
    } catch {}

    throw new Error(`${errorMsg} (HTTP ${res.status})`);
  }

  if (res.status === 204) return undefined as T;

  return res.json() as Promise<T>;
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

const jsonHeaders = {
  'Content-Type': 'application/json',
};

export const leasingApi = {
  // ===================================================
  // LOCATARIOS
  // ===================================================

  getLocatarios: async (): Promise<Locatario[]> => {
    const res = await fetch(`${API_BASE_URL}/locatarios`);

    return handleResponse(
      res,
      'Error al obtener la lista de locatarios.'
    );
  },

  getLocatarioByIdentificacion: async (
    identificacion: string
  ): Promise<Locatario> => {
    const res = await fetch(
      `${API_BASE_URL}/locatarios/identificacion/${encodeURIComponent(
        identificacion
      )}`
    );

    return handleResponse(
      res,
      'Error al obtener el locatario por identificación.',
      { silentStatuses: [404] }
    );
  },

  getLocatarioById: async (
    id: number
  ): Promise<Locatario> => {
    const res = await fetch(
      `${API_BASE_URL}/locatarios/${encodeURIComponent(id)}`
    );

    return handleResponse(
      res,
      'Error al obtener el locatario por ID.'
    );
  },

  createLocatario: async (
    datos: Partial<Locatario>
  ): Promise<Locatario> => {
    const res = await fetch(
      `${API_BASE_URL}/locatarios`,
      {
        method: 'POST',
        headers: jsonHeaders,
        body: JSON.stringify(
          sanitizePayload(datos)
        ),
      }
    );

    return handleResponse(
      res,
      'Error al registrar el locatario.'
    );
  },

  deleteLocatario: async (
    id: number
  ): Promise<void> => {
    const res = await fetch(
      `${API_BASE_URL}/casos/locatario/${encodeURIComponent(id)}`,
      {
        method: 'DELETE',
      }
    );

    return handleResponse(
      res,
      'Error al eliminar el locatario.'
    );
  },

  // ===================================================
  // VEHÍCULOS
  // ===================================================

  getVehiculos: async (): Promise<Vehiculo[]> => {
    const res = await fetch(
      `${API_BASE_URL}/vehiculos`
    );

    return handleResponse(
      res,
      'Error al obtener la lista de vehículos.'
    );
  },

  getVehiculoByPlaca: async (
    placa: string
  ): Promise<Vehiculo> => {
    const res = await fetch(
      `${API_BASE_URL}/vehiculos/${encodeURIComponent(placa)}`
    );

    return handleResponse(
      res,
      'Error al obtener el vehículo por placa.',
      { silentStatuses: [404] }
    );
  },

  createVehiculo: async (
    datos: Partial<Vehiculo>
  ): Promise<Vehiculo> => {
    const res = await fetch(
      `${API_BASE_URL}/vehiculos`,
      {
        method: 'POST',
        headers: jsonHeaders,
        body: JSON.stringify(
          sanitizePayload(datos)
        ),
      }
    );

    return handleResponse(
      res,
      'Error al registrar el vehículo.'
    );
  },

  updateVehiculo: async (
    placa: string,
    datos: Partial<Vehiculo>
  ): Promise<Vehiculo> => {
    const res = await fetch(
      `${API_BASE_URL}/vehiculos/${encodeURIComponent(placa)}`,
      {
        method: 'PATCH',
        headers: jsonHeaders,
        body: JSON.stringify(
          sanitizePayload(datos)
        ),
      }
    );

    return handleResponse(
      res,
      'Error al actualizar el vehículo.'
    );
  },

  deleteVehiculo: async (
    placa: string
  ): Promise<void> => {
    const res = await fetch(
      `${API_BASE_URL}/vehiculos/${encodeURIComponent(placa)}`,
      {
        method: 'DELETE',
      }
    );

    return handleResponse(
      res,
      'Error al eliminar el vehículo.'
    );
  },

  // ===================================================
  // PROPIETARIOS
  // ===================================================

  getPropietarios: async (): Promise<Propietario[]> => {
    const res = await fetch(
      `${API_BASE_URL}/propietarios`
    );

    return handleResponse(
      res,
      'Error al obtener la lista de propietarios.'
    );
  },

  createPropietario: async (
    datos: Partial<Propietario>
  ): Promise<Propietario> => {
    const res = await fetch(
      `${API_BASE_URL}/propietarios`,
      {
        method: 'POST',
        headers: jsonHeaders,
        body: JSON.stringify(
          sanitizePayload(datos)
        ),
      }
    );

    return handleResponse(
      res,
      'Error al registrar el propietario.'
    );
  },

  // ===================================================
  // CASOS
  // ===================================================

  getCasos: async (): Promise<Caso[]> => {
    const res = await fetch(
      `${API_BASE_URL}/casos`
    );

    return handleResponse(
      res,
      'Error al obtener los casos.'
    );
  },

  getCasoById: async (
    id: number
  ): Promise<Caso> => {
    const res = await fetch(
      `${API_BASE_URL}/casos/${encodeURIComponent(id)}`
    );

    return handleResponse(
      res,
      'Error al obtener el caso por ID.'
    );
  },

  getCasoByContrato: async (
    numeroContrato: string
  ): Promise<Caso> => {
    const res = await fetch(
      `${API_BASE_URL}/casos/contrato/${encodeURIComponent(
        numeroContrato
      )}`
    );

    return handleResponse(
      res,
      'Error al obtener el caso por número de contrato.'
    );
  },

  createCaso: async (
    datos: CrearCasoInput
  ): Promise<Caso> => {
    const res = await fetch(
      `${API_BASE_URL}/casos`,
      {
        method: 'POST',
        headers: jsonHeaders,
        body: JSON.stringify(
          sanitizePayload(datos)
        ),
      }
    );

    return handleResponse(
      res,
      'Error al crear el caso de leasing.'
    );
  },

  updateCaso: async (
    id: number,
    datos: Partial<CrearCasoInput>
  ): Promise<Caso> => {
    const payload = sanitizePayload(datos);

    console.log(
      'PAYLOAD QUE SALE DEL FRONT:',
      payload
    );

    console.log(
      'PROCESO JURIDICO QUE SALE DEL FRONT:',
      payload?.procesoJuridico
    );

    const res = await fetch(
      `${API_BASE_URL}/casos/${encodeURIComponent(id)}`,
      {
        method: 'PATCH',
        headers: jsonHeaders,
        body: JSON.stringify(payload),
      }
    );

    return handleResponse(
      res,
      'Error al actualizar el caso de leasing.'
    );
  },

  deleteCaso: async (
    id: number
  ): Promise<void> => {
    const res = await fetch(
      `${API_BASE_URL}/casos/${encodeURIComponent(id)}`,
      {
        method: 'DELETE',
      }
    );

    return handleResponse(
      res,
      'Error al eliminar el caso de leasing.'
    );
  },

  // ===================================================
  // PROCESO JURÍDICO
  // ===================================================

  updateProcesoJuridico: async (
    procesoJuridicoId: number,
    datos: ProcesoJuridicoInput
  ): Promise<ProcesoJuridico> => {
    const res = await fetch(
      `${API_BASE_URL}/proceso-juridico/${encodeURIComponent(
        procesoJuridicoId
      )}`,
      {
        method: 'PATCH',
        headers: jsonHeaders,
        body: JSON.stringify(
          sanitizePayload(datos)
        ),
      }
    );

    return handleResponse(
      res,
      'Error al actualizar el proceso jurídico.'
    );
  },

  // ===================================================
  // AUDITORÍA MULTAS
  // ===================================================

  updateAuditoriaMulta: async (
    auditoriaId: number,
    datos: AuditoriaMultaInput
  ): Promise<AuditoriaMulta> => {
    const res = await fetch(
      `${API_BASE_URL}/auditoria-multas/${encodeURIComponent(
        auditoriaId
      )}`,
      {
        method: 'PATCH',
        headers: jsonHeaders,
        body: JSON.stringify(
          sanitizePayload(datos)
        ),
      }
    );

    return handleResponse(
      res,
      'Error al actualizar la auditoría de multas.'
    );
  },

  // ===================================================
  // GESTIÓN
  // ===================================================

  buscarCasosGestion: async (
    tipo: TipoBusquedaGestion,
    q: string
  ): Promise<BuscarCasoGestionResponse> => {
    const res = await fetch(
      `${API_BASE_URL}/gestion/buscar?tipo=${encodeURIComponent(
        tipo
      )}&q=${encodeURIComponent(q)}`
    );

    return handleResponse(
      res,
      'Error al buscar el caso para gestión.'
    );
  },

  crearGestion: async (
    datos: CrearGestionInput
  ): Promise<GestionCaso> => {
    const res = await fetch(
      `${API_BASE_URL}/gestion`,
      {
        method: 'POST',
        headers: jsonHeaders,
        body: JSON.stringify(
          sanitizePayload(datos)
        ),
      }
    );

    return handleResponse(
      res,
      'Error al registrar la gestión.'
    );
  },

  obtenerHistorialGestiones: async (
    casoId: number
  ): Promise<GestionCaso[]> => {
    const res = await fetch(
      `${API_BASE_URL}/gestion/${encodeURIComponent(
        casoId
      )}/gestiones`
    );

    return handleResponse(
      res,
      'Error al obtener el historial de gestiones.'
    );
  },
};