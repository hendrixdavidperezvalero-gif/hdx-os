import Link from "next/link";
import type { ReactNode } from "react";

export function Screen({ children }: { children: ReactNode }) {
  return <div className="flex flex-1 flex-col gap-5 px-5 pb-9 pt-5">{children}</div>;
}

export function Wordmark() {
  return (
    <span className="font-mono text-[15px] font-bold">
      hdx_os<span className="text-accent">▍</span>
    </span>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-faint">
      {children}
    </div>
  );
}

export function BackBar({ title }: { title: string }) {
  return (
    <div className="flex min-h-[44px] items-center justify-between">
      <Link
        href="/"
        className="-mx-1 rounded px-1 font-mono text-[13px] font-semibold text-ink-soft"
      >
        ‹ Home
      </Link>
      <span className="font-mono text-[12px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
        {title}
      </span>
    </div>
  );
}
