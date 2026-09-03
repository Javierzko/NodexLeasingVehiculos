-- CreateTable
CREATE TABLE "Locatario" (
    "id" TEXT NOT NULL,
    "nit" TEXT NOT NULL,
    "nombreBanco" TEXT,
    "tipoDocumento" TEXT,
    "email" TEXT,
    "revisionCorreo" BOOLEAN NOT NULL DEFAULT false,
    "contactoNombre" TEXT,
    "contactoNumero" TEXT,
    "direccionEnvio" TEXT,
    "locatarioRunt" TEXT,
    "nombreComercial" TEXT,
    "emailComercial" TEXT,
    "revisionMailComercial" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Locatario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Propietario" (
    "id" TEXT NOT NULL,
    "identificacion" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Propietario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehiculo" (
    "placa" TEXT NOT NULL,
    "vin" TEXT,
    "marca" TEXT,
    "linea" TEXT,
    "modelo" INTEGER,
    "cilindraje" TEXT,
    "motor" TEXT,
    "chasis" TEXT,
    "serie" TEXT,
    "color" TEXT,
    "tipoVehiculo" TEXT,
    "tipoServicio" TEXT,
    "tipoCarroceria" TEXT,
    "tipoCombustible" TEXT,
    "blindaje" TEXT,
    "estadoMatricula" TEXT,
    "transito" TEXT,
    "departamento" TEXT,
    "regional" TEXT,
    "empresaTransportadora" TEXT,
    "soat" TEXT,
    "vigenciaSoat" TIMESTAMP(3),
    "revisionTecnomecanica" TEXT,
    "vigenciaTecno" TIMESTAMP(3),
    "propietarioId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vehiculo_pkey" PRIMARY KEY ("placa")
);

