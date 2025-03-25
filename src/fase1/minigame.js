// Variável global para controlar o minigame
window.minigameActive = false;

// Constantes de estilo base para minigames - servirá como padrão
const MINIGAME_STYLES = {
  colors: {
    background: 0x000000,
    panel: 0x1a2a4a, // Azul escuro mais elegante
    buttonPrimary: 0x3366cc, // Azul mais vibrante
    buttonHover: 0x4477dd, // Azul claro hover
    correct: 0x4caf50, // Verde mais agradável
    incorrect: 0xe53935, // Vermelho mais agradável
    accent: 0x03a9f4, // Azul accent
  },
  fonts: {
    title: {
      fontFamily: "Arial, Helvetica, sans-serif",
      fontSize: "24px",
      color: "#ffffff",
      fontWeight: "bold",
    },
    subtitle: {
      fontFamily: "Arial, Helvetica, sans-serif",
      fontSize: "18px",
      color: "#ffffff",
    },
    body: {
      fontFamily: "Arial, Helvetica, sans-serif",
      fontSize: "16px",
      color: "#ffffff",
    },
    button: {
      fontFamily: "Arial, Helvetica, sans-serif",
      fontSize: "16px",
      color: "#ffffff",
      align: "center",
    },
  },
  sizes: {
    panelWidth: 0.65,
    panelHeight: 0.65,
    buttonWidth: 0.7,
    buttonHeight: 45,
    spacing: 12,
  },
  animation: {
    short: 150,
    medium: 300,
    long: 500,
  },
};

// Estilos específicos para cada minigame
const QUIZ_STYLES = {
  ...MINIGAME_STYLES,
  colors: {
    ...MINIGAME_STYLES.colors,
    panel: 0x1a365d, // Azul mais escuro para o quiz
    buttonPrimary: 0x0078d7,
    buttonHover: 0x0090f0,
  },
  sizes: {
    ...MINIGAME_STYLES.sizes,
    panelWidth: 0.4, // Quiz tem painel mais largo
    panelHeight: 0.587,
  },
  positions: {
    panelOffset: -80, // Move o painel para cima
    questionOffset: -60, // Move o texto da pergunta para cima
    optionsStartY: -120, // Move as opções para cima
    feedbackOffset: -80, // Move o feedback para cima
  },
};

const MEMORY_STYLES = {
  ...MINIGAME_STYLES,
  colors: {
    ...MINIGAME_STYLES.colors,
    panel: 0x2d3a4a, // Fundo mais escuro para jogo da memória
    card: 0x3366cc, // Cor dos cartões
    cardRevealed: 0x5588ee, // Cor quando cartão é revelado
    correct: 0x30503A, // Verde para correspondências corretas
  },
  sizes: {
    ...MINIGAME_STYLES.sizes,
    panelWidth: 0.70, // Reduzido para 70% da largura da tela
    panelHeight: 0.65, // Reduzido para 70% da altura da tela
    cardWidth: 120, // Cartões menores para caber melhor na tela
    cardHeight: 40, // Altura reduzida para melhor visualização
    cardSpacing: 9, // Espaçamento reduzido para economizar espaço
  },
  positions: {
    // Posições mais equilibradas
    instructionsY: 130, // Instruções mais próximas ao topo
    cardStartY: -(MINIGAME_STYLES.sizes.panelHeight * 0.5) + -10, // Dinamicamente ajustado para centralizar os cartões no painel
    cardStartX: -200, // Modificado para mover os cartões mais para a esquerda
    panelOffset: 0, // Sem deslocamento do painel
    buttonY: 170, // Botões posicionados mais acima
  },
};

const HANGMAN_STYLES = {
  ...MINIGAME_STYLES,
  colors: {
    ...MINIGAME_STYLES.colors,
    panel: 0x26323f, // Fundo mais escuro para jogo da forca
    keyboardBg: 0x3366cc, // Cor das teclas do teclado
    hangmanLines: 0xffffff, // Cor das linhas da forca
  },
  sizes: {
    ...MINIGAME_STYLES.sizes,
    panelWidth: 0.4, // Aumentado para acomodar melhor o teclado
    panelHeight: 0.6, // Aumentado para mais espaço vertical
    keySize: 25, // Teclas menores para caber melhor
    keySpacing: 3, // Espaçamento mínimo
  },
  positions: {
    wordDisplayY: 400, // Palavra no topo
    wordDisplayX: -200, // Palavra deslocada para a direita
    hangmanX: -400, // Forca mais à esquerda
    leftArmX: -10, // Braço esquerdo mais para a esquerda
    hangmanY: 360, // Forca mais acima
    keyboardTopY: 450, // Teclado começando mais abaixo
    keyboardX: -200, // Teclado deslocado para a direita
    instructionsY: 130, // Instruções mais para baixo
  },
};

// Atualizar as posições do CATEGORIZATION_STYLES para usar valores mais adequados
const CATEGORIZATION_STYLES = {
  ...MINIGAME_STYLES,
  colors: {
    ...MINIGAME_STYLES.colors,
    panel: 0x243447, // Azul escuro para o jogo de categorização
    optionPersonal: 0x3366cc, // Azul para dados pessoais
    optionSensitive: 0xcc3366, // Rosa para dados sensíveis
  },
  sizes: {
    ...MINIGAME_STYLES.sizes,
    panelWidth: 0.6, // Aumentado para acomodar melhor todo o conteúdo
    panelHeight: 0.65, // Aumentado para dar mais espaço vertical
  },
  positions: {
    instructionsY: -130, // Ajustado para ficar dentro do painel
    dataTextY: -70, // Ajustado
    progressTextY: -30, // Ajustado
    buttonY: 20, // Ajustado
    buttonSpacing: 160, // Mantido
    explanationY: 80, // Mantido
    feedbackY: 130, // Ajustado
    nextButtonY: 170, // Ajustado
  },
};

// Adicionar um loading spinner enquanto os recursos carregam
function showMinigameLoader() {
  const loader = document.createElement("div");
  loader.className = "minigame-loader";
  loader.id = "minigame-loader";

  const spinner = document.createElement("div");
  spinner.className = "loader-spinner";

  loader.appendChild(spinner);
  document.body.appendChild(loader);
}

// Remover o loader quando tudo estiver pronto
function hideMinigameLoader() {
  const loader = document.getElementById("minigame-loader");
  if (loader) {
    // Fade out e remover
    loader.style.opacity = "0";
    setTimeout(() => {
      if (loader.parentNode) {
        loader.parentNode.removeChild(loader);
      }
    }, 300);
  }
}

// =====================================================
// IMPLEMENTAÇÕES DOS MINIGAMES
// =====================================================

