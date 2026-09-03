import { IsNotEmpty, IsString } from 'class-validator';

export class CargarArchivoDto {
  @IsString()
  @IsNotEmpty()
  tipoDocumento!: string;
}
