import { Module } from '@nestjs/common';
import { AutoInyeccionCasosController } from './auto-inyeccion-casos.controller';
import { AutoInyeccionCasosService } from '../auto-InyeccionCasos/auto-inyeccion-casos.service';

@Module({
  controllers: [AutoInyeccionCasosController],
  providers: [AutoInyeccionCasosService],
})
export class AutoInyeccionCasosModule {}