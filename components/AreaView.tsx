"use client";

import { BackBar, Screen, SectionLabel } from "@/components/ui";
import { useApp } from "@/lib/store";

export function AreaView({ slug }: { slug: string }) {
  const { state } = useApp();
  const area = state.areas.find((a) => a.slug === slug);

  if (!area) {
    return (
      <Screen>
        <BackBar title="Área" />
        <div className="flex flex-1 flex-col items-center justify-center gap-2 py-16 text-center">
          <span className="font-mono text-[22px] text-line2">◇</span>
          <p className="text-[14px] text-ink-soft">Esa área no existe todavía.</p>
        </div>
      </Screen>
    );
  }

  return (
    <Screen>
      <BackBar title={area.nombre} />

      <div className="flex flex-col gap-[10px]">
        <SectionLabel>Sub-áreas</SectionLabel>
        {area.subareas.map((s) => (
          <div
            key={s.nombre}
            className="flex min-h-[44px] items-center justify-between rounded-[11px] border border-line bg-surface p-4 shadow-[var(--shadow-card)]"
          >
            <div className="flex flex-col gap-1">
              <span className="text-[15px] font-bold tracking-[-0.01em]">{s.nombre}</span>
              <span
                className={`font-mono text-[12px] ${
                  s.tone === "warn" ? "font-semibold text-warn" : "text-ink-soft"
                }`}
              >
                {s.nota}
              </span>
            </div>
            <span className="font-mono text-[16px] font-semibold text-ink-faint">›</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-[10px]">
        <SectionLabel>Notas recientes del área</SectionLabel>
        {area.notas.length === 0 ? (
          <div className="rounded-[11px] border border-line bg-surface px-4 py-6 text-center font-mono text-[12px] text-ink-faint">
            Sin notas todavía.
          </div>
        ) : (
          <div className="rounded-[11px] border border-line bg-surface px-4">
            {area.notas.map((n, i) => (
              <div key={i}>
                {i > 0 && <div className="h-px bg-divider" />}
                <div className="flex min-h-[48px] items-center justify-between gap-3">
                  <span className="truncate text-[14px]">{n.texto}</span>
                  <span className="flex-none font-mono text-[11px] text-ink-faint">{n.hora}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Screen>
  );
}
