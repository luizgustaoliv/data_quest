// Função para carregar o CSS dinamicamente
function carregarCSS() {
  // Ocultar o corpo inicialmente
  document.body.style.visibility = "hidden";

  // Contador para rastrear carregamentos de CSS
  let cssCarregados = 0;
  const totalCSS = 2;

  // Função para verificar se todos os CSS foram carregados
  function verificarCarregamento() {
    cssCarregados++;
    if (cssCarregados >= totalCSS) {
      // Todos os CSS foram carregados, mostrar o conteúdo
      document.body.style.visibility = "visible";
    }
  }

  // Adicionar o CSS principal com evento de carregamento
  const linkCSS = document.createElement("link");
  linkCSS.rel = "stylesheet";
  linkCSS.href = "assets/telainicial/style.css";
  linkCSS.onload = verificarCarregamento;
  document.head.appendChild(linkCSS);

  // Adicionar a fonte do Google com evento de carregamento
  const fontLink = document.createElement("link");
  fontLink.rel = "stylesheet";
  fontLink.href =
    "https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap";
  fontLink.onload = verificarCarregamento;
  document.head.appendChild(fontLink);

  // Backup: Se os CSS não carregarem em 1 segundo, mostrar o conteúdo de qualquer forma
  setTimeout(() => {
    document.body.style.visibility = "visible";
  }, 1000);
}

