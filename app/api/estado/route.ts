// HDX OS — GET del estado consolidado del buzón (día, hábitos, racha, planes).
import { NextResponse } from "next/server";
import { getEstado } from "@/lib/buzon";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const estado = await getEstado();
    return NextResponse.json({ ok: true, ...estado });
  } catch (e) {
    console.error("[api/estado] GET", e);
    if (e instanceof Error && /no configurado/.test(e.message)) {
      return NextResponse.json({ ok: false, error: "buzon no configurado" }, { status: 503 });
    }
    return NextResponse.json({ ok: false, error: "no se pudo leer el buzón" }, { status: 500 });
  }
}
