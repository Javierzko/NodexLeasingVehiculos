import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsOptional,
  Min,
} from 'class-validator';

export class CambiarEstadoMasivoDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  @Min(1, { each: true })
  casoIds!: number[];

  @IsOptional()
  @IsInt()
  @Min(1)
  estadoId?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  categoriaId?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  etapaId?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  subetapaId?: number;
}
