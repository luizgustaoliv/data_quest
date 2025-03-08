// Atualizar para receber qual professor está sendo ajudado
function initMinigame(parentScene, professorId = 'professor1', onCompleteCallback) {
  console.log(`Inicializando minigame para ${professorId}...`);
  
  // Criar um overlay para o minigame
  const gameWidth = parentScene.scale.width;
  const gameHeight = parentScene.scale.height;
  
  // Criar um fundo escuro semi-transparente
  const overlay = parentScene.add.graphics();
  overlay.fillStyle(0x000000, 0.8);
  overlay.fillRect(0, 0, gameWidth, gameHeight);
  overlay.setScrollFactor(0);
  overlay.setDepth(1000);
  
  // Se for o professor4, vamos criar o minigame especial de associação
  if (professorId === 'professor4') {
    createMatchingGame(parentScene, onCompleteCallback);
    return;
  }
  
  // Configurar título e perguntas específicas para cada professor
  let title;
  let questions;
  
  if (professorId === 'professor2') {
    title = "Ajude o Professor 2 a recuperar o controle";
    questions = [
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
    ];
  } else if (professorId === 'professor3') {
    title = "Ajude o Professor 3 a recuperar o controle";
    questions = [
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
    ];
  } else { // professor1 (padrão)
    title = "Ajude a professora a recuperar o controle";
    questions = [
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
    ];
  }
  
  // Adicionar um título específico para o professor
  const titleText = parentScene.add.text(gameWidth / 2, 80, title, {
    fontFamily: "Arial",
    fontSize: "20px",
    color: "#FFFFFF",
    align: "center"
  });
  titleText.setOrigin(0.5);
  titleText.setScrollFactor(0);
  titleText.setDepth(1001);
  
  // Adicionar instruções apropriadas para o professor específico
  let instructionText = "Você precisa responder corretamente às perguntas sobre a LGPD\n";
  if (professorId === 'professor2') {
    instructionText += "para ajudar o professor 2 a se libertar do controle do hacker.";
  } else if (professorId === 'professor3') {
    instructionText += "para ajudar o professor 3 a se libertar do controle do hacker.";
  } else {
    instructionText += "para ajudar a professora a se libertar do controle do hacker.";
  }
  
  const instructions = parentScene.add.text(gameWidth / 2, 120, instructionText, {
    fontFamily: "Arial",
    fontSize: "14px",
    color: "#FFFFFF",
    align: "center"
  });
  instructions.setOrigin(0.5);
  instructions.setScrollFactor(0);
  instructions.setDepth(1001);
  
  // Variáveis de controle do jogo
  let currentQuestion = 0;
  let score = 0;
  let questionText;
  let optionButtons = [];
  
  // Função para mostrar uma pergunta
  function showQuestion(index) {
    // Limpar perguntas anteriores
    if (questionText) questionText.destroy();
    optionButtons.forEach(button => button.destroy());
    optionButtons = [];
    
    const question = questions[index];
    
    // Mostrar a pergunta
    questionText = parentScene.add.text(gameWidth / 2, 180, question.question, {
      fontFamily: "Arial",
      fontSize: "18px",
      color: "#FFFFFF",
      align: "center"
    });
    questionText.setOrigin(0.5);
    questionText.setScrollFactor(0);
    questionText.setDepth(1001);
    
    // Mostrar as opções
    for (let i = 0; i < question.options.length; i++) {
      const y = 240 + i * 45;
      
      const buttonBg = parentScene.add.rectangle(gameWidth / 2, y, 400, 35, 0x4a6eb5);
      buttonBg.setOrigin(0.5);
      buttonBg.setScrollFactor(0);
      buttonBg.setDepth(1001);
      buttonBg.setInteractive({ useHandCursor: true });
      
      const optionText = parentScene.add.text(gameWidth / 2, y, question.options[i], {
        fontFamily: "Arial",
        fontSize: "14px",
        color: "#FFFFFF",
        align: "center"
      });
      optionText.setOrigin(0.5);
      optionText.setScrollFactor(0);
      optionText.setDepth(1002);
      
      // Adicionar evento de clique
      buttonBg.on('pointerover', () => {
        buttonBg.setFillStyle(0x6c8fd6);
      });
      
      buttonBg.on('pointerout', () => {
        buttonBg.setFillStyle(0x4a6eb5);
      });
      
      buttonBg.on('pointerdown', () => {
        handleAnswer(i, question.correct, buttonBg);
      });
      
      optionButtons.push(buttonBg);
      optionButtons.push(optionText);
    }
  }
  
  // Função para lidar com a resposta selecionada
  function handleAnswer(selectedIndex, correctIndex, button) {
    // Desativar todos os botões para evitar cliques múltiplos
    optionButtons.forEach(button => {
      if (button.input) button.disableInteractive();
    });
    
    // Verificar se a resposta está correta
    if (selectedIndex === correctIndex) {
      // Resposta correta
      button.setFillStyle(0x4CAF50);
      score++;
      
      // Feedback visual e sonoro (se disponível)
      parentScene.add.text(gameWidth / 2, 450, "Correto!", {
        fontFamily: "Arial",
        fontSize: "18px",
        color: "#4CAF50"
      }).setOrigin(0.5).setScrollFactor(0).setDepth(1002);
      
    } else {
      // Resposta incorreta
      button.setFillStyle(0xFF5252);
      
      // Destacar a resposta correta
      optionButtons.forEach((btn, index) => {
        if (index / 2 === correctIndex && btn.setFillStyle) {
          btn.setFillStyle(0x4CAF50);
        }
      });
      
      // Feedback visual e sonoro
      parentScene.add.text(gameWidth / 2, 450, "Incorreto!", {
        fontFamily: "Arial",
        fontSize: "18px",
        color: "#FF5252"
      }).setOrigin(0.5).setScrollFactor(0).setDepth(1002);
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
  
  // Função para finalizar o jogo
  function endGame() {
    // Limpar perguntas
    if (questionText) questionText.destroy();
    optionButtons.forEach(button => button.destroy());
    
    // Construir mensagem personalizada
    let professorText = "a professora";
    if (professorId === 'professor2') professorText = "o professor 2";
    if (professorId === 'professor3') professorText = "o professor 3";
    
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
    const backButton = parentScene.add.text(gameWidth / 2, 350, "Voltar ao Jogo", {
      fontFamily: "Arial",
      fontSize: "16px",
      backgroundColor: "#4CAF50",
      padding: { left: 12, right: 12, top: 8, bottom: 8 },
      color: "#FFFFFF"
    });
    backButton.setOrigin(0.5);
    backButton.setScrollFactor(0);
    backButton.setDepth(1001);
    backButton.setInteractive({ useHandCursor: true });
    
    backButton.on('pointerover', () => {
      backButton.setStyle({backgroundColor: "#388E3C"});
    });
    
    backButton.on('pointerout', () => {
      backButton.setStyle({backgroundColor: "#4CAF50"});
    });
    
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
          `${professorText === "a professora" ? "A professora" : (professorText === "o professor 2" ? "O professor 2" : "O professor 3")} foi libertado do controle do hacker!\nVocê ganhou um keycard!`,
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
  
  // Função para criar o jogo de associação para o professor4
  function createMatchingGame(scene, callback) {
    const elements = [];
    let selectedLeft = null;
    let selectedRight = null;
    let connections = [];
    let correctMatches = 0;
    const totalMatches = 4;
    
    // Título e instruções
    const titleText = scene.add.text(gameWidth / 2, 60, "Associe os Dados às Categorias Corretas", {
      fontFamily: "Arial",
      fontSize: "20px",
      color: "#FFFFFF",
      align: "center",
      fontWeight: "bold"
    }).setOrigin(0.5).setScrollFactor(0).setDepth(1001);
    
    elements.push(titleText);
    
    const instruction = scene.add.text(gameWidth / 2, 100, 
      "Clique em um item da coluna esquerda e depois em seu correspondente na direita",
      {
        fontFamily: "Arial",
        fontSize: "16px",
        color: "#FFFFFF",
        align: "center"
      }
    ).setOrigin(0.5).setScrollFactor(0).setDepth(1001);
    
    elements.push(instruction);
    
    // Dados a serem associados
    const leftItems = [
      "Nome completo",
      "CPF",
      "Histórico médico",
      "Opiniões políticas"
    ];
    
    const rightItems = [
      "Dado pessoal",
      "Dado pessoal",
      "Dado sensível",
      "Dado sensível"
    ];
    
    // Mapeamento das respostas corretas (índice da esquerda -> índice da direita)
    const correctAnswers = {
      0: 0, // Nome completo -> Dado pessoal
      1: 0, // CPF -> Dado pessoal
      2: 2, // Histórico médico -> Dado sensível
      3: 2  // Opiniões políticas -> Dado sensível
    };
    
    // Criar coluna esquerda
    const leftCol = scene.add.text(gameWidth / 2 - 200, 150, "DADOS", {
      fontFamily: "Arial",
      fontSize: "18px",
      color: "#FFFF00",
      fontWeight: "bold"
    }).setOrigin(0.5).setScrollFactor(0).setDepth(1001);
    
    elements.push(leftCol);
    
    // Criar coluna direita
    const rightCol = scene.add.text(gameWidth / 2 + 200, 150, "CATEGORIAS", {
      fontFamily: "Arial",
      fontSize: "18px",
      color: "#FFFF00",
      fontWeight: "bold"
    }).setOrigin(0.5).setScrollFactor(0).setDepth(1001);
    
    elements.push(rightCol);
    
    // Criar os itens da coluna esquerda
    const leftButtons = [];
    for (let i = 0; i < leftItems.length; i++) {
      const y = 200 + i * 60;
      
      const button = scene.add.rectangle(gameWidth / 2 - 200, y, 300, 40, 0x4a6eb5)
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(1001)
        .setInteractive({ useHandCursor: true });
      
      const text = scene.add.text(gameWidth / 2 - 200, y, leftItems[i], {
        fontFamily: "Arial",
        fontSize: "16px",
        color: "#FFFFFF",
        align: "center"
      }).setOrigin(0.5).setScrollFactor(0).setDepth(1002);
      
      // Adicionar evento de clique
      button.on('pointerover', () => {
        if (selectedLeft !== i) {
          button.setFillStyle(0x5a7ec5);
        }
      });
      
      button.on('pointerout', () => {
        if (selectedLeft !== i) {
          button.setFillStyle(0x4a6eb5);
        }
      });
      
      button.on('pointerdown', () => {
        // Se já estava selecionado, desselecione
        if (selectedLeft === i) {
          button.setFillStyle(0x4a6eb5);
          selectedLeft = null;
          return;
        }
        
        // Resetar todos os outros botões
        leftButtons.forEach((b, index) => {
          if (index !== i) {
            b.button.setFillStyle(0x4a6eb5);
          }
        });
        
        // Selecionar este botão
        button.setFillStyle(0x00aa00);
        selectedLeft = i;
        
        // Se já havia uma seleção na direita, verificar se é um match
        checkForMatch();
      });
      
      leftButtons.push({button, text, index: i});
      elements.push(button);
      elements.push(text);
    }
    
    // Criar os itens da coluna direita
    const rightButtons = [];
    // Nesse caso, temos apenas 2 itens únicos, mas duplicamos para facilitar a interface
    const uniqueRightItems = [...new Set(rightItems)]; // Remove duplicatas
    
    for (let i = 0; i < uniqueRightItems.length; i++) {
      const y = 200 + i * 60;
      
      const button = scene.add.rectangle(gameWidth / 2 + 200, y, 300, 40, 0x4a6eb5)
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(1001)
        .setInteractive({ useHandCursor: true });
      
      const text = scene.add.text(gameWidth / 2 + 200, y, uniqueRightItems[i], {
        fontFamily: "Arial",
        fontSize: "16px",
        color: "#FFFFFF",
        align: "center"
      }).setOrigin(0.5).setScrollFactor(0).setDepth(1002);
      
      // Adicionar evento de clique
      button.on('pointerover', () => {
        if (selectedRight !== i) {
          button.setFillStyle(0x5a7ec5);
        }
      });
      
      button.on('pointerout', () => {
        if (selectedRight !== i) {
          button.setFillStyle(0x4a6eb5);
        }
      });
      
      button.on('pointerdown', () => {
        // Se já estava selecionado, desselecione
        if (selectedRight === i) {
          button.setFillStyle(0x4a6eb5);
          selectedRight = null;
          return;
        }
        
        // Resetar todos os outros botões
        rightButtons.forEach((b, index) => {
          if (index !== i) {
            b.button.setFillStyle(0x4a6eb5);
          }
        });
        
        // Selecionar este botão
        button.setFillStyle(0x00aa00);
        selectedRight = i;
        
        // Se já havia uma seleção na esquerda, verificar se é um match
        checkForMatch();
      });
      
      rightButtons.push({button, text, index: i});
      elements.push(button);
      elements.push(text);
    }
    
    // Função para verificar se a associação está correta
    function checkForMatch() {
      if (selectedLeft !== null && selectedRight !== null) {
        const leftIndex = selectedLeft;
        const rightItem = uniqueRightItems[selectedRight];
        const correctRightItem = rightItems[correctAnswers[leftIndex]];
        
        // Ver se a associação está correta
        if (rightItem === correctRightItem) {
          // Associação correta
          const leftButton = leftButtons[leftIndex].button;
          const rightButton = rightButtons[selectedRight].button;
          
          // Deixar os botões verdes permanentemente
          leftButton.setFillStyle(0x00aa00);
          rightButton.setFillStyle(0x00aa00);
          
          // Desabilitar os botões
          leftButton.disableInteractive();
          
          // Criar uma linha conectando os dois itens
          const line = scene.add.graphics();
          line.lineStyle(2, 0x00ff00, 1);
          line.beginPath();
          line.moveTo(gameWidth / 2 - 50, leftButton.y);
          line.lineTo(gameWidth / 2 + 50, rightButton.y);
          line.closePath();
          line.strokePath();
          line.setScrollFactor(0).setDepth(1001);
          
          connections.push(line);
          elements.push(line);
          
          // Adicionar texto de feedback
          const feedbackText = scene.add.text(gameWidth / 2, leftButton.y, "✓", {
            fontFamily: "Arial",
            fontSize: "24px",
            color: "#00FF00"
          }).setOrigin(0.5).setScrollFactor(0).setDepth(1002);
          
          elements.push(feedbackText);
          
          // Incrementar contagem de acertos
          correctMatches++;
          
          // Verificar se completou todos os matches
          if (correctMatches === totalMatches) {
            // Jogo concluído!
            finishGame(true);
          }
        } else {
          // Associação incorreta - mostrar feedback
          const feedbackText = scene.add.text(gameWidth / 2, gameHeight - 100, "Essa associação está incorreta. Tente novamente!", {
            fontFamily: "Arial",
            fontSize: "18px",
            color: "#FF0000"
          }).setOrigin(0.5).setScrollFactor(0).setDepth(1002);
          
          elements.push(feedbackText);
          
          // Remover o texto após 2 segundos
          scene.time.delayedCall(2000, () => {
            feedbackText.destroy();
            elements.splice(elements.indexOf(feedbackText), 1);
          });
        }
        
        // Resetar seleções
        selectedLeft = null;
        selectedRight = null;
      }
    }
    
    // Adicionar botão de confirmar/desistir
    const confirmButton = scene.add.text(gameWidth / 2, gameHeight - 50, "Confirmar Associações", {
      fontFamily: "Arial",
      fontSize: "18px",
      color: "#FFFFFF",
      backgroundColor: "#4CAF50",
      padding: { left: 15, right: 15, top: 10, bottom: 10 }
    }).setOrigin(0.5).setScrollFactor(0).setDepth(1002)
      .setInteractive({ useHandCursor: true });
    
    confirmButton.on('pointerover', () => {
      confirmButton.setStyle({backgroundColor: "#388E3C"});
    });
    
    confirmButton.on('pointerout', () => {
      confirmButton.setStyle({backgroundColor: "#4CAF50"});
    });
    
    confirmButton.on('pointerdown', () => {
      finishGame(correctMatches >= totalMatches / 2);
    });
    
    elements.push(confirmButton);
    
    // Função para finalizar o jogo
    function finishGame(isSuccess) {
      // Remover todos os elementos do jogo
      elements.forEach(element => {
        if (element && element.destroy) {
          element.destroy();
        }
      });
      
      // Mostrar mensagem de resultado
      const resultText = scene.add.text(gameWidth / 2, gameHeight / 2 - 50, 
        isSuccess ? 
        "Parabéns! Você ajudou a restaurar o sistema de classificação de dados." : 
        "Você não conseguiu classificar corretamente os dados. Tente novamente!", 
        {
          fontFamily: "Arial",
          fontSize: "18px",
          color: isSuccess ? "#00FF00" : "#FF0000",
          align: "center",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          padding: { left: 20, right: 20, top: 15, bottom: 15 },
        }
      ).setOrigin(0.5).setScrollFactor(0).setDepth(1002);
      
      // Botão para voltar ao jogo
      const backButton = scene.add.text(gameWidth / 2, gameHeight / 2 + 50, "Voltar ao Jogo", {
        fontFamily: "Arial",
        fontSize: "16px",
        color: "#FFFFFF",
        backgroundColor: "#4CAF50",
        padding: { left: 15, right: 15, top: 10, bottom: 10 }
      }).setOrigin(0.5).setScrollFactor(0).setDepth(1002)
        .setInteractive({ useHandCursor: true });
      
      backButton.on('pointerover', () => {
        backButton.setStyle({backgroundColor: "#388E3C"});
      });
      
      backButton.on('pointerout', () => {
        backButton.setStyle({backgroundColor: "#4CAF50"});
      });
      
      backButton.on('pointerdown', () => {
        // Remover todos os elementos restantes
        resultText.destroy();
        backButton.destroy();
        overlay.destroy();
        
        if (isSuccess) {
          // Mensagem de sucesso no estilo de diálogo
          const cameraHeight = scene.cameras.main.height;
          const dialogY = cameraHeight - 250;
          
          const successMsg = scene.add.text(
            scene.cameras.main.worldView.x + scene.cameras.main.width / 2,
            dialogY,
            "O Professor 4 foi libertado do controle do hacker!\nVocê ganhou um keycard!",
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
          scene.tweens.add({
            targets: successMsg,
            alpha: 1,
            duration: 500,
            ease: 'Power2'
          });
          
          // Remover a mensagem após 3 segundos e chamar o callback
          scene.time.delayedCall(3000, () => {
            scene.tweens.add({
              targets: successMsg,
              alpha: 0,
              duration: 500,
              ease: 'Power2',
              onComplete: () => {
                successMsg.destroy();
                if (callback) {
                  callback(true);
                }
              }
            });
          });
        } else {
          if (callback) {
            callback(false);
          }
        }
      });
    }
  }
}

// Exportar a função para uso no script.js
window.initMinigame = initMinigame;
