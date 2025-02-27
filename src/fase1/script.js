let selectedCharacter;
let player;
let map;
let podeIniciarDialogo = false;
let dialogoIniciado = false;
let avisoTexto;
let textoDialogo;
let chaoLayer;
let paredeLayer;
let objSemColisaoLayer;
let colisaoLayer;
let obj2ColisaoLayer;
let cursors;
let npc1;
let professorNpc;

const config = {
  type: Phaser.AUTO,
  width: window.innerWidth, // Usar a largura da janela
  height: window.innerHeight, // Usar a altura da janela
  parent: "game-container",
  scale: {
    mode: Phaser.Scale.RESIZE, // Ajusta o tamanho do jogo dinamicamente
    autoCenter: Phaser.Scale.CENTER_BOTH, // Centraliza o jogo na tela
  },
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
function create() {
  this.scene.remove("main");
  this.scene.add(
    "main",
    { create: createMain, update: updateMain, update: update },
    true
  );
}
function startGame(character) {
  selectedCharacter = character;
  document.getElementById("character-select").style.display = "none";
  document.getElementById("game-container").style.display = "block";
  game.scene.start("main");
}

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

function create() {
  this.scene.remove("main");
  this.scene.add("main", { create: createMain, update: updateMain }, true);
}

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

  chaoLayer = map.createLayer(
    "chão",
    [
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
    ],
    0,
    0
  );
  paredeLayer = map.createLayer(
    "parede",
    [
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
    ],
    0,
    0
  );
  objSemColisaoLayer = map.createLayer(
    "obj_semcolisao",
    [
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
    ],
    0,
    0
  );
  colisaoLayer = map.createLayer(
    "obj_comcolisao",
    [
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
    ],
    0,
    0
  );
  obj2ColisaoLayer = map.createLayer(
    "obj2_comcolisao",
    [
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
    ],
    0,
    0
  );

  const objectsLayer = map.getObjectLayer("obj_comcolisao"); // Nome da camada de objetos no Tile

  // Definindo colisões para as camadas
  colisaoLayer.setCollisionByProperty({ collider: true });
  obj2ColisaoLayer.setCollisionByProperty({ collider: true });
  paredeLayer.setCollisionByProperty({ collider: true });

  chaoLayer.setScale(1);
  paredeLayer.setScale(1);
  objSemColisaoLayer.setScale(1);
  colisaoLayer.setScale(1);
  obj2ColisaoLayer.setScale(1);

  this.physics.world.createDebugGraphic();
  cursors = this.input.keyboard.createCursorKeys();

  player = this.physics.add.sprite(100, 280, selectedCharacter, 0);
  player.setCollideWorldBounds(true);
  player.setScale(0.8);
  player.setOrigin(0.5, 1);
  player.body.setSize(27, 10);
  player.body.setOffset(18, 55);

  npc1 = this.physics.add.sprite(130, 320, "npc1", 0);
  npc1.setCollideWorldBounds(true);
  npc1.setScale(0.6);
  npc1.setOrigin(0.2, 1);
  npc1.body.setSize(40, 20);
  npc1.body.setOffset(28, 75);
  npc1.body.setImmovable(true); // Impede que o NPC seja movido pela colisão

  professorNpc = this.physics.add.sprite(600, 480, "professorNpc", 0);
  professorNpc.setCollideWorldBounds(true);
  professorNpc.setScale(0.8);
  professorNpc.setOrigin(0.2, 1);
  professorNpc.body.setSize(20, 20);
  professorNpc.body.setOffset(38, 75);
  professorNpc.body.setImmovable(true); // Impede que o NPC seja movido pela
  // colisão

  key = this.physics.add.sprite(1000, 320, "key", 0);
  key.setCollideWorldBounds(true);
  key.setScale(0.8);
  key.setOrigin(0.2, 1);
  key.body.setSize(20, 20);
  key.body.setOffset(38, 75);
  key.body.setImmovable(true); // Impede que o NPC seja movido pela

  // Colisão padrão para o mundo (player com paredes, etc)
  this.physics.add.collider(player, professorNpc);

  if (objectsLayer) {
    const collisionGroup = this.physics.add.staticGroup(); // Criando grupo de colisão

    objectsLayer.objects.forEach((obj) => {
      const collisionObject = this.add.rectangle(
        obj.x,
        obj.y,
        obj.width,
        obj.height
      );
      this.physics.add.existing(collisionObject, true); // Torna o objeto estático
      collisionGroup.add(collisionObject); // Adiciona ao grupo de colisão
    });

    this.physics.add.collider(player, collisionGroup, () => {
      console.log("Colisão com objeto detectada!");
    });
  }

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
  const layers = [colisaoLayer, obj2ColisaoLayer, paredeLayer];

  colisaoLayer.forEachTile((tile) => {
    if (tile.index !== -1) {
      // Verifica apenas tiles existentes
      console.log(
        `Tile ID: ${tile.index}, Collider: ${tile.properties.collider}`
      );
    }
  });

  layers.forEach((layer) => {
    if (layer) {
      layer.setCollisionByProperty({ collider: true }); // Ativa colisão para tiles com collider: true
      this.physics.add.collider(player, layer);
    }
  });

  player.body.setBounce(0); // Garante que o jogador não "quique"
  player.body.setMaxVelocity(200); // Limita a velocidade
  player.body.useDamping = true; // Suaviza o movimento
  player.body.setImmovable(false);

  console.log(player.body); // Verifique no console se o corpo do jogador existe
  console.log(player.body.blocked); // Veja se ele está detectando colisões
  colisaoLayer.forEachTile((tile) => {
    console.log(
      `Tile ID: ${tile.index}, Collider: ${tile.properties.collider}`
    );
  });

  this.physics.add.collider(player, colisaoLayer, () => {
    console.log("Colisão detectada!");
  });

  layers.forEach((layer) => {
    if (layer) {
      layer.setCollisionByProperty({ collider: true });
      this.physics.add.collider(player, layer);
    }
  });

  if (colisaoLayer) {
    colisaoLayer.setCollisionByProperty({ collider: true });
    this.physics.add.collider(player, colisaoLayer);
  }

  if (obj2ColisaoLayer) {
    obj2ColisaoLayer.setCollisionByProperty({ collider: true });
    this.physics.add.collider(player, obj2ColisaoLayer);
  }

  if (paredeLayer) {
    paredeLayer.setCollisionByProperty({ collider: true });
    this.physics.add.collider(player, paredeLayer);
  }
}

