import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateEstadoDto {
  @IsString()
  @IsNotEmpty()
  tipo!: string;

  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}