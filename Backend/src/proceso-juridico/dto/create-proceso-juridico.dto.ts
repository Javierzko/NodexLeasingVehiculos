import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsNumber,
} from 'class-validator';

export class CreateProcesoJuridicoDto {

  @IsNumber()
  @IsNotEmpty()
  casoId!: number;

  @IsString()
  @IsOptional()
  estadoLegal?: string;

  @IsString()
  @IsOptional()
  etapaProceso?: string;

  @IsString()
  @IsOptional()
  juzgado?: string;

  @IsString()
  @IsOptional()
  radicadoJuzgado?: string;

  @IsDateString()
  @IsOptional()
  fechaInicio?: string;

  @IsDateString()
  @IsOptional()
  fechaUltimaActuacion?: string;

  @IsString()
  @IsOptional()
  observacionesLegales?: string;

  @IsDateString()
  @IsOptional()
  fechaEscalamientoEntidadEx?: string;

  @IsDateString()
  @IsOptional()
  fechaRespuestaEntidadEx?: string;

  @IsDateString()
  @IsOptional()
  fechaLiquidacionTotalPasivos?: string;

  @IsDateString()
  @IsOptional()
  fechaSolicitudRecursos?: string;

  @IsDateString()
  @IsOptional()
  fechaDesembolsoRecursos?: string;

  @IsDateString()
  @IsOptional()
  fechaFinDiagnosticoPagoPasivos?: string;

  @IsNumber()
  @IsOptional()
  tipoSaneamientoARealizarId?: number;

  @IsDateString()
  @IsOptional()
  fechaSolicitudSaneamientoJuridico?: string;

  @IsDateString()
  @IsOptional()
  fechaFinSaneamientoJuridico?: string;

  @IsDateString()
  @IsOptional()
  fechaRadicacionDp?: string;

  @IsDateString()
  @IsOptional()
  fechaRespuestaDp?: string;

  @IsDateString()
  @IsOptional()
  fechaRadicacionTutela?: string;

  @IsString()
  @IsOptional()
  numeroRadicadoTutela?: string;

  @IsDateString()
  @IsOptional()
  fechaSolicitudDocsAdicionalesTraspaso?: string;

  @IsDateString()
  @IsOptional()
  fechaEntregaDocsAdicionalesTraspaso?: string;

  @IsDateString()
  @IsOptional()
  fechaFinGestionDocumentalTraspaso?: string;
}