import { NextResponse } from "next/server";
import { insertRow } from "@/lib/supabase";
import { enviarWhatsApp } from "@/lib/evolution";

export const dynamic = "force-dynamic";

type Corpo = {
  nome?: string;
  telefone?: string;
  modelo_moto?: string;
  instagram?: string | null;
  autoriza_imagem?: boolean;
};

function msgCadastro(nome: string) {
  const pn = nome.trim().split(/\s+/)[0] || nome.trim();
  return `Olá, ${pn}! ✅ Recebemos o seu cadastro para testar o *CarboZé* na sua moto.

Em breve a nossa equipe entra em contato por aqui com os próximos passos.

Obrigado por participar! 💚`;
}

export async function POST(req: Request) {
  let b: Corpo;
  try {
    b = (await req.json()) as Corpo;
  } catch {
    return NextResponse.json({ ok: false, erro: "corpo" }, { status: 400 });
  }

  const nome = String(b.nome ?? "").trim();
  const digits = String(b.telefone ?? "").replace(/\D/g, "");
  const telefone = digits.length === 10 || digits.length === 11 ? "55" + digits : digits;
  const modelo = String(b.modelo_moto ?? "").trim();
  const ig = b.instagram ? String(b.instagram).trim() : "";
  const instagram = ig ? (ig.startsWith("@") ? ig : `@${ig}`) : null;

  if (
    nome.length < 3 ||
    telefone.length < 12 ||
    telefone.length > 13 ||
    !modelo ||
    !b.autoriza_imagem
  ) {
    return NextResponse.json({ ok: false, erro: "dados" }, { status: 400 });
  }

  // 1) Grava o cadastro
  try {
    await insertRow("teste_carboze", {
      nome,
      telefone,
      modelo_moto: modelo,
      instagram,
      autoriza_imagem: true,
    });
  } catch {
    return NextResponse.json({ ok: false, erro: "banco" }, { status: 502 });
  }

  // 2) Confirmação por WhatsApp — best-effort (não derruba o cadastro)
  try {
    const envio = await enviarWhatsApp(telefone, msgCadastro(nome));
    if (envio.ok) {
      console.log("[recebermeucarboze] confirmação enviada", { status: envio.status });
    } else {
      console.error("[recebermeucarboze] confirmação NÃO enviada", envio);
    }
  } catch (e) {
    console.error("[recebermeucarboze] erro ao enviar confirmação", e);
  }

  return NextResponse.json({ ok: true });
}
