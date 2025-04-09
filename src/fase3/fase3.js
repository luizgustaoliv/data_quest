// Update global variables to match valid layers
let cursors2;
let player2;
let chaoLayer4;
let paredeLayer5;
let objetos1Layer7;
let objetos2Layer8;
let objetos3Layer9;
let camada4Layer6;

// Add these new global variables at the top
let inMinigame = false;
let minigameZones = [];
let currentMinigame = null;
let spaceKey;
let minigameSceneLoaded = false;
let gameInstance = null;
let minigameIndicators = {}; // Store references to indicators
let completedMinigames = {}; // Track which minigames are completed
let hudContainer; // Container for HUD elements
let minigameCounter; // Text object for minigame counter

// Update the createDirectHUD function to position it on the right side and increase size
function createDirectHUD() {
  console.log('Creating or updating direct DOM HUD element');
  
  // First, remove any existing HUD element to prevent duplicates
  if (window.gameHud) {
    document.body.removeChild(window.gameHud);
  }
  
  // Create a DOM element overlay that will always be visible
  const hudElement = document.createElement('div');
  hudElement.id = 'game-hud';
  hudElement.style.position = 'absolute';
  hudElement.style.top = '10px';
  hudElement.style.right = '10px'; // Changed from left to right positioning
  hudElement.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
  hudElement.style.color = 'white';
  hudElement.style.padding = '13px'; // Increased from 10px to 13px (1.3x)
  hudElement.style.border = '3px solid #3498db'; // Increased border from 2px to 3px
  hudElement.style.borderRadius = '7px'; // Increased from 5px to 7px (rounded corners)
  hudElement.style.fontFamily = 'Arial, sans-serif';
  hudElement.style.fontSize = '31px'; // Increased from 24px to 31px (1.3x)
  hudElement.style.zIndex = '10000';
  hudElement.style.userSelect = 'none';
  
  // Count minigames
  const totalMinigames = minigameZones ? minigameZones.length : 4;
  const completedCount = Object.values(completedMinigames).filter(Boolean).length;
  
  // Set content with actual image instead of blue div - increased icon size by 1.3x
  hudElement.innerHTML = `
    <div style="display:flex; align-items:center;">
      <img src="../../assets/fase3/computer-icon.png" style="width:39px; height:39px; margin-right:13px;">
      <span>${completedCount}/${totalMinigames}</span>
    </div>
  `;
  
  // Store reference for updates
  window.gameHud = hudElement;
  window.hudCreated = true;
  
  // Add to document body
  document.body.appendChild(hudElement);
  
  return hudElement;
}

// Update HUD counter - improved to always update the current DOM element
function updateHudCounter() {
  // Count minigames and get completion status
  const totalMinigames = minigameZones ? minigameZones.length : 4;
  const completedCount = Object.values(completedMinigames).filter(Boolean).length;
  
  // If HUD exists, update it
  if (window.gameHud) {
    const counter = window.gameHud.querySelector('span');
    if (counter) {
      counter.textContent = `${completedCount}/${totalMinigames}`;
      console.log(`Updated HUD counter to ${completedCount}/${totalMinigames}`);
    }
  } else {
    // If HUD doesn't exist, create it
    createDirectHUD();
  }
}

// Either add these functions or rename the existing ones to match the expected names
function createHUD(scene) {
  // Just call our new implementation
  return createDirectHUD();
}

function updateHUDCounter() {
  // Call our new implementation
  updateHudCounter();
}

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
  
  // Load indicator images
  this.load.image("exclamation", "../../assets/fase3/exclamation.png");
  this.load.image("checkmark", "../../assets/fase3/checkmark.png");
  
  // Load computer icon for HUD
  this.load.image("computer-icon", "../../assets/fase3/computer-icon.png");
}

