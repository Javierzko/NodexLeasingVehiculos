import { readFile, writeFile } from "node:fs/promises";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const inputPath = process.argv[2] ?? "./archivos/vehiculos_migracion.json";
const dryRun = process.argv.includes("--dry-run");

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("Falta DATABASE_URL en las variables de entorno.");

const pool = new Pool({ connectionString });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

type JsonRow = {
  numeroContrato?: unknown;
  radicadoBizagi?: unknown;
  fechaAsignacion?: unknown;
  analistaResponsable?: unknown;
  aplicaInscripcionOpcionCompra?: unknown;
  valorOpcionCompra?: unknown;
  estadoContrato?: unknown;
  locatario?: Record<string, unknown>;
  propietario?: Record<string, unknown>;
  vehiculo?: Record<string, unknown>;
  caso?: Record<string, unknown>;
  procesoJuridico?: Record<string, unknown>;
  auditoriaMulta?: Record<string, unknown>;
};

type Payload = { version: number; sourceSheet: string; rows: JsonRow[] };

type Result = { fila: number; contrato?: string; estado: "insertado" | "actualizado" | "omitido" | "error"; motivo?: string };

async function main() {
  const payload = JSON.parse(await readFile(inputPath, "utf8")) as Payload;
  if (!Array.isArray(payload.rows)) throw new Error("El JSON no contiene rows[].");

  const results: Result[] = [];
  for (let index = 0; index < payload.rows.length; index++) {
    const row = payload.rows[index];
    try {
      const result = await processRow(row, index + 1);
      results.push(result);
      console.log(`${result.estado}: fila ${result.fila}${result.contrato ? ` / contrato ${result.contrato}` : ""}${result.motivo ? ` / ${result.motivo}` : ""}`);
    } catch (error) {
      const motivo = error instanceof Error ? error.message : String(error);
      results.push({ fila: index + 1, estado: "error", motivo });
      console.error(`ERROR: fila ${index + 1} / ${motivo}`);
    }
  }

  const reportPath = inputPath.replace(/\.json$/i, "") + "_resultado.json";
  await writeFile(reportPath, JSON.stringify({ inputPath, dryRun, results }, null, 2), "utf8");
  console.log(`Reporte: ${reportPath}`);
}

