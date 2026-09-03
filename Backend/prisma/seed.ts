//razi prisma/seed.ts

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const tiposDocumentos = [
  {
    codigo: 'CAMARA_COMERCIO',
    nombre: 'Cámara de comercio',
    obligatorio: true,
  },
  {
    codigo: 'CEDULA_REPRESENTANTE',
    nombre: 'Cédula del representante legal',
    obligatorio: true,
  },
  { codigo: 'RUT', nombre: 'RUT', obligatorio: true },
  {
    codigo: 'PAZ_SALVO_COMPARENDO',
    nombre: 'Paz y salvo por comparendos',
    obligatorio: true,
  },
  {
    codigo: 'PAZ_SALVO_IMPUESTOS',
    nombre: 'Paz y salvo por impuestos del vehículo',
    obligatorio: true,
  },
  {
    codigo: 'TRADICION_VEHICULO',
    nombre: 'Certificado de tradición del vehículo',
    obligatorio: true,
  },
  {
    codigo: 'OTROS_DOCUMENTOS',
    nombre: 'Otros documentos (si aplica)',
    obligatorio: false,
  },
];

const catalogos = [
  // 1. ESTADO DEL CASO
  { tipo: 'ESTADO_CASO', nombre: 'EN TRÁMITE' },
  { tipo: 'ESTADO_CASO', nombre: 'FINALIZADO' },
  { tipo: 'ESTADO_CASO', nombre: 'SUSPENDIDO' },
  { tipo: 'ESTADO_CASO', nombre: 'DESISTIDO' },

  // 2. CATEGORIA
  { tipo: 'CATEGORIA', nombre: 'Investigación Fiscal y Admón del Activo' },
  { tipo: 'CATEGORIA', nombre: 'Saneamiento Fiscal y/o Admón' },
  { tipo: 'CATEGORIA', nombre: 'Gestión Documental Traspaso Bilateral' },
  { tipo: 'CATEGORIA', nombre: 'Gestión Documental Traspaso Unilateral' },
  { tipo: 'CATEGORIA', nombre: 'Gestión Traspaso Unilateral' },
  { tipo: 'CATEGORIA', nombre: 'Gestión Traspaso Bilateral' },
  { tipo: 'CATEGORIA', nombre: 'Caso Finalizado' },
  { tipo: 'CATEGORIA', nombre: 'Gestión Documental Traspaso' },
  { tipo: 'CATEGORIA', nombre: 'Caso Desistido' },

  // 3. ETAPA
  { tipo: 'ETAPA', nombre: 'Pendiente' },
  { tipo: 'ETAPA', nombre: 'Novedad Hacienda Bogotá' },
  { tipo: 'ETAPA', nombre: 'Seguimiento Saneamiento Jurídico' },
  { tipo: 'ETAPA', nombre: 'Seguimiento Tutela' },
  { tipo: 'ETAPA', nombre: 'Seguimiento Desacato Tutela' },
  { tipo: 'ETAPA', nombre: 'Seguimiento Derecho Petición' },
  { tipo: 'ETAPA', nombre: 'Saneamiento en curso' },
  { tipo: 'ETAPA', nombre: 'Pendiente Pago Multas Locatario' },
  { tipo: 'ETAPA', nombre: 'Blindado' },
  { tipo: 'ETAPA', nombre: 'Registro locatario' },
  { tipo: 'ETAPA', nombre: 'Modificación Locatario Bilateral' },
  { tipo: 'ETAPA', nombre: 'Saneamiento ok/pendiente traspaso Bilateral' },
  { tipo: 'ETAPA', nombre: 'Registro locatario / Traspaso unilateral' },
  { tipo: 'ETAPA', nombre: 'Generar Documentación Traspaso Unilateral' },
  { tipo: 'ETAPA', nombre: 'Solicitar Contrato Leasing Unilateral' },
  { tipo: 'ETAPA', nombre: 'Seguimiento entrega Contrato Leasing Unil...' },
  { tipo: 'ETAPA', nombre: 'Envío documentos Unilateral a corresponsal' },
  { tipo: 'ETAPA', nombre: 'Traspaso Unilateral por Radicar' },
  { tipo: 'ETAPA', nombre: 'Traspaso Unilateral en curso' },
  { tipo: 'ETAPA', nombre: 'Traspaso unilateral con Boletín de rechazo /...' },
  { tipo: 'ETAPA', nombre: 'Envío documentos Bilateral a corresponsal' },
  { tipo: 'ETAPA', nombre: 'Traspaso Bilateral por Radicar' },
  { tipo: 'ETAPA', nombre: 'Traspaso Bilateral en curso' },
  { tipo: 'ETAPA', nombre: 'Traspaso Bilateral Ok' },
  { tipo: 'ETAPA', nombre: 'Tarjeta de propiedad enviada' },
  { tipo: 'ETAPA', nombre: 'Tarjeta de propiedad Entregada' },
  { tipo: 'ETAPA', nombre: 'TP Pendiente por Enviar con Dirección' },
  { tipo: 'ETAPA', nombre: 'TP Pendiente por Enviar Sin Dirección' },
  { tipo: 'ETAPA', nombre: 'TP Pendiente por Enviar escaladas con el B...' },
  { tipo: 'ETAPA', nombre: 'Traspaso realizado por Locatario' },
  { tipo: 'ETAPA', nombre: 'Vehículo facturado' },
  { tipo: 'ETAPA', nombre: 'Caso desistido' },
  { tipo: 'ETAPA', nombre: 'Finalizado por instrucción de Banco sin tras...' },
  { tipo: 'ETAPA', nombre: 'Cliente Expidió Duplicado TP' },
  { tipo: 'ETAPA', nombre: 'Generar Documentación Traspaso' },

  // 4. SUBETAPA
  {
    tipo: 'SUBETAPA',
    nombre: 'Pendiente Gestión o entrega Documentos Bilateral',
  },
  {
    tipo: 'SUBETAPA',
    nombre: 'Pendiente Gestión o entrega Documentos Unilateral',
  },
  {
    tipo: 'SUBETAPA',
    nombre: 'Jurídico Pendiente Respuesta Instancia Jurídica Unilateral',
  },
  {
    tipo: 'SUBETAPA',
    nombre: 'Jurídico Pendiente Respuesta Instancia Jurídica Bilateral',
  },
  { tipo: 'SUBETAPA', nombre: 'Liquidación Impuestos' },
  { tipo: 'SUBETAPA', nombre: 'Pago de Impuestos' },
  { tipo: 'SUBETAPA', nombre: 'Pendiente pago Multas Locatario' },
  { tipo: 'SUBETAPA', nombre: 'Generar Documentación Traspaso Bilateral' },
  { tipo: 'SUBETAPA', nombre: 'Generar Documentación Traspaso Unilateral' },
  { tipo: 'SUBETAPA', nombre: 'Agendado para Traspaso Bilateral' },
  { tipo: 'SUBETAPA', nombre: 'Pendiente Inscripción ante RUNT' },
  { tipo: 'SUBETAPA', nombre: 'Traspaso Bilateral Radicado' },
  { tipo: 'SUBETAPA', nombre: 'Modificación locatario solicitado' },
  { tipo: 'SUBETAPA', nombre: 'Escalado - Pendiente Respuesta' },
  { tipo: 'SUBETAPA', nombre: 'Agendado para Traspaso Unilateral' },
  { tipo: 'SUBETAPA', nombre: 'Traspaso Unilateral por Radicar' },
  { tipo: 'SUBETAPA', nombre: 'Modificacion locatario' },
  { tipo: 'SUBETAPA', nombre: 'Traspaso Bilateral por Radicar' },
  { tipo: 'SUBETAPA', nombre: 'Caso Finalizado' },
  { tipo: 'SUBETAPA', nombre: 'Caso Desistido' },
  { tipo: 'SUBETAPA', nombre: 'Traspaso Unilateral Radicado Pdte Aprobación' },
  { tipo: 'SUBETAPA', nombre: 'Expedición Soat' },
  { tipo: 'SUBETAPA', nombre: 'Pendiente renovación Soat y Rtm' },
  {
    tipo: 'SUBETAPA',
    nombre: 'Aplazado por Banco para traspaso Directo por Locatario',
  },
  { tipo: 'SUBETAPA', nombre: 'En revisión Jurídica' },
  { tipo: 'SUBETAPA', nombre: 'Pendiente agendamiento cita T Unilateral' },
  { tipo: 'SUBETAPA', nombre: 'Pendiente agendamiento cita T Bilateral' },
  { tipo: 'SUBETAPA', nombre: 'Compra copia de Carpeta en Tránsito' },
  { tipo: 'SUBETAPA', nombre: 'Compra CTL Directo Tránsito' },
  { tipo: 'SUBETAPA', nombre: 'TP Unilateral aprobado Pdte recoger Tarjeta' },
  { tipo: 'SUBETAPA', nombre: 'Expedición RTM' },
  { tipo: 'SUBETAPA', nombre: 'Expedición Soat y Liquidación Impuestos' },
  { tipo: 'SUBETAPA', nombre: 'Levantamiento Embargo Radicado' },
  { tipo: 'SUBETAPA', nombre: 'Corrección características Radicada' },
  { tipo: 'SUBETAPA', nombre: 'Levantamiento Medidas Radicada' },
  { tipo: 'SUBETAPA', nombre: 'Registro locatario Solicitado' },

  // 5. TIPO SANEAMIENTO
  { tipo: 'TIPO_SANEAMIENTO', nombre: 'Modificación de locatario' },
  { tipo: 'TIPO_SANEAMIENTO', nombre: 'Levantamiento Embargo' },
  { tipo: 'TIPO_SANEAMIENTO', nombre: 'Corrección Características' },
  { tipo: 'TIPO_SANEAMIENTO', nombre: 'Levantamiento de Medida' },
  { tipo: 'TIPO_SANEAMIENTO', nombre: 'Revocatoria' },
  { tipo: 'TIPO_SANEAMIENTO', nombre: 'Resolución Blindaje' },
  { tipo: 'TIPO_SANEAMIENTO', nombre: 'Rechazo Trámite' },

  // 6. CAUSA DEL ATRASO
  { tipo: 'CAUSA_ATRASO', nombre: 'Entidades externas' },
  { tipo: 'CAUSA_ATRASO', nombre: 'Gestión interna' },
  { tipo: 'CAUSA_ATRASO', nombre: 'Jurídico' },
  { tipo: 'CAUSA_ATRASO', nombre: 'Tránsito' },

  // 7. ESTADO CONTRATO
  { tipo: 'ESTADO_CONTRATO', nombre: 'CONTRATO VIGENTE' },
  { tipo: 'ESTADO_CONTRATO', nombre: 'CONTRATO VENCIDO' },

  // 8. ESTADO MATRICULA
  { tipo: 'ESTADO_MATRICULA', nombre: 'Activa' },
  { tipo: 'ESTADO_MATRICULA', nombre: 'Cancelada' },

  // 9. SOAT
  { tipo: 'SOAT', nombre: 'VENCIDO' },
  { tipo: 'SOAT', nombre: 'VIGENTE' },
  { tipo: 'SOAT', nombre: 'VENCIDO:VIGENTE' },

  // 10. REVISION TECNOMECANICA
  { tipo: 'REVISION_TECNOMECANICA', nombre: 'PRÓXIMO A VENCER' },
  { tipo: 'REVISION_TECNOMECANICA', nombre: 'VIGENTE' },
  { tipo: 'REVISION_TECNOMECANICA', nombre: 'N/A' },
];

async function main() {
  console.log('Iniciando carga de semillas para Estado...');

  for (const item of catalogos) {
    const existente = await prisma.estado.findFirst({
      where: {
        tipo: item.tipo,
        nombre: item.nombre,
      },
    });

    if (existente) {
      console.log(`Ya existe: ${item.tipo} - ${item.nombre}`);
      continue;
    }

    await prisma.estado.create({
      data: item,
    });

    console.log(`Creado: ${item.tipo} - ${item.nombre}`);
  }

  for (const item of tiposDocumentos) {
    await prisma.tipoDocumento.upsert({
      where: { codigo: item.codigo },
      update: {
        nombre: item.nombre,
        obligatorio: item.obligatorio,
        activo: true,
      },
      create: item,
    });
  }

  console.log('¡Semillas cargadas exitosamente!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
