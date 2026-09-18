// raiz /components/inyeccionMasiva/AutoInyeccionCasos.tsx

"use client";

import React, { useState } from "react";
import * as XLSX from "xlsx";
import {
  AutoInyeccionCasoFila,
  ResultadoAutoInyeccionCasos,
  importarAutoInyeccionCasos,
} from "@/services/AutoInyeccionCasosApi";

interface FilaExcel {
  [key: string]: unknown;
}

interface AutoInyeccionCasosProps {
  onClose?: () => void;
}

const COLUMNAS_EXCEL = [
  "FECHA ASIGNACIÓN",
  "FECHA EN LA QUE SE DEBE CERRAR EL TRASPASO",
  "ANALISTA RESPONSABLE GESTIÓN",
  "RADICADO BIZAGI",
  "¡APLICA INSCRIPCIÓN OPCIÓN DE COMPRA?",
  "VALOR OPCIÓN COMPRA",
  "# CONTRATO",
  "PLACA",
  "ESTADO CONTRATO",
  "NOMBRE LOCATARIO BANCO",
  "TIPO DOCUMENTO DE IDENTIDAD DEL LOCATARIO",
  "NIT DEL LOCATARIO",
  "REVISIÓN CORREO LOCATARIO",
  "E-MAIL LOCATARIO",
  "NOMBRE CONTACTO LOCATARIO",
  "# CONTACTO LOCATARIO",
  "DIRECCIÓN LOCATARIO PARA ENVÍO DE TARJETA",
  "NOMBRE DEL COMERCIAL",
  "E-MAIL COMERCIAL",
  "REVISIÓN MAIL COMERCIAL",
  "LOCATARIO RUNT",
  "#DOCUMENTO DEL LOCATARIO RUNT",
  "ALERTA NIT LOCATARIO",
  "TRÁNSITO",
  "DEPARTAMENTO",
  "REGIONAL",
  "NOMBRE PROPIETARIO",
  "# IDENTIFICACIÓN",
  "ESTADO DE MATRICULA",
  "TIPO_VEHICULO",
  "TIPO SERVICIO",
  "MARCA",
  "LINEA",
  "MODELO",
  "CILINDRAJE",
  "MOTOR",
  "CHASIS",
  "SERIE",
  "VIN",
  "COLOR",
  "TIPO DE CARROCERÍA",
  "TIPO COMBUSTIBLE",
  "BLINDAJE",
  "SOAT",
  "VIGENCIA_SOAT",
  "REVISION_TECNOMECANICA",
  "VIGENCIA_TECNO",
  "LIMITACIONES A LA PROPIEDAD",
  "TIPO LIMITACIONES",
  "GARANTIAS MOBILIARIAS",
  "NORMALIZACION Y SANEAMIENTO",
  "SIMIT MULTAS PROPIETARIO - RESOLUCIONES",
  "SIMIT MULTAS LOCATARIO",
  "MULTAS PLACA",
  "IMPUESTOS",
  "VIGENCIAS ADEUDADAS",
  "EMPRESA TRANSPORTADORA",
  "IMPUESTOS DE TRANSITO",
  "SELECCIONE TIPO DE TRASPASO A REALIZAR",
  "OBSERVACIONES DE LA GESTIÓN",
];

const normalizarClave = (v: string) =>
  String(v)
    .trim()
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ");

const texto = (v: unknown): string | undefined =>
  v === null || v === undefined || String(v).trim() === ""
    ? undefined
    : String(v).trim();

const valor = (fila: FilaExcel, columna: string) => {
  const clave = normalizarClave(columna);

  const encontrada = Object.keys(fila).find(
    (k) => normalizarClave(k) === clave,
  );

  return encontrada ? fila[encontrada] : undefined;
};

// Convierte valores provenientes de Excel a booleanos.
const booleano = (v: unknown): boolean | undefined => {
  if (v === null || v === undefined || String(v).trim() === "") {
    return undefined;
  }

  if (typeof v === "boolean") return v;

  if (typeof v === "number") {
    return v === 1 ? true : v === 0 ? false : undefined;
  }

  const s = String(v)
    .trim()
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  if (["SI", "S", "YES", "TRUE", "VERDADERO", "1", "X"].includes(s)) {
    return true;
  }

  if (["NO", "N", "FALSE", "FALSO", "0"].includes(s)) {
    return false;
  }

  return undefined;
};