// 1. JOGO DO QUIZ (Professor 1)
// Já implementado anteriormente como createImprovedQuizMinigame
function createImprovedQuizMinigame(scene, data, callback) {
  // Dimensões da tela
  const width = scene.cameras.main.width;
  const height = scene.cameras.main.height;

  // Usar estilo específico do QUIZ
  const { background, panel, titleText } = createBaseUI(
    scene,
    width,
    height,
    data.title,
    QUIZ_STYLES
  );

  // Variáveis de controle
  let currentQuestionIndex = 0;
  let correctAnswers = 0;
  
  // Atualizar com as novas perguntas
  data.questions = [
    {
      question: "O que significa a sigla LGPD?",
      options: [
        "Lei Geral da Prefeitura de Diadema",
        "Lei de Garantia e Proteção de Dados",
        "Liderança Governamental de Proteção de Dados",
        "Lei Geral de Proteção de Dados Pessoais",
      ],
      correct: 3,
      feedback:
        "A LGPD (Lei Geral de Proteção de Dados Pessoais) é a legislação brasileira que regula as atividades de tratamento de dados pessoais. Ela foi inspirada na GDPR europeia e garante maior controle dos cidadãos sobre suas informações pessoais.",
    },
    {
      question: "Qual o principal objetivo da LGPD?",
      options: [
        "Liberar o uso de dados pessoais",
        "Divulgar vídeos de gatos na internet",
        "Proteger os direitos fundamentais de liberdade e privacidade",
        "Restringir o uso da internet",
      ],
      correct: 2,
      feedback:
        "A LGPD tem como principal objetivo proteger os direitos fundamentais de liberdade e privacidade, criando regras para o tratamento de dados pessoais por empresas e órgãos públicos, garantindo maior transparência e segurança para os titulares dos dados.",
    },
    {
      question: "O que são considerados dados pessoais pela LGPD?",
      options: [
        "Apenas nome e CPF",
        "Somente dados bancários",
        "Informações relacionadas à pessoa identificada ou identificável",
        "Apenas o que está nas redes socias",
      ],
      correct: 2,
      feedback:
        "De acordo com a LGPD, dados pessoais são todas as informações relacionadas a uma pessoa identificada ou identificável. Isso inclui nome, endereço, e-mail, dados biométricos, histórico médico, dados de localização e qualquer outra informação que possa identificar uma pessoa.",
    },
    {
      question: "O que são dados sensíveis segundo a LGPD?",
      options: [
        "Todos os dados pessoais",
        "Apenas dados financeiros",
        "Dados sobre origem racial, saúde, biometria, orientação religiosa, etc.",
        "Apenas dados compartilhados na internet",
      ],
      correct: 2,
      feedback:
        "Dados sensíveis são uma categoria especial que inclui informações sobre origem racial ou étnica, convicção religiosa, opinião política, dados referentes à saúde ou à vida sexual, dados genéticos ou biométricos. Estes dados recebem proteção adicional pela LGPD.",
    },
    {
      question: "Qual é o papel do Encarregado (DPO) na LGPD?",
      options: [
        "Apenas atender reclamações dos consumidores",
        "Ser o canal de comunicação entre o controlador, os titulares e a ANPD",
        "Coletar dados pessoais para a empresa",
        "Bloquear o acesso a dados pessoais",
      ],
      correct: 1,
      feedback:
        "O Encarregado ou DPO (Data Protection Officer) é responsável por ser o canal de comunicação entre o controlador, os titulares dos dados e a Autoridade Nacional de Proteção de Dados (ANPD). Ele também orienta funcionários sobre práticas de proteção de dados e executa outras atribuições determinadas pelo controlador.",
    },
    {
      question: "Qual a idade mínima para consentimento válido na LGPD?",
      options: [
        "12 anos",
        "16 anos",
        "18 anos",
        "21 anos",
      ],
      correct: 2,
      feedback:
        "Segundo a LGPD, o tratamento de dados pessoais de crianças e adolescentes menores de 18 anos deve ser realizado com o consentimento específico de pelo menos um dos pais ou responsável legal. Menores de 18 anos não podem fornecer consentimento válido por si próprios.",
    },
    {
      question: "Quais são as penalidades previstas em caso de violação da LGPD?",
      options: [
        "Apenas advertência",
        "Apenas multa simples de 2% do faturamento",
        "Somente bloqueio dos dados",
        "Advertência, multa, bloqueio ou eliminação dos dados, entre outras",
      ],
      correct: 3,
      feedback:
        "A LGPD prevê diversas sanções administrativas, incluindo advertência, multa simples de até 2% do faturamento (limitada a R$50 milhões por infração), multa diária, publicização da infração, bloqueio ou eliminação dos dados, suspensão parcial do funcionamento do banco de dados, entre outras.",
    },
    {
      question: "O que é a ANPD?",
      options: [
        "Autoridade Nacional de Proteção de Dados",
        "Associação Nacional de Processamento Digital",
        "Agência Nacional de Prevenção Digital",
        "Administração Nacional de Projetos Digitais",
      ],
      correct: 0,
      feedback:
        "A ANPD (Autoridade Nacional de Proteção de Dados) é o órgão da administração pública responsável por zelar, implementar e fiscalizar o cumprimento da LGPD em todo o território nacional. É o principal órgão regulador da proteção de dados no Brasil.",
    },
  ];
  
  const totalQuestions = data.questions.length;

  // Mostrar contador de perguntas
  const progressText = scene.add
    .text(
      width / 2,
      height / 2 - panel.height / 2 + 70,
      `Pergunta 1 de ${totalQuestions}`,
      QUIZ_STYLES.fonts.subtitle
    )
    .setOrigin(0.5)
    .setScrollFactor(0)
    .setDepth(9002)
    .setAlpha(0);

  scene.tweens.add({
    targets: progressText,
    alpha: 1,
    duration: QUIZ_STYLES.animation.medium,
    delay: QUIZ_STYLES.animation.short,
  });

  // Container para elementos da pergunta atual
  const questionElements = [];

  // Função para mostrar a pergunta atual - com limpeza melhorada
  function showCurrentQuestion() {
    // Limpar elementos da pergunta anterior - garantindo que tudo seja removido
    questionElements.forEach((el) => {
      if (el) {
        if (el.destroy) {
          el.destroy();
        } else if (el.remove) {
          el.remove();
        }
      }
    });

    // Limpar o array completamente
    questionElements.length = 0;

    // Atualizar contador de progresso
    progressText.setText(
      `Pergunta ${currentQuestionIndex + 1} de ${totalQuestions}`
    );

    // Obter dados da pergunta atual
    const questionData = data.questions[currentQuestionIndex];

    // Exibir a pergunta com estilos específicos do quiz
    showQuestionUI(
      scene,
      questionData,
      width,
      height,
      panel,
      (correct) => {
        // Limpar imediatamente todos os elementos após responder
        questionElements.forEach((el) => {
          if (el && el.destroy) {
            el.destroy();
          }
        });
        questionElements.length = 0;

        // Incrementar contador se acertou
        if (correct) correctAnswers++;

        // Avançar para próxima pergunta ou finalizar
        currentQuestionIndex++;

        if (currentQuestionIndex < totalQuestions) {
          // Pequeno atraso antes da próxima pergunta para garantir limpeza completa
          scene.time.delayedCall(300, () => {
            showCurrentQuestion();
          });
        } else {
          // Quiz completo - mostrar resultado final
          progressText.destroy();
          titleText.destroy(); // Garantir que o título é destruído ao final do quiz

         // Garantir que 60% é suficiente para passar
         const success = correctAnswers >= Math.ceil(totalQuestions * 0.6);
         
         // Definir mensagem apropriada baseada no resultado
         const resultMessage = success 
           ? `Você acertou ${correctAnswers} de ${totalQuestions} questões e liberou a professora!` 
           : `Você acertou ${correctAnswers} de ${totalQuestions} questões. Tente novamente!`;


          console.log(
            `Quiz completed - Score: ${correctAnswers}/${totalQuestions}, Success: ${success}`
          );

          cleanupAndShowResult(
            scene,
            background,
            panel,
            success,
            resultMessage,
            callback
          );
        }
      },
      questionElements,
      QUIZ_STYLES
    );
  }

  // Iniciar o quiz
  showCurrentQuestion();
}

