import { defineCollection } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';
import { POSES } from './lib/pancho-poses';

const invocacion = z.union([z.string(), z.tuple([z.string(), z.string()])]);

const oraciones = defineCollection({
  // Los archivos que empiezan con "_" (plantillas) se ignoran.
  loader: glob({ pattern: ['**/*.md', '!**/_*.md'], base: './src/content/oraciones' }),
  schema: z.object({
    nombre: z.string(),
    seccion: z.enum(['fundamentales', 'marianas', 'espiritu-santo', 'misericordia', 'sagrado-corazon', 'tov']),
    orden: z.number().int(),
    tipo: z.enum(['oracion', 'versiculo', 'jaculatoria', 'letania']).default('oracion'),
    respuesta: z.string().optional(),
    nota: z.string().optional(),
    fuente: z.string().optional(),
    bloques: z.array(z.object({
      respuesta: z.string().nullable(),
      invocaciones: z.array(invocacion),
    })).optional(),
  }),
});

const secciones = defineCollection({
  loader: file('./src/content/secciones.json'),
  schema: z.object({
    titulo: z.string(),
    // Nombre breve para la barra de navegación.
    corto: z.string(),
    descripcion: z.string(),
    orden: z.number().int(),
    pancho: z.enum(POSES),
    // Frase de Pancho en la sección; si falta, la de su pose.
    frase: z.string().optional(),
  }),
});

const paso = z.object({
  // Una lista = una oración distinta por decena (la 1.ª en la primera, etc.).
  oracion: z.union([z.string(), z.array(z.string())]),
  repetir: z.number().int().optional(),
  cuenta: z.enum(['grande', 'pequena']).optional(),
  opcional: z.boolean().optional(),
});

const devociones = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/devociones' }),
  schema: z.object({
    titulo: z.string(),
    misterios: z.enum(['automatico']).nullable(),
    introduccion: z.array(paso),
    peticiones: z.object({ pendiente: z.boolean(), nota: z.string() }),
    decenas: z.number().int(),
    decena: z.array(z.union([paso, z.object({ anuncio: z.literal('misterio') })])),
    cierre: z.array(z.union([paso, z.object({ titulo: z.string(), pasos: z.array(paso) })])),
  }),
});

export const collections = { oraciones, secciones, devociones };
