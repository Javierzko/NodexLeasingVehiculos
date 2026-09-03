//raiz types/leasing.ts

export interface Estado {
  id: number;
  tipo: string;
  nombre: string;
  activo: boolean;
}

export interface Locatario {
  id: number;
  nit: string;
  nombreBanco?: string | null;
  tipoDocumento?: string | null;
  email?: string | null;
  revisionCorreo?: boolean;
  contactoNombre?: string | null;
  contactoNumero?: string | null;
  direccionEnvio?: string | null;
  locatarioRunt?: string | null;
  nombreComercial?: string | null;
  emailComercial?: string | null;
  revisionMailComercial?: boolean;
}

export interface Propietario {
  id: number;
  identificacion: string;
  nombre: string;
}

export interface Vehiculo {
  placa: string;
  vin?: string | null;
  marca?: string | null;
  linea?: string | null;
  modelo?: number | null;
  cilindraje?: string | null;
  motor?: string | null;
  chasis?: string | null;
  serie?: string | null;
  color?: string | null;
  tipoVehiculo?: string | null;
  tipoServicio?: string | null;
  tipoCarroceria?: string | null;
  tipoCombustible?: string | null;
  blindaje?: string | null;

  estadoMatriculaId?: number | null;
  estadoMatricula?: Estado | null;

  soatId?: number | null;
  soat?: Estado | null;
  vigenciaSoat?: string | null;

  revisionTecnomecanicaId?: number | null;
  revisionTecnomecanica?: Estado | null;
  vigenciaTecno?: string | null;

  transito?: string | null;
  departamento?: string | null;
  regional?: string | null;
  empresaTransportadora?: string | null;

  propietarioId?: number | null;
  propietario?: Propietario | null;
}

export interface ProcesoJuridico {
  id: number;
  casoId: number;
  fechaEscalamientoEntidadEx?: string | null;
  fechaRespuestaEntidadEx?: string | null;
  fechaLiquidacionTotalPasivos?: string | null;
  fechaSolicitudRecursos?: string | null;
  fechaDesembolsoRecursos?: string | null;
  fechaFinDiagnosticoPagoPasivos?: string | null;
  tipoSaneamientoARealizarId?: number | null;
  tipoSaneamientoARealizar?: Estado | null;
  fechaSolicitudSaneamientoJuridico?: string | null;
  fechaFinSaneamientoJuridico?: string | null;
  fechaRadicacionDp?: string | null;
  fechaRespuestaDp?: string | null;
  fechaRadicacionTutela?: string | null;
  numeroRadicadoTutela?: string | null;
  juzgado?: string | null;
  fechaSolicitudDocsAdicionalesTraspaso?: string | null;
  fechaEntregaDocsAdicionalesTraspaso?: string | null;
  fechaFinGestionDocumentalTraspaso?: string | null;
}

export interface AuditoriaMulta {
  id: number;
  casoId: number;
  limitacionesPropiedad?: string | null;
  tipoLimitaciones?: string | null;
  garantiasMobiliarias?: string | null;
  simitMultasPropietarioResoluciones?: string | null;
  simitMultasLocatario?: string | null;
  multasPlaca?: string | null;
  impuestos?: string | null;
  vigenciasAdeudadas?: string | null;
  impuestosTransito?: string | null;
}

export interface Caso {
  id: number;
  numeroContrato: string;
  radicadoBizagi?: string | null;

  estadoContratoId?: number | null;
  estadoContrato?: Estado | null;

  fecha?: string | null;
  fechaAsignacion?: string | null;
  fechaCierreTraspaso?: string | null;
  analistaResponsable?: string | null;

  aplicaInscripcionOpcionCompra?: boolean;
  valorOpcionCompra?: number | string | null;

  estadoId?: number | null;
  estado?: Estado | null;
  categoriaId?: number | null;
  categoria?: Estado | null;
  etapaId?: number | null;
  etapa?: Estado | null;
  subetapaId?: number | null;
  subetapa?: Estado | null;
  causaAtrasoId?: number | null;
  causaAtraso?: Estado | null;

  seEnvioNotificacion?: boolean;
  fechaDebesEnviarNotificacion?: string | null;
  fechaNotificacionInicial?: string | null;
  fechaUltimaNotificacion?: string | null;
  fechaProximaNotificacion?: string | null;
  fechaUltimaGestion?: string | null;
  fechaProximaGestion?: string | null;
  observacionesGestion?: string | null;
  ultimoComentario?: string | null;

  fechaSolicitudSuspension?: string | null;
  fechaHastaSuspension?: string | null;

  traspasoConCita?: boolean;
  fechaInicioCitaTransito?: string | null;
  fechaConsecucionCitaTransito?: string | null;
  fechaCitaTransito?: string | null;
  fechaRadicacionTraspaso?: string | null;
  fechaRechazo?: string | null;
  fechaSubsanacionRechazo?: string | null;
  fechaTraspasoAprobado?: string | null;
  fechaCierreTraspasoBizagi?: string | null;

  ubicacionTarjeta?: string | null;
  nombreCorresponsalTramitador?: string | null;
  fechaEntregaDatosEnvio?: string | null;
  fechaProgramacionEntregaTp?: string | null;
  fechaEntregaTpLocatario?: string | null;

