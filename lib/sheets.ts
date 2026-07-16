// HDX OS — acceso crudo al Google Sheet que hace de "buzón". Server-only:
// NUNCA se importa desde un componente cliente (arrastraría googleapis y las
// credenciales al bundle del navegador). Auth e ID se resuelven LAZY, dentro
// de las funciones, para que `next build` no reviente cuando corre sin env vars.
import { google } from "googleapis";

function buildAuth() {
  const b64 = process.env.GOOGLE_SERVICE_ACCOUNT_B64;
  if (!b64) throw new Error("GOOGLE_SERVICE_ACCOUNT_B64 no configurado");
  const creds = JSON.parse(Buffer.from(b64, "base64").toString("utf8"));
  return new google.auth.JWT({
    email: creds.client_email,
    key: creds.private_key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

export function sheets() {
  return google.sheets({ version: "v4", auth: buildAuth() });
}

export const SID = () => {
  const id = process.env.HDXOS_SHEET_ID;
  if (!id) throw new Error("HDXOS_SHEET_ID no configurado");
  return id;
};

export type ApiSheets = ReturnType<typeof sheets>;

// Una fila leída, mapeada por NOMBRE de columna + su número de fila real en el
// Sheet (para poder reescribirla sin adivinar posiciones).
export type Fila = Record<string, string> & { _row: number };

// 1 -> "A", 26 -> "Z", 27 -> "AA", ... (letra de columna A1 para el ancho de cabecera).
function colALetra(n: number): string {
  let s = "";
  let x = n;
  while (x > 0) {
    const resto = (x - 1) % 26;
    s = String.fromCharCode(65 + resto) + s;
    x = Math.floor((x - 1) / 26);
  }
  return s;
}

/** Quita el metadato `_row` para poder tratar la fila como un objeto plano de
 * columna->valor antes de reescribirla (evita que `_row` se cuele como celda). */
export function sinRow(f: Fila): Record<string, string> {
  const { _row, ...datos } = f;
  return datos;
}

/**
 * Lee una pestaña completa. SIEMPRE mapea por el NOMBRE de la cabecera (fila 1),
 * nunca por índice fijo — las pestañas pueden ganar columnas con el tiempo.
 * Filas totalmente vacías se descartan (no representan un registro real).
 */
export async function leerTab(tab: string): Promise<{ headers: string[]; rows: Fila[] }> {
  const api = sheets();
  const sid = SID();
  const res = await api.spreadsheets.values.get({ spreadsheetId: sid, range: `${tab}!A:ZZ` });
  const todas = (res.data.values ?? []) as string[][];
  const headers = (todas[0] ?? []).map((h) => String(h ?? "").trim());

  const rows: Fila[] = [];
  for (let i = 1; i < todas.length; i++) {
    const r = todas[i] ?? [];
    if (r.every((c) => String(c ?? "").trim() === "")) continue; // fila en blanco
    const obj: Record<string, string> = {};
    headers.forEach((h, idx) => {
      if (h) obj[h] = String(r[idx] ?? "");
    });
    rows.push({ ...obj, _row: i + 1 } as Fila); // fila 1 = cabecera; datos desde la fila 2
  }
  return { headers, rows };
}

/**
 * Escribe una fila COMPLETA en un rango A1 explícito (nunca values.append: en
 * este stack falla mudo —200 sin escribir— cuando la cabecera es más ancha que
 * los datos). `obj` se serializa en el mismo orden que `headers`.
 */
export async function escribirFila(
  tab: string,
  rowNumber: number,
  headers: string[],
  obj: Record<string, string>,
): Promise<void> {
  const api = sheets();
  const sid = SID();
  const values = headers.map((h) => obj[h] ?? "");
  const ultimaCol = colALetra(headers.length);
  await api.spreadsheets.values.update({
    spreadsheetId: sid,
    range: `${tab}!A${rowNumber}:${ultimaCol}${rowNumber}`,
    valueInputOption: "RAW",
    requestBody: { values: [values] },
  });
}

/** Primera fila libre de la pestaña (para un "append" real): lee la columna A
 * y devuelve el número de la siguiente fila. */
export async function primeraFilaVacia(tab: string): Promise<number> {
  const api = sheets();
  const sid = SID();
  const res = await api.spreadsheets.values.get({ spreadsheetId: sid, range: `${tab}!A:A` });
  const col = (res.data.values ?? []) as string[][];
  return col.length + 1;
}
