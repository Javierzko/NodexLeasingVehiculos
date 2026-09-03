'use client';

import { useEffect, useState } from 'react';
import { obtenerEstadosPorTipo } from '@/services/estado.service';

interface Props {
  id?: number | null;
  tipo: 'SOAT' | 'REVISION_TECNOMECANICA';
}

export default function EstadoDocumentoVehiculo({
  id,
  tipo,
}: Props) {
  const [nombre, setNombre] = useState('-');

  useEffect(() => {
    if (!id) {
      setNombre('-');
      return;
    }

    const cargarEstado = async () => {
      try {
        const estados = await obtenerEstadosPorTipo(tipo);
        const estado = estados.find((item: any) => item.id === id);

        setNombre(estado?.nombre || '-');
      } catch {
        setNombre('-');
      }
    };

    cargarEstado();
  }, [id, tipo]);

  return <>{nombre}</>;
}