// Variáveis globais
let selectedCharacter;
let player;
let map;
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
let npc1;
let professorNpc;
let keyCollected = false;
let collectedKey = null;
let currentAnimation;
let lastDirection = "front";
let dialogoNpc1Concluido = false;
let dialogoProfessorIniciado = false;
let dialogoProfessorConcluido = false;
let professorImage;
let doorMessage;
let isDoorOpen = false;
let canInteractWithDoor = false;

// Adicione esta variável global
let helpButton;

// Adicionar variável global para controlar estado do minigame
let minigameActive = false;

// Adicionar variáveis globais no início do arquivo
let keycardCount = 0;
let keycardText;
let keycardIcon;

// Adicione estas novas variáveis globais no início do arquivo
let dialogoProfessor2Iniciado = false;
let dialogoProfessor2Concluido = false;
let professor2Image;

// Adicione estas novas variáveis globais no início do arquivo
let dialogoProfessor3Iniciado = false;
let dialogoProfessor3Concluido = false;
let professor3Image;
let currentProfessor = null; // Para controlar qual professor está ativo no minigame

// Adicione estas novas variáveis globais no início do arquivo
let dialogoProfessor4Iniciado = false;
let dialogoProfessor4Concluido = false;
let professor4Image;

// Adicione estas variáveis globais para controlar o estado da segunda porta
let isDoor2Open = false;
let door2OpenMessage = null;

// Adicione estas variáveis globais para o sistema de tutorial
let tutorialActive = false;
let tutorialSlide = 0;
let tutorialElements = [];

// Adicionar às variáveis globais
let playerName;

// Adicionar função startGameWithName no início do arquivo, logo após as variáveis globais
function startGameWithName(character, buttonElement) {
  // Encontrar o campo de entrada dentro do mesmo card
  const card = buttonElement.closest('.character-card');
  const nameInput = card.querySelector('.player-name-input');
  const playerName = nameInput.value.trim() || "Jogador"; // Usa "Jogador" como padrão se vazio
  
  // Salvar o nome e o personagem selecionado
  localStorage.setItem("playerName", playerName);
  localStorage.setItem("currentCharacter", character);
  console.log("Personagem selecionado:", character, "com nome:", playerName);
  
  // Iniciar o jogo usando a função existente
  startGame(character);
}

// Garanta que estas linhas estejam no início do seu script.js
// para evitar a duplicação da configuração do jogo
if (window.game) {
  console.log("Jogo já inicializado. Usando a instância existente.");
} else {
  // Configuração do jogo Phaser
  const config = {
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
        debug: false, // Mudar para false em produção
      },
    },
    scene: {
      key: "main",
      preload: preload,
      create: createMain,
      update: updateMain,
    }
  };

  // Criação do jogo Phaser
  window.game = new Phaser.Game(config);
}

// Função para iniciar o jogo com o personagem selecionado
function startGame(character) {
  // Essa função agora está sendo substituída pela versão no arquivo HTML
  // Mantemos uma versão básica aqui por compatibilidade
  selectedCharacter = character;
  localStorage.setItem("currentCharacter", character);
  console.log("Personagem selecionado e salvo (função original):", selectedCharacter);
}

// Função para pré-carregar os assets do jogo
function preload() {
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
  this.load.spritesheet("personagemDialogo1", "../../assets/dialogos/personagemDialogo1.png", {
    frameWidth: 225,  // Reduzido novamente
    frameHeight: 300  // Também ajuste a altura
  });
  this.load.spritesheet("personagemDialogo2", "../../assets/dialogos/personagemDialogo2.png", {
    frameWidth: 225,
    frameHeight: 300
  });
  this.load.spritesheet("personagemDialogo3", "../../assets/dialogos/personagemDialogo3.png", {
    frameWidth: 225,
    frameHeight: 300
  });
  this.load.spritesheet("personagemDialogo4", "../../assets/dialogos/personagemDialogo4.png", {
    frameWidth: 225,
    frameHeight: 300
  });
  this.load.spritesheet("door1", "../../assets/fase1/door.png", {
    frameWidth: 32,
    frameHeight: 64
  });
  this.load.spritesheet("door2", "../../assets/fase1/door.png", {
    frameWidth: 32,
    frameHeight: 64
  });
  this.load.image("npc1", "../../assets/npc.png");
  this.load.image("professorNpc", "../../assets/sprite_prof.png");
  this.load.image("professorNpc2", "../../assets/sprite_prof.png");
  this.load.image("professorNpc3", "../../assets/sprite_prof.png");
  this.load.image("professorNpc4", "../../assets/sprite_prof.png");
  this.load.image("elevator", "../../assets/animated_elevator_door_entrance_2_32x32.gif");
  this.load.image("background", "../../assets/fase1/background.png");
  this.load.tilemapTiledJSON("map", "tileset.json");
  this.load.image("player1big", "../../assets/personagem/personagem1Big.png");
  this.load.image("keycard", "../../assets/fase1/Spritegrande.png");
  this.load.image("key", "../../assets/fase1/chavesprite.png");
  this.load.image(
    "3_Bathroom_32x32",
    "../../assets/fase1/3_Bathroom_32x32.png"
  );
  this.load.image(
    "5_Classroom_and_library_32x32",
    "../../assets/fase1/5_Classroom_and_library_32x32.png" // Added .png
  );
  this.load.image(
    "13_Conference_Hall_32x32",
    "../../assets/fase1/13_Conference_Hall_32x32.png" // Added .png
  );
  this.load.image(
    "14_Basement_32x32",
    "../../assets/fase1/14_Basement_32x32.png" // Added .png
  );
  this.load.image(
    "16_Grocery_store_32x32",
    "../../assets/fase1/16_Grocery_store_32x32.png" // Added .png
  );
  this.load.image(
    "18_Jail_32x32",
    "../../assets/fase1/18_Jail_32x32.png"
  );
  this.load.image(
    "19_Hospital_32x32",
    "../../assets/fase1/19_Hospital_32x32.png"
  );
  this.load.image(
    "23_Television_and_Film_Studio_32x32",
    "../../assets/fase1/23_Television_and_Film_Studio_32x32.png" // Added .png
  );
  this.load.image(
    "25_Shooting_Range_32x32",
    "../../assets/fase1/25_Shooting_Range_32x32.png" // Added .png
  );
  this.load.image(
    "Room_Builder_32x32",
    "../../assets/fase1/Room_Builder_32x32.png" // Added .png
  );
  // Carregar sprite do professor para o diálogo
  // Se houver apenas 1 frame para o faxineiro, use um .image ao invés do .spritesheet
  this.load.image("faxineiroDialogo", "../../assets/dialogos/faxineiro.png");
}

// Função para criar a cena principal do jogo
function create() {
  // this.scene.remove("main");
  // this.scene.add("main", { create: createMain, update: updateMain }, true);
}

