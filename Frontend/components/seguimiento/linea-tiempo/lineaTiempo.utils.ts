import { ETAPAS_VISIBLES_SEGUIMIENTO } from '@/constants/seguimiento.constants';

/**
 * Quita tildes, espacios sobrantes y convierte el texto a minúsculas.
 * Esto permite comparar correctamente los nombres que llegan del backend.
 */
export const normalizar = (valor: string) =>
  valor
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();

/**
 * Compara el nombre recibido desde el backend con el nombre configurado
 * en las etapas visibles del portal.
 */
export const coincide = (
  valorReal: string,
  valorParametrizado: string,
) => {
  const real = normalizar(valorReal);
  const parametrizado = normalizar(valorParametrizado);

  return (
    real === parametrizado ||
    real.includes(parametrizado) ||
    parametrizado.includes(real)
  );
};

/**
 * Obtiene la posición de la etapa actual dentro de las seis etapas visibles.
 * La primera etapa tiene índice 0 y la sexta etapa tiene índice 5.
 */
export const obtenerIndiceEtapaVisible = (
  etapaActual: string | null,
  subetapaActual: string | null,
) => {
  const actividad = subetapaActual || '';
  const etapa = etapaActual || '';

  // Primero buscamos coincidencias en la actividad o subetapa.
  const indicePorActividad = ETAPAS_VISIBLES_SEGUIMIENTO.findIndex((grupo) =>
    grupo.valoresActividad.some(
      (valor) =>
        coincide(actividad, valor) || coincide(etapa, valor),
    ),
  );

  if (indicePorActividad >= 0) {
    return indicePorActividad;
  }

  // Si no encontramos coincidencia en la actividad, buscamos en la etapa.
  return ETAPAS_VISIBLES_SEGUIMIENTO.findIndex((grupo) =>
    grupo.valoresEtapa.some((valor) => coincide(etapa, valor)),
  );
};

/**
 * Calcula el porcentaje de avance.
 *
 * Como existen seis etapas iguales, cada etapa representa 1/6 del proceso.
 * La etapa actual cuenta como el hito alcanzado actualmente.
 *
 * Resultado aproximado:
 * Etapa 1 = 17 %
 * Etapa 2 = 33 %
 * Etapa 3 = 50 %
 * Etapa 4 = 67 %
 * Etapa 5 = 83 %
 * Etapa 6 = 100 %
 */
export const calcularPorcentajeAvance = (
  etapaActual: string | null,
  subetapaActual: string | null,
) => {
  const indiceActual = obtenerIndiceEtapaVisible(
    etapaActual,
    subetapaActual,
  );

  // findIndex devuelve -1 cuando no encuentra la etapa.
  if (indiceActual < 0) {
    return 0;
  }

  // No se compara la cantidad de etapas con 0 porque el arreglo está
  // declarado con `as const` y TypeScript conoce que contiene seis etapas.
  return Math.round(
    ((indiceActual + 1) / ETAPAS_VISIBLES_SEGUIMIENTO.length) * 100,
  );
};