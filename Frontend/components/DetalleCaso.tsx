'use client';

import React from 'react';
import {
  AuditoriaMulta,
  Caso,
  ProcesoJuridico,
} from '@/types/leasing';

interface DetalleCasoProps {
  caso: Caso;
}

const texto = (valor: unknown, valorAlternativo = '-') =>
  valor !== null && valor !== undefined && valor !== ''
    ? String(valor)
    : valorAlternativo;

const booleano = (valor?: boolean | null) =>
  valor === true ? 'Sí' : valor === false ? 'No' : 'No informado';

const formatDate = (valor?: string | Date | null) => {
  if (!valor) return '-';

  const fecha = new Date(valor);
  return Number.isNaN(fecha.getTime())
    ? '-'
    : fecha.toLocaleDateString('es-CO', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        timeZone: 'UTC',
      });
};

const estadoVigencia = (valor?: string | Date | null) => {
  if (!valor) return 'No informado';

  const fecha =
    typeof valor === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(valor)
      ? new Date(`${valor}T00:00:00`)
      : new Date(valor);
  if (Number.isNaN(fecha.getTime())) return 'No informado';

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  fecha.setHours(0, 0, 0, 0);

  return fecha >= hoy ? 'Vigente' : 'No vigente';
};

const formatCurrency = (valor?: number | string | null) => {
  if (valor === null || valor === undefined || valor === '') return '-';

  const numero = Number(valor);
  if (!Number.isFinite(numero)) return '-';

  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(numero);
};

const Field: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="min-w-0 rounded-lg border border-slate-100 bg-white p-3">
    <span className="block text-[11px] font-medium text-slate-400">
      {label}
    </span>
    <strong className="break-words text-xs text-slate-800">
      {value}
    </strong>
  </div>
);

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <details open className="group rounded-2xl border border-[#d8e8e4] bg-white shadow-sm">
    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-xs font-bold uppercase tracking-[0.12em] text-[#347365] [&::-webkit-details-marker]:hidden">
      <span>{title}</span>
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#e3f2ee] text-sm text-[#438b7d] transition-transform group-open:rotate-180">⌄</span>
    </summary>
    <div className="space-y-4 border-t border-[#e5efec] px-5 pb-5 pt-4">
      {children}
    </div>
  </details>
);

const Grid: React.FC<{ children: React.ReactNode; columns?: string }> = ({
  children,
  columns = 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4',
}) => (
  <div className={`grid ${columns} gap-3 rounded-xl border border-[#e5efec] bg-[#f7fbfa] p-4`}>
    {children}
  </div>
);

