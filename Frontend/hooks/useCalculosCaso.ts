// src/hooks/useCalculosCaso.ts

import { useState, useEffect, useCallback } from 'react';
import { CalculosFrontend } from '@/types/calculos';
import { calculosService } from '@/services/calculosService';

export function useCalculosCaso(casoId: number | null) {
  const [calculos, setCalculos] = useState<CalculosFrontend | null>(null);
  const [cargando, setCargando] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const cargarCalculos = useCallback(async () => {
    if (!casoId) {
      setCalculos(null);
      return;
    }

    setCargando(true);
    setError(null);

    try {
      const data = await calculosService.obtenerCalculosCaso(casoId);
      setCalculos(data.calculos);
    } catch (err: any) {
      setError(err.message || 'Error al cargar cálculos');
    } finally {
      setCargando(false);
    }
  }, [casoId]);

  useEffect(() => {
    cargarCalculos();
  }, [cargarCalculos]);

  return {
    calculos,
    cargando,
    error,
    recargarCalculos: cargarCalculos,
  };
}