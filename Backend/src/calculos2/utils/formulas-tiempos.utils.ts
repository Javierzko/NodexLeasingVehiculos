// src/calculos2/utils/formulas-tiempos.utils.ts

export type FechaInput = Date | string | null | undefined;

/**
 * Normaliza cualquier entrada de fecha a un objeto Date válido o null.
 */
export function normalizarFecha(fecha: FechaInput): Date | null {
  if (!fecha) return null;
  const d = new Date(fecha);
  return isNaN(d.getTime()) ? null : d;
}

/**
 * Calcula la diferencia en días naturales entre dos fechas.
 */
export function diferenciaDias(fechaInicio: FechaInput, fechaFin: FechaInput = new Date()): number | null {
  const inicio = normalizarFecha(fechaInicio);
  const fin = normalizarFecha(fechaFin);
  if (!inicio || !fin) return null;

  const diffMs = fin.getTime() - inicio.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

// -----------------------------------------------------------------------------
// FÓRMULAS DE TIEMPOS Y ALERTAS INDEPENDIENTES (CALCULOS2)
// -----------------------------------------------------------------------------

export function calcularTiempoTotalProceso(fechaAsignacion: FechaInput, fechaCierreBizagi: FechaInput): number | null {
  if (!fechaAsignacion) return null;
  const fechaFin = normalizarFecha(fechaCierreBizagi) ?? new Date();
  const dias = diferenciaDias(fechaAsignacion, fechaFin);
  return dias !== null ? Math.max(1, dias) : null;
}

export function calcularTiempoLocatario(fechaNotificacion: FechaInput, fechaRespuesta: FechaInput): number {
  if (!fechaNotificacion) return 0;
  const fechaFin = normalizarFecha(fechaRespuesta) ?? new Date();
  const dias = diferenciaDias(fechaNotificacion, fechaFin);
  return dias !== null ? Math.max(0, dias) : 0;
}

export function calcularEntidadesExternas(fechaEscalamiento: FechaInput, fechaRespuesta: FechaInput): number {
  if (!fechaEscalamiento) return 0;
  const fechaFin = normalizarFecha(fechaRespuesta) ?? new Date();
  const dias = diferenciaDias(fechaEscalamiento, fechaFin);
  return dias !== null ? Math.max(0, dias) : 0;
}

export function calcularBancoConSuspension(
  fechaInicioBanco: FechaInput,
  fechaFinBanco: FechaInput,
  fechaInicioSuspension: FechaInput,
  fechaFinSuspension: FechaInput,
): number {
  if (!fechaInicioBanco) return 0;
  const finBanco = normalizarFecha(fechaFinBanco) ?? new Date();
  const inicioBanco = normalizarFecha(fechaInicioBanco);

  if (!inicioBanco) return 0;

  const diasBrutos = Math.max(0, diferenciaDias(inicioBanco, finBanco) ?? 0);

  const inicioSusp = normalizarFecha(fechaInicioSuspension);
  const finSusp = normalizarFecha(fechaFinSuspension);

  if (!inicioSusp || !finSusp) return diasBrutos;

  const overlapInicio = inicioBanco > inicioSusp ? inicioBanco : inicioSusp;
  const overlapFin = finBanco < finSusp ? finBanco : finSusp;

  let diasDescuento = 0;
  if (overlapInicio < overlapFin) {
    diasDescuento = Math.max(0, diferenciaDias(overlapInicio, overlapFin) ?? 0);
  }

  return Math.max(0, diasBrutos - diasDescuento);
}

export function calcularJuridicoExterno(
  fechaRadicacionDp: FechaInput,
  fechaRadicacionTutela: FechaInput,
  fechaRespuestaDp: FechaInput,
  fechaFinSaneamiento: FechaInput,
): number {
  if (!fechaRadicacionDp) return 0;

  if (fechaRadicacionTutela) {
    const fin = normalizarFecha(fechaFinSaneamiento) ?? new Date();
    return Math.max(0, diferenciaDias(fechaRadicacionTutela, fin) ?? 0);
  }

  const fin = normalizarFecha(fechaRespuestaDp) ?? new Date();
  return Math.max(0, diferenciaDias(fechaRadicacionDp, fin) ?? 0);
}

export function calcularJuridicoInterno(
  fechaSolicitudSaneamiento: FechaInput,
  fechaRadicacionDp: FechaInput,
  fechaRadicacionTutela: FechaInput,
  fechaRespuestaDp: FechaInput,
): number {
  if (!fechaSolicitudSaneamiento) return 0;
  const tramo1 = Math.max(0, diferenciaDias(fechaSolicitudSaneamiento, fechaRadicacionDp) ?? 0);

  let tramo2 = 0;
  if (fechaRadicacionTutela && fechaRespuestaDp) {
    tramo2 = Math.max(0, diferenciaDias(fechaRespuestaDp, fechaRadicacionTutela) ?? 0);
  }

  return tramo1 + tramo2;
}

export function calcularBloqueJuridicoTotal(
  fechaSolicitudSaneamiento: FechaInput,
  fechaRadicacionTutela: FechaInput,
  fechaFinSaneamiento: FechaInput,
  fechaRespuestaDp: FechaInput,
): number {
  if (!fechaSolicitudSaneamiento) return 0;
  const inicio = normalizarFecha(fechaSolicitudSaneamiento);
  if (!inicio) return 0;

  let fechaFin: Date | null = null;
  if (fechaRadicacionTutela) {
    fechaFin = normalizarFecha(fechaFinSaneamiento) ?? new Date();
  } else {
    fechaFin = normalizarFecha(fechaRespuestaDp) ?? new Date();
  }

  return Math.max(0, diferenciaDias(inicio, fechaFin) ?? 0);
}

export function calcularTiempoTransito(
  fechaInicioTransito: FechaInput,
  fechaFinTransito: FechaInput,
  traspasoConCita: boolean,
  fechaInicioCita?: FechaInput,
  fechaConsecucionCita?: FechaInput,
  fechaCita?: FechaInput,
): number {
  if (!fechaInicioTransito) return 0;
  const finTransito = normalizarFecha(fechaFinTransito) ?? new Date();
  let total = Math.max(0, diferenciaDias(fechaInicioTransito, finTransito) ?? 0);

  if (traspasoConCita) {
    const tramoCita1 = Math.max(0, diferenciaDias(fechaInicioCita, fechaConsecucionCita) ?? 0);
    const tramoCita2 = Math.max(0, diferenciaDias(fechaConsecucionCita, fechaCita) ?? 0);
    total += tramoCita1 + tramoCita2;
  }

  return total;
}

export function calcularOperativoAnalista(
  tiempoTotal: number | null,
  tiempoLocatario: number,
  entidadesExternas: number,
  banco: number,
  juridicoExterno: number,
  juridicoInterno: number,
): number | null {
  if (tiempoTotal === null) return null;
  const restar = tiempoLocatario + entidadesExternas + banco + juridicoExterno + juridicoInterno;
  return tiempoTotal - restar;
}

export function calcularCausaAtraso(
  tiempoTotal: number | null,
  bloqueJuridico: number,
  locatario: number,
  entidadesExternas: number,
  banco: number,
  juridicoExterno: number,
  juridicoInterno: number,
): string {
  if (tiempoTotal === null) return '';

  const tiempos = [
    { causa: 'Gestión interna', valor: bloqueJuridico },
    { causa: 'Locatario', valor: locatario },
    { causa: 'Entidades externas', valor: entidadesExternas },
    { causa: 'Banco', valor: banco },
    { causa: 'Jurídico', valor: juridicoExterno + juridicoInterno },
  ];

  const mayor = tiempos.reduce((max, t) => (t.valor > max.valor ? t : max), tiempos[0]);
  return mayor.valor > 0 ? mayor.causa : 'Tránsito';
}

export function calcularAnalistaResponsableGestion(params: {
  estadoCaso?: string | null;
  actividad?: string | null;
  categoria?: string | null;
}): string {
  const estado = String(params.estadoCaso ?? '').trim().toUpperCase();
  const actividad = String(params.actividad ?? '').trim().replace(/\s+/g, ' ');
  const categoria = String(params.categoria ?? '').trim().replace(/\s+/g, ' ');

  if (estado === 'DESISTIDO') {
    return '';
  }

  const actividadesShirley = [
    'Traspaso unilateral ok',
    'Traspaso Bilateral Ok',
    'Tarjeta de propiedad enviada',
    'TP Pendiente por Enviar con Dirección',
    'TP Pendiente por Enviar Sin Dirección',
    'TP Pendiente por Enviar escaladas con el Banco',
  ];

  if (actividadesShirley.some((act) => act.toLowerCase() === actividad.toLowerCase())) {
    return 'Shirley López';
  }

  if (estado === 'EN TRÁMITE' || estado === 'SUSPENDIDO') {
    if (!actividad) return '';

    if (
      actividad.toLowerCase() === 'blindado' &&
      (categoria.toLowerCase() === 'modificacion locatario' ||
        categoria.toLowerCase() === 'en revisión jurídica')
    ) {
      return 'Valentina Giraldo';
    }

    const actividadesWendy = [
      'Pendiente',
      'Novedad Hacienda Bogotá',
      'Saneamiento en curso',
      'Pendiente Pago Multas Locatario',
      'Blindado',
    ];
    if (actividadesWendy.some((act) => act.toLowerCase() === actividad.toLowerCase())) {
      return 'Wendy Galeano';
    }

    const actividadesYeraldine = [
      'Saneamiento ok/pendiente traspaso Bilateral',
      'Entrega documentos Traspaso Bilateral',
      'Generar Documentación Traspaso Bilateral',
      'Autorización Cambio a Bilateral',
      'Solicitar Contrato Leasing Bilateral',
      'Seguimiento entrega Contrato Leasing Bilateral',
      'Envío documentos Bilateral a corresponsal',
      'Traspaso Bilateral por Radicar',
      'Traspaso Bilateral en curso',
      'Traspaso Bilateral con Boletín de rechazo / Subsanación',
      'Saneamiento ok/pendiente traspaso Unilateral',
      'Registro locatario / Traspaso unilateral',
      'Generar Documentación Traspaso Unilateral',
      'Solicitar Contrato Leasing Unilateral',
      'Seguimiento entrega Contrato Leasing Unilateral',
      'Envío documentos Unilateral a corresponsal',
      'Traspaso Unilateral por Radicar',
      'Traspaso Unilateral en curso',
      'Traspaso unilateral con Boletín de rechazo / Subsanación',
      'Traspaso realizado por Locatario',
    ];
    if (actividadesYeraldine.some((act) => act.toLowerCase() === actividad.toLowerCase())) {
      return 'Yeraldine Toro';
    }

    const actividadesValentina = [
      'Seguimiento Saneamiento Jurídico',
      'Registro locatario',
      'Modificación Locatario',
      'Modificación Locatario Bilateral',
      'Modificación Locatario Unilateral',
      'Seguimiento Tutela',
      'Seguimiento Desacato Tutela',
      'Seguimiento Derecho Petición',
    ];
    if (actividadesValentina.some((act) => act.toLowerCase() === actividad.toLowerCase())) {
      return 'Valentina Giraldo';
    }
  }

  return '';
}