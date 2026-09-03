import { Module } from '@nestjs/common';
import { ProcesoJuridicoService } from './proceso-juridico.service';
import { ProcesoJuridicoController } from './proceso-juridico.controller';

@Module({
  controllers: [ProcesoJuridicoController],
  providers: [ProcesoJuridicoService],
})
export class ProcesoJuridicoModule {}
