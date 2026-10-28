import { parrafos, quitarFrontmatter } from './texto';

// La carta es opcional: src/content/carta.md (o .txt). Mientras no exista,
// la portada muestra un lugar reservado.
const archivos = import.meta.glob<string>('../content/carta.{md,txt}', {
  eager: true,
  query: '?raw',
  import: 'default',
});

const crudo = Object.values(archivos)[0];

export const carta = crudo
  ? (() => {
      const { datos, cuerpo } = quitarFrontmatter(crudo);
      return { titulo: datos.titulo, firma: datos.firma, parrafos: parrafos(cuerpo) };
    })()
  : null;
