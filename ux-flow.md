# HDX OS — UX y flujos (`ux-flow.md`)

> Cómo funciona la app y cómo se mueve el usuario. La piel visual vive en `design.md` (al lado).
> El "por qué" completo: `wiki/HENDRIX-OS/hendrix-os-vision-y-funciones.md` y `...-arquitectura-datos.md`.

---

## Qué es la app

**Tu vida, en texto plano.** Una sola pantalla que abres cada mañana. Tus planes ya están escritos en tu cuaderno (Obsidian / el vault); la app les pone cara y te dice **qué toca hoy**. No es un tablero para vigilar métricas — es una **página que se escribe** (un ritual matutino calmado).

## Las pantallas (solo 4)

1. **Home** — la pantalla principal. Todo lo demás se abre **encima** de ella.
2. **Plan** — los pasos de un objetivo, con el actual resaltado.
3. **Captura** — texto o voz, cae al inbox.
4. **Área** — un pilar de vida (Estudio, Personal, Agencia, Sistema) → sus hubs del vault.

## Modelo de navegación

- **Home es el centro.** Nada es un callejón sin salida.
- Plan / Captura / Área se abren **encima** y el botón **"back" siempre vuelve al Home**.
- Profundidad máxima: **2 toques**.

## Ritmo: mañana guiada · día libre

- La **mañana es una secuencia lineal** (Nuevo día → 3 campos → ver Hoy), como un mini-onboarding diario que mata la parálisis.
- El **resto del día es navegación libre**: entras 10 segundos, capturas, sales. No se mezclan los dos modos.

---

## Los flujos (como secuencia)

### Flujo 1 · El ritual matutino — *guiado*
`Abrir (ícono o notif 7am)` → `+ Nuevo día` (genera la nota del día: rutina + paso de cada plan) → `Escribir` (Highlight → Gratitud → Let-go → ánimo 1-10) → `Ver el Hoy` (qué sigue en cada plan).

### Flujo 2 · Capturar algo — *libre*
`Se te ocurre algo` → `+ idea` (o Share Target desde otra app) → `Dictar o escribir` → `Guardar` (vuelve al Home).
**Por detrás:** cae al `inbox` → Claude Code lo drena → lo rutea a la página correcta del vault con su `[[wikilink]]`.

### Flujo 3 · Avanzar un plan — *libre*
`Home` (ves el tile con el paso actual) → `Tocar el tile` → `Ver los pasos` (los 7, el actual en rojo) → `Marcar la casilla` → el tile avanza al siguiente paso.

### Flujo 4 · El bucle diario — *ciclo*
`Mañana` (ritual) → `Día` (capturar y avanzar planes) → `Noche` (lo no hecho → push a mañana) → **↺ reinicia**. El "push a mañana" alimenta el "Nuevo día" del día siguiente; el ciclo se cierra solo.

### Flujo 5 · Los datos — *lo que no ves*
- **Leer (A):** Vault → Claude Code parsea los planes → pestaña `planes` → la app lee → Home.
- **Escribir (B):** la app escribe capturas y casillas → `inbox` / `dia` → Claude Code drena y escribe el markdown.
- **Regla de oro:** la app **lee del vault y escribe al buzón**; **solo Claude Code escribe el vault** → cero conflictos de git.

## Puntos de entrada (cómo caes dentro)

| Entrada | Qué dispara |
|---|---|
| **Ícono PWA** | abre el Home |
| **Notificación 7am** | abre directo al ritual |
| **Share Target** | comparte un link desde otra app → cae al inbox sin abrir la app |
| **Mic del teclado** | dictar dentro de Captura |

## Cómo funcionan los datos (a nivel usuario)

- **El vault (Obsidian)** = la verdad. Tú escribes tus planes y notas ahí, con calma.
- **La app** = la cara. Lee el vault y te muestra qué toca hoy. Cuando marcas o capturas, escribe a un **buzón** (una hoja de cálculo), nunca al vault directo.
- **Claude Code** = el ayudante. Vacía el buzón al vault y lo mantiene ordenado. Invisible para ti.
- **Marcar casillas** funciona desde v1: tocas, se marca al instante en la app; el `- [x]` aparece en Obsidian un poco después (lo sincroniza Claude Code).

## v1 (MVP) vs diferido

- **v1:** todo el bucle diario + navegación Home↔(Plan/Captura/Área) + las 4 entradas + marcar casillas desde la app.
- **v2:** sincronización bidireccional instantánea · buscador del vault · cuentas regresivas (parciales) con rojo parpadeante · voz en escritorio.
- **v3:** el **patrón semanal leído de tu prosa** (Claude Code lee tu semana y te devuelve un patrón que no viste) · repaso espaciado · CRM personal · briefing matutino · Google Calendar.
