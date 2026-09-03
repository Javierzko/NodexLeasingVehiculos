'use client';

import { useState } from 'react';
import { leasingApi } from '@/services/leasingApi';

interface Props {
  locatarioId: number;
  onEliminado?: () => void;
}

export default function EliminarLocatario({
  locatarioId,
  onEliminado,
}: Props) {
  const [eliminando, setEliminando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEliminar = async () => {
    const confirmar = window.confirm(
      '¿Está seguro de eliminar este locatario? Esta acción no se puede deshacer.'
    );

    if (!confirmar) {
      return;
    }

    try {
      setEliminando(true);
      setError(null);

      await leasingApi.deleteLocatario(locatarioId);

      onEliminado?.();
    } catch (error) {
      const mensaje =
        error instanceof Error
          ? error.message
          : 'No se pudo eliminar el locatario.';

      setError(mensaje);
    } finally {
      setEliminando(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleEliminar}
        disabled={eliminando}
      >
        {eliminando ? 'Eliminando...' : 'Eliminar locatario'}
      </button>

      {error && (
        <p>
          {error}
        </p>
      )}
    </div>
  );
}