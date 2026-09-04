import { apiClient } from "@/api/client"; 

export interface VehiculoImportacion {
  numeroCaso?: string;
  radicadoBizagi?: string;
  numeroIdentificacionLocatario?: string;
  locatarioRunt?: string;
  identificacionPropietario?: string;
  nombrePropietario?: string;
  placa: string;
  vin?: string;
  marca?: string;
  linea?: string;
  modelo?: number;
  cilindraje?: string;
  motor?: string;
  chasis?: string;
  serie?: string;
  color?: string;
  tipoVehiculo?: string;
  tipoServicio?: string;
  tipoCarroceria?: string;
  tipoCombustible?: string;
  blindaje?: string;
  transito?: string;
  departamento?: string;
  regional?: string;
  empresaTransportadora?: string;
  estadoMatricula?: string;
  vigenciaSoat?: string;
  limitacionesPropiedad?: string;
  garantiasMobiliarias?: string;
  vigenciaTecno?: string;
}

export interface CasoImportacion {
  radicadoBizagi: string;
  fechaAsignacion?: string;
  valorOpcionCompra?: number;
  numeroContrato: string;
  placa: string;
  contratoVigente?: string;
  nombreLocatarioBanco?: string;
  tipoDocumento?: string;
  nitLocatario: string;
  emailLocatario?: string;
}

export interface ResultadoImportacion {
  total: number;
  creados: number;
  actualizados: number;
  rechazados: number;
  errores: Array<{
    fila?: number;
    campo?: string;
    mensaje: string;
  }>;
  vehiculos?: unknown[];
  casos?: unknown[];
}

export async function importarVehiculos(
  vehiculos: VehiculoImportacion[],
): Promise<ResultadoImportacion> {
  try {
    const response = await apiClient.post<ResultadoImportacion>(
      '/inyeccion-masiva/vehiculos',
      { vehiculos }
    );
    return response.data;
  } catch (error: any) {
    const mensaje =
      error?.response?.data?.message || 'No fue posible importar los vehículos.';
    throw new Error(Array.isArray(mensaje) ? mensaje.join(', ') : mensaje);
  }
}

export async function importarCasos(
  casos: CasoImportacion[],
): Promise<ResultadoImportacion> {
  try {
    const response = await apiClient.post<ResultadoImportacion>(
      '/inyeccion-masiva/casos',
      { casos }
    );
    return response.data;
  } catch (error: any) {
    const mensaje =
      error?.response?.data?.message || 'No fue posible importar los casos.';
    throw new Error(Array.isArray(mensaje) ? mensaje.join(', ') : mensaje);
  }
}