-- CreateTable
CREATE TABLE "Caso" (
    "id" TEXT NOT NULL,
    "numeroContrato" TEXT NOT NULL,
    "radicadoBizagi" TEXT,
    "estadoContrato" TEXT,
    "fecha" TIMESTAMP(3),
    "fechaAsignacion" TIMESTAMP(3),
    "fechaCierreTraspaso" TIMESTAMP(3),
    "analistaResponsable" TEXT,
    "aplicaInscripcionOpcionCompra" BOOLEAN NOT NULL DEFAULT false,
    "valorOpcionCompra" DECIMAL(65,30),
    "estado" TEXT,
    "categoria" TEXT,
    "etapa" TEXT,
    "subetapa" TEXT,
    "causaAtraso" TEXT,
    "seEnvioNotificacion" BOOLEAN NOT NULL DEFAULT false,
    "fechaDebesEnviarNotificacion" TIMESTAMP(3),
    "fechaNotificacionInicial" TIMESTAMP(3),
    "fechaUltimaNotificacion" TIMESTAMP(3),
    "fechaProximaNotificacion" TIMESTAMP(3),
    "fechaUltimaGestion" TIMESTAMP(3),
    "fechaProximaGestion" TIMESTAMP(3),
    "observacionesGestion" TEXT,
    "ultimoComentario" TEXT,
    "fechaSolicitudSuspension" TIMESTAMP(3),
    "fechaHastaSuspension" TIMESTAMP(3),
    "traspasoConCita" BOOLEAN NOT NULL DEFAULT false,
    "fechaInicioCitaTransito" TIMESTAMP(3),
    "fechaConsecucionCitaTransito" TIMESTAMP(3),
    "fechaCitaTransito" TIMESTAMP(3),
    "fechaRadicacionTraspaso" TIMESTAMP(3),
    "fechaRechazo" TIMESTAMP(3),
    "fechaSubsanacionRechazo" TIMESTAMP(3),
    "fechaTraspasoAprobado" TIMESTAMP(3),
    "fechaCierreTraspasoBizagi" TIMESTAMP(3),
    "ubicacionTarjeta" TEXT,
    "nombreCorresponsalTramitador" TEXT,
    "fechaEntregaDatosEnvio" TIMESTAMP(3),
    "fechaProgramacionEntregaTp" TIMESTAMP(3),
    "fechaEntregaTpLocatario" TIMESTAMP(3),
    "tiempoEntidadesExternas" DOUBLE PRECISION,
    "tiempoBanco" DOUBLE PRECISION,
    "tiempoJuridicoExterno" DOUBLE PRECISION,
    "tiempoJuridicoInterno" DOUBLE PRECISION,
    "tiempoTransito" DOUBLE PRECISION,
    "tiempoOperativoAnalista" DOUBLE PRECISION,
    "honorarios" DECIMAL(65,30),
    "facturado" BOOLEAN NOT NULL DEFAULT false,
    "fechaFactura" TIMESTAMP(3),
    "numeroFactura" TEXT,
    "observacionesGp" TEXT,
    "formulaTraspasosGpa" TEXT,
    "honorariosServiciosJuridicos" DECIMAL(65,30),
    "facturadoJuridico" BOOLEAN NOT NULL DEFAULT false,
    "numeroFacturaJuridico" TEXT,
    "fechaFacturaJuridico" TIMESTAMP(3),
    "observacionesGeneral" TEXT,
    "locatarioId" TEXT NOT NULL,
    "vehiculoPlaca" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Caso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProcesoJuridico" (
    "id" TEXT NOT NULL,
    "casoId" TEXT NOT NULL,
    "fechaEscalamientoEntidadEx" TIMESTAMP(3),
    "fechaRespuestaEntidadEx" TIMESTAMP(3),
    "fechaLiquidacionTotalPasivos" TIMESTAMP(3),
    "fechaSolicitudRecursos" TIMESTAMP(3),
    "fechaDesembolsoRecursos" TIMESTAMP(3),
    "fechaFinDiagnosticoPagoPasivos" TIMESTAMP(3),
    "tipoSaneamientoARealizar" TEXT,
    "fechaSolicitudSaneamientoJuridico" TIMESTAMP(3),
    "fechaFinSaneamientoJuridico" TIMESTAMP(3),
    "fechaRadicacionDp" TIMESTAMP(3),
    "fechaRespuestaDp" TIMESTAMP(3),
    "fechaRadicacionTutela" TIMESTAMP(3),
    "numeroRadicadoTutela" TEXT,
    "juzgado" TEXT,
    "fechaSolicitudDocsAdicionalesTraspaso" TIMESTAMP(3),
    "fechaEntregaDocsAdicionalesTraspaso" TIMESTAMP(3),
    "fechaFinGestionDocumentalTraspaso" TIMESTAMP(3),

    CONSTRAINT "ProcesoJuridico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditoriaMulta" (
    "id" TEXT NOT NULL,
    "casoId" TEXT NOT NULL,
    "limitacionesPropiedad" TEXT,
    "tipoLimitaciones" TEXT,
    "garantiasMobiliarias" TEXT,
    "simitMultasPropietarioResoluciones" TEXT,
    "simitMultasLocatario" TEXT,
    "multasPlaca" TEXT,
    "impuestos" TEXT,
    "vigenciasAdeudadas" TEXT,
    "impuestosTransito" TEXT,

    CONSTRAINT "AuditoriaMulta_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Locatario_nit_key" ON "Locatario"("nit");

-- CreateIndex
CREATE UNIQUE INDEX "Propietario_identificacion_key" ON "Propietario"("identificacion");

-- CreateIndex
CREATE UNIQUE INDEX "Vehiculo_vin_key" ON "Vehiculo"("vin");

-- CreateIndex
CREATE UNIQUE INDEX "Caso_numeroContrato_key" ON "Caso"("numeroContrato");

-- CreateIndex
CREATE UNIQUE INDEX "ProcesoJuridico_casoId_key" ON "ProcesoJuridico"("casoId");

-- CreateIndex
CREATE UNIQUE INDEX "AuditoriaMulta_casoId_key" ON "AuditoriaMulta"("casoId");

-- AddForeignKey
ALTER TABLE "Vehiculo" ADD CONSTRAINT "Vehiculo_propietarioId_fkey" FOREIGN KEY ("propietarioId") REFERENCES "Propietario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Caso" ADD CONSTRAINT "Caso_locatarioId_fkey" FOREIGN KEY ("locatarioId") REFERENCES "Locatario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Caso" ADD CONSTRAINT "Caso_vehiculoPlaca_fkey" FOREIGN KEY ("vehiculoPlaca") REFERENCES "Vehiculo"("placa") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcesoJuridico" ADD CONSTRAINT "ProcesoJuridico_casoId_fkey" FOREIGN KEY ("casoId") REFERENCES "Caso"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditoriaMulta" ADD CONSTRAINT "AuditoriaMulta_casoId_fkey" FOREIGN KEY ("casoId") REFERENCES "Caso"("id") ON DELETE CASCADE ON UPDATE CASCADE;