// 2. JOGO DE CORRESPONDÊNCIA DE TERMOS (Professor 2)
function startMemoryGame(scene, callback) {
  console.log("Iniciando jogo de correspondência de termos...");

  // Verificar se o callback é uma função
  if (typeof callback !== "function") {
    console.error("Callback inválido para o jogo de correspondência");
    callback = function (success) {
      console.log("Usando callback padrão, resultado:", success);
    };
  }

  const width = scene.cameras.main.width;
  const height = scene.cameras.main.height;

  // Usar estilo específico do jogo da memória
  const { background, panel, titleText } = createBaseUI(
    scene,
    width,
    height,
    "Correspondência de Termos - LGPD",
    MEMORY_STYLES
  );

  // Variáveis de controle de níveis
  let currentLevel = 0;
  const totalLevels = 3;
  let totalAttempts = 0;
  let totalMatchesFound = 0;
  
  // Dados relacionados à LGPD - três conjuntos diferentes
  const allLevelsData = [
    // Nível 1 - Conceitos básicos
    [
      { term: "DADOS PESSOAIS", description: "INFORMAÇÕES QUE IDENTIFICAM UMA PESSOA" },
      { term: "LGPD", description: "LEI GERAL DE PROTEÇÃO DE DADOS PESSOAIS" },
      { term: "CONSENTIMENTO", description: "PERMISSÃO PARA USO DE DADOS" },
      { term: "SEGURANÇA", description: "PROTEÇÃO CONTRA ACESSO NÃO AUTORIZADO" },
      { term: "PRIVACIDADE", description: "DIREITO DE MANTER INFORMAÇÕES PESSOAIS" },
    ],
    // Nível 2 - Conceitos intermediários
    [
      { term: "CONTROLADOR", description: "QUEM TOMA DECISÕES SOBRE TRATAMENTO DE DADOS" },
      { term: "OPERADOR", description: "QUEM REALIZA O TRATAMENTO DE DADOS" },
      { term: "ANONIMIZAÇÃO", description: "TORNAR IMPOSSÍVEL IDENTIFICAR O TITULAR" },
      { term: "TITULAR", description: "PESSOA A QUEM OS DADOS SE REFEREM" },
      { term: "TRATAMENTO", description: "OPERAÇÃO REALIZADA COM DADOS PESSOAIS" },
    ],
    // Nível 3 - Conceitos avançados
    [
      { term: "ENCARREGADO", description: "DPO - RESPONSÁVEL PELA CONFORMIDADE" },
      { term: "BANCO DE DADOS", description: "CONJUNTO ESTRUTURADO DE DADOS PESSOAIS" },
      { term: "RELATÓRIO DE IMPACTO", description: "DOCUMENTAÇÃO DE RISCOS À PRIVACIDADE" },
      { term: "PSEUDONIMIZAÇÃO", description: "PROCESSAMENTO QUE IMPEDE IDENTIFICAÇÃO DIRETA" },
      { term: "TRANSFERÊNCIA INTERNACIONAL", description: "ENVIO DE DADOS PARA OUTRO PAÍS" },
      { term: "AUTORIDADE NACIONAL", description: "ANPD - ÓRGÃO FISCALIZADOR DA LGPD" },
    ]
  ];

  // Guardar elementos do level
  let gameContainer = null;
  let instructionsText = null;
  let levelText = null;

  // Iniciar o primeiro nível
  startLevel(currentLevel);

  function startLevel(level) {
    // Limpar nível anterior se existir
    if (gameContainer) gameContainer.destroy();
    if (instructionsText) instructionsText.destroy();
    if (levelText) levelText.destroy();

    // Atualizar título para mostrar o nível atual
    titleText.setText(`Correspondência de Termos - Nível ${level + 1}/${totalLevels}`);

    // Variáveis de controle para este nível
    const lgpdPairs = allLevelsData[level];
    const cards = [];
    let selectedCard = null;
    let matchesFound = 0;
    const totalMatches = lgpdPairs.length;
    let attempts = 0;
    const matchedPairs = [];

    // Criar container para cartas
    gameContainer = scene.add
      .container(width / 2, height / 2)
      .setDepth(9002);

    // Configuração do layout em duas colunas
    const cardWidth = MEMORY_STYLES.sizes.cardWidth;
    const cardHeight = MEMORY_STYLES.sizes.cardHeight;
    const spacing = MEMORY_STYLES.sizes.cardSpacing;

    // Posição da coluna esquerda (termos)
    const leftColumnX = MEMORY_STYLES.positions.cardStartX - 150;
    // Posição da coluna direita (descrições)
    const rightColumnX = MEMORY_STYLES.positions.cardStartX + 150;
    
    // Offset para subir os cards (ajustado para cima)
    const verticalOffset = -50;

    // Definir uma cor mais destacada para cards selecionados
    const selectedCardColor = 0x5599ff; // Azul mais brilhante e distinto

    // Embaralhar a ordem dos pares
    const shuffledPairs = [...lgpdPairs];
    shuffleArray(shuffledPairs);

    // Criar as cartas - Coluna da esquerda (Termos)
    const leftCards = [];
    for (let i = 0; i < shuffledPairs.length; i++) {
      // Ajuste dinâmico do espaçamento Y baseado no número de cards
      const yOffset = (level === 2 && shuffledPairs.length > 5) ? 10 : spacing;
      const y = MEMORY_STYLES.positions.cardStartY + i * (cardHeight + yOffset) + verticalOffset;

      // Card de termo (esquerda)
      const card = scene.add
        .rectangle(leftColumnX, y, cardWidth, cardHeight, MEMORY_STYLES.colors.card)
        .setStrokeStyle(2, 0xffffff)
        .setInteractive({ useHandCursor: true });

      const cardText = scene.add
        .text(leftColumnX, y, shuffledPairs[i].term, {
          fontFamily: "Arial",
          fontSize: "8px",
          color: "#ffffff",
          fontWeight: "bold",
          wordWrap: { width: cardWidth - 10 },
          align: "center",
        })
        .setOrigin(0.5);

      card.value = shuffledPairs[i].term;
      card.pairIndex = i;
      card.isLeftCard = true;
      card.matched = false;
      card.cardText = cardText;

      gameContainer.add([card, cardText]);
      leftCards.push({ card, text: cardText, value: shuffledPairs[i].term, matched: false });
      cards.push({ card, text: cardText, value: shuffledPairs[i].term, matched: false });

      // Evento de clique nos cards
      card.on('pointerdown', function() {
        handleCardClick(card);
      });
    }

    // Embaralhar a ordem das descrições para dificultar
    const shuffledDescriptions = [...shuffledPairs];
    shuffleArray(shuffledDescriptions);

    // Criar as cartas - Coluna da direita (Descrições)
    const rightCards = [];
    for (let i = 0; i < shuffledDescriptions.length; i++) {
      const yOffset = (level === 2 && shuffledDescriptions.length > 5) ? 10 : spacing;
      const y = MEMORY_STYLES.positions.cardStartY + i * (cardHeight + yOffset) + verticalOffset;

      // Card de descrição (direita)
      const card = scene.add
        .rectangle(rightColumnX, y, cardWidth, cardHeight, MEMORY_STYLES.colors.card)
        .setStrokeStyle(2, 0xffffff)
        .setInteractive({ useHandCursor: true })
        .setDepth(9004);

      const cardText = scene.add
        .text(rightColumnX, y, shuffledDescriptions[i].description, {
          fontFamily: "Arial",
          fontSize: "8px",
          color: "#ffffff",
          fontWeight: "bold",
          wordWrap: { width: cardWidth - 10 },
          align: "center",
        })
        .setDepth(9005)
        .setOrigin(0.5);

      card.value = shuffledDescriptions[i].description;
      card.cardText = cardText;
      
      // Encontrar o índice correto do par
      for (let j = 0; j < shuffledPairs.length; j++) {
        if (shuffledPairs[j].description === shuffledDescriptions[i].description) {
          card.pairIndex = j;
          break;
        }
      }
      card.isLeftCard = false;
      card.matched = false;

      gameContainer.add([card, cardText]);
      rightCards.push({ card, text: cardText, value: shuffledDescriptions[i].description, matched: false });
      cards.push({ card, text: cardText, value: shuffledDescriptions[i].description, matched: false });

      // Evento de clique nos cards
      card.on('pointerdown', function() {
        handleCardClick(card);
      });
    }

    // Função para destacar um card selecionado
    function highlightCard(card) {
      // Mudar a cor para uma bem mais destacada
      card.setFillStyle(selectedCardColor);
      
      // Adicionar efeito de escala para destacar ainda mais
      scene.tweens.add({
        targets: [card, card.cardText],
        scaleX: 1.1,
        scaleY: 1.1,
        duration: 150,
        ease: 'Power1'
      });
    }

    // Função para remover destaque de um card
    function unhighlightCard(card) {
      if (!card.matched) {
        card.setFillStyle(MEMORY_STYLES.colors.card);
        
        // Retornar ao tamanho original
        scene.tweens.add({
          targets: [card, card.cardText],
          scaleX: 1,
          scaleY: 1,
          duration: 150,
          ease: 'Power1'
        });
      }
    }

    // Função para lidar com o clique nos cards
    function handleCardClick(card) {
      // Ignorar cliques em cartas já combinadas
      if (card.matched) return;
      
      // Se nenhuma carta estiver selecionada
      if (!selectedCard) {
        // Selecionar esta carta
        selectedCard = card;
        highlightCard(card);
        return;
      }
      
      // Se uma carta já estiver selecionada
      
      // Ignorar clique na mesma carta
      if (selectedCard === card) return;
      
      // Ignorar se tentar selecionar duas cartas do mesmo lado
      if (selectedCard.isLeftCard === card.isLeftCard) {
        // Desseleciona a carta anterior
        unhighlightCard(selectedCard);
        selectedCard = card;
        highlightCard(card);
        return;
      }
      
      // Chegamos aqui, é uma seleção válida de cartas de lados diferentes
      attempts++;
      totalAttempts++;
      
      // Destacar o segundo card selecionado
      highlightCard(card);
      
      // Verificar se é um par correto
      const isMatch = selectedCard.pairIndex === card.pairIndex;
      
      if (isMatch) {
        // Acertou o par!
        selectedCard.matched = true;
        card.matched = true;
        
        // Mudar cor das cartas que formam par
        selectedCard.setFillStyle(MEMORY_STYLES.colors.correct);
        card.setFillStyle(MEMORY_STYLES.colors.correct);
        
        // Retornar ao tamanho normal com animação
        scene.tweens.add({
          targets: [selectedCard, selectedCard.cardText, card, card.cardText],
          scaleX: 1,
          scaleY: 1,
          duration: 300,
          ease: 'Power1'
        });
        
        matchesFound++;
        totalMatchesFound++;
        
        // Limpar seleção atual
        selectedCard = null;
        
        // Verificar se o nível terminou
        if (matchesFound === totalMatches) {
          scene.time.delayedCall(800, function() {
        // Avançar para o próximo nível ou finalizar o jogo
        currentLevel++;
        
        if (currentLevel < totalLevels) {
          // Limpar elementos atuais
          gameContainer.destroy();
          if (instructionsText) instructionsText.destroy();
          if (levelText) levelText.destroy();
            // Criar um painel de transição com animação
            const transitionPanel = scene.add
            .rectangle(
            width / 2,
            height / 2,
            panel.width * 0.7,
            panel.height * 0.5,
            0x1a365d
            )
            .setScrollFactor(0)
            .setDepth(9010)
            .setStrokeStyle(3, 0xffffff)
            .setOrigin(0.5)
            .setAlpha(0)
            .setScale(1);
            
            // Criar textura de estrela com forma corrigida
            if (!scene.textures.exists('star')) {
            const starGraphics = scene.make.graphics();
            starGraphics.clear();
            
            // Definir aparência da estrela
            starGraphics.lineStyle(2, 0xff9900, 1);
            starGraphics.fillStyle(0xffcc00, 1);
            
            // Desenhar estrela com 5 pontas - com raios diferentes para forma correta
            const outerRadius = 15;
            const innerRadius = 7;  // Inner radius deve ser menor que outer
            const cx = 20;  // Centro X da estrela
            const cy = 20;  // Centro Y da estrela
            
            starGraphics.beginPath();
            
            // Desenhar os 10 pontos da estrela (5 externos, 5 internos)
            for (let i = 0; i < 10; i++) {
            // Alternar entre raio externo e interno
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            // Ângulo ajustado para 5 pontas
            const angle = Math.PI * 2 * (i / 10) - Math.PI / 2;
            
            const x = cx + Math.cos(angle) * radius;
            const y = cy + Math.sin(angle) * radius;
            
            if (i === 0) {
            starGraphics.moveTo(x, y);
            } else {
            starGraphics.lineTo(x, y);
            }
            }
            
            starGraphics.closePath();
            starGraphics.fillPath();
            starGraphics.strokePath();
            
            // Gerar textura maior para melhor visualização
            starGraphics.generateTexture('star', 40, 40);
            }
            
            // Centralizar melhor as estrelas
            const starCount = 5;
            const starSpacing = 50; // Reduzido para estrelas mais próximas
            const totalWidth = starCount * starSpacing;
            const startX = width / 2.8 - (totalWidth / 2); // Removido offset extra
            
            // Adicionar estrelas
            const stars = [];
            for (let i = 0; i < starCount; i++) {
            const star = scene.add.image(
            startX + i * starSpacing,
            height / 2 - 60,
            'star'
            ).setScale(0).setDepth(9011);
            
            stars.push(star);
            }
              // Texto de nível completo com sombra e estilo melhorado
              const levelCompleteText = scene.add
              .text(
                width / 2,
                height / 2 - 20,
                `Nível ${currentLevel} Completo!`,
                {
                fontFamily: "Arial",
                fontSize: "28px",
                color: "#ffffff",
                align: "center",
                fontWeight: "bold",
                stroke: "#000000",
                strokeThickness: 4
                }
              )
              .setOrigin(0.5)
              .setScrollFactor(0)
              .setDepth(9011)
              .setAlpha(0);
              
              // Texto secundário com descrição
              const subText = scene.add
              .text(
                width / 2,
                height / 2 + 20,
                `Prepare-se para o Nível ${currentLevel + 1}`,
                {
                fontFamily: "Arial",
                fontSize: "18px",
                color: "#bbffbb",
                align: "center",
                }
              )
              .setOrigin(0.5)
              .setScrollFactor(0)
              .setDepth(9011)
              .setAlpha(0);
              
              // Botão para continuar com efeito de brilho
              const continueButton = scene.add
              .rectangle(
                width / 2,
                height / 2 + 70,
                160,
                45,
                MEMORY_STYLES.colors.buttonPrimary
              )
              .setScrollFactor(0)
              .setDepth(9011)
              .setInteractive({ useHandCursor: true })
              .setStrokeStyle(2, 0xffffff)
              .setAlpha(0);
              
              const continueText = scene.add
              .text(
                width / 2,
                height / 2 + 70,
                "Continuar",
                {
                fontFamily: "Arial",
                fontSize: "18px",
                color: "#ffffff",
                fontWeight: "bold"
                }
              )
              .setScrollFactor(0)
              .setDepth(9012)
              .setOrigin(0.5)
              .setAlpha(0);
              
              // Animação de entrada para o painel
              scene.tweens.add({
              targets: transitionPanel,
              alpha: 1,
              scale: 1,
              duration: 400,
              ease: 'Back.easeOut'
              });
              
              // Animação do texto principal
              scene.tweens.add({
              targets: [levelCompleteText, subText],
              alpha: 1,
              y: '-=10',
              duration: 500,
              delay: 200,
              ease: 'Power2'
              });
              
              // Animação das estrelas
              stars.forEach((star, i) => {
              scene.tweens.add({
                targets: star,
                scale: 1,
                y: height / 2 - 60,
                duration: 400,
                delay: 300 + i * 100,
                ease: 'Back.easeOut'
              });
              
              // Efeito de girar
              scene.tweens.add({
                targets: star,
                angle: 360,
                duration: 1500,
                delay: 300 + i * 100,
                ease: 'Sine.easeInOut'
              });
              });
              
              // Animação do botão
              scene.tweens.add({
              targets: [continueButton, continueText],
              alpha: 1,
              duration: 400,
              delay: 600,
              ease: 'Power2'
              });
              
              // Efeito de pulsar no botão
              scene.tweens.add({
              targets: continueButton,
              scaleX: 1.05,
              scaleY: 1.05,
              yoyo: true,
              repeat: -1,
              duration: 800,
              ease: 'Sine.easeInOut'
              });
              
              // Efeito ao passar o mouse
              continueButton.on('pointerover', function() {
              continueButton.setFillStyle(MEMORY_STYLES.colors.buttonHover);
              continueText.setScale(1.05);
              });
              
              continueButton.on('pointerout', function() {
              continueButton.setFillStyle(MEMORY_STYLES.colors.buttonPrimary);
              continueText.setScale(1);
              });
              
              // Efeito ao clicar
              continueButton.on('pointerdown', function() {
              // Sons se disponíveis
              if (scene.sound && scene.sound.add) {
                try {
                const clickSound = scene.sound.add('click', { volume: 0.5 });
                clickSound.play();
                } catch(e) {
                console.log("Som não disponível");
                }
              }
              
              // Animação de saída
              scene.tweens.add({
                targets: [transitionPanel, levelCompleteText, subText, continueButton, continueText, ...stars],
                alpha: 0,
                scale: 0.8,
                duration: 300,
                ease: 'Power2',
                onComplete: function() {
                transitionPanel.destroy();
                levelCompleteText.destroy();
                subText.destroy();
                continueButton.destroy();
                continueText.destroy();
                stars.forEach(star => star.destroy());
                startLevel(currentLevel);
                }
              });
              });
            } else {
              // Jogo completo - mostrar resultado final
              gameContainer.destroy();
              titleText.destroy();
              if (instructionsText) instructionsText.destroy();
              if (levelText) levelText.destroy();

              // Calcular eficiência total
              const efficiency = totalMatchesFound / totalAttempts;
              const success = efficiency >= 0.3; // 30% eficiência mínima para passar

              let resultMessage;
              if (success) {
                resultMessage = `Parabéns! Você completou todos os níveis em ${totalAttempts} tentativas e libertou a professora!`;
              } else {
                resultMessage = "Você usou muitas tentativas. Tente praticar mais sobre LGPD!";
              }

              cleanupAndShowResult(
                scene,
                background,
                panel,
                success,
                resultMessage,
                callback,
                MEMORY_STYLES
              );
            }
          });
        }
      } else {
        // Errou o par
        // Flash vermelho temporário
        card.setFillStyle(MEMORY_STYLES.colors.incorrect);
        
        // Desselecionar ambas as cartas após um breve intervalo
        scene.time.delayedCall(800, function() {
          if (selectedCard && !selectedCard.matched) {
            unhighlightCard(selectedCard);
          }
          if (!card.matched) {
            unhighlightCard(card);
          }
          selectedCard = null;
        });
      }
    }

    // Instruções para o nível atual (ajustado para refletir o novo gameplay)
    instructionsText = scene.add
      .text(
        width / 2,
        height / 2 + 143,
        "Clique em um termo e depois na descrição correspondente",
        {
          fontFamily: "Arial",
          fontSize: "12px",
          color: "#ffffff",
          align: "center",
        }
      )
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(9002);

    // Texto mostrando o nível atual
    levelText = scene.add
      .text(
        width / 2,
        height / 2 + 160,
        `Nível ${currentLevel + 1} de ${totalLevels}`,
        {
          fontFamily: "Arial",
          fontSize: "13px",
          color: "#ffcc00",
          align: "center",
          fontWeight: "bold"
        }
      )
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(9002);
  }

  // Função para embaralhar array
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}