// Função para criar a cena principal do jogo
function createMain() {
  selectedCharacter = localStorage.getItem("currentCharacter") || "player1";
  playerName = localStorage.getItem("playerName") || "Jogador";
  
  // Create map and basic setup first
  map = this.make.tilemap({ key: "map" });

  const bathroomTileset = map.addTilesetImage(
    "3_Bathroom_32x32",
    "3_Bathroom_32x32"
  );
  const classroomTileset = map.addTilesetImage(
    "5_Classroom_and_library_32x32",
    "5_Classroom_and_library_32x32"
  );
  const conferenceTileset = map.addTilesetImage(
    "13_Conference_Hall_32x32",
    "13_Conference_Hall_32x32"
  );
  const basementTileset = map.addTilesetImage(
    "14_Basement_32x32",
    "14_Basement_32x32"
  );
  const groceryTileset = map.addTilesetImage(
    "16_Grocery_store_32x32",
    "16_Grocery_store_32x32"
  );
  const jailTileset = map.addTilesetImage("18_Jail_32x32", "18_Jail_32x32");
  const hospitalTileset = map.addTilesetImage(
    "19_Hospital_32x32",
    "19_Hospital_32x32"
  );
  const studioTileset = map.addTilesetImage(
    "23_Television_and_Film_Studio_32x32",
    "23_Television_and_Film_Studio_32x32"
  );
  const shootingTileset = map.addTilesetImage(
    "25_Shooting_Range_32x32",
    "25_Shooting_Range_32x32"
  );
  const roomBuilderTileset = map.addTilesetImage(
    "Room_Builder_32x32",
    "Room_Builder_32x32"
  );

  const tilesets = [
    bathroomTileset,
    classroomTileset,
    conferenceTileset,
    basementTileset,
    groceryTileset,
    jailTileset,
    hospitalTileset,
    studioTileset,
    shootingTileset,
    roomBuilderTileset,
  ];

  // Criação das camadas do mapa
  chaoLayer = map.createLayer("chão", tilesets, 0, 0);
  paredeLayer = map.createLayer("parede", tilesets, 0, 0);
  objSemColisaoLayer = map.createLayer("obj_semcolisao", tilesets, 0, 0);
  colisaoLayer = map.createLayer("obj_comcolisao", tilesets, 0, 0);
  obj2ColisaoLayer = map.createLayer("obj2_comcolisao", tilesets, 0, 0);

  const objectsLayer = map.getObjectLayer("obj_comcolisao");

  // Definindo colisões para as camadas
  colisaoLayer.setCollisionByProperty({ collider: true });
  obj2ColisaoLayer.setCollisionByProperty({ collider: true });
  paredeLayer.setCollisionByProperty({ collider: true });

  chaoLayer.setScale(1);
  paredeLayer.setScale(1);
  objSemColisaoLayer.setScale(1);
  colisaoLayer.setScale(1);
  obj2ColisaoLayer.setScale(1);

  cursors = this.input.keyboard.createCursorKeys();

  // Criação do jogador
  player = this.physics.add.sprite(100, 280, selectedCharacter, 0);
  player.setCollideWorldBounds(true);
  player.setScale(0.8);
  player.setOrigin(0.5, 1);
  player.body.setSize(27, 10);
  player.body.setOffset(18, 55);

  // Após criar o jogador e antes de configurar a câmera, adicione o nome sobre o jogador
  const nameTag = this.add.text(0, -32, playerName, { // Movido para cima (de -35 para -25)
    fontFamily: 'Arial',
    fontSize: '9px', // Diminuído ainda mais (de 9px para 7px)
    color: '#ffffff',
    stroke: '#000000',
    strokeThickness: 2, // Reduzido de 3 para 2 para ficar mais proporcional
    align: 'center'
  });
  nameTag.setOrigin(0.5, 0.5);
  
  // Criar um container que inclui o jogador e sua nameTag
  const playerContainer = this.add.container(player.x, player.y);
  playerContainer.add([nameTag]);
  
  // Atribuir o container ao player para fácil acesso
  player.nameContainer = playerContainer;
  
  // Configurar a profundidade do container
  playerContainer.setDepth(1005); // DEPTHS.PLAYER + 1

  // Não precisamos de event listener aqui, vamos fazer a atualização em updateMain

  // Criação do elevador
  elevator = this.physics.add.sprite(680, 363, "elevator", 0);
  elevator.setCollideWorldBounds(true);
  elevator.setScale(1);
  elevator.setOrigin(0.2, 1);
  elevator.body.setSize(70, 70);
  elevator.body.setOffset(-3, 0);
  elevator.setImmovable(true);


  // Adiciona colisão entre o jogador e o elevador
  this.physics.add.collider(player, elevator, enterElevator, null, this);

  // Função para entrar no elevador
  function enterElevator(player, elevator) {
    // Verificar se o jogador coletou a chave
    if (keyCollected) {
      console.log("Entrando no elevador...");
      localStorage.setItem("selectedCharacter", selectedCharacter);
      document.body.classList.add("fade-out");
      setTimeout(() => {
        window.location.replace("../fase2/fase2.html");
      }, 1200);
    } else {
      // Mostrar mensagem informando que precisa da chave
      showElevatorMessage(this);
    }
  }

  // Adicione esta nova função para mostrar a mensagem do elevador
  function showElevatorMessage(scene) {
    // Se já existe uma mensagem, não criar outra
    if (scene.elevatorMessage) return;
    
    // Calculando posições baseadas no tamanho da câmera (mesma lógica dos diálogos)
    const cameraWidth = scene.cameras.main.width;
    const cameraHeight = scene.cameras.main.height;
    
    // Usar posição e estilo similares aos diálogos
    const boxWidth = 600;
    const boxHeight = 100;
    const boxY = cameraHeight - boxHeight - 150; // Mesma posição Y dos diálogos
    
    // Criar mensagem informando que precisa da chave
    scene.elevatorMessage = scene.add.text(
      cameraWidth / 2,
      boxY + (boxHeight / 2), // Centralizar verticalmente na "caixa" invisível
      "Preciso encontrar a chave para usar o elevador!",
      {
        fontFamily: "Arial",
        fontSize: "20px", // Aumentei um pouco para melhor visibilidade
        color: "#FFFFFF",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        padding: { left: 20, right: 20, top: 15, bottom: 15 },
        align: 'center'
      }
    );
    scene.elevatorMessage.setOrigin(0.5);
    scene.elevatorMessage.setScrollFactor(0);
    scene.elevatorMessage.setDepth(100); // Mesmo depth dos diálogos
    
    // Fazer a mensagem aparecer com efeito de fade in
    scene.elevatorMessage.setAlpha(0);
    scene.tweens.add({
      targets: scene.elevatorMessage,
      alpha: 1,
      duration: 300,
      ease: 'Power2'
    });
    
    // Remover a mensagem após 2.5 segundos
    scene.time.delayedCall(2500, () => {
      if (scene.elevatorMessage) {
        scene.tweens.add({
          targets: scene.elevatorMessage,
          alpha: 0,
          duration: 300,
          ease: 'Power2',
          onComplete: () => {
            scene.elevatorMessage.destroy();
            scene.elevatorMessage = null;
          }
        });
      }
    });
  }

  // Criação do NPC1
  npc1 = this.physics.add.sprite(130, 320, "npc1", 0);
  npc1.setCollideWorldBounds(true);
  npc1.setScale(0.6);
  npc1.setOrigin(0.2, 1);
  npc1.body.setSize(40, 20);
  npc1.body.setOffset(28, 75);
  npc1.body.setImmovable(true);

  // Criação do professor NPC
  professorNpc = this.physics.add.sprite(600, 480, "professorNpc", 0);
  professorNpc.setCollideWorldBounds(true);
  professorNpc.setScale(0.8);
  professorNpc.setOrigin(0.2, 1);
  professorNpc.body.setSize(20, 20);
  professorNpc.body.setOffset(38, 75);
  professorNpc.body.setImmovable(true);

   // Criação do professor NPC
   professorNpc2 = this.physics.add.sprite(400, 318, "professorNpc2", 0);
   professorNpc2.setCollideWorldBounds(true);
   professorNpc2.setScale(0.8);
   professorNpc2.setOrigin(0.2, 1);
   professorNpc2.body.setSize(20, 20);
   professorNpc2.body.setOffset(38, 75);
   professorNpc2.body.setImmovable(true);

   
   // Criação do professor NPC
   professorNpc3 = this.physics.add.sprite(400, 795, "professorNpc3", 0);
   professorNpc3.setCollideWorldBounds(true);
   professorNpc3.setScale(0.8);
   professorNpc3.setOrigin(0.2, 1);
   professorNpc3.body.setSize(20, 20);
   professorNpc3.body.setOffset(38, 75);
   professorNpc3.body.setImmovable(true);

   // Criação do professor NPC
   professorNpc4 = this.physics.add.sprite(1000, 605, "professorNpc4", 0);
   professorNpc4.setCollideWorldBounds(true);
   professorNpc4.setScale(0.8);
   professorNpc4.setOrigin(0.2, 1);
   professorNpc4.body.setSize(20, 20);
   professorNpc4.body.setOffset(38, 75);
   professorNpc4.body.setImmovable(true);

  // Criação da chave
  key = this.physics.add.sprite(1000, 320, "key", 0);
  key.setCollideWorldBounds(true);
  key.setScale(0.8);
  key.setOrigin(0.2, 1);
  key.body.setSize(25, 10);
  key.body.setOffset(2, 5);
  
  // Adicionar efeito de "pulsação" na chave para destacá-la
  this.tweens.add({
    targets: key,
    scaleX: 0.9,
    scaleY: 0.9,
    duration: 800,
    yoyo: true,
    repeat: -1,
    ease: 'Sine.easeInOut'
  });

  // Adiciona colisão entre o jogador e o professor NPC
  this.physics.add.collider(player, professorNpc);
  // Adiciona colisão entre o jogador e o professor NPC
  this.physics.add.collider(player, professorNpc2);
  // Adiciona colisão entre o jogador e o professorNpc4
  this.physics.add.collider(player, professorNpc4);
  // Adiciona sobreposição entre o jogador e a chave
  this.physics.add.overlap(player, key, collectKey, null, this);  

  if (objectsLayer) {
    const collisionGroup = this.physics.add.staticGroup();
    objectsLayer.objects.forEach((obj) => {
      const collisionObject = this.add.rectangle(
        obj.x,
        obj.y,
        obj.width,
        obj.height
      );
      this.physics.add.existing(collisionObject, true);
      collisionGroup.add(collisionObject);
    });

    this.physics.add.collider(player, collisionGroup, () => {
      console.log("Colisão com objeto detectada!");
    });
  }

  // Criação de animações para o personagem
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
  }

  // Adiciona colisões entre o jogador e as camadas de colisão
  const layers = [colisaoLayer, obj2ColisaoLayer, paredeLayer];
  
  layers.forEach((layer) => {
    if (layer) {
      layer.setCollisionByProperty({ collider: true });
      this.physics.add.collider(player, layer);
    }
  });

  player.body.setBounce(0);
  player.body.setMaxVelocity(200);
  player.body.useDamping = true;
  player.body.setImmovable(false);

  // Configurar a câmera para seguir o jogador
  this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
  this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
  this.cameras.main.startFollow(player);
  this.cameras.main.setZoom(1.5);

  // Criar o botão de ajuda aqui
  helpButton = this.add.text(400, 300, "Ajudar Professora", {
    fontFamily: "Arial",
    fontSize: "32px",
    color: "#ffffff",
    backgroundColor: "#ff0000",
    padding: { x: 20, y: 10 },
    fixedWidth: 300,
    align: 'center'
  })
  .setScrollFactor(0)
  .setDepth(1000)
  .setOrigin(0.5)
  .setInteractive({ useHandCursor: true })
  .on('pointerdown', () => {
    console.log("Botão clicado!");
    startMinigame(this);
  });
  
  helpButton.setVisible(false);
  console.log("Botão criado:", helpButton);

  // Criação do aviso de interação
  avisoTexto = this.add.text(0, 0, " Aperte (E) para interagir", {
    fontFamily: "Arial",
    fontSize: "12px",
    color: "#FFFF",
    stroke: "#000000",
    strokeThickness: 2,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: { left: 5, right: 5, top: 2, bottom: 2 },
  });
  avisoTexto.setOrigin(0.5);
  avisoTexto.setVisible(false);

  // Determinamos qual sprite de diálogo usar com base no personagem selecionado
  let dialogCharacterKey;
  console.log("Criando diálogo para personagem:", selectedCharacter); // Log para debug
  
  if (selectedCharacter === "player1") {
    dialogCharacterKey = "personagemDialogo1";
  } else if (selectedCharacter === "player2") {
    dialogCharacterKey = "personagemDialogo2";
  } else if (selectedCharacter === "player3") {
    dialogCharacterKey = "personagemDialogo3";
  } else if (selectedCharacter === "player4") {
    dialogCharacterKey = "personagemDialogo4";
  } else {
    dialogCharacterKey = "personagemDialogo1"; // Fallback
    console.warn("Personagem desconhecido, usando personagemDialogo1 como fallback");
  }
  
  console.log("Sprite de diálogo selecionado:", dialogCharacterKey); // Log para debug

  // Criação dos elementos da caixa de diálogo
  caixaDialogo = this.add.graphics();
  caixaDialogo.fillStyle(0x00000, 1);
  caixaDialogo.fillRoundedRect(50, 400, 700, 100, 10);
  caixaDialogo.lineStyle(4, 0xefffffff, 1);
  caixaDialogo.strokeRoundedRect(50, 400, 700, 100, 10);
  caixaDialogo.setScrollFactor(0); // Fixa na câmera

  // Criação da sombra para cobrir a tela inteira quando ativo
  sombra = this.add.graphics();
  sombra.fillStyle(0x000000, 0.3);
  sombra.fillRect(0, 0, map.widthInPixels, map.heightInPixels);

  // Substitua a imagem estática por um sprite sem animação, usando o dialogCharacterKey correto
  personagem = this.add.sprite(70, 420, dialogCharacterKey, 1);
  personagem.setScale(0.7); // Aumentar um pouco a escala para compensar o tamanho menor
  personagem.setOrigin(0.5, 0.5);
  personagem.setScrollFactor(0); // Fixa na câmera

  // Adiciona a imagem do npc1 como sprite
  npc1Image = this.add.sprite(750, 420, "npc1", 0);
  npc1Image.setScale(0.8); // Ajustar escala para combinar com o personagem
  npc1Image.setOrigin(0.5, 0.5);
  npc1Image.setScrollFactor(0); // Fixa na câmera

  // Adicione uma imagem do professor para o diálogo
  professorImage = this.add.sprite(750, 420, "professorNpc", 0);
  professorImage.setScale(2.0);
  professorImage.setOrigin(0.5, 0.5);
  professorImage.setVisible(false);
  professorImage.setScrollFactor(0); // Fixa na câmera

  // Adicione a imagem para o diálogo do professor2, logo depois da criação do professorImage
  professor2Image = this.add.sprite(750, 420, "professorNpc2", 0);
  professor2Image.setScale(2.0);
  professor2Image.setOrigin(0.5, 0.5);
  professor2Image.setVisible(false);
  professor2Image.setScrollFactor(0); // Fixa na câmera

  // Adicione a imagem para o diálogo do professor3
  professor3Image = this.add.sprite(750, 420, "professorNpc3", 0);
  professor3Image.setScale(2.0);
  professor3Image.setOrigin(0.5, 0.5);
  professor3Image.setVisible(false);
  professor3Image.setScrollFactor(0);

  // Adicione a imagem para o diálogo do professor4
  professor4Image = this.add.sprite(750, 420, "professorNpc4", 0);
  professor4Image.setScale(2.0);
  professor4Image.setOrigin(0.5, 0.5);
  professor4Image.setVisible(false);
  professor4Image.setScrollFactor(0);

  // Lista de diálogos personalizados - ATUALIZE esta parte
  const dialogosPersonalizados = [
    { texto: "Com licença senhor, o que aconteceu por aqui?...", autor: "player" },
    { texto: "Por que a porta da escola está fechada?", autor: "player" },
    { texto: "Fale mais baixo! Senão eles poderão te detectar!", autor: "npc" },
    { texto: "Quem são eles?", autor: "player" },
    { texto: "Tem muita informação para explicar. É melhor você ir embora,", autor: "npc" },
    { texto: "As coisas estão muito perigosas aqui dentro.", autor: "npc" },
    { texto: "Não, eu quero saber o que aconteceu.", autor: "player" },
    { texto: "(Jovem persistente…) Ok, tudo bem...", autor: "npc" },
    { texto: "Mas eu só consigo te explicar o que eu sei.", autor: "npc" },
    { texto: "Tudo bem.", autor: "player" },
    { texto: "Eu estava limpando as janelas perto da entrada...", autor: "npc" },
    { texto: "e percebi que a escola começou a ser invadida.", autor: "npc" },
    { texto: "Aparentemente alguém conseguiu acessar o sistema...", autor: "npc" },
    { texto: "para controlar todos os professores da escola...", autor: "npc" },
    { texto: "E ROUBAR DADOS DOS ALUNOS.", autor: "npc" },
    { texto: "PERA…!!!", autor: "player" },
    { texto: "UM HACKER CONTROLANDO OS PROFESSORES PARA ROUBAR DADOS PESSOAIS??", autor: "player" },
    { texto: "…", autor: "npc" },
    { texto: "Você não sabe o que é isso né?", autor: "npc" },
    { texto: "Eheh…, eu nunca prestei muita atenção nessas aulas.", autor: "player" },
    { texto: "Agora mais do que nunca os conteúdos daquelas aulas importam!!", autor: "npc" },
    { texto: "Os seus dados pessoais são as informações...", autor: "npc" },
    { texto: "que permitem identificar você. ", autor: "npc" },
    { texto: "Informações como seu nome, seu RG e o seu CPF.", autor: "npc" },
    { texto: "Ah... então tipo, meu nome completo e essas coisas?", autor: "player" },
    { texto: "Exatamente! Mas não é só isso.", autor: "npc" },
    { texto: "Seu endereço, seu telefone, até seu histórico escolar...", autor: "npc" },
    { texto: "tudo isso são dados pessoais.", autor: "npc" },
    { texto: "E essas informações, se caírem nas mãos erradas,", autor: "npc" },
    { texto: "podem ser um grande problema.", autor: "npc" },
    { texto: "Tá, mas por que alguém ia querer roubar essas informações?", autor: "player" },
    { texto: "Olha, esses hackers podem vender...", autor: "npc" },
    { texto: "essas informações ou usá-las para golpes.", autor: "npc" },
    { texto: "Se alguém souber seus dados,", autor: "npc" },
    { texto: "pode tentar criar contas no seu nome ou coisas piores.", autor: "npc" },
    { texto: "Eita, sério mesmo?", autor: "player" },
    { texto: "Muito sério!", autor: "npc" },
    { texto: "E por isso existe a LGPD—Lei Geral de Proteção de Dados.", autor: "npc" },
    { texto: "Ela serve para proteger as informações pessoais...", autor: "npc" },
    { texto: "das pessoas e garantir que ninguém as use sem permissão.", autor: "npc" },
    { texto: "Ah... acho que já ouvi esse nome em algum lugar,", autor: "player" },
    { texto: "mas nunca tive tanto interesse.", autor: "player" },
    { texto: "Pois é bom saber disso agora,", autor: "npc" },
    { texto: "porque você não tem escolha.", autor: "npc" },
    { texto: "Se quiser ajudar a salvar os alunos,", autor: "npc" },
    { texto: "vai ter que aprender pelo menos o básico sobre isso.", autor: "npc" },
    { texto: " Deve ter algum jeito de tirar os professores do controle do hacker, ", autor: "player" },
    { texto: "eu sei algumas coisas sobre a IA deles.", autor: "player" },
    { texto: "Certo, então tente recuperar o acesso!", autor: "npc" },
  ];

  // Lista de diálogos do professor
  const dialogosProfessor = [
    { texto: "Ei, Professora robô, como você está?", autor: "player" },
    { texto: "01101111 01101100 01100001", autor: "npc" },
    { texto: "O quê? Não estou entendendo...", autor: "player" },
    { texto: "Parece binário... ela deve estar sob controle do hacker!", autor: "player" },
    { texto: "Aluno não detectado. identifique-se", autor: "npc" },
    { texto: "Professora?!", autor: "player" },
    { texto: "Está acontecendo com você também?!", autor: "player" },
    { texto: "Escuta, um hacker está controlando você para roubar nossos dados, resete seus dados imediatamente!!", autor: "player" },
    { texto: "*Transmissão de dados em andamento*", autor: "npc" },
    { texto: "Isso é contra a LGPD, você não pode fazer isso", autor: "player" },
    { texto: "LGPD… processando, conflito detectado…", autor: "npc" },
    { texto: "Erro de busca, por favor, responda minhas perguntas para ampliar meu prompt de conhecimento antes de continuarmos", autor: "npc" },
  ];

  // Adicione diálogos para o professor2 após os diálogos do professor
  const dialogosProfessor2 = [
    { texto: "Olá, você parece perdido. Precisa de ajuda?", autor: "npc" },
    { texto: "Sim, estou tentando entender o que está acontecendo na escola.", autor: "player" },
    { texto: "ERRO... SISTEMA... COMPROMETIDO...", autor: "npc" },
    { texto: "Oh não, outro professor sob controle do hacker!", autor: "player" },
    { texto: "TRANSMISSÃO DE DADOS... INICIANDO...", autor: "npc" },
    { texto: "Ei! Isso é ilegal! A LGPD protege nossos dados pessoais!", autor: "player" },
    { texto: "Processando... Conflito detectado...", autor: "npc" },
    { texto: "Preciso de sua ajuda para restaurar meu sistema.", autor: "npc" },
    { texto: "Responda algumas perguntas sobre segurança de dados para me auxiliar.", autor: "npc" },
    { texto: "Vou fazer o possível para ajudar.", autor: "player" }
  ];

  // Adicione diálogos para o professor3
  const dialogosProfessor3 = [
    { texto: "Estranho ver um aluno por aqui nesse momento...", autor: "npc" },
    { texto: "Professor, está tudo bem com o senhor?", autor: "player" },
    { texto: "SISTEMA DE SEGURANÇA COMPROMETIDO... BYPASS DETECTADO...", autor: "npc" },
    { texto: "Ah não! Outro professor sendo controlado!", autor: "player" },
    { texto: "COLETANDO DADOS PESSOAIS... ENVIANDO PARA SERVIDOR REMOTO...", autor: "npc" },
    { texto: "Professor, você está violando a LGPD! Isso é crime!", autor: "player" },
    { texto: "Conflito de protocolos... Sobrecarga de sistema...", autor: "npc" },
    { texto: "Necessito de assistência para restaurar protocolo de proteção de dados.", autor: "npc" },
    { texto: "Pode testar meu conhecimento sobre privacidade de dados?", autor: "npc" },
    { texto: "Sim, vou ajudá-lo a recuperar o controle.", autor: "player" }
  ];

  // Adicione diálogos para o professor4
  const dialogosProfessor4 = [
    { texto: "Olá, aluno. O que faz aqui neste horário?", autor: "npc" },
    { texto: "Professor, precisamos da sua ajuda! Um hacker está controlando os professores!", autor: "player" },
    { texto: "SEQUÊNCIA INICIADA... CONEXÃO REMOTA... ATIVA", autor: "npc" },
    { texto: "Oh não, ele também foi comprometido!", autor: "player" },
    { texto: "COLETANDO DADOS DOS ALUNOS... CATEGORIZAÇÃO EM ANDAMENTO", autor: "npc" },
    { texto: "Professor, isso é ilegal! Dados pessoais são protegidos pela LGPD!", autor: "player" },
    { texto: "REFERÊNCIA À LGPD DETECTADA... AVALIANDO...", autor: "npc" },
    { texto: "Meu sistema precisa de ajuda para classificar dados pessoais corretamente", autor: "npc" },
    { texto: "Pode me ajudar a associar os dados às suas categorias de proteção?", autor: "npc" },
    { texto: "Claro, vou ajudá-lo a recuperar o controle", autor: "player" }
  ];

  // Criação do texto do diálogo
  textoDialogo = this.add
    .text(400, 450, "", {
      fontFamily: "arial",
      fontSize: "22px", 
      color: "#FFF",
      wordWrap: { width: 400 }, // Reduzida para evitar sobreposição
      align: "center",
      padding: { left: 20, right: 20, top: 10, bottom: 10 }, // Aumentado padding para manter distância
    })
    .setStroke("#000000", 3)
    .setOrigin(0.5, 0.5) // Centraliza o texto no ponto especificado
    .setScrollFactor(0); // Fixa na câmera
  
  // Ocultar elementos de diálogo
  caixaDialogo.setVisible(false);
  sombra.setVisible(false);
  personagem.setVisible(false);
  npc1Image.setVisible(false);
  textoDialogo.setVisible(false);

  let dialogoIndex = 0;
  podeIniciarDialogo = false; // Iniciar como falso por padrão

  // Animação para os personagens no diálogo
  if (!this.anims.exists("falaPersonagem")) {
    this.anims.create({
      key: 'falaPersonagem',
      frames: [
        { key: dialogCharacterKey, frame: 0 },
        { key: dialogCharacterKey, frame: 1 }
      ],
      frameRate: 4, // Velocidade da animação - ajuste conforme necessário
      repeat: -1    // Loop infinito
    });
  }

  // SUBSTITUA completamente o listener da tecla E com este código:
  if (!this.anims.exists("falaFaxineiro")) {
    this.anims.create({
      key: 'falaFaxineiro',
      frames: [
        { key: "faxineiroDialogo", frame: 0 }
      ],
      frameRate: 4,
      repeat: -1
    });
  }

  // Animação para o professor falando
  if (!this.anims.exists("falaProfessor")) {
    this.anims.create({
      key: 'falaProfessor',
      frames: [{ key: "professorNpc", frame: 0 }], 
      frameRate: 4,
      repeat: -1
    });
  }

  // SUBSTITUA completamente o listener da tecla E com este código:
  this.input.keyboard.on("keydown-E", () => {
    console.log("Tecla E pressionada. Pode iniciar diálogo:", podeIniciarDialogo);
    
    // Verifica se o jogador pode iniciar diálogo e se o diálogo não foi concluído anteriormente
    if ((!podeIniciarDialogo && !dialogoIniciado && !dialogoProfessorIniciado && !dialogoProfessor2Iniciado && !dialogoProfessor3Iniciado && !dialogoProfessor4Iniciado) || (dialogoNpc1Concluido && dialogoProfessorConcluido && dialogoProfessor2Concluido && dialogoProfessor3Concluido && dialogoProfessor4Concluido)) {
      console.log("Não pode iniciar diálogo - não está perto do NPC ou diálogo já foi concluído");
      return;
    }

    // Primeiro, verificamos a distância com o NPC1 (faxineiro)
    let distanceToNpc1 = Phaser.Math.Distance.Between(player.x, player.y, npc1.x, npc1.y);
    let distanceToProfessor = Phaser.Math.Distance.Between(player.x, player.y, professorNpc.x, professorNpc.y);
    let distanceToProfessor2 = Phaser.Math.Distance.Between(player.x, player.y, professorNpc2.x, professorNpc2.y);
    let distanceToProfessor3 = Phaser.Math.Distance.Between(player.x, player.y, professorNpc3.x, professorNpc3.y);
    let distanceToProfessor4 = Phaser.Math.Distance.Between(player.x, player.y, professorNpc4.x, professorNpc4.y);
    
    // Determina qual diálogo iniciar com base na proximidade
    let proximoAoFaxineiro = distanceToNpc1 < 70 && !dialogoNpc1Concluido;
    let proximoAoProfessor = distanceToProfessor < 70 && !dialogoProfessorConcluido;
    let proximoAoProfessor2 = distanceToProfessor2 < 70 && !dialogoProfessor2Concluido;
    let proximoAoProfessor3 = distanceToProfessor3 < 70 && !dialogoProfessor3Concluido;
    let proximoAoProfessor4 = distanceToProfessor4 < 70 && !dialogoProfessor4Concluido;
    
    // Se não está próximo de nenhum NPC ou diálogo já foi iniciado, retorna
    if ((!proximoAoFaxineiro && !proximoAoProfessor && !proximoAoProfessor2 && !proximoAoProfessor3 && !proximoAoProfessor4 && !dialogoIniciado && !dialogoProfessorIniciado && !dialogoProfessor2Iniciado && !dialogoProfessor3Iniciado && !dialogoProfessor4Iniciado)) {
      console.log("Não pode iniciar diálogo - não está perto de nenhum NPC");
      return;
    }
    
    // Diálogo com o Faxineiro
    if (proximoAoFaxineiro && !dialogoIniciado) {
      // Inicia diálogo com o faxineiro
      console.log("Iniciando diálogo com faxineiro");
      dialogoIniciado = true;
      caixaDialogo.setVisible(true);
      sombra.setVisible(true);
      avisoTexto.setVisible(false);
      processoDialogo(this, 'faxineiro', dialogosPersonalizados);
    } 
    // Diálogo com o Professor
    else if (proximoAoProfessor && !dialogoProfessorIniciado) {
      // Inicia diálogo com o professor
      console.log("Iniciando diálogo com professor");
      dialogoProfessorIniciado = true;
      caixaDialogo.setVisible(true);
      sombra.setVisible(true);
      avisoTexto.setVisible(false);
      processoDialogo(this, 'professor', dialogosProfessor);
    }
    // Diálogo com o Professor2
    else if (proximoAoProfessor2 && !dialogoProfessor2Iniciado) {
      // Inicia diálogo com o professor2
      console.log("Iniciando diálogo com professor 2");
      dialogoProfessor2Iniciado = true;
      caixaDialogo.setVisible(true);
      sombra.setVisible(true);
      avisoTexto.setVisible(false);
      processoDialogo(this, 'professor2', dialogosProfessor2);
    }
    // Diálogo com o Professor3
    else if (proximoAoProfessor3 && !dialogoProfessor3Iniciado) {
      // Inicia diálogo com o professor3
      console.log("Iniciando diálogo com professor 3");
      dialogoProfessor3Iniciado = true;
      caixaDialogo.setVisible(true);
      sombra.setVisible(true);
      avisoTexto.setVisible(false);
      processoDialogo(this, 'professor3', dialogosProfessor3);
    }
    // Diálogo com o Professor4
    else if (proximoAoProfessor4 && !dialogoProfessor4Iniciado) {
      // Inicia diálogo com o professor4
      console.log("Iniciando diálogo com professor 4");
      dialogoProfessor4Iniciado = true;
      caixaDialogo.setVisible(true);
      sombra.setVisible(true);
      avisoTexto.setVisible(false);
      processoDialogo(this, 'professor4', dialogosProfessor4);
    }
    // Continuar diálogo com o Faxineiro
    else if (dialogoIniciado) {
      // Avança diálogo do faxineiro
      avancaDialogo(this, 'faxineiro', dialogosPersonalizados);
    }
    // Continuar diálogo com o Professor
    else if (dialogoProfessorIniciado) {
      // Avança diálogo do professor
      avancaDialogo(this, 'professor', dialogosProfessor);
    }
    // Continuar diálogo com o Professor2
    else if (dialogoProfessor2Iniciado) {
      // Avança diálogo do professor2
      avancaDialogo(this, 'professor2', dialogosProfessor2);
    }
    // Continuar diálogo com o Professor3
    else if (dialogoProfessor3Iniciado) {
      // Avança diálogo do professor3
      avancaDialogo(this, 'professor3', dialogosProfessor3);
    }
    // Continuar diálogo com o Professor4
    else if (dialogoProfessor4Iniciado) {
      // Avança diálogo do professor4
      avancaDialogo(this, 'professor4', dialogosProfessor4);
    }
  });

  // Função para processar diálogos - extraída para reutilização
  function processoDialogo(scene, tipo, dialogos) {
    let dialogoIndex = 0;
    
    // Posicionar elementos de diálogo fixos na tela
    caixaDialogo.clear();
    
    // Calculando posições baseadas no tamanho da câmera
    const cameraWidth = scene.cameras.main.width;
    const cameraHeight = scene.cameras.main.height;
    
    // Posicionando a caixa na parte inferior da tela
    const boxWidth = 600;
    const boxHeight = 100;
    const boxX = (cameraWidth - boxWidth) / 2;
    const boxY = cameraHeight - boxHeight - 150; // 50 pixels de margem do fundo
    
    // Desenhando a caixa de diálogo na posição correta
    caixaDialogo.fillStyle(0x000000, 1);
    caixaDialogo.fillRoundedRect(boxX, boxY, boxWidth, boxHeight, 10);
    caixaDialogo.lineStyle(4, 0xefffffff, 1);
    caixaDialogo.strokeRoundedRect(boxX, boxY, boxWidth, boxHeight, 10);
    
    // Atualizando posições dos sprites
    personagem.x = boxX + 0;
    personagem.y = boxY + 50;
    
    npc1Image.x = boxX + boxWidth - 0;
    npc1Image.y = boxY + 50;
    
    professorImage.x = boxX + boxWidth - 0;
    professorImage.y = boxY + 50;
    
    // Na parte onde atualiza as posições dos sprites, adicione:
    if (tipo === 'professor2') {
      professor2Image.x = boxX + boxWidth - 0;
      professor2Image.y = boxY + 50;
    }
    
    // Na parte onde atualiza as posições dos sprites, adicione:
    if (tipo === 'professor3') {
      professor3Image.x = boxX + boxWidth - 0;
      professor3Image.y = boxY + 50;
    }
    
    // Na parte onde atualiza as posições dos sprites, adicione:
    if (tipo === 'professor4') {
      professor4Image.x = boxX + boxWidth - 0;
      professor4Image.y = boxY + 50;
    }
    
    // Largura disponível para texto considerando espaço para personagens nas laterais
    const textAreaWidth = boxWidth - 140; // 70px de espaço em cada lado para personagens
    
    // Redefinir estilo de texto para evitar sobreposição
    textoDialogo.setWordWrapWidth(textAreaWidth);
    
    // Posicionando o texto no centro exato da caixa, com margens seguras
    textoDialogo.x = boxX + (boxWidth / 2);
    textoDialogo.y = boxY + (boxHeight / 2);
    
    avancaDialogo(scene, tipo, dialogos);
  }
  
  // Função para avançar diálogos - extraída para reutilização
  function avancaDialogo(scene, tipo, dialogos) {
    // Verifica se ainda há diálogos a serem mostrados
    const dialogoIndex = tipo === 'faxineiro' ? 
      scene.registry.get('dialogoFaxineiroIndex') || 0 : 
      tipo === 'professor' ?
      scene.registry.get('dialogoProfessorIndex') || 0 :
      tipo === 'professor2' ?
      scene.registry.get('dialogoProfessor2Index') || 0 :
      tipo === 'professor3' ?
      scene.registry.get('dialogoProfessor3Index') || 0 :
      scene.registry.get('dialogoProfessor4Index') || 0;
    
    if (dialogoIndex < dialogos.length) {
      // Cancela timers existentes
      if (scene.falaTimer) scene.falaTimer.remove();
      if (scene.typingTimer) scene.typingTimer.remove();
      
      const dialogoAtual = dialogos[dialogoIndex];
      let textoCompleto = dialogoAtual.texto;
      let textoAtual = "";
      let charIndex = 0;
      
      // Limpa o texto anterior
      textoDialogo.setText("");
      textoDialogo.setVisible(true);
      
      // Alterna visibilidade das imagens conforme o autor
      if (tipo === 'faxineiro') {
        if (dialogoAtual.autor === 'npc') {
          npc1Image.setVisible(true);
          personagem.setVisible(false);
          professorImage.setVisible(false);
          professor2Image.setVisible(false);
          professor3Image.setVisible(false);
          professor4Image.setVisible(false);
          npc1Image.play('falaFaxineiro');
        } else {
          npc1Image.setVisible(false);
          professorImage.setVisible(false);
          professor2Image.setVisible(false);
          professor3Image.setVisible(false);
          professor4Image.setVisible(false);
          personagem.setVisible(true);
          personagem.play('falaPersonagem');
        }
      } else if (tipo === 'professor') { // professor
        if (dialogoAtual.autor === 'npc') {
          professorImage.setVisible(true);
          npc1Image.setVisible(false);
          professor2Image.setVisible(false);
          professor3Image.setVisible(false);
          professor4Image.setVisible(false);
          personagem.setVisible(false);
        } else {
          professorImage.setVisible(false);
          npc1Image.setVisible(false);
          professor2Image.setVisible(false);
          professor3Image.setVisible(false);
          professor4Image.setVisible(false);
          personagem.setVisible(true);
          personagem.play('falaPersonagem');
        }
      } else if (tipo === 'professor2') { // professor2
        if (dialogoAtual.autor === 'npc') {
          professor2Image.setVisible(true);
          npc1Image.setVisible(false);
          professorImage.setVisible(false);
          professor3Image.setVisible(false);
          professor4Image.setVisible(false);
          personagem.setVisible(false);
        } else {
          professor2Image.setVisible(false);
          npc1Image.setVisible(false);
          professorImage.setVisible(false);
          professor3Image.setVisible(false);
          professor4Image.setVisible(false);
          personagem.setVisible(true);
          personagem.play('falaPersonagem');
        }
      } else if (tipo === 'professor3') { // professor3
        if (dialogoAtual.autor === 'npc') {
          professor3Image.setVisible(true);
          npc1Image.setVisible(false);
          professorImage.setVisible(false);
          professor2Image.setVisible(false);
          professor4Image.setVisible(false);
          personagem.setVisible(false);
        } else {
          professor3Image.setVisible(false);
          npc1Image.setVisible(false);
          professorImage.setVisible(false);
          professor2Image.setVisible(false);
          professor4Image.setVisible(false);
          personagem.setVisible(true);
          personagem.play('falaPersonagem');
        }
      } else { // professor4
        if (dialogoAtual.autor === 'npc') {
          professor4Image.setVisible(true);
          professor3Image.setVisible(false);
          professor2Image.setVisible(false);
          npc1Image.setVisible(false);
          professorImage.setVisible(false);
          personagem.setVisible(false);
        } else {
          professor4Image.setVisible(false);
          professor3Image.setVisible(false);
          professor2Image.setVisible(false);
          npc1Image.setVisible(false);
          professorImage.setVisible(false);
          personagem.setVisible(true);
          personagem.play('falaPersonagem');
        }
      }
      
      // Digita o texto letra por letra
      const adicionarCaractere = () => {
        if (charIndex < textoCompleto.length) {
          textoAtual += textoCompleto[charIndex];
          textoDialogo.setText(textoAtual);
          
          // Verificar se o texto está saindo da área designada e ajustar se necessário
          if (textoDialogo.width > textoDialogo.style.wordWrapWidth) {
            textoDialogo.setWordWrapWidth(textoDialogo.style.wordWrapWidth);
          }
          
          charIndex++;
          scene.typingTimer = scene.time.delayedCall(30, adicionarCaractere, [], scene);
        } else {
          scene.falaTimer = scene.time.delayedCall(1500, () => {
            if (dialogoAtual.autor === "player") {
              personagem.stop();
              personagem.setFrame(1);
            } else {
              if (tipo === 'faxineiro') {
                npc1Image.stop();
                npc1Image.setFrame(0);
              } else if (tipo === 'professor') {
                professorImage.stop();
                professorImage.setFrame(0);
              } else if (tipo === 'professor2') {
                professor2Image.stop();
                professor2Image.setFrame(0);
              } else if (tipo === 'professor3') {
                professor3Image.stop();
                professor3Image.setFrame(0);
              } else {
                professor4Image.stop();
                professor4Image.setFrame(0);
              }
            }
          }, [], scene);
        }
      };
      
      adicionarCaractere();
      
      // Salva o próximo índice no registro
      if (tipo === 'faxineiro') {
        scene.registry.set('dialogoFaxineiroIndex', dialogoIndex + 1);
      } else if (tipo === 'professor') {
        scene.registry.set('dialogoProfessorIndex', dialogoIndex + 1);
      } else if (tipo === 'professor2') {
        scene.registry.set('dialogoProfessor2Index', dialogoIndex + 1);
      } else if (tipo === 'professor3') {
        scene.registry.set('dialogoProfessor3Index', dialogoIndex + 1);
      } else {
        scene.registry.set('dialogoProfessor4Index', dialogoIndex + 1);
      }
    } else {
      // Finaliza o diálogo
      textoDialogo.setVisible(false);
      caixaDialogo.setVisible(false);
      sombra.setVisible(false);
      personagem.setVisible(false);
      npc1Image.setVisible(false);
      professorImage.setVisible(false);
      professor2Image.setVisible(false);
      professor3Image.setVisible(false);
      professor4Image.setVisible(false);
      
      if (tipo === 'faxineiro') {
        dialogoIniciado = false;
        dialogoNpc1Concluido = true;
        scene.registry.set('dialogoNpc1Concluido', true);
        window.dialogoNpc1Concluido = true; // Exposição explícita para o HTML
        scene.registry.set('dialogoFaxineiroIndex', 0);
        
        // Atualizar missões ao concluir o diálogo com o faxineiro
        if (typeof window.updateMissions === 'function') {
          window.updateMissions();
        }
      } else if (tipo === 'professor') {
        dialogoProfessorIniciado = false;
        dialogoProfessorConcluido = true;
        scene.registry.set('dialogoProfessorIndex', 0);
        
        // Mostrar botão de ajuda após o diálogo com a professora
        const gameWidth = scene.cameras.main.width;
        const gameHeight = scene.cameras.main.height;
        const centerX = gameWidth / 2;
        const centerY = gameHeight / 2;

        // Atualizar posição do botão para o centro exato da tela
        helpButton.setPosition(centerX, centerY);
        helpButton.setStyle({
          fontSize: '32px',
          backgroundColor: '#ff4500',
          padding: { x: 30, y: 20 },
          fixedWidth: 300
        });
        helpButton.setVisible(true);
        
        console.log("Botão centralizado em:", centerX, centerY);
      } else if (tipo === 'professor2') {
        dialogoProfessor2Iniciado = false;
        dialogoProfessor2Concluido = true;
        scene.registry.set('dialogoProfessor2Index', 0);
        
        // Mostrar botão de ajuda após o diálogo com o professor2
        const gameWidth = scene.cameras.main.width;
        const gameHeight = scene.cameras.main.height;
        const centerX = gameWidth / 2;
        const centerY = gameHeight / 2;

        // Atualizar posição do botão para o centro exato da tela
        helpButton.setPosition(centerX, centerY);
        helpButton.setStyle({
          fontSize: '32px',
          backgroundColor: '#ff4500',
          padding: { x: 30, y: 20 },
          fixedWidth: 350,
          align: 'center'
        });
        helpButton.setText("Ajudar Professor 2");
        helpButton.setVisible(true);
        
        console.log("Botão para o professor 2 centralizado em:", centerX, centerY);
      } else if (tipo === 'professor3') {
        dialogoProfessor3Iniciado = false;
        dialogoProfessor3Concluido = true;
        scene.registry.set('dialogoProfessor3Index', 0);
        
        // Mostrar botão de ajuda após o diálogo com o professor3
        const gameWidth = scene.cameras.main.width;
        const gameHeight = scene.cameras.main.height;
        const centerX = gameWidth / 2;
        const centerY = gameHeight / 2;

        // Atualizar posição do botão para o centro exato da tela
        helpButton.setPosition(centerX, centerY);
        helpButton.setStyle({
          fontSize: '32px',
          backgroundColor: '#ff4500',
          padding: { x: 30, y: 20 },
          fixedWidth: 350,
          align: 'center'
        });
        helpButton.setText("Ajudar Professor 3");
        helpButton.setVisible(true);
        
        console.log("Botão para o professor 3 centralizado em:", centerX, centerY);
      } else if (tipo === 'professor4') {
        dialogoProfessor4Iniciado = false;
        dialogoProfessor4Concluido = true;
        scene.registry.set('dialogoProfessor4Index', 0);
        
        // Mostrar botão de ajuda após o diálogo com o professor4
        const gameWidth = scene.cameras.main.width;
        const gameHeight = scene.cameras.main.height;
        const centerX = gameWidth / 2;
        const centerY = gameHeight / 2;

        // Atualizar posição do botão para o centro exato da tela
        helpButton.setPosition(centerX, centerY);
        helpButton.setStyle({
          fontSize: '32px',
          backgroundColor: '#ff4500',
          padding: { x: 30, y: 20 },
          fixedWidth: 350,
          align: 'center'
        });
        helpButton.setText("Ajudar Professor 4");
        currentProfessor = 'professor4'; // Define o professor atual
        helpButton.setVisible(true);
        
        console.log("Botão para o professor 4 centralizado em:", centerX, centerY);
      }
      
      console.log(`Diálogo com ${tipo} concluído`);
      
      if (scene.falaTimer) scene.falaTimer.remove();
      if (scene.typingTimer) scene.typingTimer.remove();
    }
  }

  // Antes do trecho de criação da porta, adicione a animação da porta abrindo

  // Criação da porta (já existente no seu código)
  door1 = this.physics.add.sprite(80, 345, "door1", 0);
  door1.setScale(1.2);
  door1.setCollideWorldBounds(true);
  door1.setImmovable(true);
  door1.body.setSize(20, 10);
  door1.body.setOffset(6, 50);
  this.doorCollider = this.physics.add.collider(player, door1, null, null, this);

  door2 = this.physics.add.sprite(1200, 345, "door2", 0);
  door2.setScale(1.2);
  door2.setCollideWorldBounds(true);
  door2.setImmovable(true);
  door2.body.setSize(20, 10);
  door2.body.setOffset(6, 50);

  // Adicione colisão entre o jogador e a porta
  this.physics.add.collider(player, door1);
  // Adicionar colisão entre o jogador e a segunda porta
  this.physics.add.collider(player, door2);

  // Criação da mensagem para a porta
  doorMessage = this.add.text(0, 0, "Preciso falar com o faxineiro primeiro!", {
    fontFamily: "Arial",
    fontSize: "16px",
    color: "#FFFFFF",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: { left: 10, right: 10, top: 5, bottom: 5 },
  });
  doorMessage.setOrigin(0.5);
  doorMessage.setScrollFactor(0);  // Fixa na câmera
  doorMessage.setVisible(false);

  // Adicione o listener para a tecla espaço após a criação dos outros event listeners
  this.input.keyboard.on("keydown-SPACE", () => {
    // Verificar se o jogador está próximo da porta
    let distanceToDoor = Phaser.Math.Distance.Between(player.x, player.y, door1.x, door1.y);
    
    if (distanceToDoor < 50) {
      canInteractWithDoor = true;
      
      // Se a porta já estiver aberta, não fazemos nada
      if (isDoorOpen) {
        return;
      }
      
      // Verificar se o diálogo com o faxineiro foi concluído
      if (dialogoNpc1Concluido) {
        // Abrir a porta
        isDoorOpen = true;
        
        // Tocar a animação de abertura
        door1.anims.play('doorOpening');
        
        // Quando a animação terminar, desativar a colisão
        door1.once('animationcomplete', () => {
          door1.body.enable = false;
          doorMessage.setVisible(false);
        });
        
      } else {
        // Mostrar mensagem por 2 segundos
        doorMessage.setText("Preciso falar com o faxineiro primeiro!");
        doorMessage.setPosition(
          this.cameras.main.worldView.x + this.cameras.main.width / 2,
          this.cameras.main.worldView.y + this.cameras.main.height / 2 - 100
        );
        doorMessage.setVisible(true);
        
        // Configurar timer para esconder a mensagem
        this.time.delayedCall(2000, () => {
          doorMessage.setVisible(false);
        });
      }
    } else {
      canInteractWithDoor = false;
    }
  });

  // Configuração de camadas de profundidade (depth)
  const DEPTHS = {
    BACKGROUND: 0,
    WORLD: 10,
    PLAYER: 14,      // Player agora fica abaixo dos NPCs
    NPCS: 15,        // NPCs acima do player
    DOOR: 16,        // Primeira porta acima de tudo
    DOOR2: 13,       // Segunda porta abaixo do player
    UI: 50,
    DIALOG: 100
  };

  // Após criar todos os elementos do diálogo, aplique as profundidades
  caixaDialogo.setDepth(DEPTHS.DIALOG);
  sombra.setDepth(DEPTHS.DIALOG - 1);
  personagem.setDepth(DEPTHS.DIALOG + 1);
  npc1Image.setDepth(DEPTHS.DIALOG + 1);
  professorImage.setDepth(DEPTHS.DIALOG + 1);
  professor2Image.setDepth(DEPTHS.DIALOG + 1);
  professor3Image.setDepth(DEPTHS.DIALOG + 1);
  professor4Image.setDepth(DEPTHS.DIALOG + 1);
  textoDialogo.setDepth(DEPTHS.DIALOG + 2);
  
  // Defina a profundidade para mensagens e avisos
  doorMessage.setDepth(DEPTHS.UI);
  avisoTexto.setDepth(DEPTHS.UI);
  
  // Defina a profundidade para personagens
  player.setDepth(DEPTHS.PLAYER);
  npc1.setDepth(DEPTHS.NPCS);
  professorNpc.setDepth(DEPTHS.NPCS);
  professorNpc2.setDepth(DEPTHS.NPCS);
  professorNpc3.setDepth(DEPTHS.NPCS);
  professorNpc4.setDepth(DEPTHS.NPCS);

  // Após a criação da porta existente, adicione:
  door1.setDepth(DEPTHS.DOOR);
  door2.setDepth(DEPTHS.DOOR2);

  // Modifique o listener de espaço para corrigir a duplicação de frames
  this.input.keyboard.on("keydown-SPACE", () => {
    // Verificar se o jogador está próximo da porta
    let distanceToDoor = Phaser.Math.Distance.Between(player.x, player.y, door1.x, door1.y);
    
    if (distanceToDoor < 50) {
      canInteractWithDoor = true;
      
      // Se a porta já estiver aberta, não fazemos nada
      if (isDoorOpen) {
        return;
      }
      
      // Verificar se o diálogo com o faxineiro foi concluído
      if (dialogoNpc1Concluido) {
        // Abrir a porta
        isDoorOpen = true;
        
        // Limpar qualquer animação anterior que possa estar tocando
        door1.anims.stop();
        
        // Resetar para o frame inicial antes de iniciar a animação
        door1.setFrame(0);
        
        // Tocar a animação de abertura
        door1.play('doorOpening');
        
        // Quando a animação terminar, desativar a colisão e garantir o frame correto
        door1.once('animationcomplete', () => {
          door1.anims.stop();
          door1.setFrame(4); // Garantir que esteja no frame final
          door1.body.enable = false;
          doorMessage.setVisible(false);
        });
        
      } else {
        // Mostrar mensagem por 2 segundos
        doorMessage.setText("Preciso falar com o faxineiro primeiro!");
        doorMessage.setPosition(
          this.cameras.main.worldView.x + this.cameras.main.width / 2,
          this.cameras.main.worldView.y + this.cameras.main.height / 2 - 100
        );
        doorMessage.setVisible(true);
        
        // Configurar timer para esconder a mensagem
        this.time.delayedCall(2000, () => {
          doorMessage.setVisible(false);
        });
      }
    } else {
      canInteractWithDoor = false;
    }
  });

  // Certifique-se de que a seção de criação da porta apareça apenas UNA VEZ:
  if (!this.doorCreated) {
    // Crie a animação (definindo frames de 0 a 4)
    this.anims.create({
      key: 'doorOpening',
      frames: [
        { key: 'door1', frame: 0 },
        { key: 'door1', frame: 1 },
        { key: 'door1', frame: 2 },
        { key: 'door1', frame: 3 },
        { key: 'door1', frame: 4 }
      ],
      frameRate: 5,
      repeat: 0
    });

    // Criação única da porta
    door1 = this.physics.add.sprite(80, 345, "door1", 0);
    door1.setScale(1.2);
    door1.setCollideWorldBounds(true);
    door1.setImmovable(true);
    door1.body.setSize(20, 10);
    door1.body.setOffset(6, 50);
    door1.setDepth(DEPTHS.DOOR);

    // Remova listeners antigos para SPACE e adicione somente este
    this.input.keyboard.removeAllListeners('keydown-SPACE');
    this.input.keyboard.on("keydown-SPACE", () => {
      let distanceToDoor = Phaser.Math.Distance.Between(player.x, player.y, door1.x, door1.y);
      if (distanceToDoor < 50) {
        canInteractWithDoor = true;
        if (isDoorOpen) return;
        if (dialogoNpc1Concluido) {
          isDoorOpen = true;
          
          // Tornar invisível a porta original criada no início
          // Isso encontra todas as instâncias de door1 no jogo e torna invisíveis
          this.children.list.forEach(child => {
            if (child.texture && child.texture.key === 'door1' && child !== door1) {
              console.log("Porta adicional encontrada e escondida");
              child.setVisible(false);
            }
          });
          
          door1.anims.stop();
          door1.setFrame(0);
          door1.play('doorOpening');
          door1.once('animationcomplete', () => {
            door1.anims.stop();
            door1.setFrame(4); // Último frame fixo
            door1.body.enable = false;
            doorMessage.setVisible(false);
          });
        } else {
          doorMessage.setText("Preciso falar com o faxineiro primeiro!");
          doorMessage.setPosition(
            this.cameras.main.worldView.x + this.cameras.main.width / 2,
            this.cameras.main.worldView.y + this.cameras.main.height / 2 - 100
          );
          doorMessage.setVisible(true);
          this.time.delayedCall(2000, () => doorMessage.setVisible(false));
        }
      } else {
        canInteractWithDoor = false;
      }
    });
    this.doorCreated = true;
  }

  // Crie o botão de ajuda (inicialmente invisível)
  helpButton = this.add.text(
    this.cameras.main.width / 2,
    this.cameras.main.height / 2 + 50,
    "Ajudar Professora",
    {
      fontFamily: "Press Start 2P", // Fonte pixelizada
      fontSize: "16px",
      color: "#FFFFFF",
      backgroundColor: "#4a6eb5",
      padding: { left: 25, right: 25, top: 15, bottom: 15 },
      align: "center",
      shadow: {
        offsetX: 3,
        offsetY: 3,
        color: '#2a4e95',
        blur: 0,
        fill: true
      }
    }
  )
  .setOrigin(0.5)
  .setScrollFactor(0)
  .setInteractive({ useHandCursor: true })
  .on('pointerover', () => {
    helpButton.setStyle({
      backgroundColor: '#5a7ec5',
      shadow: { color: '#3a5ea5' }
    });
  })
  .on('pointerout', () => {
    helpButton.setStyle({
      backgroundColor: '#4a6eb5',
      shadow: { color: '#2a4e95' }
    });
  })
  .on('pointerdown', () => {
    console.log("Iniciando minigame da professora");
    startMinigame(this);
  })
  .setVisible(false); // Começa invisível

  // Certifique-se de que o botão tenha prioridade de exibição alta
  helpButton.setDepth(9999); // Maior que qualquer outra coisa na tela
  
  console.log("Botão de ajuda criado:", helpButton);

  // Após configurar a câmera, adicionar o keycard UI
  this.cameras.main.setZoom(1.5);

  // Criar o ícone do keycard
  keycardIcon = this.add.image(50, 50, 'keycard')
    .setScrollFactor(0)
    .setDepth(9999)
    .setScale(0.15); // Ajuste a escala conforme necessário

  // Criar o texto do contador
  keycardText = this.add.text(80, 45, '0/4', {
    fontFamily: 'Arial',
    fontSize: '20px',
    color: '#FFFFFF',
    stroke: '#000000',
    strokeThickness: 2,
    padding: { x: 5, y: 5 }
  })
  .setScrollFactor(0)
  .setDepth(9999);

  // Create UI elements BEFORE any other game elements
  const uiConfig = {
    x: 20,
    y: 20,
    depth: 10000,  // Highest depth to ensure visibility
    scale: {
      icon: 0.12,
      text: 1
    }
  };

  // Create a UI container that's fixed to the camera
  const uiContainer = this.add.container(0, 0)
    .setScrollFactor(0)
    .setDepth(uiConfig.depth);
  uiContainer.setPosition(this.cameras.main.width - 180, 10);

  // Create keycard icon with absolute positioning
  keycardIcon = this.add.image(uiConfig.x, uiConfig.y, 'keycard')
    .setOrigin(0, 0)
    .setScale(uiConfig.scale.icon)
    .setScrollFactor(0)
    .setDepth(uiConfig.depth);

  // Create counter text with absolute positioning and improved visibility
  keycardText = this.add.text(uiConfig.x + 40, uiConfig.y + 5, '0/4', {
    fontFamily: 'Arial Black',
    fontSize: '24px',
    color: '#ffffff',
    stroke: '#000000',
    strokeThickness: 4,
    padding: { x: 4, y: 4 },
    shadow: {
      offsetX: 2,
      offsetY: 2,
      color: '#000000',
      blur: 4,
      stroke: true,
      fill: true
    }
  })
  .setOrigin(0, 0)
  .setScrollFactor(0)
  .setDepth(uiConfig.depth);

  // Add both elements to the container
  uiContainer.add([keycardIcon, keycardText]);

  // Force visibility
  keycardIcon.setVisible(true);
  keycardText.setVisible(true);
  uiContainer.setVisible(true);

  // Debug logging
  console.log('UI Elements Created:', {
    icon: {
      visible: keycardIcon.visible,
      x: keycardIcon.x,
      y: keycardIcon.y,
      depth: keycardIcon.depth
    },
    text: {
      visible: keycardText.visible,
      x: keycardText.x,
      y: keycardText.y,
      depth: keycardText.depth,
      content: keycardText.text
    }
  });

  // Add collisions with all NPCs
  this.physics.add.collider(player, npc1);
  this.physics.add.collider(player, professorNpc);
  this.physics.add.collider(player, professorNpc2);
  this.physics.add.collider(player, professorNpc3);
  this.physics.add.collider(player, professorNpc4);

  // Make sure all NPCs are immovable
  npc1.setImmovable(true);
  professorNpc.setImmovable(true);
  professorNpc2.setImmovable(true);
  professorNpc3.setImmovable(true);
  professorNpc4.setImmovable(true);

  // Adjust collision boxes for better precision
  npc1.body.setSize(40, 20); // Adjust these numbers as needed
  npc1.body.setOffset(28, 75); // Adjust these numbers as needed

  professorNpc.body.setSize(20, 20);
  professorNpc.body.setOffset(38, 75);

  professorNpc2.body.setSize(20, 20);
  professorNpc2.body.setOffset(38, 75);

  professorNpc3.body.setSize(20, 20);
  professorNpc3.body.setOffset(38, 75);

  professorNpc4.body.setSize(20, 20);
  professorNpc4.body.setOffset(38, 75);

  // Enable debug mode for collisions (optional, remove in production)
  this.physics.world.createDebugGraphic();

  // Iniciar o tutorial de forma automática quando o jogo começar
  this.time.delayedCall(1000, () => {
    showTutorial(this);
  }, [], this);

  // SUBSTITUIR COMPLETAMENTE o código da criação da porta
  if (!this.doorFixed) {
    console.log("===== IMPLEMENTANDO CORREÇÃO DEFINITIVA DA PORTA =====");
    
    // 1. Destruir todas as portas existentes para ter certeza que não há duplicatas
    this.children.getChildren().forEach(child => {
      if (child.texture && child.texture.key === 'door1') {
        console.log("Destruindo porta pré-existente");
        if (child.body) child.body.enable = false;
        child.destroy();
      }
    });

    // 2. Verificar e remover qualquer colisor existente relacionado à porta
    if (this.physics.world && this.physics.world.colliders) {
      this.physics.world.colliders.getActive().forEach(collider => {
        // Checar por colisores que possam estar relacionados à porta
        if (collider.name && collider.name.includes('door')) {
          console.log("Removendo colisor pré-existente da porta");
          collider.destroy();
        }
      });
    }

    // 3. Criar animação da porta apenas uma vez
    if (!this.anims.exists('doorOpeningFixed')) {
      this.anims.create({
        key: 'doorOpeningFixed',
        frames: [
          { key: 'door1', frame: 0 },
          { key: 'door1', frame: 1 },
          { key: 'door1', frame: 2 },
          { key: 'door1', frame: 3 },
          { key: 'door1', frame: 4 },
        ],
        frameRate: 6,
        repeat: 0
      });
    }

    // 4. Criar a porta com um nome exclusivo para facilitar referência
    door1 = this.physics.add.sprite(80, 345, 'door1', 0);
    door1.name = 'doorFixed';
    door1.setScale(1.2);
    door1.setOrigin(0.5, 0.5);
    door1.setImmovable(true);
    door1.body.setSize(20, 10);
    door1.body.setOffset(6, 50);
    door1.setDepth(DEPTHS.DOOR);

    // 5. Criar o colisor com um nome específico e armazenar a referência
    this.doorColliderFixed = this.physics.add.collider(
      player, 
      door1, 
      null, 
      null, 
      this
    );
    this.doorColliderFixed.name = 'doorColliderFixed';
    
    // 6. Remover todos os listeners anteriores para evitar duplicação
    this.input.keyboard.removeAllListeners('keydown-SPACE');
    
    // 7. Adicionar um novo listener dedicado apenas para a porta
    this.input.keyboard.on('keydown-SPACE', () => {
      if (dialogoIniciado || dialogoProfessorIniciado || minigameActive) return;
      
      // Verificar proximidade com a porta
      const distanceToDoor = Phaser.Math.Distance.Between(
        player.x, player.y, 
        door1.x, door1.y
      );
      
      if (distanceToDoor < 60) {
        console.log("Jogador próximo à porta. Estado:", isDoorOpen ? "Aberta" : "Fechada");
        
        if (isDoorOpen) {
          console.log("Porta já está aberta.");
          return;
        }
        
        if (dialogoNpc1Concluido) {
          console.log("Abrindo porta - condição atendida");
          isDoorOpen = true;
          
          // Reproduzir animação
          door1.anims.play('doorOpeningFixed');
          
          // Quando a animação terminar, DESTRUIR a porta completamente
          door1.once('animationcomplete', () => {
            console.log("Animação completa - removendo porta COMPLETAMENTE");
            
            // Destruir o colisor explicitamente
            if (this.doorColliderFixed) {
              this.doorColliderFixed.destroy();
              this.doorColliderFixed = null;
              console.log("Colisor da porta removido");
            }
            
            // Verificar qualquer colisor adicional
            this.physics.world.colliders.getActive().forEach(collider => {
              if (collider.object1 === door1 || collider.object2 === door1) {
                collider.destroy();
                console.log("Colisor adicional encontrado e removido");
              }
            });
            
            // Parar e configurar último frame
            door1.anims.stop();
            door1.setFrame(4);
            
            // Desativar o corpo físico
            if (door1.body) {
              door1.body.enable = false;
              door1.body.checkCollision.none = true;
              console.log("Corpo físico da porta desativado");
            }
            
            // Criar uma nova porta decorativa sem física (apenas visual)
            const doorDecoration = this.add.image(door1.x, door1.y, 'door1', 4);
            doorDecoration.setScale(1.2);
            doorDecoration.setOrigin(0.5, 0.5);
            doorDecoration.setDepth(DEPTHS.DOOR - 1); // Atrás de tudo
            
            // Destruir a porta original completamente
            door1.destroy();
            console.log("Porta original destruída e substituída por decoração");
          });
        } else {
          console.log("Tentando abrir porta - condição não atendida");
          doorMessage.setText("Preciso falar com o faxineiro primeiro!");
          doorMessage.setPosition(
            this.cameras.main.worldView.x + this.cameras.main.width / 2,
            this.cameras.main.worldView.y + this.cameras.main.height / 2 - 100
          );
          doorMessage.setVisible(true);
          
          this.time.delayedCall(2000, () => {
            doorMessage.setVisible(false);
          });
        }
      }
    });
    
    // Marcar que esta correção já foi aplicada
    this.doorFixed = true;
    console.log("===== CORREÇÃO DA PORTA IMPLEMENTADA =====");
  }
}

