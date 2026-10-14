// Cliente do Evolution API — roda SÓ no servidor (rotas /api).
// Nunca importe este arquivo em componente client: a apikey não pode
// chegar ao navegador. As credenciais vêm de variáveis de ambiente.
//
// Variáveis esperadas (Vercel → Project Settings → Environment Variables):
//   EVOLUTION_URL          ex.: http://187.77.247.147:8080
//   EVOLUTION_INSTANCE     ex.: Parada-certa
//   EVOLUTION_APIKEY       token da instância
//   EVOLUTION_API_VERSION  v2 (padrão) ou v1

const URL_BASE = process.env.EVOLUTION_URL;
const INSTANCIA = process.env.EVOLUTION_INSTANCE;
const APIKEY = process.env.EVOLUTION_APIKEY;
const VERSAO = (process.env.EVOLUTION_API_VERSION ?? "v2").toLowerCase();

export function evolutionConfigurado() {
  return Boolean(URL_BASE && INSTANCIA && APIKEY);
}

export type EnvioResultado = {
  ok: boolean;
  status?: number;
  erro?: string;
};

/** Envia uma mensagem de texto via Evolution. Best-effort: nunca lança. */
export async function enviarWhatsApp(
  telefone: string,
  texto: string,
): Promise<EnvioResultado> {
  if (!evolutionConfigurado()) {
    return { ok: false, erro: "evolution_nao_configurado" };
  }

  const numero = telefone.replace(/\D/g, "");
  const url = `${URL_BASE!.replace(/\/+$/, "")}/message/sendText/${INSTANCIA}`;

  // O corpo muda entre versões do Evolution.
  const corpo =
    VERSAO === "v1"
      ? {
          number: numero,
          textMessage: { text: texto },
          options: { delay: 1200, presence: "composing" },
        }
      : { number: numero, text: texto, delay: 1200 };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: APIKEY!,
      },
      body: JSON.stringify(corpo),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      const detalhe = await res.text().catch(() => "");
      return { ok: false, status: res.status, erro: detalhe.slice(0, 300) };
    }
    return { ok: true, status: res.status };
  } catch (e) {
    return { ok: false, erro: e instanceof Error ? e.message : "falha_envio" };
  }
}
