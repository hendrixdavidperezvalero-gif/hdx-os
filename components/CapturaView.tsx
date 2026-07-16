"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { BackBar, Screen } from "@/components/ui";
import { useApp } from "@/lib/store";
import type { TipoCaptura } from "@/lib/types";

const TIPOS: TipoCaptura[] = ["idea", "tarea", "persona", "video"];
const BARS = [8, 14, 20, 11, 18, 9, 16, 12, 10, 15, 8, 13, 7, 11];

export function CapturaView({ initialTipo = "idea" }: { initialTipo?: TipoCaptura }) {
  const { capturar } = useApp();
  const router = useRouter();
  const [texto, setTexto] = useState("");
  const [tipo, setTipo] = useState<TipoCaptura>(initialTipo);
  const ref = useRef<HTMLTextAreaElement>(null);

  const guardar = () => {
    const t = texto.trim();
    if (!t) return;
    capturar(t, tipo);
    router.push("/");
  };

  return (
    <Screen>
      <BackBar title="Captura rápida" />

      <textarea
        ref={ref}
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        aria-label="Captura rápida"
        placeholder="¿Qué tienes en mente?"
        rows={5}
        className="min-h-[150px] resize-none rounded-[11px] border border-line bg-surface p-4 text-[16px] leading-[1.5] text-ink shadow-[var(--shadow-card)] outline-none placeholder:text-ink-faint"
      />

      <div className="flex items-center gap-[14px]">
        <button
          onClick={() => ref.current?.focus()}
          aria-label="Dictar con el teclado"
          className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-accent"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            className="stroke-accent-ink"
            strokeWidth={2}
            strokeLinecap="round"
          >
            <rect x="9" y="2" width="6" height="12" rx="3" />
            <path d="M5 10v1a7 7 0 0 0 14 0v-1" />
            <path d="M12 18v4" />
          </svg>
        </button>
        <div className="flex flex-1 flex-col gap-[6px]">
          <div className="flex h-[22px] items-center gap-[3px]">
            {BARS.map((h, i) => (
              <span
                key={i}
                className={`w-[3px] rounded-[2px] ${i < 8 ? "bg-accent" : "bg-line2"}`}
                style={{ height: h }}
              />
            ))}
          </div>
          <span className="font-mono text-[11px] text-ink-faint">dictando… (mic del teclado)</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {TIPOS.map((t) => {
          const sel = t === tipo;
          return (
            <button
              key={t}
              onClick={() => setTipo(t)}
              className={`flex min-h-[44px] items-center rounded-lg px-4 font-mono text-[12px] font-semibold ${
                sel ? "bg-ink text-paper" : "border border-dashed border-line2 text-ink-soft"
              }`}
            >
              {t}
            </button>
          );
        })}
      </div>

      <button
        onClick={guardar}
        disabled={!texto.trim()}
        className="flex min-h-[48px] items-center justify-center rounded-lg bg-panel font-mono text-[13px] font-semibold text-panel-ink disabled:cursor-not-allowed disabled:opacity-50"
      >
        Guardar en el inbox
      </button>
    </Screen>
  );
}
