"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Caso } from "@/types/leasing";
import { leasingApi } from "@/services/leasingApi";
import CrearCasoModal from "@/components/Modal/CrearCasoModal";
import LeasingTable from "@/components/Leasing/LeasingTable";
import AgregarGestionModal from "@/components/AgregarGestion";
import ModuloDetalleCaso from "@/components/ModuloDetalleCaso";
import ModuloActualizarEstado from "@/components/ModuloActualizarEstado";
import GestionDatos from "@/components/Elimininar/GestionDatos";
import GestionMasiva from "@/components/gestionMasiva";
import InyeccionMasiva from "@/components/InyeccionMasiva/InyeccionMasiva";
import CargaCasosExcel from "@/components/InyeccionMasiva/CargaCasosExcel";
import FiltrosCasos, { FiltrosSeleccionados } from "@/components/FiltrosCasos";
import Image from "next/image";

type VistaActiva = "casos" | "gestion-masiva";
type PanelActivo = "inyeccion" | "carga-casos" | "gestion-datos" | null;

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-md border px-2.5 py-1.5 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-300/60 disabled:cursor-not-allowed disabled:opacity-50";

const primaryButton = `${buttonBase} border-slate-600 bg-slate-600 text-white shadow-xs hover:-translate-y-px hover:border-slate-700 hover:bg-slate-700 hover:shadow-sm`;
const secondaryButton = `${buttonBase} border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900`;

/* Ancho completo y alineación idéntica para todos los ítems del menú lateral */
const sidebarButton =
  "flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-left text-xs font-medium text-slate-600 transition-colors hover:bg-slate-200/70 hover:text-slate-900";

const obtenerMensajeError = (error: unknown, mensajePorDefecto: string) => {
  if (error instanceof Error) return error.message;
  return mensajePorDefecto;
};

const getTextValue = (value: unknown): string => {
  if (value === null || value === undefined) return "";
  if (typeof value === "string" || typeof value === "number")
    return String(value);
  if (typeof value === "object" && "nombre" in value) {
    const nombre = (value as { nombre?: unknown }).nombre;
    return nombre === null || nombre === undefined ? "" : String(nombre);
  }
  return "";
};

