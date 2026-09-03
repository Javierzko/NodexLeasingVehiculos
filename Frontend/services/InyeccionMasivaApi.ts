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

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
).replace(/\/$/, '');

export async function importarVehiculos(
  vehiculos: VehiculoImportacion[],
): Promise<ResultadoImportacion> {
  const response = await fetch(`${API_BASE_URL}/inyeccion-masiva/vehiculos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ vehiculos }),
  });

  if (!response.ok) {
    const mensaje = await response.text();
    throw new Error(mensaje || 'No fue posible importar los vehículos.');
  }

  return response.json();
}

export async function importarCasos(
  casos: CasoImportacion[],
): Promise<ResultadoImportacion> {
  const response = await fetch(`${API_BASE_URL}/inyeccion-masiva/casos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ casos }),
  });

  if (!response.ok) {
    const mensaje = await response.text();
    throw new Error(mensaje || 'No fue posible importar los casos.');
  }

  return response.json();
}
