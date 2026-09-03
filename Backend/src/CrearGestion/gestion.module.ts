import { Module } from '@nestjs/common';
import { GestionController } from './gestion.controller';
import { GestionService } from './gestion.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [GestionController],
  providers: [GestionService],
})
export class GestionModule {}