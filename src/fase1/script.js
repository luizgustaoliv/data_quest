let selectedCharacter; // Variável para armazenar o personagem selecionado
let player;
let map;
let tileset;
let chaoLayer;
let colisaoLayer;
let cursors;
let npc1;
  // Variáveis para controle do diálogo
let podeIniciarDialogo = false;
let dialogoIniciado = false;
let avisoTexto;
let textoDialogo;


const config = {
  type: Phaser.AUTO,
  width: 960,
  height: 500,
  parent: "game-container",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: true,
    },
  },
  scene: {
    preload: preload,
    create: create,
  },
};

const game = new Phaser.Game(config);

// Adicione a cena "main" corretamente
game.scene.add("main", { create: createMain, update: updateMain });

// Agora, quando startGame() for chamado, a cena já existirá
function startGame(character) {
  selectedCharacter = character;
  document.getElementById("character-select").style.display = "none";
  document.getElementById("game-container").style.display = "block";
  game.scene.start("main");
}

function preload() {
  // Carrega as spritesheets dos personagens
  this.load.spritesheet("player1", "../../assets/fase1/players/player1.png", {
    frameWidth: 64,
    frameHeight: 64,
  });
  this.load.spritesheet("player2", "../../assets/fase1/players/player2.png", {
    frameWidth: 64,
    frameHeight: 64,
  });
  this.load.spritesheet("player3", "../../assets/fase1/players/player3.png", {
    frameWidth: 64,
    frameHeight: 64,
  });
  this.load.spritesheet("player4", "../../assets/fase1/players/player4.png", {
    frameWidth: 64,
    frameHeight: 64,
  });

  this.load.image("npc1", "../../assets/npc.png", {
    frameWidth: 128,
    frameHeight: 128,
  });
  this.load.image("background", "../../assets/fase1/background.png");
  this.load.tilemapTiledJSON("map", "tileset.json");
  this.load.image("tileset", "../../assets/fase1/Inside_C.png");
}

function create() {
  this.scene.remove("main"); // Remove a cena atual para evitar duplicações
  this.scene.add("main", { create: createMain, update: updateMain }, true); // Adiciona a cena 'main' com as funções createMain e updateMain

  // Resto do código (movido para createMain)
}

function updateMain() {
  player.setVelocity(0); // Reseta a velocidade antes de processar o movimento

  if (cursors.left.isDown) {
    player.setVelocityX(-160);
    player.anims.play("walk_side", true);
    player.setFlipX(true);
  } else if (cursors.right.isDown) {
    player.setVelocityX(160);
    player.anims.play("walk_side", true);
    player.setFlipX(false);
  } else if (cursors.up.isDown) {
    player.setVelocityY(-160);
    player.anims.play("walk_up", true);
  } else if (cursors.down.isDown) {
    player.setVelocityY(160);
    player.anims.play("walk_down", true);
  } else {
    player.setVelocity(0);
    player.anims.play("idle_front", true);
  }
}

