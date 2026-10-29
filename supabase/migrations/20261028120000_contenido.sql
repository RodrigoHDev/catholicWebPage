-- Contenido que se agrega desde la app (/admin). Lo que vive en src/content/ sigue siendo la base fija;
-- esto se suma en el navegador.
--
-- Lectura: categorías y oraciones son públicas; las peticiones solo las ve quien inició sesión.
-- Escritura: solo usuarios con sesión. Los registros abiertos están desactivados: se invita a cada persona
-- desde el panel de Supabase (Authentication → Users → Invite user).

-- Secciones fijas de src/content/secciones.json y rutas de /oraciones que una categoría nueva no puede usar.
create function public.es_seccion_fija(id text) returns boolean
language sql immutable set search_path = '' as $$
  select id in ('fundamentales', 'marianas', 'espiritu-santo', 'misericordia', 'sagrado-corazon', 'tov')
$$;

create table public.categorias (
  id text primary key
    check (id ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and not public.es_seccion_fija(id) and id not in ('ver', 'categoria')),
  titulo text not null check (length(btrim(titulo)) between 1 and 80),
  descripcion text not null default '' check (length(descripcion) <= 200),
  orden integer not null default 100,
  creado_en timestamptz not null default now()
);

create table public.oraciones (
  id uuid primary key default gen_random_uuid(),
  nombre text not null check (length(btrim(nombre)) between 1 and 120),
  -- Va en una sección fija o en una categoría nueva, nunca en ambas.
  seccion text check (public.es_seccion_fija(seccion)),
  categoria text references public.categorias (id) on update cascade on delete cascade,
  orden integer not null default 100,
  tipo text not null default 'oracion' check (tipo in ('oracion', 'versiculo', 'jaculatoria')),
  -- Saltos de línea simples = cambio de verso. Línea vacía = nuevo párrafo.
  texto text not null check (length(btrim(texto)) between 1 and 20000),
  respuesta text,
  nota text,
  fuente text,
  creado_en timestamptz not null default now(),
  check ((seccion is null) <> (categoria is null))
);

create index oraciones_seccion_idx on public.oraciones (seccion);
create index oraciones_categoria_idx on public.oraciones (categoria);

create table public.peticiones (
  id uuid primary key default gen_random_uuid(),
  texto text not null check (length(btrim(texto)) between 1 and 500),
  activa boolean not null default true,
  creado_en timestamptz not null default now()
);

alter table public.categorias enable row level security;
alter table public.oraciones enable row level security;
alter table public.peticiones enable row level security;

grant select on public.categorias, public.oraciones to anon, authenticated;
grant select, insert, update, delete on public.categorias, public.oraciones, public.peticiones to authenticated;

create policy "Todos leen las categorías" on public.categorias for select to anon, authenticated using (true);
create policy "Con sesión se agregan categorías" on public.categorias for insert to authenticated with check (true);
create policy "Con sesión se editan categorías" on public.categorias for update to authenticated using (true) with check (true);
create policy "Con sesión se borran categorías" on public.categorias for delete to authenticated using (true);

create policy "Todos leen las oraciones" on public.oraciones for select to anon, authenticated using (true);
create policy "Con sesión se agregan oraciones" on public.oraciones for insert to authenticated with check (true);
create policy "Con sesión se editan oraciones" on public.oraciones for update to authenticated using (true) with check (true);
create policy "Con sesión se borran oraciones" on public.oraciones for delete to authenticated using (true);

create policy "Con sesión se leen las peticiones" on public.peticiones for select to authenticated using (true);
create policy "Con sesión se agregan peticiones" on public.peticiones for insert to authenticated with check (true);
create policy "Con sesión se editan peticiones" on public.peticiones for update to authenticated using (true) with check (true);
create policy "Con sesión se borran peticiones" on public.peticiones for delete to authenticated using (true);
