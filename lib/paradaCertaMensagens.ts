// Textos das mensagens de WhatsApp da Ação Parada Certa.
// Usados pelas rotas de servidor (confirmação e lembretes).
// *texto* entre asteriscos vira negrito no WhatsApp.

const LOCAL =
  "Container Parada Certa — Marginal Arena das Dunas, Lagoa Nova, Natal/RN";
const DATA = "sábado, 31/10";

function primeiroNome(nome: string) {
  const limpo = nome.trim();
  return limpo.split(/\s+/)[0] || limpo;
}

export function msgConfirmacao(nome: string, horario: string) {
  return `Olá, ${primeiroNome(nome)}! Seu agendamento na *Ação Parada Certa* está confirmado ✅

📅 ${DATA} às ${horario}
📍 ${LOCAL}

Chegue 10 minutos antes do horário para a preparação do veículo. Qualquer imprevisto, é só responder esta mensagem.`;
}

export function msgLembrete1Dia(nome: string, horario: string) {
  return `Oi, ${primeiroNome(nome)}! Passando pra lembrar: *amanhã* é o seu horário na Ação Parada Certa.

📅 ${DATA} às ${horario}
📍 ${LOCAL}

Chegue 10 minutos antes. Te esperamos!`;
}

export function msgLembrete1Hora(nome: string, horario: string) {
  return `${primeiroNome(nome)}, falta pouco! ⏰ Seu horário na Ação Parada Certa é hoje às ${horario}.

📍 ${LOCAL}

Saia com antecedência e chegue 10 minutos antes para a preparação do veículo.`;
}
