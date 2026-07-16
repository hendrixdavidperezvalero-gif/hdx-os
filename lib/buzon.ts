// HDX OS — funciones de dominio sobre el "buzón" (el Google Sheet). Server-only:
// solo se importa desde route handlers (app/api/**). Todo lo crudo de Sheets
// (auth, rangos, escritura por fila) vive en lib/sheets.ts.
import { escribirFila, leerTab, primeraFilaVacia, sinRow, type Fila } from "./sheets";
import { HABITO_COLUMNAS } from "./config";
import type { Dia, Habito, Paso, Plan } from "./types";

// Cabeceras de respaldo: solo se usan si la pestaña está vacía (sin fila 1
// todavía). En el uso normal las cabeceras reales del Sheet mandan siempre.
const DIA_HEADERS = [
  "fecha",
  "dia_semana",
  "highlight",
  "gratitud",
  "let_go",
  "animo",
  "rutina_ok",
  "gym",
  "leer",
];
const INBOX_HEADERS = ["fecha", "texto"];
const PLANES_HEADERS = [
  "id",
  "plan",
  "proyecto",
  "area",
  "avance",
  "paso_actual",
  "siguiente",
  "stale_dias",
  "pasos_json",
];

// --- fecha/hora en America/Caracas ---

const DIAS = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

/** "Hoy" en YYYY-MM-DD, en la zona horaria del usuario (America/Caracas). */
function hoyCaracas(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "America/Caracas" });
}

/** "{ddd} · {D} {mmm}" en español, minúsculas, para una fecha YYYY-MM-DD.
 * Se arma en UTC a partir de los componentes de la fecha (no del reloj del
 * proceso Node) para que el día de la semana no dependa de la TZ del server. */
function labelParaFecha(fecha: string): string {
  const [y, m, d] = fecha.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return `${DIAS[dt.getUTCDay()]} · ${d} ${MESES[m - 1]}`;
}

/** Suma (o resta) días calendario a una fecha YYYY-MM-DD. Aritmética en UTC:
 * Date.UTC normaliza solo los desbordes de mes/año. */
function sumarDias(fecha: string, delta: number): string {
  const [y, m, d] = fecha.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + delta));
  return dt.toISOString().slice(0, 10);
}

function parseBool(v: string | undefined): boolean {
  return v === "TRUE" || v === "true" || v === "1";
}

// --- pestaña "planes" ---

// Parseo DEFENSIVO de pasos_json: celda vacía o JSON malformado -> [] (nunca
// revienta la lectura del estado por un dato corrupto de una sola fila).
function parsePasos(json: string | undefined): Paso[] {
  const raw = (json ?? "").trim();
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((x): x is Paso => x != null && typeof x.n === "number" && typeof x.texto === "string")
      .map((x) => ({ n: x.n, texto: x.texto, done: Boolean(x.done) }));
  } catch {
    return [];
  }
}

function filaAPlan(r: Fila): Plan {
  return {
    id: r.id ?? "",
    titulo: r.plan ?? "",
    proyecto: r.proyecto ?? "",
    areaTag: r.area ?? "",
    staleDays: Number(r.stale_dias) || 0,
    pasos: parsePasos(r.pasos_json),
  };
}

// --- pestaña "dia" ---

function filaDiaVacia(fecha: string): Record<string, string> {
  return {
    fecha,
    dia_semana: labelParaFecha(fecha),
    highlight: "",
    gratitud: "",
    let_go: "",
    animo: "0",
    rutina_ok: "FALSE",
    gym: "FALSE",
    leer: "FALSE",
  };
}

export type CampoDia =
  | "highlight"
  | "gratitud"
  | "let_go"
  | "animo"
  | "rutina_ok"
  | "gym"
  | "leer"
  | "iniciar";

function serValDia(valor: string | number | boolean | undefined): string {
  if (typeof valor === "boolean") return valor ? "TRUE" : "FALSE";
  if (typeof valor === "number") return String(valor);
  return valor ?? "";
}

/** Estado consolidado que consume el store del cliente: el día de hoy, la
 * ventana de hábitos de 7 días, la racha de ritual y los planes vivos. */
