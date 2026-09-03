import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsDateString,
} from 'class-validator';

export class CreateAuditoriaMultaDto {

  @IsNumber()
  @IsNotEmpty()
  casoId!: number; // Se relaciona directamente con el Caso

  @IsString()
  @IsOptional()
  comparendoNumero?: string;

  @IsString()
  @IsOptional()
  secretariaTransito?: string;

  @IsDateString()
  @IsOptional()
  fechaInfraccion?: string;

  @IsNumber()
  @IsOptional()
  valorMulta?: number;

  @IsString()
  @IsOptional()
  estadoMulta?: string;

  @IsString()
  @IsOptional()
  resolucion?: string;

  @IsString()
  @IsOptional()
  observaciones?: string;

  @IsString()
  @IsOptional()
  limitacionesPropiedad?: string;

  @IsString()
  @IsOptional()
  tipoLimitaciones?: string;

  @IsString()
  @IsOptional()
  garantiasMobiliarias?: string;

  @IsString()
  @IsOptional()
  simitMultasPropietarioResoluciones?: string;

  @IsString()
  @IsOptional()
  simitMultasLocatario?: string;

  @IsString()
  @IsOptional()
  multasPlaca?: string;

  @IsString()
  @IsOptional()
  impuestos?: string;

  @IsString()
  @IsOptional()
  vigenciasAdeudadas?: string;

  @IsString()
  @IsOptional()
  impuestosTransito?: string;
}