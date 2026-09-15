import type { SalesScriptDefinition } from "@/types/salesScript";

export const FURNITURE_SCRIPT_KEY = "planned_furniture";
export const FURNITURE_SCRIPT_VERSION = 1;

export function isFurnitureNiche(niche?: string | null) {
  const normalized = (niche ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();

  return [
    "moveis planejados",
    "movel planejado",
    "moveis pre-moldados",
    "moveis pre moldados",
    "movel pre-moldado",
    "movel pre moldado",
  ].includes(normalized);
}

export const FURNITURE_SCRIPT: SalesScriptDefinition = {
  key: FURNITURE_SCRIPT_KEY,
  version: FURNITURE_SCRIPT_VERSION,
  title: "Móveis Planejados",
  defaultObservation: "vocês divulgam bastante pelo Instagram, mas quando alguém quer conhecer melhor os produtos precisa entrar em contato direto pelo WhatsApp",
  callObjective: {
    title: "Objetivo da ligação",
    description: "Identificar o decisor, gerar interesse rapidamente, fazer o próprio responsável perceber uma lacuna na presença online da empresa e marcar uma demonstração. A ligação fria não precisa fechar a venda — precisa vender o próximo passo.",
    change: "Faça somente quatro perguntas decisórias. Não fale de site durante as perguntas. Primeiro faça o responsável reconhecer a situação; depois apresente a estrutura como solução.",
  },
  openingScript: [
    "Alô, [NOME]?",
    "Fala, aqui é o Jean da JVSTech.",
    "Eu trabalho estruturando a presença online de empresas que trabalham com móveis planejados.",
    "Dei uma olhada rápida na empresa de vocês antes de ligar e reparei que [OBSERVAÇÃO ESPECÍFICA].",
    "Faz sentido eu te explicar em 30 segundos o que eu percebi?",
  ],
  thirtySecondsScript: [
    "Show de bola. A maioria das empresas que eu falo já tem clientes, já recebe orçamento e já tem movimento.",
    "Então não quero falar sobre vocês precisarem simplesmente vender mais.",
    "Quero só te fazer quatro perguntas rápidas sobre como o cliente encontra vocês e conhece os produtos hoje.",
  ],
  thirtySecondsContext: "Escute a resposta e faça uma pergunta por vez. Não corrija o responsável nem antecipe a solução.",
  decisionMakerGuidance: {
    owner: {
      label: "Proprietário / responsável",
      script: "Perfeito, então é contigo mesmo que eu queria falar.",
    },
    manager: {
      label: "Gerente / comercial",
      script: "Entendi. E você participa das decisões de divulgação e da parte comercial da empresa?",
    },
    salesperson: {
      label: "Vendedor / outro funcionário",
      script: "Entendi. E você sabe quem é o responsável pela parte comercial ou pela divulgação da empresa? Consegue me passar o nome dele? E qual seria o melhor horário pra eu falar com ele?",
    },
    reception: {
      label: "Recepção / secretária",
      script: "Perfeito. Eu queria falar justamente com a pessoa responsável pela parte comercial e divulgação da empresa. Quem cuida disso aí?",
    },
  },
  receptionQuestionResponse: "É sobre a presença online da empresa e como os clientes conhecem os produtos antes de pedir um orçamento. É rápido, eu só preciso falar com o responsável mesmo.",
  diagnosticQuestions: [
    {
      id: "customer_origin",
      title: "1. Onde o cliente chega",
      prompt: "Hoje, quando alguém conhece vocês pela internet, de onde normalmente vem esse cliente: Instagram, Google, indicação ou WhatsApp?",
      context: "Descubra onde a empresa concentra a atenção dos clientes. Não critique a resposta; apenas continue.",
    },
    {
      id: "own_inventory",
      title: "2. Existe uma vitrine própria dos produtos?",
      prompt: "E hoje vocês têm algum lugar onde o cliente consegue conhecer todos os produtos que vocês trabalham, com fotos, modelos, medidas e informações?",
      context: "Se responder que não, apenas diga “Entendi” e siga para a próxima pergunta.",
    },
    {
      id: "customer_destination",
      title: "3. Para onde você manda o cliente?",
      prompt: "Se eu conhecer um produto de vocês pelo Instagram hoje e quiser ver outros modelos antes de chamar vocês no WhatsApp, pra onde você me mandaria?",
      context: "Se responder Instagram ou WhatsApp, apenas diga “Entendi”. Não critique o caminho atual.",
      followUpId: "catalog_structure",
      followUp: "Legal. E nesse catálogo o cliente consegue conhecer todos os produtos e entender as diferenças entre os modelos?",
      followUpWhenIncludes: ["catalogo", "catálogo"],
    },
    {
      id: "researches_store",
      title: "4. O cliente pesquisa antes de comprar?",
      prompt: "Pensando em alguém que está pesquisando um móvel planejado e vai investir alguns milhares de reais, você acha que essa pessoa pesquisa a empresa antes de pedir um orçamento ou fechar negócio?",
      context: "Essa é a pergunta mais importante. Escute antes de fazer a conclusão.",
      followUpId: "search_structure",
      followUp: "E quando esse cliente pesquisar vocês, hoje ele encontra uma apresentação completa da empresa, com os produtos, fotos, informações, localização e uma forma direta de entrar em contato?",
    },
  ],
  turnGuidance: "Depois das quatro perguntas, não faça outro interrogatório. Resuma a situação e conecte com a solução.",
  turnScript: "Então é exatamente esse o ponto que eu queria te mostrar. Vocês já têm Instagram, WhatsApp, indicação, clientes e os canais que já funcionam. O que eu faço é criar um espaço próprio para receber esse cliente quando ele quiser conhecer melhor a empresa e os produtos.",
  solutionScript: [
    "O cliente consegue entrar, conhecer os modelos, visualizar fotos, informações, medidas, diferenciais e entender melhor o que vocês oferecem.",
    "Quando ele tiver interesse, já consegue falar diretamente com vocês pelo WhatsApp.",
    "Os canais continuam trazendo o cliente. A estrutura própria apresenta a empresa e os produtos.",
  ],
  valueScript: [
    "Vocês não estão trabalhando com uma compra de impulso. Dependendo do projeto, o cliente pode estar falando de milhares de reais.",
    "Então ele pesquisa, compara, olha fotos, procura modelos, quer saber medidas, entender qualidade e, principalmente, saber com quem está negociando.",
    "A questão não é “preciso de uma estrutura online para vender meus produtos?”, porque vocês já vendem.",
    "A questão é: quando um cliente interessado pesquisar minha empresa, eu tenho uma estrutura própria para receber esse cliente?",
  ],
  demoInvitation: "Eu não quero tentar te vender nada agora. Quero te mostrar isso funcionando na prática. Consigo pegar a identidade da empresa, organizar os produtos e criar uma estrutura direcionada para apresentar o que vocês fazem e gerar novos contatos. É uma apresentação rápida pelo Meet, de 15 a 20 minutos. Eu tenho [OPÇÃO 1] e também [OPÇÃO 2]. Qual dos dois fica melhor pra você?",
  demoConfirmation: "Fechou. Vou mandar o convite e algumas informações antes da reunião. A ideia é você olhar o projeto funcionando e me dizer sinceramente se enxerga utilidade pra empresa. Se fizer sentido, conversamos sobre valores e implementação. Se não fizer, sem problema nenhum.",
  objections: [
    {
      id: "instagram",
      label: "Mas eu já tenho Instagram.",
      response: "Claro. Eu não quero substituir teu Instagram; inclusive, continuaria usando ele. A diferença é que o Instagram é uma rede social e a estrutura própria é um espaço da empresa. Se eu quiser conhecer todos os produtos, ver modelos, medidas e informações de forma organizada, consigo fazer isso facilmente pelo Instagram?",
    },
    {
      id: "whatsapp",
      label: "Eu já divulgo pelo WhatsApp.",
      response: "Perfeito. O WhatsApp é ótimo para conversar com o cliente e fechar negócio. A questão é: se esse cliente quiser conhecer melhor a empresa e ver os produtos antes de chamar vocês, onde ele consegue fazer isso de forma organizada?",
    },
    {
      id: "sells_enough",
      label: "Não preciso de site, já vendo bastante.",
      response: "E isso é ótimo. Eu não estou tentando resolver falta de vendas. A questão é se, quando alguém que já está interessado em comprar pesquisar a empresa, vocês têm uma estrutura própria pra receber esse cliente. A ideia é complementar, não substituir.",
    },
    {
      id: "customer_no_site",
      label: "Meu cliente não entra em site.",
      response: "Pode ser que uma parte não entre. Mas quando alguém está pensando em investir alguns milhares de reais, você acha que essa pessoa pesquisa a empresa antes de pedir um orçamento? É nesse momento que essa estrutura precisa estar disponível. Não precisa fazer todo mundo entrar; precisa estar disponível para quem quiser pesquisar.",
    },
    {
      id: "price",
      label: "Quanto custa?",
      response: "Antes de passar um valor, prefiro mostrar o que estamos fazendo e entender o que faz sentido para a empresa. Podemos criar uma estrutura simples de apresentação ou algo mais completo, direcionado para gerar contatos e facilitar o atendimento. Na demonstração eu mostro funcionando e então apresento o investimento.",
    },
  ],
  centralPhrases: [
    "Os canais trazem o cliente. A estrutura própria apresenta a sua empresa.",
    "Eu não quero substituir aquilo que já funciona. Quero criar um espaço próprio para receber o cliente que vocês já atraem.",
    "Quando esse cliente pesquisar minha empresa, eu tenho uma estrutura própria para receber esse cliente?",
    "O cliente pode até chegar pelo Instagram, mas onde ele conhece de verdade tudo o que vocês oferecem?",
    "A ideia não é substituir o WhatsApp. É fazer o cliente chegar no WhatsApp mais preparado.",
  ],
  preCallChecklist: [
    "Olhar Instagram/Google da empresa por 30 segundos.",
    "Anotar uma observação real para usar na abertura.",
    "Identificar quem é o decisor.",
    "Fazer somente as quatro perguntas.",
    "Não transformar a ligação em interrogatório.",
    "Não falar de site antes do responsável perceber a lacuna.",
    "Ter dois horários prontos para a demonstração.",
    "Não discutir preço durante a ligação.",
    "Lembrar: o objetivo não é vender a estrutura na ligação.",
    "O objetivo é vender os 15–20 minutos da demonstração.",
  ],
  finalObjective: "Identificar o decisor → gerar interesse → fazer quatro perguntas → fazer o responsável perceber a lacuna → apresentar a estrutura como solução → marcar a demonstração. Cold call não precisa fechar a venda. Precisa vender o próximo passo.",
};
