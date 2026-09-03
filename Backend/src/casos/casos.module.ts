import { Module } from '@nestjs/common';
import { CasosService } from './casos.service';
import { CasosController } from './casos.controller';
import { EstadosCasoService } from './estados-caso/estados-caso.service';




@Module({
  controllers: [CasosController],
  providers: [CasosService,EstadosCasoService],
})
export class CasosModule {}