// Função para criar todos os elementos da interface
function criarInterface() {
  // Container do título com a logo
  const title = document.createElement("div");
  title.className = "title";

  const logo = document.createElement("img");
  logo.className = "logo";
  logo.src = "assets/loading/logo_data_quest.png";

  title.appendChild(logo);
  document.body.appendChild(title);

  // Container dos botões
  const botoes = document.createElement("div");
  botoes.className = "botoes";

  // Botão Jogar
  const botaoJogar = document.createElement("img");
  botaoJogar.id = "botaoJogar";
  botaoJogar.className = "botaojogar";
  botaoJogar.src = "assets/telainicial/botoes/botaostart.png";
  botaoJogar.alt = "Jogar";

  // Botão Como Jogar
  const botaoComoJogar = document.createElement("img");
  botaoComoJogar.id = "botaocomojogar";
  botaoComoJogar.className = "botaocomojogar";
  botaoComoJogar.src = "assets/telainicial/botoes/comojogar.png";
  botaoComoJogar.alt = "comojogar";

  // Botão Sobre
  const botaoSobre = document.createElement("img");
  botaoSobre.id = "botaosobre";
  botaoSobre.className = "botaosobre";
  botaoSobre.src = "assets/telainicial/botoes/botaosobre.png";
  botaoSobre.alt = "Sobre";

  // Adiciona os botões ao container
  botoes.appendChild(botaoJogar);
  botoes.appendChild(botaoComoJogar);
  botoes.appendChild(botaoSobre);
  document.body.appendChild(botoes);

  // Popup Como Jogar
  const popupComoJogar = document.createElement("div");
  popupComoJogar.id = "popup-como-jogar";
  popupComoJogar.className = "popup";

  const popupContentComo = document.createElement("div");
  popupContentComo.className = "popup-content";

  const closeSpanComo = document.createElement("span");
  closeSpanComo.className = "close";
  closeSpanComo.innerHTML = "&times;";

  const h2Como = document.createElement("h2");
  h2Como.textContent = "Como Jogar";

  const pComo = document.createElement("p");
  pComo.textContent = "Use as setas ou 'WASD' para mover";

  // Controles
  const controlsDiv = document.createElement("div");
  controlsDiv.className = "controls";

  // Seção WASD
  const wasdDiv = document.createElement("div");
  wasdDiv.className = "wasd";

  const keyW = document.createElement("div");
  keyW.className = "key";
  keyW.id = "key-w";
  keyW.textContent = "W";

  const rowWasd = document.createElement("div");
  rowWasd.className = "row";

  const keyA = document.createElement("div");
  keyA.className = "key";
  keyA.id = "key-a";
  keyA.textContent = "A";

  const keyS = document.createElement("div");
  keyS.className = "key";
  keyS.id = "key-s";
  keyS.textContent = "S";

  const keyD = document.createElement("div");
  keyD.className = "key";
  keyD.id = "key-d";
  keyD.textContent = "D";

  rowWasd.appendChild(keyA);
  rowWasd.appendChild(keyS);
  rowWasd.appendChild(keyD);

  wasdDiv.appendChild(keyW);
  wasdDiv.appendChild(rowWasd);

  // Seção das setas
  const arrowsDiv = document.createElement("div");
  arrowsDiv.className = "arrows";

  const keyUp = document.createElement("div");
  keyUp.className = "key";
  keyUp.id = "key-up";
  keyUp.innerHTML = "↑";

  const rowArrows = document.createElement("div");
  rowArrows.className = "row";

  const keyLeft = document.createElement("div");
  keyLeft.className = "key";
  keyLeft.id = "key-left";
  keyLeft.innerHTML = "←";

  const keyDown = document.createElement("div");
  keyDown.className = "key";
  keyDown.id = "key-down";
  keyDown.innerHTML = "↓";

  const keyRight = document.createElement("div");
  keyRight.className = "key";
  keyRight.id = "key-right";
  keyRight.innerHTML = "→";

  rowArrows.appendChild(keyLeft);
  rowArrows.appendChild(keyDown);
  rowArrows.appendChild(keyRight);

  arrowsDiv.appendChild(keyUp);
  arrowsDiv.appendChild(rowArrows);

  controlsDiv.appendChild(wasdDiv);
  controlsDiv.appendChild(arrowsDiv);

  // Seção de Interações
  const h2Interacao = document.createElement("h2");
  h2Interacao.textContent = "Interações";

  const interactionContainer = document.createElement("div");
  interactionContainer.className = "interaction-container";

  // Item 1
  const interactionItem1 = document.createElement("div");
  interactionItem1.className = "interaction-item";

  const p1 = document.createElement("p");
  p1.innerHTML = "Pressione <b>E</b><br>para NPCs";

  const interaction1 = document.createElement("div");
  interaction1.className = "interaction";

  const keyE = document.createElement("div");
  keyE.className = "key";
  keyE.id = "key-e";
  keyE.textContent = "E";

  interaction1.appendChild(keyE);
  interactionItem1.appendChild(p1);
  interactionItem1.appendChild(interaction1);

  // Item 2
  const interactionItem2 = document.createElement("div");
  interactionItem2.className = "interaction-item";

  const p2 = document.createElement("p");
  p2.innerHTML = "Pressione <b>ESPAÇO</b><br>para portas";

  const interaction2 = document.createElement("div");
  interaction2.className = "interaction";

  const keySpace = document.createElement("div");
  keySpace.className = "key";
  keySpace.id = "key-space";
  keySpace.textContent = "SPC";

  interaction2.appendChild(keySpace);
  interactionItem2.appendChild(p2);
  interactionItem2.appendChild(interaction2);

  interactionContainer.appendChild(interactionItem1);
  interactionContainer.appendChild(interactionItem2);

  // Montagem do popup Como Jogar
  popupContentComo.appendChild(closeSpanComo);
  popupContentComo.appendChild(h2Como);
  popupContentComo.appendChild(pComo);
  popupContentComo.appendChild(controlsDiv);
  popupContentComo.appendChild(h2Interacao);
  popupContentComo.appendChild(interactionContainer);

  popupComoJogar.appendChild(popupContentComo);
  document.body.appendChild(popupComoJogar);

  // Popup Sobre
  const popupSobre = document.createElement("div");
  popupSobre.id = "popup-sobre";
  popupSobre.className = "popup";

  const popupContentSobre = document.createElement("div");
  popupContentSobre.className = "popup-content";

  const closeSpanSobre = document.createElement("span");
  closeSpanSobre.className = "close";
  closeSpanSobre.innerHTML = "&times;";

  const h2Sobre = document.createElement("h2");
  h2Sobre.textContent = "Sobre o Jogo";

  const pSobre = document.createElement("p");
  pSobre.innerHTML =
    "Jogo criado em parceria com a <b>Google for Education</b>";

  const h3Desenvolvedores = document.createElement("h3");
  h3Desenvolvedores.textContent = "Desenvolvedores:";

  const pDesenvolvedores = document.createElement("p");
  pDesenvolvedores.textContent =
    "André Katz, Celso Rocha, Daniel Meiches, Kaian Santos, Luiz Fernando, Miguel Almeida, Wendel";

  // Montagem do popup Sobre
  popupContentSobre.appendChild(closeSpanSobre);
  popupContentSobre.appendChild(h2Sobre);
  popupContentSobre.appendChild(pSobre);
  popupContentSobre.appendChild(h3Desenvolvedores);
  popupContentSobre.appendChild(pDesenvolvedores);

  popupSobre.appendChild(popupContentSobre);
  document.body.appendChild(popupSobre);
}

