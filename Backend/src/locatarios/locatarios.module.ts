import { Module } from '@nestjs/common';
import { LocatariosService } from './locatarios.service';
import { LocatariosController } from './locatarios.controller';

@Module({
  controllers: [LocatariosController],
  providers: [LocatariosService],
})
export class LocatariosModule {}
