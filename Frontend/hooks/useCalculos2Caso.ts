// src/hooks/useCalculos2Caso.ts

import { useState, useEffect, useCallback } from 'react';
import { calculos2Service, IndicadoresCalculos2 } from '@/services/calculos2Service';

export function useCalculos2Caso(casoId: number) {
  const [indicadores, setIndicadores] = useState<IndicadoresCalculos2 | null>(null);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const obtenerIndicadores = useCallback(async () => {
    if (!casoId) return;
    setCargando(true);
    setError(null);
    try {
      const respuesta = await calculos2Service.obtenerCalculos2(casoId);
      setIndicadores(respuesta.indicadores);
    } catch (err: any) {
      setError(err.message || 'Error inesperado al cargar indicadores');
    } finally {
      setCargando(false);
    }
  }, [casoId]);

  useEffect(() => {
    void obtenerIndicadores();
  }, [obtenerIndicadores]);

  return {
    indicadores,
    cargando,
    error,
    recargar: obtenerIndicadores,
  };
}