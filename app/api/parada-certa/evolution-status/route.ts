import { NextResponse } from "next/server";
import { enviarWhatsApp, estadoConexao, evolutionInfo } from "@/lib/evolution";

export const dynamic = "force-dynamic";

// Endpoint de diagnóstico (temporário).
//   GET /api/parada-certa/evolution-status
//     -> mostra se está configurado e o estado da conexão (não envia nada).
//   GET /api/parada-certa/evolution-status?to=55DDDNUMERO&secret=<EVOLUTION_APIKEY>
//     -> envia uma mensagem de teste e devolve a resposta do Evolution.
export async function GET(req: Request) {
  const u = new URL(req.url);
  const to = u.searchParams.get("to");
  const secret = u.searchParams.get("secret");
  const info = evolutionInfo();

  if (to) {
    if (!secret || secret !== process.env.EVOLUTION_APIKEY) {
      return NextResponse.json({ ok: false, erro: "secret_invalido" }, { status: 401 });
    }
    const envio = await enviarWhatsApp(to, "Teste Parada Certa — integração OK ✅");
    return NextResponse.json({ info, envio });
  }

  const conexao = await estadoConexao();
  return NextResponse.json({ info, conexao });
}