// 3. JOGO DA FORCA (Professor 3)
function startHangmanGame(scene, callback) {
  console.log("Iniciando jogo da forca...");
  const width = scene.cameras.main.width;
  const height = scene.cameras.main.height;

  // Usar estilo específico do jogo da forca
  const { background, panel, titleText } = createBaseUI(
    scene,
    width,
    height,
    "Acerte a palavra",
    HANGMAN_STYLES
  );

  // Lista de palavras sobre privacidade e proteção de dados
  const words = ["PRIVACIDADE", "LGPD", "DADOS", "SEGURANCA", "PROTECAO", "CONSENTIMENTO"];
  const selectedWord = words[Math.floor(Math.random() * words.length)];

  // Variáveis de controle
  let guesses = [];
  const maxAttempts = 6;
  let attempts = 0;
  let gameResult = null;

  // Container para elementos do jogo
  const gameContainer = scene.add.container(width / 2, height / 2).setDepth(9002);

  // Elementos para exibir a palavra
  const wordDisplay = [];
  const letterSpacing = 23;
  const startX = HANGMAN_STYLES.positions.wordDisplayX - (selectedWord.length * letterSpacing) / 2 + letterSpacing / 2;

  // Criar espaços para cada letra
  for (let i = 0; i < selectedWord.length; i++) {
    const letterBg = scene.add.rectangle(
      startX + i * letterSpacing,
      HANGMAN_STYLES.positions.wordDisplayY,
      20,
      3,
      0xffffff
    );

    const letterText = scene.add
      .text(
        startX + i * letterSpacing,
        HANGMAN_STYLES.positions.wordDisplayY - 15,
        "",
        { fontFamily: "Arial", fontSize: "18px", color: "#ffffff" }
      )
      .setOrigin(0.5);

    gameContainer.add([letterBg, letterText]);
    wordDisplay.push(letterText);
  }

  // Contador de tentativas visual - reposicionado 70px à esquerda e 30px acima da palavra
  const attemptsContainer = scene.add.container(
    HANGMAN_STYLES.positions.wordDisplayX - 200,
    HANGMAN_STYLES.positions.wordDisplayY - 60
  );
  gameContainer.add(attemptsContainer);
  
  // Círculo de fundo para o contador
  const attemptsBg = scene.add.circle(0, 0, 40, 0x333333)
    .setStrokeStyle(3, 0x4488cc);
  attemptsContainer.add(attemptsBg);
  
  // Texto principal para o número
  const attemptsNumber = scene.add.text(
    0, -8, 
    `${maxAttempts - attempts}`, 
    {
      fontFamily: "Arial", fontSize: "28px", 
      color: "#ffffff", fontWeight: "bold"
    }
  ).setOrigin(0.5);
  attemptsContainer.add(attemptsNumber);
  
  // Texto secundário "tentativas"
  const attemptsLabel = scene.add.text(
    0, 12, "tentativas", 
    { fontFamily: "Arial", fontSize: "12px", color: "#cccccc" }
  ).setOrigin(0.5);
  attemptsContainer.add(attemptsLabel);
  
  // Indicadores visuais simplificados
  const indicators = [];
  const indicatorRadius = 50;
  for (let i = 0; i < maxAttempts; i++) {
    const angle = (i * (2 * Math.PI / maxAttempts)) - Math.PI/2;
    const x = Math.cos(angle) * indicatorRadius;
    const y = Math.sin(angle) * indicatorRadius;
    
    const indicator = scene.add.circle(x, y, 4, 0x4488cc);
    indicators.push(indicator);
    attemptsContainer.add(indicator);
  }

  // Teclado virtual
  const keyboardRows = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];
  const keyboard = [];
  const keySize = HANGMAN_STYLES.sizes.keySize;
  const keySpacing = HANGMAN_STYLES.sizes.keySpacing;
  const keyboardX = HANGMAN_STYLES.positions.keyboardX;

  keyboardRows.forEach((row, rowIndex) => {
    const rowLetters = row.split("");
    const rowWidth = rowLetters.length * (keySize + keySpacing) - keySpacing;
    const rowStartX = keyboardX - rowWidth / 2;

    rowLetters.forEach((letter, letterIndex) => {
      const x = rowStartX + letterIndex * (keySize + keySpacing) + keySize / 2;
      const y = HANGMAN_STYLES.positions.keyboardTopY + rowIndex * (keySize + keySpacing);

      const keyBg = scene.add
        .rectangle(x, y, keySize, keySize, HANGMAN_STYLES.colors.keyboardBg)
        .setStrokeStyle(1, 0xffffff)
        .setInteractive({ useHandCursor: true });

      const keyText = scene.add
        .text(x, y, letter, {
          fontFamily: "Arial", fontSize: "14px", 
          color: "#ffffff", fontWeight: "bold",
        })
        .setOrigin(0.5);

      keyboard.push({ key: keyBg, text: keyText, letter: letter });
      gameContainer.add([keyBg, keyText]);

      // Evento de clique
      keyBg.on("pointerdown", () => {
        if (gameResult !== null || guesses.includes(letter)) return;

        keyBg.setFillStyle(0x666666);
        keyBg.disableInteractive();
        guesses.push(letter);

        // Verificar se a letra está na palavra
        let correctGuess = false;
        for (let i = 0; i < selectedWord.length; i++) {
          if (selectedWord[i] === letter) {
            wordDisplay[i].setText(letter);
            correctGuess = true;
          }
        }

        if (!correctGuess) {
          attempts++;
          attemptsNumber.setText(`${maxAttempts - attempts}`);
          
          // Desativar indicador
          if (attempts <= indicators.length) {
            scene.tweens.add({
              targets: indicators[indicators.length - attempts],
              alpha: 0.3, scale: 0.8, duration: 300
            });
          }
          
          // Efeito de shake e mudança de cor com base nas tentativas restantes
          scene.tweens.add({
            targets: attemptsContainer,
            x: { from: attemptsContainer.x - 5, to: attemptsContainer.x },
            duration: 300
          });
          
          if (maxAttempts - attempts <= 2) {
            attemptsBg.setStrokeStyle(3, 0xff4444);
            attemptsNumber.setColor('#ff6666');
          } else if (maxAttempts - attempts <= 3) {
            attemptsBg.setStrokeStyle(3, 0xffaa44);
            attemptsNumber.setColor('#ffcc66');
          }

          // Verificar se perdeu
          if (attempts >= maxAttempts) {
            keyboard.forEach((k) => k.key.disableInteractive());
            endGame(false);
          }
        } else {
          // Flash verde para acerto
          scene.tweens.add({
            targets: attemptsBg,
            fillColor: 0x44aa44,
            yoyo: true, duration: 200
          });
          
          // Verificar se ganhou
          let wordComplete = true;
          for (let i = 0; i < selectedWord.length; i++) {
            if (wordDisplay[i].text === "") {
              wordComplete = false;
              break;
            }
          }

          if (wordComplete) {
            keyboard.forEach((k) => k.key.disableInteractive());
            endGame(true);
          }
        }
      });
    });
  });

  // Instruções
  const instructionsText = scene.add
    .text(
      width / 2,
      height / 2 + HANGMAN_STYLES.positions.instructionsY,
      `Adivinhe a palavra - Você tem ${maxAttempts} tentativas`,
      { fontFamily: "Arial", fontSize: "14px", color: "#ffffff", align: "center" }
    )
    .setOrigin(0.5)
    .setScrollFactor(0)
    .setDepth(9002);

  // Função para finalizar o jogo
  function endGame(success) {
    gameResult = success;

    // Mostrar palavra completa se perdeu
    if (!success) {
      for (let i = 0; i < selectedWord.length; i++) {
        if (wordDisplay[i].text === "") {
          wordDisplay[i].setText(selectedWord[i]);
          wordDisplay[i].setColor("#ff6666");
        }
      }
    }

    // Desativar interações
    keyboard.forEach((k) => k.key.disableInteractive());

    // Exibir resultado após delay
    scene.time.delayedCall(1500, () => {
      gameContainer.destroy();
      titleText.destroy();
      instructionsText.destroy();

      const message = success
        ? "Parabéns! Você adivinhou a palavra."
        : `A palavra era ${selectedWord}. Tente novamente!`;

      cleanupAndShowResult(
        scene,
        background,
        panel,
        success,
        message,
        callback,
        HANGMAN_STYLES
      );
    });
  }
}

