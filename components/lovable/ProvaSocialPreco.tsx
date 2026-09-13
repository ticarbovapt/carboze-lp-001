import { TruckIcon, CheckCircleIcon, WhatsAppIcon } from "@/components/lovable/Icons";

/**
 * Prova social compacta logo abaixo dos cards de preço.
 *
 * A seção de depoimentos completa fica lá embaixo na página; aqui vai só o
 * suficiente para quem está decidindo no preço: 2 falas curtas (1 moto,
 * 1 carro) e uma linha de confiança.
 *
 * Regras de conteúdo (não relaxar):
 * - Depoimentos são trechos LITERAIS dos prints em DepoimentosJean.tsx
 *   (public/depoimentos/*.webp). Lá são imagens, não há array de texto para
 *   importar — por isso os trechos estão copiados aqui, com a origem ao lado.
 *   Cortes marcados com reticências; nada reescrito.
 * - Os prints só têm primeiro nome, sem cidade — não inventar cidade.
 * - Os prints não têm estrelas — não colocar estrelas, nota média, número de
 *   avaliações, número de clientes nem selo de terceiros.
 * - Linha de confiança: só promessa que já está escrita em outro lugar do site
 *   (origem comentada em cada item). Pagamento (Pix/parcelamento), garantia e
 *   devolução NÃO aparecem no site para estes kits, então não entram.
 *
 * Server component: sem estado, sem timer, sem carrossel, sem imagem.
 */

type Tema = "claro" | "escuro";

const DEPOIMENTOS = [
  {
    // public/depoimentos/depoimento-1.webp — mensagem direta
    texto: "Achei que a moto ficou com mais força! Até pra ligar a moto ficou melhor.",
    nome: "Júnior",
    veiculo: "Moto",
  },
  {
    // public/depoimentos/depoimento-5.webp — comentário no Instagram (@ricardo_tanaca)
    texto: "…a aceleração entrava em proteção […] coloquei rodei o dia inteiro diminuiu muito o problema…",
    nome: "Ricardo",
    veiculo: "Carro diesel 2009",
  },
];

const CONFIANCA = [
  {
    // ExitOffer.tsx ("Frete grátis" / "para todo o Brasil") + FreteBadge nos cards
    Icone: TruckIcon,
    texto: "Frete grátis para todo o Brasil",
  },
  {
    // app/obrigado/page.tsx ("o código de rastreio chega no mesmo e-mail")
    Icone: CheckCircleIcon,
    texto: "Código de rastreio por e-mail",
  },
  {
    // FAQInstitucional.tsx / FAQInfluencer.tsx ("Atendimento direto com a equipe CarboZé")
    Icone: WhatsAppIcon,
    texto: "Atendimento direto com a equipe CarboZé",
  },
];

/* Aspas decorativas (sem emoji) */
function AspasIcon({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M9.6 6C6.5 7.3 4.5 9.9 4.5 13.4V18h5.3v-5.1H7.2c.1-2 1.2-3.6 3.2-4.6L9.6 6zm9.9 0c-3.1 1.3-5.1 3.9-5.1 7.4V18h5.3v-5.1h-2.6c.1-2 1.2-3.6 3.2-4.6L19.5 6z" />
    </svg>
  );
}

export default function ProvaSocialPreco({ tema = "claro" }: { tema?: Tema }) {
  const escuro = tema === "escuro";

  // Contraste mínimo: verde-escuro/80 no claro, white/70 no escuro.
  const cls = {
    rotulo: escuro ? "text-white/70" : "text-verde-escuro/80",
    card: escuro
      ? "bg-white/[0.06] border-white/10"
      : "bg-white/70 border-verde-escuro/[0.08] shadow-[0_2px_10px_-4px_rgba(9,58,48,0.14)]",
    aspas: escuro ? "text-limao/60" : "text-verde-medio/70",
    texto: escuro ? "text-white/90" : "text-verde-escuro/90",
    autor: escuro ? "text-white/70" : "text-verde-escuro/80",
    icone: escuro ? "text-limao" : "text-verde-medio",
    confianca: escuro ? "text-white/70" : "text-verde-escuro/80",
    divisor: escuro ? "border-white/10" : "border-verde-escuro/10",
  };

  return (
    <div className="mt-10 md:mt-12">
      {/* Mesmo título da seção de depoimentos, para o visitante reconhecer depois */}
      <h3 className={`font-[family-name:var(--font-archivo)] text-xs uppercase tracking-[0.18em] text-center mb-4 ${cls.rotulo}`}>
        Quem usa, recomenda
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        {DEPOIMENTOS.map((d) => (
          <figure
            key={d.nome}
            className={`flex gap-3 rounded-xl border px-4 py-3.5 ${cls.card}`}
          >
            <AspasIcon className={`w-5 h-5 shrink-0 mt-0.5 ${cls.aspas}`} />
            <div>
              <blockquote
                className={`font-[family-name:var(--font-archivo)] text-sm leading-snug ${cls.texto}`}
              >
                {d.texto}
              </blockquote>
              <figcaption
                className={`mt-1.5 font-[family-name:var(--font-archivo)] text-xs ${cls.autor}`}
              >
                <strong className="font-bold">{d.nome}</strong> · {d.veiculo}
              </figcaption>
            </div>
          </figure>
        ))}
      </div>

      {/* Linha de confiança — só promessas já escritas no site */}
      <ul
        className={`mt-6 pt-5 border-t flex flex-col sm:flex-row sm:flex-wrap sm:justify-center items-center gap-x-6 gap-y-2.5 ${cls.divisor}`}
      >
        {CONFIANCA.map(({ Icone, texto }) => (
          <li
            key={texto}
            className={`inline-flex items-center gap-2 font-[family-name:var(--font-archivo)] text-xs sm:text-sm ${cls.confianca}`}
          >
            <Icone className={`w-4 h-4 shrink-0 ${cls.icone}`} />
            {texto}
          </li>
        ))}
      </ul>
    </div>
  );
}
