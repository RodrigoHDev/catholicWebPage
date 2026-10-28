# Contenido de la app

## Estructura

```
content/
  oraciones/            una oración por archivo (.md)
  secciones.json        secciones de oraciones sueltas y su orden
  misterios.json        los 4 grupos y sus 20 misterios
  devociones/
    rosario.json        flujo completo del Santo Rosario
    coronilla.json      flujo de la Coronilla de la Divina Misericordia
    coronilla-sagrado-corazon.json   Coronilla al Sagrado Corazón (3 partes)
  peticiones.json       vacío por ahora (pendiente)
  carta.md              (opcional) la carta para mamá, en la portada
../content.config.ts    esquema: Astro valida todo al compilar
```

## Oraciones (`oraciones/*.md`)

- El nombre del archivo es el id que usan los flujos (`ave-maria.md` → `"ave-maria"`).
- Campos: `nombre`, `seccion`, `orden`, `tipo`, y opcionales `respuesta`, `nota`, `fuente`.
- Tipos:
  - `oracion`: texto normal; si tiene `respuesta`, se muestra con «R.».
  - `versiculo`: el texto es el versículo «V.» y la `respuesta` es la «R.».
  - `jaculatoria`: frase breve.
  - `letania`: sin cuerpo; las invocaciones van en `bloques`, cada uno con su respuesta común.
- Saltos de línea simples = cambio de verso. Línea vacía = nuevo párrafo.
- Los archivos que empiezan con `_` (como `_plantilla-tov.md`) se ignoran.

## Agregar una oración de TOV

1. Copia `_plantilla-tov.md` con un nombre nuevo, sin `_` al inicio (p. ej. `tov-transfiguracion.md`).
2. Pega el texto y llena `nombre`, `orden` y `fuente` (libro y capítulo).
3. Haz push y se publica sola.

## Flujos (`devociones/*.json`)

- `introduccion` → `peticiones` → `decenas` × `decena` → `cierre`.
- Cada paso referencia una oración por id. Si `oracion` es una lista, cada decena usa la suya (así funcionan las tres peticiones de la Coronilla al Sagrado Corazón). `repetir` indica cuántas veces se reza; `cuenta` dice si va en la cuenta grande o en las pequeñas del anillo.
- `{"anuncio": "misterio"}` muestra el misterio de la decena actual con su imagen.
- `peticiones.pendiente: true`: el lugar está reservado, pero la app aún no muestra nada ahí.

## Misterios

- `dias`: 0 = domingo … 6 = sábado. La app elige el grupo del día automáticamente.
- `imagen` del grupo y de cada misterio: nombre de archivo en `src/assets/misterios/`.
- Las imágenes de grupo (`gozosos.jpg`, etc.) son por ahora copias del primer misterio; se pueden reemplazar con el mismo nombre.

## La carta (`carta.md`)

Se muestra en la portada, debajo de la cruz y el título. Mientras no exista, aparece un lugar reservado.

```
---
titulo: "Querida mamá"
firma: "Con amor, …"
---
Primer párrafo. Un salto de línea simple se respeta.

Una línea vacía empieza otro párrafo.
```

`titulo` y `firma` son opcionales.

## Imágenes

- `src/assets/inicio.png`: la cruz de la portada (PNG con transparencia).
- `src/assets/divina-misericordia.jpg`: Coronilla y sección de la Divina Misericordia.
- `src/assets/virgen-guadalupe.webp`: sección Oraciones a la Virgen.
- `src/assets/santisima-trinidad.webp`: sección Al Espíritu Santo.
- `src/assets/sagrado-corazon.jpg`: sección y Coronilla del Sagrado Corazón.
- `src/assets/tov.png`: logotipo de los TOV, arriba del título de su sección (sobre una placa clara).
- `src/assets/misterios/`: una por misterio y una por grupo.
- `src/assets/pancho/`: las ilustraciones de Pancho (ver `src/DISENO.md`).

Astro las optimiza al compilar (WebP, varios tamaños).
