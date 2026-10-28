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
