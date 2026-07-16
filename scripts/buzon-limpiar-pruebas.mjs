// HDX OS — limpieza one-shot de las filas de PRUEBA del E2E (2026-07-16):
// la fila del día de prueba y las entradas de test del inbox. Solo borra
// filas cuyo contenido coincide con lo que escribió la prueba.
import { google } from "googleapis";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const env = {};
for (const line of readFileSync(join(ROOT, ".env.local"), "utf8").split(/\r?\n/)) {
  const m = line.match(/^([A-Z_0-9]+)=(.*)$/);
  if (m) env[m[1]] = m[2];
}
const creds = JSON.parse(Buffer.from(env.GOOGLE_SERVICE_ACCOUNT_B64, "base64").toString("utf8"));
const auth = new google.auth.JWT({
  email: creds.client_email,
  key: creds.private_key,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});
const api = google.sheets({ version: "v4", auth });
const SID = env.HDXOS_SHEET_ID;

// dia: borrar la fila 2026-07-16 SOLO si el highlight es el de la prueba
const dia = await api.spreadsheets.values.get({ spreadsheetId: SID, range: "dia!A:C" });
for (const [i, r] of (dia.data.values ?? []).entries()) {
  if (r[0] === "2026-07-16" && (r[2] ?? "") === "PRUEBA E2E") {
    await api.spreadsheets.values.clear({ spreadsheetId: SID, range: `dia!A${i + 1}:I${i + 1}` });
    console.log(`dia: fila ${i + 1} (prueba) limpiada`);
  }
}

// inbox: borrar solo las filas de la prueba (la captura de test y las [accion] del paso 1)
const inbox = await api.spreadsheets.values.get({ spreadsheetId: SID, range: "inbox!A:B" });
for (const [i, r] of (inbox.data.values ?? []).entries()) {
  const t = r[1] ?? "";
  const esPrueba =
    t === "[idea] prueba e2e del buzon" ||
    /^\[accion\] paso plan=hdx-agency-conseguir-cliente n=1 done=(true|false)$/.test(t);
  if (esPrueba) {
    await api.spreadsheets.values.clear({ spreadsheetId: SID, range: `inbox!A${i + 1}:B${i + 1}` });
    console.log(`inbox: fila ${i + 1} (prueba) limpiada: ${t}`);
  }
}
console.log("limpieza lista ✓");