// Função para iniciar o minigame (chamada quando o botão é clicado)
function startMinigame(scene, professorId = 'professor1') {
  currentProfessor = professorId; // Armazene qual professor está sendo ajudado
  helpButton.setVisible(false);
  minigameActive = true;
  
  // Salvar o estado do jogo atual, se necessário
  // ...
  
  // Iniciar o minigame importando o script de minigame.js
  try {
    // Verifica se o minigame já foi carregado
    if (typeof initMinigame === 'function') {
      initMinigame(scene, professorId, (success) => {
        minigameActive = false; // Desativar estado quando minigame terminar
        if (success) {
          // Atualizar o contador HTML em vez do contador do Phaser
          keycardCount++;
          window.keycardCount = keycardCount; // Exposição explícita para o HTML
          const counterElement = document.getElementById('keycard-counter');
          if (counterElement) {
            counterElement.textContent = `${keycardCount}/4`;
            
            // Efeito visual para o ícone HTML
            const iconElement = document.getElementById('keycard-icon');
            if (iconElement) {
              iconElement.style.transition = 'transform 0.2s ease-in-out';
              iconElement.style.transform = 'scale(1.3)';
              setTimeout(() => {
                iconElement.style.transform = 'scale(1)';
              }, 200);
            }
            
            // Verificar se o jogador coletou todos os 4 keycards
            if (keycardCount >= 4 && !isDoor2Open) {
              openDoor2(scene);
            }
            
            // Atualizar o painel de missões
            if (typeof window.updateMissions === 'function') {
              window.updateMissions();
            }
          }
        }
        helpButton.setVisible(!success);
      });
    } else {
      console.error("Função initMinigame não encontrada. Verifique se minigame.js está carregado corretamente.");
      // Carregar o script dinamicamente se não estiver carregado
      const script = document.createElement('script');
      script.src = 'minigame.js';
      script.onload = () => {
        if (typeof initMinigame === 'function') {
          initMinigame(scene, professorId, () => {
            minigameActive = false; // Desativar estado quando minigame terminar
            helpButton.setVisible(true);
          });
        }
      };
      document.head.appendChild(script);
    }
  } catch (error) {
    console.error("Erro ao iniciar o minigame:", error);
    helpButton.setVisible(true);
    minigameActive = false; // Garantir que desative em caso de erro
  }
}