function createMain3() {

  // Criação do mapa (moved to top)
  const map3 = this.make.tilemap({ key: "map3json" });

  // Initialize cursor controls
  cursors2 = this.input.keyboard.createCursorKeys();

  // Add space key for interaction
  spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

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
  addCollisionRect(this, 248, 155, 250, 70, 0x00ff00); // mesa
  addCollisionRect(this, 248, 515, 250, 40, 0x00ff00); // mesa
  addCollisionRect(this, 700, 515, 250, 40, 0x00ff00); // mesa
  addCollisionRect(this, 738, 638, 60, 20, 0x00ff00); // mesa
  addCollisionRect(this, 226, 638, 60, 20, 0x00ff00); // mesa
  addCollisionRect(this, 226, 820, 60, 20, 0x00ff00); // mesa
  addCollisionRect(this, 320, 730, 60, 20, 0x00ff00); // mesa
  addCollisionRect(this, 800, 767, 60, 20, 0x00ff00); // mesa
  addCollisionRect(this, 850, 640, 20, 50, 0x00ff00); // mesa
  addCollisionRect(this, 840, 560, 20, 50, 0x00ff00); // mesa
  addCollisionRect(this, 820, 200, 100, 50, 0x00ff00); // mesa
  addCollisionRect(this, 600, 574, 20, 50, 0x00ff00); // mesa
  addCollisionRect(this, 410, 195, 10, 184, 0x00ff00); // mesa
  addCollisionRect(this, 577, 195, 10, 184, 0x00ff00); // mesa
  addCollisionRect(this, 350, 400, 70, 20, 0x00ff00); // mesa
  addCollisionRect(this, 638, 400, 70, 20, 0x00ff00); // mesa
  addCollisionRect(this, 628, 425, 20, 9, 0x00ff00); // mesa
  addCollisionRect(this, 355, 430, 10, 9, 0x00ff00); // mesa
  addCollisionRect(this, 795, 410, 4, 2, 0x00ff00); // mesa
  addCollisionRect(this, 159, 407, 60, 20, 0x00ff00); // mesa
  addCollisionRect(this, 159, 307, 60, 20, 0x00ff00); // mesa
  addCollisionRect(this, 410, 940, 2, 385, 0x00ff00); // mesa
  addCollisionRect(this, 580, 520, 10, 240, 0x00ff00); // mesa
  addCollisionRect(this, 410, 520, 10, 240, 0x00ff00); // mesa
  addCollisionRect(this, 580, 980, 10, 465, 0x00ff00); // mesa
  addCollisionRect(this, 490, 1030, 130, 10, 0x00ff00); // mesa
  addCollisionRect(this, 630, 780, 67, 20, 0x00ff00); // mesa
  addCollisionRect(this, 630, 810, 20, 17, 0x00ff00); // mesa
  addCollisionRect(this, 740, 920, 260, 17, 0x00ff00); // mesa
  addCollisionRect(this, 260, 920, 260, 17, 0x00ff00); // mesa
  addCollisionRect(this, 720, 150, 260, 60, 0x00ff00); // mesa
  addCollisionRect(this, 815, 330, 100, 30, 0x00ff00); // mesa
  addCollisionRect(this, 557, 920, 20, 20, 0x00ff00); // mesa
  addCollisionRect(this, 557, 150, 20, 20, 0x00ff00); // mesa
  addCollisionRect(this, 437, 920, 20, 20, 0x00ff00); // mesa
  addCollisionRect(this, 437, 150, 20, 20, 0x00ff00); // mesa
  addCollisionRect(this, 875, 500, 20, 800, 0x00ff00); // mesa
  addCollisionRect(this, 116, 500, 20, 800, 0x00ff00); // mesa
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

  // Load completed minigames from localStorage if available
  try {
    const savedProgress = localStorage.getItem('completedMinigames');
    if (savedProgress) {
      completedMinigames = JSON.parse(savedProgress);
    }
  } catch (e) {
    console.error('Error loading minigame progress:', e);
    completedMinigames = {};
  }

  // Update minigame zones array in createMain3()
  minigameZones = [
    {
        x: 300,
        y: 700,
        width: 100,
        height: 50,
        minigameName: 'puzzle1',
        color: 0xff0000,  // Red zone for popup defense minigame
        description: 'Defenda o computador contra popups maliciosos!'
    },
    {
        x: 782,
        y: 736,
        width: 100,
        height: 50,
        minigameName: 'puzzle2',
        color: 0x00ff00,  // Green zone for second minigame
        description: 'Minigame 2: Complete o desafio de segurança!'
    },
    {
        x: 782,
        y: 190,
        width: 100,
        height: 50,
        minigameName: 'puzzle3',
        color: 0x0000ff,  // Blue zone for third minigame  
        description: 'Minigame 3: Proteja a rede de ataques!'
    },  
    {
        x: 203,
        y: 165,
        width: 100,
        height: 50,
        minigameName: 'puzzle4',
        color: 0xff00ff,  // Purple zone for fourth minigame
        description: 'Minigame 4: Recupere os dados criptografados!'
    } 
  ];

  // Create HUD with a slight delay to ensure scene is fully initialized
  this.time.delayedCall(100, () => {
    try {
      console.log("Creating HUD with delay");
      // This now calls our function createDirectHUD() through the wrapper
      const hud = createHUD(this);
      console.log("HUD created successfully:", hud);
    } catch (e) {
      console.error("HUD creation failed:", e);
    }
  });
  
  // Update the trigger zones creation to show description on hover
  minigameZones.forEach(zone => {
    const triggerZone = this.add.rectangle(zone.x, zone.y, zone.width, zone.height);
    this.physics.add.existing(triggerZone, true);
    
    // Add indicator above the zone
    createIndicator(this, zone);
    
    // Show description when player enters zone
    let descriptionText = null;
    
    this.physics.add.overlap(player2, triggerZone, () => {
      // Show description if not already showing
      if (!descriptionText) {
        descriptionText = this.add.text(zone.x, zone.y - 70, zone.description, {
          fontSize: '16px',
          fill: '#ffffff',
          backgroundColor: '#000000',
          padding: { x: 5, y: 3 },
        }).setOrigin(0.5).setDepth(1000);
      }
      
      // Handle minigame start on space key
      if (Phaser.Input.Keyboard.JustDown(spaceKey) && !inMinigame) {
        // Display "Loading..." message
        const loadingText = this.add.text(400, 300, 'Carregando...', {
          fontSize: '24px',
          fill: '#ffffff'
        }).setOrigin(0.5);
        
        startMinigame(this, zone.minigameName)
          .then(() => loadingText.destroy())
          .catch(error => {
            console.error('Error starting minigame:', error);
            loadingText.setText('Erro ao carregar minigame!');
            
            // Remove error message after 2 seconds
            this.time.delayedCall(2000, () => {
              loadingText.destroy();
              inMinigame = false;
            });
          });
      }
    });
    
    // Remove description when player leaves zone
    this.physics.add.overlap(player2, triggerZone, null, function() {
      return true; // Always process this overlap
    }, this, function() {
      // This is called when overlap stops
      if (descriptionText) {
        descriptionText.destroy();
        descriptionText = null;
      }
    });

    // Always make zones visible now, with their specific colors
    triggerZone.setStrokeStyle(2, zone.color);
    triggerZone.setFillStyle(zone.color, 0.3);
    triggerZone.setVisible(true);
  });
}

