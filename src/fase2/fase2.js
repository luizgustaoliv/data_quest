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
let estantes1Layer, estantes2Layer, estantes3Layer, estantes4Layer;

function preloadMain() {
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
  
  this.load.tilemapTiledJSON("map2json", "../../assets/fase2/fase2.json");
  this.load.image("fase2", "../../assets/fase2/fase2.png");
  this.load.image("5_Classroom_and_library_32x32", "../../assets/fase2/5_Classroom_and_library_32x32.png");
  this.load.image("19_Hospital_32x32", "../../assets/fase2/19_Hospital_32x32.png");
  this.load.image("Room_Builder_32x32", "../../assets/fase2/Room_Builder_32x32.png");

}

function createMain() {
  try {
    // Pegar o personagem selecionado do LocalStorage
    const selectedCharacter = localStorage.getItem("currentCharacter") || "player1";
    console.log("Character loaded from fase1:", selectedCharacter);

    // Get player name from localStorage or use default
    const playerName = localStorage.getItem("playerName") || "Jogador";
    console.log("Player name loaded from localStorage:", playerName);
    
    // Make sure the name is saved in localStorage for persistence
    if (!localStorage.getItem("playerName")) {
    localStorage.setItem("playerName", playerName);
    }


      // More animations will be created in startGame function

      // We'll create the name tag after player is created
      this.events.on('create', () => {
        if (player) {
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
        const playerContainer = this.add.container(player.x, player.y);
        playerContainer.add([nameTag]);
        playerContainer.setDepth(1005);
        
        // Assign container to player for easy access
        player.nameContainer = playerContainer;
        
        // Add a reference to update the name if it changes
        player.updateName = function(newName) {
          nameTag.setText(newName);
          localStorage.setItem("playerName", newName);
        };
        
        // Update container position in update function
        this.events.on('update', () => {
          if (player && player.nameContainer) {
          player.nameContainer.setPosition(player.x, player.y);
          }
        });
        }
      });
    // Carregar o mapa
    map2 = this.make.tilemap({ key: "map2json" });

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

     // Verificar se o mapa foi carregado corretamente
     const tileset1 = map2.addTilesetImage("5_Classroom_and_library_32x32", "5_Classroom_and_library_32x32", 32, 32);
     const tileset2 = map2.addTilesetImage("19_Hospital_32x32", "19_Hospital_32x32", 32, 32);
     const tileset3 = map2.addTilesetImage("Room_Builder_32x32", "Room_Builder_32x32", 32, 32);

     const tilesets = [
      tileset1,
      tileset2,
      tileset3
    ];

          // Criação das camadas do mapa com verificação
          try {
            chaoLayer = map2.createLayer("chao", tilesets);
            console.log("chaoLayer created successfully");
          } catch (e) {
            console.warn("Couldn't create 'chão' layer:", e);
            chaoLayer = null;
          }
    
          try {
            paredeLayer = map2.createLayer("parede", tilesets);
            console.log("paredeLayer created successfully");
          } catch (e) {
            console.warn("Couldn't create 'parede' layer:", e);
            paredeLayer = null;
          }
    
          try {
            objSemColisaoLayer = map2.createLayer("obj_semcolisao", tilesets);
            console.log("objSemColisaoLayer created successfully");
          } catch (e) {
            console.warn("Couldn't create 'obj_semcolisao' layer:", e);
            objSemColisaoLayer = null;
          }
          try {
            estantes1Layer = map2.createLayer("estantes1", tilesets);
            console.log("estantes1Layer created successfully");
          } catch (e) {
            console.warn("Couldn't create 'obj2_comcolisao' layer:", e);
            estantes1Layer = null;
          }

          try {
            estantes2Layer = map2.createLayer("estantes2", tilesets);
            console.log("estantes2Layer created successfully");
          } catch (e) {
            console.warn("Couldn't create 'obj2_comcolisao' layer:", e);
            estantes2Layer = null;
          }

          try {
            estantes3Layer = map2.createLayer("estantes3", tilesets);
            console.log("estantes3Layer created successfully");
          } catch (e) {
            console.warn("Couldn't create 'obj2_comcolisao' layer:", e);
            estantes3Layer = null;
          }

          try {
            estantes4Layer = map2.createLayer("estantes4", tilesets);
            console.log("estantes4Layer created successfully");
          } catch (e) {
            console.warn("Couldn't create 'obj2_comcolisao' layer:", e);
            estantes4Layer = null;
          }

          if (chaoLayer) chaoLayer.setScale(1.0);
          if (paredeLayer) paredeLayer.setScale(1.0);
          if (objSemColisaoLayer) objSemColisaoLayer.setScale(1.0);
          if (estantes1Layer) estantes1Layer.setScale(1.0);
          if (estantes2Layer) estantes2Layer.setScale(1.0); 
          if (estantes3Layer) estantes3Layer.setScale(1.0);
          if (estantes4Layer) estantes4Layer.setScale(1.0);   
 
    // Adiciona o sprite do personagem no mapa - posição inicial
    player = this.physics.add.sprite(670, 1000, selectedCharacter);
    player.setScale(0.8 );

    // Ajusta o tamanho da hitbox do player
    player.body.setSize(27, 8);
    player.body.setOffset(19, 55.4);

    // Ativa o modo de debug para visualizar a hitbox
    this.physics.world.drawDebug = true;
    this.physics.world.debugGraphic = this.add.graphics();

      // After creating all layers and the player, set up the camera correctly
      if (map2 && player) {
        // Configure camera to follow player
        this.cameras.main.setBounds(0, 0, map2.widthInPixels, map2.heightInPixels);
        this.physics.world.setBounds(0, 0, map2.widthInPixels, map2.heightInPixels);
        this.cameras.main.startFollow(player);
        this.cameras.main.setZoom(1.5);
      }

      if (map2 && map2.layers && map2.layers.length > 0) {
        startGame.call(this);
      }
  } catch (error) {
    console.error("Erro ao carregar o mapa:", error);
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
      rect.setVisible(true); // Visível no modo debug
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
          console.log(
            "Debug collision mode:",
            !manualColliders.getChildren()[0].visible
          );
        });

        addCollisionRect(this, 1018, 1010, 560, 160, 0xff0000); // parede
        addCollisionRect(this, 314, 1010, 460, 160, 0xff0000); // parede
        addCollisionRect(this, 668, 1100, 150, 20, 0xff0000); // parede
        addCollisionRect(this, 576, 1010, 60, 160, 0xff0000); // parede
        addCollisionRect(this, 608, 960, 60, 60, 0xff0000); // parede
        addCollisionRect(this, 735, 960, 60, 60, 0xff0000); // parede
        addCollisionRect(this, 108, 530, 20, 800, 0xff0000); // parede
        addCollisionRect(this, 607, 192, 60, 60, 0xff0000); // parede
        addCollisionRect(this, 737, 192, 60, 60, 0xff0000); // parede
        addCollisionRect(this, 576, 80, 60, 160, 0xff0000); // parede
        addCollisionRect(this, 769, 80, 60, 160, 0xff0000); // parede
        addCollisionRect(this, 669, 22, 200, 80, 0xff0000); // parede 
        addCollisionRect(this, 345, 142, 460, 160, 0xff0000); // parede
        addCollisionRect(this, 1030, 142, 560, 160, 0xff0000); // parede
        addCollisionRect(this, 1237, 530, 20, 800, 0xff0000); // parede
        addCollisionRect(this, 755, 865, 18, 130, 0xff0000); // parede
        addCollisionRect(this, 590, 865, 18, 130, 0xff0000); // parede
        addCollisionRect(this, 452, 810, 373, 70, 0xff0000); // parede
        addCollisionRect(this, 274, 737, 20, 243, 0xff0000); // parede
        addCollisionRect(this, 178, 787, 20, 283, 0xff0000); // parede
        addCollisionRect(this, 398, 580, 20, 245, 0xff0000); // parede
        addCollisionRect(this, 494, 580, 20, 245, 0xff0000); // parede
        addCollisionRect(this, 460, 483, 147, 88, 0xff0000); // parede
        addCollisionRect(this, 220, 463, 200, 78, 0xff0000); // parede
        addCollisionRect(this, 352, 333, 314, 78, 0xff0000); // parede
        addCollisionRect(this, 209, 250, 16, 78, 0xff0000); // parede
        addCollisionRect(this, 588, 265, 20, 88, 0xff0000); // parede
        addCollisionRect(this, 845, 355, 530, 90, 0xff0000); // parede
        addCollisionRect(this, 975, 200, 457, 80, 0xff0000); // parede
        addCollisionRect(this, 400, 200, 325, 80, 0xff0000); // parede
        addCollisionRect(this, 1123, 810, 325, 70, 0xff0000); // parede
        addCollisionRect(this, 783, 810, 150, 70, 0xff0000); // parede
        addCollisionRect(this, 800, 642, 357, 90, 0xff0000); // parede
        addCollisionRect(this, 820, 492, 340, 70, 0xff0000); // parede
        addCollisionRect(this, 658, 470, 20, 140, 0xff0000); // parede
        addCollisionRect(this, 1102, 470, 20, 140, 0xff0000); // parede
        addCollisionRect(this, 1102, 695, 20, 160, 0xff0000); // parede

        console.log("Debug: pressione F9 para mostrar/ocultar colisões");

      // Adiciona colisões entre o jogador e as camadas de colisão COM VERIFICAÇÃO
      const layers = [paredeLayer].filter((layer) => layer !== null);

      layers.forEach((layer) => {
        if (layer) {
          layer.setCollisionByProperty({ collider: true });
          this.physics.add.collider(player, layer);
        }
      });

      // Adicionar colisão com os retângulos manuais
      this.physics.add.collider(player, manualColliders);
}

