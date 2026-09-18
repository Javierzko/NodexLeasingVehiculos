// src/components/detalleCaso.tsx

'use client';

import React, { useState } from 'react';
import { AuditoriaMulta, Caso, ProcesoJuridico } from '@/types/leasing';
import {
  Calendar, User, FileText, Scale, AlertTriangle,
  Calculator, Copy, Check, type LucideIcon, Activity
} from 'lucide-react';

import { SeccionCamposANS } from '../components/CampoDetallesCaso/SeccionCamposANS';
import { SeccionTiemposKPI2 } from '../components/CampoDetallesCaso/SeccionTiemposKPI2';

interface DetalleCasoProps { caso: Caso; onVolver?: () => void }

type Formato = 'fecha' | 'booleano' | 'moneda';
type Tono = 'exito' | 'alerta';

/* =========================================================
   FORMATEADORES
========================================================= */

const texto = (valor: unknown, valorAlternativo = '—'): string =>
  valor === null || valor === undefined || valor === '' ? valorAlternativo : String(valor);

const booleano = (valor?: boolean | null): string =>
  valor === true ? 'Sí' : valor === false ? 'No' : 'No informado';

const formatDate = (valor?: string | Date | null): string => {
  if (!valor) return '—';
  const raw = String(valor);
  const fecha = /^\d{4}-\d{2}-\d{2}$/.test(raw) ? new Date(`${raw}T00:00:00`) : new Date(raw);
  return Number.isNaN(fecha.getTime())
    ? '—'
    : new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium', timeZone: 'UTC' }).format(fecha);
};

const formatCurrency = (valor?: number | string | null): string => {
  if (valor === null || valor === undefined || valor === '') return '—';
  const numero = Number(valor);
  return Number.isFinite(numero)
    ? new Intl.NumberFormat('es-CO', {
        style: 'currency', currency: 'COP', maximumFractionDigits: 0,
      }).format(numero)
    : '—';
};

const estadoVigencia = (valor?: string | Date | null): string => {
  if (!valor) return 'No informado';

  const raw = String(valor);
  const fecha = /^\d{4}-\d{2}-\d{2}$/.test(raw) ? new Date(`${raw}T00:00:00`) : new Date(raw);
  if (Number.isNaN(fecha.getTime())) return 'No informado';

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  fecha.setHours(0, 0, 0, 0);

  return fecha >= hoy ? 'Vigente' : 'No vigente';
};

const tonoVigencia = (valor?: string | Date | null): Tono | undefined => {
  const estado = estadoVigencia(valor);
  return estado === 'Vigente' ? 'exito' : estado === 'No vigente' ? 'alerta' : undefined;
};

const facturacionEstado = (facturado?: boolean | null): string =>
  facturado === true ? 'Facturado' : facturado === false ? 'Pendiente' : 'No informado';

const mostrar = (valor: unknown, formato?: Formato): string =>
  formato === 'fecha' ? formatDate(valor as string | Date | null | undefined)
  : formato === 'booleano' ? booleano(valor as boolean | null | undefined)
  : formato === 'moneda' ? formatCurrency(valor as number | string | null | undefined)
  : texto(valor);

const esVacio = (valor: string) => valor === '—' || valor === 'No informado';

/* =========================================================
   CAMPO
========================================================= */

interface CampoProps {
  etiqueta: string;
  valor: unknown;
  formato?: Formato;
  destacado?: boolean;
  tono?: Tono;
}

