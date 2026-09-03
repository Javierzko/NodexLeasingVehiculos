// src/portal-consulta/portal-consulta.module.ts

import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { PortalConsultaController } from './portal-consulta.controller';
import { PortalConsultaService } from './portal-consulta.service';

@Module({
  imports: [PrismaModule],
  controllers: [PortalConsultaController],
  providers: [PortalConsultaService],
})
export class PortalConsultaModule {}