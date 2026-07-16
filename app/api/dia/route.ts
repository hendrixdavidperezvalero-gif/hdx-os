// HDX OS — POST de un campo del día de hoy (Make Time, hábitos, o "iniciar" el día).
import { NextResponse } from "next/server";
import { upsertDia, type CampoDia } from "@/lib/buzon";

export const dynamic = "force-dynamic";

const CAMPOS_VALIDOS: CampoDia[] = [
  "highlight",
  "gratitud",
  "let_go",
  "animo",
  "rutina_ok",
  "gym",
  "leer",
  "iniciar",
];

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const campo = body?.campo;
    if (typeof campo !== "string" || !CAMPOS_VALIDOS.includes(campo as CampoDia)) {
      return NextResponse.json({ ok: false, error: "campo inválido" }, { status: 400 });
    }
    await upsertDia(campo as CampoDia, body?.valor);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[api/dia] POST", e);
    if (e instanceof Error && /no configurado/.test(e.message)) {
      return NextResponse.json({ ok: false, error: "buzon no configurado" }, { status: 503 });
    }
    return NextResponse.json({ ok: false, error: "no se pudo guardar" }, { status: 500 });
  }
}
