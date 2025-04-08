// Update global variables to match valid layers
let cursors2;
let player2;
let chaoLayer4;
let paredeLayer5;
let objetos1Layer7;
let objetos2Layer8;
let objetos3Layer9;
let camada4Layer6;

function preloadMain3() {
  // Load all possible player sprites
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
  this.load.spritesheet("player5", "../../assets/fase1/players/player5.png", {
    frameWidth: 64,
    frameHeight: 64,
  });
  this.load.spritesheet("player6", "../../assets/fase1/players/player6.png", {
    frameWidth: 64,
    frameHeight: 64,
  });
  // Keep default player as fallback
  this.load.spritesheet("player", "../../assets/fase1/players/player1.png", {
    frameWidth: 64,
    frameHeight: 64,
  });

  // Update tileset loading
  this.load.tilemapTiledJSON("map3json", "../../assets/fase3/fase3.json");
  this.load.image(
    "19_Hospital_Shadowless_32x32",
    "../../assets/fase3/19_Hospital_Shadowless_32x32.png"
  );
  this.load.image(
    "18_Jail_Shadowless_32x32",
    "../../assets/fase3/18_Jail_Shadowless_32x32.png"
  );
  this.load.image(
    "23_Television_and_Film_Studio_Shadowless_32x32",
    "../../assets/fase3/23_Television_and_Film_Studio_Shadowless_32x32.png"
  );
  this.load.image(
    "Room_Builder_32x32",
    "../../assets/fase3/Room_Builder_32x32.png"
  );
}

