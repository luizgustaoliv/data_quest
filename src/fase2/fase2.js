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
// Adicionar variáveis para o sistema de iluminação
let darkness;
let lightMask;
let spotlight;
let lightRadius = 10000; // Raio da luz ao redor do jogador tem que ser 100

// Add at the top with other variable declarations
let isPlayingMinigame = false;
let lastPlayerPosition = {};
let warningText;
let minigameContainer;
let questions = [
  {
    question: "📱Você finalmente decidiu comprar aquele celular dos seus sonhos e encontrou um bom preço em uma loja virtual. Na hora de se cadastrar, a loja solicita seu CPF para finalizar a compra. Isso está certo ou errado?",
    answer: true,
    feedback: "A solicitação do CPF pode ser justificada para a emissão da nota fiscal e para evitar fraudes, conforme permitido pela LGPD. No entanto, a loja deve informar de forma clara o motivo da coleta desse dado e garantir sua segurança. Se o CPF for solicitado sem justificativa válida, pode ser considerado um excesso na coleta de dados."
  },
  {
    question: "📶 Você está passeando no shopping e decide usar o Wi-Fi gratuito para economizar seu plano de dados. Ao tentar se conectar, a rede pede obrigatoriamente que você informe seu nome, telefone e data de nascimento antes de liberar o acesso. Isso está certo ou errado?",
    answer: false,
    feedback: "Embora o shopping possa coletar alguns dados para fins de segurança ou marketing, a LGPD exige que isso seja feito de forma transparente e proporcional. Pedir nome, telefone e data de nascimento pode ser considerado uma coleta excessiva, principalmente se não houver uma explicação clara sobre o uso dessas informações. Além disso, o usuário deve ter a opção de negar a coleta e ainda assim poder acessar o serviço."
  },
  {
    question: "📰 Você está navegando em um site de notícias quando aparece um pop-up oferecendo descontos exclusivos para assinantes da newsletter. Para se inscrever, o site solicita seu e-mail. Isso está certo ou errado?",
    answer: true,
    feedback: "Pedir o e-mail para assinatura de uma newsletter é uma prática comum e legítima, desde que o site informe claramente a finalidade do uso do dado e obtenha seu consentimento. Além disso, a LGPD exige que o usuário tenha a opção de cancelar a assinatura a qualquer momento."
  },
  {
    question: "💼 Você se candidatou a uma vaga de emprego e, durante o processo seletivo, a empresa pede que você informe sua religião e orientação política. Isso está certo ou errado?",
    answer: false,
    feedback: "De acordo com a LGPD, informações sobre religião e orientação política são dados sensíveis, ou seja, exigem um nível maior de proteção e só podem ser coletados em situações extremamente específicas e justificadas por lei. No contexto de uma entrevista de emprego, essa solicitação não é relevante para a contratação e pode ser considerada uma violação da privacidade do candidato."
  },
  {
    question: "📲 Você baixou um novo aplicativo de rede social e, ao criar sua conta, ele solicita acesso à sua lista de contatos para 'ajudar a encontrar amigos'. Isso está certo ou errado?",
    answer: false,
    feedback: "Embora a funcionalidade possa ser útil, a LGPD exige que o aplicativo informe de forma clara para que os contatos serão usados, se serão armazenados e com quem serão compartilhados. Além disso, o usuário deve ter a opção de negar o acesso e ainda assim usar o aplicativo normalmente. Se o app exigir essa permissão sem alternativa, pode estar infringindo a lei."
  },
  {
    question: "📲 Você baixou um aplicativo de anotações e, ao abrir, ele pede permissão para acessar sua câmera. Isso está certo ou errado?",
    answer: false,
    feedback: "Se o app de anotações não tem funcionalidades que justifiquem o uso da câmera, essa solicitação pode ser considerada uma coleta de dados desnecessária, indo contra a LGPD. O aplicativo deve solicitar apenas os dados estritamente necessários para sua funcionalidade."
  },
  {
    question: "🎮 Você baixou um jogo no celular e, ao abrir pela primeira vez, ele pede permissão para acessar o microfone, mesmo sem ter chat por voz. Isso está certo ou errado?",
    answer: false,
    feedback: "Se o jogo não tem nenhuma função que use o microfone, não faz sentido ele pedir essa permissão. A LGPD diz que aplicativos só devem coletar dados necessários para o seu funcionamento. Pode ser um sinal de que o jogo está coletando mais informações do que deveria!"
  },
  {
    question: "📱 Você criou uma conta em uma rede social nova e, antes de começar a usar, ela pede sua data de nascimento. Isso está certo ou errado?",
    answer: true,
    feedback: "As redes sociais precisam saber sua idade para garantir que você pode usá-las de acordo com a lei. Algumas plataformas têm restrições para menores de idade, e a LGPD protege crianças e adolescentes de exposições indevidas na internet."
  },
  {
    question: "🎥 Você gosta de assistir vídeos online, mas percebe que a plataforma sempre recomenda conteúdos parecidos com o que você assistiu antes. Isso significa que ela está coletando seu histórico de vídeos. Isso está certo ou errado?",
    answer: true,
    feedback: "A plataforma pode usar seu histórico para sugerir vídeos melhores para você. Mas, pela LGPD, ela deve avisar que está coletando esses dados e permitir que você apague seu histórico ou controle o que pode ser armazenado."
  },
  {
    question: "🎤 Você quer participar de um concurso de talentos online e, para se inscrever, o site pede seu endereço completo. Isso está certo ou errado?",
    answer: false,
    feedback: "Para um concurso online, pedir o endereço pode ser um excesso. A LGPD diz que só se deve coletar informações realmente necessárias. Se não houver envio de prêmios físicos, essa informação não deveria ser solicitada."
  }
];

