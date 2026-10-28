// Saltos de línea simples = cambio de verso. Línea vacía = nuevo párrafo.
export function parrafos(texto: string | undefined): string[][] {
  if (!texto) return [];
  return texto
    .trim()
    .split(/\n\s*\n/)
    .map((p) => p.split('\n').map((l) => l.trim()).filter(Boolean))
    .filter((p) => p.length > 0);
}

export function quitarFrontmatter(texto: string): { datos: Record<string, string>; cuerpo: string } {
  const m = texto.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!m) return { datos: {}, cuerpo: texto };
  const datos: Record<string, string> = {};
  for (const linea of m[1].split('\n')) {
    const [k, ...v] = linea.split(':');
    if (k && v.length) datos[k.trim()] = v.join(':').trim().replace(/^["']|["']$/g, '');
  }
  return { datos, cuerpo: texto.slice(m[0].length) };
}
