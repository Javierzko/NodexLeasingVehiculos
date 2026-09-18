//src/calculos/utils/calculos-campos.utils.ts


type Fecha = Date | string | null | undefined;

function texto(valor: unknown): string {
  return String(valor ?? '')
    .trim()
    .replace(/\s+/g, ' ');
}

function parseFecha(valor: Fecha): Date | null {
  if (!valor) return null;

  let d: Date;
  if (valor instanceof Date) {
    if (Number.isNaN(valor.getTime())) return null;
    d = new Date(valor);
  } else {
    const txt = String(valor).trim();
    if (!txt) return null;
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(txt);
    if (match) {
      d = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
    } else {
      d = new Date(txt);
    }
  }

  if (Number.isNaN(d.getTime())) return null;
  d.setHours(0, 0, 0, 0);
  return d;
}

export function calcularDiasHabiles(
  inicio: Fecha,
  fin: Fecha = new Date(),
  festivos: Date[] = [],
): number | null {
  const desde = parseFecha(inicio);
  const hasta = parseFecha(fin);

  if (!desde || !hasta || desde > hasta) return null;

  const cursor = new Date(desde);
  let total = 0;

  const festivosTime = new Set(
    festivos.map((f) => parseFecha(f)?.getTime()).filter(Boolean),
  );

  while (cursor <= hasta) {
    const dia = cursor.getDay();
    const esFinDeSemana = dia === 0 || dia === 6;
    const esFestivo = festivosTime.has(cursor.getTime());

    if (!esFinDeSemana && !esFestivo) {
      total += 1;
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  return Math.max(1, total - 1);
}

export function calcularDiasCalendario(
  inicio: Fecha,
  fin: Fecha = new Date(),
): number | null {
  const desde = parseFecha(inicio);
  const hasta = parseFecha(fin);

  if (!desde || !hasta || desde > hasta) return null;

  const diffMs = hasta.getTime() - desde.getTime();
  return Math.max(0, Math.floor(diffMs / 86_400_000));
}

// 1. DÍAS QUE HA PASADO DESDE EL ÚLTIMO COMENTARIO
export function calcularDiasDesdeUltimoComentario(params: {
  estadoCaso: string;
  analistaResponsable: string;
  fechaUltimaGestion: Fecha;
  festivos?: Date[];
}): number | null {
  const estado = texto(params.estadoCaso).toUpperCase();
  const analista = texto(params.analistaResponsable);

  const aplica =
    estado === 'EN TRÁMITE' ||
    estado === 'SUSPENDIDO' ||
    (estado === 'FINALIZADO' && analista === 'Shirley López');

  if (!aplica || !params.fechaUltimaGestion) return null;

  const hoyMenosUno = new Date();
  hoyMenosUno.setDate(hoyMenosUno.getDate() - 1);

  return calcularDiasHabiles(
    params.fechaUltimaGestion,
    hoyMenosUno,
    params.festivos,
  );
}

// 2. ALERTA CORREO NOTIFICACIÓN INICIAL
export function calcularAlertaCorreoNotificacionInicial(params: {
  fechaAsignacion: Fecha;
  seEnvioNotificacion: boolean | string | null;
}): string {
  const tieneAsignacion = Boolean(parseFecha(params.fechaAsignacion));
  const envioNotifTxt = texto(params.seEnvioNotificacion).toUpperCase();
  const tieneEnvioNotif = envioNotifTxt !== '';

  if (!tieneAsignacion && !tieneEnvioNotif) return '';

  if (tieneAsignacion && !tieneEnvioNotif) {
    return 'Notificación Inicial por enviar';
  }

  if (envioNotifTxt === 'SÍ' || envioNotifTxt === 'SI' || params.seEnvioNotificacion === true) {
    return 'Notificación Inicial Enviada';
  }

  if (envioNotifTxt === 'NO' || params.seEnvioNotificacion === false) {
    return 'Notificación Inicial por enviar';
  }

  return '';
}

// 3. DÍAS DP & ALERTA RESPUESTA DP
export function calcularDiasDp(params: {
  fechaRadicacionDp: Fecha;
  fechaRespuestaDp: Fecha;
  festivos?: Date[];
}): number | null {
  if (!params.fechaRadicacionDp) return null;

  const fin = params.fechaRespuestaDp ?? new Date();
  return calcularDiasHabiles(params.fechaRadicacionDp, fin, params.festivos);
}

export function calcularAlertaRespuestaDp(diasDp: number | null): string {
  if (diasDp === null) return '';
  return diasDp >= 15 ? 'Realizar Seguimiento DP' : 'DP en Gestión a tiempo';
}

// 4. DÍAS RESPUESTA TUTELA & ALERTA RESPUESTA TUTELA
export function calcularDiasRespuestaTutela(params: {
  fechaRadicacionTutela: Fecha;
  fechaFinSaneamientoJuridico: Fecha;
  festivos?: Date[];
}): number | null {
  if (!params.fechaRadicacionTutela) return null;

  const fin = params.fechaFinSaneamientoJuridico ?? new Date();
  return calcularDiasHabiles(params.fechaRadicacionTutela, fin, params.festivos);
}

export function calcularAlertaRespuestaTutela(diasTutela: number | null): string {
  if (diasTutela === null) return '';

  if (diasTutela < 3) return 'Gestión Tutela al día';

  if (diasTutela === 3 || diasTutela === 8 || (diasTutela > 8 && (diasTutela - 8) % 3 === 0)) {
    return 'Seguimiento Tutela';
  }

  return '';
}

// 5. ALERTA NOTIFICACIÓN LOCATARIO
export function calcularAlertaNotificacionLocatario(params: {
  estadoCaso: string;
  diasDesdeUltimaNotificacion: number | null;
}): string {
  if (texto(params.estadoCaso).toUpperCase() !== 'EN TRÁMITE') return '';

  const dias = params.diasDesdeUltimaNotificacion;
  if (dias === null) return '';

  if (dias === 10) {
    return '⚠️ Han pasado 10 días. ¡Enviar notificación hoy!';
  }
  if (dias > 10) {
    return '🚨 Han pasado más de 10 días. ¡Enviar notificación prioritaria!';
  }
  return '✅ Todo está bien. Aún estamos a tiempo';
}

// 6. ALERTA REACTIVACIÓN CASO & DÍAS SUSPENSIÓN
export function calcularAlertaReactivacionCaso(fechaHastaSuspension: Fecha): string {
  const hasta = parseFecha(fechaHastaSuspension);
  if (!hasta) return '';

  const hoy = parseFecha(new Date())!;
  return hoy > hasta ? '🔔 REACTIVAR CASO' : '⏳ SUSPENDIDO';
}

export function calcularDiasSuspensionCaso(params: {
  fechaSolicitudSuspension: Fecha;
  fechaHastaSuspension: Fecha;
}): number | null {
  if (!params.fechaSolicitudSuspension) return null;

  const fin = params.fechaHastaSuspension ?? new Date();
  return calcularDiasCalendario(params.fechaSolicitudSuspension, fin);
}

// 7. TIEMPO TOTAL Y BLOQUE JURÍDICO TOTAL
export function calcularTiempoTotalProceso(params: {
  fechaAsignacion: Fecha;
  fechaCierreTraspasoBizagi: Fecha;
}): number | null {
  if (!params.fechaAsignacion) return null;

  const fin = params.fechaCierreTraspasoBizagi ?? new Date();
  const dias = calcularDiasCalendario(params.fechaAsignacion, fin);

  return dias !== null ? Math.max(1, dias) : null;
}

export function calcularBloqueJuridicoTotal(params: {
  fechaSolicitudSaneamientoJuridico: Fecha;
  fechaRadicacionTutela: Fecha;
  fechaFinSaneamientoJuridico: Fecha;
  fechaRespuestaDp: Fecha;
}): number {
  if (!params.fechaSolicitudSaneamientoJuridico) return 0;

  const inicio = parseFecha(params.fechaSolicitudSaneamientoJuridico)!;
  let fin: Date;

  if (params.fechaRadicacionTutela) {
    fin = parseFecha(params.fechaFinSaneamientoJuridico) ?? parseFecha(new Date())!;
  } else {
    fin = parseFecha(params.fechaRespuestaDp) ?? parseFecha(new Date())!;
  }

  const diffMs = fin.getTime() - inicio.getTime();
  const dias = Math.floor(diffMs / 86_400_000);

  return Math.max(0, dias);
}

// 8. INDICADORES Y ALERTAS ANS
export function calcularAlertaAnsCompleta(params: {
  estadoCaso: string;
  tiempoTotalProceso: number | null;
  causaAtraso?: string;
}): string {
  const estado = texto(params.estadoCaso).toUpperCase();
  const tiempo = params.tiempoTotalProceso;
  const causa = params.causaAtraso ? ` - ${params.causaAtraso}` : '';

  if (!estado || tiempo === null) return '';

  if (estado === 'DESISTIDO') return 'Trámite desistido';

  if (tiempo <= 30) {
    return estado === 'FINALIZADO' ? 'Finalizado a Tiempo' : 'En trámite a Tiempo';
  }

  return estado === 'FINALIZADO'
    ? `Finalizado Vencido${causa}`
    : `En trámite Vencido${causa}`;
}

export function calcularAnsGpa(params: {
  estadoCaso: string;
  bloqueJuridicoTotal: number | null;
}): string {
  const estado = texto(params.estadoCaso).toUpperCase();
  const bloque = params.bloqueJuridicoTotal;

  if (!estado || bloque === null) return '';

  if (estado === 'DESISTIDO') return 'Trámite desistido';

  if (bloque <= 30) {
    return estado === 'FINALIZADO' ? 'Finalizado a Tiempo' : 'En trámite a Tiempo';
  }

  return estado === 'FINALIZADO' ? 'Finalizado Vencido' : 'En trámite Vencido';
}

export function calcularEstadoVencimientoAns(params: {
  fechaCierreTraspaso: Fecha;
  estadoCaso: string;
}): string {
  const estado = texto(params.estadoCaso).toUpperCase();
  if (!params.fechaCierreTraspaso || estado === 'FINALIZADO' || estado === 'DESISTIDO') {
    return '';
  }

  const limite = parseFecha(params.fechaCierreTraspaso)!;
  const hoy = parseFecha(new Date())!;

  const diffDias = Math.floor((limite.getTime() - hoy.getTime()) / 86_400_000);

  if (diffDias >= 0) {
    return diffDias === 0
      ? 'Vence hoy'
      : `Faltan ${diffDias} días para vencer`;
  }

  return `Vencido con ${Math.abs(diffDias)} días`;
}