// Add a variable at the top with other variable declarations
let lastRobotPosition = {};

// Add these variables at the top
let robots = []; // Array to store all robot instances
let currentCollisionRobot = null; // Track which robot triggered the collision

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
  this.load.spritesheet("robo1", "../../assets/fase2/sprites/robolado.png", {
    frameWidth: 64,
    frameHeight: 64,
  });
  this.load.spritesheet("robocima", "../../assets/fase2/sprites/robocima.png", {
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
    player.setDepth(2);

    // Create multiple robots at different positions
    createRobot.call(this, 143, 390, 560, 143); // Original robo1
    createRobot.call(this, 800, 880, 1000, 800); // Robo2
    createRobot.call(this, 750, 550, 1100, 750); // robo 3
    
    createVerticalRobot.call(this, 1195, 300, 730, 300); // robo vertical

    createVerticalRobot.call(this, 345, 500, 730, 500); // robo vertical

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

      // Criar sistema de iluminação após configurar a câmera
      createLightingSystem.call(this);

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

      // Criar elementos do minigame antes de configurar colisões
      const minigameElements = createMinigameElements.call(this);
    
      // Configure overlap for all robots
      robots.forEach(robot => {
        this.physics.add.overlap(player, robot, () => {
          currentCollisionRobot = robot; // Track which robot triggered the collision
          handleRobotCollision.call(this);
        }, null, this);
      });
}

function updateMain() {
  if (!this.cursors || !player || !player.body || isPlayingMinigame) return;
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

  // Atualizar posição da luz para seguir o jogador
  if (lightMask && spotlight) {
    lightMask.setPosition(player.x, player.y);
    spotlight.setPosition(player.x, player.y);
  }

  // Update all robots with better boundary checking
  robots.forEach(robot => {
    if (robot.visible && robot.body.enable) {
      const robotSpeed = 100;
      
      if (robot.isVertical) {
        // Vertical movement logic
        if (robot.movingDown) {
          robot.setVelocityY(robotSpeed);
          robot.play("robo_walk_down", true);
          if (robot.y >= robot.bottomBound) {
            robot.movingDown = false;
          }
        } else {
          robot.setVelocityY(-robotSpeed);
          robot.play("robo_walk_up", true);
          if (robot.y <= robot.topBound) {
            robot.movingDown = true;
          }
        }
      } else {
        // Horizontal movement logic - existing code
        if (robot.movingRight) {
          robot.setVelocityX(robotSpeed);
          robot.setFlipX(false);
          if (robot.x >= robot.rightBound) {
            robot.movingRight = false;
          }
        } else {
          robot.setVelocityX(-robotSpeed);
          robot.setFlipX(true);
          if (robot.x <= robot.leftBound) {
            robot.movingRight = true;
          }
        }
      }
    } else {
      // If robot is hidden due to minigame, make sure it doesn't move
      robot.setVelocity(0, 0);
    }
  });
}

// Função para criar o sistema de iluminação
function createLightingSystem() {
  // Criar camada de escuridão que cobre toda a área do jogo
  darkness = this.add.rectangle(
    0, 
    0, 
    map2.widthInPixels * 2, 
    map2.heightInPixels * 2, 
    0x000000, 
    0.95
  );
  darkness.setOrigin(0, 0);
  darkness.setDepth(1000); // Garantir que fique acima de todas as camadas do jogo
  
  // Criar máscara de luz circular
  lightMask = this.add.circle(player.x, player.y, lightRadius, 0xffffff);
  lightMask.setVisible(false); // A máscara não precisa ser visível
  
  // Criar spotlight visual (opcional - para dar um efeito de brilho)
  spotlight = this.add.circle(player.x, player.y, lightRadius, 0xffffff, 0.0);
  spotlight.setDepth(999); // Abaixo da escuridão
  
  // Aplicar máscara à camada de escuridão
  const mask = new Phaser.Display.Masks.GeometryMask(this, lightMask);
  mask.invertAlpha = true; // Inverte a máscara para que ela "corte" a escuridão
  darkness.setMask(mask);
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

  // Add robo1 animation
  this.anims.create({
    key: "robo_walk",
    frames: [
      { key: "robo1", frame: 0 },
      { key: "robo1", frame: 1 }
    ],
    frameRate: 4,
    repeat: -1
  });
  
  // Add vertical robot animations
  this.anims.create({
    key: "robo_walk_down",
    frames: [
      { key: "robocima", frame: 0 }, // standing frame
      { key: "robocima", frame: 1 },
      { key: "robocima", frame: 2 },
      { key: "robocima", frame: 1 },
      { key: "robocima", frame: 2 }
    ],
    frameRate: 7,
    repeat: -1
  });
  
  this.anims.create({
    key: "robo_walk_up",
    frames: [
      { key: "robocima", frame: 3 }, // standing frame
      { key: "robocima", frame: 4 },
      { key: "robocima", frame: 5 },
      { key: "robocima", frame: 4 },
      { key: "robocima", frame: 5 }
    ],
    frameRate: 7,
    repeat: -1
  });

  // Play animation for all robots
  robots.forEach(robot => {
    if (robot.isVertical) {
      robot.play(robot.movingDown ? "robo_walk_down" : "robo_walk_up");
    } else {
      robot.play("robo_walk");
    }
  });

  // Inicializa controles
  this.cursors = this.input.keyboard.createCursorKeys();
}

// Add these new functions
function handleRobotCollision() {
  console.log("Colisão com robô detectada!"); // Debug
  if (isPlayingMinigame) return;
  
  isPlayingMinigame = true;
  lastPlayerPosition = { x: player.x, y: player.y };
  
  // Save position of ONLY the robot that caused the collision
  lastRobotPosition = { 
    x: currentCollisionRobot.x, 
    y: currentCollisionRobot.y,
    movingRight: currentCollisionRobot.movingRight,
    robot: currentCollisionRobot // Store reference to the actual robot
  };
  
  // Freeze ALL robots (disable physics) but only hide the one that caused collision
  robots.forEach(robot => {
    // Stop all robots by disabling physics
    robot.body.enable = false;
    robot.setVelocity(0, 0);
    
    // But only hide the one that collided with player
    if (robot === currentCollisionRobot) {
      robot.setVisible(false);
    }
  });
  
  // Completely disable player movement
  player.setVelocity(0, 0);
  player.body.moves = false; // This prevents any physics movement
  
  // Mostrar aviso
  if (warningText) {
    warningText.setVisible(true);
    
    // Esconder aviso e mostrar minigame após 5 segundos
    this.time.delayedCall(3000, () => {
      warningText.setVisible(false);
      showMinigame.call(this);
    });
  } else {
    console.error("warningText não foi inicializado!");
  }
}

function showMinigame() {
  const randomQuestion = Phaser.Math.RND.pick(questions);
  
  // Update question text
  minigameContainer.questionText.setText(randomQuestion.question);
  
  // Clear previous listeners to prevent duplicate handling
  minigameContainer.trueBtn.removeAllListeners('pointerdown');
  minigameContainer.trueBtn.removeAllListeners('pointerdown');
  
  // Add new click handlers
  minigameContainer.trueBtn.on('pointerdown', () => {
    console.log('TRUE button clicked');
    handleAnswer.call(this, true, randomQuestion.answer, randomQuestion);
  });
  
  minigameContainer.falseBtn.on('pointerdown', () => {
    console.log('FALSE button clicked');
    handleAnswer.call(this, false, randomQuestion.answer, randomQuestion);
  });
  
  // Show the minigame
  minigameContainer.setVisible(true);
}

function handleAnswer(playerAnswer, correctAnswer, questionObj) {
  console.log(`Button clicked: ${playerAnswer}, correct answer: ${correctAnswer}`);
  
  // Prevent multiple clicks
  minigameContainer.trueBtn.disableInteractive();
  minigameContainer.falseBtn.disableInteractive();
  
  // Provide visual feedback
  const button = playerAnswer ? minigameContainer.trueBtn : minigameContainer.falseBtn;
  const color = playerAnswer === correctAnswer ? 0x00ff00 : 0xff0000;
  
  button.setFillStyle(color);
  
  // Hide question and show feedback
  this.time.delayedCall(500, () => {
    // Hide question elements
    minigameContainer.questionText.setVisible(false);
    minigameContainer.trueBtn.setVisible(false);
    minigameContainer.trueText.setVisible(false);
    minigameContainer.falseBtn.setVisible(false);
    minigameContainer.falseText.setVisible(false);
    
    // Set feedback color based on answer correctness
    const feedbackBoxColor = playerAnswer === correctAnswer ? 0x006600 : 0x660000;
    minigameContainer.feedbackBox.setFillStyle(feedbackBoxColor);
    
    // Show result text with appropriate message
    minigameContainer.resultText.setText(playerAnswer === correctAnswer ? "VOCÊ ACERTOU!" : "VOCÊ ERROU!");
    minigameContainer.resultText.setFill(playerAnswer === correctAnswer ? '#00ff00' : '#ff0000');
    minigameContainer.resultText.setVisible(true);
    
    // Show feedback elements
    minigameContainer.feedbackBox.setVisible(true);
    minigameContainer.feedbackText.setText(questionObj.feedback);
    minigameContainer.feedbackText.setVisible(true);
    minigameContainer.continueBtn.setVisible(true);
    minigameContainer.continueText.setVisible(true);
    
    // Add click handler to continue button
    minigameContainer.continueBtn.once('pointerdown', () => {
      // Hide feedback and minigame
      minigameContainer.setVisible(false);
      isPlayingMinigame = false;
      
      // Re-enable player movement
      player.body.moves = true;
      
      // Reset visibility states for next time
      minigameContainer.questionText.setVisible(true);
      minigameContainer.trueBtn.setVisible(true);
      minigameContainer.trueText.setVisible(true);
      minigameContainer.falseBtn.setVisible(true);
      minigameContainer.falseText.setVisible(true);
      minigameContainer.feedbackBox.setVisible(false);
      minigameContainer.feedbackText.setVisible(false);
      minigameContainer.resultText.setVisible(false);
      minigameContainer.continueBtn.setVisible(false);
      minigameContainer.continueText.setVisible(false);
      
      // Reset button colors
      minigameContainer.trueBtn.setFillStyle(0x008000);
      minigameContainer.falseBtn.setFillStyle(0x800000);
      minigameContainer.trueBtn.setInteractive();
      minigameContainer.falseBtn.setInteractive();
      
      // Handle player consequence
      if (playerAnswer !== correctAnswer) {
        player.setPosition(670, 1000);
        console.log('Wrong answer! Back to start.');
      } else {
        console.log('Correct answer! Continue playing.');
      }
      
      // Re-enable ALL robots after 5 seconds
      this.time.delayedCall(5000, () => {
        robots.forEach(robot => {
          // Re-enable physics for all robots
          robot.body.enable = true;
          
          // Only need to make the collision robot visible again
          if (robot === lastRobotPosition.robot) {
            robot.setPosition(lastRobotPosition.x, lastRobotPosition.y);
            robot.movingRight = lastRobotPosition.movingRight;
            robot.setVisible(true);
          }
        });
        console.log('Robots resumed movement');
      });
    });
  });
}

// Add to createMain after physics setup
function createMinigameElements() {
  // Create fixed position elements that don't scroll with the camera
  warningText = this.add.text(
    this.cameras.main.width / 2,
    this.cameras.main.height / 2,
    "Oh Não, você foi pego pelo robô anti LGPD!\nResponda uma questão a seguir para continuar de onde está,\ncaso erre, vai voltar do inicio do mapa",
    {
      fontSize: '20px',
      fill: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 10, y: 5 },
      align: 'center'
    }
  ).setOrigin(0.5);
  warningText.setScrollFactor(0);
  warningText.setDepth(3000);
  warningText.setVisible(false);

  // Create simple minigame container
  minigameContainer = this.add.container(0, 0);
  minigameContainer.setScrollFactor(0);
  minigameContainer.setDepth(3000);
  minigameContainer.setVisible(false);

  // Semi-transparent overlay background
  const overlay = this.add.rectangle(
    this.cameras.main.width / 2, 
    this.cameras.main.height / 2,
    this.cameras.main.width,
    this.cameras.main.height,
    0x000000, 0.8
  );
  overlay.setScrollFactor(0);

  // Dialog background
  const bg = this.add.rectangle(
    this.cameras.main.width / 2, 
    this.cameras.main.height / 2,
    600, 300, 0x333333, 1
  );
  bg.setScrollFactor(0);
  bg.setStrokeStyle(4, 0xffffff);

  // Question text
  const questionText = this.add.text(
    this.cameras.main.width / 2,
    this.cameras.main.height / 2 - 80,
    '', {
      fontSize: '16px',
      fill: '#ffffff',
      wordWrap: { width: 500 },
      align: 'center'
    }
  ).setOrigin(0.5);
  questionText.setScrollFactor(0);

  // Simpler button creation - TRUE button
  const trueBtn = this.add.rectangle(
    this.cameras.main.width / 2 - 120,
    this.cameras.main.height / 2 + 80,
    200, 60, 0x008000
  );
  trueBtn.setScrollFactor(0);
  trueBtn.setInteractive({ useHandCursor: true });
  
  const trueText = this.add.text(
    trueBtn.x, trueBtn.y,
    'CERTO', {
      fontSize: '18px',
      fill: '#ffffff',
    }
  ).setOrigin(0.5);
  trueText.setScrollFactor(0);

  // FALSE button
  const falseBtn = this.add.rectangle(
    this.cameras.main.width / 2 + 120,
    this.cameras.main.height / 2 + 80,
    200, 60, 0x800000
  );
  falseBtn.setScrollFactor(0);
  falseBtn.setInteractive({ useHandCursor: true });
  
  const falseText = this.add.text(
    falseBtn.x, falseBtn.y,
    'ERRADO', {
      fontSize: '18px',
      fill: '#ffffff',
    }
  ).setOrigin(0.5);
  falseText.setScrollFactor(0);

  // Add simple hover effects
  trueBtn.on('pointerover', () => {
    trueBtn.setScale(1.1);
    trueText.setScale(1.1);
    console.log('Hover on TRUE button');
  });
  
  trueBtn.on('pointerout', () => {
    trueBtn.setScale(1.0);
    trueText.setScale(1.0);
  });
  
  falseBtn.on('pointerover', () => {
    falseBtn.setScale(1.1);
    falseText.setScale(1.1);
    console.log('Hover on FALSE button');
  });
  
  falseBtn.on('pointerout', () => {
    falseBtn.setScale(1.0);
    falseText.setScale(1.0);
  });

  // Add all elements to container
  minigameContainer.add([overlay, bg, questionText, trueBtn, trueText, falseBtn, falseText]);

  // Store references
  minigameContainer.questionText = questionText;
  minigameContainer.trueBtn = trueBtn;
  minigameContainer.trueText = trueText;
  minigameContainer.falseBtn = falseBtn;
  minigameContainer.falseText = falseText;

  // Add feedback text element (initially hidden)
  const feedbackBox = this.add.rectangle(
    this.cameras.main.width / 2, 
    this.cameras.main.height / 2,
    550, 250, 0x000066, 1
  );
  feedbackBox.setScrollFactor(0);
  feedbackBox.setStrokeStyle(4, 0xffffff);
  feedbackBox.setVisible(false);

  const feedbackText = this.add.text(
    this.cameras.main.width / 2,
    this.cameras.main.height / 2 - 30,
    '', {
      fontSize: '14px',
      fill: '#ffffff',
      wordWrap: { width: 500 },
      align: 'center'
    }
  ).setOrigin(0.5);
  feedbackText.setScrollFactor(0);
  feedbackText.setVisible(false);
  // Continue button (shown with feedback)
  const continueBtn = this.add.rectangle(
    this.cameras.main.width / 2,
    this.cameras.main.height / 2 + 80, // Changed from +60 to +73 (13 pixels down)
    140, 40, 0x0066ff, 1
  );
  continueBtn.setScrollFactor(0);
  continueBtn.setInteractive({ useHandCursor: true });
  continueBtn.setVisible(false);
  
  const continueText = this.add.text(
    continueBtn.x, continueBtn.y,
    'CONTINUAR', {
      fontSize: '18px',
      fill: '#ffffff',
    }
  ).setOrigin(0.5);
  continueText.setScrollFactor(0);
  continueText.setVisible(false);

  // Add hover effect to continue button
  continueBtn.on('pointerover', () => {
    continueBtn.setScale(1.1);
    continueText.setScale(1.1);
  });
  
  continueBtn.on('pointerout', () => {
    continueBtn.setScale(1.0);
    continueText.setScale(1.0);
  });

  // Add feedback elements to the container
  minigameContainer.add([feedbackBox, feedbackText, continueBtn, continueText]);

  // Store references to feedback elements
  minigameContainer.feedbackBox = feedbackBox;
  minigameContainer.feedbackText = feedbackText;
  minigameContainer.continueBtn = continueBtn;
  minigameContainer.continueText = continueText;

  // Add result header text above feedback
  const resultText = this.add.text(
    this.cameras.main.width / 2,
    this.cameras.main.height / 2 - 80,
    '', {
      fontSize: '18px',
      fontStyle: 'bold',
      fill: '#ffffff',
      align: 'center'
    }
  ).setOrigin(0.5);
  resultText.setScrollFactor(0);
  resultText.setVisible(false);

  // Adjust the feedback text position to make room for the header
  feedbackText.setY(this.cameras.main.height / 2 - 10);

  // Add result text to container and store reference
  minigameContainer.add([resultText]);
  minigameContainer.resultText = resultText;

  return minigameContainer;
}

