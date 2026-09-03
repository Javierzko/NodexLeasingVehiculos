import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { AzureBlobService } from './azure-blob.service';

const MAX_FILE_SIZE = 20 * 1024 * 1024;

const ALLOWED_MIME_TYPES = new Set([
  'application/pdf',
  'image/jpeg',
  'image/png',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
]);

@Injectable()
export class ArchivosService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly azureBlobService: AzureBlobService,
  ) {}

  async listarPorContrato(numeroContrato: string) {
    const caso = await this.verificarContrato(numeroContrato);

    const archivos = await this.prisma.archivo.findMany({
      where: { casoId: caso.id, estado: { not: 'ELIMINADO' } },
      include: { tipoDocumento: true },
      orderBy: { createdAt: 'desc' },
    });

    return archivos.map((archivo) => this.serializarArchivo(archivo));
  }

  async cargarPorContrato(
    numeroContrato: string,
    tipoDocumentoCodigo: string,
    archivo: Express.Multer.File,
  ) {
    if (!archivo) {
      throw new BadRequestException('Debe enviar un archivo en el campo file');
    }

    if (archivo.size > MAX_FILE_SIZE) {
      throw new BadRequestException('El archivo no puede superar los 20 MB');
    }

    if (!ALLOWED_MIME_TYPES.has(archivo.mimetype)) {
      throw new BadRequestException(
        'Tipo de archivo no permitido. Use PDF, imágenes JPG/PNG, Word o Excel',
      );
    }

    const caso = await this.verificarContrato(numeroContrato);
    const codigo = tipoDocumentoCodigo.trim().toUpperCase();
    const tipoDocumento = await this.prisma.tipoDocumento.findFirst({
      where: { codigo, activo: true },
    });

    if (!tipoDocumento) {
      throw new BadRequestException(
        `El tipo de documento ${codigo} no existe o está inactivo`,
      );
    }

    const extension = this.obtenerExtension(archivo.originalname);
    const blobName = `casos/${caso.id}/${randomUUID()}${extension}`;

    await this.azureBlobService.upload(
      blobName,
      archivo.buffer,
      archivo.mimetype,
    );

    try {
      const registro = await this.prisma.archivo.create({
        data: {
          casoId: caso.id,
          tipoDocumentoId: tipoDocumento.id,
          nombreOriginal: archivo.originalname,
          blobName,
          containerName: process.env.AZURE_STORAGE_CONTAINER_NAME!,
          mimeType: archivo.mimetype,
          sizeBytes: archivo.size,
          estado: 'SUBIDO',
        },
        include: { tipoDocumento: true },
      });

      return this.serializarArchivo(registro);
    } catch (error) {
      await this.azureBlobService.delete(blobName);
      throw error;
    }
  }

  async eliminar(archivoId: number) {
    const archivo = await this.prisma.archivo.findUnique({
      where: { id: archivoId },
    });

    if (!archivo || archivo.estado === 'ELIMINADO') {
      throw new NotFoundException('Archivo no encontrado');
    }

    await this.azureBlobService.delete(archivo.blobName);
    await this.prisma.archivo.update({
      where: { id: archivoId },
      data: { estado: 'ELIMINADO' },
    });

    return { id: archivoId, mensaje: 'Archivo eliminado correctamente' };
  }

  private async verificarContrato(numeroContrato: string) {
    const contrato = numeroContrato.trim();

    if (!contrato) {
      throw new BadRequestException('Debe enviar un número de contrato');
    }

    const caso = await this.prisma.caso.findUnique({
      where: { numeroContrato: contrato },
      select: { id: true },
    });

    if (!caso) {
      throw new NotFoundException(`No existe el contrato ${contrato}`);
    }

    return caso;
  }

  private obtenerExtension(nombre: string): string {
    const extension = nombre.includes('.')
      ? nombre.substring(nombre.lastIndexOf('.')).toLowerCase()
      : '';

    return extension.replace(/[^a-z0-9.]/g, '');
  }

  private serializarArchivo(archivo: any) {
    return {
      id: archivo.id,
      casoId: archivo.casoId,
      tipoDocumento: archivo.tipoDocumento,
      nombreOriginal: archivo.nombreOriginal,
      mimeType: archivo.mimeType,
      sizeBytes: archivo.sizeBytes.toString(),
      estado: archivo.estado,
      createdAt: archivo.createdAt,
      updatedAt: archivo.updatedAt,
    };
  }
}