// Nombres de las poses de Pancho: cada una es src/assets/pancho/pancho-<pose>.svg
export const POSES = [
  'sentado', 'zarpazo', 'saltando', 'colgado', 'estirandose', 'dormido',
  'acostado', 'asomado', 'asomado-abajo', 'caja', 'caminando', 'de-espaldas',
  'de-pie', 'en-el-borde', 'estambre', 'lamiendose', 'mirando-arriba', 'pan',
] as const;

export type Pose = (typeof POSES)[number];