// Convierte números que pueden venir como texto, moneda o número de Excel.
const numero = (v: unknown): number | undefined => {
  if (v === null || v === undefined || String(v).trim() === "") {
    return undefined;
  }

  if (typeof v === "number") {
    return Number.isFinite(v) ? v : undefined;
  }

  const n = Number(
    String(v)
      .trim()
      .replace(/\$/g, "")
      .replace(/\s/g, "")
      .replace(/\./g, "")
      .replace(",", "."),
  );

  return Number.isFinite(n) ? n : undefined;
};

// Convierte fechas de Excel a YYYY-MM-DD.
const fecha = (v: unknown): string | undefined => {
  if (v === null || v === undefined || String(v).trim() === "") {
    return undefined;
  }

  if (v instanceof Date) {
    return Number.isNaN(v.getTime())
      ? undefined
      : v.toISOString().split("T")[0];
  }

  if (typeof v === "number") {
    const f = XLSX.SSF.parse_date_code(v);

    return f
      ? `${f.y}-${String(f.m).padStart(2, "0")}-${String(f.d).padStart(2, "0")}`
      : undefined;
  }

  const s = String(v).trim();

  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    return s;
  }

  const partes = s.split("/");

  if (
    partes.length === 3 &&
    /^\d{1,2}$/.test(partes[0]) &&
    /^\d{1,2}$/.test(partes[1]) &&
    /^\d{4}$/.test(partes[2])
  ) {
    return `${partes[2]}-${partes[1].padStart(2, "0")}-${partes[0].padStart(2, "0")}`;
  }

  const f = new Date(s);

  return Number.isNaN(f.getTime())
    ? undefined
    : f.toISOString().split("T")[0];
};