// Adicionar esta nova função para abrir a door2
function openDoor2(scene) {
  // Marcar a porta como aberta
  isDoor2Open = true;
  window.isDoor2Open = true; // Exposição explícita para o HTML
  
  // Verificar se a door2 existe
  if (!door2) {
    console.error("door2 não foi encontrada");
    return;
  }
  
  // Limpar qualquer animação anterior que possa estar tocando
  door2.anims.stop();
  
  // Resetar para o frame inicial antes de iniciar a animação
  door2.setFrame(0);
  
  // Tocar a animação de abertura
  door2.play('doorOpening');
  
  // Quando a animação terminar, desativar a colisão
  door2.once('animationcomplete', () => {
    door2.anims.stop();
    door2.setFrame(4); // Garantir que esteja no frame final
    door2.body.enable = false; // Desativar a colisão para permitir passagem
    
    // Mostrar mensagem informando que a porta foi aberta
    showDoor2OpenMessage(scene);
    
    // Atualizar o painel de missões quando a porta for aberta
    if (typeof window.updateMissions === 'function') {
      window.updateMissions();
    }
  });
}

// Função para mostrar mensagem quando a porta for aberta
function showDoor2OpenMessage(scene) {
  // Se já existe uma mensagem, não criar outra
  if (door2OpenMessage) return;
  
  // Posicionar no centro da tela
  const cameraWidth = scene.cameras.main.width;
  const cameraHeight = scene.cameras.main.height;
  
  // Criar mensagem informando que a porta foi aberta
  door2OpenMessage = scene.add.text(
    cameraWidth / 2,
    cameraHeight / 2 - 100,
    "A porta secundária foi desbloqueada!\nVocê coletou todos os keycards!",
    {
      fontFamily: "Arial",
      fontSize: "20px",
      color: "#FFFFFF",
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      padding: { left: 20, right: 20, top: 15, bottom: 15 },
      align: 'center'
    }
  );
  door2OpenMessage.setOrigin(0.5);
  door2OpenMessage.setScrollFactor(0);
  door2OpenMessage.setDepth(100);
  
  // Adicionar efeito de aparecimento suave
  door2OpenMessage.setAlpha(0);
  scene.tweens.add({
    targets: door2OpenMessage,
    alpha: 1,
    duration: 500,
    ease: 'Power2'
  });
  
  // Remover a mensagem após 4 segundos
  scene.time.delayedCall(4000, () => {
    if (door2OpenMessage) {
      scene.tweens.add({
        targets: door2OpenMessage,
        alpha: 0,
        duration: 500,
        ease: 'Power2',
        onComplete: () => {
          door2OpenMessage.destroy();
          door2OpenMessage = null;
        }
      });
    }
  });
}

