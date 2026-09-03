import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { SeguimientoPortalController } from './seguimiento-portal.controller';
import { SeguimientoPortalService } from './seguimiento-portal.service';

@Module({
  imports: [PrismaModule],
  controllers: [SeguimientoPortalController],
  providers: [SeguimientoPortalService],
  exports: [SeguimientoPortalService],
})
export class SeguimientoPortalModule {}