// Create visual indicators for minigame zones
function createIndicator(scene, zone) {
  const isCompleted = completedMinigames[zone.minigameName] === true;
  
  // Check if we have the images loaded
  let hasImages = scene.textures.exists('exclamation') && scene.textures.exists('checkmark');
  
  let indicator;
  
  if (hasImages) {
    // Use loaded images
    indicator = scene.add.image(zone.x, zone.y - 40, isCompleted ? 'checkmark' : 'exclamation');
    indicator.setScale(0.5); // Adjust scale as needed
  } else {
    // Create graphics if images don't exist
    indicator = scene.add.container(zone.x, zone.y - 40);
    
    // Create exclamation point with graphics
    if (!isCompleted) {
      // Red circle
      const circle = scene.add.circle(0, 0, 15, 0xff0000);
      // White exclamation mark
      const excl1 = scene.add.rectangle(0, -3, 4, 15, 0xffffff);
      const excl2 = scene.add.circle(0, 10, 2, 0xffffff);
      indicator.add([circle, excl1, excl2]);
    } else {
      // Green circle
      const circle = scene.add.circle(0, 0, 15, 0x00ff00);
      // White checkmark
      const graphics = scene.add.graphics();
      graphics.lineStyle(3, 0xffffff);
      graphics.beginPath();
      graphics.moveTo(-7, 0);
      graphics.lineTo(-2, 5);
      graphics.lineTo(7, -5);
      graphics.strokePath();
      indicator.add([circle, graphics]);
    }
  }
  
  // Add pulsing animation for non-completed minigames
  if (!isCompleted) {
    scene.tweens.add({
      targets: indicator,
      scaleX: 1.2,
      scaleY: 1.2,
      duration: 600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }
  
  // Store reference to indicator for future updates
  minigameIndicators[zone.minigameName] = indicator;
}

// Update indicator after minigame completion
function updateMinigameIndicator(minigameName, success) {
  if (!success || !minigameIndicators[minigameName]) return;
  
  const indicator = minigameIndicators[minigameName];
  const scene = indicator.scene;
  
  // Mark as completed
  completedMinigames[minigameName] = true;
  
  // Save progress to localStorage
  try {
    localStorage.setItem('completedMinigames', JSON.stringify(completedMinigames));
  } catch (e) {
    console.error('Could not save minigame progress:', e);
  }
  
  // Stop any running animations
  scene.tweens.killTweensOf(indicator);
  
  // Replace with checkmark
  if (scene.textures.exists('checkmark')) {
    // If using image
    indicator.setTexture('checkmark');
    indicator.setScale(0.5);
  } else {
    // If using graphics
    indicator.removeAll(true);
    
    // Green circle
    const circle = scene.add.circle(0, 0, 15, 0x00ff00);
    // White checkmark
    const graphics = scene.add.graphics();
    graphics.lineStyle(3, 0xffffff);
    graphics.beginPath();
    graphics.moveTo(-7, 0);
    graphics.lineTo(-2, 5);
    graphics.lineTo(7, -5);
    graphics.strokePath();
    
    indicator.add([circle, graphics]);
  }
  
  // Update HUD counter with our fixed function
  updateHudCounter();
}

// Update the loadMinigameScript function to dynamically load different minigame files
function loadMinigameScript(minigameName) {
  return new Promise((resolve, reject) => {
    // Determine which script file to load based on minigame name
    let scriptFile;
    let sceneKey;
    
    switch(minigameName) {
      case 'puzzle1':
        scriptFile = '../../src/fase3/minigame.js';
        sceneKey = 'MinigameScene';
        break;
      case 'puzzle2':
        scriptFile = '../../src/fase3/minigame2.js';
        sceneKey = 'Minigame2Scene';
        break;
      case 'puzzle3':
        scriptFile = '../../src/fase3/minigame3.js';
        sceneKey = 'Minigame3Scene';
        break;
      case 'puzzle4':
        scriptFile = '../../src/fase3/minigame4.js';
        sceneKey = 'Minigame4Scene';
        break;
      default:
        scriptFile = '../../src/fase3/minigame.js';
        sceneKey = 'MinigameScene';
    }
    
    // Check if the scene class is already loaded
    const sceneExists = window[sceneKey];
    if (sceneExists) {
      resolve({ sceneKey });
      return;
    }

    // Create a script element to load the appropriate minigame file
    const script = document.createElement('script');
    script.src = scriptFile;
    script.onload = () => {
      console.log(`${minigameName} script loaded successfully: ${scriptFile}`);
      resolve({ sceneKey });
    };
    script.onerror = () => {
      console.error(`Failed to load ${minigameName} script: ${scriptFile}`);
      reject(new Error(`Failed to load ${minigameName} script`));
    };
    document.head.appendChild(script);
  });
}

// Modify the startMinigame function to handle different minigames
function startMinigame(scene, minigameName) {
  inMinigame = true;
  
  // Return a promise that resolves when minigame is ready
  return loadMinigameScript(minigameName)
    .then(({ sceneKey }) => {
      if (!gameInstance.scene.getScene(sceneKey)) {
        // Get the scene class based on the scene key
        const SceneClass = window[sceneKey];
        if (!SceneClass) {
          throw new Error(`Scene class ${sceneKey} not found`);
        }
        
        // Add the scene dynamically if it doesn't exist
        gameInstance.scene.add(sceneKey, SceneClass, false);
      }
      
      // Start the minigame scene
      scene.scene.launch(sceneKey);
      
      // Listen for game completion and update indicator
      scene.scene.get(sceneKey).events.once('minigameComplete', (success) => {
        console.log(`Minigame ${minigameName} completed: ${success ? 'win' : 'lose'}`);
        
        // Update indicator if successful
        if (success) {
          updateMinigameIndicator(minigameName, true);
          // Make sure HUD is refreshed when returning from minigame
          updateHudCounter();
        }
        
        scene.time.delayedCall(500, () => {
          scene.scene.stop(sceneKey);
          inMinigame = false;
        });
      });
      
      return true;
    });
}

// Update the update function to not create additional HUDs
function updateMain3() {
  // Add safety check for cursors2
  if (!cursors2 || !player2) return;
  const speed = 160;

  // Disable player movement during minigame
  if (inMinigame) {
    player2.setVelocity(0);
    return;
  }

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

  gameInstance = new Phaser.Game(config);
  return gameInstance;
}

// Start the game after page loads
window.onload = function () {
  startGame();
};