async function processRow(row: JsonRow, fila: number): Promise<Result> {
  const contrato = text(row.numeroContrato);
  const placa = text(row.vehiculo?.placa);
  const nit = text(row.locatario?.nit);

  if (!contrato || !placa || !nit) {
    return { fila, contrato: contrato ?? undefined, estado: "omitido", motivo: "Faltan numeroContrato, placa o NIT del locatario" };
  }

  if (dryRun) return { fila, contrato, estado: "omitido", motivo: "dry-run: no se escribió en la base de datos" };

  return prisma.$transaction(async tx => {
    const before = await tx.caso.findUnique({ where: { numeroContrato: contrato }, select: { id: true } });
    const locatario = await tx.locatario.upsert({
      where: { nit },
      create: buildLocatario(row.locatario!),
      update: omitNulls(buildLocatario(row.locatario!))
    });

    const propietarioIdentificacion = text(row.propietario?.identificacion);
    let propietarioId: number | undefined;
    if (propietarioIdentificacion) {
      const propietario = await tx.propietario.upsert({
        where: { identificacion: propietarioIdentificacion },
        create: { identificacion: propietarioIdentificacion, nombre: text(row.propietario?.nombre) ?? "SIN NOMBRE" },
        update: omitNulls({ nombre: text(row.propietario?.nombre) })
      });
      propietarioId = propietario.id;
    }

    const vehiculoData = buildVehiculo(row.vehiculo!, propietarioId);
    await tx.vehiculo.upsert({
      where: { placa },
      create: { ...vehiculoData, placa },
      update: omitNulls(vehiculoData)
    });

    const estadoContratoId = await estadoId(tx, "ESTADO_CONTRATO", row.estadoContrato);
    const estadoIdCaso = await estadoId(tx, "ESTADO_CASO", row.caso?.estado);
    const categoriaId = await estadoId(tx, "CATEGORIA", row.caso?.categoria);
    const etapaId = await estadoId(tx, "ETAPA", row.caso?.etapa);
    const subetapaId = await estadoId(tx, "SUBETAPA", row.caso?.subetapa);
    const causaAtrasoId = await estadoId(tx, "CAUSA_ATRASO", row.caso?.causaAtraso);

    const casoData = buildCaso(row, { locatarioId: locatario.id, placa, estadoContratoId, estadoIdCaso, categoriaId, etapaId, subetapaId, causaAtrasoId });
    const caso = await tx.caso.upsert({
      where: { numeroContrato: contrato },
      create: { ...casoData, numeroContrato: contrato, locatarioId: locatario.id, vehiculoPlaca: placa },
      update: omitNulls(casoData)
    });

    const juridico = buildProcesoJuridico(row.procesoJuridico);
    if (hasValues(juridico)) {
      const tipoSaneamientoARealizarId = await estadoId(tx, "TIPO_SANEAMIENTO", row.procesoJuridico?.tipoSaneamientoARealizar);
      await tx.procesoJuridico.upsert({
        where: { casoId: caso.id },
        create: { ...juridico, casoId: caso.id, tipoSaneamientoARealizarId },
        update: omitNulls({ ...juridico, tipoSaneamientoARealizarId })
      });
    }

    const auditoria = buildAuditoria(row.auditoriaMulta);
    if (hasValues(auditoria)) {
      await tx.auditoriaMulta.upsert({
        where: { casoId: caso.id },
        create: { ...auditoria, casoId: caso.id },
        update: omitNulls(auditoria)
      });
    }

    return { fila, contrato, estado: before ? "actualizado" : "insertado" };
  });
}

function buildLocatario(v: Record<string, unknown>) {
  return {
    nit: text(v.nit)!, nombreBanco: text(v.nombreBanco), tipoDocumento: text(v.tipoDocumento), email: text(v.email),
    revisionCorreo: bool(v.revisionCorreo) ?? false, contactoNombre: text(v.contactoNombre), contactoNumero: text(v.contactoNumero),
    direccionEnvio: text(v.direccionEnvio), locatarioRunt: text(v.locatarioRunt), nombreComercial: text(v.nombreComercial),
    emailComercial: text(v.emailComercial), revisionMailComercial: bool(v.revisionMailComercial) ?? false
  };
}

function buildVehiculo(v: Record<string, unknown>, propietarioId?: number) {
  return {
    vin: text(v.vin), marca: text(v.marca), linea: text(v.linea), modelo: integer(v.modelo), cilindraje: text(v.cilindraje),
    motor: text(v.motor), chasis: text(v.chasis), serie: text(v.serie), color: text(v.color), tipoVehiculo: text(v.tipoVehiculo),
    tipoServicio: text(v.tipoServicio), tipoCarroceria: text(v.tipoCarroceria), tipoCombustible: text(v.tipoCombustible), blindaje: text(v.blindaje),
    transito: text(v.transito), departamento: text(v.departamento), regional: text(v.regional), empresaTransportadora: text(v.empresaTransportadora),
    vigenciaSoat: date(v.vigenciaSoat), vigenciaTecno: date(v.vigenciaTecno), propietarioId
  };
}

