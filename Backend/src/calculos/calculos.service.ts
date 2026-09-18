// src/calculos/calculos.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { calcularAlertaActualizacionBase } from '../casos/utils/alerta-actualizacion-base';
import {
  calcularDiasHabiles,
  calcularDiasDesdeUltimoComentario,
  calcularAlertaCorreoNotificacionInicial,
  calcularDiasDp,
  calcularAlertaRespuestaDp,
  calcularDiasRespuestaTutela,
  calcularAlertaRespuestaTutela,
  calcularAlertaNotificacionLocatario,
  calcularAlertaReactivacionCaso,
  calcularDiasSuspensionCaso,
  calcularTiempoTotalProceso,
  calcularBloqueJuridicoTotal,
  calcularAlertaAnsCompleta,
  calcularAnsGpa,
  calcularEstadoVencimientoAns,
} from './utils/calculos-campos.utils';

@Injectable()
export class CalculosService {
  constructor(private readonly prisma: PrismaService) {}

  async calcularCaso(id: number) {
    // =========================================================================
    // 1. OBTENCIÓN DEL EXPEDIENTE CON SUS RELACIONES
    // =========================================================================
    const caso = await this.prisma.caso.findUnique({
      where: { id },
      include: {
        estado: true,
        categoria: true,
        etapa: true,
        subetapa: true,
        causaAtraso: true,
        procesoJuridico: true,
        auditoriaMulta: true,
        locatario: true,
        vehiculo: true,
      },
    });

    if (!caso) {
      throw new NotFoundException(`Caso con ID ${id} no encontrado.`);
    }

    const estadoNombre = caso.estado?.nombre ?? '';

    // =========================================================================
    // 2. CÁLCULO DE DÍAS Y ALERTAS INDIVIDUALES
    // =========================================================================
    // Días y Alertas de Derecho de Petición (DP)
    const diasDp = calcularDiasDp({
      fechaRadicacionDp: caso.procesoJuridico?.fechaRadicacionDp,
      fechaRespuestaDp: caso.procesoJuridico?.fechaRespuestaDp,
    });
    const alertaRespuestaDpTexto = calcularAlertaRespuestaDp(diasDp);

    // Días y Alertas de Tutela
    const diasRespuestaTutela = calcularDiasRespuestaTutela({
      fechaRadicacionTutela: caso.procesoJuridico?.fechaRadicacionTutela,
      fechaFinSaneamientoJuridico: caso.procesoJuridico?.fechaFinSaneamientoJuridico,
    });
    const alertaRespuestaTutelaTexto = calcularAlertaRespuestaTutela(diasRespuestaTutela);

    // Tiempos Totales
    const tiempoTotalProceso = calcularTiempoTotalProceso({
      fechaAsignacion: caso.fechaAsignacion,
      fechaCierreTraspasoBizagi: caso.fechaCierreTraspasoBizagi,
    });

    const bloqueJuridicoTotal = calcularBloqueJuridicoTotal({
      fechaSolicitudSaneamientoJuridico: caso.procesoJuridico?.fechaSolicitudSaneamientoJuridico,
      fechaRadicacionTutela: caso.procesoJuridico?.fechaRadicacionTutela,
      fechaFinSaneamientoJuridico: caso.procesoJuridico?.fechaFinSaneamientoJuridico,
      fechaRespuestaDp: caso.procesoJuridico?.fechaRespuestaDp,
    });

    // Alerta Actualización Base (TEXTO EXACTO CALCULADO)
    const alertaActualizacionBaseTexto = calcularAlertaActualizacionBase({
      estado: estadoNombre,
      analistaResponsable: caso.analistaResponsable,
      actividad: caso.subetapa?.nombre,
      fechaProximaGestion: caso.fechaProximaGestion,
    });

    // Alerta Notificación Inicial
    const alertaCorreoNotificacionInicialTexto = calcularAlertaCorreoNotificacionInicial({
      fechaAsignacion: caso.fechaAsignacion,
      seEnvioNotificacion: caso.seEnvioNotificacion,
    });

    // Alerta Notificación Locatario
    const diasDesdeUltimaNotificacion = calcularDiasHabiles(caso.fechaUltimaNotificacion);
    const alertaNotificacionLocatarioTexto = calcularAlertaNotificacionLocatario({
      estadoCaso: estadoNombre,
      diasDesdeUltimaNotificacion,
    });

    // Alerta Reactivación
    const alertaReactivacionCasoTexto = calcularAlertaReactivacionCaso(caso.fechaHastaSuspension);

    // Alerta ANS Completa
    const alertaAnsCompletaTexto = calcularAlertaAnsCompleta({
      estadoCaso: estadoNombre,
      tiempoTotalProceso,
      causaAtraso: caso.causaAtraso?.nombre,
    });

    // =========================================================================
    // 3. ESTRUCTURA DE CÁLCULOS PARA EL FRONTEND
    // =========================================================================
    const calculosParaFrontend = {
      diasDesdeUltimoComentario: calcularDiasDesdeUltimoComentario({
        estadoCaso: estadoNombre,
        analistaResponsable: caso.analistaResponsable ?? '',
        fechaUltimaGestion: caso.fechaUltimaGestion,
      }),

      alertaCorreoNotificacionInicial: alertaCorreoNotificacionInicialTexto,
      diasDp,
      alertaRespuestaDp: alertaRespuestaDpTexto,
      diasRespuestaTutela,
      alertaRespuestaTutela: alertaRespuestaTutelaTexto,

      diasDesdeUltimaNotificacion,
      alertaNotificacionLocatario: alertaNotificacionLocatarioTexto,

      alertaActualizacionBase: alertaActualizacionBaseTexto,
      alertaReactivacionCaso: alertaReactivacionCasoTexto,
      diasSuspensionCaso: calcularDiasSuspensionCaso({
        fechaSolicitudSuspension: caso.fechaSolicitudSuspension,
        fechaHastaSuspension: caso.fechaHastaSuspension,
      }),

      tiempoTotalProceso,
      bloqueJuridicoTotal,

      alertaAnsCompleta: alertaAnsCompletaTexto,
      ansGpa: calcularAnsGpa({
        estadoCaso: estadoNombre,
        bloqueJuridicoTotal,
      }),

      estadoVencimientoAns: calcularEstadoVencimientoAns({
        fechaCierreTraspaso: caso.fechaCierreTraspaso,
        estadoCaso: estadoNombre,
      }),
    };

    // =========================================================================
    // 4. MAPEO PARA PERSISTENCIA EN LA BASE DE DATOS (PRISMA)
    // =========================================================================
    const datosParaBaseDatos = {
      responsableGestion: caso.analistaResponsable,
      diasDesdeUltimoComentario: calculosParaFrontend.diasDesdeUltimoComentario,
      diasDesdeUltimaNotificacion,
      diasDp,
      diasRespuestaTutela,
      diasSuspensionCaso: calculosParaFrontend.diasSuspensionCaso,
      tiempoTotalProceso,
      bloqueJuridicoTotal,

      // Mapeo adaptado según tipos requeridos por Prisma
      alertaCorreoNotificacionInicial: alertaCorreoNotificacionInicialTexto.includes('por enviar'),
      alertaNotificacionLocatario: alertaNotificacionLocatarioTexto.includes('⚠️') || alertaNotificacionLocatarioTexto.includes('🚨'),
      
      // Mantenemos la cadena de texto para almacenar el estado exacto de la alerta
      alertaActualizacionBase: alertaActualizacionBaseTexto,
      
      alertaRespuestaDp: alertaRespuestaDpTexto === 'Realizar Seguimiento DP',
      alertaRespuestaTutela: alertaRespuestaTutelaTexto === 'Seguimiento Tutela',
      alertaReactivacionCaso: alertaReactivacionCasoTexto === '🔔 REACTIVAR CASO',
      alertaAnsCompleta: alertaAnsCompletaTexto.includes('Vencido'),

      estadoVencimientoAns: calculosParaFrontend.estadoVencimientoAns,
      ansGpa: calculosParaFrontend.ansGpa,
    };

    // 🔍 LOG 2: VERIFICACIÓN PREVIA A LA PERSISTENCIA
    //console.log('===[ CALCULOS SERVICE: GUARDANDO EN PRISMA ]===', {
      //casoId: id,
      //alertaActualizacionBaseEnBD: datosParaBaseDatos.alertaActualizacionBase,
    //});

    // =========================================================================
    // 5. UPSERT EN TABLA CAMPOSCALCULADOS
    // =========================================================================
    await this.prisma.camposCalculados.upsert({
      where: { casoId: id },
      update: datosParaBaseDatos,
      create: {
        casoId: id,
        ...datosParaBaseDatos,
      },
    });

    // 🔍 LOG 3: CONFIRMACIÓN DE PERSISTENCIA
    //console.log(`===[ CALCULOS SERVICE: UPSERT COMPLETADO EXITOSAMENTE PARA CASO ID ${id} ]===`);

    return {
      caso,
      calculos: calculosParaFrontend,
    };
  }
}