// Adicionar no início do arquivo, antes de qualquer outro código
//Fase 2
(function removePhase1HUDs() {
    // Remover os elementos do DOM imediatamente8
    const elementsToRemove = [
        'keycard-container',
        'key-container',
        'missions-button',
        'missions-panel',
        'missions-overlay'
    ];

    elementsToRemove.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.remove();
        }
    });

    // Adicionar CSS que força os elementos a ficarem ocultos caso sejam recriados
    const forceHideStyle = document.createElement('style');
    forceHideStyle.textContent = `
        #keycard-container, #key-container, #missions-button, #missions-panel, #missions-overlay {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
            position: absolute !important;
            z-index: -9999 !important;
        }
    `;
    document.head.appendChild(forceHideStyle);

    // Criar um observer para remover elementos se forem recriados
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.id && elementsToRemove.includes(node.id)) {
                    node.remove();
                }
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();

window.addEventListener("load", () => {
  document.body.classList.add("fade-in");
  removePhase1HUDs();
});

// Remover HUDs da fase 1 antes de iniciar a fase 2
function removePhase1HUDs() {
  // Array com os IDs dos elementos da fase 1 que precisam ser removidos
  const phase1Elements = [
    'keycard-container',
    'keyIcon',
    'key-container',
    'missions-button',
    'missions-panel',
    'missions-overlay'
  ];

  // Remover cada elemento se existir
  phase1Elements.forEach(elementId => {
    const element = document.getElementById(elementId);
    if (element) {
      element.remove();
    }
  });

  // Remover também qualquer estilo da fase 1
  const oldStyles = document.querySelectorAll('style');
  oldStyles.forEach(style => {
    if (style.textContent.includes('keycard-container') || 
        style.textContent.includes('key-container') || 
        style.textContent.includes('missions-button')) {
      style.remove();
    }
  });
}

// Variáveis para os elementos da HUD
let keyPass2Container;
let keyPass2Icon;
let keyPass2Counter;
let hudCreated = false;

// Add after other variable declarations, around line 60-70
let key2Collected = false; // Flag to track if key was collected

// Adicionar estilos via JavaScript
const style2 = document.createElement("style");
style2.textContent = `
  #keypass2-container {
    position: fixed;
    top: 10px;
    right: 10px;
    display: flex;
    align-items: center;
    background: rgba(0, 0, 0, 0.7);
    padding: 10px;
    border-radius: 10px;
    border: 2px solid white;
    color: white;
    font-family: Arial, sans-serif;
    font-size: 18px;
    gap: 10px;
    z-index: 1000;
  }
  
  #keypass2-icon {
    width: 40px;
    height: 40px;
  }
  
  #keypass2-counter {
    font-weight: bold;
    font-size: 22px;
  }
`;
document.head.appendChild(style2);

// Remover qualquer elemento da fase1 que possa ter sido criado
document.addEventListener('DOMContentLoaded', () => {
  removePhase1HUDs();

  // Criar elementos da fase2
  createHUDElements();
});

// Inicialização principal da fase 2 - chamada explícita quando o script é carregado
function initializeFase2() {
  console.log("Inicializando fase 2...");
  
  // Criar elementos da HUD
  createHUDElements();
  
  // Chamar a inicialização da configuração do Phaser
  initializaConfig2();
  
  console.log("Fase 2 inicializada com sucesso!");
}

// Função para criar elementos da HUD
function createHUDElements() {
  // Remover HUD existente se houver
  const existingHUD = document.getElementById('keypass-container');
  if (existingHUD) {
    existingHUD.remove();
  }

  // Criar novo container
  keyPass2Container = document.createElement("div");
  keyPass2Container.id = "keypass2-container";
  document.body.appendChild(keyPass2Container);

  // Criar ícone
  keyPass2Icon = document.createElement("img");
  keyPass2Icon.id = "keypass2-icon";
  keyPass2Icon.src = "assets/fase2/sprites/spriteChave.png";
  keyPass2Icon.alt = "KeyPass";
  keyPass2Container.appendChild(keyPass2Icon);

  // Criar contador
  keyPass2Counter = document.createElement("span");
  keyPass2Counter.id = "keypass2-counter";
  keyPass2Counter.textContent = "0/4";
  keyPass2Container.appendChild(keyPass2Counter);

  hudCreated = true;
}

// Atualizar a função de coleta de chaves
function collectKey2(player2, key) {
  // Check if this specific key was already collected
  if (key.collected) return;
  
  // Mark this key as collected
  key.collected = true;
  keys2Collected++;
  
  // Update the HUD counter
  if (!keyPass2Counter) {
    // If counter reference is missing, try to get it
    keyPass2Counter = document.getElementById('keypass2-counter');
  }
  
  if (keyPass2Counter) {
    keyPass2Counter.textContent = `${keys2Collected}/4`;
    console.log("HUD updated:", keyPass2Counter.textContent);
  } else {
    console.warn("HUD counter element not found!");
  }

  // Update key visual
  key.disableBody(true, true);
  
  console.log("Key collected! Total:", keys2Collected);
}

// Criando o contêiner da HUD
const keyPassContainer = document.createElement("div");
keyPassContainer.id = "keypass-container";
document.body.appendChild(keyPassContainer);

// Criando o ícone do keyPass
const keyPassIcon = document.createElement("img");
keyPassIcon.id = "keypass-icon";
keyPassIcon.src = "assets/fase2/sprites/spriteChave.png";
keyPassIcon.alt = "KeyPass";
keyPassContainer.appendChild(keyPassIcon);

// Criando o contador de keyPass
const keyPassCounter = document.createElement("span");
keyPassCounter.id = "keypass-counter";
keyPassCounter.textContent = "0/4";
keyPassContainer.appendChild(keyPassCounter);

// Adicionando estilos via JavaScript
const style = document.createElement("style");
style.textContent = `
  #keypass-container {
    position: fixed;
    top: 10px;
    right: 10px;
    display: flex;
    align-items: center;
    background: rgba(0, 0, 0, 0.7);
    padding: 10px;
    border-radius: 10px;
    border: 2px solid white;
    color: white;
    font-family: Arial, sans-serif;
    font-size: 18px;
    gap: 10px;
    z-index: 1000;
  }
  
  #keypass-icon {
    width: 40px;
    height: 40px;
  }
  
  #keypass-counter {
    font-weight: bold;
    font-size: 22px;
  }
`;
document.head.appendChild(style)

// Definir config só quando Phaser estiver carregado
let config2;

function initializaConfig2() {
  if (!window.Phaser) {
    console.error("Phaser não está disponível para inicializar config");
    return;
  }

  config2 = {
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
      key: "main2",
      preload: preloadMain2,
      create: createMain2,
      update: updateMain2,
    },
  };

  // Inicializar Phaser com a configuração
  new Phaser.Game(config2);
}

