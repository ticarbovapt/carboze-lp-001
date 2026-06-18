// Cliente Supabase leve via REST (sem SDK no bundle).
// A anon key é pública por design — protegida por RLS no banco.
export const SUPABASE_URL = "https://wpkfirmapxevzpxjovjr.supabase.co";
export const SUPABASE_ANON =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indwa2Zpcm1hcHhldnpweGpvdmpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5MDQwMzAsImV4cCI6MjA5MjQ4MDAzMH0.WIqNNoO77SNQu_WvixRH_a5J3kZYSo2HEwkaXGyaPB8";

/** Insere uma linha numa tabela via PostgREST. Lança erro se a resposta não for ok. */
export async function insertRow(table: string, payload: Record<string, unknown>) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON,
      Authorization: `Bearer ${SUPABASE_ANON}`,
      Prefer: "return=minimal",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(`Supabase insert falhou (${res.status})`);
  }
}
