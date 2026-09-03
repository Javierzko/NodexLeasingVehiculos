//raiz components/inyeccionMasiva/inyeccionMasiva

'use client';

import { useState } from 'react';
import * as XLSX from 'xlsx';
import {
  importarVehiculos,
  ResultadoImportacion,
  VehiculoImportacion,
} from '../../services/InyeccionMasivaApi';

type FilaExcel = Record<string, unknown>;
type ErrorFila = { fila: number; campo?: string; mensaje: string };

const encabezados = {
  numeroCaso: ['numerocaso', 'numerocontrato', 'caso', 'contrato'],
  radicadoBizagi: ['radicadobizagi', 'bizagi'],
  numeroIdentificacionLocatario: ['numeroidentificacionlocatario', 'identificacionlocatario', 'nitlocatario', 'identificacion'],
  locatarioRunt: ['locatariorut', 'locatariorunt', 'rutlocatario'],
  identificacionPropietario: ['identificacionpropietario', 'documentopropietario', 'ccpropietario'],
  nombrePropietario: ['nombrepropietario'],
  placa: ['placa'],
  vin: ['vin'],
  marca: ['marca'],
  linea: ['linea'],
  modelo: ['modelo'],
  motor: ['numeromotor', 'motor'],
  chasis: ['numerochasis', 'chasis'],
  serie: ['numeroserie', 'serie'],
  color: ['color'],
  tipoServicio: ['tiposervicio'],
  tipoVehiculo: ['clase', 'tipovehiculo'],
  tipoCarroceria: ['tipocarroceria'],
  tipoCombustible: ['tipocombustible'],
  cilindraje: ['cilindraje'],
  blindaje: ['blindaje', 'nivelblindaje', 'detalleblindajedesblinaje'],
  transito: ['organismotransito', 'transito'],
  departamento: ['departamento'],
  regional: ['regional'],
  empresaTransportadora: ['empresatransportadora'],
  estadoMatricula: ['estadomatriculaac', 'estadomatricula'],
  vigenciaSoat: ['soatfecha', 'soat', 'fechavencimientosoat', 'vigenciasoat'],
  vigenciaTecno: ['fechavencimientortm', 'vigenciatecno'],
  limitacionesPropiedad: ['limitacionesalapropiedadav', 'limitacionesalapropiedad', 'limitacionespropiedad'],
  garantiasMobiliarias: ['garantiamobiliariasax', 'garantiasmobiliarias', 'garantiamobiliaria'],
};

