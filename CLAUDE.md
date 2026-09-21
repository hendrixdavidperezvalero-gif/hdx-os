# CLAUDE.md — hendrix-os (HDX OS)

Command center personal de Hendrix: una sola pantalla que abre cada mañana. Los planes viven en el
**vault** (markdown); la app les pone cara. LIVE en `hdx-os.vercel.app`.

`README.md` cubre qué hace y la arquitectura — no lo repitas, léelo.

## Regla de oro (arquitectura, no negociable)

**La app LEE del vault y ESCRIBE al buzón (Google Sheet). Solo Claude Code escribe el vault.**

`lib/store.tsx` es el único punto de contacto con los datos — contrato intercambiable. Si cambias
la fuente de datos, se cambia ahí y los componentes no se tocan.

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · Tailwind v4 (tokens en `app/globals.css`) ·
`googleapis` · PWA. Sin librerías nuevas sin aprobación.

```bash
npm run dev      # http://localhost:3000
npm run build
npm run icons    # regenerar íconos PWA (requiere sharp)
```

Scripts operativos (`scripts/`, se corren a mano):
`planes-sync.mjs` (empuja los planes del vault al Sheet — **lo corro yo, no Hendrix**),
`buzon-check.mjs`, `buzon-limpiar-pruebas.mjs`, `gen-icons.mjs`.

## Deploy

**Push a `main` = deploy.** Repo: `github.com/hendrixdavidperezvalero-gif/hdx-os` → Vercel.

## Estado real

- Buzón (Sheet) **conectado y verificado E2E**; el inbox ya drenó.
- **Producción sigue en modo local** hasta que se peguen las 2 variables de entorno en Vercel.
  Mientras tanto, lo que ves publicado corre con `localStorage` — si algo "no aparece en el
  teléfono", ese suele ser el motivo, no un bug.
- **Gratitud se queda** (decisión de producto, ya se discutió).

## Gotcha de Google Sheets (aplica también a LUCARIO)

`values.append` **no escribe y devuelve 200 mudo** si la cabecera de la hoja es más ancha que los
datos que mandas. Usar `values.update` sobre una fila explícita.

## Contexto en el vault

`~/Desktop/HENDRIX VAULT/wiki/PERSONAL/` · especificación local en `design.md` y `ux-flow.md`.