export const DetalleCaso: React.FC<DetalleCasoProps> = ({ caso }) => {
  const procesoJuridico: ProcesoJuridico | null = caso.procesoJuridico ?? null;
  const auditoriaMulta: AuditoriaMulta | null = caso.auditoriaMulta ?? null;

  return (
    <div className="detalle-caso mx-auto max-w-7xl space-y-6 rounded-2xl border border-[#d8e8e4] bg-white p-4 text-slate-900 shadow-md sm:p-6 lg:p-8">
      <div className="flex flex-col justify-between gap-5 border-b border-[#e5efec] pb-5 md:flex-row">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-[#b9d3cd] bg-[#e3f2ee] px-2.5 py-1 text-xs font-bold text-[#347365]">
              {texto(caso.estado?.nombre)}
            </span>
            {caso.categoria?.nombre && (
              <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-600">
                {caso.categoria.nombre}
              </span>
            )}
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Contrato N°: {texto(caso.numeroContrato)}
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Radicado Bizagi: <strong>{texto(caso.radicadoBizagi)}</strong>
          </p>
        </div>

        <div className="text-left md:text-right">
          <p className="text-[11px] font-semibold uppercase text-slate-400">
            Analista Responsable
          </p>
          <p className="text-sm font-semibold text-[#347365]">
            {texto(caso.analistaResponsable)}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Estado Contrato:{' '}
            <strong>{texto(caso.estadoContrato?.nombre)}</strong>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-[#d8e8e4] bg-[#f7fbfa] p-4">
          <p className="text-[10px] font-bold uppercase tracking-wide text-[#6d8581]">Estado actual</p>
          <p className="mt-2 text-sm font-bold text-[#347365]">{texto(caso.estado?.nombre)}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Etapa</p>
          <p className="mt-2 text-sm font-bold text-slate-800">{texto(caso.etapa?.nombre)}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Próxima gestión</p>
          <p className="mt-2 text-sm font-bold text-slate-800">{formatDate(caso.fechaProximaGestion)}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Vehículo</p>
          <p className="mt-2 text-sm font-bold text-slate-800">{texto(caso.vehiculo?.placa || caso.vehiculoPlaca)}</p>
        </div>
      </div>

      <Section title="Estado y Condiciones del Expediente">
        <Grid>
          <Field label="Estado" value={texto(caso.estado?.nombre)} />
          <Field label="Estado Contrato" value={texto(caso.estadoContrato?.nombre)} />
          <Field label="Categoría" value={texto(caso.categoria?.nombre)} />
          <Field label="Etapa Actual" value={texto(caso.etapa?.nombre)} />
          <Field label="Subetapa" value={texto(caso.subetapa?.nombre)} />
          <Field label="Causa del Atraso" value={texto(caso.causaAtraso?.nombre)} />
          <Field
            label="Estado de Matrícula"
            value={texto(caso.vehiculo?.estadoMatricula?.nombre)}
          />
          <Field
            label="Inscripción Opción de Compra"
            value={booleano(caso.aplicaInscripcionOpcionCompra)}
          />
          <Field
            label="Valor Opción de Compra"
            value={formatCurrency(caso.valorOpcionCompra)}
          />
        </Grid>
      </Section>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Section title="Información del Locatario">
          {caso.locatario ? (
            <div className="space-y-5 text-xs text-slate-600">
              <div>
                <h3 className="mb-2 border-b border-[#e5efec] pb-2 text-[11px] font-bold uppercase tracking-wide text-[#347365]">
                  Identificación
                </h3>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <Field label="Razón social / Banco" value={texto(caso.locatario.nombreBanco || caso.locatario.nombreComercial)} />
                  <Field label="NIT / Cédula" value={texto(caso.locatario.nit)} />
                  <Field label="Tipo de documento" value={texto(caso.locatario.tipoDocumento)} />
                  <Field label="Locatario RUNT" value={texto(caso.locatario.locatarioRunt)} />
                </div>
              </div>

              <div>
                <h3 className="mb-2 border-b border-[#e5efec] pb-2 text-[11px] font-bold uppercase tracking-wide text-[#347365]">
                  Contacto y envío
                </h3>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <Field label="Email principal" value={texto(caso.locatario.email)} />
                  <Field label="Email comercial" value={texto(caso.locatario.emailComercial)} />
                  <Field label="Nombre de contacto" value={texto(caso.locatario.contactoNombre)} />
                  <Field label="Número de contacto" value={texto(caso.locatario.contactoNumero)} />
                  <Field label="Dirección de envío" value={texto(caso.locatario.direccionEnvio)} />
                </div>
              </div>

              <div>
                <h3 className="mb-2 border-b border-[#e5efec] pb-2 text-[11px] font-bold uppercase tracking-wide text-[#347365]">
                  Verificaciones
                </h3>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <Field label="Revisión de correo" value={booleano(caso.locatario.revisionCorreo)} />
                  <Field label="Revisión de mail comercial" value={booleano(caso.locatario.revisionMailComercial)} />
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs italic text-slate-400">No hay locatario vinculado.</p>
          )}
        </Section>

        <Section title="Información del Vehículo y Propietario">
          {caso.vehiculo ? (
            <div className="space-y-5 text-xs text-slate-600">
              <div>
                <h3 className="mb-2 border-b border-[#e5efec] pb-2 text-[11px] font-bold uppercase tracking-wide text-[#347365]">
                  Identificación del vehículo
                </h3>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <Field label="Placa" value={<span className="font-bold text-[#347365]">{texto(caso.vehiculo.placa || caso.vehiculoPlaca)}</span>} />
                  <Field label="Estado de matrícula" value={texto(caso.vehiculo.estadoMatricula?.nombre)} />
                  <Field label="VIN" value={texto(caso.vehiculo.vin)} />
                  <Field label="Chasis" value={texto(caso.vehiculo.chasis)} />
                  <Field label="Motor" value={texto(caso.vehiculo.motor)} />
                  <Field label="Serie" value={texto(caso.vehiculo.serie)} />
                </div>
              </div>

              <div>
                <h3 className="mb-2 border-b border-[#e5efec] pb-2 text-[11px] font-bold uppercase tracking-wide text-[#347365]">
                  Características y clasificación
                </h3>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <Field label="Marca / Línea / Modelo" value={`${texto(caso.vehiculo.marca)} / ${texto(caso.vehiculo.linea)} / ${texto(caso.vehiculo.modelo)}`} />
                  <Field label="Tipo de vehículo" value={texto(caso.vehiculo.tipoVehiculo)} />
                  <Field label="Cilindraje" value={texto(caso.vehiculo.cilindraje)} />
                  <Field label="Color" value={texto(caso.vehiculo.color)} />
                  <Field label="Tipo de servicio" value={texto(caso.vehiculo.tipoServicio)} />
                  <Field label="Tipo de carrocería" value={texto(caso.vehiculo.tipoCarroceria)} />
                  <Field label="Combustible" value={texto(caso.vehiculo.tipoCombustible)} />
                  <Field label="Blindaje" value={texto(caso.vehiculo.blindaje)} />
                </div>
              </div>

              <div>
                <h3 className="mb-2 border-b border-[#e5efec] pb-2 text-[11px] font-bold uppercase tracking-wide text-[#347365]">
                  Documentación y ubicación
                </h3>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <Field label="SOAT" value={texto(caso.vehiculo.soat?.nombre)} />
                  <Field label="Vigencia SOAT" value={formatDate(caso.vehiculo.vigenciaSoat)} />
                  <Field label="Estado SOAT" value={<span className={estadoVigencia(caso.vehiculo.vigenciaSoat) === 'Vigente' ? 'font-bold text-emerald-600' : 'font-bold text-red-600'}>{estadoVigencia(caso.vehiculo.vigenciaSoat)}</span>} />
                  <Field label="Tecnomecánica" value={texto(caso.vehiculo.revisionTecnomecanica?.nombre)} />
                  <Field label="Vigencia tecnomecánica" value={formatDate(caso.vehiculo.vigenciaTecno)} />
                  <Field label="Estado tecnomecánica" value={<span className={estadoVigencia(caso.vehiculo.vigenciaTecno) === 'Vigente' ? 'font-bold text-emerald-600' : 'font-bold text-red-600'}>{estadoVigencia(caso.vehiculo.vigenciaTecno)}</span>} />
                  <Field label="Tránsito / Organismo" value={texto(caso.vehiculo.transito)} />
                  <Field label="Departamento" value={texto(caso.vehiculo.departamento)} />
                  <Field label="Regional" value={texto(caso.vehiculo.regional)} />
                  <Field label="Empresa transportadora" value={texto(caso.vehiculo.empresaTransportadora)} />
                </div>
              </div>

              <div>
                <h3 className="mb-2 border-b border-[#e5efec] pb-2 text-[11px] font-bold uppercase tracking-wide text-[#347365]">
                  Propietario
                </h3>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <Field label="Nombre" value={texto(caso.vehiculo.propietario?.nombre)} />
                  <Field label="Identificación" value={texto(caso.vehiculo.propietario?.identificacion)} />
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs italic text-slate-400">No hay vehículo vinculado.</p>
          )}
        </Section>
      </div>

      <Section title="Gestión, Fechas Clave y Tiempos">
        <Grid>
          <Field label="Fecha del Caso" value={formatDate(caso.fecha)} />
          <Field label="Fecha Asignación" value={formatDate(caso.fechaAsignacion)} />
          <Field label="Última Gestión" value={formatDate(caso.fechaUltimaGestion)} />
          <Field label="Próxima Gestión" value={formatDate(caso.fechaProximaGestion)} />
          <Field label="Cierre Traspaso" value={formatDate(caso.fechaCierreTraspaso)} />
          <Field label="Cierre Traspaso Bizagi" value={formatDate(caso.fechaCierreTraspasoBizagi)} />
          <Field label="Causa Atraso" value={texto(caso.causaAtraso?.nombre)} />
          <Field label="Solicitud Suspensión" value={formatDate(caso.fechaSolicitudSuspension)} />
          <Field label="Hasta Suspensión" value={formatDate(caso.fechaHastaSuspension)} />
        </Grid>

        {caso.observacionesGestion && (
          <div className="rounded-lg border border-[#d8e8e4] bg-[#f7fbfa] p-3 text-xs">
            <strong className="text-[#347365]">Observaciones de Gestión</strong>
            <p className="mt-1 whitespace-pre-wrap text-[#52716b]">{caso.observacionesGestion}</p>
          </div>
        )}
        {caso.ultimoComentario && (
          <div className="rounded-lg border border-[#d8e8e4] bg-[#f7fbfa] p-3 text-xs">
            <strong className="text-[#347365]">Último Comentario</strong>
            <p className="mt-1 whitespace-pre-wrap text-[#52716b]">{caso.ultimoComentario}</p>
          </div>
        )}
      </Section>

      <Section title="Notificaciones, Traspaso y Logística">
        <Grid columns="grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          <Field label="¿Se envió Notificación?" value={booleano(caso.seEnvioNotificacion)} />
          <Field label="Fecha Debes Enviar Notificación" value={formatDate(caso.fechaDebesEnviarNotificacion)} />
          <Field label="Notificación Inicial" value={formatDate(caso.fechaNotificacionInicial)} />
          <Field label="Última Notificación" value={formatDate(caso.fechaUltimaNotificacion)} />
          <Field label="Próxima Notificación" value={formatDate(caso.fechaProximaNotificacion)} />
          <Field label="Traspaso Con Cita" value={booleano(caso.traspasoConCita)} />
          <Field label="Inicio Cita Tránsito" value={formatDate(caso.fechaInicioCitaTransito)} />
          <Field label="Consecución Cita" value={formatDate(caso.fechaConsecucionCitaTransito)} />
          <Field label="Cita Tránsito" value={formatDate(caso.fechaCitaTransito)} />
          <Field label="Radicación Traspaso" value={formatDate(caso.fechaRadicacionTraspaso)} />
          <Field label="Fecha Rechazo" value={formatDate(caso.fechaRechazo)} />
          <Field label="Subsanación Rechazo" value={formatDate(caso.fechaSubsanacionRechazo)} />
          <Field label="Traspaso Aprobado" value={formatDate(caso.fechaTraspasoAprobado)} />
          <Field label="Ubicación Tarjeta" value={texto(caso.ubicacionTarjeta)} />
          <Field label="Corresponsal Tramitador" value={texto(caso.nombreCorresponsalTramitador)} />
          <Field label="Fecha Entrega Datos Envío" value={formatDate(caso.fechaEntregaDatosEnvio)} />
          <Field label="Programación Entrega TP" value={formatDate(caso.fechaProgramacionEntregaTp)} />
          <Field label="Entrega TP Locatario" value={formatDate(caso.fechaEntregaTpLocatario)} />
        </Grid>
      </Section>

      <Section title="Facturación y Tiempos KPI">
        <Grid columns="grid-cols-1 md:grid-cols-2">
          <Field label="Honorarios GP" value={`${formatCurrency(caso.honorarios)} — ${booleano(caso.facturado) === 'Sí' ? 'Facturado' : booleano(caso.facturado) === 'No' ? 'Pendiente' : 'No informado'}`} />
          <Field label="N° Factura GP" value={`${texto(caso.numeroFactura)} — ${formatDate(caso.fechaFactura)}`} />
          <Field label="Honorarios Jurídicos" value={`${formatCurrency(caso.honorariosServiciosJuridicos)} — ${booleano(caso.facturadoJuridico) === 'Sí' ? 'Facturado' : booleano(caso.facturadoJuridico) === 'No' ? 'Pendiente' : 'No informado'}`} />
          <Field label="N° Factura Jurídico" value={`${texto(caso.numeroFacturaJuridico)} — ${formatDate(caso.fechaFacturaJuridico)}`} />
          <Field label="Fórmula Traspasos GPA" value={texto(caso.formulaTraspasosGpa)} />
        </Grid>

        {(caso.observacionesGp || caso.observacionesGeneral) && (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {caso.observacionesGp && (
              <div className="rounded-lg border border-[#d8e8e4] bg-[#f7fbfa] p-3 text-xs">
                <strong className="text-[#347365]">Observaciones GP</strong>
                <p className="mt-1 whitespace-pre-wrap text-[#52716b]">{caso.observacionesGp}</p>
              </div>
            )}
            {caso.observacionesGeneral && (
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs">
                <strong className="text-slate-900">Observaciones Generales</strong>
                <p className="mt-1 whitespace-pre-wrap text-slate-700">{caso.observacionesGeneral}</p>
              </div>
            )}
          </div>
        )}

        <div className="border-t pt-3">
          <p className="mb-2 text-xs font-semibold text-slate-700">Tiempos Transcurridos (Días)</p>
          <div className="grid grid-cols-2 gap-2 text-[11px] md:grid-cols-3">
            <Field label="Ent. Externas" value={texto(caso.tiempoEntidadesExternas, '0') + 'd'} />
            <Field label="Banco" value={texto(caso.tiempoBanco, '0') + 'd'} />
            <Field label="Jurídico Externo" value={texto(caso.tiempoJuridicoExterno, '0') + 'd'} />
            <Field label="Jurídico Interno" value={texto(caso.tiempoJuridicoInterno, '0') + 'd'} />
            <Field label="Tránsito" value={texto(caso.tiempoTransito, '0') + 'd'} />
            <Field label="Operativo Analista" value={texto(caso.tiempoOperativoAnalista, '0') + 'd'} />
          </div>
        </div>
      </Section>

      <Section title="Información Procesal / Jurídica">
        {procesoJuridico ? (
          <Grid>
            <Field label="Juzgado" value={texto(procesoJuridico.juzgado)} />
            <Field label="Radicado Tutela" value={texto(procesoJuridico.numeroRadicadoTutela)} />
            <Field label="Tipo Saneamiento" value={texto(procesoJuridico.tipoSaneamientoARealizar?.nombre)} />
            <Field label="Escalamiento Entidad Externa" value={formatDate(procesoJuridico.fechaEscalamientoEntidadEx)} />
            <Field label="Respuesta Entidad Externa" value={formatDate(procesoJuridico.fechaRespuestaEntidadEx)} />
            <Field label="Liquidación Pasivos" value={formatDate(procesoJuridico.fechaLiquidacionTotalPasivos)} />
            <Field label="Solicitud Recursos" value={formatDate(procesoJuridico.fechaSolicitudRecursos)} />
            <Field label="Desembolso Recursos" value={formatDate(procesoJuridico.fechaDesembolsoRecursos)} />
            <Field label="Fin Diagnóstico Pago Pasivos" value={formatDate(procesoJuridico.fechaFinDiagnosticoPagoPasivos)} />
            <Field label="Solicitud Saneamiento Jurídico" value={formatDate(procesoJuridico.fechaSolicitudSaneamientoJuridico)} />
            <Field label="Fin Saneamiento Jurídico" value={formatDate(procesoJuridico.fechaFinSaneamientoJuridico)} />
            <Field label="Radicación DP" value={formatDate(procesoJuridico.fechaRadicacionDp)} />
            <Field label="Respuesta DP" value={formatDate(procesoJuridico.fechaRespuestaDp)} />
            <Field label="Radicación Tutela" value={formatDate(procesoJuridico.fechaRadicacionTutela)} />
            <Field label="Solicitud Docs. Adicionales" value={formatDate(procesoJuridico.fechaSolicitudDocsAdicionalesTraspaso)} />
            <Field label="Entrega Docs. Adicionales" value={formatDate(procesoJuridico.fechaEntregaDocsAdicionalesTraspaso)} />
            <Field label="Fin Gestión Documental" value={formatDate(procesoJuridico.fechaFinGestionDocumentalTraspaso)} />
          </Grid>
        ) : (
          <p className="text-xs italic text-slate-400">No hay proceso jurídico registrado.</p>
        )}
      </Section>

      <Section title="Auditoría de Multas e Impuestos">
        {auditoriaMulta ? (
          <Grid>
            <Field label="Limitaciones Propiedad" value={texto(auditoriaMulta.limitacionesPropiedad, 'Ninguna')} />
            <Field label="Tipo de Limitaciones" value={texto(auditoriaMulta.tipoLimitaciones, 'No informado')} />
            <Field label="Garantías Mobiliarias" value={texto(auditoriaMulta.garantiasMobiliarias, 'Ninguna')} />
            <Field label="SIMIT Propietario" value={texto(auditoriaMulta.simitMultasPropietarioResoluciones, 'Sin novedades')} />
            <Field label="SIMIT Locatario" value={texto(auditoriaMulta.simitMultasLocatario, 'Sin novedades')} />
            <Field label="Multas Placa" value={texto(auditoriaMulta.multasPlaca, 'Sin novedades')} />
            <Field label="Impuestos" value={texto(auditoriaMulta.impuestos, 'Sin novedades')} />
            <Field label="Vigencias Adeudadas" value={texto(auditoriaMulta.vigenciasAdeudadas, 'Sin novedades')} />
            <Field label="Impuestos Tránsito" value={texto(auditoriaMulta.impuestosTransito, 'Sin novedades')} />
          </Grid>
        ) : (
          <p className="text-xs italic text-slate-400">No hay auditoría de multas registrada.</p>
        )}
      </Section>
    </div>
  );
};

export default DetalleCaso;