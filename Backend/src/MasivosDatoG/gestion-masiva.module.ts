import { Module } from '@nestjs/common';
import { GestionMasivaController } from './gestion-masiva.controller';
import { GestionMasivaService } from './gestion-masiva.service';
import { PrismaService } from '../prisma/prisma.service';
import { EstadosCasoService } from '../casos/estados-caso/estados-caso.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports:[PrismaModule],
  controllers: [GestionMasivaController],
  providers: [GestionMasivaService, EstadosCasoService,PrismaService],exports:[GestionMasivaService]
})
export class GestionMasivaModule {}