import type { AppState } from "./types";

// Datos semilla (ejemplo del diseño). En el MVP viven en localStorage;
// luego los reemplaza la lectura del vault.
export const seedState: AppState = {
  rachaRitual: 6,
  dia: {
    fecha: "2026-07-14",
    label: "mar · 14 jul",
    highlight: "Lista de 20 prospectos",
    gratitud: "",
    letGo: "",
    animo: 7,
    iniciado: true,
  },
  planes: [
    {
      id: "conseguir-cliente",
      titulo: "Conseguir 1 cliente",
      proyecto: "hdx.agency",
      areaTag: "agencia",
      staleDays: 1,
      pasos: [
        { n: 1, texto: "Definir la oferta", done: true },
        { n: 2, texto: "Elegir el nicho", done: true },
        { n: 3, texto: "Lista de 20 prospectos", done: false },
        { n: 4, texto: "Primer mensaje a 10", done: false },
        { n: 5, texto: "Seguimiento a los que abren", done: false },
        { n: 6, texto: "Llamada de descubrimiento", done: false },
        { n: 7, texto: "Propuesta y cierre", done: false },
      ],
    },
    {
      id: "aprobar-semestre",
      titulo: "Aprobar el semestre",
      proyecto: "universidad",
      areaTag: "estudio",
      staleDays: 11,
      pasos: [
        { n: 1, texto: "Ordenar los apuntes", done: true },
        { n: 2, texto: "Resumir constitucional", done: true },
        { n: 3, texto: "Repasar procesal", done: true },
        { n: 4, texto: "Síntesis del caso Y", done: false },
        { n: 5, texto: "Batería de ejercicios", done: false },
        { n: 6, texto: "Simulacro de parcial", done: false },
        { n: 7, texto: "Repaso final", done: false },
      ],
    },
  ],
  habitos: [
    { nombre: "Gym", dias: [true, true, false, true, true, false, false] },
    { nombre: "Leer", dias: [true, true, true, true, true, true, false] },
  ],
  inbox: [],
  areas: [
    {
      slug: "estudio",
      nombre: "Estudio",
      subareas: [
        { nombre: "Universidad", nota: "⚠ parcial en 4 días", tone: "warn" },
        { nombre: "MUN", nota: "próximo comité: hoy 17:00", tone: "muted" },
      ],
      notas: [
        { texto: "Excepciones procesales — apuntes civil", hora: "09:41" },
        { texto: "Síntesis del caso Y — borrador", hora: "ayer 22:15" },
      ],
    },
    {
      slug: "personal",
      nombre: "Personal",
      subareas: [
        { nombre: "Salud", nota: "racha de gym: 4 días", tone: "muted" },
        { nombre: "Lectura", nota: "Make Time — p. 142", tone: "muted" },
      ],
      notas: [],
    },
    {
      slug: "agencia",
      nombre: "Agencia",
      subareas: [{ nombre: "hdx.agency", nota: "1 plan activo", tone: "muted" }],
      notas: [{ texto: "Idea de reel: corte de vidrio", hora: "11:04" }],
    },
    {
      slug: "sistema",
      nombre: "Sistema",
      subareas: [
        { nombre: "El vault", nota: "último respaldo: hoy", tone: "muted" },
        { nombre: "HDX OS", nota: "MVP en construcción", tone: "muted" },
      ],
      notas: [],
    },
  ],
};
