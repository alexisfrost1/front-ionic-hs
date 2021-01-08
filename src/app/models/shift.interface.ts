//modelo de la interfaz de los turnos
export interface Shift {
    shiftId: string;
    type?: string;
    start: string;
    trueStartShift?: string;
    finish: string;
    date: string;
    state: string;
    client?: number;
    guards?:string[];
    shiftPlace?:string;
  }