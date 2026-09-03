// raiz components/Modal/CasoFormEntitySections.tsx
'use client';

import React, { useMemo, useState } from 'react';
import { CrearCasoInput, Locatario, Vehiculo } from '@/types/leasing';
import { TabId } from '@/hooks/useCrearCasoForm';
import { useBusquedaInteligente } from '@/hooks/useBusquedaInteligente';

type ChangeHandler = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
) => void;

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

const inputClass =
  'w-full rounded-lg border border-slate-300 bg-white p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';

function Campo({
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder,
}: {
  label: string;
  name?: string;
  value: string | number | undefined | null;
  onChange?: ChangeHandler;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-slate-600">{label}</label>
      <input
        name={name}
        type={type}
        value={value ?? ''}
        onChange={onChange}
        placeholder={placeholder}
        className={inputClass}
      />
    </div>
  );
}

function SelectorEntidad({
  title,
  searchTerm,
  setSearchTerm,
  isOpen,
  setIsOpen,
  loading,
  emptyText,
  children,
}: {
  title: string;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  loading: boolean;
  emptyText: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <input
        type="text"
        value={searchTerm}
        placeholder={title}
        onFocus={() => setIsOpen(true)}
        onChange={(event) => {
          setSearchTerm(event.target.value);
          setIsOpen(true);
        }}
        className={`${inputClass} uppercase`}
      />
      {isOpen && (
        <div className="absolute left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-lg">
          {loading ? (
            <div className="p-3 text-center text-xs text-slate-500">Buscando...</div>
          ) : children ? (
            children
          ) : (
            <div className="p-3 text-center text-xs text-slate-500">{emptyText}</div>
          )}
        </div>
      )}
    </div>
  );
}

