# HDX OS — Design System (`design.md`)

> Fuente de verdad **visual** para construir la app. Estética: **papel, no dark-neón.** Mobile-first PWA.
> El "por qué" de cada decisión vive en el vault: `wiki/HENDRIX-OS/hendrix-os-vision-y-funciones.md`.
> El flujo y cómo funciona: ver `ux-flow.md` (al lado de este archivo).

---

## Filosofía

- Es **"papel"**, no "dashboard tecnológico". Fondo de papel frío (NO crema, NO blanco puro), tinta casi negra.
- La **tipografía monoespaciada es la identidad** — representa el markdown / texto plano. Se usa para etiquetas, datos, números y el "chrome". Una sans limpia para títulos y texto de UI.
- **Un solo color de acento: rojo tinta** (el bolígrafo con el que marcas una hoja). Nada más de color, salvo los semánticos.
- **Calma y contención.** Mucho aire, bordes finos (1px), **una** sombra sutil, sin glow.
- El teléfono muestra **una hoja, no una pantalla**.

**Prohibido (es "AI slop"):** dark-neón, gradientes morados, glow, gauges tipo velocímetro, sparklines decorativos, mascotas/avatares 3D, emoji como marcadores de sección.

## Stack recomendado (para construir)

`Tailwind CSS` (base) · `shadcn/ui` (componentes, re-pintados con estos tokens) · `next/font` (una mono real: JetBrains Mono / Geist Mono) · `Motion` (framer-motion) para transiciones · `Lucide` (íconos). Editor de tema para pulir: `tweakcn`.

---

## Color (tokens) — claro / oscuro

| Token | Claro | Oscuro | Uso |
|---|---|---|---|
| `--bg` (papel) | `#f8f9f6` | `#181b17` | fondo de pantalla |
| `--surface` | `#ffffff` | `#20241e` | tarjetas |
| `--surface-2` | `#eceee9` | `#262b23` | fondos suaves, chips |
| `--ink` | `#181b18` | `#e9ebe6` | texto principal |
| `--ink-soft` | `#535a51` | `#a6ada2` | texto secundario |
| `--ink-faint` | `#868d83` | `#767d72` | texto tenue, pendientes |
| `--border` | `#e4e7e0` | `#2c312a` | bordes de tarjeta |
| `--border-strong` | `#c2c7bd` | `#3d443b` | bordes marcados, separadores |
| `--accent` (rojo tinta) | `#a82c29` | `#e2564f` | acción, paso actual, alerta suave |
| `--accent-soft` | `#a82c290f` | `#e2564f14` | fondo del acento |
| `--good` (verde) | `#5c7a58` | `#7fa578` | hecho / en meta |
| `--warn` (ámbar) | `#b07d16` | `#e6b64c` | estancado / deadline cercano |
| `--panel` (tinta) | `#181b17` | `#0b0d0a` | botón de guardar, code |

## Tipografía

- **Mono** (JetBrains Mono / Geist Mono): etiquetas, datos, números, chrome del OS, la identidad "markdown".
- **Sans** (Inter / Geist): títulos y texto de UI.

| Rol | Familia | Tamaño / peso | Estilo |
|---|---|---|---|
| Etiqueta de sección | mono | ~.70rem, 600 | MAYÚSCULAS, tracking `.18em` |
| Dato / número | mono | ~.9rem, 700 | `tabular-nums` |
| Título | sans | ~1.25rem, 700 | tracking `-.01em`, `text-wrap: balance` |
| Cuerpo | sans | ~.95rem, 400 | color `--ink-soft` |

## Forma y espacio

- **Radios:** 5px (chip) · 8px (botón) · 11px (tarjeta) · 28px (sheet).
- **Espaciado base:** 4 · 8 · 12 · 15 px.
- **Objetivo táctil:** ≥ 44px. Lo importante, en la mitad inferior (alcance del pulgar).
- **Elevación:** una sola sombra sutil. Sin glow.
- **Bordes:** 1px, hairline.

## Semántica de color (estados)

- 🟩 **Verde** — hecho / en meta.
- 🟥 **Rojo tinta** — paso actual · acento · alerta suave. Se reserva para "esto pide tu atención".
- 🟧 **Ámbar** — plan estancado (paso sin cambiar 10+ días) / deadline cercano.
- ⬜ **Tinta suave** — pendiente / inactivo.

---

## Componentes

Cada uno se construye con los tokens de arriba. (Renderizados en vivo en el artifact `output/hdx-os-ui-kit.html`.)

| Componente | Notas |
|---|---|
| **Barra superior** | `hdx_os▍` + fecha. En vistas internas: `‹ Home` + título. |
| **Saludo** | "Buenos días, Hendrix" + subtítulo de estado en una línea. |
| **Botón primario / secundario** | Primario = relleno rojo (la acción del ritual). Máx. **1 primario** por pantalla. |
| **Etiqueta de sección** | mono, mayúsculas. Separa zonas sin cajas ni líneas. |
| **Tarjeta Make Time** | 3 campos (Highlight/Gratitud/Let-go) + selector de ánimo 1-10. |
| **Selector de ánimo** | 10 puntos, un toque. Sin texto ni escala. |
| **Tile de plan** | plan = tile. Título + barra de avance + paso actual. Toque → abre el plan. |
| **Tile · estancado** | borde y barra ámbar cuando el paso no cambia en 10+ días. |
| **Barra de progreso** | avance de un plan; número solo en la vista de plan. |
| **Fila de paso** | 3 estados: hecho (verde, tachado) · actual (borde rojo, negrita) · pendiente. |
| **Racha de hábito** | 7 cuadritos, booleano; verde = hecho. |
| **Tira del mentor** | "Pregúntale a tu vida — Claude Code lee el vault". |
| **Chips de área** | puertas a los hubs del vault. |
| **Captura: campo + voz** | campo de texto + botón de mic (rojo) + onda. |
| **Chips de tipo** | idea/tarea/persona/video. Seleccionado = relleno; resto = borde punteado. |
| **Control segmentado** | cambio de vista, máx 3-4 opciones. |
| **Botón de guardar** | tinta oscura (no rojo): cierra el flujo, vuelve al Home. |
| **Nota / callout** | contexto. Nunca roja. |
| **Estado vacío** | siempre enseña el siguiente paso. Nunca una pantalla en blanco. |

## Do / Don't

**✓ Sí:** piel de papel · un solo acento + semánticos · sparklines/rachas solo donde hay número real (ánimo, hábitos) · transiciones sutiles (respeta `prefers-reduced-motion`) · todo estado vacío enseña el siguiente paso.

**✕ No:** dark-neón, gauges, mascotas 3D · sparklines decorativos sobre prosa · menús profundos o pestañas fijas abajo · más de un botón primario por pantalla · rojo para cosas que no piden atención.