export default function LeasingPage() {
  const [casos, setCasos] = useState<Caso[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [filtro, setFiltro] = useState("");
  const [filtros, setFiltros] = useState<FiltrosSeleccionados>({
    estado: "",
    categoria: "",
    etapa: "",
    subetapa: "",
  });
  const [vistaActiva, setVistaActiva] = useState<VistaActiva>("casos");

  const [modalAbierto, setModalAbierto] = useState(false);
  const [casoAEditar, setCasoAEditar] = useState<Caso | null>(null);
  const [mostrarAgregarGestion, setMostrarAgregarGestion] = useState(false);
  const [panelActivo, setPanelActivo] = useState<PanelActivo>(null);

  const cargarCasos = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const data = await leasingApi.getCasos();
      setCasos(Array.isArray(data) ? data : []);
    } catch (error: unknown) {
      console.error("Error al cargar casos:", error);
      setErrorMsg(obtenerMensajeError(error, "Error al conectar con la API."));
      setCasos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void cargarCasos();
  }, [cargarCasos]);

  const handleAbrirNuevo = () => {
    setCasoAEditar(null);
    setModalAbierto(true);
  };

  const handleAbrirEditar = (caso: Caso) => {
    setCasoAEditar(caso);
    setModalAbierto(true);
  };

  const handleEliminarCaso = async (id: number, numeroContrato: string) => {
    if (
      !confirm(
        `¿Está seguro de que desea eliminar el expediente N° ${numeroContrato}?`,
      )
    ) {
      return;
    }

    try {
      await leasingApi.deleteCaso(id);
      await cargarCasos();
    } catch (error: unknown) {
      alert(obtenerMensajeError(error, "Error al eliminar el caso."));
    }
  };

  const casosFiltrados = useMemo(
    () =>
      casos.filter((caso) => {
        const term = filtro.trim().toLowerCase();
        const coincideTexto =
          !term ||
          [
            caso.numeroContrato,
            caso.radicadoBizagi,
            caso.vehiculoPlaca,
            caso.locatario?.nit,
            caso.locatario?.nombreBanco,
            caso.locatario?.nombreComercial,
            caso.analistaResponsable,
            caso.vehiculo?.marca,
            caso.vehiculo?.linea,
          ].some((valor) =>
            String(valor ?? "")
              .toLowerCase()
              .includes(term),
          );

        const coincideFiltros =
          (!filtros.estado || getTextValue(caso.estado) === filtros.estado) &&
          (!filtros.categoria ||
            getTextValue(caso.categoria) === filtros.categoria) &&
          (!filtros.etapa ||
            getTextValue((caso as Caso & { etapa?: unknown }).etapa) ===
              filtros.etapa) &&
          (!filtros.subetapa ||
            getTextValue((caso as Caso & { subetapa?: unknown }).subetapa) ===
              filtros.subetapa);

        return coincideTexto && coincideFiltros;
      }),
    [casos, filtro, filtros],
  );

  const cerrarPaneles = () => {
    setPanelActivo(null);
  };

  const casosConAnalista = casos.filter((caso) =>
    Boolean(caso.analistaResponsable),
  ).length;
  const casosSinAnalista = Math.max(casos.length - casosConAnalista, 0);

  const limpiarFiltros = () => {
    setFiltros({ estado: "", categoria: "", etapa: "", subetapa: "" });
  };

  const abrirCasos = () => {
    cerrarPaneles();
    setVistaActiva("casos");
  };

  const abrirGestionMasiva = () => {
    cerrarPaneles();
    setVistaActiva("gestion-masiva");
  };

  return (
    <div className="flex min-h-screen w-full bg-white font-sans text-xs text-slate-800 [zoom:0.85]">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-slate-200 bg-slate-50 lg:flex">
<div className="border-b border-slate-200 bg-white px-4 py-4">
  <div className="flex flex-col items-center justify-center gap-2 text-center">
    <Image
      src="/image/GP L-06.png"
      alt="Gómez Pineda Abogados"
      width={200}
      height={50}
      className="h-12 w-auto object-contain"
      priority
    />
    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
      <span className="text-slate-800 font-extrabold">NODEX</span> · Gestión vehicular
    </p>
  </div>
</div>

        <nav
          className="flex-1 overflow-y-auto px-3 py-3.5"
          aria-label="Navegación principal"
        >
          <p className="mb-1.5 px-2.5 text-[9px] font-bold uppercase tracking-widest text-slate-400">
            Operación
          </p>
          <div className="space-y-0.5">
            <button
              type="button"
              onClick={abrirCasos}
              className={`${sidebarButton} ${vistaActiva === "casos" ? "bg-slate-200 font-bold text-slate-900" : ""}`}
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-[10px] text-slate-500 shadow-xs">
                01
              </span>
              <span>Casos</span>
            </button>
            <div className="w-full [&>button]:!flex [&>button]:!w-full [&>button]:!items-center [&>button]:!gap-2.5 [&>button]:!justify-start [&>button]:!border-0 [&>button]:!bg-transparent [&>button]:!px-2.5 [&>button]:!py-1.5 [&>button]:!text-xs [&>button]:!font-medium [&>button]:!text-slate-600 [&>button:hover]:!bg-slate-200/70 [&>button:hover]:!text-slate-900">
              <ModuloDetalleCaso />
            </div>
            <button
              type="button"
              onClick={() => setMostrarAgregarGestion(true)}
              className={sidebarButton}
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-[10px] text-slate-500 shadow-xs">
                02
              </span>
              <span>Agregar gestión</span>
            </button>
            <div className="w-full [&>button]:!flex [&>button]:!w-full [&>button]:!items-center [&>button]:!gap-2.5 [&>button]:!justify-start [&>button]:!border-0 [&>button]:!bg-transparent [&>button]:!px-2.5 [&>button]:!py-1.5 [&>button]:!text-xs [&>button]:!font-medium [&>button]:!text-slate-600 [&>button:hover]:!bg-slate-200/70 [&>button:hover]:!text-slate-900">
              <ModuloActualizarEstado onCasoActualizado={cargarCasos} />
            </div>
          </div>

          <p className="mb-1.5 mt-5 px-2.5 text-[9px] font-bold uppercase tracking-widest text-slate-400">
            Herramientas
          </p>
          <div className="space-y-0.5">
            <button
              type="button"
              onClick={() => setPanelActivo("inyeccion")}
              className={sidebarButton}
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-[10px] text-slate-500 shadow-xs">
                03
              </span>
              <span>Vehículos</span>
            </button>
            <button
              type="button"
              onClick={() => setPanelActivo("carga-casos")}
              className={sidebarButton}
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-[10px] text-slate-500 shadow-xs">
                04
              </span>
              <span>Carga de casos</span>
            </button>
            <button
              type="button"
              onClick={abrirGestionMasiva}
              className={`${sidebarButton} ${vistaActiva === "gestion-masiva" ? "bg-slate-200 font-bold text-slate-900" : ""}`}
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-[10px] text-slate-500 shadow-xs">
                05
              </span>
              <span>Gestión masiva</span>
            </button>
            <button
              type="button"
              onClick={() => setPanelActivo("gestion-datos")}
              className={sidebarButton}
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-[10px] text-slate-500 shadow-xs">
                06
              </span>
              <span>Gestionar datos</span>
            </button>
          </div>

          <FiltrosCasos
            casos={casos}
            filtros={filtros}
            onChange={setFiltros}
            onClear={limpiarFiltros}
          />
        </nav>

        <div className="border-t border-slate-200 bg-white px-4 py-3">
          <p className="text-[11px] font-semibold text-slate-700">
            Panel administrativo
          </p>
          <p className="mt-0.5 text-[10px] leading-normal text-slate-400">
            Administra los expedientes desde un solo lugar.
          </p>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="shrink-0 border-b border-slate-200 bg-white">
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-5 lg:px-6">
            <div>
              <div className="mb-1 lg:hidden">
                <Image
                  src="/image/GP L-06.png"
                  alt="Gómez Pineda Abogados"
                  width={140}
                  height={35}
                  className="h-7 w-auto object-contain"
                  priority
                />
              </div>
              <h2 className="text-base font-bold tracking-tight text-slate-900">
                {vistaActiva === "casos"
                  ? "Expedientes activos"
                  : "Gestión masiva"}
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                {vistaActiva === "casos"
                  ? "Consulta, actualiza y administra los trámites registrados."
                  : "Administra múltiples expedientes de forma centralizada."}
              </p>
            </div>

            <button
              type="button"
              onClick={handleAbrirNuevo}
              className={`${primaryButton} px-3`}
            >
              <span className="text-sm leading-none">+</span>
              Nuevo caso
            </button>
          </div>
        </header>

        {vistaActiva === "casos" && (
          <div className="shrink-0 border-b border-slate-200 bg-slate-50/70">
            <div className="flex flex-wrap items-center justify-between gap-2.5 px-4 py-2.5 sm:px-5 lg:px-6">
              <div className="relative w-full max-w-xl">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  ⌕
                </span>
                <input
                  type="search"
                  placeholder="Buscar por contrato, radicado, placa, NIT, banco, marca o analista..."
                  value={filtro}
                  onChange={(event) => setFiltro(event.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-white py-1.5 pl-8 pr-2.5 text-xs text-slate-800 shadow-xs outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200/70"
                  aria-label="Buscar expedientes"
                />
              </div>

              <div className="flex items-center gap-2.5 text-[11px] text-slate-500">
                <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 shadow-xs">
                  Registros visibles:{" "}
                  <strong className="text-slate-800">
                    {casosFiltrados.length}
                  </strong>
                  <span className="mx-1 text-slate-300">/</span>
                  {casos.length}
                </span>
                {filtro && (
                  <button
                    type="button"
                    onClick={() => setFiltro("")}
                    className="font-semibold text-slate-600 underline-offset-4 hover:text-slate-900 hover:underline"
                  >
                    Limpiar búsqueda
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {errorMsg && (
          <div
            role="alert"
            className="flex shrink-0 items-center justify-between border-l-4 border-red-400 bg-red-50 px-4 py-2.5 text-xs text-red-800 sm:px-5 lg:px-6"
          >
            <span>{errorMsg}</span>
            <button
              type="button"
              onClick={() => void cargarCasos()}
              className="ml-3 rounded-md px-2 py-0.5 font-bold text-red-700 underline hover:bg-red-100"
            >
              Reintentar
            </button>
          </div>
        )}

        <main className="flex-1 overflow-auto bg-white p-3.5 sm:p-5 lg:p-6">
          {vistaActiva === "casos" && (
            <div className="mx-auto mb-4 grid w-full max-w-[1600px] grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-xs">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                  Total expedientes
                </p>
                <p className="mt-1 text-xl font-bold text-slate-900">
                  {casos.length}
                </p>
                <p className="mt-0.5 text-[10px] text-slate-500">
                  Registros en el sistema
                </p>
              </div>
              <div className="rounded-lg border border-[#d8e8e4] bg-[#f7fbfa] p-3 shadow-xs">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-[#52716b]">
                  Vista actual
                </p>
                <p className="mt-1 text-xl font-bold text-[#347365]">
                  {casosFiltrados.length}
                </p>
                <p className="mt-0.5 text-[10px] text-slate-500">
                  Expedientes visibles
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-xs">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                  Con responsable
                </p>
                <p className="mt-1 text-xl font-bold text-slate-900">
                  {casosConAnalista}
                </p>
                <p className="mt-0.5 text-[10px] text-slate-500">
                  Casos asignados
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-xs">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                  Por asignar
                </p>
                <p className="mt-1 text-xl font-bold text-slate-900">
                  {casosSinAnalista}
                </p>
                <p className="mt-0.5 text-[10px] text-slate-500">
                  Requieren seguimiento
                </p>
              </div>
            </div>
          )}

          {vistaActiva === "gestion-masiva" ? (
            <div className="mx-auto min-h-full w-full max-w-[1600px]">
              <GestionMasiva
                casos={casosFiltrados}
                onClose={abrirCasos}
                onActualizado={cargarCasos}
              />
            </div>
          ) : (
            <div className="mx-auto w-full max-w-[1600px] space-y-4">
              {panelActivo && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={cerrarPaneles}
                    className={secondaryButton}
                  >
                    Cerrar panel activo
                  </button>
                </div>
              )}

              {panelActivo === "inyeccion" && (
                <InyeccionMasiva onClose={() => setPanelActivo(null)} />
              )}
              {panelActivo === "carga-casos" && (
                <CargaCasosExcel onClose={() => setPanelActivo(null)} />
              )}
              {panelActivo === "gestion-datos" && (
                <GestionDatos onClose={() => setPanelActivo(null)} />
              )}

              <section className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs sm:p-4 lg:p-5">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2.5 border-b border-slate-100 pb-3">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                      Panel operativo
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Listado general de expedientes registrados.
                    </p>
                  </div>
                  <span className="hidden rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-500 sm:inline-flex">
                    Vista general
                  </span>
                </div>

                <LeasingTable
                  casos={casosFiltrados}
                  loading={loading}
                  onEditar={handleAbrirEditar}
                  onEliminar={handleEliminarCaso}
                />
              </section>
            </div>
          )}
        </main>
      </div>

      <CrearCasoModal
        isOpen={modalAbierto}
        onClose={() => {
          setModalAbierto(false);
          setCasoAEditar(null);
        }}
        onCasoCreado={cargarCasos}
        casoAEditar={casoAEditar}
      />

      {mostrarAgregarGestion && (
        <AgregarGestionModal onClose={() => setMostrarAgregarGestion(false)} />
      )}
    </div>
  );
}