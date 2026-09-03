//razi components/AgregarGestion

"use client";

import React, { useState } from "react";
import {
  useBusquedaInteligente,
  TipoBusqueda,
} from "@/hooks/useBusquedaInteligente";
import { useCrearGestion, useHistorialGestiones } from "@/hooks/useGestion";

interface AgregarGestionProps {
  onClose?: () => void;
}

export default function AgregarGestion({ onClose }: AgregarGestionProps) {
  const [tipoBusqueda, setTipoBusqueda] = useState<TipoBusqueda>("contrato");
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [casoSeleccionado, setCasoSeleccionado] = useState<any>(null);
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [tipoObservacion, setTipoObservacion] = useState("Gestión");
  const [comentario, setComentario] = useState("");
  const [fechaProximaGestion, setFechaProximaGestion] = useState("");
  const [analistaResponsable, setAnalistaResponsable] = useState("");

  const {
    data: resultadoBusqueda,
    isLoading: buscando,
    isError: errorBusqueda,
  } = useBusquedaInteligente(tipoBusqueda, terminoBusqueda);

  const { data: historial, isLoading: cargandoHistorial } =
    useHistorialGestiones(casoSeleccionado?.id ?? null);

  const crearGestion = useCrearGestion();

  const seleccionarCaso = (caso: any) => {
    if (!caso?.id) {
      return;
    }

    setCasoSeleccionado(caso);
    setMostrarResultados(false);
  };

  const handleGuardar = (e: React.FormEvent) => {
    e.preventDefault();

    if (!casoSeleccionado?.id) {
      alert("Primero debes seleccionar un caso.");
      return;
    }

    if (!tipoObservacion) {
      alert("Selecciona el tipo de observación.");
      return;
    }

    if (!comentario.trim()) {
      alert("Escribe una observación o comentario.");
      return;
    }

    if (!analistaResponsable.trim()) {
      alert("Escribe el analista responsable.");
      return;
    }

    crearGestion.mutate(
      {
        casoId: casoSeleccionado.id,
        tipoObservacion,
        comentario: comentario.trim(),
        fechaProximaGestion: fechaProximaGestion || null,
        analistaResponsable: analistaResponsable.trim(),
      },
      {
        onSuccess: () => {
          setComentario("");
          setFechaProximaGestion("");
          setAnalistaResponsable("");
          alert("Gestión registrada correctamente.");
        },
        onError: (error) => {
          alert(
            error instanceof Error
              ? error.message
              : "Error al registrar la gestión.",
          );
        },
      },
    );
  };

  const resultados = resultadoBusqueda?.data ?? [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Agregar Gestión
            </h2>
            <p className="text-sm text-slate-500">
              Registra una nueva gestión y consulta la trazabilidad del caso.
            </p>
          </div>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-3 py-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
            >
              ✕
            </button>
          )}
        </div>

        <div className="space-y-6 p-6">
          <section className="rounded-xl border border-slate-200 bg-slate-50 p-5">
            <h3 className="mb-4 text-sm font-bold text-slate-800">
              1. Buscar Caso
            </h3>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">
                  Buscar por
                </label>

                <select
                  value={tipoBusqueda}
                  onChange={(e) => {
                    setTipoBusqueda(e.target.value as TipoBusqueda);
                    setTerminoBusqueda("");
                    setCasoSeleccionado(null);
                    setMostrarResultados(false);
                  }}
                  className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="contrato">Contrato</option>
                  <option value="placa">Placa</option>
                  <option value="nit">NIT</option>
                </select>
              </div>

              <div className="relative md:col-span-3">
                <label className="mb-1 block text-xs font-semibold text-slate-600">
                  Número de búsqueda
                </label>

                <input
                  type="text"
                  value={terminoBusqueda}
                  onFocus={() => {
                    if (terminoBusqueda.trim()) {
                      setMostrarResultados(true);
                    }
                  }}
                  onChange={(e) => {
                    setTerminoBusqueda(e.target.value);
                    setMostrarResultados(true);
                    setCasoSeleccionado(null);
                  }}
                  placeholder={
                    tipoBusqueda === "contrato"
                      ? "Escribe el número de contrato..."
                      : tipoBusqueda === "placa"
                        ? "Escribe la placa..."
                        : "Escribe el NIT..."
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                {mostrarResultados && terminoBusqueda.trim() && (
                  <div className="absolute left-0 right-0 top-full z-50 mt-1 rounded-lg border border-slate-200 bg-white shadow-xl">
                    {buscando && (
                      <div className="p-4 text-center text-sm text-slate-500">
                        Buscando...
                      </div>
                    )}

                    {!buscando && errorBusqueda && (
                      <div className="p-4 text-center text-sm text-red-500">
                        Error al buscar el caso.
                      </div>
                    )}

                    {!buscando && !errorBusqueda && resultados.length > 0 && (
                      <div className="max-h-64 overflow-y-auto">
                        {resultados.map((caso: any) => {
                          console.log("CASO BUSQUEDA:", caso);
                          console.log("ESTADO:", caso.estado);

                          return (
                            <button
                              key={caso.id}
                              type="button"
                              onClick={() => seleccionarCaso(caso)}
                              className="w-full border-b border-slate-100 p-4 text-left last:border-b-0 hover:bg-blue-50"
                            >
                              <p className="font-semibold text-slate-800">
                                Caso encontrado
                              </p>

                              <div className="mt-1 space-y-1 text-xs text-slate-500">
                                <p>
                                  Contrato:{" "}
                                  <span className="font-medium text-slate-700">
                                    {caso.numeroContrato || "N/A"}
                                  </span>
                                </p>

                                <p>
                                  Placa:{" "}
                                  <span className="font-medium text-slate-700">
                                    {caso.vehiculoPlaca ||
                                      caso.vehiculo?.placa ||
                                      "N/A"}
                                  </span>
                                </p>

                                <p>
                                  Estado:{" "}
                                  <span className="font-medium text-slate-700">
                                    {caso.estado?.nombre || "N/A"}
                                  </span>
                                </p>
                              </div>
                            </button>
                          );
                        })}

                        {!buscando &&
                          !errorBusqueda &&
                          resultadoBusqueda &&
                          resultados.length === 0 && (
                            <div className="p-4 text-center text-sm text-slate-500">
                              No se encontró ningún caso.
                            </div>
                          )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {casoSeleccionado && (
              <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-green-700">
                    CASO SELECCIONADO
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setCasoSeleccionado(null);
                      setTerminoBusqueda("");
                    }}
                    className="text-xs font-medium text-green-700 hover:text-green-900"
                  >
                    Cambiar
                  </button>
                </div>

                <div className="mt-2 grid grid-cols-1 gap-3 md:grid-cols-4">
                  <div>
                    <span className="text-xs text-slate-500">Contrato</span>
                    <p className="font-semibold text-slate-800">
                      {casoSeleccionado.numeroContrato || "N/A"}
                    </p>
                  </div>

                  <div>
                    <span className="text-xs text-slate-500">Placa</span>
                    <p className="font-semibold text-slate-800">
                      {casoSeleccionado.vehiculoPlaca ||
                        casoSeleccionado.vehiculo?.placa ||
                        "N/A"}
                    </p>
                  </div>

                  <div>
                    <span className="text-xs text-slate-500">Estado</span>
                    <p className="font-semibold text-slate-800">
                      {casoSeleccionado.estado?.nombre || "N/A"}
                    </p>
                  </div>

                  <div>
                    <span className="text-xs text-slate-500">ID</span>
                    <p className="truncate text-xs text-slate-600">
                      {casoSeleccionado.id}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </section>

          <form
            onSubmit={handleGuardar}
            className="rounded-xl border border-slate-200 bg-white p-5"
          >
            <h3 className="mb-4 text-sm font-bold text-slate-800">
              2. Nueva Gestión
            </h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">
                  Tipo de Observación *
                </label>

                <select
                  value={tipoObservacion}
                  onChange={(e) => setTipoObservacion(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Gestión">Gestión</option>
                  <option value="GP">GP</option>
                  <option value="Jurídico">Jurídico</option>
                  <option value="Operativo">Operativo</option>
                  <option value="Documental">Documental</option>
                  <option value="Tránsito">Tránsito</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">
                  Analista Responsable *
                </label>

                <input
                  type="text"
                  value={analistaResponsable}
                  onChange={(e) => setAnalistaResponsable(e.target.value)}
                  placeholder="Nombre del analista"
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-xs font-semibold text-slate-600">
                  Observación / Comentario *
                </label>

                <textarea
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  rows={5}
                  placeholder="Escribe aquí el detalle de la gestión realizada..."
                  className="w-full resize-none rounded-lg border border-slate-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">
                  Fecha Próxima Gestión
                </label>

                <input
                  type="date"
                  value={fechaProximaGestion}
                  onChange={(e) => setFechaProximaGestion(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-3">
              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg bg-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-300"
                >
                  Cancelar
                </button>
              )}

              <button
                type="submit"
                disabled={crearGestion.isPending || !casoSeleccionado}
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {crearGestion.isPending ? "Guardando..." : "Guardar Gestión"}
              </button>
            </div>
          </form>

          {casoSeleccionado && (
            <section className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <h3 className="mb-4 text-sm font-bold text-slate-800">
                3. Historial de Gestiones
              </h3>

              {cargandoHistorial && (
                <div className="py-6 text-center text-sm text-slate-500">
                  Cargando historial...
                </div>
              )}

              {!cargandoHistorial &&
                (!historial || historial.length === 0) && (
                  <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
                    Este caso todavía no tiene gestiones registradas.
                  </div>
                )}

              {!cargandoHistorial && historial && historial.length > 0 && (
                <div className="space-y-3">
                  {historial.map((gestion) => (
                    <div
                      key={gestion.id}
                      className="rounded-lg border border-slate-200 bg-white p-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">
                          {gestion.tipoObservacion}
                        </span>

                        <span className="text-xs text-slate-500">
                          {new Date(gestion.fechaGestion).toLocaleString(
                            "es-CO",
                          )}
                        </span>
                      </div>

                      <p className="mt-3 whitespace-pre-wrap text-sm text-slate-700">
                        {gestion.comentario}
                      </p>

                      {gestion.analistaResponsable && (
                        <p className="mt-3 text-xs text-slate-500">
                          Analista:{" "}
                          <span className="font-semibold">
                            {gestion.analistaResponsable}
                          </span>
                        </p>
                      )}

                      {gestion.fechaProximaGestion && (
                        <p className="mt-1 text-xs text-slate-500">
                          Próxima gestión:{" "}
                          <span className="font-semibold">
                            {new Date(
                              gestion.fechaProximaGestion,
                            ).toLocaleDateString("es-CO")}
                          </span>
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}