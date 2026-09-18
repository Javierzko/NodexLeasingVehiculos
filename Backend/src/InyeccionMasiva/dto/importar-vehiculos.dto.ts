// raiz/src/inyeccionMasiva/importar-vehiculos.dto
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ImportarVehiculoFilaDto {
  @IsOptional()
  @IsString()
  numeroCaso?: string;

  @IsOptional()
  @IsString()
  radicadoBizagi?: string;

  @IsOptional()
  @IsString()
  numeroIdentificacionLocatario?: string;

  @IsOptional()
  @IsString()
  locatarioRunt?: string;

  @IsOptional()
  @IsString()
  identificacionPropietario?: string;

  @IsOptional()
  @IsString()
  nombrePropietario?: string;

  @IsString()
  @IsNotEmpty()
  placa!: string;

  @IsOptional()
  @IsString()
  vin?: string;

  @IsOptional()
  @IsString()
  marca?: string;

  @IsOptional()
  @IsString()
  linea?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  modelo?: number;

  @IsOptional()
  @IsString()
  cilindraje?: string;

  @IsOptional()
  @IsString()
  motor?: string;

  @IsOptional()
  @IsString()
  chasis?: string;

  @IsOptional()
  @IsString()
  serie?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsString()
  tipoVehiculo?: string;

  @IsOptional()
  @IsString()
  tipoServicio?: string;

  @IsOptional()
  @IsString()
  tipoCarroceria?: string;

  @IsOptional()
  @IsString()
  tipoCombustible?: string;

  @IsOptional()
  @IsString()
  blindaje?: string;

  @IsOptional()
  @IsString()
  transito?: string;

  @IsOptional()
  @IsString()
  departamento?: string;

  @IsOptional()
  @IsString()
  regional?: string;

  @IsOptional()
  @IsString()
  empresaTransportadora?: string;

  @IsOptional()
  @IsString()
  estadoMatricula?: string;

  @IsOptional()
  @IsNumber()
  estadoMatriculaId?: number;

  @IsOptional()
  @IsNumber()
  soatId?: number;

  @IsOptional()
  @IsString()
  vigenciaSoat?: string;

  @IsOptional()
  @IsNumber()
  revisionTecnomecanicaId?: number;

  @IsOptional()
  @IsString()
  vigenciaTecno?: string;

  @IsOptional()
  @IsString()
  limitacionesPropiedad?: string;

  @IsOptional()
  @IsString()
  garantiasMobiliarias?: string;
}

export class ImportarVehiculosDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImportarVehiculoFilaDto)
  vehiculos!: ImportarVehiculoFilaDto[];
}
