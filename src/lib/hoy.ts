// Se ejecuta en el navegador: el día cambia, la página es estática.
export const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

export interface GrupoDia {
  id: string;
  titulo: string;
  dias: number[];
}

export function grupoDeHoy<T extends GrupoDia>(grupos: T[], fecha = new Date()): T | undefined {
  return grupos.find((g) => g.dias.includes(fecha.getDay()));
}

export function nombreDelDia(fecha = new Date()): string {
  return DIAS[fecha.getDay()];
}

export function esDeNoche(fecha = new Date()): boolean {
  const h = fecha.getHours();
  return h >= 19 || h < 5;
}
