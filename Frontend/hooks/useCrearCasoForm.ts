// raiz hooks/useCrearCasoForm.ts
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { leasingApi } from "@/services/leasingApi";
import { Caso, CrearCasoInput, Locatario, Vehiculo } from "@/types/leasing";

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

type NuevoLocatario = {
  nombreBanco: string;
  nit: string;
  tipoDocumento: string;
  email: string;
  revisionCorreo: boolean;
  contactoNombre: string;
  contactoNumero: string;
  direccionEnvio: string;
  locatarioRunt: string;
  nombreComercial: string;
  emailComercial: string;
  revisionMailComercial: boolean;
};

type NuevoVehiculo = {
  placa: string;
  vin: string;
  marca: string;
  linea: string;
  modelo: string;
  cilindraje: string;
  motor: string;
  chasis: string;
  serie: string;
  color: string;
  tipoVehiculo: string;
  tipoServicio: string;
  tipoCarroceria: string;
  tipoCombustible: string;
  blindaje: string;
  transito: string;
  departamento: string;
  regional: string;
  empresaTransportadora: string;
  vigenciaSoat: string;
  vigenciaTecno: string;
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
  aplicaInscripcionOpcionCompra:false,
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
  const [modoLocatario, setModoLocatario] = useState<"existente" | "nuevo">("nuevo");
  const [modoVehiculo, setModoVehiculo] = useState<"existente" | "nuevo">("nuevo");
  const [nuevoLocatario, setNuevoLocatario] = useState<NuevoLocatario>(locatarioVacio);
  const [nuevoVehiculo, setNuevoVehiculo] = useState<NuevoVehiculo>(vehiculoVacio);
  const [formData, setFormData] = useState<CrearCasoInput>(formularioVacio);
  const [procesoJuridicoId, setProcesoJuridicoId] = useState<number | null>(null);
  const [auditoriaMultaId, setAuditoriaMultaId] = useState<number | null>(null);

  useEffect(() => {
    if (!casoAEditar) {
      setFormData(formularioVacio());
      setModoLocatario("nuevo");
      setModoVehiculo("nuevo");
      setLoading(false);
      return;
    }

    const proceso = casoAEditar.procesoJuridico;
    const auditoria = casoAEditar.auditoriaMulta;

    setProcesoJuridicoId(proceso?.id ?? null);
    setAuditoriaMultaId(auditoria?.id ?? null);
    setModoLocatario("existente");
    setModoVehiculo("existente");
    setFormData({
      ...formularioVacio(),
      numeroContrato: casoAEditar.numeroContrato,
      radicadoBizagi: casoAEditar.radicadoBizagi || "",
      locatarioId: casoAEditar.locatarioId,
      vehiculoPlaca: casoAEditar.vehiculoPlaca,
      analistaResponsable: casoAEditar.analistaResponsable || "",
      observacionesGeneral: casoAEditar.observacionesGeneral || "",
      valorOpcionCompra:
        casoAEditar.valorOpcionCompra == null || casoAEditar.valorOpcionCompra === ""
          ? null
          : Number(casoAEditar.valorOpcionCompra),
      honorarios: numero(casoAEditar.honorarios),
      honorariosServiciosJuridicos: numero(casoAEditar.honorariosServiciosJuridicos),
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
      procesoJuridico: proceso ? { ...proceso } : {},
      auditoriaMulta: auditoria ? { ...auditoria } : {},
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

      if (modoLocatario === "nuevo") {
        if (!nuevoLocatario.nombreBanco.trim() || !nuevoLocatario.nit.trim()) throw new Error("Debes ingresar Nombre y NIT/Cédula del locatario.");
        try {
          locatarioId = (await leasingApi.getLocatarioByIdentificacion(nuevoLocatario.nit.trim())).id;
        } catch (lookup) {
          const message = lookup instanceof Error ? lookup.message.toLowerCase() : "";
          if (!message.includes("404") && !message.includes("no encontrado")) throw lookup;
          const created = await leasingApi.createLocatario({ ...nuevoLocatario, nit: nuevoLocatario.nit.trim(), nombreBanco: nuevoLocatario.nombreBanco.trim() });
          locatarioId = created.id;
        }
      }
      if (!locatarioId) throw new Error("Debes seleccionar o crear un locatario.");

      if (modoVehiculo === "nuevo") {
        if (!nuevoVehiculo.placa.trim()) throw new Error("La placa del vehículo es obligatoria.");
        vehiculoPlaca = nuevoVehiculo.placa.trim().toUpperCase();
        try {
          vehiculoPlaca = (await leasingApi.getVehiculoByPlaca(vehiculoPlaca)).placa;
        } catch (lookup) {
          const message = lookup instanceof Error ? lookup.message.toLowerCase() : "";
          if (!message.includes("404") && !message.includes("no encontrado")) throw lookup;
          const created = await leasingApi.createVehiculo({
            ...nuevoVehiculo,
            placa: vehiculoPlaca,
            modelo: nuevoVehiculo.modelo ? Number(nuevoVehiculo.modelo) : undefined,
            vigenciaSoat: fechaApi(nuevoVehiculo.vigenciaSoat),
            vigenciaTecno: fechaApi(nuevoVehiculo.vigenciaTecno),
          });
          vehiculoPlaca = created.placa;
        }
      }
      if (!vehiculoPlaca) throw new Error("Debes seleccionar o crear un vehículo.");

      const payload: CrearCasoInput = {
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
        procesoJuridico: formData.procesoJuridico ? { ...formData.procesoJuridico } : undefined,
        auditoriaMulta: formData.auditoriaMulta ? { ...formData.auditoriaMulta } : undefined,
      };

      if (casoAEditar) {
        await leasingApi.updateCaso(casoAEditar.id, payload);
        if (procesoJuridicoId && payload.procesoJuridico) {
          await leasingApi.updateProcesoJuridico(procesoJuridicoId, payload.procesoJuridico);
        }
        if (auditoriaMultaId && payload.auditoriaMulta) {
          await leasingApi.updateAuditoriaMulta(auditoriaMultaId, payload.auditoriaMulta);
        }
      } else {
        await leasingApi.createCaso(payload);
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

  return { activeTab, setActiveTab, locatarios, vehiculos, loading, submitting, error, modoLocatario, setModoLocatario, modoVehiculo, setModoVehiculo, nuevoLocatario, setNuevoLocatario, nuevoVehiculo, setNuevoVehiculo, formData, handleChange, handleSubmit };
}