export function LocatarioSection({
  modoLocatario,
  setModoLocatario,
  locatarios,
  formData,
  handleChange,
  nuevoLocatario,
  setNuevoLocatario,
}: {
  modoLocatario: 'existente' | 'nuevo';
  setModoLocatario: (mode: 'existente' | 'nuevo') => void;
  locatarios: Locatario[];
  formData: CrearCasoInput;
  handleChange: ChangeHandler;
  nuevoLocatario: NuevoLocatario;
  setNuevoLocatario: React.Dispatch<React.SetStateAction<NuevoLocatario>>;
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { data, isLoading } = useBusquedaInteligente('nit', searchTerm);

  const sugerencias = useMemo(() => {
    if (searchTerm.trim().length < 2) return locatarios;
    if (data?.encontrado && data.data) {
      const casos = Array.isArray(data.data) ? data.data : [data.data];
      return casos.map((caso) => caso.locatario).filter((loc): loc is Locatario => Boolean(loc));
    }
    const query = searchTerm.toLowerCase();
    return locatarios.filter(
      (loc) =>
        loc.nit.toLowerCase().includes(query) ||
        loc.nombreBanco?.toLowerCase().includes(query) ||
        loc.nombreComercial?.toLowerCase().includes(query),
    );
  }, [data, locatarios, searchTerm]);

  const seleccionado = locatarios.find((loc) => loc.id === formData.locatarioId);
  const seleccionar = (loc: Locatario) => {
    handleChange({ target: { name: 'locatarioId', value: String(loc.id), type: 'number' } } as unknown as React.ChangeEvent<HTMLInputElement>);
    setSearchTerm('');
    setIsOpen(false);
  };

  const cambiarNuevo = (key: keyof NuevoLocatario, value: string | boolean) =>
    setNuevoLocatario((prev) => ({ ...prev, [key]: value }));

  return (
    <section className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <h3 className="text-sm font-bold text-slate-800">1. Información del Locatario *</h3>
        <div className="flex gap-2 text-xs">
          {(['nuevo', 'existente'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setModoLocatario(mode)}
              className={`rounded-lg px-3 py-1.5 font-medium ${modoLocatario === mode ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'}`}
            >
              {mode === 'nuevo' ? '+ Nuevo Locatario' : 'Buscar Existente'}
            </button>
          ))}
        </div>
      </div>

      {modoLocatario === 'existente' ? (
        <SelectorEntidad
          title={seleccionado ? `${seleccionado.nombreBanco || seleccionado.nombreComercial || 'Locatario'} (NIT: ${seleccionado.nit})` : 'Escriba NIT o nombre para buscar...'}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          loading={isLoading}
          emptyText="No se encontraron coincidencias."
        >
          {sugerencias.map((loc) => (
            <button key={loc.id} type="button" onClick={() => seleccionar(loc)} className="flex w-full items-center justify-between border-b border-slate-100 px-4 py-2.5 text-left text-sm hover:bg-blue-50">
              <span><strong>{loc.nombreBanco || loc.nombreComercial || 'Locatario sin nombre'}</strong><small className="block text-xs text-slate-500">NIT: {loc.nit}</small></span>
              {formData.locatarioId === loc.id && <span className="text-xs font-bold text-blue-600">Seleccionado</span>}
            </button>
          ))}
        </SelectorEntidad>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <Campo label="Nombre / Razón Social *" value={nuevoLocatario.nombreBanco} onChange={(e) => cambiarNuevo('nombreBanco', e.target.value)} />
          <Campo label="NIT / Cédula *" value={nuevoLocatario.nit} onChange={(e) => cambiarNuevo('nit', e.target.value)} />
          <Campo label="Tipo de Documento" value={nuevoLocatario.tipoDocumento} onChange={(e) => cambiarNuevo('tipoDocumento', e.target.value)} />
          <Campo label="Correo Principal" type="email" value={nuevoLocatario.email} onChange={(e) => cambiarNuevo('email', e.target.value)} />
          <Campo label="Contacto" value={nuevoLocatario.contactoNombre} onChange={(e) => cambiarNuevo('contactoNombre', e.target.value)} />
          <Campo label="Número de Contacto" value={nuevoLocatario.contactoNumero} onChange={(e) => cambiarNuevo('contactoNumero', e.target.value)} />
          <Campo label="Dirección de Envío" value={nuevoLocatario.direccionEnvio} onChange={(e) => cambiarNuevo('direccionEnvio', e.target.value)} />
          <Campo label="Locatario RUNT" value={nuevoLocatario.locatarioRunt} onChange={(e) => cambiarNuevo('locatarioRunt', e.target.value)} />
          <Campo label="Nombre Comercial" value={nuevoLocatario.nombreComercial} onChange={(e) => cambiarNuevo('nombreComercial', e.target.value)} />
          <Campo label="Correo Comercial" type="email" value={nuevoLocatario.emailComercial} onChange={(e) => cambiarNuevo('emailComercial', e.target.value)} />
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-600"><input type="checkbox" checked={nuevoLocatario.revisionCorreo} onChange={(e) => cambiarNuevo('revisionCorreo', e.target.checked)} /> Revisión de correo</label>
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-600"><input type="checkbox" checked={nuevoLocatario.revisionMailComercial} onChange={(e) => cambiarNuevo('revisionMailComercial', e.target.checked)} /> Revisión mail comercial</label>
        </div>
      )}
    </section>
  );
}

