import SeguimientoClient from '@/components/SeguimientoPortal/SeguimientoClient';

export const metadata = {
  title: 'Seguimiento del trámite | Leasing Vehicular',
  description: 'Consulta el avance de tu trámite de leasing vehicular.',
};

export default function SeguimientoPage() {
  return <SeguimientoClient />;
}
