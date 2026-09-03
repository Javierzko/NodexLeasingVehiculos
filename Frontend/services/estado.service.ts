//raiz services/estado.service.ts

const API_URL = 'http://10.0.4.4:5001/estados'; 

export const obtenerEstadosPorTipo = async (tipo:string) => {
  const respuesta = await fetch(`${API_URL}?tipo=${tipo}`);
  if (!respuesta.ok) {
    throw new Error(`Error al obtener estados para el tipo: ${tipo}`);
  }
  return await respuesta.json();
};