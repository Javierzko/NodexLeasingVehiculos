// services/portalConsultaApi.ts

export interface PortalConsultaInput {
  numeroContrato: string;
  documento: string;
}

export interface PortalCatalogo {
  id: number;
  nombre: string;
}

export interface PortalHistorialItem {
  tipo: string;
  nombre: string;
  fechaInicio: string;
  fechaFin: string | null;
}

export interface PortalConsultaResponse {
  numeroContrato: string;
  vehiculoPlaca: string;
  estado: PortalCatalogo | null;
  categoria: PortalCatalogo | null;
  etapa: PortalCatalogo | null;
  subetapa: PortalCatalogo | null;
  fechaAsignacion: string | null;
  fechaProximaGestion: string | null;
  historial: PortalHistorialItem[];
}

export interface PortalLocatario {
  nit: string;
  nombre: string | null;
}

export interface PortalVehiculo {
  placa: string;
  marca: string | null;
  linea: string | null;
  modelo: number | null;
  transito: string | null;
}

export interface PortalGestionActual {
  actividad: string;
  responsable: string;
  significado: string;
  situacion: string;
  requiereAccion: boolean;
  proximoPaso: string;
}

export interface PortalCasoSeguimiento {
  numeroContrato: string;
  fecha: string | null;
  fechaAsignacion: string | null;
  fechaProximaGestion: string | null;
  fechaUltimaGestion: string | null;
  analistaResponsable: string | null;
  observacionesGestion: string | null;
  ultimoComentario: string | null;
  estado: PortalCatalogo | null;
  categoria: PortalCatalogo | null;
  etapa: PortalCatalogo | null;
  subetapa: PortalCatalogo | null;
}

export interface PortalSeguimientoResponse {
  caso: PortalCasoSeguimiento;
  locatario: PortalLocatario;
  vehiculo: PortalVehiculo;
  gestionActual: PortalGestionActual;
  historial: PortalHistorialItem[];
  ultimaActualizacion: string | null;
}

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
).replace(/\/$/, '');

const obtenerMensajeError = async (response: Response) => {
  const body = await response.json().catch(() => null);

  if (Array.isArray(body?.message)) {
    return body.message.join(', ');
  }

  return body?.message || 'No fue posible consultar el trámite.';
};

export const portalConsultaApi = {
  consultar: async (
    datos: PortalConsultaInput,
  ): Promise<PortalConsultaResponse> => {
    const response = await fetch(`${API_BASE_URL}/portal-consulta`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    });

    if (!response.ok) {
      throw new Error(await obtenerMensajeError(response));
    }

    return response.json() as Promise<PortalConsultaResponse>;
  },

  consultarSeguimiento: async (
    datos: PortalConsultaInput,
  ): Promise<PortalSeguimientoResponse> => {
    const response = await fetch(`${API_BASE_URL}/seguimiento-portal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    });

    if (!response.ok) {
      throw new Error(await obtenerMensajeError(response));
    }

    return response.json() as Promise<PortalSeguimientoResponse>;
  },
};
