// raiz/src/inyeccionMasiva/auto-inyeccion-casos.dto.ts

import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class AutoInyeccionCasoFilaDto {
  // ==========================================
  // DATOS PRINCIPALES DEL CASO
  // ==========================================

  @IsString()
  @IsNotEmpty()
  numeroContrato!: string;

  @IsOptional()
  @IsString()
  radicadoBizagi?: string;

  @IsOptional()
  @IsString()
  fechaAsignacion?: string;

  @IsOptional()
  @IsString()
  fechaCierreTraspaso?: string;

  @IsOptional()
  @IsString()
  analistaResponsable?: string;

  @IsOptional()
  @IsBoolean()
  aplicaInscripcionOpcionCompra?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  valorOpcionCompra?: number;

  @IsOptional()
  @IsString()
  estadoContrato?: string;

  @IsOptional()
  @IsString()
  estado?: string;

  @IsOptional()
  @IsString()
  categoria?: string;

  @IsOptional()
  @IsString()
  etapa?: string;

  @IsOptional()
  @IsString()
  subetapa?: string;

  @IsOptional()
  @IsString()
  ubicacionTarjeta?: string;

  @IsOptional()
  @IsString()
  observacionesGestion?: string;

  // ==========================================
  // LOCATARIO
  // ==========================================

  @IsString()
  @IsNotEmpty()
  nitLocatario!: string;

  @IsOptional()
  @IsString()
  nombreLocatarioBanco?: string;

  @IsOptional()
  @IsString()
  tipoDocumento?: string;

  @IsOptional()
  @IsBoolean()
  revisionCorreo?: boolean;

  @IsOptional()
  @IsString()
  emailLocatario?: string;

  @IsOptional()
  @IsString()
  nombreContactoLocatario?: string;

  @IsOptional()
  @IsString()
  contactoLocatario?: string;

  @IsOptional()
  @IsString()
  direccionLocatario?: string;

  @IsOptional()
  @IsString()
  nombreComercial?: string;

  @IsOptional()
  @IsString()
  emailComercial?: string;

  @IsOptional()
  @IsBoolean()
  revisionMailComercial?: boolean;

  @IsOptional()
  @IsString()
  locatarioRunt?: string;

  // ==========================================
  // VEHICULO
  // ==========================================

  @IsString()
  @IsNotEmpty()
  placa!: string;

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
  estadoMatricula?: string;

  @IsOptional()
  @IsString()
  tipoVehiculo?: string;

  @IsOptional()
  @IsString()
  tipoServicio?: string;

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
  vin?: string;

  @IsOptional()
  @IsString()
  color?: string;

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
  soat?: string;

  @IsOptional()
  @IsString()
  vigenciaSoat?: string;

  @IsOptional()
  @IsString()
  revisionTecnomecanica?: string;

  @IsOptional()
  @IsString()
  vigenciaTecno?: string;

  @IsOptional()
  @IsString()
  empresaTransportadora?: string;

  // ==========================================
  // PROPIETARIO
  // ==========================================

  @IsOptional()
  @IsString()
  identificacionPropietario?: string;

  @IsOptional()
  @IsString()
  nombrePropietario?: string;

  // ==========================================
  // AUDITORIA DE MULTAS
  // ==========================================

  @IsOptional()
  @IsString()
  limitacionesPropiedad?: string;

  @IsOptional()
  @IsString()
  tipoLimitaciones?: string;

  @IsOptional()
  @IsString()
  garantiasMobiliarias?: string;

  @IsOptional()
  @IsString()
  normalizacionSaneamiento?: string;

  @IsOptional()
  @IsString()
  simitMultasPropietarioResoluciones?: string;

  @IsOptional()
  @IsString()
  simitMultasLocatario?: string;

  @IsOptional()
  @IsString()
  multasPlaca?: string;

  @IsOptional()
  @IsString()
  impuestos?: string;

  @IsOptional()
  @IsString()
  vigenciasAdeudadas?: string;

  @IsOptional()
  @IsString()
  impuestosTransito?: string;

  // ==========================================
  // PROCESO JURIDICO
  // ==========================================

  @IsOptional()
  @IsString()
  tipoSaneamientoARealizar?: string;
}

export class AutoInyeccionCasosDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AutoInyeccionCasoFilaDto)
  casos!: AutoInyeccionCasoFilaDto[];
}