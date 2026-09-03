// raiz src/casos/dto/create-caso.dto.ts

import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsBoolean,
  IsNumber,
} from 'class-validator';

export class CreateCasoDto {

  @IsString()
  @IsNotEmpty()
  numeroContrato!: string;

  @IsString()
  @IsOptional()
  numeroCaso?: string;

  @IsNumber()
  @IsNotEmpty()
  locatarioId!: number;

  @IsString()
  @IsNotEmpty()
  vehiculoPlaca!: string;

  @IsString()
  @IsOptional()
  estadoExpediente?: string;

  @IsString()
  @IsOptional()
  faseTramite?: string;

  @IsString()
  @IsOptional()
  subFaseTramite?: string;

  @IsString()
  @IsOptional()
  radicadoRunt?: string;

  @IsDateString()
  @IsOptional()
  fechaValidacionRunt?: string;

  @IsString()
  @IsOptional()
  estadoCasilla?: string;

  @IsString()
  @IsOptional()
  estadoGastoCierre?: string;

  @IsString()
  @IsOptional()
  gestionLlamadas?: string;

  @IsDateString()
  @IsOptional()
  fechaComparendo?: string;

  @IsString()
  @IsOptional()
  pazYSalvoFormato?: string;

  @IsString()
  @IsOptional()
  empresaAsignada?: string;

  @IsString()
  @IsOptional()
  abogadoAsignado?: string;

  @IsString()
  @IsOptional()
  observaciones?: string;

  @IsString()
  @IsOptional()
  radicadoBizagi?: string;

  @IsNumber()
  @IsOptional()
  estadoContratoId?: number;

  @IsDateString()
  @IsOptional()
  fecha?: string;

  @IsDateString()
  @IsOptional()
  fechaAsignacion?: string;

  @IsDateString()
  @IsOptional()
  fechaCierreTraspaso?: string;

  @IsString()
  @IsOptional()
  analistaResponsable?: string;

  @IsBoolean()
  @IsOptional()
  aplicaInscripcionOpcionCompra?: boolean;

  @IsNumber()
  @IsOptional()
  valorOpcionCompra?: number;

  @IsNumber()
  @IsOptional()
  estadoId?: number;

  @IsNumber()
  @IsOptional()
  categoriaId?: number;

  @IsNumber()
  @IsOptional()
  etapaId?: number;

  @IsNumber()
  @IsOptional()
  subetapaId?: number;

  @IsNumber()
  @IsOptional()
  causaAtrasoId?: number;

  @IsBoolean()
  @IsOptional()
  seEnvioNotificacion?: boolean;

  @IsDateString()
  @IsOptional()
  fechaDebesEnviarNotificacion?: string;

  @IsDateString()
  @IsOptional()
  fechaNotificacionInicial?: string;

  @IsDateString()
  @IsOptional()
  fechaUltimaNotificacion?: string;

  @IsDateString()
  @IsOptional()
  fechaProximaNotificacion?: string;

  @IsDateString()
  @IsOptional()
  fechaUltimaGestion?: string;

  @IsDateString()
  @IsOptional()
  fechaProximaGestion?: string;

  @IsString()
  @IsOptional()
  observacionesGestion?: string;

  @IsString()
  @IsOptional()
  ultimoComentario?: string;

  @IsDateString()
  @IsOptional()
  fechaSolicitudSuspension?: string;

  @IsDateString()
  @IsOptional()
  fechaHastaSuspension?: string;

  @IsBoolean()
  @IsOptional()
  traspasoConCita?: boolean;

  @IsDateString()
  @IsOptional()
  fechaInicioCitaTransito?: string;

  @IsDateString()
  @IsOptional()
  fechaConsecucionCitaTransito?: string;

  @IsDateString()
  @IsOptional()
  fechaCitaTransito?: string;

  @IsDateString()
  @IsOptional()
  fechaRadicacionTraspaso?: string;

  @IsDateString()
  @IsOptional()
  fechaRechazo?: string;

  @IsDateString()
  @IsOptional()
  fechaSubsanacionRechazo?: string;

  @IsDateString()
  @IsOptional()
  fechaTraspasoAprobado?: string;

  @IsDateString()
  @IsOptional()
  fechaCierreTraspasoBizagi?: string;

  @IsString()
  @IsOptional()
  ubicacionTarjeta?: string;

  @IsString()
  @IsOptional()
  nombreCorresponsalTramitador?: string;

  @IsDateString()
  @IsOptional()
  fechaEntregaDatosEnvio?: string;

  @IsDateString()
  @IsOptional()
  fechaProgramacionEntregaTp?: string;

  @IsDateString()
  @IsOptional()
  fechaEntregaTpLocatario?: string;

  @IsNumber()
  @IsOptional()
  tiempoEntidadesExternas?: number;

  @IsNumber()
  @IsOptional()
  tiempoBanco?: number;

  @IsNumber()
  @IsOptional()
  tiempoJuridicoExterno?: number;

  @IsNumber()
  @IsOptional()
  tiempoJuridicoInterno?: number;

  @IsNumber()
  @IsOptional()
  tiempoTransito?: number;

  @IsNumber()
  @IsOptional()
  tiempoOperativoAnalista?: number;

  @IsNumber()
  @IsOptional()
  honorarios?: number;

  @IsBoolean()
  @IsOptional()
  facturado?: boolean;

  @IsDateString()
  @IsOptional()
  fechaFactura?: string;

  @IsString()
  @IsOptional()
  numeroFactura?: string;

  @IsString()
  @IsOptional()
  observacionesGp?: string;

  @IsString()
  @IsOptional()
  formulaTraspasosGpa?: string;

  @IsNumber()
  @IsOptional()
  honorariosServiciosJuridicos?: number;

  @IsBoolean()
  @IsOptional()
  facturadoJuridico?: boolean;

  @IsString()
  @IsOptional()
  numeroFacturaJuridico?: string;

  @IsDateString()
  @IsOptional()
  fechaFacturaJuridico?: string;

  @IsString()
  @IsOptional()
  observacionesGeneral?: string;

  @IsOptional()
  procesoJuridico?: {
    tipoSaneamientoARealizarId?: number;
  };

  @IsOptional()
  auditoriaMulta?: any;
}