//raiz src/vehiculos/dto/create-vehiculo.dto.ts

import { IsString, IsNotEmpty, IsOptional, IsInt, IsDateString } from 'class-validator';

export class CreateVehiculoDto {

  @IsString()

  @IsNotEmpty()

  placa!: string;

  @IsString()

  @IsOptional()

  vin?: string;

  @IsString()

  @IsOptional()

  marca?: string;

  @IsString()

  @IsOptional()

  linea?: string;

  @IsInt()

  @IsOptional()

  modelo?: number;

  @IsString()

  @IsOptional()

  cilindraje?: string;

  @IsString()

  @IsOptional()

  motor?: string;

  @IsString()

  @IsOptional()

  chasis?: string;

  @IsString()

  @IsOptional()

  serie?: string;

  @IsString()

  @IsOptional()

  color?: string;

  @IsString()

  @IsOptional()

  tipoVehiculo?: string;

  @IsString()

  @IsOptional()

  tipoServicio?: string;

  @IsString()

  @IsOptional()

  tipoCarroceria?: string;

  @IsString()

  @IsOptional()

  tipoCombustible?: string;

  @IsString()

  @IsOptional()

  blindaje?: string;

  @IsInt()

  @IsOptional()

  estadoMatriculaId?: number;

  @IsString()

  @IsOptional()

  transito?: string;

  @IsString()

  @IsOptional()

  departamento?: string;

  @IsString()

  @IsOptional()

  regional?: string;

  @IsString()

  @IsOptional()

  empresaTransportadora?: string;

  @IsInt()

  @IsOptional()

  soatId?: number;

  @IsInt()

  @IsOptional()

  revisionTecnomecanicaId?: number;

  @IsInt()

  @IsOptional()

  propietarioId?: number;


  @IsDateString()

  @IsOptional()

  vigenciaSoat?: string;

  @IsDateString()

  @IsOptional()

  vigenciaTecno?: string;


}