// Criando constante com posições explícitas para cada elemento
const CATEGORIZATION_POSITIONS = {
  // Posições do texto de instruções
  instructions: { x: 300, y: 240 },

  // Posição do texto do dado atual
  dataText: { x: 300, y: 320 },

  // Posição do texto de progresso
  progressText: { x: 0, y: 220 },

  // Posições dos botões
  buttonPersonal: { x: 200, y: 410 },
  buttonSensitive: { x: 400, y: 410 },

  // Posição do texto explicativo
  explanationText: { x: 300, y: 490 },

  // Posições do feedback
  feedbackPanel: { x: 300, y: 400 },
  feedbackText: { x: 300, y: 400 },

  // Posição do botão "próximo"
  nextButton: { x: 0, y: 450 },
  nextButtonText: { x: 0, y: 450 },
};

// 4. JOGO CUSTOMIZADO (Professor 4)
function startCustomGame(scene, callback) {
  console.log("Iniciando jogo customizado...");
  const width = scene.cameras.main.width;
  const height = scene.cameras.main.height;

  // Usar estilo específico do jogo de categorização
  const { background, panel, titleText } = createBaseUI(
    scene,
    width,
    height,
    "Categorização de Dados",
    CATEGORIZATION_STYLES
  );

  // Dados para o jogo de categorização com explicações
  const dataItems = [
    {
      text: "Nome completo",
      category: "pessoal",
      explanation:
        "É um dado pessoal porque identifica diretamente uma pessoa, mas não revela aspectos sensíveis.",
    },
    {
      text: "CPF",
      category: "pessoal",
      explanation:
        "É um dado pessoal porque é um identificador direto da pessoa, mas não revela características sensíveis.",
    },
    {
      text: "Endereço",
      category: "pessoal",
      explanation:
        "É um dado pessoal porque está vinculado à pessoa, mas não revela aspectos íntimos ou discriminatórios.",
    },
    {
      text: "Religião",
      category: "sensivel",
      explanation:
        "É um dado sensível porque revela convicções religiosas, podendo gerar discriminação.",
    },
    {
      text: "Opinião política",
      category: "sensivel",
      explanation:
        "É um dado sensível porque revela convicções políticas e pode resultar em discriminação.",
    },
    {
      text: "Histórico médico",
      category: "sensivel",
      explanation:
        "É um dado sensível porque contém informações sobre saúde que merecem proteção especial.",
    },
    {
      text: "Número de telefone",
      category: "pessoal",
      explanation:
        "É um dado pessoal porque está vinculado à pessoa, mas não revela aspectos sensíveis.",
    },
    {
      text: "Biometria",
      category: "sensivel",
      explanation:
        "É um dado sensível porque é uma característica física única e imutável da pessoa.",
    },
    {
      text: "E-mail",
      category: "pessoal",
      explanation:
        "É um dado pessoal porque identifica uma pessoa, mas não revela características sensíveis.",
    },
    {
      text: "Orientação sexual",
      category: "sensivel",
      explanation:
        "É um dado sensível porque revela aspectos íntimos da vida privada e pode gerar discriminação.",
    },
    {
      text: "Origem racial ou étnica",
      category: "sensivel",
      explanation:
        "É um dado sensível porque revela características étnicas que podem levar à discriminação.",
    },
    {
      text: "Filiação sindical",
      category: "sensivel",
      explanation:
        "É um dado sensível porque revela associação a sindicatos e pode gerar discriminação trabalhista.",
    },
    {
      text: "Geolocalização",
      category: "pessoal",
      explanation:
        "É um dado pessoal porque revela onde a pessoa está ou esteve, mas não é considerado sensível pela LGPD.",
    },
  ];

  // Embaralhar itens
  shuffle(dataItems);

  // Limitar a 10 itens para o minigame
  const gameItems = dataItems.slice(0, 10);

  // Variáveis de controle
  let currentItemIndex = 0;
  let correctAnswers = 0;
  let gameEnded = false;

  // Container para o jogo - centralizado na tela
  const gameContainer = scene.add
    .container(width / 2, height / 2 - 50)
    .setDepth(9002);

  // Instruções - usando posições explícitas
  const instructionsText = scene.add
    .text(
      CATEGORIZATION_POSITIONS.instructions.x,
      CATEGORIZATION_POSITIONS.instructions.y,
      "Classifique o tipo de dado conforme a LGPD:",
      {
        fontFamily: "Arial",
        fontSize: "18px",
        color: "#ffffff",
        align: "center",
        fontWeight: "bold",
      }
    )
    .setOrigin(0.5);

  gameContainer.add(instructionsText);

  // Elemento de dados atual - usando posições explícitas
  const dataText = scene.add
    .text(
      CATEGORIZATION_POSITIONS.dataText.x,
      CATEGORIZATION_POSITIONS.dataText.y,
      gameItems[0].text,
      {
        fontFamily: "Arial",
        fontSize: "24px",
        color: "#ffffff",
        align: "center",
        fontWeight: "bold",
      }
    )
    .setOrigin(0.5);

  gameContainer.add(dataText);

  // Contador de progresso - usando posições explícitas
  const progressText = scene.add
    .text(
      CATEGORIZATION_POSITIONS.progressText.x,
      CATEGORIZATION_POSITIONS.progressText.y,
      `Item 1/${gameItems.length}`,
      {
        fontFamily: "Arial",
        fontSize: "16px",
        color: "#ffffff",
        align: "center",
      }
    )
    .setOrigin(0.5);

  gameContainer.add(progressText);

  // Botões de categorias - usando posições explícitas
  const buttonPersonal = scene.add
    .rectangle(
      CATEGORIZATION_POSITIONS.buttonPersonal.x,
      CATEGORIZATION_POSITIONS.buttonPersonal.y,
      180,
      50,
      CATEGORIZATION_STYLES.colors.optionPersonal
    )
    .setStrokeStyle(2, 0xffffff)
    .setInteractive({ useHandCursor: true });

  const buttonPersonalText = scene.add
    .text(
      CATEGORIZATION_POSITIONS.buttonPersonal.x,
      CATEGORIZATION_POSITIONS.buttonPersonal.y,
      "Dado Pessoal",
      {
        fontFamily: "Arial",
        fontSize: "16px",
        color: "#ffffff",
        fontWeight: "bold",
      }
    )
    .setOrigin(0.5);

  const buttonSensitive = scene.add
    .rectangle(
      CATEGORIZATION_POSITIONS.buttonSensitive.x,
      CATEGORIZATION_POSITIONS.buttonSensitive.y,
      180,
      50,
      CATEGORIZATION_STYLES.colors.optionSensitive
    )
    .setStrokeStyle(2, 0xffffff)
    .setInteractive({ useHandCursor: true });

  const buttonSensitiveText = scene.add
    .text(
      CATEGORIZATION_POSITIONS.buttonSensitive.x,
      CATEGORIZATION_POSITIONS.buttonSensitive.y,
      "Dado Sensível",
      {
        fontFamily: "Arial",
        fontSize: "16px",
        color: "#ffffff",
        fontWeight: "bold",
      }
    )
    .setOrigin(0.5);

  gameContainer.add([
    buttonPersonal,
    buttonPersonalText,
    buttonSensitive,
    buttonSensitiveText,
  ]);

  // Explicação - usando posições explícitas
  const explanationText = scene.add
    .text(
      CATEGORIZATION_POSITIONS.explanationText.x,
      CATEGORIZATION_POSITIONS.explanationText.y,
      "Dados sensíveis incluem informações sobre: raça, religião, opinião política,\nsaúde, vida sexual, genética, biometria, filiação sindical, etc.",
      {
        fontFamily: "Arial",
        fontSize: "14px",
        color: "#bbbbbb",
        align: "center",
      }
    )
    .setOrigin(0.5);

  gameContainer.add(explanationText);

  // Painel de feedback - usando posições explícitas
  const feedbackPanel = scene.add
    .rectangle(
      CATEGORIZATION_POSITIONS.feedbackPanel.x,
      CATEGORIZATION_POSITIONS.feedbackPanel.y,
      400,
      100,
      0x333333
    )
    .setStrokeStyle(2, 0xffffff)
    .setAlpha(0);

  const feedbackText = scene.add
    .text(
      CATEGORIZATION_POSITIONS.feedbackText.x,
      CATEGORIZATION_POSITIONS.feedbackText.y,
      "",
      {
        fontFamily: "Arial",
        fontSize: "14px",
        color: "#ffffff",
        align: "center",
        wordWrap: { width: 380 },
      }
    )
    .setOrigin(0.5)
    .setAlpha(0);

  // Botão próximo - usando posições explícitas
  const nextButton = scene.add
    .rectangle(
      CATEGORIZATION_POSITIONS.nextButton.x,
      CATEGORIZATION_POSITIONS.nextButton.y,
      100,
      30,
      CATEGORIZATION_STYLES.colors.buttonPrimary
    )
    .setStrokeStyle(1, 0xffffff)
    .setInteractive({ useHandCursor: true })
    .setAlpha(0);

  const nextButtonText = scene.add
    .text(
      CATEGORIZATION_POSITIONS.nextButtonText.x,
      CATEGORIZATION_POSITIONS.nextButtonText.y,
      "Próximo",
      {
        fontFamily: "Arial",
        fontSize: "14px",
        color: "#ffffff",
      }
    )
    .setOrigin(0.5)
    .setAlpha(0);

  gameContainer.add([feedbackPanel, feedbackText, nextButton, nextButtonText]);

  // Eventos de botões
  buttonPersonal.on("pointerover", () => buttonPersonal.setFillStyle(0x4477dd));
  buttonPersonal.on("pointerout", () =>
    buttonPersonal.setFillStyle(CATEGORIZATION_STYLES.colors.optionPersonal)
  );
  buttonSensitive.on("pointerover", () =>
    buttonSensitive.setFillStyle(0xdd4477)
  );
  buttonSensitive.on("pointerout", () =>
    buttonSensitive.setFillStyle(CATEGORIZATION_STYLES.colors.optionSensitive)
  );

  // Configurar evento do botão próximo de forma global (só uma vez)
  nextButton.on("pointerover", () =>
    nextButton.setFillStyle(CATEGORIZATION_STYLES.colors.buttonHover)
  );
  nextButton.on("pointerout", () =>
    nextButton.setFillStyle(CATEGORIZATION_STYLES.colors.buttonPrimary)
  );
  nextButton.on("pointerdown", advanceToNextItem);

  buttonPersonal.on("pointerdown", () => selectCategory("pessoal"));
  buttonSensitive.on("pointerdown", () => selectCategory("sensivel"));

  // Função para selecionar categoria
  function selectCategory(category) {
    if (gameEnded) return;

    // Desabilitar botões durante feedback
    buttonPersonal.disableInteractive();
    buttonSensitive.disableInteractive();

    // Verificar resposta
    const currentItem = gameItems[currentItemIndex];
    const isCorrect = currentItem.category === category;

    // Mostrar feedback visual
    const feedbackColor = isCorrect
      ? CATEGORIZATION_STYLES.colors.correct
      : CATEGORIZATION_STYLES.colors.incorrect;
    const categoryButton =
      category === "pessoal" ? buttonPersonal : buttonSensitive;

    categoryButton.setFillStyle(feedbackColor);

    if (isCorrect) correctAnswers++;

    // Mostrar feedback explicativo
    const resultPrefix = isCorrect ? "Correto! " : "Incorreto. ";
    feedbackText.setText(resultPrefix + currentItem.explanation);

    // Cores do painel de feedback
    feedbackPanel.setFillStyle(isCorrect ? 0x1e4620 : 0x5c1c1c);

    // Mostrar elementos de feedback
    feedbackPanel.setAlpha(1);
    feedbackText.setAlpha(1);
    nextButton.setAlpha(1);
    nextButtonText.setAlpha(1);
  }

  function advanceToNextItem() {
    // Esconder feedback
    feedbackPanel.setAlpha(0);
    feedbackText.setAlpha(0);
    nextButton.setAlpha(0);
    nextButtonText.setAlpha(0);

    // Resetar botões
    buttonPersonal.setFillStyle(CATEGORIZATION_STYLES.colors.optionPersonal);
    buttonSensitive.setFillStyle(CATEGORIZATION_STYLES.colors.optionSensitive);

    // Reabilitar botões
    buttonPersonal.setInteractive({ useHandCursor: true });
    buttonSensitive.setInteractive({ useHandCursor: true });

    // Avançar para próximo item
    currentItemIndex++;

    if (currentItemIndex < gameItems.length) {
      // Próximo item
      dataText.setText(gameItems[currentItemIndex].text);
      progressText.setText(`Item ${currentItemIndex + 1}/${gameItems.length}`);
    } else {
      // Fim do jogo
      gameEnded = true;

      scene.time.delayedCall(500, () => {
        gameContainer.destroy();
        titleText.destroy();
        const success = correctAnswers / gameItems.length >= 0.7; // 70% de acerto mínimo
        let resultMessage;
        if (success) {
          resultMessage = `Você acertou ${correctAnswers} de ${gameItems.length} classificações e liberou a professora!`;
        } else {
          resultMessage = `Você acertou apenas ${correctAnswers} de ${gameItems.length} classificações. Tente novamente!`;
        }

        cleanupAndShowResult(
          scene,
          background,
          panel,
          success,
          resultMessage,
          callback,
          CATEGORIZATION_STYLES
        );
      });
    }
  }

  // Função para embaralhar array
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
}
// Função para embaralhar array
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Função unificada para inicializar o minigame com base no ID do professor
function initMinigame(scene, professorId, callback) {
  console.log(`Iniciando minigame para o professor: ${professorId}`);
  window.minigameActive = true;

  // Validar o ID do professor para garantir que é uma string válida
  if (!professorId || typeof professorId !== "string") {
    console.error("ID de professor inválido:", professorId);
    professorId = "default";
  }

  // Mostrar o loader enquanto carrega
  showMinigameLoader();

  // Log adicional para debug
  console.log(`Iniciando minigame do professor ${professorId}`);

  // Simular algum tempo de carregamento para garantir que os estilos sejam aplicados
  setTimeout(() => {
    // Configurações do minigame baseado no professor
    switch (professorId.toLowerCase()) {
      case "professor1":
        console.log("Carregando quiz LGPD para Professor 1");
        // Quiz sobre fundamentos da LGPD
        const quizData = {
          title: "Quiz sobre LGPD",
          questions: [
            {
              question: "O que significa a sigla LGPD?",
              options: [
                "Lei Geral da Prefeitura de Diadema",
                "Lei de Garantia e Proteção de Dados",
                "Liderança Governamental de Proteção de Dados",
                "Lei Geral de Proteção de Dados Pessoais",
              ],
              correct: 3,
              feedback:
                "A LGPD (Lei Geral de Proteção de Dados Pessoais) é a legislação brasileira que regula as atividades de tratamento de dados pessoais. Ela foi inspirada na GDPR europeia e garante maior controle dos cidadãos sobre suas informações pessoais.",
            },
            {
              question: "Qual o principal objetivo da LGPD?",
              options: [
                "Liberar o uso de dados pessoais",
                "Divulgar vídeos de gatos na internet",
                "Proteger os direitos fundamentais de liberdade e privacidade",
                "Restringir o uso da internet",
              ],
              correct: 2,
              feedback:
                "A LGPD tem como principal objetivo proteger os direitos fundamentais de liberdade e privacidade, criando regras para o tratamento de dados pessoais por empresas e órgãos públicos, garantindo maior transparência e segurança para os titulares dos dados.",
            },
            {
              question: "O que são considerados dados pessoais pela LGPD?",
              options: [
                "Apenas nome e CPF",
                "Somente dados bancários",
                "Informações relacionadas à pessoa identificada ou identificável",
                "Apenas o que está nas redes socias",
              ],
              correct: 2,
              feedback:
                "De acordo com a LGPD, dados pessoais são todas as informações relacionadas a uma pessoa identificada ou identificável. Isso inclui nome, endereço, e-mail, dados biométricos, histórico médico, dados de localização e qualquer outra informação que possa identificar uma pessoa.",
            },
          ],
        };
        createImprovedQuizMinigame(scene, quizData, callback);
        break;

      case "professor2":
        console.log("Carregando jogo da memória");
        startMemoryGame(scene, callback);
        break;

      case "professor3":
        console.log("Carregando jogo da forca");
        startHangmanGame(scene, callback);
        break;

      case "professor4":
        console.log("Carregando jogo customizado");
        startCustomGame(scene, callback);
        break;

      default:
        console.warn(
          `ID de professor desconhecido: ${professorId}, carregando minigame padrão`
        );
        // Quiz padrão
        const defaultQuizData = {
          title: "Quiz sobre Proteção de Dados",
          questions: [
            {
              question: "O que significa a sigla LGPD?",
              options: [
                "Lei Geral da Prefeitura de Diadema",
                "Lei de Garantia e Proteção de Dados",
                "Liderança Governamental de Proteção de Dados",
                "Lei Geral de Proteção de Dados Pessoais",
              ],
              correct: 3,
            },
          ],
        };
        createImprovedQuizMinigame(scene, defaultQuizData, callback);
        break;
    }

    // Ocultar o loader após alguns ms para garantir que tudo foi renderizado
    setTimeout(hideMinigameLoader, 300);
  }, 200);
}