// Função para carregar e reproduzir sons - versão melhorada
function carregarSom(caminhoArquivo, volume = 1.0, loop = false) {
  console.log(`Tentando carregar áudio: ${caminhoArquivo}`);

  try {
    const audio = new Audio();

    // Manipular erros de carga do áudio
    audio.addEventListener("error", (e) => {
      console.error(`Erro ao carregar o áudio ${caminhoArquivo}:`, e);
      console.error(
        `Código de erro: ${audio.error ? audio.error.code : "desconhecido"}`
      );
      console.error(
        `Mensagem: ${audio.error ? audio.error.message : "desconhecido"}`
      );
    });

    // Log quando áudio estiver pronto
    audio.addEventListener("canplaythrough", () => {
      console.log(`Áudio ${caminhoArquivo} carregado e pronto para reprodução`);
    });

    audio.volume = volume;
    audio.loop = loop;
    audio.src = caminhoArquivo;

    // Pré-carregar o áudio
    audio.load();

    return {
      elemento: audio,
      reproduzir: function () {
        console.log(`Tentando reproduzir: ${caminhoArquivo}`);
        // Promessa para lidar melhor com a reprodução
        const playPromise = audio.play();

        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log(`Reproduzindo ${caminhoArquivo} com sucesso`);
            })
            .catch((e) => {
              console.error(`Erro ao reproduzir ${caminhoArquivo}:`, e);
              // Tentativa de contornar o bloqueio de autoplay
              if (e.name === "NotAllowedError") {
                console.warn(
                  "Reprodução automática bloqueada pelo navegador. Necessária interação do usuário."
                );
              }
            });
        }
      },
      pausar: function () {
        audio.pause();
      },
      parar: function () {
        audio.pause();
        audio.currentTime = 0;
      },
      definirVolume: function (novoVolume) {
        audio.volume = Math.max(0, Math.min(1, novoVolume));
      },
      definirLoop: function (estadoLoop) {
        audio.loop = estadoLoop;
      },
      // Verificar se o áudio está pronto
      estaPronto: function () {
        return audio.readyState >= 3; // HAVE_FUTURE_DATA ou HAVE_ENOUGH_DATA
      },
    };
  } catch (error) {
    console.error(
      `Exceção ao criar objeto de áudio para ${caminhoArquivo}:`,
      error
    );
    // Retornar um objeto nulo que não faz nada quando chamado
    return {
      elemento: null,
      reproduzir: () =>
        console.warn(`Áudio ${caminhoArquivo} não pode ser reproduzido`),
      pausar: () => {},
      parar: () => {},
      definirVolume: () => {},
      definirLoop: () => {},
      estaPronto: () => false,
    };
  }
}

// Variáveis para os sons
let somDeFundo;
let somClique;
let audioInicializado = false;

// Função para inicializar os sons
function inicializarSons() {
  console.log("Inicializando sistema de áudio...");

  try {
    // Verificar suporte a áudio
    if (typeof Audio !== "function") {
      console.error("Este navegador não suporta o objeto Audio!");
      return;
    }

    // Método alternativo usando o Web Audio API quando disponível
    if (window.AudioContext || window.webkitAudioContext) {
      console.log("Web Audio API disponível - usando método alternativo");
      const AudioContextClass =
        window.AudioContext || window.webkitAudioContext;
      window.audioContext = new AudioContextClass();
    }

    // Carrega o som de fundo com volume mais baixo e em loop
    somDeFundo = carregarSom("assets/trilhasonora/telainicial.mp3", 0.3, true);

    // Carrega o som para cliques nos botões
    somClique = carregarSom("assets/trilhasonora/buttonclick.mp3", 0.5);

    // Adicionamos uma verificação para arquivos específicos usando fetch
    fetch("assets/trilhasonora/telainicial.mp3")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        console.log("Arquivo de música encontrado!");
      })
      .catch((e) => {
        console.error("Erro ao verificar arquivo de música:", e);
        console.log("Tente estes caminhos alternativos:");
        console.log("- 'assets/sons/telainicial.mp3'");
        console.log("- 'assets/audio/telainicial.mp3'");
        console.log("- '/assets/trilhasonora/telainicial.mp3'");
      });

    // Criar botão de controle de som
    criarBotaoSom();
  } catch (error) {
    console.error("Erro na inicialização de áudio:", error);
  }
}

