# Un lugar para orar — Guía de diseño

Una app de oraciones hecha para mamá (el Santo Rosario es una de sus devociones, no la principal): crema y café, mármol y madera, tipografía de libro de misa y, de vez en cuando, Pancho. Debe sentirse **serena, legible y cálida**; lo divertido aparece en los márgenes, nunca dentro de una oración.

## Tono y contenido

- Escribe en español de México, de tú y con cariño: «Toca para continuar», «Hoy te toca los Misterios Gozosos».
- Las oraciones se transcriben completas y sin adornos, con su puntuación tradicional. Nunca se resumen ni se parafrasean.
- La segunda parte o respuesta va precedida de «R.» en `tinta-suave` y estilo `respuesta`.
- Mayúsculas solo en `etiqueta` («DECENA 3 DE 5», «HOY»). Títulos en tipo oración: «Misterios gozosos» se escribe «Misterios Gozosos» solo por ser nombre propio de la devoción.
- Sin emoji. Los íconos son de Font Awesome Free, sólidos y de un solo color (`components/Icono.astro`, lista en `lib/iconos.ts`). Los gestos divertidos los hace Pancho con una frase corta en estilo `gag`, una por pantalla como máximo, y nunca a mitad de un misterio: al iniciar, al completar una decena o al terminar.

## Color

- El Día es crema cálido, un poco amarillento (café claro); el Noche se queda como está.
- `acento` (azul mariano) es el tercer color, por contraste: etiquetas, ornamentos, filete superior de las tarjetas de devoción, barra de progreso. Pocas veces y en piezas pequeñas.
- `fondo` es el suelo de toda pantalla; `crema` y `marmol` son las capas encima. Nunca más de dos capas apiladas.
- Texto principal en `tinta`; secundario en `tinta-suave`. Ambos cumplen 4.5:1 sobre `fondo`, `crema` y `marmol` en Día y Noche.
- `nogal` es la madera: botón principal (texto `en-nogal`), cuentas rezadas, enlaces. Como texto, solo sobre `fondo` o `crema`.
- `dorado` es un acento litúrgico escaso: la cuenta actual, un filete bajo el título. Nunca texto corrido ni fondos grandes.
- `veta` solo dibuja las vetas del mármol y las líneas finas. Nunca texto.
- `cristo` se reserva para marcos o filetes junto a la imagen del Cristo de la portada. La imagen misma se usa tal cual se entrega, nunca redibujada.
- Tema Noche: pensado para el rosario de la noche. Mismos nombres, mismos usos.

## Tipografía

- Títulos en *Cormorant Garamond* (`titulos`): `portada`, `titulo`, `oracion-nombre`, `subtitulo`, `contador`.
- Todo lo que se reza en *Lora* (`texto`): `oracion` a 20px con interlineado amplio; nunca más pequeño.
- Ambas fuentes se cargan de Google Fonts: `Cormorant Garamond` 500, 600 e itálica 500; `Lora` 400, 600 e itálica 400.
- Medida de línea: máximo ~34 caracteres por línea en celular (`oracion`), centrada.

## Composición

- Diseños **centrados**: título, oración y anillo de cuentas sobre el eje central, márgenes de `esp-4`.
- Imágenes (`Dupla`): en celular, la imagen va **centrada** entre el encabezado y el resto. En web (≥900px), la imagen ocupa una columna y el texto o los botones la otra; alterna el lado de una sección a otra.
- Navegación: en web, las secciones de oraciones van en una barra horizontal en forma de píldora bajo la cabecera. En celular, menú lateral oculto con botón de hamburguesa; el interruptor Día / Noche (píldora con los íconos de sol y luna) siempre queda arriba a la derecha.
- Solo imágenes religiosas aprobadas por la Iglesia: el Cristo de la portada y la iconografía de cada misterio.
- Tarjetas: `crema`, `radio-md`, relleno `esp-5`, `sombra-tarjeta`, con el texto **centrado** dentro. Paneles de mármol: `marmol` con dos o tres vetas en `veta`, `radio-lg`.
- Botones con forma de cuenta: `radio-pill`. Principal en `nogal`; secundario como texto `nogal` sin relleno.
- Foco de teclado: anillo sólido de 2px en `foco`, separado 2px, en toda superficie.
- Movimiento: transiciones de 200–300ms con desvanecido; la cuenta actual «respira» una vez al avanzar. Nada rebota.

