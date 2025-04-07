// Carrega o Phaser dinamicamente
function loadScript(url) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = url;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// Inicializa o jogo após carregar o Phaser
async function initGame() {
  try {
    // Check if Phaser is already loaded
    if (typeof Phaser === "undefined") {
      await loadScript(
        "https://cdnjs.cloudflare.com/ajax/libs/phaser/3.88.2/phaser.min.js"
      );
    }

    // Create a game container that will be placed inside the minigame container
    const gameContainer = document.createElement("div");
    gameContainer.id = "projetil-game";

    // Get or create minigame container
    let minigameContainer = document.getElementById(
      "projetil-minigame-container"
    );
    if (!minigameContainer) {
      minigameContainer = document.createElement("div");
      minigameContainer.id = "projetil-minigame-container";
      minigameContainer.style.position = "fixed";
      minigameContainer.style.top = "0";
      minigameContainer.style.left = "0";
      minigameContainer.style.width = "100%";
      minigameContainer.style.height = "100%";
      minigameContainer.style.zIndex = "5000";
      document.body.appendChild(minigameContainer);
    }

    minigameContainer.appendChild(gameContainer);

    // Add UI elements - title and exit button
    const titleBar = document.createElement("div");
    titleBar.style.position = "absolute";
    titleBar.style.top = "10px";
    titleBar.style.left = "0";
    titleBar.style.width = "100%";
    titleBar.style.textAlign = "center";
    titleBar.style.zIndex = "5001";
    titleBar.innerHTML =
      '<h2 style="color:white; margin:0; font-family:Arial;">Mini-Game: Proteja os Dados</h2>';
    minigameContainer.appendChild(titleBar);

    const exitButton = document.createElement("button");
    exitButton.textContent = "Sair";
    exitButton.style.position = "absolute";
    exitButton.style.top = "10px";
    exitButton.style.right = "10px";
    exitButton.style.padding = "5px 15px";
    exitButton.style.zIndex = "5001";
    exitButton.style.cursor = "pointer";
    exitButton.onclick = () => {
      // Call the global exit function if it exists
      if (typeof window.exitProjetilMinigame === "function") {
        window.exitProjetilMinigame();
      } else {
        // Fallback if the global function isn't available
        if (window.game) window.game.destroy(true);
        if (minigameContainer) minigameContainer.remove();
      }
    };
    minigameContainer.appendChild(exitButton);

    // Add counter for protected data
    const counterElement = document.createElement("div");
    counterElement.id = "data-counter";
    counterElement.style.position = "absolute";
    counterElement.style.top = "50px";
    counterElement.style.left = "10px";
    counterElement.style.color = "white";
    counterElement.style.padding = "10px";
    counterElement.style.background = "rgba(0,0,0,0.5)";
    counterElement.style.borderRadius = "5px";
    counterElement.style.zIndex = "5001";
    counterElement.innerHTML = "Dados protegidos: 0/4";
    counterElement.style.display = "none"; // Começa oculto por padrão
    minigameContainer.appendChild(counterElement);

    // Tutorial Scene - Explica os conceitos básicos
    class TutorialScene extends Phaser.Scene {
      constructor() {
        super({ key: "TutorialScene" });
      }

      preload() {
        this.load.image("chave", "assets/fase2/minigame-projetil/projetil.png");
        this.load.image(
          "cadeado",
          "assets/fase2/minigame-projetil/cadeado.png"
        );
        this.load.image(
          "fundo",
          "assets/fase2/minigame-projetil/backgroundtutorial.jpeg"
        );
        this.load.image("borda", "assets/fase2/minigame-projetil/borda.png");
      }

      create() {
        const fundo = this.add.image(0, 0, "fundo").setOrigin(0, 0);
        fundo.setDisplaySize(this.scale.width, this.scale.height);

        // Esconde o contador quando o tutorial inicia
        const counterElement = document.getElementById("data-counter");
        if (counterElement) {
          counterElement.style.display = "none";
        }

        // Add tutorial text
        const tutorialText = this.add
          .text(this.scale.width / 2, 100, "TUTORIAL: Conceitos de Movimento", {
            fontSize: "32px",
            fill: "#fff",
          })
          .setOrigin(0.5);

        const explanationText = this.add
          .text(
            this.scale.width / 2,
            180,
            "Neste minigame, você irá aprender sobre:\n\n" +
              "1. Movimento Uniforme (MU) - Velocidade constante no eixo X\n" +
              "2. Movimento Uniformemente Variado (MUV) - Com aceleração no eixo Y\n\n" +
              "Clique na tela para lançar a chave até o cadeado e observe as leis da física!",
            { fontSize: "18px", fill: "#fff", align: "center" }
          )
          .setOrigin(0.5);

        // Add demo cadeado
        const cadeado = this.add.image(500, 500, "cadeado").setScale(0.8);

        // Handle click to show demo
        this.input.on("pointerdown", this.lancarChave, this);

        // Button to continue to the game
        const continueButton = this.add
          .text(
            this.scale.width / 2,
            this.scale.height - 100,
            "CONTINUAR PARA O JOGO",
            {
              fontSize: "24px",
              fill: "#fff",
              backgroundColor: "#1a6e1a",
              padding: { x: 20, y: 10 },
            }
          )
          .setOrigin(0.5)
          .setInteractive({ useHandCursor: true });

        continueButton.on("pointerdown", () => {
          this.scene.start("GameScene");
        });

        // Add border as overlay
        const borda = this.add.image(0, 0, "borda").setOrigin(0, 0);
        borda.setDisplaySize(this.scale.width, this.scale.height);
        borda.setDepth(1);

        // Add physics info display
        this.physicsInfoText = this.add.text(10, 10, "", {
          fontSize: "16px",
          fill: "#fff",
        });
        this.physicsInfoText.setDepth(2);
      }

      lancarChave() {
        // Clear any existing animations
        if (this.animationInterval) {
          clearInterval(this.animationInterval);
        }
        if (this.chave) {
          this.chave.destroy();
        }

        // Create new chave for demo
        this.chave = this.add.image(100, 100, "chave").setScale(0.8);
        const cadeado = { x: 500, y: 500 }; // Posição do cadeado (destino)
        const duracao = 2000; // Tempo da animação em milissegundos (2s)

        // Velocidade horizontal constante (MU)
        const velocidadeX = (cadeado.x - 100) / (duracao / 1000);

        // Aceleração no eixo Y para MUV com velocidade inicial nula
        const aceleracaoY =
          (2 * (cadeado.y - 100)) / Math.pow(duracao / 1000, 2);

        let tempo = 0;
        const intervalo = 16; // Aproximadamente 60 FPS

        this.animationInterval = setInterval(() => {
          tempo += intervalo / 1000;

          // Movimento no eixo X (MU)
          this.chave.x = 100 + velocidadeX * tempo;

          // Movimento no eixo Y (MUV)
          let velocidadeY = aceleracaoY * tempo;
          this.chave.y = 100 + 0.5 * aceleracaoY * Math.pow(tempo, 2);

          // Display physics info
          this.physicsInfoText.setText(
            `Tempo: ${tempo.toFixed(2)}s\n` +
              `MU: X = ${this.chave.x.toFixed(
                2
              )} | Velocidade X = ${velocidadeX.toFixed(2)} (constante)\n` +
              `MUV: Y = ${this.chave.y.toFixed(
                2
              )} | Velocidade Y = ${velocidadeY.toFixed(
                2
              )} | Aceleração Y = ${aceleracaoY.toFixed(2)}`
          );

          // Verifica se chegou ao destino
          if (tempo >= duracao / 1000) {
            clearInterval(this.animationInterval);
            this.chave.x = cadeado.x;
            this.chave.y = cadeado.y;
            this.physicsInfoText.setText(
              this.physicsInfoText.text +
                "\nChave chegou ao cadeado! Exemplo concluído."
            );
          }
        }, intervalo);
      }
    }

    // Game Scene - O jogo real
    class GameScene extends Phaser.Scene {
      constructor() {
        super({ key: "GameScene" });
        this.projetilAtivo = null;
        this.dadosProtegidos = 0;
        this.totalDados = 4;
        this.obstaculosGroup = null; // Grupo para os obstáculos
      }

      preload() {
        this.load.image(
          "projetil",
          "assets/fase2/minigame-projetil/projetil.png"
        );
        this.load.image(
          "cadeado",
          "assets/fase2/minigame-projetil/cadeado.png"
        );
        this.load.image(
          "fundo",
          "assets/fase2/minigame-projetil/background.png"
        );
        this.load.image("borda", "assets/fase2/minigame-projetil/borda.png");
        this.load.image("efeito", "assets/fase2/minigame-projetil/efeito.png");
        this.load.image(
          "obstaculo",
          "assets/fase2/minigame-projetil/obstaculo.png"
        );
      }

      create() {
        const fundo = this.add.image(0, 0, "fundo").setOrigin(0, 0);
        fundo.setDisplaySize(this.scale.width, this.scale.height);

        this.dadosGroup = this.physics.add.staticGroup();
        this.obstaculosGroup = this.physics.add.group(); // Criando grupo para obstáculos

        this.criarCadeados();
        this.criarObstaculos();

        this.input.on("pointerdown", this.lancarProjetil, this);

        const borda = this.add.image(0, 0, "borda").setOrigin(0, 0);
        borda.setDisplaySize(this.scale.width, this.scale.height);
        borda.setDepth(1);

        const efeito = this.add.image(0, 0, "efeito").setOrigin(0, 0);
        efeito.setDisplaySize(this.scale.width, this.scale.height);
        efeito.setDepth(1);
        efeito.setAlpha(0.3);

        // Mostra o contador quando o jogo principal inicia
        const counterElement = document.getElementById("data-counter");
        if (counterElement) {
          counterElement.style.display = "block";
          counterElement.innerHTML = `Dados protegidos: ${this.dadosProtegidos}/${this.totalDados}`;
        }

        // Add a physics info display
        this.physicsInfoText = this.add.text(10, 10, "", {
          fontSize: "16px",
          fill: "#fff",
        });
        this.physicsInfoText.setDepth(2);

        // Adiciona mensagem de aviso sobre obstáculos
        const avisoObstaculos = this.add
          .text(
            this.scale.width / 2,
            70,
            "Cuidado com os vírus em movimento!",
            {
              fontSize: "18px",
              fill: "#ff0000",
              stroke: "#000000",
              strokeThickness: 2,
            }
          )
          .setOrigin(0.5);
        avisoObstaculos.setDepth(2);
      }

      criarCadeados() {
        for (let i = 0; i < this.totalDados; i++) {
          // Ajustando os limites para garantir que os cadeados estejam sempre visíveis
          // e alcançáveis pelo jogador
          const x = Phaser.Math.Between(
            600,
            Math.min(1000, this.scale.width - 100)
          );
          const y = Phaser.Math.Between(
            200,
            Math.min(600, this.scale.height - 100)
          );

          const cadeado = this.dadosGroup.create(x, y, "cadeado");
          cadeado.setScale(1.7);

          // Debug: Mostra uma borda ao redor de cada cadeado
          const debugCircle = this.add.circle(x, y, 40, 0x00ff00, 0.2);
          debugCircle.setDepth(3);
        }

        // Adiciona texto indicando a área de alvos
        const areaAlvos = this.add.text(
          this.scale.width - 200,
          150,
          "Área de Alvos",
          {
            fontSize: "18px",
            fill: "#ffff00",
            stroke: "#000000",
            strokeThickness: 2,
          }
        );
        areaAlvos.setDepth(2);
      }

      criarObstaculos() {
        // Removendo obstáculos anteriores, se existirem
        this.obstaculosGroup.clear(true, true);

        // Primeiro obstáculo - Usando Tweens para movimento
        const obstaculo1 = this.physics.add.image(550, 300, "obstaculo");
        obstaculo1.setScale(1);
        obstaculo1.setImmovable(true);

        // Segundo obstáculo - Usando Tweens para movimento
        const obstaculo2 = this.physics.add.image(800, 500, "obstaculo");
        obstaculo2.setScale(1);
        obstaculo2.setImmovable(true);

        // Adicionando ambos ao grupo
        this.obstaculosGroup.add(obstaculo1);
        this.obstaculosGroup.add(obstaculo2);

        // Movimento usando Tweens (mais confiável do que velocidade física)
        this.tweens.add({
          targets: obstaculo1,
          y: { from: 150, to: 600 },
          ease: "Sine.easeInOut",
          duration: 3000,
          repeat: -1,
          yoyo: true,
        });

        this.tweens.add({
          targets: obstaculo2,
          y: { from: 600, to: 150 },
          ease: "Sine.easeInOut",
          duration: 3500,
          repeat: -1,
          yoyo: true,
        });

        // Adiciona animação de rotação aos obstáculos
        this.tweens.add({
          targets: [obstaculo1, obstaculo2],
          angle: 360,
          duration: 3000,
          repeat: -1,
        });

        // Linhas de referência para visualizar o caminho dos obstáculos
        const graphics = this.add.graphics();
        graphics.lineStyle(1, 0xff0000, 0.3);

        // Linha vertical para o primeiro obstáculo
        graphics.lineBetween(550, 150, 550, 600);

        // Linha vertical para o segundo obstáculo
        graphics.lineBetween(800, 150, 800, 600);
      }

      lancarProjetil(pointer) {
        if (this.projetilAtivo) return; // Prevent multiple projectiles

        this.projetilAtivo = this.physics.add.image(200, 600, "projetil");
        this.projetilAtivo.setScale(1.6);

        const anguloLancamento = Phaser.Math.Angle.Between(
          200,
          600,
          pointer.x,
          pointer.y
        );

        const forcaLancamento = 600;
        const velocidadeX = Math.cos(anguloLancamento) * forcaLancamento;
        const velocidadeY = Math.sin(anguloLancamento) * forcaLancamento;
        this.projetilAtivo.setVelocity(velocidadeX, velocidadeY);
        this.projetilAtivo.setAccelerationY(250);

        this.projetilAtivo.setDepth(0);

        // Colisão com cadeados (dados)
        this.physics.add.collider(
          this.projetilAtivo,
          this.dadosGroup,
          this.protegerDado,
          null,
          this
        );

        // Colisão com obstáculos
        this.physics.add.collider(
          this.projetilAtivo,
          this.obstaculosGroup,
          this.colisaoObstaculo,
          null,
          this
        );
      }

      protegerDado(projetil, dado) {
        dado.disableBody(true, true);
        projetil.destroy();
        this.projetilAtivo = null;

        // Update counter
        this.dadosProtegidos++;
        const counterElement = document.getElementById("data-counter");
        if (counterElement) {
          counterElement.innerHTML = `Dados protegidos: ${this.dadosProtegidos}/${this.totalDados}`;
        }

        // Check if all data is protected
        if (this.dadosProtegidos >= this.totalDados) {
          // Show victory message
          const minigameContainer = document.getElementById(
            "projetil-minigame-container"
          );
          const victoryMsg = document.createElement("div");
          victoryMsg.style.position = "absolute";
          victoryMsg.style.top = "50%";
          victoryMsg.style.left = "50%";
          victoryMsg.style.transform = "translate(-50%, -50%)";
          victoryMsg.style.background = "rgba(0,100,0,0.8)";
          victoryMsg.style.color = "white";
          victoryMsg.style.padding = "20px";
          victoryMsg.style.borderRadius = "10px";
          victoryMsg.style.textAlign = "center";
          victoryMsg.style.zIndex = "5002";
          victoryMsg.innerHTML =
            "<h2>Você protegeu todos os dados!</h2><p>Agora pode prosseguir para a próxima fase.</p>";
          minigameContainer.appendChild(victoryMsg);

          // Add button to continue
          const continueBtn = document.createElement("button");
          continueBtn.textContent = "Continuar";
          continueBtn.style.padding = "10px 20px";
          continueBtn.style.margin = "10px auto";
          continueBtn.style.display = "block";
          continueBtn.onclick = () => {
            // Clean up and redirect to fase3.html
            if (typeof window.exitProjetilMinigame === "function") {
              window.exitProjetilMinigame();
              window.location.href = "../../src/fase3/fase3.html";
            }
          };
          victoryMsg.appendChild(continueBtn);
        }
      }

      colisaoObstaculo(projetil, obstaculo) {
        projetil.destroy();
        this.projetilAtivo = null;

        // Cria efeito visual
        const explosao = this.add.circle(
          projetil.x,
          projetil.y,
          30,
          0xff0000,
          0.8
        );
        this.tweens.add({
          targets: explosao,
          alpha: 0,
          scale: 2,
          duration: 300,
          onComplete: () => {
            explosao.destroy();
          },
        });

        // Mostra mensagem de reinício
        const mensagemFalha = this.add
          .text(
            this.scale.width / 2,
            this.scale.height / 2,
            "Você atingiu um obstáculo!\nReiniciando...",
            {
              fontSize: "32px",
              fill: "#ff0000",
              stroke: "#000000",
              strokeThickness: 4,
              align: "center",
            }
          )
          .setOrigin(0.5);
        mensagemFalha.setDepth(10);

        // Reinicia a cena após 2 segundos
        this.time.delayedCall(2000, () => {
          // Reseta o contador de dados protegidos
          this.dadosProtegidos = 0;
          const counterElement = document.getElementById("data-counter");
          if (counterElement) {
            counterElement.innerHTML = `Dados protegidos: 0/${this.totalDados}`;
          }

          // Reinicia a cena
          this.scene.restart();
        });
      }

      update() {
        if (this.projetilAtivo) {
          // Update physics info display
          this.physicsInfoText.setText(
            `MU: Posição X: ${this.projetilAtivo.x.toFixed(
              2
            )}, Velocidade X: ${this.projetilAtivo.body.velocity.x.toFixed(
              2
            )}\n` +
              `MUV: Posição Y: ${this.projetilAtivo.y.toFixed(
                2
              )}, Velocidade Y: ${this.projetilAtivo.body.velocity.y.toFixed(
                2
              )}, Aceleração Y: 250`
          );

          if (
            this.projetilAtivo.x < 0 ||
            this.projetilAtivo.x > this.scale.width ||
            this.projetilAtivo.y < 0 ||
            this.projetilAtivo.y > this.scale.height
          ) {
            this.projetilAtivo.destroy();
            this.projetilAtivo = null;
            this.physicsInfoText.setText("");
          }
        }
      }
    }

    // Add instructions
    const instructions = document.createElement("div");
    instructions.style.position = "absolute";
    instructions.style.bottom = "20px";
    instructions.style.left = "0";
    instructions.style.width = "100%";
    instructions.style.textAlign = "center";
    instructions.style.color = "white";
    instructions.style.fontFamily = "Arial";
    instructions.style.zIndex = "5001";
    instructions.innerHTML =
      "Clique para lançar o projetil e proteger os dados pessoais!";
    minigameContainer.appendChild(instructions);

    // Configuração do jogo
    const config = {
      type: Phaser.AUTO,
      width: window.innerWidth,
      height: window.innerHeight,
      parent: "projetil-game",
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 0 },
          debug: false,
        },
      },
      scene: [TutorialScene, GameScene],
    };

    // Iniciar o jogo
    const game = new Phaser.Game(config);
    window.game = game; // Store reference for cleanup
  } catch (error) {
    console.error("Erro ao carregar o minigame:", error);
    // Show error message in container
    const errorMsg = document.createElement("div");
    errorMsg.style.position = "absolute";
    errorMsg.style.top = "50%";
    errorMsg.style.left = "50%";
    errorMsg.style.transform = "translate(-50%, -50%)";
    errorMsg.style.color = "white";
    errorMsg.style.background = "rgba(200,0,0,0.8)";
    errorMsg.style.padding = "20px";
    errorMsg.style.borderRadius = "10px";
    errorMsg.textContent = `Erro ao carregar o minigame: ${error.message}`;

    const minigameContainer = document.getElementById(
      "projetil-minigame-container"
    );
    if (minigameContainer) {
      minigameContainer.appendChild(errorMsg);
    }
  }
}

// Define exit function to handle cleanup properly
window.exitProjetilMinigame = function () {
  console.log("Exiting minigame...");

  // Clean up Phaser game instance
  if (window.game) {
    try {
      window.game.destroy(true);
      window.game = null;
    } catch (e) {
      console.error("Error destroying game:", e);
    }
  }

  // Remove the minigame container
  const container = document.getElementById("projetil-minigame-container");
  if (container) {
    container.remove();
  }

  // Try to resume the parent game scene if the function exists
  if (window.resumeMainGame && typeof window.resumeMainGame === "function") {
    window.resumeMainGame();
  }
};

// Auto-initialize when script is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Check if the container exists before initializing
  if (document.getElementById("projetil-minigame-container")) {
    initGame();
  } else {
    console.warn("Minigame container not found, delaying initialization...");
    // Add a small delay to ensure container is ready
    setTimeout(initGame, 100);
  }
});

// Initialize immediately if document is already loaded
if (
  document.readyState === "complete" ||
  document.readyState === "interactive"
) {
  setTimeout(initGame, 100);
}
