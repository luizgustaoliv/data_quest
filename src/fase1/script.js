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
    key: "main",
    preload: preload,
    create: createMain,
    update: updateMain,
  },
};

// Criação do jogo Phaser
const game = new Phaser.Game(config);

// Função para iniciar o jogo com o personagem selecionado
function startGame(character) {
  selectedCharacter = character;
  localStorage.setItem("currentCharacter", character);
  console.log("Personagem selecionado e salvo:", selectedCharacter);
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
  console.log("Personagem recuperado do localStorage:", selectedCharacter);
  
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
    if ((!podeIniciarDialogo && !dialogoIniciado && !dialogoProfessorIniciado) || (dialogoNpc1Concluido && dialogoProfessorConcluido)) {
      console.log("Não pode iniciar diálogo - não está perto do NPC ou diálogo já foi concluído");
      return;
    }

    // Primeiro, verificamos a distância com o NPC1 (faxineiro)
    let distanceToNpc1 = Phaser.Math.Distance.Between(player.x, player.y, npc1.x, npc1.y);
    let distanceToProfessor = Phaser.Math.Distance.Between(player.x, player.y, professorNpc.x, professorNpc.y);
    
    // Determina qual diálogo iniciar com base na proximidade
    let proximoAoFaxineiro = distanceToNpc1 < 70 && !dialogoNpc1Concluido;
    let proximoAoProfessor = distanceToProfessor < 70 && !dialogoProfessorConcluido;
    
    // Se não está próximo de nenhum NPC ou diálogo já foi iniciado, retorna
    if ((!proximoAoFaxineiro && !proximoAoProfessor && !dialogoIniciado && !dialogoProfessorIniciado)) {
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
      scene.registry.get('dialogoProfessorIndex') || 0;
    
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
          npc1Image.play('falaFaxineiro');
        } else {
          npc1Image.setVisible(false);
          professorImage.setVisible(false);
          personagem.setVisible(true);
          personagem.play('falaPersonagem');
        }
      } else { // professor
        if (dialogoAtual.autor === 'npc') {
          professorImage.setVisible(true);
          npc1Image.setVisible(false);
          personagem.setVisible(false);
        } else {
          professorImage.setVisible(false);
          npc1Image.setVisible(false);
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
              } else {
                professorImage.stop();
                professorImage.setFrame(0);
              }
            }
          }, [], scene);
        }
      };
      
      adicionarCaractere();
      
      // Salva o próximo índice no registro
      if (tipo === 'faxineiro') {
        scene.registry.set('dialogoFaxineiroIndex', dialogoIndex + 1);
      } else {
        scene.registry.set('dialogoProfessorIndex', dialogoIndex + 1);
      }
    } else {
      // Finaliza o diálogo
      textoDialogo.setVisible(false);
      caixaDialogo.setVisible(false);
      sombra.setVisible(false);
      personagem.setVisible(false);
      npc1Image.setVisible(false);
      professorImage.setVisible(false);
      
      if (tipo === 'faxineiro') {
        dialogoIniciado = false;
        dialogoNpc1Concluido = true;
        scene.registry.set('dialogoFaxineiroIndex', 0);
      } else {
        dialogoProfessorIniciado = false;
        dialogoProfessorConcluido = true;
        scene.registry.set('dialogoProfessorIndex', 0);
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

  // Adicione colisão entre o jogador e a porta
  this.physics.add.collider(player, door1);

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
    PLAYER: 15,     // Reduzi o valor do player
    NPCS: 15,       // Reduzi o valor dos NPCs também
    DOOR: 20,       // A porta agora tem profundidade maior que o player
    UI: 50,
    DIALOG: 100
  };

  // Após criar todos os elementos do diálogo, aplique as profundidades
  caixaDialogo.setDepth(DEPTHS.DIALOG);
  sombra.setDepth(DEPTHS.DIALOG - 1);
  personagem.setDepth(DEPTHS.DIALOG + 1);
  npc1Image.setDepth(DEPTHS.DIALOG + 1);
  professorImage.setDepth(DEPTHS.DIALOG + 1);
  textoDialogo.setDepth(DEPTHS.DIALOG + 2);
  
  // Defina a profundidade para mensagens e avisos
  doorMessage.setDepth(DEPTHS.UI);
  avisoTexto.setDepth(DEPTHS.UI);
  
  // Defina a profundidade para personagens
  player.setDepth(DEPTHS.PLAYER);
  npc1.setDepth(DEPTHS.NPCS);
  professorNpc.setDepth(DEPTHS.NPCS);

  // Após a criação da porta existente, adicione:
  door1.setDepth(DEPTHS.DOOR);

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
  let distanceToNpc1 = Phaser.Math.Distance.Between(player.x, player.y, npc1.x, npc1.y);
  let distanceToProfessor = Phaser.Math.Distance.Between(player.x, player.y, professorNpc.x, professorNpc.y);
  
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
  else {
    podeIniciarDialogo = false;
    if (!dialogoIniciado && !dialogoProfessorIniciado) {
      avisoTexto.setVisible(false);
    }
  }
  
  // Se a chave foi coletada, faz com que ela siga o jogador
  if (collectedKey) {
    collectedKey.x = Phaser.Math.Linear(collectedKey.x, player.x, 0.1);
    collectedKey.y = Phaser.Math.Linear(collectedKey.y, player.y - 20, 0.1);
  }

  // Não mova o jogador se o diálogo estiver ativo
  if (dialogoIniciado || dialogoProfessorIniciado) {
    player.setVelocity(0);
    return;
  }

  // Verificar proximidade com a porta
  let distanceToDoor = Phaser.Math.Distance.Between(player.x, player.y, door1.x, door1.y);
  
  if (distanceToDoor < 50 && !isDoorOpen) {
    // Se não estamos em diálogo e não há aviso de interação com NPCs
    if (!dialogoIniciado && !dialogoProfessorIniciado && !avisoTexto.visible) {
      avisoTexto.setText("Aperte (Espaço) para interagir");
      avisoTexto.setPosition(door1.x, door1.y - 10);
      avisoTexto.setVisible(true);
    }
  } else {
    if (!dialogoIniciado && !dialogoProfessorIniciado) {
      avisoTexto.setVisible(false);
    }
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