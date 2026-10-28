import type { ImageMetadata } from 'astro';
import type { Pose } from './pancho-poses';

export type { Pose };

const archivos = import.meta.glob<ImageMetadata>('../assets/pancho/*.svg', { eager: true, import: 'default' });

export function panchoImg(pose: Pose): ImageMetadata {
  const img = archivos[`../assets/pancho/pancho-${pose}.svg`];
  if (!img) throw new Error(`No existe la ilustración de Pancho: ${pose}`);
  return img;
}

// Descripción accesible y frase por defecto de cada pose.
export const PANCHO: Record<Pose, { alt: string; frase: string }> = {
  sentado: { alt: 'Pancho sentado', frase: 'Pancho te acompaña hoy.' },
  zarpazo: { alt: 'Pancho dando un zarpazo', frase: '¡Decena completa! Pancho aprueba.' },
  saltando: { alt: 'Pancho saltando', frase: 'Vamos al siguiente.' },
  colgado: { alt: 'Pancho colgado de las patitas', frase: 'Aquí no hay nada… todavía.' },
  estirandose: { alt: 'Pancho estirándose', frase: 'Buenos días, mamá.' },
  dormido: { alt: 'Pancho dormido', frase: 'Amén. Pancho ya se durmió.' },
  acostado: { alt: 'Pancho acostado', frase: 'Pancho escucha en silencio.' },
  asomado: { alt: 'Pancho asomado', frase: 'Pancho se asoma para acompañarte.' },
  'asomado-abajo': { alt: 'Orejas de Pancho asomándose', frase: 'Pancho está cerquita.' },
  caja: { alt: 'Pancho en una caja', frase: 'Todas las oraciones, bien guardadas.' },
  caminando: { alt: 'Pancho caminando', frase: 'Ya casi llegamos.' },
  'de-espaldas': { alt: 'Pancho de espaldas', frase: 'Pancho buscó por todos lados.' },
  'de-pie': { alt: 'Pancho de pie con las patitas arriba', frase: '¡Lo lograste, mamá!' },
  'en-el-borde': { alt: 'Pancho sentado en el borde con la cola colgando', frase: 'Pancho ya apartó su lugar.' },
  estambre: { alt: 'Pancho jugando con estambre', frase: 'Otra decena lista. Pancho sigue contigo.' },
  lamiendose: { alt: 'Pancho lamiéndose la patita', frase: 'Pancho espera con paciencia.' },
  'mirando-arriba': { alt: 'Pancho mirando hacia arriba', frase: 'Pancho también mira al cielo.' },
  pan: { alt: 'Pancho echado como pan', frase: 'Pancho se quedó quietecito.' },
};

// Poses tranquilas para acompañar una oración suelta, elegidas por su id.
const TRANQUILAS: Pose[] = ['mirando-arriba', 'sentado', 'acostado', 'pan', 'asomado', 'lamiendose'];

export function panchoPara(id: string): Pose {
  let h = 0;
  for (const c of id) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return TRANQUILAS[h % TRANQUILAS.length];
}
