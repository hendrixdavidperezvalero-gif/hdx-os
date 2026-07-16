"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { AppState, TipoCaptura } from "./types";
import { seedState } from "./seed";
import { HABITO_COLUMNAS } from "./config";

const KEY = "hdxos:v1";

// "mar · 14 jul"
const DIAS = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
function labelDia(d: Date) {
  return `${DIAS[d.getDay()]} · ${d.getDate()} ${MESES[d.getMonth()]}`;
}
function ymd(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// Campo local (camelCase, del tipo Dia) -> nombre de columna en la pestaña
// "dia" del buzón (snake_case, ver lib/buzon.ts).
const CAMPO_A_COLUMNA: Record<"highlight" | "gratitud" | "letGo", string> = {
  highlight: "highlight",
  gratitud: "gratitud",
  letGo: "let_go",
};

// POST fire-and-forget: el estado local YA quedó actualizado en forma
// optimista y localStorage lo cachea, así que si el buzón falla (sin
// conexión, sin configurar) no se revierte nada — queda offline-first,
// pendiente de sincronizar en el próximo intento.
// Los POST viajan EN SERIE (cola de promesas): el buzón reescribe la fila
// completa en cada upsert, así que dos escrituras en paralelo podrían pisarse
// (la segunda leería la fila ANTES de que aterrice la primera).
let cola: Promise<void> = Promise.resolve();
function post(url: string, body: unknown) {
  cola = cola.then(() =>
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then(
      () => undefined,
      () => undefined,
    ),
  );
}

type Ctx = {
  state: AppState;
  hydrated: boolean;
  nuevoDia: () => void;
  setCampo: (field: "highlight" | "gratitud" | "letGo", value: string) => void;
  setAnimo: (n: number) => void;
  togglePaso: (planId: string, n: number) => void;
  toggleHabitoHoy: (nombre: string) => void;
  capturar: (texto: string, tipo: TipoCaptura) => void;
};

const AppCtx = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(seedState);
  const [hydrated, setHydrated] = useState(false);

  // Espejo del último estado, para poder leer el valor "actual" de forma
  // síncrona dentro de un callback estable (sin depender del timing exacto en
  // que React aplica un setState funcional).
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Debounce de 800ms por campo, para no mandar un POST por cada tecla.
  const debounces = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const postDebounced = useCallback((key: string, url: string, body: unknown) => {
    clearTimeout(debounces.current[key]);
    debounces.current[key] = setTimeout(() => post(url, body), 800);
  }, []);
  useEffect(() => {
    const timers = debounces.current;
    return () => {
      Object.values(timers).forEach(clearTimeout);
    };
  }, []);

  // Cargar de localStorage al montar. Merge contra la semilla para que un blob
  // viejo (sin alguna clave nueva) no reviente en el primer .map/acceso.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const p = JSON.parse(raw) as Partial<AppState>;
        setState({
          ...seedState,
          ...p,
          dia: { ...seedState.dia, ...(p.dia ?? {}) },
          planes: p.planes ?? seedState.planes,
          habitos: p.habitos ?? seedState.habitos,
          areas: p.areas ?? seedState.areas,
          inbox: p.inbox ?? seedState.inbox,
        });
      }
    } catch {
      /* estado semilla */
    }
    setHydrated(true);
  }, []);

  // Persistir en cada cambio (una vez hidratado)
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* almacenamiento no disponible */
    }
  }, [state, hydrated]);

  // Tras hidratar de localStorage: leer el buzón (Google Sheet) y mergear
  // encima. `areas` queda SIEMPRE local (mock, por diseño: no vive en el
  // Sheet). `planes` solo se sobreescribe si el buzón trae filas — un array
  // vacío no debe vaciar la UI (podría ser una lectura fallida en silencio).
  useEffect(() => {
    if (!hydrated) return;
    fetch("/api/estado")
      .then((r) => r.json())
      .then((data) => {
        if (!data?.ok) return;
        setState((s) => ({
          ...s,
          // No degradar un "Nuevo día" recién tocado: si la respuesta (que pudo
          // salir ANTES del POST "iniciar") trae hoy sin iniciar pero lo local
          // ya lo inició, gana lo local.
          dia:
            data.dia && !(s.dia.iniciado && !data.dia.iniciado && s.dia.fecha === data.dia.fecha)
              ? data.dia
              : s.dia,
          habitos: data.habitos ?? s.habitos,
          rachaRitual: typeof data.rachaRitual === "number" ? data.rachaRitual : s.rachaRitual,
          planes: Array.isArray(data.planes) && data.planes.length > 0 ? data.planes : s.planes,
        }));
      })
      .catch(() => {
        /* sin buzón: se sigue con lo local (offline-first) */
      });
  }, [hydrated]);

  // "Nuevo día": arranca la hoja de HOY. Si el día actual ya está iniciado no
  // se re-escribe (no borra un Highlight/Gratitud ya tecleado); solo rueda
  // cuando cambió la fecha del calendario. El POST "iniciar" viaja siempre:
  // del lado del buzón solo ASEGURA que exista la fila de hoy, nunca pisa una
  // ya existente (ver lib/buzon.ts upsertDia).
  const nuevoDia = useCallback(() => {
    setState((s) => {
      const now = new Date();
      const fecha = ymd(now);
      if (s.dia.iniciado && s.dia.fecha === fecha) return s;
      return {
        ...s,
        dia: {
          fecha,
          label: labelDia(now),
          highlight: "",
          gratitud: "",
          letGo: "",
          animo: 0,
          iniciado: true,
        },
      };
    });
    post("/api/dia", { campo: "iniciar", valor: true });
  }, []);

  const setCampo = useCallback(
    (field: "highlight" | "gratitud" | "letGo", value: string) => {
      setState((s) => ({ ...s, dia: { ...s.dia, [field]: value } }));
      postDebounced(field, "/api/dia", { campo: CAMPO_A_COLUMNA[field], valor: value });
    },
    [postDebounced],
  );

  const setAnimo = useCallback(
    (n: number) => {
      setState((s) => ({ ...s, dia: { ...s.dia, animo: n } }));
      postDebounced("animo", "/api/dia", { campo: "animo", valor: n });
    },
    [postDebounced],
  );

  const togglePaso = useCallback((planId: string, n: number) => {
    const plan = stateRef.current.planes.find((p) => p.id === planId);
    const paso = plan?.pasos.find((x) => x.n === n);
    const nuevoValor = !paso?.done;
    setState((s) => ({
      ...s,
      planes: s.planes.map((p) =>
        p.id !== planId
          ? p
          : {
              ...p,
              staleDays: 0,
              pasos: p.pasos.map((x) => (x.n === n ? { ...x, done: nuevoValor } : x)),
            },
      ),
    }));
    post("/api/paso", { id: planId, n, done: nuevoValor });
  }, []);

  const toggleHabitoHoy = useCallback((nombre: string) => {
    const habito = stateRef.current.habitos.find((h) => h.nombre === nombre);
    const actual = habito ? habito.dias[habito.dias.length - 1] : false;
    const nuevoValor = !actual;
    setState((s) => ({
      ...s,
      habitos: s.habitos.map((h) =>
        h.nombre !== nombre
          ? h
          : { ...h, dias: h.dias.map((d, i) => (i === h.dias.length - 1 ? nuevoValor : d)) },
      ),
    }));
    const columna = HABITO_COLUMNAS.find((h) => h.nombre === nombre)?.columna;
    if (columna) post("/api/dia", { campo: columna, valor: nuevoValor });
  }, []);

  const capturar = useCallback((texto: string, tipo: TipoCaptura) => {
    const id =
      typeof globalThis.crypto?.randomUUID === "function"
        ? globalThis.crypto.randomUUID()
        : String(Date.now());
    setState((s) => ({
      ...s,
      inbox: [{ id, fecha: new Date().toISOString(), texto, tipo }, ...s.inbox],
    }));
    post("/api/inbox", { texto, tipo });
  }, []);

  const value = useMemo<Ctx>(
    () => ({ state, hydrated, nuevoDia, setCampo, setAnimo, togglePaso, toggleHabitoHoy, capturar }),
    [state, hydrated, nuevoDia, setCampo, setAnimo, togglePaso, toggleHabitoHoy, capturar],
  );

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("useApp debe usarse dentro de <StoreProvider>");
  return ctx;
}
