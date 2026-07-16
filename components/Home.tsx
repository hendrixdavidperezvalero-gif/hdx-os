"use client";

import Link from "next/link";
import { useApp } from "@/lib/store";
import { Screen, SectionLabel, Wordmark } from "@/components/ui";
import {
  esEstancado,
  habitoConteo,
  pasoActual,
  planAvance,
  type Habito,
  type Plan,
} from "@/lib/types";

export function Home() {
  const { state, nuevoDia, setCampo, setAnimo, toggleHabitoHoy } = useApp();
  const { dia, planes, habitos, areas, rachaRitual } = state;

  return (
    <Screen>
      {/* Barra superior */}
      <div className="flex min-h-[32px] items-center justify-between">
        <Wordmark />
        <span className="font-mono text-[12px] text-ink-soft">{dia.label}</span>
      </div>

      {/* Saludo */}
      <div className="flex flex-col gap-[5px]">
        <h1 className="text-[22px] font-bold leading-[1.15] tracking-[-0.01em]">
          Buenos días, Hendrix
        </h1>
        <p className="font-mono text-[12px] text-ink-soft">
          {planes.length} planes vivos · racha de ritual: {rachaRitual} días
        </p>
      </div>

      {/* Acciones rápidas */}
      <div className="flex gap-2">
        <button
          onClick={nuevoDia}
          className="flex min-h-[44px] items-center rounded-lg bg-accent px-4 font-mono text-[13px] font-semibold text-accent-ink"
        >
          + Nuevo día
        </button>
        <Link
          href="/captura"
          className="flex min-h-[44px] items-center rounded-lg border border-line2 bg-surface px-[14px] font-mono text-[13px] font-semibold text-ink"
        >
          + idea
        </Link>
        <Link
          href="/captura?t=persona"
          className="flex min-h-[44px] items-center rounded-lg border border-line2 bg-surface px-[14px] font-mono text-[13px] font-semibold text-ink"
        >
          + persona
        </Link>
      </div>

      {/* Make Time */}
      <div className="flex flex-col gap-[14px] rounded-[11px] border border-line bg-surface p-4 shadow-[var(--shadow-card)]">
        <SectionLabel>Make Time</SectionLabel>
        <Field
          label="Highlight"
          value={dia.highlight}
          placeholder="lo único de hoy…"
          onChange={(v) => setCampo("highlight", v)}
        />
        <Divider />
        <Field
          label="Gratitud"
          value={dia.gratitud}
          placeholder="escribir…"
          onChange={(v) => setCampo("gratitud", v)}
        />
        <Divider />
        <Field
          label="Let go"
          value={dia.letGo}
          placeholder="escribir…"
          onChange={(v) => setCampo("letGo", v)}
        />
        <Divider />
        <div className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
              Ánimo
            </span>
            <span className="font-mono text-[12px] font-bold text-accent">
              {dia.animo}
              <span className="font-normal text-ink-faint">/10</span>
            </span>
          </div>
          <div className="flex justify-between">
            {Array.from({ length: 10 }).map((_, i) => {
              const on = i < dia.animo;
              return (
                <button
                  key={i}
                  aria-label={`Ánimo ${i + 1} de 10`}
                  aria-pressed={on}
                  onClick={() => setAnimo(i + 1)}
                  className="flex min-h-[44px] flex-1 items-center justify-center"
                >
                  <span
                    className={`h-4 w-4 rounded-full ${on ? "bg-accent" : "border border-line2"}`}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Hoy · paso actual de cada plan */}
      <div className="flex flex-col gap-[10px]">
        <SectionLabel>Hoy · paso actual de cada plan</SectionLabel>
        <div className="grid grid-cols-2 gap-[10px]">
          {planes.map((p) => (
            <PlanTile key={p.id} plan={p} />
          ))}
        </div>
      </div>

      {/* Hábitos */}
      <div className="flex flex-col gap-[10px]">
        <SectionLabel>Hábitos</SectionLabel>
        <div className="rounded-[11px] border border-line bg-surface px-[14px]">
          {habitos.map((h, idx) => (
            <div key={h.nombre}>
              {idx > 0 && <div className="h-px bg-divider" />}
              <HabitRow habito={h} onToggle={() => toggleHabitoHoy(h.nombre)} />
            </div>
          ))}
        </div>
      </div>

      {/* Mentor */}
      <div className="flex min-h-[44px] items-center justify-between rounded-lg bg-surface2 px-[14px] py-3">
        <span className="font-mono text-[12px] text-ink-soft">
          Pregúntale a tu vida{" "}
          <span className="text-ink-faint">— Claude Code lee el vault</span>
        </span>
        <span className="font-mono text-[14px] font-semibold text-ink-faint">›</span>
      </div>

      {/* Áreas */}
      <div className="flex flex-col gap-[10px]">
        <SectionLabel>Áreas</SectionLabel>
        <div className="flex flex-wrap gap-2">
          {areas.map((a) => (
            <Link
              key={a.slug}
              href={`/area/${a.slug}`}
              className="flex min-h-[44px] items-center rounded-lg border border-line2 bg-surface px-4 font-mono text-[12px] font-semibold text-ink"
            >
              {a.nombre}
            </Link>
          ))}
        </div>
      </div>
    </Screen>
  );
}

function Divider() {
  return <div className="h-px bg-divider" />;
}

function Field({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex flex-col gap-[3px]">
      <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
        {label}
      </span>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent text-[15px] text-ink outline-none placeholder:font-normal placeholder:text-ink-faint"
        style={{ fontWeight: value ? 500 : 400 }}
      />
    </label>
  );
}

function PlanTile({ plan }: { plan: Plan }) {
  const stale = esEstancado(plan);
  const avance = planAvance(plan);
  const total = plan.pasos.length;
  const actual = pasoActual(plan);
  const pct = Math.round((avance / total) * 100);
  return (
    <Link
      href={`/plan/${plan.id}`}
      className={`flex flex-col gap-[9px] rounded-[11px] border bg-surface p-[14px] ${
        stale ? "border-warn" : "border-line"
      }`}
    >
      <span
        className={`self-start rounded-[5px] px-[7px] py-[3px] font-mono text-[9px] font-semibold uppercase tracking-[0.12em] ${
          stale ? "bg-warn-soft text-warn" : "bg-surface2 text-ink-soft"
        }`}
      >
        {stale ? `Estancado ${plan.staleDays} d` : plan.areaTag}
      </span>
      <span className="text-[14px] font-bold leading-[1.25] tracking-[-0.01em]">
        {plan.titulo}
      </span>
      <div className="flex items-center gap-2">
        <span className="h-1 flex-1 overflow-hidden rounded-full bg-divider">
          <span
            className={`block h-full ${stale ? "bg-warn" : "bg-accent"}`}
            style={{ width: `${pct}%` }}
          />
        </span>
        <span className="tnum font-mono text-[11px] font-bold text-ink-soft">
          {avance}/{total}
        </span>
      </div>
      <span className={`font-mono text-[12px] ${stale ? "text-warn" : "text-accent"}`}>
        → {actual ? actual.texto : "completado"}
      </span>
    </Link>
  );
}

function HabitRow({ habito, onToggle }: { habito: Habito; onToggle: () => void }) {
  const conteo = habitoConteo(habito);
  return (
    <button
      onClick={onToggle}
      className="flex min-h-[44px] w-full items-center justify-between text-left"
    >
      <span className="text-[14px] font-medium">{habito.nombre}</span>
      <span className="flex items-center gap-[10px]">
        <span className="flex gap-[5px]">
          {habito.dias.map((d, i) => {
            const hoy = i === habito.dias.length - 1;
            return (
              <span
                key={i}
                title={hoy ? "hoy" : undefined}
                className={`h-[13px] w-[13px] rounded-[3px] ${
                  d ? "bg-good" : "border border-line2"
                } ${hoy ? "ring-2 ring-ink-faint" : ""}`}
              />
            );
          })}
        </span>
        <span className="tnum font-mono text-[11px] font-bold text-good">×{conteo}</span>
      </span>
    </button>
  );
}
