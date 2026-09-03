import type { ArchivoSubido } from "../types/documentos";

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
).replace(/\/$/, "");

async function obtenerMensajeError(response: Response) {
  const body = await response.json().catch(() => null);

  if (Array.isArray(body?.message)) {
    return body.message.join(", ");
  }

  return body?.message || "No fue posible procesar el archivo.";
}

function urlPorContrato(numeroContrato: string) {
  return `${API_BASE_URL}/archivos/contrato/${encodeURIComponent(numeroContrato)}`;
}

export const documentosApi = {
  listar: async (numeroContrato: string): Promise<ArchivoSubido[]> => {
    const response = await fetch(urlPorContrato(numeroContrato));

    if (!response.ok) {
      throw new Error(await obtenerMensajeError(response));
    }

    return response.json() as Promise<ArchivoSubido[]>;
  },

  cargar: async (
    numeroContrato: string,
    tipoDocumento: string,
    file: File,
  ): Promise<ArchivoSubido> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("tipoDocumento", tipoDocumento);

    const response = await fetch(urlPorContrato(numeroContrato), {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(await obtenerMensajeError(response));
    }

    return response.json() as Promise<ArchivoSubido>;
  },

  eliminar: async (archivoId: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/archivos/${archivoId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(await obtenerMensajeError(response));
    }
  },
};
