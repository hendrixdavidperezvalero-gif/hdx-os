import { CapturaView } from "@/components/CapturaView";
import type { TipoCaptura } from "@/lib/types";

const TIPOS = ["idea", "tarea", "persona", "video"];

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ t?: string }>;
}) {
  const sp = await searchParams;
  const t = (TIPOS.includes(sp.t ?? "") ? sp.t : "idea") as TipoCaptura;
  return <CapturaView initialTipo={t} />;
}
