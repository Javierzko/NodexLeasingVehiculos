'use client';

import { useState } from 'react';
import * as XLSX from 'xlsx';
import {
  CasoImportacion,
  importarCasos,
  ResultadoImportacion,
} from '../../services/InyeccionMasivaApi';

type FilaExcel = Record<string, unknown>;
type ErrorFila = { fila: number; campo?: string; mensaje: string };

const encabezados = {
  radicadoBizagi: ['radicadobizagi', 'bizagi'],
  fechaAsignacion: ['fechaasignacion'],
  valorOpcionCompra: ['val opcion compra', 'valopcioncompra', 'valoropcioncompra'],
  numeroContrato: ['numerocontrato', 'contrato', 'numerocaso', 'caso'],
  placa: ['placa'],
  contratoVigente: ['contratovigente', 'estadocontrato'],
  nombreLocatarioBanco: ['nombrelocatariobanco'],
  tipoDocumento: ['tipodocumento'],
  nitLocatario: ['nitdellocatario', 'nitlocatario', 'numeroidentificacionlocatario'],
  emailLocatario: ['emaillocatario', 'email', 'correolocatario'],
};

function normalizarEncabezado(valor: string) {
  return valor.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

function texto(valor: unknown): string | undefined {
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

function convertirDecimal(valor?: string) {
  if (!valor) return undefined;
  const limpio = valor.replace(/[$\s]/g, '');
  const normalizado = limpio.includes(',') && limpio.includes('.')
    ? limpio.replace(/\./g, '').replace(',', '.')
    : limpio.replace(',', '.');
  const resultado = Number(normalizado);
  return Number.isFinite(resultado) ? resultado : undefined;
}

function convertirFila(fila: FilaExcel): CasoImportacion {
  const contratoVigente = obtenerValor(fila, encabezados.contratoVigente)?.toUpperCase();
  return {
    radicadoBizagi: obtenerValor(fila, encabezados.radicadoBizagi) ?? '',
    fechaAsignacion: convertirFecha(obtenerValor(fila, encabezados.fechaAsignacion)),
    valorOpcionCompra: convertirDecimal(obtenerValor(fila, encabezados.valorOpcionCompra)),
    numeroContrato: obtenerValor(fila, encabezados.numeroContrato) ?? '',
    placa: (obtenerValor(fila, encabezados.placa) ?? '').toUpperCase(),
    contratoVigente,
    nombreLocatarioBanco: obtenerValor(fila, encabezados.nombreLocatarioBanco),
    tipoDocumento: obtenerValor(fila, encabezados.tipoDocumento),
    nitLocatario: obtenerValor(fila, encabezados.nitLocatario) ?? '',
    emailLocatario: obtenerValor(fila, encabezados.emailLocatario)?.toLowerCase(),
  };
}

function validarFilas(filas: CasoImportacion[]): ErrorFila[] {
  const errores: ErrorFila[] = [];
  const contratos = new Map<string, number>();
  const radicados = new Map<string, number>();
  const placas = new Map<string, number>();
  const nits = new Map<string, number>();
  const estados = new Set(['CONTRATO VIGENTE', 'CONTRATO VENCIDO']);

  filas.forEach((fila, indice) => {
    const numero = indice + 2;
    const contrato = fila.numeroContrato.trim();
    const radicado = fila.radicadoBizagi.trim();
    const placa = fila.placa.trim().toUpperCase();
    const nit = fila.nitLocatario.trim();

    if (!radicado) errores.push({ fila: numero, campo: 'Radicado Bizagi', mensaje: 'Es obligatorio.' });
    if (!contrato) errores.push({ fila: numero, campo: 'Numero Contrato', mensaje: 'Es obligatorio.' });
    if (!placa) errores.push({ fila: numero, campo: 'Placa', mensaje: 'Es obligatoria.' });
    if (!nit) errores.push({ fila: numero, campo: 'Nit del Locatario', mensaje: 'Es obligatorio.' });

    if (contratos.has(contrato)) errores.push({ fila: numero, campo: 'Numero Contrato', mensaje: `Repetido en la fila ${contratos.get(contrato)}.` });
    else if (contrato) contratos.set(contrato, numero);
    if (radicados.has(radicado)) errores.push({ fila: numero, campo: 'Radicado Bizagi', mensaje: `Repetido en la fila ${radicados.get(radicado)}.` });
    else if (radicado) radicados.set(radicado, numero);
    if (placas.has(placa)) errores.push({ fila: numero, campo: 'Placa', mensaje: `Repetida en la fila ${placas.get(placa)}.` });
    else if (placa) placas.set(placa, numero);
    if (nits.has(nit)) errores.push({ fila: numero, campo: 'Nit del Locatario', mensaje: `Repetido en la fila ${nits.get(nit)}.` });
    else if (nit) nits.set(nit, numero);

    if (fila.fechaAsignacion && !new Date(fila.fechaAsignacion).getTime()) errores.push({ fila: numero, campo: 'Fecha Asignacion', mensaje: 'Tiene un formato inválido.' });
    if (fila.valorOpcionCompra !== undefined && !Number.isFinite(fila.valorOpcionCompra)) errores.push({ fila: numero, campo: 'Valor Opcion Compra', mensaje: 'Debe ser numérico.' });
    if (fila.contratoVigente && !estados.has(fila.contratoVigente)) errores.push({ fila: numero, campo: 'Contrato Vigente', mensaje: 'Use CONTRATO VIGENTE o CONTRATO VENCIDO.' });
  });

  return errores;
}

export default function CargaCasosExcel({ onClose }: { onClose?: () => void }) {
  const [archivo, setArchivo] = useState<File | null>(null);
  const [filas, setFilas] = useState<CasoImportacion[]>([]);
  const [errores, setErrores] = useState<ErrorFila[]>([]);
  const [resultado, setResultado] = useState<ResultadoImportacion | null>(null);
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);

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
      setMensaje(validaciones.length ? 'Corrige los errores antes de enviar.' : `${convertidas.length} fila(s) lista(s).`);
    } catch (error) {
      setFilas([]);
      setErrores([]);
      setMensaje(error instanceof Error ? error.message : 'No se pudo leer el archivo.');
    }
  }

  async function enviar() {
    if (!filas.length || errores.length || cargando) return;
    setCargando(true);
    try {
      setResultado(await importarCasos(filas));
      setMensaje('Importación finalizada.');
    } catch (error) {
      setMensaje(error instanceof Error ? error.message : 'Error al importar casos.');
    } finally {
      setCargando(false);
    }
  }

  function descargarPlantilla() {
    const hoja = XLSX.utils.json_to_sheet([{
      'Radicado Bizagi': '',
      'Fecha Asignacion': '',
      'Valor Opcion Compra': '',
      'Numero Contrato': '',
      Placa: '',
      'Contrato Vigente': '',
      'Nombre Locatario Banco': '',
      'Tipo Documento': '',
      'Nit del Locatario': '',
      'Email Locatario': '',
    }]);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, 'Casos');
    XLSX.writeFile(libro, 'plantilla-carga-casos.xlsx');
  }

  return (
    <section className="mx-auto max-w-7xl space-y-6 p-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">Carga independiente</p>
          <h1 className="text-2xl font-bold text-slate-900">Carga de casos desde Excel</h1>
          <p className="mt-2 text-sm text-slate-600">Crea o actualiza casos, locatarios y vehículos con la plantilla definida.</p>
        </div>
        {onClose && <button type="button" onClick={onClose} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold">Cerrar</button>}
      </header>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div><h2 className="font-semibold">1. Plantilla</h2><p className="text-sm text-slate-500">Radicado, contrato, placa y NIT son obligatorios.</p></div>
          <button type="button" onClick={descargarPlantilla} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold">Descargar plantilla</button>
        </div>
        <label className="mt-5 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 p-8 text-center">
          <span className="font-medium">{archivo ? archivo.name : 'Selecciona un archivo Excel'}</span>
          <span className="mt-1 text-sm text-slate-500">Formato permitido: .xlsx o .xls</span>
          <input type="file" accept=".xlsx,.xls" className="sr-only" onChange={(event) => { const file = event.target.files?.[0]; if (file) void leerArchivo(file); }} />
        </label>
      </div>

      {mensaje && <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm">{mensaje}</div>}
      {errores.length > 0 && <div className="rounded-xl border border-red-200 bg-red-50 p-5"><h2 className="font-semibold text-red-800">Errores de validación</h2><div className="mt-3 max-h-64 overflow-auto text-sm text-red-700">{errores.map((error, indice) => <p key={`${error.fila}-${error.campo}-${indice}`}>Fila {error.fila}{error.campo ? ` (${error.campo})` : ''}: {error.mensaje}</p>)}</div></div>}

      {filas.length > 0 && <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-semibold">2. Vista previa</h2><p className="text-sm text-slate-500">{filas.length} fila(s) detectada(s).</p></div><button type="button" onClick={() => void enviar()} disabled={Boolean(errores.length) || cargando} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{cargando ? 'Importando...' : 'Confirmar importación'}</button></div><div className="mt-4 overflow-x-auto"><table className="min-w-full text-left text-sm"><thead className="border-b text-xs uppercase text-slate-500"><tr><th className="px-3 py-2">Fila</th><th className="px-3 py-2">Contrato</th><th className="px-3 py-2">Bizagi</th><th className="px-3 py-2">Placa</th><th className="px-3 py-2">NIT</th><th className="px-3 py-2">Valor</th></tr></thead><tbody>{filas.slice(0, 100).map((fila, indice) => <tr key={`${fila.numeroContrato}-${indice}`} className="border-b border-slate-100"><td className="px-3 py-2">{indice + 2}</td><td className="px-3 py-2">{fila.numeroContrato || '—'}</td><td className="px-3 py-2">{fila.radicadoBizagi || '—'}</td><td className="px-3 py-2 font-semibold">{fila.placa || '—'}</td><td className="px-3 py-2">{fila.nitLocatario || '—'}</td><td className="px-3 py-2">{fila.valorOpcionCompra ?? '—'}</td></tr>)}</tbody></table></div></div>}
      {resultado && <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5"><h2 className="font-semibold text-emerald-800">Resultado de la importación</h2><p className="mt-2 text-sm text-emerald-700">Total: {resultado.total} · Creados: {resultado.creados} · Actualizados: {resultado.actualizados} · Rechazados: {resultado.rechazados}</p></div>}
    </section>
  );
}
