import { Module } from '@nestjs/common';
import { InyeccionMasivaController } from './inyeccion-masiva.controller';
import { InyeccionMasivaService } from './inyeccion-masiva.service';
import { CargaCasosController } from './carga-casos.controller';
import { CargaCasosService } from './carga-casos.service';

@Module({
  controllers: [InyeccionMasivaController, CargaCasosController],
  providers: [InyeccionMasivaService, CargaCasosService],
  exports: [InyeccionMasivaService, CargaCasosService],
})
export class InyeccionMasivaModule {}
