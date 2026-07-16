"use client";

import { BackBar, Screen } from "@/components/ui";
import { useApp } from "@/lib/store";
import { pasoActual, planAvance } from "@/lib/types";

export function PlanView({ id }: { id: string }) {
  const { state, togglePaso } = useApp();
  const plan = state.planes.find((p) => p.id === id);

  if (!plan) {
    return (
      <Screen>
        <BackBar title="Plan" />
        <div className="flex flex-1 flex-col items-center justify-center gap-2 py-16 text-center">
          <span className="font-mono text-[22px] text-line2">◇</span>
          <p className="text-[14px] text-ink-soft">Este plan no existe.</p>
          <p className="font-mono text-[12px] text-ink-faint">
            Escribe uno en tu cuaderno con ## Pasos.
          </p>
        </div>
      </Screen>
    );
  }

  const avance = planAvance(plan);
  const total = plan.pasos.length;
  const pct = Math.round((avance / total) * 100);
  const actualN = pasoActual(plan)?.n;

  return (
    <Screen>
      <BackBar title="Plan" />

      <div className="flex flex-col gap-[5px]">
        <h1 className="text-[22px] font-bold leading-[1.15] tracking-[-0.01em]">{plan.titulo}</h1>
        <p className="font-mono text-[12px] text-ink-faint">{plan.proyecto} · plan</p>
      </div>

      <div className="flex items-center gap-[10px]">
        <span className="h-1 flex-1 overflow-hidden rounded-full bg-divider">
          <span className="block h-full bg-accent" style={{ width: `${pct}%` }} />
        </span>
        <span className="tnum font-mono text-[12px] font-bold text-ink-soft">
          {avance}/{total}
        </span>
      </div>

      <div className="flex flex-col gap-[2px]">
        {plan.pasos.map((paso) => {
          const isCurrent = paso.n === actualN;
          return (
            <button
              key={paso.n}
              onClick={() => togglePaso(plan.id, paso.n)}
              className={`flex min-h-[48px] items-center gap-3 rounded-lg px-3 text-left ${
                isCurrent ? "border border-accent bg-accent-soft" : ""
              }`}
            >
              <span
                className={`flex h-[22px] w-[22px] flex-none items-center justify-center rounded-[5px] font-mono text-[13px] font-bold ${
                  paso.done
                    ? "bg-good text-good-ink"
                    : isCurrent
                      ? "border-[1.5px] border-accent"
                      : "border border-line2"
                }`}
              >
                {paso.done ? "✓" : ""}
              </span>
              <span
                className={`text-[14px] ${
                  paso.done
                    ? "text-ink-faint line-through"
                    : isCurrent
                      ? "font-semibold text-ink"
                      : "text-ink-faint"
                }`}
              >
                {paso.n}. {paso.texto}
              </span>
            </button>
          );
        })}
      </div>

      <p className="text-center font-mono text-[11px] text-ink-faint">
        Este plan vive en tu cuaderno. Toca para marcarlo hecho.
      </p>
    </Screen>
  );
}