function buildCaso(row: JsonRow, ids: { locatarioId: number; placa: string; estadoContratoId?: number; estadoIdCaso?: number; categoriaId?: number; etapaId?: number; subetapaId?: number; causaAtrasoId?: number }) {
  const c = row.caso ?? {};
  return {
    radicadoBizagi: text(row.radicadoBizagi), estadoContratoId: ids.estadoContratoId, fechaAsignacion: date(row.fechaAsignacion),
    analistaResponsable: text(row.analistaResponsable), aplicaInscripcionOpcionCompra: bool(row.aplicaInscripcionOpcionCompra) ?? false,
    valorOpcionCompra: decimal(row.valorOpcionCompra), estadoId: ids.estadoIdCaso, categoriaId: ids.categoriaId, etapaId: ids.etapaId,
    subetapaId: ids.subetapaId, causaAtrasoId: ids.causaAtrasoId, seEnvioNotificacion: bool(c.seEnvioNotificacion) ?? false,
    fechaDebesEnviarNotificacion: date(c.fechaDebesEnviarNotificacion), fechaNotificacionInicial: date(c.fechaNotificacionInicial),
    fechaUltimaNotificacion: date(c.fechaUltimaNotificacion), fechaProximaNotificacion: date(c.fechaProximaNotificacion),
    fechaUltimaGestion: date(c.fechaUltimaGestion), fechaProximaGestion: date(c.fechaProximaGestion), observacionesGestion: text(c.observacionesGestion),
    ultimoComentario: text(c.ultimoComentario), fechaSolicitudSuspension: date(c.fechaSolicitudSuspension), fechaHastaSuspension: date(c.fechaHastaSuspension),
    traspasoConCita: bool(c.traspasoConCita) ?? false, fechaInicioCitaTransito: date(c.fechaInicioCitaTransito),
    fechaConsecucionCitaTransito: date(c.fechaConsecucionCitaTransito), fechaCitaTransito: date(c.fechaCitaTransito), fechaRadicacionTraspaso: date(c.fechaRadicacionTraspaso),
    fechaRechazo: date(c.fechaRechazo), fechaSubsanacionRechazo: date(c.fechaSubsanacionRechazo), fechaTraspasoAprobado: date(c.fechaTraspasoAprobado),
    fechaCierreTraspasoBizagi: date(c.fechaCierreTraspasoBizagi), ubicacionTarjeta: text(c.ubicacionTarjeta), nombreCorresponsalTramitador: text(c.nombreCorresponsalTramitador),
    fechaEntregaDatosEnvio: date(c.fechaEntregaDatosEnvio), fechaProgramacionEntregaTp: date(c.fechaProgramacionEntregaTp), fechaEntregaTpLocatario: date(c.fechaEntregaTpLocatario),
    tiempoEntidadesExternas: decimal(c.tiempoEntidadesExternas), tiempoBanco: decimal(c.tiempoBanco), tiempoJuridicoExterno: decimal(c.tiempoJuridicoExterno),
    tiempoJuridicoInterno: decimal(c.tiempoJuridicoInterno), tiempoTransito: decimal(c.tiempoTransito), tiempoOperativoAnalista: decimal(c.tiempoOperativoAnalista),
    honorarios: decimal(c.honorarios), facturado: bool(c.facturado) ?? false, fechaFactura: date(c.fechaFactura), numeroFactura: text(c.numeroFactura),
    observacionesGp: text(c.observacionesGp), formulaTraspasosGpa: text(c.formulaTraspasosGpa), honorariosServiciosJuridicos: decimal(c.honorariosServiciosJuridicos),
    facturadoJuridico: bool(c.facturadoJuridico) ?? false, numeroFacturaJuridico: text(c.numeroFacturaJuridico), fechaFacturaJuridico: date(c.fechaFacturaJuridico),
    observacionesGeneral: text(c.observacionesGeneral)
  };
}