// Convierte una fila del Excel al formato que espera el backend.
const convertirFila = (fila: FilaExcel): AutoInyeccionCasoFila => {
  // Los tres campos RUNT tienen el mismo destino según el mapeo solicitado.
  const runt =
    texto(valor(fila, "LOCATARIO RUNT")) ||
    texto(valor(fila, "#DOCUMENTO DEL LOCATARIO RUNT")) ||
    texto(valor(fila, "ALERTA NIT LOCATARIO"));

  const modelo = numero(valor(fila, "MODELO"));

  return {
    fechaAsignacion: fecha(valor(fila, "FECHA ASIGNACIÓN")),

    fechaCierreTraspaso: fecha(
      valor(fila, "FECHA EN LA QUE SE DEBE CERRAR EL TRASPASO"),
    ),

    analistaResponsable: texto(
      valor(fila, "ANALISTA RESPONSABLE GESTIÓN"),
    ),

    radicadoBizagi: texto(
      valor(fila, "RADICADO BIZAGI"),
    ),

    aplicaInscripcionOpcionCompra: booleano(
      valor(fila, "¡APLICA INSCRIPCIÓN OPCIÓN DE COMPRA?"),
    ),

    valorOpcionCompra: numero(
      valor(fila, "VALOR OPCIÓN COMPRA"),
    ),

    numeroContrato: texto(
      valor(fila, "# CONTRATO"),
    ) || "",

    placa: texto(
      valor(fila, "PLACA"),
    )?.toUpperCase() || "",

    estadoContrato: texto(
      valor(fila, "ESTADO CONTRATO"),
    ),

    // LOCATARIO
    nombreBanco: texto(
      valor(fila, "NOMBRE LOCATARIO BANCO"),
    ),

    tipoDocumento: texto(
      valor(fila, "TIPO DOCUMENTO DE IDENTIDAD DEL LOCATARIO"),
    ),

    nit: texto(
      valor(fila, "NIT DEL LOCATARIO"),
    ) || "",

    revisionCorreo: booleano(
      valor(fila, "REVISIÓN CORREO LOCATARIO"),
    ),

    email: texto(
      valor(fila, "E-MAIL LOCATARIO"),
    ),

    contactoNombre: texto(
      valor(fila, "NOMBRE CONTACTO LOCATARIO"),
    ),

    contactoNumero: texto(
      valor(fila, "# CONTACTO LOCATARIO"),
    ),

    direccionEnvio: texto(
      valor(fila, "DIRECCIÓN LOCATARIO PARA ENVÍO DE TARJETA"),
    ),

    nombreComercial: texto(
      valor(fila, "NOMBRE DEL COMERCIAL"),
    ),

    emailComercial: texto(
      valor(fila, "E-MAIL COMERCIAL"),
    ),

    revisionMailComercial: booleano(
      valor(fila, "REVISIÓN MAIL COMERCIAL"),
    ),

    locatarioRunt: runt,

    // VEHÍCULO
    transito: texto(
      valor(fila, "TRÁNSITO"),
    ),

    departamento: texto(
      valor(fila, "DEPARTAMENTO"),
    ),

    regional: texto(
      valor(fila, "REGIONAL"),
    ),

    empresaTransportadora: texto(
      valor(fila, "EMPRESA TRANSPORTADORA"),
    ),

    // PROPIETARIO
    nombrePropietario: texto(
      valor(fila, "NOMBRE PROPIETARIO"),
    ),

    identificacionPropietario: texto(
      valor(fila, "# IDENTIFICACIÓN"),
    ),

    // VEHÍCULO
    estadoMatricula: texto(
      valor(fila, "ESTADO DE MATRICULA"),
    ),

    tipoVehiculo: texto(
      valor(fila, "TIPO_VEHICULO"),
    ),

    tipoServicio: texto(
      valor(fila, "TIPO SERVICIO"),
    ),

    marca: texto(
      valor(fila, "MARCA"),
    ),

    linea: texto(
      valor(fila, "LINEA"),
    ),

    modelo: modelo !== undefined
      ? Math.trunc(modelo)
      : undefined,

    cilindraje: texto(
      valor(fila, "CILINDRAJE"),
    ),

    motor: texto(
      valor(fila, "MOTOR"),
    ),

    chasis: texto(
      valor(fila, "CHASIS"),
    ),

    serie: texto(
      valor(fila, "SERIE"),
    ),

    vin: texto(
      valor(fila, "VIN"),
    ),

    color: texto(
      valor(fila, "COLOR"),
    ),

    tipoCarroceria: texto(
      valor(fila, "TIPO DE CARROCERÍA"),
    ),

    tipoCombustible: texto(
      valor(fila, "TIPO COMBUSTIBLE"),
    ),

    blindaje: texto(
      valor(fila, "BLINDAJE"),
    ),

    soat: texto(
      valor(fila, "SOAT"),
    ),

    vigenciaSoat: fecha(
      valor(fila, "VIGENCIA_SOAT"),
    ),

    revisionTecnomecanica: texto(
      valor(fila, "REVISION_TECNOMECANICA"),
    ),

    vigenciaTecno: fecha(
      valor(fila, "VIGENCIA_TECNO"),
    ),

    // AUDITORÍA MULTA
    limitacionesPropiedad: texto(
      valor(fila, "LIMITACIONES A LA PROPIEDAD"),
    ),

    tipoLimitaciones: texto(
      valor(fila, "TIPO LIMITACIONES"),
    ),

    garantiasMobiliarias: texto(
      valor(fila, "GARANTIAS MOBILIARIAS"),
    ),

    normalizacionSaneamiento: texto(
      valor(fila, "NORMALIZACION Y SANEAMIENTO"),
    ),

    simitMultasPropietarioResoluciones: texto(
      valor(fila, "SIMIT MULTAS PROPIETARIO - RESOLUCIONES"),
    ),

    simitMultasLocatario: texto(
      valor(fila, "SIMIT MULTAS LOCATARIO"),
    ),

    multasPlaca: texto(
      valor(fila, "MULTAS PLACA"),
    ),

    impuestos: texto(
      valor(fila, "IMPUESTOS"),
    ),

    vigenciasAdeudadas: texto(
      valor(fila, "VIGENCIAS ADEUDADAS"),
    ),

    impuestosTransito: texto(
      valor(fila, "IMPUESTOS DE TRANSITO"),
    ),

    // PROCESO JURÍDICO
    tipoSaneamientoARealizar: texto(
      valor(fila, "SELECCIONE TIPO DE TRASPASO A REALIZAR"),
    ),

    // CASO
    observacionesGestion: texto(
      valor(fila, "OBSERVACIONES DE LA GESTIÓN"),
    ),
  };
};

// Valida los campos mínimos necesarios para procesar un caso.
const validarFila = (fila: AutoInyeccionCasoFila) => {
  const errores: string[] = [];

  if (!fila.numeroContrato.trim()) {
    errores.push("# CONTRATO");
  }

  if (!fila.placa.trim()) {
    errores.push("PLACA");
  }

  if (!fila.nit.trim()) {
    errores.push("NIT DEL LOCATARIO");
  }

  return errores;
};

