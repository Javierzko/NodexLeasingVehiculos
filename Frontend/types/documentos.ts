export type DocumentoSolicitado = {
  id: string;
  titulo: string;
  descripcion: string;
  obligatorio?: boolean;
  detalle?: string;
};

export type ArchivoSubido = {
  id: number;
  casoId: number;
  tipoDocumento: {
    id: number;
    codigo: string;
    nombre: string;
  };
  nombreOriginal: string;
  mimeType: string;
  sizeBytes: string;
  estado: string;
  createdAt: string;
  updatedAt: string;
};

export type ArchivosPorTipo = Record<string, ArchivoSubido[]>;

export type ArchivoPendiente = {
  id: string;
  tipoDocumento: string;
  file: File;
};

export type PendientesPorTipo = Record<string, ArchivoPendiente[]>;
