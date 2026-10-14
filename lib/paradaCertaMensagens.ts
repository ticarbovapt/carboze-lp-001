// Textos das mensagens de WhatsApp da Ação Parada Certa.
// Usados pelas rotas de servidor (confirmação e lembretes).
// *texto* entre asteriscos vira negrito no WhatsApp.

const LOCAL = "Container Parada Certa – Arena das Dunas, Natal/RN.";

function primeiroNome(nome: string) {
  const limpo = nome.trim();
  return limpo.split(/\s+/)[0] || limpo;
}

// 1) Confirmação — logo após o agendamento.
export function msgConfirmacao(nome: string, horario: string) {
  return `✅ Agendamento confirmado!

Olá, ${primeiroNome(nome)}! Sua participação na Ação Parada Certa do Grupo Carbo está confirmada!

Prepare-se para viver uma experiência exclusiva com a tecnologia de descarbonização CarboVapt! 🚗

📅 31/10, às ${horario}
📍 ${LOCAL}

Pedimos que chegue com 10 minutos de antecedência para a preparação do veículo.

Até lá! 💙`;
}

// 2) Lembrete — 1 dia antes (24h).
export function msgLembrete1Dia(nome: string, horario: string) {
  return `📅 Seu atendimento no Grupo Carbo é amanhã!

Olá, ${primeiroNome(nome)}! Passando para lembrar que amanhã é o seu horário na Ação Parada Certa, onde você vai conhecer na prática a tecnologia de descarbonização CarboVapt! 🚗

🕘 Horário: ${horario} — 31/10
📍 Local: ${LOCAL}

Pedimos que chegue com 10 minutos de antecedência para a preparação do veículo.

Caso tenha algum imprevisto e não possa comparecer, responda a esta mensagem nos avisando.

Esperamos você! 💙`;
}

// 3) Lembrete — 1 hora antes.
export function msgLembrete1Hora(nome: string, horario: string) {
  return `🚗 Sua experiência com o Grupo Carbo está chegando!

Olá, ${primeiroNome(nome)}! Falta apenas 1 hora para seu atendimento na Ação Parada Certa, onde você vai conhecer na prática a tecnologia CarboVapt!

🕘 Horário: ${horario}
📍 Local: ${LOCAL}

Pedimos que chegue com 10 minutos de antecedência para a preparação do veículo.

Caso tenha algum imprevisto e não possa comparecer, responda a esta mensagem nos avisando.

Esperamos você! 🚀`;
}
