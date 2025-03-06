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
      debug: true, // Ativa o modo de depuração
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: updateMain,
  },
};

// Criação do jogo Phaser
const game = new Phaser.Game(config);

// Função para iniciar o jogo com o personagem selecionado
function startGame(character) {
  selectedCharacter = character;
  document.getElementById("character-select").style.display = "none";
  document.getElementById("game-container").style.display = "block";
  game.scene.start("main");
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
  this.load.image("npc1", "../../assets/npc.png");
  this.load.image("professorNpc", "../../assets/sprite_prof.png");
  this.load.image("elevator", "../../assets/animated_elevator_door_entrance_2_32x32.gif");
  this.load.image("background", "../../assets/fase1/background.png");
  this.load.tilemapTiledJSON("map", "tileset.json");
  this.load.image("player1big", "../../assets/personagem/personagem1Big.png");
  this.load.image("key", "../../assets/fase1/chavesprite.png");
  this.load.image(
    "3_Bathroom_32x32",
    "../../assets/fase1/3_Bathroom_32x32.png"
  );
  this.load.image(
    "5_Classroom_and_library_32x32",
    "../../assets/fase1/5_Classroom_and_library_32x32.png"
  );
  this.load.image(
    "13_Conference_Hall_32x32",
    "../../assets/fase1/13_Conference_Hall_32x32.png"
  );
  this.load.image(
    "14_Basement_32x32",
    "../../assets/fase1/14_Basement_32x32.png"
  );
  this.load.image(
    "16_Grocery_store_32x32",
    "../../assets/fase1/16_Grocery_store_32x32.png"
  );
  this.load.image("18_Jail_32x32", "../../assets/fase1/18_Jail_32x32.png");
  this.load.image(
    "19_Hospital_32x32",
    "../../assets/fase1/19_Hospital_32x32.png"
  );
  this.load.image(
    "23_Television_and_Film_Studio_32x32",
    "../../assets/fase1/23_Television_and_Film_Studio_32x32.png"
  );
  this.load.image(
    "25_Shooting_Range_32x32",
    "../../assets/fase1/25_Shooting_Range_32x32.png"
  );
  this.load.image(
    "Room_Builder_32x32",
    "../../assets/fase1/Room_Builder_32x32.png"
  );
}

// Função para criar a cena principal do jogo
function create() {
  this.scene.remove("main");
  this.scene.add("main", { create: createMain, update: updateMain }, true);
}