function createMain3() {
  // Criação do mapa (moved to top)
  const map3 = this.make.tilemap({ key: "map3json" });

  // Initialize cursor controls
  cursors2 = this.input.keyboard.createCursorKeys();

  // Check if map loaded successfully
  if (!map3 || !map3.layers || map3.layers.length === 0) {
    console.error("Map failed to load");
    return;
  }

  // Pegar o personagem selecionado do LocalStorage
  const selectedCharacter =
    localStorage.getItem("currentCharacter") || "player1";
  console.log("Character loaded from fase1:", selectedCharacter);

  // Get player name from localStorage or use default
  const playerName = localStorage.getItem("playerName") || "Jogador";
  console.log("Player name loaded from localStorage:", playerName);

  // Make sure the name is saved in localStorage for persistence
  if (!localStorage.getItem("playerName")) {
    localStorage.setItem("playerName", playerName);
  }

  // Update objectsLayer to use map3
  const objectsLayer = map3.getObjectLayer("Objects");
  if (objectsLayer) {
    objectsLayer.objects.forEach((object) => {
      if (object.name === "player") {
        this.player = this.physics.add.sprite(object.x, object.y, "player");
        this.player.setOrigin(0.5, 0.5);
      } else if (object.name === "enemy") {
        this.enemy = this.physics.add.sprite(object.x, object.y, "enemy");
        this.enemy.setOrigin(0.5, 0.5);
      }
    });
  }

  // We'll create the name tag after player is created
  this.events.on("create", () => {
    if (player2) {
      // Create name tag display
      const nameTag = this.add.text(0, -32, playerName, {
        fontFamily: "Arial",
        fontSize: "10px",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 2,
        align: "center",
      });
      nameTag.setOrigin(0.5, 0.5);

      // Create container for player and name tag
      const playerContainer = this.add.container(player2.x, player2.y);
      playerContainer.add([nameTag]);
      playerContainer.setDepth(1005);

      // Assign container to player for easy access
      player2.nameContainer = playerContainer;

      // Add a reference to update the name if it changes
      player2.updateName = function (newName) {
        nameTag.setText(newName);
        localStorage.setItem("playerName", newName);
      };

      // Update container position in update function
      this.events.on("update", () => {
        if (player2 && player2.nameContainer) {
          player2.nameContainer.setPosition(player2.x, player2.y);
        }
      });
    }
  });

  // Update tileset loading
  const tileset1 = map3.addTilesetImage(
    "18_Jail_Shadowless_32x32",
    "18_Jail_Shadowless_32x32"
  );
  const tileset2 = map3.addTilesetImage(
    "19_Hospital_Shadowless_32x32",
    "19_Hospital_Shadowless_32x32"
  );
  const tileset3 = map3.addTilesetImage(
    "23_Television_and_Film_Studio_Shadowless_32x32",
    "23_Television_and_Film_Studio_Shadowless_32x32"
  );
  const tileset4 = map3.addTilesetImage(
    "Room_Builder_32x32",
    "Room_Builder_32x32"
  );
  const tilesets4 = [tileset1, tileset2, tileset3, tileset4];

  // Update layer creation to use only valid layers
  try {
    chaoLayer4 = map3.createLayer("chao", tilesets4);
    console.log("chaoLayer created successfully");
  } catch (e) {
    console.warn("Couldn't create 'chao' layer:", e);
    chaoLayer4 = null;
  }

  try {
    paredeLayer5 = map3.createLayer("parede", tilesets4);
    console.log("paredeLayer created successfully");
  } catch (e) {
    console.warn("Couldn't create 'parede' layer:", e);
    paredeLayer5 = null;
  }

  try {
    objetos1Layer7 = map3.createLayer("objetos1", tilesets4);
    console.log("paredeLayer created successfully");
  } catch (e) {
    console.warn("Couldn't create 'parede' layer:", e);
    objetos1Layer7 = null;
  }

  try {
    objetos2Layer8 = map3.createLayer("objetos2", tilesets4);
    console.log("paredeLayer created successfully");
  } catch (e) {
    console.warn("Couldn't create 'parede' layer:", e);
    objetos2Layer8 = null;
  }

  try {
    objetos3Layer9 = map3.createLayer("objetos3", tilesets4);
    console.log("paredeLayer created successfully");
  } catch (e) {
    console.warn("Couldn't create 'parede' layer:", e);
    objetos3Layer9 = null;
  }

  try {
    camada4Layer6 = map3.createLayer("camada4", tilesets4);
    console.log("camada3Layer created successfully");
  } catch (e) {
    console.warn("Couldn't create 'camada3' layer:", e);
    camada4Layer6 = null;
  }

  // Update layer scaling
  if (chaoLayer4) chaoLayer4.setScale(1.0);
  if (paredeLayer5) paredeLayer5.setScale(1.0);
  if (objetos1Layer7) objetos1Layer7.setScale(1.0);
  if (objetos2Layer8) objetos2Layer8.setScale(1.0);
  if (objetos3Layer9) objetos3Layer9.setScale(1.0);
  if (camada4Layer6) camada4Layer6.setScale(1.0);

  // Adiciona o sprite do personagem no mapa - posição inicial
  player2 = this.physics.add.sprite(490, 950, selectedCharacter);
  player2.setScale(0.8);
  player2.body.setOffset(19, 55.4);

  // Create animations
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

  // Configuração da câmera
  this.cameras.main.setBounds(0, 0, map3.widthInPixels, map3.heightInPixels);
  this.cameras.main.startFollow(player2);
  this.cameras.main.setZoom(1.5);

  // Update colliders to use correct layers
  if (paredeLayer5) {
    this.physics.add.collider(player2, paredeLayer5);
    if (this.enemy) {
      this.physics.add.collider(this.enemy, paredeLayer5);
    }
  }

  // Criar grupo de colisões manuais
  const manualColliders = this.physics.add.staticGroup();

  // Função para adicionar retângulos de colisão
  function addCollisionRect(scene, x, y, width, height) {
    const rect = scene.add.rectangle(x, y, width, height);
    scene.physics.add.existing(rect, true); // true para estático
    rect.body.immovable = true;

    // Adicionar debugging visual se necessário
    if (scene.physics.config.debug) {
      rect.setStrokeStyle(2, 0xff0000);
    } else {
      rect.setVisible(false); // Invisível em produção
    }

    manualColliders.add(rect);
    return rect;
  }

  // Adicionar colisões manuais - ajuste estas coordenadas conforme necessário
  // Debug flag - Set to true to see collision rectangles
  const debugCollisions = true;

  // Função modificada para adicionar retângulos de colisão com suporte a debug
  function addCollisionRect(scene, x, y, width, height, color = 0xff0000) {
    const rect = scene.add.rectangle(x, y, width, height);
    scene.physics.add.existing(rect, true); // true para estático
    rect.body.immovable = true;

    // Configuração de debug visual
    if (debugCollisions) {
      rect.setStrokeStyle(2, color);
      rect.setFillStyle(color, 0.2);
      rect.setVisible(false); // Visível no modo debug
    } else {
      rect.setVisible(false); // Invisível em produção
    }

    manualColliders.add(rect);
    return rect;
  }

  // Adicionar tecla para alternar o modo debug (F9)
  const debugKey = this.input.keyboard.addKey(
    Phaser.Input.Keyboard.KeyCodes.F9
  );
  debugKey.on("down", () => {
    // Alternar visibilidade de todos os colisores
    manualColliders.getChildren().forEach((rect) => {
      rect.setVisible(!rect.visible);
    });
    
    // Toggle player debug visualization
    if (player2 && player2.body) {
      player2.body.debugShowBody = !player2.body.debugShowBody;
      player2.body.debugShowVelocity = !player2.body.debugShowVelocity;
    }
    
    console.log(
      "Debug collision mode:",
      !manualColliders.getChildren()[0].visible
    );
  });
  //Posição X(horizontal), posição Y(vertical), largura, altura, cor
  addCollisionRect(this, 230, 155, 350, 70, 0x00ff00); // mesa
  addCollisionRect(this, 400, 195, 28, 184, 0x00ff00); // mesa
  addCollisionRect(this, 320, 125, 70, 70, 0x00ff00); // mesa
  addCollisionRect(this, 379, 1005, 70, 200, 0x00ff00); // mesa
  // Adicionar colisões para as bordas do mapa se necessário - Azul para bordas
  // Instrução de debug no console
  console.log("Debug: pressione F9 para mostrar/ocultar colisões");

  // Define array com todas as camadas válidas
  const validLayers = [
    chaoLayer4,
    paredeLayer5,
    objetos1Layer7,
    objetos2Layer8,
    objetos3Layer9,
    camada4Layer6,
  ];

  // Adiciona colisões para cada camada válida
  validLayers.forEach((layer) => {
    if (layer) {
      layer.setCollisionByProperty({ collider: true });
      this.physics.add.collider(player2, layer);
    }
  });

  // Adicionar colisão com os retângulos manuais
  this.physics.add.collider(player2, manualColliders);
}

