import { IsString, IsNotEmpty, IsOptional, IsEmail } from 'class-validator';

export class CreatePropietarioDto {
  @IsString()
  @IsNotEmpty()
  identificacion!: string;

  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @IsString()
  @IsOptional()
  tipoDocumento?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  telefono?: string;

  @IsString()
  @IsOptional()
  direccion?: string;
}