import type { ImageMetadata } from 'astro';
import datos from '../content/misterios.json';

const imagenes = import.meta.glob<ImageMetadata>('../assets/misterios/*.jpg', { eager: true, import: 'default' });

function imagen(archivo: string): ImageMetadata {
  const img = imagenes[`../assets/misterios/${archivo}`];
  if (!img) throw new Error(`Falta la imagen del misterio: ${archivo}`);
  return img;
}

export interface Misterio {
  n: number;
  titulo: string;
  cita: string;
  imagen: ImageMetadata;
  lectura: [number, string][];
}

export interface GrupoMisterios {
  id: string;
  titulo: string;
  dias: number[];
  imagen: ImageMetadata;
  misterios: Misterio[];
}

export const GRUPOS: GrupoMisterios[] = Object.entries(datos)
  .filter(([id]) => !id.startsWith('_'))
  .map(([id, g]: [string, any]) => ({
    id,
    titulo: g.titulo,
    dias: g.dias,
    imagen: imagen(g.imagen),
    misterios: g.misterios.map((m: any) => ({ ...m, imagen: imagen(m.imagen) })),
  }));

export const FUENTE_LECTURA: string = (datos as any)._lectura ?? '';

export const ORDINALES = ['Primer', 'Segundo', 'Tercer', 'Cuarto', 'Quinto'];
