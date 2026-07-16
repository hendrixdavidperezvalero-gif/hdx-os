"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { AppState, TipoCaptura } from "./types";
import { seedState } from "./seed";

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

  // "Nuevo día": arranca la hoja de HOY. Si el día actual ya está iniciado no
  // se re-escribe (no borra un Highlight/Gratitud ya tecleado); solo rueda
  // cuando cambió la fecha del calendario.
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
  }, []);

  const setCampo = useCallback(
    (field: "highlight" | "gratitud" | "letGo", value: string) => {
      setState((s) => ({ ...s, dia: { ...s.dia, [field]: value } }));
    },
    [],
  );

  const setAnimo = useCallback((n: number) => {
    setState((s) => ({ ...s, dia: { ...s.dia, animo: n } }));
  }, []);

  const togglePaso = useCallback((planId: string, n: number) => {
    setState((s) => ({
      ...s,
      planes: s.planes.map((p) =>
        p.id !== planId
          ? p
          : {
              ...p,
              staleDays: 0,
              pasos: p.pasos.map((x) => (x.n === n ? { ...x, done: !x.done } : x)),
            },
      ),
    }));
  }, []);

  const toggleHabitoHoy = useCallback((nombre: string) => {
    setState((s) => ({
      ...s,
      habitos: s.habitos.map((h) =>
        h.nombre !== nombre
          ? h
          : { ...h, dias: h.dias.map((d, i) => (i === h.dias.length - 1 ? !d : d)) },
      ),
    }));
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
