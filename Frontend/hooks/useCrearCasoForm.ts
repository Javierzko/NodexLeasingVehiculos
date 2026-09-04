// raiz src/hooks/useCrearCasoForm.ts
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { leasingApi } from "@/services/leasingApi";
import { Caso, CrearCasoInput, Locatario, Vehiculo } from "@/types/leasing";
import { ModoEntidad, NuevoLocatario, NuevoVehiculo } from "@/components/Modal/CasoFormEntitySections";

export type TabId =
  | "basico"
  | "fechas"
  | "notificaciones"
  | "traspaso"
  | "facturacion"
  | "juridico"
  | "multas";

type Options = {
  presentation: "page" | "modal";
  onSuccess?: () => void;
  casoAEditar?: Caso | null;
};

const fechaInput = (value?: string | Date | null) => {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
};

const fechaApi = (value?: string | Date | null) => {
  if (!value) return undefined;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? undefined : value.toISOString();
  const text = value.trim();
  if (!text) return undefined;
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return `${text}T00:00:00.000Z`;
  const date = new Date(text);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
};

const hoy = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};

const numero = (value: string | number | null | undefined): number | undefined => {
  if (value === null || value === undefined || value === '') {
    return undefined;
  }

  const resultado = Number(value);
  return Number.isFinite(resultado) ? resultado : undefined;
};

const formularioVacio = (): CrearCasoInput => ({
  numeroContrato: "",
  radicadoBizagi: "",
  locatarioId: 0,
  vehiculoPlaca: "",
  analistaResponsable: "",
  aplicaInscripcionOpcionCompra: false,
  valorOpcionCompra: null,
  observacionesGeneral: "",
  fecha: hoy(),
  fechaAsignacion: "",
  fechaCierreTraspaso: "",
  fechaCierreTraspasoBizagi: "",
  fechaSolicitudSuspension: "",
  fechaHastaSuspension: "",
  seEnvioNotificacion: false,
  fechaDebesEnviarNotificacion: "",
  fechaNotificacionInicial: "",
  fechaUltimaNotificacion: "",
  fechaProximaNotificacion: "",
  fechaUltimaGestion: "",
  fechaProximaGestion: "",
  traspasoConCita: false,
  fechaInicioCitaTransito: "",
  fechaConsecucionCitaTransito: "",
  fechaCitaTransito: "",
  fechaRadicacionTraspaso: "",
  fechaRechazo: "",
  fechaSubsanacionRechazo: "",
  fechaTraspasoAprobado: "",
  ubicacionTarjeta: "",
  nombreCorresponsalTramitador: "",
  fechaEntregaDatosEnvio: "",
  fechaProgramacionEntregaTp: "",
  fechaEntregaTpLocatario: "",
  honorarios: undefined,
  facturado: false,
  numeroFactura: "",
  fechaFactura: "",
  formulaTraspasosGpa: "",
  honorariosServiciosJuridicos: undefined,
  facturadoJuridico: false,
  numeroFacturaJuridico: "",
  fechaFacturaJuridico: "",
  tiempoEntidadesExternas: undefined,
  tiempoBanco: undefined,
  tiempoJuridicoExterno: undefined,
  tiempoJuridicoInterno: undefined,
  tiempoTransito: undefined,
  tiempoOperativoAnalista: undefined,
  procesoJuridico: {},
  auditoriaMulta: {},
});

const locatarioVacio = (): NuevoLocatario => ({
  nombreBanco: "", nit: "", tipoDocumento: "", email: "", revisionCorreo: false,
  contactoNombre: "", contactoNumero: "", direccionEnvio: "", locatarioRunt: "",
  nombreComercial: "", emailComercial: "", revisionMailComercial: false,
});

const vehiculoVacio = (): NuevoVehiculo => ({
  placa: "", vin: "", marca: "", linea: "", modelo: "", cilindraje: "", motor: "",
  chasis: "", serie: "", color: "", tipoVehiculo: "", tipoServicio: "", tipoCarroceria: "",
  tipoCombustible: "", blindaje: "", transito: "", departamento: "", regional: "",
  empresaTransportadora: "", vigenciaSoat: "", vigenciaTecno: "",
});

