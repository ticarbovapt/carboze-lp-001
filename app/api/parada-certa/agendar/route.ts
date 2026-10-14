import { NextResponse } from "next/server";
import { callRpc } from "@/lib/supabase";
import { enviarWhatsApp } from "@/lib/evolution";
import { msgConfirmacao } from "@/lib/paradaCertaMensagens";

export const dynamic = "force-dynamic";

type Corpo = {
  nome?: string;
  telefone?: string;
  veiculo?: string;
  ano?: string;
  km?: string;
  data?: string;
  horario?: string;
};
type AgendarResp = { ok: boolean; erro?: string };

function normalizarTelefone(bruto: string) {
  const d = bruto.replace(/\D/g, "");
  if (d.length === 10 || d.length === 11) return "55" + d;
  return d; // já veio com DDI (ou inválido — o banco rejeita)
}

export async function POST(req: Request) {
  let b: Corpo;
  try {
    b = (await req.json()) as Corpo;
  } catch {
    return NextResponse.json({ ok: false, erro: "corpo" }, { status: 400 });
  }

  const telefone = normalizarTelefone(String(b.telefone ?? ""));

  // 1) Grava o agendamento (com a trava de capacidade do banco)
  let r: AgendarResp;
  try {
    r = await callRpc<AgendarResp>("parada_certa_agendar", {
      p_nome: b.nome ?? "",
      p_telefone: telefone,
      p_veiculo: b.veiculo ?? "",
      p_ano: b.ano ?? "",
      p_km: b.km ?? "",
      p_data: b.data ?? "",
      p_horario: b.horario ?? "",
    });
  } catch {
    return NextResponse.json({ ok: false, erro: "banco" }, { status: 502 });
  }

  // 2) Confirmação por WhatsApp — best-effort. Se o Evolution falhar ou
  //    ainda não estiver configurado, o agendamento continua válido.
  if (r?.ok) {
    try {
      const envio = await enviarWhatsApp(
        telefone,
        msgConfirmacao(b.nome ?? "", b.horario ?? ""),
      );
      if (envio.ok) {
        console.log("[parada-certa] confirmação enviada", { status: envio.status });
      } else {
        console.error("[parada-certa] confirmação NÃO enviada", envio);
      }
    } catch (e) {
      console.error("[parada-certa] erro ao enviar confirmação", e);
    }
  }

  return NextResponse.json(r);
}