function buildProcesoJuridico(v?: Record<string, unknown>) {
  const p = v ?? {};
  return {
    fechaEscalamientoEntidadEx: date(p.fechaEscalamientoEntidadEx), fechaRespuestaEntidadEx: date(p.fechaRespuestaEntidadEx),
    fechaLiquidacionTotalPasivos: date(p.fechaLiquidacionTotalPasivos), fechaSolicitudRecursos: date(p.fechaSolicitudRecursos),
    fechaDesembolsoRecursos: date(p.fechaDesembolsoRecursos), fechaFinDiagnosticoPagoPasivos: date(p.fechaFinDiagnosticoPagoPasivos),
    fechaSolicitudSaneamientoJuridico: date(p.fechaSolicitudSaneamientoJuridico), fechaFinSaneamientoJuridico: date(p.fechaFinSaneamientoJuridico),
    fechaRadicacionDp: date(p.fechaRadicacionDp), fechaRespuestaDp: date(p.fechaRespuestaDp), fechaRadicacionTutela: date(p.fechaRadicacionTutela),
    numeroRadicadoTutela: text(p.numeroRadicadoTutela), juzgado: text(p.juzgado), fechaSolicitudDocsAdicionalesTraspaso: date(p.fechaSolicitudDocsAdicionalesTraspaso),
    fechaEntregaDocsAdicionalesTraspaso: date(p.fechaEntregaDocsAdicionalesTraspaso), fechaFinGestionDocumentalTraspaso: date(p.fechaFinGestionDocumentalTraspaso)
  };
}

function buildAuditoria(v?: Record<string, unknown>) {
  const a = v ?? {};
  return {
    limitacionesPropiedad: text(a.limitacionesPropiedad), tipoLimitaciones: text(a.tipoLimitaciones), garantiasMobiliarias: text(a.garantiasMobiliarias),
    simitMultasPropietarioResoluciones: text(a.simitMultasPropietarioResoluciones), simitMultasLocatario: text(a.simitMultasLocatario),
    multasPlaca: text(a.multasPlaca), impuestos: text(a.impuestos), vigenciasAdeudadas: text(a.vigenciasAdeudadas), impuestosTransito: text(a.impuestosTransito)
  };
}

async function estadoId(tx: any, tipo: string, value: unknown): Promise<number | undefined> {
  const nombre = text(value);
  if (!nombre) return undefined;
  const found = await tx.estado.findFirst({ where: { tipo, nombre } });
  if (!found) throw new Error(`Catálogo no encontrado: ${tipo} / ${nombre}`);
  return found.id;
}

function text(value: unknown): string | undefined {
  if (value === null || value === undefined) return undefined;
  const s = String(value).trim();
  return !s || ["N/A", "#N/A", "#REF!", "NULL", "-"].includes(s.toUpperCase()) ? undefined : s;
}
function bool(value: unknown): boolean | undefined {
  const s = text(value)?.toUpperCase();
  if (!s) return undefined;
  if (["SI", "SÍ", "TRUE", "1", "YES"].includes(s)) return true;
  if (["NO", "FALSE", "0"].includes(s)) return false;
  return undefined;
}
function integer(value: unknown): number | undefined { const n = Number(value); return Number.isFinite(n) ? Math.trunc(n) : undefined; }
function decimal(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const s = text(value)?.replace(/\$/g, "").replace(/\s/g, "").replace(/\.(?=\d{3}(?:\D|$))/g, "").replace(/,/g, ".");
  const n = s ? Number(s) : NaN;
  return Number.isFinite(n) ? n : undefined;
}
function date(value: unknown): Date | undefined {
  if (value instanceof Date) return value;
  if (typeof value === "number" && Number.isFinite(value)) return new Date(Date.UTC(1899, 11, 30) + value * 86400000);
  const s = text(value);
  if (!s) return undefined;
  const match = s.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{2,4})$/);
  if (match) {
    const [, a, b, y] = match; const year = Number(y) < 100 ? 2000 + Number(y) : Number(y);
    return new Date(Date.UTC(year, Number(b) - 1, Number(a)));
  }
  const parsed = new Date(s);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}
function omitNulls<T extends Record<string, unknown>>(obj: T): Partial<T> {
  return Object.fromEntries(Object.entries(obj).filter(([, value]) => value !== undefined && value !== null && value !== "")) as Partial<T>;
}
function hasValues(obj: Record<string, unknown>): boolean { return Object.values(obj).some(value => value !== undefined && value !== null && value !== ""); }

main().catch(async error => { console.error(error); process.exitCode = 1; }).finally(async () => { await prisma.$disconnect(); await pool.end(); });