// Função para criar botão de controle de som
function criarBotaoSom() {
  const botaoSom = document.createElement("div");
  botaoSom.id = "botao-som";
  botaoSom.className = "botao-som";
  botaoSom.innerHTML = "🔊"; // Ícone de som ativo
  botaoSom.style.position = "fixed";
  botaoSom.style.bottom = "20px";
  botaoSom.style.right = "20px";
  botaoSom.style.width = "40px";
  botaoSom.style.height = "40px";
  botaoSom.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
  botaoSom.style.color = "white";
  botaoSom.style.borderRadius = "50%";
  botaoSom.style.display = "flex";
  botaoSom.style.justifyContent = "center";
  botaoSom.style.alignItems = "center";
  botaoSom.style.cursor = "pointer";
  botaoSom.style.fontSize = "20px";
  botaoSom.style.zIndex = "1000";

  // Estado de mudo
  let mudo = false;

  // Função para alternar som
  botaoSom.addEventListener("click", function () {
    if (!audioInicializado) {
      // Primeira interação - iniciar áudio
      console.log("Primeira interação do usuário, iniciando áudio");
      if (somDeFundo) {
        somDeFundo.reproduzir();
      }
      audioInicializado = true;
    }

    // Alternar estado de mudo
    mudo = !mudo;

    if (mudo) {
      // Mutar som
      if (somDeFundo) somDeFundo.definirVolume(0);
      if (somClique) somClique.definirVolume(0);
      botaoSom.innerHTML = "🔇"; // Ícone de mudo
    } else {
      // Ativar som
      if (somDeFundo) somDeFundo.definirVolume(0.3);
      if (somClique) somClique.definirVolume(0.5);
      botaoSom.innerHTML = "🔊"; // Ícone de som ativo
    }
  });

  document.body.appendChild(botaoSom);
}

