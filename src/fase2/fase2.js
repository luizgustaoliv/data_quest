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
    player = this.physics.add.sprite(670, 1000, "player");
    player.setScale(1.0);

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

        addCollisionRect(this, 160, 200, 60, 70, 0xff0000); // estante zeladoria
        addCollisionRect(this, 160, 265, 40, 40, 0xff0000); // carrinho zeladoria limpezq

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
  // Configuração das animações
      // Criação de animações para o personagem
      if ("idle_front") {
        this.anims.create({
          key: "idle_front",
          frames: [{ key: "player", frame: 0 }],
          frameRate: 1,
          repeat: -1,
        });

        this.anims.create({
          key: "idle_back",
          frames: [{ key: "player", frame: 5 }],
          frameRate: 1,
          repeat: -1,
        });

        this.anims.create({
          key: "idle_side",
          frames: [{ key: "player", frame: 3 }],
          frameRate: 1,
          repeat: -1,
        });

        this.anims.create({
          key: "walk_down",
          frames: [
            { key: "player", frame: 0 },
            { key: "player", frame: 1 },
            { key: "player", frame: 0 },
            { key: "player", frame: 2 },
          ],
          frameRate: 7,
          repeat: -1,
        });

        this.anims.create({
          key: "walk_side",
          frames: [
            { key: "player", frame: 3 },
            { key: "player", frame: 4 },
          ],
          frameRate: 7,
          repeat: -1,
        });

        this.anims.create({
          key: "walk_up",
          frames: [
            { key: "player", frame: 5 },
            { key: "player", frame: 6 },
            { key: "player", frame: 5 },
            { key: "player", frame: 7 },
          ],
          frameRate: 7,
          repeat: -1,
        });
  };

  // Inicializa controles
  this.cursors = this.input.keyboard.createCursorKeys();
}

// Inicializar a configuração quando o Phaser estiver carregado
initializaConfig();

