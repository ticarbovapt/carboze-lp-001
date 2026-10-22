import { NextResponse } from "next/server";
import { insertRow } from "@/lib/supabase";
import { enviarWhatsApp } from "@/lib/evolution";
import { msgListaEspera } from "@/lib/paradaCertaMensagens";

export const dynamic = "force-dynamic";

type Corpo = { nome?: string; telefone?: string; veiculo?: string };

function normalizarTelefone(bruto: string) {
  const d = bruto.replace(/\D/g, "");
  if (d.length === 10 || d.length === 11) return "55" + d;
  return d;
}

export async function POST(req: Request) {
  let b: Corpo;
  try {
    b = (await req.json()) as Corpo;
  } catch {
    return NextResponse.json({ ok: false, erro: "corpo" }, { status: 400 });
  }

  const nome = String(b.nome ?? "").trim();
  const telefone = normalizarTelefone(String(b.telefone ?? ""));
  const veiculo = String(b.veiculo ?? "").trim();

  if (nome.length < 3 || telefone.length < 12 || telefone.length > 13 || !veiculo) {
    return NextResponse.json({ ok: false, erro: "dados" }, { status: 400 });
  }

  try {
    await insertRow("parada_certa_lista_espera", { nome, telefone, veiculo });
  } catch {
    return NextResponse.json({ ok: false, erro: "banco" }, { status: 502 });
  }

  try {
    const envio = await enviarWhatsApp(telefone, msgListaEspera(nome));
    if (envio.ok) {
      console.log("[parada-certa] espera: confirmação enviada", { status: envio.status });
    } else {
      console.error("[parada-certa] espera: confirmação NÃO enviada", envio);
    }
  } catch (e) {
    console.error("[parada-certa] espera: erro ao enviar", e);
  }

  return NextResponse.json({ ok: true });
}
