import type { CollectionEntry } from 'astro:content';
import type { Pose } from './pancho-poses';

type Devocion = CollectionEntry<'devociones'>['data'];
type PasoJson = { oracion: string | string[]; repetir?: number; cuenta?: 'grande' | 'pequena'; opcional?: boolean };

// Un paso del reproductor: una pantalla.
export interface Paso {
  fase: 'introduccion' | 'peticiones' | 'decena' | 'cierre';
  oracion?: string;
  anuncio?: true;
  // Pantalla de peticiones: la nota de la devoción; la lista llega en el navegador.
  peticiones?: { nota: string };
  decena?: number; // 1, 2, 3…
  rep?: number; // 1…total cuando la oración se repite
  total?: number;
  cuenta?: 'grande' | 'pequena';
  // Posición en el anillo: -1 sin empezar, 0 cuenta grande, 1–10 cuentas pequeñas, 11 decena completa.
  anillo?: number;
  grupo?: string; // título de un bloque del cierre
  opcional?: true;
  pancho?: { pose: Pose; frase: string };
}

// Pancho celebra al terminar cada decena; cambia de pose para no repetirse.
const CELEBRACIONES: { pose: Pose; frase: string }[] = [
  { pose: 'zarpazo', frase: '¡Decena completa! Pancho aprueba.' },
  { pose: 'estambre', frase: 'Otra decena lista. Pancho sigue contigo.' },
  { pose: 'lamiendose', frase: 'Pancho espera con paciencia la siguiente.' },
  { pose: 'saltando', frase: 'Vamos al siguiente.' },
  { pose: 'zarpazo', frase: '¡La última decena! Pancho aprueba.' },
];

function expandir(p: PasoJson, base: Omit<Paso, 'oracion'>, decena = 1): Paso[] {
  const oracion = Array.isArray(p.oracion) ? p.oracion[(decena - 1) % p.oracion.length] : p.oracion;
  const total = p.repetir ?? 1;
  return Array.from({ length: total }, (_, i) => ({
    ...base,
    oracion,
    ...(total > 1 ? { rep: i + 1, total } : {}),
    ...(p.cuenta ? { cuenta: p.cuenta } : {}),
    ...(p.opcional ? { opcional: true as const } : {}),
  }));
}

export function usaCuentas(d: Devocion): boolean {
  return d.decena.some((p) => 'cuenta' in p && p.cuenta);
}

export function pasosDe(d: Devocion): Paso[] {
  const pasos: Paso[] = [];

  for (const p of d.introduccion) pasos.push(...expandir(p, { fase: 'introduccion' }));

  // pendiente: el lugar está reservado, pero todavía no se muestra.
  if (!d.peticiones.pendiente) pasos.push({ fase: 'peticiones', peticiones: { nota: d.peticiones.nota } });

  for (let n = 1; n <= d.decenas; n++) {
    const decena: Paso[] = [];
    let anillo = -1;
    for (const p of d.decena) {
      if ('anuncio' in p) {
        decena.push({ fase: 'decena', decena: n, anuncio: true, anillo });
        continue;
      }
      for (const paso of expandir(p, { fase: 'decena', decena: n }, n)) {
        if (paso.cuenta === 'grande') anillo = 0;
        else if (paso.cuenta === 'pequena') anillo = paso.rep ?? 1;
        else if (anillo >= 10) anillo = 11;
        decena.push({ ...paso, anillo });
      }
    }
    const ultimo = decena[decena.length - 1];
    ultimo.pancho = CELEBRACIONES[(n - 1) % CELEBRACIONES.length];
    pasos.push(...decena);
  }

  let primeroDelCierre = true;
  for (const p of d.cierre) {
    const nuevos =
      'pasos' in p
        ? p.pasos.flatMap((q) => expandir(q, { fase: 'cierre', grupo: p.titulo }))
        : expandir(p, { fase: 'cierre' });
    if (primeroDelCierre && nuevos.length) {
      nuevos[0].pancho = { pose: 'caminando', frase: 'Ya casi llegamos.' };
      primeroDelCierre = false;
    }
    pasos.push(...nuevos);
  }

  return pasos;
}

export function oracionesDe(pasos: Paso[]): string[] {
  return [...new Set(pasos.flatMap((p) => (p.oracion ? [p.oracion] : [])))];
}

// Orden y descripción breve de cada devoción en la portada.
export const PRESENTACION: Record<string, { orden: number; descripcion: string }> = {
  rosario: { orden: 1, descripcion: 'Con los misterios del día y su imagen.' },
  coronilla: { orden: 2, descripcion: 'Por su dolorosa Pasión, ten misericordia de nosotros.' },
  'coronilla-sagrado-corazon': { orden: 3, descripcion: 'La coronilla que rezaba el Padre Pío, en tres partes.' },
};