function normalizarEncabezado(valor: string) {
  return valor.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

function texto(valor: unknown) {
  if (valor === undefined || valor === null) return undefined;
  const resultado = String(valor).trim();
  return resultado || undefined;
}

function obtenerValor(fila: FilaExcel, aliases: string[]) {
  const entrada = Object.entries(fila).find(([clave]) => aliases.includes(normalizarEncabezado(clave)));
  return entrada ? texto(entrada[1]) : undefined;
}

function convertirFecha(valor?: string) {
  if (!valor) return undefined;
  const fecha = new Date(valor);
  return Number.isNaN(fecha.getTime()) ? valor : fecha.toISOString();
}

function convertirNivelBlindaje(valor?: string) {
  if (!valor) return undefined;
  const limpio = valor.trim();
  const nivel = Number(limpio.replace(/[^0-9.,-]/g, '').replace(',', '.'));
  if (Number.isFinite(nivel)) return nivel >= 3 ? 'BLINDADO' : 'NO BLINDADO';
  return limpio;
}

function convertirFila(fila: FilaExcel): VehiculoImportacion {
  const modeloTexto = obtenerValor(fila, encabezados.modelo);
  const modeloNumero = modeloTexto ? Number(modeloTexto) : undefined;

  return {
    numeroCaso: obtenerValor(fila, encabezados.numeroCaso),
    radicadoBizagi: obtenerValor(fila, encabezados.radicadoBizagi),
    numeroIdentificacionLocatario: obtenerValor(fila, encabezados.numeroIdentificacionLocatario),
    locatarioRunt: obtenerValor(fila, encabezados.locatarioRunt),
    identificacionPropietario: obtenerValor(fila, encabezados.identificacionPropietario),
    nombrePropietario: obtenerValor(fila, encabezados.nombrePropietario),
    placa: (obtenerValor(fila, encabezados.placa) ?? '').toUpperCase(),
    vin: obtenerValor(fila, encabezados.vin),
    marca: obtenerValor(fila, encabezados.marca),
    linea: obtenerValor(fila, encabezados.linea),
    modelo: Number.isInteger(modeloNumero) ? modeloNumero : undefined,
    cilindraje: obtenerValor(fila, encabezados.cilindraje),
    motor: obtenerValor(fila, encabezados.motor),
    chasis: obtenerValor(fila, encabezados.chasis),
    serie: obtenerValor(fila, encabezados.serie),
    color: obtenerValor(fila, encabezados.color),
    tipoVehiculo: obtenerValor(fila, encabezados.tipoVehiculo),
    tipoServicio: obtenerValor(fila, encabezados.tipoServicio),
    tipoCarroceria: obtenerValor(fila, encabezados.tipoCarroceria),
    tipoCombustible: obtenerValor(fila, encabezados.tipoCombustible),
    blindaje: convertirNivelBlindaje(obtenerValor(fila, encabezados.blindaje)),
    transito: obtenerValor(fila, encabezados.transito),
    departamento: obtenerValor(fila, encabezados.departamento),
    regional: obtenerValor(fila, encabezados.regional),
    empresaTransportadora: obtenerValor(fila, encabezados.empresaTransportadora),
    estadoMatricula: obtenerValor(fila, encabezados.estadoMatricula)?.toUpperCase(),
    vigenciaSoat: convertirFecha(obtenerValor(fila, encabezados.vigenciaSoat)),
    vigenciaTecno: convertirFecha(obtenerValor(fila, encabezados.vigenciaTecno)),
    limitacionesPropiedad: obtenerValor(fila, encabezados.limitacionesPropiedad)?.toUpperCase(),
    garantiasMobiliarias: obtenerValor(fila, encabezados.garantiasMobiliarias),
  };
}

function validarFilas(filas: VehiculoImportacion[]): ErrorFila[] {
  const errores: ErrorFila[] = [];
  const placas = new Map<string, number>();

  filas.forEach((vehiculo, indice) => {
    const fila = indice + 2;
    const placa = vehiculo.placa.trim().toUpperCase();
    const tieneClave = Boolean(vehiculo.numeroCaso || vehiculo.radicadoBizagi || vehiculo.numeroIdentificacionLocatario);

    if (!placa) errores.push({ fila, campo: 'PLACA', mensaje: 'La placa es obligatoria.' });
    else if (placas.has(placa)) errores.push({ fila, campo: 'PLACA', mensaje: `Está repetida; también aparece en la fila ${placas.get(placa)}.` });
    else placas.set(placa, fila);

    if (!tieneClave) errores.push({ fila, mensaje: 'Debe existir NumeroCaso, RadicadoBizagi o Identificacion del locatario.' });
    if (vehiculo.nombrePropietario && !vehiculo.identificacionPropietario) errores.push({ fila, campo: 'Identificacion Propietario', mensaje: 'Es obligatoria cuando se informa el nombre.' });

    if (vehiculo.estadoMatricula && !['AC', 'ACTIVA', 'CANCELADA'].includes(vehiculo.estadoMatricula)) {
      errores.push({ fila, campo: 'Estado Matricula AC', mensaje: 'Use AC, ACTIVA o CANCELADA.' });
    }
    if (vehiculo.limitacionesPropiedad && !['SI', 'NO', 'A', 'V'].includes(vehiculo.limitacionesPropiedad)) {
      errores.push({ fila, campo: 'Limitaciones a la propiedad A V', mensaje: 'Use SI, NO, A o V.' });
    }
    if (vehiculo.modelo !== undefined && !Number.isInteger(vehiculo.modelo)) errores.push({ fila, campo: 'Modelo', mensaje: 'Debe ser un número entero.' });
  });

  return errores;
}

export default function InyeccionMasiva({ onClose }: { onClose?: () => void }) {
  const [archivo, setArchivo] = useState<File | null>(null);
  const [filas, setFilas] = useState<VehiculoImportacion[]>([]);
  const [errores, setErrores] = useState<ErrorFila[]>([]);
  const [resultado, setResultado] = useState<ResultadoImportacion | null>(null);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState('');

  async function leerArchivo(file: File) {
    setArchivo(file);
    setResultado(null);
    try {
      const libro = XLSX.read(await file.arrayBuffer(), { type: 'array', cellDates: true });
      const hoja = libro.Sheets[libro.SheetNames[0]];
      if (!hoja) throw new Error('El archivo no contiene hojas.');
      const datos = XLSX.utils.sheet_to_json<FilaExcel>(hoja, { defval: '' });
      const convertidas = datos.map(convertirFila);
      const validaciones = validarFilas(convertidas);
      setFilas(convertidas);
      setErrores(validaciones);
      setMensaje(validaciones.length ? 'Corrige los errores antes de enviar.' : `${convertidas.length} fila(s) cargada(s) correctamente.`);
    } catch (error) {
      setFilas([]);
      setErrores([]);
      setMensaje(error instanceof Error ? error.message : 'No se pudo leer el archivo.');
    }
  }

  async function enviar() {
    if (!filas.length || errores.length || cargando) return;
    setCargando(true);
    setResultado(null);
    setMensaje('Enviando vehículos al servidor...');
    try {
      setResultado(await importarVehiculos(filas));
      setMensaje('Importación finalizada.');
    } catch (error) {
      setMensaje(error instanceof Error ? error.message : 'Error al importar vehículos.');
    } finally {
      setCargando(false);
    }
  }

  function descargarPlantilla() {
    const hoja = XLSX.utils.json_to_sheet([{
      NumeroCaso: '', RadicadoBizagi: '', Identificacion: '', 'Locatario RUT': '',
      'Identificacion Propietario': '', 'Nombre Propietario': '', PLACA: '', Marca: '', Modelo: '', VIN: '',
      'Numero Motor': '', 'Numero Chasis': '', 'Numero Serie': '', Color: '', 'Tipo Servicio': '',
      'Tipo Carroceria': '', 'Tipo Combustible': '', Cilindraje: '', Blindaje: '', Transito: '',
      Departamento: '', Regional: '', 'Empresa Transportadora': '', 'Estado Matricula AC': '',
      'Soat/FECHA': '', 'Fecha Vencimiento RTM': '', 'Limitaciones a la propiedad A V': '',
      'Garantia Mobiliarias AX': '',
    }]);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, 'Vehiculos');
    XLSX.writeFile(libro, 'plantilla-inyeccion-masiva-vehiculos-ampliada.xlsx');
  }

  return (
    <section className="mx-auto max-w-7xl space-y-6 p-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Carga independiente</p>
          <h1 className="text-2xl font-bold text-slate-900">Inyección masiva de vehículos</h1>
          <p className="mt-2 text-sm text-slate-600">Actualiza vehículos y sus relaciones de locatario, propietario y auditoría desde Excel.</p>
        </div>
        {onClose && <button type="button" onClick={onClose} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Cerrar</button>}
      </header>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div><h2 className="font-semibold text-slate-900">1. Plantilla</h2><p className="text-sm text-slate-500">La placa y una clave del caso son obligatorias.</p></div>
          <button type="button" onClick={descargarPlantilla} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Descargar plantilla</button>
        </div>
        <label className="mt-5 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 p-8 text-center hover:border-blue-400">
          <span className="font-medium text-slate-700">{archivo ? archivo.name : 'Selecciona un archivo Excel'}</span>
          <span className="mt-1 text-sm text-slate-500">Formato permitido: .xlsx o .xls</span>
          <input type="file" accept=".xlsx,.xls" className="sr-only" onChange={(event) => { const file = event.target.files?.[0]; if (file) void leerArchivo(file); }} />
        </label>
      </div>

      {mensaje && <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">{mensaje}</div>}
      {errores.length > 0 && <div className="rounded-xl border border-red-200 bg-red-50 p-5"><h2 className="font-semibold text-red-800">Errores de validación</h2><div className="mt-3 max-h-64 overflow-auto text-sm text-red-700">{errores.map((error, indice) => <p key={`${error.fila}-${error.campo}-${indice}`}>Fila {error.fila}{error.campo ? ` (${error.campo})` : ''}: {error.mensaje}</p>)}</div></div>}
      {filas.length > 0 && <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-semibold text-slate-900">2. Vista previa</h2><p className="text-sm text-slate-500">{filas.length} vehículo(s) detectado(s).</p></div><button type="button" onClick={() => void enviar()} disabled={Boolean(errores.length) || cargando} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">{cargando ? 'Importando...' : 'Confirmar importación'}</button></div><div className="mt-4 overflow-x-auto"><table className="min-w-full text-left text-sm"><thead className="border-b border-slate-200 text-xs uppercase text-slate-500"><tr><th className="px-3 py-2">Fila</th><th className="px-3 py-2">Caso</th><th className="px-3 py-2">Bizagi</th><th className="px-3 py-2">Locatario</th><th className="px-3 py-2">Propietario</th><th className="px-3 py-2">Placa</th><th className="px-3 py-2">Marca</th><th className="px-3 py-2">Blindaje</th><th className="px-3 py-2">SOAT</th></tr></thead><tbody>{filas.slice(0, 100).map((vehiculo, indice) => <tr key={`${vehiculo.placa}-${indice}`} className="border-b border-slate-100"><td className="px-3 py-2">{indice + 2}</td><td className="px-3 py-2">{vehiculo.numeroCaso || '—'}</td><td className="px-3 py-2">{vehiculo.radicadoBizagi || '—'}</td><td className="px-3 py-2">{vehiculo.numeroIdentificacionLocatario || '—'}</td><td className="px-3 py-2">{vehiculo.nombrePropietario || '—'}</td><td className="px-3 py-2 font-semibold">{vehiculo.placa || '—'}</td><td className="px-3 py-2">{vehiculo.marca || '—'}</td><td className="px-3 py-2">{vehiculo.blindaje || '—'}</td><td className="px-3 py-2">{vehiculo.vigenciaSoat || '—'}</td></tr>)}</tbody></table></div></div>}
      {resultado && <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5"><h2 className="font-semibold text-emerald-800">Resultado de la importación</h2><p className="mt-2 text-sm text-emerald-700">Total: {resultado.total} · Creados: {resultado.creados} · Actualizados: {resultado.actualizados} · Rechazados: {resultado.rechazados}</p></div>}
    </section>
  );
}
