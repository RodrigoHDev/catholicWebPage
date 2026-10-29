# Un lugar para orar

App de oraciones hecha para mamá: Santo Rosario con los misterios del día, Coronilla de la Divina Misericordia, Coronilla al Sagrado Corazón y oraciones sueltas.

Sitio estático con [Astro](https://astro.build). Requiere Node 22.12 o superior.

```sh
npm install
npm run dev       # http://localhost:4321
npm run build     # genera dist/
npm run preview
```

- Contenido (oraciones, devociones, misterios, carta): `src/content/` — ver `src/content/README.md`.
- Guía de diseño y uso de Pancho: `src/DISENO.md`.
- Íconos: Font Awesome Free (sólidos, licencia CC BY 4.0), dibujados como SVG al compilar.
- Páginas: `/` portada · `/oraciones/…` biblioteca · `/rezar/<devocion>` reproductor guiado.

## Supabase: agregar oraciones, secciones y peticiones

Lo que vive en `src/content/` es la base fija. Desde `/admin` se pueden agregar oraciones, secciones nuevas y peticiones, que se guardan en Supabase y el sitio las suma en el navegador (no hace falta volver a compilar).

- Esquema y permisos: `supabase/migrations/`. La integración de GitHub de Supabase aplica las migraciones al hacer merge a la rama de producción.
- Lectura: oraciones y secciones son públicas. Las peticiones solo las ve quien inició sesión.
- Escritura: solo las personas invitadas, que entran con un enlace por correo.

### Configuración local

```sh
cp .env.example .env   # y llena PUBLIC_SUPABASE_URL y PUBLIC_SUPABASE_ANON_KEY
npm run dev
```

Sin `.env` el sitio funciona igual, solo con el contenido fijo.

### En el panel de Supabase (una vez)

1. **Integrations → GitHub**: repositorio conectado, *Supabase directory* = `supabase`, rama de producción `main` y «Deploy to production» activado.
2. **Authentication → Sign In / Providers**: desactiva «Allow new users to sign up». Email queda activo.
3. **Authentication → Users → Invite user**: invita a cada persona que podrá agregar contenido.
4. **Authentication → URL Configuration**: *Site URL* = la URL del sitio (por ahora `http://localhost:4321`). En *Redirect URLs* agrega `http://localhost:4321/admin` y, cuando se publique, `https://<dominio>/admin`.
5. **Project Settings → API**: copia la URL y la clave anon/publishable al `.env` (y, al publicar, a las variables de entorno del hosting).
