// Função para inicializar o minigame
function initMinigame(parentScene, onCompleteCallback) {
  console.log("Inicializando minigame...");
  
  // Criar um overlay para o minigame
  const gameWidth = parentScene.scale.width;
  const gameHeight = parentScene.scale.height;
  
  // Criar um fundo escuro semi-transparente
  const overlay = parentScene.add.graphics();
  overlay.fillStyle(0x000000, 0.8);
  overlay.fillRect(0, 0, gameWidth, gameHeight);
  overlay.setScrollFactor(0);
  overlay.setDepth(1000);
  
  // Adicionar um título
  const title = parentScene.add.text(gameWidth / 2, 80, "Ajude a professora a recuperar o controle", {
    fontFamily: "Arial",
    fontSize: "20px",
    color: "#FFFFFF",
    align: "center"
  });
  title.setOrigin(0.5);
  title.setScrollFactor(0);
  title.setDepth(1001);
  
  // Adicionar instruções
  const instructions = parentScene.add.text(gameWidth / 2, 120, 
    "Você precisa responder corretamente às perguntas sobre a LGPD\n" +
    "para ajudar a professora a se libertar do controle do hacker.", 
  {
    fontFamily: "Arial",
    fontSize: "14px",
    color: "#FFFFFF",
    align: "center"
  });
  instructions.setOrigin(0.5);
  instructions.setScrollFactor(0);
  instructions.setDepth(1001);
  
  // Array de perguntas sobre LGPD
  const questions = [
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
    
    // Mostrar resultado final
    const resultText = parentScene.add.text(gameWidth / 2, 250, 
      `Você acertou ${score} de ${questions.length} perguntas!\n\n` + 
      (score >= 2 ? "Você ajudou a professora a recuperar o controle!" : "Tente novamente para ajudar a professora!"), 
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
        
        // Cria a mensagem de sucesso na mesma posição dos diálogos
        const successMsg = parentScene.add.text(
          parentScene.cameras.main.worldView.x + parentScene.cameras.main.width / 2,
          dialogY,
          "A professora foi libertada do controle do hacker!\nVocê ganhou um keycard!",
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
    title.destroy();
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

// Exportar a função para uso no script.js
window.initMinigame = initMinigame;
