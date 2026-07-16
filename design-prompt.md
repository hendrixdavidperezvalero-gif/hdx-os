# Mega prompt — one-shot del HDX OS en Claude Design (Fable)

> Pégalo entero en Claude Design con el modelo **Fable**. Es autocontenido (no necesita el vault). Luego se pule en Claude Code.

---

Eres director de diseño de producto senior. Diseña, **en un solo tiro**, la interfaz completa de una PWA móvil llamada **"HDX OS"**. Entrega **todas las pantallas** en **claro y oscuro**, más una **hoja de componentes**. Copys en **español**.

## 1. Qué es la app
HDX OS es el *command center personal* de una persona (estudiante de Derecho + dueño de una agencia). Es **"tu vida en texto plano"**: una sola pantalla que abre **cada mañana**. Sus planes ya están escritos en su cuaderno (Obsidian); la app les pone cara y le dice **qué toca hoy**. **No** es un tablero de métricas ni un dashboard de vigilancia: es una **página que se escribe** — un ritual matutino **calmado**.

## 2. Estética (LO MÁS IMPORTANTE — respétalo al pie de la letra)
- Es **"papel"**, no "dashboard tecnológico". Fondo de papel **frío** (NO crema, NO blanco puro), tinta casi negra.
- La **tipografía monoespaciada es la identidad** (representa el markdown/texto plano): úsala para etiquetas, datos, números y el "chrome". Una **sans** limpia para títulos y texto de UI.
- **UN SOLO acento: rojo tinta** (como el bolígrafo con el que marcas una hoja). Nada más de color, salvo semánticos (verde=hecho, ámbar=alerta).
- **Calma y contención.** Mucho aire, bordes finos (1px), **una** sombra sutil, **sin glow**.
- **PROHIBIDO** (es "AI slop"): dark-neón, gradientes morados, glow, gauges circulares tipo velocímetro, sparklines decorativos, mascotas/avatares 3D, degradados llamativos, emoji como marcadores de sección.

## 3. Paleta exacta (claro / oscuro)
- Papel/fondo: `#f8f9f6` / `#181b17`
- Tarjeta: `#ffffff` / `#20241e`
- Fondo suave: `#eceee9` / `#262b23`
- Tinta: `#181b18` / `#e9ebe6`  ·  Tinta suave: `#535a51` / `#a6ada2`  ·  Tinta tenue: `#868d83` / `#767d72`
- Borde: `#e4e7e0` / `#2c312a`  ·  Borde fuerte: `#c2c7bd` / `#3d443b`
- **Acento rojo tinta:** `#a82c29` / `#e2564f`
- Verde (hecho): `#5c7a58` / `#7fa578`  ·  Ámbar (alerta): `#b07d16` / `#e6b64c`

## 4. Tipografía
- **Mono:** JetBrains Mono (o Geist Mono). Etiquetas en MAYÚSCULAS con tracking amplio; números en peso 700.
- **Sans:** Inter (o Geist). Títulos peso 700, tracking ligeramente negativo.

## 5. Pantallas a diseñar (mobile-first, ~390px de ancho)

### A) HOME — la pantalla principal (todo lo demás se abre encima)
- Barra superior: `hdx_os▍` (con el guion final en rojo) + fecha ("mar · 14 jul").
- Saludo: **"Buenos días, Hendrix"** + subtítulo: "2 planes vivos · racha de ritual: 6 días".
- Acciones rápidas (fila de botones): **[+ Nuevo día]** (primario, relleno rojo) · [+ idea] · [+ persona].
- Tarjeta **"Make Time"**: tres campos escritos a diario — **Highlight** (lleno: "Lista de 20 prospectos"), **Gratitud** (placeholder "escribir…"), **Let go** (placeholder). Debajo, **selector de ánimo 1-10** (10 puntos, 7 llenos en rojo).
- Etiqueta "Hoy · paso actual de cada plan" + **grid de 2 tiles**:
  - Tile 1: "Conseguir 1 cliente", barra de avance **2/7**, "→ Lista de 20 prospectos", etiqueta "agencia".
  - Tile 2 (**estado estancado**, borde y barra en **ámbar**): "Aprobar el semestre", "estancado 11 d", "→ Síntesis del caso Y".
- **Hábitos con racha**: "Gym" y "Leer", cada uno con 7 cuadritos (algunos verdes = hechos).
- **Tira del mentor**: un chip/tira sutil: "Pregúntale a tu vida — Claude Code lee el vault".
- **Áreas**: 4 chips: Estudio · Personal · Agencia · Sistema.

### B) PLAN (se abre al tocar un tile)
- Barra: `‹ Home` + "Plan".
- Título "Conseguir 1 cliente" + etiqueta "hdx.agency · plan".
- Barra de avance **2/7**.
- **Lista de 7 pasos con casillas**: 2 hechos (verde, tachados), 1 **actual** (borde rojo, negrita: "3. Lista de 20 prospectos"), 4 pendientes.
- Nota al pie discreta: "Este plan vive en tu cuaderno. Toca para marcarlo hecho."

### C) CAPTURA (se abre con "+ idea")
- Barra: `‹ Home` + "Captura rápida".
- Campo grande de texto: placeholder "¿Qué tienes en mente?".
- Fila de micrófono: botón de mic **rojo** + onda de audio + "dictando… (mic del teclado)".
- Chips de tipo: **idea** (seleccionado) · tarea · persona · video.
- Botón **"Guardar en el inbox"** (tinta oscura, NO rojo).

### D) ÁREA (se abre al tocar un chip, ej. "Estudio")
- Barra: `‹ Home` + "Estudio".
- Tarjetas de sub-áreas: **"Universidad"** (con "⚠ parcial en 4 días"), **"MUN"** (con "próximo comité: hoy 17:00").
- "Notas recientes del área": 2 ítems con hora.

## 6. Hoja de componentes (pantalla aparte)
Muestra cada pieza aislada con su nombre: barra superior · saludo · botón primario/secundario · etiqueta de sección · tarjeta Make Time · selector de ánimo · tile de plan (normal + estancado) · barra de progreso · fila de paso (hecho/actual/pendiente) · racha de hábito · tira de mentor · chips de área · campo de captura + mic · chips de tipo · control segmentado · botón de guardar · nota/callout · estado vacío ("Aún no tienes planes — escribe uno en tu cuaderno").

## 7. Interacción / flujo (refléjalo en el layout)
- La **mañana es guiada y lineal** (Nuevo día → escribir los 3 campos → ver el Hoy). El resto del día es navegación libre desde el Home.
- **Home es el centro**; Plan/Captura/Área se abren encima y "back" siempre vuelve. Máximo 2 toques de profundidad.
- **Color con significado**: verde=hecho, rojo=paso actual/acento/alerta suave, ámbar=estancado/deadline cercano, tinta suave=pendiente.

## 8. Reglas duras
- Máximo **UN** botón primario por pantalla.
- Objetivos táctiles ≥ 44px; lo importante en la **mitad inferior** (alcance del pulgar).
- Gráficas/sparklines **solo** donde hay número real (ánimo, rachas). En ningún otro lado.
- Diseña **claro Y oscuro** de cada pantalla.
- Radios: 8px botones, 11px tarjetas, 28px hojas/sheets. Una sola sombra sutil.

## 9. Entregable
Las 4 pantallas (Home, Plan, Captura, Área) en **claro y oscuro** + la hoja de componentes. Nombra cada pantalla. Prioriza que se sienta **una hoja de papel calmada**, no un dashboard.
