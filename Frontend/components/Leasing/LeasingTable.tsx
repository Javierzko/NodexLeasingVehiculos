// raiz components/Leasing/LeasingTable.tsx

import type { Caso } from "@/types/leasing";
import EstadoDocumentoVehiculo from "./EstadoDocumentoVehiculo";

const TOTAL_COLUMNAS = 84;

const dateFormatter = new Intl.DateTimeFormat("es-CO");
const currencyFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

interface LeasingTableProps {
  casos: Caso[];
  loading: boolean;
  onEditar: (caso: Caso) => void;
  onEliminar: (id: number, numeroContrato: string) => void;
}

const formatDate = (dateStr?: string | Date | null) => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return Number.isNaN(date.getTime()) ? "-" : dateFormatter.format(date);
};

const formatCurrency = (val?: string | number | null) => {
  if (val === undefined || val === null || val === "") return "-";
  const numericValue = typeof val === "number" ? val : Number(val);
  return Number.isFinite(numericValue)
    ? currencyFormatter.format(numericValue)
    : "-";
};

export default function LeasingTable({
  casos,
  loading,
  onEditar,
  onEliminar,
}: LeasingTableProps) {
  return (
    <div
      className="inline-block min-w-full overflow-x-auto rounded-xl border border-slate-200 bg-white align-middle shadow-sm"
      role="region"
      aria-label="Tabla de expedientes de leasing"
      tabIndex={0}
    >
      <table className="min-w-full border-collapse whitespace-nowrap text-left text-xs">
        <thead className="sticky top-0 z-20 bg-slate-200 font-bold uppercase tracking-wider text-slate-800 shadow-sm">
          <tr>
            <th
              scope="col"
              className="sticky left-0 z-30 border bg-slate-400 px-3 py-2 text-slate-900 shadow-md"
            >
              Acciones
            </th>

            <th scope="col" className="border bg-slate-300 px-3 py-2">N° Contrato</th>
            <th scope="col" className="border bg-slate-300 px-3 py-2">Radicado Bizagi</th>
            <th scope="col" className="border bg-slate-300 px-3 py-2">Estado Contrato</th>
            <th scope="col" className="border bg-slate-300 px-3 py-2">Analista Responsable</th>
            <th scope="col" className="border bg-slate-300 px-3 py-2">Fecha Caso</th>
            <th scope="col" className="border bg-slate-300 px-3 py-2">Fecha Asignación</th>
            <th scope="col" className="border bg-slate-300 px-3 py-2">Fecha Cierre Traspaso</th>
            <th scope="col" className="border bg-slate-300 px-3 py-2">Estado</th>
            <th scope="col" className="border bg-slate-300 px-3 py-2">Categoría</th>
            <th scope="col" className="border bg-slate-300 px-3 py-2">Etapa</th>
            <th scope="col" className="border bg-slate-300 px-3 py-2">Estado Matrícula</th>
            <th scope="col" className="border bg-slate-300 px-3 py-2">Tipo Saneamiento A Realizar</th>
            <th scope="col" className="border bg-slate-300 px-3 py-2">Subetapa</th>
            <th scope="col" className="border bg-slate-300 px-3 py-2">Causa Atraso</th>
            <th scope="col" className="border bg-slate-300 px-3 py-2">Última Gestión</th>
            <th scope="col" className="border bg-slate-300 px-3 py-2">Próxima Gestión</th>
            <th scope="col" className="border bg-slate-300 px-3 py-2">Observaciones Gestión</th>
            <th scope="col" className="border bg-slate-300 px-3 py-2">Último Comentario</th>

            <th scope="col" className="border bg-indigo-100 px-3 py-2 text-indigo-900">Envió Notificación</th>
            <th scope="col" className="border bg-indigo-100 px-3 py-2 text-indigo-900">Fecha Debes Enviar Notif.</th>
            <th scope="col" className="border bg-indigo-100 px-3 py-2 text-indigo-900">Notificación Inicial</th>
            <th scope="col" className="border bg-indigo-100 px-3 py-2 text-indigo-900">Última Notificación</th>
            <th scope="col" className="border bg-indigo-100 px-3 py-2 text-indigo-900">Próxima Notificación</th>
            <th scope="col" className="border bg-indigo-100 px-3 py-2 text-indigo-900">Traspaso Con Cita</th>
            <th scope="col" className="border bg-indigo-100 px-3 py-2 text-indigo-900">Fecha Cita Tránsito</th>
            <th scope="col" className="border bg-indigo-100 px-3 py-2 text-indigo-900">Fecha Radicación Traspaso</th>
            <th scope="col" className="border bg-indigo-100 px-3 py-2 text-indigo-900">Fecha Rechazo</th>
            <th scope="col" className="border bg-indigo-100 px-3 py-2 text-indigo-900">Fecha Subsanación Rechazo</th>
            <th scope="col" className="border bg-indigo-100 px-3 py-2 text-indigo-900">Traspaso Aprobado</th>
            <th scope="col" className="border bg-indigo-100 px-3 py-2 text-indigo-900">Fecha Entrega TP Locatario</th>

            <th scope="col" className="border bg-yellow-100 px-3 py-2 text-yellow-900">Honorarios GP</th>
            <th scope="col" className="border bg-yellow-100 px-3 py-2 text-yellow-900">Facturado GP</th>
            <th scope="col" className="border bg-yellow-100 px-3 py-2 text-yellow-900">N° Factura GP</th>
            <th scope="col" className="border bg-yellow-100 px-3 py-2 text-yellow-900">Honorarios Jurídicos</th>
            <th scope="col" className="border bg-yellow-100 px-3 py-2 text-yellow-900">Facturado Jurídico</th>
            <th scope="col" className="border bg-yellow-100 px-3 py-2 text-yellow-900">N° Factura Jurídico</th>
            <th scope="col" className="border bg-yellow-100 px-3 py-2 text-yellow-900">Tiempo Ent. Externas (días)</th>
            <th scope="col" className="border bg-yellow-100 px-3 py-2 text-yellow-900">Tiempo Banco (días)</th>
            <th scope="col" className="border bg-yellow-100 px-3 py-2 text-yellow-900">Tiempo Jurídico Ext. (días)</th>
            <th scope="col" className="border bg-yellow-100 px-3 py-2 text-yellow-900">Tiempo Jurídico Int. (días)</th>
            <th scope="col" className="border bg-yellow-100 px-3 py-2 text-yellow-900">Tiempo Tránsito (días)</th>
            <th scope="col" className="border bg-yellow-100 px-3 py-2 text-yellow-900">Tiempo Op. Analista (días)</th>

            <th scope="col" className="border bg-blue-100 px-3 py-2 text-blue-900">Locatario NIT</th>
            <th scope="col" className="border bg-blue-100 px-3 py-2 text-blue-900">Locatario Banco</th>
            <th scope="col" className="border bg-blue-100 px-3 py-2 text-blue-900">Tipo Doc</th>
            <th scope="col" className="border bg-blue-100 px-3 py-2 text-blue-900">Email</th>
            <th scope="col" className="border bg-blue-100 px-3 py-2 text-blue-900">Rev. Correo</th>
            <th scope="col" className="border bg-blue-100 px-3 py-2 text-blue-900">Contacto Nombre</th>
            <th scope="col" className="border bg-blue-100 px-3 py-2 text-blue-900">Contacto Número</th>
            <th scope="col" className="border bg-blue-100 px-3 py-2 text-blue-900">Dirección Envío</th>
            <th scope="col" className="border bg-blue-100 px-3 py-2 text-blue-900">Locatario RUNT</th>
            <th scope="col" className="border bg-blue-100 px-3 py-2 text-blue-900">Nombre Comercial</th>

            <th scope="col" className="border bg-emerald-100 px-3 py-2 text-emerald-900">Placa</th>
            <th scope="col" className="border bg-emerald-100 px-3 py-2 text-emerald-900">VIN</th>
            <th scope="col" className="border bg-emerald-100 px-3 py-2 text-emerald-900">Marca</th>
            <th scope="col" className="border bg-emerald-100 px-3 py-2 text-emerald-900">Línea</th>
            <th scope="col" className="border bg-emerald-100 px-3 py-2 text-emerald-900">Modelo</th>
            <th scope="col" className="border bg-emerald-100 px-3 py-2 text-emerald-900">Cilindraje</th>
            <th scope="col" className="border bg-emerald-100 px-3 py-2 text-emerald-900">Motor</th>
            <th scope="col" className="border bg-emerald-100 px-3 py-2 text-emerald-900">Tipo Vehículo</th>
            <th scope="col" className="border bg-emerald-100 px-3 py-2 text-emerald-900">Tránsito</th>
            <th scope="col" className="border bg-emerald-100 px-3 py-2 text-emerald-900">SOAT</th>
            <th scope="col" className="border bg-emerald-100 px-3 py-2 text-emerald-900">Vigencia SOAT</th>
            <th scope="col" className="border bg-emerald-100 px-3 py-2 text-emerald-900">Revisión Tecnomecánica</th>

            <th scope="col" className="border bg-teal-100 px-3 py-2 text-teal-900">Propietario Identificación</th>
            <th scope="col" className="border bg-teal-100 px-3 py-2 text-teal-900">Propietario Nombre</th>

            <th scope="col" className="border bg-amber-100 px-3 py-2 text-amber-900">Escalamiento Ent. Ex</th>
            <th scope="col" className="border bg-amber-100 px-3 py-2 text-amber-900">Respuesta Ent. Ex</th>
            <th scope="col" className="border bg-amber-100 px-3 py-2 text-amber-900">Liq. Total Pasivos</th>
            <th scope="col" className="border bg-amber-100 px-3 py-2 text-amber-900">Solicitud Recursos</th>
            <th scope="col" className="border bg-amber-100 px-3 py-2 text-amber-900">Desembolso Recursos</th>
            <th scope="col" className="border bg-amber-100 px-3 py-2 text-amber-900">Radicado DP</th>
            <th scope="col" className="border bg-amber-100 px-3 py-2 text-amber-900">Respuesta DP</th>
            <th scope="col" className="border bg-amber-100 px-3 py-2 text-amber-900">Radicado Tutela</th>
            <th scope="col" className="border bg-amber-100 px-3 py-2 text-amber-900">Juzgado</th>

            <th scope="col" className="border bg-rose-100 px-3 py-2 text-rose-900">Limitaciones Propiedad</th>
            <th scope="col" className="border bg-rose-100 px-3 py-2 text-rose-900">Garantías Mobiliarias</th>
            <th scope="col" className="border bg-rose-100 px-3 py-2 text-rose-900">SIMIT Propietario</th>
            <th scope="col" className="border bg-rose-100 px-3 py-2 text-rose-900">SIMIT Locatario</th>
            <th scope="col" className="border bg-rose-100 px-3 py-2 text-rose-900">Multas Placa</th>
            <th scope="col" className="border bg-rose-100 px-3 py-2 text-rose-900">Impuestos</th>
            <th scope="col" className="border bg-rose-100 px-3 py-2 text-rose-900">Vigencias Adeudadas</th>
            <th scope="col" className="border bg-rose-100 px-3 py-2 text-rose-900">Impuestos Tránsito</th>
          </tr>
        </thead>

        <tbody
          className="divide-y divide-slate-200 bg-white"
          aria-busy={loading}
        >
          {loading ? (
            <tr>
              <td
                colSpan={TOTAL_COLUMNAS}
                className="py-12 text-center font-medium text-slate-500"
              >
                Cargando expedientes del sistema...
              </td>
            </tr>
          ) : casos.length === 0 ? (
            <tr>
              <td
                colSpan={TOTAL_COLUMNAS}
                className="py-12 text-center font-medium text-slate-500"
              >
                No hay expedientes registrados.
              </td>
            </tr>
          ) : (
            casos.map((caso) => {
              const procJur = Array.isArray(caso.procesoJuridico)
                ? caso.procesoJuridico[0]
                : caso.procesoJuridico;
              const audMulta = Array.isArray(caso.auditoriaMulta)
                ? caso.auditoriaMulta[0]
                : caso.auditoriaMulta;
              const prop = caso.vehiculo?.propietario;

              return (
                <tr
                  key={caso.id}
                  className="transition-colors hover:bg-[#f5fbf9]"
                >
                  <td className="sticky left-0 z-10 border bg-white px-2 py-2 shadow-sm">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onEditar(caso)}
                        title="Editar expediente"
                        aria-label={`Editar expediente ${caso.numeroContrato}`}
                        className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="h-3.5 w-3.5"
                        >
                          <path d="M12 20h9" />
                          <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
                        </svg>
                        Editar
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          onEliminar(caso.id, caso.numeroContrato)
                        }
                        title="Eliminar expediente"
                        aria-label={`Eliminar expediente ${caso.numeroContrato}`}
                        className="inline-flex items-center gap-1.5 rounded-md border border-red-200 bg-white px-2.5 py-1.5 text-xs font-medium text-red-600 shadow-sm transition hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-200"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="h-3.5 w-3.5"
                        >
                          <path d="M3 6h18" />
                          <path d="M8 6V4h8v2" />
                          <path d="m19 6-1 14H6L5 6" />
                          <path d="M10 11v5M14 11v5" />
                        </svg>
                        Borrar
                      </button>
                    </div>
                  </td>

                  <td className="border px-3 py-2 font-bold text-[#347365]">
                    {caso.numeroContrato}
                  </td>
                  <td className="border px-3 py-1.5">{caso.radicadoBizagi || "-"}</td>
                  <td className="border px-3 py-1.5">{caso.estadoContrato?.nombre || "-"}</td>
                  <td className="border px-3 py-1.5">{caso.analistaResponsable || "-"}</td>
                  <td className="border px-3 py-1.5">{formatDate(caso.fecha)}</td>
                  <td className="border px-3 py-1.5">{formatDate(caso.fechaAsignacion)}</td>
                  <td className="border px-3 py-1.5">{formatDate(caso.fechaCierreTraspaso)}</td>
                  <td className="border px-3 py-1.5">{caso.estado?.nombre || "-"}</td>
                  <td className="border px-3 py-1.5">{caso.categoria?.nombre || "-"}</td>
                  <td className="border px-3 py-1.5">{caso.etapa?.nombre || "-"}</td>
                  <td className="border px-3 py-1.5">{caso.vehiculo?.estadoMatricula?.nombre || "-"}</td>
                  <td className="border px-3 py-1.5">{procJur?.tipoSaneamientoARealizar?.nombre || "-"}</td>
                  <td className="border px-3 py-1.5">{caso.subetapa?.nombre || "-"}</td>
                  <td className="border px-3 py-1.5">{caso.causaAtraso?.nombre || "-"}</td>
                  <td className="border px-3 py-1.5">{formatDate(caso.fechaUltimaGestion)}</td>
                  <td className="border px-3 py-1.5">{formatDate(caso.fechaProximaGestion)}</td>
                  <td className="border px-3 py-1.5">{caso.observacionesGestion || "-"}</td>
                  <td className="border px-3 py-1.5">{caso.ultimoComentario || "-"}</td>

                  <td className="border bg-indigo-50/20 px-3 py-1.5">
                    {caso.seEnvioNotificacion ? "Sí" : "No"}
                  </td>
                  <td className="border bg-indigo-50/20 px-3 py-1.5">{formatDate(caso.fechaDebesEnviarNotificacion)}</td>
                  <td className="border bg-indigo-50/20 px-3 py-1.5">{formatDate(caso.fechaNotificacionInicial)}</td>
                  <td className="border bg-indigo-50/20 px-3 py-1.5">{formatDate(caso.fechaUltimaNotificacion)}</td>
                  <td className="border bg-indigo-50/20 px-3 py-1.5">{formatDate(caso.fechaProximaNotificacion)}</td>
                  <td className="border bg-indigo-50/20 px-3 py-1.5">{caso.traspasoConCita ? "Sí" : "No"}</td>
                  <td className="border bg-indigo-50/20 px-3 py-1.5">{formatDate(caso.fechaCitaTransito)}</td>
                  <td className="border bg-indigo-50/20 px-3 py-1.5">{formatDate(caso.fechaRadicacionTraspaso)}</td>
                  <td className="border bg-indigo-50/20 px-3 py-1.5">{formatDate(caso.fechaRechazo)}</td>
                  <td className="border bg-indigo-50/20 px-3 py-1.5">{formatDate(caso.fechaSubsanacionRechazo)}</td>
                  <td className="border bg-indigo-50/20 px-3 py-1.5">{formatDate(caso.fechaTraspasoAprobado)}</td>
                  <td className="border bg-indigo-50/20 px-3 py-1.5">{formatDate(caso.fechaEntregaTpLocatario)}</td>

                  <td className="border bg-yellow-50/20 px-3 py-1.5">{formatCurrency(caso.honorarios)}</td>
                  <td className="border bg-yellow-50/20 px-3 py-1.5">{caso.facturado ? "Sí" : "No"}</td>
                  <td className="border bg-yellow-50/20 px-3 py-1.5">{caso.numeroFactura || "-"}</td>
                  <td className="border bg-yellow-50/20 px-3 py-1.5">{formatCurrency(caso.honorariosServiciosJuridicos)}</td>
                  <td className="border bg-yellow-50/20 px-3 py-1.5">{caso.facturadoJuridico ? "Sí" : "No"}</td>
                  <td className="border bg-yellow-50/20 px-3 py-1.5">{caso.numeroFacturaJuridico || "-"}</td>
                  <td className="border bg-yellow-50/20 px-3 py-1.5">{caso.tiempoEntidadesExternas ?? "-"}</td>
                  <td className="border bg-yellow-50/20 px-3 py-1.5">{caso.tiempoBanco ?? "-"}</td>
                  <td className="border bg-yellow-50/20 px-3 py-1.5">{caso.tiempoJuridicoExterno ?? "-"}</td>
                  <td className="border bg-yellow-50/20 px-3 py-1.5">{caso.tiempoJuridicoInterno ?? "-"}</td>
                  <td className="border bg-yellow-50/20 px-3 py-1.5">{caso.tiempoTransito ?? "-"}</td>
                  <td className="border bg-yellow-50/20 px-3 py-1.5">{caso.tiempoOperativoAnalista ?? "-"}</td>

                  <td className="border bg-blue-50/30 px-3 py-1.5 font-semibold">{caso.locatario?.nit || "-"}</td>
                  <td className="border bg-blue-50/30 px-3 py-1.5">{caso.locatario?.nombreBanco || "-"}</td>
                  <td className="border bg-blue-50/30 px-3 py-1.5">{caso.locatario?.tipoDocumento || "-"}</td>
                  <td className="border bg-blue-50/30 px-3 py-1.5">{caso.locatario?.email || "-"}</td>
                  <td className="border bg-blue-50/30 px-3 py-1.5">{caso.locatario?.revisionCorreo ? "Sí" : "No"}</td>
                  <td className="border bg-blue-50/30 px-3 py-1.5">{caso.locatario?.contactoNombre || "-"}</td>
                  <td className="border bg-blue-50/30 px-3 py-1.5">{caso.locatario?.contactoNumero || "-"}</td>
                  <td className="border bg-blue-50/30 px-3 py-1.5">{caso.locatario?.direccionEnvio || "-"}</td>
                  <td className="border bg-blue-50/30 px-3 py-1.5">{caso.locatario?.locatarioRunt || "-"}</td>
                  <td className="border bg-blue-50/30 px-3 py-1.5">{caso.locatario?.nombreComercial || "-"}</td>

                  <td className="border bg-emerald-50/30 px-3 py-1.5 font-bold">{caso.vehiculoPlaca}</td>
                  <td className="border bg-emerald-50/30 px-3 py-1.5">{caso.vehiculo?.vin || "-"}</td>
                  <td className="border bg-emerald-50/30 px-3 py-1.5">{caso.vehiculo?.marca || "-"}</td>
                  <td className="border bg-emerald-50/30 px-3 py-1.5">{caso.vehiculo?.linea || "-"}</td>
                  <td className="border bg-emerald-50/30 px-3 py-1.5">{caso.vehiculo?.modelo || "-"}</td>
                  <td className="border bg-emerald-50/30 px-3 py-1.5">{caso.vehiculo?.cilindraje || "-"}</td>
                  <td className="border bg-emerald-50/30 px-3 py-1.5">{caso.vehiculo?.motor || "-"}</td>
                  <td className="border bg-emerald-50/30 px-3 py-1.5">{caso.vehiculo?.tipoVehiculo || "-"}</td>
                  <td className="border bg-emerald-50/30 px-3 py-1.5">{caso.vehiculo?.transito || "-"}</td>

                  <td className="border bg-emerald-50/30 px-3 py-1.5">
                    <EstadoDocumentoVehiculo
                      id={caso.vehiculo?.soatId}
                      tipo="SOAT"
                    />
                  </td>

                  <td className="border bg-emerald-50/30 px-3 py-1.5">
                    {formatDate(caso.vehiculo?.vigenciaSoat)}
                  </td>

                  <td className="border bg-emerald-50/30 px-3 py-1.5">
                    <EstadoDocumentoVehiculo
                      id={caso.vehiculo?.revisionTecnomecanicaId}
                      tipo="REVISION_TECNOMECANICA"
                    />
                  </td>

                  <td className="border bg-teal-50/30 px-3 py-1.5">{prop?.identificacion || "-"}</td>
                  <td className="border bg-teal-50/30 px-3 py-1.5">{prop?.nombre || "-"}</td>

                  <td className="border bg-amber-50/30 px-3 py-1.5">{formatDate(procJur?.fechaEscalamientoEntidadEx)}</td>
                  <td className="border bg-amber-50/30 px-3 py-1.5">{formatDate(procJur?.fechaRespuestaEntidadEx)}</td>
                  <td className="border bg-amber-50/30 px-3 py-1.5">{formatDate(procJur?.fechaLiquidacionTotalPasivos)}</td>
                  <td className="border bg-amber-50/30 px-3 py-1.5">{formatDate(procJur?.fechaSolicitudRecursos)}</td>
                  <td className="border bg-amber-50/30 px-3 py-1.5">{formatDate(procJur?.fechaDesembolsoRecursos)}</td>

                  {/* <td className="border bg-amber-50/30 px-3 py-1.5">{procJur?.tipoSaneamientoARealizarId || "-"}</td> */}

                  <td className="border bg-amber-50/30 px-3 py-1.5">{formatDate(procJur?.fechaRadicacionDp)}</td>
                  <td className="border bg-amber-50/30 px-3 py-1.5">{formatDate(procJur?.fechaRespuestaDp)}</td>
                  <td className="border bg-amber-50/30 px-3 py-1.5">{procJur?.numeroRadicadoTutela || "-"}</td>
                  <td className="border bg-amber-50/30 px-3 py-1.5">{procJur?.juzgado || "-"}</td>

                  <td className="border bg-rose-50/30 px-3 py-1.5">{audMulta?.limitacionesPropiedad || "-"}</td>
                  <td className="border bg-rose-50/30 px-3 py-1.5">{audMulta?.garantiasMobiliarias || "-"}</td>
                  <td className="border bg-rose-50/30 px-3 py-1.5">{audMulta?.simitMultasPropietarioResoluciones || "-"}</td>
                  <td className="border bg-rose-50/30 px-3 py-1.5">{audMulta?.simitMultasLocatario || "-"}</td>
                  <td className="border bg-rose-50/30 px-3 py-1.5">{audMulta?.multasPlaca || "-"}</td>
                  <td className="border bg-rose-50/30 px-3 py-1.5">{audMulta?.impuestos || "-"}</td>
                  <td className="border bg-rose-50/30 px-3 py-1.5">{audMulta?.vigenciasAdeudadas || "-"}</td>
                  <td className="border bg-rose-50/30 px-3 py-1.5">{audMulta?.impuestosTransito || "-"}</td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}