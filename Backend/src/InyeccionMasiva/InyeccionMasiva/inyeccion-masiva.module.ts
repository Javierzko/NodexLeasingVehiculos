import { Module } from '@nestjs/common';
import { InyeccionMasivaController } from './inyeccion-masiva.controller';
import { InyeccionMasivaService } from '../InyeccionMasiva/inyeccion-masiva.service';
import { CargaCasosController } from '../cargaCasos/carga-casos.controller';
import { CargaCasosService } from '../cargaCasos/carga-casos.service';

@Module({
  controllers: [InyeccionMasivaController, CargaCasosController],
  providers: [InyeccionMasivaService, CargaCasosService],
  exports: [InyeccionMasivaService, CargaCasosService],
})
export class InyeccionMasivaModule {}
