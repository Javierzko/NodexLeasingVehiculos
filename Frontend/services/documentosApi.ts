//raiz services/documentosApi.ts

import { apiClient } from "@/api/client"; 
import type { ArchivoSubido } from "../types/documentos";

function obtenerMensajeError(error: any): string {
  const message = error?.response?.data?.message;

  if (Array.isArray(message)) {
    return message.join(", ");
  }

  return message || "No fue posible procesar el archivo.";
}

export const documentosApi = {
  listar: async (numeroContrato: string): Promise<ArchivoSubido[]> => {
    try {
      const response = await apiClient.get<ArchivoSubido[]>(
        `/archivos/contrato/${encodeURIComponent(numeroContrato)}`
      );
      return response.data;
    } catch (error) {
      throw new Error(obtenerMensajeError(error));
    }
  },

  cargar: async (
    numeroContrato: string,
    tipoDocumento: string,
    file: File,
  ): Promise<ArchivoSubido> => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("tipoDocumento", tipoDocumento);

      const response = await apiClient.post<ArchivoSubido>(
        `/archivos/contrato/${encodeURIComponent(numeroContrato)}`,
        formData
      );
      return response.data;
    } catch (error) {
      throw new Error(obtenerMensajeError(error));
    }
  },

  eliminar: async (archivoId: number): Promise<void> => {
    try {
      await apiClient.delete(`/archivos/${archivoId}`);
    } catch (error) {
      throw new Error(obtenerMensajeError(error));
    }
  },
};