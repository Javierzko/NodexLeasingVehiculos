import { apiClient } from "@/api/client";

/**
 * Fila que será enviada al backend.
 * Los nombres corresponden directamente al modelo de importación.
 */
export interface AutoInyeccionCasoFila {
  fechaAsignacion?: string;
  fechaCierreTraspaso?: string;
  analistaResponsable?: string;
  radicadoBizagi?: string;
  aplicaInscripcionOpcionCompra?: boolean;
  valorOpcionCompra?: number;
  numeroContrato: string;
  placa: string;
  estadoContrato?: string;

  // LOCATARIO
  nombreBanco?: string;
  tipoDocumento?: string;
  nit: string;
  revisionCorreo?: boolean;
  email?: string;
  contactoNombre?: string;
  contactoNumero?: string;
  direccionEnvio?: string;
  nombreComercial?: string;
  emailComercial?: string;
  revisionMailComercial?: boolean;
  locatarioRunt?: string;

  // VEHÍCULO
  transito?: string;
  departamento?: string;
  regional?: string;
  empresaTransportadora?: string; // <-- AGREGAR

  // PROPIETARIO
  nombrePropietario?: string;
  identificacionPropietario?: string;

  // VEHÍCULO
  estadoMatricula?: string;
  tipoVehiculo?: string;
  tipoServicio?: string;
  marca?: string;
  linea?: string;
  modelo?: number;
  cilindraje?: string;
  motor?: string;
  chasis?: string;
  serie?: string;
  vin?: string;
  color?: string;
  tipoCarroceria?: string;
  tipoCombustible?: string;
  blindaje?: string;
  soat?: string;
  vigenciaSoat?: string;
  revisionTecnomecanica?: string;
  vigenciaTecno?: string;

  // AUDITORÍA MULTA
  limitacionesPropiedad?: string;
  tipoLimitaciones?: string;
  garantiasMobiliarias?: string;
  normalizacionSaneamiento?: string;
  simitMultasPropietarioResoluciones?: string;
  simitMultasLocatario?: string;
  multasPlaca?: string;
  impuestos?: string;
  vigenciasAdeudadas?: string;
  impuestosTransito?: string;

  // PROCESO JURÍDICO
  tipoSaneamientoARealizar?: string;

  // CASO
  observacionesGestion?: string;
}

export interface ResultadoAutoInyeccionCasos {
  total: number;
  creados: number;
  actualizados: number;
  rechazados: number;
  errores: Array<{
    fila?: number;
    campo?: string;
    mensaje: string;
  }>;
  casos?: unknown[];
}

export async function importarAutoInyeccionCasos(
  casos: AutoInyeccionCasoFila[],
): Promise<ResultadoAutoInyeccionCasos> {
  try {
    const response = await apiClient.post<ResultadoAutoInyeccionCasos>(
      "/auto-inyeccion-casos/importar",
      { casos },
    );

    return response.data;
  } catch (error: any) {
    const mensaje =
      error?.response?.data?.message ||
      "No fue posible importar los casos.";

    throw new Error(
      Array.isArray(mensaje) ? mensaje.join(", ") : String(mensaje),
    );
  }
}