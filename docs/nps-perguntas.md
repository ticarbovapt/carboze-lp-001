# Questionário NPS — CarboZé (`/nps`)

Pesquisa pós-entrega. Mobile-first, ≤ 1 minuto. Campos obrigatórios: **nota**, **nome**, **WhatsApp**.

| # | Pergunta | Formato | Campo no banco |
|---|---|---|---|
| 1 | **De 0 a 10, o quanto você recomendaria o CarboZé a um amigo ou familiar?** *(pergunta NPS oficial)* | 11 botões (0–10) | `score` |
| 2 | **Motivo da nota** — o texto se adapta: <br>• 0–6 → "O que mais te incomodou? Queremos resolver." <br>• 7–8 → "O que faltou para ser uma nota 10?" <br>• 9–10 → "Que ótimo! O que você mais gostou?" | Texto livre (opcional) | `motivo` |
| 3 | **Como foi a entrega do produto?** | 5 estrelas | `entrega_score` (1–5) |
| 4 | **Você já testou o CarboZé no seu veículo?** | "Sim, já usei" / "Ainda não" | `testou` |
| 5 | **Autoriza usar seu comentário como depoimento?** | Checkbox | `autoriza_depoimento` |
| — | **Nome** | Texto (obrigatório) | `nome` |
| — | **WhatsApp** | Telefone (obrigatório) | `celular` |

## Classificação NPS (calculada automaticamente)

| Nota | Categoria | Campo `categoria` |
|---|---|---|
| 0–6 | Detratores | `detrator` |
| 7–8 | Neutros | `neutro` |
| 9–10 | Promotores | `promotor` |

**NPS = % Promotores − % Detratores.**

## Armazenamento
- **Banco:** Supabase `public.nps_responses` (projeto `grupocarbo`), inserção anônima via RLS.
- **Backup:** `node scripts/export-nps-backup.mjs` → `backups/nps_responses.xlsx` (não versionado; contém dados pessoais).
- `origem`: default `whatsapp`, ou via querystring `?origem=` (ex.: `/nps?origem=instagram`).