// Exportar a função initMinigame para o escopo global
window.initMinigame = initMinigame;

// Funções auxiliares compartilhadas - adaptadas para usar estilo específico
function createBaseUI(scene, width, height, title, styleObj = MINIGAME_STYLES) {
  // Calcular dimensões proporcionais com base no estilo específico
  const screenHeight = height;

  // Usar tamanhos do estilo específico
  const panelWidth = Math.min(width * styleObj.sizes.panelWidth, 800);
  const panelHeight = Math.min(
    height * styleObj.sizes.panelHeight,
    screenHeight * 0.9
  );

  // Criar fundo com cor do estilo específico
  const background = scene.add
    .rectangle(
      width / 2,
      height / 2,
      width,
      height,
      styleObj.colors.background,
      0
    )
    .setScrollFactor(0)
    .setDepth(9000);

  // Animar a visibilidade para evitar flash
  scene.tweens.add({
    targets: background,
    alpha: 0.8,
    duration: 300,
    ease: "Power1",
  });

  // Centralizar perfeitamente o painel na tela
  const panel = scene.add
    .rectangle(
      width / 2,
      height / 2, // Centralizar perfeitamente na vertical
      panelWidth,
      panelHeight,
      styleObj.colors.panel
    )
    .setScrollFactor(0)
    .setDepth(9001)
    .setOrigin(0.5)
    .setStrokeStyle(2, 0xffffff)
    .setAlpha(0)
    .setScale(0.9);

  // Animar entrada do painel
  scene.tweens.add({
    targets: panel,
    alpha: 1,
    scale: 1,
    duration: 300,
    ease: "Back.easeOut",
  });

  // Título do minigame - posicionado com base no painel
  const titleText = scene.add
    .text(
      width / 2,
      height / 2 - panelHeight / 2 + 25,
      title,
      styleObj.fonts.title
    )
    .setScrollFactor(0)
    .setDepth(9002)
    .setOrigin(0.5)
    .setAlpha(0);

  // Animar entrada do título após o painel
  scene.tweens.add({
    targets: titleText,
    alpha: 1,
    y: height / 2 - panelHeight / 2 + 25,
    duration: 300,
    delay: 150,
  });

  return {
    background,
    panel,
    titleText,
  };
}