## El rosario

- El anillo de cuentas (`AnilloDeCuentas`) es la pieza central: diez cuentas y la del Padre Nuestro. Rezada = `cuenta-rezada`, actual = `cuenta-actual` con halo, pendiente = contorno `cuenta-pendiente`.
- Se avanza tocando el anillo o el botón «Siguiente»; siempre hay «Anterior». El número al centro usa `contador`.
- El misterio del día se elige solo (`SelectorMisterios`): Gozosos lunes y sábado, Dolorosos martes y viernes, Gloriosos miércoles y domingo, Luminosos jueves. Se puede cambiar.

## Tokens

### Color

| Token | Día | Noche | Uso |
|---|---|---|---|
| `fondo` | `#F3E6CC` | `#1A1512` | Fondo de toda pantalla (marfil de día, madera oscura de noche). |
| `crema` | `#EAD8B8` | `#241C17` | Tarjetas de oración y paneles sobre `fondo`. |
| `marmol` | `#E0CBA6` | `#2E251F` | Superficie de mármol: tarjeta destacada, selector activo, cabeceras de sección. |
| `veta` | `#C4A57A` | `#4D4036` | Vetas del mármol y líneas finas decorativas (hairlines). Nunca para texto. |
| `tinta` | `#3B2A20` | `#F3EADC` | Texto principal (oraciones, títulos) sobre `fondo`, `crema` y `marmol`. |
| `tinta-suave` | `#5E4636` | `#C7B6A2` | Texto secundario: etiquetas, días, notas, respuestas «R.» sobre `fondo`, `crema` y `marmol`. |
| `nogal` | `#6B4A33` | `#C9A07B` | Madera: botón principal, cuentas ya rezadas, enlaces y acentos. Como texto, solo sobre `fondo` y `crema`. |
| `en-nogal` | `#F3E6CC` | `#1A1512` | Texto e íconos sobre un relleno `nogal` (botón principal). |
| `acento` | `#2D4A73` | `#9FBCE3` | Tercer color, azul mariano: etiquetas, ornamentos, foco, progreso. |
| `dorado` | `#8E6A35` | `#D6B47C` | Acento litúrgico mínimo: cuenta actual, anillo de progreso, filetes. No para texto corrido. |
| `cuenta-rezada` | `{nogal}` | `{nogal}` | Cuenta del rosario ya rezada (relleno). |
| `cuenta-actual` | `{dorado}` | `{dorado}` | Cuenta que se está rezando (relleno + halo). |
| `cuenta-pendiente` | `#8A7358` | `#857467` | Contorno de las cuentas aún por rezar (≥3:1 sobre `fondo`). |
| `cristo` | `#1A1512` | `#F3EADC` | Marcos o filetes junto a la imagen del Cristo de la portada (la imagen se usa tal cual). |
| `foco` | `#2D4A73` | `#D6B47C` | Anillo de foco de teclado, 2px sólido, en toda superficie. |

### Tipografía

Familias: `titulos` = Cormorant Garamond · `texto` = Lora (Google Fonts).

| Estilo | Familia | Tamaño / interlínea · peso | Uso |
|---|---|---|---|
| `portada` | Títulos | 48px / 50px · 500 | Título de la portada y de la carta. Uno por pantalla. |
| `titulo` | Títulos | 34px / 40px · 500 | Título de sección o del misterio en curso. |
| `oracion-nombre` | Títulos | 26px / 32px · 600 | Nombre de la oración encima de su texto. |
| `subtitulo` | Títulos | 22px / 30px · 500 itálica | Enunciado del misterio y frases breves. |
| `contador` | Títulos | 64px / 64px · 500 | Número grande al centro del anillo de cuentas. |
| `oracion` | Texto | 20px / 34px · 400 | Texto de toda oración. Nunca más pequeño: se lee con calma, en el celular. |
| `respuesta` | Texto | 20px / 34px · 400 itálica | Segunda parte o respuesta, en `tinta-suave`, con la marca «R.». |
| `cuerpo` | Texto | 17px / 28px · 400 | Carta, explicaciones y textos de TOV. |
| `etiqueta` | Texto | 13px / 18px · 600 | Etiquetas en mayúsculas: progreso, día, «Hoy». En `tinta-suave`. |
| `gag` | Texto | 15px / 22px · 400 itálica | Frases de Pancho junto a su ilustración. Una por pantalla, como máximo. |