// Função para criar a cena principal do jogo
function createMain() {
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
    console.log("Entrando no elevador...");
    localStorage.setItem("selectedCharacter", selectedCharacter);
    document.body.classList.add("fade-out");
    setTimeout(() => {
        window.location.replace("../fase2/fase2.html");
    }, 1200);
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

  // Criação da chave
  key = this.physics.add.sprite(1000, 320, "key", 0);
  key.setCollideWorldBounds(true);
  key.setScale(0.8);
  key.setOrigin(0.2, 1);
  key.body.setSize(25, 10);
  key.body.setOffset(2, 5);

  // Adiciona colisão entre o jogador e o professor NPC
  this.physics.add.collider(player, professorNpc);
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

  // Criação dos elementos da caixa de diálogo
  caixaDialogo = this.add.graphics();
  caixaDialogo.fillStyle(0x00000, 1);
  caixaDialogo.fillRoundedRect(50, 400, 700, 100, 10);
  caixaDialogo.lineStyle(4, 0xefffffff, 1);
  caixaDialogo.strokeRoundedRect(50, 400, 700, 100, 10);

  // Criação da sombra para cobrir a tela inteira quando ativo
  sombra = this.add.graphics();
  sombra.fillStyle(0x000000, 0.3);
  sombra.fillRect(0, 0, map.widthInPixels, map.heightInPixels);

  personagem = this.add.image(70, 420, "player1big").setScale(0.7);
  personagem.setOrigin(0.5, 0.5);

  // Adiciona a imagem do npc1
  npc1Image = this.add.image(750, 450, "npc1").setScale(2);
  npc1Image.setOrigin(0.5, 0.5);
 

  // Lista de diálogos personalizados - ATUALIZE esta parte
  const dialogosPersonalizados = [
    { texto: "Com licença senhor, o que aconteceu por aqui?...", autor: "player" },
    { texto: "Por que a porta da escola está fechada?", autor: "player" },
    { texto: "Fale mais baixo! Senão eles poderão te detectar!", autor: "npc" },
    { texto: "Quem são eles?", autor: "player" },
    { texto: "Tem muita informação para explicar...", autor: "npc" },
    { texto: " É melhor você ir embora,", autor: "npc" },
    { texto: "As coisas estão muito perigosas aqui dentro.", autor: "npc" },
    { texto: "Não, eu quero saber o que aconteceu.", autor: "player" },
    { texto: "(Rapaz persistente…) Ok, tudo bem...", autor: "npc" },
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

  // Criação do texto do diálogo
  textoDialogo = this.add
    .text(400, 450, "", {
      fontFamily: "arial",
      fontSize: "22px",
      color: "#FFF",
      wordWrap: { width: 650 },
      align: "center",
      padding: { left: 10, right: 10, top: 10, bottom: 5 },
    })
    .setStroke("#000000", 3)
    .setOrigin(0.5, 0.5); // Centraliza o texto no ponto especificado
  
  // Ocultar elementos de diálogo
  caixaDialogo.setVisible(false);
  sombra.setVisible(false);
  personagem.setVisible(false);
  npc1Image.setVisible(false);
  textoDialogo.setVisible(false);

  let dialogoIndex = 0;
  podeIniciarDialogo = false; // Iniciar como falso por padrão

  // SUBSTITUA completamente o listener da tecla E com este código:
  this.input.keyboard.on("keydown-E", () => {
    console.log("Tecla E pressionada. Pode iniciar diálogo:", podeIniciarDialogo);
    
    // Verifica se o jogador pode iniciar diálogo (ou seja, está encostando no NPC1)
    if (!podeIniciarDialogo && !dialogoIniciado) {
      console.log("Não pode iniciar diálogo - não está perto do NPC");
      return;
    }

    if (!dialogoIniciado) {
      console.log("Iniciando diálogo");
      dialogoIniciado = true;
      caixaDialogo.setVisible(true);
      sombra.setVisible(true);
      avisoTexto.setVisible(false);
    }

    // Se já tem um diálogo em andamento, avança para o próximo
    if (dialogoIndex < dialogosPersonalizados.length) {
      // Exibe o próximo diálogo na lista
      const dialogoAtual = dialogosPersonalizados[dialogoIndex];
      textoDialogo.setText(dialogoAtual.texto);
      textoDialogo.setVisible(true);

      // Alterna a visibilidade das imagens
      if (dialogoAtual.autor === "npc") {
        npc1Image.setVisible(true);
        personagem.setVisible(false);
      } else {
        npc1Image.setVisible(false);
        personagem.setVisible(true);
      }

      // Avança para o próximo diálogo
      dialogoIndex++;
    } else {
      // Encerra o diálogo quando todos os diálogos foram exibidos
      dialogoIndex = 0;
      textoDialogo.setVisible(false);
      dialogoIniciado = false;
      caixaDialogo.setVisible(false);
      sombra.setVisible(false);
      personagem.setVisible(false);
      npc1Image.setVisible(false);
    }
  });
}

// Função para coletar a chave
function collectKey(player, key) {
  keyCollected = true;
  collectedKey = key;
  key.setDepth(1);
  key.body.setEnable(false);
}

// Função para atualizar a cena principal do jogo
function updateMain() {
  // Redefinir a variável podeIniciarDialogo para false no início de cada frame
  podeIniciarDialogo = false;
  
  // Verificar a sobreposição com o NPC1 em cada frame
  let distance = Phaser.Math.Distance.Between(player.x, player.y, npc1.x, npc1.y);
  if (distance < 70) { // Define uma distância razoável para interação
    podeIniciarDialogo = true;
    if (!dialogoIniciado) {
      avisoTexto.setPosition(npc1.x, npc1.y - 50);
      avisoTexto.setVisible(true);
    }
  } else {
    if (!dialogoIniciado) {
      avisoTexto.setVisible(false);
    }
  }
  
  // Se a chave foi coletada, faz com que ela siga o jogador
  if (collectedKey) {
    collectedKey.x = Phaser.Math.Linear(collectedKey.x, player.x, 0.1);
    collectedKey.y = Phaser.Math.Linear(collectedKey.y, player.y - 20, 0.1);
  }

  // Não mova o jogador se o diálogo estiver ativo
  if (dialogoIniciado) {
    player.setVelocity(0);
    return;
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

  let newAnimation = null;

  if (leftPressed) {
    player.setVelocityX(-160);
    newAnimation = "walk_side";
    player.setFlipX(true);
    lastDirection = "left";
  } else if (rightPressed) {
    player.setVelocityX(160);
    newAnimation = "walk_side";
    player.setFlipX(false);
    lastDirection = "right";
  } else if (upPressed) {
    player.setVelocityY(-160);
    newAnimation = "walk_up";
    lastDirection = "up";
  } else if (downPressed) {
    player.setVelocityY(160);
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
}