// Create a robot with specified position and horizontal movement range
function createRobot(startX, startY, rightBound, leftBound) {
  const robot = this.physics.add.sprite(startX, startY, "robo1");
  robot.setScale(1);
  robot.body.setSize(23, 60);
  robot.body.setOffset(19, 2);
  robot.setImmovable(true);
  robot.setDepth(1);
  
  // Add custom properties for movement
  robot.rightBound = rightBound;
  robot.leftBound = leftBound;
  robot.movingRight = true;
  robot.isVertical = false; // Flag to indicate this is a horizontal robot
  
  // Add to array of robots
  robots.push(robot);
  
  return robot;
}

// Create a robot that moves vertically
function createVerticalRobot(startX, startY, bottomBound, topBound) {
  const robot = this.physics.add.sprite(startX, startY, "robocima");
  robot.setScale(1);
  robot.body.setSize(37, 60);
  robot.body.setOffset(14, 2);
  robot.setImmovable(true);
  robot.setDepth(1);
  
  // Add custom properties for vertical movement
  robot.topBound = topBound;
  robot.bottomBound = bottomBound;
  robot.movingDown = true; // Start moving down
  robot.isVertical = true; // Flag to indicate this is a vertical robot
  
  // Add to array of robots
  robots.push(robot);
  
  return robot;
}

// Inicializar a configuração quando o Phaser estiver carregado
initializaConfig();

