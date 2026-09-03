import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDateString,
  IsNumber,
} from 'class-validator';

export class CreateGestionDto {

  @IsNumber()
  @IsNotEmpty()
  casoId!: number;

  @IsString()
  @IsNotEmpty()
  tipoObservacion!: string;

  @IsString()
  @IsNotEmpty()
  comentario!: string;

  @IsDateString()
  @IsOptional()
  fechaProximaGestion?: string;

  @IsString()
  @IsNotEmpty()
  analistaResponsable!: string;
}