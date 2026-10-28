import type { Paso } from '../lib/devociones';
import { grupoDeHoy, esDeNoche } from '../lib/hoy';

interface Grupo {
  id: string;
  titulo: string;
  dias: number[];
}

interface Datos {
  id: string;
  decenas: number;
  palabraDecena: string;
  conCuentas: boolean;
  pasos: Paso[];
  grupos: Grupo[];
  pancho: Record<string, { src: string; alt: string }>;
}

interface Progreso {
  fecha: string;
  grupo: string | null;
  i: number;
}

const $ = <T extends Element = HTMLElement>(sel: string, raiz: ParentNode = document) => raiz.querySelector<T>(sel)!;

function fechaDeHoy(): string {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function el<K extends keyof HTMLElementTagNameMap>(tag: K, clase?: string, texto?: string) {
  const e = document.createElement(tag);
  if (clase) e.className = clase;
  if (texto !== undefined) e.textContent = texto;
  return e;
}

export function iniciarReproductor(datos: Datos) {
  const { pasos } = datos;
  const total = pasos.length;
  const clave = `progreso:${datos.id}`;

  const pantallas = {
    inicio: $('[data-pantalla="inicio"]'),
    paso: $('[data-pantalla="paso"]'),
    fin: $('[data-pantalla="fin"]'),
  };
  const contenido = $('[data-contenido]');
  const panchoPaso = $('[data-pancho-paso]');
  const panchoFin = $('[data-pancho-fin]');
  const fase = $('[data-fase]');
  const tituloDevocion = fase.textContent ?? '';
  const progreso = $('[data-progreso]');
  const controles = $('[data-controles]');
  const btnAnterior = $<HTMLButtonElement>('[data-anterior]');
  const btnSiguiente = $<HTMLButtonElement>('[data-siguiente]');
  const btnContinuar = $<HTMLButtonElement>('[data-continuar]');
  const anillo = document.querySelector<HTMLButtonElement>('[data-anillo]');

  let i = -1;
  let anterior: Paso | null = null;
  let cuentaActual = -2;
  let grupo: Grupo | null = grupoDeHoy(datos.grupos) ?? datos.grupos[0] ?? null;

  // ---------- Selector de misterios ----------

  const hoy = new Date().getDay();
  for (const marca of document.querySelectorAll<HTMLElement>('[data-hoy]')) {
    marca.hidden = !marca.dataset.hoy!.split(',').map(Number).includes(hoy);
  }

  function elegirGrupo(id: string) {
    grupo = datos.grupos.find((g) => g.id === id) ?? grupo;
    for (const r of document.querySelectorAll<HTMLInputElement>('[data-selector] input')) r.checked = r.value === id;
    for (const img of document.querySelectorAll<HTMLElement>('[data-grupo-imagen]')) img.hidden = img.dataset.grupoImagen !== id;
  }

  if (grupo) elegirGrupo(grupo.id);
  document.querySelector('[data-selector]')?.addEventListener('change', (e) => {
    elegirGrupo((e.target as HTMLInputElement).value);
  });

  // ---------- Pancho ----------

  function pancho(pose: string, frase: string | null, tam = 88, lado: 'izq' | 'der' = 'der') {
    const info = datos.pancho[pose];
    const fig = el('figure', `pancho pancho-${lado}`);
    fig.style.setProperty('--tam', `${tam}px`);
    const img = el('img');
    img.src = info.src;
    img.alt = info.alt;
    img.width = tam;
    img.height = tam;
    fig.append(img);
    if (frase) fig.append(el('figcaption', 'gag', frase));
    return fig;
  }

  // ---------- Progreso guardado ----------

  function guardar() {
    try {
      if (i >= 0 && i < total) {
        const p: Progreso = { fecha: fechaDeHoy(), grupo: grupo?.id ?? null, i };
        localStorage.setItem(clave, JSON.stringify(p));
      } else if (i >= total) {
        localStorage.removeItem(clave);
      }
    } catch {}
  }

  function leerGuardado(): Progreso | null {
    try {
      const p = JSON.parse(localStorage.getItem(clave) ?? 'null') as Progreso | null;
      if (p && p.fecha === fechaDeHoy() && p.i > 0 && p.i < total) return p;
    } catch {}
    return null;
  }

  // ---------- Pantallas ----------

  function etiquetaFase(p: Paso): string {
    if (p.fase === 'introduccion') return 'Introducción';
    if (p.fase === 'cierre') return 'Cierre';
    return `${datos.palabraDecena} ${p.decena} de ${datos.decenas}`;
  }

  function mostrar(cual: keyof typeof pantallas) {
    for (const [k, v] of Object.entries(pantallas)) v.hidden = k !== cual;
    controles.hidden = cual !== 'paso';
  }

  function esRepeticion(p: Paso, prev: Paso | null) {
    return (
      !!prev &&
      !p.anuncio &&
      !prev.anuncio &&
      p.oracion === prev.oracion &&
      p.fase === prev.fase &&
      p.decena === prev.decena &&
      p.total !== undefined &&
      p.total === prev.total
    );
  }

  function etiquetaRep(p: Paso): string {
    if (p.rep && !p.cuenta) return `${p.rep} de ${p.total}`;
    return '';
  }

  function dibujarContenido(p: Paso) {
    contenido.replaceChildren();
    const caja = el('div', 'entra');

    if (p.grupo) caja.append(el('p', 'subtitulo suave centrado grupo', p.grupo));

    if (p.anuncio && grupo) {
      const plantilla = document.querySelector<HTMLTemplateElement>(
        `template[data-misterio="${grupo.id}-${p.decena ?? 1}"]`,
      );
      if (plantilla) caja.append(plantilla.content.cloneNode(true));
    } else if (p.oracion) {
      const meta = el('p', 'etiqueta centrado meta');
      meta.dataset.rep = '';
      const partes = [etiquetaRep(p), p.opcional ? 'Opcional' : ''].filter(Boolean);
      meta.textContent = partes.join(' · ');
      meta.hidden = partes.length === 0;
      const plantilla = document.querySelector<HTMLTemplateElement>(`template[data-oracion="${p.oracion}"]`);
      caja.append(meta);
      if (plantilla) caja.append(plantilla.content.cloneNode(true));
    }

    contenido.append(caja);
  }

  function dibujarAnillo(p: Paso) {
    if (!anillo) return;
    const visible = datos.conCuentas && p.fase === 'decena' && !p.anuncio;
    anillo.hidden = !visible;
    if (!visible) return;

    const a = p.anillo ?? -1;
    for (const g of anillo.querySelectorAll<SVGGElement>('[data-cuenta]')) {
      const k = Number(g.dataset.cuenta);
      const estado = a === 11 || k < a ? 'rezada' : k === a ? 'actual' : 'pendiente';
      g.dataset.estado = estado;
      g.classList.remove('respira');
      if (estado === 'actual' && cuentaActual !== a) {
        void g.getBoundingClientRect();
        g.classList.add('respira');
      }
    }
    cuentaActual = a;

    const pequena = p.cuenta === 'pequena';
    $('[data-contador]', anillo).textContent = String(pequena ? p.rep : p.decena);
    $('[data-contador-pie]', anillo).textContent = pequena ? `de ${p.total}` : datos.palabraDecena;
  }

  function dibujarPaso(p: Paso) {
    fase.textContent = etiquetaFase(p);

    if (esRepeticion(p, anterior)) {
      const meta = contenido.querySelector<HTMLElement>('[data-rep]');
      if (meta) meta.textContent = [etiquetaRep(p), p.opcional ? 'Opcional' : ''].filter(Boolean).join(' · ');
    } else {
      dibujarContenido(p);
      window.scrollTo({ top: 0 });
    }

    dibujarAnillo(p);
    panchoPaso.replaceChildren(...(p.pancho ? [pancho(p.pancho.pose, p.pancho.frase, 88, (p.decena ?? 0) % 2 ? 'izq' : 'der')] : []));
  }

  function ir(nuevo: number) {
    i = Math.max(-1, Math.min(total, nuevo));
    progreso.style.width = `${Math.max(0, Math.min(1, (i + 1) / total)) * 100}%`;

    if (i < 0) {
      fase.textContent = tituloDevocion;
      anterior = null;
      cuentaActual = -2;
      mostrar('inicio');
      window.scrollTo({ top: 0 });
    } else if (i >= total) {
      fase.textContent = tituloDevocion;
      anterior = null;
      const noche = esDeNoche();
      panchoFin.replaceChildren(
        noche ? pancho('dormido', 'Amén. Pancho ya se durmió.', 120) : pancho('de-pie', '¡Lo lograste, mamá!', 120),
      );
      mostrar('fin');
      window.scrollTo({ top: 0 });
    } else {
      mostrar('paso');
      dibujarPaso(pasos[i]);
      anterior = pasos[i];
    }
    guardar();
  }

  // ---------- Controles ----------

  $('[data-comenzar]').addEventListener('click', () => ir(0));
  $('[data-otra-vez]').addEventListener('click', () => ir(-1));
  btnSiguiente.addEventListener('click', () => ir(i + 1));
  btnAnterior.addEventListener('click', () => ir(i - 1));
  anillo?.addEventListener('click', () => ir(i + 1));

  document.addEventListener('keydown', (e) => {
    if (pantallas.paso.hidden || e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.key === 'ArrowRight') ir(i + 1);
    else if (e.key === 'ArrowLeft') ir(i - 1);
  });

  const guardado = leerGuardado();
  if (guardado) {
    btnContinuar.hidden = false;
    btnContinuar.addEventListener('click', () => {
      if (guardado.grupo) elegirGrupo(guardado.grupo);
      ir(guardado.i);
    });
  }

  mostrar('inicio');
}
