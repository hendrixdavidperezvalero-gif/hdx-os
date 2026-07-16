// HDX OS — mapa fijo hábito -> columna del Sheet (pestaña "dia"). Vive fuera de
// lib/buzon.ts a propósito: este archivo NO importa googleapis, así que tanto
// el cliente (lib/store.tsx) como el servidor (lib/buzon.ts) lo pueden usar.
export const HABITO_COLUMNAS: { nombre: string; columna: "gym" | "leer" }[] = [
  { nombre: "Gym", columna: "gym" },
  { nombre: "Leer", columna: "leer" },
];
