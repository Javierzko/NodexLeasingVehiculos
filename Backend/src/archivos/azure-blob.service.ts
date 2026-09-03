import {
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import {
  BlobServiceClient,
  BlockBlobClient,
  ContainerClient,
} from '@azure/storage-blob';

@Injectable()
export class AzureBlobService implements OnModuleInit {
  private containerClient!: ContainerClient;

  async onModuleInit(): Promise<void> {
    const connectionString =
      process.env.AZURE_STORAGE_CONNECTION_STRING?.trim();
    const containerName =
      process.env.AZURE_STORAGE_CONTAINER_NAME?.trim().toLowerCase();

    if (!connectionString) {
      throw new Error(
        'Falta la variable AZURE_STORAGE_CONNECTION_STRING en el archivo .env',
      );
    }

    if (!containerName) {
      throw new Error(
        'Falta la variable AZURE_STORAGE_CONTAINER_NAME en el archivo .env',
      );
    }

    const nombreContainerValido =
      /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(containerName) &&
      containerName.length >= 3 &&
      containerName.length <= 63;

    if (!nombreContainerValido) {
      throw new Error(
        `Nombre de container inválido: ${containerName}. Use solo minúsculas, números y guiones.`,
      );
    }

    try {
      const serviceClient =
        BlobServiceClient.fromConnectionString(connectionString);

      this.containerClient = serviceClient.getContainerClient(containerName);

      // Es idempotente: crea el container solo si todavía no existe.
      // Si ya existe, no lo recrea ni elimina sus archivos.
      const resultado = await this.containerClient.createIfNotExists();

      if (resultado.succeeded) {
        console.log(`[Azure] Container creado: ${containerName}`);
      } else {
        console.log(`[Azure] Container ya existente: ${containerName}`);
      }
    } catch (error) {
      console.error('[Azure] No se pudo inicializar Blob Storage:', {
        nombre: error instanceof Error ? error.name : 'UnknownError',
        mensaje: error instanceof Error ? error.message : String(error),
        container: containerName,
      });

      throw new Error(
        'No fue posible validar o crear el container de Azure Blob Storage',
      );
    }
  }

  async upload(
    blobName: string,
    content: Buffer,
    contentType: string,
  ): Promise<void> {
    try {
      const blockBlobClient = this.getBlockBlobClient(blobName);

      await blockBlobClient.uploadData(content, {
        blobHTTPHeaders: {
          blobContentType: contentType,
        },
      });
    } catch (error) {
      console.error('[Azure] Error al subir el archivo:', {
        nombre: error instanceof Error ? error.name : 'UnknownError',
        mensaje: error instanceof Error ? error.message : String(error),
        blobName,
        contentType,
      });

      throw new InternalServerErrorException(
        'No fue posible guardar el archivo en Azure Blob Storage',
      );
    }
  }

  async delete(blobName: string): Promise<void> {
    try {
      await this.getBlockBlobClient(blobName).deleteIfExists();
    } catch (error) {
      console.error('[Azure] Error al eliminar el archivo:', {
        nombre: error instanceof Error ? error.name : 'UnknownError',
        mensaje: error instanceof Error ? error.message : String(error),
        blobName,
      });

      throw new InternalServerErrorException(
        'No fue posible eliminar el archivo de Azure Blob Storage',
      );
    }
  }

  getBlobUrl(blobName: string): string {
    // Devuelve la URL base. Un container privado requiere una SAS temporal.
    return this.getBlockBlobClient(blobName).url;
  }

  private getBlockBlobClient(blobName: string): BlockBlobClient {
    if (!this.containerClient) {
      throw new InternalServerErrorException(
        'El cliente de Azure Blob Storage no está inicializado',
      );
    }

    return this.containerClient.getBlockBlobClient(blobName);
  }
}
