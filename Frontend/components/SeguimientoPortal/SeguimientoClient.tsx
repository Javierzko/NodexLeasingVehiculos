"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  SEGUIMIENTO_LABELS,
  SEGUIMIENTO_ROUTES,
} from "@/constants/seguimiento.constants";
import type { PortalSeguimientoResponse } from "@/services/portalConsultaApi";
import Footer from "@/components/seguimiento/footer/Footer";
import HeaderVehiculosSeguimiento from "@/components/seguimiento/header/HeaderVehiculosSeguimiento";
import InformacionCentral from "@/components/seguimiento/informacion-central/InformacionCentral";
import InformacionGeneralSeguimiento from "@/components/seguimiento/informacion-general/InformacionGeneralSeguimiento";
import LineaTiempoT from "@/components/seguimiento/linea-tiempo/LineaTiempoT";
import TarjetaPropiedad from "../seguimiento/TarjetaPropiedad";

export default function SeguimientoClient() {
  const router = useRouter();

  // Guardamos aquí la respuesta completa del backend.
  const [seguimiento, setSeguimiento] =
    useState<PortalSeguimientoResponse | null>(null);
  const [cargando, setCargando] = useState(true);
  const [tarjetaPropiedadAbierta, setTarjetaPropiedadAbierta] = useState(false);

  useEffect(() => {
    // La página de consulta debe guardar la respuesta del endpoint
    // POST /seguimiento-portal con esta misma clave.
    const guardado = window.sessionStorage.getItem("portal-seguimiento");

    if (!guardado) {
      setCargando(false);
      return;
    }

    try {
      setSeguimiento(JSON.parse(guardado) as PortalSeguimientoResponse);
    } catch {
      window.sessionStorage.removeItem("portal-seguimiento");
    } finally {
      setCargando(false);
    }
  }, []);

  const handleLogout = () => {
    // 1. Limpia los datos almacenados en sesión o almacenamiento local
    window.sessionStorage.removeItem("portal-seguimiento");
    window.localStorage.clear();

    // 2. Redirige a la pantalla de nueva consulta / login
    router.push(SEGUIMIENTO_ROUTES.nuevaConsulta);
  };

  if (cargando) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4 font-sans text-foreground sm:px-8 [zoom:0.75]">
        <p className="text-sm font-semibold text-muted">
          {SEGUIMIENTO_LABELS.cargando}
        </p>
      </main>
    );
  }

  if (!seguimiento) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4 font-sans text-foreground sm:px-8 [zoom:0.75]">
        <section className="app-card w-full max-w-lg p-8 text-center sm:p-10">
          <h1 className="text-2xl font-extrabold tracking-[-0.02em] text-foreground">
            {SEGUIMIENTO_LABELS.sinConsulta}
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted">
            Realiza una consulta para visualizar el seguimiento de tu trámite.
          </p>
          <Link
            href={SEGUIMIENTO_ROUTES.nuevaConsulta}
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-primary px-5 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2"
          >
            Ir a consultar
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background font-sans text-foreground [zoom:0.75]">
      <HeaderVehiculosSeguimiento 
        seguimiento={seguimiento} 
        onLogout={handleLogout} 
      />
      <div className="mx-auto flex w-full max-w-[1536px] flex-col gap-5 px-4 py-5 sm:px-8 sm:py-6 lg:px-10 lg:py-7">
        <div className="flex justify-end border-b border-border/60 pb-4">
          <Link
            href={SEGUIMIENTO_ROUTES.nuevaConsulta}
            className="inline-flex items-center justify-center rounded-lg border border-primary bg-white px-4 py-2.5 text-sm font-bold text-primary shadow-xs transition-colors hover:bg-surface-muted hover:text-primary-strong focus:outline-none focus:ring-2 focus:ring-primary/25 focus:ring-offset-2"
          >
            Nueva consulta
          </Link>
        </div>

        <InformacionGeneralSeguimiento seguimiento={seguimiento} />
        <InformacionCentral
          seguimiento={seguimiento}
          tarjetaPropiedadAbierta={tarjetaPropiedadAbierta}
          onCambiarTarjetaPropiedad={() =>
            setTarjetaPropiedadAbierta((estaAbierta) => !estaAbierta)
          }
        />
        {tarjetaPropiedadAbierta && (
          <TarjetaPropiedad seguimiento={seguimiento} />
        )}

        {/*
          ETAPA controla la posición en la línea de tiempo.
          SUBETAPA solo explica la actividad dentro de esa etapa.
        */}
        <LineaTiempoT
          historial={seguimiento.historial}
          etapaActual={seguimiento.caso.etapa?.nombre ?? null}
          subetapaActual={seguimiento.caso.subetapa?.nombre ?? null}
        />

        <Footer />
      </div>
    </main>
  );
}