// ===== HDX OS — modelo de datos =====
// Nota: en el MVP la fuente es local (localStorage) vía este mismo contrato.
// Más adelante, `lib/store` se reemplaza por lectura del vault (GitHub) +
// escritura al buzón (Google Sheet), sin tocar los componentes.

export type Paso = { n: number; texto: string; done: boolean };

export type Plan = {
  id: string;
  titulo: string;
  proyecto: string; // "hdx.agency"
  areaTag: string; // "agencia"
  pasos: Paso[];
  staleDays: number; // >= 10 → estancado (ámbar)
};

export type Dia = {
  fecha: string; // yyyy-mm-dd
  label: string; // "mar · 14 jul"
  highlight: string;
  gratitud: string;
  letGo: string;
  animo: number; // 0..10
  iniciado: boolean; // se presionó "Nuevo día"
};

// dias: ventana de 7 días que TERMINA hoy (el último elemento = hoy).
export type Habito = { nombre: string; dias: boolean[] }; // longitud 7

export type TipoCaptura = "idea" | "tarea" | "persona" | "video";
export type Captura = { id: string; fecha: string; texto: string; tipo: TipoCaptura };

export type SubArea = { nombre: string; nota: string; tone: "warn" | "muted" };
export type NotaArea = { texto: string; hora: string };
export type Area = {
  slug: string;
  nombre: string;
  subareas: SubArea[];
  notas: NotaArea[];
};

export type AppState = {
  dia: Dia;
  planes: Plan[];
  habitos: Habito[];
  inbox: Captura[];
  areas: Area[];
  rachaRitual: number;
};

// Helpers de dominio
export const planAvance = (p: Plan) => p.pasos.filter((s) => s.done).length;
export const pasoActual = (p: Plan) => p.pasos.find((s) => !s.done) ?? null;
export const esEstancado = (p: Plan) => p.staleDays >= 10;
export const habitoConteo = (h: Habito) => h.dias.filter(Boolean).length;
