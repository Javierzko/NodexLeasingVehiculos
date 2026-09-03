import { IsString, IsNotEmpty, IsEmail, IsOptional, IsBoolean } from 'class-validator';

export class CreateLocatarioDto {
  @IsString()
  @IsNotEmpty()
  nit!: string;

  @IsString()
  @IsOptional()
  nombreBanco?: string;

  @IsString()
  @IsOptional()
  tipoDocumento?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsBoolean()
  @IsOptional()
  revisionCorreo?: boolean;

  @IsString()
  @IsOptional()
  contactoNombre?: string;

  @IsString()
  @IsOptional()
  contactoNumero?: string;

  @IsString()
  @IsOptional()
  direccionEnvio?: string;

  @IsString()
  @IsOptional()
  locatarioRunt?: string;

  @IsString()
  @IsOptional()
  nombreComercial?: string;

  @IsEmail()
  @IsOptional()
  emailComercial?: string;

  @IsBoolean()
  @IsOptional()
  revisionMailComercial?: boolean;
}