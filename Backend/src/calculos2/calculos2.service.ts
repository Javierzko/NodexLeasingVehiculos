// src/calculos2/calculos2.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  calcularTiempoTotalProceso,
  calcularTiempoLocatario,
  calcularEntidadesExternas,
  calcularBancoConSuspension,
  calcularJuridicoExterno,
  calcularJuridicoInterno,
  calcularBloqueJuridicoTotal,
  calcularTiempoTransito,
  calcularOperativoAnalista,
  calcularCausaAtraso,
  calcularAnalistaResponsableGestion,
} from './utils/formulas-tiempos.utils';

@Injectable()
export class Calculos2Service {
  constructor(private readonly prisma: PrismaService) {}

  async calcularCasoV2(id: number) {
    const caso = await this.prisma.caso.findUnique({
      where: { id },
      include: {
        estado: true,
        subetapa: true,
        categoria: true,
        procesoJuridico: true,
      },
    });

    if (!caso) {
      throw new NotFoundException(`Caso #${id} no encontrado.`);
    }

    const pj = caso.procesoJuridico;

    const tiempoTotalProceso = calcularTiempoTotalProceso(caso.fechaAsignacion, caso.fechaCierreTraspasoBizagi);
    const tiempoLocatario = calcularTiempoLocatario(caso.fechaNotificacionInicial, caso.fechaUltimaNotificacion);
    const entidadesExternas = calcularEntidadesExternas(pj?.fechaEscalamientoEntidadEx, pj?.fechaRespuestaEntidadEx);
    const bancoConSuspension = calcularBancoConSuspension(
      pj?.fechaSolicitudRecursos,
      pj?.fechaDesembolsoRecursos,
      caso.fechaSolicitudSuspension,
      caso.fechaHastaSuspension,
    );
    const juridicoExterno = calcularJuridicoExterno(
      pj?.fechaRadicacionDp,
      pj?.fechaRadicacionTutela,
      pj?.fechaRespuestaDp,
      pj?.fechaFinSaneamientoJuridico,
    );
    const juridicoInterno = calcularJuridicoInterno(
      pj?.fechaSolicitudSaneamientoJuridico,
      pj?.fechaRadicacionDp,
      pj?.fechaRadicacionTutela,
      pj?.fechaRespuestaDp,
    );
    const bloqueJuridicoTotal = calcularBloqueJuridicoTotal(
      pj?.fechaSolicitudSaneamientoJuridico,
      pj?.fechaRadicacionTutela,
      pj?.fechaFinSaneamientoJuridico,
      pj?.fechaRespuestaDp,
    );
    const tiempoTransito = calcularTiempoTransito(
      caso.fechaInicioCitaTransito,
      caso.fechaTraspasoAprobado,
      caso.traspasoConCita,
      caso.fechaInicioCitaTransito,
      caso.fechaConsecucionCitaTransito,
      caso.fechaCitaTransito,
    );
    const operativoAnalista = calcularOperativoAnalista(
      tiempoTotalProceso,
      tiempoLocatario,
      entidadesExternas,
      bancoConSuspension,
      juridicoExterno,
      juridicoInterno,
    );
    const causaAtraso = calcularCausaAtraso(
      tiempoTotalProceso,
      bloqueJuridicoTotal,
      tiempoLocatario,
      entidadesExternas,
      bancoConSuspension,
      juridicoExterno,
      juridicoInterno,
    );


    console.log('DATOS FORMULA ANALISTA:',{
      estadoCaso: caso.estado?.nombre,
      actividad: caso.subetapa?.nombre,
      categoria:caso.categoria?.nombre,
    });





    const analistaCalculado = calcularAnalistaResponsableGestion({
      estadoCaso: caso.estado?.nombre,
      actividad: caso.subetapa?.nombre,
      categoria: caso.categoria?.nombre,
    });

    console.log('ANALISTA CALCULADO:', analistaCalculado);


    return {
      casoId: id,
      indicadores: {
        analistaCalculado,
        tiempoTotalProceso,
        tiempoLocatario,
        entidadesExternas,
        bancoConSuspension,
        juridicoExterno,
        juridicoInterno,
        bloqueJuridicoTotal,
        tiempoTransito,
        operativoAnalista,
        causaAtraso,
      },
    };
  }
}