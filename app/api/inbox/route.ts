// HDX OS — POST de una captura rápida al inbox del buzón (la app solo escribe).
import { NextResponse } from "next/server";
import { addInbox } from "@/lib/buzon";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const texto = typeof body?.texto === "string" ? body.texto.trim() : "";
    const tipo = typeof body?.tipo === "string" ? body.tipo : "";
    if (!texto || !tipo) {
      return NextResponse.json({ ok: false, error: "falta texto o tipo" }, { status: 400 });
    }
    await addInbox(texto, tipo);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[api/inbox] POST", e);
    if (e instanceof Error && /no configurado/.test(e.message)) {
      return NextResponse.json({ ok: false, error: "buzon no configurado" }, { status: 503 });
    }
    return NextResponse.json({ ok: false, error: "no se pudo guardar" }, { status: 500 });
  }
}
