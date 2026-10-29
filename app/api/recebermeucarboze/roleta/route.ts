import { NextResponse } from "next/server";
import { callRpc } from "@/lib/supabase";
import { enviarWhatsApp, enviarImagemWhatsApp } from "@/lib/evolution";
import { calcularChances, sortear, type PremioEstado, type Modo } from "@/lib/roletaChances";

export const dynamic = "force-dynamic";

type Prep = {
  ok: boolean;
  erro?: string;
  extra?: boolean;
  hora?: number;
  bag_ganhos?: number;
  modo?: Modo;
  ritmo?: number;
  premios?: PremioEstado[];
};
type Reg = {
  ok: boolean;
  erro?: string;
  tipo?: string;
  premio?: string;
  codigo?: string;
  nome?: string;
  telefone?: string;
};

function msgVale(nome: string, codigo: string) {
  const pn = nome.trim().split(/\s+/)[0] || nome.trim();
  return `🎉 Parabéns, ${pn}! Você ganhou um *VALE-COMBUSTÍVEL de 5 litros* do CarboZé!

Seu código: *${codigo}*

Apresente este voucher (imagem acima, com o QR Code) no posto para retirar. 💙`;
}

export async function POST(req: Request) {
  let b: { cadastro_id?: string; senha?: string };
  try {
    b = (await req.json()) as { cadastro_id?: string; senha?: string };
  } catch {
    return NextResponse.json({ ok: false, erro: "corpo" }, { status: 400 });
  }
  if (!b.cadastro_id || !b.senha) {
    return NextResponse.json({ ok: false, erro: "dados" }, { status: 400 });
  }

  let prep: Prep;
  try {
    prep = await callRpc<Prep>("roleta_preparar", {
      p_cadastro_id: b.cadastro_id,
      p_senha: b.senha,
    });
  } catch {
    return NextResponse.json({ ok: false, erro: "banco" }, { status: 502 });
  }
  if (!prep?.ok) return NextResponse.json({ ok: false, erro: prep?.erro ?? "erro" });

  const chances = calcularChances(
    prep.premios ?? [],
    prep.hora ?? 9,
    !!prep.extra,
    prep.bag_ganhos ?? 0,
    prep.modo ?? "auto",
    prep.ritmo ?? 0,
  );
  let slug = sortear(chances);

  async function registrar(s: string) {
    return callRpc<Reg>("roleta_registrar", {
      p_cadastro_id: b.cadastro_id,
      p_slug: s,
      p_extra: !!prep.extra,
      p_senha: b.senha,
    });
  }

  let reg: Reg;
  try {
    reg = await registrar(slug);
  } catch {
    return NextResponse.json({ ok: false, erro: "banco" }, { status: 502 });
  }

  // Se o prêmio acabou entre preparar e registrar, cai para "Não foi dessa vez".
  if (!reg?.ok && (reg?.erro === "sem_estoque" || reg?.erro === "sem_codigos")) {
    slug = "nada";
    try {
      reg = await registrar("nada");
    } catch {
      return NextResponse.json({ ok: false, erro: "banco" }, { status: 502 });
    }
  }
  if (!reg?.ok) return NextResponse.json({ ok: false, erro: reg?.erro ?? "erro" });

  // Vale → envia o voucher no WhatsApp (imagem; fallback texto).
  if (reg.tipo === "vale" && reg.codigo && reg.telefone) {
    const legenda = msgVale(reg.nome ?? "", reg.codigo);
    const url = `https://www.carboze.com.br/vouchers/${reg.codigo}.png`;
    try {
      const envio = await enviarImagemWhatsApp(reg.telefone, url, legenda);
      if (envio.ok) {
        console.log("[roleta] voucher enviado", { status: envio.status });
      } else {
        console.error("[roleta] voucher (imagem) falhou; mandando texto", envio);
        await enviarWhatsApp(reg.telefone, legenda);
      }
    } catch (e) {
      console.error("[roleta] erro ao enviar voucher", e);
      try {
        await enviarWhatsApp(reg.telefone, legenda);
      } catch {
        /* ignora */
      }
    }
  }

  return NextResponse.json({
    ok: true,
    slug,
    tipo: reg.tipo,
    premio: reg.premio,
    codigo: reg.codigo,
    extra: !!prep.extra,
  });
}
