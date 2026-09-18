import {
  IsArray,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ImportarCasoFilaDto {
  @IsString()
  @IsNotEmpty()
  radicadoBizagi!: string;

  @IsOptional()
  @IsDateString()
  fechaAsignacion?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  valorOpcionCompra?: number;

  @IsString()
  @IsNotEmpty()
  numeroContrato!: string;

  @IsString()
  @IsNotEmpty()
  placa!: string;

  @IsOptional()
  @IsString()
  contratoVigente?: string;

  @IsOptional()
  @IsString()
  nombreLocatarioBanco?: string;

  @IsOptional()
  @IsString()
  tipoDocumento?: string;

  @IsString()
  @IsNotEmpty()
  nitLocatario!: string;

  @IsOptional()
  @IsEmail()
  emailLocatario?: string;
}

export class ImportarCasosDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImportarCasoFilaDto)
  casos!: ImportarCasoFilaDto[];
}

export type ResultadoFilaImportacionCaso = {
  fila: number;
  operacion: 'CREADO' | 'ACTUALIZADO';
  numeroContrato: string;
  radicadoBizagi: string;
  placa: string;
  nitLocatario: string;
};

export type ResultadoImportacionCasos = {
  total: number;
  creados: number;
  actualizados: number;
  rechazados: number;
  errores: Array<{ fila?: number; campo?: string; mensaje: string }>;
  casos: ResultadoFilaImportacionCaso[];
};

