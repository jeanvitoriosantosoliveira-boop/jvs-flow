export const VEHICLE_STORE_SCRIPT_KEY = "vehicle_store";
export const VEHICLE_STORE_SCRIPT_VERSION = 1;

export function isVehicleStoreNiche(niche?: string | null) {
  const normalized = (niche ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();

  return normalized === "loja de veiculo"
    || normalized === "loja de veiculos"
    || normalized === "lojas de veiculo"
    || normalized === "lojas de veiculos";
}

export const CALL_OBJECTIVE = {
  title: "Objetivo da ligação",
  description: "Identificar o decisor, gerar interesse em 30 segundos, diagnosticar a operação e marcar uma demonstração. A ligação fria não precisa fechar a venda — precisa vender o próximo passo.",
  change: "A abertura entrega valor direto com uma observação concreta sobre a loja. O compromisso pedido é de apenas 30 segundos.",
};

export const OPENING_SCRIPT = [
  "Alô, [NOME]? Fala, aqui é o Jean da JVSTech.",
  "Eu trabalho estruturando vitrine online pra loja de veículo. Dei uma olhada rápida na loja de vocês antes de ligar e reparei que [OBSERVAÇÃO ESPECÍFICA].",
  "Faz sentido eu te explicar em 30 segundos o que eu percebi?",
];

export const THIRTY_SECONDS_SCRIPT = [
  "Show de bola. A maioria das lojas que eu falo hoje já vende bem e já tem movimento — então essa ligação não é sobre “vocês precisam vender mais”.",
  "É sobre uma coisa específica: quando alguém pesquisa o nome da loja de vocês no Google antes de fechar negócio, o que essa pessoa encontra?",
];

export const DECISION_MAKER_GUIDANCE = {
  owner: {
    label: "Proprietário / responsável",
    script: "Perfeito, então é contigo mesmo que eu queria falar. Siga com a abertura de 30 segundos.",
  },
  manager: {
    label: "Gerente / comercial",
    script: "Entendi. E você participa das decisões de divulgação e da parte comercial da loja?",
  },
  salesperson: {
    label: "Vendedor / outro funcionário",
    script: "Entendi. E você sabe quem é o responsável pela parte comercial ou pela divulgação da loja? Consegue me passar o nome dele? E qual seria o melhor horário pra eu falar com ele?",
  },
  reception: {
    label: "Recepção / secretária",
    script: "Perfeito. Eu queria falar justamente com a pessoa responsável pela parte comercial e divulgação da loja. Quem cuida disso aí?",
  },
} as const;

export const RECEPTION_QUESTION_RESPONSE = "É sobre a presença online da loja e como os clientes encontram vocês antes de fechar negócio. É rápido, eu só preciso falar com o responsável mesmo.";

export const DIAGNOSTIC_QUESTIONS = [
  {
    id: "customer_origin",
    title: "1. De onde vêm os clientes",
    prompt: "Hoje, [NOME], de onde vem a maior parte dos clientes de vocês? É mais indicação, Instagram, Google ou plataformas de anúncio?",
  },
  {
    id: "advertising_platforms",
    title: "Plataformas utilizadas",
    prompt: "E vocês anunciam os veículos em quais plataformas hoje?",
  },
  {
    id: "individual_registration",
    title: "2. Dependência das plataformas",
    prompt: "Quando vocês colocam um veículo novo no estoque, cadastram ele nessas plataformas individualmente?",
  },
  {
    id: "own_inventory",
    title: "Estoque em espaço próprio",
    prompt: "Hoje vocês têm algum lugar próprio da loja onde conseguem concentrar esse estoque inteiro?",
  },
  {
    id: "customer_destination",
    title: "3. Fazer o cliente pensar",
    prompt: "Se eu encontrar um carro de vocês em uma plataforma e quiser conhecer melhor a loja, pra onde você me mandaria?",
  },
  {
    id: "google_expectation",
    title: "4. Google",
    prompt: "Se eu pesquisar o nome da loja no Google, o que você gostaria que eu encontrasse primeiro?",
  },
  {
    id: "google_current_structure",
    title: "Estrutura atual no Google",
    prompt: "Hoje vocês têm um espaço próprio onde esse cliente consegue conhecer a loja, ver o estoque e entrar em contato?",
  },
  {
    id: "researches_store",
    title: "5. Confiança",
    prompt: "Quando alguém vai comprar um veículo de ticket mais alto, você acha que esse cliente pesquisa a loja antes de fechar negócio?",
  },
  {
    id: "professional_trust",
    title: "Apresentação profissional",
    prompt: "Se esse cliente encontrar uma apresentação profissional da loja, com veículos, fotos, informações, localização e WhatsApp, isso ajuda a passar mais confiança?",
  },
] as const;

export const INSTAGRAM_DIAGNOSIS = [
  "No Instagram eu consigo encontrar facilmente todos os veículos disponíveis hoje?",
  "Consigo filtrar por modelo, preço, marca e quilometragem?",
];

export const TURN_GUIDANCE = "Antes de apresentar a solução, resuma o que o cliente disse usando as palavras dele e confirme se o entendimento está correto.";

export const TURN_SCRIPT = "Deixa eu ver se eu entendi. Hoje vocês já anunciam nos lugares que funcionam, têm Instagram, trabalham com [PLATAFORMAS], e isso já traz clientes. Só que o cliente que encontra vocês nessas plataformas ainda depende delas para conhecer melhor a loja e visualizar o estoque. É isso?";

export const SOLUTION_SCRIPT = [
  "Perfeito. Então é exatamente aí que entra o que a gente faz.",
  "A gente não quer substituir o Usado Fácil, OLX, Instagram ou qualquer plataforma que já funciona. As plataformas continuam trazendo o cliente; o site vira a vitrine própria da loja.",
  "O cliente encontra o carro, entra no site, visualiza veículos, fotos, preço, quilometragem, opcionais, localização e já fala diretamente pelo WhatsApp.",
];

export const VALUE_SCRIPT = [
  "Vocês estão vendendo veículos, não um produto de R$ 50. É comum o cliente pesquisar a empresa antes de mandar mensagem ou ir até a loja.",
  "A questão não é “preciso de um site pra vender meus carros?”, porque vocês já vendem. A questão é: quando o cliente pesquisar a loja, vocês têm uma estrutura própria pra recebê-lo?",
];

export const DEMO_INVITATION = "Eu não quero tentar te vender nada agora. Quero mostrar como estruturamos isso para lojas de veículos. É uma apresentação rápida pelo Meet, de 15 a 20 minutos. Eu tenho um horário [OPÇÃO 1] e outro [OPÇÃO 2]. Qual fica melhor pra você?";

export const DEMO_CONFIRMATION = "Fechou. Vou mandar o convite e algumas informações antes da reunião. A ideia é você olhar o projeto funcionando e dizer sinceramente se enxerga utilidade. Se fizer sentido, conversamos sobre valores e implementação; se não, sem problema.";

export const OBJECTIONS = [
  {
    id: "instagram",
    label: "Mas eu já tenho Instagram.",
    response: "Claro, e eu não quero substituir teu Instagram. A diferença é que o Instagram é uma rede social e o site é um espaço próprio da loja. Hoje, se eu quiser ver somente os carros disponíveis, organizados por modelo e preço, consigo fazer isso facilmente pelo Instagram?",
  },
  {
    id: "platform",
    label: "Eu já anuncio no Usado Fácil.",
    response: "Perfeito, e eu não mexeria nisso. Se o cliente encontrar teu carro no Usado Fácil e pesquisar o nome da tua loja no Google, o que você gostaria que aparecesse pra ele?",
  },
  {
    id: "sells_enough",
    label: "Não preciso de site, já vendo bastante.",
    response: "E isso é ótimo. Não estou tentando resolver falta de vendas, mas entender se existe oportunidade de melhorar como esses clientes conhecem a loja antes de comprar. A ideia é complementar, não substituir.",
  },
  {
    id: "customer_no_site",
    label: "Meu cliente não entra em site.",
    response: "Pode ser que uma parte não entre. Mas quando alguém está prestes a comprar um carro, você acha que essa pessoa pesquisa a loja antes de fechar? É nesse momento que o site precisa estar disponível.",
  },
  {
    id: "price",
    label: "Quanto custa?",
    response: "Antes de passar um valor, prefiro entender o que faz sentido para a loja. Pode ser uma vitrine simples ou uma estrutura completa. Na demonstração eu mostro exatamente o projeto e então apresento o investimento.",
  },
] as const;

export const CENTRAL_PHRASES = [
  "As plataformas trazem o cliente. O site apresenta a sua empresa.",
  "Eu não quero substituir aquilo que já funciona. Quero criar um espaço próprio para receber o cliente que vocês já atraem.",
  "Quando esse cliente pesquisar minha loja, eu tenho uma estrutura própria para recebê-lo?",
];

export const PRE_CALL_CHECKLIST = [
  "Olhar Instagram/Google por 30 segundos e anotar uma observação real.",
  "Ter um resultado concreto de outro cliente para usar como prova social.",
  "Lembrar: o objetivo é vender os 15–20 minutos da demonstração.",
];