function cleanupAndShowResult(
  scene,
  background,
  panel,
  success,
  message,
  callback,
  styleObj = MINIGAME_STYLES
) {
  // Remover quaisquer elementos de texto de título que ainda estejam visíveis
  scene.children.list.forEach((child) => {
    if (
      child.type === "Text" &&
      child.text === "Quiz sobre LGPD" &&
      child.depth === 9002
    ) {
      child.destroy();
    }
  });

  // Criar painel de resultado com animação - Aumentado para acomodar mensagens mais longas
  const resultPanel = scene.add
    .rectangle(
      scene.cameras.main.width / 2,
      scene.cameras.main.height / 2,
      400,
      160, // Aumentado de 340x120 para 400x160
      success ? styleObj.colors.correct : styleObj.colors.incorrect
    )
    .setStrokeStyle(3, 0xffffff)
    .setScrollFactor(0)
    .setDepth(9003)
    .setOrigin(0.5)
    .setAlpha(0)
    .setScale(0.8);

  const resultText = scene.add
    .text(
      scene.cameras.main.width / 2,
      scene.cameras.main.height / 2,
      message,
      {
        fontFamily: "Arial",
        fontSize: "18px",
        color: "#ffffff",
        align: "center",
        padding: { x: 20, y: 15 }, // Aumentado o padding
        wordWrap: { width: 360 }, // Adicionado word wrap para garantir quebra de linha correta
      }
    )
    .setScrollFactor(0)
    .setDepth(9004)
    .setOrigin(0.5)
    .setAlpha(0)
    .setScale(0.8);

  // Animar saída dos elementos anteriores
  scene.tweens.add({
    targets: [panel, background],
    alpha: 0,
    duration: 300,
  });

  // Animar entrada do resultado
  scene.tweens.add({
    targets: [resultPanel, resultText],
    alpha: 1,
    scale: 1,
    duration: 400,
    ease: "Back.easeOut",
    onComplete: () => {
      // Debug log para verificar o valor de success
      console.log(`Showing result - Success: ${success}, Message: ${message}`);

      // Remover após alguns segundos com animação de saída
      scene.time.delayedCall(1500, () => {
        scene.tweens.add({
          targets: [resultPanel, resultText],
          alpha: 0,
          scale: 0.8,
          duration: 300,
          onComplete: () => {
            resultPanel.destroy();
            resultText.destroy();
            window.minigameActive = false;
            // Outro log para verificar o valor passado para o callback
            console.log(`Calling callback with success: ${success}`);
            callback(success);
          },
        });
      });
    },
  });
}

