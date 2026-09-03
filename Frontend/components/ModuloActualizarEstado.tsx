// raiz components/ModuloActualizarEstado.tsx

"use client";
import React, { useEffect, useState } from "react";
import { obtenerEstadosPorTipo } from "@/services/estado.service";
import { Caso } from "@/types/leasing";
import { useBusquedaInteligente, TipoBusqueda } from "@/hooks/useBusquedaInteligente";
import { leasingApi } from "@/services/leasingApi";

interface Props {
  onCasoActualizado?: () => void;
}

interface CatalogoEstado {
  id: number;
  nombre: string;
}

export default function ModuloActualizarEstado({ onCasoActualizado }: Props) {
  const [listaEstados, setListaEstados] = useState<CatalogoEstado[]>([]);
  const [listaEstadosContrato, setListaEstadosContrato] = useState<CatalogoEstado[]>([]);
  const [listaCategorias, setListaCategorias] = useState<CatalogoEstado[]>([]);
  const [listaEtapas, setListaEtapas] = useState<CatalogoEstado[]>([]);
  const [listaSubetapas, setListaSubetapas] = useState<CatalogoEstado[]>([]);
  const [listaCausas, setListaCausas] = useState<CatalogoEstado[]>([]);
  const [listaTiposSaneamiento, setListaTiposSaneamiento] = useState<CatalogoEstado[]>([]);
  const [listaEstadosSoat, setListaEstadosSoat] = useState<CatalogoEstado[]>([]);
  const [listaEstadosTecno, setListaEstadosTecno] = useState<CatalogoEstado[]>([]);
  const [listaEstadosMatricula, setListaEstadosMatricula] = useState<CatalogoEstado[]>([]);
  const [modalBusqueda, setModalBusqueda] = useState(false);
  const [modalEdicion, setModalEdicion] = useState(false);
  const [tipoBusqueda, setTipoBusqueda] = useState<TipoBusqueda>("contrato");
  const [query, setQuery] = useState("");
  const [casoSeleccionado, setCasoSeleccionado] = useState<Caso | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    const cargarCatalogos = async () => {
      try {
        const [est, estCont, cat, et, subEt, cau, tiposSaneamiento, soat, tecno, estMatricula] = await Promise.all([
          obtenerEstadosPorTipo("ESTADO_CASO"),
          obtenerEstadosPorTipo("ESTADO_CONTRATO"),
          obtenerEstadosPorTipo("CATEGORIA"),
          obtenerEstadosPorTipo("ETAPA"),
          obtenerEstadosPorTipo("SUBETAPA"),
          obtenerEstadosPorTipo("CAUSA_ATRASO"),
          obtenerEstadosPorTipo("TIPO_SANEAMIENTO"),
          obtenerEstadosPorTipo("SOAT"),
          obtenerEstadosPorTipo("REVISION_TECNOMECANICA"),
          obtenerEstadosPorTipo("ESTADO_MATRICULA"),
        ]);
        setListaEstados(est);
        setListaEstadosContrato(estCont);
        setListaCategorias(cat);
        setListaEtapas(et);
        setListaSubetapas(subEt);
        setListaCausas(cau);
        setListaTiposSaneamiento(tiposSaneamiento);
        setListaEstadosSoat(soat);
        setListaEstadosTecno(tecno);
        setListaEstadosMatricula(estMatricula);
      } catch (err) {
        console.error("Error al cargar catálogos:", err);
      }
    };
    cargarCatalogos();
  }, []);

  const { data, isLoading, isError, error } = useBusquedaInteligente(tipoBusqueda, query);

  const handleAbrirBusqueda = () => {
    setModalBusqueda(true);
    setSaveSuccess(false);
    setSaveError(null);
  };

  const handleCerrarBusqueda = () => {
    setModalBusqueda(false);
    setQuery("");
  };

  const handleSeleccionarCaso = (caso: Caso) => {
    setCasoSeleccionado(caso);
    const procesoJuridico = Array.isArray(caso.procesoJuridico) ? caso.procesoJuridico[0] : caso.procesoJuridico;
    setFormData({
      estadoId: caso.estadoId || "",
      estadoContratoId: caso.estadoContratoId || "",
      categoriaId: caso.categoriaId || "",
      etapaId: caso.etapaId || "",
      subetapaId: caso.subetapaId || "",
      causaAtrasoId: caso.causaAtrasoId || "",
      analistaResponsable: caso.analistaResponsable || "",
      estadoMatriculaId: caso.vehiculo?.estadoMatriculaId || "",
      soat: caso.vehiculo?.soatId || "",
      revisionTecnomecanica: caso.vehiculo?.revisionTecnomecanicaId || "",
      seEnvioNotificacion: caso.seEnvioNotificacion || false,
      fechaUltimaGestion: caso.fechaUltimaGestion ? caso.fechaUltimaGestion.split("T")[0] : "",
      fechaProximaGestion: caso.fechaProximaGestion ? caso.fechaProximaGestion.split("T")[0] : "",
      observacionesGestion: caso.observacionesGestion || "",
      ultimoComentario: caso.ultimoComentario || "",
      procesoJuridico: {
        tipoSaneamientoARealizarId: procesoJuridico?.tipoSaneamientoARealizarId || "",
      },
    });
    handleCerrarBusqueda();
    setModalEdicion(true);
  };

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (name === "fechaUltimaGestion") return;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
      return;
    }
    if (name.startsWith("procesoJuridico.")) {
      const campo = name.replace("procesoJuridico.", "");
      setFormData((prev) => ({
        ...prev,
        procesoJuridico: {
          ...(prev.procesoJuridico || {}),
          [campo]: value === "" ? "" : Number(value),
        },
      }));
      return;
    }
    const esId = name.endsWith("Id") || name === "soat" || name === "revisionTecnomecanica";
    setFormData((prev) => ({
      ...prev,
      [name]: esId ? (value === "" ? "" : Number(value)) : value,
    }));
  };

  const handleGuardarCambios = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!casoSeleccionado) return;
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);
    try {
      const {
        soat,
        revisionTecnomecanica,
        estadoMatriculaId,
        fechaUltimaGestion: _fechaUltimaGestion,
        ...datosCaso
      } = formData;
      console.log("DATOS QUE SE ENVÍAN AL CASO:", datosCaso);
      console.log("TIPO SANEAMIENTO:", datosCaso.procesoJuridico?.tipoSaneamientoARealizarId);
      await leasingApi.updateCaso(casoSeleccionado.id, datosCaso);
      const datosVehiculo: Record<string, number> = {};
      if (estadoMatriculaId) datosVehiculo.estadoMatriculaId = estadoMatriculaId;
      if (soat) datosVehiculo.soatId = soat;
      if (revisionTecnomecanica) datosVehiculo.revisionTecnomecanicaId = revisionTecnomecanica;
      console.log("DATOS QUE SE ENVÍAN AL VEHÍCULO:", datosVehiculo);
      if (Object.keys(datosVehiculo).length > 0) {
        await leasingApi.updateVehiculo(casoSeleccionado.vehiculoPlaca, datosVehiculo);
      }
      setSaveSuccess(true);
      if (onCasoActualizado) onCasoActualizado();
      setTimeout(() => {
        setModalEdicion(false);
        setCasoSeleccionado(null);
        setSaveSuccess(false);
      }, 1500);
    } catch (err: any) {
      console.error("Error al actualizar estado:", err);
      setSaveError(err?.message || "Ocurrió un error al guardar los cambios.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleAbrirBusqueda}
        className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow transition-all flex items-center gap-1.5"
      >
        <span>⚡</span>
        Actualizar Estado
      </button>

      {modalBusqueda && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh] border border-slate-200">
            <div className="bg-slate-900 text-white px-5 py-3 flex justify-between items-center">
              <div>
                <h2 className="text-sm font-bold">Actualizar Estado: Buscar Caso</h2>
                <p className="text-[11px] text-slate-400">Seleccione el expediente para modificar sus etapas y estados</p>
              </div>
              <button type="button" onClick={handleCerrarBusqueda} className="text-slate-400 hover:text-white text-lg font-bold px-2 py-1">✕</button>
            </div>
            <div className="p-4 bg-slate-50 border-b flex flex-col sm:flex-row gap-2">
              <select
                value={tipoBusqueda}
                onChange={(e) => setTipoBusqueda(e.target.value as TipoBusqueda)}
                className="bg-white border border-slate-300 text-slate-800 text-xs rounded-lg px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="contrato">N° Contrato</option>
                <option value="placa">Placa Vehículo</option>
                <option value="nit">NIT Locatario</option>
              </select>
              <input
                type="text"
                placeholder={`Buscar por ${tipoBusqueda.toUpperCase()}...`}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
                className="flex-1 bg-white border border-slate-300 text-slate-900 text-xs rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {!query.trim() && <p className="text-center text-xs text-slate-400 py-8">Ingrese un término para buscar el expediente a actualizar.</p>}
              {isLoading && <p className="text-center text-xs text-amber-600 font-semibold animate-pulse py-8">Buscando en servidor...</p>}
              {isError && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-xs border border-red-200">
                  {(error as Error)?.message || "Error al consultar."}
                </div>
              )}
              {data && data.data && data.data.length === 0 && query.trim() && !isLoading && (
                <p className="text-center text-xs text-slate-500 py-8">No se encontraron coincidencias.</p>
              )}
              {data && data.data && data.data.length > 0 && (
                <div className="space-y-2">
                  <div className="divide-y border rounded-lg bg-white overflow-hidden">
                    {data.data.map((caso) => (
                      <div
                        key={caso.id}
                        onClick={() => handleSeleccionarCaso(caso)}
                        className="p-3 hover:bg-amber-50/50 cursor-pointer transition-colors flex justify-between items-center text-xs"
                      >
                        <div>
                          <p className="font-bold text-slate-800">Contrato: {caso.numeroContrato || "N/A"}</p>
                          <p className="text-slate-500 text-[11px]">
                            Placa: {caso.vehiculoPlaca || "N/A"} | Estado actual: {caso.estado?.nombre || "Sin Estado"}
                          </p>
                        </div>
                        <span className="text-amber-700 font-semibold text-[11px] bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">Actualizar ⚡</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {modalEdicion && casoSeleccionado && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-200">
            <div className="bg-slate-900 text-white px-5 py-3 flex justify-between items-center">
              <div>
                <h2 className="text-sm font-bold">Actualizar Estado del Expediente - Contrato N°{" "}{casoSeleccionado.numeroContrato}</h2>
                <p className="text-[11px] text-slate-400">Placa: {casoSeleccionado.vehiculoPlaca}</p>
              </div>
              <button type="button" onClick={() => setModalEdicion(false)} className="text-slate-400 hover:text-white text-lg font-bold px-2 py-1">✕</button>
            </div>
            <form onSubmit={handleGuardarCambios} className="flex-1 overflow-y-auto p-6 space-y-4">
              {saveSuccess && <div className="bg-emerald-50 text-emerald-700 p-3 rounded-lg text-xs border border-emerald-200 font-semibold">✓ Estado actualizado correctamente.</div>}
              {saveError && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-xs border border-red-200">{saveError}</div>}

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3">
                <h3 className="text-xs font-bold text-slate-800 border-b pb-1">1. Estado, Categoría y Etapas del Trámite</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Estado General</label>
                    <select name="estadoId" value={formData.estadoId || ""} onChange={handleChangeInput} className="w-full bg-white border border-slate-300 text-slate-900 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-500">
                      <option value="">-- Seleccione Estado --</option>
                      {listaEstados.map((item) => <option key={item.id} value={item.id}>{item.nombre}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Estado del Contrato</label>
                    <select name="estadoContratoId" value={formData.estadoContratoId || ""} onChange={handleChangeInput} className="w-full bg-white border border-slate-300 text-slate-900 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-500">
                      <option value="">-- Seleccione Estado del Contrato --</option>
                      {listaEstadosContrato.map((item) => <option key={item.id} value={item.id}>{item.nombre}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Categoría</label>
                    <select name="categoriaId" value={formData.categoriaId || ""} onChange={handleChangeInput} className="w-full bg-white border border-slate-300 text-slate-900 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-500">
                      <option value="">-- Seleccione Categoría --</option>
                      {listaCategorias.map((item) => <option key={item.id} value={item.id}>{item.nombre}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Etapa</label>
                    <select name="etapaId" value={formData.etapaId || ""} onChange={handleChangeInput} className="w-full bg-white border border-slate-300 text-slate-900 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-500">
                      <option value="">-- Seleccione Etapa --</option>
                      {listaEtapas.map((item) => <option key={item.id} value={item.id}>{item.nombre}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Subetapa</label>
                    <select name="subetapaId" value={formData.subetapaId || ""} onChange={handleChangeInput} className="w-full bg-white border border-slate-300 text-slate-900 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-500">
                      <option value="">-- Seleccione Subetapa --</option>
                      {listaSubetapas.map((item) => <option key={item.id} value={item.id}>{item.nombre}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3">
                <h3 className="text-xs font-bold text-slate-800 border-b pb-1">2. Documentación del Vehículo</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Estado SOAT</label>
                    <select name="soat" value={formData.soat || ""} onChange={handleChangeInput} className="w-full bg-white border border-slate-300 text-slate-900 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-500">
                      <option value="">-- Seleccione Estado SOAT --</option>
                      {listaEstadosSoat.map((item) => <option key={item.id} value={item.id}>{item.nombre}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Estado de Matrícula</label>
                    <select name="estadoMatriculaId" value={formData.estadoMatriculaId || ""} onChange={handleChangeInput} className="w-full bg-white border border-slate-300 text-slate-900 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-500">
                      <option value="">-- Seleccione Estado de Matrícula --</option>
                      {listaEstadosMatricula.map((item) => <option key={item.id} value={item.id}>{item.nombre}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Revisión Tecnomecánica</label>
                    <select name="revisionTecnomecanica" value={formData.revisionTecnomecanica || ""} onChange={handleChangeInput} className="w-full bg-white border border-slate-300 text-slate-900 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-500">
                      <option value="">-- Seleccione Estado Tecnomecánica --</option>
                      {listaEstadosTecno.map((item) => <option key={item.id} value={item.id}>{item.nombre}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3">
                <h3 className="text-xs font-bold text-slate-800 border-b pb-1">3. Responsables, Causas y Saneamiento</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Analista Responsable</label>
                    <input type="text" name="analistaResponsable" value={formData.analistaResponsable || ""} onChange={handleChangeInput} className="w-full bg-white border border-slate-300 text-slate-900 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-500" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Causa de Atraso</label>
                    <select name="causaAtrasoId" value={formData.causaAtrasoId || ""} onChange={handleChangeInput} className="w-full bg-white border border-slate-300 text-slate-900 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-500">
                      <option value="">-- Seleccione Causa --</option>
                      {listaCausas.map((item) => <option key={item.id} value={item.id}>{item.nombre}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Tipo Saneamiento a Realizar</label>
                  <select name="procesoJuridico.tipoSaneamientoARealizarId" value={formData.procesoJuridico?.tipoSaneamientoARealizarId || ""} onChange={handleChangeInput} className="w-full bg-white border border-slate-300 text-slate-900 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-500">
                    <option value="">-- Seleccione Tipo de Saneamiento --</option>
                    {listaTiposSaneamiento.map((item) => <option key={item.id} value={item.id}>{item.nombre}</option>)}
                  </select>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <input type="checkbox" id="seEnvioNotificacion" name="seEnvioNotificacion" checked={!!formData.seEnvioNotificacion} onChange={handleChangeInput} className="rounded border-slate-300 text-amber-600 focus:ring-amber-500 h-4 w-4" />
                  <label htmlFor="seEnvioNotificacion" className="text-xs text-slate-700 font-medium">Se envió notificación al cliente</label>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3">
                <h3 className="text-xs font-bold text-slate-800 border-b pb-1">4. Fechas de Gestión y Comentarios</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Fecha Última Gestión</label>
                    <input
                      type="date"
                      name="fechaUltimaGestion"
                      value={formData.fechaUltimaGestion || ""}
                      readOnly
                      className="w-full bg-slate-100 border border-slate-300 text-slate-900 text-xs rounded-lg px-3 py-1.5 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Fecha Próxima Gestión</label>
                    <input type="date" name="fechaProximaGestion" value={formData.fechaProximaGestion || ""} onChange={handleChangeInput} className="w-full bg-white border border-slate-300 text-slate-900 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Observaciones de Gestión</label>
                  <textarea rows={3} name="observacionesGestion" value={formData.observacionesGestion || ""} onChange={handleChangeInput} placeholder="Escriba las observaciones de la gestión..." className="w-full bg-white border border-slate-300 text-slate-900 text-xs rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-500" />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Último Comentario</label>
                  <textarea rows={3} name="ultimoComentario" value={formData.ultimoComentario || ""} onChange={handleChangeInput} placeholder="Escriba el último comentario o avance..." className="w-full bg-white border border-slate-300 text-slate-900 text-xs rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-500" />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setModalEdicion(false);
                    setCasoSeleccionado(null);
                    setSaveError(null);
                    setSaveSuccess(false);
                  }}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button type="submit" disabled={isSaving} className="px-5 py-2 bg-amber-600 hover:bg-amber-500 disabled:bg-amber-300 text-white rounded-lg text-xs font-semibold shadow transition-all">
                  {isSaving ? "Guardando..." : "Guardar Cambios"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}