// HDX OS — planes-sync: parsea los planes del vault (páginas con `tipo: plan`)
// y reescribe la pestaña `planes` del Sheet buzón. Lo corre Claude Code desde
// la PC (la app NUNCA escribe el vault; este script NUNCA lo modifica — solo lee).
// Uso: node scripts/planes-sync.mjs
import { google } from "googleapis";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { execSync } from "node:child_process";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const VAULT = join(process.env.USERPROFILE ?? "", "Desktop", "HENDRIX VAULT");
const WIKI = join(VAULT, "wiki");

// --- env desde .env.local (lazy, sin dependencias) ---
const env = {};
for (const line of readFileSync(join(ROOT, ".env.local"), "utf8").split(/\r?\n/)) {
  const m = line.match(/^([A-Z_0-9]+)=(.*)$/);
  if (m) env[m[1]] = m[2];
}
if (!env.GOOGLE_SERVICE_ACCOUNT_B64 || !env.HDXOS_SHEET_ID)
  throw new Error("Faltan GOOGLE_SERVICE_ACCOUNT_B64 / HDXOS_SHEET_ID en .env.local");

// --- proyecto → área (las 4 puertas del OS) ---
const AREA = { "hdx-agency": "agencia", universidad: "estudio", mun: "estudio", "hendrix-os": "sistema" };

// --- recorrer wiki/ buscando páginas con `tipo: plan` ---
function paginas(dir) {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) return f.startsWith("_") ? [] : paginas(p);
    return f.endsWith(".md") ? [p] : [];
  });
}

function parsearPlan(file) {
  const md = readFileSync(file, "utf8");
  const fm = md.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!fm || !/^tipo:\s*plan\s*$/m.test(fm[1])) return null;
  const proyecto = (fm[1].match(/^project:\s*(\S+)/m) ?? [])[1] ?? "";
  const titulo = (md.match(/^# (.+)$/m) ?? [])[1] ?? basename(file, ".md");
  const seccion = md.split(/^## Pasos\s*$/m)[1]?.split(/^## /m)[0] ?? "";
  const pasos = [];
  for (const l of seccion.split(/\r?\n/)) {
    const m = l.match(/^- \[( |x)\]\s*(?:(\d+)[.)]\s*)?(.+)$/);
    if (m) pasos.push({ n: m[2] ? Number(m[2]) : pasos.length + 1, texto: m[3].trim(), done: m[1] === "x" });
  }
  if (!pasos.length) return null;

  // staleDays: días desde el último toque del archivo (git del vault; si hay
  // cambios sin commit o no hay historial, 0 = tocado hoy)
  let staleDays = 0;
  try {
    const dirty = execSync(`git -C "${VAULT}" status --porcelain -- "${file}"`, { encoding: "utf8" }).trim();
    if (!dirty) {
      const ct = execSync(`git -C "${VAULT}" log -1 --format=%ct -- "${file}"`, { encoding: "utf8" }).trim();
      if (ct) staleDays = Math.max(0, Math.floor((Date.now() / 1000 - Number(ct)) / 86400));
    }
  } catch { /* sin git → 0 */ }

  const hechos = pasos.filter((p) => p.done).length;
  const pendientes = pasos.filter((p) => !p.done);
  return {
    id: basename(file, ".md"),
    plan: titulo,
    proyecto,
    area: AREA[proyecto] ?? "personal",
    avance: `${hechos}/${pasos.length}`,
    paso_actual: pendientes[0]?.texto ?? "completado",
    siguiente: pendientes[1]?.texto ?? "",
    stale_dias: String(staleDays),
    pasos_json: JSON.stringify(pasos),
  };
}

const planes = paginas(WIKI).map(parsearPlan).filter(Boolean);
console.log(`planes encontrados: ${planes.length}`);
for (const p of planes) console.log(`  ${p.id} (${p.proyecto} → ${p.area}) ${p.avance} → ${p.paso_actual}`);

// --- escribir la pestaña completa (values.update explícito, NUNCA append) ---
const HEADERS = ["id", "plan", "proyecto", "area", "avance", "paso_actual", "siguiente", "stale_dias", "pasos_json"];
const creds = JSON.parse(Buffer.from(env.GOOGLE_SERVICE_ACCOUNT_B64, "base64").toString("utf8"));
const auth = new google.auth.JWT({
  email: creds.client_email,
  key: creds.private_key,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});
const api = google.sheets({ version: "v4", auth });
const values = [
  HEADERS,
  ...planes.map((p) => HEADERS.map((h) => p[h])),
  // filas de colchón en blanco por si antes había más planes que ahora
  ...Array.from({ length: 5 }, () => HEADERS.map(() => "")),
];
await api.spreadsheets.values.update({
  spreadsheetId: env.HDXOS_SHEET_ID,
  range: `planes!A1:I${values.length}`,
  valueInputOption: "RAW",
  requestBody: { values },
});
console.log(`pestaña planes reescrita (${planes.length} planes) ✓`);
