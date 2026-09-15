export const VEHICLE_STORE_SCRIPT_KEY = "vehicle_store";
export const VEHICLE_STORE_SCRIPT_VERSION = 2;
export const DEFAULT_STORE_OBSERVATION = "vocês não têm um site próprio, só divulgam pelo Instagram e pelas plataformas de anúncio";

export function isVehicleStoreNiche(niche?: string | null) {
  const normalized = (niche ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();

  return normalized === "loja de veiculo"
    || normalized === "loja de veiculos"
    || normalized === "lojas de veiculo"
    || normalized === "lojas de veiculos"
    || normalized === "veiculos";
}

export const CALL_OBJECTIVE = {
  title: "Objetivo da ligação",
  description: "Identificar o decisor, gerar interesse rapidamente, fazer o próprio lojista perceber uma lacuna na presença online da loja e marcar uma demonstração. A ligação fria não precisa fechar a venda — precisa vender o próximo passo.",
  change: "O diagnóstico tem somente quatro perguntas decisórias. Não fale de site durante as perguntas: primeiro faça o lojista reconhecer a situação; depois apresente o site como solução.",
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

export const THIRTY_SECONDS_CONTEXT = "Deixe o cliente responder. Esse é o gancho para iniciar as quatro perguntas sem antecipar a solução.";

export const DECISION_MAKER_GUIDANCE = {
  owner: {
    label: "Proprietário / responsável",
    script: "Perfeito, então é contigo mesmo que eu queria falar.",
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
    title: "1. Onde o cliente chega",
    prompt: "Hoje, quando alguém conhece vocês pela internet, de onde normalmente vem esse cliente: Instagram, Google ou plataformas de anúncio?",
  },
  {
    id: "own_inventory",
    title: "2. Existe uma vitrine própria?",
    prompt: "Hoje vocês têm algum lugar próprio onde o cliente consegue ver todo o estoque da loja, organizado por modelo, preço e quilometragem?",
  },
  {
    id: "customer_destination",
    title: "3. Para onde você manda o cliente?",
    prompt: "Se eu encontrar um carro de vocês numa plataforma hoje e quiser conhecer melhor a loja antes de chamar no WhatsApp, pra onde você me mandaria?",
  },
  {
    id: "researches_store",
    title: "4. O cliente pesquisa antes de comprar?",
    prompt: "Pensando num cliente que está prestes a gastar R$ 50, R$ 80 ou R$ 100 mil num carro: você acha que ele pesquisa o nome da loja antes de fechar negócio?",
    followUpId: "search_structure",
    followUp: "E quando ele pesquisar vocês, hoje ele encontra uma estrutura própria da loja com os veículos, informações, localização e uma forma direta de entrar em contato?",
  },
] as const;

export const TURN_GUIDANCE = "Depois das quatro perguntas, não faça outro interrogatório. Resuma a situação e conecte com a solução.";

export const TURN_SCRIPT = "Então é exatamente esse o ponto que eu queria te mostrar. Vocês já têm os anúncios, já têm Instagram e já têm os carros. O que eu faço é criar o espaço próprio da loja para receber esse cliente quando ele quiser conhecer vocês melhor.";

export const SOLUTION_SCRIPT = [
  "O cliente consegue entrar, ver os veículos, fotos, preço, quilometragem, localização e já falar diretamente com vocês pelo WhatsApp.",
  "As plataformas continuam trazendo o cliente; o site vira a vitrine própria da loja.",
];

export const DEMO_INVITATION = "Eu não quero tentar te vender nada agora. Quero mostrar isso funcionando na prática. Consigo pegar a identidade da loja, organizar os veículos e criar essa estrutura direcionada pra gerar contato. É uma apresentação rápida pelo Meet, de 15 a 20 minutos. Eu tenho [OPÇÃO 1] e também [OPÇÃO 2]. Qual dos dois fica melhor pra você?";

export const DEMO_CONFIRMATION = "Fechou. Vou mandar o convite e algumas informações antes da reunião. A ideia é você olhar o projeto funcionando e me dizer sinceramente se enxerga utilidade pra loja. Se fizer sentido, conversamos sobre valores e implementação; se não, sem problema nenhum.";

export const OBJECTIONS = [
  {
    id: "instagram",
    label: "Mas eu já tenho Instagram.",
    response: "Claro, e eu não quero substituir teu Instagram. A diferença é que o Instagram é uma rede social e o site é um espaço próprio da loja. Hoje, se eu quiser ver somente os carros disponíveis, organizados por modelo e preço, consigo fazer isso facilmente pelo Instagram?",
  },
  {
    id: "platform",
    label: "Eu já anuncio nas plataformas.",
    response: "Perfeito, e eu não mexeria nisso. As plataformas continuam trazendo o cliente. A questão é: se esse cliente pesquisar o nome da tua loja depois de encontrar um carro, o que você gostaria que aparecesse pra ele?",
  },
  {
    id: "sells_enough",
    label: "Não preciso de site, já vendo bastante.",
    response: "E isso é ótimo. Eu não estou tentando resolver falta de vendas. A questão é se, quando alguém que já está interessado em comprar um carro pesquisar a loja, vocês têm uma estrutura própria pra receber esse cliente. A ideia é complementar, não substituir.",
  },
  {
    id: "customer_no_site",
    label: "Meu cliente não entra em site.",
    response: "Pode ser que uma parte não entre mesmo. Mas quando alguém está prestes a comprar um carro de R$ 50, R$ 80 ou R$ 100 mil, você acha que essa pessoa pesquisa a loja antes de fechar? É exatamente nesse momento que essa estrutura precisa estar disponível.",
  },
  {
    id: "price",
    label: "Quanto custa?",
    response: "Antes de te passar um valor, eu prefiro te mostrar o que estamos fazendo e entender o que faz sentido pra tua loja. Na demonstração eu mostro funcionando e aí te passo o investimento.",
  },
] as const;

export const CENTRAL_PHRASES = [
  "As plataformas trazem o cliente. O site apresenta a sua empresa.",
  "Eu não quero substituir aquilo que já funciona. Quero criar um espaço próprio para receber o cliente que vocês já atraem.",
  "Quando esse cliente pesquisar minha loja, eu tenho uma estrutura própria para recebê-lo?",
];

export const PRE_CALL_CHECKLIST = [
  "Olhar Instagram/Google da loja por 30 segundos e anotar uma observação real.",
  "Identificar quem é o decisor.",
  "Fazer somente as quatro perguntas, sem transformar a ligação em interrogatório.",
  "Não falar de site antes do lojista perceber a lacuna.",
  "Ter dois horários prontos para a demonstração.",
  "Lembrar: o objetivo não é vender o site na ligação; é vender os 15–20 minutos da demonstração.",
];

export const FINAL_OBJECTIVE = "Identificar o decisor → fazer quatro perguntas → fazer o lojista perceber a lacuna → apresentar o site como solução → marcar a demonstração. Cold call não precisa fechar a venda. Precisa vender o próximo passo.";
