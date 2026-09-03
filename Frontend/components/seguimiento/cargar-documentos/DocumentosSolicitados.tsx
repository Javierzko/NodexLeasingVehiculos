"use client";

import { useMemo } from "react";
import { useDocumentos } from "../../../hooks/useDocumentos";
import type { DocumentoSolicitado } from "../../../types/documentos";
import { DocumentoCard } from "./DocumentoCard";

export type { DocumentoSolicitado } from "../../../types/documentos";

type DocumentosSolicitadosProps = {
  numeroContrato: string;
  documentos: DocumentoSolicitado[];
};

const codigoPorId: Record<string, string> = {
  "camara-comercio": "CAMARA_COMERCIO",
  "cedula-representante": "CEDULA_REPRESENTANTE",
  rut: "RUT",
  "paz-salvo-comparendos": "PAZ_SALVO_COMPARENDO",
  "paz-salvo-impuestos": "PAZ_SALVO_IMPUESTOS",
  "tradicion-vehiculo": "TRADICION_VEHICULO",
  "otros-documentos": "OTROS_DOCUMENTOS",
};

export function DocumentosSolicitados({
  numeroContrato,
  documentos,
}: DocumentosSolicitadosProps) {
  const {
    archivosPorTipo,
    pendientesPorTipo,
    cargando,
    enviando,
    eliminandoId,
    error,
    seleccionarArchivos,
    quitarPendiente,
    eliminarArchivo,
    enviarDocumentos,
    limpiarPendientes,
  } = useDocumentos(numeroContrato);

  const totalGuardados = useMemo(
    () =>
      Object.values(archivosPorTipo).reduce(
        (total, items) => total + items.length,
        0,
      ),
    [archivosPorTipo],
  );

  const totalPendientes = useMemo(
    () =>
      Object.values(pendientesPorTipo).reduce(
        (total, items) => total + items.length,
        0,
      ),
    [pendientesPorTipo],
  );

  return (
    <section className="w-full min-w-0 overflow-hidden rounded-2xl border border-border bg-white p-4 shadow-sm sm:p-6">
      <header className="border-b border-border pb-4">
        <h2 className="text-lg font-black text-foreground">
          Documentos solicitados
        </h2>
        <p className="mt-1 text-sm leading-5 text-muted">
          Selecciona los archivos y luego pulsa{" "}
          <strong className="text-foreground">Enviar documentos</strong>. Formatos permitidos:{" "}
          <strong className="text-foreground">PDF, JPG, PNG, Word y Excel</strong>. Tamaño máximo:{" "}
          <strong className="text-foreground">20 MB por archivo</strong>.
        </p>
      </header>

      {error && (
        <div
          className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
          role="alert"
        >
          {error}
        </div>
      )}

      {!numeroContrato.trim() && (
        <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          No se puede cargar documentos porque no se recibió un número de
          contrato.
        </div>
      )}

      {cargando ? (
        <p className="py-8 text-center text-sm text-muted">
          Consultando documentos guardados...
        </p>
      ) : (
        <div className="mt-1 min-w-0 divide-y divide-border">
          {documentos.map((documento) => {
            const codigo = codigoPorId[documento.id] ?? "";
            const codigoNormalizado = codigo.toLowerCase();

            return (
              <DocumentoCard
                archivos={archivosPorTipo[codigoNormalizado] ?? []}
                cargando={enviando}
                documento={documento}
                key={documento.id}
                eliminandoId={eliminandoId}
                onEliminarArchivo={eliminarArchivo}
                onQuitarPendiente={quitarPendiente}
                onSeleccionar={(files) => seleccionarArchivos(codigo, files)}
                pendientes={pendientesPorTipo[codigoNormalizado] ?? []}
              />
            );
          })}
        </div>
      )}

      <footer className="mt-5 flex min-w-0 flex-col gap-4 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 text-sm text-muted">
          <p>{totalGuardados} archivo(s) guardado(s) para este contrato.</p>
          {totalPendientes > 0 && (
            <p className="mt-1 font-semibold text-primary">
              {totalPendientes} archivo(s) pendiente(s) de envío.
            </p>
          )}
        </div>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:min-w-[210px]">
          {totalPendientes > 0 && (
            <button
              className="inline-flex w-full items-center justify-center rounded-lg border border-border bg-white px-5 py-2.5 text-sm font-bold text-foreground transition hover:bg-surface-soft disabled:cursor-not-allowed disabled:opacity-60"
              disabled={enviando}
              onClick={limpiarPendientes}
              type="button"
            >
              Quitar seleccionados
            </button>
          )}

          <button
            className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-black text-white shadow-sm transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-primary/35 focus:ring-offset-2"
            disabled={
              enviando || totalPendientes === 0 || !numeroContrato.trim()
            }
            onClick={() => void enviarDocumentos()}
            type="button"
          >
            {enviando ? "Enviando documentos..." : "Enviar documentos"}
          </button>

          <p className="text-center text-xs text-muted">
            Los archivos solo se suben al pulsar este botón.
          </p>
        </div>
      </footer>
    </section>
  );
}