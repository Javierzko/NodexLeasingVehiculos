// src/types/calculos.ts 

export interface CalculosFrontend {
  diasDesdeUltimoComentario: number | null;
  alertaCorreoNotificacionInicial: string;
  diasDp: number | null;
  alertaRespuestaDp: string;
  diasRespuestaTutela: number | null;
  alertaRespuestaTutela: string;
  diasDesdeUltimaNotificacion: number | null;
  alertaNotificacionLocatario: string;
  alertaActualizacionBase: string;
  alertaReactivacionCaso: string;
  diasSuspensionCaso: number | null;
  tiempoTotalProceso: number | null;
  bloqueJuridicoTotal: number;
  alertaAnsCompleta: string;
  ansGpa: string;
  estadoVencimientoAns: string;
}

export interface RespuestaCalculosAPI {
  caso: Record<string, unknown>;
  calculos: CalculosFrontend;
}