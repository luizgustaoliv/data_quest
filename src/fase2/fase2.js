window.addEventListener("load", () => {
  document.body.classList.add("fade-in");
});

// Definir config só quando Phaser estiver carregado
let config;

function initializaConfig() {
  if (!window.Phaser) {
    console.error("Phaser não está disponível para inicializar config");
    return;
  }

  config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: "game-container",
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 0 },
        debug: false,
      },
    },
    scene: {
      key: "main",
      preload: preloadMain,
      create: createMain,
      update: updateMain,
    },
  };

  // Inicializar Phaser com a configuração
  new Phaser.Game(config);
}

let selectedCharacter;
let player = {};
player.x = 100;
let map2;
let podeIniciarDialogo = false;
let dialogoIniciado = false;
let avisoTexto;
let textoDialogo;
let caixaDialogo, sombra, personagem, npc1Image;
let chaoLayer;
let paredeLayer;
let objSemColisaoLayer;
let colisaoLayer;
let obj2ColisaoLayer;
let cursors;
let elevator;

function preloadMain() {
  this.load.tilemapTiledJSON("map2", "assets/fase2/fase2.json");
  this.load.image("fase2", "assets/fase2/fase2.png");
  this.load.image("5_Classroom_and_library_32x32.png", "assets/fase2/5_Classroom_and_library_32x32.png");
  this.load.image("19_Hospital_32x32.png", "assets/fase2/19_Hospital_32x32.png");
  this.load.image("Room_Builder_32x32.png", "assets/fase2/Room_Builder_32x32.png");

  // Obtém o personagem selecionado do localStorage
  selectedCharacter = localStorage.getItem('selectedCharacter') || 'character1';
  
  // Carrega o sprite do personagem selecionado
  this.load.spritesheet(selectedCharacter, `assets/sprites/${selectedCharacter}.png`, {
    frameWidth: 64,
    frameHeight: 64
  });
}

function createMain() {
  selectedCharacter = localStorage.getItem("currentCharacter") || "player1";
  playerName = localStorage.getItem("playerName") || "Jogador";

  // Adicionar tratamento de erro para o mapa
  try {
    // Create map and basic setup first
    map2 = this.make.tilemap({ key: "map2" });
    // Verificar se o mapa foi carregado corretamente
    if (!map2 || !map2.layers || map2.layers.length === 0) {
      console.error("Mapa não foi carregado corretamente ou não tem camadas");
      // Mostrar mensagem ao usuário
      const errorText = this.add
        .text(
          this.cameras.main.centerX,
          this.cameras.main.centerY,
          "Erro ao carregar o mapa. Por favor, recarregue a página.",
          {
            fontFamily: "Arial",
            fontSize: "20px",
            color: "#ff0000",
            backgroundColor: "#000000",
            padding: { x: 10, y: 5 },
          }
        )
        .setOrigin(0.5);
      // Retornar para não executar o resto da função
      console.log("Pulando o resto da inicialização devido ao erro do mapa");
      return;
    }
  } catch (error) {
    console.error("Erro ao carregar o mapa:", error);
  }
}

function updateMain() {
  const speed = 160;

  // Movimentação horizontal
  if (cursors.left.isDown) {
    player.setVelocityX(-speed);
    player.anims.play('walk-left', true);
  } else if (cursors.right.isDown) {
    player.setVelocityX(speed);
    player.anims.play('walk-right', true);
  } else {
    player.setVelocityX(0);
    player.anims.play('idle');
  }

  // Movimentação vertical
  if (cursors.up.isDown) {
    player.setVelocityY(-speed);
  } else if (cursors.down.isDown) {
    player.setVelocityY(speed);
  } else {
    player.setVelocityY(0);
  }
}

// Inicializa o jogo após configuração
function startGame() {
  let game = new Phaser.Game(config);

  // Configuração das animações
  this.anims.create({
    key: 'walk-left',
    frames: this.anims.generateFrameNumbers(selectedCharacter, { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'idle',
    frames: [{ key: selectedCharacter, frame: 4 }],
    frameRate: 20
  });

  this.anims.create({
    key: 'walk-right',
    frames: this.anims.generateFrameNumbers(selectedCharacter, { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1
  });

  // Inicializa controles
  cursors = this.input.keyboard.createCursorKeys();
}

// Inicializar a configuração quando o Phaser estiver carregado
initializaConfig();

