/* Conteúdo editorial em português. Os índices corretos são baseados em zero.
   Fontes reunidas em CURIE.sources e também disponíveis dentro da aplicação. */
window.CURIE = {
  sources: [
    { title: 'Fundação Nobel · Marie Curie: vida e pesquisa', url: 'https://www.nobelprize.org/prizes/physics/1903/marie-curie/facts/' },
    { title: 'Fundação Nobel · Biografia de Marie Curie', url: 'https://www.nobelprize.org/prizes/chemistry/1911/marie-curie/biographical/' },
    { title: 'Fundação Nobel · A descoberta do polônio e do rádio', url: 'https://www.nobelprize.org/prizes/themes/marie-and-pierre-curie-and-the-discovery-of-polonium-and-radium-/' },
    { title: 'EPFL · Quartzo piezoelétrico dos Curie', url: 'https://collection-lhst.epfl.ch/?action=singleObject&id=129' },
    { title: 'Science Museum Group · Marie Curie', url: 'https://collection.sciencemuseumgroup.org.uk/people/cp37187/marie-curie' },
    { title: 'Nuclear Regulatory Commission · Fundamentos da radiação', url: 'https://www.nrc.gov/facilities-safety/radiation-protection/radiation-and-its-health-effects/radiation-basics' },
    { title: 'National Cancer Institute · Radioterapia externa', url: 'https://www.cancer.gov/about-cancer/treatment/types/radiation-therapy/external-beam' }
  ],
  objects: [
    { id: 'balance', title: 'Balança de precisão', tag: 'MEDIR PARA COMPARAR', icon: 'balance', x: 20, y: 50, text: 'Na química, medir a massa ajuda a comparar amostras e acompanhar separações. Uma balança transforma uma observação em um dado que pode ser registrado.', curiosity: 'Uma descoberta depende também dos detalhes: quantidades, condições e medidas precisam ser anotadas.', source: 2 },
    { id: 'mineral', title: 'Uma pista no mineral', tag: 'PECHBLENDA', icon: 'mineral', x: 25, y: 70, text: 'A pechblenda é um minério que contém urânio. Sua atividade, maior do que o urânio presente explicava, chamou a atenção de Marie.', curiosity: 'Uma medida inesperada abriu uma pergunta: haveria ali alguma substância ainda desconhecida?', source: 0 },
    { id: 'electrometer', title: 'Eletrômetro', tag: 'TORNAR O INVISÍVEL MENSURÁVEL', icon: 'electrometer', x: 48, y: 49, text: 'Um instrumento sensível para medidas elétricas. No arranjo de pesquisa dos Curie, permitia investigar a ionização do ar provocada pela radiação.', curiosity: 'O quartzo piezoelétrico fornecia cargas conhecidas para compensar as medidas elétricas. Física e química trabalhavam juntas.', source: 3 },
    { id: 'glass', title: 'Vidrarias de laboratório', tag: 'SEPARAR PARA DESCOBRIR', icon: 'flask', x: 77, y: 56, text: 'Recipientes de vidro fazem parte de operações como preparar soluções e separar substâncias. Na cena, representam o trabalho químico da pesquisa.', curiosity: 'Identificar um novo elemento exigia mais do que observar: era preciso separar materiais e estudar suas propriedades.', source: 1 },
    { id: 'notebook', title: 'Caderno de pesquisa', tag: 'OBSERVAR · ANOTAR · QUESTIONAR', icon: 'notebook', x: 66, y: 76, text: 'O caderno representa a memória de uma investigação: hipóteses, procedimentos, resultados e novas perguntas.', curiosity: 'Que anotação você faria se uma amostra desse um resultado muito diferente do esperado?', source: 2 },
    { id: 'bottles', title: 'Frascos e reagentes', tag: 'A QUÍMICA DA INVESTIGAÇÃO', icon: 'bottles', x: 82, y: 16, text: 'Frascos armazenam substâncias usadas em procedimentos químicos. Aqui, simbolizam as muitas etapas de separação das amostras estudadas.', curiosity: 'Os objetos desta cena são uma interpretação artística. Não são fotografias ou réplicas exatas do acervo de Marie Curie.', source: 1 }
  ],
  timeline: [
    { year: '1867', label: 'As origens', title: 'Uma menina chamada Maria.', text: 'Maria Skłodowska nasce em Varsóvia, na atual Polônia. A educação faz parte de sua história desde cedo.', detail: 'VARSÓVIA, ATUAL POLÔNIA', source: 0 },
    { year: '1891', label: 'Novos caminhos', title: 'Uma cidade. Novas possibilidades.', text: 'Em Paris, ela continua os estudos na Sorbonne. A formação em física e matemática prepara o caminho para sua pesquisa.', detail: 'PARIS, FRANÇA', source: 1 },
    { year: '1898', label: 'As descobertas', title: 'Dois elementos. Muitas perguntas.', text: 'As pesquisas de Marie e seus colaboradores levam ao anúncio do polônio e do rádio. O nome polônio homenageia sua terra natal.', detail: 'POLÔNIO & RÁDIO', source: 2 },
    { year: '1903', label: 'O primeiro Nobel', title: 'Um marco para as mulheres na ciência.', text: 'Marie recebe o Nobel de Física com Pierre Curie e Henri Becquerel. É a primeira mulher a receber um Prêmio Nobel.', detail: 'PRÊMIO NOBEL DE FÍSICA', source: 0 },
    { year: '1906', label: 'Na universidade', title: 'A pesquisa também ocupa a sala de aula.', text: 'Após a morte de Pierre, Marie assume suas funções de ensino na Sorbonne, abrindo caminho para mulheres na universidade.', detail: 'ENSINO & PESQUISA', source: 1 },
    { year: '1911', label: 'O segundo Nobel', title: 'Uma trajetória entre duas ciências.', text: 'Seu trabalho com o rádio e o polônio é reconhecido pelo Nobel de Química. Marie se torna a primeira pessoa a receber dois prêmios Nobel.', detail: 'PRÊMIO NOBEL DE QUÍMICA', source: 0 },
    { year: '1914–18', label: 'Ciência em ação', title: 'Conhecimento que chega a quem precisa.', text: 'Durante a Primeira Guerra Mundial, Marie ajuda a organizar unidades móveis de raios X para auxiliar o atendimento de feridos.', detail: 'RADIOLOGIA MÓVEL', source: 4 }
  ],
  revision: "curie-20-blocos-v2",
  blocks: [
  {
    "id": "trajetoria",
    "title": "A trajetória de Marie Curie",
    "short": "Trajetória",
    "description": "Origens, estudos, obstáculos e encontros que fizeram parte de uma vida dedicada à ciência.",
    "start": 0,
    "end": 4,
    "icon": "notebook"
  },
  {
    "id": "descobertas",
    "title": "Pesquisas e descobertas",
    "short": "Descobertas",
    "description": "Das primeiras pistas aos novos elementos: como a investigação abriu caminhos para conhecer a matéria.",
    "start": 5,
    "end": 9,
    "icon": "electrometer"
  },
  {
    "id": "reconhecimento",
    "title": "Reconhecimento e contribuição social",
    "short": "Reconhecimento",
    "description": "Prêmios, ensino e ciência a serviço da sociedade. O conhecimento também transforma vidas fora do laboratório.",
    "start": 10,
    "end": 13,
    "icon": "spark"
  },
  {
    "id": "radioatividade",
    "title": "Radioatividade e suas aplicações",
    "short": "Radioatividade",
    "description": "Um olhar para o átomo, as emissões e as aplicações médicas que conectam a pesquisa ao presente.",
    "start": 14,
    "end": 19,
    "icon": "flask"
  }
],
  questions: [
  {
    "id": 1,
    "block": "trajetoria",
    "topic": "TRAJETÓRIA",
    "curiosity": "A trajetória de uma cientista também é feita de lugares, culturas e oportunidades. Suas origens ajudam a compreender o caminho que ela percorreu.",
    "question": "Em qual país nasceu Marie Curie?",
    "options": [
      "Itália",
      "Polônia",
      "França",
      "Brasil"
    ],
    "correct": 1,
    "explanation": "Marie nasceu em Varsóvia, na atual Polônia.",
    "source": 0
  },
  {
    "id": 2,
    "block": "trajetoria",
    "topic": "TRAJETÓRIA",
    "curiosity": "Uma pessoa pode ser conhecida por nomes diferentes ao longo da vida. A história da ciência também guarda essas marcas de identidade.",
    "question": "Qual era o nome de nascimento de Marie Curie?",
    "options": [
      "Marie Pasteur",
      "Irène Curie",
      "Rosalind Franklin",
      "Maria Skłodowska"
    ],
    "correct": 3,
    "explanation": "Seu nome de nascimento era Maria Skłodowska.",
    "source": 1
  },
  {
    "id": 3,
    "block": "trajetoria",
    "topic": "TRAJETÓRIA",
    "curiosity": "Continuar os estudos exigiu de Marie uma mudança importante. A formação universitária seria uma etapa decisiva de sua trajetória.",
    "question": "Para qual cidade Marie se mudou para estudar na universidade?",
    "options": [
      "Paris",
      "Roma",
      "Londres",
      "Berlim"
    ],
    "correct": 0,
    "explanation": "Em 1891, Marie ingressou na Universidade de Paris.",
    "source": 1
  },
  {
    "id": 4,
    "block": "trajetoria",
    "topic": "TRAJETÓRIA",
    "curiosity": "O acesso à educação nem sempre foi igual para todas as pessoas. Conhecer essas barreiras ajuda a entender o significado de uma conquista.",
    "question": "Que obstáculo Marie enfrentou para seguir seus estudos?",
    "options": [
      "Não existiam universidades na Europa.",
      "A física ainda não era estudada.",
      "As mulheres tinham acesso limitado ao ensino superior em Varsóvia.",
      "As mulheres eram proibidas de estudar em qualquer país do mundo."
    ],
    "correct": 2,
    "explanation": "Na Varsóvia de sua juventude, as mulheres não eram admitidas na universidade da cidade.",
    "source": 2
  },
  {
    "id": 5,
    "block": "trajetoria",
    "topic": "TRAJETÓRIA",
    "curiosity": "A ciência se constrói também em parceria. Compartilhar perguntas, experimentos e resultados fez parte da trajetória de Marie.",
    "question": "Quem foi Pierre Curie na vida de Marie?",
    "options": [
      "Seu marido e parceiro de pesquisa",
      "Seu filho e professor",
      "Seu irmão e aluno",
      "Seu médico"
    ],
    "correct": 0,
    "explanation": "Marie e Pierre trabalharam juntos em pesquisas sobre radioatividade.",
    "source": 0
  },
  {
    "id": 6,
    "block": "descobertas",
    "topic": "DESCOBERTAS",
    "curiosity": "Medidas cuidadosas permitiram investigar fenômenos que não são percebidos diretamente pelos olhos. A pesquisa começava com perguntas sobre a matéria.",
    "question": "Qual fenômeno Marie Curie investigou em suas pesquisas?",
    "options": [
      "A fotossíntese",
      "A formação dos ventos",
      "A mudança das marés",
      "A radioatividade"
    ],
    "correct": 3,
    "explanation": "Marie dedicou-se ao estudo das substâncias radioativas.",
    "source": 0
  },
  {
    "id": 7,
    "block": "descobertas",
    "topic": "DESCOBERTAS",
    "curiosity": "Uma descoberta pode se tornar o ponto de partida de outra investigação. Na ciência, trabalhos de diferentes pessoas se conectam.",
    "question": "Qual cientista descobriu a radiação emitida por sais de urânio, inspirando Marie?",
    "options": [
      "Louis Pasteur",
      "Henri Becquerel",
      "Charles Darwin",
      "Isaac Newton"
    ],
    "correct": 1,
    "explanation": "A descoberta de Becquerel em 1896 inspirou as pesquisas de Marie.",
    "source": 0
  },
  {
    "id": 8,
    "block": "descobertas",
    "topic": "DESCOBERTAS",
    "curiosity": "A tabela periódica também tem uma história de descobertas. Identificar uma substância nova exige evidências e muita investigação.",
    "question": "Quais elementos Marie e Pierre anunciaram em 1898?",
    "options": [
      "Ferro e cobre",
      "Carbono e nitrogênio",
      "Polônio e rádio",
      "Oxigênio e hidrogênio"
    ],
    "correct": 2,
    "explanation": "Polônio e rádio foram identificados a partir de pesquisas com minérios.",
    "source": 2
  },
  {
    "id": 9,
    "block": "descobertas",
    "topic": "DESCOBERTAS",
    "curiosity": "Os nomes dos elementos podem guardar histórias. Um nome científico também pode expressar uma homenagem.",
    "question": "Por que o elemento polônio recebeu esse nome?",
    "options": [
      "Porque foi encontrado no Polo Sul.",
      "Em homenagem ao planeta Plutão.",
      "Porque foi descoberto em uma flor.",
      "Em homenagem à Polônia, terra natal de Marie."
    ],
    "correct": 3,
    "explanation": "O nome homenageia a Polônia.",
    "source": 2
  },
  {
    "id": 10,
    "block": "descobertas",
    "topic": "DESCOBERTAS",
    "curiosity": "Materiais encontrados na natureza podem esconder pistas importantes. Comparar amostras foi parte essencial dessa investigação.",
    "question": "Qual minério foi usado nas pesquisas que levaram à descoberta do polônio e do rádio?",
    "options": [
      "Sal de cozinha",
      "Pechblenda",
      "Quartzo",
      "Calcário"
    ],
    "correct": 1,
    "explanation": "A pechblenda é um minério que contém urânio e outras substâncias.",
    "source": 0
  },
  {
    "id": 11,
    "block": "reconhecimento",
    "topic": "RECONHECIMENTO",
    "curiosity": "O reconhecimento de um trabalho científico pode destacar anos de pesquisa e colaboração. Um prêmio também marca um momento da história.",
    "question": "Qual prêmio Marie Curie recebeu em 1903?",
    "options": [
      "Nobel da Paz",
      "Nobel de Economia",
      "Nobel de Física",
      "Nobel de Literatura"
    ],
    "correct": 2,
    "explanation": "Em 1903, Marie dividiu o Nobel de Física com Pierre Curie e Henri Becquerel.",
    "source": 0
  },
  {
    "id": 12,
    "block": "reconhecimento",
    "topic": "RECONHECIMENTO",
    "curiosity": "Algumas pesquisas atravessam as fronteiras entre disciplinas. A trajetória de Marie mostra como diferentes áreas do conhecimento se aproximam.",
    "question": "Em 1911, Marie recebeu seu segundo Nobel. Em qual área?",
    "options": [
      "Química",
      "Medicina",
      "Literatura",
      "Paz"
    ],
    "correct": 0,
    "explanation": "O prêmio reconheceu suas contribuições à química, incluindo estudos sobre rádio e polônio.",
    "source": 1
  },
  {
    "id": 13,
    "block": "reconhecimento",
    "topic": "RECONHECIMENTO",
    "curiosity": "Em situações de crise, o conhecimento científico pode ajudar a resolver necessidades concretas. Marie também atuou fora da bancada de pesquisa.",
    "question": "Durante a Primeira Guerra Mundial, como Marie ajudou no atendimento aos feridos?",
    "options": [
      "Desenvolveu um aparelho de ultrassom.",
      "Organizou unidades móveis de radiografia com raios X.",
      "Criou uma vacina contra todas as doenças.",
      "Inventou o estetoscópio."
    ],
    "correct": 1,
    "explanation": "As unidades móveis ajudavam médicos a visualizar lesões e localizar fragmentos no corpo.",
    "source": 4
  },
  {
    "id": 14,
    "block": "reconhecimento",
    "topic": "RECONHECIMENTO",
    "curiosity": "Ocupar espaços de ensino e pesquisa pode abrir caminhos para outras pessoas. A presença das mulheres na universidade faz parte dessa história.",
    "question": "Qual conquista de Marie Curie representou um avanço para as mulheres na universidade?",
    "options": [
      "Foi a primeira mulher a frequentar qualquer escola.",
      "Criou a primeira universidade do mundo.",
      "Tornou-se a primeira médica da história.",
      "Tornou-se professora na Universidade de Paris."
    ],
    "correct": 3,
    "explanation": "Marie tornou-se professora de física na Universidade de Paris após a morte de Pierre.",
    "source": 1
  },
  {
    "id": 15,
    "block": "radioatividade",
    "topic": "RADIOATIVIDADE",
    "curiosity": "A matéria pode passar por diferentes transformações. Para compreender um fenômeno, precisamos identificar o que muda e como isso acontece.",
    "question": "O que é radioatividade?",
    "options": [
      "Mistura de dois líquidos de cores diferentes.",
      "Reflexão da luz em um espelho.",
      "Emissão espontânea de radiação por núcleos atômicos instáveis.",
      "Mudança da água líquida para vapor."
    ],
    "correct": 2,
    "explanation": "A radioatividade ocorre quando núcleos instáveis se transformam e emitem radiação.",
    "source": 5
  },
  {
    "id": 16,
    "block": "radioatividade",
    "topic": "RADIOATIVIDADE",
    "curiosity": "Os modelos atômicos distinguem partes do átomo com características diferentes. Localizar uma transformação é um passo para compreendê-la.",
    "question": "Em qual parte do átomo ocorrem as transformações relacionadas à radioatividade?",
    "options": [
      "No núcleo",
      "Nas ligações entre moléculas",
      "Na superfície do recipiente",
      "Apenas na eletrosfera"
    ],
    "correct": 0,
    "explanation": "As transformações radioativas envolvem o núcleo do átomo.",
    "source": 5
  },
  {
    "id": 17,
    "block": "radioatividade",
    "topic": "RADIOATIVIDADE",
    "curiosity": "Nem toda emissão se comporta da mesma forma. Classificar os diferentes tipos ajuda a estudar suas propriedades.",
    "question": "Quais são os três tipos de emissão geralmente estudados na radioatividade?",
    "options": [
      "Sólida, líquida e gasosa",
      "Ácida, básica e neutra",
      "Física, química e biológica",
      "Alfa, beta e gama"
    ],
    "correct": 3,
    "explanation": "Alfa e beta são partículas; gama é radiação eletromagnética.",
    "source": 5
  },
  {
    "id": 18,
    "block": "radioatividade",
    "topic": "RADIOATIVIDADE",
    "curiosity": "O estudo da radiação contribuiu para o desenvolvimento de tecnologias de saúde. Seu uso depende de conhecimento e planejamento.",
    "question": "Qual aplicação da radiação é utilizada no tratamento de alguns tipos de câncer?",
    "options": [
      "Decantação",
      "Radioterapia",
      "Filtração",
      "Destilação"
    ],
    "correct": 1,
    "explanation": "A radioterapia usa radiação para danificar células tumorais ou impedir sua multiplicação.",
    "source": 6
  },
  {
    "id": 19,
    "block": "radioatividade",
    "topic": "RADIOATIVIDADE",
    "curiosity": "Na medicina, existem modalidades diferentes de tratamento com radiação. Distinguir cada modalidade ajuda a compreender o que acontece durante uma sessão.",
    "question": "Uma pessoa submetida à radioterapia externa costuma ficar radioativa após a sessão?",
    "options": [
      "Não. Em geral, o feixe é desligado e nenhuma fonte permanece no corpo.",
      "Sim. Ela sempre precisa ficar isolada pelo resto da vida.",
      "Sim. Todas as pessoas que fizeram radioterapia contaminam outras.",
      "Não. Porque o tratamento nunca utiliza radiação."
    ],
    "correct": 0,
    "explanation": "Na radioterapia externa convencional, a pessoa não leva uma fonte radioativa no corpo.",
    "source": 6
  },
  {
    "id": 20,
    "block": "radioatividade",
    "topic": "RADIOATIVIDADE",
    "curiosity": "Uma descoberta pode continuar gerando perguntas e aplicações por muitas gerações. O legado de uma pesquisa ultrapassa o tempo de quem a realizou.",
    "question": "Por que as pesquisas de Marie Curie são importantes até hoje?",
    "options": [
      "Porque contribuíram para o conhecimento sobre a radioatividade e suas aplicações na medicina.",
      "Porque demonstraram que a radiação nunca apresenta riscos.",
      "Porque provaram que todos os elementos químicos são radioativos.",
      "Porque eliminaram a necessidade de pesquisas científicas."
    ],
    "correct": 0,
    "explanation": "As pesquisas sobre radioatividade contribuíram para avanços científicos e aplicações médicas, como a radioterapia.",
    "source": 0
  }
]
};
