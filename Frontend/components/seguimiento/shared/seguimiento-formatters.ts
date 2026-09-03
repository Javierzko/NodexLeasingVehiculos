export const mostrarValor = (value?: string | number | null) => {
  if (value === null || value === undefined || value === '') return 'Pendiente';
  return String(value);
};

export const formatearFecha = (value?: string | null) => {
  if (!value) return 'Pendiente';
  return new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium' }).format(new Date(value));
};

export const formatearFechaHora = (value?: string | null) => {
  if (!value) return 'Sin actualización registrada';
  return new Intl.DateTimeFormat('es-CO', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(value));
};
