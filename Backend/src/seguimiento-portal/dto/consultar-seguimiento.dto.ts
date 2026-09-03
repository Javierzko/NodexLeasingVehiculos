import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ConsultarSeguimientoDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @Transform(({ value }) => String(value ?? '').trim())
  numeroContrato!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @Transform(({ value }) => String(value ?? '').trim())
  documento!: string;
}
