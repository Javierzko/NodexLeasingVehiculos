import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ArchivosController } from './archivos.controller';
import { ArchivosService } from './archivos.service';
import { AzureBlobService } from './azure-blob.service';

@Module({
  imports: [PrismaModule],
  controllers: [ArchivosController],
  providers: [ArchivosService, AzureBlobService],
  exports: [ArchivosService],
})
export class ArchivosModule {}