function updateMain() {
  if (!this.cursors || !player || !player.body) return;
  const speed = 160;

  const leftPressed =
    this.cursors.left.isDown ||
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A).isDown;
  const rightPressed =
    this.cursors.right.isDown ||
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D).isDown;
  const upPressed =
    this.cursors.up.isDown ||
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W).isDown;
  const downPressed =
    this.cursors.down.isDown ||
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S).isDown;

  // Reset velocity
  player.setVelocity(0);
  
  // Apply velocity based on input
  if (leftPressed) {
    player.setVelocityX(-speed);
    player.setFlipX(true);
    player.anims.play('walk_side', true);
  } else if (rightPressed) {
    player.setVelocityX(speed);
    player.setFlipX(false);
    player.anims.play('walk_side', true);
  } else if (upPressed) {
    player.setVelocityY(-speed);
    player.anims.play('walk_up', true);
  } else if (downPressed) {
    player.setVelocityY(speed);
    player.anims.play('walk_down', true);
  } else {
    // Set idle animation based on the last direction
    if (player.anims.currentAnim) {
      const currentAnim = player.anims.currentAnim.key;
      if (currentAnim === 'walk_side') {
        player.anims.play('idle_side', true);
      } else if (currentAnim === 'walk_up') {
        player.anims.play('idle_back', true);
      } else if (currentAnim === 'walk_down') {
        player.anims.play('idle_front', true);
      }
    } else {
      player.anims.play('idle_front', true);
    }
  }

  // Allow diagonal movement with normalized speed
  if ((leftPressed || rightPressed) && (upPressed || downPressed)) {
    // Normalize the velocity to prevent faster diagonal movement
    player.body.velocity.normalize().scale(speed);
  }
}

// Inicializa o jogo após configuração
function startGame() {
  // Get the selected character from localStorage
  const selectedCharacter = localStorage.getItem("currentCharacter") || "player1";
  
  // Configuração das animações
  if (!this.anims.exists(`idle_front`)) {
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

  // Inicializa controles
  this.cursors = this.input.keyboard.createCursorKeys();
}

// Inicializar a configuração quando o Phaser estiver carregado
initializaConfig();

