# HDX OS

**Tu vida, en texto plano.** Command center personal — una sola pantalla que abres cada mañana; tus planes viven en tu cuaderno (el vault) y la app les pone cara.

> **Estado: MVP funcional** (2026-07-16). Construido en una sesión nocturna a partir del diseño aprobado en Claude Design. Compila (`next build` ✓) y funciona de punta a punta sobre **datos locales** (localStorage). Falta enchufar el backend real (vault + Sheet) — ver "Lo que falta".

Especificación: [`design.md`](./design.md) (sistema visual) · [`ux-flow.md`](./ux-flow.md) (flujos). Contexto completo en el vault: `wiki/HENDRIX-OS/`.

## Correr

```bash
npm run dev      # desarrollo → http://localhost:3000
npm run build    # build de producción
npm run start    # servir el build
npm run icons    # regenerar los íconos PWA (requiere sharp)
```

## Qué hace (v1)

- **Botón "Nuevo día"** — arranca el ritual del día.
- **Make Time** — Highlight · Gratitud · Let-go + ánimo 1-10 (se escriben y persisten).
- **Hoy** — el paso actual de cada plan como tiles; el estancado se pinta ámbar.
- **Plan** — toca un tile → los pasos; toca una casilla para marcarla hecha.
- **Hábitos** — racha semanal; toca una fila para marcar hoy.
- **Captura** — texto o voz (mic del teclado) → cae al inbox.
- **Áreas** — 4 puertas a los hubs (Estudio · Personal · Agencia · Sistema).
- **PWA** — instalable, offline, claro/oscuro (sigue el sistema).

Todo persiste en el navegador (localStorage, clave `hdxos:v1`). Es usable de verdad con los datos de ejemplo.

## Arquitectura

| Pieza | Dónde | Nota |
|---|---|---|
| Framework | Next.js 16 (App Router, Turbopack) + React 19 | |
| Estilos | Tailwind v4 (tokens en `app/globals.css`) | piel de papel, claro/oscuro por CSS vars |
| Tipografía | Inter + JetBrains Mono (`next/font`) | mono = identidad markdown |
| **Capa de datos** | `lib/store.tsx` | **contrato intercambiable** — hoy localStorage, mañana vault+Sheet sin tocar la UI |
| Datos semilla | `lib/seed.ts` | ejemplo del diseño |
| Tipos | `lib/types.ts` | |
| Pantallas | `app/page.tsx` (Home), `app/plan/[id]`, `app/captura`, `app/area/[slug]` | |
| Componentes | `components/` | Home, PlanView, CapturaView, AreaView, ui, RegisterSW |
| PWA | `app/manifest.ts`, `public/sw.js`, `public/icons/`, `scripts/gen-icons.mjs` | |

**Regla de oro (para cuando entre el backend):** la app **lee del vault y escribe al buzón (Sheet)**; **solo Claude Code escribe el vault**. `lib/store` es el único punto que cambia — se reemplaza por lecturas del vault (GitHub) + escrituras al Sheet, con la misma API. Los componentes no se tocan.

## Lo que falta (necesita tus cuentas / decisiones)

1. **Subir el vault a GitHub** — prerrequisito para leer planes/áreas reales.
2. **Google Sheet** (`dia · inbox · planes`) + service account — el buzón.
3. **Reemplazar `lib/store`** por `lib/data` que lea el vault (GitHub API) y escriba al Sheet. La UI ya está lista para eso.
4. **Deploy a Vercel** — requiere tu cuenta (login PIN / password de Vercel; deploy privado).
5. **v2/v3** — sync bidireccional instantáneo, buscador del vault, cuentas regresivas, el patrón semanal desde tu prosa. Ver `wiki/HENDRIX-OS/hendrix-os-roadmap.md`.

## Verificación

Compila (`next build`, exit 0, TypeScript OK) y todas las rutas responden 200 con el contenido correcto (Home, /plan/[id], /area/[slug], /captura, /manifest.webmanifest, íconos). Lo único que conviene que eyeballees tú: abrirla en el navegador para confirmar el look en claro y oscuro.