// Nova função para criar e mostrar uma tela de permissão de áudio
function mostrarTelaPermissaoAudio() {
  // Criar overlay para tela de permissão
  const permissaoOverlay = document.createElement("div");
  permissaoOverlay.id = "permissao-audio-overlay";
  permissaoOverlay.style.position = "fixed";
  permissaoOverlay.style.top = "0";
  permissaoOverlay.style.left = "0";
  permissaoOverlay.style.width = "100%";
  permissaoOverlay.style.height = "100%";
  permissaoOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
  permissaoOverlay.style.display = "flex";
  permissaoOverlay.style.flexDirection = "column";
  permissaoOverlay.style.justifyContent = "center";
  permissaoOverlay.style.alignItems = "center";
  permissaoOverlay.style.zIndex = "9999";
  permissaoOverlay.style.textAlign = "center";
  permissaoOverlay.style.color = "white";
  permissaoOverlay.style.fontFamily = "'Press Start 2P', cursive";

  // Adicionar logo
  const logo = document.createElement("img");
  logo.src = "assets/loading/logo_data_quest.png";
  logo.style.maxWidth = "300px";
  logo.style.marginBottom = "30px";

  // Texto explicativo
  const texto = document.createElement("p");
  texto.textContent = "Este jogo contém áudio";
  texto.style.marginBottom = "20px";
  texto.style.fontSize = "16px";

  // Botão para ativar áudio
  const botaoAtivar = document.createElement("button");
  botaoAtivar.textContent = "INICIAR COM ÁUDIO";
  botaoAtivar.style.backgroundColor = "#4CAF50";
  botaoAtivar.style.border = "none";
  botaoAtivar.style.color = "white";
  botaoAtivar.style.padding = "15px 30px";
  botaoAtivar.style.margin = "10px";
  botaoAtivar.style.cursor = "pointer";
  botaoAtivar.style.fontSize = "16px";
  botaoAtivar.style.fontFamily = "'Press Start 2P', cursive";

  // Botão para iniciar sem áudio
  const botaoSemAudio = document.createElement("button");
  botaoSemAudio.textContent = "INICIAR SEM ÁUDIO";
  botaoSemAudio.style.backgroundColor = "#555555";
  botaoSemAudio.style.border = "none";
  botaoSemAudio.style.color = "white";
  botaoSemAudio.style.padding = "10px 20px";
  botaoSemAudio.style.margin = "10px";
  botaoSemAudio.style.cursor = "pointer";
  botaoSemAudio.style.fontSize = "12px";
  botaoSemAudio.style.fontFamily = "'Press Start 2P', cursive";

  // Adicionar elementos ao overlay
  permissaoOverlay.appendChild(logo);
  permissaoOverlay.appendChild(texto);
  permissaoOverlay.appendChild(botaoAtivar);
  permissaoOverlay.appendChild(botaoSemAudio);

  // Iniciar com áudio
  botaoAtivar.addEventListener("click", function () {
    // Desbloquear áudio com um som silencioso
    const audioDesbloqueio = new Audio();
    audioDesbloqueio.src =
      "data:audio/mp3;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTGFTb25vdGhlcXVlLm9yZwBURU5DAAAAHQAAA1N3aXRjaCBQbHVzIMKpIE5DSCBTb2Z0d2FyZQBUSVQyAAAABgAAAzIyMzUAVFNTRQAAAA8AAANMYXZmNTcuODMuMTAwAAAAAAAAAAAAAAD/80DEAAAAA0gAAAAATEFNRTMuMTAwVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQsRbAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQMSkAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV";

    // Quando o áudio de desbloqueio estiver pronto, iniciamos outros sons
    audioDesbloqueio.addEventListener("canplaythrough", function () {
      audioDesbloqueio
        .play()
        .then(() => {
          audioInicializado = true;

          // Iniciar nossos áudios do jogo após interação explícita
          if (somDeFundo) {
            somDeFundo.reproduzir();
          }

          // Remover o overlay e mostrar o jogo
          document.body.removeChild(permissaoOverlay);
          document.body.style.visibility = "visible"; // Garantir que o corpo seja visível

          // Continuar com a inicialização normal
          inicializarJogo();
        })
        .catch((error) => {
          console.error("Erro ao desbloquear áudio:", error);
          // Mesmo com erro, continuamos com o jogo
          document.body.removeChild(permissaoOverlay);
          document.body.style.visibility = "visible";
          inicializarJogo();
        });
    });

    audioDesbloqueio.load();
  });

  // Iniciar sem áudio
  botaoSemAudio.addEventListener("click", function () {
    document.body.removeChild(permissaoOverlay);
    document.body.style.visibility = "visible";
    // Desativamos o sistema de áudio
    audioInicializado = false;
    inicializarJogo();
  });

  // Ocultar o corpo para mostrar apenas a tela de permissão
  document.body.style.visibility = "hidden";
  document.body.appendChild(permissaoOverlay);
}

// Função para inicializar o jogo após decisão de áudio
function inicializarJogo() {
  carregarCSS();
  criarInterface();
  configurarEventos();
  animarTeclas();
  animarTeclaE();
  animarTeclaInteracao();
}

// Configuração dos eventos
function configurarEventos() {
  const botaoJogar = document.getElementById("botaoJogar");
  const botaoComoJogar = document.getElementById("botaocomojogar");
  const botaoSobre = document.getElementById("botaosobre");
  const closeSpanComo = document.querySelector("#popup-como-jogar .close");
  const closeSpanSobre = document.querySelector("#popup-sobre .close");

  if (botaoJogar) {
    botaoJogar.addEventListener("click", function () {
      if (audioInicializado && somClique) somClique.reproduzir();
      document.body.classList.add("zoom-effect");

      setTimeout(() => {
        document.body.innerHTML = '<div id="game-container"></div>';
        document.body.classList.remove("zoom-effect");
        document.body.style.margin = "0";
        document.body.style.padding = "0";
        document.body.style.overflow = "hidden";

        carregarScriptFases(); // Chama a função para carregar o script de fases
      }, 1800);
    });

    botaoJogar.addEventListener("mousedown", function () {
      this.src = "assets/telainicial/botoes/botaostartpress.png";
    });

    botaoJogar.addEventListener("mouseup", function () {
      this.src = "assets/telainicial/botoes/botaostart.png";
    });
  }

  if (botaoComoJogar) {
    botaoComoJogar.addEventListener("click", function () {
      if (audioInicializado && somClique) somClique.reproduzir();
      abrirPopup();
    });

    botaoComoJogar.addEventListener("mousedown", function () {
      this.src = "assets/telainicial/botoes/comojogarpress.png";
    });

    botaoComoJogar.addEventListener("mouseup", function () {
      this.src = "assets/telainicial/botoes/comojogar.png";
    });
  }

  if (botaoSobre) {
    botaoSobre.addEventListener("click", function () {
      if (audioInicializado && somClique) somClique.reproduzir();
      abrirPopupSobre();
    });

    botaoSobre.addEventListener("mousedown", function () {
      this.src = "assets/telainicial/botoes/botaosobrepress.png";
    });

    botaoSobre.addEventListener("mouseup", function () {
      this.src = "assets/telainicial/botoes/botaosobre.png";
    });
  }

  if (closeSpanComo) {
    closeSpanComo.addEventListener("click", fecharPopup);
  }

  if (closeSpanSobre) {
    closeSpanSobre.addEventListener("click", fecharPopupSobre);
  }
}

