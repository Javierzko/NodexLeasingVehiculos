// raiz components/Leasing/LeasingTable.tsx

import type { Caso } from "@/types/leasing";

const TOTAL_COLUMNAS = 16;

interface LeasingTableProps {
  casos: Caso[];
  loading: boolean;
  onEditar: (caso: Caso) => void;
  onEliminar: (id: number, numeroContrato: string) => void;
}

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

            <th scope="col" className="border bg-slate-300 px-3 py-2">
              Radicado BizAgi
            </th>
            <th scope="col" className="border bg-slate-300 px-3 py-2">
              N° Contrato
            </th>
            <th scope="col" className="border bg-emerald-100 px-3 py-2 text-emerald-900">
              Placa
            </th>
            <th scope="col" className="border bg-blue-100 px-3 py-2 text-blue-900">
              Nombre Locatario
            </th>
            <th scope="col" className="border bg-blue-100 px-3 py-2 text-blue-900">
              NIT
            </th>
            <th scope="col" className="border bg-emerald-100 px-3 py-2 text-emerald-900">
              Tránsito
            </th>
            <th scope="col" className="border bg-teal-100 px-3 py-2 text-teal-900">
              Nombre Propietario
            </th>
            <th scope="col" className="border bg-amber-100 px-3 py-2 text-amber-900">
              Tipo Traspaso A Realizar
            </th>
            <th scope="col" className="border bg-slate-300 px-3 py-2">
              Estado
            </th>
            <th scope="col" className="border bg-slate-300 px-3 py-2">
              Categoría
            </th>
            <th scope="col" className="border bg-slate-300 px-3 py-2">
              Etapa
            </th>
            <th scope="col" className="border bg-slate-300 px-3 py-2">
              Sub Etapa
            </th>
            <th scope="col" className="border bg-indigo-100 px-3 py-2 text-indigo-900">
              Fecha Cierre BizAgi
            </th>
            <th scope="col" className="border bg-indigo-100 px-3 py-2 text-indigo-900">
              Ubicación Tarjeta
            </th>
            <th scope="col" className="border bg-rose-100 px-3 py-2 text-rose-900">
              Estado Vencimiento ANS
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
              const locatario = caso.locatario;
              const vehiculo = caso.vehiculo;
              const propietario = vehiculo?.propietario;
              const procJur = caso.procesoJuridico;
              const calculados = caso.camposCalculados;

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

                  <td className="border px-3 py-2">
                    {caso.radicadoBizagi || "-"}
                  </td>

                  <td className="border px-3 py-2 font-bold text-[#347365]">
                    {caso.numeroContrato}
                  </td>

                  <td className="border bg-emerald-50/30 px-3 py-2 font-bold">
                    {caso.vehiculoPlaca || vehiculo?.placa || "-"}
                  </td>

                  <td className="border bg-blue-50/30 px-3 py-2">
                    {locatario?.nombreComercial ||
                      locatario?.nombreBanco ||
                      "-"}
                  </td>

                  <td className="border bg-blue-50/30 px-3 py-2 font-semibold">
                    {locatario?.nit || "-"}
                  </td>

                  <td className="border bg-emerald-50/30 px-3 py-2">
                    {vehiculo?.transito || "-"}
                  </td>

                  <td className="border bg-teal-50/30 px-3 py-2">
                    {propietario?.nombre || "-"}
                  </td>

                  <td className="border bg-amber-50/30 px-3 py-2">
                    {procJur?.tipoSaneamientoARealizar?.nombre || "-"}
                  </td>

                  <td className="border px-3 py-2 font-semibold">
                    {caso.estado?.nombre || "-"}
                  </td>

                  <td className="border px-3 py-2">
                    {caso.categoria?.nombre || "-"}
                  </td>

                  <td className="border px-3 py-2">
                    {caso.etapa?.nombre || "-"}
                  </td>

                  <td className="border px-3 py-2">
                    {caso.subetapa?.nombre || "-"}
                  </td>

                  <td className="border bg-indigo-50/30 px-3 py-2">
                    {caso.fechaCierreTraspasoBizagi
                      ? new Intl.DateTimeFormat("es-CO").format(
                          new Date(caso.fechaCierreTraspasoBizagi)
                        )
                      : "-"}
                  </td>

                  <td className="border bg-indigo-50/30 px-3 py-2">
                    {caso.ubicacionTarjeta || "-"}
                  </td>

                  <td className="border bg-rose-50/30 px-3 py-2 font-semibold">
                    {calculados?.estadoVencimientoAns || "-"}
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