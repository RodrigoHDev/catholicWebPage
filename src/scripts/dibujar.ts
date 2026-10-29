// Marcado de Oracion.astro y ListaOraciones.astro, armado en el navegador para las oraciones de Supabase.
// Siempre con textContent: el texto viene de la base y nunca se interpreta como HTML.
import { parrafos } from '../lib/texto';
import { urlOracion, type OracionDb } from '../lib/supabase';

export function el<K extends keyof HTMLElementTagNameMap>(tag: K, clase?: string, texto?: string) {
  const e = document.createElement(tag);
  if (clase) e.className = clase;
  if (texto !== undefined) e.textContent = texto;
  return e;
}

function marca(texto: string) {
  return el('span', 'marca', texto);
}

export function dibujarOracion(o: OracionDb, nombre: 'h1' | 'h2' = 'h2') {
  const articulo = el('article', 'oracion-bloque');
  const filete = el('span', 'filete');
  filete.setAttribute('aria-hidden', 'true');
  articulo.append(el(nombre, 'oracion-nombre', o.nombre), filete);

  const texto = el('div', 'texto');
  parrafos(o.texto).forEach((p, i) => {
    const parrafo = el('p', 'oracion');
    if (o.tipo === 'versiculo' && i === 0) parrafo.append(marca('V.'), ' ');
    p.forEach((linea, j) => {
      if (j > 0) parrafo.append(el('br'));
      parrafo.append(linea);
    });
    texto.append(parrafo);
  });
  if (o.respuesta) {
    const r = el('p', 'respuesta');
    r.append(marca('R.'), ' ', o.respuesta);
    texto.append(r);
  }
  articulo.append(texto);

  if (o.nota) articulo.append(el('p', 'nota cuerpo', o.nota));
  if (o.fuente) articulo.append(el('p', 'fuente etiqueta', o.fuente));
  return articulo;
}

export function tarjetaOracion(o: OracionDb) {
  const li = el('li');
  const a = el('a', 'tarjeta enlace-tarjeta');
  a.href = urlOracion(o);
  a.append(el('span', 'oracion-nombre', o.nombre), el('span', 'cuerpo suave linea', parrafos(o.texto)[0]?.[0] ?? ''));
  li.append(a);
  return li;
}

// Agrega las oraciones de la base a la lista de ListaOraciones.astro.
export function sumarALista(oraciones: OracionDb[], raiz: ParentNode = document) {
  if (!oraciones.length) return;
  const lista = raiz.querySelector<HTMLElement>('[data-lista-oraciones]');
  const vacio = raiz.querySelector<HTMLElement>('[data-sin-oraciones]');
  if (!lista) return;
  lista.append(...oraciones.map(tarjetaOracion));
  lista.hidden = false;
  if (vacio) vacio.hidden = true;
}