// Variável para contar as chaves coletadas
let keys2Collected = 0;

let player2 = {};
player2.x = 100;
let map2;
let podeIniciarDialogo2 = false;
let dialogoIniciado2 = false;
let avisoTexto2;
let textoDialogo2;
let caixaDialogo2, sombra2, personagem2, npc1Image2;
let chaoLayer2;
let paredeLayer2;
let objSemColisaoLayer2;
let colisaoLayer2;
let obj2ColisaoLayer2;
let cursors2;
let elevator2;
let estantes1Layer, estantes2Layer, estantes3Layer, estantes4Layer;
// Adicionar variáveis para o sistema de iluminação
let darkness2;
let lightMask2;
let spotlight2;
let lightRadius2 = 100; // Raio da luz ao redor do jogador tem que ser 100

// Variáveis para as chaves
let key1, key2, key3, key4;

// Add at the top with other variable declarations
let isPlayingMinigame2 = false;
let lastPlayerPosition2 = {};
let warningText2;
let minigameContainer2;
let questions2 = [
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
    question: "📲 Você baixou um novo aplicativo de rede social e, ao criar sua conta, ele solicita obrigatoriamente o acesso à sua lista de contatos para 'ajudar a encontrar amigos'. Isso está certo ou errado?",
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
let lastRobotPosition2 = {};

// Add these variables at the top
let robots2 = []; // Array to store all robot instances
let currentCollisionRobot2 = null; // Track which robot triggered the collision

// Adicionar variáveis para o tutorial
let tutorialContainer2;
let tutorialActive2 = false;
let tutorialStep2 = 0;
let tutorialMessages2 = [
  "Parabéns por salvar as professoras-robôs! Você foi muito bem",
  "Sua missão aqui é navegar pela biblioteca enquanto evita os robôs. Se um robô te pegar, você terá que responder a uma pergunta sobre LGPD.",
  "Acerte a pergunta para continuar de onde parou. Se errar, voltará ao início da fase :(",
  "Cuidado, o hacker apagou a luz e agora você só pode ver o que está próximo a você!",
  "Você deve achar o caminho certo até o próximo elevador.",
  "Boa sorte em sua missão para proteger os dados pessoais!"
];
let tutorialShown2 = false; // Controlar se o tutorial já foi mostrado

function preloadMain2() {
  // Load all possible player sprites
  this.load.spritesheet("player1", "assets/fase1/players/player1.png", {
    frameWidth: 64,
    frameHeight: 64,
  });
  this.load.spritesheet("player2", "assets/fase1/players/player2.png", {
    frameWidth: 64,
    frameHeight: 64,
  });
  this.load.spritesheet("player3", "assets/fase1/players/player3.png", {
    frameWidth: 64,
    frameHeight: 64,
  });
  this.load.spritesheet("player4", "assets/fase1/players/player4.png", {
    frameWidth: 64,
    frameHeight: 64,
  });
  this.load.spritesheet("player5", "assets/fase1/players/player5.png", {
    frameWidth: 64,
    frameHeight: 64,
  });
  this.load.spritesheet("player6", "assets/fase1/players/player6.png", {
    frameWidth: 64,
    frameHeight: 64,
  });
  this.load.spritesheet("elevator", "assets/fase2/elevator.png", {
    frameWidth: 32,
    frameHeight: 32,
  });
  this.load.spritesheet("robo1", "assets/fase2/sprites/robolado.png", {
    frameWidth: 64,
    frameHeight: 64,
  });
  this.load.spritesheet("robocima", "assets/fase2/sprites/robocima.png", {
    frameWidth: 64,
    frameHeight: 64,
  });
  
  // Keep default player as fallback
  this.load.spritesheet("player", "assets/fase1/players/player1.png", {
    frameWidth: 64,
    frameHeight: 64,
  });

  // Carregar o spritesheet (substitua os valores de frameWidth e frameHeight)
this.load.spritesheet("TvErro", "assets/fase2/sprites/tvanimada.png", {
  frameWidth: 64,  // largura de um frame
  frameHeight: 64, // altura de um frame
});

  // Carregar apenas a imagem do zelador para o tutorial
  this.load.image("zelador", "assets/dialogos/faxineiro.png");
  
  this.load.tilemapTiledJSON("map2json", "assets/fase2/fase2.json");
  this.load.image("fase2", "assets/fase2/fase2.png");
  this.load.image("5_Classroom_and_library_32x32", "assets/fase2/5_Classroom_and_library_32x32.png");
  this.load.image("19_Hospital_32x32", "assets/fase2/19_Hospital_32x32.png");
  this.load.image("Room_Builder_32x32", "assets/fase2/Room_Builder_32x32.png");
  this.load.image("Key", "assets/fase2/sprites/spriteChave.png");
}

function createMain2() {
  try {
    // Criar HUD antes de qualquer outra inicialização
    if (!hudCreated) {
      createHUDElements();
    }

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
        player2.updateName = function(newName) {
          nameTag.setText(newName);
          localStorage.setItem("playerName", newName);
        };
        
        // Update container position in update function
        this.events.on('update', () => {
          if (player2 && player2.nameContainer) {
          player2.nameContainer.setPosition(player2.x, player2.y);
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
            chaoLayer2 = map2.createLayer("chao", tilesets);
            console.log("chaoLayer created successfully");
          } catch (e) {
            console.warn("Couldn't create 'chão' layer:", e);
            chaoLayer2 = null;
          }
    
          try {
            paredeLayer2 = map2.createLayer("parede", tilesets);
            console.log("paredeLayer created successfully");
          } catch (e) {
            console.warn("Couldn't create 'parede' layer:", e);
            paredeLayer2 = null;
          }
    
          try {
            objSemColisaoLayer2 = map2.createLayer("obj_semcolisao", tilesets);
            console.log("objSemColisaoLayer created successfully");
          } catch (e) {
            console.warn("Couldn't create 'obj_semcolisao' layer:", e);
            objSemColisaoLayer2 = null;
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

          if (chaoLayer2) chaoLayer2.setScale(1.0);
          if (paredeLayer2) paredeLayer2.setScale(1.0);
          if (objSemColisaoLayer2) objSemColisaoLayer2.setScale(1.0);
          if (estantes1Layer) estantes1Layer.setScale(1.0);
          if (estantes2Layer) estantes2Layer.setScale(1.0); 
          if (estantes3Layer) estantes3Layer.setScale(1.0);
          if (estantes4Layer) estantes4Layer.setScale(1.0);   
 
    // Adiciona o sprite do personagem no mapa - posição inicial
    player2 = this.physics.add.sprite(670, 1000, selectedCharacter);
    player2.setScale(0.8);

    // Adicionar chaves com física
    key1 = this.physics.add.sprite(1150, 890, "Key");
    key2 = this.physics.add.sprite(555, 900, "Key");
    key3 = this.physics.add.sprite(1150, 750, "Key");
    key4 = this.physics.add.sprite(150, 260, "Key");
    
    // Configurar as chaves com efeito de flutuação
    [key1, key2, key3, key4].forEach(key => {
      key.setScale(0.7);
      key.body.setAllowGravity(false);
      key.setDepth(1);
      
      // Adicionar efeito de flutuação
      this.tweens.add({
        targets: key,
        y: key.y - 5,
        duration: 1500,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
      
      // Adicionar brilho leve
      this.tweens.add({
        targets: key,
        alpha: 0.8,
        duration: 2000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    });
    
    // Configurar colisões entre o jogador e as chaves
    this.physics.add.overlap(player2, key1, collectKey2, null, this);
    this.physics.add.overlap(player2, key2, collectKey2, null, this);
    this.physics.add.overlap(player2, key3, collectKey2, null, this);
    this.physics.add.overlap(player2, key4, collectKey2, null, this);

    // Ajusta o tamanho da hitbox do player
    player2.body.setSize(27, 8);
    player2.body.setOffset(19, 55.4);
    player2.setDepth(2);

    // Create multiple robots at different positions
    createRobot2.call(this, 143, 390, 560, 143); // Original robo1
    createRobot2.call(this, 800, 880, 1000, 800); // Robo2
    createRobot2.call(this, 750, 550, 1100, 750); // robo 3
    
    createVerticalRobot2.call(this, 1195, 300, 730, 300); // robo vertical

    createVerticalRobot2.call(this, 345, 500, 730, 500); // robo vertical

     // Ativa o modo de debug para visualizar a hitbox
    this.physics.world.drawDebug = false;
    this.physics.world.debugGraphic = this.add.graphics();

      // After creating all layers and the player, set up the camera correctly
      if (map2 && player2) {
        // Configure camera to follow player
        this.cameras.main.setBounds(0, 0, map2.widthInPixels, map2.heightInPixels);
        this.physics.world.setBounds(0, 0, map2.widthInPixels, map2.heightInPixels);
        this.cameras.main.startFollow(player2);
        this.cameras.main.setZoom(1.5);
      }

      // Criar sistema de iluminação após configurar a câmera
      createLightingSystem2.call(this);

      if (map2 && map2.layers && map2.layers.length > 0) {
        startGame2.call(this);
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

  const debugCollisions = false;

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
      const layers = [paredeLayer2].filter((layer) => layer !== null);

      layers.forEach((layer) => {
        if (layer) {
          layer.setCollisionByProperty({ collider: true });
          this.physics.add.collider(player2, layer);
        }
      });

      // Adicionar colisão com os retângulos manuais
      this.physics.add.collider(player2, manualColliders);
      
      // Inicializar elementos do minigame antes de configurar as colisões com robôs
      minigameContainer2 = createMinigameElements2.call(this);
    
      // Configure overlap for all robots
      robots2.forEach(robot => {
        this.physics.add.overlap(player2, robot, () => {
          currentCollisionRobot2 = robot; // Track which robot triggered the collision
          handleRobotCollision2.call(this);
        }, null, this);
      });

      // Criar elementos do tutorial após configurar câmera e interface
      createTutorialElements2.call(this);
    
      // Mostrar tutorial após um pequeno delay para dar tempo de carregar tudo
      this.time.delayedCall(500, () => {
        if (!tutorialShown2) {
          showTutorial2.call(this);
          tutorialShown2 = true;
        }
      });
}

function updateMain2() {
  // Se o tutorial estiver ativo, não permitir movimento
  if (tutorialActive2 || !this.cursors2 || !player2 || !player2.body || isPlayingMinigame2) return;
  const speed = 160;

  const leftPressed =
    this.cursors2.left.isDown ||
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A).isDown;
  const rightPressed =
    this.cursors2.right.isDown ||
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D).isDown;
  const upPressed =
    this.cursors2.up.isDown ||
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W).isDown;
  const downPressed =
    this.cursors2.down.isDown ||
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S).isDown;

  // Reset velocity
  player2.setVelocity(0);
  
  // Apply velocity based on input
  if (leftPressed) {
    player2.setVelocityX(-speed);
    player2.setFlipX(true);
    player2.anims.play('walk_side', true);
  } else if (rightPressed) {
    player2.setVelocityX(speed);
    player2.setFlipX(false);
    player2.anims.play('walk_side', true);
  } else if (upPressed) {
    player2.setVelocityY(-speed);
    player2.anims.play('walk_up', true);
  } else if (downPressed) {
    player2.setVelocityY(speed);
    player2.anims.play('walk_down', true);
  } else {
    // Set idle animation based on the last direction
    if (player2.anims.currentAnim) {
      const currentAnim = player2.anims.currentAnim.key;
      if (currentAnim === 'walk_side') {
        player2.anims.play('idle_side', true);
      } else if (currentAnim === 'walk_up') {
        player2.anims.play('idle_back', true);
      } else if (currentAnim === 'walk_down') {
        player2.anims.play('idle_front', true);
      }
    } else {
      player2.anims.play('idle_front', true);
    }
  }

  // Allow diagonal movement with normalized speed
  if ((leftPressed || rightPressed) && (upPressed || downPressed)) {
    // Normalize the velocity to prevent faster diagonal movement
    player2.body.velocity.normalize().scale(speed);
  }

  // Atualizar posição da luz para seguir o jogador
  if (lightMask2 && spotlight2) {
    lightMask2.setPosition(player2.x, player2.y);
    spotlight2.setPosition(player2.x, player2.y);
  }

  // Update all robots with better boundary checking
  robots2.forEach(robot => {
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
function createLightingSystem2() {
  // Criar camada de escuridão que cobre toda a área do jogo
  darkness2 = this.add.rectangle(
    0, 
    0, 
    map2.widthInPixels * 2, 
    map2.heightInPixels * 2, 
    0x000000, 
    0.92
  );
  darkness2.setOrigin(0, 0);
  darkness2.setDepth(1000); // Garantir que fique acima de todas as camadas do jogo
  
  // Criar máscara de luz circular
  lightMask2 = this.add.circle(player2.x, player2.y, lightRadius2, 0xffffff);
  lightMask2.setVisible(false); // A máscara não precisa ser visível
  
  // Criar spotlight visual (opcional - para dar um efeito de brilho)
  spotlight2 = this.add.circle(player2.x, player2.y, lightRadius2, 0xffffff, 0.0);
  spotlight2.setDepth(999); // Abaixo da escuridão
  
  // Aplicar máscara à camada de escuridão
  const mask = new Phaser.Display.Masks.GeometryMask(this, lightMask2);
  mask.invertAlpha = true; // Inverte a máscara para que ela "corte" a escuridão
  darkness2.setMask(mask);
}

// Inicializa o jogo após configuração
function startGame2() {
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
 ; }

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
    robots2.forEach(robot => {
      if (robot.isVertical) {
        robot.play(robot.movingDown ? "robo_walk_down" : "robo_walk_up");
      } else {
        robot.play("robo_walk");
      }
    });

  this.anims.create({
    key: "tvLigando",
    frames: this.anims.generateFrameNumbers("TvErro", { start: 0, end: 3 }), // Ajuste conforme o número de quadros
    frameRate: 3, // Velocidade da animação
    repeat: -1 // -1 para repetir infinitamente
});

  // Keep existing TV sprite code
  let tv = this.add.sprite(730, 200, "TvErro");
  tv.play("tvLigando");
  tv.setScale(0.8);
  let canInteractWithTV = false; // Add flag to track if player is in range

  // Add physics to TV for overlap detection
  this.physics.add.existing(tv);
  tv.body.setSize(80, 80); // Adjust hitbox size for better collision
  tv.body.setImmovable(true);

  // Create warning text for insufficient keys
  const keyWarningText = this.add.text(
    this.cameras.main.width / 2,
    this.cameras.main.height / 2,
    "Você precisa coletar todas as 4 chaves para continuar!",
    {
      fontFamily: 'Arial',
      fontSize: '22px',
      color: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 15, y: 10 },
      align: 'center',
      strokeThickness: 2,
      stroke: '#ff0000'
    }
  ).setOrigin(0.5);
  keyWarningText.setScrollFactor(0);
  keyWarningText.setDepth(3000);
  keyWarningText.setVisible(false);

  // Create interaction prompt
  const interactPrompt = this.add.text(
    this.cameras.main.width / 2,
    this.cameras.main.height / 2 - 50,
    "Pressione ESPAÇO para interagir",
    {
      fontFamily: 'Arial',
      fontSize: '18px',
      color: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 10, y: 5 },
      align: 'center'
    }
  ).setOrigin(0.5);
  interactPrompt.setScrollFactor(0);
  interactPrompt.setDepth(3000);
  interactPrompt.setVisible(false);

  // Add spacebar input for interaction
  const spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  
  // Add overlap detection between player and TV - only sets the flag
  this.physics.add.overlap(player2, tv, () => {
    canInteractWithTV = true;
    interactPrompt.setVisible(true);
  }, null, this);

  // Check when player leaves TV area
  this.events.on('update', () => {
    if (canInteractWithTV) {
      // Check if player is still overlapping with TV
      const stillOverlapping = Phaser.Geom.Rectangle.Overlaps(
        player2.getBounds(),
        tv.getBounds()
      );
      
      if (!stillOverlapping) {
        canInteractWithTV = false;
        interactPrompt.setVisible(false);
      }
    }
    
    // Check for spacebar press when in range
    if (canInteractWithTV && Phaser.Input.Keyboard.JustDown(spaceKey)) {
      handleTVInteraction.call(this);
    }
  });

  // Function to handle TV interaction
  function handleTVInteraction() {
    // Prevent rapid-fire triggering
    if (tv.lastInteracted && (this.time.now - tv.lastInteracted < 1000)) {
      return;
    }
    
    // Set last interaction time
    tv.lastInteracted = this.time.now;
    
    if (keys2Collected >= 4) {
      // Player has all keys, proceed to minigame
      console.log("Todas as 4 chaves coletadas! Iniciando minigame.");
      
      // Create a minigame container that covers the screen
      const minigameContainer = document.createElement('div');
      minigameContainer.id = 'projetil-minigame-container';
      minigameContainer.style.position = 'fixed';
      minigameContainer.style.top = '0';
      minigameContainer.style.left = '0';
      minigameContainer.style.width = '100%';
      minigameContainer.style.height = '100%';
      minigameContainer.style.zIndex = '5000';
      minigameContainer.style.background = '#000';
      document.body.appendChild(minigameContainer);
      
      // Create a loading message
      const loadingMsg = document.createElement('div');
      loadingMsg.textContent = 'Carregando minigame...';
      loadingMsg.style.color = 'white';
      loadingMsg.style.fontSize = '24px';
      loadingMsg.style.position = 'absolute';
      loadingMsg.style.top = '50%';
      loadingMsg.style.left = '50%';
      loadingMsg.style.transform = 'translate(-50%, -50%)';
      minigameContainer.appendChild(loadingMsg);
      
      // Pause the current game scene
      this.scene.pause();
      
      // Define a global function to exit the minigame
      window.exitProjetilMinigame = () => {
        // Remove the minigame container
        if (document.getElementById('projetil-minigame-container')) {
          document.getElementById('projetil-minigame-container').remove();
        }
        // Resume the game scene
        this.scene.resume();
        // Go to the next phase or level if needed
        // this.scene.start('nextPhase'); // Uncomment if you want to go to next phase
      };
      
      // Load the projetil.js script dynamically with a callback
      const script = document.createElement('script');
      script.src = "src/fase2/projetil.js";
      script.onload = () => {
        // Remove loading message once script is loaded
        if (loadingMsg && loadingMsg.parentNode) {
          loadingMsg.parentNode.removeChild(loadingMsg);
        }
        // The script will auto-initialize since it has self-initialization code
      };
      script.onerror = (error) => {
        loadingMsg.textContent = 'Erro ao carregar o minigame. Tente novamente.';
        console.error('Failed to load minigame script:', error);
        
        // Add a retry button
        const retryBtn = document.createElement('button');
        retryBtn.textContent = 'Tentar Novamente';
        retryBtn.style.display = 'block';
        retryBtn.style.margin = '20px auto';
        retryBtn.style.padding = '10px 20px';
        retryBtn.onclick = () => window.exitProjetilMinigame();
        minigameContainer.appendChild(retryBtn);
      };
      document.head.appendChild(script);
    } else {
      // Player doesn't have enough keys - show warning
      keyWarningText.setVisible(true);
      
      // Make the warning text pulse for attention
      this.tweens.add({
        targets: keyWarningText,
        scaleX: 1.1,
        scaleY: 1.1,
        duration: 200,
        yoyo: true,
        repeat: 2
      });
      
      // Hide message after delay
      this.time.delayedCall(3000, () => {
        this.tweens.add({
          targets: keyWarningText,
          alpha: 0,
          duration: 300,
          onComplete: () => {
            keyWarningText.setVisible(false);
            keyWarningText.setAlpha(1);
          }
        });
      });
    }
  }

  // Inicializa controles
  this.cursors2 = this.input.keyboard.createCursorKeys();
}

// Add these new functions
function handleRobotCollision2() {
  console.log("Colisão com robô detectada!"); // Debug
  if (isPlayingMinigame2) return;
  
  isPlayingMinigame2 = true;
  lastPlayerPosition2 = { x: player2.x, y: player2.y };
  
  // Save position of ONLY the robot that caused the collision
  lastRobotPosition2 = { 
    x: currentCollisionRobot2.x, 
    y: currentCollisionRobot2.y,
    movingRight: currentCollisionRobot2.movingRight,
    robot: currentCollisionRobot2 // Store reference to the actual robot
  };
  
  // Freeze ALL robots (disable physics) but only hide the one that caused collision
  robots2.forEach(robot => {
    // Stop all robots by disabling physics
    robot.body.enable = false;
    robot.setVelocity(0, 0);
    
    // But only hide the one that collided with player
    if (robot === currentCollisionRobot2) {
      robot.setVisible(false);
    }
  });
  
  // Completely disable player movement
  player2.setVelocity(0, 0);
  player2.body.moves = false; // This prevents any physics movement
  
  // Mostrar aviso
  if (warningText2) {
    warningText2.setVisible(true);
    
    // Esconder aviso e mostrar minigame após 5 segundos
    this.time.delayedCall(5000, () => {
      warningText2.setVisible(false);
      showMinigame2.call(this);
    });
  } else {
    console.error("warningText2 não foi inicializado!");
  }
}

function showMinigame2() {
  const randomQuestion = Phaser.Math.RND.pick(questions2);
  
  // Update question text
  minigameContainer2.questionText.setText(randomQuestion.question);
  
  // Clear previous listeners to prevent duplicate handling
  minigameContainer2.trueBtn.removeAllListeners('pointerdown');
  minigameContainer2.trueBtn.removeAllListeners('pointerdown');
  
  // Add new click handlers
  minigameContainer2.trueBtn.on('pointerdown', () => {
    console.log('TRUE button clicked');
    handleAnswer2.call(this, true, randomQuestion.answer, randomQuestion);
  });
  
  minigameContainer2.falseBtn.on('pointerdown', () => {
    console.log('FALSE button clicked');
    handleAnswer2.call(this, false, randomQuestion.answer, randomQuestion);
  });
  
  // Show the minigame
  minigameContainer2.setVisible(true);
}

function handleAnswer2(playerAnswer, correctAnswer, questionObj) {
  console.log(`Button clicked: ${playerAnswer}, correct answer: ${correctAnswer}`);
  
  // Prevent multiple clicks
  minigameContainer2.trueBtn.disableInteractive();
  minigameContainer2.falseBtn.disableInteractive();
  
  // Provide visual feedback
  const button = playerAnswer ? minigameContainer2.trueBtn : minigameContainer2.falseBtn;
  const color = playerAnswer === correctAnswer ? 0x00ff00 : 0xff0000;
  
  button.setFillStyle(color);
  
  // Hide question and show feedback
  this.time.delayedCall(500, () => {
    // Hide question elements
    minigameContainer2.questionText.setVisible(false);
    minigameContainer2.trueBtn.setVisible(false);
    minigameContainer2.trueText.setVisible(false);
    minigameContainer2.falseBtn.setVisible(false);
    minigameContainer2.falseText.setVisible(false);
    
    // Set feedback color based on answer correctness
    const feedbackBoxColor = playerAnswer === correctAnswer ? 0x006600 : 0x660000;
    minigameContainer2.feedbackBox.setFillStyle(feedbackBoxColor);
    
    // Show result text with appropriate message
    minigameContainer2.resultText.setText(playerAnswer === correctAnswer ? "VOCÊ ACERTOU!" : "VOCÊ ERROU!");
    minigameContainer2.resultText.setFill(playerAnswer === correctAnswer ? '#00ff00' : '#ff0000');
    minigameContainer2.resultText.setVisible(true);
    
    // Show feedback elements
    minigameContainer2.feedbackBox.setVisible(true);
    minigameContainer2.feedbackText.setText(questionObj.feedback);
    minigameContainer2.feedbackText.setVisible(true);
    minigameContainer2.continueBtn.setVisible(true);
    minigameContainer2.continueText.setVisible(true);
    
    // Add click handler to continue button
    minigameContainer2.continueBtn.once('pointerdown', () => {
      // Hide feedback and minigame
      minigameContainer2.setVisible(false);
      isPlayingMinigame2 = false;
      
      // Re-enable player movement
      player2.body.moves = true;
      
      // Reset visibility states for next time
      minigameContainer2.questionText.setVisible(true);
      minigameContainer2.trueBtn.setVisible(true);
      minigameContainer2.trueText.setVisible(true);
      minigameContainer2.falseBtn.setVisible(true);
      minigameContainer2.falseText.setVisible(true);
      minigameContainer2.feedbackBox.setVisible(false);
      minigameContainer2.feedbackText.setVisible(false);
      minigameContainer2.resultText.setVisible(false);
      minigameContainer2.continueBtn.setVisible(false);
      minigameContainer2.continueText.setVisible(false);
      
      // Reset button colors
      minigameContainer2.trueBtn.setFillStyle(0x008000);
      minigameContainer2.falseBtn.setFillStyle(0x800000);
      minigameContainer2.trueBtn.setInteractive();
      minigameContainer2.falseBtn.setInteractive();
      
      // Handle player consequence
      if (playerAnswer !== correctAnswer) {
        player2.setPosition(670, 1000);
        console.log('Wrong answer! Back to start.');
      } else {
        console.log('Correct answer! Continue playing.');
      }
      
      // Re-enable ALL robots after 5 seconds
      this.time.delayedCall(3000, () => {
        robots2.forEach(robot => {
          // Re-enable physics for all robots
          robot.body.enable = true;
          
          // Only need to make the collision robot visible again
          if (robot === lastRobotPosition2.robot) {
            robot.setPosition(lastRobotPosition2.x, lastRobotPosition2.y);
            robot.movingRight = lastRobotPosition2.movingRight;
            robot.setVisible(true);
          }
        });
        console.log('Robots resumed movement');
      });
    });
  });
}

// Add to createMain after physics setup
function createMinigameElements2() {
  // Create fixed position elements that don't scroll with the camera
  warningText2 = this.add.text(
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
  warningText2.setScrollFactor(0);
  warningText2.setDepth(3000);
  warningText2.setVisible(false);

  // Create simple minigame container
  minigameContainer2 = this.add.container(0, 0);
  minigameContainer2.setScrollFactor(0);
  minigameContainer2.setDepth(3000);
  minigameContainer2.setVisible(false);

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
  minigameContainer2.add([overlay, bg, questionText, trueBtn, trueText, falseBtn, falseText]);

  // Store references
  minigameContainer2.questionText = questionText;
  minigameContainer2.trueBtn = trueBtn;
  minigameContainer2.trueText = trueText;
  minigameContainer2.falseBtn = falseBtn;
  minigameContainer2.falseText = falseText;

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
  minigameContainer2.add([feedbackBox, feedbackText, continueBtn, continueText]);

  // Store references to feedback elements
  minigameContainer2.feedbackBox = feedbackBox;
  minigameContainer2.feedbackText = feedbackText;
  minigameContainer2.continueBtn = continueBtn;
  minigameContainer2.continueText = continueText;

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
  minigameContainer2.add([resultText]);
  minigameContainer2.resultText = resultText;

  return minigameContainer2;
}

// Create a robot with specified position and horizontal movement range
function createRobot2(startX, startY, rightBound, leftBound) {
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
  robots2.push(robot);
  
  return robot;
}

// Create a robot that moves vertically
function createVerticalRobot2(startX, startY, bottomBound, topBound) {
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
  robots2.push(robot);
  
  return robot;
}

// Função para criar os elementos do tutorial
function createTutorialElements2() {
  // Criar um container que ficará centralizado na tela
  tutorialContainer2 = this.add.container(this.cameras.main.centerX, this.cameras.main.centerY);
  tutorialContainer2.setScrollFactor(0); 
  tutorialContainer2.setDepth(4000);
  tutorialContainer2.setVisible(false);
  
  // Overlay escuro para dar destaque ao tutorial
  const overlay = this.add.rectangle(
    0, 
    0,
    this.cameras.main.width,
    this.cameras.main.height,
    0x000000, 0.8
  );
  overlay.setScrollFactor(0);
  overlay.setPosition(0, 0);
  overlay.setOrigin(0.5);
  
  // Calcular largura e altura do painel
  const panelWidth = this.cameras.main.width * 0.7;
  const panelHeight = this.cameras.main.height * 0.7;
  
  // Painel de fundo do tutorial com gradiente
  const tutorialPanel = this.add.rectangle(
    0, 
    0,
    panelWidth, 
    panelHeight,
    0x263871, 1
  );
  // Adicionar borda mais elaborada
  tutorialPanel.setStrokeStyle(6, 0x4a6db5);
  
  // Adicionar sombra ao painel principal
  const panelShadow = this.add.rectangle(
    4, 
    4,
    panelWidth, 
    panelHeight,
    0x000000, 0.4
  );
  panelShadow.setScrollFactor(0);
  
  // Barra de título na parte superior
  const titleBar = this.add.rectangle(
    0,
    -panelHeight * 0.4,
    panelWidth * 0.9,
    50,
    0x3854a8, 1
  );
  titleBar.setStrokeStyle(2, 0x6f8fd3);
  
  // Título do tutorial com efeito visual
  const tutorialTitle = this.add.text(
    0,
    -panelHeight * 0.4,
    'TUTORIAL - FASE 2',
    {
      fontFamily: 'Arial',
      fontSize: '26px',
      color: '#ffffff',
      fontStyle: 'bold',
      align: 'center'
    }
  );
  tutorialTitle.setOrigin(0.5);
  tutorialTitle.setShadow(2, 2, '#000000', 3, true, true);
  
  // Caixa de texto retangular para dar destaque ao conteúdo
  const textBox = this.add.rectangle(
    0,
    0,
    panelWidth * 0.42,
    panelHeight * 0.5,
    0x1a2a56, 0.8
  );
  textBox.setStrokeStyle(3, 0x4a6db5);
  
  // Texto do tutorial com fundo destacado
  const tutorialText = this.add.text(
    0,
    0,
    '', 
    {
      fontFamily: 'Arial',
      fontSize: '18px',
      color: '#ffffff',
      align: 'left',
      wordWrap: { width: panelWidth * 0.36 }
    }
  );
  tutorialText.setOrigin(0.5);
  
  // Imagem do zelador com efeito de borda
  const zeladorImage = this.add.image(
    panelWidth * 0.25,
    0,
    'zelador'
  );
  
  // Ajustar escala do zelador
  const zeladorMaxHeight = panelHeight * 0.65;
  if (zeladorImage.height > zeladorMaxHeight) {
    const scale = zeladorMaxHeight / zeladorImage.height;
    zeladorImage.setScale(scale);
  }
  
  // Adicionar borda decorativa ao redor da imagem
  const zeladorBorder = this.add.rectangle(
    panelWidth * 0.25,
    0,
    zeladorImage.displayWidth + 20,
    zeladorImage.displayHeight + 20,
    0x4a6db5, 0.5
  );
  zeladorBorder.setStrokeStyle(3, 0x8aa3d8);
  
  // Botão de próximo mais atraente
  const nextBtn = this.add.rectangle(
    0,
    panelHeight * 0.35,
    180, 50, 0x3854a8
  );
  nextBtn.setStrokeStyle(3, 0x8aa3d8);
  nextBtn.setScrollFactor(0);
  nextBtn.setInteractive({ useHandCursor: true });
  
  // Texto do botão com destaque
  const nextText = this.add.text(
    nextBtn.x,
    nextBtn.y,
    'PRÓXIMO',
    {
      fontFamily: 'Arial',
      fontSize: '18px',
      color: '#ffffff',
      fontStyle: 'bold'
    }
  );
  nextText.setOrigin(0.5);
  nextText.setShadow(1, 1, '#000000', 2, true, true);
  
  // Botão para pular o tutorial com visual melhorado
  const skipBtn = this.add.rectangle(
    panelWidth * 0.4,
    -panelHeight * 0.4,
    150, 35, 0x555555
  );
  skipBtn.setStrokeStyle(2, 0x888888);
  skipBtn.setScrollFactor(0);
  skipBtn.setInteractive({ useHandCursor: true });
  
  // Texto do botão pular com destaque
  const skipText = this.add.text(
    skipBtn.x,
    skipBtn.y,
    'PULAR TUTORIAL',
    {
      fontFamily: 'Arial',
      fontSize: '14px',
      color: '#ffffff'
    }
  );
  skipText.setOrigin(0.5);
  skipText.setShadow(1, 1, '#000000', 1);
  
  // Efeitos de hover melhorados
  nextBtn.on('pointerover', () => {
    nextBtn.setFillStyle(0x4f6dc5);
    nextBtn.setScale(1.05);
    nextText.setScale(1.05);
  });
  
  nextBtn.on('pointerout', () => {
    nextBtn.setFillStyle(0x3854a8);
    nextBtn.setScale(1.0);
    nextText.setScale(1.0);
  });
  
  skipBtn.on('pointerover', () => {
    skipBtn.setFillStyle(0x777777);
    skipBtn.setScale(1.05);
    skipText.setScale(1.05);
  });
  
  skipBtn.on('pointerout', () => {
    skipBtn.setFillStyle(0x555555);
    skipBtn.setScale(1.0);
    skipText.setScale(1.0);
  });
  
  // Lógica para avançar no tutorial
  nextBtn.on('pointerdown', () => {
    // Efeito de clique
    nextBtn.setFillStyle(0x2a3b7a);
    nextBtn.setScale(0.95);
    nextText.setScale(0.95);
    
    // Restaurar após 100ms
    this.time.delayedCall(100, () => {
      nextBtn.setFillStyle(0x3854a8);
      nextBtn.setScale(1.0);
      nextText.setScale(1.0);
      advanceTutorial2.call(this);
    });
  });
  
  // Lógica para pular o tutorial
  skipBtn.on('pointerdown', () => {
    skipBtn.setFillStyle(0x444444);
    skipBtn.setScale(0.95);
    skipText.setScale(0.95);
    
    this.time.delayedCall(100, () => {
      hideTutorial2.call(this);
    });
  });
  
  // Adicionar elementos ao container na ordem correta para camadas
  tutorialContainer2.add([
    overlay, 
    panelShadow, 
    tutorialPanel, 
    titleBar,
    tutorialTitle, 
    zeladorBorder,
    zeladorImage, 
    textBox,
    overlay, 
    panelShadow, 
    tutorialPanel, 
    titleBar,
    tutorialTitle, 
    zeladorBorder,
    zeladorImage, 
    textBox,
    tutorialText, 
    nextBtn, 
    nextText, 
    skipBtn, 
    skipText
  ]);
  
  // Guardar referências para fácil acesso
  tutorialContainer2.tutorialText = tutorialText;
  tutorialContainer2.zeladorImage = zeladorImage;
  tutorialContainer2.zeladorBorder = zeladorBorder;
  tutorialContainer2.textBox = textBox;
  tutorialContainer2.nextBtn = nextBtn;
  tutorialContainer2.nextText = nextText;
  tutorialContainer2.skipBtn = skipBtn;
  tutorialContainer2.skipText = skipText;
  tutorialContainer2.panelWidth = panelWidth;
  
  // Ajustar o container para ficar sempre no centro da tela
  this.scale.on('resize', () => {
    tutorialContainer2.setPosition(this.cameras.main.centerX, this.cameras.main.centerY);
    overlay.width = this.cameras.main.width;
    overlay.height = this.cameras.main.height;
  });
}

// Função para mostrar o tutorial
function showTutorial2() {
  // Desativar movimento do jogador durante o tutorial
  if (player2 && player2.body) {
    player2.body.moves = false;
  }
  
  // Desativar movimento de todos os robôs durante o tutorial
  robots2.forEach(robot => {
    if (robot && robot.body) {
      robot.body.enable = false;
      robot.setVelocity(0, 0);
    }
  });
  
  tutorialActive2 = true;
  tutorialStep2 = 0;
  
  // Atualizar o texto com a primeira mensagem
  tutorialContainer2.tutorialText.setText(tutorialMessages2[tutorialStep2]);
  
  // Posicionar NPC e texto para o primeiro passo
  updateNPCPosition2.call(this, true);
  
  // Mostrar o container do tutorial com efeito de fade
  tutorialContainer2.setVisible(true);
  tutorialContainer2.alpha = 0;
  this.tweens.add({
    targets: tutorialContainer2,
    alpha: 1,
    duration: 800,
    ease: 'Power2'
  });
  
  // Entrada com efeito para elementos
  this.tweens.add({
    targets: [tutorialContainer2.tutorialText, tutorialContainer2.textBox],
    y: { from: 30, to: 0 },
    alpha: { from: 0, to: 1 },
    duration: 800,
    ease: 'Back.out'
  });
  
  // Atualizar o texto do botão
  updateNextButtonText2.call(this);
}

// Função para avançar no tutorial
function advanceTutorial2() {
  tutorialStep2++;
  
  // Se chegou ao fim do tutorial
  if (tutorialStep2 >= tutorialMessages2.length) {
    hideTutorial2.call(this);
    return;
  }
  
  // Atualizar o texto com a mensagem atual
  const currentText = tutorialContainer2.tutorialText;
  const textBox = tutorialContainer2.textBox;
  const npcOnRight = tutorialStep2 % 2 === 0; // Alterna posição baseado no passo
  
  // Efeito de fade out/in ao trocar o texto e mover o NPC
  this.tweens.add({
    targets: [currentText, textBox, tutorialContainer2.zeladorImage, tutorialContainer2.zeladorBorder],
    alpha: 0,
    duration: 300,
    ease: 'Power2',
    onComplete: () => {
      currentText.setText(tutorialMessages2[tutorialStep2]);
      
      // Mover o NPC para o lado alternado
      updateNPCPosition2.call(this, npcOnRight);
      
      this.tweens.add({
        targets: [currentText, textBox, tutorialContainer2.zeladorImage, tutorialContainer2.zeladorBorder],
        alpha: 1,
        y: { from: npcOnRight ? 30 : -30, to: 0 },
        duration: 500,
        ease: 'Back.out'
      });
      
      // Atualizar o texto do botão se necessário
      updateNextButtonText2.call(this);
    }
  });
}

// Função para atualizar a posição do NPC
function updateNPCPosition2(onRight) {
  const zeladorImage = tutorialContainer2.zeladorImage;
  const zeladorBorder = tutorialContainer2.zeladorBorder;
  const panelWidth = tutorialContainer2.panelWidth;
  const tutorialText = tutorialContainer2.tutorialText;
  const textBox = tutorialContainer2.textBox;
  
  if (onRight) {
    // NPC na direita, texto na esquerda
    zeladorImage.setPosition(panelWidth * 0.25, 0);
    zeladorBorder.setPosition(panelWidth * 0.25, 0);
    zeladorImage.setFlipX(false);
    tutorialText.setPosition(-panelWidth * 0.25, 0);
    textBox.setPosition(-panelWidth * 0.25, 0);
  } else {
    // NPC na esquerda, texto na direita
    zeladorImage.setPosition(-panelWidth * 0.25, 8);
    zeladorBorder.setPosition(-panelWidth * 0.25, 0);
    zeladorImage.setFlipX(true);
    tutorialText.setPosition(panelWidth * 0.25, 0);
    textBox.setPosition(panelWidth * 0.25, 0);
  }
}

// Função para esconder o tutorial
function hideTutorial2() {
  // Efeito de saída para elementos
  this.tweens.add({
    targets: [tutorialContainer2.nextBtn, tutorialContainer2.nextText],
    y: '+=20',
    alpha: 0,
    duration: 300,
    ease: 'Power2'
  });
  
  // Fade out principal
  this.tweens.add({
    targets: tutorialContainer2,
    alpha: 0,
    scale: 0.95,
    duration: 500,
    ease: 'Power2',
    onComplete: () => {
      tutorialContainer2.setVisible(false);
      tutorialContainer2.setScale(1);
      tutorialActive2 = false;
      
      // Reativar movimento do jogador
      if (player2 && player2.body) {
        player2.body.moves = true;
      }
      
      // Reativar movimento de todos os robôs
      robots2.forEach(robot => {
        if (robot && robot.body) {
          robot.body.enable = true;
        }
      });
    }
  });
}

// Função para atualizar o texto do botão
function updateNextButtonText2() {
  if (tutorialStep2 === tutorialMessages2.length - 1) {
    tutorialContainer2.nextText.setText('COMEÇAR');
    
    // Destacar o botão final
    this.tweens.add({
      targets: tutorialContainer2.nextBtn,
      fillColor: 0x3a7a38,
      ease: 'Linear',
      duration: 300
    });
  } else {
    tutorialContainer2.nextText.setText('PRÓXIMO');
    
    // Restaurar cor do botão normal
    this.tweens.add({
      targets: tutorialContainer2.nextBtn,
      fillColor: 0x3854a8,
      ease: 'Linear',
      duration: 300
    });
  }
}

//nicializar a configuração quando o Phaser estiver carregado
initializaConfig2();

// Fase 2 - Estrutura básica para iniciar a fase 2
(function() {
  console.log("Arquivo fase2.js carregado");
  
  // Configurações iniciais
  const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: 'game-container',
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 0 },
        debug: false
      }
    },
    scene: {
      preload: preload,
      create: create,
      update: update
    }
  };
  
  // Variáveis globais
  let player;
  let cursors;
  let playerName = localStorage.getItem('playerName') || 'Jogador';
  let selectedCharacter = localStorage.getItem('selectedCharacter') || 'player1';
  
  // Função para pré-carregar os assets
  function preload() {
    this.load.image('background', 'assets/fase2/background.png');
    
    // Carregar os sprites do jogador (mesmos da fase 1)
    this.load.spritesheet('player1', 'assets/fase1/players/player1.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('player2', 'assets/fase1/players/player2.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('player3', 'assets/fase1/players/player3.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('player4', 'assets/fase1/players/player4.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('player5', 'assets/fase1/players/player5.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('player6', 'assets/fase1/players/player6.png', { frameWidth: 64, frameHeight: 64 });
  }
  
  // Função para criar a cena
  function create() {
    // Adicionar fundo (placeholder)
    this.add.rectangle(0, 0, window.innerWidth, window.innerHeight, 0x222222).setOrigin(0, 0);
    this.add.text(window.innerWidth/2, 100, 'FASE 2', { 
      fontSize: '32px', 
      fill: '#fff',
      fontFamily: 'Arial'
    }).setOrigin(0.5);
    
    this.add.text(window.innerWidth/2, 150, 'Bem-vindo à segunda fase, ' + playerName, { 
      fontSize: '24px', 
      fill: '#fff',
      fontFamily: 'Arial'
    }).setOrigin(0.5);
    
    // Criar o jogador
    player = this.physics.add.sprite(window.innerWidth/2, window.innerHeight/2, selectedCharacter, 0);
    player.setScale(0.8);
    player.setCollideWorldBounds(true);
    
    // Configurar animações do jogador
    if (!this.anims.exists('walk_down')) {
      this.anims.create({
        key: 'walk_down',
        frames: [
          { key: selectedCharacter, frame: 0 },
          { key: selectedCharacter, frame: 1 },
          { key: selectedCharacter, frame: 0 },
          { key: selectedCharacter, frame: 2 }
        ],
        frameRate: 7,
        repeat: -1
      });
      
      this.anims.create({
        key: 'walk_side',
        frames: [
          { key: selectedCharacter, frame: 3 },
          { key: selectedCharacter, frame: 4 }
        ],
        frameRate: 7,
        repeat: -1
      });
      
      this.anims.create({
        key: 'walk_up',
        frames: [
          { key: selectedCharacter, frame: 5 },
          { key: selectedCharacter, frame: 6 },
          { key: selectedCharacter, frame: 5 },
          { key: selectedCharacter, frame: 7 }
        ],
        frameRate: 7,
        repeat: -1
      });
    }
    
    // Configurar controles
    cursors = this.input.keyboard.createCursorKeys();
    
    // Adicionar texto de instrução
    this.add.text(window.innerWidth/2, window.innerHeight - 100, 'Use as setas ou WASD para se mover', {
      fontSize: '20px',
      fill: '#ffffff',
      fontFamily: 'Arial'
    }).setOrigin(0.5);
  }
  
  // Função de atualização
  function update() {
    // Movimento do jogador
    player.setVelocity(0);
    
    const speed = 160;
    
    // Verificar teclas de setas e WASD
    const leftPressed = cursors.left.isDown || this.input.keyboard.addKey('A').isDown;
    const rightPressed = cursors.right.isDown || this.input.keyboard.addKey('D').isDown;
    const upPressed = cursors.up.isDown || this.input.keyboard.addKey('W').isDown;
    const downPressed = cursors.down.isDown || this.input.keyboard.addKey('S').isDown;
    
    // Aplicar movimento
    if (leftPressed) {
      player.setVelocityX(-speed);
      player.anims.play('walk_side', true);
      player.setFlipX(true);
    } else if (rightPressed) {
      player.setVelocityX(speed);
      player.anims.play('walk_side', true);
      player.setFlipX(false);
    } else if (upPressed) {
      player.setVelocityY(-speed);
      player.anims.play('walk_up', true);
    } else if (downPressed) {
      player.setVelocityY(speed);
      player.anims.play('walk_down', true);
    } else {
      player.anims.stop();
      player.setFrame(0);
    }
  }
  
  // Função para iniciar a fase 2 (exposta globalmente)
  window.initFase2 = function() {
    console.log("Inicializando fase 2");
    
    // Criar o jogo
    if (window.game) {
      window.game.destroy(true);
    }
    
    window.game = new Phaser.Game(config);
    }
  
  // Se o script for carregado diretamente (sem ser chamado pela fase 1)
  // também podemos iniciar a fase 2 aqui
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    // Verificar se estamos na página fase2.html diretamente
    if (window.location.href.includes('fase2')) {
      setTimeout(window.initFase2, 100);
    }
  } else {
    document.addEventListener('DOMContentLoaded', function() {
      if (window.location.href.includes('fase2')) {
        setTimeout(window.initFase2, 100);
      }
    });
  }
})();
