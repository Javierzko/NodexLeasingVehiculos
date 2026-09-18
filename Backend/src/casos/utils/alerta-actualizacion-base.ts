// src/casos/utils/alerta-actualizacion-base.ts

type Fecha = Date | string | null | undefined;

type DatosAlerta = {
  estado?: string | null;
  analistaResponsable?: string | null;
  actividad?: string | null;
  fechaProximaGestion?: Fecha;
};

function convertirFecha(valor: Fecha): Date | null {
  if (!valor) return null;

  let año: number;
  let mes: number;
  let dia: number;

  if (valor instanceof Date) {
    if (Number.isNaN(valor.getTime())) return null;
    año = valor.getUTCFullYear();
    mes = valor.getUTCMonth();
    dia = valor.getUTCDate();
  } else {
    const texto = String(valor).trim();
    if (!texto) return null;

    // ExtraeYYYY-MM-DD ignorando lo que venga después (T00:00:00.000Z, etc.)
    const coincidencia = /^(\d{4})-(\d{2})-(\d{2})/.exec(texto);

    if (coincidencia) {
      año = Number(coincidencia[1]);
      mes = Number(coincidencia[2]) - 1;
      dia = Number(coincidencia[3]);
    } else {
      const fechaParseada = new Date(texto);
      if (Number.isNaN(fechaParseada.getTime())) return null;
      año = fechaParseada.getFullYear();
      mes = fechaParseada.getMonth();
      dia = fechaParseada.getDate();
    }
  }

  // Construye la fecha a medianoche exactamente en la zona horaria local
  return new Date(año, mes, dia, 0, 0, 0, 0);
}

export function calcularAlertaActualizacionBase({
  estado,
  analistaResponsable,
  actividad,
  fechaProximaGestion,
}: DatosAlerta): string {
  const estadoTexto = String(estado ?? '').trim().toUpperCase();
  const analistaTexto = String(analistaResponsable ?? '').trim();
  const actividadTexto = String(actividad ?? '').trim().replace(/\s+/g, ' ');

  // =========================================================================
  // 🔍 LOG 1: ENTRADAS A LA FÓRMULA
  // =========================================================================
  //console.log('===[ FORMULA ALERTA: ENTRADAS ]===', {
  //estadoTexto,
  //analistaTexto,
  //actividadTexto,
  //fechaProximaGestion,
  //});

  // Aplica si está SUSPENDIDO, EN TRÁMITE o si está FINALIZADO con analista Shirley López o actividades específicas
  const aplica =
    estadoTexto === 'SUSPENDIDO' ||
    estadoTexto === 'EN TRÁMITE' ||
    (estadoTexto === 'FINALIZADO' &&
      (analistaTexto === 'Shirley López' ||
        actividadTexto === 'Mutación Catastral Radicada' ||
        actividadTexto === 'Pendiente Radicación Mutación Catastral'));

  if (!aplica) {
    //console.log(
      //'===[ FORMULA ALERTA: RESULTADO ]=== No aplica por regla (Estado/Analista/Actividad no coinciden)'
    //);
    return '';
  }

  const fechaGestion = convertirFecha(fechaProximaGestion);

  if (!fechaGestion) {
    //console.log(
      //'===[ FORMULA ALERTA: RESULTADO ]=== Fecha próxima gestión nula o inválida'
    //);
    return '';
  }

  const hoy = new Date();
  const fechaHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), 0, 0, 0, 0);

  const diferencia = Math.round(
    (fechaGestion.getTime() - fechaHoy.getTime()) / 86_400_000
  );

  let resultado = 'Seguimiento al día';

  if (diferencia < 0) {
    resultado = 'Seguimiento Vencido';
  } else if (diferencia === 0) {
    resultado = 'Seguimiento Vence Hoy';
  } else if (diferencia <= 3) {
    resultado = 'Seguimiento Próximo a vencer';
  }

  // =========================================================================
  // 🔍 LOG 2: RESULTADO DE CÁLCULO DE DÍAS Y ESTADO FINAL
  // =========================================================================
  //console.log(
    //`===[ FORMULA ALERTA: RESULTADO ]=== "${resultado}" (Diferencia de días: ${diferencia})`
  //);

  return resultado;
}