export async function getEstado(): Promise<{
  dia: Dia;
  habitos: Habito[];
  rachaRitual: number;
  planes: Plan[];
}> {
  const { rows } = await leerTab("dia");
  const hoy = hoyCaracas();
  const porFecha = new Map(rows.map((r) => [r.fecha, r]));
  const filaHoy = porFecha.get(hoy);

  const dia: Dia = filaHoy
    ? {
        fecha: filaHoy.fecha,
        label: labelParaFecha(filaHoy.fecha),
        highlight: filaHoy.highlight ?? "",
        gratitud: filaHoy.gratitud ?? "",
        letGo: filaHoy.let_go ?? "",
        animo: Number(filaHoy.animo) || 0,
        iniciado: true,
      }
    : {
        fecha: hoy,
        label: labelParaFecha(hoy),
        highlight: "",
        gratitud: "",
        letGo: "",
        animo: 0,
        iniciado: false,
      };

  // Hábitos: ventana de 7 días calendario que TERMINA hoy. Un día sin fila
  // propia en "dia" cuenta como no cumplido (false), no como dato faltante.
  const ventana: string[] = [];
  for (let i = 6; i >= 0; i--) ventana.push(sumarDias(hoy, -i));
  const habitos: Habito[] = HABITO_COLUMNAS.map(({ nombre, columna }) => ({
    nombre,
    dias: ventana.map((f) => parseBool(porFecha.get(f)?.[columna])),
  }));

  // Racha de ritual: días consecutivos con fila en "dia", terminando en hoy
  // (o en ayer, si hoy todavía no tiene fila propia — p. ej. antes de "Nuevo día").
  let cursor = filaHoy ? hoy : sumarDias(hoy, -1);
  let rachaRitual = 0;
  while (porFecha.has(cursor)) {
    rachaRitual++;
    cursor = sumarDias(cursor, -1);
  }

  const { rows: filasPlanes } = await leerTab("planes");
  const planes = filasPlanes.map(filaAPlan);

  return { dia, habitos, rachaRitual, planes };
}

/**
 * Crea o actualiza la fila del día de HOY. Si no existe la crea (en la
 * primera fila libre) con fecha/dia_semana y el resto de campos vacíos/false;
 * luego escribe el campo pedido. Para "iniciar" basta con asegurar que la fila
 * exista — no pisa un día ya iniciado (por eso no se toca ningún otro campo).
 */
export async function upsertDia(campo: CampoDia, valor?: string | number | boolean): Promise<void> {
  const { headers, rows } = await leerTab("dia");
  const cabecera = headers.length > 0 ? headers : DIA_HEADERS;
  const hoy = hoyCaracas();
  const fila = rows.find((r) => r.fecha === hoy);

  let rowNumber: number;
  let datos: Record<string, string>;
  if (fila) {
    rowNumber = fila._row;
    datos = sinRow(fila);
  } else {
    rowNumber = await primeraFilaVacia("dia");
    datos = filaDiaVacia(hoy);
  }

  if (campo !== "iniciar") {
    datos[campo] = serValDia(valor);
  }

  await escribirFila("dia", rowNumber, cabecera, datos);
}

/** Agrega una entrada al inbox (la app SOLO escribe esta pestaña, nunca la lee). */
export async function addInbox(texto: string, tipo: string): Promise<void> {
  const { headers } = await leerTab("inbox");
  const cabecera = headers.length > 0 ? headers : INBOX_HEADERS;
  const rowNumber = await primeraFilaVacia("inbox");
  await escribirFila("inbox", rowNumber, cabecera, {
    fecha: new Date().toISOString(),
    texto: `[${tipo}] ${texto}`,
  });
}

/**
 * Marca (o desmarca) el paso `n` de un plan. Recalcula avance/paso_actual/
 * siguiente/stale_dias y reescribe la fila completa. Además deja constancia
 * en el inbox para que Claude Code lo refleje en el vault al drenar.
 */
export async function marcarPaso(id: string, n: number, done: boolean): Promise<void> {
  const { headers, rows } = await leerTab("planes");
  const cabecera = headers.length > 0 ? headers : PLANES_HEADERS;
  const fila = rows.find((r) => r.id === id);
  if (!fila) throw new Error(`Plan "${id}" no encontrado en el buzón`);

  const pasos = parsePasos(fila.pasos_json).map((p) => (p.n === n ? { ...p, done } : p));
  const hechos = pasos.filter((p) => p.done).length;
  const pendientes = pasos.filter((p) => !p.done);

  const datos = sinRow(fila);
  datos.avance = `${hechos}/${pasos.length}`;
  datos.paso_actual = pendientes[0]?.texto ?? "completado";
  datos.siguiente = pendientes[1]?.texto ?? "";
  datos.stale_dias = "0";
  datos.pasos_json = JSON.stringify(pasos);

  await escribirFila("planes", fila._row, cabecera, datos);

  await addInbox(`paso plan=${id} n=${n} done=${done}`, "accion");
}
