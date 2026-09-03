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

  if (Number.isNaN(date.getTime())) return "-";

  return dateFormatter.format(date);
};

const formatCurrency = (val?: string | number | null) => {
  if (val === undefined || val === null || val === "") return "-";

  const numericValue = typeof val === "number" ? val : Number(val);

  if (!Number.isFinite(numericValue)) return "-";

  return currencyFormatter.format(numericValue);
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
        <thead className="bg-slate-200 text-slate-800 font-bold uppercase tracking-wider sticky top-0 z-20 shadow-sm">
          <tr>
            <th
              scope="col"
              className="px-3 py-2 border bg-slate-400 text-slate-900 sticky left-0 z-30 shadow-md"
            >
              Acciones
            </th>

            <th scope="col" className="px-3 py-2 border bg-slate-300">
              N° Contrato
            </th>
            <th scope="col" className="px-3 py-2 border bg-slate-300">
              Radicado Bizagi
            </th>
            <th scope="col" className="px-3 py-2 border bg-slate-300">
              Estado Contrato
            </th>
            <th scope="col" className="px-3 py-2 border bg-slate-300">
              Analista Responsable
            </th>
            <th scope="col" className="px-3 py-2 border bg-slate-300">
              Fecha Caso
            </th>
            <th scope="col" className="px-3 py-2 border bg-slate-300">
              Fecha Asignación
            </th>
            <th scope="col" className="px-3 py-2 border bg-slate-300">
              Fecha Cierre Traspaso
            </th>
            <th scope="col" className="px-3 py-2 border bg-slate-300">
              Estado
            </th>
            <th scope="col" className="px-3 py-2 border bg-slate-300">
              Categoría
            </th>
            <th scope="col" className="px-3 py-2 border bg-slate-300">
              Etapa
            </th>
            <th scope="col" className="px-3 py-2 border bg-slate-300">
              Estado Matrícula
            </th>
            <th scope="col" className="px-3 py-2 border bg-slate-300">
              Tipo Saneamiento A Realizar
            </th>
            <th scope="col" className="px-3 py-2 border bg-slate-300">
              Subetapa
            </th>
            <th scope="col" className="px-3 py-2 border bg-slate-300">
              Causa Atraso
            </th>
            <th scope="col" className="px-3 py-2 border bg-slate-300">
              Última Gestión
            </th>
            <th scope="col" className="px-3 py-2 border bg-slate-300">
              Próxima Gestión
            </th>
            <th scope="col" className="px-3 py-2 border bg-slate-300">
              Observaciones Gestión
            </th>
            <th scope="col" className="px-3 py-2 border bg-slate-300">
              Último Comentario
            </th>

            <th
              scope="col"
              className="px-3 py-2 border bg-indigo-100 text-indigo-900"
            >
              Envió Notificación
            </th>
            <th
              scope="col"
              className="px-3 py-2 border bg-indigo-100 text-indigo-900"
            >
              Fecha Debes Enviar Notif.
            </th>
            <th
              scope="col"
              className="px-3 py-2 border bg-indigo-100 text-indigo-900"
            >
              Notificación Inicial
            </th>
            <th
              scope="col"
              className="px-3 py-2 border bg-indigo-100 text-indigo-900"
            >
              Última Notificación
            </th>
            <th
              scope="col"
              className="px-3 py-2 border bg-indigo-100 text-indigo-900"
            >
              Próxima Notificación
            </th>
            <th
              scope="col"
              className="px-3 py-2 border bg-indigo-100 text-indigo-900"
            >
              Traspaso Con Cita
            </th>
            <th
              scope="col"
              className="px-3 py-2 border bg-indigo-100 text-indigo-900"
            >
              Fecha Cita Tránsito
            </th>
            <th
              scope="col"
              className="px-3 py-2 border bg-indigo-100 text-indigo-900"
            >
              Fecha Radicación Traspaso
            </th>
            <th
              scope="col"
              className="px-3 py-2 border bg-indigo-100 text-indigo-900"
            >
              Fecha Rechazo
            </th>
            <th
              scope="col"
              className="px-3 py-2 border bg-indigo-100 text-indigo-900"
            >
              Fecha Subsanación Rechazo
            </th>
            <th
              scope="col"
              className="px-3 py-2 border bg-indigo-100 text-indigo-900"
            >
              Traspaso Aprobado
            </th>
            <th
              scope="col"
              className="px-3 py-2 border bg-indigo-100 text-indigo-900"
            >
              Fecha Entrega TP Locatario
            </th>

            <th
              scope="col"
              className="px-3 py-2 border bg-yellow-100 text-yellow-900"
            >
              Honorarios GP
            </th>
            <th
              scope="col"
              className="px-3 py-2 border bg-yellow-100 text-yellow-900"
            >
              Facturado GP
            </th>
            <th
              scope="col"
              className="px-3 py-2 border bg-yellow-100 text-yellow-900"
            >
              N° Factura GP
            </th>
            <th
              scope="col"
              className="px-3 py-2 border bg-yellow-100 text-yellow-900"
            >
              Honorarios Jurídicos
            </th>
            <th
              scope="col"
              className="px-3 py-2 border bg-yellow-100 text-yellow-900"
            >
              Facturado Jurídico
            </th>
            <th
              scope="col"
              className="px-3 py-2 border bg-yellow-100 text-yellow-900"
            >
              N° Factura Jurídico
            </th>
            <th
              scope="col"
              className="px-3 py-2 border bg-yellow-100 text-yellow-900"
            >
              Tiempo Ent. Externas (días)
            </th>
            <th
              scope="col"
              className="px-3 py-2 border bg-yellow-100 text-yellow-900"
            >
              Tiempo Banco (días)
            </th>
            <th
              scope="col"
              className="px-3 py-2 border bg-yellow-100 text-yellow-900"
            >
              Tiempo Jurídico Ext. (días)
            </th>
            <th
              scope="col"
              className="px-3 py-2 border bg-yellow-100 text-yellow-900"
            >
              Tiempo Jurídico Int. (días)
            </th>
            <th
              scope="col"
              className="px-3 py-2 border bg-yellow-100 text-yellow-900"
            >
              Tiempo Tránsito (días)
            </th>
            <th
              scope="col"
              className="px-3 py-2 border bg-yellow-100 text-yellow-900"
            >
              Tiempo Op. Analista (días)
            </th>

            <th
              scope="col"
              className="px-3 py-2 border bg-blue-100 text-blue-900"
            >
              Locatario NIT
            </th>
            <th
              scope="col"
              className="px-3 py-2 border bg-blue-100 text-blue-900"
            >
              Locatario Banco
            </th>
            <th
              scope="col"
              className="px-3 py-2 border bg-blue-100 text-blue-900"
            >
              Tipo Doc
            </th>
            <th
              scope="col"
              className="px-3 py-2 border bg-blue-100 text-blue-900"
            >
              Email
            </th>
            <th
              scope="col"
              className="px-3 py-2 border bg-blue-100 text-blue-900"
            >
              Rev. Correo
            </th>
            <th
              scope="col"
              className="px-3 py-2 border bg-blue-100 text-blue-900"
            >
              Contacto Nombre
            </th>
            <th
              scope="col"
              className="px-3 py-2 border bg-blue-100 text-blue-900"
            >
              Contacto Número
            </th>
            <th
              scope="col"
              className="px-3 py-2 border bg-blue-100 text-blue-900"
            >
              Dirección Envío
            </th>
            <th
              scope="col"
              className="px-3 py-2 border bg-blue-100 text-blue-900"
            >
              Locatario RUNT
            </th>
            <th
              scope="col"
              className="px-3 py-2 border bg-blue-100 text-blue-900"
            >
              Nombre Comercial
            </th>

            <th
              scope="col"
              className="px-3 py-2 border bg-emerald-100 text-emerald-900"
            >
              Placa
            </th>
            <th
              scope="col"
              className="px-3 py-2 border bg-emerald-100 text-emerald-900"
            >
              VIN
            </th>
            <th
              scope="col"
              className="px-3 py-2 border bg-emerald-100 text-emerald-900"
            >
              Marca
            </th>
            <th
              scope="col"
              className="px-3 py-2 border bg-emerald-100 text-emerald-900"
            >
              Línea
            </th>
            <th
              scope="col"
              className="px-3 py-2 border bg-emerald-100 text-emerald-900"
            >
              Modelo
            </th>
            <th
              scope="col"
              className="px-3 py-2 border bg-emerald-100 text-emerald-900"
            >
              Cilindraje
            </th>
            <th
              scope="col"
              className="px-3 py-2 border bg-emerald-100 text-emerald-900"
            >
              Motor
            </th>
            <th
              scope="col"
              className="px-3 py-2 border bg-emerald-100 text-emerald-900"
            >
              Tipo Vehículo
            </th>
            <th
              scope="col"
              className="px-3 py-2 border bg-emerald-100 text-emerald-900"
            >
              Tránsito
            </th>
            <th
              scope="col"
              className="px-3 py-2 border bg-emerald-100 text-emerald-900"
            >
              SOAT
            </th>
            <th
              scope="col"
              className="px-3 py-2 border bg-emerald-100 text-emerald-900"
            >
              Vigencia SOAT
            </th>
            <th
              scope="col"
              className="px-3 py-2 border bg-emerald-100 text-emerald-900"
            >
              Revisión Tecnomecánica
            </th>

            <th
              scope="col"
              className="px-3 py-2 border bg-teal-100 text-teal-900"
            >
              Propietario Identificación
            </th>
            <th
              scope="col"
              className="px-3 py-2 border bg-teal-100 text-teal-900"
            >
              Propietario Nombre
            </th>

            <th
              scope="col"
              className="px-3 py-2 border bg-amber-100 text-amber-900"
            >
              Escalamiento Ent. Ex
            </th>
            <th
              scope="col"
              className="px-3 py-2 border bg-amber-100 text-amber-900"
            >
              Respuesta Ent. Ex
            </th>
            <th
              scope="col"
              className="px-3 py-2 border bg-amber-100 text-amber-900"
            >
              Liq. Total Pasivos
            </th>
            <th
              scope="col"
              className="px-3 py-2 border bg-amber-100 text-amber-900"
            >
              Solicitud Recursos
            </th>
            <th
              scope="col"
              className="px-3 py-2 border bg-amber-100 text-amber-900"
            >
              Desembolso Recursos
            </th>
            <th
              scope="col"
              className="px-3 py-2 border bg-amber-100 text-amber-900"
            >
              Radicado DP
            </th>
            <th
              scope="col"
              className="px-3 py-2 border bg-amber-100 text-amber-900"
            >
              Respuesta DP
            </th>
            <th
              scope="col"
              className="px-3 py-2 border bg-amber-100 text-amber-900"
            >
              Radicado Tutela
            </th>
            <th
              scope="col"
              className="px-3 py-2 border bg-amber-100 text-amber-900"
            >
              Juzgado
            </th>

            <th
              scope="col"
              className="px-3 py-2 border bg-rose-100 text-rose-900"
            >
              Limitaciones Propiedad
            </th>
            <th
              scope="col"
              className="px-3 py-2 border bg-rose-100 text-rose-900"
            >
              Garantías Mobiliarias
            </th>
            <th
              scope="col"
              className="px-3 py-2 border bg-rose-100 text-rose-900"
            >
              SIMIT Propietario
            </th>
            <th
              scope="col"
              className="px-3 py-2 border bg-rose-100 text-rose-900"
            >
              SIMIT Locatario
            </th>
            <th
              scope="col"
              className="px-3 py-2 border bg-rose-100 text-rose-900"
            >
              Multas Placa
            </th>
            <th
              scope="col"
              className="px-3 py-2 border bg-rose-100 text-rose-900"
            >
              Impuestos
            </th>
            <th
              scope="col"
              className="px-3 py-2 border bg-rose-100 text-rose-900"
            >
              Vigencias Adeudadas
            </th>
            <th
              scope="col"
              className="px-3 py-2 border bg-rose-100 text-rose-900"
            >
              Impuestos Tránsito
            </th>
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
                    <div className="flex gap-1 items-center">
                      <button
                        type="button"
                        onClick={() => onEditar(caso)}
                        className="table-action"
                        title="Editar expediente"
                        aria-label={`Editar expediente ${caso.numeroContrato}`}
                      >
                        Editar
                      </button>

                      <button
                        type="button"
                        onClick={() => onEliminar(caso.id, caso.numeroContrato)}
                        className="table-action table-action-danger"
                        title="Eliminar expediente"
                        aria-label={`Eliminar expediente ${caso.numeroContrato}`}
                      >
                        Borrar
                      </button>
                    </div>
                  </td>

                  <td className="px-3 py-2 border font-bold text-[#347365]">
                    {caso.numeroContrato}
                  </td>
                  <td className="px-3 py-1.5 border">
                    {caso.radicadoBizagi || "-"}
                  </td>
                  <td className="px-3 py-1.5 border">
                    {caso.estadoContrato?.nombre || "-"}
                  </td>
                  <td className="px-3 py-1.5 border">
                    {caso.analistaResponsable || "-"}
                  </td>
                  <td className="px-3 py-1.5 border">
                    {formatDate(caso.fecha)}
                  </td>
                  <td className="px-3 py-1.5 border">
                    {formatDate(caso.fechaAsignacion)}
                  </td>
                  <td className="px-3 py-1.5 border">
                    {formatDate(caso.fechaCierreTraspaso)}
                  </td>
                  <td className="px-3 py-1.5 border">
                    {caso.estado?.nombre || "-"}
                  </td>
                  <td className="px-3 py-1.5 border">
                    {caso.categoria?.nombre || "-"}
                  </td>
                  <td className="px-3 py-1.5 border">
                    {caso.etapa?.nombre || "-"}
                  </td>
                  <td className="px-3 py-1.5 border">
                    {caso.vehiculo?.estadoMatricula?.nombre || "-"}
                  </td>

                  <td className="px-3 py-1.5 border">
                    {procJur?.tipoSaneamientoARealizar?.nombre || "-"}
                  </td>
                  <td className="px-3 py-1.5 border">
                    {caso.subetapa?.nombre || "-"}
                  </td>
                  <td className="px-3 py-1.5 border">
                    {caso.causaAtraso?.nombre || "-"}
                  </td>
                  <td className="px-3 py-1.5 border">
                    {formatDate(caso.fechaUltimaGestion)}
                  </td>
                  <td className="px-3 py-1.5 border">
                    {formatDate(caso.fechaProximaGestion)}
                  </td>
                  <td className="px-3 py-1.5 border">
                    {caso.observacionesGestion || "-"}
                  </td>
                  <td className="px-3 py-1.5 border">
                    {caso.ultimoComentario || "-"}
                  </td>

                  <td className="px-3 py-1.5 border bg-indigo-50/20">
                    {caso.seEnvioNotificacion ? "Sí" : "No"}
                  </td>
                  <td className="px-3 py-1.5 border bg-indigo-50/20">
                    {formatDate(caso.fechaDebesEnviarNotificacion)}
                  </td>
                  <td className="px-3 py-1.5 border bg-indigo-50/20">
                    {formatDate(caso.fechaNotificacionInicial)}
                  </td>
                  <td className="px-3 py-1.5 border bg-indigo-50/20">
                    {formatDate(caso.fechaUltimaNotificacion)}
                  </td>
                  <td className="px-3 py-1.5 border bg-indigo-50/20">
                    {formatDate(caso.fechaProximaNotificacion)}
                  </td>
                  <td className="px-3 py-1.5 border bg-indigo-50/20">
                    {caso.traspasoConCita ? "Sí" : "No"}
                  </td>
                  <td className="px-3 py-1.5 border bg-indigo-50/20">
                    {formatDate(caso.fechaCitaTransito)}
                  </td>
                  <td className="px-3 py-1.5 border bg-indigo-50/20">
                    {formatDate(caso.fechaRadicacionTraspaso)}
                  </td>
                  <td className="px-3 py-1.5 border bg-indigo-50/20">
                    {formatDate(caso.fechaRechazo)}
                  </td>
                  <td className="px-3 py-1.5 border bg-indigo-50/20">
                    {formatDate(caso.fechaSubsanacionRechazo)}
                  </td>
                  <td className="px-3 py-1.5 border bg-indigo-50/20">
                    {formatDate(caso.fechaTraspasoAprobado)}
                  </td>
                  <td className="px-3 py-1.5 border bg-indigo-50/20">
                    {formatDate(caso.fechaEntregaTpLocatario)}
                  </td>

                  <td className="px-3 py-1.5 border bg-yellow-50/20">
                    {formatCurrency(caso.honorarios)}
                  </td>
                  <td className="px-3 py-1.5 border bg-yellow-50/20">
                    {caso.facturado ? "Sí" : "No"}
                  </td>
                  <td className="px-3 py-1.5 border bg-yellow-50/20">
                    {caso.numeroFactura || "-"}
                  </td>
                  <td className="px-3 py-1.5 border bg-yellow-50/20">
                    {formatCurrency(caso.honorariosServiciosJuridicos)}
                  </td>
                  <td className="px-3 py-1.5 border bg-yellow-50/20">
                    {caso.facturadoJuridico ? "Sí" : "No"}
                  </td>
                  <td className="px-3 py-1.5 border bg-yellow-50/20">
                    {caso.numeroFacturaJuridico || "-"}
                  </td>
                  <td className="px-3 py-1.5 border bg-yellow-50/20">
                    {caso.tiempoEntidadesExternas ?? "-"}
                  </td>
                  <td className="px-3 py-1.5 border bg-yellow-50/20">
                    {caso.tiempoBanco ?? "-"}
                  </td>
                  <td className="px-3 py-1.5 border bg-yellow-50/20">
                    {caso.tiempoJuridicoExterno ?? "-"}
                  </td>
                  <td className="px-3 py-1.5 border bg-yellow-50/20">
                    {caso.tiempoJuridicoInterno ?? "-"}
                  </td>
                  <td className="px-3 py-1.5 border bg-yellow-50/20">
                    {caso.tiempoTransito ?? "-"}
                  </td>
                  <td className="px-3 py-1.5 border bg-yellow-50/20">
                    {caso.tiempoOperativoAnalista ?? "-"}
                  </td>

                  <td className="px-3 py-1.5 border bg-blue-50/30 font-semibold">
                    {caso.locatario?.nit || "-"}
                  </td>
                  <td className="px-3 py-1.5 border bg-blue-50/30">
                    {caso.locatario?.nombreBanco || "-"}
                  </td>
                  <td className="px-3 py-1.5 border bg-blue-50/30">
                    {caso.locatario?.tipoDocumento || "-"}
                  </td>
                  <td className="px-3 py-1.5 border bg-blue-50/30">
                    {caso.locatario?.email || "-"}
                  </td>
                  <td className="px-3 py-1.5 border bg-blue-50/30">
                    {caso.locatario?.revisionCorreo ? "Sí" : "No"}
                  </td>
                  <td className="px-3 py-1.5 border bg-blue-50/30">
                    {caso.locatario?.contactoNombre || "-"}
                  </td>
                  <td className="px-3 py-1.5 border bg-blue-50/30">
                    {caso.locatario?.contactoNumero || "-"}
                  </td>
                  <td className="px-3 py-1.5 border bg-blue-50/30">
                    {caso.locatario?.direccionEnvio || "-"}
                  </td>
                  <td className="px-3 py-1.5 border bg-blue-50/30">
                    {caso.locatario?.locatarioRunt || "-"}
                  </td>
                  <td className="px-3 py-1.5 border bg-blue-50/30">
                    {caso.locatario?.nombreComercial || "-"}
                  </td>

                  <td className="px-3 py-1.5 border bg-emerald-50/30 font-bold">
                    {caso.vehiculoPlaca}
                  </td>
                  <td className="px-3 py-1.5 border bg-emerald-50/30">
                    {caso.vehiculo?.vin || "-"}
                  </td>
                  <td className="px-3 py-1.5 border bg-emerald-50/30">
                    {caso.vehiculo?.marca || "-"}
                  </td>
                  <td className="px-3 py-1.5 border bg-emerald-50/30">
                    {caso.vehiculo?.linea || "-"}
                  </td>
                  <td className="px-3 py-1.5 border bg-emerald-50/30">
                    {caso.vehiculo?.modelo || "-"}
                  </td>
                  <td className="px-3 py-1.5 border bg-emerald-50/30">
                    {caso.vehiculo?.cilindraje || "-"}
                  </td>
                  <td className="px-3 py-1.5 border bg-emerald-50/30">
                    {caso.vehiculo?.motor || "-"}
                  </td>
                  <td className="px-3 py-1.5 border bg-emerald-50/30">
                    {caso.vehiculo?.tipoVehiculo || "-"}
                  </td>
                  <td className="px-3 py-1.5 border bg-emerald-50/30">
                    {caso.vehiculo?.transito || "-"}
                  </td>

                  <td className="px-3 py-1.5 border bg-emerald-50/30">
                    <EstadoDocumentoVehiculo
                      id={caso.vehiculo?.soatId}
                      tipo="SOAT"
                    />
                  </td>

                  <td className="px-3 py-1.5 border bg-emerald-50/30">
                    {formatDate(caso.vehiculo?.vigenciaSoat)}
                  </td>

                  <td className="px-3 py-1.5 border bg-emerald-50/30">
                    <EstadoDocumentoVehiculo
                      id={caso.vehiculo?.revisionTecnomecanicaId}
                      tipo="REVISION_TECNOMECANICA"
                    />
                  </td>

                  <td className="px-3 py-1.5 border bg-teal-50/30">
                    {prop?.identificacion || "-"}
                  </td>
                  <td className="px-3 py-1.5 border bg-teal-50/30">
                    {prop?.nombre || "-"}
                  </td>

                  <td className="px-3 py-1.5 border bg-amber-50/30">
                    {formatDate(procJur?.fechaEscalamientoEntidadEx)}
                  </td>
                  <td className="px-3 py-1.5 border bg-amber-50/30">
                    {formatDate(procJur?.fechaRespuestaEntidadEx)}
                  </td>
                  <td className="px-3 py-1.5 border bg-amber-50/30">
                    {formatDate(procJur?.fechaLiquidacionTotalPasivos)}
                  </td>
                  <td className="px-3 py-1.5 border bg-amber-50/30">
                    {formatDate(procJur?.fechaSolicitudRecursos)}
                  </td>
                  <td className="px-3 py-1.5 border bg-amber-50/30">
                    {formatDate(procJur?.fechaDesembolsoRecursos)}
                  </td>

                  {/* <td className="px-3 py-1.5 border bg-amber-50/30">{procJur?.tipoSaneamientoARealizarId || '-'}</td> */}

                  <td className="px-3 py-1.5 border bg-amber-50/30">
                    {formatDate(procJur?.fechaRadicacionDp)}
                  </td>
                  <td className="px-3 py-1.5 border bg-amber-50/30">
                    {formatDate(procJur?.fechaRespuestaDp)}
                  </td>
                  <td className="px-3 py-1.5 border bg-amber-50/30">
                    {procJur?.numeroRadicadoTutela || "-"}
                  </td>
                  <td className="px-3 py-1.5 border bg-amber-50/30">
                    {procJur?.juzgado || "-"}
                  </td>

                  <td className="px-3 py-1.5 border bg-rose-50/30">
                    {audMulta?.limitacionesPropiedad || "-"}
                  </td>
                  <td className="px-3 py-1.5 border bg-rose-50/30">
                    {audMulta?.garantiasMobiliarias || "-"}
                  </td>
                  <td className="px-3 py-1.5 border bg-rose-50/30">
                    {audMulta?.simitMultasPropietarioResoluciones || "-"}
                  </td>
                  <td className="px-3 py-1.5 border bg-rose-50/30">
                    {audMulta?.simitMultasLocatario || "-"}
                  </td>
                  <td className="px-3 py-1.5 border bg-rose-50/30">
                    {audMulta?.multasPlaca || "-"}
                  </td>
                  <td className="px-3 py-1.5 border bg-rose-50/30">
                    {audMulta?.impuestos || "-"}
                  </td>
                  <td className="px-3 py-1.5 border bg-rose-50/30">
                    {audMulta?.vigenciasAdeudadas || "-"}
                  </td>
                  <td className="px-3 py-1.5 border bg-rose-50/30">
                    {audMulta?.impuestosTransito || "-"}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