const Campo: React.FC<CampoProps> = ({ etiqueta, valor, formato, destacado = false, tono }) => {
  const [copiado, setCopiado] = useState(false);
  const textoValor = mostrar(valor, formato);
  const puedeCopiar = !esVacio(textoValor);

  const copiar = async () => {
    if (!puedeCopiar) return;
    try {
      await navigator.clipboard.writeText(textoValor);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1200);
    } catch {
      // El navegador puede bloquear clipboard en algunos contextos.
    }
  };

  const claseValor = tono === 'exito'
    ? 'font-bold text-emerald-600'
    : tono === 'alerta'
      ? 'font-bold text-red-600'
      : esVacio(textoValor)
        ? 'font-normal text-slate-300'
        : destacado
          ? 'font-bold text-slate-900'
          : 'font-semibold text-slate-800';

  return (
    <div className="group flex items-center justify-between gap-3 rounded-md px-2 py-2 transition-colors hover:bg-slate-50">
      <span className="shrink-0 text-[11px] font-medium text-slate-500">{etiqueta}</span>

      <div className="flex min-w-0 items-center gap-1.5 text-right">
        <span className={`break-words text-xs ${claseValor}`}>{textoValor}</span>

        {puedeCopiar && (
          <button
            type="button"
            onClick={copiar}
            title="Copiar"
            className="rounded p-0.5 text-slate-400 opacity-0 transition-all hover:bg-slate-200 hover:text-slate-700 group-hover:opacity-100"
          >
            {copiado
              ? <Check className="h-3 w-3 text-emerald-600" />
              : <Copy className="h-3 w-3" />}
          </button>
        )}
      </div>
    </div>
  );
};

/* =========================================================
   BLOQUE DE CAMPOS
========================================================= */

type CampoDef = [string, unknown, Formato?, boolean?, Tono?];

interface BloqueProps { titulo: string; campos?: CampoDef[]; children?: React.ReactNode }

const Bloque: React.FC<BloqueProps> = ({ titulo, campos, children }) => (
  <div className="rounded-lg border border-slate-100 bg-slate-50/30 p-4">
    <h3 className="mb-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">{titulo}</h3>

    <div className="divide-y divide-slate-100">
      {campos?.map(([etiqueta, valor, formato, destacado, tono]) => (
        <Campo
          key={etiqueta}
          etiqueta={etiqueta}
          valor={valor}
          formato={formato}
          destacado={destacado}
          tono={tono}
        />
      ))}
      {children}
    </div>
  </div>
);

/* =========================================================
   TARJETA RESUMEN
========================================================= */

const Resumen: React.FC<{ titulo: string; valor: React.ReactNode }> = ({ titulo, valor }) => (
  <div className="rounded-lg bg-slate-50 p-3">
    <p className="text-[11px] font-medium text-slate-400">{titulo}</p>
    <p className="mt-0.5 break-words text-xs font-semibold text-slate-800">{valor}</p>
  </div>
);

/* =========================================================
   NOTAS / OBSERVACIONES
========================================================= */

const Notas: React.FC<{ items: [string, string | null | undefined][] }> = ({ items }) => {
  const visibles = items.filter(([, contenido]) => contenido);
  if (!visibles.length) return null;

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      {visibles.map(([titulo, contenido]) => (
        <div key={titulo} className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-xs">
          <p className="font-semibold text-slate-700">{titulo}</p>
          <p className="mt-1 whitespace-pre-wrap text-slate-600">{contenido}</p>
        </div>
      ))}
    </div>
  );
};

/* =========================================================
   ESTADO VACÍO
========================================================= */

const Vacio: React.FC<{ icono: LucideIcon; mensaje: string }> = ({ icono: Icono, mensaje }) => (
  <div className="rounded-lg border border-slate-100 bg-slate-50 p-6 text-center">
    <Icono className="mx-auto mb-2 h-6 w-6 text-slate-300" />
    <p className="text-xs italic text-slate-400">{mensaje}</p>
  </div>
);

/* =========================================================
   PESTAÑAS
========================================================= */

const TABS = [
  { id: 'proceso', label: 'Progreso y Fechas', icon: Calendar },
  { id: 'ans', label: 'Campos ANS', icon: Activity },
  { id: 'partes', label: 'Locatario y Vehículo', icon: User },
  { id: 'traspaso', label: 'Traspaso y Facturación', icon: FileText },
  { id: 'juridico', label: 'Información Jurídica', icon: Scale },
  { id: 'multas', label: 'Multas e Impuestos', icon: AlertTriangle },
  { id: 'kpi', label: 'Tiempos KPI', icon: Calculator },
];

/* =========================================================
   COMPONENTE PRINCIPAL
========================================================= */

