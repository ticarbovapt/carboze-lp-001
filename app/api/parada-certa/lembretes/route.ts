import { NextResponse } from "next/server";
import { callRpc } from "@/lib/supabase";
import { enviarWhatsApp } from "@/lib/evolution";
import { msgLembrete1Dia, msgLembrete1Hora } from "@/lib/paradaCertaMensagens";

export const dynamic = "force-dynamic";

type Pendente = { id: string; nome: string; telefone: string; horario: string };

// Disparado pelo Vercel Cron (ver vercel.json). Autenticação:
//   - Vercel envia  Authorization: Bearer <CRON_SECRET>
//   - Para teste manual no navegador: ?secret=<CRON_SECRET>
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ ok: false, erro: "cron_secret_ausente" }, { status: 500 });
  }
  const auth = req.headers.get("authorization");
  const viaQuery = new URL(req.url).searchParams.get("secret");
  if (auth !== `Bearer ${secret}` && viaQuery !== secret) {
    return NextResponse.json({ ok: false, erro: "nao_autorizado" }, { status: 401 });
  }

  const resultado = { "24h": 0, "1h": 0, falhas: 0 };

  for (const tipo of ["24h", "1h"] as const) {
    let pendentes: Pendente[] = [];
    try {
      pendentes = await callRpc<Pendente[]>("parada_certa_lembretes_pendentes", {
        p_tipo: tipo,
        p_secret: secret,
      });
    } catch (e) {
      console.error("[parada-certa] erro ao buscar pendentes", { tipo, e });
      continue;
    }

    for (const p of pendentes) {
      const texto =
        tipo === "24h"
          ? msgLembrete1Dia(p.nome, p.horario)
          : msgLembrete1Hora(p.nome, p.horario);
      const envio = await enviarWhatsApp(p.telefone, texto);
      if (envio.ok) {
        try {
          await callRpc("parada_certa_marcar_lembrete", {
            p_id: p.id,
            p_tipo: tipo,
            p_secret: secret,
          });
          resultado[tipo]++;
        } catch (e) {
          console.error("[parada-certa] enviou mas não marcou", { tipo, id: p.id, e });
          resultado.falhas++;
        }
      } else {
        console.error("[parada-certa] lembrete não enviado", { tipo, id: p.id, envio });
        resultado.falhas++;
      }
    }
  }

  return NextResponse.json({ ok: true, ...resultado });
}
