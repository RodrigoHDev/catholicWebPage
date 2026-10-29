// Contenido que se agrega desde /admin y vive en Supabase. Se lee en el navegador y se suma a src/content/.
// Sin PUBLIC_SUPABASE_URL / PUBLIC_SUPABASE_ANON_KEY el sitio funciona igual, solo con el contenido fijo.
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export interface CategoriaDb {
  id: string;
  titulo: string;
  descripcion: string;
  orden: number;
}

export interface OracionDb {
  id: string;
  nombre: string;
  seccion: string | null;
  categoria: string | null;
  orden: number;
  tipo: 'oracion' | 'versiculo' | 'jaculatoria';
  texto: string;
  respuesta: string | null;
  nota: string | null;
  fuente: string | null;
}

export interface PeticionDb {
  id: string;
  texto: string;
  activa: boolean;
}

const url = import.meta.env.PUBLIC_SUPABASE_URL;
const clave = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

export const supabase: SupabaseClient | null = url && clave ? createClient(url, clave) : null;

// Dónde vive una oración de la base: su sección fija o su categoría nueva.
export const grupoDe = (o: OracionDb) => (o.seccion ?? o.categoria)!;

export const urlOracion = (o: Pick<OracionDb, 'id'>) => `/oraciones/ver?id=${encodeURIComponent(o.id)}`;
export const urlCategoria = (c: Pick<CategoriaDb, 'id'>) => `/oraciones/categoria?id=${encodeURIComponent(c.id)}`;

export async function categorias(): Promise<CategoriaDb[]> {
  if (!supabase) return [];
  const { data, error } = await supabase.from('categorias').select('*').order('orden').order('titulo');
  if (error) console.error(error);
  return data ?? [];
}

export async function categoria(id: string): Promise<CategoriaDb | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.from('categorias').select('*').eq('id', id).maybeSingle();
  if (error) console.error(error);
  return data;
}

// Oraciones de una sección fija o de una categoría nueva.
export async function oracionesDelGrupo(grupo: string): Promise<OracionDb[]> {
  if (!supabase || !esSlug(grupo)) return [];
  const { data, error } = await supabase
    .from('oraciones')
    .select('*')
    .or(`seccion.eq.${grupo},categoria.eq.${grupo}`)
    .order('orden')
    .order('nombre');
  if (error) console.error(error);
  return data ?? [];
}

export async function todasLasOraciones(): Promise<OracionDb[]> {
  if (!supabase) return [];
  const { data, error } = await supabase.from('oraciones').select('*').order('orden').order('nombre');
  if (error) console.error(error);
  return data ?? [];
}

export async function oracion(id: string): Promise<OracionDb | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.from('oraciones').select('*').eq('id', id).maybeSingle();
  if (error) console.error(error);
  return data;
}

// Solo devuelve algo con sesión iniciada (RLS).
export async function peticiones(soloActivas = true): Promise<PeticionDb[]> {
  if (!supabase) return [];
  let q = supabase.from('peticiones').select('*').order('creado_en');
  if (soloActivas) q = q.eq('activa', true);
  const { data, error } = await q;
  if (error) console.error(error);
  return data ?? [];
}

export const esSlug = (texto: string) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(texto);

export function slug(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
