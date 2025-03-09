function initMinigame(parentScene, professorId = 'professor1', onCompleteCallback) {
  console.log(`Inicializando minigame para ${professorId}...`);
  
  // Garantir que estamos usando as dimensões da câmera, não do mundo
  const gameWidth = parentScene.cameras.main.width;
  const gameHeight = parentScene.cameras.main.height;
  
  // Remover o overlay escuro completamente (ou tornar transparente)
  // const overlay = parentScene.add.graphics();
  // overlay.fillStyle(0x000000, 0.7);
  // overlay.fillRect(...);
  // overlay.setScrollFactor(0).setDepth(1001);
  
  // Criar um overlay invisível apenas para detectar cliques fora do minigame
  const overlay = parentScene.add.graphics();
  overlay.fillStyle(0x000000, 0); // Alpha 0 = totalmente transparente
  overlay.fillRect(
    parentScene.cameras.main.worldView.x,
    parentScene.cameras.main.worldView.y,
    gameWidth,
    gameHeight
  );
  overlay.setScrollFactor(0).setDepth(1001);
  overlay.setInteractive(
    new Phaser.Geom.Rectangle(0, 0, gameWidth, gameHeight),
    Phaser.Geom.Rectangle.Contains
  );

  // Dimensionar o painel de conteúdo de forma consistente
  const boxWidth = Math.min(500, gameWidth * 0.7);
  const boxHeight = Math.min(445, gameHeight * 0.7);
  
  // Posicionamento centralizado na câmera, não no mundo
  const boxX = gameWidth / 2 - boxWidth / 2;
  const boxY = gameHeight / 2 - boxHeight / 2;

  // Criar painel sempre centralizado na tela
  const contentBox = parentScene.add.graphics();
  contentBox.fillStyle(0x333366, 0.95);
  contentBox.fillRoundedRect(boxX, boxY, boxWidth, boxHeight, 15);
  contentBox.lineStyle(4, 0xffffff, 1);
  contentBox.strokeRoundedRect(boxX, boxY, boxWidth, boxHeight, 15);
  contentBox.setScrollFactor(0).setDepth(1001);

  // Remover completamente a verificação para o minigame de associação
  // Todas as professoras usarão o quiz normal agora
  
  // Configurar perguntas específicas para cada professor
  const quizzes = {
    professor1: [
      {
        question: "O que significa a sigla LGPD?",
        options: [
          "Lei Geral de Proteção de Dados",
          "Lei Governamental de Proteção Digital",
          "Lei Geral de Privacidade de Documentos",
          "Lei de Garantia e Proteção de Dados"
        ],
        correct: 0
      },
      {
        question: "Qual o principal objetivo da LGPD?",
        options: [
          "Restringir o uso da internet",
          "Proteger os direitos fundamentais de liberdade e privacidade",
          "Aumentar a vigilância governamental",
          "Bloquear sites estrangeiros no Brasil"
        ],
        correct: 1
      },
      {
        question: "O que são considerados dados pessoais pela LGPD?",
        options: [
          "Apenas nome e CPF",
          "Somente dados bancários",
          "Informações relacionadas à pessoa identificada ou identificável",
          "Apenas o que está nas redes sociais"
        ],
        correct: 2
      }
    ],
    professor2: [
      {
        question: "O que são dados pessoais sensíveis segundo a LGPD?",
        options: [
          "Apenas dados médicos",
          "Dados sobre origem racial, convicção religiosa, opinião política, dados referentes à saúde, entre outros",
          "Apenas dados de crianças",
          "Apenas números de documentos"
        ],
        correct: 1
      },
      {
        question: "Qual princípio da LGPD determina que os dados devem ser usados apenas para fins específicos?",
        options: [
          "Transparência",
          "Adequação",
          "Finalidade",
          "Segurança"
        ],
        correct: 2
      },
      {
        question: "Quem é considerado 'titular dos dados' pela LGPD?",
        options: [
          "A empresa que coleta os dados",
          "O governo que fiscaliza",
          "A pessoa natural a quem os dados se referem",
          "A ANPD (Autoridade Nacional de Proteção de Dados)"
        ],
        correct: 2
      }
    ],
    professor3: [
      {
        question: "Qual direito a LGPD garante aos titulares de dados?",
        options: [
          "Direito de receber pagamento pelos dados",
          "Direito de acessar, corrigir e solicitar exclusão dos dados",
          "Direito de processar empresas a qualquer momento",
          "Direito de impedir qualquer uso de seus dados"
        ],
        correct: 1
      },
      {
        question: "O que caracteriza um dado pessoal segundo a LGPD?",
        options: [
          "Apenas informações que identificam diretamente uma pessoa",
          "Apenas documentos oficiais como RG e CPF",
          "Qualquer informação que possa identificar uma pessoa direta ou indiretamente",
          "Apenas informações médicas e financeiras"
        ],
        correct: 2
      },
      {
        question: "Qual princípio da LGPD impõe limites ao tratamento de dados?",
        options: [
          "Princípio da necessidade",
          "Princípio da adequação",
          "Princípio da limitação",
          "Princípio da minimização"
        ],
        correct: 0
      }
    ],
    professor4: [
      {
        question: "Qual é a penalidade para empresas que violam a LGPD?",
        options: [
          "Apenas advertência",
          "Apenas suspensão do serviço",
          "Pode incluir multa de até 2% do faturamento limitado a R$50 milhões",
          "Prisão imediata dos responsáveis"
        ],
        correct: 2
      },
      {
        question: "O que é necessário para que uma empresa use dados pessoais conforme a LGPD?",
        options: [
          "Apenas ter os dados armazenados",
          "Consentimento do titular ou outra base legal",
          "Apenas informar que está coletando",
          "Não há necessidade de permissão"
        ],
        correct: 1
      },
      {
        question: "Qual direito NÃO é garantido ao titular dos dados pela LGPD?",
        options: [
          "Acesso aos dados",
          "Correção de dados incompletos ou incorretos",
          "Receber pagamento pelo uso dos seus dados",
          "Revogação do consentimento"
        ],
        correct: 2
      }
    ]
  };

  // Selecionar as perguntas corretas para o professor atual
  questions = quizzes[professorId] || quizzes.professor1;

  // Ajustar o título baseado no professor
  let title = `Ajude ${professorId === 'professor1' ? 'a professora' : 'o ' + professorId} a recuperar o controle`;

  // Criar o título centralizado
  const titleText = parentScene.add.text(
    gameWidth / 2, // Centralizado horizontalmente
    boxY + 30,     // Posição Y relativa ao topo da caixa
    title,
    {
      fontFamily: 'Press Start 2P',
      fontSize: '20px',
      color: '#ffffff',
      align: 'center'
    }
  ).setOrigin(0.5).setScrollFactor(0).setDepth(1002);
  
  // Adicionar instruções apropriadas para o professor específico
  let instructionText = "Você precisa responder corretamente às perguntas sobre a LGPD\n";
  if (professorId === 'professor2') {
    instructionText += "para ajudar o professor 2 a se libertar do controle do hacker.";
  } else if (professorId === 'professor4') {
    instructionText += "para ajudar o professor 4 a se libertar do controle do hacker.";
  } else {
    instructionText += "para ajudar a professora a se libertar do controle do hacker.";
  }
  
  const instructions = parentScene.add.text(gameWidth / 2, boxY + 70, instructionText, {
    fontFamily: "Arial",
    fontSize: "14px",
    color: "#FFFFFF",
    align: "center",
    wordWrap: { width: boxWidth - 40 }
  }).setOrigin(0.5).setScrollFactor(0).setDepth(1001);
  
  // Variáveis de controle do jogo
  let currentQuestion = 0;
  let score = 0;
  let questionText;
  let optionButtons = [];
  let feedbackText = null;
  
  // Ajustar posição vertical inicial das perguntas
  const questionStartY = boxY + 100;

  // Função para mostrar uma pergunta
  function showQuestion(index) {
    // Limpar perguntas anteriores
    if (questionText) questionText.destroy();
    optionButtons.forEach(button => button.destroy());
    optionButtons = [];
    
    const question = questions[index];
    
    // Mostrar a pergunta centralizada
    questionText = parentScene.add.text(
      gameWidth / 2,
      boxY + 120,
      question.question,
      {
        fontFamily: 'Arial',
        fontSize: '18px',
        color: '#ffffff',
        align: 'center',
        wordWrap: { width: boxWidth - 60 },
        lineSpacing: 10
      }
    ).setOrigin(0.5).setScrollFactor(0).setDepth(1002);
    
    // Calcular espaço entre opções e posição inicial
    const totalOptions = question.options.length;
    const optionHeight = 40;
    const optionSpacing = 15;
    const startY = boxY + 180;

    // Mostrar as opções - CORREÇÃO DO PROBLEMA DE HOVER
    for (let i = 0; i < question.options.length; i++) {
      const y = startY + (i * (optionHeight + optionSpacing));

      // Container centralizado horizontalmente
      const optionContainer = parentScene.add.container(
        gameWidth / 2,
        y
      );
      optionContainer.setScrollFactor(0).setDepth(1002);

      // Constantes para o tamanho e posição do botão
      const buttonWidth = 300;
      const buttonHeight = 40;
      const buttonX = -buttonWidth/2; // Centralizar no container
      const buttonY = -buttonHeight/2; // Centralizar no container

      // Background da opção com largura fixa centralizada
      const buttonBg = parentScene.add.graphics();
      buttonBg.fillStyle(0x4a6eb5, 1);
      buttonBg.fillRoundedRect(buttonX, buttonY, buttonWidth, buttonHeight, 8);
      buttonBg.lineStyle(2, 0x6c8fd6, 1);
      buttonBg.strokeRoundedRect(buttonX, buttonY, buttonWidth, buttonHeight, 8);

      // Texto centralizado dentro do botão
      const optionText = parentScene.add.text(0, 0, question.options[i], {
        fontFamily: 'Arial',
        fontSize: '14px',
        color: '#ffffff',
        align: 'center'
      }).setOrigin(0.5);

      // Ajustar texto se for muito longo
      if (optionText.width > 260) {
        optionText.setWordWrapWidth(260);
        optionText.setFontSize('12px');
      }

      optionContainer.add([buttonBg, optionText]);
      optionContainer.setInteractive(new Phaser.Geom.Rectangle(
        buttonX, buttonY, buttonWidth, buttonHeight
      ), Phaser.Geom.Rectangle.Contains);

      // Efeitos de hover - CORRIGIDOS
      optionContainer.on('pointerover', () => {
        buttonBg.clear();
        buttonBg.fillStyle(0x6c8fd6, 1);
        buttonBg.fillRoundedRect(buttonX, buttonY, buttonWidth, buttonHeight, 8);
        buttonBg.lineStyle(2, 0x8caae6, 1);
        buttonBg.strokeRoundedRect(buttonX, buttonY, buttonWidth, buttonHeight, 8);
        
        // Apenas animar o container inteiro para evitar problemas de posicionamento
        parentScene.tweens.add({
          targets: optionContainer,
          scaleX: 1.05,
          scaleY: 1.05,
          duration: 100
        });
      });

      optionContainer.on('pointerout', () => {
        buttonBg.clear();
        buttonBg.fillStyle(0x4a6eb5, 1);
        buttonBg.fillRoundedRect(buttonX, buttonY, buttonWidth, buttonHeight, 8);
        buttonBg.lineStyle(2, 0x6c8fd6, 1);
        buttonBg.strokeRoundedRect(buttonX, buttonY, buttonWidth, buttonHeight, 8);
        
        parentScene.tweens.add({
          targets: optionContainer,
          scaleX: 1,
          scaleY: 1,
          duration: 100
        });
      });

      optionContainer.on('pointerdown', () => {
        handleAnswer(i, question.correct, buttonBg, optionContainer);
      });

      // Armazenar referências importantes no container
      optionContainer.buttonBg = buttonBg;
      optionButtons.push(optionContainer);
    }
  }
  
  // Função para lidar com a resposta selecionada
  function handleAnswer(selectedIndex, correctIndex, buttonBg, container) {
    // Desativar todos os containers para evitar cliques múltiplos
    optionButtons.forEach(container => {
      container.removeInteractive();
    });
    
    // Remover feedback anterior se existir
    if (feedbackText) {
        feedbackText.destroy();
    }

    // Verificar se a resposta está correta
    if (selectedIndex === correctIndex) {
        // Resposta correta
        container.buttonBg.clear();
        container.buttonBg.fillStyle(0x4CAF50, 1);
        container.buttonBg.fillRoundedRect(-175, -20, 300, 40, 8); // Mudado de -190 para -175
        container.buttonBg.lineStyle(2, 0x6c8fd6, 1);
        container.buttonBg.strokeRoundedRect(-175, -20, 300, 40, 8); // Mudado de -190 para -175
        
        score++;
        showFeedback(true);
        
    } else {
        // Resposta incorreta
        container.buttonBg.clear();
        container.buttonBg.fillStyle(0xFF5252, 1);
        container.buttonBg.fillRoundedRect(-175, -20, 300, 40, 8); // Mudado de -190 para -175
        container.buttonBg.lineStyle(2, 0x6c8fd6, 1);
        container.buttonBg.strokeRoundedRect(-175, -20, 300, 40, 8); // Mudado de -190 para -175
        
        // Destacar a resposta correta
        optionButtons[correctIndex].buttonBg.clear();
        optionButtons[correctIndex].buttonBg.fillStyle(0x4CAF50, 1);
        optionButtons[correctIndex].buttonBg.fillRoundedRect(-175, -20, 300, 40, 8); // Mudado de -190 para -175
        optionButtons[correctIndex].buttonBg.lineStyle(2, 0x6c8fd6, 1);
        optionButtons[correctIndex].buttonBg.strokeRoundedRect(-175, -20, 300, 40, 8); // Mudado de -190 para -175
        
        showFeedback(false);
    }

    // Avançar para a próxima pergunta após um delay
    parentScene.time.delayedCall(1500, () => {
      currentQuestion++;
      
      if (currentQuestion < questions.length) {
        showQuestion(currentQuestion);
      } else {
        // Fim do jogo - mostrar resultado
        endGame();
      }
    });
  }

  // Atualizar estilo do feedback
  function showFeedback(isCorrect) {
    const feedbackStyle = {
      fontFamily: 'Press Start 2P',
      fontSize: '28px',
      color: isCorrect ? '#4CAF50' : '#FF5252',
      stroke: '#000000',
      strokeThickness: 4,
      shadow: {
        offsetX: 3,
        offsetY: 3,
        color: '#000000',
        blur: 2,
        fill: true
      }
    };
    
    // Ajustar posição do feedback para ficar dentro do container
    const feedbackY = boxY + boxHeight - 50; // Ajustado para ficar mais acima
    
    feedbackText = parentScene.add.text(gameWidth / 2, feedbackY,
        isCorrect ? "CORRETO!" : "INCORRETO!", feedbackStyle
    ).setOrigin(0.5).setScrollFactor(0).setDepth(1002);
    
    // Adicionar efeito de fade out
    parentScene.tweens.add({
        targets: feedbackText,
        alpha: 0,
        y: feedbackY - 20,
        duration: 700,
        ease: 'Power2',
        onComplete: () => {
            feedbackText.destroy();
            feedbackText = null;
        }
    });
  }
  
  // Função para finalizar o jogo
  function endGame() {
    // Limpar perguntas
    if (questionText) questionText.destroy();
    optionButtons.forEach(button => button.destroy());
    
    // Construir mensagem personalizada
    let professorText = "a professora";
    if (professorId === 'professor2') professorText = "o professor 2";
    if (professorId === 'professor3') professorText = "o professor 3";
    if (professorId === 'professor4') professorText = "o professor 4";
    
    // Mostrar resultado final
    const resultText = parentScene.add.text(gameWidth / 2, 250, 
      `Você acertou ${score} de ${questions.length} perguntas!\n\n` + 
      (score >= 2 ? `Você ajudou ${professorText} a recuperar o controle!` : `Tente novamente para ajudar ${professorText}!`), 
    {
      fontFamily: "Arial",
      fontSize: "18px",
      color: "#FFFFFF",
      align: "center"
    });
    resultText.setOrigin(0.5);
    resultText.setScrollFactor(0);
    resultText.setDepth(1001);
    
    // Botão para voltar ao jogo
    const backButton = createButton(parentScene, gameWidth / 2, 350, "Voltar ao Jogo");
    backButton.setScrollFactor(0).setDepth(1001);
    
    backButton.on('pointerdown', () => {
      cleanup();
      
      if (score >= 2) {
        // Calcula posição Y similar aos diálogos
        const cameraHeight = parentScene.cameras.main.height;
        const dialogY = cameraHeight - 250; // Posiciona na parte inferior onde diálogos aparecem
        
        // Cria a mensagem de sucesso personalizada
        const successMsg = parentScene.add.text(
          parentScene.cameras.main.worldView.x + parentScene.cameras.main.width / 2,
          dialogY,
          `${professorText === "a professora" ? "A professora" : (professorText === "o professor 2" ? "O professor 2" : "O professor 4")} foi libertado do controle do hacker!\nVocê ganhou um keycard!`,
          {
            fontFamily: "Arial",
            fontSize: "18px",
            color: "#FFFFFF",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            padding: { left: 20, right: 20, top: 15, bottom: 15 },
            align: 'center'
          }
        );
        successMsg.setOrigin(0.5);
        successMsg.setScrollFactor(0);
        successMsg.setDepth(100);
        
        // Adicionar efeito de aparecimento suave
        successMsg.setAlpha(0);
        parentScene.tweens.add({
          targets: successMsg,
          alpha: 1,
          duration: 500,
          ease: 'Power2'
        });
        
        // Remover a mensagem após 3 segundos e chamar o callback
        parentScene.time.delayedCall(3000, () => {
          // Fade out antes de destruir
          parentScene.tweens.add({
            targets: successMsg,
            alpha: 0,
            duration: 500,
            ease: 'Power2',
            onComplete: () => {
              successMsg.destroy();
              if (onCompleteCallback) {
                onCompleteCallback(true);
              }
            }
          });
        });
      } else {
        if (onCompleteCallback) {
          onCompleteCallback(false);
        }
      }
    });
  }
  
  // Função para limpar todos os elementos do minigame
  function cleanup() {
    overlay.destroy();
    titleText.destroy();
    instructions.destroy();
    if (questionText) questionText.destroy();
    optionButtons.forEach(button => button.destroy());
    
    // Remover quaisquer outros elementos criados pelo minigame
    const elementsToRemove = parentScene.children.list.filter(
      child => child.depth >= 1000 && child.depth <= 1010
    );
    elementsToRemove.forEach(element => element.destroy());
  }
  
  // Iniciar o jogo com a primeira pergunta
  showQuestion(0);
  
  // Adicionar tecla de escape para sair do minigame
  const escKey = parentScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
  escKey.on('down', () => {
    cleanup();
    if (onCompleteCallback) onCompleteCallback();
  });
}

// Adicionar estilos base para botões do minigame
const buttonBaseStyle = {
  fontFamily: "Press Start 2P",
  fontSize: "16px",
  color: "#ffffff",
  backgroundColor: "#4a6eb5",
  padding: { x: 25, y: 15 },
  shadow: {
    offsetX: 4,
    offsetY: 4,
    color: '#2a4e95',
    blur: 2,
    fill: true
  },
  align: 'center'
};

const buttonHoverStyle = {
  backgroundColor: '#5a7ec5',
  shadow: {
    offsetX: 2,
    offsetY: 2,
    color: '#3a5ea5',
    blur: 4,
    fill: true
  }
};

function createButton(scene, x, y, text) {
  return scene.add.text(x, y, text, buttonBaseStyle)
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true })
    .on('pointerover', function() {
      this.setStyle(buttonHoverStyle);
      scene.tweens.add({
        targets: this,
        scale: 1.05,
        duration: 100
      });
    })
    .on('pointerout', function() {
      this.setStyle(buttonBaseStyle);
      scene.tweens.add({
        targets: this,
        scale: 1,
        duration: 100
      });
    });
}

// Exportar a função para uso no script.js
window.initMinigame = initMinigame;