### Espaciado y radios

Espaciado: `esp-1` 4px · `esp-2` 8px · `esp-3` 12px · `esp-4` 16px · `esp-5` 24px · `esp-6` 32px · `esp-7` 48px · `esp-8` 72px

Radios: `radio-sm` 6px · `radio-md` 14px · `radio-lg` 24px · `radio-pill` 999px

Sombra: `sombra-tarjeta` — muy suave; la profundidad la da el mármol.

## Pancho: las ilustraciones

Archivos en `assets/pancho/` (SVG, 160×160, colores fijos dentro del archivo). La separación entre cabeza y cuerpo es un corte transparente, así que funcionan sobre cualquier fondo de la app, en Día y Noche. Frases y descripciones en `lib/pancho.ts`.

| Pose | Dónde aparece | Frase |
|---|---|---|
| `sentado` | Inicio de cada devoción; al pie de «Devociones» en la portada; sección Fundamentales | «Pancho te acompaña hoy.» |
| `zarpazo` | Al completar la 1.ª y 5.ª decena | «¡Decena completa! Pancho aprueba.» |
| `estambre` | Al completar la 2.ª decena; sección Marianas | «Otra decena lista. Pancho sigue contigo.» |
| `lamiendose` | Al completar la 3.ª decena | «Pancho espera con paciencia la siguiente.» |
| `saltando` | Al completar la 4.ª decena | «Vamos al siguiente.» |
| `caminando` | Primer paso del cierre | «Ya casi llegamos.» |
| `dormido` | Final, de noche (19:00–5:00) | «Amén. Pancho ya se durmió.» |
| `de-pie` | Final, de día (120px, celebración) | «¡Lo lograste, mamá!» |
| `colgado` | Carta pendiente, secciones vacías | «Aquí no hay nada… todavía.» |
| `lamiendose` | Al pie de la carta | «Pancho también te quiere.» |
| `en-el-borde` | Sentado sobre la tarjeta «Hoy»; sección Sagrado Corazón | sin frase |
| `caja` | Al pie de la lista de oraciones | «Todas las oraciones, bien guardadas.» |
| `estirandose` | Sección Espíritu Santo | «Buenos días, mamá.» |
| `mirando-arriba` | Sección Divina Misericordia; oraciones sueltas | «Pancho también mira al cielo.» |
| `pan` | Sección TOV | «Pancho se quedó quietecito.» |
| `acostado`, `asomado-abajo` | Oraciones sueltas (elegido por id) | «Pancho escucha en silencio.» |
| `de-espaldas` | Página no encontrada | sin frase |

Colores: naranja `#E39250`, blanco `#FFFDF8` (pecho y patitas), líneas de movimiento `#CBBFAE`, barra `#7A5A43`.

Reglas:
- Estilo geométrico y redondeado, sin rostro.
- 64–120px de alto; 120px solo en celebraciones.
- En una esquina inferior, al pie de un bloque o sentado en el borde de una tarjeta; nunca centrado sobre una oración.
- Una aparición por bloque y bien separadas: nunca dos Panchos a menos de un bloque de contenido de distancia. Puede estar junto a imágenes religiosas.
- Nunca a mitad de una decena: solo al iniciar, al terminar una decena, al empezar el cierre o al terminar.
- Animación opcional de 300ms (aparecer); nunca en bucle.
- Frases breves, tiernas y respetuosas; nunca bromean sobre el contenido de una oración.
