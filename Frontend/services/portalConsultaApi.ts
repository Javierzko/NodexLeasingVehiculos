// services/portalConsultaApi.ts

import { apiClient } from "@/api/client"; // Ajusta la ruta de tu apiClient según la estructura de tu proyecto

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

function obtenerMensajeError(error: any): string {
  const message = error?.response?.data?.message;

  if (Array.isArray(message)) {
    return message.join(', ');
  }

  return message || 'No fue posible consultar el trámite.';
}

export const portalConsultaApi = {
  consultar: async (
    datos: PortalConsultaInput,
  ): Promise<PortalConsultaResponse> => {
    try {
      const response = await apiClient.post<PortalConsultaResponse>(
        '/portal-consulta',
        datos
      );
      return response.data;
    } catch (error) {
      throw new Error(obtenerMensajeError(error));
    }
  },

  consultarSeguimiento: async (
    datos: PortalConsultaInput,
  ): Promise<PortalSeguimientoResponse> => {
    try {
      const response = await apiClient.post<PortalSeguimientoResponse>(
        '/seguimiento-portal',
        datos
      );
      return response.data;
    } catch (error) {
      throw new Error(obtenerMensajeError(error));
    }
  },
};