export function VehiculoSection({
  modoVehiculo,
  setModoVehiculo,
  vehiculos,
  formData,
  handleChange,
  nuevoVehiculo,
  setNuevoVehiculo,
}: {
  modoVehiculo: 'existente' | 'nuevo';
  setModoVehiculo: (mode: 'existente' | 'nuevo') => void;
  vehiculos: Vehiculo[];
  formData: CrearCasoInput;
  handleChange: ChangeHandler;
  nuevoVehiculo: NuevoVehiculo;
  setNuevoVehiculo: React.Dispatch<React.SetStateAction<NuevoVehiculo>>;
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { data, isLoading } = useBusquedaInteligente('placa', searchTerm);

  const sugerencias = useMemo(() => {
    if (searchTerm.trim().length < 2) return vehiculos;
    if (data?.encontrado && data.data) {
      const casos = Array.isArray(data.data) ? data.data : [data.data];
      return casos.map((caso) => caso.vehiculo).filter((vehiculo): vehiculo is Vehiculo => Boolean(vehiculo));
    }
    const query = searchTerm.toLowerCase();
    return vehiculos.filter((vehiculo) => vehiculo.placa.toLowerCase().includes(query) || vehiculo.marca?.toLowerCase().includes(query));
  }, [data, searchTerm, vehiculos]);

  const seleccionado = vehiculos.find((vehiculo) => vehiculo.placa === formData.vehiculoPlaca);
  const seleccionar = (vehiculo: Vehiculo) => {
    handleChange({ target: { name: 'vehiculoPlaca', value: vehiculo.placa, type: 'text' } } as unknown as React.ChangeEvent<HTMLInputElement>);
    setSearchTerm('');
    setIsOpen(false);
  };
  const cambiarNuevo = (key: keyof NuevoVehiculo, value: string) => setNuevoVehiculo((prev) => ({ ...prev, [key]: value }));

  const datosVehiculo: Array<[keyof NuevoVehiculo, string, string?]> = [
    ['placa', 'Placa *'], ['vin', 'VIN'], ['marca', 'Marca'], ['linea', 'Línea'], ['modelo', 'Modelo (Año)', 'number'],
    ['cilindraje', 'Cilindraje'], ['motor', 'Motor'], ['chasis', 'Chasis'], ['serie', 'Serie'], ['color', 'Color'],
    ['tipoVehiculo', 'Tipo de Vehículo'], ['tipoServicio', 'Tipo de Servicio'], ['tipoCarroceria', 'Tipo de Carrocería'],
    ['tipoCombustible', 'Tipo de Combustible'], ['blindaje', 'Blindaje'], ['transito', 'Tránsito / Organismo'],
    ['departamento', 'Departamento'], ['regional', 'Regional'], ['empresaTransportadora', 'Empresa Transportadora'],
    ['vigenciaSoat', 'Vigencia SOAT', 'date'], ['vigenciaTecno', 'Vigencia Tecnomecánica', 'date'],
  ];

  return (
    <section className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <h3 className="text-sm font-bold text-slate-800">2. Información del Vehículo *</h3>
        <div className="flex gap-2 text-xs">
          {(['nuevo', 'existente'] as const).map((mode) => (
            <button key={mode} type="button" onClick={() => setModoVehiculo(mode)} className={`rounded-lg px-3 py-1.5 font-medium ${modoVehiculo === mode ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'}`}>
              {mode === 'nuevo' ? '+ Nuevo Vehículo' : 'Buscar Existente'}
            </button>
          ))}
        </div>
      </div>

      {modoVehiculo === 'existente' ? (
        <SelectorEntidad
          title={seleccionado ? `Placa: ${seleccionado.placa} ${seleccionado.marca || ''}` : 'Escriba placa o marca para buscar...'}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          loading={isLoading}
          emptyText="No se encontraron vehículos."
        >
          {sugerencias.map((vehiculo) => (
            <button key={vehiculo.placa} type="button" onClick={() => seleccionar(vehiculo)} className="flex w-full items-center justify-between border-b border-slate-100 px-4 py-2.5 text-left text-sm hover:bg-blue-50">
              <span><strong>Placa: {vehiculo.placa}</strong><small className="block text-xs text-slate-500">{vehiculo.marca || 'Sin marca'} {vehiculo.linea || ''} — Modelo {vehiculo.modelo || 'N/A'}</small></span>
              {formData.vehiculoPlaca === vehiculo.placa && <span className="text-xs font-bold text-blue-600">Seleccionado</span>}
            </button>
          ))}
        </SelectorEntidad>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
          {datosVehiculo.map(([key, label, type]) => (
            <Campo key={key} label={label} type={type} value={nuevoVehiculo[key]} onChange={(e) => cambiarNuevo(key, e.target.value)} />
          ))}
        </div>
      )}
    </section>
  );
}

const TABS: Array<{ id: TabId; label: string }> = [
  { id: 'basico', label: 'Básico' },
  { id: 'fechas', label: 'Fechas y Gestión' },
  { id: 'notificaciones', label: 'Notificaciones' },
  { id: 'traspaso', label: 'Traspaso y Logística' },
  { id: 'facturacion', label: 'Facturación y Tiempos' },
  { id: 'juridico', label: 'Proceso Jurídico' },
  { id: 'multas', label: 'Auditoría y Multas' },
];

export function CasoFormTabsNav({
  activeTab,
  setActiveTab,
}: {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
}) {
  return (
    <nav className="flex overflow-x-auto rounded-t-lg border-b bg-slate-50 text-xs font-medium">
      {TABS.map((tab) => (
        <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`whitespace-nowrap border-b-2 px-4 py-3 font-semibold ${activeTab === tab.id ? 'border-blue-600 bg-white text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
