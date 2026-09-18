import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { CalculosService } from './calculos.service';
import { CalculosController } from './calculos.controller';

@Module({
  imports: [PrismaModule],
  controllers: [CalculosController],
  providers: [CalculosService],
  exports: [CalculosService],
})
export class CalculosModule {}