export function useCrearCasoForm({ presentation, onSuccess, casoAEditar }: Options) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>("basico");
  const [locatarios, setLocatarios] = useState<Locatario[]>([]);
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modoLocatario, setModoLocatario] = useState<ModoEntidad>("nuevo");
  const [modoVehiculo, setModoVehiculo] = useState<ModoEntidad>("nuevo");
  const [nuevoLocatario, setNuevoLocatario] = useState<NuevoLocatario>(locatarioVacio);
  const [nuevoVehiculo, setNuevoVehiculo] = useState<NuevoVehiculo>(vehiculoVacio);
  const [formData, setFormData] = useState<CrearCasoInput>(formularioVacio);
  const [procesoJuridicoId, setProcesoJuridicoId] = useState<number | null>(null);
  const [auditoriaMultaId, setAuditoriaMultaId] = useState<number | null>(null);

  useEffect(() => {
    async function cargarCatalogos() {
      try {
        const [listaLocatarios, listaVehiculos] = await Promise.all([
          leasingApi.getLocatarios().catch(() => []),
          leasingApi.getVehiculos().catch(() => []),
        ]);
        setLocatarios(listaLocatarios);
        setVehiculos(listaVehiculos);
      } catch (err) {
        console.error("Error al cargar catálogos:", err);
      }
    }
    cargarCatalogos();
  }, []);

  useEffect(() => {
    if (!casoAEditar) {
      setFormData(formularioVacio());
      setNuevoLocatario(locatarioVacio());
      setNuevoVehiculo(vehiculoVacio());
      setModoLocatario("nuevo");
      setModoVehiculo("nuevo");
      setLoading(false);
      return;
    }

    const proceso = casoAEditar.procesoJuridico;
    const auditoria = casoAEditar.auditoriaMulta;
    const loc = casoAEditar.locatario;
    const veh = casoAEditar.vehiculo;

    setProcesoJuridicoId(proceso?.id ?? null);
    setAuditoriaMultaId(auditoria?.id ?? null);
    setModoLocatario("editar");
    setModoVehiculo("editar");

    if (loc) {
      setNuevoLocatario({
        nombreBanco: loc.nombreBanco || "",
        nit: loc.nit || "",
        tipoDocumento: loc.tipoDocumento || "",
        email: loc.email || "",
        revisionCorreo: loc.revisionCorreo || false,
        contactoNombre: loc.contactoNombre || "",
        contactoNumero: loc.contactoNumero || "",
        direccionEnvio: loc.direccionEnvio || "",
        locatarioRunt: loc.locatarioRunt || "",
        nombreComercial: loc.nombreComercial || "",
        emailComercial: loc.emailComercial || "",
        revisionMailComercial: loc.revisionMailComercial || false,
      });
    }

    if (veh) {
      setNuevoVehiculo({
        placa: veh.placa || "",
        vin: veh.vin || "",
        marca: veh.marca || "",
        linea: veh.linea || "",
        modelo: veh.modelo ? String(veh.modelo) : "",
        cilindraje: veh.cilindraje || "",
        motor: veh.motor || "",
        chasis: veh.chasis || "",
        serie: veh.serie || "",
        color: veh.color || "",
        tipoVehiculo: veh.tipoVehiculo || "",
        tipoServicio: veh.tipoServicio || "",
        tipoCarroceria: veh.tipoCarroceria || "",
        tipoCombustible: veh.tipoCombustible || "",
        blindaje: veh.blindaje || "",
        transito: veh.transito || "",
        departamento: veh.departamento || "",
        regional: veh.regional || "",
        empresaTransportadora: veh.empresaTransportadora || "",
        vigenciaSoat: fechaInput(veh.vigenciaSoat),
        vigenciaTecno: fechaInput(veh.vigenciaTecno),
      });
    }

    // Normalizar proceso jurídico para el formulario
    const procesoForm: Record<string, any> = {};
    if (proceso) {
      Object.entries(proceso).forEach(([k, v]) => {
        if (k.toLowerCase().includes("fecha")) {
          procesoForm[k] = fechaInput(v as string);
        } else if (typeof v !== "object" || v === null) {
          procesoForm[k] = v ?? "";
        }
      });
    }

    // Normalizar auditoría de multas para el formulario
    const auditoriaForm: Record<string, any> = {};
    if (auditoria) {
      Object.entries(auditoria).forEach(([k, v]) => {
        if (k.toLowerCase().includes("fecha")) {
          auditoriaForm[k] = fechaInput(v as string);
        } else if (typeof v !== "object" || v === null) {
          auditoriaForm[k] = v ?? "";
        }
      });
    }

    // Mapeo completo de TODOS los campos del caso
    setFormData({
      ...formularioVacio(),
      numeroContrato: casoAEditar.numeroContrato,
      radicadoBizagi: casoAEditar.radicadoBizagi || "",
      locatarioId: casoAEditar.locatarioId,
      vehiculoPlaca: casoAEditar.vehiculoPlaca,
      analistaResponsable: casoAEditar.analistaResponsable || "",
      observacionesGeneral: casoAEditar.observacionesGeneral || "",
      aplicaInscripcionOpcionCompra: Boolean(casoAEditar.aplicaInscripcionOpcionCompra),
      valorOpcionCompra:
        casoAEditar.valorOpcionCompra == null || casoAEditar.valorOpcionCompra === ""
          ? null
          : Number(casoAEditar.valorOpcionCompra),
      estadoContratoId: casoAEditar.estadoContratoId ?? undefined,
      estadoId: casoAEditar.estadoId ?? undefined,
      categoriaId: casoAEditar.categoriaId ?? undefined,
      etapaId: casoAEditar.etapaId ?? undefined,
      subetapaId: casoAEditar.subetapaId ?? undefined,
      causaAtrasoId: casoAEditar.causaAtrasoId ?? undefined,
      seEnvioNotificacion: Boolean(casoAEditar.seEnvioNotificacion),
      observacionesGestion: casoAEditar.observacionesGestion || "",
      ultimoComentario: casoAEditar.ultimoComentario || "",
      traspasoConCita: Boolean(casoAEditar.traspasoConCita),
      ubicacionTarjeta: casoAEditar.ubicacionTarjeta || "",
      nombreCorresponsalTramitador: casoAEditar.nombreCorresponsalTramitador || "",
      honorarios: numero(casoAEditar.honorarios),
      facturado: Boolean(casoAEditar.facturado),
      numeroFactura: casoAEditar.numeroFactura || "",
      observacionesGp: casoAEditar.observacionesGp || "",
      formulaTraspasosGpa: casoAEditar.formulaTraspasosGpa || "",
      honorariosServiciosJuridicos: numero(casoAEditar.honorariosServiciosJuridicos),
      facturadoJuridico: Boolean(casoAEditar.facturadoJuridico),
      numeroFacturaJuridico: casoAEditar.numeroFacturaJuridico || "",
      tiempoEntidadesExternas: numero(casoAEditar.tiempoEntidadesExternas),
      tiempoBanco: numero(casoAEditar.tiempoBanco),
      tiempoJuridicoExterno: numero(casoAEditar.tiempoJuridicoExterno),
      tiempoJuridicoInterno: numero(casoAEditar.tiempoJuridicoInterno),
      tiempoTransito: numero(casoAEditar.tiempoTransito),
      tiempoOperativoAnalista: numero(casoAEditar.tiempoOperativoAnalista),
      fecha: fechaInput(casoAEditar.fecha),
      fechaAsignacion: fechaInput(casoAEditar.fechaAsignacion),
      fechaCierreTraspaso: fechaInput(casoAEditar.fechaCierreTraspaso),
      fechaCierreTraspasoBizagi: fechaInput(casoAEditar.fechaCierreTraspasoBizagi),
      fechaSolicitudSuspension: fechaInput(casoAEditar.fechaSolicitudSuspension),
      fechaHastaSuspension: fechaInput(casoAEditar.fechaHastaSuspension),
      fechaDebesEnviarNotificacion: fechaInput(casoAEditar.fechaDebesEnviarNotificacion),
      fechaNotificacionInicial: fechaInput(casoAEditar.fechaNotificacionInicial),
      fechaUltimaNotificacion: fechaInput(casoAEditar.fechaUltimaNotificacion),
      fechaProximaNotificacion: fechaInput(casoAEditar.fechaProximaNotificacion),
      fechaUltimaGestion: fechaInput(casoAEditar.fechaUltimaGestion),
      fechaProximaGestion: fechaInput(casoAEditar.fechaProximaGestion),
      fechaInicioCitaTransito: fechaInput(casoAEditar.fechaInicioCitaTransito),
      fechaConsecucionCitaTransito: fechaInput(casoAEditar.fechaConsecucionCitaTransito),
      fechaCitaTransito: fechaInput(casoAEditar.fechaCitaTransito),
      fechaRadicacionTraspaso: fechaInput(casoAEditar.fechaRadicacionTraspaso),
      fechaRechazo: fechaInput(casoAEditar.fechaRechazo),
      fechaSubsanacionRechazo: fechaInput(casoAEditar.fechaSubsanacionRechazo),
      fechaTraspasoAprobado: fechaInput(casoAEditar.fechaTraspasoAprobado),
      fechaEntregaDatosEnvio: fechaInput(casoAEditar.fechaEntregaDatosEnvio),
      fechaProgramacionEntregaTp: fechaInput(casoAEditar.fechaProgramacionEntregaTp),
      fechaEntregaTpLocatario: fechaInput(casoAEditar.fechaEntregaTpLocatario),
      fechaFactura: fechaInput(casoAEditar.fechaFactura),
      fechaFacturaJuridico: fechaInput(casoAEditar.fechaFacturaJuridico),
      procesoJuridico: procesoForm,
      auditoriaMulta: auditoriaForm,
    });
    setLoading(false);
  }, [casoAEditar]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = event.target;
    if (name === "fecha") return;
    if (name.startsWith("juridico.")) {
      const field = name.slice("juridico.".length) as keyof NonNullable<CrearCasoInput["procesoJuridico"]>;
      setFormData((previous) => ({ ...previous, procesoJuridico: { ...previous.procesoJuridico, [field]: value } }));
      return;
    }
    if (name.startsWith("multa.")) {
      const field = name.slice("multa.".length) as keyof NonNullable<CrearCasoInput["auditoriaMulta"]>;
      setFormData((previous) => ({ ...previous, auditoriaMulta: { ...previous.auditoriaMulta, [field]: value } }));
      return;
    }
    const checked = (event.target as HTMLInputElement).checked;
    const finalValue = type === "checkbox" ? checked : type === "number" ? (value === "" ? undefined : Number(value)) : value;
    setFormData((previous) => ({ ...previous, [name]: finalValue }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      if (!formData.numeroContrato.trim()) throw new Error("El número de contrato es obligatorio.");
      let locatarioId = formData.locatarioId;
      let vehiculoPlaca = formData.vehiculoPlaca.trim().toUpperCase();

      // 1. GESTIÓN DEL LOCATARIO (Crear o Actualizar)
      if (modoLocatario === "nuevo") {
        if (!nuevoLocatario.nombreBanco.trim() || !nuevoLocatario.nit.trim()) {
          throw new Error("Debes ingresar Nombre y NIT/Cédula del locatario.");
        }
        const nitLimpio = nuevoLocatario.nit.trim();
        try {
          locatarioId = (await leasingApi.getLocatarioByIdentificacion(nitLimpio)).id;
        } catch {
          const created = await leasingApi.createLocatario({
            ...nuevoLocatario,
            nit: nitLimpio,
            nombreBanco: nuevoLocatario.nombreBanco.trim(),
          });
          locatarioId = created.id;
        }
      } else if (modoLocatario === "editar" && locatarioId) {
        // ACTUALIZACIÓN DE LOCATARIO EXISTENTE
        await leasingApi.updateLocatario(locatarioId, {
          ...nuevoLocatario,
          nit: nuevoLocatario.nit.trim(),
          nombreBanco: nuevoLocatario.nombreBanco.trim(),
        });
      }

      if (!locatarioId) throw new Error("Debes seleccionar o ingresar un locatario válido.");

      // 2. GESTIÓN DEL VEHÍCULO (Crear o Actualizar)
      if (modoVehiculo === "nuevo") {
        if (!nuevoVehiculo.placa.trim()) throw new Error("La placa del vehículo es obligatoria.");
        vehiculoPlaca = nuevoVehiculo.placa.trim().toUpperCase();

        const payloadNuevoVehiculo = {
          ...nuevoVehiculo,
          placa: vehiculoPlaca,
          modelo: nuevoVehiculo.modelo ? Number(nuevoVehiculo.modelo) : undefined,
          vigenciaSoat: fechaApi(nuevoVehiculo.vigenciaSoat),
          vigenciaTecno: fechaApi(nuevoVehiculo.vigenciaTecno),
        };

        try {
          vehiculoPlaca = (await leasingApi.getVehiculoByPlaca(vehiculoPlaca)).placa;
        } catch {
          const created = await leasingApi.createVehiculo(payloadNuevoVehiculo);
          vehiculoPlaca = created.placa;
        }
      } else if (modoVehiculo === "editar" && vehiculoPlaca) {
        // ACTUALIZACIÓN DE VEHÍCULO EXISTENTE
        await leasingApi.updateVehiculo(vehiculoPlaca, {
          ...nuevoVehiculo,
          modelo: nuevoVehiculo.modelo ? Number(nuevoVehiculo.modelo) : undefined,
          vigenciaSoat: fechaApi(nuevoVehiculo.vigenciaSoat),
          vigenciaTecno: fechaApi(nuevoVehiculo.vigenciaTecno),
        });
      }

      if (!vehiculoPlaca) throw new Error("Debes seleccionar o ingresar un vehículo válido.");

      // 3. CONSTRUCCIÓN DE PAYLOAD LIMPIO DEL CASO
      const payload: Partial<CrearCasoInput> = {
        ...formData,
        locatarioId,
        vehiculoPlaca,
        fecha: casoAEditar ? fechaApi(formData.fecha) : new Date().toISOString(),
        fechaAsignacion: fechaApi(formData.fechaAsignacion),
        fechaCierreTraspaso: fechaApi(formData.fechaCierreTraspaso),
        fechaCierreTraspasoBizagi: fechaApi(formData.fechaCierreTraspasoBizagi),
        fechaSolicitudSuspension: fechaApi(formData.fechaSolicitudSuspension),
        fechaHastaSuspension: fechaApi(formData.fechaHastaSuspension),
        fechaDebesEnviarNotificacion: fechaApi(formData.fechaDebesEnviarNotificacion),
        fechaNotificacionInicial: fechaApi(formData.fechaNotificacionInicial),
        fechaUltimaNotificacion: fechaApi(formData.fechaUltimaNotificacion),
        fechaProximaNotificacion: fechaApi(formData.fechaProximaNotificacion),
        fechaUltimaGestion: fechaApi(formData.fechaUltimaGestion),
        fechaProximaGestion: fechaApi(formData.fechaProximaGestion),
        fechaInicioCitaTransito: fechaApi(formData.fechaInicioCitaTransito),
        fechaConsecucionCitaTransito: fechaApi(formData.fechaConsecucionCitaTransito),
        fechaCitaTransito: fechaApi(formData.fechaCitaTransito),
        fechaRadicacionTraspaso: fechaApi(formData.fechaRadicacionTraspaso),
        fechaRechazo: fechaApi(formData.fechaRechazo),
        fechaSubsanacionRechazo: fechaApi(formData.fechaSubsanacionRechazo),
        fechaTraspasoAprobado: fechaApi(formData.fechaTraspasoAprobado),
        fechaEntregaDatosEnvio: fechaApi(formData.fechaEntregaDatosEnvio),
        fechaProgramacionEntregaTp: fechaApi(formData.fechaProgramacionEntregaTp),
        fechaEntregaTpLocatario: fechaApi(formData.fechaEntregaTpLocatario),
        fechaFactura: fechaApi(formData.fechaFactura),
        fechaFacturaJuridico: fechaApi(formData.fechaFacturaJuridico),
        honorarios: numero(formData.honorarios),
        honorariosServiciosJuridicos: numero(formData.honorariosServiciosJuridicos),
        tiempoEntidadesExternas: numero(formData.tiempoEntidadesExternas),
        tiempoBanco: numero(formData.tiempoBanco),
        tiempoJuridicoExterno: numero(formData.tiempoJuridicoExterno),
        tiempoJuridicoInterno: numero(formData.tiempoJuridicoInterno),
        tiempoTransito: numero(formData.tiempoTransito),
        tiempoOperativoAnalista: numero(formData.tiempoOperativoAnalista),
        procesoJuridico: undefined,
        auditoriaMulta: undefined,
      };

      if (casoAEditar) {
        // 1. Actualización del caso principal
        await leasingApi.updateCaso(casoAEditar.id, payload);

        // 2. Sanitizar y actualizar Proceso Jurídico
        if (procesoJuridicoId && formData.procesoJuridico) {
          const procesoLimpio = Object.entries(formData.procesoJuridico).reduce(
            (acc, [key, val]) => {
              if (
                key === 'id' ||
                key === 'casoId' ||
                val === '' ||
                val === null ||
                val === undefined ||
                typeof val === 'object'
              ) {
                return acc;
              }

              if (key.toLowerCase().includes('fecha')) {
                const fIso = fechaApi(val as string);
                if (fIso) acc[key] = fIso;
              } else {
                acc[key] = val;
              }
              return acc;
            },
            {} as Record<string, any>
          );

          if (Object.keys(procesoLimpio).length > 0) {
            await leasingApi.updateProcesoJuridico(procesoJuridicoId, procesoLimpio);
          }
        }

        // 3. Sanitizar y actualizar Auditoría de Multas
        if (auditoriaMultaId && formData.auditoriaMulta) {
          const multaLimpia = Object.entries(formData.auditoriaMulta).reduce(
            (acc, [key, val]) => {
              if (
                key === 'id' ||
                key === 'casoId' ||
                val === '' ||
                val === null ||
                val === undefined ||
                typeof val === 'object'
              ) {
                return acc;
              }

              if (key.toLowerCase().includes('fecha')) {
                const fIso = fechaApi(val as string);
                if (fIso) acc[key] = fIso;
              } else {
                acc[key] = val;
              }
              return acc;
            },
            {} as Record<string, any>
          );

          if (Object.keys(multaLimpia).length > 0) {
            await leasingApi.updateAuditoriaMulta(auditoriaMultaId, multaLimpia);
          }
        }
      } else {
        await leasingApi.createCaso({
          ...payload,
          procesoJuridico: formData.procesoJuridico,
          auditoriaMulta: formData.auditoriaMulta,
        } as CrearCasoInput);
      }

      onSuccess?.();
      if (presentation === "page") {
        router.push("/");
        router.refresh();
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Ocurrió un error inesperado al guardar el expediente.");
    } finally {
      setSubmitting(false);
    }
  };

  return {
    activeTab,
    setActiveTab,
    locatarios,
    vehiculos,
    loading,
    submitting,
    error,
    modoLocatario,
    setModoLocatario,
    modoVehiculo,
    setModoVehiculo,
    nuevoLocatario,
    setNuevoLocatario,
    nuevoVehiculo,
    setNuevoVehiculo,
    formData,
    handleChange,
    handleSubmit,
  };
}