function updateMain() {
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

  if (leftPressed) {
    player.setVelocityX(-160);
    player.anims.play("walk_side", true);
    player.setFlipX(true);
  } else if (rightPressed) {
    player.setVelocityX(160);
    player.anims.play("walk_side", true);
    player.setFlipX(false);
  } else if (upPressed) {
    player.setVelocityY(-160);
    player.anims.play("walk_up", true);
  } else if (downPressed) {
    player.setVelocityY(160);
    player.anims.play("walk_down", true);
  } else {
    player.setVelocity(0);
    player.anims.play("idle_front", true);
  }

  function update() {
    let newAnimation = null;

    if (leftPressed) {
      player.setFlipX(true);
      newAnimation = "walk_side";
      lastDirection = "left";
    } else if (rightPressed) {
      player.setFlipX(false);
      newAnimation = "walk_side";
      lastDirection = "right";
    } else if (upPressed) {
      newAnimation = "walk_up";
      lastDirection = "up";
    } else if (downPressed) {
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

    // Se a animação precisa ser mudada, troca apenas se necessário
    if (newAnimation && newAnimation !== currentAnimation) {
      player.anims.play(newAnimation, true);
      currentAnimation = newAnimation;
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
    this.physics.add.collider(
      player,
      colisaoLayer,
      handleCollision,
      null,
      this
    );
    this.physics.add.collider(
      player,
      obj2ColisaoLayer,
      handleCollision,
      null,
      this
    );
    this.physics.add.collider(player, paredeLayer, handleCollision, null, this);

    this.physics.add.collider(player, npc1, () => {
      console.log("Colisão com NPC1 detectada!");
    });

    this.physics.add.collider(player, professorNpc, () => {
      console.log("Colisão com Professor NPC detectada!");
    });

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
      if (
        podeIniciarDialogo &&
        Phaser.Input.Keyboard.JustDown(teclaE) &&
        !dialogoIniciado
      ) {
        iniciarDialogo();
      }
    };
  }
  // Configurar a câmera para seguir o jogador
  this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
  this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
  this.cameras.main.startFollow(player);
  this.cameras.main.setZoom(1.2); // Defina o zoom desejado

  // Criar o aviso de interação (inicia invisível)
  avisoTexto = this.add.text(0, 0, "(E)", {
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

  // Criar fundo da caixa de diálogo
  let caixaDialogo = this.add.graphics();
  caixaDialogo.fillStyle(0x00000, 1); // Fundo branco
  caixaDialogo.fillRoundedRect(100, 400, 700, 100, 10); // Caixa arredondada
  caixaDialogo.lineStyle(4, 0xefffffff, 1); // Borda vermelha
  caixaDialogo.strokeRoundedRect(50, 400, 750, 100, 10);

  // Criar sombra para profundidade
  let sombra = this.add.graphics();
  sombra.fillStyle(0x000000, 0.3);
  sombra.fillRoundedRect(0, 0, 0, 0, 0);

  // Adicionar imagem do personagem (se houver)
  let personagem = this.add.image(80, 450, "player1big").setScale(1);
  personagem.setOrigin(0.5, 0.5);

  // Lista de diálogos possíveis
  const dialogo = [
    "Olá, o quê aconteceu na escola?",
    "Bom dia! cadê todo mundo?",
    "Ei, você! cade o resto do pessoal?",
  ];

  // Criar texto do diálogo (mas invisível no início)
  let textoDialogo = this.add
    .text(150, 430, "", {
      // Começa vazio
      fontFamily: "arial",
      fontSize: "28px",
      color: "#FFF",
      wordWrap: { width: 550 },
      padding: { left: 10, right: 10, top: 10, bottom: 5 },
    })
    .setStroke("#000000", 4);
  textoDialogo.setVisible(false); // Deixa invisível

  // Adiciona verificação de colisão com NPC
  this.physics.add.overlap(player, npc1, jogadorPertoNpc, null, this);

  // Função para verificar a proximidade do jogador com o NPC
  function jogadorPertoNpc(player, npc) {
    podeIniciarDialogo = true;
    avisoTexto.setPosition(npc.x, npc.y - 50);
    avisoTexto.setVisible(true);
  }

  //nova alocação de if parando a movi do player durante o dialogo
  if (dialogoIniciado == true) {
    console.log("O diálogo iniciou!");
    if (leftPressed) {
      player.setVelocityX(0);
      player.anims.play("walk_side", false);
      player.setFlipX(false);
      this.playerCanMove = false;
    } else if (rightPressed) {
      player.setVelocityX(0);
      player.anims.play("walk_side", false);
      player.setFlipX(false);
      this.playerCanMove = false;
    } else if (upPressed) {
      player.setVelocityY(0);
      player.anims.play("walk_up", false);
      this.playerCanMove = false;
    } else if (downPressed) {
      player.setVelocityY(0);
      player.anims.play("walk_down", false);
      this.playerCanMove = false;
    } else {
      player.setVelocity(0);
      player.anims.play("idle_front", false);
      this.playerCanMove = true;
    }
  }

  caixaDialogo.setVisible(false);
  sombra.setVisible(false);
  personagem.setVisible(false);
  textoDialogo.setVisible(false);

  // Função para iniciar o diálogo ao pressionar "E"
  this.input.keyboard.on("keydown-E", () => {
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
      avisoTexto.setVisible(false); // Reexibe o aviso depois que o diálogo some
    }, 3000);
  });
}