// Descarga una plantilla con los encabezados oficiales.
const descargarPlantilla = () => {
  const hoja = XLSX.utils.aoa_to_sheet([
    COLUMNAS_EXCEL,
  ]);

  hoja["!cols"] = COLUMNAS_EXCEL.map((c) => ({
    wch: Math.max(c.length + 2, 18),
  }));

  const libro = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    libro,
    hoja,
    "AutoInyeccionCasos",
  );

  XLSX.writeFile(
    libro,
    "Plantilla_AutoInyeccionCasos.xlsx",
  );
};

export default function AutoInyeccionCasos({
  onClose,
}: AutoInyeccionCasosProps) {
  const [archivo, setArchivo] = useState<File | null>(null);

  const [casos, setCasos] = useState<
    AutoInyeccionCasoFila[]
  >([]);

  const [errores, setErrores] = useState<
    { fila: number; campos: string[] }[]
  >([]);

  const [resultado, setResultado] =
    useState<ResultadoAutoInyeccionCasos | null>(null);

  const [procesando, setProcesando] =
    useState(false);

  const [mensaje, setMensaje] = useState("");

  const handleArchivo = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setArchivo(file);
    setResultado(null);
    setMensaje("");
    setErrores([]);

    try {
      const buffer = await file.arrayBuffer();

      const workbook = XLSX.read(buffer, {
        type: "array",
        cellDates: true,
      });

      const hoja =
        workbook.Sheets[workbook.SheetNames[0]];

      if (!hoja) {
        throw new Error(
          "El archivo no contiene ninguna hoja.",
        );
      }

      const filas =
        XLSX.utils.sheet_to_json<FilaExcel>(
          hoja,
          {
            defval: "",
            raw: true,
          },
        );

      if (!filas.length) {
        throw new Error(
          "El archivo no contiene registros.",
        );
      }

      const datos = filas.map(convertirFila);

      const validaciones = datos
        .map((fila, i) => {
          const campos = validarFila(fila);

          return campos.length
            ? {
                fila: i + 2,
                campos,
              }
            : null;
        })
        .filter(
          (
            x,
          ): x is {
            fila: number;
            campos: string[];
          } => x !== null,
        );

      setCasos(datos);
      setErrores(validaciones);

      setMensaje(
        validaciones.length
          ? `Se encontraron ${validaciones.length} fila(s) con campos obligatorios faltantes.`
          : `Archivo cargado correctamente. ${datos.length} caso(s) listo(s) para importar.`,
      );
    } catch (error: any) {
      setCasos([]);
      setErrores([]);

      setMensaje(
        error?.message ||
          "No fue posible leer el archivo Excel.",
      );
    }
  };

  const handleImportar = async () => {
    if (!casos.length) {
      setMensaje(
        "Primero debes cargar un archivo con casos.",
      );
      return;
    }

    if (errores.length) {
      setMensaje(
        "Corrige primero las filas que tienen campos obligatorios faltantes.",
      );
      return;
    }

    if (
      !window.confirm(
        `¿Deseas importar ${casos.length} caso(s)?\n\nLos casos existentes se actualizarán usando # CONTRATO como identificador.`,
      )
    ) {
      return;
    }

    try {
      setProcesando(true);
      setMensaje("");
      setResultado(null);

      const respuesta =
        await importarAutoInyeccionCasos(casos);

      setResultado(respuesta);

      setMensaje(
        "Proceso de importación terminado correctamente.",
      );
    } catch (error: any) {
      setMensaje(
        error?.message ||
          "Ocurrió un error durante la importación.",
      );
    } finally {
      setProcesando(false);
    }
  };

  const limpiar = () => {
    setArchivo(null);
    setCasos([]);
    setErrores([]);
    setResultado(null);
    setMensaje("");
  };

  return (
    <div className="w-full space-y-6 rounded-xl border bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Auto Inyección de Casos
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Carga un Excel para crear o actualizar casos
            y sus entidades relacionadas.
          </p>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cerrar
          </button>
        )}
      </div>

      {/* ACCIONES */}
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={descargarPlantilla}
          className="rounded-lg bg-gray-700 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          Descargar plantilla
        </button>

        <label className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          Seleccionar Excel

          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleArchivo}
            className="hidden"
          />
        </label>

        {archivo && (
          <button
            type="button"
            onClick={limpiar}
            className="rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Limpiar
          </button>
        )}
      </div>

      {/* ARCHIVO */}
      {archivo && (
        <div className="rounded-lg border bg-gray-50 p-4 text-sm">
          <p>
            <b>Archivo:</b> {archivo.name}
          </p>

          <p className="mt-1 text-gray-600">
            Registros encontrados:{" "}
            <b>{casos.length}</b>
          </p>
        </div>
      )}

      {/* MENSAJE */}
      {mensaje && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
          {mensaje}
        </div>
      )}

      {/* ERRORES */}
      {errores.length > 0 && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <h3 className="font-semibold text-red-800">
            Errores de validación
          </h3>

          <div className="mt-3 max-h-48 overflow-auto text-sm text-red-700">
            {errores
              .slice(0, 100)
              .map((error) => (
                <div
                  key={`${error.fila}-${error.campos.join("-")}`}
                  className="border-b border-red-100 py-1"
                >
                  Fila {error.fila}:{" "}
                  {error.campos.join(", ")}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* PREVISUALIZACIÓN */}
      {casos.length > 0 && (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">
              Previsualización
            </h3>

            <span className="text-sm text-gray-500">
              Primeros 20 registros
            </span>
          </div>

          <div className="overflow-x-auto rounded-lg border">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  {[
                    "Fila",
                    "Contrato",
                    "Placa",
                    "NIT",
                    "Locatario",
                    "Marca",
                    "Modelo",
                    "Estado contrato",
                    "Valor opción",
                  ].map((titulo) => (
                    <th
                      key={titulo}
                      className="whitespace-nowrap px-3 py-2 text-left"
                    >
                      {titulo}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {casos
                  .slice(0, 20)
                  .map((caso, i) => (
                    <tr
                      key={`${caso.numeroContrato}-${i}`}
                      className="border-t"
                    >
                      <td className="px-3 py-2">
                        {i + 2}
                      </td>

                      <td className="px-3 py-2 font-medium">
                        {caso.numeroContrato || "-"}
                      </td>

                      <td className="px-3 py-2">
                        {caso.placa || "-"}
                      </td>

                      <td className="px-3 py-2">
                        {caso.nit || "-"}
                      </td>

                      <td className="px-3 py-2">
                        {caso.nombreBanco || "-"}
                      </td>

                      <td className="px-3 py-2">
                        {caso.marca || "-"}
                      </td>

                      <td className="px-3 py-2">
                        {caso.modelo ?? "-"}
                      </td>

                      <td className="px-3 py-2">
                        {caso.estadoContrato || "-"}
                      </td>

                      <td className="px-3 py-2">
                        {caso.valorOpcionCompra !==
                        undefined
                          ? caso.valorOpcionCompra.toLocaleString(
                              "es-CO",
                            )
                          : "-"}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* IMPORTAR */}
      {casos.length > 0 && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleImportar}
            disabled={
              procesando || errores.length > 0
            }
            className="rounded-lg bg-green-600 px-6 py-3 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {procesando
              ? "Importando..."
              : `Importar ${casos.length} caso(s)`}
          </button>
        </div>
      )}

      {/* RESULTADO */}
      {resultado && (
        <div className="rounded-lg border bg-gray-50 p-5">
          <h3 className="text-lg font-semibold text-gray-800">
            Resultado de la importación
          </h3>

          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              [
                "Total",
                resultado.total,
                "text-gray-800",
              ],
              [
                "Creados",
                resultado.creados,
                "text-green-600",
              ],
              [
                "Actualizados",
                resultado.actualizados,
                "text-blue-600",
              ],
              [
                "Rechazados",
                resultado.rechazados,
                "text-red-600",
              ],
            ].map(([titulo, cantidad, clase]) => (
              <div
                key={titulo}
                className="rounded-lg border bg-white p-4"
              >
                <p className="text-xs text-gray-500">
                  {titulo}
                </p>

                <p
                  className={`mt-1 text-2xl font-bold ${clase}`}
                >
                  {cantidad}
                </p>
              </div>
            ))}
          </div>

          {/* ERRORES DEL BACKEND */}
          {resultado.errores?.length > 0 && (
            <div className="mt-5">
              <h4 className="font-semibold text-red-700">
                Detalle de errores
              </h4>

              <div className="mt-2 max-h-64 overflow-auto rounded-lg border bg-white">
                {resultado.errores.map(
                  (error, i) => (
                    <div
                      key={`${error.fila}-${error.campo}-${i}`}
                      className="border-b p-3 text-sm last:border-b-0"
                    >
                      <b>
                        {error.fila
                          ? `Fila ${error.fila}`
                          : "Error"}
                      </b>

                      {error.campo &&
                        ` - ${error.campo}`}
                      : {error.mensaje}
                    </div>
                  ),
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}