function createMain() {
  // Carregar o mapa *primeiro*
  map = this.make.tilemap({ key: "map" });

  // Adicionar o tileset *uma vez* e *depois* de criar o mapa
  tileset = map.addTilesetImage("Inside_C", "tileset");

  // Criar camada de chão
  chaoLayer = map.createLayer("Camada de Blocos 1", tileset, 0, 0);

  // criar teclas de movimentação
  cursors = this.input.keyboard.createCursorKeys();
  teclaE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E); // Captura a tecla E

  // Criar camada de colisão e ativar colisões
  colisaoLayer = map.createLayer("colisao", tileset, 0, 0);

  livrosLayer = map.createLayer("livros", tileset, 0, 0);
  livrosLayer.setCollisionByProperty({ collider: true });
  // Verifique se a propriedade utilizada no Tiled é 'collides' ou 'collider'
  colisaoLayer.setCollisionByProperty({ collider: true });

  chaoLayer.setScale(2);
  colisaoLayer.setScale(2);
  livrosLayer.setScale(2);

  // Ativar debug da colisão para verificar se está funcionando
  this.physics.world.createDebugGraphic();

  // Criar o jogador com base no personagem selecionado
  player = this.physics.add.sprite(10, 100, selectedCharacter, 0);
  player.setCollideWorldBounds(true);
  player.setScale(1.3);
  player.setOrigin(0.5, 1); // Centro horizontal, parte inferior vertical

  //criar npc
  npc1 = this.physics.add.sprite(700, 400, "npc1", 0);
  npc1.setCollideWorldBounds(true);
  npc1.setScale(0.1);
  npc1.setOrigin(0.5, 1);

  player.body.setSize(30, 30);
  player.body.setOffset(15, 40);

  npc1.body.setSize(700, 1000); // Exemplo: Largura 40, Altura 90. Ajuste esses valores!
  npc1.body.setOffset(100, 10);

  // Adicionar colisão entre o jogador e a camada de colisão
  this.physics.add.collider(player, colisaoLayer);

  console.log(selectedCharacter);

  if (selectedCharacter && !this.anims.exists("idle_front")) {
    this.anims.create({
      key: "idle_front",
      frames: [{ key: selectedCharacter, frame: 0 }],
      frameRate: 1,
      repeat: -1,
    });

    this.anims.create({
      key: "idle_back",
      frames: [{ key: selectedCharacter, frame: 5 }],
      frameRate: 1,
      repeat: -1,
    });

    this.anims.create({
      key: "idle_side",
      frames: [{ key: selectedCharacter, frame: 3 }],
      frameRate: 1,
      repeat: -1,
    });

    this.anims.create({
      key: "walk_down",
      frames: [
        { key: selectedCharacter, frame: 0 },
        { key: selectedCharacter, frame: 1 },
        { key: selectedCharacter, frame: 0 },
        { key: selectedCharacter, frame: 2 },
      ],
      frameRate: 7,
      repeat: -1,
    });

    this.anims.create({
      key: "walk_side",
      frames: [
        { key: selectedCharacter, frame: 3 },
        { key: selectedCharacter, frame: 4 },
      ],
      frameRate: 7,
      repeat: -1,
    });

    this.anims.create({
      key: "walk_up",
      frames: [
        { key: selectedCharacter, frame: 5 },
        { key: selectedCharacter, frame: 6 },
        { key: selectedCharacter, frame: 5 },
        { key: selectedCharacter, frame: 7 },
      ],
      frameRate: 7,
      repeat: -1,
    });
    console.log("Animações registradas:", this.anims.anims.entries);
  }

  function update() {
    let moving = false;
    let newAnimation = null;

    // Captura de teclas WASD
    const leftPressed =
      cursors.left.isDown ||
      this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A).isDown;
    const rightPressed =
      cursors.right.isDown ||
      this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D).isDown;
    const upPressed =
      cursors.up.isDown ||
      this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W).isDown;
    const downPressed =
      cursors.down.isDown ||
      this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S).isDown;

    if (leftPressed) {
      player.setVelocityX(-130);
      player.setVelocityY(0);
      player.setFlipX(true);
      newAnimation = "walk_side";
      lastDirection = "left";
      moving = true;
    } else if (rightPressed) {
      player.setVelocityX(130);
      player.setVelocityY(0);
      player.setFlipX(false);
      newAnimation = "walk_side";
      lastDirection = "right";
      moving = true;
    } else if (upPressed) {
      player.setVelocityY(-130);
      player.setVelocityX(0);
      newAnimation = "walk_up";
      lastDirection = "up";
      moving = true;
    } else if (downPressed) {
      player.setVelocityY(130);
      player.setVelocityX(0);
      newAnimation = "walk_down";
      lastDirection = "down";
      moving = true;
    } else {
      player.setVelocityX(0);
      player.setVelocityY(0);

      // Define a animação de idle baseada na última direção
      switch (lastDirection) {
        case "left":
        case "right":
          newAnimation = "idle_side";
          break;
        case "up":
          newAnimation = "idle_back";
          break;
        case "down":
        case "front":
        default:
          newAnimation = "idle_front";
          break;
      }
    }

    console.log(this.anims.exists("walk_down"));
    console.log(this.anims.exists("walk_up"));
    console.log(this.anims.exists("walk_side"));

      // Se a animação precisa ser mudada, troca apenas se necessário
      if (newAnimation && newAnimation !== currentAnimation) {
        player.anims.play(newAnimation, true);
        currentAnimation = newAnimation;
      }

     // Captura a tecla "E"
  let teclaE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
  
  // Função para verificar a proximidade do jogador com o NPC
  function jogadorPertoNpc(player, npc) {
    podeIniciarDialogo = true;
    avisoTexto.setPosition(npc.x, npc.y - 50);
    avisoTexto.setVisible(true);
  }
  
  // Função para quando o jogador sair da área do NPC
  function jogadorSaiuDoNpc(player, npc) {
    podeIniciarDialogo = false;
    avisoTexto.setVisible(false);
  }
  
  // Adiciona verificação de colisão com NPC
  this.physics.add.overlap(player, npc1, jogadorPertoNpc, null, this);
  this.physics.add.collider(player, npc1, jogadorSaiuDoNpc, null, this);
  
  function iniciarDialogo() {
    if (!podeIniciarDialogo || dialogoIniciado) return;
  
    dialogoIniciado = true;

    // Escolhe um novo diálogo aleatório
    const novoDialogo = dialogo[Math.floor(Math.random() * dialogo.length)];
    textoDialogo.setText(novoDialogo);

    // Exibe a caixa de diálogo corretamente
    caixaDialogo.setVisible(true);
    sombra.setVisible(true);
    personagem.setVisible(true);
    textoDialogo.setVisible(true);

    // Esconde o aviso de "E"
    avisoTexto.setVisible(false);

    setTimeout(() => {
        caixaDialogo.setVisible(false);
        sombra.setVisible(false);
        personagem.setVisible(false);
        textoDialogo.setVisible(false);
        dialogoIniciado = false;

        // Só exibe o aviso se ainda estiver perto do NPC
        avisoTexto.setVisible(podeIniciarDialogo);
    }, 3000);
}
  
  // Atualiza a verificação da tecla no update()
  this.update = function () {
    if (podeIniciarDialogo && Phaser.Input.Keyboard.JustDown(teclaE) && !dialogoIniciado) {
      iniciarDialogo();
    }
  }}
    // Configurar a câmera para seguir o jogador
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(player);
  
  // Criar o aviso de interação (inicia invisível)
  avisoTexto = this.add.text(0, 0, "Aperte 'E' para interagir", {
    fontFamily: "Arial",
    fontSize: "20px",
    color: "#FFFF00",
    stroke: "#000000",
    strokeThickness: 2,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: { left: 5, right: 5, top: 2, bottom: 2 },
  });
  avisoTexto.setOrigin(0.5);
  avisoTexto.setVisible(false);
  
  // Criar fundo da caixa de diálogo
  let caixaDialogo = this.add.graphics();
  caixaDialogo.fillStyle(0xffffff, 1); // Fundo branco
  caixaDialogo.fillRoundedRect(50, 400, 700, 100, 10); // Caixa arredondada
  caixaDialogo.lineStyle(4, 0xff0000, 1); // Borda vermelha
  caixaDialogo.strokeRoundedRect(50, 400, 700, 100, 10);
  
  // Criar sombra para profundidade
  let sombra = this.add.graphics();
  sombra.fillStyle(0x000000, 0.3);
  sombra.fillRoundedRect(55, 405, 700, 100, 10);
  
  // Adicionar imagem do personagem (se houver)
  let personagem = this.add.image(80, 450, selectedCharacter).setScale(4);
  personagem.setOrigin(0.5, 0.5);
  
  // Lista de diálogos possíveis
  const dialogo = [
    "Olá, o quê aconteceu na escola?",
    "Bom dia! cadê todo mundo?",
    "Ei, você! cade o resto do pessoal?",
  ];
  
  // Criar texto do diálogo (mas invisível no início)
  let textoDialogo = this.add.text(150, 430, "", { // Começa vazio
    fontFamily: "arial",
    fontSize: "28px",
    color: "#FFF",
    wordWrap: { width: 550 },
    padding: { left: 10, right: 10, top: 10, bottom: 5 }
  }).setStroke("#000000", 4);
  textoDialogo.setVisible(false); // Deixa invisível
  
  // Adiciona verificação de colisão com NPC
  this.physics.add.overlap(player, npc1, jogadorPertoNpc, null, this);
  
  // Função para verificar a proximidade do jogador com o NPC
  function jogadorPertoNpc(player, npc) {
    podeIniciarDialogo = true;
    avisoTexto.setPosition(npc.x, npc.y - 50);
    avisoTexto.setVisible(true);
  }

  caixaDialogo.setVisible(false);
  sombra.setVisible(false);
  personagem.setVisible(false);
  textoDialogo.setVisible(false);
  
  // Função para iniciar o diálogo ao pressionar "E"
  this.input.keyboard.on('keydown-E', () => {
    if (!podeIniciarDialogo || dialogoIniciado) return;
  
    dialogoIniciado = true;
    caixaDialogo.setVisible(true);
    sombra.setVisible(true);
    personagem.setVisible(true);
    textoDialogo.setVisible(true);
  
    // Escolhe um novo diálogo aleatório ao interagir
    const novoDialogo = dialogo[Math.floor(Math.random() * dialogo.length)];
    textoDialogo.setText(novoDialogo);
    textoDialogo.setVisible(true);
  
    // Oculta o aviso de interação enquanto o diálogo está ativo
    avisoTexto.setVisible(false);
  
    // Após um tempo, oculta o diálogo e permite nova interação
    setTimeout(() => {
        textoDialogo.setVisible(false);
        dialogoIniciado = false;
        caixaDialogo.setVisible(false);
        sombra.setVisible(false);
        personagem.setVisible(false);
        textoDialogo.setVisible(false);
        avisoTexto.setVisible(true); // Reexibe o aviso depois que o diálogo some
    }, 3000);
  });
  }