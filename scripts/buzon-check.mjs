// HDX OS — chequeo del buzón: pestañas y cabeceras del Sheet. Solo lectura.
// Uso: node scripts/buzon-check.mjs
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
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});
const api = google.sheets({ version: "v4", auth });
const meta = await api.spreadsheets.get({ spreadsheetId: env.HDXOS_SHEET_ID });
console.log("titulo:", meta.data.properties.title);
for (const s of meta.data.sheets) {
  const tab = s.properties.title;
  const r = await api.spreadsheets.values.get({
    spreadsheetId: env.HDXOS_SHEET_ID,
    range: `${tab}!1:1`,
  });
  console.log(`pestaña "${tab}": [${(r.data.values?.[0] ?? []).join(" | ")}]`);
}
