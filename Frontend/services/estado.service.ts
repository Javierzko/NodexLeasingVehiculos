import { apiClient } from "@/api/client";

export const obtenerEstadosPorTipo = async (tipo: string) => {
  try {
    const respuesta = await apiClient.get(`/estados?tipo=${encodeURIComponent(tipo)}`);
    return respuesta.data;
  } catch (error) {
    throw new Error(`Error al obtener estados para el tipo: ${tipo}`);
  }
};