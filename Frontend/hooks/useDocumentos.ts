"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { documentosApi } from "../services/documentosApi";
import type {
  ArchivoPendiente,
  ArchivoSubido,
  ArchivosPorTipo,
  PendientesPorTipo,
} from "../types/documentos";

function generarIdPendiente(): string {
  if (
    typeof globalThis.crypto !== "undefined" &&
    typeof globalThis.crypto.randomUUID === "function"
  ) {
    return globalThis.crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function useDocumentos(numeroContrato?: string | null) {
  const [archivos, setArchivos] = useState<ArchivoSubido[]>([]);
  const [pendientes, setPendientes] = useState<ArchivoPendiente[]>([]);
  const [cargando, setCargando] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [eliminandoId, setEliminandoId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const cargarLista = useCallback(async () => {
    const contratoValido = numeroContrato?.trim();

    if (!contratoValido) {
      setArchivos([]);
      return;
    }

    setCargando(true);
    setError(null);

    try {
      setArchivos(await documentosApi.listar(contratoValido));
    } catch (exception) {
      setError(
        exception instanceof Error
          ? exception.message
          : "No fue posible cargar los documentos.",
      );
    } finally {
      setCargando(false);
    }
  }, [numeroContrato]);

  useEffect(() => {
    void cargarLista();
  }, [cargarLista]);

  const eliminarArchivo = useCallback(async (archivoId: number) => {
    setEliminandoId(archivoId);
    setError(null);

    try {
      await documentosApi.eliminar(archivoId);
      setArchivos((actuales) =>
        actuales.filter((archivo) => archivo.id !== archivoId),
      );
    } catch (exception) {
      setError(
        exception instanceof Error
          ? exception.message
          : "No fue posible eliminar el archivo.",
      );
    } finally {
      setEliminandoId(null);
    }
  }, []);

  const seleccionarArchivos = useCallback(
    (tipoDocumento: string, files: File[]) => {
      const nuevos: ArchivoPendiente[] = files.map((file) => ({
        id: `${tipoDocumento}-${file.name}-${file.lastModified}-${generarIdPendiente()}`,
        tipoDocumento,
        file,
      }));

      setPendientes((actuales) => [...actuales, ...nuevos]);
      setError(null);
    },
    [],
  );

  const quitarPendiente = useCallback((pendienteId: string) => {
    setPendientes((actuales) =>
      actuales.filter((pendiente) => pendiente.id !== pendienteId),
    );
  }, []);

  const enviarDocumentos = useCallback(async () => {
    const contratoValido = numeroContrato?.trim();

    if (!contratoValido) {
      setError("No se ha especificado un número de contrato válido.");
      return;
    }

    if (pendientes.length === 0) {
      setError("Selecciona al menos un archivo antes de enviar.");
      return;
    }

    setEnviando(true);
    setError(null);

    try {
      const cargados: ArchivoSubido[] = [];

      for (const pendiente of pendientes) {
        const archivo = await documentosApi.cargar(
          contratoValido,
          pendiente.tipoDocumento,
          pendiente.file,
        );
        cargados.push(archivo);
      }

      setArchivos((actuales) => [...cargados.reverse(), ...actuales]);
      setPendientes([]);
    } catch (exception) {
      setError(
        exception instanceof Error
          ? exception.message
          : "No fue posible enviar los documentos.",
      );
    } finally {
      setEnviando(false);
    }
  }, [numeroContrato, pendientes]);

  const limpiarPendientes = useCallback(() => {
    setPendientes([]);
    setError(null);
  }, []);

  const archivosPorTipo = useMemo<ArchivosPorTipo>(() => {
    return archivos.reduce<ArchivosPorTipo>((acumulado, archivo) => {
      const tipo = archivo.tipoDocumento.codigo.toLowerCase();
      acumulado[tipo] ??= [];
      acumulado[tipo].push(archivo);
      return acumulado;
    }, {});
  }, [archivos]);

  const pendientesPorTipo = useMemo<PendientesPorTipo>(() => {
    return pendientes.reduce<PendientesPorTipo>((acumulado, pendiente) => {
      const tipo = pendiente.tipoDocumento.toLowerCase();
      acumulado[tipo] ??= [];
      acumulado[tipo].push(pendiente);
      return acumulado;
    }, {});
  }, [pendientes]);

  return {
    archivos,
    pendientes,
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
    recargar: cargarLista,
  };
}
