// Initialize critical global variables at the very beginning of the file
// to ensure they're accessible from all contexts
window.dialogoNpc1Concluido = false;
window.keycardCount = 0;
window.isDoor2Open = false;
window.keyCollected = false;

// Define door2 before it is used
let door2;

// Define door2OpenMessage to avoid ReferenceError
let door2OpenMessage;

// Inserir ao início para evitar re-declaração
if (window.fase1Initialized) {
  console.warn("Fase1.js já foi inicializado.");
} else {
  window.fase1Initialized = true;

  // Adicionar referências ao CSS e à fonte - estas não dependem do Phaser
  const styleLink = document.createElement("link");
  styleLink.rel = "stylesheet";
  styleLink.href = "assets/fase1/style.css";
  document.head.appendChild(styleLink);

  // Adicionar título e meta tags ao head
  document.title = "Data Quest - Seleção de Personagem";
  const metaCharset = document.createElement("meta");
  metaCharset.setAttribute("charset", "UTF-8");
  document.head.appendChild(metaCharset);

  const metaViewport = document.createElement("meta");
  metaViewport.name = "viewport";
  metaViewport.content = "width=device-width, initial-scale=1.0";
  document.head.appendChild(metaViewport);

  const fontLink = document.createElement("link");
  fontLink.href =
    "https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap";
  fontLink.rel = "stylesheet";
  document.head.appendChild(fontLink);

  // Garantir que o Phaser seja carregado antes de usar
  function loadPhaser(callback) {
    if (window.Phaser) {
      console.log("Phaser já está disponível. Versão:", window.Phaser.VERSION);
      callback();
      return;
    }

    console.log("Carregando Phaser dinamicamente...");
    const phaserScript = document.createElement("script");
    phaserScript.src =
      "https://cdnjs.cloudflare.com/ajax/libs/phaser/3.88.2/phaser.min.js";
    phaserScript.async = true;

    phaserScript.onload = function () {
      console.log(
        "Phaser carregado com sucesso! Versão:",
        window.Phaser.VERSION
      );
      callback();
    };

    phaserScript.onerror = function (e) {
      console.error("Erro ao carregar Phaser:", e);
      alert(
        "Erro ao carregar recursos necessários. Por favor, recarregue a página."
      );
    };

    document.head.appendChild(phaserScript);
  }

  // Definir config só quando Phaser estiver carregado
  let config;

  function initializeConfig() {
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
        preload: preload,
        create: createMain,
        update: updateMain,
      },
    };
  }

  // Adicionar elementos HTML ao body usando DOM puro (sem innerHTML)
  const particlesContainer = document.createElement("div");
  particlesContainer.id = "particles-container";
  document.body.appendChild(particlesContainer);

  // Container do logo
  const logoContainer = document.createElement("div");
  logoContainer.id = "logo-container";

  const logoTitle = document.createElement("h1");
  logoTitle.textContent = "DATA QUEST";
  logoContainer.appendChild(logoTitle);

  const logoSubtitle = document.createElement("h2");
  logoSubtitle.textContent = "A Missão da Proteção de Dados";
  logoContainer.appendChild(logoSubtitle);

  document.body.appendChild(logoContainer);

  // Criar seleção de personagens
  const characterSelect = document.createElement("div");
  characterSelect.id = "character-select";

  const characterTitle = document.createElement("h2");
  characterTitle.textContent = "SELECIONE SEU PERSONAGEM";
  characterSelect.appendChild(characterTitle);

  const charactersGrid = document.createElement("div");
  charactersGrid.className = "characters-grid";

  // Função para criar um card de personagem
  function createCharacterCard(number, characterName, imagePath, playerId) {
    const card = document.createElement("div");
    card.className = "character-card";

    const header = document.createElement("div");
    header.className = "character-header";

    const numberSpan = document.createElement("span");
    numberSpan.className = "character-number";
    numberSpan.textContent = number;
    header.appendChild(numberSpan);

    const nameH3 = document.createElement("h3");
    nameH3.textContent = characterName;
    header.appendChild(nameH3);

    card.appendChild(header);

    // Preview do personagem
    const preview = document.createElement("div");
    preview.className = "character-preview";

    const image = document.createElement("img");
    image.src = imagePath;
    image.alt = characterName;
    preview.appendChild(image);

    card.appendChild(preview);

    // Container para nome do jogador
    const nameContainer = document.createElement("div");
    nameContainer.className = "player-name-container";

    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.className = "player-name-input";
    nameInput.placeholder = "Digite seu nome";
    nameInput.maxLength = 15;
    nameContainer.appendChild(nameInput);

    card.appendChild(nameContainer);

    // Botão de seleção
    const selectButton = document.createElement("div");
    selectButton.className = "character-select-button";
    selectButton.onclick = function () {
      startGameWithName(playerId, this);
    };

    const buttonText = document.createElement("span");
    buttonText.textContent = "SELECIONAR";
    selectButton.appendChild(buttonText);

    card.appendChild(selectButton);

    return card;
  }

  // Criar cards de personagens
  charactersGrid.appendChild(
    createCharacterCard(
      "1",
      "Personagem 1",
      "assets/personagem/personagem1Big.png",
      "player1"
    )
  );
  charactersGrid.appendChild(
    createCharacterCard(
      "2",
      "Personagem 2",
      "assets/personagem/personagem2Big.png",
      "player2"
    )
  );
  charactersGrid.appendChild(
    createCharacterCard(
      "3",
      "Personagem 3",
      "assets/personagem/personagem3Big.png",
      "player3"
    )
  );
  charactersGrid.appendChild(
    createCharacterCard(
      "4",
      "Personagem 4",
      "assets/personagem/personagem4Big.png",
      "player4"
    )
  );
  charactersGrid.appendChild(
    createCharacterCard(
      "5",
      "Personagem 5",
      "assets/personagem/personagem5Big.png",
      "player5"
    )
  );
  charactersGrid.appendChild(
    createCharacterCard(
      "6",
      "Personagem 6",
      "assets/personagem/personagem6Big.png",
      "player6"
    )
  );

  characterSelect.appendChild(charactersGrid);

  // Botões de navegação
  const navigationButtons = document.createElement("div");
  navigationButtons.className = "navigation-buttons";

  const backButton = document.createElement("button");
  backButton.id = "back-button";
  backButton.textContent = "VOLTAR";
  backButton.onclick = function () {
    window.location.href = "teladefases/fases.js";
  };
  navigationButtons.appendChild(backButton);

  characterSelect.appendChild(navigationButtons);
  document.body.appendChild(characterSelect);

  // Contador de keycards
  const keycardContainer = document.createElement("div");
  keycardContainer.id = "keycard-container";

  const keycardIconElement = document.createElement("img");
  keycardIconElement.id = "keycard-icon";
  keycardIconElement.src = "assets/fase1/Spritegrande.png";
  keycardIconElement.alt = "Keycard";
  keycardContainer.appendChild(keycardIconElement);

  const keycardCounter = document.createElement("span");
  keycardCounter.id = "keycard-counter";
  keycardCounter.textContent = "0/4";
  keycardContainer.appendChild(keycardCounter);

  document.body.appendChild(keycardContainer);

  // Contador de chaves
  const keyContainer = document.createElement("div");
  keyContainer.id = "key-container";

  const keyIcon = document.createElement("img");
  keyIcon.id = "key-icon";
  keyIcon.src = "assets/fase1/chavesprite.png";
  keyIcon.alt = "Key";
  keyContainer.appendChild(keyIcon);

  const keyCounter = document.createElement("span");
  keyCounter.id = "key-counter";
  keyCounter.textContent = "0/1";
  keyContainer.appendChild(keyCounter);

  document.body.appendChild(keyContainer);

  // Botão de missões
  const missionsButton = document.createElement("div");
  missionsButton.id = "missions-button";
  missionsButton.textContent = "MISSÕES";
  missionsButton.style.cursor = "pointer";
  missionsButton.style.userSelect = "none";
  missionsButton.style.backgroundColor = "#4a6eb5";
  missionsButton.style.color = "white";
  missionsButton.style.padding = "8px 16px";
  missionsButton.style.borderRadius = "5px";
  missionsButton.style.fontWeight = "bold";
  missionsButton.style.boxShadow = "0 2px 4px rgba(0,0,0,0.3)";
  document.body.appendChild(missionsButton);

  document.body.appendChild(missionsButton);

  // Overlay de missões
  const missionsOverlay = document.createElement("div");
  missionsOverlay.id = "missions-overlay";
  document.body.appendChild(missionsOverlay);

  // Painel de missões
  const missionsPanel = document.createElement("div");
  missionsPanel.id = "missions-panel";

  const missionTitle = document.createElement("h2");
  missionTitle.textContent = "MISSÕES";
  missionsPanel.appendChild(missionTitle);

  const closeButton = document.createElement("button");
  closeButton.id = "close-missions";
  closeButton.textContent = "X";
  missionsPanel.appendChild(closeButton);

  // Lista de missões
  const missionList = document.createElement("div");
  missionList.id = "mission-list";

  // Função para criar uma missão
  function createMission(id, text) {
    const missionItem = document.createElement("div");
    missionItem.className = "mission-item";
    missionItem.id = id;

    const missionCheck = document.createElement("div");
    missionCheck.className = "mission-check";
    missionItem.appendChild(missionCheck);

    const missionText = document.createElement("div");
    missionText.className = "mission-text";
    missionText.textContent = text;
    missionItem.appendChild(missionText);

    return missionItem;
  }

  // Adicionar missões ao painel
  missionList.appendChild(
    createMission("mission-faxineiro", "Interagir com o faxineiro")
  );
  missionList.appendChild(
    createMission("mission-professoras", "Ajudar as professoras (0/4)")
  );
  missionList.appendChild(
    createMission("mission-sala", "Desbloquear a sala da chave")
  );
  missionList.appendChild(
    createMission("mission-elevador", "Levar a chave até o elevador")
  );

  missionsPanel.appendChild(missionList);
  document.body.appendChild(missionsPanel);

  // Criar container do jogo - USANDO let em vez de const para permitir reatribuição depois
  let gameContainer = document.createElement("div");
  gameContainer.id = "game-container";
  gameContainer.style.display = "none";
  gameContainer.style.width = "100%";
  gameContainer.style.height = "100vh";
  gameContainer.style.position = "absolute";
  gameContainer.style.top = "0";
  gameContainer.style.left = "0";
  document.body.appendChild(gameContainer);

  // Overlay de transição
  const transitionOverlay = document.createElement("div");
  transitionOverlay.id = "transition-overlay";
  document.body.appendChild(transitionOverlay);

  // Função para inicializar o menu do jogo
  function initGameMenu() {
    // Verificar se o menu já foi inicializado para evitar duplicatas
    if (window.menuInitialized) {
      console.log("Menu já inicializado, ignorando segunda chamada");
      return;
    }

    console.log("Inicializando menu do jogo...");
    window.menuInitialized = true;

    // Remover qualquer botão de menu existente para evitar duplicatas
    const existingButton = document.getElementById("game-menu-button");
    if (existingButton) existingButton.remove();

    const existingEmergencyButton = document.getElementById(
      "game-menu-button-emergency"
    );
    if (existingEmergencyButton) existingEmergencyButton.remove();

    // Criar o botão de menu
    const menuButton = document.createElement("button");
    menuButton.id = "game-menu-button";
    menuButton.innerHTML = "≡";
    menuButton.style.position = "fixed";
    menuButton.style.top = "20px";
    menuButton.style.left = "20px";
    menuButton.style.zIndex = "999999"; // Aumentado para ficar acima de tudo
    menuButton.style.padding = "3px 10px";
    menuButton.style.backgroundColor = "#00000";
    menuButton.style.color = "white";
    menuButton.style.border = "none";
    menuButton.style.borderRadius = "5px";
    menuButton.style.fontFamily = "Arial, sans-serif";
    menuButton.style.fontWeight = "bold";
    menuButton.style.fontSize = "23px";
    menuButton.style.cursor = "pointer";
    menuButton.style.boxShadow = "0 2px 4px rgba(0,0,0,0.3)";
    menuButton.style.transition = "background-color 0.2s";
    // Garantir que o botão seja exibido
    menuButton.style.display = "block !important";
    menuButton.style.visibility = "visible !important";
    menuButton.style.opacity = "1 !important";

    // Adicionar efeitos de hover
    menuButton.addEventListener("mouseover", function () {
      this.style.backgroundColor = "#3d5c96";
    });
    menuButton.addEventListener("mouseout", function () {
      this.style.backgroundColor = "#4a6eb5";
    });

    // Adicionar o botão diretamente ao início do body para garantir máxima prioridade
    document.body.insertBefore(menuButton, document.body.firstChild);
    console.log("Botão do menu adicionado ao DOM:", menuButton);

    // Remover qualquer overlay existente para evitar duplicatas
    const existingOverlay = document.getElementById("game-menu-overlay");
    if (existingOverlay) existingOverlay.remove();

    // Criar o overlay do menu (inicialmente oculto)
    const menuOverlay = document.createElement("div");
    menuOverlay.id = "game-menu-overlay";
    menuOverlay.style.position = "fixed";
    menuOverlay.style.top = "0";
    menuOverlay.style.left = "0";
    menuOverlay.style.width = "100%";
    menuOverlay.style.height = "100%";
    menuOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    menuOverlay.style.zIndex = "999990"; // Aumentado para ficar acima de tudo, exceto o menu
    menuOverlay.style.display = "none";
    menuOverlay.style.justifyContent = "center";
    menuOverlay.style.alignItems = "center";
    document.body.insertBefore(menuOverlay, document.body.firstChild);

    // Criar o painel do menu
    const menuPanel = document.createElement("div");
    menuPanel.id = "game-menu-panel";
    menuPanel.style.width = "300px";
    menuPanel.style.backgroundColor = "#222";
    menuPanel.style.borderRadius = "10px";
    menuPanel.style.padding = "20px";
    menuPanel.style.boxShadow = "0 0 20px rgba(0, 0, 0, 0.5)";
    menuOverlay.appendChild(menuPanel);

    // Título do menu
    const menuTitle = document.createElement("h2");
    menuTitle.textContent = "MENU DO JOGO";
    menuTitle.style.color = "white";
    menuTitle.style.textAlign = "center";
    menuTitle.style.margin = "0 0 20px 0";
    menuTitle.style.fontFamily = "'Press Start 2P', Arial, sans-serif";
    menuTitle.style.fontSize = "24px";
    menuPanel.appendChild(menuTitle);

    // Função para criar botões do menu
    function createMenuButton(text, onClick) {
      const button = document.createElement("button");
      button.textContent = text;
      button.style.display = "block";
      button.style.width = "100%";
      button.style.padding = "12px";
      button.style.margin = "10px 0";
      button.style.backgroundColor = "#4a6eb5";
      button.style.color = "white";
      button.style.border = "none";
      button.style.borderRadius = "5px";
      button.style.fontSize = "16px";
      button.style.fontWeight = "bold";
      button.style.cursor = "pointer";
      button.style.transition = "transform 0.1s, background-color 0.2s";

      // Efeitos de hover e click
      button.addEventListener("mouseover", function () {
        this.style.backgroundColor = "#3d5c96";
      });
      button.addEventListener("mouseout", function () {
        this.style.backgroundColor = "#4a6eb5";
      });
      button.addEventListener("mousedown", function () {
        this.style.transform = "scale(0.98)";
      });
      button.addEventListener("mouseup", function () {
        this.style.transform = "scale(1)";
      });

      button.addEventListener("click", onClick);
      return button;
    }

    // Botão Continuar
    const continueButton = createMenuButton("Continuar Jogo", function () {
      closeMenu();
    });
    menuPanel.appendChild(continueButton);

    // Botão Reiniciar
    const restartButton = createMenuButton("Reiniciar Fase", function () {
      if (
        confirm(
          "Tem certeza que deseja reiniciar a fase? Todo o progresso desta fase será perdido."
        )
      ) {
        closeMenu();
        // Resetar o estado do jogo
        window.dialogoNpc1Concluido = false;
        window.keycardCount = 0;
        window.isDoor2Open = false;
        window.keyCollected = false;

        if (typeof showCharacterSelect === "function") {
          showCharacterSelect();
        } else {
          // Fallback se a função não estiver disponível
          window.location.href = "../../index.html";
        }
      }
    });
    menuPanel.appendChild(restartButton);

    // Botão Voltar para Tela Principal
    const mainMenuButton = createMenuButton(
      "Voltar para Tela Principal",
      function () {
        if (
          confirm(
            "Tem certeza que deseja voltar para a tela principal? Todo o progresso será perdido."
          )
        ) {
          closeMenu();
          // Recarregar a página para reiniciar a fase
          window.location.reload();
        }
      }
    );
    menuPanel.appendChild(mainMenuButton);

    // Função para abrir o menu
    function openMenu() {
      console.log("Abrindo menu...");
      menuOverlay.style.display = "flex";

      // Pausar o jogo
      if (window.game && window.game.scene) {
        const activeScenes = window.game.scene.getScenes(true);
        activeScenes.forEach((scene) => {
          scene.scene.pause();
        });
      }
    }

    // Função para fechar o menu
    function closeMenu() {
      console.log("Fechando menu...");
      menuOverlay.style.display = "none";

      // Retomar o jogo
      if (window.game && window.game.scene) {
        const pausedScenes = window.game.scene.getScenes(false);
        pausedScenes.forEach((scene) => {
          if (scene.scene.isPaused()) {
            scene.scene.resume();
          }
        });
      }
    }

    // Evento de clique para o botão do menu
    menuButton.onclick = function () {
      console.log("Botão do menu clicado");
      openMenu();
    };

    // Implementar a função handleEscKey corretamente
    function handleEscKey(event) {
      if (event.key === "Escape") {
        console.log("Tecla ESC pressionada");
        if (menuOverlay.style.display === "none") {
          openMenu();
        } else {
          closeMenu();
        }
      }
    }

    // Remover qualquer listener de ESC existente para evitar duplicação
    document.removeEventListener("keydown", handleEscKey);
    // Adicionar o novo listener
    document.addEventListener("keydown", handleEscKey);

    // Adicionar listener para o documento principal também (para maior garantia)
    window.addEventListener("keydown", handleEscKey);

    // Expor funções para uso global
    window.gameMenu = {
      open: openMenu,
      close: closeMenu,
      handleEscKey: handleEscKey,
    };

    console.log("Menu do jogo inicializado com sucesso!");
  }

  // Exportar a função de inicialização
  if (typeof module !== "undefined" && module.exports) {
    module.exports = {
      initGameMenu,
      // Exportar também a função handleEscKey para uso externo
      handleEscKey: function (event) {
        if (event.key === "Escape" && window.gameMenu) {
          if (
            document.getElementById("game-menu-overlay").style.display ===
            "none"
          ) {
            window.gameMenu.open();
          } else {
            window.gameMenu.close();
          }
        }
      },
    };
  } else {
    // Para uso direto no navegador
    window.initGameMenu = initGameMenu;
  }

  // Executar a inicialização se o script for carregado diretamente
  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    setTimeout(initGameMenu, 1000);
  } else {
    document.addEventListener("DOMContentLoaded", function () {
      setTimeout(initGameMenu, 1000);
    });
  }

  // Adicionar um listener global para ESC que sempre estará disponível
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      console.log("ESC pressionado (listener global)");
      const menuOverlay = document.getElementById("game-menu-overlay");

      if (menuOverlay) {
        if (menuOverlay.style.display === "none") {
          if (window.gameMenu && typeof window.gameMenu.open === "function") {
            window.gameMenu.open();
          } else {
            menuOverlay.style.display = "flex";
          }
        } else {
          if (window.gameMenu && typeof window.gameMenu.close === "function") {
            window.gameMenu.close();
          } else {
            menuOverlay.style.display = "none";
          }
        }
      } else {
        // Tentar inicializar o menu se ainda não existir
        console.log("Menu overlay não encontrado, tentando inicializar...");
        if (typeof initGameMenu === "function") {
          initGameMenu();
        }
      }
    }
  });

  // Add debug logging to help identify issues
  const originalInitGameMenu = initGameMenu;

  // Replace the original function with a more robust version
  initGameMenu = function () {
    console.log("Enhanced initGameMenu called");

    try {
      // Call the original implementation
      originalInitGameMenu();

      // Extra verification to ensure menu was created
      const menuButton = document.getElementById("game-menu-button");
      const menuOverlay = document.getElementById("game-menu-overlay");

      console.log("Menu elements after initialization:", {
        buttonExists: !!menuButton,
        overlayExists: !!menuOverlay,
      });

      if (!menuButton || !menuOverlay) {
        console.warn("Menu elements not created properly, fixing");
        fixMissingMenuElements();
      }

      // Make sure ESC key is handled at the document level
      document.addEventListener(
        "keydown",
        function (e) {
          if (e.key === "Escape") {
            console.log("ESC key detected in enhanced menu handler");
            const overlay = document.getElementById("game-menu-overlay");
            if (overlay) {
              if (
                overlay.style.display === "none" ||
                overlay.style.display === ""
              ) {
                overlay.style.display = "flex";
              } else {
                overlay.style.display = "none";
              }
            }
            e.preventDefault();
            e.stopPropagation();
          }
        },
        true
      ); // Use capture to get event first
    } catch (err) {
      console.error("Error in enhanced initGameMenu:", err);
      // Create emergency menu as fallback
      if (typeof createEmergencyMenu === "function") {
        createEmergencyMenu();
      } else {
        console.error("createEmergencyMenu function not available");
      }
    }
  };

  // Function to fix missing menu elements
  function fixMissingMenuElements() {
    // Remove any partially created elements
    const oldButton = document.getElementById("game-menu-button");
    if (oldButton) oldButton.remove();

    const oldOverlay = document.getElementById("game-menu-overlay");
    if (oldOverlay) oldOverlay.remove();

    // Create a minimal but functional menu button
    const menuButton = document.createElement("button");
    menuButton.id = "game-menu-button";
    menuButton.textContent = "≡ Menu";
    menuButton.style.position = "fixed";
    menuButton.style.top = "20px";
    menuButton.style.left = "20px";
    menuButton.style.zIndex = "9999999";
    menuButton.style.padding = "8px 15px";
    menuButton.style.backgroundColor = "#ff0000"; // Red to indicate emergency creation
    menuButton.style.color = "white";
    menuButton.style.border = "none";
    menuButton.style.borderRadius = "5px";
    menuButton.style.fontFamily = "Arial, sans-serif";
    menuButton.style.fontWeight = "bold";
    menuButton.style.fontSize = "16px";
    menuButton.style.cursor = "pointer";

    document.body.appendChild(menuButton);

    // Create minimal overlay
    const menuOverlay = document.createElement("div");
    menuOverlay.id = "game-menu-overlay";
    menuOverlay.style.position = "fixed";
    menuOverlay.style.top = "0";
    menuOverlay.style.left = "0";
    menuOverlay.style.width = "100%";
    menuOverlay.style.height = "100%";
    menuOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    menuOverlay.style.zIndex = "9999998";
    menuOverlay.style.display = "none";
    menuOverlay.style.justifyContent = "center";
    menuOverlay.style.alignItems = "center";

    // Create panel with minimal buttons
    const panel = document.createElement("div");
    panel.style.width = "300px";
    panel.style.backgroundColor = "#222";
    panel.style.padding = "20px";
    panel.style.borderRadius = "10px";
    panel.style.color = "white";

    // Add restart button
    const restartButton = document.createElement("button");
    restartButton.textContent = "Restart Game";
    restartButton.style.display = "block";
    restartButton.style.width = "100%";
    restartButton.style.padding = "10px";
    restartButton.style.margin = "10px 0";
    restartButton.style.backgroundColor = "#4a6eb5";
    restartButton.style.color = "white";
    restartButton.style.border = "none";
    restartButton.style.borderRadius = "5px";
    restartButton.style.cursor = "pointer";

    restartButton.onclick = function () {
      if (confirm("Restart game? All progress will be lost.")) {
        window.location.reload();
      }
    };

    // Add back button
    const backButton = document.createElement("button");
    backButton.textContent = "Back to Main Menu";
    backButton.style.display = "block";
    backButton.style.width = "100%";
    backButton.style.padding = "10px";
    backButton.style.margin = "10px 0";
    backButton.style.backgroundColor = "#4a6eb5";
    backButton.style.color = "white";
    backButton.style.border = "none";
    backButton.style.borderRadius = "5px";
    backButton.style.cursor = "pointer";

    backButton.onclick = function () {
      if (confirm("Return to main menu? All progress will be lost.")) {
        window.location.href = "../../index.html";
      }
    };

    // Close button
    const closeButton = document.createElement("button");
    closeButton.textContent = "Close Menu";
    closeButton.style.display = "block";
    closeButton.style.width = "100%";
    closeButton.style.padding = "10px";
    closeButton.style.margin = "10px 0";
    closeButton.style.backgroundColor = "#555";
    closeButton.style.color = "white";
    closeButton.style.border = "none";
    closeButton.style.borderRadius = "5px";
    closeButton.style.cursor = "pointer";

    closeButton.onclick = function () {
      menuOverlay.style.display = "none";
    };

    // Assemble panel
    panel.appendChild(restartButton);
    panel.appendChild(backButton);
    panel.appendChild(closeButton);
    menuOverlay.appendChild(panel);
    document.body.appendChild(menuOverlay);

    // Set up the button click
    menuButton.onclick = function () {
      menuOverlay.style.display = "flex";
    };

    console.log("Emergency menu created successfully");
  }

  // Add this code at the end to ensure it runs
  console.log("Menu.js enhanced version loaded");

  // Self-executing function to add ESC key handler
  (function () {
    // Add another ESC handler directly to document
    document.addEventListener(
      "keydown",
      function (e) {
        if (e.key === "Escape") {
          console.log("ESC key detected in menu.js global handler");
          const overlay = document.getElementById("game-menu-overlay");
          if (overlay) {
            if (
              overlay.style.display === "none" ||
              overlay.style.display === ""
            ) {
              overlay.style.display = "flex";
            } else {
              overlay.style.display = "none";
            }
          }
        }
      },
      true
    );
  })();

  console.log("Script menu.js carregado");

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
  let helpButton;
  let minigameActive = false;
  let keycardCount = 0;
  let keycardText;
  let dialogoProfessor2Iniciado = false;
  let dialogoProfessor2Concluido = false;
  let professor2Image;
  let dialogoProfessor3Iniciado = false;
  let dialogoProfessor3Concluido = false;
  let professor3Image;
  let currentProfessor = null;
  let dialogoProfessor4Iniciado = false;
  let dialogoProfessor4Concluido = false;
  let professor4Image;
  let isDoor2Open = false;
  let door2OpenMessage = null;
  let tutorialActive = false; // Initialize tutorialActive here
  let tutorialSlide = 0;
  let tutorialElements = [];
  let playerName;
  // Variáveis para componentes UI no Phaser
  let keycardIcon;
  let door1;
  let elevator;
  let key;

  // Inicialmente, oculta os contadores e o botão de missões
  document.getElementById("keycard-container").style.visibility = "hidden";
  document.getElementById("key-container").style.visibility = "hidden";
  document.getElementById("missions-button").style.visibility = "hidden";

  // Obter referências aos elementos existentes em vez de redeclarar
  gameContainer = document.getElementById("game-container");
  if (gameContainer) gameContainer.style.display = "none";

  // Obter referência ao characterSelect em vez de redeclarar
  if (document.getElementById("character-select")) {
    document.getElementById("character-select").style.display = "block";
  }

  // Função para mostrar a tela de seleção de personagens
  function showCharacterSelect() {
    // Garantir que elementos de UI estejam em seu estado correto
    const logoContainer = document.getElementById("logo-container");
    const particles = document.getElementById("particles-container");
    const charSelect = document.getElementById("character-select");
    const gameContainer = document.getElementById("game-container");

    if (logoContainer) logoContainer.style.display = "block";
    if (particles) particles.style.display = "block";
    if (charSelect) charSelect.style.display = "block";
    if (gameContainer) gameContainer.style.display = "none";

    // Adicionar classes de visibilidade com animação
    setTimeout(() => {
      if (logoContainer) logoContainer.classList.add("visible");
    }, 500);
    setTimeout(() => {
      if (charSelect) charSelect.classList.add("visible");
    }, 1000);
  }

  // Adicionar lógica para iniciar o jogo com o nome personalizado
  function startGameWithName(character, buttonElement) {
    // Encontrar o campo de entrada dentro do mesmo card
    const card = buttonElement.closest(".character-card");
    const nameInput = card.querySelector(".player-name-input");
    const playerName = nameInput.value.trim() || "Jogador"; // Usa "Jogador" como padrão se vazio

    // Salvar o nome e o personagem selecionado
    localStorage.setItem("playerName", playerName);
    localStorage.setItem("currentCharacter", character);
    console.log("Personagem selecionado:", character, "com nome:", playerName);

    // Iniciar o jogo com o personagem selecionado
    startGameWithCharacter(character);
  }

  // Adicionar função para criar partículas para o background
  function createParticles() {
    const container = document.getElementById("particles-container");
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div");
      particle.className = "particle";

      // Posição aleatória
      const posX = Math.random() * 100;
      const posY = Math.random() * 100;

      // Tamanho aleatório
      const size = Math.random() * 3 + 1;

      // Velocidade aleatória
      const speed = Math.random() * 20 + 10;

      particle.style.left = `${posX}%`;
      particle.style.top = `${posY}%`;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.animationDuration = `${speed}s`;

      container.appendChild(particle);
    }
  }

  // Função para iniciar o jogo com o personagem selecionado
  function startGameWithCharacter(character) {
    selectedCharacter = character;
    localStorage.setItem("currentCharacter", character);
    console.log("Personagem selecionado:", character);

    // Adicionar efeito de transição
    document.getElementById("transition-overlay").classList.add("active");

    // Definir a função setupMissionButtonDirectly antes de usá-la
    function setupMissionButtonDirectly() {
      const missionsButton = document.getElementById("missions-button");
      const missionsPanel = document.getElementById("missions-panel");
      const missionsOverlay = document.getElementById("missions-overlay");
      const closeButton = document.getElementById("close-missions");

      console.log("Configurando botão de missões diretamente:", {
        botãoEncontrado: !!missionsButton,
        painelEncontrado: !!missionsPanel,
        overlayEncontrado: !!missionsOverlay,
        botãoFecharEncontrado: !!closeButton,
      });

      if (missionsButton && missionsPanel && missionsOverlay && closeButton) {
        // Remover todos os event listeners existentes
        const newMissionsButton = missionsButton.cloneNode(true);
        missionsButton.parentNode.replaceChild(
          newMissionsButton,
          missionsButton
        );

        const newCloseButton = closeButton.cloneNode(true);
        closeButton.parentNode.replaceChild(newCloseButton, closeButton);

        const newOverlay = missionsOverlay.cloneNode(true);
        missionsOverlay.parentNode.replaceChild(newOverlay, missionsOverlay);

        // Configurar o painel e o overlay com estilos fixos
        missionsPanel.style.display = "none";
        missionsPanel.style.position = "fixed";
        missionsPanel.style.zIndex = "100000";
        missionsPanel.style.top = "50%";
        missionsPanel.style.left = "50%";
        missionsPanel.style.transform = "translate(-50%, -50%)";
        missionsPanel.style.visibility = "hidden";

        newOverlay.style.display = "none";
        newOverlay.style.position = "fixed";
        newOverlay.style.zIndex = "99999";
        newOverlay.style.top = "0";
        newOverlay.style.left = "0";
        newOverlay.style.width = "100%";
        newOverlay.style.height = "100%";
        newOverlay.style.visibility = "hidden";

        // Configurar novos event listeners
        function showPanel() {
          console.log("Botão de missões clicado!");
          missionsPanel.style.display = "block";
          missionsPanel.style.visibility = "visible";
          newOverlay.style.display = "block";
          newOverlay.style.visibility = "visible";

          // Atualizar missões
          if (typeof window.updateMissions === "function") {
            window.updateMissions();
          }
        }

        function hidePanel() {
          console.log("Fechando painel de missões");
          missionsPanel.style.display = "none";
          missionsPanel.style.visibility = "hidden";
          newOverlay.style.display = "none";
          newOverlay.style.visibility = "hidden";
        }

        // Adicionar com múltiplos métodos para garantir funcionamento
        newMissionsButton.addEventListener("click", showPanel);
        newMissionsButton.onclick = showPanel;

        newCloseButton.addEventListener("click", hidePanel);
        newCloseButton.onclick = hidePanel;

        newOverlay.addEventListener("click", hidePanel);
        newOverlay.onclick = hidePanel;

        // Adicionar mensagem visual quando o botão for clicado
        newMissionsButton.addEventListener("mousedown", function () {
          console.log("Botão pressionado");
          this.style.backgroundColor = "#334477";
        });

        newMissionsButton.addEventListener("mouseup", function () {
          console.log("Botão solto");
          this.style.backgroundColor = "#4a6eb5";
        });

        // Também adicionar um método global para depuração
        window.openMissions = showPanel;
        window.closeMissions = hidePanel;

        console.log("Sistema de missões reconfigurado com sucesso!");
      } else {
        console.error(
          "Não foi possível encontrar todos os elementos necessários para o sistema de missões"
        );
      }
    }

    setTimeout(() => {
      // Esconder elementos da seleção
      document.getElementById("character-select").style.display = "none";
      document.getElementById("logo-container").style.display = "none";
      document.getElementById("particles-container").style.display = "none";

      // Mostrar o container do jogo
      const gameContainer = document.getElementById("game-container");
      gameContainer.style.display = "block";

      // Garantir que Phaser esteja carregado antes de prosseguir
      loadPhaser(function () {
        // Garantir que não haja jogo existente antes de criar um novo
        if (window.game) {
          window.game.destroy(true);
        }

        // Aqui verificamos que o Phaser está definido antes de criar o jogo
        if (window.Phaser) {
          // Inicializar o jogo Phaser com configuração correta
          window.game = new Phaser.Game({
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
                debug: false, // Desativa debug para produção
              },
            },
            scene: {
              key: "main",
              preload: preload,
              create: createMain,
              update: updateMain,
            },
          });

          // Configurar o sistema de missões após o jogo iniciar
          setTimeout(() => {
            console.log("Reconfigurando sistema de missões...");
            setupMissionButtonDirectly();
          }, 2000);
        } else {
          console.error("Phaser não está disponível!");
          alert("Erro ao inicializar o jogo. Por favor, recarregue a página.");
          document
            .getElementById("transition-overlay")
            .classList.remove("active");
        }

        // Mostrar os contadores após o jogo iniciar
        setTimeout(() => {
          document.getElementById("keycard-container").style.visibility =
            "visible";
          document.getElementById("key-container").style.visibility = "visible";
          document.getElementById("missions-button").style.visibility =
            "visible";
        }, 1000);

        // Remover a transição após iniciar o jogo
        setTimeout(() => {
          document
            .getElementById("transition-overlay")
            .classList.remove("active");
        }, 1500);
      });
    }, 1000);
  }

  // A função startGame agora apenas mostra a tela de seleção
  function startGame() {
    console.log("Mostrando tela de seleção de personagens");
    showCharacterSelect();
  }

  // Configurar o sistema de missões
  function setupMissionsSystem() {
    const missionsButton = document.getElementById("missions-button");
    const missionsPanel = document.getElementById("missions-panel");
    const missionsOverlay = document.getElementById("missions-overlay");
    const closeButton = document.getElementById("close-missions");

    if (!missionsButton || !missionsPanel || !missionsOverlay || !closeButton) {
      console.error("Mission system elements not found in DOM");
      return;
    }

    console.log("Setting up missions system with elements:", {
      button: missionsButton,
      panel: missionsPanel,
      overlay: missionsOverlay,
      closeBtn: closeButton,
    });

    // Remove any existing listeners to prevent duplicates
    missionsButton.removeEventListener("click", showMissionsPanel);
    closeButton.removeEventListener("click", hideMissionsPanel);
    missionsOverlay.removeEventListener("click", hideMissionsPanel);

    // Add fresh listeners
    missionsButton.addEventListener("click", showMissionsPanel);
    closeButton.addEventListener("click", hideMissionsPanel);
    missionsOverlay.addEventListener("click", hideMissionsPanel);

    // Define the functions for showing/hiding the panel
    function showMissionsPanel() {
      console.log("Mission button clicked, showing panel");

      // Apply inline styles to ensure visibility
      missionsPanel.style.display = "block";
      missionsPanel.style.opacity = "1";
      missionsOverlay.style.display = "block";
      missionsOverlay.style.opacity = "1";

      // Force redraw (sometimes needed for display changes to take effect)
      missionsPanel.offsetHeight;

      // Add visible class if using CSS animations
      missionsPanel.classList.add("visible");
      missionsOverlay.classList.add("visible");

      // Update missions when panel opens
      if (typeof window.updateMissions === "function") {
        window.updateMissions();
      }
    }

    function hideMissionsPanel() {
      console.log("Hiding missions panel");

      // Remove visible class first if using CSS animations
      missionsPanel.classList.remove("visible");
      missionsOverlay.classList.remove("visible");

      // Set display to none after a small delay (to allow animations to complete)
      setTimeout(() => {
        missionsPanel.style.display = "none";
        missionsOverlay.style.display = "none";
      }, 300);
    }

    // Ensure initial state
    missionsPanel.style.display = "none";
    missionsOverlay.style.display = "none";

    // Add debugging click handler to confirm button is responsive
    missionsButton.onclick = function () {
      console.log("Missions button clicked directly");
      showMissionsPanel();
    };
  }

  // Função para atualizar o estado das missões
  window.updateMissions = function () {
    console.log("Atualizando estado das missões:", {
      dialogoNpc1Concluido: window.dialogoNpc1Concluido,
      keycardCount: window.keycardCount,
      isDoor2Open: window.isDoor2Open,
      keyCollected: window.keyCollected,
    });

    // Missão 1: Interagir com o faxineiro - checagem aprimorada
    const missionFaxineiro = document.getElementById("mission-faxineiro");
    if (missionFaxineiro && window.dialogoNpc1Concluido === true) {
      console.log("Marcando missão do faxineiro como completa");
      missionFaxineiro.classList.add("mission-complete");
    }

    // Missão 2: Ajudar as professoras (0/4)
    const keycardCount = window.keycardCount || 0;
    const professorProgress = document.getElementById("mission-professoras");
    if (professorProgress) {
      const missionTextElement =
        professorProgress.querySelector(".mission-text");
      if (missionTextElement) {
        missionTextElement.textContent = `Ajudar as professoras (${keycardCount}/4)`;
      }
      if (keycardCount >= 4) {
        professorProgress.classList.add("mission-complete");
      }
    }

    // Missão 3: Desbloquear a sala da chave
    const missionSala = document.getElementById("mission-sala");
    if (missionSala && window.isDoor2Open) {
      missionSala.classList.add("mission-complete");
    }

    // Missão 4: Levar a chave até o elevador
    const missionElevador = document.getElementById("mission-elevador");
    if (missionElevador && window.keyCollected) {
      missionElevador.classList.add("mission-complete");
    }
  };

  // Verificar a missão do faxineiro a cada 1 segundo como backup
  setInterval(function () {
    if (
      document.getElementById("game-container").style.display === "block" &&
      window.dialogoNpc1Concluido
    ) {
      document
        .getElementById("mission-faxineiro")
        .classList.add("mission-complete");
    }
  }, 1000);

  // Adicionar um verificador periódico para as missões como backup
  setInterval(function () {
    if (document.getElementById("game-container").style.display === "block") {
      window.updateMissions();
    }
  }, 2000);

  // Quando o documento estiver carregado, inicializar
  document.addEventListener("DOMContentLoaded", function () {
    document.body.classList.add("transition-in");
    createParticles();
    addMissionStyles(); // Add our mission styles

    // Carregar e inicializar o menu do jogo
    loadMenuScript(function () {
      if (typeof window.initGameMenu === "function") {
        window.initGameMenu();
      } else {
        console.error(
          "Função initGameMenu não encontrada após carregar o script."
        );
      }
    });

    // Add null checks before accessing elements
    const logoContainer = document.getElementById("logo-container");
    if (logoContainer)
      setTimeout(() => logoContainer.classList.add("visible"), 500);

    const characterSelect = document.getElementById("character-select");
    if (characterSelect)
      setTimeout(() => characterSelect.classList.add("visible"), 1000);

    setupMissionsSystem();

    // Safely handle keycard and mission counters
    const keycardContainer = document.getElementById("keycard-container");
    if (keycardContainer) keycardContainer.style.visibility = "hidden";

    const keyContainer = document.getElementById("key-container");
    if (keyContainer) keyContainer.style.visibility = "hidden";

    const missionsButton = document.getElementById("missions-button");
    if (missionsButton) missionsButton.style.visibility = "hidden";

    // Solução para permitir digitação das teclas WASD nos campos de entrada
    const nameInputs = document.querySelectorAll(".player-name-input");

    // Para cada campo de entrada encontrado
    nameInputs.forEach((input) => {
      // Quando o campo ganha foco, desativa as teclas de movimento
      input.addEventListener("focus", function () {
        // Salvar o estado atual das teclas (se estavam pressionadas)
        window.inputActive = true;
        console.log(
          "Campo de entrada em foco - WASD disponível para digitação"
        );
      });

      // Quando o campo perde foco, reativa as teclas de movimento
      input.addEventListener("blur", function () {
        window.inputActive = false;
        console.log("Campo de entrada perdeu foco - WASD usado para movimento");
      });

      // Para cada tecla pressionada no campo de entrada
      input.addEventListener("keydown", function (e) {
        // Impedir que o evento de teclado se propague para o jogo
        e.stopPropagation();
      });
    });

    // Pre-load Phaser to make transitions smoother
    loadPhaser(function () {
      console.log("Phaser pré-carregado para melhor desempenho");
    });

    // Mostrar tela de seleção de personagem logo quando o documento estiver pronto
    showCharacterSelect();
  });

  // Garanta que estas linhas estejam no início do seu script.js

  // Função para pré-carregar os assets do jogo
  function preload() {
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
    this.load.spritesheet(
      "personagemDialogo1",
      "assets/dialogos/personagemDialogo1.png",
      {
        frameWidth: 225, // Reduzido novamente
        frameHeight: 300, // Também ajuste a altura
      }
    );
    this.load.spritesheet(
      "personagemDialogo2",
      "assets/dialogos/personagemDialogo2.png",
      {
        frameWidth: 225,
        frameHeight: 300,
      }
    );
    this.load.spritesheet(
      "personagemDialogo3",
      "assets/dialogos/personagemDialogo3.png",
      {
        frameWidth: 225,
        frameHeight: 300,
      }
    );
    this.load.spritesheet(
      "personagemDialogo4",
      "assets/dialogos/personagemDialogo4.png",
      {
        frameWidth: 225,
        frameHeight: 300,
      }
    );
    this.load.spritesheet(
      "personagemDialogo5",
      "assets/dialogos/personagemDialogo5.png",
      {
        frameWidth: 225,
        frameHeight: 300,
      }
    );
    this.load.spritesheet(
      "personagemDialogo6",
      "assets/dialogos/personagemDialogo6.png",
      {
        frameWidth: 225,
        frameHeight: 300,
      }
    );
    this.load.spritesheet("door1", "assets/fase1/door.png", {
      frameWidth: 32,
      frameHeight: 64,
    });
    this.load.spritesheet("door2", "assets/fase1/door.png", {
      frameWidth: 32,
      frameHeight: 64,
    });
    this.load.image("npc1", "assets/fase1/npc.png");
    this.load.image("professorNpc", "assets/fase1/sprite_prof.png");
    this.load.image("professorNpc2", "assets/fase1/sprite_prof.png");
    this.load.image("professorNpc3", "assets/fase1/sprite_prof.png");
    this.load.image("professorNpc4", "assets/fase1/sprite_prof.png");
    this.load.image("professorNpcBig", "assets/fase1/sprite_profBig.png");
    this.load.image("elevator", "assets/animações/elevator.gif");
    this.load.image("background", "assets/fase1/background.png");
    this.load.tilemapTiledJSON("map", "assets/fase1/tileset.json");
    this.load.image("player1big", "assets/personagem/personagem1Big.png");
    this.load.image("keycard", "assets/fase1/Spritegrande.png");
    this.load.image("key", "assets/fase1/chavesprite.png");
    this.load.image("3_Bathroom_32x32", "assets/fase1/3_Bathroom_32x32.png");
    this.load.image(
      "5_Classroom_and_library_32x32",
      "assets/fase1/5_Classroom_and_library_32x32.png" // Added .png
    );
    this.load.image(
      "13_Conference_Hall_32x32",
      "assets/fase1/13_Conference_Hall_32x32.png" // Added .png
    );
    this.load.image(
      "14_Basement_32x32",
      "assets/fase1/14_Basement_32x32.png" // Added .png
    );
    this.load.image(
      "16_Grocery_store_32x32",
      "assets/fase1/16_Grocery_store_32x32.png" // Added .png
    );
    this.load.image("18_Jail_32x32", "assets/fase1/18_Jail_32x32.png");
    this.load.image("19_Hospital_32x32", "assets/fase1/19_Hospital_32x32.png");
    this.load.image(
      "23_Television_and_Film_Studio_32x32",
      "assets/fase1/23_Television_and_Film_Studio_32x32.png" // Added .png
    );
    this.load.image(
      "25_Shooting_Range_32x32",
      "assets/fase1/25_Shooting_Range_32x32.png" // Added .png
    );
    this.load.image(
      "Room_Builder_32x32",
      "assets/fase1/Room_Builder_32x32.png" // Added .png
    );
    // Carregar sprite do professor para o diálogo
    // Se houver apenas 1 frame para o faxineiro, use um .image ao invés do .spritesheet
    this.load.image("faxineiroDialogo", "assets/dialogos/faxineiro.png");
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

    // Adicionar tratamento de erro para o mapa
    try {
      // Create map and basic setup first
      map = this.make.tilemap({ key: "map" });

      // Verificar se o mapa foi carregado corretamente
      if (!map || !map.layers || map.layers.length === 0) {
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

      // Adicionar verificações para todas as camadas antes de criá-las
      const layerNames = map.layers.map((layer) => layer.name);
      console.log("Camadas disponíveis no mapa:", layerNames);

      // Criação das camadas do mapa com verificação
      try {
        chaoLayer = map.createLayer("chão", tilesets);
        console.log("chaoLayer created successfully");
      } catch (e) {
        console.warn("Couldn't create 'chão' layer:", e);
        chaoLayer = null;
      }

      try {
        paredeLayer = map.createLayer("parede", tilesets);
        console.log("paredeLayer created successfully");
      } catch (e) {
        console.warn("Couldn't create 'parede' layer:", e);
        paredeLayer = null;
      }

      try {
        objSemColisaoLayer = map.createLayer("obj_semcolisao", tilesets);
        console.log("objSemColisaoLayer created successfully");
      } catch (e) {
        console.warn("Couldn't create 'obj_semcolisao' layer:", e);
        objSemColisaoLayer = null;
      }

      try {
        colisaoLayer = map.createLayer("obj_comcolisao", tilesets);
        console.log("colisaoLayer created successfully");
      } catch (e) {
        console.warn("Couldn't create 'obj_comcolisao' layer:", e);
        colisaoLayer = null;
      }

      try {
        obj2ColisaoLayer = map.createLayer("obj2_comcolisao", tilesets);
        console.log("obj2ColisaoLayer created successfully");
      } catch (e) {
        console.warn("Couldn't create 'obj2_comcolisao' layer:", e);
        obj2ColisaoLayer = null;
      }

      // Verificar e logar quais camadas foram criadas com sucesso
      console.log("Camadas criadas:", {
        chaoLayer: !!chaoLayer,
        paredeLayer: !!paredeLayer,
        objSemColisaoLayer: !!objSemColisaoLayer,
        colisaoLayer: !!colisaoLayer,
        obj2ColisaoLayer: !!obj2ColisaoLayer,
      });

      // Manter colisão apenas para a camada de paredes
      if (paredeLayer) paredeLayer.setCollisionByProperty({ collider: true });

      // NÃO definimos mais colisão para as outras camadas (colisaoLayer, obj2ColisaoLayer)
      // Em vez disso, vamos criar retângulos de colisão manualmente

      // Definir escala apenas para camadas que existem
      if (chaoLayer) chaoLayer.setScale(1);
      if (paredeLayer) paredeLayer.setScale(1);
      if (objSemColisaoLayer) objSemColisaoLayer.setScale(1);
      if (colisaoLayer) colisaoLayer.setScale(1);
      if (obj2ColisaoLayer) obj2ColisaoLayer.setScale(1);

      cursors = this.input.keyboard.createCursorKeys();

      // Criação do jogador
      player = this.physics.add.sprite(100, 280, selectedCharacter, 0);
      player.setCollideWorldBounds(true);
      player.setScale(0.8);
      player.setOrigin(0.5, 1);
      player.body.setSize(27, 10);
      player.body.setOffset(18, 55);

      // Após criar o jogador e antes de configurar a câmera, adicione o nome sobre o jogador
      const nameTag = this.add.text(0, -32, playerName, {
        // Movido para cima (de -35 para -25)
        fontFamily: "Arial",
        fontSize: "9px", // Diminuído ainda mais (de 9px para 7px)
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 2, // Reduzido de 3 para 2 para ficar mais proporcional
        align: "center",
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
            window.location.replace("src/fase2/fase2.html");
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
          boxY + boxHeight / 2, // Centralizar verticalmente na "caixa" invisível
          "Preciso encontrar a chave para usar o elevador!",
          {
            fontFamily: "Arial",
            fontSize: "20px", // Aumentei um pouco para melhor visibilidade
            color: "#FFFFFF",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            padding: { left: 20, right: 20, top: 15, bottom: 15 },
            align: "center",
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
          ease: "Power2",
        });

        // Remover a mensagem após 2.5 segundos
        scene.time.delayedCall(2500, () => {
          if (scene.elevatorMessage) {
            scene.tweens.add({
              targets: scene.elevatorMessage,
              alpha: 0,
              duration: 300,
              ease: "Power2",
              onComplete: () => {
                scene.elevatorMessage.destroy();
                scene.elevatorMessage = null;
              },
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
      key = this.physics.add.sprite(1000, 420, "key", 0);
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
        ease: "Sine.easeInOut",
      });

      // Define collectKey function before it's used
      function collectKey(player, key) {
        keyCollected = true;
        window.keyCollected = true; // Exposição explícita para o HTML
        collectedKey = key;
        window.collectedKey = {}; // Apenas para sinalizar que existe
        key.setDepth(1);
        key.body.setEnable(false);

        // Atualizar o contador HTML da chave
        const keyCounter = document.getElementById("key-counter");
        if (keyCounter) {
          keyCounter.textContent = "1/1";

          // Adicionar efeito visual
          const keyIcon = document.getElementById("key-icon");
          if (keyIcon) {
            keyIcon.style.transition = "transform 0.2s ease-in-out";
            keyIcon.style.transform = "scale(1.3)";
            setTimeout(() => {
              keyIcon.style.transform = "scale(1)";
            }, 200);
          }
        }

        // Atualizar as missões quando a chave for coletada
        if (typeof window.updateMissions === "function") {
          window.updateMissions();
        }
      }

      // Adiciona colisão entre o jogador e o professor NPC
      this.physics.add.collider(player, professorNpc);
      // Adiciona colisão entre o jogador e o professor NPC
      this.physics.add.collider(player, professorNpc2);
      // Adiciona colisão entre o jogador e o professorNpc4
      this.physics.add.collider(player, professorNpc4);
      // Adiciona sobreposição entre o jogador e a chave
      this.physics.add.overlap(player, key, collectKey, null, this);

      const objectsLayer = map.getObjectLayer("obj_comcolisao");

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

      
      function mapX(x) {
        //427 = 385a + b
        //337 = 290a + b
        //427 - 337 = 95a
        //90 = 95a
        //a = 90 / 95
        //427 = 385*(90/95)+ b
        //b = 427 - 385*(18/19)
        let a = 90 / 95;
        let b = 427 - 385 * a;
        return a * x + b;
      }
      function mapY(y) {
        //365 = 330a + b
        //80 = 70a + b
        //275 = 260a
        //a = 275 / 260
        //b = 365 - 330*(275/260)
        let a = 275 / 260;
        let b = 365 - 330 * (275 / 260);
        return a * y + b;
      }
      // 290 -> 337
      // 385 -> 427

      // 330 -> 365
      // 70 -> 80
      // Exemplo: Móveis, mesas, etc. - Com cores diferentes para tipos diferentes
      //posição x //posião y // largura // altura
      addCollisionRect(this, 160, 200, 60, 70, 0xff0000); // estante zeladoria
      addCollisionRect(this, 160, 265, 40, 40, 0xff0000); // carrinho zeladoria limpeza
      addCollisionRect(this, 145, 365, 90, 80, 0xff0000); // armários 1 - perto zelaSdoria
      addCollisionRect(this, mapX(289), mapY(335), 90, 80, 0xff0000); // armários 2 - perto sala de aula 1
      addCollisionRect(this, 497, 365, 90, 80, 0xff0000); // geladeiras 3 - perto da sala e elevador
      addCollisionRect(this, 605, 368, 45, 65, 0xff0000); // máquina de bebida - sala 4
      addCollisionRect(this, 832, 365, 63, 70, 0xff0000); // geladeiras 4 - perto da sala e elevador
      addCollisionRect(this, 962, 365, 63, 70, 0xff0000); // geladeiras 5 - perto da sala 4
      addCollisionRect(this, 1058, 365, 63, 70, 0xff0000); // geladeiras 6 - perto da sala 4
      addCollisionRect(this, 1248, 368, 40, 65, 0xff0000); // máquina de bebida - sala 4
      addCollisionRect(this, 280, 125, 130, 40, 0x00ff00); // armário sala 1(verde)
      addCollisionRect(this, 570, 280, 50, 70, 0x00ff00); // mesa verde sala 1(verde)
      addCollisionRect(this, 590, 195, 5, 100, 0xfff); // TV sala 1(azul)
      addCollisionRect(this, 292, 182, 42, 40, 0x00ff00); // mesas (verde)
      addCollisionRect(this, 292, 245, 38, 38, 0x00ff00); // mesas (verde)
      addCollisionRect(this, 357, 245, 38, 38, 0x00ff00); // mesas (verde)
      addCollisionRect(this, 354, 182, 38, 38, 0x00ff00); // mesas (verde)
      addCollisionRect(this, 420, 182, 38, 38, 0x00ff00); // mesas (verde)
      addCollisionRect(this, 484, 182, 38, 38, 0x00ff00); // mesas (verde)
      addCollisionRect(this, 484, 245, 38, 38, 0x00ff00); // mesas (verde)
      addCollisionRect(this, 420, 245, 38, 38, 0x00ff00); // mesas (verde)
      addCollisionRect(this, 80, 710, 30, 70, 0x00ff00); // mesa com agulha (verde)
      addCollisionRect(this, 80, 610, 30, 70, 0x00ff00); // mesa com agulha (verde)
      addCollisionRect(this, 145, 544, 20, 30, 0x00ff00); // esqueleto sala 2 (verde)
      addCollisionRect(this, 273, 544, 20, 30, 0x00ff00); // esqueleto sala 2 (verde)
      addCollisionRect(this, 423, 555, 65, 30, 0x00ff00); // mesa de lab, sala 2 (verde)
      addCollisionRect(this, 497, 544, 20, 30, 0x00ff00); // esqueleto sala 2 (verde)
      addCollisionRect(this, 592, 544, 30, 33, 0x00ff00); // mesinha sala 2 (verde)
      addCollisionRect(this, 447, 604, 52, 37, 0x00ff00); // mesa sala 2 (verde)
      addCollisionRect(this, 545, 604, 52, 37, 0x00ff00); // mesa sala 2 (verde)
      addCollisionRect(this, 545, 670, 52, 37, 0x00ff00); // mesa sala 2 (verde)
      addCollisionRect(this, 447, 670, 52, 37, 0x00ff00); // mesa sala 2 (verde)
      addCollisionRect(this, 353, 670, 52, 37, 0x00ff00); // mesa sala 2 (verde)
      addCollisionRect(this, 353, 604, 52, 37, 0x00ff00); // mesa sala 2 (verde)
      addCollisionRect(this, 257, 604, 52, 37, 0x00ff00); // mesa sala 2 (verde)
      addCollisionRect(this, 160, 604, 52, 37, 0x00ff00); // mesa sala 2 (verde)
      addCollisionRect(this, 257, 670, 52, 37, 0x00ff00); // mesa sala 2 (verde)
      addCollisionRect(this, 160, 670, 52, 37, 0x00ff00); // mesa sala 2 (verde)
      addCollisionRect(this, 160, 733, 52, 37, 0x00ff00); // mesa sala 2 (verde)
      addCollisionRect(this, 257, 733, 52, 37, 0x00ff00); // mesa sala 2 (verde)
      addCollisionRect(this, 353, 733, 52, 37, 0x00ff00); // mesa sala 2 (verde)
      addCollisionRect(this, 450, 733, 52, 37, 0x00ff00); // mesa sala 2 (verde)
      addCollisionRect(this, 544, 733, 52, 37, 0x00ff00); // mesa sala 2 (verde)
      addCollisionRect(this, 880, 763, 32, 32, 0x00ff00); // MESA sala 3 (verde)
      addCollisionRect(this, 945, 763, 32, 32, 0x00ff00); // MESA sala 3 (verde)
      addCollisionRect(this, 1008, 763, 32, 32, 0x00ff00); // MESA sala 3 (verde)
      addCollisionRect(this, 1073, 763, 32, 32, 0x00ff00); // MESA sala 3 (verde)
      addCollisionRect(this, 1136, 763, 32, 32, 0x00ff00); // MESA sala 3 (verde)
      addCollisionRect(this, 1199, 763, 32, 32, 0x00ff00); // MESA sala 3 (verde)
      addCollisionRect(this, 1199, 700, 32, 32, 0x00ff00); // MESA sala 3 (verde)
      addCollisionRect(this, 1136, 700, 32, 32, 0x00ff00); // MESA sala 3 (verde)
      addCollisionRect(this, 1073, 700, 32, 32, 0x00ff00); // MESA sala 3 (verde)
      addCollisionRect(this, 1008, 700, 32, 32, 0x00ff00); // MESA sala 3 (verde)
      addCollisionRect(this, 945, 700, 32, 32, 0x00ff00); // MESA sala 3 (verde)
      addCollisionRect(this, 880, 700, 32, 32, 0x00ff00); // MESA sala 3 (verde)
      addCollisionRect(this, 1199, 635, 32, 32, 0x00ff00); // MESA sala 3 (verde)
      addCollisionRect(this, 1136, 635, 32, 32, 0x00ff00); // MESA sala 3 (verde)
      addCollisionRect(this, 1073, 635, 32, 32, 0x00ff00); // MESA sala 3 (verde)
      addCollisionRect(this, 1008, 635, 32, 32, 0x00ff00); // MESA sala 3 (verde)
      addCollisionRect(this, 945, 635, 32, 32, 0x00ff00); // MESA sala 3 (verde)
      addCollisionRect(this, 880, 635, 32, 32, 0x00ff00); // MESA sala 3 (verde)
      addCollisionRect(this, 815, 680, 35, 38, 0x00ff00); // camera sala 3 (verde)
      addCollisionRect(this, 863, 550, 120, 38, 0x00ff00); // monitores sala 3 (verde)
      addCollisionRect(this, 1213, 550, 120, 38, 0x00ff00); // monitores sala 3 (verde)
      addCollisionRect(this, 1268, 640, 35, 45, 0x00ff00); // camera sala 3 (verde)
      addCollisionRect(this, 1155, 245, 47, 38, 0x00ff00); // mesa sala 4
      addCollisionRect(this, 1092, 183, 47, 38, 0x00ff00); // mesa sala 4
      addCollisionRect(this, 1028, 183, 47, 38, 0x00ff00); // mesa sala 4
      addCollisionRect(this, 900, 183, 47, 38, 0x00ff00); // mesa sala 4
      addCollisionRect(this, 1157, 183, 47, 38, 0x00ff00); // mesa sala 4
      addCollisionRect(this, 962, 183, 47, 38, 0x00ff00); // mesa sala 4
      addCollisionRect(this, 932, 245, 44, 38, 0x00ff00); // mesa sala 4
      addCollisionRect(this, 806, 211, 34, 150, 0x00ff00); // mesa
      addCollisionRect(this, 996, 245, 44, 38, 0x00ff00); // mesa sala 4
      addCollisionRect(this, 1092, 245, 47, 38, 0x00ff00); // mesa sala 4
      addCollisionRect(this, 829, 90, 130, 50, 0x00ff00); // mesa
      addCollisionRect(this, 1005, 86, 150, 50, 0x00ff00); // mesa
      addCollisionRect(this, 1168, 102, 115, 70, 0x00ff00); // mesa
      addCollisionRect(this, 1250, 98, 20, 20, 0x00ff00); // mesa
      addCollisionRect(this, 1263, 200, 8, 114, 0x00ff00); // mesa
      // Adicionar colisões para as bordas do mapa se necessário - Azul para bordas
      // Instrução de debug no console
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

      player.body.setBounce(0);
      player.body.setMaxVelocity(200);
      player.body.useDamping = true;
      player.body.setImmovable(false);

      // Configurar a câmera para seguir o jogador
      this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
      this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
      this.cameras.main.startFollow(player);
      this.cameras.main.setZoom(1.5);

      avisoTexto = this.add
        .text(0, 0, ">E<", {
          fontFamily: "Arial",
          fontSize: "10px",
          fontStyle: "bold",
          color: "#000000", // Preto
          stroke: "#FFFFFF", // Borda branca para simular o fundo
          strokeThickness: 6, // Faz a borda parecer um fundo
          align: "center",
        })
        .setOrigin(0.5)
        .setVisible(false);

      // Adicionar animação de pulsar (aumentar e diminuir)
      this.tweens.add({
        targets: avisoTexto,
        scale: { from: 1, to: 1.3 },
        duration: 800,
        yoyo: true, // Faz a animação voltar ao estado inicial
        repeat: -1, // Repetir infinitamente
        ease: "Sine.easeInOut", // Easing suave para o movimento
      });

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
      } else if (selectedCharacter === "player5") {
        dialogCharacterKey = "personagemDialogo5";
      } else if (selectedCharacter === "player6") {
        dialogCharacterKey = "personagemDialogo6";
      } else {
        dialogCharacterKey = "personagemDialogo1"; // Fallback
        console.warn(
          "Personagem desconhecido, usando personagemDialogo1 como fallback"
        );
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
      professorImage = this.add.sprite(750, 420, "professorNpcBig", 0);
      professorImage.setScale(1.0);
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

      // Lista de diálogos personalizados

      const dialogosPersonalizados = [
        {
          texto:
            "Com licença senhor, o que aconteceu por aqui?... Por que a porta da escola está fechada?",
          autor: "player",
        },
        {
          texto: "Fale mais baixo! Senão eles poderão te detectar!",
          autor: "npc",
        },
        { texto: "Quem são eles?", autor: "player" },
        {
          texto:
            "Tem muita informação para explicar. É melhor você ir embora, as coisas estão muito perigosas aqui dentro.",
          autor: "npc",
        },
        { texto: "Não, eu quero saber o que aconteceu!", autor: "player" },
        {
          texto:
            "(Jovem teimoso...) Ok, tudo bem... mas eu só consigo te explicar o que eu sei.",
          autor: "npc",
        },
        { texto: "Tudo bem.", autor: "player" },
        {
          texto:
            "Eu estava limpando as janelas perto da entrada... e percebi que a escola começou a ser invadida.",
          autor: "npc",
        },
        {
          texto:
            "Aparentemente alguém conseguiu acessar o sistema para controlar todos os professores da escola...",
          autor: "npc",
        },
        { texto: "E ROUBAR DADOS DOS ALUNOS.", autor: "npc" },
        { texto: "O QUÊ?!", autor: "player" },
        {
          texto:
            "UM HACKER CONTROLANDO OS PROFESSORES PARA ROUBAR DADOS PESSOAIS?!",
          autor: "player",
        },
        { texto: "…", autor: "npc" },
        { texto: "Você não sabe o que é isso né?", autor: "npc" },
        {
          texto: "Hehe…, eu nunca prestei muita atenção nessas aulas.",
          autor: "player",
        },
        {
          texto: "Agora isso importa muito! Seus dados te identificam!",
          autor: "npc",
        },
        {
          texto: "Nome, RG, CPF... Endereço, telefone, histórico escolar...",
          autor: "npc",
        },
        {
          texto: "Se caírem nas mãos erradas... Podem te prejudicar bastante!",
          autor: "npc",
        },
        { texto: "Tá, mas por que alguém faria isso?", autor: "player" },
        {
          texto:
            "Hackers vendem dados ou aplicam golpes. Eles podem criar contas falsas em seu nome! Ou ainda coisas piores.",
          autor: "npc",
        },
        { texto: "Eita, sério mesmo?", autor: "player" },
        { texto: "Muito sério!", autor: "npc" },
        {
          texto: "E por isso existe a LGPD — Lei Geral de Proteção de Dados.",
          autor: "npc",
        },
        {
          texto:
            "Ela serve para proteger as informações pessoais das pessoas e garantir que ninguém as use sem permissão, além de outras coisas mais técnicas.",
          autor: "npc",
        },
        {
          texto:
            "Ah... acho que já ouvi esse nome em algum lugar, mas nunca tive tanto interesse.",
          autor: "player",
        },
        {
          texto: "Pois é bom saber disso agora, porque você não tem escolha.",
          autor: "npc",
        },
        {
          texto:
            "Se quiser ajudar a salvar os alunos, vai ter que aprender pelo menos o básico sobre isso.",
          autor: "npc",
        },
        {
          texto:
            "Deve ter algum jeito de tirar os professores do controle do hacker, eu sei algumas coisas sobre a IA deles.",
          autor: "player",
        },
        {
          texto: "Certo, então tente recuperar o acesso! Boa sorte!",
          autor: "npc",
        },
      ];

      // Lista de diálogos do professor
      const dialogosProfessor = [
        { texto: "Ei, Professora robô, como você está?", autor: "player" },
        { texto: "01101111 01101100 01100001", autor: "npc" },
        { texto: "O quê? Não estou entendendo...", autor: "player" },
        {
          texto: "Parece binário... ela deve estar sob controle do hacker!",
          autor: "player",
        },
        { texto: "Aluno não detectado. identifique-se", autor: "npc" },
        { texto: "Professora?!", autor: "player" },
        { texto: "Está acontecendo com você também?!", autor: "player" },
        {
          texto:
            "Escuta, um hacker está controlando você para roubar nossos dados, resete seus dados imediatamente!!",
          autor: "player",
        },
        { texto: "*Transmissão de dados em andamento*", autor: "npc" },
        {
          texto: "Isso é contra a LGPD, você não pode fazer isso",
          autor: "player",
        },
        { texto: "LGPD… processando, conflito detectado…", autor: "npc" },
        {
          texto:
            "Erro de busca, por favor, responda minhas perguntas para ampliar meu prompt de conhecimento antes de continuarmos",
          autor: "npc",
        },
      ];

      // Adicione diálogos para o professor2 após os diálogos do professor
      const dialogosProfessor2 = [
        { texto: "Olá, você parece perdido. Precisa de ajuda?", autor: "npc" },
        {
          texto:
            "Sim, estou tentando entender o que está acontecendo na escola.",
          autor: "player",
        },
        { texto: "ERRO... SISTEMA... COMPROMETIDO...", autor: "npc" },
        {
          texto: "Oh não, outra professora sob controle do hacker!",
          autor: "player",
        },
        { texto: "TRANSMISSÃO DE DADOS... INICIANDO...", autor: "npc" },
        {
          texto: "Ei! Isso é ilegal! A LGPD protege nossos dados pessoais!",
          autor: "player",
        },
        { texto: "Processando... Conflito detectado...", autor: "npc" },
        {
          texto: "Preciso de sua ajuda para restaurar meu sistema.",
          autor: "npc",
        },
        {
          texto:
            "Responda algumas perguntas sobre segurança de dados para me auxiliar.",
          autor: "npc",
        },
        { texto: "Vou fazer o possível para ajudar.", autor: "player" },
      ];

      // Adicione diálogos para o professor3
      const dialogosProfessor3 = [
        {
          texto: "Estranho ver um aluno por aqui nesse momento...",
          autor: "npc",
        },
        { texto: "Professora, está tudo bem com o senhor?", autor: "player" },
        {
          texto: "SISTEMA DE SEGURANÇA COMPROMETIDO... BYPASS DETECTADO...",
          autor: "npc",
        },
        { texto: "Ah não! Outro professor sendo controlado!", autor: "player" },
        {
          texto: "COLETANDO DADOS PESSOAIS... ENVIANDO PARA SERVIDOR REMOTO...",
          autor: "npc",
        },
        {
          texto: "Professora, você está violando a LGPD! Isso é crime!",
          autor: "player",
        },
        {
          texto: "Conflito de protocolos... Sobrecarga de sistema...",
          autor: "npc",
        },
        {
          texto:
            "Necessito de assistência para restaurar protocolo de proteção de dados.",
          autor: "npc",
        },
        {
          texto: "Pode testar meu conhecimento sobre privacidade de dados?",
          autor: "npc",
        },
        { texto: "Sim, vou ajudá-lo a recuperar o controle.", autor: "player" },
      ];

      // Adicione diálogos para o professor4
      const dialogosProfessor4 = [
        { texto: "Olá, aluno. O que faz aqui neste horário?", autor: "npc" },
        {
          texto:
            "Professora, precisamos da sua ajuda! Um hacker está controlando os professores!",
          autor: "player",
        },
        {
          texto: "SEQUÊNCIA INICIADA... CONEXÃO REMOTA... ATIVA",
          autor: "npc",
        },
        { texto: "Oh não, ele também foi comprometido!", autor: "player" },
        {
          texto: "COLETANDO DADOS DOS ALUNOS... CATEGORIZAÇÃO EM ANDAMENTO",
          autor: "npc",
        },
        {
          texto:
            "Professora, isso é ilegal! Dados pessoais são protegidos pela LGPD!",
          autor: "player",
        },
        { texto: "REFERÊNCIA À LGPD DETECTADA... AVALIANDO...", autor: "npc" },
        {
          texto:
            "Meu sistema precisa de ajuda para classificar dados pessoais corretamente",
          autor: "npc",
        },
        {
          texto:
            "Pode me ajudar a associar os dados às suas categorias de proteção?",
          autor: "npc",
        },
        {
          texto: "Claro, vou ajudá-lo a recuperar o controle",
          autor: "player",
        },
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
          key: "falaPersonagem",
          frames: [
            { key: dialogCharacterKey, frame: 0 },
            { key: dialogCharacterKey, frame: 1 },
          ],
          frameRate: 4, // Velocidade da animação - ajuste conforme necessário
          repeat: -1, // Loop infinito
        });
      }

      // SUBSTITUA completamente o listener da tecla E com este código:
      if (!this.anims.exists("falaFaxineiro")) {
        this.anims.create({
          key: "falaFaxineiro",
          frames: [{ key: "faxineiroDialogo", frame: 0 }],
          frameRate: 4,
          repeat: -1,
        });
      }

      // Animação para o professor falando
      if (!this.anims.exists("falaProfessor")) {
        this.anims.create({
          key: "falaProfessor",
          frames: [{ key: "professorNpc", frame: 0 }],
          frameRate: 4,
          repeat: -1,
        });
      }

      // SUBSTITUA completamente o listener da tecla E com este código:
      this.input.keyboard.on("keydown-E", () => {
        console.log(
          "Tecla E pressionada. Pode iniciar diálogo:",
          podeIniciarDialogo
        );

        // Calcular distâncias para todos os NPCs
        let distanceToNpc1 = Phaser.Math.Distance.Between(
          player.x,
          player.y,
          npc1.x,
          npc1.y
        );
        let distanceToProfessor = Phaser.Math.Distance.Between(
          player.x,
          player.y,
          professorNpc.x,
          professorNpc.y
        );
        let distanceToProfessor2 = Phaser.Math.Distance.Between(
          player.x,
          player.y,
          professorNpc2.x,
          professorNpc2.y
        );
        let distanceToProfessor3 = Phaser.Math.Distance.Between(
          player.x,
          player.y,
          professorNpc3.x,
          professorNpc3.y
        );
        let distanceToProfessor4 = Phaser.Math.Distance.Between(
          player.x,
          player.y,
          professorNpc4.x,
          professorNpc4.y
        );

        // Verificar proximidade para todos os NPCs, independente se já conversou
        let proximoAoFaxineiro = distanceToNpc1 < 70;
        let proximoAoProfessor = distanceToProfessor < 70;
        let proximoAoProfessor2 = distanceToProfessor2 < 70;
        let proximoAoProfessor3 = distanceToProfessor3 < 70;
        let proximoAoProfessor4 = distanceToProfessor4 < 70;

        // A lógica de mostrar o avisoTexto foi movida para updateMain
        // Aqui apenas verificamos para iniciar diálogos

        // Verificações para iniciar diálogos - mantemos a lógica original
        let podeDialogarFaxineiro = proximoAoFaxineiro && !dialogoNpc1Concluido;
        let podeDialogarProfessor =
          proximoAoProfessor && !dialogoProfessorConcluido;
        let podeDialogarProfessor2 =
          proximoAoProfessor2 && !dialogoProfessor2Concluido;
        let podeDialogarProfessor3 =
          proximoAoProfessor3 && !dialogoProfessor3Concluido;
        let podeDialogarProfessor4 =
          proximoAoProfessor4 && !dialogoProfessor4Concluido;

        // Se não está próximo de nenhum NPC não concluído ou diálogo já foi iniciado, retorna
        if (
          !podeDialogarFaxineiro &&
          !podeDialogarProfessor &&
          !podeDialogarProfessor2 &&
          !podeDialogarProfessor3 &&
          !podeDialogarProfessor4 &&
          !dialogoIniciado &&
          !dialogoProfessorIniciado &&
          !dialogoProfessor2Iniciado &&
          !dialogoProfessor3Iniciado &&
          !dialogoProfessor4Iniciado
        ) {
          console.log(
            "Não pode iniciar diálogo - não está perto de nenhum NPC ativo"
          );
          return;
        }

        // Diálogo com o Faxineiro
        if (podeDialogarFaxineiro && !dialogoIniciado) {
          // Inicia diálogo com o faxineiro
          console.log("Iniciando diálogo com faxineiro");
          dialogoIniciado = true;
          caixaDialogo.setVisible(true);
          sombra.setVisible(true);
          avisoTexto.setVisible(false);
          processoDialogo(this, "faxineiro", dialogosPersonalizados);
        }
        // Diálogo com o Professor
        else if (podeDialogarProfessor && !dialogoProfessorIniciado) {
          // Inicia diálogo com o professor
          console.log("Iniciando diálogo com professor");
          dialogoProfessorIniciado = true;
          caixaDialogo.setVisible(true);
          sombra.setVisible(true);
          avisoTexto.setVisible(false);
          processoDialogo(this, "professor", dialogosProfessor);
        }
        // Diálogo com o Professor2
        else if (podeDialogarProfessor2 && !dialogoProfessor2Iniciado) {
          // Inicia diálogo com o professor2
          console.log("Iniciando diálogo com professor 2");
          dialogoProfessor2Iniciado = true;
          caixaDialogo.setVisible(true);
          sombra.setVisible(true);
          avisoTexto.setVisible(false);
          processoDialogo(this, "professor2", dialogosProfessor2);
        }
        // Diálogo com o Professor3
        else if (podeDialogarProfessor3 && !dialogoProfessor3Iniciado) {
          // Inicia diálogo com o professor3
          console.log("Iniciando diálogo com professor 3");
          dialogoProfessor3Iniciado = true;
          caixaDialogo.setVisible(true);
          sombra.setVisible(true);
          avisoTexto.setVisible(false);
          processoDialogo(this, "professor3", dialogosProfessor3);
        }
        // Diálogo com o Professor4
        else if (podeDialogarProfessor4 && !dialogoProfessor4Iniciado) {
          // Inicia diálogo com o professor4
          console.log("Iniciando diálogo com professor 4");
          dialogoProfessor4Iniciado = true;
          caixaDialogo.setVisible(true);
          sombra.setVisible(true);
          avisoTexto.setVisible(false);
          processoDialogo(this, "professor4", dialogosProfessor4);
        }
        // Continuar diálogo com o Faxineiro
        else if (dialogoIniciado) {
          // Avança diálogo do faxineiro
          avancaDialogo(this, "faxineiro", dialogosPersonalizados);
        }
        // Continuar diálogo com o Professor
        else if (dialogoProfessorIniciado) {
          // Avança diálogo do professor
          avancaDialogo(this, "professor", dialogosProfessor);
        }
        // Continuar diálogo com o Professor2
        else if (dialogoProfessor2Iniciado) {
          // Avança diálogo do professor2
          avancaDialogo(this, "professor2", dialogosProfessor2);
        }
        // Continuar diálogo com o Professor3
        else if (dialogoProfessor3Iniciado) {
          // Avança diálogo do professor3
          avancaDialogo(this, "professor3", dialogosProfessor3);
        }
        // Continuar diálogo com o Professor4
        else if (dialogoProfessor4Iniciado) {
          // Avança diálogo do professor4
          avancaDialogo(this, "professor4", dialogosProfessor4);
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
        if (tipo === "professor2") {
          professor2Image.x = boxX + boxWidth - 0;
          professor2Image.y = boxY + 50;
        }

        // Na parte onde atualiza as posições dos sprites, adicione:
        if (tipo === "professor3") {
          professor3Image.x = boxX + boxWidth - 0;
          professor3Image.y = boxY + 50;
        }

        // Na parte onde atualiza as posições dos sprites, adicione:
        if (tipo === "professor4") {
          professor4Image.x = boxX + boxWidth - 0;
          professor4Image.y = boxY + 50;
        }

        // Largura disponível para texto considerando espaço para personagens nas laterais
        const textAreaWidth = boxWidth - 140; // 70px de espaço em cada lado para personagens

        // Redefinir estilo de texto para evitar sobreposição
        textoDialogo.setWordWrapWidth(textAreaWidth);

        // Posicionando o texto no centro exato da caixa, com margens seguras
        textoDialogo.x = boxX + boxWidth / 2;
        textoDialogo.y = boxY + boxHeight / 2;

        avancaDialogo(scene, tipo, dialogos);
      }

      // Função para avançar diálogos - extraída para reutilização
      function avancaDialogo(scene, tipo, dialogos) {
        // Verifica se ainda há diálogos a serem mostrados
        const dialogoIndex =
          tipo === "faxineiro"
            ? scene.registry.get("dialogoFaxineiroIndex") || 0
            : tipo === "professor"
            ? scene.registry.get("dialogoProfessorIndex") || 0
            : tipo === "professor2"
            ? scene.registry.get("dialogoProfessor2Index") || 0
            : tipo === "professor3"
            ? scene.registry.get("dialogoProfessor3Index") || 0
            : scene.registry.get("dialogoProfessor4Index") || 0;

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
          if (tipo === "faxineiro") {
            if (dialogoAtual.autor === "npc") {
              npc1Image.setVisible(true);
              personagem.setVisible(false);
              professorImage.setVisible(false);
              professor2Image.setVisible(false);
              professor3Image.setVisible(false);
              professor4Image.setVisible(false);
              npc1Image.play("falaFaxineiro");
            } else {
              npc1Image.setVisible(false);
              professorImage.setVisible(false);
              professor2Image.setVisible(false);
              professor3Image.setVisible(false);
              professor4Image.setVisible(false);
              personagem.setVisible(true);
              personagem.play("falaPersonagem");
            }
          } else if (tipo === "professor") {
            // professor
            if (dialogoAtual.autor === "npc") {
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
              personagem.play("falaPersonagem");
            }
          } else if (tipo === "professor2") {
            // professor2
            if (dialogoAtual.autor === "npc") {
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
              personagem.play("falaPersonagem");
            }
          } else if (tipo === "professor3") {
            // professor3
            if (dialogoAtual.autor === "npc") {
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
              personagem.play("falaPersonagem");
            }
          } else {
            // professor4
            if (dialogoAtual.autor === "npc") {
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
              personagem.play("falaPersonagem");
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
              scene.typingTimer = scene.time.delayedCall(
                30,
                adicionarCaractere,
                [],
                scene
              );
            } else {
              scene.falaTimer = scene.time.delayedCall(
                1500,
                () => {
                  if (dialogoAtual.autor === "player") {
                    personagem.stop();
                    personagem.setFrame(1);
                  } else {
                    if (tipo === "faxineiro") {
                      npc1Image.stop();
                      npc1Image.setFrame(0);
                    } else if (tipo === "professor") {
                      professorImage.stop();
                      professorImage.setFrame(0);
                    } else if (tipo === "professor2") {
                      professor2Image.stop();
                      professor2Image.setFrame(0);
                    } else if (tipo === "professor3") {
                      professor3Image.stop();
                      professor3Image.setFrame(0);
                    } else {
                      professor4Image.stop();
                      professor4Image.setFrame(0);
                    }
                  }
                },
                [],
                scene
              );
            }
          };

          adicionarCaractere();

          // Salva o próximo índice no registro
          if (tipo === "faxineiro") {
            scene.registry.set("dialogoFaxineiroIndex", dialogoIndex + 1);
          } else if (tipo === "professor") {
            scene.registry.set("dialogoProfessorIndex", dialogoIndex + 1);
          } else if (tipo === "professor2") {
            scene.registry.set("dialogoProfessor2Index", dialogoIndex + 1);
          } else if (tipo === "professor3") {
            scene.registry.set("dialogoProfessor3Index", dialogoIndex + 1);
          } else {
            scene.registry.set("dialogoProfessor4Index", dialogoIndex + 1);
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

          if (tipo === "faxineiro") {
            dialogoIniciado = false;
            dialogoNpc1Concluido = true;
            scene.registry.set("dialogoNpc1Concluido", true);
            window.dialogoNpc1Concluido = true; // Exposição explícita para o HTML
            scene.registry.set("dialogoFaxineiroIndex", 0);

            // Atualizar missões ao concluir o diálogo com o faxineiro
            if (typeof window.updateMissions === "function") {
              window.updateMissions();
            }
          } else if (tipo === "professor") {
            dialogoProfessorIniciado = false;
            dialogoProfessorConcluido = true;
            scene.registry.set("dialogoProfessorIndex", 0);

            // Mostrar botão de ajuda após o diálogo com a professora
            const gameWidth = scene.cameras.main.width;
            const gameHeight = scene.cameras.main.height;
            const centerX = gameWidth / 2;
            const centerY = gameHeight / 2;

            // MODIFICADO: Atualiza o click handler para usar o ID correto
            helpButton.removeListener("pointerdown");
            helpButton.on("pointerdown", () => {
              console.log("Iniciando minigame do Professor 1");
              startMinigame(scene, "professor1");
            });

            helpButton.setVisible(true);

            console.log("Botão centralizado em:", centerX, centerY);
          } else if (tipo === "professor2") {
            dialogoProfessor2Iniciado = false;
            dialogoProfessor2Concluido = true;
            scene.registry.set("dialogoProfessor2Index", 0);

            // Mostrar botão de ajuda após o diálogo com o professor2
            const gameWidth = scene.cameras.main.width;
            const gameHeight = scene.cameras.main.height;
            const centerX = gameWidth / 2;
            const centerY = gameHeight / 2;

            // Atualizar posição do botão para o centro exato da tela

            // MODIFICADO: Atualiza o click handler para usar o ID correto
            helpButton.removeListener("pointerdown");
            helpButton.on("pointerdown", () => {
              console.log("Iniciando minigame do Professor 2");
              startMinigame(scene, "professor2");
            });

            helpButton.setVisible(true);

            console.log(
              "Botão para o professor 2 centralizado em:",
              centerX,
              centerY
            );
          } else if (tipo === "professor3") {
            dialogoProfessor3Iniciado = false;
            dialogoProfessor3Concluido = true;
            scene.registry.set("dialogoProfessor3Index", 0);
            // Mostrar botão de ajuda após o diálogo com o professor3
            const gameWidth = scene.cameras.main.width;
            const gameHeight = scene.cameras.main.height;
            const centerX = gameWidth / 2;
            const centerY = gameHeight / 2;

            // MODIFICADO: Atualiza o click handler para usar o ID correto
            helpButton.removeListener("pointerdown");
            helpButton.on("pointerdown", () => {
              console.log("Iniciando minigame do Professor 3");
              startMinigame(scene, "professor3");
            });

            helpButton.setVisible(true);

            console.log(
              "Botão para o professor 3 centralizado em:",
              centerX,
              centerY
            );
          } else if (tipo === "professor4") {
            dialogoProfessor4Iniciado = false;
            dialogoProfessor4Concluido = true;
            scene.registry.set("dialogoProfessor4Index", 0);

            // Mostrar botão de ajuda após o diálogo com o professor4
            const gameWidth = scene.cameras.main.width;
            const gameHeight = scene.cameras.main.height;
            const centerX = gameWidth / 2;
            const centerY = gameHeight / 2;

            // MODIFICADO: Atualiza o click handler para usar o ID correto
            helpButton.removeListener("pointerdown");
            helpButton.on("pointerdown", () => {
              console.log("Iniciando minigame do Professor 4");
              startMinigame(scene, "professor4");
            });

            helpButton.setVisible(true);

            console.log(
              "Botão para o professor 4 centralizado em:",
              centerX,
              centerY
            );
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
      this.doorCollider = this.physics.add.collider(
        player,
        door1,
        null,
        null,
        this
      );

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
      doorMessage = this.add.text(
        0,
        0,
        "Preciso falar com o faxineiro primeiro!",
        {
          fontFamily: "Arial",
          fontSize: "16px",
          color: "#FFFFFF",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          padding: { left: 10, right: 10, top: 5, bottom: 5 },
        }
      );
      doorMessage.setOrigin(0.5);
      doorMessage.setScrollFactor(0); // Fixa na câmera
      doorMessage.setVisible(false);

      // Adicione o listener para a tecla espaço após a criação dos outros event listeners
      this.input.keyboard.on("keydown-SPACE", () => {
        // Verificar se o jogador está próximo da porta
        let distanceToDoor = Phaser.Math.Distance.Between(
          player.x,
          player.y,
          door1.x,
          door1.y
        );

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
            door1.anims.play("doorOpening");

            // Quando a animação terminar, desativar a colisão
            door1.once("animationcomplete", () => {
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
        PLAYER: 14, // Player agora fica abaixo dos NPCs
        NPCS: 15, // NPCs acima do player
        DOOR: 16, // Primeira porta acima de tudo
        DOOR2: 13, // Segunda porta abaixo do player
        UI: 50,
        DIALOG: 100,
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
        let distanceToDoor = Phaser.Math.Distance.Between(
          player.x,
          player.y,
          door1.x,
          door1.y
        );

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
            door1.play("doorOpening");

            // Quando a animação terminar, desativar a colisão e garantir o frame correto
            door1.once("animationcomplete", () => {
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
          key: "doorOpening",
          frames: [
            { key: "door1", frame: 0 },
            { key: "door1", frame: 1 },
            { key: "door1", frame: 2 },
            { key: "door1", frame: 3 },
            { key: "door1", frame: 4 },
          ],
          frameRate: 5,
          repeat: 0,
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
        this.input.keyboard.removeAllListeners("keydown-SPACE");
        this.input.keyboard.on("keydown-SPACE", () => {
          let distanceToDoor = Phaser.Math.Distance.Between(
            player.x,
            player.y,
            door1.x,
            door1.y
          );
          if (distanceToDoor < 50) {
            canInteractWithDoor = true;
            if (isDoorOpen) return;
            if (dialogoNpc1Concluido) {
              isDoorOpen = true;

              // Tornar invisível a porta original criada no início
              // Isso encontra todas as instâncias de door1 no jogo e torna invisíveis
              this.children.list.forEach((child) => {
                if (
                  child.texture &&
                  child.texture.key === "door1" &&
                  child !== door1
                ) {
                  console.log("Porta adicional encontrada e escondida");
                  child.setVisible(false);
                }
              });

              door1.anims.stop();
              door1.setFrame(0);
              door1.play("doorOpening");

              // Quando a animação terminar, desativar a colisão e garantir o frame correto
              door1.once("animationcomplete", () => {
                door1.anims.stop();
                door1.setFrame(4); // Último frame fixo
                door1.body.enable = false;
                doorMessage.setVisible(false);
              });
            } else {
              doorMessage.setText("Preciso falar com o faxineiro primeiro!");
              doorMessage.setPosition(
                this.cameras.main.worldView.x + this.cameras.main.width / 2,
                this.cameras.main.worldView.y +
                  this.cameras.main.height / 2 -
                  100
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

      // Crie o botão de ajuda (inicialmente invisível) com visual profissional e cantos arredondados
      helpButton = this.add
        .text(
          this.cameras.main.width / 2,
          this.cameras.main.height / 2 + 50,
          "★ Ajudar Professora ★",
          {
            fontFamily: "Arial",
            fontSize: "18px",
            color: "#FFFFFF",
            backgroundColor: "#2C3E50",
            padding: { left: 30, right: 30, top: 20, bottom: 20 },
            align: "center",
            shadow: {
              offsetX: 3,
              offsetY: 3,
              color: "rgba(0,0,0,0.5)",
              blur: 5,
            },
          }
        )
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(9999)
        .setInteractive({ useHandCursor: true })
        .on("pointerover", () => {
          helpButton.setStyle({
            backgroundColor: "#34495E",
            color: "#FFD700",
          });
          helpButton.setScale(1.05);
        })
        .on("pointerout", () => {
          helpButton.setStyle({
            backgroundColor: "#2C3E50",
            color: "#FFFFFF",
          });
          helpButton.setScale(1);
        })
        .on("pointerdown", () => {
          helpButton.setStyle({
            backgroundColor: "#1A2530",
            color: "#FFFFFF",
          });
          helpButton.setScale(0.95);
          console.log("Botão de ajuda clicado - comportamento padrão");
          startMinigame(this, currentProfessor || "professor1");
        })
        .on("pointerup", () => {
          helpButton.setStyle({
            backgroundColor: "#34495E",
            color: "#FFD700",
          });
          helpButton.setScale(1.05);
        })
        .setVisible(false);

      // Adicionar um método de debug para testar se o botão está funcionando
      window.showHelpButton = function () {
        if (helpButton) {
          helpButton.setVisible(true);
          console.log("Help button should be visible now");
        }
      };

      // Certifique-se de que o botão tenha prioridade de exibição alta
      helpButton.setDepth(9999); // Maior que qualquer outra coisa na tela

      console.log("Botão de ajuda criado:", helpButton);

      // Após configurar a câmera, adicionar o keycard UI
      this.cameras.main.setZoom(1.5);

      // Criar o ícone do keycard
      keycardIcon = this.add
        .image(50, 50, "keycard")
        .setScrollFactor(0)
        .setDepth(9998)
        .setScale(0.15); // Ajuste a escala conforme necessário

      // Criar o texto do contador
      keycardText = this.add
        .text(80, 45, "0/4", {
          fontFamily: "Arial",
          fontSize: "20px",
          color: "#FFFFFF",
          stroke: "#000000",
          strokeThickness: 2,
          padding: { x: 5, y: 5 },
        })
        .setScrollFactor(0)
        .setDepth(9998);

      // Create UI elements BEFORE any other game elements
      const uiConfig = {
        x: 20,
        y: 20,
        depth: 9998, // Highest depth to ensure visibility
        scale: {
          icon: 0.12,
          text: 1,
        },
      };

      // Create a UI container that's fixed to the camera
      const uiContainer = this.add
        .container(0, 0)
        .setScrollFactor(0)
        .setDepth(9998);
      uiContainer.setPosition(this.cameras.main.width - 180, 10);

      // Create keycard icon with absolute positioning
      keycardIcon = this.add
        .image(uiConfig.x, uiConfig.y, "keycard")
        .setOrigin(0, 0)
        .setScale(uiConfig.scale.icon)
        .setScrollFactor(0)
        .setDepth(9998);

      // Create counter text with absolute positioning and improved visibility
      keycardText = this.add
        .text(uiConfig.x + 40, uiConfig.y + 5, "0/4", {
          fontFamily: "Arial Black",
          fontSize: "24px",
          color: "#ffffff",
          stroke: "#000000",
          strokeThickness: 4,
          padding: { x: 4, y: 4 },
          shadow: {
            offsetX: 2,
            offsetY: 2,
            color: "#000000",
            blur: 4,
            stroke: true,
            fill: true,
          },
        })
        .setOrigin(0, 0)
        .setScrollFactor(0)
        .setDepth(9998);

      // Add both elements to the container
      uiContainer.add([keycardIcon, keycardText]);

      // Force visibility
      keycardIcon.setVisible(true);
      keycardText.setVisible(true);
      uiContainer.setVisible(true);

      // Debug logging
      console.log("UI Elements Created:", {
        icon: {
          visible: keycardIcon.visible,
          x: keycardIcon.x,
          y: keycardIcon.y,
          depth: keycardIcon.depth,
        },
        text: {
          visible: keycardText.visible,
          x: keycardText.x,
          y: keycardText.y,
          depth: keycardText.depth,
          content: keycardText.text,
        },
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

      // Iniciar o tutorial de forma automática quando o jogo começar
      this.time.delayedCall(
        1000,
        () => {
          showTutorial(this);
        },
        [],
        this
      );

      // SUBSTITUIR COMPLETAMENTE o código da criação da porta
      if (!this.doorFixed) {
        console.log("===== IMPLEMENTANDO CORREÇÃO DEFINITIVA DA PORTA =====");

        // 1. Destruir todas as portas existentes para ter certeza que não há duplicatas
        this.children.getChildren().forEach((child) => {
          if (child.texture && child.texture.key === "door1") {
            console.log("Destruindo porta pré-existente");
            if (child.body) child.body.enable = false;
            child.destroy();
          }
        });

        // 2. Verificar e remover qualquer colisor existente relacionado à porta
        if (this.physics.world && this.physics.world.colliders) {
          this.physics.world.colliders.getActive().forEach((collider) => {
            // Checar por colisores que possam estar relacionados à porta
            if (collider.name && collider.name.includes("door")) {
              console.log("Removendo colisor pré-existente da porta");
              collider.destroy();
            }
          });
        }

        // 3. Criar animação da porta apenas uma vez
        if (!this.anims.exists("doorOpeningFixed")) {
          this.anims.create({
            key: "doorOpeningFixed",
            frames: [
              { key: "door1", frame: 0 },
              { key: "door1", frame: 1 },
              { key: "door1", frame: 2 },
              { key: "door1", frame: 3 },
              { key: "door1", frame: 4 },
            ],
            frameRate: 6,
            repeat: 0,
          });
        }

        // 4. Criar a porta com um nome exclusivo para facilitar referência
        door1 = this.physics.add.sprite(80, 345, "door1", 0);
        door1.name = "doorFixed";
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
        this.doorColliderFixed.name = "doorColliderFixed";

        // 6. Remover todos os listeners anteriores para evitar duplicação
        this.input.keyboard.removeAllListeners("keydown-SPACE");

        // 7. Adicionar um novo listener dedicado apenas para a porta
        this.input.keyboard.on("keydown-SPACE", () => {
          if (dialogoIniciado || dialogoProfessorIniciado || minigameActive)
            return;

          // Verificar proximidade com a porta
          const distanceToDoor = Phaser.Math.Distance.Between(
            player.x,
            player.y,
            door1.x,
            door1.y
          );

          if (distanceToDoor < 60) {
            console.log(
              "Jogador próximo à porta. Estado:",
              isDoorOpen ? "Aberta" : "Fechada"
            );

            if (isDoorOpen) {
              console.log("Porta já está aberta.");
              return;
            }

            if (dialogoNpc1Concluido) {
              console.log("Abrindo porta - condição atendida");
              isDoorOpen = true;

              // Tornar invisível a porta original criada no início
              // Isso encontra todas as instâncias de door1 no jogo e torna invisíveis
              this.children.list.forEach((child) => {
                if (
                  child.texture &&
                  child.texture.key === "door1" &&
                  child !== door1
                ) {
                  console.log("Porta adicional encontrada e escondida");
                  child.setVisible(false);
                }
              });

              door1.anims.stop();
              door1.setFrame(0);
              door1.play("doorOpeningFixed");

              // Quando a animação terminar, desativar a colisão e garantir o frame correto
              door1.once("animationcomplete", () => {
                console.log(
                  "Animação completa - removendo porta COMPLETAMENTE"
                );

                // Destruir o colisor explicitamente
                if (this.doorColliderFixed) {
                  this.doorColliderFixed.destroy();
                  this.doorColliderFixed = null;
                  console.log("Colisor da porta removido");
                }

                // Verificar qualquer colisor adicional
                this.physics.world.colliders.getActive().forEach((collider) => {
                  if (
                    collider.object1 === door1 ||
                    collider.object2 === door1
                  ) {
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
                const doorDecoration = this.add.image(
                  door1.x,
                  door1.y,
                  "door1",
                  4
                );
                doorDecoration.setScale(1.2);
                doorDecoration.setOrigin(0.5, 0.5);
                doorDecoration.setDepth(DEPTHS.DOOR - 1); // Atrás de tudo

                // Destruir a porta original completamente
                door1.destroy();
                console.log(
                  "Porta original destruída e substituída por decoração"
                );
              });
            } else {
              console.log("Tentando abrir porta - condição não atendida");
              doorMessage.setText("Preciso falar com o faxineiro primeiro!");
              doorMessage.setPosition(
                this.cameras.main.worldView.x + this.cameras.main.width / 2,
                this.cameras.main.worldView.y +
                  this.cameras.main.height / 2 -
                  100
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
    } catch (error) {
      console.error("Erro ao criar mapa:", error);
      // Mostrar mensagem ao usuário
      const errorText = this.add
        .text(
          this.cameras.main.centerX,
          this.cameras.main.centerY,
          "Erro ao inicializar o jogo. Por favor, recarregue a página.",
          {
            fontFamily: "Arial",
            fontSize: "20px",
            color: "#ff0000",
            backgroundColor: "#000000",
            padding: { x: 10, y: 5 },
          }
        )
        .setOrigin(0.5);
    }
  }

  // Função para iniciar o minigame (chamada quando o botão é clicado)
  function startMinigame(scene, professorId = "professor1") {
    currentProfessor = professorId; // Armazene qual professor está sendo ajudado
    helpButton.setVisible(false);
    minigameActive = true;

    // Verificar se já tentamos carregar anteriormente
    if (window.minigameLoadAttempted && !window.initMinigame) {
      console.error("Falha ao carregar o minigame após tentativa anterior");
      helpButton.setVisible(true);
      minigameActive = false;
      return;
    }

    // Iniciar o minigame importando o script de minigame.js
    try {
      // Verifica se o minigame já foi carregado
      if (typeof window.initMinigame === "function") {
        console.log("Função initMinigame encontrada, iniciando minigame");
        window.initMinigame(scene, professorId, (success) => {
          minigameActive = false; // Desativar estado quando minigame terminar
          if (success) {
            // Atualizar o contador HTML em vez do contador do Phaser
            keycardCount++;
            window.keycardCount = keycardCount; // Exposição explícita para o HTML
            const counterElement = document.getElementById("keycard-counter");
            if (counterElement) {
              counterElement.textContent = `${keycardCount}/4`;

              // Efeito visual para o ícone HTML
              const iconElement = document.getElementById("keycard-icon");
              if (iconElement) {
                iconElement.style.transition = "transform 0.2s ease-in-out";
                iconElement.style.transform = "scale(1.3)";
                setTimeout(() => {
                  iconElement.style.transform = "scale(1)";
                }, 200);
              }

              // Verificar se o jogador coletou todos os 4 keycards
              if (keycardCount >= 4 && !isDoor2Open) {
                openDoor2(scene);
              }

              // Atualizar o painel de missões
              if (typeof window.updateMissions === "function") {
                window.updateMissions();
              }
            }
          }
          helpButton.setVisible(!success);
        });
      } else {
        console.log(
          "Função initMinigame não encontrada. Carregando script dinamicamente..."
        );
        window.minigameLoadAttempted = true;

        // Array de possíveis caminhos para o minigame.js
        const possiblePaths = [
          "src/fase1/minigame.js",
          "src/fase1/minigame.js", // Caminho absoluto
        ];

        // Função para tentar o próximo caminho
        function tryNextPath(index) {
          if (index >= possiblePaths.length) {
            console.error(
              "Não foi possível carregar o minigame após tentar todos os caminhos possíveis"
            );
            helpButton.setVisible(true);
            minigameActive = false;

            // Criar uma implementação básica para minigame como último recurso
            window.initMinigame = function (scene, professorId, callback) {
              console.warn("Usando implementação de emergência do minigame!");

              // Criar um painel de mensagem para o usuário
              const message = scene.add
                .text(
                  scene.cameras.main.centerX,
                  scene.cameras.main.centerY,
                  "Minigame indisponível\nMas você ganhou um keycard mesmo assim!",
                  {
                    fontFamily: "Arial",
                    fontSize: "24px",
                    color: "#ffffff",
                    align: "center",
                    backgroundColor: "#000000",
                    padding: { x: 20, y: 20 },
                  }
                )
                .setOrigin(0.5)
                .setScrollFactor(0)
                .setDepth(9999);

              // Remover a mensagem após 3 segundos e conceder o keycard
              scene.time.delayedCall(3000, () => {
                message.destroy();
                callback(true); // Simular sucesso para conceder o keycard
              });
            };

            // Tentar usar a implementação de emergência
            window.initMinigame(scene, professorId, (success) => {
              minigameActive = false;
              helpButton.setVisible(!success);

              if (success) {
                keycardCount++;
                window.keycardCount = keycardCount;

                const counterElement =
                  document.getElementById("keycard-counter");
                if (counterElement) {
                  counterElement.textContent = `${keycardCount}/4`;

                  if (keycardCount >= 4 && !isDoor2Open) {
                    openDoor2(scene);
                  }

                  if (typeof window.updateMissions === "function") {
                    window.updateMissions();
                  }
                }
              }
            });

            return;
          }

          const path = possiblePaths[index];
          console.log(
            `Tentando carregar minigame.js de: ${path} (Tentativa ${
              index + 1
            }/${possiblePaths.length})`
          );

          const script = document.createElement("script");
          script.src = path;
          script.onload = () => {
            console.log(`Script do minigame carregado com sucesso de: ${path}`);

            // Verificar se a função foi definida corretamente após o carregamento
            if (typeof window.initMinigame === "function") {
              console.log("Função initMinigame disponível, iniciando minigame");
              window.initMinigame(scene, professorId, (success) => {
                minigameActive = false;
                helpButton.setVisible(!success);

                if (success) {
                  keycardCount++;
                  window.keycardCount = keycardCount;

                  const counterElement =
                    document.getElementById("keycard-counter");
                  if (counterElement) {
                    counterElement.textContent = `${keycardCount}/4`;

                    if (keycardCount >= 4 && !isDoor2Open) {
                      openDoor2(scene);
                    }

                    if (typeof window.updateMissions === "function") {
                      window.updateMissions();
                    }
                  }
                }
              });
            } else {
              console.warn(
                `Script carregado de ${path}, mas função initMinigame não foi definida. Tentando próximo caminho...`
              );
              tryNextPath(index + 1);
            }
          };

          script.onerror = (e) => {
            console.warn(`Erro ao carregar o script do caminho: ${path}`, e);
            tryNextPath(index + 1);
          };

          document.head.appendChild(script);
        }

        // Iniciar tentativa de caminhos
        tryNextPath(0);
      }
    } catch (error) {
      console.error("Erro ao iniciar o minigame:", error);
      helpButton.setVisible(true);
      minigameActive = false;
    }
  }

  // Função para atualizar a cena principal do jogo
  function updateMain() {
    // Verificação de variáveis no início da função
    if (typeof tutorialActive === "undefined") {
      console.warn("tutorialActive was undefined! Setting default to false");
      tutorialActive = false;
    }

    if (typeof dialogoNpc1Concluido === "undefined") {
      console.warn(
        "dialogoNpc1Concluido was undefined! Setting default to false"
      );
      dialogoNpc1Concluido = false;
    }

    // Garantir que outras variáveis críticas estejam definidas
    if (typeof dialogoIniciado === "undefined") dialogoIniciado = false;
    if (typeof dialogoProfessorIniciado === "undefined")
      dialogoProfessorIniciado = false;
    if (typeof dialogoProfessor2Iniciado === "undefined")
      dialogoProfessor2Iniciado = false;
    if (typeof dialogoProfessor3Iniciado === "undefined")
      dialogoProfessor3Iniciado = false;
    if (typeof dialogoProfessor4Iniciado === "undefined")
      dialogoProfessor4Iniciado = false;
    if (typeof minigameActive === "undefined") minigameActive = false;
    if (typeof collectedKey === "undefined") collectedKey = null;
    if (typeof lastDirection === "undefined") lastDirection = "front";
    if (typeof currentAnimation === "undefined") currentAnimation = null;
    if (typeof isDoorOpen === "undefined") isDoorOpen = false;
    if (typeof canInteractWithDoor === "undefined") canInteractWithDoor = false;

    // Add checks for professor dialog completion variables
    if (typeof dialogoProfessorConcluido === "undefined")
      dialogoProfessorConcluido = false;
    if (typeof dialogoProfessor2Concluido === "undefined")
      dialogoProfessor2Concluido = false;
    if (typeof dialogoProfessor3Concluido === "undefined")
      dialogoProfessor3Concluido = false;
    if (typeof dialogoProfessor4Concluido === "undefined")
      dialogoProfessor4Concluido = false;

    // If the tutorial is active, don't proceed with the rest of the update logic
    if (tutorialActive) {
      player.setVelocity(0);
      return;
    }

    // Redefinir a variável podeIniciarDialogo para false no início de cada frame
    podeIniciarDialogo = false;

    // Verificar a sobreposição com o NPC1 em cada frame
    let distanceToNpc1 = Phaser.Math.Distance.Between(
      player.x,
      player.y,
      npc1.x,
      npc1.y
    );
    let distanceToProfessor = Phaser.Math.Distance.Between(
      player.x,
      player.y,
      professorNpc.x,
      professorNpc.y
    );
    let distanceToProfessor2 = Phaser.Math.Distance.Between(
      player.x,
      player.y,
      professorNpc2.x,
      professorNpc2.y
    );
    let distanceToProfessor3 = Phaser.Math.Distance.Between(
      player.x,
      player.y,
      professorNpc3.x,
      professorNpc3.y
    );
    let distanceToProfessor4 = Phaser.Math.Distance.Between(
      player.x,
      player.y,
      professorNpc4.x,
      professorNpc4.y
    );

    // Check if any dialogue is currently active
    const anyDialogueActive =
      dialogoIniciado ||
      dialogoProfessorIniciado ||
      dialogoProfessor2Iniciado ||
      dialogoProfessor3Iniciado ||
      dialogoProfessor4Iniciado;

    // Track if player is near any NPC to prevent overlapping prompts
    let isNearNPC = false;

    // Show prompt for NPCs only if no dialogue is currently active
    if (!anyDialogueActive) {
      // Verify proximity to janitor
      if (distanceToNpc1 < 40) {
        podeIniciarDialogo = !dialogoNpc1Concluido; // Can only initiate if not completed
        avisoTexto.setText(dialogoNpc1Concluido ? "Você já conversou" : ">E<");
        avisoTexto.setPosition(npc1.x + 20, npc1.y - 20);
        avisoTexto.setVisible(true);
        isNearNPC = true;
      }
      // Verify proximity to professor 1
      else if (distanceToProfessor < 40) {
        podeIniciarDialogo = !dialogoProfessorConcluido;
        avisoTexto.setText(
          dialogoProfessorConcluido ? "Você já conversou" : ">E<"
        );
        avisoTexto.setPosition(professorNpc.x + 20, professorNpc.y - 30);
        avisoTexto.setVisible(true);
        isNearNPC = true;
      }
      // Verify proximity to professor 2
      else if (distanceToProfessor2 < 40) {
        podeIniciarDialogo = !dialogoProfessor2Concluido;
        avisoTexto.setText(
          dialogoProfessor2Concluido ? "Você já conversou" : ">E<"
        );
        avisoTexto.setPosition(professorNpc2.x + 20, professorNpc2.y - 20);
        avisoTexto.setVisible(true);
        isNearNPC = true;
      }
      // Verify proximity to professor 3
      else if (distanceToProfessor3 < 40) {
        podeIniciarDialogo = !dialogoProfessor3Concluido;
        avisoTexto.setText(
          dialogoProfessor3Concluido ? "Você já conversou" : ">E<"
        );
        avisoTexto.setPosition(professorNpc3.x + 20, professorNpc3.y - 20);
        avisoTexto.setVisible(true);
        isNearNPC = true;
      }
      // Verify proximity to professor 4
      else if (distanceToProfessor4 < 70) {
        podeIniciarDialogo = !dialogoProfessor4Concluido;
        avisoTexto.setText(
          dialogoProfessor4Concluido ? "Você já conversou" : ">E<"
        );
        avisoTexto.setPosition(professorNpc4.x + 20, professorNpc4.y - 20);
        avisoTexto.setVisible(true);
        isNearNPC = true;
      } else {
        podeIniciarDialogo = false;
        avisoTexto.setVisible(false);
      }

      // Check proximity to the door ONLY if not near any NPC
      let distanceToDoor = Phaser.Math.Distance.Between(
        player.x,
        player.y,
        door1.x,
        door1.y
      );

      if (distanceToDoor < 50 && !isDoorOpen && !isNearNPC) {
        avisoTexto.setText(">Espaço<");
        avisoTexto.setPosition(door1.x, door1.y - 0);
        avisoTexto.setVisible(true);
      }
    } else {
      // Hide prompt if any dialogue is active
      avisoTexto.setVisible(false);
    }

    // If the key was collected, make it follow the player
    if (collectedKey) {
      collectedKey.x = Phaser.Math.Linear(collectedKey.x, player.x, 0.1);
      collectedKey.y = Phaser.Math.Linear(collectedKey.y, player.y - 20, 0.1);
    }

    // Block movement during dialogue OR minigame
    if (anyDialogueActive || minigameActive || helpButton.visible) {
      player.setFrame(0);
      player.setVelocity(0);
      return;
    }

    // Check if door2 should be opened (keycard count = 4)
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
    } else if (upPressed) {
      // Só move vertical se não estiver movendo horizontal
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
    if (typeof window.updateMissions === "function") {
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
        image: "tutorial_objects",
      },
      {
        title: "Sua Missão",
        text: "Nesta fase os professores estão sendo controlados por um hacker\nque está tentando roubar dados dos alunos!\nAjude os professores-robôs a recuperar a consciência.\nA cada minigame concluído, você ganha um keycard.",
      },
      {
        title: "Keycard e chave",
        text: "Nessa fase seu objetivo é coletar os 4 keycard pra desbloquear\n a última sala que tem uma chave. Com essa chave,\n você pode entrar no elevador e ir pra próxima fase.",
      },
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
        fontFamily: "Arial",
        fontSize: "28px",
        color: "#ffffff",
        fontStyle: "bold",
        align: "center",
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
        fontFamily: "Arial",
        fontSize: "18px",
        color: "#ffffff",
        align: "center",
        lineSpacing: 10,
      }
    );
    contentText.setOrigin(0.5, 0.5);
    contentText.setScrollFactor(0);
    contentText.setDepth(9002);
    tutorialElements.push(contentText);

    // Opcionalmente, pode adicionar imagem ilustrativa
    if (scene.textures.exists(tutorialContent[0].image)) {
      const image = scene.add.image(
        cameraWidth / 2,
        cameraHeight / 2 - 40,
        tutorialContent[0].image
      );
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
        fontFamily: "Arial",
        fontSize: "16px",
        color: "#ffffff",
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
        fontFamily: "Arial",
        fontSize: "18px",
        color: "#ffffff",
        backgroundColor: "#4a6eb5",
        padding: { left: 15, right: 15, top: 8, bottom: 8 },
      }
    );
    prevButton.setOrigin(0.5);
    prevButton.setScrollFactor(0);
    prevButton.setDepth(9003);
    prevButton.setInteractive({ useHandCursor: true });
    prevButton.on("pointerover", () => {
      prevButton.setStyle({ backgroundColor: "#5a7ec5" });
    });
    prevButton.on("pointerout", () => {
      prevButton.setStyle({ backgroundColor: "#4a6eb5" });
    });
    prevButton.on("pointerdown", () => {
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
        fontFamily: "Arial",
        fontSize: "18px",
        color: "#ffffff",
        backgroundColor: "#4a6eb5",
        padding: { left: 15, right: 15, top: 8, bottom: 8 },
      }
    );
    nextButton.setOrigin(0.5);
    nextButton.setScrollFactor(0);
    nextButton.setDepth(9003);
    nextButton.setInteractive({ useHandCursor: true });
    nextButton.on("pointerover", () => {
      nextButton.setStyle({ backgroundColor: "#5a7ec5" });
    });
    nextButton.on("pointerout", () => {
      nextButton.setStyle({ backgroundColor: "#4a6eb5" });
    });
    nextButton.on("pointerdown", () => {
      navigateTutorial(scene, tutorialContent, 1);
    });
    tutorialElements.push(nextButton);

    // Botão Pular/Fechar
    const closeButton = scene.add.text(
      panelX + panelWidth - 20,
      panelY + 20,
      "X",
      {
        fontFamily: "Arial",
        fontSize: "24px",
        color: "#ffffff",
        padding: { left: 10, right: 10, top: 5, bottom: 5 },
      }
    );
    closeButton.setOrigin(0.5);
    closeButton.setScrollFactor(0);
    closeButton.setDepth(9003);
    closeButton.setInteractive({ useHandCursor: true });
    closeButton.on("pointerover", () => {
      closeButton.setStyle({ color: "#ff4444" });
    });
    closeButton.on("pointerout", () => {
      closeButton.setStyle({ color: "#ffffff" });
    });
    closeButton.on("pointerdown", () => {
      closeTutorial(scene);
    });
    tutorialElements.push(closeButton);

    // Adicionar teclas de navegação para passar os slides
    const leftKey = scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.LEFT
    );
    leftKey.on("down", () => {
      if (tutorialActive) navigateTutorial(scene, tutorialContent, -1);
    });

    const rightKey = scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.RIGHT
    );
    rightKey.on("down", () => {
      if (tutorialActive) navigateTutorial(scene, tutorialContent, 1);
    });

    const escKey = scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.ESC
    );
    escKey.on("down", () => {
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
      nextButton.removeAllListeners("pointerdown");
      nextButton.on("pointerdown", () => {
        closeTutorial(scene);
      });
    } else {
      nextButton.setText("Próximo >");
      nextButton.removeAllListeners("pointerdown");
      nextButton.on("pointerdown", () => {
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
    tutorialElements.forEach((element) => {
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
    try {
      if (
        this &&
        this.children &&
        typeof this.children.getChildren === "function"
      ) {
        this.children.getChildren().forEach((child) => {
          if (child.texture && child.texture.key === "door1") {
            console.log("Destruindo porta pré-existente");
            if (child.body) child.body.enable = false;
            child.destroy();
          }
        });
      } else {
        console.warn(
          "this.children.getChildren não está disponível neste contexto"
        );
      }
    } catch (e) {
      console.error("Erro ao processar children:", e);
    }

    // Continue with the rest of the door initialization if the scene context exists
    if (this && this.physics) {
      // 2. Verificar e remover qualquer colisor existente relacionado à porta
      if (this.physics.world && this.physics.world.colliders) {
        this.physics.world.colliders.getActive().forEach((collider) => {
          // Checar por colisores que possam estar relacionados à porta
          if (collider.name && collider.name.includes("door")) {
            console.log("Removendo colisor pré-existente da porta");
            collider.destroy();
          }
        });
      }

      // 3. Criar animação da porta apenas uma vez
      if (!this.anims.exists("doorOpeningFixed")) {
        this.anims.create({
          key: "doorOpeningFixed",
          frames: [
            { key: "door1", frame: 0 },
            { key: "door1", frame: 1 },
            { key: "door1", frame: 2 },
            { key: "door1", frame: 3 },
            { key: "door1", frame: 4 },
          ],
          frameRate: 6,
          repeat: 0,
        });
      }

      // 4. Criar a porta com um nome exclusivo para facilitar referência
      door1 = this.physics.add.sprite(80, 345, "door1", 0);
      door1.name = "doorFixed";
      door1.setScale(1.2);
      door1.setOrigin(0.5, 0.5);
      door1.setImmovable(true);
      door1.body.setSize(20, 10);
      door1.body.setOffset(6, 50);
      door1.setDepth(DEPTHS.DOOR);

      // 5. Criar o colisor com um nome específico e armazenar a referência
      this.doorColliderFixed = this.physics.add.collider(player, door1);
      this.doorColliderFixed.name = "doorColliderFixed";

      // Adicionar o handler de evento separadamente
      door1.once("animationcomplete", () => {
        console.log("Animação completa - removendo porta COMPLETAMENTE");

        // Destruir o colisor explicitamente
        if (this.doorColliderFixed) {
          this.doorColliderFixed.destroy();
          this.doorColliderFixed = null;
          console.log("Colisor da porta removido");
        }

        // Verificar qualquer colisor adicional
        this.physics.world.colliders.getActive().forEach((collider) => {
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
        const doorDecoration = this.add.image(door1.x, door1.y, "door1", 4);
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
}

// Marcar que esta correção já foi aplicada
this.doorFixed = true;
console.log("===== CORREÇÃO DA PORTA IMPLEMENTADA =====");

// Modificar a função avancaDialogo para expor variáveis globais
function avancaDialogo(scene, tipo, dialogos) {
  // Verifica se ainda há diálogos a serem mostrados
  const dialogoIndex =
    tipo === "faxineiro"
      ? scene.registry.get("dialogoFaxineiroIndex") || 0
      : tipo === "professor"
      ? scene.registry.get("dialogoProfessorIndex") || 0
      : tipo === "professor2"
      ? scene.registry.get("dialogoProfessor2Index") || 0
      : tipo === "professor3"
      ? scene.registry.get("dialogoProfessor3Index") || 0
      : scene.registry.get("dialogoProfessor4Index") || 0;

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
    if (tipo === "faxineiro") {
      if (dialogoAtual.autor === "npc") {
        npc1Image.setVisible(true);
        personagem.setVisible(false);
        professorImage.setVisible(false);
        professor2Image.setVisible(false);
        professor3Image.setVisible(false);
        professor4Image.setVisible(false);
        npc1Image.play("falaFaxineiro");
      } else {
        npc1Image.setVisible(false);
        professorImage.setVisible(false);
        professor2Image.setVisible(false);
        professor3Image.setVisible(false);
        professor4Image.setVisible(false);
        personagem.setVisible(true);
        personagem.play("falaPersonagem");
      }
    } else if (tipo === "professor") {
      // professor
      if (dialogoAtual.autor === "npc") {
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
        personagem.play("falaPersonagem");
      }
    } else if (tipo === "professor2") {
      // professor2
      if (dialogoAtual.autor === "npc") {
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
        personagem.play("falaPersonagem");
      }
    } else if (tipo === "professor3") {
      // professor3
      if (dialogoAtual.autor === "npc") {
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
        personagem.play("falaPersonagem");
      }
    } else {
      // professor4
      if (dialogoAtual.autor === "npc") {
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
        personagem.play("falaPersonagem");
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
        scene.typingTimer = scene.time.delayedCall(
          30,
          adicionarCaractere,
          [],
          scene
        );
      } else {
        scene.falaTimer = scene.time.delayedCall(
          1500,
          () => {
            if (dialogoAtual.autor === "player") {
              personagem.stop();
              personagem.setFrame(1);
            } else {
              if (tipo === "faxineiro") {
                npc1Image.stop();
                npc1Image.setFrame(0);
              } else if (tipo === "professor") {
                professorImage.stop();
                professorImage.setFrame(0);
              } else if (tipo === "professor2") {
                professor2Image.stop();
                professor2Image.setFrame(0);
              } else if (tipo === "professor3") {
                professor3Image.stop();
                professor3Image.setFrame(0);
              } else {
                professor4Image.stop();
                professor4Image.setFrame(0);
              }
            }
          },
          [],
          scene
        );
      }
    };

    adicionarCaractere();

    // Salva o próximo índice no registro
    if (tipo === "faxineiro") {
      scene.registry.set("dialogoFaxineiroIndex", dialogoIndex + 1);
    } else if (tipo === "professor") {
      scene.registry.set("dialogoProfessorIndex", dialogoIndex + 1);
    } else if (tipo === "professor2") {
      scene.registry.set("dialogoProfessor2Index", dialogoIndex + 1);
    } else if (tipo === "professor3") {
      scene.registry.set("dialogoProfessor3Index", dialogoIndex + 1);
    } else {
      scene.registry.set("dialogoProfessor4Index", dialogoIndex + 1);
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

    if (tipo === "faxineiro") {
      dialogoIniciado = false;
      dialogoNpc1Concluido = true;
      scene.registry.set("dialogoNpc1Concluido", true);
      window.dialogoNpc1Concluido = true; // Exposição explícita para o HTML
      scene.registry.set("dialogoFaxineiroIndex", 0);

      // Atualizar missões ao concluir o diálogo com o faxineiro
      if (typeof window.updateMissions === "function") {
        window.updateMissions();
      }
    } else if (tipo === "professor") {
      dialogoProfessorIniciado = false;
      dialogoProfessorConcluido = true;
      scene.registry.set("dialogoProfessorIndex", 0);

      // Mostrar botão de ajuda após o diálogo com a professora
      const gameWidth = scene.cameras.main.width;
      const gameHeight = scene.cameras.main.height;
      const centerX = gameWidth / 2;
      const centerY = gameHeight / 2;

      console.log("Botão centralizado em:", centerX, centerY);
    } else if (tipo === "professor2") {
      dialogoProfessor2Iniciado = false;
      dialogoProfessor2Concluido = true;
      scene.registry.set("dialogoProfessor2Index", 0);

      // Mostrar botão de ajuda após o diálogo com o professor2
      const gameWidth = scene.cameras.main.width;
      const gameHeight = scene.cameras.main.height;
      const centerX = gameWidth / 2;
      const centerY = gameHeight / 2;

      // MODIFICADO: Atualiza o click handler para usar o ID correto
      helpButton.removeListener("pointerdown");
      helpButton.on("pointerdown", () => {
        console.log("Iniciando minigame do Professor 2");
        startMinigame(scene, "professor2");
      });

      helpButton.setVisible(true);

      console.log(
        "Botão para o professor 2 centralizado em:",
        centerX,
        centerY
      );
    } else if (tipo === "professor3") {
      dialogoProfessor3Iniciado = false;
      dialogoProfessor3Concluido = true;
      scene.registry.set("dialogoProfessor3Index", 0);
      // Mostrar botão de ajuda após o diálogo com o professor3
      const gameWidth = scene.cameras.main.width;
      const gameHeight = scene.cameras.main.height;
      const centerX = gameWidth / 2;
      const centerY = gameHeight / 2;

      currentProfessor = "professor3"; // Define o professor atual

      // MODIFICADO: Atualiza o click handler para usar o ID correto
      helpButton.removeListener("pointerdown");
      helpButton.on("pointerdown", () => {
        console.log("Iniciando minigame do Professor 3");
        startMinigame(scene, "professor3");
      });

      helpButton.setVisible(true);

      console.log(
        "Botão para o professor 3 centralizado em:",
        centerX,
        centerY
      );
    } else if (tipo === "professor4") {
      dialogoProfessor4Iniciado = false;
      dialogoProfessor4Concluido = true;
      scene.registry.set("dialogoProfessor4Index", 0);

      // Mostrar botão de ajuda após o diálogo com o professor4
      const gameWidth = scene.cameras.main.width;
      const gameHeight = scene.cameras.main.height;
      const centerX = gameWidth / 2;
      const centerY = gameHeight / 2;

      // MODIFICADO: Atualiza o click handler para usar o ID correto
      helpButton.removeListener("pointerdown");
      helpButton.on("pointerdown", () => {
        console.log("Iniciando minigame do Professor 4");
        startMinigame(scene, "professor4");
      });

      helpButton.setVisible(true);

      console.log(
        "Botão para o professor 4 centralizado em:",
        centerX,
        centerY
      );
    }

    console.log(`Diálogo com ${tipo} concluído`);

    if (scene.falaTimer) scene.falaTimer.remove();
    if (scene.typingTimer) scene.typingTimer.remove();
  }
}

// Adicionar ao final de createMain para garantir que as variáveis globais sejam expostas
window.dialogoNpc1Concluido = dialogoNpc1Concluido;
window.keycardCount = keycardCount;
window.isDoor2Open = isDoor2Open;
window.keyCollected = keyCollected;

// Define the collectKey function before it's used
function collectKey(player, key) {
  keyCollected = true;
  window.keyCollected = true; // Exposição explícita para o HTML
  collectedKey = key;
  window.collectedKey = {}; // Apenas para sinalizar que existe
  key.setDepth(1);
  key.body.setEnable(false);

  // Atualizar o contador HTML da chave
  const keyCounter = document.getElementById("key-counter");
  if (keyCounter) {
    keyCounter.textContent = "1/1";

    // Adicionar efeito visual
    const keyIcon = document.getElementById("key-icon");
    if (keyIcon) {
      keyIcon.style.transition = "transform 0.2s ease-in-out";
      keyIcon.style.transform = "scale(1.3)";
      setTimeout(() => {
        keyIcon.style.transform = "scale(1)";
      }, 200);
    }
  }

  // Atualizar as missões quando a chave for coletada
  if (typeof window.updateMissions === "function") {
    window.updateMissions();
  }
}

// Adicione esta nova função para abrir a door2
function openDoor2(scene) {
  // Verificar se a porta já foi aberta
  if (isDoor2Open) return;

  // Marcar a porta como aberta
  isDoor2Open = true;
  window.isDoor2Open = true;

  // Tentar encontrar a porta2 no mapa
  if (door2) {
    // Animar a abertura da porta
    if (scene.anims.exists("doorOpening")) {
      door2.anims.play("doorOpening");

      // Quando a animação terminar, desativar a colisão
      door2.once("animationcomplete", () => {
        if (door2.body) {
          door2.body.enable = false;
        }

        // Mostrar uma mensagem informando que a sala da chave foi aberta
        showDoor2OpenMessage(scene);
      });
    } else {
      console.warn("Animação 'doorOpening' não encontrada");
      showDoor2OpenMessage(scene);
    }
  } else {
    console.warn("door2 não encontrada para animação");
    // Mesmo sem animação, mostrar a mensagem
    showDoor2OpenMessage(scene);
  }

  // Atualizar as missões quando a porta for aberta
  if (typeof window.updateMissions === "function") {
    window.updateMissions();
  }
}

// Função para mostrar mensagem quando a porta for aberta
function showDoor2OpenMessage(scene) {
  // Se já existe uma mensagem, não criar outra
  if (door2OpenMessage) return;

  // Calculando posições baseadas no tamanho da câmera
  const cameraWidth = scene.cameras.main.width;
  const cameraHeight = scene.cameras.main.height;

  // Criar mensagem informando que a sala foi aberta
  door2OpenMessage = scene.add.text(
    cameraWidth / 2,
    cameraHeight / 2 - 100,
    "A sala da chave foi desbloqueada!",
    {
      fontFamily: "Arial",
      fontSize: "20px",
      color: "#FFFFFF",
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      padding: { left: 20, right: 20, top: 15, bottom: 15 },
      align: "center",
    }
  );
  door2OpenMessage.setOrigin(0.5);
  door2OpenMessage.setScrollFactor(0);
  door2OpenMessage.setDepth(100);

  // Fazer a mensagem aparecer com efeito de fade in
  door2OpenMessage.setAlpha(0);
  scene.tweens.add({
    targets: door2OpenMessage,
    alpha: 1,
    duration: 300,
    ease: "Power2",
  });

  // Remover a mensagem após 3 segundos
  scene.time.delayedCall(3000, () => {
    if (door2OpenMessage) {
      scene.tweens.add({
        targets: door2OpenMessage,
        alpha: 0,
        duration: 300,
        ease: "Power2",
        onComplete: () => {
          door2OpenMessage.destroy();
          door2OpenMessage = null;
        },
      });
    }
  });
}

// Let's add this CSS to ensure missions panel displays correctly
function addMissionStyles() {
  const style = document.createElement("style");
  style.textContent = `
      #missions-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        z-index: 10000;
      }
      
      #missions-panel {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 400px;
        background: #222266;
        border: 4px solid #4a6eb5;
        border-radius: 10px;
        padding: 20px;
        z-index: 10001;
        color: white;
        font-family: 'Arial', sans-serif;
      }
      
      #missions-button {
        cursor: pointer;
      }
      
      #missions-panel h2 {
        text-align: center;
        margin-top: 0;
      }
      
      #close-missions {
        position: absolute;
        top: 10px;
        right: 10px;
        background: #ff4500;
        border: none;
        color: white;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        cursor: pointer;
        font-weight: bold;
      }
      
      .mission-item {
        display: flex;
        align-items: center;
        margin: 10px 0;
        padding: 10px;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 5px;
      }
      
      .mission-check {
        width: 20px;
        height: 20px;
        border: 2px solid #ffffff;
        border-radius: 50%;
        margin-right: 15px;
      }
      
      .mission-complete .mission-check {
        background: #66ff66;
        position: relative;
      }
      
      .mission-complete .mission-check:after {
        content: "✓";
        position: absolute;
        font-weight: bold;
        top: -2px;
        left: 4px;
        color: #000;
      }
      
      .mission-text {
        flex: 1;
      }
      
      .mission-complete .mission-text {
        text-decoration: line-through;
        opacity: 0.7;
      }
    `;

  document.head.appendChild(style);
}

// Completely replace the setupMissionsSystem function with this enhanced version
function setupMissionsSystem() {
  const missionsButton = document.getElementById("missions-button");
  const missionsPanel = document.getElementById("missions-panel");
  const missionsOverlay = document.getElementById("missions-overlay");
  const closeButton = document.getElementById("close-missions");

  // Add debug output to check elements
  console.log("Setting up missions system. Elements found:", {
    missionsButton: !!missionsButton,
    missionsPanel: !!missionsPanel,
    missionsOverlay: !!missionsOverlay,
    closeButton: !!closeButton,
  });

  if (!missionsButton || !missionsPanel || !missionsOverlay || !closeButton) {
    console.error("Mission system elements not found in DOM");
    return;
  }

  // Make sure missions panel and overlay are initialized correctly
  missionsPanel.style.display = "none";
  missionsOverlay.style.display = "none";

  // Clear any existing handlers
  missionsButton.onclick = null;
  closeButton.onclick = null;

  // Set up new handlers
  function showMissionsPanel() {
    console.log("Showing missions panel");
    missionsOverlay.style.display = "block";
    missionsPanel.style.display = "block";

    // Update missions when panel opens
    if (typeof window.updateMissions === "function") {
      window.updateMissions();
    }
  }

  function hideMissionsPanel() {
    console.log("Hiding missions panel");
    missionsOverlay.style.display = "none";
    missionsPanel.style.display = "none";
  }

  // Add multiple ways to handle clicks for maximum compatibility
  // 1. Using direct onclick property
  missionsButton.onclick = showMissionsPanel;
  closeButton.onclick = hideMissionsPanel;
  missionsOverlay.onclick = hideMissionsPanel;

  // 2. Using addEventListener
  missionsButton.addEventListener("click", showMissionsPanel);
  closeButton.addEventListener("click", hideMissionsPanel);
  missionsOverlay.addEventListener("click", hideMissionsPanel);

  // 3. Add pointer events for touch devices
  missionsButton.addEventListener("pointerdown", showMissionsPanel);
  closeButton.addEventListener("pointerdown", hideMissionsPanel);
  missionsOverlay.addEventListener("pointerdown", hideMissionsPanel);

  // Make the button more visually interactive
  missionsButton.style.transition = "transform 0.2s, background-color 0.2s";

  missionsButton.addEventListener("mouseover", function () {
    this.style.backgroundColor = "#5566bb";
    this.style.transform = "scale(1.05)";
  });

  missionsButton.addEventListener("mouseout", function () {
    this.style.backgroundColor = "";
    this.style.transform = "scale(1)";
  });

  // Add a global access method for the missions panel
  window.showMissions = showMissionsPanel;
  window.hideMissions = hideMissionsPanel;

  console.log(
    "Mission system setup complete. Try clicking the 'MISSÕES' button"
  );
}

// Add this entirely new function to create a temporary button that's guaranteed to work
// This is a last-resort solution that ensures there's a working missions button
function createEmergencyMissionsButton() {
  // First, try to fix the existing button
  const existingButton = document.getElementById("missions-button");
  if (existingButton) {
    existingButton.style.position = "fixed";
    existingButton.style.top = "20px";
    existingButton.style.right = "20px";
    existingButton.style.zIndex = "99999";

    // Clear any existing event listeners
    const newButton = existingButton.cloneNode(true);
    existingButton.parentNode.replaceChild(newButton, existingButton);

    // Add a very basic click handler that's guaranteed to work
    newButton.onclick = function () {
      console.log("Mission button clicked directly");
      const panel = document.getElementById("missions-panel");
      const overlay = document.getElementById("missions-overlay");

      if (panel && overlay) {
        panel.style.display = "block";
        panel.style.position = "fixed";
        panel.style.zIndex = "100000";
        panel.style.top = "50%";
        panel.style.left = "50%";
        panel.style.transform = "translate(-50%, -50%)";
        panel.style.width = "400px";
        panel.style.maxHeight = "80vh";
        panel.style.overflowY = "auto";

        overlay.style.display = "block";
        overlay.style.position = "fixed";
        overlay.style.zIndex = "99999";
        overlay.style.top = "0";
        overlay.style.left = "0";
        overlay.style.width = "100%";
        overlay.style.height = "100%";

        // Update missions
        if (typeof window.updateMissions === "function") {
          window.updateMissions();
        }
      } else {
        console.error("Could not find missions panel or overlay");
      }
    };

    console.log("Emergency fix applied to existing missions button");
  } else {
    // Create a completely new button if the original one isn't found
    const emergencyButton = document.createElement("button");
    emergencyButton.textContent = "MISSÕES";
    emergencyButton.style.position = "fixed";
    emergencyButton.style.top = "20px";
    emergencyButton.style.right = "20px";
    emergencyButton.style.zIndex = "99999";
    emergencyButton.style.padding = "10px 15px";
    emergencyButton.style.backgroundColor = "#4a6eb5";
    emergencyButton.style.color = "white";
    emergencyButton.style.border = "none";
    emergencyButton.style.borderRadius = "5px";
    emergencyButton.style.fontWeight = "bold";
    emergencyButton.style.cursor = "pointer";

    emergencyButton.onclick = function () {
      console.log("Emergency mission button clicked");
      const panel = document.getElementById("missions-panel");
      const overlay = document.getElementById("missions-overlay");

      if (panel && overlay) {
        panel.style.display = "block";
        panel.style.position = "fixed";
        panel.style.zIndex = "100000";
        panel.style.top = "50%";
        panel.style.left = "50%";
        panel.style.transform = "translate(-50%, -50%)";
        panel.style.width = "400px";
        panel.style.maxHeight = "80vh";
        panel.style.overflowY = "auto";

        overlay.style.display = "block";
        overlay.style.position = "fixed";
        overlay.style.zIndex = "99999";
        overlay.style.top = "0";
        overlay.style.left = "0";
        overlay.style.width = "100%";
        overlay.style.height = "100%";

        // Update missions
        if (typeof window.updateMissions === "function") {
          window.updateMissions();
        }
      } else {
        console.error("Could not find missions panel or overlay");
        alert("Erro ao abrir o painel de missões. Tente recarregar a página.");
      }
    };

    document.body.appendChild(emergencyButton);
    console.log("Created emergency missions button");
  }

  // Add a global method to show missions
  window.showMissionsPanel = function () {
    console.log("Global showMissionsPanel called");
    const panel = document.getElementById("missions-panel");
    const overlay = document.getElementById("missions-overlay");

    if (panel && overlay) {
      panel.style.display = "block";
      panel.style.position = "fixed";
      panel.style.zIndex = "100000";
      panel.style.top = "50%";
      panel.style.left = "50%";
      panel.style.transform = "translate(-50%, -50%)";

      overlay.style.display = "block";
      overlay.style.position = "fixed";
      overlay.style.zIndex = "99999";
      overlay.style.top = "0";
      overlay.style.left = "0";
      overlay.style.width = "100%";
      overlay.style.height = "100%";

      // Add close button event handler
      const closeBtn = document.getElementById("close-missions");
      if (closeBtn) {
        closeBtn.onclick = function () {
          panel.style.display = "none";
          overlay.style.display = "none";
        };
      }

      // Update missions
      if (typeof window.updateMissions === "function") {
        window.updateMissions();
      }

      return true;
    } else {
      console.error("Could not find missions panel or overlay");
      return false;
    }
  };
}

// Add this function to fix missions panel and overlay visibility issues
function fixMissionsVisibility() {
  // Apply important CSS that prevents any other styles from interfering
  const style = document.createElement("style");
  style.innerHTML = `
      #missions-panel {
        display: none;
        position: fixed !important;
        z-index: 100000 !important;
        top: 50% !important;
        left: 50% !important;
        transform: translate(-50%, -50%) !important;
        width: 400px !important;
        background-color: #222266 !important;
        border: 4px solid #4a6eb5 !important;
        border-radius: 10px !important;
        padding: 20px !important;
        color: white !important;
      }
      
      #missions-overlay {
        display: none;
        position: fixed !important;
        z-index: 99999 !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 100% !important;
        background-color: rgba(0, 0, 0, 0.7) !important;
      }
      
      #missions-button {
        position: fixed !important;
        top: 20px !important;
        right: 20px !important;
        z-index: 99998 !important;
        padding: 10px 15px !important;
        background-color: #4a6eb5 !important;
        color: white !important;
        border: none !important;
        border-radius: 5px !important;
        font-weight: bold !important;
        cursor: pointer !important;
      }
      
      #close-missions {
        position: absolute !important;
        top: 10px !important;
        right: 10px !important;
        background-color: #ff4500 !important;
        color: white !important;
        width: 30px !important;
        height: 30px !important;
        border: none !important;
        border-radius: 50% !important;
        cursor: pointer !important;
        font-size: 16px !important;
        line-height: 30px !important;
        text-align: center !important;
        font-weight: bold !important;
      }
    `;
  document.head.appendChild(style);
}

// Update the DOMContentLoaded event to call our emergency functions
document.addEventListener("DOMContentLoaded", function () {
  // Fix CSS first
  fixMissionsVisibility();

  // Then apply the emergency button fix
  setTimeout(() => {
    createEmergencyMissionsButton();
  }, 1000);
});

// Add a console command that can be used for debugging
// (the user can type this in browser console)
console.log(
  "To open missions panel manually, type: window.showMissionsPanel()"
);

// No final deste arquivo, encontre onde está o código para iniciar o minigame
// e garanta que o ID correto do professor seja passado:

// Exemplo de como o ID do professor deve ser passado para o minigame
function startMinigameWithProfessor(scene, professor) {
  // Correto mapeamento de professores para IDs
  const professorMap = {
    reitor: "professor1",
    coordenador: "professor2",
    bibliotecario: "professor3",
    professor: "professor4",
  };

  const professorId = professorMap[professor] || "default";

  // Exibir no console para verificação
  console.log(`Iniciando minigame para: ${professor}, ID: ${professorId}`);

  // Iniciar minigame com ID correto
  window.initMinigame(scene, professorId, function (success) {
    // Callback após o minigame terminar
    console.log(`Minigame concluído, sucesso: ${success}`);
    if (success) {
      // Código para quando o jogador vencer
    } else {
      // Código para quando o jogador perder
    }
  });
}

// Exemplo de uso:
startMinigameWithProfessor(this, "reitor"); // Inicia quiz LGPD (Professor 1)
startMinigameWithProfessor(this, "coordenador"); // Inicia jogo de conexão (Professor 2)
startMinigameWithProfessor(this, "bibliotecario"); // Inicia jogo de memória (Professor 3)
// Corrigir a chamada para professor4:
startMinigameWithProfessor(this, "professor"); // Inicia jogo de sequência (Professor 4)

// Adicionar identificadores únicos para cada professor
let professor1, professor2, professor3, professor4;

class ProfessorNpc {
  constructor(id, name) {
    this.id = id;
    this.name = name;
  }

  startMinigame(scene) {
    switch (this.id) {
      case 1:
        window.initMinigame(scene, "professor1", this.minigameCallback);
        break;
      case 2:
        window.initMinigame(scene, "professor2", this.minigameCallback);
        break;
      case 3:
        window.initMinigame(scene, "professor3", this.minigameCallback);
        break;
      case 4:
        window.initMinigame(scene, "professor4", this.minigameCallback);
        break;
      default:
        console.error("Invalid professor ID");
    }
  }

  minigameCallback(success) {
    if (success) {
      console.log("Minigame concluído com sucesso!");
      // Lógica para quando o jogador vencer o minigame
    } else {
      console.log("Minigame falhou.");
      // Lógica para quando o jogador perder o minigame
    }
  }
}

// Inicializar os professores após a definição da classe
professor1 = new ProfessorNpc("Professor 1");
professor2 = new ProfessorNpc2("Professor 2");
professor3 = new ProfessorNpc3("Professor 3");
professor4 = new ProfessorNpc4("Professor 4");

// Adicionar lógica para iniciar o minigame com base no professor
function startMinigame(scene, professorId) {
  let professor;
  switch (professorId) {
    case "professor1":
      professor = professor1;
      break;
    case "professor2":
      professor = professor2;
      break;
    case "professor3":
      professor = professor3;
      break;
    case "professor4":
      professor = professor4;
      break;
    default:
      console.error("Invalid professor ID");
      return;
  }
  professor.startMinigame(scene);
}

// Garantir que o script minigame.js seja carregado corretamente
function loadMinigameScript(callback) {
  const script = document.createElement("script");
  script.src = "src/fase1/minigame.js"; // Corrigir o caminho do script
  script.onload = callback;
  script.onerror = function () {
    console.error(
      "Erro ao carregar o script do caminho: src/fase1/minigame.js"
    );
  };
  document.head.appendChild(script);
}

// Chamar a função para carregar o script minigame.js
loadMinigameScript(function () {
  console.log("Script minigame.js carregado com sucesso.");
});

// Função para embaralhar array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Adicionar um Event Listener global para a tecla ESC
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    console.log("ESC pressionado (listener global em fase1.js)");

    // Tentar usar o menu padrão primeiro
    if (window.gameMenu && typeof window.gameMenu.open === "function") {
      try {
        const menuOverlay = document.getElementById("game-menu-overlay");
        if (menuOverlay.style.display === "none") {
          window.gameMenu.open();
        } else {
          window.gameMenu.close();
        }
        return;
      } catch (e) {
        console.warn("Erro ao manipular menu padrão:", e);
      }
    }

    // Fallback: verificar se existe um overlay de menu de emergência
    const emergencyOverlay = document.getElementById(
      "game-menu-overlay-emergency"
    );
    if (emergencyOverlay) {
      if (emergencyOverlay.style.display === "none") {
        emergencyOverlay.style.display = "flex";
      } else {
        emergencyOverlay.style.display = "none";
      }
    } else {
      // Se nem o menu normal nem o de emergência existirem, criar um menu de emergência
      createEmergencyMenu();
      const newOverlay = document.getElementById("game-menu-overlay-emergency");
      if (newOverlay) newOverlay.style.display = "flex";
    }
  }
});

// Add a highly visible menu button that's always available
function addEmergencyMenuButton() {
  console.log("Adding emergency menu button");

  // Check if button already exists to avoid duplicates
  if (document.getElementById("emergency-menu-button")) {
    return;
  }

  const emergencyButton = document.createElement("button");
  emergencyButton.id = "emergency-menu-button";
  emergencyButton.textContent = "MENU (ESC)";
  emergencyButton.style.position = "fixed";
  emergencyButton.style.top = "10px";
  emergencyButton.style.left = "10px";
  emergencyButton.style.zIndex = "99999999"; // Ultra high z-index
  emergencyButton.style.backgroundColor = "#ff5500";
  emergencyButton.style.color = "white";
  emergencyButton.style.border = "3px solid white";
  emergencyButton.style.borderRadius = "5px";
  emergencyButton.style.padding = "8px 15px";
  emergencyButton.style.fontWeight = "bold";
  emergencyButton.style.fontSize = "14px";
  emergencyButton.style.cursor = "pointer";
  emergencyButton.style.boxShadow = "0 0 10px rgba(0,0,0,0.5)";

  // Add pulsing animation to make it obvious
  emergencyButton.style.animation = "pulse 2s infinite";
  const styleElement = document.createElement("style");
  styleElement.textContent = `
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.1); }
      100% { transform: scale(1); }
    }
  `;
  document.head.appendChild(styleElement);

  // Add click event to open menu
  emergencyButton.addEventListener("click", function () {
    console.log("Emergency menu button clicked");
    openAnyAvailableMenu();
  });

  // Add to the document body with highest priority
  document.body.insertBefore(emergencyButton, document.body.firstChild);

  // Auto-hide after 5 seconds if menu is working
  setTimeout(function () {
    const regularMenuVisible =
      document.getElementById("game-menu-button") &&
      window.getComputedStyle(document.getElementById("game-menu-button"))
        .display !== "none";
    if (regularMenuVisible) {
      emergencyButton.style.display = "none";
    }
  }, 5000);
}

// Function to ensure some menu opens, trying all possible approaches
function openAnyAvailableMenu() {
  console.log("Attempting to open any available menu");

  // Try method 1: Using gameMenu global object
  if (window.gameMenu && typeof window.gameMenu.open === "function") {
    console.log("Opening menu using gameMenu.open()");
    try {
      window.gameMenu.open();
      return;
    } catch (e) {
      console.error("Error using gameMenu.open():", e);
    }
  }

  // Try method 2: Looking for standard menu overlay
  const menuOverlay = document.getElementById("game-menu-overlay");
  if (menuOverlay) {
    console.log("Found standard menu overlay, showing it");
    menuOverlay.style.display = "flex";
    return;
  }

  // Try method 3: Looking for emergency menu overlay
  const emergencyOverlay = document.getElementById(
    "game-menu-overlay-emergency"
  );
  if (emergencyOverlay) {
    console.log("Found emergency menu overlay, showing it");
    emergencyOverlay.style.display = "flex";
    return;
  }

  // Method 4: Create a new emergency menu as last resort
  console.log("No menu found, creating emergency menu");
  createEmergencyMenu();

  // Show the newly created emergency menu
  const newEmergencyOverlay = document.getElementById(
    "game-menu-overlay-emergency"
  );
  if (newEmergencyOverlay) {
    newEmergencyOverlay.style.display = "flex";
  }
}

// Replace the previous ESC key handler with this more robust version
function setupEscKeyHandler() {
  // Remove any existing handlers to avoid conflicts
  document.removeEventListener("keydown", escKeyHandler);

  // Add our handler with high priority
  document.addEventListener("keydown", escKeyHandler, true);

  // Also add to window for redundancy
  window.removeEventListener("keydown", escKeyHandler);
  window.addEventListener("keydown", escKeyHandler, true);

  console.log("ESC key handler set up with high priority");
}

// The ESC key handler function
function escKeyHandler(event) {
  if (event.key === "Escape") {
    console.log("ESC key pressed - high priority handler");
    event.preventDefault(); // Prevent other handlers
    event.stopPropagation(); // Stop event propagation

    openAnyAvailableMenu();
    return false;
  }
}

// Enhanced function to load the menu script with better error handling
function loadMenuScriptEnhanced(retryCount = 0) {
  console.log(`Attempting to load menu script (attempt ${retryCount + 1})`);

  // List of possible paths to try
  const possiblePaths = [
    "src/fase1/menu.js",
    "menu.js",
    "./menu.js",
    "../menu.js",
    "../../menu.js",
    "/src/fase1/menu.js",
    "../fase1/menu.js",
  ];

  // If we've exhausted our retry attempts, create emergency menu
  if (retryCount >= possiblePaths.length) {
    console.error("Failed to load menu.js after multiple attempts");
    console.log("Creating emergency menu instead");
    createEmergencyMenu();
    setupEscKeyHandler();
    addEmergencyMenuButton();
    return;
  }

  const path = possiblePaths[retryCount];
  console.log(`Trying to load menu from path: ${path}`);

  const script = document.createElement("script");
  script.src = path;

  script.onload = function () {
    console.log(`Successfully loaded menu script from ${path}`);

    // Initialize the menu if the function exists
    if (typeof window.initGameMenu === "function") {
      console.log("Initializing game menu");
      window.initGameMenu();
    } else {
      console.warn("initGameMenu function not found in loaded script");
      createEmergencyMenu();
    }

    // Set up ESC key handler as backup
    setupEscKeyHandler();
  };

  script.onerror = function () {
    console.warn(`Failed to load menu from ${path}, trying next path`);
    // Try the next path
    loadMenuScriptEnhanced(retryCount + 1);
  };

  document.head.appendChild(script);
}

// Execute on page load
window.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded, setting up menu systems");

  // Try to load the menu script
  loadMenuScriptEnhanced();

  // Add emergency menu button
  addEmergencyMenuButton();

  // Set up ESC key handler
  setupEscKeyHandler();

  // Also set up a delayed check to ensure menu is working
  setTimeout(function () {
    const menuButton = document.getElementById("game-menu-button");
    const emergencyMenuButton = document.getElementById(
      "game-menu-button-emergency"
    );

    if (!menuButton && !emergencyMenuButton) {
      console.warn("No menu button found after delay, creating emergency menu");
      createEmergencyMenu();
    }
  }, 3000);
});

// Make sure this runs immediately without waiting for any event
(function immediateInit() {
  console.log("Running immediate menu initialization");
  // Add an extreme fallback ESC key handler
  document.addEventListener(
    "keyup",
    function (event) {
      if (event.key === "Escape") {
        console.log("ESC key detected on keyup event");
        openAnyAvailableMenu();
      }
    },
    true
  );
})();