function updateMain3() {
  // Add safety check for cursors2
  if (!cursors2 || !player2) return;
  const speed = 160;

  const leftPressed =
    cursors2.left.isDown ||
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A).isDown;
  const rightPressed =  
    cursors2.right.isDown ||
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D).isDown;
  const upPressed =
    cursors2.up.isDown ||
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W).isDown;
  const downPressed =
    cursors2.down.isDown ||
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S).isDown;

  // Reset velocity
  player2.setVelocity(0);

  // Apply velocity based on input
  if (leftPressed) {
    player2.setVelocityX(-speed);
    player2.setFlipX(true);
    player2.anims.play("walk_side", true);
  } else if (rightPressed) {
    player2.setVelocityX(speed);
    player2.setFlipX(false);
    player2.anims.play("walk_side", true);
  } else if (upPressed) {
    player2.setVelocityY(-speed);
    player2.anims.play("walk_up", true);
  } else if (downPressed) {
    player2.setVelocityY(speed);
    player2.anims.play("walk_down", true);
  } else {
    // Set idle animation based on the last direction
    if (player2.anims.currentAnim) {
      const currentAnim = player2.anims.currentAnim.key;
      if (currentAnim === "walk_side") {
        player2.anims.play("idle_side", true);
      } else if (currentAnim === "walk_up") {
        player2.anims.play("idle_back", true);
      } else if (currentAnim === "walk_down") {
        player2.anims.play("idle_front", true);
      }
    } else {
      player2.anims.play("idle_front", true);
    }
  }

  // Allow diagonal movement with normalized speed
  if ((leftPressed || rightPressed) && (upPressed || downPressed)) {
    // Normalize the velocity to prevent faster diagonal movement
    player2.body.velocity.normalize().scale(speed);
  }
}

// Wrap config and game initialization in a function
function startGame() {
  const config = {
    type: Phaser.WEBGL,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: "game-container",
    backgroundColor: "#000000",
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
      preload: preloadMain3,
      create: createMain3,
      update: updateMain3,
    },
  };

  const game = new Phaser.Game(config);
}

// Start the game after page loads
window.onload = function () {
  startGame();
};