  tiempoEntidadesExternas?: number | null;
  tiempoBanco?: number | null;
  tiempoJuridicoExterno?: number | null;
  tiempoJuridicoInterno?: number | null;
  tiempoTransito?: number | null;
  tiempoOperativoAnalista?: number | null;

  honorarios?: number | string | null;
  facturado?: boolean;
  fechaFactura?: string | null;
  numeroFactura?: string | null;
  observacionesGp?: string | null;
  formulaTraspasosGpa?: string | null;

  honorariosServiciosJuridicos?: number | string | null;
  facturadoJuridico?: boolean;
  numeroFacturaJuridico?: string | null;
  fechaFacturaJuridico?: string | null;
  observacionesGeneral?: string | null;

  locatarioId: number;
  locatario?: Locatario | null;
  vehiculoPlaca: string;
  vehiculo?: Vehiculo | null;
  procesoJuridico?: ProcesoJuridico | null;
  auditoriaMulta?: AuditoriaMulta | null;

  createdAt?: string;
  updatedAt?: string;
}

export interface ProcesoJuridicoInput {
  fechaEscalamientoEntidadEx?: string | null;
  fechaRespuestaEntidadEx?: string | null;
  fechaLiquidacionTotalPasivos?: string | null;
  fechaSolicitudRecursos?: string | null;
  fechaDesembolsoRecursos?: string | null;
  fechaFinDiagnosticoPagoPasivos?: string | null;
  tipoSaneamientoARealizarId?: number | null;
  fechaSolicitudSaneamientoJuridico?: string | null;
  fechaFinSaneamientoJuridico?: string | null;
  fechaRadicacionDp?: string | null;
  fechaRespuestaDp?: string | null;
  fechaRadicacionTutela?: string | null;
  numeroRadicadoTutela?: string | null;
  juzgado?: string | null;
  fechaSolicitudDocsAdicionalesTraspaso?: string | null;
  fechaEntregaDocsAdicionalesTraspaso?: string | null;
  fechaFinGestionDocumentalTraspaso?: string | null;
}

export interface AuditoriaMultaInput {
  limitacionesPropiedad?: string | null;
  tipoLimitaciones?: string | null;
  garantiasMobiliarias?: string | null;
  simitMultasPropietarioResoluciones?: string | null;
  simitMultasLocatario?: string | null;
  multasPlaca?: string | null;
  impuestos?: string | null;
  vigenciasAdeudadas?: string | null;
  impuestosTransito?: string | null;
}

export interface CrearCasoInput {
  numeroContrato: string;
  radicadoBizagi?: string | null;
  estadoContratoId?: number | null;
  fecha?: string | null;
  fechaAsignacion?: string | null;
  fechaCierreTraspaso?: string | null;
  analistaResponsable?: string | null;
  aplicaInscripcionOpcionCompra?: boolean;
  valorOpcionCompra?: number | null;
  estadoId?: number | null;
  categoriaId?: number | null;
  etapaId?: number | null;
  subetapaId?: number | null;
  causaAtrasoId?: number | null;
  seEnvioNotificacion?: boolean;
  fechaDebesEnviarNotificacion?: string | null;
  fechaNotificacionInicial?: string | null;
  fechaUltimaNotificacion?: string | null;
  fechaProximaNotificacion?: string | null;
  fechaUltimaGestion?: string | null;
  fechaProximaGestion?: string | null;
  observacionesGestion?: string | null;
  ultimoComentario?: string | null;
  fechaSolicitudSuspension?: string | null;
  fechaHastaSuspension?: string | null;
  traspasoConCita?: boolean;
  fechaInicioCitaTransito?: string | null;
  fechaConsecucionCitaTransito?: string | null;
  fechaCitaTransito?: string | null;
  fechaRadicacionTraspaso?: string | null;
  fechaRechazo?: string | null;
  fechaSubsanacionRechazo?: string | null;
  fechaTraspasoAprobado?: string | null;
  fechaCierreTraspasoBizagi?: string | null;
  ubicacionTarjeta?: string | null;
  nombreCorresponsalTramitador?: string | null;
  fechaEntregaDatosEnvio?: string | null;
  fechaProgramacionEntregaTp?: string | null;
  fechaEntregaTpLocatario?: string | null;
  tiempoEntidadesExternas?: number | null;
  tiempoBanco?: number | null;
  tiempoJuridicoExterno?: number | null;
  tiempoJuridicoInterno?: number | null;
  tiempoTransito?: number | null;
  tiempoOperativoAnalista?: number | null;
  honorarios?: number | null;
  facturado?: boolean;
  fechaFactura?: string | null;
  numeroFactura?: string | null;
  observacionesGp?: string | null;
  formulaTraspasosGpa?: string | null;
  honorariosServiciosJuridicos?: number | null;
  facturadoJuridico?: boolean;
  numeroFacturaJuridico?: string | null;
  fechaFacturaJuridico?: string | null;
  observacionesGeneral?: string | null;
  locatarioId: number;
  vehiculoPlaca: string;
  procesoJuridico?: ProcesoJuridicoInput;
  auditoriaMulta?: AuditoriaMultaInput;
}
