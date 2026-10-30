import { NextResponse } from "next/server";
import { callRpc } from "@/lib/supabase";
import { enviarWhatsApp, enviarImagemWhatsApp } from "@/lib/evolution";

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
  return `🎉 Parabéns, ${pn}! Você ganhou um *VALE-COMBUSTÍVEL de 5 litros*!

Seu código: *${codigo}*

Apresente este voucher (imagem acima, com o QR Code) no posto para retirar. 💙`;
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

  // Ao DAR o vale, envia a IMAGEM do voucher (com o código + QR) por WhatsApp.
  // Best-effort: se a imagem falhar, manda ao menos o texto com o código.
  if (r?.ok && b.vale && r.codigo && r.telefone) {
    const legenda = msgVale(r.nome ?? "", r.codigo);
    const urlVoucher = `https://www.carboze.com.br/vouchers/${r.codigo}.png`;
    try {
      const envio = await enviarImagemWhatsApp(r.telefone, urlVoucher, legenda);
      if (envio.ok) {
        console.log("[recebermeucarboze] voucher enviado", { status: envio.status });
      } else {
        console.error("[recebermeucarboze] voucher (imagem) falhou; mandando texto", envio);
        await enviarWhatsApp(r.telefone, legenda);
      }
    } catch (e) {
      console.error("[recebermeucarboze] erro ao enviar voucher", e);
      try {
        await enviarWhatsApp(r.telefone, legenda);
      } catch {
        /* ignora */
      }
    }
  }

  return NextResponse.json(r);
}
