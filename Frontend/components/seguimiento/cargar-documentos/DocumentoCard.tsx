"use client";

import { useRef, type ChangeEvent } from "react";
import type {
  ArchivoPendiente,
  ArchivoSubido,
  DocumentoSolicitado,
} from "../../../types/documentos";

const MAX_FILE_SIZE = 20 * 1024 * 1024;
const ACCEPTED_TYPES = ".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx";

function IconoDocumento() {
  return (
    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-surface-muted text-primary">
      <svg
        aria-hidden="true"
        fill="none"
        height="22"
        viewBox="0 0 24 24"
        width="22"
      >
        <path
          d="M7 3.75h6.45L18 8.3v11.95H7V3.75Z"
          stroke="currentColor"
          strokeLinejoin="round"
          strokeWidth="1.7"
        />
        <path
          d="M13 3.75V8.5h4.75M9.5 12h5M9.5 15.5h5"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.7"
        />
      </svg>
    </span>
  );
}

function IconoCarga() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="18"
      viewBox="0 0 24 24"
      width="18"
    >
      <path
        d="M12 16V5m0 0L8.5 8.5M12 5l3.5 3.5M6.25 18.5H5.5A2.5 2.5 0 0 1 3 16v-1a3.5 3.5 0 0 1 3.5-3.5A5.5 5.5 0 0 1 17.1 10a4 4 0 0 1 3.9 4v2a2.5 2.5 0 0 1-2.5 2.5h-.75"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

type DocumentoCardProps = {
  documento: DocumentoSolicitado;
  archivos: ArchivoSubido[];
  pendientes: ArchivoPendiente[];
  cargando: boolean;
  onSeleccionar: (archivos: File[]) => void;
  onQuitarPendiente: (pendienteId: string) => void;
  onEliminarArchivo: (archivoId: number) => void;
  eliminandoId: number | null;
};

export function DocumentoCard({
  documento,
  archivos,
  pendientes,
  cargando,
  onSeleccionar,
  onQuitarPendiente,
  onEliminarArchivo,
  eliminandoId,
}: DocumentoCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const esObligatorio = documento.obligatorio !== false;
  const totalArchivos = archivos.length + pendientes.length;
  const tieneArchivos = totalArchivos > 0;

  const manejarSeleccion = (event: ChangeEvent<HTMLInputElement>) => {
    const seleccionados = Array.from(event.target.files ?? []);
    event.target.value = "";

    const invalidos = seleccionados.filter((file) => file.size > MAX_FILE_SIZE);
    if (invalidos.length > 0) {
      window.alert("Cada archivo debe pesar máximo 20 MB.");
      return;
    }

    if (seleccionados.length > 0) onSeleccionar(seleccionados);
  };

  return (
    <article className="grid min-w-0 grid-cols-1 gap-4 py-5 md:grid-cols-[minmax(0,1.35fr)_minmax(180px,0.85fr)_220px] md:items-center border-b border-border/60 last:border-0">
      <div className="flex min-w-0 items-start gap-3">
        <IconoDocumento />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="break-words font-bold text-foreground">
              {documento.titulo}
            </h3>
            <span
              className={
                esObligatorio
                  ? "rounded-md bg-red-50 px-2 py-0.5 text-xs font-bold text-red-600"
                  : "rounded-md bg-surface-muted px-2 py-0.5 text-xs font-bold text-muted"
              }
            >
              {esObligatorio ? "Obligatorio" : "Opcional"}
            </span>
          </div>
          <p className="mt-1 text-sm leading-5 text-muted">
            {documento.descripcion}
          </p>
          {documento.detalle && (
            <p className="mt-1 text-xs text-muted/80">{documento.detalle}</p>
          )}

          {archivos.length > 0 && (
            <ul className="mt-3 space-y-1 text-xs text-foreground">
              {archivos.map((archivo) => {
                const eliminando = eliminandoId === archivo.id;

                return (
                  <li
                    className="flex min-w-0 items-center gap-2 rounded-md bg-emerald-50/80 px-2 py-1.5 text-emerald-900"
                    key={archivo.id}
                  >
                    <span className="min-w-0 flex-1 truncate font-medium">
                      ✓ {archivo.nombreOriginal}
                    </span>
                    <button
                      className="shrink-0 font-bold text-red-600 hover:text-red-800 disabled:cursor-not-allowed disabled:opacity-60"
                      disabled={eliminando || eliminandoId !== null}
                      onClick={() => {
                        const confirmar = window.confirm(
                          `¿Deseas eliminar ${archivo.nombreOriginal}?`,
                        );

                        if (confirmar) onEliminarArchivo(archivo.id);
                      }}
                      type="button"
                    >
                      {eliminando ? "Eliminando..." : "Eliminar"}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          {pendientes.length > 0 && (
            <ul className="mt-3 space-y-2 text-xs text-foreground">
              {pendientes.map((pendiente) => (
                <li
                  className="flex min-w-0 items-center gap-2 rounded-md bg-surface-muted px-2 py-1.5"
                  key={pendiente.id}
                >
                  <span className="min-w-0 flex-1 truncate font-medium text-foreground">
                    Pendiente: {pendiente.file.name}
                  </span>
                  <button
                    className="shrink-0 font-bold text-red-600 hover:text-red-800"
                    onClick={() => onQuitarPendiente(pendiente.id)}
                    type="button"
                  >
                    Quitar
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="min-w-0 md:pl-2">
        <span
          className={
            tieneArchivos
              ? "inline-flex items-center gap-2 rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700"
              : esObligatorio
                ? "inline-flex items-center gap-2 rounded-md bg-red-50 px-2.5 py-1 text-xs font-bold text-red-600"
                : "inline-flex items-center gap-2 rounded-md bg-surface-muted px-2.5 py-1 text-xs font-bold text-muted"
          }
        >
          <span
            className={
              tieneArchivos
                ? "h-2 w-2 rounded-full bg-emerald-500"
                : esObligatorio
                  ? "h-2 w-2 rounded-full border-2 border-red-500"
                  : "h-2 w-2 rounded-full border-2 border-muted"
            }
          />
          {tieneArchivos
            ? `${totalArchivos} archivo(s)`
            : esObligatorio
              ? "Pendiente"
              : "Opcional"}
        </span>
        <p className="mt-2 text-sm text-muted">
          {pendientes.length > 0
            ? "Listo para enviar"
            : archivos.length > 0
              ? "Documento guardado"
              : esObligatorio
                ? "Aún no has cargado este documento"
                : "Este documento es opcional"}
        </p>
      </div>

      <div className="min-w-0">
        <input
          ref={inputRef}
          accept={ACCEPTED_TYPES}
          className="hidden"
          multiple
          onChange={manejarSeleccion}
          type="file"
        />
        <button
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-primary bg-white px-4 py-2.5 text-sm font-bold text-primary shadow-xs transition hover:bg-surface-muted hover:text-primary-strong active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-primary/25 focus:ring-offset-2"
          disabled={cargando}
          onClick={() => inputRef.current?.click()}
          type="button"
        >
          <IconoCarga />
          {cargando ? "Enviando..." : "Seleccionar archivos"}
        </button>
      </div>
    </article>
  );
}