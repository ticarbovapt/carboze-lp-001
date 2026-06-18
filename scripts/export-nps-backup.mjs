// Exporta a tabela nps_responses do Supabase para backups/nps_responses.xlsx
// Uso: node scripts/export-nps-backup.mjs
// Requer SUPABASE_SERVICE_ROLE no .env.local (a anon key NAO tem SELECT por RLS).
import * as XLSX from "xlsx";
import { mkdirSync, readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const SUPABASE_URL = "https://wpkfirmapxevzpxjovjr.supabase.co";

// Lê SUPABASE_SERVICE_ROLE do ambiente ou do .env.local (não commitado)
function getServiceRole() {
  if (process.env.SUPABASE_SERVICE_ROLE) return process.env.SUPABASE_SERVICE_ROLE.trim();
  const envPath = path.join(ROOT, ".env.local");
  if (existsSync(envPath)) {
    const line = readFileSync(envPath, "utf8")
      .split("\n")
      .find((l) => l.startsWith("SUPABASE_SERVICE_ROLE="));
    if (line) return line.slice("SUPABASE_SERVICE_ROLE=".length).trim().replace(/^["']|["']$/g, "");
  }
  return null;
}

const KEY = getServiceRole();
if (!KEY) {
  console.error(
    "✗ Falta SUPABASE_SERVICE_ROLE. Crie um .env.local com:\n  SUPABASE_SERVICE_ROLE=<service_role_key>"
  );
  process.exit(1);
}

const res = await fetch(
  `${SUPABASE_URL}/rest/v1/nps_responses?select=*&order=created_at.desc`,
  { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } }
);
if (!res.ok) {
  console.error(`✗ Erro ao ler Supabase (${res.status}): ${await res.text()}`);
  process.exit(1);
}
const rows = await res.json();

// Colunas ordenadas e renomeadas em PT-BR
const data = rows.map((r) => ({
  Data: r.created_at ? new Date(r.created_at).toLocaleString("pt-BR") : "",
  Nome: r.nome ?? "",
  WhatsApp: r.celular ?? "",
  Nota: r.score ?? "",
  Categoria: r.categoria ?? "",
  Motivo: r.motivo ?? "",
  Entrega: r.entrega_score ?? "",
  "Já testou": r.testou ?? "",
  "Autoriza depoimento": r.autoriza_depoimento ? "Sim" : "Não",
  Origem: r.origem ?? "",
}));

const ws = XLSX.utils.json_to_sheet(data);
ws["!cols"] = [
  { wch: 20 }, { wch: 24 }, { wch: 18 }, { wch: 6 }, { wch: 11 },
  { wch: 50 }, { wch: 9 }, { wch: 12 }, { wch: 18 }, { wch: 12 },
];
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, "NPS");

const outDir = path.join(ROOT, "backups");
mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, "nps_responses.xlsx");
XLSX.writeFile(wb, outPath);

console.log(`✓ Backup gerado: backups/nps_responses.xlsx (${data.length} respostas)`);
