import { NextResponse } from "next/server";
import { callRpc } from "@/lib/supabase";
import { enviarWhatsApp } from "@/lib/evolution";

export const dynamic = "force-dynamic";

type Corpo = { id?: string; vale?: boolean; senha?: string };
type ValeResp = {
  ok: boolean;
  erro?: string;
  codigo?: string;
  nome?: string;
  telefone?: string;
};

function msgVale(nome: string, codigo: string) {
  const pn = nome.trim().split(/\s+/)[0] || nome.trim();
  return `🎉 Parabéns, ${pn}! Você ganhou um VALE-COMBUSTÍVEL do CarboZé!

Seu código do voucher: *${codigo}*

Guarde este código e apresente no posto para retirar. 💙`;
}

export async function POST(req: Request) {
  let b: Corpo;
  try {
    b = (await req.json()) as Corpo;
  } catch {
    return NextResponse.json({ ok: false, erro: "corpo" }, { status: 400 });
  }
  if (!b.id || !b.senha) {
    return NextResponse.json({ ok: false, erro: "dados" }, { status: 400 });
  }

  let r: ValeResp;
  try {
    r = await callRpc<ValeResp>("teste_carboze_vale", {
      p_id: b.id,
      p_vale: !!b.vale,
      p_senha: b.senha,
    });
  } catch {
    return NextResponse.json({ ok: false, erro: "banco" }, { status: 502 });
  }

  // Ao DAR o vale, envia o código por WhatsApp (best-effort).
  if (r?.ok && b.vale && r.codigo && r.telefone) {
    try {
      const envio = await enviarWhatsApp(r.telefone, msgVale(r.nome ?? "", r.codigo));
      if (envio.ok) {
        console.log("[recebermeucarboze] vale enviado", { status: envio.status });
      } else {
        console.error("[recebermeucarboze] vale NÃO enviado", envio);
      }
    } catch (e) {
      console.error("[recebermeucarboze] erro ao enviar vale", e);
    }
  }

  return NextResponse.json(r);
}
