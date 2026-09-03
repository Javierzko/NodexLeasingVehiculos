import { Module } from '@nestjs/common';
import { AuditoriaMultasService } from './auditoria-multas.service';
import { AuditoriaMultasController } from './auditoria-multas.controller';
import { PrismaModule } from '../prisma/prisma.module'; // Ajusta la ruta a tu PrismaModule

@Module({
  imports: [PrismaModule],
  controllers: [AuditoriaMultasController],
  providers: [AuditoriaMultasService],
})
export class AuditoriaMultasModule {}