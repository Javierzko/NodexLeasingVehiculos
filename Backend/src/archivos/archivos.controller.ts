import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { CargarArchivoDto } from './dto/cargar-archivo.dto';
import { ArchivosService } from './archivos.service';

const MAX_FILE_SIZE = 20 * 1024 * 1024;

@Controller('archivos')
export class ArchivosController {
  constructor(private readonly archivosService: ArchivosService) {}

  @Get('contrato/:numeroContrato')
  listarPorContrato(@Param('numeroContrato') numeroContrato: string) {
    return this.archivosService.listarPorContrato(numeroContrato);
  }

  @Post('contrato/:numeroContrato')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: MAX_FILE_SIZE },
    }),
  )
  cargar(
    @Param('numeroContrato') numeroContrato: string,
    @Body() dto: CargarArchivoDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.archivosService.cargarPorContrato(
      numeroContrato,
      dto.tipoDocumento,
      file,
    );
  }

  @Delete(':archivoId')
  eliminar(@Param('archivoId') archivoId: string) {
    return this.archivosService.eliminar(Number(archivoId));
  }
}
