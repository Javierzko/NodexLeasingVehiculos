// ============================================================
// RUTAS GENERALES DEL PORTAL
// ============================================================
export const SEGUIMIENTO_ROUTES = {
  nuevaConsulta: '/portalConsulta',
  preguntasFrecuentes: '#preguntas-frecuentes',
  cargaDocumentos: '/carga-documentos',
  tarjetaPropiedad: '#tarjeta-propiedad',
} as const;

export const SEGUIMIENTO_LABELS = {
  sinConsulta: 'No hay una consulta activa',
  cargando: 'Cargando el seguimiento...',
} as const;

// ============================================================
// ETAPAS VISIBLES PARA EL CLIENTE
// ============================================================
// El seed contiene muchas actividades guardadas como ETAPA.
// Por eso cada grupo tiene dos listas:
//
// 1. valoresEtapa: nombres que pueden llegar en caso.etapa.nombre.
// 2. valoresActividad: nombres que pueden llegar en
//    caso.subetapa.nombre o que también pueden llegar dentro de ETAPA.
//
// El cliente solo verá estos seis grupos, nunca todas las actividades.
export const ETAPAS_VISIBLES_SEGUIMIENTO = [
  {
    id: 'investigacion',
    nombre: 'Investigación y diagnóstico',
    valoresEtapa: [
      'Pendiente',
      'Novedad Hacienda Bogotá',
    ],
    valoresActividad: [],
  },
  {
    id: 'saneamiento',
    nombre: 'Saneamiento',
    valoresEtapa: [
      'Seguimiento Saneamiento Jurídico',
      'Seguimiento Tutela',
      'Seguimiento Desacato Tutela',
      'Seguimiento Derecho Petición',
      'Saneamiento en curso',
      'Pendiente Pago Multas Locatario',
      'Blindado',
    ],
    valoresActividad: [
      'Pendiente pago Multas Locatario',
      'Liquidación Impuestos',
      'Pago de Impuestos',
      'En revisión Jurídica',
      'Levantamiento Embargo Radicado',
      'Levantamiento Medidas Radicada',
      'Corrección características Radicada',
    ],
  },
  {
    id: 'gestion-documental',
    nombre: 'Gestión documental',
    valoresEtapa: [
      'Registro locatario',
      'Modificación Locatario Bilateral',
      'Saneamiento ok/pendiente traspaso Bilateral',
      'Registro locatario / Traspaso unilateral',
      'Generar Documentación Traspaso Unilateral',
      'Solicitar Contrato Leasing Unilateral',
      'Seguimiento entrega Contrato Leasing Unil...',
      'Generar Documentación Traspaso',
    ],
    valoresActividad: [
      'Pendiente Gestión o entrega Documentos Bilateral',
      'Pendiente Gestión o entrega Documentos Unilateral',
      'Generar Documentación Traspaso Bilateral',
      'Generar Documentación Traspaso Unilateral',
      'Modificación locatario solicitado',
      'Modificacion locatario',
      'Registro locatario Solicitado',
    ],
  },
  {
    id: 'traspaso',
    nombre: 'Traspaso',
    valoresEtapa: [
      'Envío documentos Unilateral a corresponsal',
      'Traspaso Unilateral por Radicar',
      'Traspaso Unilateral en curso',
      'Traspaso unilateral con Boletín de rechazo /...',
      'Envío documentos Bilateral a corresponsal',
      'Traspaso Bilateral por Radicar',
      'Traspaso Bilateral en curso',
      'Traspaso Bilateral Ok',
      'Traspaso realizado por Locatario',
    ],
    valoresActividad: [
      'Agendado para Traspaso Bilateral',
      'Traspaso Bilateral Radicado',
      'Agendado para Traspaso Unilateral',
      'Traspaso Unilateral por Radicar',
      'Traspaso Bilateral por Radicar',
      'Traspaso Unilateral Radicado Pdte Aprobación',
      'Aplazado por Banco para traspaso Directo por Locatario',
    ],
  },
  {
    id: 'tarjeta-propiedad',
    nombre: 'Tarjeta de propiedad',
    valoresEtapa: [
      'Tarjeta de propiedad enviada',
      'Tarjeta de propiedad Entregada',
      'TP Pendiente por Enviar con Dirección',
      'TP Pendiente por Enviar Sin Dirección',
      'TP Pendiente por Enviar escaladas con el B...',
      'Cliente Expidió Duplicado TP',
    ],
    valoresActividad: [
      'TP Unilateral aprobado Pdte recoger Tarjeta',
    ],
  },
  {
    id: 'finalizacion',
    nombre: 'Finalización',
    // "Caso Finalizado" no se agrega aquí como regla general porque
    // sus actividades pueden pertenecer a Traspaso o Tarjeta.
    valoresEtapa: ['Caso Desistido'],
    valoresActividad: [
      'Vehículo facturado',
      'Caso desistido',
      'Finalizado por instrucción de Banco sin tras...',
    ],
  },
] as const;