// Nova função para mostrar UI de pergunta com retorno ao chamador - ajustado o posicionamento
function showQuestionUI(
  scene,
  questionData,
  width,
  height,
  panel,
  callback,
  elementsArray,
  styleObj = MINIGAME_STYLES
) {
  // Texto da pergunta - posicionado com ajuste para melhor visualização
  const questionText = scene.add
    .text(
      width / 2,
      height / 2 - 60, // Posicionado menos acima para centralizar melhor
      questionData.question,
      {
        fontFamily: "Arial, Helvetica, sans-serif",
        fontSize: "18px",
        color: "#ffffff",
        align: "center",
        fontWeight: "bold",
        wordWrap: { width: panel.width - 60 },
      }
    )
    .setScrollFactor(0)
    .setDepth(9002)
    .setOrigin(0.5);

  elementsArray.push(questionText);

  // Criar botões para as opções
  const buttons = [];
  const optionLetters = [];
  const optionTexts = [];

  const buttonWidth = panel.width * 0.75;
  const buttonHeight = 40;
  const spacing = 12;

  // Ajustar posição inicial para garantir que todas as opções sejam visíveis
  const startY = height / 2 - 10;

  // Criar botões de forma simplificada
  questionData.options.forEach((option, index) => {
    const y = startY + index * (buttonHeight + spacing);

    // Botão
    const button = scene.add
      .rectangle(
        width / 2,
        y,
        buttonWidth,
        buttonHeight,
        styleObj.colors.buttonPrimary
      )
      .setScrollFactor(0)
      .setDepth(9002)
      .setStrokeStyle(1, 0xffffff)
      .setInteractive({ useHandCursor: true });

    // Letra da opção (A, B, C, D)
    const letter = scene.add
      .text(
        width / 2 - buttonWidth / 2 + 20,
        y,
        String.fromCharCode(65 + index),
        {
          fontFamily: "Arial",
          fontSize: "16px",
          fontWeight: "bold",
          color: "#ffffff",
        }
      )
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(9003);

    // Texto da opção
    const text = scene.add
      .text(width / 2 - buttonWidth / 2 + 40, y, option, {
        fontFamily: "Arial",
        fontSize: "15px",
        color: "#ffffff",
        wordWrap: { width: buttonWidth - 60 },
      })
      .setOrigin(0, 0.5)
      .setScrollFactor(0)
      .setDepth(9003);

    // Adicionar aos arrays
    buttons.push(button);
    optionLetters.push(letter);
    optionTexts.push(text);

    // Adicionar aos elementos para limpeza posterior
    elementsArray.push(button, letter, text);

    // Eventos de hover
    button.on("pointerover", () => {
      button.setFillStyle(styleObj.colors.buttonHover);
    });

    button.on("pointerout", () => {
      button.setFillStyle(styleObj.colors.buttonPrimary);
    });

    // Evento de clique - modificado para mostrar feedback
    button.on("pointerdown", () => {
      // Desativar todos os botões
      buttons.forEach((b) => b.disableInteractive());

      // Verificar resposta
      const isCorrect = index === questionData.correct;

      // Destacar botão clicado
      button.setFillStyle(
        isCorrect ? styleObj.colors.correct : styleObj.colors.incorrect
      );

      // Destacar opção correta se errou
      if (
        !isCorrect &&
        questionData.correct >= 0 &&
        questionData.correct < buttons.length
      ) {
        buttons[questionData.correct].setFillStyle(styleObj.colors.correct);
      }

      // Mostrar feedback detalhado em vez de avançar automaticamente
      showAnswerFeedback(
        scene,
        questionData,
        width,
        height,
        panel,
        isCorrect,
        elementsArray,
        callback,
        styleObj
      );
    });
  });
}

// Nova função para mostrar feedback detalhado da resposta - melhorada para evitar sobreposição de texto
function showAnswerFeedback(
  scene,
  questionData,
  width,
  height,
  panel,
  isCorrect,
  elementsArray,
  callback,
  styleObj = MINIGAME_STYLES
) {
  // Container para o feedback - maior para acomodar textos longos
  const feedbackPanel = scene.add
    .rectangle(
      width / 2,
      height / 2 + 110, // Posicionado mais abaixo
      panel.width * 0.85,
      200, // Aumentado de 140 para 160 para textos longos
      isCorrect ? 0x1e4620 : 0x5c1c1c // Verde escuro para correto, vermelho escuro para incorreto
    )
    .setScrollFactor(0)
    .setDepth(9005)
    .setOrigin(0.5)
    .setStrokeStyle(2, 0xffffff)
    .setAlpha(0);

  // Título do feedback - mais espaço na parte superior
  const feedbackTitle = scene.add
    .text(
      width / 2,
      height / 2 + 25, // Movido mais para cima
      isCorrect ? "Correto!" : "Incorreto!",
      {
        fontFamily: "Arial",
        fontSize: "18px",
        fontWeight: "bold",
        color: isCorrect ? "#8eff8e" : "#ff8e8e",
      }
    )
    .setScrollFactor(0)
    .setDepth(9006)
    .setOrigin(0.5)
    .setAlpha(0);

  // Texto com explicação detalhada - mais espaço para o texto e posicionado mais acima
  const feedbackText = scene.add
    .text(
      width / 2,
      height / 2 + 85,
      questionData.feedback || "Resposta registrada.",
      {
        fontFamily: "Arial",
        fontSize: "12px", // Reduzido de 14px para 13px
        color: "#ffffff",
        align: "center",
        wordWrap: { width: panel.width * 0.7 }, // Reduzido ainda mais para melhor quebra de linha
      }
    )
    .setScrollFactor(0)
    .setDepth(9006)
    .setOrigin(0.5)
    .setAlpha(0);

  // Botão "Próxima" - movido ainda mais para baixo
  const nextButton = scene.add
    .rectangle(
      width / 2,
      height / 2 + 160, // Movido mais para baixo para deixar espaço para o texto
      120,
      35,
      styleObj.colors.buttonPrimary
    )
    .setScrollFactor(0)
    .setDepth(9006)
    .setStrokeStyle(2, 0xffffff)
    .setInteractive({ useHandCursor: true })
    .setAlpha(0);

  const nextButtonText = scene.add
    .text(
      width / 2,
      height / 2 + 160, // Movido mais para baixo
      "Próxima",
      {
        fontFamily: "Arial",
        fontSize: "16px",
        color: "#ffffff",
        fontWeight: "bold",
      }
    )
    .setScrollFactor(0)
    .setDepth(9007)
    .setOrigin(0.5)
    .setAlpha(0);

  // Animação para mostrar o feedback
  scene.tweens.add({
    targets: [
      feedbackPanel,
      feedbackTitle,
      feedbackText,
      nextButton,
      nextButtonText,
    ],
    alpha: 1,
    duration: 300,
    ease: "Power2",
  });

  // Adicionar ao array de elementos para limpeza posterior
  elementsArray.push(
    feedbackPanel,
    feedbackTitle,
    feedbackText,
    nextButton,
    nextButtonText
  );

  // Eventos do botão
  nextButton.on("pointerover", () =>
    nextButton.setFillStyle(styleObj.colors.buttonHover)
  );
  nextButton.on("pointerout", () =>
    nextButton.setFillStyle(styleObj.colors.buttonPrimary)
  );

  nextButton.on("pointerdown", () => {
    // Animar saída do feedback
    scene.tweens.add({
      targets: [
        feedbackPanel,
        feedbackTitle,
        feedbackText,
        nextButton,
        nextButtonText,
      ],
      alpha: 0,
      duration: 200,
      onComplete: () => {
        // Avançar para próxima pergunta
        callback(isCorrect);
      },
    });
  });
}

// Mantém a função original apenas para compatibilidade
function showQuestion(scene, questionData, width, height, panel, callback) {
  return showQuestionUI(
    scene,
    questionData,
    width,
    height,
    panel,
    callback,
    []
  );
}

// Adicione estilos CSS para o spinner de carregamento
(function () {
  const style = document.createElement("style");
  style.textContent = `
        .minigame-loader {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            transition: opacity 0.3s ease;
        }
        
        .loader-spinner {
            width: 50px;
            height: 50px;
            border: 5px solid rgba(255,255,255,0.3);
            border-radius: 50%;
            border-top-color: #fff;
            animation: spin 1s ease-in-out infinite;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    `;
  document.head.appendChild(style);
})();