// Funções existentes do script original
function selecionarFase(fase) {
  alert("Você selecionou a Fase " + fase);
}

function abrirPopup() {
  document.getElementById("popup-como-jogar").style.display = "flex";
}

function animarTeclas() {
  let keys = [
    "key-w",
    "key-a",
    "key-s",
    "key-d",
    "key-up",
    "key-left",
    "key-down",
    "key-right",
  ];
  let i = 0;

  const intervalId = setInterval(() => {
    // Verificar se ainda existem os elementos antes de manipulá-los
    if (!document.getElementById(keys[0])) {
      // Se os elementos não existirem mais, parar o intervalo
      clearInterval(intervalId);
      return;
    }

    keys.forEach((key) => {
      const element = document.getElementById(key);
      if (element) {
        element.classList.remove("animate");
      }
    });

    const currentElement = document.getElementById(keys[i]);
    if (currentElement) {
      currentElement.classList.add("animate");
    }

    i = (i + 1) % keys.length;
  }, 500);
}

function animarTeclaE() {
  let key = document.getElementById("key-e");
  setInterval(() => {
    key.classList.toggle("animate");
  }, 500);
}

function animarTeclaInteracao() {
  let interactionKeys = ["key-e", "key-space"];
  let j = 0;

  const intervalId = setInterval(() => {
    // Verificar se os elementos ainda existem
    if (
      !document.getElementById(interactionKeys[0]) &&
      !document.getElementById(interactionKeys[1])
    ) {
      clearInterval(intervalId);
      return;
    }

    interactionKeys.forEach((key) => {
      const keyElement = document.getElementById(key);
      if (keyElement) {
        keyElement.classList.remove("animate");
      }
    });

    const currentElement = document.getElementById(interactionKeys[j]);
    if (currentElement) {
      currentElement.classList.add("animate");
    }

    j = (j + 1) % interactionKeys.length;
  }, 1500);
}

function fecharPopup() {
  document.getElementById("popup-como-jogar").style.display = "none";
}

function fecharPopupSobre() {
  document.getElementById("popup-sobre").style.display = "none";
}

function abrirPopupSobre() {
  document.getElementById("popup-sobre").style.display = "block";
}

// Função para carregar o script de fases dinamicamente
function carregarScriptFases() {
  const script = document.createElement("script");
  script.src = "src/teladefases/fases.js";
  script.type = "module"; // Adiciona o tipo de módulo para permitir importações

  script.onerror = function () {
    console.error("Erro ao carregar o script de fases.");
    alert("Não foi possível carregar a tela de fases. Tente novamente.");
    location.reload();
  };

  script.onload = function () {
    console.log("Script de fases carregado com sucesso!");
    if (typeof construirPagina === "function") {
      construirPagina();
    } else {
      console.error("Função construirPagina não encontrada");
    }
  };

  document.head.appendChild(script);
}

// Modificar inicialização da página
document.addEventListener("DOMContentLoaded", function () {
  // Carregamos os sons primeiro (mas não reproduzimos ainda)
  inicializarSons();

  // Mostrar tela de permissão de áudio em vez de inicializar diretamente
  mostrarTelaPermissaoAudio();
});
