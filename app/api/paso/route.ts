// HDX OS — POST de un toggle de paso de un plan (marcado hecho/no hecho).
import { NextResponse } from "next/server";
import { marcarPaso } from "@/lib/buzon";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const id = body?.id;
    const n = body?.n;
    const done = body?.done;
    if (typeof id !== "string" || !id || typeof n !== "number" || typeof done !== "boolean") {
      return NextResponse.json({ ok: false, error: "body inválido" }, { status: 400 });
    }
    await marcarPaso(id, n, done);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[api/paso] POST", e);
    if (e instanceof Error && /no configurado/.test(e.message)) {
      return NextResponse.json({ ok: false, error: "buzon no configurado" }, { status: 503 });
    }
    return NextResponse.json({ ok: false, error: "no se pudo guardar" }, { status: 500 });
  }
}