// Função para coletar a chave
function collectKey(player, key) {
  keyCollected = true;
  window.keyCollected = true; // Exposição explícita para o HTML
  collectedKey = key;
  window.collectedKey = {}; // Apenas para sinalizar que existe
  key.setDepth(1);
  key.body.setEnable(false);
  
  // Atualizar o contador HTML da chave
  const keyCounter = document.getElementById('key-counter');
  if (keyCounter) {
      keyCounter.textContent = '1/1';
      
      // Adicionar efeito visual
      const keyIcon = document.getElementById('key-icon');
      if (keyIcon) {
          keyIcon.style.transition = 'transform 0.2s ease-in-out';
          keyIcon.style.transform = 'scale(1.3)';
          setTimeout(() => {
              keyIcon.style.transform = 'scale(1)';
          }, 200);
      }
  }
  
  // Atualizar as missões quando a chave for coletada
  if (typeof window.updateMissions === 'function') {
    window.updateMissions();
  }
}

// Função para atualizar a cena principal do jogo
function updateMain() {
  // Se o tutorial estiver ativo, não prosseguir com o resto da lógica de atualização
  if (tutorialActive) {
    player.setVelocity(0);
    return;
  }

  // Redefinir a variável podeIniciarDialogo para false no início de cada frame
  podeIniciarDialogo = false;
  
  // Verificar a sobreposição com o NPC1 em cada frame
  let distanceToNpc1 = Phaser.Math.Distance.Between(player.x, player.y, npc1.x, npc1.y);
  let distanceToProfessor = Phaser.Math.Distance.Between(player.x, player.y, professorNpc.x, professorNpc.y);
  let distanceToProfessor2 = Phaser.Math.Distance.Between(player.x, player.y, professorNpc2.x, professorNpc2.y);
  let distanceToProfessor3 = Phaser.Math.Distance.Between(player.x, player.y, professorNpc3.x, professorNpc3.y);
  let distanceToProfessor4 = Phaser.Math.Distance.Between(player.x, player.y, professorNpc4.x, professorNpc4.y);
  
  // Verifica proximidade com o faxineiro
  if (distanceToNpc1 < 70 && !dialogoNpc1Concluido) {
    podeIniciarDialogo = true;
    if (!dialogoIniciado) {
      avisoTexto.setPosition(npc1.x, npc1.y - 10);
      avisoTexto.setVisible(true);
    }
  } 
  // Verifica proximidade com o professor
  else if (distanceToProfessor < 70 && !dialogoProfessorConcluido) {
    podeIniciarDialogo = true;
    if (!dialogoProfessorIniciado) {
      avisoTexto.setPosition(professorNpc.x, professorNpc.y - 10);
      avisoTexto.setVisible(true);
    }
  }
  // Verifica proximidade com o professor2
  else if (distanceToProfessor2 < 70 && !dialogoProfessor2Concluido) {
    podeIniciarDialogo = true;
    if (!dialogoProfessor2Iniciado) {
      avisoTexto.setPosition(professorNpc2.x, professorNpc2.y - 10);
      avisoTexto.setVisible(true);
    }
  }
  // Verifica proximidade com o professor3
  else if (distanceToProfessor3 < 70 && !dialogoProfessor3Concluido) {
    podeIniciarDialogo = true;
    if (!dialogoProfessor3Iniciado) {
      avisoTexto.setPosition(professorNpc3.x, professorNpc3.y - 10);
      avisoTexto.setVisible(true);
    }
  }
  // Verifica proximidade com o professor4
  else if (distanceToProfessor4 < 70 && !dialogoProfessor4Concluido) {
    podeIniciarDialogo = true;
    if (!dialogoProfessor4Iniciado) {
      avisoTexto.setPosition(professorNpc4.x, professorNpc4.y - 10);
      avisoTexto.setVisible(true);
    }
  }
  else {
    podeIniciarDialogo = false;
    if (!dialogoIniciado && !dialogoProfessorIniciado && !dialogoProfessor2Iniciado && !dialogoProfessor3Iniciado && !dialogoProfessor4Iniciado) {
      avisoTexto.setVisible(false);
    }
  }
  
  // Se a chave foi coletada, faz com que ela siga o jogador
  if (collectedKey) {
    collectedKey.x = Phaser.Math.Linear(collectedKey.x, player.x, 0.1);
    collectedKey.y = Phaser.Math.Linear(collectedKey.y, player.y - 20, 0.1);
  }

  // Bloquear movimento durante diálogo OU minigame
  if (dialogoIniciado || dialogoProfessorIniciado || dialogoProfessor2Iniciado || dialogoProfessor3Iniciado || dialogoProfessor4Iniciado || minigameActive || helpButton.visible) {
    player.setFrame(0);
    player.setVelocity(0);
    return;
  }


  // Verificar proximidade com a porta
  let distanceToDoor = Phaser.Math.Distance.Between(player.x, player.y, door1.x, door1.y);
  
  if (distanceToDoor < 50 && !isDoorOpen) {
    // Se não estamos em diálogo e não há aviso de interação com NPCs
    if (!dialogoIniciado && !dialogoProfessorIniciado && !dialogoProfessor2Iniciado && !dialogoProfessor3Iniciado && !dialogoProfessor4Iniciado && !avisoTexto.visible) {
      avisoTexto.setText("Aperte (Espaço) para interagir");
      avisoTexto.setPosition(door1.x, door1.y - 10);
      avisoTexto.setVisible(true);
    }
  } else {
    if (!dialogoIniciado && !dialogoProfessorIniciado && !dialogoProfessor2Iniciado && !dialogoProfessor3Iniciado && !dialogoProfessor4Iniciado) {
      avisoTexto.setVisible(false);
    }
  }

  // Verificar se a door2 deve ser aberta (keycard count = 4)
  if (keycardCount >= 4 && !isDoor2Open) {
    openDoor2(this);
  }

  // Resto do código continua igual...
  player.setVelocity(0);

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

  // Substituir o código de movimento por este mais simples
  const speed = 160;
  let velocityX = 0;
  let velocityY = 0;

  // Priorizar movimento horizontal sobre o vertical
  if (leftPressed) {
      velocityX = -speed;
  } else if (rightPressed) {
      velocityX = speed;
  } else if (upPressed) { // Só move vertical se não estiver movendo horizontal
      velocityY = -speed;
  } else if (downPressed) {
      velocityY = speed;
  }

  // Aplicar movimento
  player.setVelocity(velocityX, velocityY);

  // Atualizar animação baseado no movimento
  let newAnimation = null;
  if (velocityX < 0) {
      newAnimation = "walk_side";
      player.setFlipX(true);
      lastDirection = "left";
  } else if (velocityX > 0) {
      newAnimation = "walk_side";
      player.setFlipX(false);
      lastDirection = "right";
  } else if (velocityY < 0) {
      newAnimation = "walk_up";
      lastDirection = "up";
  } else if (velocityY > 0) {
      newAnimation = "walk_down";
      lastDirection = "down";
  } else {
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

  if (newAnimation && newAnimation !== currentAnimation) {
      player.anims.play(newAnimation, true);
      currentAnimation = newAnimation;
  }

  // Atualizando a posição do nome do jogador - VERSÃO CORRIGIDA
  if (player && player.nameContainer) {
    // Atualiza o container para seguir a posição do jogador
    player.nameContainer.setPosition(player.x, player.y - 25); // Também ajustado aqui (de -35 para -25)
  }
  
  // REMOVA OU COMENTE a seção antiga que tentava atualizar player.nameTag
  // Se houver um nameTag associado ao jogador, atualize sua posição
  // if (player.nameTag) {
  //   player.nameTag.setPosition(player.x, player.y - 27);
  // }

  // Verificar se um campo de entrada está em foco antes de processar movimento
  if (window.inputActive) {
    // Se um campo de entrada estiver em foco, desabilitar movimento
    player.setVelocity(0);
    return; // Saia da função para não processar movimento
  }

  // Atualizar estado das missões se a função global existir
  if (typeof window.updateMissions === 'function') {
    window.updateMissions();
  }
}

// Adicione esta nova função para mostrar o tutorial
function showTutorial(scene) {
  // Não mostrar o tutorial se o jogo já estiver em algum estado ativo
  if (dialogoIniciado || dialogoProfessorIniciado || minigameActive) return;
  
  tutorialActive = true;
  tutorialSlide = 0;
  tutorialElements = [];
  
  // Conteúdo dos slides do tutorial (título e texto)
  const tutorialContent = [
    {
      title: "DATA QUEST - FASE 1",
      text: "Neste jogo, você vai aprender sobre proteção de dados\ne ajudar a salvar sua escola de um ataque hacker.\nVamos começar com os controles básicos!",
    },
    {
      title: "Como se Movimentar",
      text: "Use as teclas W, A, S, D ou as setas direcionais\npara mover seu personagem pela escola.",
    },
    {
      title: "Interagindo com Personagens",
      text: "Pressione a tecla 'E' quando estiver próximo de\num NPC para conversar com ele.",
    },
    {
      title: "Portas e Objetos",
      text: "Pressione a tecla 'ESPAÇO' para interagir\ncom portas e objetos no cenário.",
      image: "tutorial_objects"
    },
    {
      title: "Sua Missão",
      text: "Nesta fase os professores estão sendo controlados por um hacker\nque está tentando roubar dados dos alunos!\nAjude os professores-robôs a recuperar a consciência.\nA cada minigame concluído, você ganha um keycard.",
    },
      {
      title: "Keycard e chave",
      text: "Nessa fase seu objetivo é coletar os 4 keycard pra desbloquear\n a última sala que tem uma chave. Com essa chave,\n você pode entrar no elevador e ir pra próxima fase.",
    }
  ];
  
  // Calcular dimensões baseadas na câmera
  const cameraWidth = scene.cameras.main.width;
  const cameraHeight = scene.cameras.main.height;
  
  // Criar fundo escurecido
  const darkOverlay = scene.add.graphics();
  darkOverlay.fillStyle(0x000000, 0.7);
  darkOverlay.fillRect(0, 0, cameraWidth * 2, cameraHeight * 2); // Dimensão maior para cobrir todo o mapa
  darkOverlay.setScrollFactor(0);
  darkOverlay.setDepth(9000);
  tutorialElements.push(darkOverlay);
  
  // Criar painel do tutorial
  const panelWidth = Math.min(550, cameraWidth * 0.8);
  const panelHeight = Math.min(300, cameraHeight * 0.7);
  const panelX = cameraWidth / 2 - panelWidth / 2;
  const panelY = cameraHeight / 2 - panelHeight / 2;
  
  const panel = scene.add.graphics();
  panel.fillStyle(0x333366, 0.95);
  panel.fillRoundedRect(panelX, panelY, panelWidth, panelHeight, 15);
  panel.lineStyle(4, 0xffffff, 1);
  panel.strokeRoundedRect(panelX, panelY, panelWidth, panelHeight, 15);
  panel.setScrollFactor(0);
  panel.setDepth(9001);
  tutorialElements.push(panel);
  
  // Adicionar título do slide
  const titleText = scene.add.text(
    cameraWidth / 2, 
    panelY + 40, 
    tutorialContent[0].title,
    {
      fontFamily: 'Arial',
      fontSize: '28px',
      color: '#ffffff',
      fontStyle: 'bold',
      align: 'center'
    }
  );
  titleText.setOrigin(0.5);
  titleText.setScrollFactor(0);
  titleText.setDepth(9002);
  tutorialElements.push(titleText);
  
  // Adicionar conteúdo do slide
  const contentText = scene.add.text(
    cameraWidth / 2, 
    cameraHeight / 2, 
    tutorialContent[0].text,
    {
      fontFamily: 'Arial',
      fontSize: '18px',
      color: '#ffffff',
      align: 'center',
      lineSpacing: 10
    }
  );
  contentText.setOrigin(0.5, 0.5);
  contentText.setScrollFactor(0);
  contentText.setDepth(9002);
  tutorialElements.push(contentText);
  
  // Opcionalmente, pode adicionar imagem ilustrativa
  if (scene.textures.exists(tutorialContent[0].image)) {
    const image = scene.add.image(cameraWidth / 2, cameraHeight / 2 - 40, tutorialContent[0].image);
    image.setScale(0.5); // Ajuste conforme necessário
    image.setScrollFactor(0);
    image.setDepth(9002);
    tutorialElements.push(image);
  }
  
  // Indicador de slides (exemplo: "1/5")
  const slideIndicator = scene.add.text(
    cameraWidth / 2,
    panelY + panelHeight - 30,
    `1/${tutorialContent.length}`,
    {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#ffffff'
    }
  );
  slideIndicator.setOrigin(0.5);
  slideIndicator.setScrollFactor(0);
  slideIndicator.setDepth(9002);
  tutorialElements.push(slideIndicator);
  
  // Botão Anterior
  const prevButton = scene.add.text(
    panelX + 80,
    panelY + panelHeight - 50,
    "< Anterior",
    {
      fontFamily: 'Arial',
      fontSize: '18px',
      color: '#ffffff',
      backgroundColor: '#4a6eb5',
      padding: { left: 15, right: 15, top: 8, bottom: 8 }
    }
  );
  prevButton.setOrigin(0.5);
  prevButton.setScrollFactor(0);
  prevButton.setDepth(9003);
  prevButton.setInteractive({ useHandCursor: true });
  prevButton.on('pointerover', () => {
    prevButton.setStyle({ backgroundColor: '#5a7ec5' });
  });
  prevButton.on('pointerout', () => {
    prevButton.setStyle({ backgroundColor: '#4a6eb5' });
  });
  prevButton.on('pointerdown', () => {
    navigateTutorial(scene, tutorialContent, -1);
  });
  prevButton.setVisible(false); // Inicialmente oculto no primeiro slide
  tutorialElements.push(prevButton);
  
  // Botão Próximo
  const nextButton = scene.add.text(
    panelX + panelWidth - 80,
    panelY + panelHeight - 50,
    "Próximo >",
    {
      fontFamily: 'Arial',
      fontSize: '18px',
      color: '#ffffff',
      backgroundColor: '#4a6eb5',
      padding: { left: 15, right: 15, top: 8, bottom: 8 }
    }
  );
  nextButton.setOrigin(0.5);
  nextButton.setScrollFactor(0);
  nextButton.setDepth(9003);
  nextButton.setInteractive({ useHandCursor: true });
  nextButton.on('pointerover', () => {
    nextButton.setStyle({ backgroundColor: '#5a7ec5' });
  });
  nextButton.on('pointerout', () => {
    nextButton.setStyle({ backgroundColor: '#4a6eb5' });
  });
  nextButton.on('pointerdown', () => {
    navigateTutorial(scene, tutorialContent, 1);
  });
  tutorialElements.push(nextButton);
  
  // Botão Pular/Fechar
  const closeButton = scene.add.text(
    panelX + panelWidth - 20,
    panelY + 20,
    "X",
    {
      fontFamily: 'Arial',
      fontSize: '24px',
      color: '#ffffff',
      padding: { left: 10, right: 10, top: 5, bottom: 5 }
    }
  );
  closeButton.setOrigin(0.5);
  closeButton.setScrollFactor(0);
  closeButton.setDepth(9003);
  closeButton.setInteractive({ useHandCursor: true });
  closeButton.on('pointerover', () => {
    closeButton.setStyle({ color: '#ff4444' });
  });
  closeButton.on('pointerout', () => {
    closeButton.setStyle({ color: '#ffffff' });
  });
  closeButton.on('pointerdown', () => {
    closeTutorial(scene);
  });
  tutorialElements.push(closeButton);
  
  // Adicionar teclas de navegação para passar os slides
  const leftKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
  leftKey.on('down', () => {
    if (tutorialActive) navigateTutorial(scene, tutorialContent, -1);
  });
  
  const rightKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
  rightKey.on('down', () => {
    if (tutorialActive) navigateTutorial(scene, tutorialContent, 1);
  });
  
  const escKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
  escKey.on('down', () => {
    if (tutorialActive) closeTutorial(scene);
  });
  
  // Pausar as animações e movimentos do jogador durante o tutorial
  if (player) player.setVelocity(0);
}

// Função para navegar entre os slides do tutorial
function navigateTutorial(scene, content, direction) {
  const newSlide = tutorialSlide + direction;
  
  // Verificar limites
  if (newSlide < 0 || newSlide >= content.length) return;
  
  tutorialSlide = newSlide;
  
  // Atualizar conteúdo dos elementos
  const title = tutorialElements[2]; // Título é o 3º elemento (índice 2)
  const text = tutorialElements[3]; // Texto é o 4º elemento (índice 3)
  const slideIndicator = tutorialElements[4]; // Indicador de slides é o 5º elemento
  const prevButton = tutorialElements[5]; // Botão anterior é o 6º elemento
  const nextButton = tutorialElements[6]; // Botão próximo é o 7º elemento
  
  title.setText(content[tutorialSlide].title);
  text.setText(content[tutorialSlide].text);
  slideIndicator.setText(`${tutorialSlide + 1}/${content.length}`);
  
  // Mostrar/ocultar botão "Anterior" no primeiro slide
  prevButton.setVisible(tutorialSlide > 0);
  
  // Mudar texto do botão "Próximo" para "Concluir" no último slide
  if (tutorialSlide === content.length - 1) {
    nextButton.setText("Concluir");
    nextButton.removeAllListeners('pointerdown');
    nextButton.on('pointerdown', () => {
      closeTutorial(scene);
    });
  } else {
    nextButton.setText("Próximo >");
    nextButton.removeAllListeners('pointerdown');
    nextButton.on('pointerdown', () => {
      navigateTutorial(scene, content, 1);
    });
  }
  
  // Se tiver imagem, atualizar
  if (tutorialElements.length > 8 && tutorialElements[8].setTexture) {
    if (scene.textures.exists(content[tutorialSlide].image)) {
      tutorialElements[8].setTexture(content[tutorialSlide].image);
      tutorialElements[8].setVisible(true);
    } else {
      tutorialElements[8].setVisible(false);
    }
  }
}

// Função para fechar o tutorial
function closeTutorial(scene) {
  tutorialActive = false;
  
  // Remover todos os elementos do tutorial
  tutorialElements.forEach(element => {
    if (element && element.destroy) element.destroy();
  });
  
  tutorialElements = [];
  
  // Remover ouvintes de teclas especiais (se necessário)
  // scene.input.keyboard.removeKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
  // scene.input.keyboard.removeKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
  // scene.input.keyboard.removeKey(Phaser.Input.Keyboard.KeyCodes.ESC);
}

// SUBSTITUIR COMPLETAMENTE o código da criação da porta
// Primeiro, remova completamente QUALQUER porta criada anteriormente
if (!this.doorFixed) {
  console.log("===== IMPLEMENTANDO CORREÇÃO DEFINITIVA DA PORTA =====");
  
  // 1. Destruir todas as portas existentes para ter certeza que não há duplicatas
  this.children.getChildren().forEach(child => {
    if (child.texture && child.texture.key === 'door1') {
      console.log("Destruindo porta pré-existente");
      if (child.body) child.body.enable = false;
      child.destroy();
    }
  });

  // 2. Verificar e remover qualquer colisor existente relacionado à porta
  if (this.physics.world && this.physics.world.colliders) {
    this.physics.world.colliders.getActive().forEach(collider => {
      // Checar por colisores que possam estar relacionados à porta
      if (collider.name && collider.name.includes('door')) {
        console.log("Removendo colisor pré-existente da porta");
        collider.destroy();
      }
    });
  }

  // 3. Criar animação da porta apenas uma vez
  if (!this.anims.exists('doorOpeningFixed')) {
    this.anims.create({
      key: 'doorOpeningFixed',
      frames: [
        { key: 'door1', frame: 0 },
        { key: 'door1', frame: 1 },
        { key: 'door1', frame: 2 },
        { key: 'door1', frame: 3 },
        { key: 'door1', frame: 4 },
      ],
      frameRate: 6,
      repeat: 0
    });
  }

  // 4. Criar a porta com um nome exclusivo para facilitar referência
  door1 = this.physics.add.sprite(80, 345, 'door1', 0);
  door1.name = 'doorFixed';
  door1.setScale(1.2);
  door1.setOrigin(0.5, 0.5);
  door1.setImmovable(true);
  door1.body.setSize(20, 10);
  door1.body.setOffset(6, 50);
  door1.setDepth(DEPTHS.DOOR);

  // 5. Criar o colisor com um nome específico e armazenar a referência
  this.doorColliderFixed = this.physics.add.collider(
    player, 
    door1, 
    null, 
    null, 
    this
  );
  this.doorColliderFixed.name = 'doorColliderFixed';
  
  // 6. Remover todos os listeners anteriores para evitar duplicação
  this.input.keyboard.removeAllListeners('keydown-SPACE');
  
  // 7. Adicionar um novo listener dedicado apenas para a porta
  this.input.keyboard.on('keydown-SPACE', () => {
    if (dialogoIniciado || dialogoProfessorIniciado || minigameActive) return;
    
    // Verificar proximidade com a porta
    const distanceToDoor = Phaser.Math.Distance.Between(
      player.x, player.y, 
      door1.x, door1.y
    );
    
    if (distanceToDoor < 60) {
      console.log("Jogador próximo à porta. Estado:", isDoorOpen ? "Aberta" : "Fechada");
      
      if (isDoorOpen) {
        console.log("Porta já está aberta.");
        return;
      }
      
      if (dialogoNpc1Concluido) {
        console.log("Abrindo porta - condição atendida");
        isDoorOpen = true;
        
        // Reproduzir animação
        door1.anims.play('doorOpeningFixed');
        
        // Quando a animação terminar, DESTRUIR a porta completamente
        door1.once('animationcomplete', () => {
          console.log("Animação completa - removendo porta COMPLETAMENTE");
          
          // Destruir o colisor explicitamente
          if (this.doorColliderFixed) {
            this.doorColliderFixed.destroy();
            this.doorColliderFixed = null;
            console.log("Colisor da porta removido");
          }
          
          // Verificar qualquer colisor adicional
          this.physics.world.colliders.getActive().forEach(collider => {
            if (collider.object1 === door1 || collider.object2 === door1) {
              collider.destroy();
              console.log("Colisor adicional encontrado e removido");
            }
          });
          
          // Parar e configurar último frame
          door1.anims.stop();
          door1.setFrame(4);
          
          // Desativar o corpo físico
          if (door1.body) {
            door1.body.enable = false;
            door1.body.checkCollision.none = true;
            console.log("Corpo físico da porta desativado");
          }
          
          // Criar uma nova porta decorativa sem física (apenas visual)
          const doorDecoration = this.add.image(door1.x, door1.y, 'door1', 4);
          doorDecoration.setScale(1.2);
          doorDecoration.setOrigin(0.5, 0.5);
          doorDecoration.setDepth(DEPTHS.DOOR - 1); // Atrás de tudo
          
          // Destruir a porta original completamente
          door1.destroy();
          console.log("Porta original destruída e substituída por decoração");
        });
      } else {
        console.log("Tentando abrir porta - condição não atendida");
        doorMessage.setText("Preciso falar com o faxineiro primeiro!");
        doorMessage.setPosition(
          this.cameras.main.worldView.x + this.cameras.main.width / 2,
          this.cameras.main.worldView.y + this.cameras.main.height / 2 - 100
        );
        doorMessage.setVisible(true);
        
        this.time.delayedCall(2000, () => {
          doorMessage.setVisible(false);
        });
      }
    }
  });
  
  // Marcar que esta correção já foi aplicada
  this.doorFixed = true;
  console.log("===== CORREÇÃO DA PORTA IMPLEMENTADA =====");
}

// Modificar a função avancaDialogo para expor variáveis globais
function avancaDialogo(scene, tipo, dialogos) {
  // ...existing code...
  if (dialogoIndex < dialogos.length) {
    // ...existing code...
  } else {
    // ...existing code...
    if (tipo === 'faxineiro') {
      dialogoIniciado = false;
      dialogoNpc1Concluido = true;
      scene.registry.set('dialogoNpc1Concluido', true);
      window.dialogoNpc1Concluido = true; // Exposição explícita para o HTML
      scene.registry.set('dialogoFaxineiroIndex', 0);
      
      // Chamada explícita para atualizar missões
      if (typeof window.updateMissions === 'function') {
        window.updateMissions();
        console.log('Missão do faxineiro atualizada');
      }
    }
    // ...existing code...
  }
}

// Adicionar ao final de createMain para garantir que as variáveis globais sejam expostas
// Adicione antes do fechamento da função createMain
window.dialogoNpc1Concluido = dialogoNpc1Concluido;
window.keycardCount = keycardCount;
window.isDoor2Open = isDoor2Open;
window.keyCollected = keyCollected;