export const DetalleCaso: React.FC<DetalleCasoProps> = ({ caso, onVolver }) => {
  const [tabActiva, setTabActiva] = useState('proceso');

  const procesoJuridico: ProcesoJuridico | null = caso.procesoJuridico ?? null;
  const auditoriaMulta: AuditoriaMulta | null = caso.auditoriaMulta ?? null;

  const estadoActual = texto(caso.estado?.nombre);
  const estadoContrato = texto(caso.estadoContrato?.nombre);
  const esInactivo = ['cerrado', 'finalizado', 'inactivo'].includes(estadoActual.toLowerCase());
  const placa = caso.vehiculo?.placa || caso.vehiculoPlaca;

  const { locatario, vehiculo } = caso;

  return (
    <div className="min-h-screen bg-slate-100/60 font-sans text-slate-900">

      {/* NAVBAR */}
      <header className="flex items-center justify-between bg-slate-900 px-6 py-3 text-white sm:px-8">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Administración</p>
          <h1 className="text-sm font-semibold">Detalle del caso</h1>
        </div>

        {onVolver && (
          <button
            type="button"
            onClick={onVolver}
            className="text-xs text-slate-300 transition-colors hover:text-white"
          >
            ← Volver a casos
          </button>
        )}
      </header>

      <main className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">

        {/* HERO */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
          <div className="space-y-1 border-b border-slate-100 pb-5">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  esInactivo ? 'bg-slate-100 text-slate-600' : 'bg-emerald-50 text-emerald-700'
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${esInactivo ? 'bg-slate-400' : 'bg-emerald-500'}`} />
                {estadoActual}
              </span>

              {caso.categoria?.nombre && (
                <>
                  <span className="text-xs text-slate-300">•</span>
                  <span className="text-xs text-slate-500">{caso.categoria.nombre}</span>
                </>
              )}
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Contrato N° {texto(caso.numeroContrato)}
            </h2>

            <p className="text-xs font-medium text-slate-500">
              Radicado Bizagi:{' '}
              <strong className="text-slate-800">{texto(caso.radicadoBizagi)}</strong>
            </p>
          </div>

          {/* MÉTRICAS */}
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Resumen titulo="Estado actual" valor={estadoActual} />
            <Resumen titulo="Etapa actual" valor={texto(caso.etapa?.nombre)} />
            <Resumen titulo="Analista" valor={texto(caso.analistaResponsable)} />
            <Resumen titulo="Próxima gestión" valor={formatDate(caso.fechaProximaGestion)} />
          </div>
        </div>

        {/* CONTENEDOR PRINCIPAL */}
        <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm">

          {/* PESTAÑAS */}
          <div className="overflow-x-auto border-b border-slate-100 bg-slate-50/50 px-3 pt-2 sm:px-4">
            <nav className="flex min-w-max gap-1">
              {TABS.map(({ id, label, icon: Icon }) => {
                const activa = tabActiva === id;

                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setTabActiva(id)}
                    className={`inline-flex items-center gap-2 border-b-2 px-3 py-3 text-xs font-semibold transition-all sm:px-4 ${
                      activa
                        ? 'rounded-t-lg border-slate-900 bg-white text-slate-900 shadow-sm'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${activa ? 'text-slate-900' : 'text-slate-400'}`} />
                    {label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* CONTENIDO */}
          <div className="p-4 sm:p-6">

            {/* PROCESO */}
            {tabActiva === 'proceso' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <Bloque
                    titulo="Estado y Datos del Expediente"
                    campos={[
                      ['Estado', caso.estado?.nombre, undefined, true],
                      ['Estado contrato', caso.estadoContrato?.nombre],
                      ['Categoría', caso.categoria?.nombre],
                      ['Etapa actual', caso.etapa?.nombre, undefined, true],
                      ['Subetapa', caso.subetapa?.nombre],
                      ['Causa del atraso', caso.causaAtraso?.nombre],
                      ['Estado matrícula', vehiculo?.estadoMatricula?.nombre],
                      ['Inscripción opción compra', caso.aplicaInscripcionOpcionCompra, 'booleano'],
                      ['Valor opción compra', caso.valorOpcionCompra, 'moneda'],
                    ]}
                  />

                  <Bloque
                    titulo="Gestión"
                    campos={[
                      ['Fecha del caso', caso.fecha, 'fecha'],
                      ['Fecha asignación', caso.fechaAsignacion, 'fecha'],
                      ['Última gestión', caso.fechaUltimaGestion, 'fecha'],
                      ['Próxima gestión', caso.fechaProximaGestion, 'fecha'],
                      ['Cierre traspaso', caso.fechaCierreTraspaso, 'fecha'],
                      ['Cierre traspaso Bizagi', caso.fechaCierreTraspasoBizagi, 'fecha'],
                      ['Solicitud suspensión', caso.fechaSolicitudSuspension, 'fecha'],
                      ['Hasta suspensión', caso.fechaHastaSuspension, 'fecha'],
                    ]}
                  />
                </div>

                <Notas
                  items={[
                    ['Observaciones de gestión', caso.observacionesGestion],
                    ['Último comentario', caso.ultimoComentario],
                  ]}
                />
              </div>
            )}

            {/* CAMPOS ANS */}
            {tabActiva === 'ans' && (
              <SeccionCamposANS casoId={caso.id} />
            )}

            {/* LOCATARIO Y VEHÍCULO */}
            {tabActiva === 'partes' && (
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

                {/* LOCATARIO */}
                <Bloque
                  titulo="Información del Locatario"
                  campos={locatario ? [
                    ['Razón social / Banco', locatario.nombreBanco || locatario.nombreComercial, undefined, true],
                    ['NIT / Cédula', locatario.nit],
                    ['Tipo documento', locatario.tipoDocumento],
                    ['Locatario RUNT', locatario.locatarioRunt],
                    ['Email principal', locatario.email],
                    ['Email comercial', locatario.emailComercial],
                    ['Nombre contacto', locatario.contactoNombre],
                    ['Número contacto', locatario.contactoNumero],
                    ['Dirección envío', locatario.direccionEnvio],
                    ['Revisión correo', locatario.revisionCorreo, 'booleano'],
                    ['Revisión mail comercial', locatario.revisionMailComercial, 'booleano'],
                  ] : undefined}
                >
                  {!locatario && (
                    <p className="py-4 text-xs italic text-slate-400">No hay locatario vinculado.</p>
                  )}
                </Bloque>

                {/* VEHÍCULO */}
                <Bloque
                  titulo="Información del Vehículo y Propietario"
                  campos={vehiculo ? [
                    ['Placa', placa, undefined, true],
                    ['Estado matrícula', vehiculo.estadoMatricula?.nombre],
                    ['VIN', vehiculo.vin],
                    ['Chasis', vehiculo.chasis],
                    ['Motor', vehiculo.motor],
                    ['Serie', vehiculo.serie],
                    ['Marca / Línea / Modelo', `${texto(vehiculo.marca)} / ${texto(vehiculo.linea)} / ${texto(vehiculo.modelo)}`],
                    ['Tipo vehículo', vehiculo.tipoVehiculo],
                    ['Cilindraje', vehiculo.cilindraje],
                    ['Color', vehiculo.color],
                    ['Tipo servicio', vehiculo.tipoServicio],
                    ['Tipo carrocería', vehiculo.tipoCarroceria],
                    ['Combustible', vehiculo.tipoCombustible],
                    ['Blindaje', vehiculo.blindaje],
                    ['SOAT', vehiculo.soat?.nombre],
                    ['Vigencia SOAT', vehiculo.vigenciaSoat, 'fecha'],
                    ['Estado SOAT', estadoVigencia(vehiculo.vigenciaSoat), undefined, false, tonoVigencia(vehiculo.vigenciaSoat)],
                    ['Tecnomecánica', vehiculo.revisionTecnomecanica?.nombre],
                    ['Vigencia tecnomecánica', vehiculo.vigenciaTecno, 'fecha'],
                    ['Estado tecnomecánica', estadoVigencia(vehiculo.vigenciaTecno), undefined, false, tonoVigencia(vehiculo.vigenciaTecno)],
                    ['Tránsito', vehiculo.transito],
                    ['Departamento', vehiculo.departamento],
                    ['Regional', vehiculo.regional],
                    ['Empresa transportadora', vehiculo.empresaTransportadora],
                    ['Propietario', vehiculo.propietario?.nombre, undefined, true],
                    ['Identificación propietario', vehiculo.propietario?.identificacion],
                  ] : undefined}
                >
                  {!vehiculo && (
                    <p className="py-4 text-xs italic text-slate-400">No hay vehículo vinculado.</p>
                  )}
                </Bloque>
              </div>
            )}

            {/* TRASPASO Y FACTURACIÓN */}
            {tabActiva === 'traspaso' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <Bloque
                    titulo="Notificaciones"
                    campos={[
                      ['¿Se envió notificación?', caso.seEnvioNotificacion, 'booleano'],
                      ['Fecha límite notificación', caso.fechaDebesEnviarNotificacion, 'fecha'],
                      ['Notificación inicial', caso.fechaNotificacionInicial, 'fecha'],
                      ['Última notificación', caso.fechaUltimaNotificacion, 'fecha'],
                      ['Próxima notificación', caso.fechaProximaNotificacion, 'fecha'],
                    ]}
                  />

                  <Bloque
                    titulo="Traspaso"
                    campos={[
                      ['Traspaso con cita', caso.traspasoConCita, 'booleano'],
                      ['Inicio cita tránsito', caso.fechaInicioCitaTransito, 'fecha'],
                      ['Consecución cita', caso.fechaConsecucionCitaTransito, 'fecha'],
                      ['Cita tránsito', caso.fechaCitaTransito, 'fecha'],
                      ['Radicación traspaso', caso.fechaRadicacionTraspaso, 'fecha'],
                      ['Fecha rechazo', caso.fechaRechazo, 'fecha'],
                      ['Subsanación rechazo', caso.fechaSubsanacionRechazo, 'fecha'],
                      ['Traspaso aprobado', caso.fechaTraspasoAprobado, 'fecha'],
                      ['Ubicación tarjeta', caso.ubicacionTarjeta],
                      ['Corresponsal tramitador', caso.nombreCorresponsalTramitador],
                    ]}
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <Bloque
                    titulo="Entrega de Tarjeta"
                    campos={[
                      ['Entrega datos envío', caso.fechaEntregaDatosEnvio, 'fecha'],
                      ['Programación entrega TP', caso.fechaProgramacionEntregaTp, 'fecha'],
                      ['Entrega TP locatario', caso.fechaEntregaTpLocatario, 'fecha'],
                    ]}
                  />

                  <Bloque
                    titulo="Facturación"
                    campos={[
                      ['Honorarios GP', `${formatCurrency(caso.honorarios)} — ${facturacionEstado(caso.facturado)}`, undefined, true],
                      ['N° Factura GP', `${texto(caso.numeroFactura)} — ${formatDate(caso.fechaFactura)}`],
                      ['Honorarios jurídicos', `${formatCurrency(caso.honorariosServiciosJuridicos)} — ${facturacionEstado(caso.facturadoJuridico)}`],
                      ['N° Factura jurídico', `${texto(caso.numeroFacturaJuridico)} — ${formatDate(caso.fechaFacturaJuridico)}`],
                      ['Fórmula traspasos GPA', caso.formulaTraspasosGpa],
                    ]}
                  />
                </div>

                <Notas
                  items={[
                    ['Observaciones GP', caso.observacionesGp],
                    ['Observaciones generales', caso.observacionesGeneral],
                  ]}
                />
              </div>
            )}

            {/* JURÍDICO */}
            {tabActiva === 'juridico' && (
              procesoJuridico ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <Bloque
                    titulo="Información Procesal"
                    campos={[
                      ['Juzgado', procesoJuridico.juzgado],
                      ['Radicado tutela', procesoJuridico.numeroRadicadoTutela],
                      ['Tipo saneamiento', procesoJuridico.tipoSaneamientoARealizar?.nombre],
                      ['Escalamiento entidad externa', procesoJuridico.fechaEscalamientoEntidadEx, 'fecha'],
                      ['Respuesta entidad externa', procesoJuridico.fechaRespuestaEntidadEx, 'fecha'],
                      ['Liquidación pasivos', procesoJuridico.fechaLiquidacionTotalPasivos, 'fecha'],
                      ['Solicitud recursos', procesoJuridico.fechaSolicitudRecursos, 'fecha'],
                      ['Desembolso recursos', procesoJuridico.fechaDesembolsoRecursos, 'fecha'],
                    ]}
                  />

                  <Bloque
                    titulo="Saneamiento y Tutela"
                    campos={[
                      ['Fin diagnóstico pago pasivos', procesoJuridico.fechaFinDiagnosticoPagoPasivos, 'fecha'],
                      ['Solicitud saneamiento jurídico', procesoJuridico.fechaSolicitudSaneamientoJuridico, 'fecha'],
                      ['Fin saneamiento jurídico', procesoJuridico.fechaFinSaneamientoJuridico, 'fecha'],
                      ['Radicación DP', procesoJuridico.fechaRadicacionDp, 'fecha'],
                      ['Respuesta DP', procesoJuridico.fechaRespuestaDp, 'fecha'],
                      ['Radicación tutela', procesoJuridico.fechaRadicacionTutela, 'fecha'],
                      ['Solicitud documentos adicionales', procesoJuridico.fechaSolicitudDocsAdicionalesTraspaso, 'fecha'],
                      ['Entrega documentos adicionales', procesoJuridico.fechaEntregaDocsAdicionalesTraspaso, 'fecha'],
                      ['Fin gestión documental', procesoJuridico.fechaFinGestionDocumentalTraspaso, 'fecha'],
                    ]}
                  />
                </div>
              ) : (
                <Vacio icono={Scale} mensaje="No hay proceso jurídico registrado." />
              )
            )}

            {/* MULTAS */}
            {tabActiva === 'multas' && (
              auditoriaMulta ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <Bloque
                    titulo="Propiedad y Garantías"
                    campos={[
                      ['Limitaciones propiedad', texto(auditoriaMulta.limitacionesPropiedad, 'Ninguna')],
                      ['Tipo de limitaciones', texto(auditoriaMulta.tipoLimitaciones, 'No informado')],
                      ['Garantías mobiliarias', texto(auditoriaMulta.garantiasMobiliarias, 'Ninguna')],
                    ]}
                  />

                  <Bloque
                    titulo="Multas e Impuestos"
                    campos={[
                      ['SIMIT propietario', texto(auditoriaMulta.simitMultasPropietarioResoluciones, 'Sin novedades')],
                      ['SIMIT locatario', texto(auditoriaMulta.simitMultasLocatario, 'Sin novedades')],
                      ['Multas placa', texto(auditoriaMulta.multasPlaca, 'Sin novedades')],
                      ['Impuestos', texto(auditoriaMulta.impuestos, 'Sin novedades')],
                      ['Vigencias adeudadas', texto(auditoriaMulta.vigenciasAdeudadas, 'Sin novedades')],
                      ['Impuestos tránsito', texto(auditoriaMulta.impuestosTransito, 'Sin novedades')],
                    ]}
                  />
                </div>
              ) : (
                <Vacio icono={AlertTriangle} mensaje="No hay auditoría de multas registrada." />
              )
            )}

            {/* KPI */}
            {tabActiva === 'kpi' && (
              <SeccionTiemposKPI2
                casoId={caso.id}
                placa={placa}
                estadoContrato={estadoContrato}
                categoria={caso.categoria?.nombre}
                etapa={caso.etapa?.nombre}
                subetapa={caso.subetapa?.nombre}
                observacionesGestion={caso.observacionesGestion}
                ultimoComentario={caso.ultimoComentario}
                observacionesGp={caso.observacionesGp}
                observacionesGeneral={caso.observacionesGeneral}
              />
            )}

          </div>
        </div>
      </main>
    </div>
  );
};

export default DetalleCaso;