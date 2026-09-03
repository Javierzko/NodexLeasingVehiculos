"use client";

import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";

import {
  DocumentosSolicitados,
  type DocumentoSolicitado,
} from "../../components/seguimiento/cargar-documentos/DocumentosSolicitados";
import { SEGUIMIENTO_ROUTES } from "@/constants/seguimiento.constants";

const DOCUMENTOS_SOLICITADOS: DocumentoSolicitado[] = [
  {
    id: "camara-comercio",
    titulo: "Cámara de comercio",
    descripcion: "Certificado de existencia y representación legal",
    detalle: "Fecha de expedición no mayor a 30 días.",
  },
  {
    id: "cedula-representante",
    titulo: "Cédula del representante legal",
    descripcion: "Copia legible por ambas caras.",
  },
  {
    id: "rut",
    titulo: "RUT",
    descripcion: "Registro Único Tributario actualizado.",
  },
  {
    id: "paz-salvo-comparendos",
    titulo: "Paz y salvo por comparendos",
    descripcion: "Emitido por el SIMIT.",
  },
  {
    id: "paz-salvo-impuestos",
    titulo: "Paz y salvo por impuestos del vehículo",
    descripcion: "Emitido por la Secretaría de Hacienda.",
  },
  {
    id: "tradicion-vehiculo",
    titulo: "Certificado de tradición del vehículo",
    descripcion: "Fecha de expedición no mayor a 30 días.",
  },
  {
    id: "otros-documentos",
    titulo: "Otros documentos (si aplica)",
    descripcion: "Documentos adicionales que consideres relevantes.",
    obligatorio: false,
  },
];

export default function CargaDocumentosPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const numeroContrato = searchParams.get("numeroContrato") ?? "";

  const handleLogout = () => {
    // 1. Limpia cualquier almacenamiento local/cookies si aplica
    localStorage.removeItem("token");
    sessionStorage.clear();

    // 2. Redirige a la ruta principal de consulta o login
    router.push(SEGUIMIENTO_ROUTES.nuevaConsulta);
  };

  return (
    <main className="min-h-screen bg-background font-sans text-foreground [zoom:0.75]">
      <header className="border-b border-border bg-white">
        <div className="mx-auto flex w-full max-w-[1536px] flex-col gap-4 px-4 py-4 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 sm:gap-x-7">
            <div className="flex items-center border-r border-primary/50 pr-6 sm:pr-7">
              <Image
                src="/image/GP L-06.png"
                alt="Gómez Pineda Abogados"
                width={160}
                height={40}
                className="h-10 w-auto object-contain"
                priority
              />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-foreground">
                Aliado estratégico de
              </p>
              <p className="mt-0.5 text-2xl font-extrabold tracking-[-0.03em] text-foreground">
                Bancolombia
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 border-t border-border pt-3 text-sm font-semibold text-foreground sm:gap-7 sm:pt-4 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0">
            <span className="inline-flex items-center gap-2">
              <span
                className="grid h-8 w-8 place-items-center rounded-full border border-border text-muted"
                aria-hidden="true"
              >
                ◯
              </span>
            </span>
            <button
              className="inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-foreground transition-colors hover:bg-surface-soft focus:outline-none focus:ring-2 focus:ring-primary/35 focus:ring-offset-2"
              onClick={handleLogout}
              type="button"
            >
              <span className="text-xl leading-none" aria-hidden="true">
                ⇥
              </span>
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[1536px] px-4 py-7 sm:px-8 lg:px-10 lg:py-8">
        <nav
          aria-label="Miga de pan"
          className="flex flex-wrap items-center gap-2 text-sm text-muted"
        >
          <Link
            className="font-semibold text-muted transition-colors hover:text-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/35 focus:ring-offset-2"
            href={SEGUIMIENTO_ROUTES.nuevaConsulta}
          >
            Inicio
          </Link>
          <span aria-hidden="true">›</span>
          <span aria-current="page" className="font-bold text-primary">
            Cargar documentos
          </span>
        </nav>

        <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          <div>
            <section className="flex items-center gap-4">
              <span
                className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-surface-muted text-3xl text-primary"
                aria-hidden="true"
              >
                ⇧
              </span>
              <div>
                <h1 className="text-3xl font-extrabold tracking-[-0.035em] text-foreground">
                  Cargar documentos
                </h1>
                <p className="mt-1.5 text-sm leading-6 text-muted sm:text-base">
                  Adjunta los documentos solicitados para continuar con tu
                  trámite.
                </p>
              </div>
            </section>

            <div
              role="note"
              className="mt-6 flex gap-3 rounded-xl border border-primary/35 bg-surface-muted px-4 py-4 text-sm leading-6 text-muted"
            >
              <span
                className="grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 border-primary font-extrabold text-primary"
                aria-hidden="true"
              >
                i
              </span>
              <p>
                Los documentos serán revisados por nuestro equipo y te
                notificaremos por correo electrónico si se requiere algo
                adicional.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <DocumentosSolicitados
            numeroContrato={numeroContrato}
            documentos={DOCUMENTOS_SOLICITADOS}
          />
        </div>

        <section
          className="mt-6 grid gap-5 rounded-xl border border-border bg-white px-5 py-5 shadow-sm md:grid-cols-3 md:divide-x md:divide-border md:px-6 md:py-6"
          aria-labelledby="ayuda-titulo"
        >
          <div className="flex items-start gap-4">
            <span
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-surface-muted text-xl text-primary"
              aria-hidden="true"
            >
              ◌
            </span>
            <div>
              <h2
                id="ayuda-titulo"
                className="font-extrabold tracking-[-0.01em] text-foreground"
              >
                ¿Necesitas ayuda?
              </h2>
              <p className="mt-1 text-xs leading-5 text-muted">
                Estamos para acompañarte en cada etapa del proceso.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 md:pl-6">
            <span
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-surface-muted text-xl text-primary"
              aria-hidden="true"
            >
              ☎
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground">
                Línea telefónica
              </p>
              <p className="mt-1 text-lg font-extrabold tracking-[-0.02em] text-foreground">
                (604) 604 1990
              </p>
              <p className="mt-1 text-xs leading-5 text-muted">
                Lunes a viernes, 7:30 a. m. a 5:00 p. m.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 md:pl-6">
            <span
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-surface-muted text-xl text-primary"
              aria-hidden="true"
            >
              ✉
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground">
                Correo electrónico
              </p>
              <p className="mt-1 break-words text-sm font-extrabold text-foreground">
                finalizacionesleasing@gomezpinedaabogados.com
              </p>
              <p className="mt-1 text-xs leading-5 text-muted">
                Atenderemos tu correo en el menor tiempo posible.
              </p>
            </div>
          </div>
        </section>
      </div>

      <footer className="border-t border-border bg-white px-4 py-5 text-center text-xs leading-5 text-muted">
        Este portal utiliza conexión segura y cumple con la Ley 1581 de 2012 de
        Protección de Datos Personales.
      </footer>
    </main>
  );
}